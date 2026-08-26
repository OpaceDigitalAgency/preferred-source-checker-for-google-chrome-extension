# Test fixtures — Preferred Source Checker for Google

Static pages implementing the spec §7.1 test matrix. Serve them over http —
the extension deliberately refuses `file://` pages (state X2):

    cd test-fixtures
    python3 -m http.server 8000

Then open e.g. http://localhost:8000/f1-auto-mode.html and click the
extension icon. On localhost the eligibility card shows E5 (`Not checkable`)
by design; the implementation checklist still runs. To exercise E1–E4,
host this directory on a public domain (e.g. GitHub Pages) — F8 (subdomain)
is F1 served from a subdomain of that host, so it needs real hosting and has
no separate file here.

| File | Spec fixture | What it exercises |
| :-- | :-- | :-- |
| f1-auto-mode.html | F1 | async SDK, auto mode, themed button, matching deeplink (`q=localhost`) |
| f2-manual-mode.html | F2 | manual mode, inline PREFERRED_SOURCE queue, custom trigger, no deeplink |
| f3-empty.html | F3 | no SDK, no button, no deeplink |
| f4-broken-install.html | F4 | button div without SDK; deeplink `q=other-domain.com` |
| f5-hidden-button.html | F5 | SDK + button with `display:none` |
| f6-no-async.html | F6 | SDK script without `async` |
| blog/sample-post/index.html | F7 | F1 content under `/blog/…` (subdirectory advisory on a public host) |
| f9-mjs.html | F9 | SDK loaded as `publisher.mjs` |

F1/F5/F6/F9 attempt to load the real Google SDK; where it does not render in
your environment, the ⚠ "hasn't rendered" path is the expected (and correct)
result — see spec §7.1.
