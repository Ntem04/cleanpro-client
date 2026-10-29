const CACHE_NAME = "cleanpro-v2";
const STATIC_ASSETS = [
  "/icon.webp",
];

// 1. Installation du Service Worker
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // En cas d'échec sur une ressource optionnelle, continuer
      });
    })
  );
});

// 2. Activation et nettoyage des anciens caches (purge cleanpro-v1 et versions obsolètes)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Stratégie de mise en cache intelligente anti-FOUC (Flash of Unstyled/Wrong Content)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Uniquement pour les requêtes GET sur notre propre domaine
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Ne pas cacher les requêtes API dynamiques
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Requêtes de navigation HTML : Network-First pour éviter tout affichage de contenu obsolète
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // Pour les assets statiques (JS, CSS, images, polices) : Servir depuis le cache avec rafraîchissement
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
