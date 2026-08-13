## Context

Phase 1 established a "Hello World" PWA under `src/` — a single `index.html` with inline CSS, a `manifest.json`, and a service-worker stub. The project continues the zero-toolchain constraint: pure HTML/CSS/JS, no npm packages, no build step. The development machine has VS Code and Node.js but no Flutter/Android SDK. See `proposal.md` for full motivation.

## Goals / Non-Goals

**Goals:**
- Replace the "Hello World" screen with a cashflow entry form and transaction list
- Keep a single `index.html` with inline CSS and inline JS — no new files, no external dependencies
- Pre-defined categories and accounts baked into the JS (no user management)
- Running balance updates live as entries are added
- App remains installable on desktop Chrome (manifest + service worker links preserved)

**Non-Goals:**
- No data persistence — entries are in-memory only; no storage mechanism is added in this phase
- No user-defined categories or accounts — pre-defined defaults only
- No transaction filtering, sorting, or editing/deleting
- No offline caching — the service worker registers but does not cache assets (no offline support in this phase)
- No separate CSS or JS files — stays inline in `index.html`

## Decisions

### Decision 1: In-memory data model with inline JS
**Chosen**: A module-level JavaScript array (`transactions`) holds transaction objects `{ type, amount, category, account, timestamp }`. The array is mutated directly by `addTransaction()` and re-rendered by `renderTransactions()`.
**Rationale**: Maintains the Phase 1 "single HTML file, no external dependencies" approach. A plain array is sufficient for an in-memory list of a few dozen entries.
**Alternatives considered:**
- *localStorage*: Rejected for Phase 2 — the user explicitly chose no persistence to keep things simple. Adding `localStorage` now would conflate persistence with the cashflow feature.
- *IndexedDB*: Rejected — overkill for an in-memory, session-scoped dataset; adds API complexity without benefit.

### Decision 2: Signed amount representation
**Chosen**: Store the amount as a signed number internally (positive for money in, negative for money out). Display with a leading `+`/`−` sign in the list.
**Rationale**: Simplifies balance computation to a single `reduce` sum. The type selector ("money in" / "money out") is a UX affordance that determines the sign at entry time.
**Alternatives considered:**
- *Separate type field + absolute amount*: Would require subtraction logic at display and balance time. The signed representation is cleaner for the single running-balance calculation.

### Decision 3: Pre-defined categories and accounts as JS constants
**Chosen**: Define `CATEGORIES` and `ACCOUNTS` as constant arrays in the inline script. Render them as `<select>` options in the form.
**Rationale**: "Start simple" — the user wants to get cashflow recording working first. Pre-defined defaults cover the common cases. Adding a management UI for categories/accounts would be a separate concern.
**Alternatives considered:**
- *User-creatable categories/accounts*: Rejected for Phase 2 — adds a management sub-feature and a UI for CRUD operations on categories/accounts. Deferred (not in scope for this phase).

### Decision 4: Inline form + inline list in a two-section layout
**Chosen**: The page has two sections: an entry form (top) and a transaction list with balance (bottom). Both are in the same `index.html`. The "Hello World" `<h1>` is replaced by a page title.
**Rationale**: Keeps everything in one file (zero-toolchain constraint). A two-section layout is the minimum to satisfy both "entry form" and "transaction list" requirements.
**Alternatives considered:**
- *Separate pages / routing*: Rejected — would require either multiple HTML files or client-side routing, adding unnecessary complexity.

### Decision 5: Desktop PWA installability preserves Phase 1 scaffolding
**Chosen**: The `<link rel="manifest">` tag and service-worker registration script from Phase 1 are preserved in the updated `index.html`. No new service-worker caching logic is added.
**Rationale**: Desktop Chrome uses the same install criteria as Android: a valid manifest, a registered service worker, and HTTP serving. The existing Phase 1 manifest (standalone display, icons, `start_url`) and service worker (registers on page load) already satisfy these. The app is served via `python -m http.server` for desktop testing, providing the required localhost origin.
**Alternatives considered:**
- *Add service worker caching (app shell pattern)*: Rejected — adds caching complexity that the user explicitly opted out of. The service worker still registers (enabling the install prompt) without caching assets.

## Risks / Trade-offs

- **[Risk] No persistence means data is lost on refresh** — Mitigation: Documented as an explicit requirement (Scenario: Entries are lost on page reload). Persisting entries across sessions will require adding a storage layer (e.g. `localStorage`) by wrapping the `transactions` array with load/store calls in a future phase.
- **[Risk] Single HTML file will grow large** — Mitigation: Phase 2 keeps CSS and JS minimal. If the file becomes unwieldy, a future phase can split into separate `.css` and `.js` files (still no build toolchain needed).
- **[Risk] Pre-defined categories/accounts may not match user needs** — Mitigation: `Other` category provides a catch-all. A future phase can add custom category/account management.
- **[Risk] Desktop install relies on HTTP serving** — Mitigation: The README documents `python -m http.server` as the local server. If a user double-clicks `index.html` directly (file:// protocol), the install prompt will not appear — this is a browser security restriction, not a code issue.

## Migration Plan

Phase 1 (Hello World) has no user data to migrate. Phase 2 replaces the `<body>` content of `src/index.html`:
- The "Hello World" `<h1>` becomes a page title (`<h1>Simple Checkbook</h1>`)
- The `<link rel="manifest">` and service-worker registration script are preserved unchanged (required for desktop PWA installation)
- The inline `<style>` block is extended with form and list styling

Rollback: Reverts `src/index.html` to its Phase 1 state (the "Hello World" version is preserved in the Phase 1 change's git history).

## Open Questions

(none — Phase 2 scope is intentionally narrow and all decisions were resolved with the user)
