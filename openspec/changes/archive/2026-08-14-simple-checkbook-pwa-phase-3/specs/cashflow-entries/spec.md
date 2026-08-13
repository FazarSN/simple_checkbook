## Purpose

This is a delta spec for the existing `cashflow-entries` capability (introduced in Phase 2). It adds requirements for unique transaction identifiers, editing existing transactions in place, and deleting transactions, with automatic running-balance recalculation. The core record-and-view behavior from Phase 2 remains unchanged.

## ADDED Requirements

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
