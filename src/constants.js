/*
 * Simple Checkbook — Constants (Phase 4)
 *
 * Pre-defined category and account option lists, separated from index.html
 * so they can be updated annually with a single-file edit.
 *
 * Loaded via <script src="constants.js"> (plain script, not a module)
 * so CATEGORIES and ACCOUNTS are available as globals before populateSelects() runs.
 */

const CATEGORIES = ['Income', 'Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];
const ACCOUNTS = ['Primary', 'Istri', 'Savings'];
