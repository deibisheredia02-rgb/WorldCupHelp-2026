/* ═══════════════════════════════════════════════════════════════════════════
   Service Worker — WorldCupHelp 2026
   ─────────────────────────────────────────────────────────────────────────
   Estrategia:
   - Shell estático (HTML, JS, JSONs de data) → cache-first con revalidación
   - APIs (/api/*) → network-only, NO cachear
   - Imágenes → cache-first
   ═══════════════════════════════════════════════════════════════════════════ */

const VERSION = 'wch-v1.0.1';
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const PRECACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/data/cities.json',
  '/data/topics.json',
  '/data/emergency.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
        .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar same-origin GET
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // APIs: nunca cachear
  if (url.pathname.startsWith('/api/')) return;

  // SPA fallback para navegación: index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Otros: stale-while-revalidate
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(resp => {
        if (resp.ok) {
          const respClone = resp.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, respClone));
        }
        return resp;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
