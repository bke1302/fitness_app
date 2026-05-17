const CACHE = 'proFit-v14';
const ASSETS = [
  '/fitness_app/',
  '/fitness_app/index.html',
  '/fitness_app/manifest.json',
  '/fitness_app/sw.js',
  '/fitness_app/icons/icon-72.png',
  '/fitness_app/icons/icon-96.png',
  '/fitness_app/icons/icon-128.png',
  '/fitness_app/icons/icon-144.png',
  '/fitness_app/icons/icon-152.png',
  '/fitness_app/icons/icon-192.png',
  '/fitness_app/icons/icon-384.png',
  '/fitness_app/icons/icon-512.png'
];

// Install — cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache first, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/fitness_app/index.html'));
    })
  );
});
