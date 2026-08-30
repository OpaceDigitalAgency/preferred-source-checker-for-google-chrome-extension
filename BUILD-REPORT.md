# Build report — Add as Preferred Source Button & Popup for Google — Chrome Site Checker

**Built:** 26 August 2026
**Release state updated:** 30 August 2026
**Spec:** `specs/04-chrome-extension-spec.md` v1.0 (sole input)
**Output:** `build/chrome-extension/preferred-source-checker/` (loadable unpacked as-is)

## What was built

```
preferred-source-checker/
├── manifest.json                  MV3, matches spec §3.2 exactly; no background,
│                                  no content_scripts, no host_permissions
├── _locales/en/messages.json      name + description keys (store hygiene)
├── icons/icon-{16,32,48,128}.png  generated programmatically (see Icons below)
├── assets/icon.svg                icon design source (star + magnifier on Opace blue)
├── popup/
│   ├── popup.html                 §4.9 structure contract, lang="en-GB"
│   ├── popup.css                  all rules scoped under .psc-panel; light/dark
│   │                              via prefers-color-scheme; §4.5 tokens verbatim;
│   │                              all motion inside prefers-reduced-motion gates
│   └── popup.js                   orchestrator: tab query → URL gating (X1/X2/X3)
│                                  → eligibility → detector injection → render;
│                                  deeplink open, copy snippet + textarea fallback,
│                                  re-scan with 500 ms debounce, offline banner (X5),
│                                  silent history recording
├── lib/
│   ├── detector.js                UMD-lite, dependency-free, chrome-free, read-only
│   ├── detector-inject.js         companion; injected after detector.js so its final
│   │                              expression becomes the executeScript result
│   ├── eligibility.js             pure analyse(url) → E1–E6; chrome-free
│   ├── psl-lite.js                ~190-entry curated public-suffix subset + matcher
│   ├── strings.js                 every user-facing string, verbatim spec copy;
│   │                              PSC_MODULE_VERSION = '1.0.1'
│   ├── render.js                  checklist derivation (§2.2.4) + DOM rendering;
│   │                              chrome-free (tab opening delegated via opts.openTab)
│   └── history.js                 createHistory(storageKey) — cap 200, one entry per
│                                  host per UTC day, RFC 4180 toCsv (v1 silent, §2.5)
├── tools/                         dev-only, exclude from store zip
│   ├── generate-icons.cjs         pure-Node PNG rasteriser (zlib only)
│   └── run-tests.mjs              test harness (see Verification)
├── package.json                   dev-only ("type": "module" for Node tests) —
│                                  exclude from store zip
└── LICENSE                        MIT
```

Sibling deliverables in `build/chrome-extension/`:

- `store-listing.md` — final store name, short/full description, category, screenshot storyboard, promo tile direction, privacy policy, single-purpose justification, permission justifications, data-use answers (all verbatim from spec §5).
- `test-fixtures/` — F1 (auto), F2 (manual + queue), F3 (empty), F4 (broken install, wrong `q`), F5 (hidden button), F6 (no async), F7 (`/blog/sample-post/` subdirectory), F9 (mjs), plus a README with serving instructions. F8 (subdomain) needs real hosting — see Deferrals.

## 28 August release-candidate correction

- Updated the manifest and popup footer to the current canonical checker URL: `https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-checker/`.
- Rebuilt `preferred-source-checker-1.0.0.zip` from the runtime files only. The enlarged bookmark-and-star transparent-icon candidate archive is 46,989 bytes with SHA-256 `4d5d305200fcebecd00909f316e87ab0d5932b7b6dbe8099d67a21f3be56bd2a`.
- Relabelled the first store frame as a localhost fixture audit. It no longer implies a complete public-domain/deeplink pass that the genuine capture does not show.
- Removed the review-state sentence from the public store description while preserving the internal not-submitted status outside the copy block.

## Chrome Web Store draft — 28 August 2026

- Confirmed the signed-in publisher as **Opace Digital Agency** and kept the existing Essential SEO Toolkit item unchanged.
- Created a separate draft for this extension: item ID `dnifhlampnjpfigeniaoihblbdegijgp` under publisher account `4a1d0b88-3c43-484f-90ed-cb4156de16bb`.
- Uploaded the exact 44,003-byte v1.0.0 ZIP and saved the complete listing: Developer Tools category, full description, homepage, support URL, 128 px icon, five localised 1280 x 800 screenshots, 440 x 280 small tile and 1400 x 560 marquee tile.
- Saved the privacy declarations, four permission justifications, no-remote-code answer, privacy-policy URL, public/all-regions distribution and reviewer instructions. No user-data collection categories are selected.
- Left the three developer-policy certifications unchecked and **Submit for review** untouched for David. The dashboard confirmed that certification is the only remaining submission blocker.
- Loaded the unpacked build in stable Chrome and smoke-tested the F1 local fixture and F4 broken-install fixture. F1 reported the expected localhost eligibility limit while detecting the SDK, auto mode and rendered button; F4 correctly reported the missing SDK and wrong-domain deeplink.

## Chrome Web Store publication — 29 August 2026

- The publisher dashboard visibly reports the dedicated item as **Published - public**. Its direct public URL resolves to the correct listing at `https://chromewebstore.google.com/detail/add-as-preferred-source-b/dnifhlampnjpfigeniaoihblbdegijgp`.
- Chrome Web Store search had not indexed the newly published item at the user's first check. Google's discovery documentation says a recently published extension can take a few hours to appear and advises checking the selected Distribution regions.
- Version 1.0.1 became the public package on 30 August 2026; the live listing exposes `Version 1.0.1` and `Updated August 30, 2026`.

## Version 1.0.1 listing refresh — 29 August 2026

- Chrome Web Store approval completed on 30 August 2026. The public listing is `https://chromewebstore.google.com/detail/add-as-preferred-source-b/dnifhlampnjpfigeniaoihblbdegijgp`.

- Shortened the package title to `Add as Preferred Source Button & Popup for Google` and replaced the summary with a 99-character implementation-check description.
- Rebuilt `preferred-source-checker-1.0.1.zip` from 17 runtime files in 22 archive entries. The final archive is 46,941 bytes with SHA-256 `8decfcad00539097f23645c5d587f2c3987947cb8eeeaa7d5df3c1540f40cfe5`; every archived file byte-matches the current runtime source.
- Canonicalised the in-extension generator URL to the live `/tools/suite/` route.
- Replaced the Store icon with the large orange bookmark, navy star and cyan-corner mark; refreshed the 440 × 280 and 1400 × 560 promotional tiles to the same identity.
- Recaptured all five genuine Store screenshots from the real v1.0.1 extension. Each is a unique 1280 × 800 RGB PNG and visibly reports `v1.0.1` for its matching fixture state.
- Reduced the Store description to the extension's single purpose, checks, privacy, limits and canonical support links. Chrome processed and published this v1.0.1 listing on 30 August 2026.

## Design decisions within spec latitude

- **Detector `qMatchesSite`:** the detector is chrome-free and PSL-free, so it compares the deeplink `q` (lowercased, `www.` stripped) against the page host and the host minus `www.` — equivalent to "displayDomain or full host" for every case the spec enumerates.
- **Mode `mixed`** derives row 3 on the auto path (SDK is present and may render), which the spec leaves open; row 2 carries the ⚠ conflict message.
- **Fix-it code styling:** angle-bracket snippets inside fix-it copy are wrapped in `<code>` via a text splitter; everything is inserted with `textContent`/`createTextNode` — no `innerHTML` for any dynamic or copy content (the only `innerHTML` use is the static glyph SVG table in `render.js`).

## Icons

`icons/icon-*.png` now use a bold orange bookmark with a navy preferred-source star and a small cyan corner accent on a genuinely transparent canvas. The painted mark occupies roughly 94% of Chrome's square icon slot so it has the same perceived size as strong square and octagonal extension icons instead of reading as a narrow ribbon. It remains legible at 16 px and 32 px, visually distinct from Essential SEO Toolkit's magnifier-and-bars mark and does not use Google's protected `G` artwork or imply Google ownership. The 16, 32, 48 and 128 px runtime exports and the 128 px Store icon are RGBA PNGs with real zero-alpha pixels. The earlier dark-background exports are preserved under `store-assets/archive/2026-08-29-dark-background/`; the rejected document-and-check candidate is preserved under `store-assets/archive/2026-08-29-rejected-document-check/`; the smaller bookmark candidate is preserved under `store-assets/archive/2026-08-29-before-large-footprint/`. The Store screenshots and promotional banners were refreshed separately for v1.0.1.

The current generated exports are valid, dimension-checked and packaged locally. The 440 × 280 and 1400 × 560 tiles use the same bookmark identity, while the five retained fixture scenarios have been recaptured from v1.0.1.

## Verification results

All run 26 Aug 2026 on Node v24.2.0 (macOS):

1. **Syntax:** `node --check` (module or script mode as appropriate) passes for all 9 JS files: `eligibility.js`, `psl-lite.js`, `strings.js`, `render.js`, `history.js`, `popup.js`, `detector.js`, `detector-inject.js`, `run-tests.mjs`, `generate-icons.cjs`.
2. **JSON:** `manifest.json` and `_locales/en/messages.json` parse cleanly; permissions and MV3 structure follow spec §3.2, with the approved family name and ≤132-character local audit description applied.
3. **Reusability grep (AC31):** `grep 'chrome\.'` over `detector.js`, `eligibility.js`, `psl-lite.js`, `strings.js` → zero matches.
4. **Node test harness** (`node preferred-source-checker/tools/run-tests.mjs` from this repository root): **33 passed, 0 failed.** Coverage against the spec's test matrix:
   - Eligibility AC1–AC6: www apex → E1, subdomain → E2 (full host), `/blog` → E3, `.co.uk` PSL → `bbc.co.uk`, localhost/IP → E5, `blogging` non-trigger → E1, chrome:///unparseable → E6, plus E4 and PSL-subdomain cases.
   - Detector + derivation AC7–AC13 via fake-DOM equivalents of F1–F6/F9: all row glyphs, verbatim status phrases, chips (`theme: dark`, `lang: en`, `SDK: publisher.js`/`publisher.mjs`), summary keys, generator-link condition; plus mixed-mode, preload-only, deeplink-only, www-q-match and wrong-pathname-anchor cases.
   - History §2.5: same-host-same-UTC-day overwrite, 200-entry cap, CSV header and RFC 4180 quoting.
   - Snippet §2.4: exact template with substituted domain, 7 lines, real newlines.
5. **Icons:** all four PNGs verified as valid `PNG image data … RGBA` at the correct dimensions; 128 px render visually inspected.

Note on the harness: the detector is exercised against fake-DOM constructions equivalent to the fixtures, not by parsing the fixture HTML files; the files in `test-fixtures/` are for manual in-browser testing.

## Load-unpacked manual test steps

1. `chrome://extensions` → enable Developer mode → **Load unpacked** → select `build/chrome-extension/preferred-source-checker/`. Expect zero manifest warnings.
2. Serve the fixtures: `cd build/chrome-extension/test-fixtures && python3 -m http.server 8000`.
3. Open `http://localhost:8000/f1-auto-mode.html`, click the extension icon. Expect: eligibility E5 (`Not checkable` — localhost, by design), deeplink/copy buttons disabled with tooltip `Needs a public domain`, checklist: SDK ✓, Mode ✓ Auto, Button ✓ or ⚠ "hasn't rendered" (matches whether Google's SDK rendered), Deeplink ✓.
4. Repeat on f2–f6, f9 and `/blog/sample-post/` and compare against the fixture README table.
5. Visit `https://www.bbc.co.uk/news` — expect E1 for `bbc.co.uk` (PSL), the www note, an amber `/news/` advisory (E3), verify link to `https://www.google.com/preferences/source?q=bbc.co.uk`.
6. Click **Add as preferred on Google** — exactly one new tab opens at the deeplink; confirm no content scripts appear in that tab's DevTools → Sources.
7. Click **Copy embed snippet** — `Copied ✓` for ~1.5 s; paste and compare with §2.4 template.
8. Empty states: `chrome://extensions` → X1; a `file://` page → X2; DevTools → Network offline → X5 banner.
9. Toggle OS dark mode and `prefers-reduced-motion`; tab through the whole popup; open a fix-it row with Enter/Space.
10. Inspect `chrome.storage.local` (popup DevTools → `chrome.storage.local.get('auditHistory', console.log)`) — one entry per host per day.

## Deferrals

- **v1.1 features (per spec §2.5):** history UI, CSV export UI, `Clear history` — storage layer ships in v1 and is recording silently; no UI built, as specified.
- **F8 subdomain fixture:** requires the fixture set hosted on a real domain with a subdomain (e.g. GitHub Pages); cannot be exercised from localhost.
- **Store processing:** complete for v1.0.1; the public page exposes the approved version and updated date.
- **Screenshot capture:** a dedicated Chrome profile loaded v1.0.1 and exercised F1, F2, F4, F5 and F6. The five final PNGs are unique 1280×800 RGB canvases; filenames, alt text and captions are recorded in `store-listing.md`.
- **Promotional assets:** the reviewed and uploaded files are dimension-checked under `store-assets/`: `add-as-preferred-source-chrome-promo-440x280.png` (440×280 PNG), `add-as-preferred-source-chrome-marquee-1400x560.png` (1400×560 PNG), `preferred-source-checker-logo.png` (512×512 PNG) and `add-as-preferred-source-chrome-icon-128.png` (128×128 PNG).
- **Remaining extended manual matrix:** the stable-Chrome F1/F4 smoke pass is complete. AC14 (SDK-blocked re-scan flow), AC16 (300 ms timing), AC17/AC19/AC30 (tab/network observation), AC22 (offline), AC23–AC27 (full rendering, contrast, keyboard, screen-reader and reduced-motion sweep) and a Chrome 116-specific pass remain useful post-draft QA rather than evidence supplied by the Node harness.
- **Privacy disclosure:** the verified public policy URL is `https://opace.agency/privacy-policy/` (HTTP 200). The extension-specific disclosure records `26 August 2026` and `info@opace.co.uk`, verified against the public Opace policy.
- **Essential SEO Toolkit integration (§8):** future work by design; the six reusable files and message contract are ready.
