const CACHE = 'protocolos-v22';

// Install — cache app shell only; Vite-hashed assets cached dynamically on fetch
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(['/fitness_app/', '/fitness_app/index.html']))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches + notify clients of update
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => {
      self.clients.claim();
      return self.clients.matchAll({type:'window'}).then(clients => {
        clients.forEach(client => client.postMessage({type:'SW_UPDATED',version:CACHE}));
      });
    })
  );
});

// Fetch — network-first for the app shell (always fresh code, cache fallback offline);
// cache-first only for static assets (icons, fonts)
const SHELL = /\/(index\.html)?(\?.*)?$|\.js$|\.css$/;
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return;

  if(e.request.mode === 'navigate' || SHELL.test(url.pathname)){
    e.respondWith(
      fetch(e.request).then(res => {
        if(res && res.status === 200 && res.type === 'basic'){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('/fitness_app/index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        if(!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/fitness_app/index.html'));
    })
  );
});
