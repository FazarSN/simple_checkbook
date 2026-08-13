## Context

Phase 3 is implemented in `src/index.html` as a single-file PWA with inline CSS and JS. The page shows a balance display, an entry form (type selector, amount, category, account), and a transaction list table with bottom tab navigation (List / Add Transaction) and per-row overflow menus for edit/delete. Transactions are stored in an in-memory array `{ id, type, amount, category, account }` (added in Phase 3). Categories and accounts are defined inline as `const CATEGORIES` and `const ACCOUNTS` at the top of the inline `<script>`. The money format is `+N` / `−N` with no currency symbol or thousands separator. The service worker is a no-cache stub. The zero-toolchain constraint is preserved. See `proposal.md` for motivation and the spec files under `specs/` for requirements.

## Goals / Non-Goals

**Goals:**
- Display all monetary values as Indonesian Rupiah: `Rp` prefix, dot (`.`) thousands separator, no decimals (rounded to whole numbers)
- Add a free-text "Name" field to the entry form, stored on each transaction object, displayed as a new column in the transaction list
- Move `CATEGORIES` and `ACCOUNTS` into a separate `src/constants.js` file loaded via `<script src="constants.js">`, preserving the zero-toolchain constraint
- Refresh the visual design to a clean, modern (Twitter/X-style) aesthetic: white background, subtle 1px separators, increased whitespace, flat styling, blue accent retained
- Preserve all Phase 3 interactive behavior (tab navigation, overflow menu, edit/delete, in-memory session scope, PWA installability)

**Non-Goals:**
- No data persistence — entries remain in-memory; reloads clear all data (same as Phase 2/3)
- No service-worker caching or offline support (unchanged stub)
- No user-created categories or accounts (still pre-defined in `constants.js`)
- No currency switching — Rupiah format is fixed for this phase
- No responsive breakpoints beyond the existing 480px mobile-first container
- No separate CSS file — styles stay inline in `index.html` (only JS moves to `constants.js`)

## Decisions

### Decision 1: Manual Rupiah formatting in `formatRupiah()`
**Chosen**: Replace `formatAmount()` with a new `formatRupiah(amount)` function. The function: (1) determines sign — positive/zero shows `Rp `, negative shows `−Rp `; (2) rounds the absolute value with `Math.round()` to get a whole number (no decimals); (3) converts to string and inserts a dot (`.`) every three digits from the right using regex `replace(/\B(?=(\d{3})+(?!\d))/g, '.')`; (4) combines sign + `Rp ` + grouped number. Example: `1000000` → `Rp 1.000.000`, `-50000` → `−Rp 50.000`, `0` → `Rp 0`.

**Rationale**: Gives precise control over the "Rp " prefix (with space) and dot separator — `toLocaleString('id-ID', {style:'currency'})` produces `Rp1.000.000` (no space) and varies by browser/Node version. Manual formatting is deterministic, dependency-free, and trivial to understand in a single-file codebase.

**Alternatives considered:**
- *`toLocaleString('id-ID', {style:'currency', currency:'IDR'})`*: Rejected — no space after "Rp", formatting varies across environments, and adds locale-dependency fragility.
- *Keeping the +/- sign format with "Rp"*: Rejected — the user explicitly wants `Rp` prefix with dot thousands, not `+Rp`.

### Decision 2: Keep input field as `type="number" step="0.01"`
**Chosen**: The amount input retains `type="number" min="0.01" step="0.01"` for entry. Only the **display** (in `formatRupiah`) rounds to whole numbers via `Math.round()`. The stored transaction `amount` retains full precision.

**Rationale**: The user specified that the *display* should show no decimals ("I never want decimal on my money"). Keeping `step="0.01"` allows the user to enter fractional values if needed; only the rendered output is rounded. This avoids breaking the existing `parseFloat(amountInput.value)` validation logic. If the user later confirms integer-only entry is desired, changing `step` to `1` is a one-line edit.

**Alternatives considered:**
- *Change `step` to `1`*: Deferred — the user only specified display behavior, not input constraints. Will note as a follow-up option.

### Decision 3: Separate `src/constants.js` as a plain `<script>`, not ES module
**Chosen**: Create `src/constants.js` containing:
```js
const CATEGORIES = ['Income', 'Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];
const ACCOUNTS = ['Cash', 'Checking', 'Savings'];
```
Loaded in `index.html` via `<script src="constants.js"></script>` placed **before** the inline `<script>` block (or before `DOMContentLoaded`), so the constants are available when `populateSelects()` runs. The arrays remain as global-scope `const` declarations — no ES module `export`/`import`.

**Rationale**: ES modules (`type="module"`) would require changing to `import` syntax and could complicate the zero-toolchain approach on some static servers. Plain `<script>` with global `const` is the simplest approach that maintains compatibility with the existing inline JS, which already references `CATEGORIES` and `ACCOUNTS` as globals. The file is loaded before the DOM script runs, ensuring variables are in scope.

**Alternatives considered:**
- *ES module with export/import*: Rejected — adds complexity; the inline script would need `type="module"` too, and module scripts defer by default which changes load timing semantics.
- *JSON file loaded via fetch()*: Rejected — would require an HTTP request and async handling, complicating the synchronous `DOMContentLoaded` initialization.
- *Inline `<script>` still defining constants*: Rejected — defeats the purpose of separating constants for annual editing.

### Decision 4: "Name" field — optional, stored as `name` property, new table column
**Chosen**: Add a text input `<input type="text" id="name" name="name" placeholder="e.g. Salary, Groceries">` to the entry form. The `addTransaction()` handler reads `document.getElementById('name').value` (trimmed) and stores it as `tx.name`. The transaction table gains a "Name" `<th>` and a `<td>` rendering `tx.name || ''`. The Name column is placed as the second column (between Type and Amount) per the proposal. During edit mode, the Name field is pre-filled from the existing transaction.

**Rationale**: A free-text description is a natural addition to a checkbook app — it tells the user *what* a transaction is for at a glance. Placing it as the second column (after Type, before Amount) keeps the most identifying information first. Optional (empty string if blank) so existing entries without a name remain valid.

**Alternatives considered:**
- *Required field*: Rejected — would break the existing add flow for users who don't want to type a name.
- *Tooltip or inline display instead of column*: Rejected — the user explicitly wants it as input, and a table column is the cleanest tabular way to show it in the list.

### Decision 5: Twitter/X-style UI refresh
**Chosen**: Apply a clean, modern visual refresh with these CSS changes:
- **Background**: Change `body` background from `#f5f5f5` to `#FFFFFF` (pure white, Twitter/X aesthetic).
- **Containers**: Reduce `box-shadow` on cards (balance section, entry form, transaction list) from `0 1px 3px rgba(0,0,0,0.1)` to a subtle `0 1px 1px rgba(0,0,0,0.05)` or remove shadows entirely in favor of `1px` border separators (`#e1e4e8` style, the X border color).
- **Form inputs**: Lighter border (`#e1e4e8`), more rounded corners (`8px`), increased padding, lighter label color (`#656d76` like X's text-secondary).
- **Table**: Replace `border-top: 1px solid #eee` row separators with `1px solid #e1e4e8`. Use `#656d76` for header labels. Increase padding.
- **Typography**: Slightly cleaner font sizes and weights, more letter-spacing on headers.
- **Tabs**: Keep blue accent `#4A90D9` for active state; use lighter gray (`#656d76`) for inactive.
- **Buttons**: Flatter style, consistent border-radius.

**Rationale**: Twitter/X's design language is clean, minimalist, and familiar to Android users. It uses whitespace, subtle separators, and a white canvas — a natural evolution from the current "card with shadow" look. The blue accent is retained to preserve brand continuity from Phases 1–3.

**Alternatives considered:**
- *Material Design (heavy elevation/shadows)*: Rejected — the user said "Twitter UI," which is flatter than Material.
- *Neumorphism*: Rejected — adds visual complexity and accessibility issues; not "clean."
- *Dark mode*: Rejected — out of scope; user said "clean and modern," not "dark."

### Decision 6: Constants file placement relative to inline script
**Chosen**: Place `<script src="constants.js"></script>` immediately before the closing `</body>` tag, alongside or just before the existing inline `<script>`. Since `<script>` (without `defer`) executes synchronously in order of appearance, placing `constants.js` before the inline script guarantees `CATEGORIES` and `ACCOUNTS` are defined when `populateSelects()` runs.

**Rationale**: Simplest ordering guarantee. No need for `defer` or `DOMContentLoaded`-based loading hacks.

**Alternatives considered:**
- *`<script src="constants.js" defer>`*: Rejected — `defer` changes execution order semantics; synchronous `<script>` before the inline block is simpler and sufficient.

## Risks / Trade-offs

- **[Risk] Breaking the single-file constraint** → The app now depends on `src/constants.js`. Anyone opening `index.html` directly via `file://` protocol will find `constants.js` also loads (same directory). The zero-toolchain constraint is preserved (no npm, no build); any static server serves both files. Mitigation: Document that `python -m http.server` from `src/` is the recommended way to run (this was already documented in Phase 1/2 README).

- **[Risk] Money display rounding may confuse users who enter fractional amounts** → Display rounds to whole numbers but stored value retains precision. E.g., entering `1000.50` displays as `Rp 1.001`. Mitigation: Display rounding is clearly a display-only concern; the spec notes `step="0.01"` is retained. Can be revisited if user wants integer-only input.

- **[Risk] UI refresh may subtly break existing layout** → The tab navigation, overflow menu, and edit/delete flows must remain fully functional after CSS changes. Mitigation: All interactive JS is unchanged — only CSS values (colors, borders, shadows, spacing) are modified. Visual testing of all flows required.

- **[Risk] Name column may crowd the table on small screens** → Adding a 5th column to a table that already has 4 columns (Type, Amount, Category, Account, + overflow button) increases horizontal density. Mitigation: The Name column will use a narrower font and may be hidden or truncated on very small screens. The table already overflows naturally on small viewports.

- **[Risk] `−` (Unicode minus) vs `-` (ASCII hyphen) inconsistency** → The existing code uses `−` (Unicode minus, U+2212) in `formatAmount`. The new `formatRupiah` must preserve this for money-out. Mitigation: Explicitly use `'−Rp '` prefix for negatives and `'Rp '` for positives/zero.

## Migration Plan

Phase 4 modifies `src/index.html` from its Phase 3 state and adds one new file:

1. **New file**: Create `src/constants.js` containing the `CATEGORIES` and `ACCOUNTS` arrays (same values as Phase 3 inline constants).

2. **HTML — load constants**: Add `<script src="constants.js"></script>` before the inline `<script>` block in `index.html`.

3. **HTML — remove inline constants**: Delete the `const CATEGORIES = [...]` and `const ACCOUNTS = [...]` lines from the inline `<script>` in `index.html` (now sourced from `constants.js`).

4. **HTML — Name field**: Add a "Name" text input to the entry form (between Amount and Category, or after Account). Add a "Name" `<th>` and `<td>` to the transaction table header and row template (second column, between Type and Amount).

5. **JS — money formatting**: Replace `formatAmount()` with `formatRupiah()` implementing the "Rp" prefix + dot thousands + `Math.round()` + no decimals logic. Update all call sites (`updateBalance()` and `renderTransactions()`).

6. **JS — Name in addTransaction**: Read the Name input value in `addTransaction()`, store as `tx.name`, pre-fill on edit, and reset the field after submission.

7. **CSS — UI refresh**: Update colors, borders, shadows, spacing, and typography to the Twitter/X-style clean aesthetic described in Decision 5.

Rollback: Revert `src/index.html` to its Phase 3 version and delete `src/constants.js` (preserved in git history).

## Open Questions

- **Input `step` attribute**: Should `step` be changed from `"0.01"` to `"1"` to enforce integer-only entry now that display shows no decimals? Currently keeping `"0.01"` (display-only rounding) as a safe default. Can be changed in one line if integer-only input is preferred.
