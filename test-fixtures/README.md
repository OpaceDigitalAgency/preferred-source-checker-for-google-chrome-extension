# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Chrome test fixtures

These static pages exercise the Chrome Site Checker detector for **Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)**. They are development fixtures, not public product pages. Serve them over HTTP because the extension intentionally treats `file://` as empty state X2.

## Serve locally

From this directory:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/f1-auto-mode.html`, load the parent `preferred-source-checker/` folder through `chrome://extensions` with Developer mode enabled, then click the extension icon. Localhost should show eligibility state E5 (`Not checkable`), while the implementation detector still runs. The Add and Copy actions are disabled for the local host.

## Fixture matrix

| File                          | Spec case | Expected detector coverage                                                                                                        |
| ----------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `f1-auto-mode.html`           | F1        | Async `publisher.js`, automatic mode, themed button, rendered iframe when Google's SDK responds, matching `q=localhost` deeplink. |
| `f2-manual-mode.html`         | F2        | Manual mode, inline `PREFERRED_SOURCE` queue, custom trigger and no deeplink.                                                     |
| `f3-empty.html`               | F3        | No SDK, button or deeplink. Exercises the not-implemented summary and fix rows.                                                   |
| `f4-broken-install.html`      | F4        | Button without SDK and a deeplink whose `q` points to `other-domain.com`.                                                         |
| `f5-hidden-button.html`       | F5        | Async SDK with a `display:none` button element.                                                                                   |
| `f6-no-async.html`            | F6        | SDK script without `async`.                                                                                                       |
| `blog/sample-post/index.html` | F7        | F1-shaped content under `/blog/`, for the subdirectory advisory on a public host.                                                 |
| `f9-mjs.html`                 | F9        | Async `publisher.mjs` module script.                                                                                              |

F8 is deliberately not a local file: it needs F1 content on a real subdomain. Host a separate test copy on a controlled public domain before testing E2. Do not treat a localhost result as evidence of public-domain eligibility.

## Reading results

F1, F5, F6 and F9 reference Google's real SDK. A test environment may block or delay that request. If no Google iframe appears, the correct result is the amber `hasn't rendered` warning, followed by **Re-scan page** after the page has settled. This is not a fixture failure.

The local F1 and F7 links use `q=localhost` so the local host check is deterministic. If you copy a fixture to a public host, update its deeplink to that host before judging the fallback row. For the public `/blog/` advisory, use a public apex or `www` host; localhost remains E5 and will not produce E3.

## Manual Chrome pass

1. Load `preferred-source-checker/` unpacked and check for manifest warnings.
2. Open each fixture and record the eligibility card, four checklist rows and any fix-it disclosure.
3. On F1, use **Re-scan page** after the SDK has had time to respond. Test both the rendered and blocked/unrendered paths where possible.
4. Confirm **Add as preferred on Google** opens one Google preferences tab and stops there. It does not automate the Google page.
5. Confirm **Copy embed snippet** produces the seven-line template with the current display domain.
6. Check `chrome.storage.local` in popup DevTools. v1 records audit history locally, one host per UTC day, with no history UI yet.

The automated equivalents and their 33/33 result are in `../preferred-source-checker/tools/run-tests.mjs` and `../BUILD-REPORT.md`. From the repository root, run `node preferred-source-checker/tools/run-tests.mjs`.

[Install the public Chrome extension](https://chromewebstore.google.com/detail/add-as-preferred-source-b/dnifhlampnjpfigeniaoihblbdegijgp) · Source: [Chrome extension repository](https://github.com/OpaceDigitalAgency/preferred-source-checker-for-google-chrome-extension) · [Preferred Sources product hub](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/) · [Opace SEO services](https://opace.agency/services/seo/) · [MIT licence](../preferred-source-checker/LICENSE) · [Opace on GitHub](https://github.com/OpaceDigitalAgency)
