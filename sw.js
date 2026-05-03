// Service worker for Madère 2026
// Strategy:
//   - App shell (HTML/JS/CSS/manifest/icon): cache-first, network update in background
//   - Leaflet & fonts (CDN): cache-first
//   - OSM tiles & weather API: stale-while-revalidate
//   - Everything else: network with cache fallback

const VERSION = 'mad26-v8';
const APP_CACHE = `${VERSION}-app`;
const RUNTIME = `${VERSION}-runtime`;

const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './assets/icon.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,800;0,9..144,900;1,9..144,400;1,9..144,600&family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_SHELL.map(u => new Request(u, { credentials: 'omit' }))))
      .catch(() => {})
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isTile(url) {
  return /tile\.openstreetmap\.org/.test(url);
}
function isWeather(url) {
  return /api\.open-meteo\.com/.test(url);
}
function isFontFile(url) {
  return /fonts\.gstatic\.com/.test(url);
}

function isAppShell(url) {
  // The HTML, JS, manifest and icon — anything we want to ship updates for
  // immediately when the user is online.
  return /\/(index\.html|app\.js|manifest\.json)(\?.*)?$/.test(url) ||
         /\/$/.test(url) ||
         /\/assets\//.test(url) ||
         /unpkg\.com\/leaflet/.test(url);
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  // Stale-while-revalidate for tiles, weather, fonts (large/slow, OK to be a bit stale)
  if (isTile(url) || isWeather(url) || isFontFile(url)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // App shell: network-first, fall back to cache when offline.
  // This is the key change — previously cache-first, which meant users could
  // be stuck on stale code for days. Network-first ships updates immediately
  // when online; offline still works (cache fallback).
  if (isAppShell(url)) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
            const copy = res.clone();
            caches.open(APP_CACHE).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // Everything else: cache-first with background refresh
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        fetch(req).then(res => {
          if (res && res.status === 200) {
            caches.open(RUNTIME).then(c => c.put(req, res.clone())).catch(() => {});
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then(res => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(RUNTIME).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

function staleWhileRevalidate(req) {
  return caches.open(RUNTIME).then(cache =>
    cache.match(req).then(cached => {
      const fetchPromise = fetch(req).then(res => {
        if (res && res.status === 200) cache.put(req, res.clone()).catch(() => {});
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
}
