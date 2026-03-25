const CACHE_NAME = "six-huit-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/model/AppModel.js",
  "/src/view/AppView.js",
  "/src/controller/AppController.js",
  "/src/view/header.html",
  "/src/view/footer.html",
  "/assets/css/style.css",
  "/assets/img/icons/home.png",
  "/assets/img/icons/podium.png",
  "/assets/img/icons/music.png",
  "/assets/img/icons/menu.png",
  "/assets/img/icons/app-icon-86.png",
  "/assets/img/mascottes/camelion.png",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
