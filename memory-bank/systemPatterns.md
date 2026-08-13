# System Patterns

## Architecture Overview
Simple Checkbook is a **single-file PWA**: `src/index.html` contains all HTML
markup, inline CSS, and inline JavaScript. Two auxiliary files support it:

- `src/constants.js` — global `CATEGORIES` and `ACCOUNTS` arrays, loaded as a
  classic (non-module) script so the arrays are available as globals before
  `DOMContentLoaded`.
- `src/sw.js` — service-worker stub (install/activate lifecycle only; no
  caching yet).

## Key Technical Decisions
| Decision | Rationale |
|---|---|
| **No framework / no build tools** | Targets Android low-spec devices with "just a text editor and a browser." Keeps the project portable and the workflow simple. |
| **Inline CSS** | Eliminates external stylesheet network requests — the page renders from a single HTML file. |
| **Classic script for constants** | `constants.js` is loaded with a plain `<script src="…">` (not `type="module"`), so `CATEGORIES` / `ACCOUNTS` become global variables accessible to the inline script in `index.html`. |
| **`DOMContentLoaded` as entry point** | All event listeners and initial rendering are wired up inside the `DOMContentLoaded` handler, guaranteeing the DOM is ready. |
| **Session-scoped state** | `transactions` array, `nextId`, `editId` live in memory only. No IndexedDB or `localStorage` yet (Phase 5 goal). |
| **Spec-driven dev** | Every feature corresponds to an OpenSpec spec under `openspec/specs/`. Changes flow through `openspec/changes/` (proposal → design → tasks → apply → archive). |

## Design Patterns in Use
1. **View switching** — Two `<div class="view">` sections ("List" and "Add")
   are toggled via CSS classes (`active` → `display: block` / hidden →
   `display: none`). A `showView(tabName)` function manages the active tab and
   updates the bottom-nav highlights.
2. **Event delegation** — Overflow buttons (⋮) inside `#transaction-list` are
   handled via a single `click` listener on the `<tbody>`, using
   `event.target.closest('.overflow-btn')` to identify the target row.
3. **Inline rendering** — `renderTransactions()` rebuilds the `<tbody>` with
   `.map().join('')` on each state change. The overflow menu is a single shared
   DOM element, repositioned with `getBoundingClientRect()`.
4. **Global state** — `transactions`, `nextId`, `editId`, `currentView`,
   `activeMenuId` are module-scope variables in the inline script.
5. **Currency formatting** — `formatRupiah(amount)` rounds to whole numbers
   (`Math.round(Math.abs(amount))`), inserts dot thousands separators via a
   regex, and prefixes `Rp` for positives or `−Rp` (U+2212 Unicode minus) for
   negatives.

## Component Relationships
```
index.html
  │
  ├── manifest.json          → PWA installability (standalone display)
  ├── sw.js                   → Service worker stub (install/activate only)
  │
  ├── constants.js            → CATEGORIES[], ACCOUNTS[] (global scripts)
  │
  └── Inline <script>
        ├── State: transactions[], nextId, editId, …
        ├── populateSelects() → reads CATEGORIES / ACCOUNTS
        ├── formatRupiah()    → currency formatting
        ├── computeBalance()  → reduce over transactions
        ├── updateBalance()   → DOM update of #balance
        ├── renderTransactions() → DOM rebuild of #transaction-list
        ├── showView()        → tab / view switching
        ├── addTransaction()  → form submit → push or update
        ├── editTransaction() → pre-fill form, switch to Add tab
        ├── deleteTransaction() → filter + re-render
        ├── toggleOverflowMenu() / closeOverflowMenu()
        └── DOMContentLoaded → wires all listeners, initial render
```

## Critical Implementation Paths
1. **Form → Transaction**: `addTransaction()` validates, converts
   money-out to negative, pushes to `transactions[]`, re-renders, resets form.
2. **Edit → Form**: `editTransaction(id)` finds the transaction, sets
   `editId`, pre-fills all fields, relabels button to "Update Entry", switches
   to Add view. The next submit updates in place via `findIndex`.
3. **Delete**: `deleteTransaction(id)` confirms via `alert()`, filters the
   array, re-renders.
4. **Balance**: `computeBalance()` sums `tx.amount` (already signed);
   `updateBalance()` applies `formatRupiah()` and sets the CSS class
   (`positive` / `negative` / `zero`).

## Known Discrepancy
The **cashflow-entries spec** lists accounts as `Cash, Checking, Savings`,
but `constants.js` and `index.html` use `Primary, Istri, Savings`. This is an
intentional localization for the Indonesian user. The spec's generic example
values were never updated after localization. Future spec revisions should
sync the account list.
