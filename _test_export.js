// Regression test for the simplified exportTransactions() in src/index.html.
// Extracts the inline script (index_check.js) into a vm sandbox with stubbed
// browser globals, then verifies the simplified Blob-download export produces
// the correct JSON content with the right filename and proper URL lifecycle.
const fs = require('fs');
const vm = require('vm');

const SRC = fs.readFileSync('index_check.js', 'utf-8');
const SAMPLE_TX = [{ id: 1, type: 'money-in', amount: 10000, name: 'Salary', category: 'Income', account: 'Primary', date: '2026-08-22' }];
const EXPECTED_JSON = JSON.stringify(SAMPLE_TX, null, 2);
const EXPORT_FILENAME = 'checkbook-data.json';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function setup() {
  // State captured from inside the vm context
  const state = { anchorClicked: false, blobParts: null, urlCreated: false, urlRevoked: false, anchorDownload: '' };

  const fakeAnchor = {
    href: '',
    style: { display: '' },
    click() { state.anchorClicked = true; },
    set download(v) { state.anchorDownload = v; },
  };

  const statusEl = { textContent: '', className: '', style: {} };

  const fakeDB = {
    objectStoreNames: { contains: () => true },
    createObjectStore: () => {},
    transaction: () => {
      const tx = { objectStore: () => ({ clear() {}, put() {}, get: () => ({}) }), oncomplete: null, onerror: null };
      setTimeout(() => { try { if (tx.oncomplete) tx.oncomplete({ target: tx }); } catch (e) {} }, 0);
      return tx;
    },
  };
  const makeReq = () => {
    const req = {};
    Object.assign(req, { result: fakeDB, onsuccess: null, onerror: null, onupgradeneeded: null });
    setTimeout(() => { try { if (req.onsuccess) req.onsuccess({ target: req }); } catch (e) {} }, 0);
    return req;
  };
  const fakeIndexedDB = { open: () => makeReq() };
  const anchors = [];

  // Custom Blob constructor that captures parts for verification
  function BlobCtor(parts, opts) {
    state.blobParts = parts;
  }
  BlobCtor.prototype = Object.create(null);

  const sandbox = {
    window: { addEventListener() {} },
    document: {
      getElementById(id) { return id === 'import-export-status' ? statusEl : null; },
      addEventListener() {},
      createElement() {
        const el = Object.create(fakeAnchor);
        anchors.push(el);
        return el;
      },
      body: { appendChild() {}, removeChild() {} },
    },
    navigator: {},
    location: { protocol: 'file:' },
    indexedDB: fakeIndexedDB,
    URL: {
      createObjectURL() { state.urlCreated = true; return 'blob:fake'; },
      revokeObjectURL() { state.urlRevoked = true; },
    },
    Blob: BlobCtor,
    Promise: Promise,
    setTimeout: setTimeout,
    console: console,
  };

  const ctx = vm.createContext(sandbox);
  vm.runInContext(SRC, ctx);
  return { ctx, state };
}

(async () => {
  let pass = true;

  // --- Test: simplified export produces valid JSON Blob download ---
  {
    const { ctx, state } = setup();
        vm.runInContext('transactions = ' + JSON.stringify(SAMPLE_TX) + '; nextId = 2;', ctx);
    vm.runInContext('exportTransactions();', ctx);
    await sleep(300);

    let ok = true;
    if (state.anchorClicked !== true) { console.log('FAIL: anchor.click() was not called'); ok = false; }
    if (state.blobParts === null) { console.log('FAIL: Blob was not created'); ok = false; }
    if (state.blobParts !== null) {
      const got = typeof state.blobParts[0] === 'string' ? state.blobParts[0] : JSON.stringify(state.blobParts[0]);
      if (got !== EXPECTED_JSON) { console.log('FAIL: Blob content mismatch — got:\n' + got + '\n--- expected:\n' + EXPECTED_JSON); ok = false; }
    }
    if (state.urlCreated !== true) { console.log('FAIL: URL.createObjectURL was not called'); ok = false; }
    if (state.urlRevoked !== true) { console.log('FAIL: URL.revokeObjectURL was not called'); ok = false; }
    if (state.anchorDownload !== EXPORT_FILENAME) { console.log('FAIL: download=' + state.anchorDownload + ' (expected ' + EXPORT_FILENAME + ')'); ok = false; }
    if (ok) { console.log('PASS: export produces valid JSON, correct filename, URL lifecycle complete'); }
    else { pass = false; }
  }

  console.log(pass ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED');
  if (!pass) process.exit(1);
})().catch(e => { console.error('TEST HARNESS ERROR:', e); process.exit(1); });
