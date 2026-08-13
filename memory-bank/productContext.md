# Product Context

## Why This Project Exists
Simple Checkbook is a personal finance tool built for a single user who needs a
lightweight, always-available way to track cashflow — money in and money out —
without the overhead of a full accounting app or cloud sync. The target user
operates primarily in Indonesia, hence the Rupiah currency convention
(`Rp N.NNN`).

## Problems It Solves
- **No simple checkbook app exists** on the user's Android low-spec device that
  runs without a build toolchain, npm packages, or heavy frameworks.
- **Existing finance apps are overkill**: they require accounts, syncing, and
  often a constant network connection. Simple Checkbook is a zero-dependency PWA.
- **Currency mismatch**: generic apps use Western conventions; this app uses
  Indonesian Rupiah with dot thousands separators and no decimals.

## How It Should Work
1. User opens the app (in a browser or as a home-screen PWA).
2. The **List view** shows a running balance and a table of all transactions,
   each with type, name, amount (Rupiah-formatted), category, account, and an
   overflow menu (⋮).
3. User taps **Add Transaction** → fills the form (type selector, amount, name,
   category dropdown, account dropdown) → submits → the entry appears in the
   list and the balance updates instantly.
4. User can **edit** or **delete** any existing transaction via its overflow
   menu.
5. The app is installable on Android (standalone mode, home-screen launch).

## User Experience Goals
- **Instant load**: single HTML file with inline CSS, no external stylesheets
  or fonts.
- **Simple navigation**: bottom tab bar with just two tabs (List / Add).
- **Clear money formatting**: every monetary value is Rupiah, whole-number,
  dot-separated, with a visible minus sign for outflows.
- **Intuitive actions**: edit and delete are one tap away via an unobtrusive
  overflow menu.
- **No account needed**: session-scoped by default (Phase 1–4); persistence
  planned for a later phase.

## Target Environment
- **Devices**: Android (low-spec) and desktop Chrome.
- **Connectivity**: ideally works offline (Phase 5 goal); currently requires a
  page load.
- **Input**: touchscreen-first, but also usable with mouse/keyboard.
