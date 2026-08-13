## Why

The user wants a simple checkbook app for personal money management, built in phases. Phase 1 is the absolute simplest starting point: a "hello world" Progressive Web App (PWA) that can run on their Android low-spec device. This proves the development workflow end-to-end before adding any checkbook functionality.

The current machine has Node.js and VS Code but no Flutter, Android SDK, or Java. A PWA requires zero additional toolchain — just a text editor and a browser — making it the lightest possible start.

## What Changes

- Create a minimal PWA project structure under `src/` with a single `index.html` that displays "Hello World"
- Add a `manifest.json` so the app can be installed to the Android home screen (feels like a native app)
- Add a basic service worker stub (no caching logic yet — just the registration scaffold for future phases)
- Add a `README.md` with instructions for opening the app on Android
- No existing code is affected — this is a greenfield project

## Capabilities

### New Capabilities

- `checkbook-app`: A Progressive Web App for personal checkbook management, targeting Android low-spec devices. Phase 1 implements only the hello world screen as the first step toward the full checkbook application.

### Modified Capabilities

(none — greenfield project)

## Impact

- **New files**: `src/index.html`, `src/manifest.json`, `src/sw.js`, `README.md`
- **No existing code affected** — this is a new project with no prior codebase
- **No new dependencies** — pure HTML/CSS/JS, no npm packages needed for Phase 1
- **Target platform**: Android (Chrome browser), with home-screen install capability
