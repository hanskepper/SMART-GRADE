// ============================================================
//  SMART GRADE - DYNAMIC SERVICE WORKER
//  Offline: uses cache | Online: updates cache automatically
//  No manual file list needed - GitHub API fetches everything
//  Cache refresh every 1 minute
// ============================================================

var CACHE_NAME = 'smartgrade-cache-v2';
var GITHUB_USER = 'hanskepper';
var GITHUB_REPO = 'SMART-GRADE';
var GITHUB_API_URL = 'https://api.github.com/repos/' + GITHUB_USER + '/' + GITHUB_REPO + '/contents';
var GITHUB_RAW_URL = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + GITHUB_REPO + '/main';

var ALLOWED_EXTENSIONS = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.json', '.webp', '.txt', '.xml', '.md'];
var EXCLUDED_FILES = ['sw.js', 'maintenance.html'];

// ============================================================
//  FETCH ALL FILES FROM GITHUB RECURSIVELY
// ============================================================

async function fetchAllFilesFromGitHub(path) {
  path = path || '';
  var url = path ? GITHUB_API_URL + '/' + path : GITHUB_API_URL;

  try {
    var response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error('[SW] GitHub API error:', response.status);
      return [];
    }

    var items = await response.json();
    var files = [];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (item.type === 'dir') {
        var subFiles = await fetchAllFilesFromGitHub(item.path);
        files = files.concat(subFiles);
      } else if (item.type === 'file') {
        var ext = item.name.substring(item.name.lastIndexOf('.'));
        var isAllowed = false;

        for (var j = 0; j < ALLOWED_EXTENSIONS.length; j++) {
          if (ext === ALLOWED_EXTENSIONS[j]) {
            isAllowed = true;
            break;
          }
        }

        var isExcluded = false;
        for (var k = 0; k < EXCLUDED_FILES.length; k++) {
          if (item.name === EXCLUDED_FILES[k]) {
            isExcluded = true;
            break;
          }
        }

        if (isAllowed && !isExcluded) {
          files.push({
            path: item.path,
            name: item.name,
            url: GITHUB_RAW_URL + '/' + item.path
          });
        }
      }
    }

    return files;
  } catch(error) {
    console.error('[SW] Error fetching files:', error);
    return [];
  }
}

// ============================================================
//  GENERATE CACHE ASSETS LIST
// ============================================================

function generateCacheAssets(files) {
  var assets = ['./'];

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var relativePath = './' + file.path;
    assets.push(relativePath);
  }

  return assets;
}

// ============================================================
//  INSTALLATION - Fetch and cache all files
// ============================================================

self.addEventListener('install', function(event) {
  console.log('[SW] Installing...');

  event.waitUntil(
    fetchAllFilesFromGitHub()
      .then(function(files) {
        console.log('[SW] Found', files.length, 'files to cache');
        var assets = generateCacheAssets(files);
        console.log('[SW] Caching', assets.length, 'assets');

        return caches.open(CACHE_NAME)
          .then(function(cache) {
            var cachePromises = assets.map(function(asset) {
              return cache.add(asset)
                .then(function() {
                  console.log('[SW] Cached:', asset);
                })
                .catch(function(error) {
                  console.warn('[SW] Failed to cache:', asset);
                });
            });

            return Promise.all(cachePromises);
          });
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
//  ACTIVATION - Clean old caches
// ============================================================

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

// ============================================================
//  FETCH INTERCEPTION - Cache with Network Update
// ============================================================

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  // Skip SW itself
  if (url.pathname === '/sw.js') {
    event.respondWith(fetch(request));
    return;
  }

  // Skip GitHub API calls
  if (url.hostname === 'api.github.com') {
    event.respondWith(fetch(request));
    return;
  }

  // External APIs - Network first
  var apiDomains = [
    'api.groq.com',
    'api.mistral.ai',
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

  // All other files - Cache First with Network Update
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
});

// ============================================================
//  MESSAGE HANDLER - Force cache refresh
// ============================================================

self.addEventListener('message', function(event) {
  if (event.data === 'updateSW') {
    console.log('[SW] Update triggered');
    self.skipWaiting();
  }

  if (event.data === 'refreshCache') {
    console.log('[SW] Refreshing cache from GitHub...');
    event.waitUntil(
      fetchAllFilesFromGitHub()
        .then(function(files) {
          var assets = generateCacheAssets(files);
          return caches.open(CACHE_NAME)
            .then(function(cache) {
              var cachePromises = assets.map(function(asset) {
                return cache.add(asset)
                  .catch(function() {
                    // Silent fail for individual files
                  });
              });
              return Promise.all(cachePromises);
            });
        })
        .then(function() {
          console.log('[SW] Cache refreshed');
        })
    );
  }
});

// ============================================================
//  PERIODIC UPDATE CHECK - Every 30 seconds
// ============================================================

setInterval(function() {
  console.log('[SW] Checking for updates...');
  self.skipWaiting();
}, 30000);

console.log('[SW] Dynamic Service Worker loaded');
console.log('[SW] Fetching files from GitHub API');
console.log('[SW] Cache update every 30 seconds');
