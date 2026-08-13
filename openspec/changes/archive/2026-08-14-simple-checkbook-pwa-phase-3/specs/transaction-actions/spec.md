## Purpose

Per-transaction edit and delete actions accessible via a single overflow menu on each transaction row, allowing users to correct mistakes and remove entries without cluttering the interface with buttons on every row.

## ADDED Requirements

### Requirement: System displays an overflow menu on each transaction row
The system SHALL display a single overflow button (⋮) on each transaction row in the list. When activated, the overflow menu reveals "Edit" and "Delete" action options for that transaction only.

#### Scenario: User sees overflow button on transaction row
- **WHEN** a transaction exists in the list
- **THEN** each transaction row displays a single overflow (⋮) button

#### Scenario: User reveals edit and delete actions
- **WHEN** user taps the overflow (⋮) button on a transaction row
- **THEN** an actions menu appears anchored to that row, showing "Edit" and "Delete" options

#### Scenario: User dismisses the overflow menu
- **WHEN** user taps outside the actions menu or taps the overflow (⋮) button again
- **THEN** the actions menu closes and no action is taken

### Requirement: User can initiate editing a transaction
The system SHALL allow the user to edit an existing transaction by selecting "Edit" from the overflow menu. Selecting Edit switches to the "Add Transaction" tab, pre-fills the form with the transaction's current values, and relabels the submit button to "Update Entry."

#### Scenario: User initiates editing a transaction
- **WHEN** user selects "Edit" from a transaction's overflow menu
- **THEN** the app switches to the "Add Transaction" tab, populates the form with the transaction's existing type, amount, category, and account, and relabels the submit button to "Update Entry"

#### Scenario: User cancels editing without saving
- **WHEN** user switches back to the List tab without tapping "Update Entry"
- **THEN** the overflow menu closes, the list view is shown, and the form remains unchanged from its pre-filled state if the user returns later

### Requirement: User can initiate deletion of a transaction
The system SHALL allow the user to initiate deletion of an existing transaction by selecting "Delete" from the overflow menu. The system SHALL show a confirmation dialog before removing the transaction.

#### Scenario: User confirms transaction deletion
- **WHEN** user selects "Delete" from a transaction's overflow menu and confirms the deletion in the dialog
- **THEN** the confirmation dialog closes and the deletion proceeds

#### Scenario: User cancels transaction deletion
- **WHEN** user selects "Delete" from a transaction's overflow menu and dismisses the confirmation dialog
- **THEN** the confirmation dialog closes, the transaction remains in the list, and nothing changes
