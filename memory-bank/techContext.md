# Technical Context

## Technologies Used
| Layer | Technology |
|---|---|
| **Markup** | HTML5 |
| **Styling** | Inline CSS (no external stylesheets, no CSS frameworks) |
| **Logic** | Vanilla JavaScript (ES5-compatible syntax, no transpilation) |
| **PWA Manifest** | `manifest.json` (`display: standalone`) |
| **Service Worker** | `sw.js` — install/activate lifecycle stub, no caching |
| **Icons** | SVG (`icon-192.svg`, `icon-512.svg`) |
| **Currency** | Indonesian Rupiah — `Rp` prefix, dot `.` thousands separator, no decimals |

## Development Setup
- **Editor**: Visual Studio Code (no project-specific extensions required).
- **Runtime**: Any modern Chromium-based browser (Chrome recommended).
- **Local server**: Python 3 (`python -m http.server 8080`) from the `src/`
  directory — required for service-worker registration (which needs an HTTP
  origin, not `file://`).
- **Testing**: Open `src/index.html` directly for quick UI checks; serve via
  HTTP for full PWA testing (installability, service worker).

## Technical Constraints
1. **Zero external dependencies** — no npm, no CDN, no build step.
2. **No framework** — pure HTML/CSS/JS.
3. **Android low-spec target** — the app must be lightweight and fast.
4. **Single-file core** — all application logic lives in `index.html`;
   `constants.js` is the only external script.
5. **Session-scoped data** — no persistence mechanism is implemented yet;
   transactions are lost on reload (Phase 5 target: IndexedDB / offline).

## Dependencies
- **None.** There are no npm packages, CDN links, or third-party libraries.

## Tool Usage Patterns — OpenSpec Workflow
The project uses the **OpenSpec** system (`schema: spec-driven`) for
spec-driven development. The workflow is:

1. **Spec** — create a specification in `openspec/specs/<name>/spec.md`.
2. **Propose** → `openspec-propose` — generates proposal + design + tasks.
3. **Apply** → `openspec-apply-change` — implements the change in code.
4. **Archive** → `openspec-archive-change` — finalizes and archives the change
   in `openspec/changes/archive/`.

### Archived Phases
| Phase | Date | Specs Implemented |
|---|---|---|
| Phase 1 | 2026-08-14 | `checkbook-app` (scaffold, hello world, PWA manifest, service worker stub) |
| Phase 2 | 2026-08-14 | Basic checkbook entry (transaction list + balance) |
| Phase 3 | 2026-08-14 | `app-navigation`, `transaction-actions` (tab bar, overflow menu, edit/delete) |
| Phase 4 | 2026-08-14 | `cashflow-entries`, `entry-constants`, `money-formatting` |

### Source Files
- `src/index.html` — 682 lines: markup + inline CSS (~300 lines) + inline JS
  (~300 lines).
- `src/constants.js` — 12 lines: `CATEGORIES` and `ACCOUNTS` arrays.
- `src/sw.js` — 17 lines: service-worker stub.
- `src/manifest.json` — web-app manifest.
- `src/icons/icon-192.svg`, `icon-512.svg` — app icons.

## File Locations
```
c:/Users/tama/Documents/push/JoMO/simple_checkbook/
├── README.md
├── openspec/
│   ├── config.yaml
│   ├── specs/          # active specs (synced from archived phases)
│   └── changes/
│       └── archive/    # archived phase changes
└── src/
    ├── index.html
    ├── constants.js
    ├── sw.js
    ├── manifest.json
    └── icons/
```
