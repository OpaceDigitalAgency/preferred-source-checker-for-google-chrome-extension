#!/usr/bin/env node
/*
 * Dev-only test harness (NOT shipped). Exercises the pure modules outside
 * the extension: eligibility (spec §7.2 items 1-6), the detector against
 * fake-DOM equivalents of fixtures F1-F9 (items 7-13), checklist derivation
 * (§2.2.4) and history CSV (§2.5). Run: node tools/run-tests.mjs
 */

import { analyse } from '../lib/eligibility.js';
import { deriveChecklist } from '../lib/render.js';
import { createHistory } from '../lib/history.js';
import { STRINGS, fmt } from '../lib/strings.js';
import '../lib/detector.js';

const { runDetector } = globalThis.__PSC_DETECTOR__;

let pass = 0;
let fail = 0;
const failures = [];

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { pass++; console.log(`PASS  ${name}`); }
  else {
    fail++;
    failures.push(name);
    console.log(`FAIL  ${name}\n      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`);
  }
}

/* ================= Fake DOM ================= */

class FakeEl {
  constructor(tag, attrs = {}, children = [], text = '') {
    this.tagName = tag.toUpperCase();
    this._tag = tag.toLowerCase();
    this._attrs = attrs;
    this.children = children;
    this.textContent = text;
    this.style = attrs.style || '';
  }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this._attrs, name) ? this._attrs[name] : null;
  }
  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this._attrs, name);
  }
  getBoundingClientRect() {
    if (/display\s*:\s*none/.test(this.style)) return { width: 0, height: 0 };
    return { width: 24, height: 24 };
  }
  querySelectorAll(selector) {
    const out = [];
    const walk = (el) => {
      for (const child of el.children) {
        if (matches(child, selector)) out.push(child);
        walk(child);
      }
    };
    walk(this);
    return out;
  }
}

function matches(el, selectorList) {
  return selectorList.split(',').some((sel) => {
    sel = sel.trim();
    const tagMatch = /^[a-z]+/i.exec(sel);
    if (tagMatch && el._tag !== tagMatch[0].toLowerCase()) return false;
    const attrRe = /\[([^\]=*]+)(\*?=)?"?([^"\]]*)"?\]/g;
    let m;
    while ((m = attrRe.exec(sel)) !== null) {
      const [, name, op, value] = m;
      const actual = el.getAttribute(name.trim());
      if (op === '=') { if (actual !== value) return false; }
      else if (op === '*=') { if (actual === null || actual.indexOf(value) === -1) return false; }
      else if (actual === null) return false;
    }
    return true;
  });
}

function fakeDocument(host, children) {
  const root = new FakeEl('html', {}, children);
  return {
    baseURI: `https://${host}/`,
    location: { hostname: host, href: `https://${host}/` },
    defaultView: {
      getComputedStyle(el) {
        return {
          display: /display\s*:\s*none/.test(el.style) ? 'none' : 'block',
          visibility: /visibility\s*:\s*hidden/.test(el.style) ? 'hidden' : 'visible'
        };
      }
    },
    querySelectorAll: (sel) => root.querySelectorAll(sel)
  };
}

const SDK = 'https://news.google.com/swg/js/v1/publisher.js';
const SDK_MJS = 'https://news.google.com/swg/js/v1/publisher.mjs';

/* ================= Eligibility (§7.2 items 1-6) ================= */

console.log('\n--- Eligibility ---');

let r = analyse('https://www.example.com/');
check('AC1 www apex → E1', [r.state, r.displayDomain, r.apex, r.isWww], ['E1', 'example.com', 'example.com', true]);

r = analyse('https://example.com/about');
check('bare apex → E1, no www', [r.state, r.displayDomain, r.isWww], ['E1', 'example.com', false]);

r = analyse('https://news.example.com/');
check('AC2 subdomain → E2, full host as displayDomain', [r.state, r.displayDomain], ['E2', 'news.example.com']);

r = analyse('https://www.example.com/blog/sample-post/');
check('AC3 /blog path → E3 with segment', [r.state, r.subdirSegment, r.displayDomain], ['E3', 'blog', 'example.com']);

r = analyse('https://code.example.com/news/latest');
check('subdomain + /news → E4', [r.state, r.subdirSegment], ['E4', 'news']);

r = analyse('https://www.bbc.co.uk/');
check('AC4 .co.uk PSL → apex bbc.co.uk', [r.state, r.displayDomain, r.apex], ['E1', 'bbc.co.uk', 'bbc.co.uk']);

r = analyse('https://blog.guardian.co.uk/');
check('PSL subdomain → E2 blog.guardian.co.uk', [r.state, r.displayDomain, r.apex], ['E2', 'blog.guardian.co.uk', 'guardian.co.uk']);

r = analyse('http://localhost:8080/');
check('AC5a localhost → E5', r.state, 'E5');

r = analyse('http://192.168.1.10/admin');
check('AC5b IPv4 → E5', r.state, 'E5');

r = analyse('https://www.example.com/blogging/tips');
check('AC6 "blogging" not a trigger → E1', [r.state, r.subdirSegment], ['E1', null]);

r = analyse('chrome://extensions');
check('chrome:// → E6', r.state, 'E6');

r = analyse('not a url');
check('unparseable → E6', r.state, 'E6');

/* ================= Detector + derivation (items 7-13) ================= */

console.log('\n--- Detector + checklist derivation ---');

const eligLocal = analyse('https://fixture.example.com/');

// F1 — auto mode, themed button, matching deeplink, iframe rendered
const f1 = fakeDocument('fixture.example.com', [
  new FakeEl('script', { async: '', src: SDK }),
  new FakeEl('div', { 'google-add-preferred-source-btn': '', 'data-theme': 'dark', 'data-lang': 'en' }, [
    new FakeEl('iframe', { src: 'https://news.google.com/swg/ui/v1/button' })
  ]),
  new FakeEl('a', { href: 'https://www.google.com/preferences/source?q=fixture.example.com' })
]);
let det = runDetector(f1);
check('F1 detector core', [det.ok, det.sdk.present, det.sdk.async, det.mode, det.buttons.count, det.buttons.iframeRendered, det.deeplinks.count, det.deeplinks.qMatchesSite],
  [true, true, true, 'auto', 1, true, 1, true]);
let derived = deriveChecklist(det, eligLocal);
check('AC7 F1 rows all pass + chips + summary', [
  derived.rows.map((x) => x.glyph), derived.summaryKey, derived.chips
], [['ok', 'ok', 'ok', 'ok'], 'implemented', ['theme: dark', 'lang: en', 'SDK: publisher.js']]);

// F1 variant — SDK blocked, iframe not rendered
const f1b = fakeDocument('fixture.example.com', [
  new FakeEl('script', { async: '', src: SDK }),
  new FakeEl('div', { 'google-add-preferred-source-btn': '' }),
  new FakeEl('a', { href: 'https://www.google.com/preferences/source?q=fixture.example.com' })
]);
det = runDetector(f1b);
derived = deriveChecklist(det, eligLocal);
check('F1-blocked → row 3 warn "hasn\'t rendered", partial', [
  derived.rows[2].glyph, derived.rows[2].phrase, derived.summaryKey
], ['warn', fmt(STRINGS.checklist.row3.warnNotRendered, { count: 1 }), 'partial']);

// F2 — manual mode with inline queue, no deeplink
const f2 = fakeDocument('fixture.example.com', [
  new FakeEl('script', { async: '', 'preferred-sources-control': 'manual', src: SDK }),
  new FakeEl('script', {}, [], "(self.PREFERRED_SOURCE = self.PREFERRED_SOURCE || []).push(function(ps){ps.init({});});"),
  new FakeEl('button', { id: 'myButton' })
]);
det = runDetector(f2);
check('F2 detector: manual + queue hint', [det.mode, det.manualQueueHint, det.deeplinks.count], ['manual', true, 0]);
derived = deriveChecklist(det, eligLocal);
check('AC8 F2 rows: manual ok (no note), button n/a, deeplink warn', [
  derived.rows[1].glyph, derived.rows[1].notes.length, derived.rows[2].glyph,
  derived.rows[2].phrase, derived.rows[3].glyph, derived.summaryKey
], ['ok', 0, 'na', STRINGS.checklist.row3.naManual, 'warn', 'implemented']);

// F2 variant — manual without inline queue → amber sub-note
const f2b = fakeDocument('fixture.example.com', [
  new FakeEl('script', { async: '', 'preferred-sources-control': 'manual', src: SDK })
]);
derived = deriveChecklist(runDetector(f2b), eligLocal);
check('F2-noqueue → manual amber sub-note', [derived.rows[1].glyph, derived.rows[1].notes.length, derived.rows[1].notes[0].tone], ['ok', 1, 'warn']);

// F3 — empty page
const f3 = fakeDocument('fixture.example.com', []);
det = runDetector(f3);
derived = deriveChecklist(det, eligLocal);
check('AC9 F3 not implemented; rows 1,3,4 err; generator link', [
  derived.summaryKey, derived.summaryText,
  derived.rows[0].glyph, derived.rows[1].glyph, derived.rows[2].glyph, derived.rows[3].glyph,
  derived.showGenerator
], ['none', STRINGS.checklist.summary.none, 'err', 'na', 'err', 'err', true]);

// F4 — button div without SDK, wrong-domain deeplink
const f4 = fakeDocument('fixture.example.com', [
  new FakeEl('div', { 'google-add-preferred-source-btn': '' }),
  new FakeEl('a', { href: 'https://www.google.com/preferences/source?q=other-domain.com' })
]);
det = runDetector(f4);
derived = deriveChecklist(det, eligLocal);
check('AC10 F4 row3 warn no-SDK; row4 warn wrong q quoted', [
  derived.rows[2].glyph, derived.rows[2].phrase,
  derived.rows[3].glyph, derived.rows[3].phrase, det.deeplinks.qMatchesSite
], ['warn', STRINGS.checklist.row3.warnNoSdk, 'warn',
  fmt(STRINGS.checklist.row4.warnWrongQ, { firstQ: 'other-domain.com' }), false]);

// F5 — hidden button
const f5 = fakeDocument('fixture.example.com', [
  new FakeEl('script', { async: '', src: SDK }),
  new FakeEl('div', { 'google-add-preferred-source-btn': '', style: 'display:none' })
]);
derived = deriveChecklist(runDetector(f5), eligLocal);
check('AC11 F5 row3 warn hidden', [derived.rows[2].glyph, derived.rows[2].phrase], ['warn', STRINGS.checklist.row3.warnHidden]);

// F6 — SDK without async
const f6 = fakeDocument('fixture.example.com', [
  new FakeEl('script', { src: SDK }),
  new FakeEl('div', { 'google-add-preferred-source-btn': '' })
]);
derived = deriveChecklist(runDetector(f6), eligLocal);
check('AC12 F6 row1 warn missing async', [derived.rows[0].glyph, derived.rows[0].phrase], ['warn', STRINGS.checklist.row1.warnNoAsync]);

// F9 — publisher.mjs
const f9 = fakeDocument('fixture.example.com', [
  new FakeEl('script', { async: '', type: 'module', src: SDK_MJS }),
  new FakeEl('div', { 'google-add-preferred-source-btn': '' })
]);
det = runDetector(f9);
derived = deriveChecklist(det, eligLocal);
check('AC13 F9 row1 ok + mjs chip', [derived.rows[0].glyph, derived.chips.includes(STRINGS.checklist.chips.sdkMjs)], ['ok', true]);

// Mixed mode — two SDK tags with conflicting control attributes
const fMixed = fakeDocument('fixture.example.com', [
  new FakeEl('script', { async: '', src: SDK }),
  new FakeEl('script', { async: '', 'preferred-sources-control': 'manual', src: SDK })
]);
det = runDetector(fMixed);
derived = deriveChecklist(det, eligLocal);
check('mixed mode → row2 warn conflicting', [det.mode, derived.rows[1].glyph, derived.rows[1].phrase], ['mixed', 'warn', STRINGS.checklist.row2.mixed]);

// Preload-only
const fPreload = fakeDocument('fixture.example.com', [
  new FakeEl('link', { rel: 'preload', href: SDK })
]);
det = runDetector(fPreload);
derived = deriveChecklist(det, eligLocal);
check('preload-only → row1 err preloaded-never-executed', [det.sdk.preloadOnly, derived.rows[0].phrase], [true, STRINGS.checklist.row1.errPreloadOnly]);

// Deeplink-only page
const fDeeplink = fakeDocument('fixture.example.com', [
  new FakeEl('a', { href: 'https://www.google.com/preferences/source?q=fixture.example.com' })
]);
derived = deriveChecklist(runDetector(fDeeplink), eligLocal);
check('deeplink-only summary', [derived.summaryKey, derived.summaryText], ['deeplink-only', STRINGS.checklist.summary.deeplinkOnly]);

// www host: q without www must match
const fWww = fakeDocument('www.example.com', [
  new FakeEl('a', { href: 'https://www.google.com/preferences/source?q=example.com' })
]);
det = runDetector(fWww);
check('www host + bare-apex q → qMatchesSite', det.deeplinks.qMatchesSite, true);

// Non-deeplink google anchor is ignored (wrong path)
const fWrongPath = fakeDocument('fixture.example.com', [
  new FakeEl('a', { href: 'https://www.google.com/preferences/source/extra?q=x' })
]);
check('wrong pathname anchor ignored', runDetector(fWrongPath).deeplinks.count, 0);

/* ================= History (§2.5) ================= */

console.log('\n--- History ---');

function fakeStorageArea() {
  const store = {};
  return {
    async get(key) { return { [key]: store[key] }; },
    async set(obj) { Object.assign(store, obj); },
    async remove(key) { delete store[key]; },
    _store: store
  };
}

const area = fakeStorageArea();
const hist = createHistory('auditHistory', area);
const baseEntry = {
  ts: Date.UTC(2026, 7, 26, 10, 0, 0), host: 'a.example.com', displayDomain: 'a.example.com',
  eligibility: 'E2', summary: 'implemented', mode: 'auto',
  sdk: true, buttonCount: 1, rendered: true, deeplinks: 1
};
await hist.record(baseEntry);
await hist.record({ ...baseEntry, ts: Date.UTC(2026, 7, 26, 12, 0, 0), summary: 'partial' });
await hist.record({ ...baseEntry, ts: Date.UTC(2026, 7, 27, 9, 0, 0), summary: 'none' });
let entries = await hist.list();
check('same host same UTC day overwrites; next day appends', [entries.length, entries[0].summary, entries[1].summary], [2, 'none', 'partial']);

for (let i = 0; i < 210; i++) {
  await hist.record({ ...baseEntry, host: 'h' + i + '.example.com', ts: Date.UTC(2026, 7, 27) + i });
}
entries = await hist.list();
check('cap at 200 entries', entries.length, 200);

const csv = hist.toCsv([baseEntry, { ...baseEntry, host: 'quote"y,host' }]);
check('CSV header', csv.split('\r\n')[0], 'date_iso,host,display_domain,eligibility_state,summary,mode,sdk_present,button_count,rendered,deeplink_count');
check('CSV RFC4180 quoting', csv.split('\r\n')[2].includes('"quote""y,host"'), true);

/* ================= Snippet ================= */

console.log('\n--- Snippet ---');
const snippet = fmt(STRINGS.snippet.template, { displayDomain: 'example.com' });
check('snippet contains SDK line + fallback + domain', [
  snippet.includes('<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>'),
  snippet.includes('<div google-add-preferred-source-btn></div>'),
  snippet.includes('https://www.google.com/preferences/source?q=example.com'),
  snippet.split('\n').length
], [true, true, true, 7]);

/* ================= Result ================= */

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) {
  console.log('Failures: ' + failures.join('; '));
  process.exit(1);
}
