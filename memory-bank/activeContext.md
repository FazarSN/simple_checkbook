# Active Context

## Current Work Focus

**Phase 6 — Import / Export.** The `phase-6-import-export` OpenSpec change
(2026-08-21) is **fully implemented in code** and is being documented. The
implementation adds a third "Import/Export" bottom tab to `src/index.html`
with:

- **Export**: serializes the in-memory `transactions` array to a JSON Blob
  download (`checkbook-data.json`), triggered via a hidden anchor.
- **Import**: file picker (`<input type="file">` with `accept=".json"`) →
  `FileReader.readAsText` → `JSON.parse` → `validateImportData()` →
  `confirm()` → replace the entire store → `dbSaveAll()` → re-render.
- **Replace semantics** (not merge): import wipes the current dataset and
  replaces it with the imported transactions, then re-derives `nextId`.
- **Validation before mutation**: imports are fully validated before any
  state change; malformed JSON or non-conformant records are rejected with an
  `alert()` and the store is left untouched.

The syntax check passes (`node --check` on the extracted inline script). The
delta spec has been synced to the main spec (`openspec/specs/data-export-import/`),
and `openspec validate` passes.

## Status Summary
- **Phases 1–4** are implemented and archived. The app is a fully functional
  session-scoped PWA: users can add, edit, and delete transactions, see a
  running balance in Indonesian Rupiah, navigate via the bottom tab bar, and
  install the app on Android.
- **Android tab-switch bug FIXED and archived** (`2026-08-17-fix-tab-switch-android`).
  Root cause was an initialization-ordering failure: `index.html` loaded
  `constants.js` as an external `<script>`, and Android Chrome blocks external
  scripts under `file://`, so `populateSelects()` threw `ReferenceError:
  CATEGORIES is not defined`, aborting init before the bottom-tab listeners were
  attached. A `typeof` guard in `populateSelects()` fixed it.
- **Phase 5 implemented and archived pending** (`phase-5-persistence-offline`):
  inlined `CATEGORIES`/`ACCOUNTS`, IndexedDB persistence, SW app-shell caching,
  and a date field on entries. Applied to code; documentation updated.
- **Phase 6 implemented** (`phase-6-import-export`): third Import/Export tab
  with JSON export (Blob download) and validated JSON import (replace
  semantics, confirm guard). Syntax-checked and validated; pending runtime
  verification and archiving.
- **Current state**: all six phases are implemented in `src/index.html`
    (~1060 lines, ~540 inline JS). `src/style.css` holds extracted CSS.
   `src/constants.js` is deleted. `sw.js` and `manifest.json` are
   unchanged from Phase 5. Ten OpenSpec specs exist in `openspec/specs/`.

## Recent Changes
| Phase / Change | Date | Description |
|---|---|---|
| Phase 6 — import-export (applied, pending archive) | 2026-08-21 | Added third "Import/Export" bottom tab to `index.html` (`EXPORT_FILENAME`, `exportTransactions()`, `validateImportData()`, file-input change handler with confirm → replace → dbSaveAll → re-render). Synced delta spec to main spec. README updated. |
| Phase 5 — persistence & offline (applied, not archived) | 2026-08-20 | Inlined `CATEGORIES`/`ACCOUNTS` into `index.html` (deleted `constants.js`); added IndexedDB persistence (`dbOpen`/`dbSaveAll`/`dbLoadAll`); added app-shell caching to `sw.js` (cache-first, versioned cache, cleanup on activate); added date field to entries. |
| Bug fix — tab-switch-android (archived) | 2026-08-17 | Root cause: `constants.js` blocked by Android `file://` → `populateSelects()` throws → aborts `DOMContentLoaded` before tab listeners attach. Fix: `typeof` guard in `populateSelects()`; README corrected. |
| Phase 4 | 2026-08-14 | Cashflow entries (full form), entry constants (`constants.js`), money formatting (Rupiah). |
| Phase 3 | 2026-08-14 | App navigation (bottom tab bar, list/add views) and transaction actions (overflow menu with edit/delete). |
| Phase 2 | 2026-08-14 | Basic transaction list and running balance. |
| Phase 1 | 2026-08-14 | Scaffold: Hello World, PWA manifest, service-worker stub. |

## Next Steps
1. **Verify Phase 5** — runtime verification: dropdowns populate on Android
   `file://`, transactions persist across reload, app loads offline after first
   visit (HTTP). Then archive `phase-5-persistence-offline`.
2. **Verify Phase 6** — runtime verification: Export downloads JSON, Import
   replaces the store with validation + confirm guard, invalid files rejected.
   Then archive `phase-6-import-export`.
3. **Spec maintenance (carried over)**: sync `cashflow-entries` account values
   (`Primary, Istri, Savings`) to match the inlined constants (spec still lists
   `Cash, Checking, Savings` in some scenarios).

## Active Decisions & Considerations
- **Inlined constants (Phase 5)**: `CATEGORIES`/`ACCOUNTS` are now `var`
  declarations at the top of the inline `<script>` in `index.html`. This
  eliminates the external `constants.js` dependency entirely, so dropdowns
  populate on **all** platforms including Android `file://`. Annual updates
  now mean editing two arrays in `index.html`.
- **IndexedDB over localStorage**: Native `indexedDB` API chosen over
  `localStorage` — stores objects natively, no string serialization, more robust
  for the transaction object shape. Thin wrapper (`dbOpen`, `dbSaveAll`,
  `dbLoadAll`) keeps the inline script readable. `nextId` is derived from the
  max existing ID + 1 on load.
- **App-shell caching**: `sw.js` uses `CACHE_NAME = 'simple-checkbook-v1'`,
  `cache.addAll` on install, cache-first fetch, and cache cleanup on activate.
  IndexedDB data is NOT cleared during SW updates — only the shell cache is
  versioned.
- **Single JSON file over folder (Phase 6 — Decision 1)**: The user originally
  requested a "data folder" of multiple files for import/export. This was
  challenged: Android browsers cannot write to a named folder (File System
  Access API unavailable), and multiple-file export/import provides no
  benefit for a personal checkbook's small dataset (JSON stringify/parse is
  O(n) and n is small). A **single JSON file** (`checkbook-data.json`) was
  adopted instead — symmetric round-trip, fast, works everywhere.
- **Replace-on-import (Phase 6 — Decision 2)**: Import replaces the entire
  transaction store rather than merging, making it a true point-in-time
  restore. A `confirm()` guard warns of the destructive action.
- **Validation before mutation (Phase 6 — Decision 3)**: Imports are fully
  validated before any state change. The file must be a JSON array where every
  element has the transaction shape `{id, type, amount, name, category,
  account, date}` with correct types. Invalid files are rejected wholesale.
- **Export from in-memory array (Phase 6 — Decision 3)**: Export reads from
  the in-memory `transactions` array (the same source the list and balance
  render from), not a direct DB read. Import writes through the existing
  `dbSaveAll()` path, which already does `store.clear()` + put-all — exactly
  the replace semantics required.
- **Persistence strategy**: IndexedDB (robust) chosen over `localStorage`
  (simpler). Trade-off favours IndexedDB for future-proofing.
- **Spec vs. implementation drift**: The `cashflow-entries` spec still lists
  accounts as `Cash, Checking, Savings` in some scenarios but the inlined
  constants use `Primary, Istri, Savings`; reconcile in a future spec revision.
- **Style note**: The ES5-only brief says "no const/let," but the inline script
  uses `let` for state variables and `var` for constants/helpers. This is
  pre-existing and unrelated to Phase 5 (Android Chrome supports both).

## Important Patterns & Preferences
- **Single-file philosophy**:   `index.html` remains the source of truth for markup and logic. External scripts\n  are now only `sw.js` (PWA lifecycle) — the `constants.js` external script was\n  removed in Phase 5. CSS lives in `src/style.css` (safe under `file://`).
- **No framework**: Continue with vanilla JS. Do not introduce React/Vue/build tools.
- **Spec-driven workflow**: Every change starts with a spec in `openspec/specs/`.
- **New lesson (Phase 5)**: The Android `file://` external-script limitation is
  best solved by **eliminating the external dependency** (inlining) rather than
  guarding against its absence. The `typeof` guard (commit `596ccde`) was a
  stopgap; inlining is the durable fix.

## Learnings & Project Insights
- Phases were built top-to-bottom (scaffold → nav → actions → data model →
  formatting/constants → persistence/offline → import-export); each produced an
  OpenSpec change.
- The README's "Phase 3 = data persistence + offline" wording was outdated;
  persistence was the Phase 5 target. Phases 1–4 are archived without persistence.
- `entry-constants` was introduced to externalize lists for annual updates, then
  **reversed** in Phase 5 — inlining proved simpler and fixed the Android issue.
- **Bug-fix insight**: A "doesn't work on mobile" report is easy to misdiagnose as
  touch events — the Android tab-switch bug was an init abort from a blocked
  external script. Always check the console for a `ReferenceError` and confirm
  listeners were actually attached.
- **Phase 5 insight**: Persistence, offline support, and the Android dropdown
  issue all shared one root cause — external file dependencies. Inlining
  constants + IndexedDB + SW caching solved all three in one change.
- **Phase 6 insight**: Export/import is additive and touches only the existing
  `transactions` array + `dbSaveAll()` path. The most important safety property
  is "validate before mutate" — the entire file is parsed and validated before
  any state change, so a bad file never corrupts the store.


## Local Deployment Strategy (in progress)

The `local-deployment-strategy` change enables running the app by opening
`src/index.html` directly in Chrome — no HTTP server needed.

**Completed:**
- SW registration gated with `if (location.protocol !== 'file:')` guard
- CSS extracted to `src/style.css` (linked via `<link>`, safe under `file://`)
- FSAA helpers removed from `src/index.html`; `exportTransactions()` simplified
  to a Blob-download implementation; `navigator.storage.persist()` removed
- `src/index.html.bak` deleted; `src/sw.js` updated to cache `style.css`
- `DEPLOY.md` created at repo root
- README.md and techContext.md updated for file://-first deployment
- `node --check index_check.js` passes; `node _test_export.js` passes;
  `openspec validate local-deployment-strategy` passes
