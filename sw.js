/* Service worker : met l'app en cache pour qu'elle s'ouvre comme une
   application installée, même sans connexion après le premier lancement. */
const CACHE = 'mensu-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest',
               './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });

async function cacheFirst(req){
  const cached = await caches.match(req, { ignoreSearch: true });
  if (cached) return cached;
  const res = await fetch(req);
  try { const c = await caches.open(CACHE); c.put(req, res.clone()); } catch(_) {}
  return res;
}
async function staleWhileRevalidate(req){
  const cached = await caches.match(req);
  const refresh = fetch(req).then(async res => {
    try { const c = await caches.open(CACHE); c.put(req, res.clone()); } catch(_) {}
    return res;
  }).catch(() => cached);
  return cached || refresh;
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  let u; try { u = new URL(e.request.url); } catch(_) { return; }
  if (u.origin === location.origin) {
    // fichiers de l'app : cache d'abord, avec repli hors-ligne sur l'accueil
    e.respondWith(
      cacheFirst(e.request).catch(() =>
        caches.match('./index.html').then(r => r || Response.error()))
    );
  } else if (u.hostname.endsWith('jsdelivr.net') || u.hostname.endsWith('storage.googleapis.com')) {
    // IA (bibliothèque + modèle) : garder en cache après le 1er chargement
    e.respondWith(staleWhileRevalidate(e.request).catch(() => fetch(e.request)));
  }
});
