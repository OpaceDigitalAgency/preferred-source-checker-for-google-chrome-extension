/*
 * Part of Opace Preferred Source Checker. Reusable module — no Chrome APIs,
 * no external dependencies. Also consumed by Essential SEO Toolkit.
 * Module version: 1.0.0
 *
 * Read-only Preferred Sources implementation detector (spec §2.2).
 * UMD-lite: usable as a classic injected script (sets a global), via
 * CommonJS require, or imported for its global side effect in ESM.
 * Never mutates the page. No MutationObserver, no timers, single pass.
 */

(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module !== null && module.exports) {
    module.exports = api;
  }
  if (root) root.__PSC_DETECTOR__ = api; // page/injection global
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : (typeof self !== 'undefined' ? self : this),
  function () {
    'use strict';

    const SDK_SRC_RE = /^https:\/\/news\.google\.com\/swg\/js\/v1\/publisher\.(js|mjs)(\?.*)?$/i;
    const BTN_ATTR = 'google-add-preferred-source-btn';

    function attr(el, name) {
      try {
        const v = el.getAttribute(name);
        return v === undefined ? null : v;
      } catch (_e) {
        return null;
      }
    }

    function isVisible(el, win) {
      try {
        const rect = el.getBoundingClientRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) return false;
        if (win && typeof win.getComputedStyle === 'function') {
          const cs = win.getComputedStyle(el);
          if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return false;
        }
        return true;
      } catch (_e) {
        return false;
      }
    }

    function isGoogleIframe(el, baseURI) {
      const src = attr(el, 'src');
      if (!src) return false;
      try {
        const u = new URL(src, baseURI);
        const h = u.hostname.toLowerCase();
        return h === 'news.google.com' || h === 'google.com' || h.endsWith('.google.com');
      } catch (_e) {
        return false;
      }
    }

    /**
     * Take a single read-only snapshot of the page's Preferred Sources
     * implementation. @param {Document} [doc] defaults to the global document.
     * @returns {object} DetectorResult (spec §2.2.3), or { ok:false, error }.
     */
    function runDetector(doc) {
      try {
        const d = doc || (typeof document !== 'undefined' ? document : null);
        if (!d) return { ok: false, error: 'No document available' };
        const win = d.defaultView || null;
        const baseURI = d.baseURI ||
          (d.location && d.location.href) || undefined;
        const loc = d.location ||
          (win && win.location) || null;
        const pageHost = loc ? String(loc.hostname || '').toLowerCase() : '';
        const pageHostNoWww = pageHost.replace(/^www\./, '');

        // 1. SDK script tags + preload links
        const sdk = {
          present: false, srcs: [], async: null, controlAttr: null, preloadOnly: false
        };
        const modes = [];
        let manualQueueHint = false;
        const scripts = d.querySelectorAll('script');
        for (let i = 0; i < scripts.length; i++) {
          const s = scripts[i];
          const src = attr(s, 'src');
          if (src && SDK_SRC_RE.test(src.trim())) {
            sdk.srcs.push(src.trim());
            const control = attr(s, 'preferred-sources-control');
            const isManual = control !== null &&
              String(control).trim().toLowerCase() === 'manual';
            modes.push(isManual ? 'manual' : 'auto');
            if (!sdk.present) {
              sdk.present = true;
              sdk.async = s.hasAttribute ? s.hasAttribute('async') : attr(s, 'async') !== null;
              sdk.controlAttr = control;
            }
          } else if (!src) {
            // 6. Manual-mode command-queue hint (inline scripts only)
            const text = s.textContent || '';
            if (text.indexOf('PREFERRED_SOURCE') !== -1) manualQueueHint = true;
          }
        }
        if (!sdk.present) {
          const links = d.querySelectorAll('link[rel="preload"], link[rel="modulepreload"]');
          for (let i = 0; i < links.length; i++) {
            const href = attr(links[i], 'href');
            if (href && SDK_SRC_RE.test(href.trim())) { sdk.preloadOnly = true; break; }
          }
        }

        // 2. Mode
        let mode = 'none';
        if (modes.length > 0) {
          const uniq = Array.from(new Set(modes));
          mode = uniq.length > 1 ? 'mixed' : uniq[0];
        }

        // 3 + 4. Button elements and rendered iframes
        const buttons = {
          count: 0, firstTag: null, theme: null, lang: null,
          visibleCount: 0, iframeRendered: false, renderedCount: 0
        };
        const buttonIframes = [];
        const btnEls = d.querySelectorAll('[' + BTN_ATTR + ']');
        buttons.count = btnEls.length;
        for (let i = 0; i < btnEls.length; i++) {
          const el = btnEls[i];
          if (i === 0) {
            buttons.firstTag = el.tagName || null;
            buttons.theme = attr(el, 'data-theme');
            buttons.lang = attr(el, 'data-lang');
          }
          if (isVisible(el, win)) buttons.visibleCount++;
          const iframes = el.querySelectorAll('iframe');
          let rendered = false;
          for (let j = 0; j < iframes.length; j++) {
            buttonIframes.push(iframes[j]);
            if (isGoogleIframe(iframes[j], baseURI)) rendered = true;
          }
          if (rendered) buttons.renderedCount++;
        }
        buttons.iframeRendered = buttons.renderedCount > 0;

        // Loose iframe sweep (manual-mode custom placements)
        let looseIframeCount = 0;
        const sweep = d.querySelectorAll('iframe[src*="news.google.com/swg"]');
        for (let i = 0; i < sweep.length; i++) {
          if (buttonIframes.indexOf(sweep[i]) === -1) looseIframeCount++;
        }

        // 5. Deeplink anchors
        const deeplinks = { count: 0, firstQ: null, qMatchesSite: false };
        const anchors = d.querySelectorAll('a[href*="google.com/preferences/source"]');
        for (let i = 0; i < anchors.length; i++) {
          const href = attr(anchors[i], 'href');
          if (!href) continue;
          let u;
          try { u = new URL(href, baseURI); } catch (_e) { continue; }
          const h = u.hostname.toLowerCase();
          if ((h === 'www.google.com' || h === 'google.com') &&
              u.pathname === '/preferences/source') {
            deeplinks.count++;
            if (deeplinks.firstQ === null) {
              deeplinks.firstQ = u.searchParams.get('q');
              if (deeplinks.firstQ !== null && pageHost) {
                const q = deeplinks.firstQ.toLowerCase().replace(/^www\./, '');
                // Matches the page's displayDomain (host minus www) or full host.
                deeplinks.qMatchesSite = q === pageHostNoWww || q === pageHost;
              }
            }
          }
        }

        return {
          ok: true,
          scannedAt: Date.now(),
          sdk,
          mode,
          buttons,
          looseIframeCount,
          deeplinks,
          manualQueueHint
        };
      } catch (e) {
        return { ok: false, error: e && e.message ? String(e.message) : String(e) };
      }
    }

    return { runDetector };
  }
);
