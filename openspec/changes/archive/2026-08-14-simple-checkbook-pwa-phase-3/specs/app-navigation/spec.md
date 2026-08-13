## Purpose

Bottom tab bar navigation with two views — List (transaction list + balance as the default main interface) and Add Transaction (entry form) — allowing users to switch between viewing their transactions and recording new ones.

## ADDED Requirements

### Requirement: System displays bottom tab bar with List and Add Transaction tabs
The system SHALL display a fixed bottom tab bar with two tabs: "List" and "Add Transaction". Only one tab is active at a time.

#### Scenario: User sees bottom tab bar on load
- **WHEN** user opens the app
- **THEN** a bottom tab bar is visible with "List" and "Add Transaction" tabs, where "List" is the active tab

#### Scenario: User switches to Add Transaction tab
- **WHEN** user taps the "Add Transaction" tab
- **THEN** the Add Transaction tab becomes active, the entry form view becomes visible, and the List view is hidden

#### Scenario: User switches back to List tab
- **WHEN** user taps the "List" tab
- **THEN** the List tab becomes active, the transaction list and balance view become visible, and the entry form view is hidden

### Requirement: List view is the default main interface
The system SHALL display the transaction list and running balance as the default view when the app loads, without showing the entry form.

#### Scenario: User sees transaction list as main interface on load
- **WHEN** user opens the app
- **THEN** the transaction list and running balance are displayed by default, and the entry form is not visible

### Requirement: Add Transaction view shows the entry form
The system SHALL display the cashflow entry form (type selector, amount, category, account, submit button) when the "Add Transaction" tab is active.

#### Scenario: User sees entry form in Add Transaction tab
- **WHEN** user taps the "Add Transaction" tab
- **THEN** the entry form is displayed with type selector, amount input, category dropdown, account dropdown, and a submit button labeled "Add Entry"
