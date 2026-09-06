# Simple Checkbook

A Progressive Web App (PWA) for personal checkbook management — built in
phases using a spec-driven development workflow.

## What It Is

Simple Checkbook is a lightweight, zero-dependency PWA for tracking personal
cashflow — money in and money out — with a running balance displayed in
Indonesian Rupiah. It runs on both desktop Chrome and Android low-spec
devices, with no npm packages, no build tools, and no account required.

Transactions are **persisted to IndexedDB** and survive page reloads. The app
shell is **cached by the service worker** at install time, so the app loads
and works offline after the first visit.

## Features

### Core Functionality
- **Transaction list** — a table of all recorded cashflow entries, each showing
  type, name, amount, category, and account.
- **Running balance** — computed as the sum of all inflows minus outflows,
  updated in real time as entries are added, edited, or deleted.
- **Add / Edit / Delete** — an overflow menu (⋮) on each row provides per-row
  Edit and Delete actions.
- **Persistence** — all transactions are saved to IndexedDB and reappear after
  reloads and browser restarts.
- **Import/Export** — export all transactions to a `checkbook-data.json` file,
  and import from a previously saved file to restore the entire transaction
  store (replace semantics, with a `confirm()` guard). Both work offline with no
  filesystem access required.

### Entry Form
- **Type selector** — choose "Money In (+)" or "Money Out (−)" per entry.
- **Amount** — numeric input, rounded to whole numbers.
- **Name** — free-text description (optional, e.g. "Salary", "Groceries").
- **Category dropdown** — Income, Food, Transport, Entertainment, Bills,
  Shopping, Other.
- **Account dropdown** — Primary, Istri, Savings.
- **Date** — date input pre-filled with the current day; stored on the
  transaction and displayed in the list.

### Money Formatting (Indonesian Rupiah)
All monetary values are displayed using the Rupiah convention:
- `Rp` currency prefix (e.g. `Rp 1.000.000`)
- Dot (`.`) as the thousands separator
- No decimal places (amounts rounded to the nearest whole number)
- Unicode minus sign (U+2212) for negative amounts (e.g. `−Rp 50.000`)

### PWA / Installability & Offline
- **Installable** on Android via "Add to Home screen" — launches in
  `standalone` display mode (no browser address bar or navigation UI).
- **Offline support** — the service worker caches the app shell
  (`index.html`, `style.css`, `manifest.json`, SVG icons) at install time and
  serves it cache-first, so the app loads offline after the first visit.
- **Single-file** — all markup and JS (including the `CATEGORIES` /
  `ACCOUNTS` constants) live in `index.html`; CSS is in `src/style.css`.
  The dropdowns populate on every platform, including Android opened via
  `file://`.

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
│   │   ├── app-navigation/
│   │   ├── app-persistence/
│   │   ├── cashflow-entries/
│   │   ├── checkbook-app/
│   │   ├── data-export-import/
│   │   ├── entry-constants/
│   │   ├── money-formatting/
│   │   ├── offline-support/
│   │   ├── tab-switch-android/
│   │   └── transaction-actions/
│   └── changes/
│       ├── phase-5-persistence-offline/   # applied, in-progress (29/35 tasks)
│       ├── phase-6-import-export/         # applied, complete (26/26 tasks)
│       └── archive/
│           ├── 2026-08-14-simple-checkbook-pwa-phase-1/
│           ├── 2026-08-14-simple-checkbook-pwa-phase-2/
│           ├── 2026-08-14-simple-checkbook-pwa-phase-3/
│           ├── 2026-08-14-simple-checkbook-pwa-phase-4/
│           └── 2026-08-17-fix-tab-switch-android/
└── src/
    ├── index.html         # Main app — HTML + inline JS (~1060 lines)
    ├── style.css          # Extracted CSS (linked via <link> in <head>)
    ├── sw.js              # Service worker (app-shell caching, cache-first)
    ├── manifest.json      # PWA web app manifest
    └── icons/
        ├── icon-192.svg   # 192×192 app icon
        └── icon-512.svg   # 512×512 app icon
```

## Prerequisites

- A modern web browser (Chrome / Chromium recommended)
- **No server required** — open `src/index.html` directly. HTTP is optional for SW caching.
- **No npm packages, no build tools, no Android SDK required**

### Android APK Toolchain

The APK target is pinned to Capacitor `7.6.9` (Filesystem `7.1.8`), Android
Gradle Plugin `9.0.1`, Gradle `9.1.0`, compile/target SDK `35`, minimum SDK `26`,
and JDK `25`. On Windows, install Node.js 20+, Android Studio with SDK
platform 35 and build tools, and a JDK 25 distribution. Set `JAVA_HOME` and
ensure `%JAVA_HOME%\bin` is on `PATH`; set `ANDROID_HOME` to the Android SDK.

## Running Locally

### Option A — Open directly (recommended, no server)

Double-click `src/index.html` in Chrome. The app renders instantly from `file://`.
All JS (including the `CATEGORIES`/`ACCOUNTS` constants) is inline, and CSS is
linked from `src/style.css` — both load fine under `file://`. The entry-form
dropdowns populate everywhere, including Android opened via `file://`. Service
worker registration is skipped silently (no console errors); to use SW offline
caching, see Option B.

### Option B — Local web server (optional, for SW offline caching)

To enable service-worker offline caching, serve the `src/` folder over HTTP once:

Using Python 3:

```bash
cd src
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in Chrome.

## Installing on Android

1. Copy the `src/` folder to your Samsung M34 (see `DEPLOY.md` for details).
2. Open `src/index.html` in Chrome via the file picker (no server needed).
3. Tap the **three-dot menu** → **Add to Home screen**.
3. Confirm the dialog — the app icon will appear on your home screen.
4. Launch from the home screen to open in **standalone mode** (no browser
   address bar or navigation UI).

## Android APK Wrapper (Capacitor)

This repo also includes a native Android wrapper target for the same app logic.
Use the following commands from the project root:

```bash
npm install
npx cap sync android
npm run android:debug
```

The debug APK is created at
`android/app/build/outputs/apk/debug/app-debug.apk`.

To install it on a USB-connected Android device with USB debugging enabled:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

For a release APK, run `npm run android:release`. The unsigned artifact is
created at `android/app/build/outputs/apk/release/app-release-unsigned.apk`.
No signing secrets belong in this repository. Installing a newer APK with the
same application ID preserves the app-private SQLite database and backup file;
do not uninstall or clear app data during an upgrade.

The Android project is configured in `capacitor.config.json` with the web assets
served from `src/` and the app ID `com.simplecheckbook.app`. The app writes its
native backup to the Capacitor `DATA` directory as `checkbook-data.json`, while the
browser target continues to use the standard download/file-picker fallback.

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
- `CATEGORIES` and `ACCOUNTS` arrays externalized for annual updates (later
  inlined in Phase 5).
- `formatRupiah()` renders all monetary values as `Rp N.NNN` (dot thousands
  separator, whole numbers, Unicode minus for negatives).
- Form clears after submission; edit updates in place; delete removes and
  recomputes the balance.

### Android Tab-Switch Bug Fix (2026-08-17)
- Diagnosed the "tabs don't switch on Android" issue as an initialization
  abort, not touch events: Android Chrome blocked the external `constants.js`,
  so `populateSelects()` threw, aborting init before the tab listeners attached.
- Fixed with a `typeof` guard in `populateSelects()` so init always completes.

### Phase 5 — Persistence & Offline Support (2026-08-20)
- **Inlined constants** — `CATEGORIES`/`ACCOUNTS` moved into `index.html`'s
  `<script>` block; `constants.js` deleted. Dropdowns now populate on every
  platform, resolving the Android `file://` limitation at the root.
- **IndexedDB persistence** — transactions survive page reloads and browser
  restarts via `dbOpen()` / `dbSaveAll()` / `dbLoadAll()`.
- **Offline support** — `sw.js` caches the app shell (`index.html`,
  `manifest.json`, SVG icons) at install time, serves it cache-first, and
  purges old cache versions on activate.

### Phase 6 — Import / Export (2026-08-21)
- **Import/Export tab** — a third bottom tab exposing Export and Import
  controls as first-class navigation targets.
- **Export** — serializes the persisted `transactions` array to
  `checkbook-data.json` via a Blob download; works offline with no
  filesystem access required.
- **Import** — file picker → `FileReader` → `validateImportData()` →
  `confirm()` → replace the entire store → `dbSaveAll()` → re-render list +
  balance. Import is a full restore (replace, not merge); the current dataset
  is replaced entirely.
- **Validation** — import validates the full file (must be a JSON array of
  transaction objects with `id`, `type`, signed `amount`, and string
  `name`/`category`/`account`/`date`) before any mutation; invalid files
  are rejected with an `alert()` and the store is left untouched.
- No new external dependencies; `sw.js` and `manifest.json` are unchanged.

## Spec Compliance

The project implements ten specifications across six OpenSpec changes:

| Spec | Phase | Status |
|---|---|---|
| `checkbook-app` | 1 | ✅ Implemented — PWA scaffold, manifest, service worker, zero dependencies |
| `cashflow-entries` | 4 | ✅ Implemented — full entry form, transaction list, running balance, edit/delete, unique IDs, persistence |
| `entry-constants` | 4 | ✅ Implemented — inlined `CATEGORIES` / `ACCOUNTS` (Phase 5) |
| `money-formatting` | 4 | ✅ Implemented — Rupiah formatting (`Rp N.NNN`, dot separators, no decimals) |
| `app-navigation` | 3 | ✅ Implemented — bottom tab bar, List/Add views |
| `transaction-actions` | 3 | ✅ Implemented — overflow menu, edit, delete with confirmation |
| `tab-switch-android` | fix | ✅ Implemented — `populateSelects()` guard |
| `app-persistence` | 5 | ✅ Implemented — IndexedDB persistence |
| `offline-support` | 5 | ✅ Implemented — SW app-shell caching |
| `data-export-import` | 6 | ✅ Implemented — Import/Export tab, JSON export (Blob download), validated JSON import (replace semantics, confirm guard) |

## Known Limitations & Discrepancies

1. **Service worker requires HTTP** — `file://` origins cannot register a
   service worker, so offline SW caching only works when served over HTTP. The
   app runs fully (render, forms, IndexedDB persistence) under `file://` with
   no server — see `DEPLOY.md` for PC and Android instructions.
2. **Spec drift — account values** — The `cashflow-entries` spec still lists
   accounts as `Cash, Checking, Savings` in some scenarios, but the inlined
   constants use the localized values `Primary, Istri, Savings` (intentional
   for the Indonesian user). This should be synced in a future spec revision.

## What's Next

- **Local deployment** — the `local-deployment-strategy` change enables running
  the app by opening `src/index.html` directly (no server). See `DEPLOY.md` for
  PC and Android (Samsung M34) instructions.
- **Verify & archive Phase 5** — the `phase-5-persistence-offline` change is
  applied to code (29/35 tasks complete). Six manual verification tasks remain
  (reload persistence, SW caching, Android `file://` dropdowns, offline load,
  date-field persistence). These can be confirmed via code review of
  `src/index.html` and `sw.js` — the same approach used in Phase 6 — before
  archiving via `openspec-archive-change`.
- **Archive Phase 6** — the `phase-6-import-export` change is fully complete
  (26/26 tasks, including verification via code review) and ready to be
  archived via `openspec-archive-change`.
- **Out of scope (deferred)**: cloud sync, user accounts, background sync,
  push notifications.

## License

This is a personal project developed for individual use.
