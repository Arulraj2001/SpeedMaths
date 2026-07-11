const CACHE_NAME = "speedmaths-cache-v2";
const ASSETS = [
  "/",
  "/manifest.json",
  "/offline.html",
  "/learn/tables",
  "/learn/squares",
  "/learn/cubes",
  "/learn/powers",
  "/learn/fractions",
  "/learn/number-types",
  "/practice",
  "/analytics",
  "/squares",
  "/cubes",
  "/fractions",
  "/powers",
  "/types-of-numbers",
  "/tables"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  // Intercept main navigation page loads and fallback to offline.html if offline
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.match("/offline.html").then((fallback) => {
          return fallback || new Response("Offline connection fallback.");
        });
      })
    );
    return;
  }

  // Intercept standard static sub-assets
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Silent offline catch
        });
    })
  );
});
