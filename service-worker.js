const CACHE_NAME = 'wilhelmina-stats-cache-v1';
const urlsToCache = [
  '/',
  '/statistics.html',
  '/styles.css',
  '/statistics.js',
  '/index.js',
  '/index.html',
  '/admin.js',
  '/admin.html',
  '/favicon.png'
];

// Install event - caches files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
