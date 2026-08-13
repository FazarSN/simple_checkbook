/*
 * Simple Checkbook — Service Worker (Phase 1: stub, no caching)
 *
 * This is a minimal scaffold. It registers and handles the install/activate
 * lifecycle so the PWA structure is in place, but performs NO caching or
 * request interception. Offline caching will be added in Phase 3.
 */

self.addEventListener('install', function () {
  // Activate immediately — don't wait for existing tabs to close.
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  // Take control of all pages under this scope right away.
  event.waitUntil(self.clients.claim());
});
