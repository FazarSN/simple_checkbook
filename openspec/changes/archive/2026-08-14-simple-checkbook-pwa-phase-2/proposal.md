## Why

Phase 1 established a "Hello World" PWA scaffold with installability on Android. The next step is to add the core checkbook functionality: recording cashflow entries (money in or money out) with an associated category and account, plus a transaction list view with a running balance. This delivers the minimum viable checkbook experience while keeping the zero-toolchain constraint (pure HTML/CSS/JS, no npm packages).

## What Changes

- Add a cashflow entry form to the PWA where users can record money in (+) or money out (-), selecting a pre-defined category and account
- Add a transaction list view showing all recorded entries with amount, type, category, and account
- Add a running balance (net total) computed from the entries
- **No data persistence** — entries are held in memory for the session only
- **Desktop PWA installability** — the app remains installable on desktop Chrome by preserving the manifest link and service-worker registration from Phase 1 (no offline caching)
- **No new dependencies** — continues the Phase 1 constraint of pure HTML/CSS/JS, no npm packages
- Pre-defined defaults for categories and accounts (user cannot create new ones in Phase 2)

## Capabilities

### New Capabilities

- `cashflow-entries`: Recording and viewing cashflow entries (money in or money out) with a pre-defined category and account association, plus a transaction list with running balance.

### Modified Capabilities

(none — no existing spec-level requirements are changing; the Phase 1 `checkbook-app` capability described only the hello-world screen and PWA scaffold)

## Impact

- **New files**: modifications to `src/index.html` to add the entry form and transaction list UI, plus inline JavaScript to manage in-memory state and compute the running balance. The manifest link and service-worker registration from Phase 1 are preserved so the app remains installable on both Android and desktop Chrome
- **Unchanged files**: `src/manifest.json`, `src/sw.js`, `src/icons/*`
- **No new dependencies** — pure HTML/CSS/JS
- **Target platform**: Android (Chrome) and desktop (Chrome) — the PWA installs to the home screen on Android and to the desktop via Chrome's install prompt when served via a local HTTP server
- **Note**: Phase 2 preserves the PWA installability scaffolding from Phase 1 (manifest + service worker). No offline caching is added; entries are session-scoped only
