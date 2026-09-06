# local-deployment Specification

## Purpose

Enable the Simple Checkbook PWA to be run locally without an HTTP server by opening
`src/index.html` directly in a browser, while preserving service-worker offline caching
when served over HTTP. Provides clear deployment instructions for PC and Android
(Samsung M34).

## Requirements

### Requirement: System is runnable directly from file:// without an HTTP server

The system SHALL be runnable by opening `src/index.html` directly in a Chromium-based
browser (Chrome, Edge, Samsung Internet) without configuring or starting an HTTP server.
A user SHALL be able to double-click `src/index.html` or open it via a file picker and
see the transaction list, add/edit/delete entries, and import/export data.

#### Scenario: User opens the app on PC without a server

- **GIVEN** the user has downloaded or cloned the repository to their PC
- **WHEN** the user double-clicks `src/index.html` in Chrome / Edge
- **THEN** the app renders the full transaction list, running balance, entry form, and
	bottom tab bar with no server running and no error messages in the console

#### Scenario: User opens the app on Android (Samsung M34) without a server

- **GIVEN** the user has copied the `src/` folder to their Samsung M34
- **WHEN** the user opens `index.html` in Chrome via the file picker
- **THEN** the app renders correctly, dropdowns populate, and the entry form is
	fully functional with no server required

### Requirement: Service-worker registration is skipped under file://

The system SHALL attempt service-worker registration only when the page origin is
`http:` or `https:`. When the origin is `file:`, service-worker registration SHALL be
skipped entirely (no `navigator.serviceWorker.register()` call), so no console error or
rejection is produced.

#### Scenario: SW registration skipped on file://

- **GIVEN** the user opened `src/index.html` via `file://`
- **WHEN** the page loads
- **THEN** no `navigator.serviceWorker.register()` call is made and no
	"ServiceWorker registration failed" error appears in the console

#### Scenario: SW registration proceeds on HTTP/HTTPS

- **GIVEN** the user opened the app over `http://` or `https://`
- **WHEN** the page loads
- **THEN** the service worker registers as before and caches the app shell for offline
	use

### Requirement: Core functionality works under file:// without offline caching

The system SHALL function fully under `file://` even though the service worker does not
register. This includes: rendering the transaction list, add/edit/delete operations,
IndexedDB persistence, and import/export. The only feature unavailable under `file://`
is cached offline loading (which requires a previously-served-over-HTTP service-worker
cache).

#### Scenario: Transactions persist across reloads under file://

- **GIVEN** the user is running the app under `file://`
- **WHEN** the user adds a transaction and reloads the page
- **THEN** the transaction is still visible (persisted via IndexedDB)

#### Scenario: Import/export works under file://

- **GIVEN** the user is running the app under `file://`
- **WHEN** the user exports transactions and then imports the file
- **THEN** the transactions are restored without any network access

### Requirement: System provides a deployment guide (DEPLOY.md)

The system SHALL provide a `DEPLOY.md` file at the repository root with step-by-step
instructions for:

1. Running the app on PC (Windows / macOS / Linux) by opening `src/index.html` in
	 Chrome or Edge, with no server required.
2. Running the app on Android (Samsung M34) by copying the `src/` folder and opening
	 `index.html` in Chrome, with optional "Add to Home screen" instructions.
3. An optional section documenting how to wrap the PWA in a packaged APK (Trusted Web
	 Activity or Capacitor) for users who prefer a native app, clearly marked as optional
	 and not required.

#### Scenario: User finds PC run instructions

- **GIVEN** the user wants to run the app on their PC
- **WHEN** the user reads `DEPLOY.md`
- **THEN** they find a list of steps (open `src/index.html` in Chrome/Edge) that
	requires no server installation

#### Scenario: User finds Android run instructions

- **GIVEN** the user wants to run the app on their Samsung M34
- **WHEN** the user reads `DEPLOY.md`
- **THEN** they find steps to copy `src/` to the phone, open `index.html` in Chrome,
	and optionally install via "Add to Home screen" — all with no server

### Requirement: System does not introduce new dependencies for deployment

The system SHALL NOT add any npm packages, build tools, or server dependencies to
support the file://-first deployment model. All application logic (JavaScript) SHALL
remain inlined in `src/index.html`; only CSS MAY be in an external `src/style.css`
linked via `<link rel="stylesheet">` (CSS is not blocked by the file:// origin
restriction on Android, unlike external `<script>` tags).

#### Scenario: No new dependencies for local run

- **GIVEN** the user opens `src/index.html` via `file://`
- **WHEN** the app loads
- **THEN** no network requests for external libraries or frameworks are made

### Requirement: External CSS loads under file://

The system SHALL load its stylesheet from `src/style.css` via a `<link rel="stylesheet">`
tag in `src/index.html`. This link SHALL work under `file://` on Chromium-based browsers
(Chrome, Edge, Samsung Internet on Android) — CSS is not blocked by the file:// origin
restriction the way external `<script>` tags are.

#### Scenario: Stylesheet loads from style.css under file://

- **GIVEN** the app is opened via `file://` and CSS is in `src/style.css`
- **WHEN** `src/index.html` loads and parses the `<link rel="stylesheet" href="style.css">`
	tag
- **THEN** all styling (layout, colors, fonts, responsive rules) is applied exactly as
	before — the visual result is identical to the inline-CSS version

### Requirement: Export uses Blob download only

The system SHALL export transactions using a simple Blob-based download
(`URL.createObjectURL` → hidden `<a>` → `click()`). File System Access API
(`showDirectoryPicker`, `FileSystemFileHandle`) is NOT used — it only works on secure
origins and adds no value under `file://`. Removing it SHALL NOT change exported data
format or filename.

#### Scenario: Export produces same JSON file

- **GIVEN** the user has transactions in the store
- **WHEN** the user clicks Export
- **THEN** a `checkbook-data.json` file is downloaded with the same content as
	before (JSON array of transaction objects) — no change in data format or filename
