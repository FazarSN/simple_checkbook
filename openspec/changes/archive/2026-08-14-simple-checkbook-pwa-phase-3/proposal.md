## Why

Phase 2 established in-memory cashflow entry with a form-first layout: the entry form sat at the top, the transaction list below. Users now need to manage existing transactions — deleting mistakes and editing incorrect entries — and the transaction list should take center stage as the primary interface. A bottom tab bar (List / Add Transaction) replaces the stacked form+list layout, putting the transaction list front and center and relegating entry to a dedicated tab. This keeps the zero-toolchain constraint (single `index.html`, inline CSS/JS) while adding the core management capabilities a checkbook app needs.

## What Changes

- **Add bottom tab navigation** — a fixed two-tab bar at the bottom of the viewport: "List" (default/active) and "Add Transaction". Tab switching toggles between two views.
- **Make transaction list the main interface** — the default view when the app loads shows the balance and transaction list; the entry form lives behind the "Add Transaction" tab.
- **Add per-row overflow menu** — each transaction row has a single "⋮" button that reveals "Edit" and "Delete" actions.
- **Add delete functionality** — tapping Delete on a transaction (via the overflow menu) removes it after a `confirm()` dialog; the list and running balance re-render.
- **Add edit functionality** — tapping Edit on a transaction (via the overflow menu) switches to the "Add Transaction" tab, pre-fills the form with the transaction's existing values, and relabels the submit button to "Update Entry." Submitting updates the existing transaction in place.
- **Add transaction IDs** — each transaction object gains a unique `id` field (generated via an incrementing counter) so edit/delete can target the correct entry reliably.
- **No persistence** — entries remain in-memory only (same as Phase 2); reloading clears all data.
- **Preserve PWA installability** — the `<link rel="manifest">` tag and service-worker registration from Phase 1/2 are preserved; the service worker remains a no-cache stub.
- **No new dependencies** — continues the pure HTML/CSS/JS, single-file approach.

## Capabilities

### New Capabilities

- `app-navigation`: Bottom tab bar with two views — "List" (transaction list + balance as the default main interface) and "Add Transaction" (entry form) — with tab switching.
- `transaction-actions`: Per-transaction edit and delete actions via an overflow menu, where edit pre-fills the entry form and delete removes the transaction after confirmation.

### Modified Capabilities

- `cashflow-entries`: Extending the existing Phase 2 `cashflow-entries` capability — adding the ability to edit (via form pre-fill + update) and delete existing entries. The core record-and-view behavior remains unchanged; these are additions to the existing capability's requirement set.

## Impact

- **Modified file**: `src/index.html` — restructures the layout into two tab views (list view + add-transaction view), adds bottom tab navigation, adds overflow menus and edit/delete logic, adds transaction IDs and an `editId` state variable, preserves inline CSS/JS and PWA scaffolding.
- **Unchanged files**: `src/manifest.json`, `src/sw.js`, `src/icons/*`
- **No new dependencies** — pure HTML/CSS/JS, single file
- **Target platform**: Android (Chrome) and desktop (Chrome), served via `python -m http.server`
