const CACHE_NAME = 'mi-recuperacion-lumbar-v7-1-0-3';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/exercise-photos/diaphragmatic-breathing.jpg',
  '/exercise-photos/pelvic-tilt-core.jpg',
  '/exercise-photos/cat-camel.jpg',
  '/exercise-photos/glute-bridge.jpg',
  '/exercise-photos/bird-dog.jpg',
  '/exercise-photos/side-hip-abduction.jpg',
  '/exercise-photos/sit-to-stand.jpg',
  '/exercise-photos/hamstring-stretch.jpg',
  '/exercise-photos/glute-stretch.jpg',
  '/exercise-photos/walking.jpg',
  '/exercise-photos/stationary-bike.jpg',
  '/exercise-photos/bench-support.jpg',
  '/exercise-photos/light-weights-setup.jpg',
  '/exercise-photos/bench-knee-extension.jpg',
  '/exercise-photos/bench-heel-raise.jpg',
  '/exercise-photos/bench-standing-hip-abduction.jpg',
  '/exercise-photos/seated-dumbbell-curl.jpg',
  '/exercise-photos/seated-band-row.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('/offline.html')))
  );
});
