/*
 * Part of Opace Preferred Source Checker.
 * Popup orchestrator: tab query → eligibility → detector injection → render.
 * The only file (with history.js) that touches chrome.* APIs.
 */

import { analyse } from '../lib/eligibility.js';
import { STRINGS, URLS, fmt } from '../lib/strings.js';
import {
  renderEligibilityCard, renderChecklist, renderChecklistSkeleton,
  renderDetectorError, renderEmptyState
} from '../lib/render.js';
import { createHistory } from '../lib/history.js';

const history = createHistory('auditHistory');

const $ = (id) => document.getElementById(id);

function openTab(url) {
  chrome.tabs.create({ url });
}

/* ---------------- URL gating (spec §4.6) ---------------- */

const X1_SCHEMES = ['chrome:', 'chrome-extension:', 'edge:', 'about:', 'devtools:', 'chrome-untrusted:', 'view-source:'];

function classifyTabUrl(urlString) {
  if (!urlString) return 'X1';
  let url;
  try {
    url = new URL(urlString);
  } catch (_e) {
    return 'X1';
  }
  if (url.protocol === 'file:') return 'X2';
  if (X1_SCHEMES.includes(url.protocol)) return 'X1';
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'X3';
  if (url.hostname === 'chromewebstore.google.com') return 'X1';
  return 'ok';
}

/* ---------------- Boot ---------------- */

let currentTabId = null;
let eligibilityResult = null;
let rescanTimer = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  renderFooter();
  const main = $('psc-main');

  let tab = null;
  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  } catch (_e) { /* fall through to empty state */ }

  const gate = classifyTabUrl(tab && tab.url);
  if (gate !== 'ok') {
    renderEmptyState(main, gate);
    main.focus();
    return;
  }

  currentTabId = tab.id;
  eligibilityResult = analyse(tab.url);

  renderDomainLine(tab.url, eligibilityResult);
  const eligCard = $('psc-eligibility');
  eligCard.classList.add('psc-card-animate');
  renderEligibilityCard(eligCard, eligibilityResult, { openTab });

  setupActions(eligibilityResult);
  updateOfflineBanner();
  window.addEventListener('online', updateOfflineBanner);
  window.addEventListener('offline', updateOfflineBanner);

  const implCard = $('psc-implementation');
  implCard.classList.add('psc-card-animate-late');
  renderChecklistSkeleton(implCard);

  main.focus();
  await runScan();
}

/* ---------------- Domain line ---------------- */

function renderDomainLine(urlString, elig) {
  const container = $('psc-domain');
  container.textContent = '';
  if (elig.state === 'E6') return;
  const name = document.createElement('div');
  name.className = 'psc-domain-name';
  const dot = document.createElement('span');
  dot.className = 'psc-domain-dot';
  dot.setAttribute('aria-hidden', 'true');
  name.appendChild(dot);
  name.appendChild(document.createTextNode(elig.displayDomain || elig.host || ''));
  container.appendChild(name);

  if (elig.host && elig.displayDomain && elig.host !== elig.displayDomain) {
    let path = '';
    try { path = new URL(urlString).pathname; } catch (_e) { /* ignore */ }
    let hostPath = elig.host + (path === '/' ? '' : path);
    if (hostPath.length > elig.host.length + 32) {
      hostPath = hostPath.slice(0, elig.host.length + 32) + '…';
    }
    const tabLine = document.createElement('div');
    tabLine.className = 'psc-domain-tab';
    tabLine.textContent = fmt(STRINGS.domain.tabLine, { hostPath });
    container.appendChild(tabLine);
  }
}

/* ---------------- Detector scan ---------------- */

async function runScan() {
  const implCard = $('psc-implementation');
  const rescanBtn = document.getElementById('psc-rescan-btn');
  if (rescanBtn) {
    rescanBtn.disabled = true;
    const label = rescanBtn.querySelector('span:last-child');
    if (label) label.textContent = ' ' + STRINGS.checklist.scanning;
  }
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: currentTabId },
      files: ['lib/detector.js', 'lib/detector-inject.js']
    });
    if (!result || result.ok !== true) throw new Error((result && result.error) || 'Detector failed');
    const { summaryKey } = renderChecklist(implCard, result, eligibilityResult, {
      openTab,
      onRescan: requestRescan,
      rescanDisabled: true
    });
    // Debounce: re-enable Re-scan 500 ms after each run (spec §2.2.5).
    clearTimeout(rescanTimer);
    rescanTimer = setTimeout(() => {
      const btn = document.getElementById('psc-rescan-btn');
      if (btn) btn.disabled = false;
    }, 500);
    recordHistory(result, summaryKey);
  } catch (_e) {
    renderDetectorError(implCard, { onRescan: requestRescan }); // X4
  }
}

function requestRescan() {
  runScan();
}

async function recordHistory(det, summaryKey) {
  if (!eligibilityResult || !eligibilityResult.host) return;
  try {
    await history.record({
      ts: Date.now(),
      host: eligibilityResult.host,
      displayDomain: eligibilityResult.displayDomain || eligibilityResult.host,
      eligibility: eligibilityResult.state,
      summary: summaryKey,
      mode: det.mode,
      sdk: det.sdk.present,
      buttonCount: det.buttons.count,
      rendered: det.buttons.iframeRendered,
      deeplinks: det.deeplinks.count
    });
  } catch (_e) { /* history is best-effort; never break the UI */ }
}

/* ---------------- Actions ---------------- */

function setupActions(elig) {
  const A = STRINGS.actions;
  const addBtn = $('psc-add-btn');
  const copyBtn = $('psc-copy-btn');
  const addCaption = $('psc-add-caption');
  const copyCaption = $('psc-copy-caption');

  addBtn.textContent = A.addLabel;
  copyBtn.textContent = A.copyLabel;
  addCaption.textContent = A.addCaption;

  copyCaption.textContent = '';
  copyCaption.appendChild(document.createTextNode(A.copyCaptionBefore));
  const genLink = document.createElement('a');
  genLink.href = URLS.generator;
  genLink.textContent = A.copyCaptionLinkText;
  genLink.addEventListener('click', (ev) => {
    ev.preventDefault();
    openTab(URLS.generator);
  });
  copyCaption.appendChild(genLink);
  copyCaption.appendChild(document.createTextNode(A.copyCaptionAfter));

  if (elig.state === 'E5') {
    addBtn.disabled = true;
    copyBtn.disabled = true;
    addBtn.title = A.disabledTooltip;
    copyBtn.title = A.disabledTooltip;
    return;
  }

  const displayDomain = elig.displayDomain;
  addBtn.title = fmt(A.addTitle, { displayDomain });
  addBtn.addEventListener('click', () => {
    openTab(URLS.deeplinkBase + encodeURIComponent(displayDomain));
  });

  copyBtn.addEventListener('click', () => copySnippet(displayDomain));
}

let copyRevertTimer = null;

async function copySnippet(displayDomain) {
  const A = STRINGS.actions;
  const copyBtn = $('psc-copy-btn');
  const announcer = $('psc-announcer');
  const snippet = fmt(STRINGS.snippet.template, { displayDomain });
  const revert = (label) => {
    copyBtn.textContent = label;
    clearTimeout(copyRevertTimer);
    copyRevertTimer = setTimeout(() => { copyBtn.textContent = A.copyLabel; }, 1500);
  };
  try {
    await navigator.clipboard.writeText(snippet);
    revert(A.copied);
    announcer.textContent = A.announceCopied;
  } catch (_e) {
    revert(A.copyFailed);
    announcer.textContent = A.announceCopyFailed;
    const fallback = $('psc-copy-fallback');
    const textarea = $('psc-copy-textarea');
    $('psc-copy-helper').textContent = A.copyHelper;
    textarea.value = snippet;
    fallback.hidden = false;
    textarea.focus();
    textarea.select();
  }
}

/* ---------------- Offline banner (X5) ---------------- */

function updateOfflineBanner() {
  const banner = $('psc-offline-banner');
  if (navigator.onLine === false) {
    banner.textContent = STRINGS.states.X5.banner;
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }
}

/* ---------------- Footer ---------------- */

function renderFooter() {
  const by = $('psc-footer-by');
  by.textContent = STRINGS.footer.byPrefix;
  const link = document.createElement('a');
  link.href = URLS.homepage;
  link.textContent = STRINGS.footer.byLinkText;
  link.addEventListener('click', (ev) => {
    ev.preventDefault();
    openTab(URLS.homepage);
  });
  by.appendChild(link);
  by.appendChild(document.createTextNode(' · opace.agency'));

  const version = chrome.runtime.getManifest().version;
  $('psc-footer-version').textContent = fmt(STRINGS.footer.version, { version });
}
