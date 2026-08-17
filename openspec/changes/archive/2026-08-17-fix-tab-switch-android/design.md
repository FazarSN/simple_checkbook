## Context

`src/index.html` is a single-file PWA with inline CSS/JS that loads two external
scripts: `constants.js` (the `CATEGORIES` / `ACCOUNTS` globals) and `sw.js` (the
service-worker stub). The inline script wires **all** listeners inside a single
`DOMContentLoaded` callback, and `populateSelects()` is its **first** statement.
The existing `app-navigation` design toggles views via `.view` / `.active` CSS
classes, with `click` and `touchend` handlers on the bottom tabs and
`touch-action: manipulation` on `.bottom-nav`. Nothing in the existing design
anticipated a missing `constants.js`.

## Goals / Non-Goals

**Goals:**
- Tabs switch reliably on Android Chrome, including when the app is opened via
  `file://` (where `constants.js` is blocked).
- A single failing / unavailable dependency must not take down the whole app's
  interactivity.
- Document the real runtime requirement: HTTP for full functionality.

**Non-Goals:**
- Inline `constants.js` (violates the externalization design decision).
- Add build tools or frameworks.
- Add data persistence / offline caching (Phase 5).

## Decisions

### Decision 1: Guard `populateSelects()` with `typeof` + early return
**Chosen**: At the top of `populateSelects()`, check
`typeof CATEGORIES === 'undefined' || typeof ACCOUNTS === 'undefined'`; if true,
`console.warn(...)` and `return`.

**Rationale**: `typeof` does not throw on an *undeclared* identifier, so the guard
itself cannot trigger the `ReferenceError` it is meant to prevent. An early
return lets the rest of the `DOMContentLoaded` callback run, so the tab/form/action
listeners are always attached. This is the minimal change that fixes the root cause
(without it, the listeners are never registered because init aborts).

**Alternatives considered:**
- *try/catch around the whole callback*: Rejected — too broad; masks unrelated bugs
  and hides the real signal.
- *Check `window.CATEGORIES`*: Rejected — `const CATEGORIES` in a classic script is
  a global lexical, **not** a `window` property, so `window.CATEGORIES` is always
  `undefined` even when the file loaded. `typeof CATEGORIES` is correct.

### Decision 2: Keep the existing touch handling (click + touchend) as-is
**Chosen**: Leave the `click` + `touchend` handlers and `touch-action:
manipulation` in place.

**Rationale**: Once init is unblocked, both handlers correctly switch views and are
harmless (the `touchend` calls `showView`, the `click` does too; double-firing is a
no-op because `showView` is a *set*, not a toggle). Removing them is optional
cleanup — `click` alone suffices under `touch-action: manipulation` — but is out of
scope for this bug fix to keep the diff minimal. (Recommended as a trivial
follow-up.)

### Decision 3: Keep `constants.js` external; require HTTP for full functionality
**Chosen**: Do not inline constants. Update the README so Android users serve over
HTTP.

**Rationale**: Externalization is a deliberate, spec'd annual-update decision (see
`entry-constants` spec). `file://` cannot be made to load sibling scripts on
Android Chrome. The proper runtime is HTTP — which the README already requires for
the service worker. The guard (Decision 1) provides a safety net so that even
`file://` users get working tabs, but HTTP is the supported path for the dropdowns
and PWA install.

## Risks / Trade-offs
- **[Risk] Dropdowns empty under file:// on Android** → Mitigation: documented in
  README; tab switching and all other features still work. Full functionality
  (populated dropdowns + SW) requires HTTP, already the case for the service worker.
- **[Risk] Guard mis-detects a loaded constants file** → Mitigation: a loaded
  `const CATEGORIES` is a global lexical, so `typeof CATEGORIES` is `'object'`
  (array) once loaded and `'undefined'` only if never declared. No temporal-dead-zone
  hazard at check time (constants.js is synchronous and precedes the inline script).

## Migration Plan
1. Insert the `typeof` guard at the top of `populateSelects()` in `src/index.html`.
2. Update `README.md` Option A wording (correct "inline" claim + Android caveat).
3. Add a graceful-degradation requirement + scenario to
   `openspec/specs/entry-constants/spec.md`.
4. Verify: re-read edited `index.html`; run `node --check` on the inline script for
   syntax; confirm the guard is the first thing in `populateSelects()`.
5. Runtime (pending user): confirm tab switching works on Android `file://` and
   that dropdowns populate over HTTP.

**Rollback:** revert the guard block in `populateSelects()` (one localized change).
