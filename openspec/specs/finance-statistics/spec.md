# finance-statistics Specification

## Purpose

Provides statistical analysis of the user's cashflow (income, expenses, net
balance, category breakdown, account breakdown, and monthly trends) in a
dedicated Statistics tab, plus a "Copy for LLM" button that copies a
structured, human-readable summary of those statistics to the clipboard so
the user can paste it into their personal LLM of choice for deeper
conversational analysis.

## Requirements

### Requirement: Statistics tab is reachable from the bottom tab bar

The system SHALL expose a "Statistics" tab on the bottom tab bar. Tapping it
SHALL display the statistics view and highlight the Statistics tab as active;
tapping another tab SHALL hide the statistics view.

#### Scenario: User opens the Statistics tab

- **GIVEN** the bottom tab bar is visible
- **WHEN** the user taps the "Statistics" tab
- **THEN** the statistics view becomes visible and the other views (List, Add
	Transaction, Import/Export) are hidden

#### Scenario: Statistics tab is the fourth tab

- **GIVEN** the user is viewing the Import/Export tab
- **WHEN** the user taps the "Statistics" tab
- **THEN** the statistics view becomes visible and the Statistics tab is
	highlighted as active

### Requirement: System displays total income, expenses, and net balance

The system SHALL compute and display three summary figures from the
in-memory `transactions` array: total income (sum of all money-in amounts,
shown as a positive Rupiah value), total expenses (sum of all money-out
amounts, shown as a positive Rupiah value), and net balance (income minus
expenses, shown with `formatRupiah()` including the minus-sign convention for
negative values).

#### Scenario: User sees summary figures on the statistics tab

- **GIVEN** the user has recorded several cashflow entries including both
	money-in and money-out transactions
- **WHEN** the user opens the Statistics tab
- **THEN** the view displays a total income value, a total expenses value, and
	a net balance value, all formatted as Indonesian Rupiah

### Requirement: System displays spending breakdown by category

The system SHALL compute and display, for each category, the total amount
spent (sum of money-out transactions in that category, as a positive
Rupiah value). Categories with no expenses SHALL NOT be displayed. The list
SHALL be sorted by total amount descending (largest expense category first).

#### Scenario: User sees category breakdown

- **GIVEN** the user has money-out transactions across at least two categories
	(e.g. "Food" and "Transport")
- **WHEN** the user opens the Statistics tab
- **THEN** the view shows each category with its total expense, sorted largest
	first

### Requirement: System displays balance by account

The system SHALL compute and display, for each account, the net balance
(sum of all transaction amounts in that account: money-in minus money-out),
formatted with `formatRupiah()`. Accounts with zero net activity SHALL be
omitted.

#### Scenario: User sees account balances

- **GIVEN** the user has transactions in at least two accounts
- **WHEN** the user opens the Statistics tab
- **THEN** the view shows each account with its net balance

### Requirement: System displays monthly income/expense trend

The system SHALL group transactions by month (ISO `YYYY-MM`) and display, for
each month, the total income and total expenses for that month. Months are
ordered chronologically (earliest first). The amount zero is never displayed
as a negative value for income or expense components.

#### Scenario: User sees monthly trend

- **GIVEN** the user has transactions spanning at least two different months
- **WHEN** the user opens the Statistics tab
- **THEN** the view shows a table with one row per month, each showing that
	month's income and that month's expenses

### Requirement: Copy for LLM button copies a structured text summary

The system SHALL provide a "Copy for LLM" button on the statistics view. When
activated, the system SHALL assemble a plain-text summary of the financial
statistics — including a short intro header, the summary figures, the category
breakdown, the account breakdown, the monthly trend, and a brief note on
notable patterns (largest expense category, largest single transaction) —
and SHALL copy that text to the clipboard via the async Clipboard API
(`navigator.clipboard.writeText`), and SHALL confirm the successful copy to the
user with a brief acknowledgement.

#### Scenario: User copies statistics for their LLM

- **GIVEN** the user is viewing the Statistics tab
- **WHEN** the user taps "Copy for LLM"
- **THEN** a structured plain-text summary of the statistics is placed on the
	system clipboard

#### Scenario: Copy for LLM confirms successful copy to the user

- **GIVEN** the browser supports the Clipboard API and the user is viewing the
	Statistics tab
- **WHEN** the user taps "Copy for LLM"
- **THEN** the text summary is copied to the clipboard AND the system provides
	a brief positive confirmation to the user (e.g. a transient "Copied to
	clipboard" message or an equivalent short-lived acknowledgement), without
	altering any transaction data

#### Scenario: Copy for LLM works offline

- **GIVEN** the app is running offline (service-worker cached shell, IndexedDB
	data available)
- **WHEN** the user taps "Copy for LLM" on the Statistics tab
- **THEN** the text summary is copied to the clipboard without any network
	access

#### Scenario: Clipboard API unavailable falls back gracefully

- **GIVEN** the browser does not support `navigator.clipboard` (e.g. served
	over `http://` instead of `https://`, or an older browser)
- **WHEN** the user taps "Copy for LLM"
- **THEN** the system displays the full text summary in an `alert()` so the
	user can manually copy it, rather than failing silently

### Requirement: Statistics are read-only

The system SHALL NOT create, modify, or delete any transaction when computing
or displaying statistics or when copying data for an LLM. Statistics are
derived solely from the existing `transactions` array.

#### Scenario: Copy for LLM does not alter transactions

- **GIVEN** the user has transactions in the store
- **WHEN** the user taps "Copy for LLM"
- **THEN** the transaction list and running balance are unchanged
