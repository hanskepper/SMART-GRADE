// ============================================
// SMART GRADE v5.0.0 - PWA CONFIGURATION
// Silent mode: no toasts, no popups, console only
// ============================================

var PWA_CONFIG = {
  appName: 'SMART GRADE',
  version: '5.0.0',
  codename: 'Ultimate',
  author: 'HANS KEEPER',
  contact: 'hanskepper52@gmail.com',
  phone: '+237 698 640 885',
  school: 'SIN GBHS FOUMBAN',
  class: 'Form 5B Science',
  year: '2026-2027',
  storagePrefix: 'smartgrade_',
  cacheName: 'smartgrade-v5-0-0',
  transferCodeExpiry: 5, // minutes
  maxFavorites: 6,
  defaultGoal: 12,
  maxSubjects: 14,
  minSubjects: 10,
  maxGrade: 20,
  minGrade: 0,
  // v5.0.0 features
  fonts: 12,
  themes: 20,
  achievementCount: 14,
  streakCount: 4,
  searchSources: 15,
  aiModels: 3,
  devTools: 6,
  exportFormats: 4
};

// ============================================
// BUILD APK - Generates an install guide text file
// ============================================
function buildAPK() {
  var s = getCurrentStudent ? getCurrentStudent() : null;
  var d = [
    '========================================',
    '  SMART GRADE v' + PWA_CONFIG.version + ' - INSTALLATION GUIDE',
    '  ' + PWA_CONFIG.codename,
    '========================================',
    '',
    'School: ' + PWA_CONFIG.school,
    'Class: ' + PWA_CONFIG.class,
    'Year: ' + PWA_CONFIG.year,
    '',
    '--- STATISTICS ---',
    'Themes: ' + PWA_CONFIG.themes,
    'Fonts: ' + PWA_CONFIG.fonts,
    'Achievements: ' + PWA_CONFIG.achievementCount,
    'Streak Badges: ' + PWA_CONFIG.streakCount,
    'Search Sources: ' + PWA_CONFIG.searchSources,
    'AI Models: ' + PWA_CONFIG.aiModels,
    'Developer Tools: ' + PWA_CONFIG.devTools,
    'Export Formats: ' + PWA_CONFIG.exportFormats,
    '',
    '--- DEVELOPER ---',
    'Name: ' + PWA_CONFIG.author,
    'Email: ' + PWA_CONFIG.contact,
    'Phone: ' + PWA_CONFIG.phone,
    '',
    '--- ANDROID INSTALLATION ---',
    '1. Open Chrome browser',
    '2. Go to your SMART GRADE URL',
    '3. Tap Menu (3 dots) > "Add to Home Screen"',
    '4. OR tap "Install App" button if visible',
    '',
    '--- BUILD APK (Alternative) ---',
    '1. Go to pwabuilder.com',
    '2. Enter your SMART GRADE URL',
    '3. Download the APK file',
    '4. Install on any Android device',
    '',
    '--- iOS INSTALLATION ---',
    '1. Open Safari browser',
    '2. Go to your SMART GRADE URL',
    '3. Tap Share > "Add to Home Screen"',
    '',
    '--- OFFLINE MODE ---',
    'The app works 100% offline after first load.',
    'All data is stored locally on your device.',
    '',
    '--- v5.0.0 NEW FEATURES ---',
    '- AI Assistant (Groq + Mistral)',
    '- Multi-Search (15 sources)',
    '- P2P Chat with unique codes',
    '- Homework Manager with file attachments',
    '- Personal Notebook with colors and pins',
    '- 6 Developer Tools',
    '- Cloud Sync (JSONBin.io)',
    '- Auto-Save every 30 seconds',
    '- Auto-Update from GitHub',
    '- Infinite Streak Badges',
    '- 23 Badges total',
    '- Compensation System for averages',
    '',
    '========================================'
  ].join('\n');
  
  var b = new Blob([d], { type: 'text/plain' });
  var u = URL.createObjectURL(b);
  var a = document.createElement('a');
  a.href = u;
  a.download = 'SMART_GRADE_v' + PWA_CONFIG.version + '_Install_Guide.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(u);
  console.log('[PWA] Install guide downloaded');
}

// ============================================
// INIT - Register service worker (silent)
// ============================================
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        console.log('[PWA] Service worker registered:', reg.scope);
      })
      .catch(function(err) {
        console.log('[PWA] Service worker registration failed:', err);
      });
  }

  // Check if already installed as standalone app
  if (window.matchMedia('(display-mode: standalone)').matches) {
    var p = document.getElementById('installPrompt');
    if (p) p.style.display = 'none';
    localStorage.setItem('smartgrade_installed', 'true');
  }
}

// ============================================
// UPDATE CHECK - Silent background check
// ============================================
function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.update();
      console.log('[PWA] Update check completed');
    });
  }
}

// ============================================
// UPDATE PROMPT - Confirms with user, then applies
// ============================================
function askForUpdate() {
  if (confirm('A new version of SMART GRADE is available. Update now?')) {
    checkForUpdates();
    console.log('[PWA] Update applied, reloading');
    setTimeout(function() {
      location.reload();
    }, 1000);
  }
}

// ============================================
// CONNECTIVITY HELPERS
// ============================================
function isOnline() {
  return navigator.onLine;
}

function isOffline() {
  return !navigator.onLine;
}

// ============================================
// CONNECTIVITY EVENTS - Silent (console only)
// ============================================
window.addEventListener('online', function() {
  console.log('[PWA] Connection restored');
});

window.addEventListener('offline', function() {
  console.log('[PWA] Connection lost, offline mode active');
});

// ============================================
// GLOBAL EXPORTS
// ============================================
window.buildAPK = buildAPK;
window.initPWA = initPWA;
window.checkForUpdates = checkForUpdates;
window.askForUpdate = askForUpdate;
window.isOnline = isOnline;
window.isOffline = isOffline;

// ============================================
// AUTO-INIT
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWA);
} else {
  initPWA();
}

console.log('[PWA] Module loaded - SMART GRADE v' + PWA_CONFIG.version);