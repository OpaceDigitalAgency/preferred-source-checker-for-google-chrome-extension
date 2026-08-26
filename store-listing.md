# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Chrome Site Checker

This copy is prepared locally for the Chrome Web Store. The extension is built and tested at 33/33, but it has **not been submitted**. Do not describe it as published, live or reviewed until a store submission and listing review are evidenced.

## Listing fields

- **Name:** `Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)`
- **Product modifier:** `Chrome Site Checker` (the extension audits the implementation; it does not install the button)
- **Category:** `Developer Tools`
- **Language:** `English`
- **Price:** Free
- **Website / homepage:** `https://opace.agency/add-as-preferred-source-button-for-google/button-checker/`
- **Support URL:** `https://opace.agency/add-as-preferred-source-button-for-google/button-checker/`
- **Privacy policy URL:** `https://opace.agency/privacy-policy/` (verified HTTP 200 on 26 August 2026; Opace's canonical public policy)
- **Release state:** Not submitted
- **Release date:** Not set. Complete in the dashboard at submission time.
- **Privacy contact:** `info@opace.co.uk` (verified against Opace's public privacy policy on 26 August 2026).

## Short description

Maximum 132 characters:

```text
Free SEO checker for Google Preferred Sources: eligibility, button install and a link to Google's add page. Runs locally.
```

## Full description

```text
Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Chrome Site Checker audits the Google Preferred Sources implementation on the page you are viewing. This free Chrome companion reports eligibility, installation details and practical fixes in one click.

Google's Preferred Sources lets readers choose publications they want to see more of in Top Stories, Discover and AI Overviews. Publishers can provide an official button or a direct preferences link, but an installation still needs checking after it is added.

WHAT IT DOES

1. Eligibility check: classifies the current host as a domain, www domain or subdomain and flags common publication paths such as /blog. Preferred Sources applies at domain and subdomain level only. The checker links to Google's source tool because it cannot confirm automatically whether Google recognises the site as a source.

2. Implementation detector: scans the current page and reports a checklist:
• SDK loaded: is Google's publisher.js or publisher.mjs present, and is it async?
• Mode: is the page using automatic rendering or manual control?
• Button element: is google-add-preferred-source-btn present, visible and populated with Google's button iframe when available?
• Deeplink fallback: is there a valid link to google.com/preferences/source, and does its q value match the site?
Failed checks include plain-English fix guidance and ready-to-paste examples.

3. Add-page link: the Add as preferred on Google action opens Google's own source preferences page for the current domain in a new tab. You complete the add on Google's page. The extension does not click, fill or automate Google's interface, and it cannot detect a completed addition.

4. Copy embed snippet: copies the standard automatic-mode embed plus a no-JavaScript fallback link, personalised to the current domain.

WHO IT IS FOR

SEO consultants checking Preferred Sources readiness, agencies reviewing client deployments, and publishers verifying an embed after installation.

LOCAL-FIRST PRIVACY

The page scan runs in the browser and does not modify the page. The extension stores audit metadata in chrome.storage.local for the user's device. It does not transmit, sync or upload that history, and there is no analytics service.

The extension does not make background requests or fetch scan data to a service. Clicking Add, Verify, the generator or an Opace link opens the chosen destination in a new tab. Those user-triggered navigations are visible actions, not silent collection. The extension does not claim that a source was added successfully.

MORE FROM OPACE

Find the Preferred Sources product hub at https://opace.agency/add-as-preferred-source-button-for-google/ and the online eligibility checker at https://opace.agency/add-as-preferred-source-button-for-google/button-checker/. The button and embed-code generator at https://opace.agency/add-as-preferred-source-button-for-google/button-generator/ supports styled and platform-specific examples. The suite also includes a WordPress plugin repository at https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google-wordpress-plugin and open-source framework packages at https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google.

Built by Opace Digital Agency at https://opace.agency/, a UK agency working from Birmingham and internationally. This independent extension is not affiliated with, endorsed by or sponsored by Google. Google is a trademark of Google LLC. The listing is a local candidate and has not been submitted to the Chrome Web Store.
```

## Privacy policy text

The public policy URL above is Opace's canonical Privacy & Cookie Policy and currently returns HTTP 200. Paste the extension-specific disclosure below into the dashboard where permitted.

```text
Privacy Policy: Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Chrome Site Checker
Last updated: 26 August 2026

The public Opace Privacy & Cookie Policy is available at https://opace.agency/privacy-policy/. The extension-specific practices below apply to this Chrome companion.

Preferred Source Checker for Google ("the extension") is published by Opace Ltd,
a UK digital agency working from Birmingham and internationally (opace.agency).

What the extension collects: the extension does not collect, transmit, sell or
share scan results, browsing history or usage analytics with Opace or any other
service. It reads the current tab only when you invoke the extension.

How it works: the extension examines the current page's code locally to report
whether Google's Preferred Sources button is present and correctly installed.
The page content and the result are not sent anywhere.

Storage: the extension writes the host, display domain, date and audit result to
chrome.storage.local on your device. This history is not transmitted, synced or
uploaded. Version 1 has no history screen. Uninstalling the extension removes
its local storage under Chrome's extension-storage behaviour.

Navigation: the extension does not make background requests or fetch scan data.
When you click Add, Verify, the generator or an Opace link, it opens the chosen
Google or Opace destination in a new tab. Add and Verify include the selected
display domain in the Google destination URL, so that domain is sent to Google
as part of the browser request. No scan result or browsing history is included.
The extension does not automate the Google page, and a navigation is not a
confirmed preferred-source addition.

Permissions: activeTab and scripting allow the one-off, read-only page check on
the tab you invoke the extension on; storage holds local audit history;
clipboardWrite lets Copy embed snippet write to your clipboard.

Changes: future versions that change these practices will update this policy
and the Chrome Web Store data-use disclosures before release.

Contact: info@opace.co.uk, Opace Ltd, United Kingdom.
```

## Single-purpose justification

```text
Single purpose: auditing a website's implementation of Google's Preferred Sources feature. The extension checks the current site's domain or subdomain eligibility, detects the official SDK and fallback link on the current page, opens Google's public preferences page for the user to complete, and copies the standard embed code. It has no unrelated features and does not transmit scan data.
```

## Permission justifications

| Permission | Justification |
| --- | --- |
| `activeTab` | Reads the current tab's URL for eligibility and permits one-off script injection when the user opens the popup. Access is limited to the tab where the user invokes the extension. |
| `scripting` | Injects a small, read-only detector into the current page to inspect Google's SDK script, button elements and fallback links. There is no persistent content script and the page is not modified. |
| `storage` | Stores the user's own audit history locally in `chrome.storage.local`. The history is not transmitted, synced or uploaded. |
| `clipboardWrite` | Lets **Copy embed snippet** place the HTML embed code on the clipboard after the user clicks it. |

## Data-use disclosures

- **Collects user data:** No. Audit history remains in local extension storage and is not transmitted or sold.
- **Remote code:** No. All extension code is packaged locally.
- **Analytics:** None.
- **Automated Google actions:** None. The Add action opens Google's page and the user completes the add there.
- **Developer Programme Policies:** certify only in the dashboard at submission time.

## Screenshot storyboard

Five genuine 1280 x 800 captures are ready under `store-assets/screenshots/`. Each keeps the native popup pixels unscaled on a padded canvas. Do not submit fabricated states.

1. **Complete checklist:** `preferred-sources-chrome-checker-complete-checklist-1280x800.png`. Alt: `Chrome Site Checker complete Preferred Sources implementation checklist on the auto-mode fixture.` Caption: `Check a Preferred Sources installation from the current tab.`
2. **Manual mode warning:** `preferred-sources-chrome-checker-manual-mode-warning-1280x800.png`. Alt: `Chrome Site Checker manual-mode result showing no deeplink fallback and a custom trigger note.` Caption: `See the manual trigger guidance and missing fallback.`
3. **Broken install:** `preferred-sources-chrome-checker-broken-install-fix-1280x800.png`. Alt: `Chrome Site Checker broken-install result showing missing SDK and a wrong-domain fallback warning.` Caption: `See the failed check and the next fix.`
4. **Hidden button:** `preferred-sources-chrome-checker-hidden-button-warning-1280x800.png`. Alt: `Chrome Site Checker warning that the Preferred Sources button is present but hidden.` Caption: `Spot a button that is present but hidden.`
5. **Missing async:** `preferred-sources-chrome-checker-sdk-no-async-warning-1280x800.png`. Alt: `Chrome Site Checker warning that publisher.js is loaded without async.` Caption: `Catch an SDK script that is missing async.`

## Promotional assets

- Named product logo: `store-assets/preferred-source-checker-logo.png` (512 x 512 PNG).
- Small tile: `store-assets/add-as-preferred-source-chrome-promo-440x280.png` (440 x 280 PNG).
- Marquee: `store-assets/add-as-preferred-source-chrome-marquee-1400x560.png` (1400 x 560 PNG).
- Store icon: `preferred-source-checker/icons/icon-128.png` (128 x 128 PNG). This is the symbol-only small-format export; the named logo appears in the listing artwork and repository.
- Screenshots: the five genuine 1280 x 800 PNGs listed in the storyboard above.

## Pre-live checklist

- [ ] Confirm the public privacy policy URL remains available and returns the intended Opace policy.
- [x] Privacy disclosure date and contact completed from the verified public policy evidence.
- [ ] Complete a Chrome load-unpacked pass on the current stable Chrome and verify the required manual criteria in `BUILD-REPORT.md`.
- [ ] Capture five distinct 1280 x 800 screenshots from the real popup. Check text, crop, contrast and privacy.
- [ ] Prepare the 440 x 280 promotional tile and inspect its dimensions.
- [ ] Confirm the manifest, permissions, package version and privacy answers match the submitted ZIP.
- [ ] Submit only after the owner approves the listing, assets and privacy contact.

## Canonical links

- [Preferred Sources product hub](https://opace.agency/add-as-preferred-source-button-for-google/)
- [Online eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/)
- [Button and embed-code generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/)
- [Opace SEO services](https://opace.agency/services/seo/)
- [Opace Digital Agency](https://opace.agency/)
- [Opace Digital Agency GitHub organisation](https://github.com/OpaceDigitalAgency)
