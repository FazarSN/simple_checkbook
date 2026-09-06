# System Patterns

## Architecture Overview
Simple Checkbook is a **single-file PWA**: `src/index.html` contains all HTML
markup, inline CSS, and inline JavaScript. The `CATEGORIES` and `ACCOUNTS`
arrays are **inlined** at the top of the inline `<script>` block (Phase 5 —
previously externalized in `constants.js`, which is now deleted). Two auxiliary
files support it:

- `src/sw.js` — service worker with app-shell caching (install/activate/fetch
  lifecycle, cache-first strategy, versioned cache).
- `src/manifest.json` — web app manifest for Android installability.

## Key Technical Decisions
| Decision | Rationale |
|---|---|
| **No framework / no build tools** | Targets Android low-spec devices with "just a text editor and a browser." Keeps the project portable and the workflow simple. |
| **Inline CSS** | Eliminates external stylesheet network requests — the page renders from a single HTML file. |
| **Inlined constants** | `CATEGORIES` / `ACCOUNTS` are `var` declarations at the top of the inline `<script>` in `index.html` (Phase 5). Eliminates the external `constants.js` dependency so dropdowns populate on all platforms, including Android `file://`. |
| **`DOMContentLoaded` as entry point** | All event listeners and initial rendering are wired up inside the `DOMContentLoaded` handler, guaranteeing the DOM is ready. |
| **IndexedDB persistence** | `transactions` array is persisted to IndexedDB via `dbOpen()` / `dbSaveAll()` / `dbLoadAll()`. `dbLoadAll()` runs on init before rendering; `dbSaveAll()` runs after every mutation (add/edit/delete). `nextId` is derived from the max existing ID + 1 on load. |
| **Date field** | The entry form has a `date` input pre-filled with the current day (`new Date().toISOString().slice(0, 10)`). The date is stored as a `date` property on the transaction object, displayed in the list, and persisted to IndexedDB. |
| **App-shell caching** | `sw.js` uses `CACHE_NAME = 'simple-checkbook-v1'`, `cache.addAll` on install, cache-first fetch, and cache cleanup on activate. |
| **Import/Export (Phase 6)** | Export uses `Blob` + `URL.createObjectURL` + hidden anchor download. Import uses `<input type="file">` + `FileReader.readAsText` + `JSON.parse` + `validateImportData()`. Replace semantics via existing `dbSaveAll()` (clear + put-all). `confirm()` guard before destructive import. |
| **Spec-driven dev** | Every feature corresponds to an OpenSpec spec under `openspec/specs/`. Changes flow through `openspec/changes/` (proposal → design → tasks → apply → archive). |

## Design Patterns in Use
1. **View switching** — Three `<div class="view">` sections ("List", "Add",
   "Import/Export") are toggled via CSS classes (`active` → `display: block` /
   hidden → `display: none`). A `showView(tabName)` function manages the active
   tab and view, updating the bottom-nav highlights.
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
6. **IndexedDB persistence** — `dbOpen()` opens/creates the `SimpleCheckbook`
   DB with a `transactions` object store (keyPath `id`); `dbSaveAll()` clears
   and rewrites the full array on each mutation; `dbLoadAll()` reads all records
   on startup and derives `nextId` from the max ID.
7. **Service-worker caching** — `sw.js` uses a versioned `CACHE_NAME`
   (`simple-checkbook-v1`), `cache.addAll` on install, cache-first fetch
   (`caches.match` → network fallback), and cache cleanup on activate.
8. **Date field** — the entry form's `date` input is pre-filled with the
   current day on `DOMContentLoaded`; the selected date is stored on the
   transaction object, displayed in the list, and reset to the current day
   after submission.
9. **Import/Export (Phase 6)** — **Export**: serialize `transactions` with
   `JSON.stringify(transactions, null, 2)` into a `Blob`, create an object URL
   via `URL.createObjectURL`, trigger a hidden `<a>` download named
   `checkbook-data.json`, then revoke the URL. **Import**: a hidden
   `<input type="file">` (accept `.json`) is triggered by the Import button; a
   `FileReader.readAsText` reads the file, `JSON.parse` deserializes it, and
   `validateImportData()` checks every element has the transaction shape before
   any mutation. On success, `confirm()` guards the destructive replace; the
   store is set to the imported array, `nextId` is recomputed, `dbSaveAll()`
   rewrites IndexedDB, `renderTransactions()` + `updateBalance()` refresh the
   UI, and the view switches back to List.

## Component Relationships
```
index.html
  │
  ├── manifest.json          → PWA installability (standalone display)
  ├── sw.js                   → Service worker (app-shell caching, cache-first)
  │
  └── Inline <script>
        ├── Constants: CATEGORIES[], ACCOUNTS[] (inlined, Phase 5)
        ├── Export:    EXPORT_FILENAME (Phase 6)
        ├── State: transactions[], nextId, editId, …
        ├── IndexedDB: dbOpen(), dbSaveAll(), dbLoadAll()
        ├── populateSelects() → reads inlined CATEGORIES / ACCOUNTS
        ├── formatRupiah()    → currency formatting
        ├── computeBalance()  → reduce over transactions
        ├── updateBalance()   → DOM update of #balance
        ├── renderTransactions() → DOM rebuild of #transaction-list
        ├── showView()        → tab / view switching (list, add, import-export)
        ├── addTransaction()  → form submit → push or update
        ├── editTransaction() → pre-fill form, switch to Add tab
        ├── deleteTransaction() → filter + re-render
        ├── toggleOverflowMenu() / closeOverflowMenu()
        ├── exportTransactions() → Blob + object URL + anchor download (Phase 6)
        ├── validateImportData() → full-shape validation before mutation (Phase 6)
        ├── importFileInput handler → FileReader → validate → confirm → replace
        │   → dbSaveAll → renderTransactions → updateBalance → showView('list')
        └── DOMContentLoaded → wires all listeners, initial render
```

## Critical Implementation Paths
1. **Form → Transaction**: `addTransaction()` validates, converts
   money-out to negative, pushes to `transactions[]`, re-renders, resets form.
2. **Edit → Form**: `editTransaction(id)` finds the transaction, sets
   `editId`, pre-fills all fields, relabels button to "Update Entry", switches
   to Add view. The next submit updates in place via `findIndex`.
3. **Delete**: `deleteTransaction(id)` confirms via `confirm()`, filters the
   array, re-renders.
4. **Balance**: `computeBalance()` sums `tx.amount` (already signed);
   `updateBalance()` applies `formatRupiah()` and sets the CSS class
   (`positive` / `negative` / `zero`).
5. **Export → File**: `exportTransactions()` serializes `transactions` to JSON
   via `JSON.stringify`, wraps in a `Blob`, creates an object URL, and triggers
   a hidden `<a download="checkbook-data.json">` click. The URL is revoked after
   100ms.
6. **File → Store (Import)**: the file-input `change` handler reads the file via
   `FileReader.readAsText`, parses JSON, validates the full shape via
   `validateImportData()`. Only if validation passes AND the user confirms via
   `confirm()` does it replace `transactions`, recompute `nextId`, call
   `dbSaveAll()`, re-render, and switch to the List view. A single invalid
   record causes wholesale rejection — the store is never partially modified.

## Known Discrepancy
The **cashflow-entries spec** still lists accounts as `Cash, Checking, Savings`
in some scenarios, but the inlined constants in `index.html` use
`Primary, Istri, Savings`. This is an intentional localization for the
Indonesian user. The spec's generic example values were never updated after
localization. Future spec revisions should sync the account list.
