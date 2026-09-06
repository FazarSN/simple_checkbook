# Progress

## What Works
All six implementation phases are complete and syntax-verified. The
`local-deployment-strategy` change is also fully implemented: the app runs
under `file://` (SW registration guarded), CSS extracted to `src/style.css`,
export simplified, and `DEPLOY.md` created. Phases 1–5 are applied to code
(Phase 5 applied but not yet archived; Phase 6 applied and synced/validated).

- **Phase 1 — Scaffold**: "Hello World" PWA, installable via manifest
  (`display: standalone`), service-worker stub with install/activate lifecycle,
  SVG icons. The app loads with no external dependencies.
- **Phase 2 — Basic checkbook**: Transaction list with a running balance,
  rendered from an in-memory array.
- **Phase 3 — Navigation & actions**: Bottom tab bar (List / Add Transaction),
  view switching, overflow menu (⋮) per row with Edit and Delete actions.
  Edit pre-fills the form and relabels the button to "Update Entry". Delete
  confirms via `confirm()`.
- **Phase 4 — Full entry form & formatting**:
  - Cashflow entries with type selector (money-in / money-out), amount,
    name (free-text, optional), category dropdown, account dropdown, and
    submit.
  - `CATEGORIES` and `ACCOUNTS` arrays were externalized in `constants.js`
    (Phase 4), then **inlined** into `index.html` in Phase 5 (constants.js
    deleted).
  - `formatRupiah()` renders all monetary values as `Rp N.NNN` (dot
    thousands separator, whole numbers, Unicode minus for negatives).
  - Form clears after submission; edit updates in place; delete removes and
    recomputes balance.
- **Phase 5 — Persistence & offline support (implemented, not archived)**:
  - `CATEGORIES`/`ACCOUNTS` inlined into `index.html` — dropdowns populate on
    all platforms including Android `file://`; `constants.js` deleted.
  - Transactions persisted to IndexedDB (`dbOpen`/`dbSaveAll`/`dbLoadAll`);
    survive page reloads and browser restarts.
  - `sw.js` caches the app shell (`index.html`, `style.css`, `manifest.json`,
    SVG icons) at install time with a cache-first strategy; old cache versions
    purged on activate.
  - Date field added to the entry form — pre-filled with the current day,
    stored as a `date` property on the transaction object, displayed in the
    transaction list, and persisted to IndexedDB.
- **Phase 6 — Import / Export (implemented, pending archive)**:
  - Third "Import/Export" bottom tab added to `src/index.html`.
  - Export: serializes `transactions` to `checkbook-data.json` (Blob download).
  - Import: file picker → `FileReader` → `validateImportData()` → `confirm()`
    → replace store → `dbSaveAll()` → re-render list + balance.
  - Replace semantics (not merge); validation before any mutation.
  - `EXPORT_FILENAME`, `exportTransactions()`, `validateImportData()` added.
  - Delta spec synced to `openspec/specs/data-export-import/spec.md`.
  - Syntax check passes (`node --check`); `openspec validate` passes.
- **Local deployment** (`local-deployment-strategy`):
  - Service worker registration gated with `location.protocol !== 'file:'`.
  - CSS extracted from `src/index.html` to `src/style.css` (linked via `<link>`).
  - File System Access helpers removed; `exportTransactions()` simplified to
    Blob download; `navigator.storage.persist()` removed.
  - `src/index.html.bak` deleted; `src/sw.js` updated to cache `style.css`.
  - `DEPLOY.md` created at repo root (PC + Android Samsung M34 instructions).
  - README.md and memory-bank techContext.md updated for file://-first deployment.

## What's Left to Build
- **Verify Phase 5** — runtime verification: dropdowns populate on Android
  `file://`, transactions persist across reload, app loads offline after first
  visit (HTTP). Then archive `phase-5-persistence-offline`.
- **Verify Phase 6** — runtime verification (manual browser tests):
  - 6.2: Export downloads `checkbook-data.json` with all persisted transactions.
  - 6.3: Valid import replaces the store and re-renders list + balance.
  - 6.4: Malformed JSON / missing-field records rejected without modifying store.
  - 6.5: Import replaces (not merges) — non-imported ids are removed.
  - 6.6: `confirm()` guard appears before destructive import.
  - 6.7: Android PWA standalone — export downloads and import loads, both offline.
  - 6.8: No new external dependencies; `sw.js` and `manifest.json` unchanged.
  Then archive `phase-6-import-export`.
- **Spec maintenance**: sync `cashflow-entries` account values
  (`Primary, Istri, Savings`) to match the inlined constants.
- **Out of scope (explicitly deferred)**: cloud sync, user accounts, background
  sync, push notifications.

## Current Status
- **Code**: All features from phases 1–6 are implemented in `src/`. Phase 6
  (import/export tab, export/import functions) is applied; Phase 5
  (inlined constants, IndexedDB, SW caching) is applied but not yet archived.
- **Specs**: Ten specifications exist in `openspec/specs/` — `checkbook-app`,
  `cashflow-entries`, `entry-constants`, `money-formatting`, `app-navigation`,
  `transaction-actions`, `tab-switch-android` (bug-fix spec), `app-persistence`,
  `offline-support`, and `data-export-import` (Phase 6).
- **Memory Bank**: Initiated — all six core files created and updated through
  Phase 6.
- **OpenSpec changes**: Phases 1–4 archived in `openspec/changes/archive/`;
  bug-fix change `2026-08-17-fix-tab-switch-android` archived; Phase 5 change
  `phase-5-persistence-offline` applied (pending archive); Phase 6 change
  `phase-6-import-export` applied and validated (pending archive).

## Spec Compliance Status
| Spec | Status | Notes |
|---|---|---|
| `checkbook-app` | ✅ Implemented | Hello World + PWA manifest + no external deps |
| `cashflow-entries` | ✅ Implemented | Full form, list, balance, edit, delete, unique IDs, name field |
| `entry-constants` | ✅ Implemented | Inlined `CATEGORIES` / `ACCOUNTS` in `index.html` (Phase 5) |
| `money-formatting` | ✅ Implemented | `formatRupiah()` — Rupiah, dot separators, no decimals |
| `app-navigation` | ✅ Implemented | Bottom tab bar, List/Add views |
| `transaction-actions` | ✅ Implemented | Overflow menu, edit, delete with confirmation |
| `tab-switch-android` | ✅ Bug fixed | `populateSelects()` guard + README corrected for Android `file://` |
| `app-persistence` | ✅ Implemented | IndexedDB persistence — transactions survive reloads/restarts |
| `offline-support` | ✅ Implemented | SW app-shell caching — cache-first, versioned, offline after first visit |
| `data-export-import` | ✅ Implemented | Import/Export tab, JSON export (Blob download), validated JSON import (replace semantics, confirm guard) |
| `local-deployment-strategy` | ✅ Implemented | file:// support (SW guard), CSS extraction, simplified export, DEPLOY.md, README/techContext updates |

## Known Issues
1. **Phase 5 not yet archived**: The `phase-5-persistence-offline` change is
   applied to code but `tasks.md` checkboxes may be unchecked and the change is
   not archived. README.md and memory-bank have been updated to reflect it.
2. **Phase 6 not yet archived**: The `phase-6-import-export` change is applied
   to code and validated; pending runtime verification and archiving.
3. **Spec drift — account values**: The `cashflow-entries` spec still lists
   accounts as `Cash, Checking, Savings` in some scenarios, but the inlined
   constants in `index.html` use `Primary, Istri, Savings`. This is intentional
   localization but should be synced in a future spec revision.
4. **Android `file://` limitation (resolved)**: The external `constants.js`
   dependency was the root cause of empty dropdowns under Android `file://`.
   Phase 5 inlined the constants, so dropdowns now populate on all platforms.
   The service worker still requires HTTP (not `file://`) to register.
5. **IndexedDB requires a secure/HTTP context**: IndexedDB works under
   `file://` in most browsers but the service worker (offline caching) requires
   an HTTP origin. For full offline support, serve over HTTP.

## Evolution of Project Decisions
- **Phase 1**: Established the zero-dependency PWA scaffold and the OpenSpec
  workflow.
- **Phase 2**: Added the core data model (`transactions` array) and balance
  computation.
- **Phase 3**: Introduced view switching (tab bar) and per-row actions
  (overflow menu) to avoid UI clutter.
- **Phase 4**: Externalized constants into `constants.js` for annual updates;
  added the `name` field and Rupiah money formatting. Deferred persistence
  and offline support to a later phase.
- **Bug fix (2026-08-17)**: Diagnosed and fixed the Android tab-switch bug.
  Root cause was an init abort (`populateSelects()` threw because `constants.js`
  is blocked under `file://` on Android), not touch events. Fixed with a
  `typeof` guard; README corrected; added a `tab-switch-android` spec + change.
- **Phase 5 (2026-08-20)**: Inlined `CATEGORIES`/`ACCOUNTS` into `index.html`
  (deleted `constants.js`), added IndexedDB persistence, and added app-shell
  caching to `sw.js`. This resolved the Android `file://` dropdown issue at the
  root (eliminating the external dependency) while delivering persistence and
  offline support.
- **Phase 6 (2026-08-21)**: Added a third Import/Export tab with JSON export
  (Blob download) and validated JSON import (replace semantics with `confirm()`
  guard). Challenged the original "data folder" request — single JSON file
  adopted because Android cannot write to named folders and the dataset is small.
