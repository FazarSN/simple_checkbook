# offline-support Specification

## Purpose

Cache the application shell in the service worker so the PWA loads and runs
offline after the first visit, enabling reliable use on Android without network
connectivity.

## Requirements

### Requirement: System caches the app shell at service-worker install time

The browser PWA SHALL cache the core application shell — `index.html`, `style.css`,
`manifest.json`, and SVG icons — in a versioned cache during service-worker
installation. The Android APK SHALL bundle the equivalent application shell locally
during packaging.

#### Scenario: App shell is cached on first visit

- **GIVEN** the user visits the app over HTTP for the first time
- **WHEN** the service worker installs
- **THEN** `index.html`, `manifest.json`, `icon-192.svg`, and `icon-512.svg` are
  written to the cache

#### Scenario: App loads offline after first visit

- **GIVEN** the app shell has been cached from a previous visit
- **WHEN** the user opens the app with no network connectivity
- **THEN** the app loads and displays the transaction list and running balance

#### Scenario: APK includes the app shell

- **GIVEN** the APK has been built and installed
- **WHEN** the user launches it without network access
- **THEN** the bundled app shell is available locally and the application opens

### Requirement: System serves local application resources offline

The browser PWA SHALL serve cached application resources when offline, and the Android
APK SHALL load its bundled application resources locally without contacting a server.

#### Scenario: Cached app shell is served offline

- **GIVEN** the app shell is cached and the device is offline
- **WHEN** the user navigates to the app
- **THEN** the service worker serves the cached `index.html` and the app renders
  from cache

#### Scenario: APK loads offline

- **GIVEN** the APK is installed and the device has no network connection
- **WHEN** the user opens the APK
- **THEN** the checkbook renders and core workflows are usable

### Requirement: Cache version is updated on web deploy

The browser PWA SHALL use a versioned cache name (e.g. `simple-checkbook-v1`) so
that stale browser caches are purged when the app is updated. APK updates SHALL
replace the bundled application shell through the normal APK upgrade process.

#### Scenario: Old cache is cleared on version bump

- **GIVEN** a new app version with cache name `simple-checkbook-v2`
- **WHEN** the service worker activates
- **THEN** the old `simple-checkbook-v1` cache is deleted and the new version's
  shell is cached

#### Scenario: APK update replaces bundled resources

- **GIVEN** a newer APK version is installed over an existing APK
- **WHEN** the user launches the updated APK
- **THEN** the updated bundled application resources are used

### Requirement: IndexedDB data persists across service-worker updates

The system SHALL NOT clear IndexedDB when the service worker is updated or
reinstalled. Transaction data SHALL survive service-worker lifecycle events.

#### Scenario: Data persists after SW update

- **GIVEN** the user has persisted transactions
- **WHEN** the service worker is updated (new version, new cache)
- **THEN** the transactions remain in IndexedDB after update

### Requirement: Native SQLite data persists across APK updates

The APK SHALL NOT clear its native SQLite database when the app starts, the
service worker changes, or the APK is upgraded in place. Transaction data SHALL
survive those lifecycle events.

#### Scenario: Data persists after APK upgrade

- **GIVEN** the user has persisted transactions in the APK
- **WHEN** the APK is upgraded and relaunched
- **THEN** the transactions remain available from SQLite in the list and balance
