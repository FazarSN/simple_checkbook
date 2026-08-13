## Why

Phase 3 established the full navigation, edit, and delete workflow for the checkbook PWA. Now the app needs to match the user's real-world context: they manage Indonesian Rupiah (no decimals, thousands separated with dots), need a short descriptive name for each entry, want categories and accounts to be easy to update annually, and want a cleaner, more modern visual design. Phase 4 adapts the app from its current state to these real-world requirements.

## What Changes

- **Money display uses Indonesian Rupiah format** — amounts are displayed with an "Rp" prefix, dot (`.`) as the thousands separator, and no decimal places (whole numbers only, via `Math.round`). For example, `1000000` displays as `Rp 1.000.000` and `-50000` as `−Rp 50.000`. The running balance and every per-transaction amount adopt this format. The input field (`type="number"`) retains `step="0.01"` for flexibility; only the **display** is rounded and formatted. **BREAKING**: the visible money format changes from `+1.000.000` style (no currency, no thousands separator) to `Rp 1.000.000`.

- **Add a "Name" free-text field to entries** — the entry form gains a text input labeled "Name" for a short description. Each transaction object stores a `name` property, and the transaction list displays the Name as a new column (added as the second column, between Type and Amount).

- **Extract categories and accounts into `src/constants.js`** — the `CATEGORIES` and `ACCOUNTS` arrays are moved from inline `<script>` in `index.html` into a dedicated `src/constants.js` file, loaded via `<script src="constants.js">`. This makes annual updates to the option lists a single-file edit with no change to application logic. **BREAKING**: the app is no longer a single self-contained `index.html` file — it now depends on an external script. The zero-toolchain constraint is preserved (no npm, no build step; any static server like `python -m http.server` serves both files).

- **Refresh the UI to a clean, modern (Twitter/X-style) design** — white background (`#FFFFFF`), minimal card-style containers with subtle `1px` separators (instead of heavier box-shadow cards), increased whitespace, cleaner typography, and the existing blue accent (`#4A90D9`) retained for consistency. The layout and interactive behavior (tabs, overflow menu, edit/delete) are unchanged — this is purely a visual refresh.

## Capabilities

### New Capabilities

- `money-formatting`: Display monetary values using Indonesian Rupiah convention — "Rp" currency prefix, dot (`.`) as the thousands separator, no decimal places (rounded to the nearest whole number). Applies to both the running balance and per-transaction amounts.

- `entry-constants`: Maintain the pre-defined category and account option lists in a separate constants file (`src/constants.js`) so they can be updated independently and annually without touching application logic in `index.html`.

### Modified Capabilities

- `cashflow-entries`: The entry form gains a free-text "Name" field for a short description. Each transaction object stores a `name` property. The transaction list displays the Name as a new column. (Core record-and-view behavior, running balance, and session-scoped persistence from Phase 2 remain unchanged.)

## Impact

- **New file**: `src/constants.js` — exports `CATEGORIES` and `ACCOUNTS` arrays; loaded by `index.html` via `<script src="constants.js">`
- **Modified file**: `src/index.html` —
  - Loads `src/constants.js` via `<script>` tag
  - `formatAmount()` rewritten to produce `Rp X.XXX` format (dot thousands, no decimals)
  - Entry form gains a "Name" text input field
  - Transaction objects include a `name` property
  - Transaction table gains a "Name" column
  - CSS refreshed to clean modern style (white background, subtle separators, increased whitespace) while preserving all interactive behavior
- **Unchanged files**: `src/manifest.json`, `src/sw.js`, `src/icons/*`
- **No new dependencies** — still pure HTML/CSS/JS, zero-toolchain (no npm packages, no build step)
- **Target platform**: Android (Chrome) and desktop (Chrome), served via `python -m http.server` from the `src/` directory
