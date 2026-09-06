# entry-constants Specification

## Purpose

Maintain the pre-defined category and account option lists as `CATEGORIES` and
`ACCOUNTS` arrays that can be updated independently and annually without
modifying the application logic in `index.html`. The constants are defined inline
within the app's `<script>` block and used to populate the category and account
dropdown selects in the entry form.

## Requirements

### Requirement: System sources categories and accounts from a constants file

The system SHALL define the pre-defined category and account option lists within
`index.html`'s `<script>` block as `CATEGORIES` and `ACCOUNTS` arrays (inlined,
not as a separate external file). The entry form's category and account
`<select>` elements SHALL be populated from these arrays. No external file
dependency is required for the option lists.

#### Scenario: Entry form category dropdown is populated from constants

- **WHEN** the user opens the entry form
- **THEN** the category dropdown contains options sourced from the `CATEGORIES`
  array defined in `index.html`

#### Scenario: Entry form account dropdown is populated from constants

- **WHEN** the user opens the entry form
- **THEN** the account dropdown contains options sourced from the `ACCOUNTS`
  array defined in `index.html`

### Requirement: Annual update of option lists requires no application logic changes

The system SHALL allow the category and account option lists to be updated
annually by editing only the `CATEGORIES` and `ACCOUNTS` arrays defined inline in
`index.html` — no changes to form-rendering logic, `populateSelects()`, or other
application code are needed to add, remove, or reorder categories and accounts.

#### Scenario: User adds a new category for the coming year

- **WHEN** a new category is appended to the `CATEGORIES` array defined inline in
  `index.html`
- **THEN** the new category appears in the entry form's category dropdown on the
  next page load without any other code changes
