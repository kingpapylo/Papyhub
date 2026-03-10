const CACHE_NAME = 'ope-opa-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/index.tsx',
  '/logo.png',
  '/utils.ts',
  '/visual-3d.ts',
  '/visual.ts',
  '/sphere-shader.ts',
  '/backdrop-shader.ts',
  '/analyser.ts'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
