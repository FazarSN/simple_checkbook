# Project Brief

## Project Name
**Simple Checkbook** — a Progressive Web App (PWA) for personal checkbook management.

## Core Description
A PWA built in iterative phases using a spec-driven development workflow. It is
targeted at personal finance tracking on Android low-spec devices, running with
zero external dependencies — only a text editor and a browser are required.

## Primary Goals
1. Allow users to record cashflow entries (money in / money out) with a name,
   amount, category, and account.
2. Display a running balance in real time, formatted as Indonesian Rupiah
   (`Rp N.NNN`) with dot thousands separators and whole-number rounding.
3. Provide add / edit / delete operations via an overflow menu on each
   transaction row.
4. Be installable on Android (home-screen launch in standalone mode).
5. **Implement data persistence and offline capability (done in Phase 5):** transactions survive reloads via IndexedDB; the app shell loads offline via service-worker caching.

## Scope
- **In scope**: Single-file PWA (HTML + inline CSS + inline JS) with inlined
  `CATEGORIES`/`ACCOUNTS` constants (no external `constants.js`), service worker
  with app-shell caching, web app manifest, SVG icons, IndexedDB persistence.
- **Out of scope / deferred**: Cloud sync, user accounts, data export/import,
  background sync, and push notifications (explicitly out of scope in the Phase 5
  design). All original roadmap items (phases 1–5) are implemented.

## Development Methodology
- **OpenSpec** (`schema: spec-driven`) — every feature begins as a spec
  (`openspec/specs/<name>/spec.md`), then progresses through proposal → design
  → tasks → apply → archive within `openspec/changes/`.
- Specs implemented: phases 1 through 5. Phase 5 change
  `phase-5-persistence-offline` is applied to code but **not yet archived** —
  a documentation/memory-bank step remains before archiving.

## Key Stakeholder
A single user developing this app solo for personal use, with a focus on
reliability, simplicity, and the Indonesian Rupiah currency.
