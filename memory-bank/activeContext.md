# Active Context

## Current Work Focus
**Bug fix: Android tab-switch not working.** OpenSpec change
`2026-08-17-fix-tab-switch-android` — spec + artifacts created, applied, pending
archiving after Android runtime verification.

## Status Summary
- **Phases 1–4 are implemented and archived.** The app is a fully functional
  session-scoped PWA: users can add, edit, and delete transactions, see a running
  balance in Indonesian Rupiah, navigate via the bottom tab bar, and install the
  app on Android.
- **Android tab-switch bug FIXED.** Root cause was **not** touch events — it was an
  initialization-ordering failure. `index.html` loads `constants.js` as an external
  `<script>`, and Android Chrome **blocks external scripts under `file://`**, so
  `populateSelects()` (the first statement of `DOMContentLoaded`) threw
  `ReferenceError: CATEGORIES is not defined`, aborting init *before* the bottom-tab
  listeners were attached. A prior `touchend`/`preventDefault` attempt (commit
  `f034b0c`) couldn't help because the listeners were never registered.
- **Fix applied**: `populateSelects()` now guards with
  `typeof CATEGORIES === 'undefined'` and bails out gracefully, so init always
  completes and the tab listeners attach. `README.md` was corrected (it falsely
  claimed "all CSS and JS are inline"); Android `file://` users are now steered to
  a local HTTP server for full functionality (populated dropdowns + SW).
- **OpenSpec**: bug-fix spec `tab-switch-android` + change `2026-08-17-fix-tab-switch-android`
  created and applied; archiving pending the Android runtime verification.

## Recent Changes
| Phase / Change | Date | Description |
|---|---|---|
| Bug fix — tab-switch-android | 2026-08-17 | Root cause: `constants.js` blocked by Android `file://` → `populateSelects()` throws → aborts `DOMContentLoaded` before tab listeners attach. Fix: `typeof` guard in `populateSelects()`; README corrected. |
| Phase 4 | 2026-08-14 | Cashflow entries (full form), entry constants (`constants.js`), money formatting (Rupiah). |
| Phase 3 | 2026-08-14 | App navigation (bottom tab bar, list/add views) and transaction actions (overflow menu with edit/delete). |
| Phase 2 | 2026-08-14 | Basic transaction list and running balance. |
| Phase 1 | 2026-08-14 | Scaffold: Hello World, PWA manifest, service-worker stub. |

## Next Steps
1. **Android runtime verification (pending user)**: confirm tabs switch under
   `file://` after the guard, and that Category/Account dropdowns populate over
   HTTP. Non-circular check: `chrome://inspect` → console →
   `document.querySelectorAll('#category option').length` (should be 0 under
   file://, >0 over HTTP).
2. **Phase 5 (planned)**: Implement data persistence (IndexedDB or `localStorage`)
   so transactions survive page reloads; revise `sw.js` with a cache-first
   app-shell strategy.
3. **Spec maintenance**: sync `cashflow-entries` account values (`Primary, Istri,
   Savings`) to match `constants.js` (currently `Cash, Checking, Savings` in spec).
4. **(Optional follow-up)** Remove the now-redundant `touchend`/`preventDefault`
   handlers on the tabs — `click` alone suffices under `touch-action:
   manipulation`. Kept out of scope for this fix to minimise the diff.

## Active Decisions & Considerations
- **Serve over HTTP on Android**: Opening `src/index.html` directly via `file://`
  on Android Chrome blocks external scripts (`constants.js`, `sw.js`). The
  `populateSelects()` guard keeps tab switching working even in this mode, but
  populated dropdowns and PWA installability require a local HTTP server
  (e.g. `python -m http.server 8080` from `src/`, or a local-server app on Android).
- **Keep `constants.js` external**: Phase 4 deliberately externalized
  categories/accounts for annual updates. The fix respects this (no inlining) —
  it only adds a graceful-degradation guard.
- **Persistence strategy**: Not yet decided — IndexedDB (robust) vs.
  `localStorage` (simpler). Trade-off favours IndexedDB for future-proofing but
  `localStorage` is simpler for the current feature set.
- **Offline caching**: `sw.js` is a stub. A cache-first strategy for the app shell
  (`index.html`, `constants.js`, `manifest.json`, icons) is the minimum for offline
  usability (Phase 5).
- **Spec vs. implementation drift**: The `cashflow-entries` spec lists accounts as
  `Cash, Checking, Savings` but `constants.js` uses `Primary, Istri, Savings`;
  reconcile in a future spec revision.
- **Style note**: The ES5-only brief says "no const/let," but `constants.js` uses
  `const` and the inline script uses `let`. This is pre-existing and unrelated to
  this bug (Android Chrome supports both).

## Important Patterns & Preferences
- **Single-file philosophy**: `index.html` remains the source of truth for markup,
  styles, and logic. External scripts are only used for `constants.js` (annual
  updates) and `sw.js` (PWA lifecycle).
- **No framework**: Continue with vanilla JS. Do not introduce React/Vue/build tools.
- **Spec-driven workflow**: Every change starts with a spec in `openspec/specs/`.
- **New lesson (this fix)**: `file://` on Android Chrome cannot load sibling
  external scripts. Never rely on opening the app via `file://` on Android; serve
  over HTTP. A missing external dependency that throws inside `DOMContentLoaded`
  can silently disable *all* interactivity while the UI still renders.

## Learnings & Project Insights
- Phases were built top-to-bottom (scaffold → nav → actions → data model →
  formatting/constants); each produced an archived OpenSpec change.
- The README's "Phase 3 = data persistence + offline" wording is outdated;
  persistence is the Phase 5 target. Phases 1–4 are archived without persistence.
- `entry-constants` was introduced to externalize lists for annual updates.
- **Bug-fix insight**: A "doesn't work on mobile" report is easy to misdiagnose as
  touch events — this one was an init abort from a blocked external script. Always
  check the console for a `ReferenceError` and confirm listeners were actually
  attached. The failed `touchend`/`preventDefault` attempt (f034b0c) was the
  clue that the listeners were never registered.
