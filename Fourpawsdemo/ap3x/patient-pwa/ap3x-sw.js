// FourPaws AnxietyCore — Service Worker
// ─────────────────────────────────────────────────────────────────
// Extends bco-sw.js pattern for FourPaws patient assets.
// Uses cache-first for static assets, network-first for API calls.
// Registered from patient-app.js via pwa.js.

const CACHE_NAME = "fourpaws-cache-v1";

const CORE_ASSETS = [
  "/fourpaws/patient-pwa/index.html",
  "/fourpaws/patient-pwa/patient.css",
  "/fourpaws/patient-pwa/patient-app.js",
  "/fourpaws/patient-pwa/chart.js",
  "/fourpaws/patient-pwa/manifest.json",
  "/icons/fourpaws-icon-192.png",
  "/icons/fourpaws-icon-512.png"
];

// ── Install ───────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[FourPaws SW] Caching core assets.");
      // addAll with individual catch to avoid failing on missing icons
      return Promise.allSettled(
        CORE_ASSETS.map((url) =>
          fetch(url).then((res) => {
            if (res.ok) cache.put(url, res);
          }).catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k.startsWith("fourpaws-"))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch strategy ────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for Supabase / API calls
  if (
    url.hostname.includes("supabase.co") ||
    url.pathname.startsWith("/api/")
  ) {
    event.respondWith(_networkFirst(request));
    return;
  }

  // Cache-first for FourPaws assets
  if (url.pathname.startsWith("/fourpaws/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(_cacheFirst(request));
    return;
  }

  // Fall through to BCO SW for everything else
});

async function _cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return new Response("Offline — FourPaws AnxietyCore", { status: 503 });
  }
}

async function _networkFirst(request) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ offline: true }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// ── Background sync (future extension point) ─────────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === "fourpaws-sync-queue") {
    // Trigger sync flush via a BroadcastChannel message to the app
    const bc = new BroadcastChannel("fourpaws-sync");
    bc.postMessage({ type: "FLUSH_QUEUE" });
    bc.close();
  }
});
