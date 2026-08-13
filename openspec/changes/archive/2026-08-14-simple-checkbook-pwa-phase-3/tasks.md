## 1. HTML Structure

- [x] 1.1 Wrap balance display and transaction list table in a `<div class="view active" id="list-view">`
- [x] 1.2 Wrap the cashflow entry form in a `<div class="view" id="add-view">` (inactive by default)
- [x] 1.3 Add bottom tab bar `<div class="bottom-nav">` with two buttons: "List" and "Add Transaction"
- [x] 1.4 Add an overflow action column (`<th>` + per-row `<td>`) to the transaction table for the ⋮ button

## 2. CSS Styling

- [x] 2.1 Add `.view` / `.view.active` rules for showing/hiding tabbed views (`display: none` vs `display: block`)
- [x] 2.2 Style the bottom tab bar: `position: fixed; bottom: 0`, two flex tabs, active-state highlighting
- [x] 2.3 Style the overflow menu: floating `<div>` with "Edit" and "Delete" options, anchored to its row
- [x] 2.4 Add `.overflow-btn` style for the ⋮ button in each row; ensure table layout accommodates the extra column

## 3. JavaScript — Navigation

- [x] 3.1 Add `currentView` state variable and `showView(tabName)` function to toggle views and active tab
- [x] 3.2 Wire up bottom tab button click listeners to `showView()`
- [x] 3.3 Ensure List view is active and Add Transaction form is hidden on initial page load

## 4. JavaScript — Transaction IDs

- [x] 4.1 Add `nextId` counter variable (starts at 1) and assign `id: nextId++` when creating new transactions

## 5. JavaScript — Overflow Menu

- [x] 5.1 Render the ⋮ overflow button in each transaction row via `renderTransactions()`
- [x] 5.2 Implement overflow menu toggle: clicking ⋮ opens the menu for that row; clicking again or outside closes it
- [x] 5.3 Ensure only one overflow menu is open at a time (track via `activeMenuId`)

## 6. JavaScript — Delete Transaction

- [x] 6.1 Implement `deleteTransaction(id)` — filter the transaction out of the array by `id`
- [x] 6.2 Wire up the Delete action to show a `confirm()` dialog before proceeding
- [x] 6.3 Re-render the transaction list and update the running balance after deletion

## 7. JavaScript — Edit Transaction

- [x] 7.1 Implement `editTransaction(id)` — set `editId`, switch to Add Transaction tab, close any open menu
- [x] 7.2 Pre-fill the form: type radio, amount, category select, account select with the transaction's current values
- [x] 7.3 Relabel the submit button to "Update Entry" when in edit mode
- [x] 7.4 Modify the form submit handler: if `editId` is set, update the existing transaction in place instead of pushing a new one
- [x] 7.5 Reset `editId = null` and relabel submit button back to "Add Entry" after update
- [x] 7.6 Switch back to List view after a successful update

## 8. Testing & Verification

- [x] 8.1 Verify tab switching — tapping List/Add Transaction switches views correctly
- [x] 8.2 Verify default view — List (transaction list + balance) is shown on load, form is hidden
- [x] 8.3 Verify add still works — adding a new entry from the Add Transaction tab appears in the list
- [x] 8.4 Verify edit flow — tap ⋮ → Edit → form pre-fills → change values → "Update Entry" → list updates in place, balance recalculates
- [x] 8.5 Verify delete flow — tap ⋮ → Delete → confirm → transaction removed, balance recalculates
- [x] 8.6 Verify overflow menu — opens on tap, closes on outside click or re-tap, only one open at a time
- [x] 8.7 Verify PWA installability — manifest link and service-worker registration still present; app serves via `python -m http.server`
