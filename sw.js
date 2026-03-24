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
  "/assets/img/mascottes/camelion.png",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
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
