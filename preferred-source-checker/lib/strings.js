/*
 * Part of Opace Preferred Source Checker. Reusable module — no Chrome APIs,
 * no external dependencies. Also consumed by Essential SEO Toolkit.
 * Module version: 1.0.0
 *
 * Every user-facing string, verbatim from spec §2 and §4. British English.
 * Placeholders use {name} tokens; substitute with fmt().
 */

export const PSC_MODULE_VERSION = '1.0.0';

export const URLS = Object.freeze({
  deeplinkBase: 'https://www.google.com/preferences/source?q=',
  generator: 'https://opace.agency/add-as-preferred-source-button-for-google/button-generator/?utm_source=chrome-extension&utm_medium=extension&utm_campaign=psc',
  homepage: 'https://opace.agency/add-as-preferred-source-button-for-google/button-checker/?utm_source=chrome-extension&utm_medium=extension&utm_campaign=psc'
});

/** Substitute {token} placeholders in a template string. */
export function fmt(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (m, key) =>
    values && Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : m
  );
}

export const STRINGS = Object.freeze({
  header: Object.freeze({
    title: 'Chrome Site Checker — Preferred Sources'
  }),

  domain: Object.freeze({
    tabLine: 'Tab: {hostPath}'
  }),

  cards: Object.freeze({
    eligibility: 'Eligibility',
    implementation: 'Implementation'
  }),

  eligibility: Object.freeze({
    E1: Object.freeze({
      verdict: 'Eligible at domain level',
      detailWww: '{domain} is a root domain, which is the right level for Preferred Sources. Google treats www.{apex} and {apex} as the same publication, so either works.',
      detailBare: '{domain} is a root domain, which is the right level for Preferred Sources.'
    }),
    E2: Object.freeze({
      verdict: 'Eligible at subdomain level',
      detail: '{host} is a subdomain of {apex}. Subdomains are eligible for Preferred Sources in their own right — users would be preferring {host} specifically, not {apex}. If the whole publication actually lives at {apex}, run this check from there instead.'
    }),
    E3: Object.freeze({
      verdict: 'Domain is eligible — but check where your publication lives',
      detail: '{domain} is a root domain, which is the right level for Preferred Sources.',
      advisory: "You're on /{path1}/ — a subdirectory. Google's Preferred Sources works at domain and subdomain level only, so a blog or news section living in a subdirectory cannot be preferred separately: users can only prefer {domain} as a whole. If this section is the actual publication, consider moving it to a subdomain (for example {path1}.{apex}) to make it independently eligible."
    }),
    E4: Object.freeze({
      verdict: 'Subdomain is eligible — but check where your publication lives',
      detail: '{host} is a subdomain of {apex} and is eligible in its own right.',
      advisory: "You're on /{path1}/ — a subdirectory of {host}. Preferred Sources works at domain and subdomain level only; this section cannot be preferred separately from {host}."
    }),
    E5: Object.freeze({
      verdict: 'Not checkable',
      detail: "{host} isn't a public domain name, so Preferred Sources doesn't apply here. Open a live public site and try again."
    }),
    verifyLink: "Verify {domain} appears in Google's source tool →",
    wwwNote: "Note: the check and the add link use {apex} (without www) — Google's source tool identifies publications by bare domain.",
    disclaimer: "Eligibility also requires that Google already recognises the site as a source. That can't be checked automatically — use the verify link above and see whether the site resolves in Google's tool."
  }),

  checklist: Object.freeze({
    labels: Object.freeze({
      sdk: 'SDK loaded',
      mode: 'Mode',
      button: 'Button',
      deeplink: 'Deeplink'
    }),
    srStatus: Object.freeze({
      ok: 'Pass:',
      warn: 'Warning:',
      err: 'Failed:',
      na: 'Not applicable:'
    }),
    row1: Object.freeze({
      okAsync: 'publisher.js found (async)',
      warnNoAsync: 'publisher.js found — missing async',
      warnNoAsyncFix: "The script tag should carry the async attribute so it doesn't block page rendering: <script async src=\"https://news.google.com/swg/js/v1/publisher.js\"></script>",
      errPreloadOnly: 'SDK preloaded but never executed',
      errPreloadOnlyFix: 'A preload for publisher.js exists but no script tag loads it. Add the script tag itself.',
      errAbsent: 'publisher.js not found',
      errAbsentFix: "Add Google's SDK to the page head: <script async src=\"https://news.google.com/swg/js/v1/publisher.js\"></script> — or use the Copy snippet button below for the full embed."
    }),
    row2: Object.freeze({
      auto: 'Auto — Google renders the button',
      manual: 'Manual — site controls the trigger',
      manualNoQueueNote: 'Manual mode is declared but no PREFERRED_SOURCE command-queue script was detected inline. If your init code lives in an external file this is fine; otherwise the button will never initialise.',
      mixed: 'Conflicting script tags',
      mixedFix: 'More than one publisher.js tag was found with different preferred-sources-control settings. Keep exactly one script tag.',
      none: 'No SDK, no mode',
      noneFix: 'Install the SDK first (see row above).'
    }),
    row3: Object.freeze({
      okRendered: "{count} button element(s) — Google's button has rendered",
      warnNotRendered: "{count} button element(s) found, but Google's button hasn't rendered",
      warnNotRenderedFix: "The placeholder exists but no Google iframe is inside it yet. The SDK loads asynchronously — try Re-scan. If it still hasn't rendered, check the browser console for blocked requests (ad blockers and strict privacy settings commonly block news.google.com).",
      warnHidden: 'Button element present but hidden',
      warnHiddenFix: "The element with google-add-preferred-source-btn is not visible (zero size or display:none). Users can't click a hidden button.",
      errNone: 'No button element',
      errNoneAutoFix: "Auto mode needs an element carrying the google-add-preferred-source-btn attribute, e.g. <div google-add-preferred-source-btn></div>. Use Copy snippet below, or generate a styled one with Opace's button generator.",
      naManual: 'n/a in manual mode',
      naManualNote: "Manual mode renders no automatic button — your own element triggers preferredSource.addPreferredSource(). This tool can't verify your custom trigger works; test it by clicking it.",
      naManualIframeNote: 'A Google SDK iframe is present on the page, which suggests initialisation succeeded.',
      warnNoSdk: 'Button element present but the SDK is missing',
      warnNoSdkFix: "An element with google-add-preferred-source-btn exists but publisher.js isn't loaded, so nothing will render into it. Add the SDK script.",
      errNoneNoSdkFix: 'Nothing to render. Use Copy snippet below for the full two-line embed.'
    }),
    row4: Object.freeze({
      ok: '{count} link(s) to google.com/preferences/source',
      warnWrongQ: 'Deeplink found, but it points at "{firstQ}"',
      warnWrongQFix: "The link's q parameter should be this site's own domain ({displayDomain}). Linking to a different domain sends users to prefer someone else's site.",
      warnMissing: 'No deeplink fallback',
      warnMissingFix: 'Recommended: add a plain link for users with JavaScript or Google scripts blocked — <a href="https://www.google.com/preferences/source?q={displayDomain}">Add {displayDomain} as a preferred source on Google</a>.',
      errMissing: 'No deeplink either',
      errMissingFix: 'The page has neither the SDK button nor a fallback link. The quickest zero-JS start is a plain link: <a href="https://www.google.com/preferences/source?q={displayDomain}">Add us as a preferred source on Google</a>.'
    }),
    summary: Object.freeze({
      implemented: 'Preferred Sources button: implemented ✓',
      partial: 'Preferred Sources button: partly implemented',
      deeplinkOnly: 'No SDK button — deeplink-only implementation',
      none: 'Preferred Sources: not implemented on this page'
    }),
    chips: Object.freeze({
      theme: 'theme: {value}',
      lang: 'lang: {value}',
      sdkJs: 'SDK: publisher.js',
      sdkMjs: 'SDK: publisher.mjs'
    }),
    generatorLink: "Generate a ready-made button and embed code with Opace's free button generator →",
    scopeNote: 'This checks the current page only. Google recommends site-wide placement; spot-check your homepage and a typical article.',
    rescan: 'Re-scan',
    rescanFull: 'Re-scan page',
    scanning: 'Scanning…'
  }),

  actions: Object.freeze({
    addLabel: 'Add as preferred on Google',
    addTitle: "Opens Google's source preferences for {displayDomain} in a new tab. You complete the add on Google's page.",
    addCaption: "Opens Google's own preferences page — the extension doesn't act on your behalf there.",
    copyLabel: 'Copy embed snippet',
    copied: 'Copied ✓',
    copyFailed: 'Copy failed',
    copyHelper: 'Press Ctrl+C / Cmd+C to copy.',
    copyCaptionBefore: 'Standard two-line embed plus a no-JS fallback link. For themes, languages and styled buttons, use ',
    copyCaptionLinkText: 'the generator',
    copyCaptionAfter: '.',
    disabledTooltip: 'Needs a public domain',
    announceCopied: 'Snippet copied to clipboard',
    announceCopyFailed: 'Copy failed — snippet shown below, press Control C to copy'
  }),

  snippet: Object.freeze({
    template: '<!-- Google Preferred Sources button (auto mode) -->\n' +
      '<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>\n' +
      '<div google-add-preferred-source-btn></div>\n' +
      '<!-- No-JS fallback -->\n' +
      '<noscript>\n' +
      '  <a href="https://www.google.com/preferences/source?q={displayDomain}">Add {displayDomain} as a preferred source on Google</a>\n' +
      '</noscript>'
  }),

  states: Object.freeze({
    X1: Object.freeze({
      heading: 'Nothing to check here',
      body: 'This is a browser page, not a website. Open a live site and click the extension again.'
    }),
    X2: Object.freeze({
      heading: 'Local file',
      body: "Preferred Sources applies to live public websites, so there's nothing to check on a local file."
    }),
    X4: Object.freeze({
      heading: "Couldn't scan this page",
      body: "The page blocked the check or finished loading in a way Chrome can't inject into. Reload the page, then click Re-scan."
    }),
    X5: Object.freeze({
      banner: 'You\'re offline. The check still works, but the "Add as preferred" page won\'t load until you reconnect.'
    })
  }),

  footer: Object.freeze({
    byPrefix: 'Free tool by ',
    byLinkText: 'Opace',
    version: 'v{version}'
  })
});
