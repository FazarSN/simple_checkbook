## Why

On Android Chrome, tapping the bottom tabs (List / Add Transaction) does nothing.
This is **not** a touch-event problem. The README's "Option A" instructs users to
double-click `src/index.html` (open via `file://`), and Android Chrome blocks
external scripts (`<script src="constants.js">`) under `file://`. With
`constants.js` blocked, `CATEGORIES` / `ACCOUNTS` are undefined, so
`populateSelects()` — the first statement of the `DOMContentLoaded` callback —
throws `ReferenceError`, aborting init **before** the tab listeners are attached.
The page still renders from static HTML/CSS, so it looks fine while being
uninteractive.

A prior fix attempt (commit `f034b0c`, 2026-08-15) added `touchend` +
`preventDefault()` + `touch-action: manipulation` to the tabs. It failed for the
exact reason nothing could fix it: the listeners were never registered.

## What Changes

- **Guard `populateSelects()`** — bail out gracefully (console.warn + early
  return) when `CATEGORIES` / `ACCOUNTS` are undefined, using `typeof` (safe
  against an undeclared identifier). This stops the exception from aborting
  `DOMContentLoaded`, so the tab/form/action listeners are always attached.
- **Correct the README** — `index.html` does NOT have "all CSS and JS inline"
  (it loads `constants.js` and `sw.js`); document the Android `file://`
  limitation and that a local HTTP server is required for full functionality.
- **Amend the `entry-constants` spec** — add a graceful-degradation
  requirement/scenario for when the constants file is unavailable.
- **Do NOT inline `constants.js`** — preserve the deliberate externalization
  (annual-update design decision).

## Capabilities

### Modified Capabilities
- `app-navigation`: Tab switching is now robust to a missing `constants.js`
  (Android `file://` scenario); new scenario: tabs switch even when
  `constants.js` fails to load.
- `entry-constants`: New scenario — if the constants file is unavailable, the
  application degrades gracefully (empty dropdowns, everything else functional)
  instead of silently breaking all interactivity.

## Impact

- **Modified file**: `src/index.html` — add a guard at the top of
  `populateSelects()`.
- **Modified file**: `README.md` — correct the "all CSS and JS are inline" claim
  and document the Android `file://` limitation + HTTP-server requirement.
- **Modified file**: `openspec/specs/entry-constants/spec.md` — add a
  graceful-degradation requirement + scenario.
- **Target platform**: Android (Chrome) and desktop (Chrome), including the
  `file://` quick-check path on Android.
