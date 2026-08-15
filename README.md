# Simple Checkbook

A Progressive Web App (PWA) for personal checkbook management — built in
phases using a spec-driven development workflow.

## What It Is

Simple Checkbook is a lightweight, zero-dependency PWA for tracking personal
cashflow — money in and money out — with a running balance displayed in
Indonesian Rupiah. It runs on both desktop Chrome and Android low-spec
devices, with no npm packages, no build tools, and no account required.

Transactions are currently **session-scoped** (lost on page reload). Offline
support and data persistence are planned for a future phase.

## Features

### Core Functionality
- **Transaction list** — a table of all recorded cashflow entries, each showing
  type, name, amount, category, and account.
- **Running balance** — computed as the sum of all inflows minus outflows,
  updated in real time as entries are added, edited, or deleted.
- **Add / Edit / Delete** — an overflow menu (⋮) on each row provides per-row
  Edit and Delete actions.

### Entry Form
- **Type selector** — choose "Money In (+)" or "Money Out (−)" per entry.
- **Amount** — numeric input, rounded to whole numbers.
- **Name** — free-text description (optional, e.g. "Salary", "Groceries").
- **Category dropdown** — Income, Food, Transport, Entertainment, Bills,
  Shopping, Other.
- **Account dropdown** — Primary, Istri, Savings.

### Money Formatting (Indonesian Rupiah)
All monetary values are displayed using the Rupiah convention:
- `Rp` currency prefix (e.g. `Rp 1.000.000`)
- Dot (`.`) as the thousands separator
- No decimal places (amounts rounded to the nearest whole number)
- Unicode minus sign (U+2212) for negative amounts (e.g. `−Rp 50.000`)

### PWA / Installability
- **Installable** on Android via "Add to Home screen" — launches in
  `standalone` display mode (no browser address bar or navigation UI).
- **Service worker** registered (`sw.js`) for install/activate lifecycle.
  Caching is planned for a future phase.

## Project Structure

```
simple_checkbook/
├── README.md              # This file
├── .gitignore
├── memory-bank/           # Cline memory bank (project knowledge base)
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── activeContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   └── progress.md
├── openspec/              # Spec-driven development system
│   ├── config.yaml
│   ├── specs/
│   │   ├── checkbook-app/
│   │   ├── cashflow-entries/
│   │   ├── entry-constants/
│   │   ├── money-formatting/
│   │   ├── app-navigation/
│   │   └── transaction-actions/
│   └── changes/
│       └── archive/
│           ├── 2026-08-14-simple-checkbook-pwa-phase-1/
│           ├── 2026-08-14-simple-checkbook-pwa-phase-2/
│           ├── 2026-08-14-simple-checkbook-pwa-phase-3/
│           └── 2026-08-14-simple-checkbook-pwa-phase-4/
└── src/
    ├── index.html         # Main app — HTML + inline CSS + inline JS (693 lines)
    ├── constants.js       # CATEGORIES and ACCOUNTS arrays
    ├── sw.js              # Service worker stub (install/activate only)
    ├── manifest.json      # PWA web app manifest
    └── icons/
        ├── icon-192.svg   # 192×192 app icon
        └── icon-512.svg   # 512×512 app icon
```

## Prerequisites

- A modern web browser (Chrome / Chromium recommended)
- Python 3+ or Node.js (for the local web server — needed to test PWA features)
- **No npm packages, no build tools, no Android SDK required**

## Running Locally

### Option A — Open directly (quick check)

Double-click `src/index.html` in Chrome. The app loads instantly — all CSS
and JS are inline, with no external stylesheets or fonts.

> ⚠️ **Service workers require an HTTP origin.** To test installability and
> service-worker registration, use Option B.

### Option B — Local web server (recommended for full PWA testing)

Using Python 3:

```bash
cd src
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in Chrome.

## Installing on Android

1. Open the app in Chrome on your Android device (via local server or after
   transferring the `src/` files).
2. Tap the **three-dot menu** → **Add to Home screen**.
3. Confirm the dialog — the app icon will appear on your home screen.
4. Launch from the home screen to open in **standalone mode** (no browser
   address bar or navigation UI).

## Development Phases

This project is built iteratively using the **OpenSpec** (`schema:
spec-driven`) workflow. Every feature begins as a spec in `openspec/specs/`,
then progresses through proposal → design → tasks → apply → archive within
`openspec/changes/`.

### Phase 1 — Scaffold (2026-08-14)
- "Hello World" PWA scaffold proving the development workflow end-to-end.
- Web app manifest for Android installability (`display: standalone`).
- Service worker stub with install/activate lifecycle (no caching).
- SVG app icons (192×192 and 512×512).

### Phase 2 — Basic Checkbook (2026-08-14)
- Transaction list rendered from an in-memory array.
- Running balance computed as the sum of all signed transaction amounts.

### Phase 3 — Navigation & Actions (2026-08-14)
- Bottom tab bar with **List** and **Add Transaction** tabs.
- View switching between the transaction list and the entry form.
- Per-row overflow menu (⋮) with **Edit** and **Delete** actions.
- Edit pre-fills the form and relabels the submit button to "Update Entry".
- Delete confirms via a `confirm()` dialog.

### Phase 4 — Full Entry Form & Formatting (2026-08-14)
- Complete cashflow entry form: type selector (money-in / money-out), amount,
  name (free-text), category dropdown, account dropdown, and submit button.
- `constants.js` externalizes the `CATEGORIES` and `ACCOUNTS` arrays so they
  can be updated annually without touching application logic.
- `formatRupiah()` renders all monetary values as `Rp N.NNN` (dot thousands
  separator, whole numbers, Unicode minus for negatives).
- Form clears after submission; edit updates in place; delete removes and
  recomputes the balance.

### Phase 5 (planned) — Persistence & Offline Support
- Persist transactions to IndexedDB (or `localStorage`) so data survives page
  reloads.
- Add caching strategies to `sw.js` for offline app-shell and runtime request
  caching.

## Spec Compliance

The project implements six specifications across four archived OpenSpec changes:

| Spec | Phase | Status |
|---|---|---|
| `checkbook-app` | 1 | ✅ Implemented — PWA scaffold, manifest, service worker stub, zero dependencies |
| `cashflow-entries` | 4 | ✅ Implemented — full entry form, transaction list, running balance, edit/delete, unique IDs |
| `entry-constants` | 4 | ✅ Implemented — `constants.js` with `CATEGORIES` / `ACCOUNTS` |
| `money-formatting` | 4 | ✅ Implemented — Rupiah formatting (`Rp N.NNN`, dot separators, no decimals) |
| `app-navigation` | 3 | ✅ Implemented — bottom tab bar, List/Add views |
| `transaction-actions` | 3 | ✅ Implemented — overflow menu, edit, delete with confirmation |

## Known Limitations & Discrepancies

1. **Session-scoped data** — All transactions are lost on page reload. Data
   persistence is the primary goal of Phase 5.
2. **Service worker is a stub** — No caching is implemented. Offline use is
   not yet supported.
3. **Spec drift — account values** — The `cashflow-entries` spec lists accounts
   as `Cash, Checking, Savings`, but the implementation in `constants.js` uses
   the localized values `Primary, Istri, Savings` (intentional for the
   Indonesian user). This should be synced in a future spec revision.

## What's Next

- **Phase 5** — Data persistence (IndexedDB or `localStorage`) and offline
  support via service-worker caching.

## License

This is a personal project developed for individual use.
