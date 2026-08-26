const CACHE = 'ateshane-v20';
const ASSETS = [
  './', './index.html', './styles.css', './game.js', './audio.js',
  './vendor-anime.min.js', './vendor-zzfx.js', './manifest.webmanifest',
  './assets/logo.png', './assets/audio/ta3fita.mp3', './assets/audio/3otchana.mp3',
  './assets/audio/rolling_bass.mp3', './assets/audio/radio.mp3', './assets/audio/pant.mp3',
  './assets/img/sun_angry.png', './assets/img/whip.png',
  './assets/gold/delice.png', './assets/gold/hayat.png', './assets/gold/marwa.png',
  './assets/gold/mira.png', './assets/gold/palma.png', './assets/gold/sabrine.png',
  './assets/gold/tijen.png',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
  './assets/delice.png', './assets/hayat.png', './assets/marwa.png', './assets/mira.png',
  './assets/palma.png', './assets/sabrine.png', './assets/tijen.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// HTML: network-first, so every deploy shows up on the next load (cache = offline fallback).
// Everything else: cache-first for speed; the versioned cache name invalidates on deploy.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // The leaderboard is live data, not an asset. Never cache it and never serve
  // it from cache: storing one failed response freezes the world board on that
  // failure permanently, even after the backend is fixed. Straight to network.
  let url;
  try { url = new URL(e.request.url); } catch (err) { return; }
  if (url.pathname.startsWith('/api/')) return;
  if (url.origin !== self.location.origin) return;

  const isNav = e.request.mode === 'navigate' ||
    (e.request.headers.get('accept') || '').includes('text/html');
  if (isNav) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      // Only cache real successes. A 404 or a 500 stored here would be served
      // for the entire life of this cache version.
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(e.request)))
  );
});
