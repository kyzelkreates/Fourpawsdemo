// AP3X AnxietyCore — Service Worker
// ─────────────────────────────────────────────────────────────────
// Extends bco-sw.js pattern for AP3X patient assets.
// Uses cache-first for static assets, network-first for API calls.
// Registered from patient-app.js via pwa.js.

const CACHE_NAME = "ap3x-cache-v1";

const CORE_ASSETS = [
  "/ap3x/patient-pwa/index.html",
  "/ap3x/patient-pwa/patient.css",
  "/ap3x/patient-pwa/patient-app.js",
  "/ap3x/patient-pwa/chart.js",
  "/ap3x/patient-pwa/manifest.json",
  "/icons/ap3x-icon-192.png",
  "/icons/ap3x-icon-512.png"
];

// ── Install ───────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[AP3X SW] Caching core assets.");
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
          .filter((k) => k !== CACHE_NAME && k.startsWith("ap3x-"))
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

  // Cache-first for AP3X assets
  if (url.pathname.startsWith("/ap3x/") || url.pathname.startsWith("/icons/")) {
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
    return new Response("Offline — AP3X AnxietyCore", { status: 503 });
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
  if (event.tag === "ap3x-sync-queue") {
    // Trigger sync flush via a BroadcastChannel message to the app
    const bc = new BroadcastChannel("ap3x-sync");
    bc.postMessage({ type: "FLUSH_QUEUE" });
    bc.close();
  }
});
