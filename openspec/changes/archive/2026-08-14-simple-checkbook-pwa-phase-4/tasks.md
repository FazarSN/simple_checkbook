## 1. Constants File (src/constants.js)

- [x] 1.1 Create `src/constants.js` with `CATEGORIES` and `ACCOUNTS` arrays (same values as Phase 3 inline constants)
- [x] 1.2 Add `<script src="constants.js"></script>` tag in `index.html` before the inline `<script>` block so constants are available on load
- [x] 1.3 Remove inline `const CATEGORIES = [...]` and `const ACCOUNTS = [...]` definitions from `index.html`'s inline `<script>`

## 2. Money Formatting (Rupiah)

- [x] 2.1 Replace `formatAmount()` with `formatRupiah()` — "Rp" prefix, dot (`.`) thousands separator, `Math.round()` for no decimals, Unicode minus (`−`) for negatives
- [x] 2.2 Update `updateBalance()` to call `formatRupiah()` instead of `formatAmount()`
- [x] 2.3 Update `renderTransactions()` to call `formatRupiah()` for per-transaction amounts

## 3. Name Field

- [x] 3.1 Add "Name" text input (`<input type="text" id="name" name="name">`) to the entry form HTML
- [x] 3.2 Add "Name" `<th>` to the transaction table header (second column, between Type and Amount)
- [x] 3.3 Add Name `<td>` rendering to the transaction row template in `renderTransactions()`
- [x] 3.4 Read the Name value in `addTransaction()` and store it as `tx.name` on the transaction object
- [x] 3.5 Pre-fill the Name field in `editTransaction()` from the existing transaction's `name` property
- [x] 3.6 Reset the Name field (`value = ''`) after form submission (both add and edit modes)

## 4. UI Refresh (Twitter/X Style)

- [x] 4.1 Update `body` background to pure white (`#FFFFFF`); widen the max-width container if needed
- [x] 4.2 Replace card `box-shadow: 0 1px 3px rgba(0,0,0,0.1)` with subtle `1px` borders (`#e1e4e8`) or lighter shadow
- [x] 4.3 Update form inputs: lighter border (`#e1e4e8`), increased border-radius (`8px`), more padding, lighter label color (`#656d76`)
- [x] 4.4 Update transaction table: replace `border-top: 1px solid #eee` with `#e1e4e8`, use `#656d76` for header labels, increase cell padding
- [x] 4.5 Update bottom tab bar: lighter text (`#656d76`) for inactive tabs, keep blue (`#4A90D9`) for active, flatter hover states
- [x] 4.6 Update form buttons: flatter style, consistent `8px` border-radius, consistent hover states
- [x] 4.7 Update overflow menu and overflow button styles to match the cleaner aesthetic

## 5. Testing & Verification

- [x] 5.1 Verify Rupiah formatting on running balance (e.g., `1000000` → `Rp 1.000.000`, `0` → `Rp 0`)
- [x] 5.2 Verify Rupiah formatting on per-transaction amounts (positive and negative, with rounding)
- [x] 5.3 Verify Name field appears in the entry form and persists when submitting
- [x] 5.4 Verify Name column appears in the transaction list and shows entered values
- [x] 5.5 Verify `src/constants.js` loads and category/account dropdowns populate correctly
- [x] 5.6 Verify all Phase 3 functionality still works: tab switching, overflow menu, edit flow, delete confirmation
- [x] 5.7 Verify app loads and serves via `python -m http.server` from `src/` (both `index.html` and `constants.js` served)
- [x] 5.8 Verify PWA installability: manifest link and service-worker registration still present
- [x] 5.9 Confirm with user on open question: should input `step` change from `"0.01"` to `"1"` for integer-only entry? (User chose Option B: integer-only entry — changed `min="0.01" step="0.01"` to `min="1" step="1"`)
