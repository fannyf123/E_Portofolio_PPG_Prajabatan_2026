/* Naikkan nomor ini setiap kali isi situs berubah. Handler 'activate'
   di bawah menghapus seluruh cache yang namanya tidak cocok, sehingga
   pengunjung lama tidak tertinggal pada versi usang. */
const CACHE_NAME = 'eportfolio-v5-seminar-hotspots';
// Hanya file yang benar-benar ada di dist/ yang boleh masuk pre-cache.
// Asset ber-hash (logo, css, js) TIDAK boleh didaftarkan statis: nama
// filenya berubah tiap build (Vite hash), sehingga cache.addAll gagal
// 404 dan shell offline tidak pernah lengkap. File ber-hash di-cache
// secara otomatis oleh handler fetch (stale-while-revalidate).
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[Service Worker] Pre-cache failed for some assets, continuing...:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate for app assets, Network-Only for Google Drive
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass caching for Google Drive, docs, or other external document URLs
  if (
    url.hostname.includes('drive.google.com') ||
    url.hostname.includes('docs.google.com') ||
    url.pathname.includes('/preview') ||
    event.request.method !== 'GET'
  ) {
    return; // Let browser handle it directly via network
  }

  // Dokumen HTML selalu diambil dari jaringan lebih dulu. Tanpa ini,
  // strategi stale-while-revalidate di bawah menyajikan halaman lama pada
  // muat pertama — pengunjung baru melihat versi terbaru setelah memuat
  // ulang untuk kedua kalinya. Untuk portofolio yang isinya bertambah
  // bertahap, itu berarti penilai bisa membaca versi usang.
  // Cache tetap dipakai sebagai cadangan bila jaringan gagal.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache if network response is valid and from our origin or CDNs
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || url.hostname.includes('cdnjs.cloudflare.com') || url.hostname.includes('fonts.googleapis.com'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network fail - return cached response if exists
      });

      return cachedResponse || fetchPromise;
    })
  );
});
