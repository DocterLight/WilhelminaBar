const CACHE_NAME = 'wilhelmina-bar-cache-v1';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './statistics.html',
  './index.js',
  './admin.js',
  './statistics.js',
  './styles.css',
  './favicon.png',
  './manifest.json',
  'https://i0.wp.com/wilhelminaleens.nl/wp-content/uploads/2023/12/logo-Wilhelmina.png?fit=1920%2C976&ssl=1'
];

// Installeer en cache bestanden
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(error => {
        console.error('[ServiceWorker] Caching failed:', error);
      })
  );
  self.skipWaiting();
});

// Activeer en verwijder oude caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Vang fetch requests op
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        console.warn('[ServiceWorker] Fetch failed:', event.request.url);
      });
    })
  );
});
