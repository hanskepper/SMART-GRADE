// ============================================
// SMART GRADE v5.0 - APP.JS COMPLET
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================

var THEMES = [
  { name: 'default', color: '#0f3b48', label: 'Deep Teal' },
  { name: 'crimson', color: '#c0392b', label: 'Crimson' },
  { name: 'forest', color: '#1e8449', label: 'Forest' },
  { name: 'ocean', color: '#006994', label: 'Ocean' },
  { name: 'royal', color: '#6c3483', label: 'Royal' },
  { name: 'sunset', color: '#d35400', label: 'Sunset' },
  { name: 'rose', color: '#c44569', label: 'Rose' },
  { name: 'turquoise', color: '#00897b', label: 'Turquoise' },
  { name: 'amber', color: '#b7950b', label: 'Amber' },
  { name: 'graphite', color: '#455a64', label: 'Graphite' },
  { name: 'lavender', color: '#7b1fa2', label: 'Lavender' },
  { name: 'cherry', color: '#b71c1c', label: 'Cherry' },
  { name: 'midnight', color: '#1a237e', label: 'Midnight' },
  { name: 'mint', color: '#00b894', label: 'Mint' },
  { name: 'coral', color: '#e74c3c', label: 'Coral' },
  { name: 'indigo', color: '#283593', label: 'Indigo' },
  { name: 'chocolate', color: '#5d4037', label: 'Chocolate' },
  { name: 'electric', color: '#6a1b9a', label: 'Electric' },
  { name: 'steel', color: '#37474f', label: 'Steel' },
  { name: 'lime', color: '#558b2f', label: 'Lime' }
];

var FONT_MAP = {
  'inter': { name: 'Inter', family: 'Inter, sans-serif', google: 'Inter' },
  'roboto': { name: 'Roboto', family: 'Roboto, sans-serif', google: 'Roboto' },
  'cinzel': { name: 'Cinzel', family: 'Cinzel, serif', google: 'Cinzel' },
  'quicksand': { name: 'Quicksand', family: 'Quicksand, sans-serif', google: 'Quicksand' },
  'courier-prime': { name: 'Courier Prime', family: '"Courier Prime", monospace', google: 'Courier+Prime' },
  'fredoka': { name: 'Fredoka', family: 'Fredoka, sans-serif', google: 'Fredoka' },
  'pacifico': { name: 'Pacifico', family: 'Pacifico, cursive', google: 'Pacifico' },
  'bangers': { name: 'Bangers', family: 'Bangers, cursive', google: 'Bangers' },
  'lobster': { name: 'Lobster', family: 'Lobster, cursive', google: 'Lobster' },
  'permanent-marker': { name: 'Permanent Marker', family: '"Permanent Marker", cursive', google: 'Permanent+Marker' },
  'comfortaa': { name: 'Comfortaa', family: 'Comfortaa, sans-serif', google: 'Comfortaa' },
  'righteous': { name: 'Righteous', family: 'Righteous, sans-serif', google: 'Righteous' }
};

var manualThemeFlag = localStorage.getItem('smartgrade_manual_theme');

// ============================================
// FONCTION PRINCIPALE : METTRE À JOUR L'AVATAR
// ============================================

function updateHeaderAvatar() {
  var headerAvatar = document.getElementById('headerAvatar');
  if (!headerAvatar) return;
  
  var currentPath = window.location.pathname;
  var publicPages = ['index.html', 'login.html', 'register.html', 'about.html', 'guide.html', '404.html', '400.html', '401.html', '403.html', '500.html', '502.html', '503.html'];
  
  var isPublic = false;
  for (var i = 0; i < publicPages.length; i++) {
    if (currentPath.indexOf(publicPages[i]) !== -1) {
      isPublic = true;
      break;
    }
  }
  
  if (isPublic) {
    headerAvatar.innerHTML = '<i class="fas fa-info-circle"></i>';
    return;
  }
  
  try {
    var stored = localStorage.getItem('smartgrade_current');
    if (!stored) {
      headerAvatar.innerHTML = '<i class="fas fa-user-graduate"></i>';
      return;
    }
    
    var user = JSON.parse(stored);
    var profile = JSON.parse(localStorage.getItem('smartgrade_profile_' + user.id) || '{}');
    
    if (profile.avatarBase64 && profile.avatarBase64 !== '' && profile.avatarBase64.length > 100) {
      headerAvatar.innerHTML = '<img src="' + profile.avatarBase64 + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
    } else {
      // Utiliser l'image PNG pour l'en-tête
      var gender = user.gender || 'boy';
      var defaultAvatarPNG = gender === 'girl' ? './icons/avatar-girl.png' : './icons/avatar-boy.png';
      headerAvatar.innerHTML = '<img src="' + defaultAvatarPNG + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
    }
  } catch(e) {
    console.error('Update header avatar error:', e);
    headerAvatar.innerHTML = '<i class="fas fa-user-graduate"></i>';
  }
}

// ============================================
// AUTRES FONCTIONS UTILITAIRES
// ============================================

function fixMobileHeight() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}
fixMobileHeight();
window.addEventListener('resize', fixMobileHeight);
window.addEventListener('orientationchange', fixMobileHeight);

function checkNightMode() {
  if (manualThemeFlag === 'dark') {
    document.body.classList.add('night-mode');
    return;
  }
  if (manualThemeFlag === 'light') {
    document.body.classList.remove('night-mode');
    return;
  }
  
  var hours = new Date().getHours();
  var isNight = (hours >= 20 || hours < 6);
  
  if (isNight) {
    document.body.classList.add('night-mode');
  } else {
    document.body.classList.remove('night-mode');
  }
}

function toggleDarkLightMode() {
  var btn = document.getElementById('darkLightBtn');
  
  if (manualThemeFlag === 'dark') {
    manualThemeFlag = 'light';
    document.body.classList.remove('night-mode');
    if (btn) btn.innerHTML = '<i class="fas fa-moon"></i> Switch to Dark Mode';
  } else {
    manualThemeFlag = 'dark';
    document.body.classList.add('night-mode');
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i> Switch to Light Mode';
  }
  
  localStorage.setItem('smartgrade_manual_theme', manualThemeFlag);
}

function applyFontToAllElements(fontId) {
  var fontInfo = FONT_MAP[fontId];
  if (!fontInfo) {
    fontId = 'inter';
    fontInfo = FONT_MAP['inter'];
  }
  
  var fontFamily = fontInfo.family;
  document.body.style.fontFamily = fontFamily;
  
  var allElements = document.querySelectorAll('*');
  for (var i = 0; i < allElements.length; i++) {
    if (allElements[i].style) {
      allElements[i].style.fontFamily = fontFamily;
    }
  }
  
  localStorage.setItem('smartgrade_font_family', fontId);
  
  var oldFonts = ['font-inter', 'font-roboto', 'font-cinzel', 'font-quicksand', 'font-courier-prime', 'font-fredoka', 'font-pacifico', 'font-bangers', 'font-lobster', 'font-permanent-marker', 'font-comfortaa', 'font-righteous'];
  for (var i = 0; i < oldFonts.length; i++) {
    document.body.classList.remove(oldFonts[i]);
  }
  document.body.classList.add('font-' + fontId);
}

function initFontFamily() {
  var savedFont = localStorage.getItem('smartgrade_font_family') || 'inter';
  applyFontToAllElements(savedFont);
}

function generateFontSelectorHTML() {
  var currentFont = localStorage.getItem('smartgrade_font_family') || 'inter';
  var html = '';
  
  for (var id in FONT_MAP) {
    var font = FONT_MAP[id];
    var isActive = (currentFont === id);
    var fontFamilyName = font.family.split(',')[0].replace(/['"]/g, '');
    html += '<div class="font-selector-item ' + (isActive ? 'active' : '') + '" data-font="' + id + '" style="font-family: \'' + fontFamilyName + '\', ' + font.family.split(',').slice(1).join(',') + '; padding: 10px 6px; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.2s; background: ' + (isActive ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(0,0,0,0.03)') + '; color: ' + (isActive ? 'white' : 'var(--text)') + '; border: 1px solid var(--border); font-size: 0.7rem; font-weight: 500;">' + font.name + '</div>';
  }
  
  return html;
}

function initFontSelector() {
  var fontGrid = document.getElementById('fontSelectorGrid');
  if (!fontGrid) return;
  
  fontGrid.innerHTML = generateFontSelectorHTML();
  
  document.querySelectorAll('.font-selector-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      var fontId = this.dataset.font;
      applyFontToAllElements(fontId);
      
      document.querySelectorAll('.font-selector-item').forEach(function(el) {
        el.classList.remove('active');
        el.style.background = 'rgba(0,0,0,0.03)';
        el.style.color = 'var(--text)';
      });
      this.classList.add('active');
      this.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
      this.style.color = 'white';
      
      try {
        var student = getCurrentStudent();
        if (student && student.id && typeof trackFontUsage === 'function') {
          trackFontUsage(student.id, fontId);
        }
      } catch(err) {}
      
      closeBottomSheet();
    });
  });
}

function initThemeSelector() {
  var c = document.getElementById('themeGrid');
  if (!c) return;
  
  var bottomSheetContent = document.querySelector('.bottom-sheet-content');
  
  if (bottomSheetContent && !document.getElementById('darkLightBtn')) {
    var modeBtn = document.createElement('div');
    modeBtn.style.cssText = 'margin-bottom: 16px; padding: 0 4px;';
    
    var isDarkMode = document.body.classList.contains('night-mode');
    var btnIcon = isDarkMode ? 'fa-sun' : 'fa-moon';
    var btnText = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    
    modeBtn.innerHTML = `
      <button id="darkLightBtn" style="width:100%; padding:12px; border-radius:30px; background:linear-gradient(135deg, var(--primary), var(--secondary)); color:white; border:none; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
        <i class="fas ${btnIcon}"></i>
        <span>${btnText}</span>
      </button>
    `;
    bottomSheetContent.insertBefore(modeBtn, bottomSheetContent.firstChild);
    
    var btn = document.getElementById('darkLightBtn');
    if (btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        toggleDarkLightMode();
        var icon = btn.querySelector('i');
        var span = btn.querySelector('span');
        if (manualThemeFlag === 'dark') {
          icon.className = 'fas fa-sun';
          span.textContent = 'Switch to Light Mode';
        } else if (manualThemeFlag === 'light') {
          icon.className = 'fas fa-moon';
          span.textContent = 'Switch to Dark Mode';
        } else {
          var hours = new Date().getHours();
          var isNight = (hours >= 20 || hours < 6);
          icon.className = isNight ? 'fas fa-sun' : 'fas fa-moon';
          span.textContent = isNight ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
        setTimeout(function() { closeBottomSheet(); }, 300);
      };
    }
  }
  
  if (bottomSheetContent && !document.getElementById('fontSelectorSection')) {
    var fontSection = document.createElement('div');
    fontSection.id = 'fontSelectorSection';
    fontSection.style.cssText = 'margin: 16px 0 8px; padding-top: 8px; border-top: 1px solid var(--border);';
    
    var fontTitle = document.createElement('div');
    fontTitle.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 12px;';
    fontTitle.innerHTML = '<i class="fas fa-font" style="color: var(--primary);"></i><span style="font-weight: 600; font-size: 0.75rem;">Font Family</span>';
    fontSection.appendChild(fontTitle);
    
    var fontGrid = document.createElement('div');
    fontGrid.id = 'fontSelectorGrid';
    fontGrid.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 8px;';
    fontSection.appendChild(fontGrid);
    
    var fontRowSheet = document.querySelector('.font-row-sheet');
    if (fontRowSheet) {
      bottomSheetContent.insertBefore(fontSection, fontRowSheet);
    } else {
      bottomSheetContent.appendChild(fontSection);
    }
  }
  
  initFontSelector();
  
  var st = getSavedTheme();
  c.innerHTML = THEMES.map(function(t) {
    return '<div class="theme-rect ' + (st === t.name ? 'active' : '') + '" data-theme="' + t.name + '" style="background:' + t.color + ';" title="' + t.label + '">' + t.label + '</div>';
  }).join('');
  
  document.querySelectorAll('.theme-rect').forEach(function(r) {
    r.addEventListener('click', function(e) {
      e.stopPropagation();
      var t = this.dataset.theme;
      document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
      document.body.classList.add('theme-' + t);
      saveTheme(t);
      
      try {
        var student = getCurrentStudent();
        if (student && student.id && typeof trackThemeUsage === 'function') {
          trackThemeUsage(student.id, t);
        }
      } catch(err) {}
      
      document.querySelectorAll('.theme-rect').forEach(function(x) { x.classList.remove('active'); });
      this.classList.add('active');
      checkNightMode();
      closeBottomSheet();
    });
  });
  
  var tb = document.getElementById('themeBtn');
  var bs = document.getElementById('bottomSheet');
  var so = document.getElementById('sheetOverlay');
  var cs = document.getElementById('closeSheet');
  
  if (tb && bs && so) {
    tb.onclick = function(e) {
      e.stopPropagation();
      bs.classList.add('open');
      so.classList.add('active');
    };
    
    var closeFn = function() {
      bs.classList.remove('open');
      so.classList.remove('active');
    };
    
    if (cs) cs.onclick = closeFn;
    so.onclick = closeFn;
    
    bs.addEventListener('click', function(e) {
      if (e.target === bs) {
        closeFn();
      }
    });
    
    window.closeBottomSheet = closeFn;
  }
}

function closeBottomSheet() {
  var bs = document.getElementById('bottomSheet');
  var so = document.getElementById('sheetOverlay');
  if (bs) bs.classList.remove('open');
  if (so) so.classList.remove('active');
}

function initMobileMenu() {
  var mb = document.getElementById('menuBtn'), cb = document.getElementById('closeSidebar'), sb = document.getElementById('sidebarMenu'), ov = document.getElementById('overlay');
  if (mb && sb && ov) {
    mb.onclick = function() { sb.classList.add('open'); ov.classList.add('active'); };
    var cf = function() { sb.classList.remove('open'); ov.classList.remove('active'); };
    if (cb) cb.onclick = cf;
    ov.onclick = cf;
  }
}

function initHeaderProfile() {
  updateHeaderAvatar();
}

function getProfile(studentId) {
  var d = localStorage.getItem('smartgrade_profile_' + studentId);
  if (!d) return { avatarBase64: '', bio: '', favorites: [] };
  try { 
    var p = JSON.parse(d);
    return { 
      avatarBase64: p.avatarBase64 || '', 
      bio: p.bio || '', 
      favorites: p.favorites || []
    };
  }
  catch (e) { 
    return { avatarBase64: '', bio: '', favorites: [] };
  }
}

function saveProfile(studentId, profile) {
  localStorage.setItem('smartgrade_profile_' + studentId, JSON.stringify(profile));
  updateHeaderAvatar();
}

function playClickSound() {
  try { var a = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='); a.volume = 0.3; a.play().catch(function() {}); } catch (e) {}
}

function playActionFeedback() { playClickSound(); if (typeof navigator.vibrate === 'function') navigator.vibrate(30); }

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.btn, .term-card, .subject-card, .theme-rect, .font-sheet, .nav-item, .term-tab').forEach(function(el) {
    el.addEventListener('click', function() { playClickSound(); });
  });
});

var deferredPrompt;
window.addEventListener('beforeinstallprompt', function(e) { e.preventDefault(); deferredPrompt = e; var p = document.getElementById('installPrompt'); if (p) p.classList.add('show'); });

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(r) { if (r.outcome === 'accepted'); deferredPrompt = null; });
    var p = document.getElementById('installPrompt'); if (p) p.classList.remove('show');
  } else { alert('Menu > Add to Home Screen'); }
}

function autoUpdateCurrentUserStreak() { var u = getCurrentStudent(); if (u) updateStreakOnVisit(u.id); }

function getSavedTheme() { return localStorage.getItem('smartgrade_theme') || 'default'; }
function saveTheme(t) { localStorage.setItem('smartgrade_theme', t); }

function initParticles() {
  var c = document.getElementById('particles');
  if (!c) return;
  c.innerHTML = '';
  for (var i = 0; i < 40; i++) {
    var p = document.createElement('div');
    var s = Math.random() * 3 + 2;
    p.style.cssText = 'position:absolute;width:' + s + 'px;height:' + s + 'px;background:var(--primary);border-radius:50%;left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;opacity:' + (Math.random() * 0.3) + ';animation:floatParticle ' + (Math.random() * 15 + 10) + 's linear infinite;';
    c.appendChild(p);
  }
}

function getSequencesForTerm(t) { var s = (t - 1) * 2 + 1; return [s, s + 1]; }

function roundToTwo(num) { if (isNaN(num) || !isFinite(num)) return 0; return Math.round((num + Number.EPSILON) * 100) / 100; }

function showToast(m) {
  var c = document.getElementById('toastContainer');
  if (!c) { c = document.createElement('div'); c.id = 'toastContainer'; c.className = 'toast-container'; document.body.appendChild(c); }
  var t = document.createElement('div'); t.className = 'toast'; t.innerHTML = '<i class="fas fa-info-circle"></i> ' + m; c.appendChild(t);
  setTimeout(function() { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(function() { t.remove(); }, 300); }, 3000);
}

function formatDate(d) { if (!d) return '--'; var dt = new Date(d); var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; return dt.getDate() + ' ' + m[dt.getMonth()] + ' ' + dt.getFullYear(); }

function getGreeting() { var h = new Date().getHours(); if (h < 12) return 'Good Morning'; if (h < 18) return 'Good Afternoon'; return 'Good Evening'; }

function trackThemeUsage(studentId, themeName) {
  var usedThemes = JSON.parse(localStorage.getItem('smartgrade_used_themes_' + studentId) || '[]');
  if (usedThemes.indexOf(themeName) === -1) {
    usedThemes.push(themeName);
    localStorage.setItem('smartgrade_used_themes_' + studentId, JSON.stringify(usedThemes));
    
    if (usedThemes.length >= 10) {
      unlockBadgeById(studentId, 34);
    }
  }
}

function trackFontUsage(studentId, fontId) {
  var usedFonts = JSON.parse(localStorage.getItem('smartgrade_used_fonts_' + studentId) || '[]');
  if (usedFonts.indexOf(fontId) === -1) {
    usedFonts.push(fontId);
    localStorage.setItem('smartgrade_used_fonts_' + studentId, JSON.stringify(usedFonts));
    
    if (usedFonts.length >= 6) {
      unlockBadgeById(studentId, 50);
    }
  }
}

function checkWelcomeBadge(studentId) {
  var welcomed = localStorage.getItem('smartgrade_welcome_badge_' + studentId);
  if (!welcomed) {
    unlockBadgeById(studentId, 38);
    localStorage.setItem('smartgrade_welcome_badge_' + studentId, 'true');
  }
}

function checkPhotoBadge(studentId) {
  var profile = getProfile(studentId);
  if (profile.avatarBase64 && profile.avatarBase64 !== '') {
    unlockBadgeById(studentId, 36);
  }
}

function incrementTimetableView(studentId) {
  var count = parseInt(localStorage.getItem('smartgrade_timetable_views_' + studentId) || '0');
  count++;
  localStorage.setItem('smartgrade_timetable_views_' + studentId, count);
  if (count >= 10) {
    unlockBadgeById(studentId, 57);
  }
  return count;
}

function checkFlashcardBadges(studentId) {
  var cards = getFlashcards(studentId);
  var customCount = cards.filter(function(c) { return !c.isOriginal; }).length;
  
  if (customCount >= 5) unlockBadgeById(studentId, 58);
  if (customCount >= 10) unlockBadgeById(studentId, 59);
}

function checkComebackBadge(studentId) {
  var grades = getStudentGrades(studentId);
  var subjects = {};
  
  for (var i = 0; i < grades.length; i++) {
    var g = grades[i];
    if (!subjects[g.subjectId]) subjects[g.subjectId] = [];
    subjects[g.subjectId].push({ seq: g.sequenceId, value: g.value });
  }
  
  for (var subjId in subjects) {
    var values = subjects[subjId].map(function(v) { return v.value; });
    var firstAvg = 0;
    for (var j = 0; j < Math.min(values.length, 2); j++) firstAvg += values[j];
    firstAvg = firstAvg / Math.min(values.length, 2);
    
    var lastAvg = 0;
    var lastStart = Math.max(0, values.length - 2);
    for (var k = lastStart; k < values.length; k++) lastAvg += values[k];
    lastAvg = lastAvg / Math.min(values.length, 2);
    
    if (lastAvg - firstAvg >= 5) {
      unlockBadgeById(studentId, 25);
      break;
    }
  }
}

function unlockBadgeById(studentId, badgeId) {
  var achievements = getStudentAchievements(studentId);
  var existing = achievements.find(function(a) { return a.id === badgeId; });
  if (existing && existing.unlocked) return false;
  
  var badge = ACHIEVEMENTS ? ACHIEVEMENTS.find(function(b) { return b.id === badgeId; }) : null;
  if (!badge) return false;
  
  if (existing) {
    existing.unlocked = true;
    existing.unlockDate = new Date().toLocaleDateString();
    existing.notified = false;
  } else {
    achievements.push({
      id: badge.id,
      name: badge.name,
      desc: badge.desc,
      unlocked: true,
      unlockDate: new Date().toLocaleDateString(),
      notified: false
    });
  }
  
  saveStudentAchievements(studentId, achievements);
  
  if (badgeId !== 34 && badgeId !== 50) {
    checkAndNotifyAchievements(studentId);
  }
  
  return true;
}

function checkAndUnlockAllNewBadges(studentId) {
  if (!studentId) return;
  checkWelcomeBadge(studentId);
  checkPhotoBadge(studentId);
  checkFlashcardBadges(studentId);
  checkComebackBadge(studentId);
}

// ============================================
// SMART GRADE v5.0 - APP.JS
// ============================================

// ...

var APP_VERSION = '5.0';

if (!localStorage.getItem('smartgrade_version')) {
  localStorage.setItem('smartgrade_version', APP_VERSION);
}

window.getAppVersion = function() {
  return APP_VERSION;
};

// ...

// ============================================
// GLOBAL BADGE FUNCTIONS
// ============================================

function afterGradeAdded(studentId) {
  if (studentId && typeof checkAndUnlockAllNewBadges === 'function') {
    setTimeout(function() {
      checkAndUnlockAllNewBadges(studentId);
    }, 500);
  }
}

function afterGradesSaved(studentId, count) {
  if (studentId && typeof checkAndUnlockAllNewBadges === 'function') {
    checkAndUnlockAllNewBadges(studentId);
  }
}

function afterLogin(studentId) {
  if (studentId && typeof checkAndUnlockAllNewBadges === 'function') {
    checkAndUnlockAllNewBadges(studentId);
  }
  if (studentId && typeof updateStreakOnVisit === 'function') {
    updateStreakOnVisit(studentId);
  }
  if (studentId && typeof checkWelcomeBadge === 'function') {
    checkWelcomeBadge(studentId);
  }
}

function afterPhotoUploaded(studentId) {
  if (studentId && typeof checkPhotoBadge === 'function') {
    checkPhotoBadge(studentId);
  }
}

function afterFlashcardAdded(studentId) {
  if (studentId && typeof checkFlashcardBadges === 'function') {
    checkFlashcardBadges(studentId);
  }
}

// ============================================
// INITIALISATION PRINCIPALE
// ============================================
(function initApp() {
  var savedTheme = getSavedTheme();
  if (savedTheme) document.body.classList.add('theme-' + savedTheme);
  
  initFontFamily();
  checkNightMode();
  initParticles();
  initThemeSelector();
  initMobileMenu();
  updateHeaderAvatar();
  autoUpdateCurrentUserStreak();
  if (typeof initPWA === 'function') initPWA();
  
  setInterval(function() {
    if (manualThemeFlag !== 'dark' && manualThemeFlag !== 'light') {
      checkNightMode();
    }
  }, 60000);
  
  window.addEventListener('focus', function() {
    checkNightMode();
    initFontFamily();
    updateHeaderAvatar();
  });
  
  window.addEventListener('pageshow', function() {
    updateHeaderAvatar();
    initFontFamily();
    checkNightMode();
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    updateHeaderAvatar();
    initFontFamily();
    checkNightMode();
  });
  
  window.addEventListener('storage', function(e) {
    if (e.key && e.key.indexOf('smartgrade_profile_') !== -1) {
      updateHeaderAvatar();
    }
    if (e.key === 'smartgrade_current') {
      updateHeaderAvatar();
    }
  });
})();

// ============================================
// FONCTION UNIQUE POUR L'AVATAR
// ============================================

function refreshAvatarInHeader() {
  var avatarElement = document.getElementById('headerAvatar');
  if (!avatarElement) return;
  
  try {
    var currentUser = localStorage.getItem('smartgrade_current');
    if (!currentUser) {
      avatarElement.innerHTML = '<i class="fas fa-user-graduate"></i>';
      return;
    }
    
    var user = JSON.parse(currentUser);
    var profileStr = localStorage.getItem('smartgrade_profile_' + user.id);
    
    if (profileStr) {
      var profile = JSON.parse(profileStr);
      if (profile.avatarBase64 && profile.avatarBase64.length > 100) {
        avatarElement.innerHTML = '<img src="' + profile.avatarBase64 + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
        return;
      }
    }
    
    // Avatar par défaut selon le genre
    var gender = user.gender || 'boy';
    var defaultAvatar = gender === 'girl' ? './icons/avatar-girl.png' : './icons/avatar-boy.png';
    avatarElement.innerHTML = '<img src="' + defaultAvatar + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
  } catch(e) {
    avatarElement.innerHTML = '<i class="fas fa-user-graduate"></i>';
  }
}

refreshAvatarInHeader();

window.addEventListener('storage', function(e) {
  if (e.key && (e.key.indexOf('smartgrade_profile_') !== -1 || e.key === 'smartgrade_current')) {
    refreshAvatarInHeader();
  }
});

document.addEventListener('visibilitychange', function() {
  if (!document.hidden) refreshAvatarInHeader();
});

// ============================================
// MAINTENANCE DETECTION - REDIRECTION VERS MAINTENANCE.HTML
// ============================================

(function() {
  // Ne pas s'exécuter sur la page maintenance elle-même
  if (window.location.pathname.includes('maintenance.html')) {
    return;
  }
  
  // Vérifier si la maintenance est activée
  function checkMaintenance() {
    // Charger la configuration
    var maintenanceConfig = { MAINTENANCE_MODE: false };
    
    try {
      // Essayer de charger depuis le fichier de config (chargé avant app.js)
      if (typeof MAINTENANCE_MODE !== 'undefined') {
        maintenanceConfig.MAINTENANCE_MODE = MAINTENANCE_MODE;
      }
    } catch(e) {}
    
    if (maintenanceConfig.MAINTENANCE_MODE === true) {
      console.log('[Maintenance] Active - Redirecting to maintenance.html');
      sessionStorage.setItem('maintenance_redirecting', 'true');
      window.location.href = 'maintenance.html';
    }
  }
  
  // Vérifier au chargement
  checkMaintenance();
})();

// ============================================================
// SERVICE WORKER - AUTO UPDATE MANAGER
// ============================================================

(function initSWManager() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] Not supported');
    return;
  }

  var swRegistration = null;
  var isReloading = false;
  var updateInterval = null;

  function registerSW() {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(function(registration) {
        swRegistration = registration;
        console.log('[SW] Registered successfully');

        // Check for updates immediately
        registration.update();

        // Check every 30 seconds
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = setInterval(function() {
          if (swRegistration) {
            swRegistration.update();
            console.log('[SW] Periodic update check...');
          }
        }, 30000);

        if (navigator.serviceWorker.controller) {
          console.log('[SW] Controls this page');
        } else {
          console.log('[SW] Waiting to control page...');
          setTimeout(function() {
            if (swRegistration && !navigator.serviceWorker.controller) {
              swRegistration.update();
            }
          }, 2000);
        }
      })
      .catch(function(error) {
        console.error('[SW] Registration failed:', error);
      });
  }

  // Listen for SW messages
  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log('[SW] Message received:', event.data);
    if (event.data === 'updateReady' && !isReloading) {
      isReloading = true;
      console.log('[SW] Update ready, reloading...');
      window.location.reload();
    }
  });

  // Check on focus
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden && swRegistration) {
      swRegistration.update();
      console.log('[SW] Update check on focus');
    }
  });

  // Check on online
  window.addEventListener('online', function() {
    if (swRegistration) {
      swRegistration.update();
      console.log('[SW] Update check - connection restored');
    }
  });

  // Check on pageshow
  window.addEventListener('pageshow', function() {
    if (swRegistration) {
      swRegistration.update();
      console.log('[SW] Update check on pageshow');
    }
  });

  // Register on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerSW);
  } else {
    registerSW();
  }

  // Safety net
  window.addEventListener('load', function() {
    if (!swRegistration) {
      registerSW();
    }
  });

})();

// ============================================
// FIX MENU TITLE - VERSION ULTIMATE
// SMART-GRADE MENU → SMART GRADE (TOUTES LES PAGES)
// ============================================

(function fixMenuTitle() {
  
  // Fonction principale
  function replaceMenuTitle() {
    var elements = document.querySelectorAll('.sidebar-header h3');
    var count = 0;
    
    elements.forEach(function(el) {
      if (el.innerHTML && el.innerHTML.includes('SMART-GRADE MENU')) {
        el.innerHTML = el.innerHTML.replace('SMART-GRADE MENU', 'SMART GRADE');
        count++;
      }
    });
    
    if (count > 0) {
      console.log('[Menu] ✅ ' + count + ' modification(s) effectuée(s)');
    }
    return count;
  }
  
  // Exécuter immédiatement si le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceMenuTitle);
  } else {
    replaceMenuTitle();
  }
  
  // Exécuter également après chargement complet (pour sécurité)
  window.addEventListener('load', function() {
    setTimeout(replaceMenuTitle, 200);
  });
  
  // Observer les changements dynamiques
  var observer = new MutationObserver(function() {
    replaceMenuTitle();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
})();

// FIN DE APP.JS
// ============================================
window.updateHeaderAvatar = refreshAvatarInHeader;
window.initHeaderProfile = refreshAvatarInHeader;

// Export global functions
window.afterGradeAdded = afterGradeAdded;
window.afterGradesSaved = afterGradesSaved;
window.afterLogin = afterLogin;
window.afterPhotoUploaded = afterPhotoUploaded;
window.afterFlashcardAdded = afterFlashcardAdded;
window.checkAndUnlockAllNewBadges = checkAndUnlockAllNewBadges;
window.unlockBadgeById = unlockBadgeById;
window.trackThemeUsage = trackThemeUsage;
window.trackFontUsage = trackFontUsage;
window.incrementTimetableView = incrementTimetableView;
window.checkFlashcardBadges = checkFlashcardBadges;
window.checkPhotoBadge = checkPhotoBadge;
window.checkWelcomeBadge = checkWelcomeBadge;
window.installApp = installApp;

console.log('SMART GRADE v5.0 - App initialized');
// ============================================================
// SW - Force update check
// ============================================================
if (navigator.serviceWorker && navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.postMessage('updateSW');
}
