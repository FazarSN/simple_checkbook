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
5. Eventually support data persistence and offline capability (Phase 5).

## Scope
- **In scope**: Single-file PWA (HTML + inline CSS + inline JS), external
  `constants.js` for category/account lists, service-worker stub, web app
  manifest, SVG icons.
- **Out of scope / deferred**: Offline caching of app shell and data
  persistence to IndexedDB (planned for Phase 3+). Transaction data is
  currently session-scoped (lost on reload).

## Development Methodology
- **OpenSpec** (`schema: spec-driven`) — every feature begins as a spec
  (`openspec/specs/<name>/spec.md`), then progresses through proposal → design
  → tasks → apply → archive within `openspec/changes/`.
- Specs already implemented and archived: phases 1 through 4.

## Key Stakeholder
A single user developing this app solo for personal use, with a focus on
reliability, simplicity, and the Indonesian Rupiah currency.
