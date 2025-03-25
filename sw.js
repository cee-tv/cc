// Service Worker for Türk TV
const CACHE_NAME = 'turk-tv-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style/main.css',
  '/script/app.js'
];

// Install event - Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Serve from cache, then network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests and streaming media resources
  if (event.request.url.includes('mpd') || 
      event.request.url.includes('dash') || 
      event.request.url.includes('cloudfront.net') ||
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
