# Simple Checkbook

A Progressive Web App (PWA) for personal checkbook management, built in phases.

## Phase 1 — Hello World

This is the initial scaffold: a "Hello World" PWA that proves the development
workflow end-to-end and runs on Android low-spec devices with zero additional
toolchain — just a text editor and a browser.

### Project Structure

```
src/
├── index.html       # Main page — "Hello World" with inline CSS
├── manifest.json    # Web app manifest — installability config
├── sw.js            # Service worker stub — no caching (Phase 3 will add it)
└── icons/
    ├── icon-192.svg  # 192×192 app icon (for home-screen install)
    └── icon-512.svg  # 512×512 app icon (for high-DPI displays)

README.md            # This file
```

### Prerequisites

- A modern web browser (Chrome / Chromium recommended)
- Python 3+ or Node.js (for the local web server — needed to test PWA features)
- **No npm packages, no build tools, no Android SDK required**

### Running Locally

#### Option A — Open directly (quick check)

Double-click `src/index.html` in Chrome. The "Hello World" screen will appear
instantly (inline CSS, no network needed).

> ⚠️ **Service workers require an HTTP origin.** To test installability and
> service-worker registration, use Option B.

#### Option B — Local web server (recommended for full PWA testing)

Using Python 3 (available on this machine):

```bash
cd src
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in Chrome.

### Installing on Android

1. Open the app in Chrome on your Android device (via local server or after
   transferring the `src/` files).
2. Tap the **three-dot menu** → **Add to Home screen**.
3. Confirm the dialog — the app icon will appear on your home screen.
4. Launch from the home screen to open in **standalone mode** (no browser
   address bar or navigation UI).

### Spec Compliance

This project implements the **`simple-checkbook-pwa-phase-1`** OpenSpec change
(schema: `spec-driven`), satisfying three requirements:

1. **Displays "Hello World"** on load in Chrome on Android.
2. **Installable** via a web app manifest with home-screen launch in
   `standalone` display mode.
3. **Loads without external dependencies** — the HTML page uses inline CSS and
   has no external stylesheets, scripts, or fonts.

### What's Next

- **Phase 2** — Transaction list and basic checkbook entry
- **Phase 3** — Data persistence, offline support, and service-worker caching
