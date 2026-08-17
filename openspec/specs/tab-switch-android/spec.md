# tab-switch-android Specification

## Purpose

Bug-fix spec: bottom-tab switching (List / Add Transaction) must respond to taps
on Android Chrome. The root cause is an **initialization-ordering bug amplified by
Android's `file://` restrictions**, not a touch-event problem.

## Root Cause (confirmed by code + evidence)

1. `index.html` loads `constants.js` via `<script src="constants.js">` to define the
   global `CATEGORIES` / `ACCOUNTS` arrays.
2. **Android Chrome blocks external scripts when the page is opened via `file://`**
   (the `file://` origin disallows fetching sibling scripts on Android — authoritative:
   StackOverflow #79695328). `CATEGORIES` / `ACCOUNTS` are therefore never defined.
3. In the inline script, `populateSelects()` is the **first** statement of the
   `DOMContentLoaded` callback. It references `CATEGORIES`, throwing
   `ReferenceError: CATEGORIES is not defined`.
4. Because nothing wraps it, the exception **aborts** the `DOMContentLoaded`
   callback **before** the bottom-tab `click`/`touchend` listeners are registered.
   The page still *renders* (List view, balance, empty-state all come from static
   HTML/CSS), so the failure looks like "tapping the tabs does nothing," with no
   obvious console cause to the user.
5. A prior fix attempt (commit `f034b0c`, 2026-08-15) added `touchend` +
   `preventDefault()` + `touch-action: manipulation` to the tabs. That could not fix
   the issue because the listeners were never attached in the first place — proving
   the cause is the init abort, not touch-event handling.

## Requirements

### Requirement: Core UI remains interactive even if constants.js fails to load
The system SHALL continue registering all event listeners (tab switching, form
submit, overflow menu) even when `constants.js` is unavailable. A missing
constants file SHALL NOT abort initialization.

#### Scenario: Tabs switch on Android even under file://
- **GIVEN** the app is opened via `file://` on Android Chrome (so `constants.js`
  is blocked and `CATEGORIES` / `ACCOUNTS` are undefined)
- **WHEN** the user taps the "Add Transaction" tab (then the "List" tab)
- **THEN** the view switches to the Add Transaction form (then back to the List
  view) and the active tab is highlighted — tab switching works.

#### Scenario: Missing constants degrade gracefully, not catastrophically
- **GIVEN** `constants.js` is unavailable
- **WHEN** initialization completes
- **THEN** the application logs a console warning, the entry form's Category and
  Account dropdowns are left empty, and all other functionality (tab switching,
  transaction list, running balance) remains fully usable.

### Requirement: Application is served over HTTP for full functionality
The system SHALL be served over HTTP (e.g. `python -m http.server` from `src/`)
for full functionality — this is required for `constants.js` to load on Android
(populated dropdowns) and for the service worker to register (PWA installability).

#### Scenario: Full functionality over HTTP on Android
- **GIVEN** the app is served over HTTP on Android Chrome
- **WHEN** the user opens the Add Transaction tab
- **THEN** the Category and Account dropdowns are populated from `CATEGORIES` /
  `ACCOUNTS`, and the service worker registers for PWA installability.

## Non-Goals
- Inline `constants.js` into `index.html` — rejected. Externalization is a
  deliberate annual-update design decision (see `entry-constants` spec,
  `activeContext.md`).
- "Fix" `file://` to load sibling scripts on Android Chrome — not possible
  platform-side; the fix is graceful degradation plus HTTP as the supported runtime.
