# Chrome Web Store listing — Preferred Source Checker for Google

Final listing content per spec §5. Paste each block verbatim into the store dashboard.

## Identity

- **Name (exact):** `Preferred Source Checker for Google`
- **Category:** Developer Tools
- **Language:** English
- **Website / homepage:** `https://opace.agency/add-as-preferred-source-button-for-google/button-checker/`
- **Support URL:** `https://opace.agency/add-as-preferred-source-button-for-google/button-checker/`

## Short description (128 characters)

```
Free SEO checker for Google Preferred Sources: eligibility, correct button install, one-click add. All local, no data collected.
```

## Full description (plain text, blank-line separated)

```
Is your Preferred Sources button actually working? This free SEO checker tells you in one click. It is the only extension that audits a Google Preferred Sources implementation.

Google's Preferred Sources lets readers choose the publications they want to see more of in Top Stories, Discover and AI Overviews. Google reports that readers who prefer a source click through roughly twice as often. Since August 2026 publishers can embed an official button so readers opt in without leaving the page. But there has been no way to verify an installation. Until now.

WHAT IT DOES

1. Eligibility check — instantly classifies the current site as domain, subdomain or subdirectory. Preferred Sources works at domain and subdomain level only, so the checker warns you when a blog living at /blog can't be preferred on its own, and links you straight to Google's source tool to confirm the site resolves.

2. Implementation detector — scans the page you're on and reports a clear checklist:
• SDK loaded — is Google's publisher.js script present, and loaded async?
• Mode — auto (Google renders the button) or manual (your own trigger)?
• Button element — is the google-add-preferred-source-btn element there, visible, and has Google's button actually rendered into it?
• Deeplink fallback — is there a no-JavaScript fallback link, and does it point at the right domain?
Every failed check comes with plain-English fix-it guidance and ready-to-paste code.

3. One-click add — opens Google's own preferences page for the current domain in a new tab, so you (or your test profiles) can add the site as a preferred source. The extension never automates anything on Google's pages — you stay in control.

4. Copy embed snippet — the standard two-line embed plus a no-JS fallback link, personalised to the current domain, on your clipboard in one click.

WHO IT'S FOR

SEO consultants auditing sites for Preferred Sources readiness. Agencies verifying deployments across a client portfolio. Publishers who just pasted the embed and want to know it worked.

100% PRIVATE

Everything runs locally in your browser. No data is collected, no analytics, no external requests, ever. The extension only looks at a page when you click its icon. Read the policy: https://opace.agency/add-as-preferred-source-button-for-google/button-checker/privacy/

FROM OPACE'S PREFERRED SOURCES TOOLKIT

Built by Opace, a Birmingham UK digital agency. This checker sits alongside our other free Preferred Sources tools: the button and snippet generator, the online eligibility checker at opace.agency, and our WordPress plugin that adds the official button to any WordPress site with placement rules, click analytics and a deeplink fallback. Find them all at https://opace.agency/add-as-preferred-source-button-for-google/button-checker/

This extension is an independent tool by Opace and is not affiliated with or endorsed by Google. Google is a trademark of Google LLC.
```

## Screenshot storyboard (5 × 1280×800 PNG)

Art direction for all five: real popup UI captured at 2× against a soft diagonal gradient backdrop (Opace blue `#0b57d0` → `#083a8c`), a short headline top-left in white Inter/system 48 px bold, subline 24 px regular. Popup screenshot drop-shadowed, slightly rotated (−2°) except shot 1 (straight).

1. **Hero — the checklist.** Popup showing a fully green checklist on a news site. Headline: `Is your Preferred Sources button installed correctly?` Subline: `A one-click audit of any page.`
2. **Catching a broken install.** Popup showing SDK ✓ but Button ⚠ "hasn't rendered" with fix-it copy expanded. Headline: `Find what's broken — and how to fix it.`
3. **Subdirectory warning.** Popup on `example.com/blog/post` with amber advisory visible. Headline: `Blog in a subdirectory? You'll want to know this.` Subline: `Preferred Sources is domain and subdomain only.`
4. **One-click add.** Popup with the primary button highlighted plus a browser tab peeking in showing Google's preferences page. Headline: `Add any site as preferred in one click.` Subline: `Opens Google's own page — nothing automated.`
5. **Copy snippet.** Popup with `Copied ✓` state and the snippet in a code card beside it. Headline: `The embed code, personalised, on your clipboard.` Subline: `Free button generator included at opace.agency.`

## Promo tile art direction

- **Small promo tile 440×280:** Opace blue gradient background; centred white magnifying-glass-over-star glyph (the extension icon motif); wordmark `Preferred Source Checker` in white, `for Google` in 60% white beneath. No screenshots at this size.
- **Marquee 1400×560 (if requested):** left half = headline `Audit any site's Preferred Sources setup in one click` + Opace logo lockup; right half = the hero popup screenshot.
- **Extension icon (16/32/48/128):** rounded-square Opace blue field, white star with a small magnifier overlapping its lower-right; at 16 px simplify to star only. Flat, no gradients on the glyph, 1 px padding safety margin at 16 px.

## Privacy policy

Host at `https://opace.agency/add-as-preferred-source-button-for-google/button-checker/privacy/`; also paste into the store's privacy field where allowed. Fill the bracketed release date and privacy contact at publish time — do not invent them.

```
Privacy Policy — Preferred Source Checker for Google
Last updated: [release date]

Preferred Source Checker for Google ("the extension") is published by Opace Ltd,
a UK digital agency (opace.agency).

What the extension collects: nothing. The extension does not collect, transmit,
sell or share any personal data, browsing data, or usage analytics of any kind.

How it works: when you click the extension's icon, it reads the address of the
tab you are viewing and examines that page's code, entirely within your browser,
to report whether Google's Preferred Sources button is present and correctly
installed. This analysis happens locally on your device. The page content and
the results are never sent to Opace, Google, or anyone else.

Storage: the extension keeps a history of your own audits (the domain checked,
the date, and the result) in your browser's local extension storage so a future
version can show you past checks. This history never leaves your device, and
uninstalling the extension deletes it.

Network requests: the extension makes no network requests. The only navigation
it performs is opening Google's public preferences page, or Opace's website, in
a new tab when you click a button that says it will do so.

Permissions: activeTab and scripting allow the one-off, read-only page check on
the tab you invoke the extension on; storage holds the local audit history;
clipboardWrite lets the "Copy embed snippet" button write to your clipboard.

Changes: any future version that changes these practices will update this policy
and the Chrome Web Store data-use disclosures before release.

Contact: [privacy contact email], Opace Ltd, Birmingham, United Kingdom.
```

## Single-purpose justification (review form)

```
Single purpose: auditing a website's implementation of Google's Preferred Sources feature. Every function serves that one purpose — checking the current site's eligibility (domain/subdomain classification), detecting whether the official Preferred Sources button SDK and fallback link are correctly installed on the current page, opening Google's public preferences page for that domain, and copying the standard embed code. The extension has no other features, collects no data, and makes no network requests.
```

## Permission justifications (privacy-practices form)

| Permission | Justification |
| :--- | :--- |
| `activeTab` | Used to read the current tab's URL for the eligibility check and to allow one-time script injection into that tab when the user opens the popup. Grants access only to the tab the user explicitly invokes the extension on. |
| `scripting` | Used with activeTab to inject a small read-only detector script into the current page when the popup opens, checking for Google's Preferred Sources SDK script tag, button elements and fallback links. No persistent content scripts; nothing is modified on the page. |
| `storage` | Stores the user's own audit history (domain, date, result) locally on their device via chrome.storage.local. Nothing is transmitted anywhere. |
| `clipboardWrite` | Lets the "Copy embed snippet" button place the HTML embed code on the user's clipboard when clicked. |

## Data-use disclosures (store form answers)

- Collects user data: **No** — tick "does not collect user data" across all categories.
- Remote code: **No**.
- Certify compliance with the Developer Programme Policies: **Yes**.
