const CACHE_NAME = 'lathe-tool-setup-v4';
const ASSETS = [
  './',
  './index.html',
  './blade.png',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // HTML はネット優先、それ以外はキャッシュ優先
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
  } else {
    event.respondWith(
      caches.match(req).then(res => res || fetch(req))
    );
  }
});