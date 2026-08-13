## ADDED Requirements

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
