// BorlaAlert GH - Progressive Web App Service Worker
const CACHE_NAME = 'borlaalert-gh-v1.2.0';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './shared-pwa.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/icon.svg',
  './packages/brand-assets/logo.svg',
  // Resident App
  './apps/resident/index.html',
  './apps/resident/onboarding.html',
  './apps/resident/login.html',
  './apps/resident/login_standard.html',
  './apps/resident/registration.html',
  './apps/resident/otp.html',
  './apps/resident/home.html',
  './apps/resident/waste_selection.html',
  './apps/resident/pick_up.html',
  './apps/resident/tracking.html',
  './apps/resident/rating.html',
  './apps/resident/account.html',
  // Collector App
  './apps/collector/index.html',
  './apps/collector/login.html',
  './apps/collector/registration_collector.html',
  './apps/collector/verification.html',
  './apps/collector/verification_review.html',
  './apps/collector/home.html',
  './apps/collector/navigation.html',
  './apps/collector/arrived.html',
  './apps/collector/gate_checklist.html',
  './apps/collector/trip_manifest.html',
  './apps/collector/account.html',
  // Admin App
  './apps/admin/index.html',
  './apps/admin/admin.html'
];

// Install: Cache essential assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline shell');
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[ServiceWorker] Some assets failed to precache:', err);
      });
    })
  );
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Purging stale cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy - Stale While Revalidate for local assets, Network First for external fonts/scripts
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Stale-While-Revalidate for local assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // If valid response, update cache
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          // Network failed, if no cached response, provide fallback
          if (!cachedResponse && event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return null;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification listener
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {
    title: 'BorlaAlert GH',
    body: 'Tricycle collector is 2 minutes away from your gate!',
    icon: './icons/icon-192.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: './apps/resident/tracking.html' }
    })
  );
});

// Notification click listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || './index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
