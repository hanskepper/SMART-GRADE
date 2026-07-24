// ============================================================
//  SMART GRADE - INTELLIGENT SERVICE WORKER
//  Auto-update on every change - No version.json needed
// ============================================================

var CACHE_NAME = 'smartgrade-cache-v1';
var STATIC_ASSETS = [
  './',
  './index.html',
  './dashboard.html',
  './login.html',
  './register.html',
  './add-grade.html',
  './statistics.html',
  './achievements.html',
  './flashcards.html',
  './goals.html',
  './timetable.html',
  './profile.html',
  './settings.html',
  './welcome.html',
  './splash.html',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/themes.css',
  './css/night-mode.css',
  './css/ai-assistant.css',
  './js/utils.js',
  './js/database.js',
  './js/auth.js',
  './js/app.js',
  './js/confirm-dialog.js',
  './js/install-handler.js',
  './js/pwa.js',
  './js/transfer.js',
  './js/auto-save.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/icon.png',
  './icons/icon.svg',
  './icons/avatar-boy.png',
  './icons/avatar-girl.png',
  './manifest.json',
  './congfig.js'
];

self.addEventListener('install', function(event) {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Caching files');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(function() {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('[SW] Installation error:', error);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function() {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);
  
  if (url.pathname === '/sw.js') {
    event.respondWith(fetch(request));
    return;
  }
  
  var apiDomains = [
    'api.groq.com',
    'api.mistral.ai',
    'api.github.com',
    'api.jsonbin.io',
    'fonts.googleapis.com',
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net',
    'unpkg.com'
  ];
  
  for (var i = 0; i < apiDomains.length; i++) {
    if (url.hostname === apiDomains[i] || url.hostname.endsWith('.' + apiDomains[i])) {
      event.respondWith(
        fetch(request)
          .catch(function() {
            return new Response(
              JSON.stringify({ error: 'Offline', offline: true }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          })
      );
      return;
    }
  }
  
  var staticExtensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.json', '.webp', '.txt', '.xml', '.md'];
  var isStatic = false;
  
  for (var j = 0; j < staticExtensions.length; j++) {
    if (url.pathname.endsWith(staticExtensions[j])) {
      isStatic = true;
      break;
    }
  }
  
  if (url.pathname === '/manifest.json' || url.pathname === '/congfig.js') {
    isStatic = true;
  }
  
  if (isStatic) {
    event.respondWith(
      caches.match(request)
        .then(function(cachedResponse) {
          var fetchPromise = fetch(request)
            .then(function(networkResponse) {
              if (networkResponse && networkResponse.status === 200) {
                var clone = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(request, clone);
                  });
              }
              return networkResponse;
            })
            .catch(function() {
              return cachedResponse;
            });
          
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetchPromise;
        })
    );
    return;
  }
  
  event.respondWith(
    fetch(request)
      .then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(request, clone);
            });
        }
        return response;
      })
      .catch(function() {
        return caches.match(request);
      })
  );
});

self.addEventListener('message', function(event) {
  if (event.data === 'updateSW') {
    console.log('[SW] Update triggered');
    self.skipWaiting();
  }
});

setInterval(function() {
  console.log('[SW] Checking for updates...');
  self.skipWaiting();
}, 30000);

console.log('[SW] Intelligent Service Worker loaded');
console.log('[SW] Auto-update every 30 seconds');
