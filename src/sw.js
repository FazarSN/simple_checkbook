/*
 * Simple Checkbook — Service Worker (Phase 5: app-shell caching)
 *
  * Caches the application shell (index.html, style.css, manifest.json, SVG icons) at
 * install time using a cache-first strategy so the PWA loads offline after
 * the first visit. Old cache versions are purged on activate.
 */

var CACHE_NAME = 'simple-checkbook-v1';
var CACHE_URLS = [
  'index.html',
  'style.css',
  'manifest.json',
  'icons/icon-192.svg',
  'icons/icon-512.svg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
