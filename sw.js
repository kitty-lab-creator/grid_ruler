// Service Worker for 方格紙量尺
const CACHE_NAME = 'ruler-grid-v2.4.2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './assets/donate/paypal.jpg',
  './assets/donate/paypal.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : null);
        });
      })
  );
});
