const CACHE_NAME = 'spatioai-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/team.html',
  '/thank-you.html',
  '/styles.css',
  '/scripts.js',
  'my-favicon/favicon.svg',
  'images/spatioai.webp',
  '/my-favicon/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  ); // Added missing parenthesis
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  ); // Added missing parenthesis
});