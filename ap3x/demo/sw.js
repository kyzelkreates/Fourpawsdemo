/* Four Paws Training Academy — Owner Portal Service Worker v5 */
var CACHE = 'fp-owner-v5';
var ASSETS = [
  '/owner',
  '/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS).catch(function() {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  /* Block trainer route from PWA context entirely */
  var url = new URL(e.request.url);
  if (url.pathname === '/trainer' || url.pathname.startsWith('/trainer')) return;

  /* Network-first: always try to get fresh content, fall back to cache */
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then(function(res) {
      if (res && res.status === 200) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      }
      return res;
    }).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || caches.match('/owner');
      });
    })
  );
});
