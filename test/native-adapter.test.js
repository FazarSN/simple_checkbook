const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadScriptWithNativeCapacitor() {
  const src = fs.readFileSync('src/index.html', 'utf8');
  const match = src.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match, 'Expected inline script in src/index.html');

  const fakeStatusEl = { textContent: '', style: {} };
  const fakeCapacitor = {
    isNativePlatform: () => true,
    Plugins: {
      Filesystem: {
        readFile: async () => ({ data: '{"ok":true}' }),
        writeFile: async () => ({})
      }
    }
  };

  const sandbox = {
    console,
    window: { addEventListener() {} },
    document: {
      getElementById(id) {
        if (id === 'import-export-status') return fakeStatusEl;
        if (id === 'transaction-list') return { innerHTML: '', addEventListener() {} };
        if (id === 'balance') return { textContent: '', className: '' };
        if (id === 'statistics-category') return { innerHTML: '' };
        if (id === 'statistics-account') return { innerHTML: '' };
        if (id === 'statistics-trend-body') return { innerHTML: '' };
        return { value: '', textContent: '', className: '', style: {}, classList: { add() {}, remove() {} }, contains() { return false; }, addEventListener() {}, setAttribute() {}, getBoundingClientRect() { return { left: 0, top: 0, bottom: 0 }; } };
      },
      createElement() { return { style: {}, click() {} }; },
      body: { appendChild() {}, removeChild() {} },
      addEventListener() {},
    },
    navigator: { clipboard: { writeText: async () => {} } },
    location: { protocol: 'file:' },
    indexedDB: {
      open() {
        return { onupgradeneeded: null, onsuccess: null, onerror: null, result: { objectStoreNames: { contains: () => true }, createObjectStore() {}, transaction() { return { objectStore() { return { clear() {}, put() {}, getAll() { return { onsuccess: null, onerror: null, result: [] }; } }; }, oncomplete: null, onerror: null }; } } };
      }
    },
    URL: { createObjectURL() { return 'blob:fake'; }, revokeObjectURL() {} },
    Blob: function Blob() {},
    setTimeout,
    alert() {},
    confirm() { return true; },
    Capacitor: fakeCapacitor,
    Promise,
  };

  const context = vm.createContext(sandbox);
  vm.runInContext(match[1], context);
  return { context, fakeStatusEl };
}

test('native export/import adapter exists and switches runtime behavior', async () => {
  const { context, fakeStatusEl } = loadScriptWithNativeCapacitor();

  const nativeDetect = vm.runInContext('isNativeFilesystemRuntime()', context);
  assert.equal(nativeDetect, true, 'Expected native runtime detection to return true');

  const status = vm.runInContext('getBackupStatusLabel("missing")', context);
  assert.equal(status, 'missing-file', 'Expected missing-file status label for missing native backup');

  const storage = vm.runInContext('resolveStorageBackend()', context);
  assert.equal(storage, 'native', 'Expected runtime to resolve to native storage in Capacitor app shell');

  assert.ok(fakeStatusEl, 'Expected status element to exist');
});
