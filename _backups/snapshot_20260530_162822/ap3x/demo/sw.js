/* ═══════════════════════════════════════════════════════
   FOUR PAWS ACADEMY — Service Worker
   Cache-first for static assets, network-first for pages
════════════════════════════════════════════════════════ */
const CACHE = 'fp-v1';
const STATIC = [
  '/',
  '/owner',
  '/trainer',
  '/ap3x/demo/index.html',
  '/ap3x/demo/owner-demo.html',
  '/ap3x/demo/trainer-demo.html',
  '/ap3x/demo/manifest.json',
  '/ap3x/demo/sw.js',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);
  // Only handle same-origin requests
  if (url.origin !== location.origin) return;
  // Navigation: network-first, fallback to cache
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(request, c)); return r; })
        .catch(() => caches.match(request).then(r => r || caches.match('/')))
    );
    return;
  }
  // Static assets: cache-first
  e.respondWith(
    caches.match(request).then(r => r || fetch(request).then(nr => {
      const c = nr.clone();
      caches.open(CACHE).then(ca => ca.put(request, c));
      return nr;
    }))
  );
});
