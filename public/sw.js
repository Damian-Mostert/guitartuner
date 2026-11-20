// public/sw.js

const CACHE_NAME = 'nextjs-offline-cache-v1';
const URLS_TO_CACHE = [
	'/',
	'/logo.webp',
	'/icons/12-string.webp',
	'/icons/7-string.webp',
	'/icons/banjo.webp',
	'/icons/baritone-ukulele.webp',
	'/icons/bass.webp',
	'/icons/cello.webp',
	'/icons/double-bass.webp',
	'/icons/electric.webp',
	'/icons/guitar.webp',
	'/icons/ukulele.webp',
	'/icons/viola.webp',
	'/icons/violin.webp',
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
	const url = new URL(event.request.url);
	if ((url.pathname === "/_next/static/version.json")||(url.pathname === "/version.json")) {
    	return;
	}
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
