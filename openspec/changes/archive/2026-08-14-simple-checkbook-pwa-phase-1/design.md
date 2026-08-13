## Context

This is a greenfield project — no existing codebase. The development machine has Node.js v24 and VS Code, but no Flutter, Android SDK, or Java. The target device is an Android phone with low specifications. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Get a "Hello World" screen running on the Android device in under 5 minutes
- Establish a project structure that can evolve into a full checkbook app
- Use only tools already available (VS Code + browser) — no new toolchain installation

**Non-Goals:**
- No checkbook functionality (transactions, balance, persistence) in Phase 1
- No native APK generation in Phase 1
- No build tooling or npm packages in Phase 1

## Decisions

### Decision 1: PWA over native Android
**Chosen**: Progressive Web App (plain HTML/CSS/JS)
**Rationale**: The machine has no Android SDK or Java, so building a native APK would require installing ~2GB of toolchain. A PWA runs in Chrome with zero setup and can be installed to the home screen.
**Alternatives considered**:
- *Flutter*: Rejected — requires Flutter SDK + Android SDK + Java installation (~1GB+), too heavy for a hello world
- *React Native*: Rejected — requires Android SDK + Java to build APK
- *Native Kotlin*: Rejected — requires Android Studio (heavy IDE) + Java

### Decision 2: Single HTML file with inline CSS
**Chosen**: One `index.html` file with inline CSS and a separate `manifest.json`
**Rationale**: Maximizes simplicity. No build step, no bundler, no npm. The file can be opened directly in a browser.
**Alternatives considered**:
- *Multi-file structure*: Rejected for Phase 1 — adds complexity without benefit at this stage

### Decision 3: Service worker stub (no caching yet)
**Chosen**: Include a minimal `sw.js` that registers but does not cache
**Rationale**: Scaffolds the PWA structure for future phases. Phase 3 (persistence) will add caching and offline support.
**Alternatives considered**:
- *No service worker*: Rejected — would need to be added later, causing a structural change

## Risks / Trade-offs

- **[Risk] PWA may feel less "native" than an APK** → Mitigation: Chrome's "Add to Home Screen" provides a near-native experience for a simple app. Can wrap with Capacitor in a future phase if needed.
- **[Risk] No offline support in Phase 1** → Mitigation: The hello world screen is a single HTML file with inline CSS, so it loads instantly and works offline by default (no external resources).
- **[Risk] Project structure may need refactoring for future phases** → Mitigation: Keep Phase 1 minimal but use conventional paths (`src/`) that scale naturally.

## Migration Plan

N/A — greenfield project, no existing system to migrate.

## Open Questions

(none — Phase 1 is intentionally minimal)
