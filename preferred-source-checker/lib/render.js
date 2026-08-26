/*
 * Part of Opace Preferred Source Checker.
 * Presentation layer: EligibilityResult + DetectorResult + strings → DOM.
 * All checklist derivation from spec §2.2.4 lives here (presentation policy).
 * Deliberately free of chrome.* calls — tab opening is delegated through
 * opts.openTab so this file drops into the Essential SEO Toolkit unchanged.
 */

import { STRINGS, URLS, fmt } from './strings.js';

/* ------------------------------------------------------------------ */
/* Pure derivation (exported for tests)                                */
/* ------------------------------------------------------------------ */

/**
 * Derive the four checklist rows, summary and chips from a DetectorResult.
 * @param {object} det DetectorResult (spec §2.2.3)
 * @param {object} elig EligibilityResult (spec §3.4)
 * @returns {{rows: Array, summaryKey: string, summaryText: string,
 *            chips: string[], showGenerator: boolean}}
 */
export function deriveChecklist(det, elig) {
  const C = STRINGS.checklist;
  const displayDomain = (elig && elig.displayDomain) || (det.deeplinks && det.deeplinks.firstQ) || '';
  const rows = [];

  // Row 1 — SDK loaded
  let r1;
  if (det.sdk.present && det.sdk.async) {
    r1 = { glyph: 'ok', phrase: C.row1.okAsync, fix: null };
  } else if (det.sdk.present && !det.sdk.async) {
    r1 = { glyph: 'warn', phrase: C.row1.warnNoAsync, fix: C.row1.warnNoAsyncFix };
  } else if (!det.sdk.present && det.sdk.preloadOnly) {
    r1 = { glyph: 'err', phrase: C.row1.errPreloadOnly, fix: C.row1.errPreloadOnlyFix };
  } else {
    r1 = { glyph: 'err', phrase: C.row1.errAbsent, fix: C.row1.errAbsentFix };
  }
  rows.push({ key: 'sdk', label: C.labels.sdk, notes: [], ...r1 });

  // Row 2 — Mode
  let r2;
  const notes2 = [];
  if (det.mode === 'auto') {
    r2 = { glyph: 'ok', phrase: C.row2.auto, fix: null };
  } else if (det.mode === 'manual') {
    r2 = { glyph: 'ok', phrase: C.row2.manual, fix: null };
    if (!det.manualQueueHint) notes2.push({ tone: 'warn', text: C.row2.manualNoQueueNote });
  } else if (det.mode === 'mixed') {
    r2 = { glyph: 'warn', phrase: C.row2.mixed, fix: C.row2.mixedFix };
  } else {
    r2 = { glyph: 'na', phrase: C.row2.none, fix: C.row2.noneFix };
  }
  rows.push({ key: 'mode', label: C.labels.mode, notes: notes2, ...r2 });

  // Row 3 — Button element present
  let r3;
  const notes3 = [];
  const b = det.buttons;
  const autoLike = det.mode === 'auto' || det.mode === 'mixed';
  if (autoLike) {
    if (b.count > 0 && b.visibleCount === 0) {
      r3 = { glyph: 'warn', phrase: C.row3.warnHidden, fix: C.row3.warnHiddenFix };
    } else if (b.count > 0 && b.iframeRendered) {
      r3 = { glyph: 'ok', phrase: fmt(C.row3.okRendered, { count: b.count }), fix: null };
    } else if (b.count > 0) {
      r3 = { glyph: 'warn', phrase: fmt(C.row3.warnNotRendered, { count: b.count }), fix: C.row3.warnNotRenderedFix };
    } else {
      r3 = { glyph: 'err', phrase: C.row3.errNone, fix: C.row3.errNoneAutoFix };
    }
  } else if (det.mode === 'manual') {
    r3 = { glyph: 'na', phrase: C.row3.naManual, fix: null };
    let note = C.row3.naManualNote;
    if (det.looseIframeCount > 0) note += ' ' + C.row3.naManualIframeNote;
    notes3.push({ tone: 'info', text: note });
  } else { // mode none
    if (b.count > 0) {
      r3 = { glyph: 'warn', phrase: C.row3.warnNoSdk, fix: C.row3.warnNoSdkFix };
    } else {
      r3 = { glyph: 'err', phrase: C.row3.errNone, fix: C.row3.errNoneNoSdkFix };
    }
  }
  rows.push({ key: 'button', label: C.labels.button, notes: notes3, ...r3 });

  // Row 4 — Deeplink fallback present
  let r4;
  const d = det.deeplinks;
  if (d.count > 0 && d.qMatchesSite) {
    r4 = { glyph: 'ok', phrase: fmt(C.row4.ok, { count: d.count }), fix: null };
  } else if (d.count > 0) {
    r4 = {
      glyph: 'warn',
      phrase: fmt(C.row4.warnWrongQ, { firstQ: d.firstQ === null ? '' : d.firstQ }),
      fix: fmt(C.row4.warnWrongQFix, { displayDomain })
    };
  } else if (det.mode !== 'none') {
    r4 = { glyph: 'warn', phrase: C.row4.warnMissing, fix: fmt(C.row4.warnMissingFix, { displayDomain }) };
  } else {
    r4 = { glyph: 'err', phrase: C.row4.errMissing, fix: fmt(C.row4.errMissingFix, { displayDomain }) };
  }
  rows.push({ key: 'deeplink', label: C.labels.deeplink, notes: [], ...r4 });

  // Summary line
  let summaryKey;
  const [row1, row2, row3] = rows;
  if (det.mode === 'none') {
    summaryKey = d.count > 0 ? 'deeplink-only' : 'none';
  } else if (
    (det.mode === 'auto' && row1.glyph === 'ok' && row2.glyph === 'ok' && row3.glyph === 'ok') ||
    (det.mode === 'manual' && row1.glyph === 'ok' && row2.glyph === 'ok')
  ) {
    summaryKey = 'implemented';
  } else {
    summaryKey = 'partial';
  }
  const summaryText = {
    implemented: C.summary.implemented,
    partial: C.summary.partial,
    'deeplink-only': C.summary.deeplinkOnly,
    none: C.summary.none
  }[summaryKey];

  // Chips
  const chips = [];
  if (b.theme) chips.push(fmt(C.chips.theme, { value: b.theme }));
  if (b.lang) chips.push(fmt(C.chips.lang, { value: b.lang }));
  if (det.sdk.present && det.sdk.srcs.length > 0) {
    chips.push(/\.mjs(\?|$)/i.test(det.sdk.srcs[0]) ? C.chips.sdkMjs : C.chips.sdkJs);
  }

  const showGenerator = rows.some((r) => r.glyph === 'warn' || r.glyph === 'err');

  return { rows, summaryKey, summaryText, chips, showGenerator };
}

/* ------------------------------------------------------------------ */
/* DOM helpers                                                         */
/* ------------------------------------------------------------------ */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

const GLYPHS = {
  ok: '<svg viewBox="0 0 16 16" aria-hidden="true" class="psc-glyph psc-glyph-ok"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4.7 8.3l2.2 2.2 4.4-4.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warn: '<svg viewBox="0 0 16 16" aria-hidden="true" class="psc-glyph psc-glyph-warn"><path d="M8 1.8L15 14H1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="12" r="0.9" fill="currentColor"/></svg>',
  err: '<svg viewBox="0 0 16 16" aria-hidden="true" class="psc-glyph psc-glyph-err"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  na: '<svg viewBox="0 0 16 16" aria-hidden="true" class="psc-glyph psc-glyph-na"><path d="M4 8h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  info: '<svg viewBox="0 0 16 16" aria-hidden="true" class="psc-glyph psc-glyph-na"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 7v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="4.8" r="0.9" fill="currentColor"/></svg>',
  compass: '<svg viewBox="0 0 24 24" aria-hidden="true" class="psc-state-icon"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  document: '<svg viewBox="0 0 24 24" aria-hidden="true" class="psc-state-icon"><path d="M6 2.8h8l4 4V21H6z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 2.8v4h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 12h6M9 15.5h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  plug: '<svg viewBox="0 0 24 24" aria-hidden="true" class="psc-state-icon psc-state-icon-warn"><path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 01-5 5 5 5 0 01-5-5zM12 16v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  rescan: '<svg viewBox="0 0 12 12" aria-hidden="true" class="psc-rescan-glyph"><path d="M10.5 6a4.5 4.5 0 11-1.3-3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M9.3 0.8l0.1 2.2-2.2-0.1" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function svg(name) {
  const wrap = document.createElement('span');
  wrap.className = 'psc-glyph-wrap';
  wrap.innerHTML = GLYPHS[name]; // static markup above, no user content
  return wrap;
}

/**
 * Render text that may contain HTML code fragments as textContent, wrapping
 * angle-bracket snippets in <code> for the mono style. Never innerHTML.
 */
function renderRichText(target, text) {
  let rest = String(text);
  while (rest.length > 0) {
    const lt = rest.indexOf('<');
    if (lt === -1) {
      target.appendChild(document.createTextNode(rest));
      break;
    }
    if (lt > 0) target.appendChild(document.createTextNode(rest.slice(0, lt)));
    rest = rest.slice(lt);
    // Determine the extent of the code snippet.
    let end = -1;
    const closers = [
      [/^<script\b/i, '</script>'],
      [/^<noscript>/i, '</noscript>'],
      [/^<a\b/i, '</a>'],
      [/^<div\b[^>]*>\s*<\/div>/i, '</div>']
    ];
    for (const [re, closeTag] of closers) {
      if (re.test(rest)) {
        const idx = rest.toLowerCase().indexOf(closeTag);
        if (idx !== -1) end = idx + closeTag.length;
        break;
      }
    }
    if (end === -1) {
      const gt = rest.indexOf('>');
      end = gt === -1 ? rest.length : gt + 1;
    }
    const code = el('code', 'psc-code', rest.slice(0, end));
    target.appendChild(code);
    rest = rest.slice(end);
  }
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

const ELIG_ICON = { E1: 'ok', E2: 'ok', E3: 'warn', E4: 'warn', E5: 'info' };

/**
 * Render the eligibility card into a container.
 * @param {HTMLElement} container
 * @param {object} elig EligibilityResult
 * @param {{openTab: (url: string) => void}} opts
 */
export function renderEligibilityCard(container, elig, opts) {
  const E = STRINGS.eligibility;
  container.textContent = '';
  container.appendChild(el('h2', 'psc-card-title', STRINGS.cards.eligibility));
  container.id = container.id || 'psc-eligibility';

  const vals = {
    domain: elig.displayDomain || '', host: elig.host || '',
    apex: elig.apex || '', path1: elig.subdirSegment || ''
  };

  const verdictRow = el('div', 'psc-verdict-row');
  verdictRow.appendChild(svg(ELIG_ICON[elig.state] || 'info'));
  let verdict = '';
  let detail = '';
  let advisory = null;
  switch (elig.state) {
    case 'E1':
      verdict = E.E1.verdict;
      detail = fmt(elig.isWww ? E.E1.detailWww : E.E1.detailBare, vals);
      break;
    case 'E2':
      verdict = E.E2.verdict;
      detail = fmt(E.E2.detail, vals);
      break;
    case 'E3':
      verdict = E.E3.verdict;
      detail = fmt(E.E3.detail, vals);
      advisory = fmt(E.E3.advisory, vals);
      break;
    case 'E4':
      verdict = E.E4.verdict;
      detail = fmt(E.E4.detail, vals);
      advisory = fmt(E.E4.advisory, vals);
      break;
    case 'E5':
      verdict = E.E5.verdict;
      detail = fmt(E.E5.detail, vals);
      break;
    default:
      return;
  }
  verdictRow.appendChild(el('span', 'psc-verdict psc-verdict-' + ELIG_ICON[elig.state], verdict));
  container.appendChild(verdictRow);
  container.appendChild(el('p', 'psc-detail', detail));
  if (advisory) container.appendChild(el('div', 'psc-advisory', advisory));

  if (elig.state !== 'E5') {
    const link = el('a', 'psc-verify-link', fmt(E.verifyLink, vals));
    const url = URLS.deeplinkBase + encodeURIComponent(elig.displayDomain);
    link.href = url;
    link.addEventListener('click', (ev) => {
      ev.preventDefault();
      opts.openTab(url);
    });
    container.appendChild(link);

    if (elig.isWww && (elig.state === 'E1' || elig.state === 'E3')) {
      container.appendChild(el('p', 'psc-muted-note', fmt(E.wwwNote, vals)));
    }
    container.appendChild(el('p', 'psc-muted-note', E.disclaimer));
  }
}

/** Skeleton rows while the detector runs (first load only). */
export function renderChecklistSkeleton(container) {
  container.textContent = '';
  container.appendChild(el('h2', 'psc-card-title', STRINGS.cards.implementation));
  const skel = el('div', 'psc-skeleton');
  for (let i = 0; i < 3; i++) skel.appendChild(el('div', 'psc-skeleton-row'));
  container.appendChild(skel);
}

let fixRowSeq = 0;

/**
 * Render the implementation checklist card.
 * @param {HTMLElement} container
 * @param {object} det DetectorResult
 * @param {object} elig EligibilityResult
 * @param {{openTab: (url:string)=>void, onRescan: ()=>void, rescanDisabled?: boolean}} opts
 * @returns {{summaryKey: string}} derivation summary (for history recording)
 */
export function renderChecklist(container, det, elig, opts) {
  const C = STRINGS.checklist;
  const derived = deriveChecklist(det, elig);
  container.textContent = '';
  container.appendChild(el('h2', 'psc-card-title', STRINGS.cards.implementation));
  container.appendChild(el('p', 'psc-summary', derived.summaryText));

  if (derived.chips.length > 0) {
    const chips = el('div', 'psc-chips');
    for (const chip of derived.chips) chips.appendChild(el('span', 'psc-chip', chip));
    container.appendChild(chips);
  }

  const list = el('ul', 'psc-checklist');
  for (const row of derived.rows) {
    const li = el('li', 'psc-row psc-row-' + row.glyph);
    const hasFix = Boolean(row.fix);
    const head = el(hasFix ? 'button' : 'div', 'psc-row-head');
    if (hasFix) {
      head.type = 'button';
      const fixId = 'psc-fix-row-' + (++fixRowSeq);
      head.setAttribute('aria-expanded', 'false');
      head.setAttribute('aria-controls', fixId);
      const fixBlock = el('div', 'psc-fix');
      fixBlock.id = fixId;
      fixBlock.hidden = true;
      renderRichText(fixBlock, row.fix);
      head.addEventListener('click', () => {
        const open = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', String(!open));
        fixBlock.hidden = open;
        li.classList.toggle('psc-row-open', !open);
      });
      li.appendChild(head);
      li.appendChild(fixBlock);
    } else {
      li.appendChild(head);
    }
    const glyphWrap = svg(row.glyph);
    const sr = el('span', 'sr-only', C.srStatus[row.glyph] + ' ');
    head.appendChild(glyphWrap);
    head.appendChild(sr);
    head.appendChild(el('span', 'psc-row-label', row.label));
    const phrase = el('span', 'psc-row-phrase', row.phrase);
    head.appendChild(phrase);
    if (hasFix) {
      const chevron = el('span', 'psc-chevron');
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '▸';
      head.appendChild(chevron);
    }
    for (const note of row.notes) {
      const noteEl = el('div', 'psc-row-note psc-row-note-' + note.tone);
      renderRichText(noteEl, note.text);
      li.appendChild(noteEl);
    }
    list.appendChild(li);
  }
  container.appendChild(list);

  if (derived.showGenerator) {
    const gen = el('a', 'psc-generator-link', C.generatorLink);
    gen.href = URLS.generator;
    gen.addEventListener('click', (ev) => {
      ev.preventDefault();
      opts.openTab(URLS.generator);
    });
    container.appendChild(gen);
  }

  container.appendChild(el('p', 'psc-muted-note', C.scopeNote));

  const footerRow = el('div', 'psc-card-footer');
  const rescan = el('button', 'psc-rescan');
  rescan.type = 'button';
  rescan.id = 'psc-rescan-btn';
  rescan.appendChild(svg('rescan'));
  rescan.appendChild(el('span', null, ' ' + C.rescan));
  rescan.title = C.rescanFull;
  if (opts.rescanDisabled) rescan.disabled = true;
  rescan.addEventListener('click', () => opts.onRescan());
  footerRow.appendChild(rescan);
  container.appendChild(footerRow);

  return { summaryKey: derived.summaryKey };
}

/** X4 — detector error inside the implementation card; Re-scan stays. */
export function renderDetectorError(container, opts) {
  container.textContent = '';
  container.appendChild(el('h2', 'psc-card-title', STRINGS.cards.implementation));
  const state = el('div', 'psc-state');
  state.appendChild(svg('plug'));
  state.appendChild(el('h3', 'psc-state-heading', STRINGS.states.X4.heading));
  state.appendChild(el('p', 'psc-state-body', STRINGS.states.X4.body));
  container.appendChild(state);
  const footerRow = el('div', 'psc-card-footer');
  const rescan = el('button', 'psc-rescan');
  rescan.type = 'button';
  rescan.appendChild(svg('rescan'));
  rescan.appendChild(el('span', null, ' ' + STRINGS.checklist.rescan));
  rescan.title = STRINGS.checklist.rescanFull;
  rescan.addEventListener('click', () => opts.onRescan());
  footerRow.appendChild(rescan);
  container.appendChild(footerRow);
}

/**
 * Full-panel empty state (X1/X2/X3) replacing both cards.
 * @param {HTMLElement} main the <main> region
 * @param {'X1'|'X2'|'X3'} stateId
 */
export function renderEmptyState(main, stateId) {
  const isFile = stateId === 'X2';
  const copy = isFile ? STRINGS.states.X2 : STRINGS.states.X1;
  const container = el('div', 'psc-state psc-state-full');
  container.appendChild(svg(isFile ? 'document' : 'compass'));
  container.appendChild(el('h3', 'psc-state-heading', copy.heading));
  container.appendChild(el('p', 'psc-state-body', copy.body));
  main.textContent = '';
  main.appendChild(container);
}
