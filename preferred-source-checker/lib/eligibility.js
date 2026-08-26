/*
 * Part of Opace Preferred Source Checker. Reusable module — no Chrome APIs,
 * no external dependencies. Also consumed by Essential SEO Toolkit.
 * Module version: 1.0.0
 *
 * Pure eligibility analysis per spec §2.1. Depends only on psl-lite.js.
 */

import { getRegistrableDomain } from './psl-lite.js';

/** First-path-segment triggers for the subdirectory advisory (spec §2.1.2). */
const SUBDIR_TRIGGERS = new Set([
  'blog', 'news', 'magazine', 'journal', 'insights', 'articles',
  'stories', 'press', 'media', 'updates', 'posts'
]);

const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

function isIpAddress(host) {
  const m = IPV4_RE.exec(host);
  if (m) return m.slice(1).every((o) => Number(o) <= 255);
  // IPv6 literals arrive from URL.hostname wrapped in [] — or contain ':'
  return host.startsWith('[') || host.includes(':');
}

/**
 * Analyse a tab URL for Preferred Sources eligibility.
 *
 * @param {string} urlString the current tab's URL
 * @returns {{ state: 'E1'|'E2'|'E3'|'E4'|'E5'|'E6',
 *             host: string|null, apex: string|null,
 *             displayDomain: string|null, isWww: boolean,
 *             subdirSegment: string|null }}
 */
export function analyse(urlString) {
  const none = {
    state: 'E6', host: null, apex: null,
    displayDomain: null, isWww: false, subdirSegment: null
  };

  let url;
  try {
    url = new URL(urlString);
  } catch (_e) {
    return none;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return none;

  let host = url.hostname.toLowerCase();
  if (host.endsWith('.')) host = host.slice(0, -1);

  // E5 — IP address, localhost, single-label host
  if (isIpAddress(host) || host === 'localhost' || !host.includes('.')) {
    return {
      state: 'E5', host, apex: null,
      displayDomain: null, isWww: false, subdirSegment: null
    };
  }

  const apex = getRegistrableDomain(host);
  if (apex === null) {
    // Host is itself a public suffix or otherwise not registrable.
    return {
      state: 'E5', host, apex: null,
      displayDomain: null, isWww: false, subdirSegment: null
    };
  }

  const isWww = host === 'www.' + apex;
  const isApex = host === apex || isWww;
  // Apex/www → bare apex; subdomain → full host (the eligible unit).
  const displayDomain = isApex ? apex : host;

  // Subdirectory advisory: first non-empty path segment, exact match.
  const segments = url.pathname.split('/').filter((s) => s.length > 0);
  const first = segments.length > 0 ? segments[0].toLowerCase() : null;
  const subdirSegment = first !== null && SUBDIR_TRIGGERS.has(first) ? first : null;

  let state;
  if (isApex) state = subdirSegment ? 'E3' : 'E1';
  else state = subdirSegment ? 'E4' : 'E2';

  return { state, host, apex, displayDomain, isWww, subdirSegment };
}

export { SUBDIR_TRIGGERS };
