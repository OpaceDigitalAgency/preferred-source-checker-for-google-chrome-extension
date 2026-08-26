# Preferred Source Checker for Google — Chrome Extension

Audit any website's Google Preferred Sources setup from your toolbar: eligibility analysis (domain, subdomain or the ineligible subdirectory shape), a four-point implementation check (SDK loaded, auto or manual mode, button element present, deeplink fallback), one-click add via Google's preferences deeplink, and copy-paste embed code for the current domain. 100% local — no data leaves the browser.

**Status:** built and tested (33/33 automated checks), awaiting Chrome Web Store submission. Manifest V3, minimal permissions (`activeTab`, `scripting`, `storage`, `clipboardWrite`), no background worker, no remote code.

## Structure

- `preferred-source-checker/` — the extension (load this folder unpacked at chrome://extensions with Developer mode on)
- `store-listing.md` — final Chrome Web Store name, descriptions, screenshot storyboard and privacy policy text
- `test-fixtures/` — local HTML pages exercising every detector state (correct install, manual mode, broken install, no install, subdirectory blog)

The eligibility and detector modules are dependency-free ES modules with no `chrome.*` calls, designed to drop into Opace's [Essential SEO Toolkit](https://chromewebstore.google.com/detail/essential-seo-toolkit-seo/icagkiolfkmndbggheneeamfbnobcdma) as a v2 panel.

## Links

- Product home: https://opace.agency/add-as-preferred-source-button-for-google/
- Eligibility checker (web): https://opace.agency/add-as-preferred-source-button-for-google/button-checker/
- Button generator: https://opace.agency/add-as-preferred-source-button-for-google/button-generator/
- WordPress plugin: https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google-wordpress-plugin
- Framework packages: https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google

Built by [Opace](https://opace.agency/), a UK digital agency in Birmingham. Independently developed; not affiliated with, endorsed by or sponsored by Google.
