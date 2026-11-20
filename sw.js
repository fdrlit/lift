// Офлайн-кэш.
// Код и страница — сначала из сети (обновления видны сразу), без сети — из кэша.
// Фото, видео, шрифты, иконки — из кэша (они не меняются), при первом показе докачиваются.
const CACHE = 'lift-v3';
const SHELL = ['./', 'index.html', 'app.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'fonts/onest-cyr.woff2', 'fonts/onest-lat.woff2', 'fonts/archivo.woff2'];
const MEDIA = /\/(img|vid|fonts|icons)\//;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (e.request.headers.has('range')) return; // видео Safari просит кусками — отдаёт сеть/HTTP-кэш
  if (MEDIA.test(url.pathname)) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(e.request, {ignoreSearch: true});
      if (hit) return hit;
      const r = await fetch(e.request);
      if (r.ok && r.status === 200) c.put(e.request, r.clone());
      return r;
    }));
    return;
  }
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 4000); // плохая сеть в зале — не ждём дольше 4 с
      const r = await fetch(e.request, {signal: ctrl.signal, cache: 'no-cache'});
      clearTimeout(t);
      if (r.ok) c.put(e.request, r.clone());
      return r;
    } catch {
      return (await c.match(e.request, {ignoreSearch: true})) || (await c.match('./'));
    }
  })());
});
