// public/sw.js

const CACHE_NAME = 'nextjs-offline-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/logo.png',
  '/icons/12-string.png',
  '/icons/7-string.png',
  '/icons/bass.png',
  '/icons/double-bass.png',
  '/icons/electric.png',
  '/icons/guitar.png',
  '/icons/ukulele.png',
  '/icons/violin.png',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch(() => {
            // Optional fallback
          })
      );
    })
  );
});

// Receive extra URLs to cache from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(event.data.payload).catch((err) =>
        console.warn('[SW] Failed to cache some URLs:', err)
      );
    });
  }
});
