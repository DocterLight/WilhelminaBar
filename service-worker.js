const CACHE_NAME = 'wilhelmina-bar-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './index.js',
  './statistics.html',
  './styles.css',
  './statistics.js',
  './admin.js',
  './favicon.png',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installeer en cache bestanden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activeer en opruimen oude caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Intercepteer fetch-verzoeken en serve uit cache indien mogelijk
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
