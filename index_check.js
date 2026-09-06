
    // PWA: Register the service worker.
    // sw.js handles install/activate, cache-first fetch interception, and
    // cache cleanup. See sw.js for details.
    // Under file:// the SW cannot register, so skip silently.
    // Core functionality (render, forms, IndexedDB) works without it.
    var isCapacitorRuntime = typeof Capacitor !== 'undefined' &&
      typeof Capacitor.isNativePlatform === 'function' &&
      Capacitor.isNativePlatform();
    if (!isCapacitorRuntime && location.protocol !== 'file:') {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('sw.js')
            .then(function (registration) {
              console.log('ServiceWorker registered (scope: ' + registration.scope + ')');
            })
            .catch(function (error) {
              console.error('ServiceWorker registration failed: ', error);
            });
        });
      }
    }

    // Constants (Phase 4) — inlined for Android file:// compatibility.
    // Previously externalized; inlined because Android Chrome blocks
    // external scripts under file://. Edit annually; no other changes needed.
    var CATEGORIES = ['Income', 'Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];
    var ACCOUNTS = ['Primary', 'Istri', 'Savings'];

    // ===== Import/Export (Phase 6) =====
    var EXPORT_FILENAME = 'checkbook-data.json';
    var EXPORT_DATA_DIR = 'data';
    var EXPORT_DATA_PATH = EXPORT_DATA_DIR + '/' + EXPORT_FILENAME;

    // ===== State Variables (Phase 3, Phase 5 persistence) =====
    let transactions = [];
    let nextId = 1;
    let editId = null;
    let currentView = 'list';
    let activeMenuId = null;

    // ===== Persistence (native SQLite in APK, IndexedDB in browser) =====
    var DB_NAME = 'SimpleCheckbook';
    var DB_VERSION = 1;
    var STORE_NAME = 'transactions';
    var db = null;

    function nativeDatabasePlugin() {
      return typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.NativeDatabase;
    }

    // Open (or create) the browser fallback database. Idempotent: reuses `db`.
    function dbOpen() {
      return new Promise(function (resolve, reject) {
        if (db) return resolve(db);
        var request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = function (event) {
          var database = event.target.result;
          if (!database.objectStoreNames.contains(STORE_NAME)) {
            database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };
        request.onsuccess = function (event) {
          db = event.target.result;
          resolve(db);
        };
        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    }

    function dbSaveAll() {
      var nativeDb = nativeDatabasePlugin();
      if (isNativeFilesystemRuntime() && nativeDb && typeof nativeDb.saveAll === 'function') {
        return nativeDb.saveAll({ transactions: transactions, nextId: nextId });
      }

      dbOpen().then(function (database) {
        var tx = database.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        store.clear();
        transactions.forEach(function (item) { store.put(item); });
        tx.oncomplete = function () {
          console.log('IndexedDB: saved ' + transactions.length + ' transactions');
        };
        tx.onerror = function (event) {
          console.error('IndexedDB save failed:', event.target.error);
        };
      }).catch(function (err) {
        console.error('IndexedDB dbSaveAll failed:', err);
      });
    }

    // Load native SQLite in the APK, or IndexedDB in a browser.
    function dbLoadAll() {
      var nativeDb = nativeDatabasePlugin();
      if (isNativeFilesystemRuntime() && nativeDb && typeof nativeDb.load === 'function') {
        nativeDb.load().then(function (result) {
          transactions = Array.isArray(result.transactions) ? result.transactions : [];
          nextId = typeof result.nextId === 'number' ? result.nextId : 1;
          renderTransactions();
          updateBalance();
        }).catch(function (err) {
          console.error('Native database load failed:', err);
          renderTransactions();
          updateBalance();
        });
        return;
      }

      dbOpen().then(function (database) {
        var tx = database.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.getAll();
        req.onsuccess = function (event) {
          var all = event.target.result || [];
          transactions = all.filter(function (item) {
            return typeof item.id === 'number';
          });
          if (transactions.length > 0) {
            nextId = Math.max.apply(null, transactions.map(function (t) {
              return t.id;
            })) + 1;
          } else {
            nextId = 1;
          }
          renderTransactions();
          updateBalance();
        };
        req.onerror = function (event) {
          console.error('IndexedDB load failed:', event.target.error);
          renderTransactions();
          updateBalance();
        };
      }).catch(function (err) {
        console.error('IndexedDB dbLoadAll failed:', err);
        renderTransactions();
        updateBalance();
      });
    }

    // Populate the category and account <select> elements from the inlined
    // CATEGORIES / ACCOUNTS constants. No guard needed — the arrays are
    // defined inline at the top of this script, so they are always in scope.
    function populateSelects() {
      var categorySelect = document.getElementById('category');
      var accountSelect = document.getElementById('account');

      CATEGORIES.forEach(function (cat) {
        var opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
      });

      ACCOUNTS.forEach(function (acc) {
        var opt = document.createElement('option');
        opt.value = acc;
        opt.textContent = acc;
        accountSelect.appendChild(opt);
      });
    }

    // Format a signed amount as Indonesian Rupiah: Rp 1.000.000 or −Rp 50.000
    // Positive/zero → "Rp N.NNN"; negative → "−Rp N.NNN" (Unicode minus).
    // Amounts are rounded to whole numbers via Math.round().
    function formatRupiah(amount) {
      var abs = Math.round(Math.abs(amount));
      var str = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return amount < 0 ? '−Rp ' + str : 'Rp ' + str;
    }

    // Compute running balance = sum of all transaction amounts
    function computeBalance() {
      return transactions.reduce(function (sum, tx) {
        return sum + tx.amount;
      }, 0);
    }

    // Update the balance display element
    function updateBalance() {
      var balance = computeBalance();
      var balanceEl = document.getElementById('balance');
      balanceEl.textContent = formatRupiah(balance);
      balanceEl.className = 'balance-amount ' +
        (balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'zero');
    }

    // Render the transaction list from the in-memory array
    function renderTransactions() {
      var listEl = document.getElementById('transaction-list');

      if (transactions.length === 0) {
        listEl.innerHTML = '<tr><td colspan="7" class="empty-message">No entries yet</td></tr>';
      } else {
        listEl.innerHTML = transactions.map(function (tx) {
          var typeLabel = tx.type === 'money-in' ? 'Money In' : 'Money Out';
          var amountClass = tx.type === 'money-in' ? 'money-in' : 'money-out';
          return '<tr data-tx-id="' + tx.id + '">' +
            '<td>' + typeLabel + '</td>' +
            '<td>' + (tx.name || '') + '</td>' +
            '<td class="amount ' + amountClass + '">' + formatRupiah(tx.amount) + '</td>' +
            '<td>' + tx.category + '</td>' +
            '<td>' + tx.account + '</td>' +
            '<td>' + (tx.date || '') + '</td>' +
            '<td class="action-cell">' +
            '<button class="overflow-btn" type="button" data-tx-id="' + tx.id + '" title="More actions">⋮</button>' +
            '</td>' +
            '</tr>';
        }).join('');
      }

      updateBalance();
    }

            // ===== View Navigation (Phase 3, extended in Phase 7) =====
    // Toggle between List, Add, Import/Export, and Statistics views,
    // highlighting the active tab
    function showView(tabName) {
      currentView = tabName;

      var listTab = document.getElementById('tab-list');
      var addTab = document.getElementById('tab-add');
      var ieTab = document.getElementById('tab-import-export');
      var statsTab = document.getElementById('tab-statistics');
      var listView = document.getElementById('list-view');
      var addView = document.getElementById('add-view');
      var ieView = document.getElementById('import-export-view');
      var statsView = document.getElementById('statistics-view');

      if (tabName === 'list') {
        listTab.classList.add('active');
        addTab.classList.remove('active');
        ieTab.classList.remove('active');
        statsTab.classList.remove('active');
        listView.classList.add('active');
        addView.classList.remove('active');
        ieView.classList.remove('active');
        statsView.classList.remove('active');
      } else if (tabName === 'add') {
        addTab.classList.add('active');
        listTab.classList.remove('active');
        ieTab.classList.remove('active');
        statsTab.classList.remove('active');
        addView.classList.add('active');
        listView.classList.remove('active');
        ieView.classList.remove('active');
        statsView.classList.remove('active');
      } else if (tabName === 'import-export') {
        ieTab.classList.add('active');
        listTab.classList.remove('active');
        addTab.classList.remove('active');
        statsTab.classList.remove('active');
        ieView.classList.add('active');
        listView.classList.remove('active');
        addView.classList.remove('active');
        statsView.classList.remove('active');
      } else if (tabName === 'statistics') {
        statsTab.classList.add('active');
        listTab.classList.remove('active');
        addTab.classList.remove('active');
        ieTab.classList.remove('active');
        statsView.classList.add('active');
        listView.classList.remove('active');
        addView.classList.remove('active');
        ieView.classList.remove('active');
                renderStatistics();
      }
    }

    // ===== Statistics (Phase 7) =====

    // Compute financial statistics (read-only, does not mutate transactions).
    function computeStatistics() {
      var totalIncome = 0;
      var totalExpenses = 0;
      var catTotals = {};
      var accTotals = {};
      var monthTotals = {};

      transactions.forEach(function (tx) {
        var amount = tx.amount;
        var month = tx.date ? tx.date.slice(0, 7) : null;

        if (tx.type === 'money-in') {
          totalIncome += amount;
        } else if (tx.type === 'money-out') {
          totalExpenses += Math.abs(amount);
          catTotals[tx.category] = (catTotals[tx.category] || 0) + Math.abs(amount);
        }

        accTotals[tx.account] = (accTotals[tx.account] || 0) + amount;

        if (month) {
          if (!monthTotals[month]) {
            monthTotals[month] = { income: 0, expenses: 0 };
          }
          if (tx.type === 'money-in') {
            monthTotals[month].income += amount;
          } else {
            monthTotals[month].expenses += Math.abs(amount);
          }
        }
      });

      var byCategory = Object.keys(catTotals)
        .map(function (cat) {
          return { category: cat, amount: catTotals[cat] };
        })
        .sort(function (a, b) {
          return b.amount - a.amount;
        });

      var byAccount = Object.keys(accTotals)
        .map(function (acc) {
          return { account: acc, balance: accTotals[acc] };
        })
        .filter(function (item) {
          return item.balance !== 0;
        })
        .sort(function (a, b) {
          return b.balance - a.balance;
        });

      var byMonth = Object.keys(monthTotals)
        .sort()
        .map(function (m) {
          return {
            month: m,
            income: monthTotals[m].income,
            expenses: monthTotals[m].expenses
          };
        });

      return {
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        netBalance: totalIncome - totalExpenses,
        byCategory: byCategory,
                byAccount: byAccount,
        byMonth: byMonth
      };
    }

    // Render the statistics view from computeStatistics() results.
    function renderStatistics() {
      var stats = computeStatistics();

      document.getElementById('stat-total-income').textContent = formatRupiah(stats.totalIncome);
      document.getElementById('stat-total-expenses').textContent = formatRupiah(stats.totalExpenses);

      var netEl = document.getElementById('stat-net-balance');
      netEl.textContent = formatRupiah(stats.netBalance);
      netEl.className = 'stat-amount ' +
        (stats.netBalance > 0 ? 'positive' : stats.netBalance < 0 ? 'negative' : 'zero');

      // Category breakdown
      var catEl = document.getElementById('statistics-category');
      if (stats.byCategory.length === 0) {
        catEl.innerHTML = '<div class="statistics-empty">No expenses recorded yet.</div>';
      } else {
        catEl.innerHTML = stats.byCategory.map(function (item) {
          return '<div class="statistics-row">' +
            '<span class="statistics-row-label">' + item.category + '</span>' +
            '<span class="statistics-row-value">' + formatRupiah(item.amount) + '</span>' +
            '</div>';
        }).join('');
      }

      // Account breakdown
      var accEl = document.getElementById('statistics-account');
      if (stats.byAccount.length === 0) {
        accEl.innerHTML = '<div class="statistics-empty">No account activity yet.</div>';
      } else {
        accEl.innerHTML = stats.byAccount.map(function (item) {
          var cls = item.balance > 0 ? 'positive' : item.balance < 0 ? 'negative' : 'zero';
          return '<div class="statistics-row">' +
            '<span class="statistics-row-label">' + item.account + '</span>' +
            '<span class="statistics-row-value ' + cls + '">' + formatRupiah(item.balance) + '</span>' +
            '</div>';
        }).join('');
      }

      // Monthly trend table
      var trendBody = document.getElementById('statistics-trend-body');
      if (stats.byMonth.length === 0) {
        trendBody.innerHTML = '<tr><td colspan="3" class="statistics-empty">No dated entries yet.</td></tr>';
      } else {
        trendBody.innerHTML = stats.byMonth.map(function (m) {
          return '<tr>' +
            '<td>' + m.month + '</td>' +
            '<td>' + formatRupiah(m.income) + '</td>' +
            '<td>' + formatRupiah(m.expenses) + '</td>' +
                        '</tr>';
        }).join('');
      }
    }

    // Assemble a plain-text financial summary and copy to clipboard.
    function copyForLLM() {
      var stats = computeStatistics();
      var statusEl = document.getElementById('statistics-status');
      var lines = [];
      lines.push('=== Simple Checkbook — Financial Statistics Summary ===');
      lines.push('');
      lines.push('Instructions for the financial analysis:');
      lines.push('  Analyze only the data provided below. Do not invent missing values or assume facts not supported by the data.');
      lines.push('  Compare income, expenses, and net balance; identify the largest spending categories and accounts;');
      lines.push('  evaluate monthly changes and unusual concentrations; and distinguish clear observations from assumptions.');
      lines.push('  Present practical, prioritized recommendations that are appropriate for the available evidence.');
      lines.push('');
      lines.push('Expected output:');
      lines.push('  1. Executive summary');
      lines.push('  2. Key findings with relevant amounts or percentages');
      lines.push('  3. Monthly and category trends');
      lines.push('  4. Risks or items needing attention');
      lines.push('  5. Prioritized recommendations');
      lines.push('  6. Data limitations and assumptions');
      lines.push('  Show calculations briefly when useful, use the same currency, and clearly say when the data is insufficient.');
      lines.push('');
      lines.push('Summary Figures:');
      lines.push('  Total Income: ' + formatRupiah(stats.totalIncome));
      lines.push('  Total Expenses: ' + formatRupiah(stats.totalExpenses));
      lines.push('  Net Balance: ' + formatRupiah(stats.netBalance));
      lines.push('');
      lines.push('Spending by Category (largest first):');
      if (stats.byCategory.length === 0) {
        lines.push('  (no expenses recorded)');
      } else {
        stats.byCategory.forEach(function (item) {
          lines.push('  ' + item.category + ': ' + formatRupiah(item.amount));
        });
      }
      lines.push('');
      lines.push('Balance by Account:');
      if (stats.byAccount.length === 0) {
        lines.push('  (no account activity)');
      } else {
        stats.byAccount.forEach(function (item) {
          lines.push('  ' + item.account + ': ' + formatRupiah(item.balance));
        });
      }
      lines.push('');
      lines.push('Monthly Trend (earliest first):');
      if (stats.byMonth.length === 0) {
        lines.push('  (no dated entries)');
      } else {
        stats.byMonth.forEach(function (m) {
          lines.push('  ' + m.month + ': Income ' + formatRupiah(m.income) + ', Expenses ' + formatRupiah(m.expenses));
        });
      }
      lines.push('');
      lines.push('Notable Patterns:');
      if (stats.byCategory.length > 0) {
        lines.push('  Largest expense category: ' + stats.byCategory[0].category + ' (' + formatRupiah(stats.byCategory[0].amount) + ')');
      } else {
        lines.push('  Largest expense category: (none)');
      }
      if (transactions.length > 0) {
        var largest = transactions[0];
        transactions.forEach(function (tx) {
          if (Math.abs(tx.amount) > Math.abs(largest.amount)) {
            largest = tx;
          }
        });
        var txLabel = largest.type === 'money-in' ? 'Income' : 'Expense';
        var txName = largest.name || '(no name)';
        var txDate = largest.date || 'no date';
        lines.push('  Largest single transaction: ' + txName + ' — ' + txLabel + ' ' + formatRupiah(Math.abs(largest.amount)) + ' on ' + txDate);
      } else {
        lines.push('  Largest single transaction: (none)');
      }
      var text = lines.join('\n');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          statusEl.textContent = 'Copied to clipboard!';
          setTimeout(function () {
            statusEl.textContent = '';
          }, 3000);
        }).catch(function () {
          statusEl.textContent = '';
          alert(text);
        });
      } else {
        alert(text);
      }
    }

    // Handle form submission — adds a new transaction or updates an existing one
    function addTransaction(event) {
      event.preventDefault();

      var type = document.querySelector('input[name="type"]:checked').value;
      var amountInput = document.getElementById('amount');
      var amount = parseFloat(amountInput.value);
      var name = document.getElementById('name').value.trim();
      var category = document.getElementById('category').value;
      var account = document.getElementById('account').value;
      var date = document.getElementById('date').value;

      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than 0.');
        amountInput.focus();
        return;
      }

      // Convert "money-out" to negative amount
      var signedAmount = type === 'money-out' ? -amount : amount;

      if (editId !== null) {
        // ——— Edit mode: update existing transaction in place ———
        var idx = transactions.findIndex(function (t) { return t.id === editId; });
        if (idx !== -1) {
          transactions[idx].type = type;
          transactions[idx].amount = signedAmount;
          transactions[idx].name = name;
          transactions[idx].category = category;
          transactions[idx].account = account;
          transactions[idx].date = date;
        }

        // Reset edit state and UI
        editId = null;
        document.getElementById('submit-btn').textContent = 'Add Entry';
        renderTransactions();
        dbSaveAll();
        event.target.reset();
        document.getElementById('name').value = '';
        document.getElementById('type-in').checked = true;
        document.getElementById('date').value = new Date().toISOString().slice(0, 10);
        showView('list');
      } else {
        // ——— Add mode: push a new transaction ———
        transactions.push({
          id: nextId++,
          type: type,
          amount: signedAmount,
          name: name,
          category: category,
          account: account,
          date: date
        });

        renderTransactions();
        dbSaveAll();
        event.target.reset();
        document.getElementById('name').value = '';
        document.getElementById('type-in').checked = true;
        document.getElementById('date').value = new Date().toISOString().slice(0, 10);
      }
    }

    // ===== Delete Transaction (Phase 3) =====
    function deleteTransaction(id) {
      if (confirm('Delete this transaction?')) {
        transactions = transactions.filter(function (t) { return t.id !== id; });
        renderTransactions();
        dbSaveAll();
        closeOverflowMenu();
      }
    }

    // ===== Edit Transaction (Phase 3) =====
    // Pre-fill the form with the transaction's values and switch to Add tab
    function editTransaction(id) {
      var tx = transactions.find(function (t) { return t.id === id; });
      if (!tx) return;

      editId = id;

      // Pre-fill the form with the transaction's current values
      if (tx.type === 'money-in') {
        document.getElementById('type-in').checked = true;
      } else {
        document.getElementById('type-out').checked = true;
      }
      document.getElementById('amount').value = Math.abs(tx.amount);
      document.getElementById('name').value = tx.name || '';
      document.getElementById('category').value = tx.category;
      document.getElementById('account').value = tx.account;
      document.getElementById('date').value = tx.date || new Date().toISOString().slice(0, 10);

      // Relabel the submit button to indicate edit mode
      document.getElementById('submit-btn').textContent = 'Update Entry';

      // Switch to the Add Transaction tab
      showView('add');

      // Close any open overflow menu
      closeOverflowMenu();
    }

    // ===== Overflow Menu (Phase 3) =====
    // Toggle the overflow menu for a given transaction row
    function toggleOverflowMenu(id, button) {
      var menu = document.getElementById('overflow-menu');

      // If the same row's button is clicked again while menu is open, close it
      if (activeMenuId === id && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        activeMenuId = null;
        return;
      }

      // Position the menu just below the overflow button
      var rect = button.getBoundingClientRect();
      menu.style.left = rect.left + 'px';
      menu.style.top = (rect.bottom + 5) + 'px';

      activeMenuId = id;
      menu.classList.remove('hidden');
    }

    // Close the overflow menu
    function closeOverflowMenu() {
      var menu = document.getElementById('overflow-menu');
      menu.classList.add('hidden');
      activeMenuId = null;
    }

    function setImportExportStatus(message, kind) {
      var statusEl = document.getElementById('import-export-status');
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.style.color = kind === 'error' ? '#c62828' : kind === 'success' ? '#1b5e20' : kind === 'warning' ? '#b45309' : '#4b5563';
    }

    function isNativeFilesystemRuntime() {
      return typeof Capacitor !== 'undefined' &&
        typeof Capacitor.isNativePlatform === 'function' &&
        Capacitor.isNativePlatform();
    }

    function resolveStorageBackend() {
      return isNativeFilesystemRuntime() ? 'native' : 'browser';
    }

    function getBackupStatusLabel(code) {
      if (!code) return 'filesystem-error';
      var normalized = String(code).toLowerCase();
      if (normalized.indexOf('not found') !== -1 || normalized.indexOf('missing') !== -1 || normalized.indexOf('no backup') !== -1) {
        return 'missing-file';
      }
      if (normalized.indexOf('cancel') !== -1 || normalized.indexOf('user cancellation') !== -1) {
        return 'cancelled';
      }
      if (normalized.indexOf('permission') !== -1) {
        return 'filesystem-error';
      }
      return 'filesystem-error';
    }

    function isHttpOrigin() {
      return location.protocol === 'http:' || location.protocol === 'https:';
    }

    function getNativeFilesystemPlugin() {
      if (typeof Capacitor === 'undefined' || typeof Capacitor.registerPlugin !== 'function') {
        return null;
      }
      if (typeof Capacitor.isPluginAvailable === 'function' && !Capacitor.isPluginAvailable('Filesystem')) {
        return null;
      }
      if (Capacitor.Plugins && Capacitor.Plugins.Filesystem) {
        return Capacitor.Plugins.Filesystem;
      }
      return Capacitor.registerPlugin('Filesystem');
    }

    async function nativeWriteBackup(data) {
      if (!isNativeFilesystemRuntime()) {
        throw new Error('Native filesystem is unavailable in this runtime.');
      }

      var fs = getNativeFilesystemPlugin();
      if (!fs || typeof fs.writeFile !== 'function') {
        throw new Error('The Capacitor Filesystem plugin is unavailable.');
      }

      var payload = JSON.stringify(data, null, 2);
      var result = await fs.writeFile({
        path: 'checkbook-data.json',
        data: payload,
        directory: 'DATA',
        encoding: 'utf8'
      });
      if (result && result.uri) {
        return result.uri;
      }
      return 'native-data://checkbook-data.json';
    }

    async function nativeReadBackup() {
      if (!isNativeFilesystemRuntime()) {
        throw new Error('Native filesystem is unavailable in this runtime.');
      }

      var fs = getNativeFilesystemPlugin();
      if (!fs || typeof fs.readFile !== 'function') {
        throw new Error('The Capacitor Filesystem plugin is unavailable.');
      }

      try {
        var result = await fs.readFile({
          path: 'checkbook-data.json',
          directory: 'DATA',
          encoding: 'utf8'
        });

        if (result && typeof result.data === 'string') {
          return JSON.parse(result.data);
        }
        if (result && result.value) {
          return JSON.parse(result.value);
        }
        throw new Error('The native backup file was empty.');
      } catch (err) {
        if (err && err.message && /not found|missing|does not exist|no backup/i.test(err.message)) {
          throw new Error('No backup was found in the native app data folder.');
        }
        throw err;
      }
    }

    // Export all transactions. Capacitor uses app-private storage; browsers download
    // a JSON file, including when the app is opened from file://.
    async function exportTransactions() {
      if (isNativeFilesystemRuntime()) {
        setImportExportStatus('Exporting to native app storage...', 'progress');
        try {
          await nativeWriteBackup(transactions);
          setImportExportStatus('Done: exported ' + transactions.length + ' transactions to the app-private backup file.', 'success');
          return;
        } catch (err) {
          console.error('Native export failed:', err);
          setImportExportStatus('Error: ' + err.message, 'error');
          alert('Export failed: ' + err.message);
          return;
        }
      }

      setImportExportStatus('Exporting...', 'progress');

      var data = JSON.stringify(transactions, null, 2);
      var blob = new Blob([data], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = EXPORT_FILENAME;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setImportExportStatus('Done: exported ' + transactions.length + ' transactions.', 'success');
      }, 250);
    }

    // Validate that imported data is an array of well-formed transaction objects.
    // Returns true only if data is an array and every element is an object with
    // id (number), type ('money-in'|'money-out'), finite amount (number), and
    // string name/category/account/date.
    function validateImportData(data) {
      if (!Array.isArray(data)) return false;
      return data.every(function (item) {
        return typeof item === 'object' && item !== null &&
          typeof item.id === 'number' &&
          (item.type === 'money-in' || item.type === 'money-out') &&
          typeof item.amount === 'number' && isFinite(item.amount) &&
          typeof item.name === 'string' &&
          typeof item.category === 'string' &&
          typeof item.account === 'string' &&
          typeof item.date === 'string';
      });
    }

    async function importTransactionsFromData() {
      if (isNativeFilesystemRuntime()) {
        setImportExportStatus('Importing from native app storage...', 'progress');
        try {
          var data = await nativeReadBackup();
          if (!validateImportData(data)) {
            throw new Error('The native backup file does not match the expected transaction format.');
          }

          if (!confirm('Replace all entries with the imported native backup?')) {
            setImportExportStatus('Import cancelled.', 'warning');
            return;
          }

          transactions = data.slice();
          if (transactions.length > 0) {
            nextId = Math.max.apply(null, transactions.map(function (tx) { return tx.id; })) + 1;
          } else {
            nextId = 1;
          }

          dbSaveAll();
          renderTransactions();
          updateBalance();
          showView('list');
          setImportExportStatus('Done: imported ' + transactions.length + ' transactions from the native backup.', 'success');
          return;
        } catch (err) {
          console.error('Native import failed:', err);
          setImportExportStatus(getBackupStatusLabel(err.message) + ': ' + err.message, 'error');
          alert('Import failed: ' + err.message);
          return;
        }
      }

      if (!isHttpOrigin()) {
        setImportExportStatus('Import from the data folder requires HTTP. Open the app via a local web server.', 'error');
        alert('Import from the fixed data folder only works when the app is served over HTTP. Open it with a local web server first.');
        return;
      }

      setImportExportStatus('Importing from ' + EXPORT_DATA_PATH + '...', 'progress');

      try {
        var response = await fetch(EXPORT_DATA_PATH + '?t=' + Date.now(), { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('No backup was found in ' + EXPORT_DATA_PATH + '.');
        }

        var data = await response.json();
        if (!validateImportData(data)) {
          throw new Error('The data file does not match the expected transaction format.');
        }

        if (!confirm('Replace all entries with the imported file?')) {
          setImportExportStatus('Import cancelled.', 'warning');
          return;
        }

        transactions = data.slice();
        if (transactions.length > 0) {
          nextId = Math.max.apply(null, transactions.map(function (tx) { return tx.id; })) + 1;
        } else {
          nextId = 1;
        }

        dbSaveAll();
        renderTransactions();
        updateBalance();
        showView('list');
        setImportExportStatus('Done: imported ' + transactions.length + ' transactions from ' + EXPORT_DATA_PATH + '.', 'success');
      } catch (err) {
        console.error('Import failed:', err);
        setImportExportStatus('Error: ' + err.message, 'error');
        alert('Import failed: ' + err.message);
      }
    }

    // ===== Wire up DOM — attach listeners, populate selects, and initialize =====
    document.addEventListener('DOMContentLoaded', function () {
      populateSelects();

      // Pre-fill the date input with the current day (ISO YYYY-MM-DD)
      document.getElementById('date').value = new Date().toISOString().slice(0, 10);

      // Form submission (add or update)
      document.getElementById('cashflow-form').addEventListener('submit', addTransaction);

      // Bottom tab button click listeners
      document.getElementById('tab-list').addEventListener('click', function () {
        showView('list');
        closeOverflowMenu();
      });
      document.getElementById('tab-list').addEventListener('touchend', function (e) {
        e.preventDefault();
        showView('list');
        closeOverflowMenu();
      });
      document.getElementById('tab-add').addEventListener('click', function () {
        showView('add');
        closeOverflowMenu();
      });
      document.getElementById('tab-add').addEventListener('touchend', function (e) {
        e.preventDefault();
        showView('add');
        closeOverflowMenu();
      });

      // Import/Export tab (third tab) — dual click + touchend listeners (Phase 6)
      document.getElementById('tab-import-export').addEventListener('click', function () {
        showView('import-export');
        closeOverflowMenu();
      });
            document.getElementById('tab-import-export').addEventListener('touchend', function (e) {
        e.preventDefault();
        showView('import-export');
        closeOverflowMenu();
      });

      // Statistics tab (fourth tab) — dual click + touchend listeners (Phase 7)
      document.getElementById('tab-statistics').addEventListener('click', function () {
        showView('statistics');
        closeOverflowMenu();
      });
      document.getElementById('tab-statistics').addEventListener('touchend', function (e) {
        e.preventDefault();
        showView('statistics');
        closeOverflowMenu();
      });

      // Import/Export button wiring (Phase 6)
      var exportBtn = document.getElementById('export-btn');
      var importBtn = document.getElementById('import-btn');
      var importInput = document.getElementById('import-file');
      var ieStatus = document.getElementById('import-export-status');

      exportBtn.addEventListener('click', function () {
        exportTransactions();
        closeOverflowMenu();
      });

      importBtn.addEventListener('click', function () {
        importTransactionsFromData();
      });

      importInput.addEventListener('change', function () {
        // The default flow intentionally does not ask the user to pick a file.
        // Import is read directly from the fixed data backup path.
        importTransactionsFromData();
      });

      // Statistics: Copy for LLM button (Phase 7)
      document.getElementById('copy-llm-btn').addEventListener('click', function () {
        copyForLLM();
        closeOverflowMenu();
      });

      // Event delegation for overflow (⋮) buttons in the transaction table body
      var listBody = document.getElementById('transaction-list');
      listBody.addEventListener('click', function (event) {
        var btn = event.target.closest('.overflow-btn');
        if (btn) {
          event.stopPropagation();
          var id = parseInt(btn.getAttribute('data-tx-id'));
          toggleOverflowMenu(id, btn);
        }
      });

      // Overflow menu item: Edit
      document.getElementById('menu-edit').addEventListener('click', function (event) {
        event.stopPropagation();
        if (activeMenuId !== null) {
          editTransaction(activeMenuId);
        }
      });

      // Overflow menu item: Delete
      document.getElementById('menu-delete').addEventListener('click', function (event) {
        event.stopPropagation();
        if (activeMenuId !== null) {
          deleteTransaction(activeMenuId);
        }
      });

      // Click-outside handler: close the overflow menu when clicking elsewhere
      document.addEventListener('click', function (event) {
        if (activeMenuId !== null) {
          var menu = document.getElementById('overflow-menu');
          var isInsideMenu = menu.contains(event.target);
          var isOverflowBtn = event.target.closest('.overflow-btn') !== null;
          if (!isInsideMenu && !isOverflowBtn) {
            closeOverflowMenu();
          }
        }
      });

      // Initialize: List view is active by default, form is hidden
      // dbLoadAll() fetches persisted data (or starts fresh) and renders
      showView('list');
      dbLoadAll();
    });
  