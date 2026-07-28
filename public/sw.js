const CACHE_NAME = "cesizen-v5";

const OFFLINE_PAGE_URL = new URL("/offline.html", self.location).href;

const STATIC_ASSETS = [
  "/img/logo-small-bg-none-192px.png",
  "/img/logo-small-bg-white-192px.png",
  "/img/logo-full-bg-white-1000px.png",
  OFFLINE_PAGE_URL,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          STATIC_ASSETS.map((url) =>
            cache.add(url).catch((err) =>
              console.warn(`[SW] Impossible de précacher ${url} :`, err)
            )
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et les API
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // Stratégie "Stale-While-Revalidate" pour les assets statiques _next/static
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Stratégie "Network First" pour les pages de navigation
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          return caches.match(OFFLINE_PAGE_URL).then((offline) => {
            if (offline) return offline;
            return new Response(
              "<!DOCTYPE html><html lang=fr><meta charset=utf-8><title>Hors connexion</title><p>Vous êtes hors ligne.</p></html>",
              { headers: { "Content-Type": "text/html; charset=utf-8" } }
            );
          });
        })
      )
    );
    return;
  }

  // Stratégie "Cache First" pour images et autres assets
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
  }
});
