# app-persistence Specification

## Purpose

Persist cashflow transaction data to IndexedDB so entries survive page reloads
and browser restarts, replacing the current session-scoped in-memory array.

## Requirements

### Requirement: Transactions are persisted to IndexedDB

The system SHALL persist all cashflow entries to an IndexedDB object store named
`transactions` and load them on application startup. The running balance,
transaction list, and all edit/delete operations SHALL operate on the persisted
data as the single source of truth.

#### Scenario: Transactions survive page reload

- **GIVEN** the user has recorded at least one cashflow entry
- **WHEN** the page is reloaded
- **THEN** the recorded entries reappear in the transaction list and the running
  balance reflects their sum

#### Scenario: Transactions survive browser restart

- **GIVEN** the user has recorded cashflow entries in an installed PWA session
- **WHEN** the user closes the app and relaunches it
- **THEN** the transaction list and running balance show all previously recorded
  entries

#### Scenario: New transaction is persisted on entry

- **WHEN** the user submits the cashflow entry form
- **THEN** the new transaction is written to IndexedDB and appears in the list

### Requirement: System initializes from persisted data

The system SHALL load persisted transactions from IndexedDB on startup, before
rendering the transaction list or computing the running balance. If no data
exists, the system SHALL initialize with an empty list and a zero balance.

#### Scenario: App loads with existing data on startup

- **GIVEN** persisted transactions exist in IndexedDB from a previous session
- **WHEN** the app starts up
- **THEN** the transaction list displays the persisted entries and the running
  balance reflects their sum

#### Scenario: App starts fresh with no prior data

- **GIVEN** no transactions have been persisted in IndexedDB
- **WHEN** the app starts up
- **THEN** the transaction list shows an empty state and the running balance is
  zero

### Requirement: Transaction IDs remain unique across sessions

The system SHALL track the next available transaction ID in persisted storage so
that IDs remain unique across sessions, even after reloads.

#### Scenario: Transaction IDs remain unique after reload

- **GIVEN** the user has created transactions with IDs 1 through 5
- **WHEN** the page is reloaded and a new transaction is added
- **THEN** the new transaction receives ID 6 (not ID 1)

### Requirement: Edits and deletes are persisted

The system SHALL persist updates (edit) and removals (delete) to IndexedDB.
After an edit or delete, the change SHALL survive a page reload.

#### Scenario: Edited transaction is persisted

- **GIVEN** the user has edited a transaction's amount or category
- **WHEN** the page is reloaded
- **THEN** the transaction list shows the updated values, not the original

#### Scenario: Deleted transaction is persisted

- **GIVEN** the user has deleted a transaction
- **WHEN** the page is reloaded
- **THEN** the deleted transaction does not reappear in the list

#### Scenario: Date is persisted with the transaction

- **GIVEN** the user has recorded a cashflow entry with a date
- **WHEN** the page is reloaded
- **THEN** the transaction reappears with its `date` intact, and the date is
  displayed in the transaction list

### Requirement: APK transactions are persisted to native SQLite

The APK SHALL persist all cashflow entries to a native SQLite database in the
app-private Android data directory and load them on application startup. The
running balance, transaction list, and all edit/delete operations SHALL operate
on the persisted data as the single source of truth.

#### Scenario: Transactions survive page reload

- **GIVEN** the user has recorded at least one cashflow entry
- **WHEN** the page is reloaded
- **THEN** the recorded entries reappear in the transaction list and the running
  balance reflects their sum

#### Scenario: Transactions survive browser restart

- **GIVEN** the user has recorded cashflow entries in an installed PWA session
- **WHEN** the user closes the app and relaunches it
- **THEN** the transaction list and running balance show all previously recorded
  entries

#### Scenario: New transaction is persisted on entry

- **WHEN** the user submits the cashflow entry form
- **THEN** the new transaction is committed to SQLite and appears in the list

### Requirement: APK initializes from native persisted data

The APK SHALL load persisted transactions from SQLite on startup, before
rendering the transaction list or computing the running balance. If no data
exists, the system SHALL initialize with an empty list and a zero balance.

#### Scenario: App loads with existing data on startup

- **GIVEN** persisted transactions exist in SQLite from a previous session
- **WHEN** the app starts up
- **THEN** the transaction list displays the persisted entries and the running
  balance reflects their sum

#### Scenario: App starts fresh with no prior data

- **GIVEN** no transactions have been persisted in SQLite
- **WHEN** the app starts up
- **THEN** the transaction list shows an empty state and the running balance is
  zero

### Requirement: Transaction IDs remain unique across APK sessions

The APK SHALL track the next available transaction ID in SQLite so that IDs
remain unique across sessions, even after reloads, deletions, and upgrades.

#### Scenario: Transaction IDs remain unique after reload

- **GIVEN** the user has created transactions with IDs 1 through 5
- **WHEN** the page is reloaded and a new transaction is added
- **THEN** the new transaction receives ID 6 (not ID 1)

### Requirement: APK edits and deletes are persisted

The APK SHALL persist updates (edit) and removals (delete) to SQLite. After an
edit or delete, the change SHALL survive a page reload and app restart.

#### Scenario: Edited transaction is persisted

- **GIVEN** the user has edited a transaction's amount or category
- **WHEN** the page is reloaded
- **THEN** the transaction list shows the updated values, not the original

#### Scenario: Deleted transaction is persisted

- **GIVEN** the user has deleted a transaction
- **WHEN** the page is reloaded
- **THEN** the deleted transaction does not reappear in the list

#### Scenario: Date is persisted with the transaction

- **GIVEN** the user has recorded a cashflow entry with a date
- **WHEN** the page is reloaded
- **THEN** the transaction reappears with its `date` intact, and the date is
  displayed in the transaction list
