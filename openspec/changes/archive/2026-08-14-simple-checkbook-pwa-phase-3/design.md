## Context

Phase 2 is implemented in `src/index.html` as a single-file PWA with inline CSS and JS. The page shows a balance display, an entry form (type selector, amount, category, account), and a transaction list table — all stacked vertically. Transactions are stored in an in-memory array `{ type, amount, category, account }` with no unique IDs. The service worker is a no-cache stub. The zero-toolchain constraint (no npm, no build step) is preserved from Phases 1 and 2. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Restructure the single `index.html` into two tab views (List + Add Transaction) controlled by a bottom tab bar
- Make the transaction list the default view on load
- Add per-row overflow menu (⋮) with Edit and Delete actions
- Add edit flow: tap Edit → switch to Add Transaction tab → pre-fill form → "Update Entry" button → update in place
- Add delete flow: tap Delete → confirm dialog → remove from list → re-render
- Add unique `id` to each transaction object for reliable edit/delete targeting
- Preserve inline CSS/JS, PWA manifest link, and service-worker registration

**Non-Goals:**
- No data persistence — entries remain in-memory; reloads clear all data (same as Phase 2)
- No service-worker caching or offline support (deferred, not part of this phase)
- No user-defined categories or accounts (pre-defined defaults only, same as Phase 2)
- No transaction filtering, sorting, or search
- No separate CSS or JS files — stays inline in `index.html`
- No native APK generation

## Decisions

### Decision 1: CSS-based view toggling with JS state
**Chosen**: Two wrapper `<div>` elements (`.view` with `.active` class) — the List view and the Add Transaction view. Tab buttons toggle the `.active` class. The active view's class controls `display: block` vs `display: none`. A module-level `currentView` variable tracks the active tab.

**Rationale**: Simplest possible approach within the single-file constraint. No routing library, no page reload. CSS handles visibility; JS handles state and DOM updates.

**Alternatives considered:**
- *Single-page with scroll*: Rejected — doesn't clearly separate the two concerns and the form would still be visible above the fold.
- *Separate HTML files*: Rejected — breaks the zero-build, single-file approach and requires link management.

### Decision 2: Bottom tab bar with `position: fixed`
**Chosen**: A `<div class="bottom-nav">` fixed to the bottom of the viewport with two `<button>` elements. `position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto;` ensures it stays at the bottom on the constrained mobile viewport while centering on larger screens.

**Rationale**: Bottom placement is ergonomic for thumb-driven mobile use. Fixed positioning keeps the nav always accessible regardless of scroll. The `max-width: 480px; margin: 0 auto;` mirrors the existing `body` constraint so the nav aligns with the page content on desktop.

**Alternatives considered:**
- *Top navigation*: Rejected — awkward for thumb reach on phones.
- *Floating action button*: Rejected — doesn't support two equal tabs cleanly.

### Decision 3: Overflow menu for per-row actions
**Chosen**: A single "⋮" overflow button per row that, when tapped, shows a small floating menu with "Edit" and "Delete" options. Implemented with a module-level `activeMenuId` variable tracking which row's menu is open.

**Rationale**: Saves horizontal space on each row (the table already has 4 columns: Type, Amount, Category, Account). A single overflow button is a common mobile pattern. Explicit Edit/Delete buttons on every row would crowd the layout, especially on small screens.

**Alternatives considered:**
- *Two buttons per row*: Rejected — crowding on small screens; the table already has 4 data columns.
- *Swipe-to-delete*: Rejected — adds touch-gesture complexity and JS logic; only covers delete, not edit.

### Decision 4: Edit flow via tab-switch + form pre-fill
**Chosen**: Tapping "Edit" on a transaction switches to the "Add Transaction" tab, pre-fills the form with the transaction's values, and relabels the submit button to "Update Entry." A module-level `editId` variable tracks which transaction is being edited (null when adding new). The submit handler checks `editId`: if set, updates the existing transaction; if null, pushes a new one.

**Rationale**: Reuses the existing form UI — no duplicate edit form needed. The tab-switch pattern matches the user's two-menu design. Pre-filling is straightforward DOM manipulation.

**Alternatives considered:**
- *Inline row editing*: Rejected — row cells aren't set up for inline inputs; would require significant layout restructuring.
- *Modal popup*: Rejected — adds modal overlay CSS/JS complexity; the tab-switch approach is simpler and consistent with the two-tab design.

### Decision 5: Delete with `confirm()` dialog
**Chosen**: Tapping "Delete" calls `window.confirm('Delete this transaction?')`. If confirmed, the transaction is filtered out of the array, the list re-renders, and the balance updates.

**Rationale**: `confirm()` is native to the browser, requires zero custom CSS/JS for the dialog, and provides a clear safety check for a destructive action. No external dialog library needed (zero-toolchain constraint).

**Alternatives considered:**
- *Immediate delete (no confirmation)*: Rejected — destructive action without safety net is poor UX.
- *Custom dialog*: Rejected — would require additional HTML/CSS for a modal, adding complexity for no benefit over the native `confirm()`.

### Decision 6: Transaction IDs via incrementing counter
**Chosen**: A module-level `nextId` counter starting at 1. Each new transaction gets `id: nextId++`. Edit/delete use `findIndex` / `filter` by `id`.

**Rationale**: Simple, deterministic, and doesn't depend on `Date.now()` precision (which could collide if entries are created in the same millisecond). A counter guarantees uniqueness within the session.

**Alternatives considered:**
- *`Date.now()`*: Rejected — could collide if two entries are created within the same millisecond (unlikely but possible).
- *UUID library*: Rejected — violates zero-toolchain constraint.

### Decision 7: No persistence (consistent with Phase 2)
**Chosen**: Transactions remain in-memory only. The `transactions` array is reset on page load.

**Rationale**: The user explicitly confirmed no persistence in Phase 3. The delete/edit features operate within the session scope, same as Phase 2's add/view. A future phase can add `localStorage` if needed.

**Alternatives considered:**
- *localStorage*: Rejected per user direction.

## Risks / Trade-offs

- **[Risk] Overflow menu adds DOM complexity** → Mitigation: Keep it simple — a single floating `<div>` that appears at the row's location. Only one menu open at a time (tracked by `activeMenuId`).

- **[Risk] Edit flow requires switching views, which may confuse users** → Mitigation: The Add Transaction tab clearly shows "Update Entry" as the button label when editing, making the mode explicit. After updating, auto-switch back to List to show the result.

- **[Risk] Table layout may be cramped with the overflow column on small screens** → Mitigation: The overflow button is narrow (icon only). The table already scrolls naturally on small viewports. If needed, the empty-message and action column can collapse on very small screens.

- **[Risk] Confirm dialog styling varies by browser** → Mitigation: Native `confirm()` is acceptable for a minimal PWA. A custom dialog can be added in a future phase if styling consistency is needed.

- **[Risk] In-memory data model grows within a single HTML file** → Mitigation: Phase 3 keeps JS minimal. If the file becomes unwieldy, a future phase can split inline JS into a separate `app.js` (still zero-build).

## Migration Plan

Phase 3 modifies `src/index.html` from its Phase 2 state:

1. **HTML structure**: Wrap the existing form in a `<div class="view" id="add-view">` and the balance + transaction list in a `<div class="view active" id="list-view">`. Both views sit inside a container above the new bottom nav.

2. **Bottom nav**: Add `<div class="bottom-nav">` with two buttons after the views.

3. **CSS**: Add `.view` / `.view.active` display rules, `.bottom-nav` fixed positioning, `.nav-tab` styling, and overflow menu styling.

4. **JS**: Add `currentView`, `editId`, `nextId`, `activeMenuId` module variables. Add `showView()`, `switchToEdit()`, `deleteTransaction()`, overflow menu toggle, and modify `addTransaction()` to handle both add and update.

Rollback: Reverts `src/index.html` to the Phase 2 version (preserved in git history once committed).

## Open Questions

(none — all design decisions were resolved with the user during planning)
