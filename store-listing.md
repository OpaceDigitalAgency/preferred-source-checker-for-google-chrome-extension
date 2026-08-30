# Add as Preferred Source Button & Popup for Google — Chrome Site Checker

Version 1.0.1 is published publicly in the Chrome Web Store. The live title, icon, summary, screenshots and version were verified on 30 August 2026.

## Listing fields

- **Name:** `Add as Preferred Source Button & Popup for Google`
- **Product modifier:** `Chrome Site Checker` (the extension audits the implementation; it does not install the button)
- **Category:** `Developer Tools`
- **Language:** `English`
- **Price:** Free
- **Website / homepage:** `https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-checker/`
- **Support URL:** `https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-checker/`
- **Privacy policy URL:** `https://opace.agency/privacy-policy/` (verified HTTP 200 on 26 August 2026; Opace's canonical public policy)
- **Item ID:** `dnifhlampnjpfigeniaoihblbdegijgp`
- **Dashboard URL:** `https://chrome.google.com/u/4/webstore/devconsole/4a1d0b88-3c43-484f-90ed-cb4156de16bb/dnifhlampnjpfigeniaoihblbdegijgp/edit`
- **Publisher:** Opace Digital Agency
- **Public listing:** `https://chromewebstore.google.com/detail/add-as-preferred-source-b/dnifhlampnjpfigeniaoihblbdegijgp`
- **Release state:** Version 1.0.1 published publicly
- **Initial release:** 28 August 2026
- **Latest update:** 30 August 2026
- **Privacy contact:** `info@opace.co.uk` (verified against Opace's public privacy policy on 26 August 2026).

## Short description

Maximum 132 characters:

```text
Check Google Preferred Sources eligibility, button and popup setup, and fallback links on any page.
```

## Full description

```text
Add as Preferred Source Button & Popup for Google audits the Preferred Sources implementation on the page you are viewing. This free Chrome companion checks domain eligibility, the publisher SDK, button setup and fallback-link health, then provides practical fixes.

WHAT IT CHECKS

• Domain and subdomain eligibility, including common publication paths such as /blog
• Whether publisher.js or publisher.mjs is loaded and uses async
• Automatic or manual rendering mode
• Whether the button element is present, visible and populated
• Whether the fallback preferences link is valid and matches the current site
• A ready-to-copy automatic-mode embed with a no-JavaScript fallback

The Add action opens Google's public source-preferences page for the current domain. You complete the addition there. The extension does not click, fill or automate that page, and it cannot report a confirmed addition.

WHO IT HELPS

Publishers, SEO consultants and agencies can use the checker after installing a Preferred Sources button, or while diagnosing a missing SDK, hidden control, mismatched fallback domain or subdirectory assumption.

LOCAL-FIRST PRIVACY

The scan runs in your browser and does not modify the page. Audit metadata is stored only in chrome.storage.local on your device. There is no remote code, background analytics service or upload of scan results.

The activeTab and scripting permissions support the one-off page check. storage keeps local audit history, and clipboardWrite copies the embed only after you choose that action.

LIMITATIONS

The checker reports the markup and configuration visible on the current page. It cannot determine whether Google recognises a publication, guarantee rankings or traffic, or confirm inclusion in Top Stories, AI Mode or AI Overviews.

PRODUCT AND SUPPORT

Product hub:
https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/

Online checker and support:
https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-checker/

Button and code generator:
https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-generator/

Source code:
https://github.com/OpaceDigitalAgency/preferred-source-checker-for-google-chrome-extension

Built by Opace Digital Agency. This independent extension is not affiliated with, endorsed by or sponsored by Google. Google is a trademark of Google LLC.
```

## Privacy policy text

The public policy URL above is Opace's canonical Privacy & Cookie Policy and currently returns HTTP 200. Paste the extension-specific disclosure below into the dashboard where permitted.

```text
Privacy Policy: Add as Preferred Source Button & Popup for Google — Chrome Site Checker
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

| Permission       | Justification                                                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeTab`      | Reads the current tab's URL for eligibility and permits one-off script injection when the user opens the popup. Access is limited to the tab where the user invokes the extension.                |
| `scripting`      | Injects a small, read-only detector into the current page to inspect Google's SDK script, button elements and fallback links. There is no persistent content script and the page is not modified. |
| `storage`        | Stores the user's own audit history locally in `chrome.storage.local`. The history is not transmitted, synced or uploaded.                                                                        |
| `clipboardWrite` | Lets **Copy embed snippet** place the HTML embed code on the clipboard after the user clicks it.                                                                                                  |

## Data-use disclosures

- **Collects user data:** No. Audit history remains in local extension storage and is not transmitted or sold.
- **Remote code:** No. All extension code is packaged locally.
- **Analytics:** None.
- **Automated Google actions:** None. The Add action opens Google's page and the user completes the add there.
- **Developer Programme Policies:** certify only in the dashboard at submission time.

The three developer-policy certifications are intentionally unchecked in the saved draft. David must read and certify them, save the draft and decide whether to click **Submit for review**.

## Screenshot storyboard

Five genuine 1280 x 800 captures are ready under `store-assets/screenshots/`. Each shows the real extension against its matching local fixture and is tightly framed for legibility. Do not submit fabricated states.

1. **Local fixture audit:** `preferred-sources-chrome-checker-local-fixture-audit-framed-1280x800.png`. Alt: `Chrome Site Checker on a localhost fixture showing a rendered SDK button alongside local-domain and deeplink limitations.` Caption: `Test implementation details locally while keeping localhost eligibility and deeplink limits explicit.`
2. **Manual mode warning:** `preferred-sources-chrome-checker-manual-mode-warning-framed-1280x800.png`. Alt: `Chrome Site Checker manual-mode result showing no deeplink fallback and a custom trigger note.` Caption: `See the manual trigger guidance and missing fallback.`
3. **Broken install:** `preferred-sources-chrome-checker-broken-install-fix-framed-1280x800.png`. Alt: `Chrome Site Checker broken-install result showing missing SDK and a wrong-domain fallback warning.` Caption: `See the failed check and the next fix.`
4. **Hidden button:** `preferred-sources-chrome-checker-hidden-button-warning-framed-1280x800.png`. Alt: `Chrome Site Checker warning that the Preferred Sources button is present but hidden.` Caption: `Spot a button that is present but hidden.`
5. **Missing async:** `preferred-sources-chrome-checker-sdk-no-async-warning-framed-1280x800.png`. Alt: `Chrome Site Checker warning that publisher.js is loaded without async.` Caption: `Catch an SDK script that is missing async.`

## Promotional assets

- Named product logo: `store-assets/preferred-source-checker-logo.png` (512 x 512 PNG).
- Small tile: `store-assets/add-as-preferred-source-chrome-promo-440x280.png` (440 x 280 PNG).
- Marquee: `store-assets/add-as-preferred-source-chrome-marquee-1400x560.png` (1400 x 560 PNG).
- Store icon: `preferred-source-checker/icons/icon-128.png` (128 x 128 PNG). This is the symbol-only small-format export; the named logo appears in the listing artwork and repository.
- Screenshots: the five genuine 1280 x 800 PNGs listed in the storyboard above.

## Pre-live checklist

- [x] Confirm the public privacy policy URL remains available and returns the intended Opace policy.
- [x] Privacy disclosure date and contact completed from the verified public policy evidence.
- [x] Load the unpacked build in stable Chrome and smoke-test the F1 local audit and F4 broken-install states.
- [x] Capture five distinct 1280 x 800 screenshots from the real popup. Check text, crop, contrast and privacy.
- [x] Prepare the 440 x 280 promotional tile and inspect its dimensions.
- [x] Confirm the manifest, permissions, package version and privacy answers match the held upload ZIP.
- [x] Save the listing, assets, privacy, distribution and reviewer instructions in a separate Opace Digital Agency draft.
- [ ] David reads and ticks the three developer-policy certifications, saves the draft and decides whether to click Submit for review.

## Canonical links

- [Preferred Sources product hub](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/)
- [Online eligibility checker](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-checker/)
- [Button and embed-code generator](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-generator/)
- [Opace SEO services](https://opace.agency/services/seo/)
- [Opace Digital Agency](https://opace.agency/)
- [Opace Digital Agency GitHub organisation](https://github.com/OpaceDigitalAgency)
