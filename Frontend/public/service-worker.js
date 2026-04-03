const CACHE_NAME = "app-cache-v8";

const urlsToCache = [
  "/",
  "/index.html",
];

/* ================= INSTALL ================= */
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

/* ================= ACTIVATE ================= */
self.addEventListener("activate", (event) => {
  self.clients.claim();

  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

/* ================= FETCH ================= */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  /* 🔥 ALL API CACHE (IMPORTANT FIX) */
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });

          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);

          // ✅ try exact match
          const cached = await cache.match(request);
          if (cached) return cached;

          // 🔥 fallback for product/:id → return product list
          if (request.url.includes("/api/product/")) {
            const keys = await cache.keys();

            const productListRequest = keys.find((req) =>
              req.url.includes("/api/product")
            );

            if (productListRequest) {
              return cache.match(productListRequest);
            }
          }

          // fallback empty response
          return new Response(JSON.stringify({}), {
            headers: { "Content-Type": "application/json" },
          });
        })
    );
    return;
  }

  /* 🧠 REACT ROUTES */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put("/index.html", copy);
          });

          return res;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  /* JS / CSS */
  if (
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });

          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* IMAGES */
  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy);
            });

            return res;
          })
        );
      })
    );
  }
});