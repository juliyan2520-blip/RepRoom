// Rep Room offline cache. Bumped automatically by build_app.py.
const CACHE = "reproom-f2e3232ccb";
const SHELL = ["./", "index.html", "manifest.webmanifest", "data/deck.json", "data/intros.json", "data/reads.json", "data/inbox.json", "icons/icon-192.png", "data/img/bloomer.png", "data/img/chad.png", "data/img/crying.png", "data/img/editor.png", "data/img/thinking.png", "data/img/zoomer.png", "data/img/zoomer_confused.png", "data/img/zoomer_happy.png", "data/img/zoomer_shocked.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) { // fonts: cache as they're used
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }).catch(() => hit)));
    return;
  }
  // app files: network first so updates show up, cache when offline
  e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req).then(hit => hit || caches.match("index.html"))));
});
