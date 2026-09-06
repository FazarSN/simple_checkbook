# Technical Context

## Technologies Used
| Layer | Technology |
|---|---|
| **Markup** | HTML5 |
| **Styling** | External CSS (`src/style.css`, linked via `<link>`, no frameworks) |
| **Logic** | Vanilla JavaScript (ES5-compatible syntax, no transpilation) |
| **PWA Manifest** | `manifest.json` (`display: standalone`) |
| **Service Worker** | `sw.js` — app-shell caching (install/activate/fetch, cache-first, versioned cache) |
| **Persistence** | IndexedDB — `SimpleCheckbook` DB, `transactions` object store (keyPath `id`) |
| **Date field** | `<input type="date">` — pre-filled with the current day, stored as ISO `YYYY-MM-DD` on the transaction object |
| **Import/Export** | `Blob` (export download), `URL.createObjectURL`/`URL.revokeObjectURL`, `FileReader.readAsText`, `<input type="file">` with `accept=".json"` |
| **Icons** | SVG (`icon-192.svg`, `icon-512.svg`) |
| **Currency** | Indonesian Rupiah — `Rp` prefix, dot `.` thousands separator, no decimals |

## Development Setup
- **Editor**: Visual Studio Code (no project-specific extensions required).
- **Runtime**: Any modern Chromium-based browser (Chrome recommended).
- **Running**: Open `src/index.html` directly in Chrome/Edge — no server
  required. Service worker is skipped under `file://`; HTTP is optional for
  cached offline (SW) support. See `DEPLOY.md` for instructions.
- **Testing**: Open `src/index.html` directly for quick UI checks; serve via
  HTTP for full PWA testing (installability, service worker).

## Technical Constraints
1. **Zero external dependencies** — no npm, no CDN, no build step.
2. **No framework** — pure HTML/CSS/JS.
3. **Android low-spec target** — the app must be lightweight and fast.
4. **Single-file core** — all application logic lives in `index.html`;
      `CATEGORIES`/`ACCOUNTS` are inlined (no external `constants.js`); `sw.js` is
   the only external script. CSS is in `src/style.css` (safe under `file://`).
5. **IndexedDB persistence** — transactions are persisted to IndexedDB and
   survive reloads; `nextId` is derived from the max ID on load.
6. **Offline support** — the service worker caches the app shell at install
   time; the app loads offline after the first visit.
7. **Date field** — each transaction carries a `date` property (ISO
   `YYYY-MM-DD`), pre-filled with the current day in the form.
8. **Import/Export works offline** — export uses `Blob` + `URL.createObjectURL`
   (no network); import uses `<input type="file">` + `FileReader` (no network).
   Both are pure client-side APIs with no external dependencies.

## Dependencies
- **None.** There are no npm packages, CDN links, or third-party libraries.
  Import/Export uses only the browser's native `Blob`, `URL`, `FileReader`, and
  `<input type="file">` APIs.

## Tool Usage Patterns — OpenSpec Workflow
The project uses the **OpenSpec** system (`schema: spec-driven`) for
spec-driven development. The workflow is:

1. **Spec** — create a specification in `openspec/specs/<name>/spec.md`.
2. **Propose** → `openspec-propose` — generates proposal + design + tasks.
3. **Apply** → `openspec-apply-change` — implements the change in code.
4. **Archive** → `openspec-archive-change` — finalizes and archives the change
   in `openspec/changes/archive/`.

### Phased Specs
| Phase | Date | Specs Implemented |
|---|---|---|
| Phase 1 | 2026-08-14 | `checkbook-app` (scaffold, hello world, PWA manifest, service worker stub) |
| Phase 2 | 2026-08-14 | Basic checkbook entry (transaction list + balance) |
| Phase 3 | 2026-08-14 | `app-navigation`, `transaction-actions` (tab bar, overflow menu, edit/delete) |
| Phase 4 | 2026-08-14 | `cashflow-entries`, `entry-constants`, `money-formatting` |
| Bug fix | 2026-08-17 | `tab-switch-android` (populateSelects guard) |
| Phase 5 | 2026-08-20 | `app-persistence`, `offline-support` (IndexedDB, SW caching, inlined constants) |
| Phase 6 | 2026-08-21 | `data-export-import` (Import/Export tab, JSON export, validated import) |
| Local deploy | 2026-08-28 | `local-deployment-strategy` (file:// support, CSS extraction, export simplification, DEPLOY.md) |

### Active OpenSpec Changes
| Change | Status |
|---|---|
| `phase-5-persistence-offline` | Applied to code; not yet archived |
| `phase-6-import-export` | Applied to code; synced & validated; not yet archived |
| `local-deployment-strategy` | In progress — implementation |

### Source Files
- `src/index.html` — ~1060 lines: markup + inline JS (~540 lines incl.
  inlined `CATEGORIES`/`ACCOUNTS`, IndexedDB helpers, statistics functions,
  and event wiring). CSS extracted to `src/style.css`.
- `src/style.css` — extracted CSS (~370 lines, linked via `<link>` in `<head>`).
- `src/sw.js` — 48 lines: service worker with app-shell caching.
- `src/manifest.json` — web-app manifest.
- `src/icons/icon-192.svg`, `icon-512.svg` — app icons.
- `src/constants.js` — **deleted** in Phase 5 (contents inlined into `index.html`).

## File Locations
```
c:/Users/tama/Documents/push/JoMO/simple_checkbook/
├── README.md
├── openspec/
│   ├── config.yaml
│   ├── specs/          # active specs (synced from archived phases)
│   │   ├── checkbook-app/
│   │   ├── cashflow-entries/
│   │   ├── entry-constants/
│   │   ├── money-formatting/
│   │   ├── app-navigation/
│   │   ├── transaction-actions/
│   │   ├── tab-switch-android/
│   │   ├── app-persistence/
│   │   ├── offline-support/
│   │   └── data-export-import/
│   └── changes/
│       ├── archive/    # archived phase changes
│       ├── phase-5-persistence-offline/
│       └── phase-6-import-export/
└── src/
    ├── index.html
    ├── style.css
    ├── sw.js
    ├── manifest.json
    └── icons/
```
