# money-formatting Specification

## Purpose

Display all monetary values using the Indonesian Rupiah convention: an "Rp" currency prefix, dot (`.`) as the thousands separator, and no decimal places (amounts rounded to the nearest whole number). This applies to both the running balance and every per-transaction amount shown in the interface.

## Requirements

### Requirement: System displays monetary amounts in Rupiah format
The system SHALL display every monetary amount — both the running balance and individual transaction amounts — using the format `Rp N.NNN` where `N` represents digits grouped by three from the right with dot separators and no decimal places. Money-out amounts SHALL be prefixed with a minus sign (`−Rp N.NNN`) and money-in/positive amounts with no operator prefix other than the `Rp` currency symbol (i.e., `Rp N.NNN`).

#### Scenario: Running balance displays in Rupiah format with dot thousands separator
- **WHEN** the running balance is `1000000`
- **THEN** the balance element displays `Rp 1.000.000`

#### Scenario: Negative balance displays with minus sign
- **WHEN** the running balance is `-50000`
- **THEN** the balance element displays `−Rp 50.000`

#### Scenario: Transaction amount displays in Rupiah format
- **WHEN** a transaction has an amount of `25000`
- **THEN** the transaction list row displays `Rp 25.000` as the amount

#### Scenario: Money-out transaction amount displays with minus sign
- **WHEN** a transaction has a signed amount of `-75000`
- **THEN** the transaction list row displays `−Rp 75.000` as the amount

#### Scenario: Amounts are rounded to whole numbers
- **WHEN** a transaction has a raw amount of `1250.75`
- **THEN** the display shows `Rp 1.251` (rounded to nearest whole number, no decimal places)

### Requirement: System does not display decimal places on monetary values
The system SHALL never display decimal places (no `,00` or `.00` suffix) on any monetary value in the user interface. All amounts SHALL be shown as whole numbers with dot thousands separators.

#### Scenario: Amount with decimals is rounded on display
- **WHEN** a transaction amount is `-3000.50`
- **THEN** the display shows `−Rp 3.001` (rounded, no decimals shown)

#### Scenario: Zero balance displays without decimals
- **WHEN** the running balance is `0`
- **THEN** the balance element displays `Rp 0`
