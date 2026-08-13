# Progress

## What Works
All four implementation phases are complete and their OpenSpec changes are
archived:

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
  - `constants.js` externalizes `CATEGORIES` and `ACCOUNTS` arrays.
  - `formatRupiah()` renders all monetary values as `Rp N.NNN` (dot
    thousands separator, whole numbers, Unicode minus for negatives).
  - Form clears after submission; edit updates in place; delete removes and
    recomputes balance.

## What’s Left to Build
- **Phase 5 — Data persistence & offline support**:
  - Persist transactions to IndexedDB (or `localStorage`) so data survives
    page reloads.
  - Add caching strategies to `sw.js` for offline app-shell and runtime
    request caching.
  - Update the service worker to cache `index.html`, `constants.js`,
    `manifest.json`, and icons at install time.

## Current Status
- **Code**: All features from phases 1–4 are implemented in `src/` and
  verified spec-compliant at time of archive.
- **Specs**: Six specifications exist in `openspec/specs/` — `checkbook-app`,
  `cashflow-entries`, `entry-constants`, `money-formatting`, `app-navigation`,
  `transaction-actions`.
- **Memory Bank**: Initiated — all six core files created.
- **OpenSpec changes**: All four phases archived in
  `openspec/changes/archive/`.

## Spec Compliance Status
| Spec | Status | Notes |
|---|---|---|
| `checkbook-app` | ✅ Implemented | Hello World + PWA manifest + no external deps |
| `cashflow-entries` | ✅ Implemented | Full form, list, balance, edit, delete, unique IDs, name field |
| `entry-constants` | ✅ Implemented | `constants.js` with `CATEGORIES` / `ACCOUNTS` |
| `money-formatting` | ✅ Implemented | `formatRupiah()` — Rupiah, dot separators, no decimals |
| `app-navigation` | ✅ Implemented | Bottom tab bar, List/Add views |
| `transaction-actions` | ✅ Implemented | Overflow menu, edit, delete with confirmation |

## Known Issues
1. **Spec drift — account values**: The `cashflow-entries` spec lists
   accounts as `Cash, Checking, Savings`, but `constants.js` uses
   `Primary, Istri, Savings`. This is intentional localization but should be
   synced in a future spec revision.
2. **Service worker is a stub**: No caching is implemented. Offline use is
   not yet supported (deferred to Phase 5).
3. **Session-scoped data**: Reloading the page resets all transactions to
   empty. This is by design for phases 1–4 but is the primary limitation.

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
