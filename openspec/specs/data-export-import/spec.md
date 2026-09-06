# data-export-import Specification

## Purpose

Lets the user back up and restore the entire local transaction dataset of the checkbook from a
fixed `data` source directory, so export and import can be executed immediately with a single click.
The app remains a zero-dependency PWA, but the backup path is deterministic: export writes to the
known `data` source folder and import reads from that same location without requiring the user to
choose a folder or file each time.

## Requirements

### Requirement: Export is limited to transactions

The system SHALL export only persisted cashflow transactions (the contents of the active
transaction store), not application configuration. Categories and accounts are injected app
constants, not user data, and SHALL NOT be included in the export.

#### Scenario: Export contains only transaction objects

- **GIVEN** the user has recorded cashflow entries and categories/accounts exist as app constants
- **WHEN** the user exports
- **THEN** the downloaded file contains an array of transaction objects and contains no category or account configuration

#### Scenario: APK export contains only transaction objects

- **GIVEN** the user has recorded cashflow entries in the Android APK
- **WHEN** the user exports
- **THEN** the native backup contains an array of transaction objects and contains no category or account configuration

### Requirement: User can export all transactions to a JSON file

The system SHALL serialize all persisted cashflow entries into a single JSON file named
`checkbook-data.json`. In the Android APK, export SHALL use the registered Capacitor Filesystem
plugin to write the file directly to the configured native app data location without opening a
folder chooser. If that plugin is unavailable, export SHALL report a filesystem error and SHALL
NOT use the browser download fallback. In the browser target, export SHALL retain the browser-
supported download fallback.

#### Scenario: User exports all transactions in the APK

- **GIVEN** the user is in the Import/Export tab of the Android APK
- **WHEN** the user taps Export
- **THEN** the app writes `checkbook-data.json` to the configured native data location and shows progress followed by a completed state

#### Scenario: User exports all transactions

- **GIVEN** the user is in the Import/Export tab
- **WHEN** the user clicks "Export"
- **THEN** the app writes `checkbook-data.json` to the fixed `data` folder and shows the action as
  in progress until it completes

#### Scenario: Export reflects the current persisted data

- **GIVEN** the current store holds transactions with ids 1, 2, and 3 (including a money-out entry
  whose amount is stored as a negative number and a `date` string)
- **WHEN** the user exports and opens the downloaded file
- **THEN** the JSON array contains exactly those transactions with their id, type, signed amount, name, category, account, and date intact

### Requirement: User can import transactions from a JSON file

The system SHALL load `checkbook-data.json` from the configured native app data location in the
Android APK using the registered Capacitor Filesystem plugin without requiring a user-selected file.
If that plugin is unavailable, import SHALL report a filesystem error and SHALL NOT use the browser
file-selection fallback. The browser target SHALL retain its supported file-selection fallback. In
both targets, the system SHALL validate that the contents are a JSON array in which every record has
`id` (number), `type` (`money-in` or `money-out`), `amount` (finite number), `name` (string),
`category` (string), `account` (string), and `date` (string).

#### Scenario: User imports a valid backup in the APK

- **GIVEN** a valid `checkbook-data.json` exists in the APK's configured native data location
- **WHEN** the user taps Import
- **THEN** the app reads and validates the file without opening a file chooser and signals that the data is ready to be applied

#### Scenario: User imports a valid backup

- **GIVEN** the user has a valid JSON backup available to the browser target
- **WHEN** the user selects that backup through the browser's supported import fallback
- **THEN** the system loads and validates the file before asking to apply it

#### Scenario: Imported transactions are persisted

- **WHEN** a valid import is confirmed and applied in either target
- **THEN** the imported transactions are written to the active transaction store; in the APK this is native SQLite, and the transaction list and running balance survive an app restart reflecting the imported data

#### Scenario: Import rejects a record missing a required field

- **GIVEN** a JSON file whose array contains a record missing `amount`
- **WHEN** the user attempts import
- **THEN** the system does not modify the store and reports an error to the user

#### Scenario: Import rejects non-conformant JSON

- **GIVEN** the fixed `data` file's content is not a JSON array of transaction objects (for example,
  a plain object, a non-JSON document, or an array containing a non-object element)
- **WHEN** the user attempts import
- **THEN** the system does not modify the store and reports an error to the user

#### Scenario: Import rejects invalid native data

- **GIVEN** the APK backup is malformed JSON or contains a record missing a required field
- **WHEN** the user attempts import
- **THEN** the system reports an error, does not modify the store, and does not partially apply any records

### Requirement: Import acts as a full restore (replace, not merge)

The system SHALL treat import as a complete point-in-time restore: applying an import SHALL
replace the entire transaction store with the imported transactions, rather than merging them.

#### Scenario: Import replaces existing entries

- **GIVEN** the current store holds transactions with ids 1, 2, 3, 4, and 5
- **WHEN** the user imports a file containing transactions with ids 1, 2, and 3
- **THEN** after import the store holds exactly the three imported transactions (ids 4 and 5 are removed)

### Requirement: Import/Export is reachable from a dedicated tab

The system SHALL expose "Export" and "Import" controls in a dedicated Import/Export tab on the
bottom tab bar, so export/import is a persistent, first-class navigation target rather than a hidden
menu.

#### Scenario: User reaches the import/export controls

- **GIVEN** the bottom tab bar is visible
- **WHEN** the user taps the "Import/Export" tab
- **THEN** the view displays an "Export" button and an "Import" button

The browser target and Android APK SHALL both expose an operation status area for these controls.
