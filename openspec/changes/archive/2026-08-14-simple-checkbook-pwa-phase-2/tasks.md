## 1. HTML Structure

- [x] 1.1 Update `src/index.html` page title — replace the "Hello World" `<h1>` with `<h1>Simple Checkbook</h1>`
- [x] 1.2 Add cashflow entry form — a form with a type selector (money in / money out radio buttons), an amount input, a category `<select>`, an account `<select>`, and a submit button
- [x] 1.3 Add transaction list container — an empty `<tbody>` or list element that will be populated by JavaScript
- [x] 1.4 Add balance display element — a visible element (e.g. `<div id="balance">`) showing the running balance, initialized to `+0`
- [x] 1.5 Preserve PWA installability — keep the `<link rel="manifest">` tag and service-worker registration script from Phase 1 so the app remains installable on desktop Chrome

## 2. CSS Styling

- [x] 2.1 Add styles for the entry form — form layout, input sizing, label alignment
- [x] 2.2 Add styles for the transaction list — table or list row styling, alternating row colors
- [x] 2.3 Add styles for the balance display — prominent font size/weight to distinguish from the list

## 3. JavaScript Implementation

- [x] 3.1 Add pre-defined constants — `CATEGORIES` array (Income, Food, Transport, Entertainment, Bills, Shopping, Other) and `ACCOUNTS` array (Cash, Checking, Savings)
- [x] 3.2 Add data model — a `transactions` array to hold in-memory entry objects `{ type, amount, category, account }`
- [x] 3.3 Implement `addTransaction()` — form submit handler that reads form values, converts "money out" to negative amount, pushes to `transactions`, then calls `renderTransactions()` and resets the form
- [x] 3.4 Implement `renderTransactions()` — clears and rebuilds the transaction list DOM from the `transactions` array, displaying type, signed amount, category, and account for each entry
- [x] 3.5 Implement balance computation — sum all transaction amounts and update the balance display element with a `+`/`−` sign
- [x] 3.6 Wire up DOM — attach the submit event listener to the form and call `renderTransactions()` once on page load to initialize the balance to `+0`

## 4. Testing & Verification

- [x] 4.1 Verify in desktop browser — open `src/index.html` via local server and confirm the form and empty list render correctly
- [x] 4.2 Verify form submission — add a money-in entry and a money-out entry, confirm both appear in the list with correct sign-and-amount, category, and account
- [x] 4.3 Verify running balance — confirm the balance updates correctly (e.g. +100 then −50 shows `+50`)
- [x] 4.4 Verify form reset — confirm the form clears after each submission
- [x] 4.5 Verify desktop PWA installability — confirm the install prompt appears in Chrome on desktop when served via `python -m http.server` and that the app launches in standalone mode
