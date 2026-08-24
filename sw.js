// ============================================================
//  SMART GRADE - SERVICE WORKER
//  Fichiers: 108
//  Date: 25/07/2026
// ============================================================

var CACHE_NAME = 'smartgrade-v5';
var STATIC_ASSETS = [
  './',
  './.github/ISSUE_TEMPLATE/bug_report.md',
  './.github/ISSUE_TEMPLATE/custom.md',
  './.github/ISSUE_TEMPLATE/feature_request.md',
  './400.html',
  './401.html',
  './403.html',
  './404.html',
  './500.html',
  './502.html',
  './503.html',
  './about-user.html',
  './about.html',
  './achievements.html',
  './add-grade.html',
  './ai-assistant.html',
  './backup.html',
  './CODE_OF_CONDUCT.md',
  './congfig.js',
  './CONTRIBUTING.md',
  './cookies.html',
  './css/ai-assistant.css',
  './css/base.css',
  './css/components.css',
  './css/layout.css',
  './css/night-mode.css',
  './css/themes.css',
  './dashboard.html',
  './dev-backup.html',
  './dev-calculator.html',
  './dev-config.html',
  './dev-database.html',
  './dev-stats.html',
  './doc.html',
  './eula.html',
  './export.html',
  './flashcards.html',
  './goals.html',
  './google6523d76523928963.html',
  './guide-user.html',
  './guide.html',
  './icons/avatar-boy.png',
  './icons/avatar-girl.png',
  './icons/favicon.ico',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/icon-achievements.png',
  './icons/icon-addgrade.png',
  './icons/icon-dashboard.png',
  './icons/icon-stats.png',
  './icons/icon.png',
  './icons/icon.svg',
  './images/banner.png',
  './images/dashboard.png',
  './images/header_bg.png',
  './images/home.png',
  './images/login.png',
  './images/register.png',
  './index.html',
  './js/ai-assistant-core.js',
  './js/ai-assistant-ui.js',
  './js/app.js',
  './js/auth.js',
  './js/auto-save.js',
  './js/auto-update.js',
  './js/auto-updater.js',
  './js/avatars-data.js',
  './js/confirm-dialog.js',
  './js/database.js',
  './js/export.js',
  './js/install-handler.js',
  './js/pwa.js',
  './js/storage.js',
  './js/transfer-local.js',
  './js/transfer-manager.js',
  './js/transfer.js',
  './js/utils.js',
  './js/widget-data.js',
  './license.html',
  './LICENSE.md',
  './login.html',
  './maintenance-config.js',
  './manifest.json',
  './notebook.html',
  './privacy.html',
  './profile.html',
  './README.md',
  './register.html',
  './robots.txt',
  './search.html',
  './SECURITY.md',
  './settings.html',
  './shortcuts.html',
  './sitemap.xml',
  './splash.html',
  './statistics.html',
  './subject-detail.html',
  './subjects.html',
  './support.html',
  './term1.html',
  './term2.html',
  './term3.html',
  './terms.html',
  './timetable.html',
  './transfer.html',
  './version.json',
  './welcome.html',
  './yearly.html'
];

// ============================================================
//  INSTALLATION
// ============================================================

self.addEventListener('install', function(e) {
  console.log('[SW] Installing...');
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Caching', STATIC_ASSETS.length, 'files');
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

// ============================================================
//  ACTIVATION
// ============================================================

self.addEventListener('activate', function(e) {
  console.log('[SW] Activating...');
  e.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(
          keys.map(function(key) {
            if (key !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
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

// ============================================================
//  FETCH INTERCEPTION
// ============================================================

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  
  if (url.pathname === '/sw.js') {
    e.respondWith(fetch(e.request));
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
      e.respondWith(
        fetch(e.request)
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
  
  e.respondWith(
    caches.match(e.request)
      .then(function(cached) {
        var fetchP = fetch(e.request)
          .then(function(res) {
            if (res && res.status === 200) {
              var clone = res.clone();
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(e.request, clone);
                });
            }
            return res;
          })
          .catch(function() {
            return cached;
          });
        
        if (cached) {
          return cached;
        }
        
        return fetchP;
      })
  );
});

// ============================================================
//  MESSAGES
// ============================================================

self.addEventListener('message', function(e) {
  if (e.data === 'updateSW') {
    console.log('[SW] Update triggered');
    self.skipWaiting();
  }
});

// ============================================================
//  PERIODIC UPDATE
// ============================================================

setInterval(function() {
  self.skipWaiting();
}, 30000);

console.log('[SW] Service Worker loaded - ' + STATIC_ASSETS.length + ' files');
