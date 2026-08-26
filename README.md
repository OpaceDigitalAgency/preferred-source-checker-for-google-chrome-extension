# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Chrome Site Checker

![Add as Preferred Source Button and Popup for Google Chrome Site Checker for SEO and AI Overviews](store-assets/add-as-preferred-source-chrome-marquee-1400x560.png)

*Audit a Preferred Sources button and popup installation from Chrome without transmitting scan data.*

The Chrome Site Checker is the companion audit surface for **Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)**. It checks a site's Google Preferred Sources setup from the current tab. It classifies domain eligibility, checks the publisher SDK, mode, button element and fallback deeplink, then gives practical fix guidance. It audits locally; it does not install or add the button for you.

**Status:** built and tested: 33/33 automated checks passed on 26 August 2026. The extension has not been submitted to the Chrome Web Store.

The package is Manifest V3 and currently uses `activeTab`, `scripting`, `storage` and `clipboardWrite`. There is no background worker, persistent content script, remote code or analytics service.

## What it checks

| Check | Result |
| --- | --- |
| Eligibility | Domain, `www`, subdomain and common subdirectory cases, with public-suffix handling for domains such as `.co.uk`. |
| Implementation | SDK URL and `async`, automatic or manual mode, button visibility and rendered Google iframe where present. |
| Fallback | Valid Google preferences links and whether their `q` value matches the current site. |
| Actions | A personalised embed snippet to copy, plus a link that opens Google's source preferences page for the user to complete. |

The scan covers the current page only. Eligibility also depends on Google recognising the site as a source, which the extension cannot verify automatically. The verify link opens Google's source tool for a manual check.

## Screenshots

Five genuine 1280 × 800 captures from the working extension are ready under [`store-assets/screenshots/`](store-assets/screenshots/). Each retains the popup at its native dimensions on an honest padded canvas and shows a distinct fixture state: complete checklist, manual mode with no fallback, broken installation, hidden button and missing async attribute. Filenames, alt text and captions are recorded in [`store-listing.md`](store-listing.md).

## Privacy and boundaries

The detector reads page markup when you open the popup and does not change the page. Audit metadata is written to `chrome.storage.local` on the device: host, display domain, date, eligibility state, summary and implementation counts. That local history is not transmitted, synced or uploaded, and v1 has no history screen.

The extension does not make background requests or send scan data to a service. When you click **Add as preferred on Google**, it opens Google's source preferences page for the current display domain in a new tab. You complete the add on Google's page; the extension does not click, fill or automate that page. The Verify, generator and Opace links also open only after you choose them. These user-triggered navigations are distinct from silent data transmission.

The public policy link for this Chrome companion is Opace's canonical [Privacy & Cookie Policy](https://opace.agency/privacy-policy/). The extension-specific disclosure, including local storage and user-triggered navigation, is kept in [`store-listing.md`](store-listing.md) for the pending Chrome Web Store submission.

Google's SDK exposes `preferredSource.init({ theme, lang })` and `preferredSource.addPreferredSource()`, but no completion callback, promise or event. The extension can report detected markup and clicks on its own controls, not a confirmed preferred-source addition.

This is an independent Opace tool. It is not affiliated with, endorsed by or sponsored by Google. The Chrome Web Store listing is a local candidate and has not been submitted.

## Install and run a check

1. Open `chrome://extensions` and enable **Developer mode**.
2. Choose **Load unpacked** and select `preferred-source-checker/`.
3. Open a live public website and click the extension icon. The Add and Copy actions are unavailable on `localhost`, IP addresses, browser pages and local files because those are not public domains.
4. Use **Re-scan page** after an asynchronously loaded button has had time to render. The Add action opens Google's preferences page; it does not add the site automatically.

For the local detector matrix, see [`test-fixtures/README.md`](test-fixtures/README.md). The fixture server is for implementation checks; localhost will correctly show eligibility state E5.

## Development and verification

From this directory, run:

```sh
node preferred-source-checker/tools/run-tests.mjs
```

The test command covers eligibility states, fixtures F1 to F9 equivalents, checklist derivation, snippet generation and local history CSV behaviour. `BUILD-REPORT.md` records the complete 33/33 result, syntax and manifest checks, and the acceptance items that still need a human load-unpacked session in Chrome.

The reusable modules in `preferred-source-checker/lib/` are dependency-free and contain no Chrome API calls. They are designed for a future Preferred Sources panel in Opace's [Essential SEO Toolkit](https://chromewebstore.google.com/detail/essential-seo-toolkit-seo/icagkiolfkmndbggheneeamfbnobcdma), not as a second source of product behaviour.

## Links

- [Preferred Sources product hub](https://opace.agency/add-as-preferred-source-button-for-google/)
- [Online eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/)
- [Button and embed-code generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/)
- [Live framework component demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/)
- [Preferred Sources WordPress plugin repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google-wordpress-plugin)
- [Preferred Sources framework packages repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google)
- [Opace Digital Agency on GitHub](https://github.com/OpaceDigitalAgency)
- [Opace SEO services](https://opace.agency/services/seo/)
- [Opace Digital Agency](https://opace.agency/)

## Support, contribution and licence

For product guidance, start with the [online eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/). Code issues and proposed changes belong in the [Chrome extension repository](https://github.com/OpaceDigitalAgency/preferred-source-checker-for-google-chrome-extension). Keep detector changes aligned with [Google's Preferred Sources documentation](https://developers.google.com/search/docs/appearance/preferred-sources) and the extension specification.

The extension and reusable modules are released under the [MIT licence](preferred-source-checker/LICENSE).
