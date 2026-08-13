## Purpose

Maintain the pre-defined category and account option lists in a separate constants file (`src/constants.js`) so they can be updated independently and annually without modifying the application logic in `index.html`. The constants file is loaded by the app and used to populate the category and account dropdown selects in the entry form.

## ADDED Requirements

### Requirement: System sources categories and accounts from a constants file
The system SHALL load the pre-defined category and account option lists from a dedicated constants file (`src/constants.js`) rather than defining them inline within the main HTML document. The constants file SHALL export a `CATEGORIES` array and an `ACCOUNTS` array. The entry form's category and account `<select>` elements SHALL be populated from these arrays.

#### Scenario: Entry form category dropdown is populated from constants file
- **WHEN** the user opens the entry form
- **THEN** the category dropdown contains options sourced from the `CATEGORIES` array in `src/constants.js`

#### Scenario: Entry form account dropdown is populated from constants file
- **WHEN** the user opens the entry form
- **THEN** the account dropdown contains options sourced from the `ACCOUNTS` array in `src/constants.js`

### Requirement: Constants file is loaded as an external script
The system SHALL load `src/constants.js` via a `<script src="constants.js">` element in `index.html` (served from the same origin). The constants SHALL be defined at the module/script scope and available to the application before any form rendering occurs.

#### Scenario: App loads constants file on startup
- **WHEN** the app loads in the browser
- **THEN** `src/constants.js` is loaded via a `<script>` tag before the DOMContentLoaded handler runs

### Requirement: Annual update of option lists requires no application logic changes
The system SHALL allow the category and account option lists to be updated annually by editing only `src/constants.js` — no changes to `index.html` or other application code are needed to add, remove, or reorder categories and accounts.

#### Scenario: User adds a new category for the coming year
- **WHEN** a new category is appended to the `CATEGORIES` array in `src/constants.js`
- **THEN** the new category appears in the entry form's category dropdown on the next page load without any other file changes
