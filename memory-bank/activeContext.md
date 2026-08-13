# Active Context

## Current Work Focus
**Initiating the Memory Bank** for the Simple Checkbook project. All six
core files are being created to establish a baseline of project knowledge that
will persist across Cline sessions.

## Status Summary
- **All four phases (1–4) are implemented and archived.**
- The project is a fully functional session-scoped PWA: users can add, edit,
  and delete transactions, see a running balance in Indonesian Rupiah, navigate
  via a bottom tab bar, and install the app on Android.
- **No code changes are pending.** The active focus is documentation
  (memory bank).

## Recent Changes
| Phase | Date | Description |
|---|---|---|
| Phase 4 | 2026-08-14 | Cashflow entries (full form with name/category/account), entry constants
  (separate `constants.js`), money formatting (Rupiah). |
| Phase 3 | 2026-08-14 | App navigation (bottom tab bar, list/add views) and transaction actions
  (overflow menu with edit/delete). |
| Phase 2 | 2026-08-14 | Basic transaction list and running balance. |
| Phase 1 | 2026-08-14 | Scaffold: Hello World, PWA manifest, service-worker stub. |

## Next Steps
1. **Phase 5 (planned)**: Implement data persistence (IndexedDB or
   `localStorage`) so transactions survive page reloads. This will require a
   revised service worker with caching strategies for offline support.
2. **Sync the `cashflow-entries` spec**: Update the account example values from
   `Cash, Checking, Savings` to match the localized `Primary, Istri, Savings`
   in `constants.js`.
3. **Verify spec compliance**: Run a manual test pass against all six specs to
   confirm no regressions.

## Active Decisions & Considerations
- **Persistence strategy**: Not yet decided — IndexedDB (robust, supports
  structured data) vs. `localStorage` (simpler, string-only, sufficient for a
  small transaction list). The trade-off favors IndexedDB for future-proofing
  but `localStorage` is simpler for the current feature set.
- **Offline caching**: The service worker (`sw.js`) is currently a stub. Adding
  a cache-first strategy for the app shell (`index.html`, `constants.js`,
  `manifest.json`, icons) is the minimum for offline usability.
- **Spec vs. implementation drift**: The `constants.js` accounts differ from
  the spec — this should be reconciled in a future spec revision.

## Important Patterns & Preferences
- **Single-file philosophy**: Keep `index.html` as the single source of truth
  for markup, styles, and logic. External scripts are only used for the
  constants file (which must be a separate file for annual updates).
- **No framework**: Continue with vanilla JS. Do not introduce React, Vue, or
  build tools unless the user explicitly requests it.
- **ES5-compatible syntax**: The inline script uses `var`, `function`, and
  `.forEach()` — no arrow functions, `const`/`let`, or async/await. Maintain
  this style for consistency.
- **Spec-driven workflow**: Every change should start with a spec in
  `openspec/specs/` and follow the OpenSpec lifecycle.

## Learnings & Project Insights
- The app was developed top-to-bottom (scaffold → nav → actions → data model
  → formatting / constants), with each phase producing an archived OpenSpec
  change. The phase boundaries are: P1 = scaffold, P2 = basic list/balance,
  P3 = navigation + actions, P4 = full entry form + constants + money format.
- The README's "Phase 3 = data persistence + offline" description is
  outdated; those features were deferred and are now the Phase 5 target.
  The phases as archived do not include persistence yet.
- The `entry-constants` spec was specifically introduced to externalize the
  category/account lists so they can be updated annually without touching
  application logic — a deliberate maintainability decision.
