# cashflow-entries Specification

## Purpose

Allows users to record cashflow entries (money in or money out), categorize and assign them to an account, and view a list with a running balance — forming the core checkbook functionality of the app.

## Requirements

### Requirement: User can record a cashflow entry
The system SHALL allow the user to record a cashflow entry specifying whether the amount is money in or money out, the amount, a category, and an account.

#### Scenario: User records a money-in entry
- **WHEN** user fills in the cashflow entry form with type "money in", amount "100", category "Income", and account "Checking", and submits
- **THEN** the entry appears in the transaction list with amount "+100", type "money in", category "Income", and account "Checking"

#### Scenario: User records a money-out entry
- **WHEN** user fills in the cashflow entry form with type "money out", amount "50", category "Food", and account "Cash", and submits
- **THEN** the entry appears in the transaction list with amount "−50", type "money out", category "Food", and account "Cash"

#### Scenario: Form clears after submission
- **WHEN** user successfully submits the cashflow entry form
- **THEN** the form fields reset to their default state (amount cleared, type set to "money in", category and account set to their first option)

### Requirement: Pre-defined categories and accounts
The system SHALL provide pre-defined categories and accounts for selection in the entry form.

#### Scenario: User sees pre-defined categories
- **WHEN** user opens the cashflow entry form
- **THEN** the category dropdown contains the options: Income, Food, Transport, Entertainment, Bills, Shopping, Other

#### Scenario: User sees pre-defined accounts
- **WHEN** user opens the cashflow entry form
- **THEN** the account dropdown contains the options: Cash, Checking, Savings

### Requirement: User can view the transaction list
The system SHALL display a list of all recorded cashflow entries, each showing its type, amount, category, account, and the order in which it was entered.

#### Scenario: User views entries in the transaction list
- **WHEN** user has recorded at least one cashflow entry
- **THEN** the transaction list displays each entry with its type (money in / money out), sign-and-amount, category, and account

### Requirement: System displays running balance
The system SHALL display a running balance computed as the sum of all money-in entries minus all money-out entries, updating in real time as entries are added.

#### Scenario: Running balance reflects inflows minus outflows
- **WHEN** user has recorded a money-in entry of 100 (Income, Checking) and a money-out entry of 50 (Food, Cash)
- **THEN** the running balance displays "+50"

### Requirement: Entries are session-scoped (no persistence)
The system SHALL hold all cashflow entries in memory only; entries are lost when the page is reloaded or closed.

#### Scenario: Entries are lost on page reload
- **WHEN** user has recorded cashflow entries and reopens or reloads the app
- **THEN** the transaction list is empty and the running balance is zero

### Requirement: Transactions have unique identifiers
The system SHALL assign a unique identifier to each transaction to support edit and delete operations targeting the correct entry.

#### Scenario: Transaction created with unique ID
- **WHEN** a new cashflow entry is recorded
- **THEN** the transaction is stored with a unique `id` that distinguishes it from all other transactions in the list

### Requirement: User can update an existing transaction
The system SHALL allow the user to update an existing transaction's type, amount, category, and account. When updated, the transaction is modified in place in the transaction list and the running balance recalculates to reflect the new values.

#### Scenario: User updates a transaction
- **WHEN** user edits a transaction's values and taps "Update Entry"
- **THEN** the transaction is updated with the new values in place, the list re-renders, and the running balance reflects the change

### Requirement: User can delete an existing transaction
The system SHALL allow the user to delete an existing transaction. When deleted, the transaction is removed from the list and the running balance recalculates to reflect its removal.

#### Scenario: User deletes a transaction
- **WHEN** user selects "Delete" for a transaction and confirms the deletion
- **THEN** the transaction is removed from the list, the list re-renders, and the running balance reflects the change

### Requirement: User can assign a Name to a cashflow entry
The system SHALL allow the user to provide a short text name (a free-text description) for each cashflow entry via a text input field in the entry form. The Name SHALL be stored as a `name` property on the transaction object and SHALL be saved alongside the transaction's type, amount, category, and account.

#### Scenario: User records a cashflow entry with a Name
- **WHEN** user fills in the entry form with type "money in", amount "100", category "Income", account "Checking", and enters "Salary" in the Name field, and submits
- **THEN** the entry appears in the transaction list with the name "Salary" stored on the transaction object

#### Scenario: Name field is optional
- **WHEN** user submits the entry form without entering a Name
- **THEN** the entry is recorded with an empty string as the `name` property

### Requirement: Transaction list displays the entry Name
The system SHALL display the Name of each cashflow entry as a dedicated column in the transaction list table. The Name column SHALL be positioned as the second column in the table (between the Type column and the Amount column). If a transaction has an empty Name, the cell SHALL display a non-breaking space or appropriate placeholder.

#### Scenario: User views entries with Names in the transaction list
- **WHEN** user has recorded cashflow entries with names
- **THEN** the transaction list displays a Name column showing each entry's name value

#### Scenario: Transaction list shows empty Name cell
- **WHEN** a transaction has an empty `name` property
- **THEN** the Name column cell displays an empty or placeholder value
