// ============================================
// SMART GRADE v5.0 - UTILS.JS
// VERSION FINALE CORRIGÉE
// ============================================

// ============================================
// 1. FONCTIONS UTILITAIRES DE BASE
// ============================================

function roundToTwo(num) {
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function getGradeLetter(a) {
  if (a >= 18) return 'A+';
  if (a >= 16) return 'A';
  if (a >= 14) return 'B+';
  if (a >= 12) return 'B';
  if (a >= 10) return 'C';
  if (a >= 8) return 'D';
  return 'F';
}

function getGradeClass(a) {
  if (a >= 14) return 'grade-A';
  if (a >= 12) return 'grade-B';
  if (a >= 10) return 'grade-C';
  if (a >= 8) return 'grade-D';
  return 'grade-F';
}

function getCurrentTerm() {
  var m = new Date().getMonth() + 1;
  if (m >= 9 && m <= 12) return 1;
  if (m >= 1 && m <= 3) return 2;
  return 3;
}

function formatNumber(num, d) {
  if (typeof d === 'undefined') d = 2;
  if (isNaN(num) || !isFinite(num)) return '--';
  return num.toFixed(d);
}

function getGreeting() {
  var h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function formatDate(d) {
  if (!d) return '--';
  var dt = new Date(d);
  var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return dt.getDate() + ' ' + m[dt.getMonth()] + ' ' + dt.getFullYear();
}

function getStatusText(a) {
  if (a >= 16) return 'Excellent';
  if (a >= 14) return 'Very Good';
  if (a >= 12) return 'Good';
  if (a >= 10) return 'Average';
  if (a >= 8) return 'Below Average';
  return 'Needs Work';
}

function getSequencesForTerm(t) {
  var s = (t - 1) * 2 + 1;
  return [s, s + 1];
}

// ============================================
// 2. TOAST NOTIFICATIONS
// ============================================

function showToast(message, type) {
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:80px;left:16px;right:16px;z-index:5000;pointer-events:none;';
    document.body.appendChild(container);
  }
  
  var toast = document.createElement('div');
  var bgColor = '#0f3b48';
  if (type === 'success') bgColor = '#2ecc71';
  else if (type === 'error') bgColor = '#e74c3c';
  else if (type === 'warning') bgColor = '#f39c12';
  
  toast.style.cssText = `
    background: ${bgColor};
    color: white;
    padding: 12px 16px;
    border-radius: 30px;
    margin-bottom: 8px;
    font-size: 0.8rem;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideUp 0.3s ease;
    pointer-events: auto;
  `;
  
  toast.innerHTML = '<i class="fas fa-info-circle"></i> ' + message;
  container.appendChild(toast);
  
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
  }, 3000);
}

// ============================================
// 3. PARTICULES
// ============================================

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

// ============================================
// 4. TOAST HELPERS
// ============================================

// ============================================
// 5. CONFIRMATION DIALOG
// ============================================

function showConfirmDialog(options) {
  var existingModal = document.querySelector('.custom-confirm-modal');
  if (existingModal) existingModal.remove();
  
  var modal = document.createElement('div');
  modal.className = 'custom-confirm-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:2000;display:flex;align-items:center;justify-content:center;';
  
  var detailHtml = '';
  if (options.detail) {
    detailHtml = '<p style="font-size:0.7rem;font-weight:600;color:#e74c3c;margin-bottom:16px;">' + options.detail + '</p>';
  }
  
  var iconHtml = '';
  if (options.icon) {
    iconHtml = '<i class="fas ' + options.icon + '" style="font-size:48px;color:' + (options.iconColor || '#e74c3c') + ';margin-bottom:16px;"></i>';
  }
  
  modal.innerHTML = `
    <div style="background:var(--card-bg);border-radius:24px;padding:24px;max-width:320px;width:85%;text-align:center;animation:fadeInUp 0.3s ease;">
      ${iconHtml}
      <h3 style="margin-bottom:8px;">${options.title}</h3>
      <p style="font-size:0.75rem;color:var(--text-light);margin-bottom:8px;">${options.message}</p>
      ${detailHtml}
      <div style="display:flex;gap:12px;">
        <button class="confirm-cancel-btn" style="flex:1;padding:12px;border-radius:40px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;">${options.cancelText || 'Cancel'}</button>
        <button class="confirm-ok-btn" style="flex:1;padding:12px;border-radius:40px;background:${options.confirmColor || '#e74c3c'};color:white;border:none;cursor:pointer;">${options.confirmText || 'Confirm'}</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.confirm-cancel-btn').onclick = function() {
    modal.remove();
    if (options.onCancel) options.onCancel();
  };
  
  modal.querySelector('.confirm-ok-btn').onclick = function() {
    modal.remove();
    if (options.onConfirm) options.onConfirm();
  };
  
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.remove();
      if (options.onCancel) options.onCancel();
    }
  };
}

// ============================================
// 6. GESTION DES ERREURS
// ============================================

window.redirectToError = function(code, customMessage) {
  var errorPage = '';
  if (code === 401) errorPage = '401.html';
  else if (code === 403) errorPage = '403.html';
  else if (code === 404) errorPage = '404.html';
  else if (code === 503) errorPage = '503.html';
  else errorPage = '404.html';
  
  window.location.href = errorPage;
};

// ============================================
// 7. GESTION DES POLICES
// ============================================

function initFontFamily() {
  var savedFont = localStorage.getItem('smartgrade_font_family') || 'inter';
  var validFonts = ['inter', 'roboto', 'cinzel', 'quicksand', 'courier-prime', 'fredoka', 'pacifico', 'bangers', 'lobster', 'permanent-marker', 'comfortaa', 'righteous'];
  
  if (validFonts.indexOf(savedFont) === -1) savedFont = 'inter';
  
  var oldFonts = ['font-inter', 'font-roboto', 'font-cinzel', 'font-quicksand', 'font-courier-prime', 'font-fredoka', 'font-pacifico', 'font-bangers', 'font-lobster', 'font-permanent-marker', 'font-comfortaa', 'font-righteous'];
  for (var i = 0; i < oldFonts.length; i++) document.body.classList.remove(oldFonts[i]);
  
  document.body.classList.add('font-' + savedFont);
  applyGlobalFont();
}

function applyGlobalFont() {
  var savedFont = localStorage.getItem('smartgrade_font_family') || 'inter';
  var fontMap = {
    'inter': 'Inter, sans-serif', 'roboto': 'Roboto, sans-serif', 'cinzel': 'Cinzel, serif',
    'quicksand': 'Quicksand, sans-serif', 'courier-prime': '"Courier Prime", monospace',
    'fredoka': 'Fredoka, sans-serif', 'pacifico': 'Pacifico, cursive', 'bangers': 'Bangers, cursive',
    'lobster': 'Lobster, cursive', 'permanent-marker': '"Permanent Marker", cursive',
    'comfortaa': 'Comfortaa, sans-serif', 'righteous': 'Righteous, sans-serif'
  };
  document.body.style.fontFamily = fontMap[savedFont] || 'Inter, sans-serif';
}

// ============================================
// 8. MODE NUIT
// ============================================

var manualThemeFlag = localStorage.getItem('smartgrade_manual_theme');

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
  if (manualThemeFlag === 'dark') {
    manualThemeFlag = 'light';
    document.body.classList.remove('night-mode');
    showToast('Light mode activated');
  } else {
    manualThemeFlag = 'dark';
    document.body.classList.add('night-mode');
    showToast('Dark mode activated');
  }
  localStorage.setItem('smartgrade_manual_theme', manualThemeFlag);
}

// ============================================
// 9. GESTION DES THÈMES
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

function getSavedTheme() {
  return localStorage.getItem('smartgrade_theme') || 'default';
}

function saveTheme(theme) {
  localStorage.setItem('smartgrade_theme', theme);
}

function initThemeSelector() {
  var c = document.getElementById('themeGrid');
  if (!c) return;
  
  var bottomSheetContent = document.querySelector('.bottom-sheet-content');
  
  if (bottomSheetContent && !document.getElementById('darkLightBtn')) {
    var modeBtn = document.createElement('div');
    modeBtn.style.cssText = 'margin-bottom: 16px; padding: 0 4px;';
    modeBtn.innerHTML = `
      <button id="darkLightBtn" style="width:100%; padding:12px; border-radius:30px; background:linear-gradient(135deg, var(--primary), var(--secondary)); color:white; border:none; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
        <i class="fas fa-moon"></i>
        <span>Switch to Dark Mode</span>
      </button>
    `;
    bottomSheetContent.insertBefore(modeBtn, bottomSheetContent.firstChild);
    
    document.getElementById('darkLightBtn').onclick = function(e) {
      e.stopPropagation();
      toggleDarkLightMode();
      var btn = document.getElementById('darkLightBtn');
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
      document.querySelectorAll('.theme-rect').forEach(function(x) { x.classList.remove('active'); });
      this.classList.add('active');
      checkNightMode();
      showToast('Theme: ' + t);
      closeBottomSheet();
    });
  });
  
  var sf = localStorage.getItem('smartgrade_font') || 'medium';
  document.querySelectorAll('.font-sheet').forEach(function(o) {
    if (o.dataset.font === sf) o.classList.add('active');
    o.addEventListener('click', function(e) {
      e.stopPropagation();
      var f = this.dataset.font;
      localStorage.setItem('smartgrade_font', f);
      document.body.classList.remove('font-small', 'font-medium', 'font-large');
      document.body.classList.add('font-' + f);
      document.querySelectorAll('.font-sheet').forEach(function(x) { x.classList.remove('active'); });
      this.classList.add('active');
      showToast('Font size: ' + f);
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

// ============================================
// 10. MENU MOBILE
// ============================================

function initMobileMenu() {
  var mb = document.getElementById('menuBtn'), cb = document.getElementById('closeSidebar'), sb = document.getElementById('sidebarMenu'), ov = document.getElementById('overlay');
  if (mb && sb && ov) {
    mb.onclick = function() { sb.classList.add('open'); ov.classList.add('active'); };
    var cf = function() { sb.classList.remove('open'); ov.classList.remove('active'); };
    if (cb) cb.onclick = cf;
    ov.onclick = cf;
  }
}

// ============================================
// 11. HEADER AVATAR
// ============================================

function initHeaderProfile() {
  var ha = document.getElementById('headerAvatar');
  if (!ha) return;
  
  var currentPath = window.location.pathname;
  var publicPages = ['index.html', 'login.html', 'register.html', 'about.html', 'guide.html', '404.html'];
  
  var isPublic = false;
  for (var i = 0; i < publicPages.length; i++) {
    if (currentPath.indexOf(publicPages[i]) !== -1) {
      isPublic = true;
      break;
    }
  }
  
  if (isPublic) {
    ha.innerHTML = '<i class="fas fa-info-circle"></i>';
    return;
  }
  
  try {
    var cu = getCurrentStudent();
    if (!cu) {
      ha.innerHTML = '<i class="fas fa-user-graduate"></i>';
      return;
    }
    
    var profile = JSON.parse(localStorage.getItem('smartgrade_profile_' + cu.id) || '{}');
    
    if (profile.avatarBase64 && profile.avatarBase64 !== '') {
      ha.innerHTML = '<img src="' + profile.avatarBase64 + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
    } else {
      ha.innerHTML = '<i class="fas fa-user-graduate"></i>';
    }
  } catch(err) {
    ha.innerHTML = '<i class="fas fa-user-graduate"></i>';
  }
}

// ============================================
// 12. FONCTIONS BASE DE DONNÉES (LOCALSTORAGE)
// ============================================

function getCurrentStudent() {
  try {
    var stored = localStorage.getItem('smartgrade_current');
    return stored ? JSON.parse(stored) : null;
  } catch(e) { return null; }
}

function getAllStudents() {
  try {
    var d = localStorage.getItem('smartgrade_students');
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}

function getStudentById(id) {
  var students = getAllStudents();
  for (var i = 0; i < students.length; i++) {
    if (students[i].id == id) return students[i];
  }
  return null;
}

function getStudentGrades(id) {
  try {
    var d = localStorage.getItem('smartgrade_grades_' + id);
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}

function getStudentAchievements(id) {
  try {
    var d = localStorage.getItem('smartgrade_achievements_' + id);
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}

function getStudentStreak(id) {
  try {
    var d = localStorage.getItem('smartgrade_streak_' + id);
    if (!d) return { days: 0, lastLogin: null };
    return JSON.parse(d);
  } catch(e) { return { days: 0, lastLogin: null }; }
}

function getStudentSelectedSubjects(id, term) {
  try {
    var d = localStorage.getItem('smartgrade_selected_' + id + '_term' + term);
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}

function getSubjectCoefficients(id) {
  try {
    var d = localStorage.getItem('smartgrade_coeffs_' + id);
    if (!d) return {};
    return JSON.parse(d);
  } catch(e) { return {}; }
}

function getSubjectCoefficient(studentId, subjectId) {
  var coeffs = getSubjectCoefficients(studentId);
  return coeffs[subjectId] || 5;
}

function getProfile(studentId) {
  try {
    var d = localStorage.getItem('smartgrade_profile_' + studentId);
    if (!d) return { avatarBase64: '', bio: '', favorites: [] };
    return JSON.parse(d);
  } catch(e) { return { avatarBase64: '', bio: '', favorites: [] }; }
}

// ============================================
// 13. CALCULS DE MOYENNES (CORRIGÉS)
// ============================================

function calculateStudentTermAverage(studentId, term) {
  var grades = getStudentGrades(studentId);
  var coeffs = getSubjectCoefficients(studentId);
  var selected = getStudentSelectedSubjects(studentId, term);
  
  // Si aucune matière sélectionnée, retourner 0
  if (!selected || selected.length === 0) return 0;
  
  var totalWeighted = 0;
  var totalCoeff = 0;
  var seq1 = (term - 1) * 2 + 1;
  var seq2 = seq1 + 1;
  
  // Pour CHAQUE matière sélectionnée
  for (var i = 0; i < selected.length; i++) {
    var subjectId = selected[i];
    var coeff = coeffs[subjectId] || 5;
    
    // Récupérer les notes
    var seq1Grades = grades.filter(function(g) { return g.subjectId === subjectId && g.sequenceId === seq1; });
    var seq2Grades = grades.filter(function(g) { return g.subjectId === subjectId && g.sequenceId === seq2; });
    
    // Moyenne séquence 1 (0 si pas de notes)
    var avg1 = 0;
    if (seq1Grades.length > 0) {
      var sum1 = 0;
      for (var j = 0; j < seq1Grades.length; j++) sum1 += seq1Grades[j].value;
      avg1 = sum1 / seq1Grades.length;
    }
    
    // Moyenne séquence 2 (0 si pas de notes)
    var avg2 = 0;
    if (seq2Grades.length > 0) {
      var sum2 = 0;
      for (var j = 0; j < seq2Grades.length; j++) sum2 += seq2Grades[j].value;
      avg2 = sum2 / seq2Grades.length;
    }
    
    // Moyenne de la matière
    var subjectAvg = (avg1 + avg2) / 2;
    
    // TOUJOURS ajouter (même si = 0)
    totalWeighted += subjectAvg * coeff;
    totalCoeff += coeff;
  }
  
  return totalCoeff > 0 ? roundToTwo(totalWeighted / totalCoeff) : 0;
}

function calculateSubjectTermAverage(subjectId, term, grades) {
  var seq1 = (term - 1) * 2 + 1;
  var seq2 = seq1 + 1;
  
  var seq1Grades = grades.filter(function(g) { return g.subjectId === subjectId && g.sequenceId === seq1; });
  var seq2Grades = grades.filter(function(g) { return g.subjectId === subjectId && g.sequenceId === seq2; });
  
  var avg1 = 0;
  var avg2 = 0;
  
  if (seq1Grades.length > 0) {
    var sum1 = 0;
    for (var j = 0; j < seq1Grades.length; j++) sum1 += seq1Grades[j].value;
    avg1 = sum1 / seq1Grades.length;
  }
  
  if (seq2Grades.length > 0) {
    var sum2 = 0;
    for (var j = 0; j < seq2Grades.length; j++) sum2 += seq2Grades[j].value;
    avg2 = sum2 / seq2Grades.length;
  }
  
  return roundToTwo((avg1 + avg2) / 2);
}

function calculateYearlyAverage(id) {
  var t1 = calculateStudentTermAverage(id, 1);
  var t2 = calculateStudentTermAverage(id, 2);
  var t3 = calculateStudentTermAverage(id, 3);
  return roundToTwo((t1 + t2 + t3) / 3);
}

// ============================================
// 14. EXPORT/IMPORT COMPLET
// ============================================

function exportCompleteUserData(studentId) {
  if (!studentId) {
    var current = getCurrentStudent();
    if (!current) return null;
    studentId = current.id;
  }
  
  try {
    var students = getAllStudents();
    var student = null;
    for (var i = 0; i < students.length; i++) {
      if (students[i].id == studentId) {
        student = students[i];
        break;
      }
    }
    
    var completeData = {
      version: '5.0',
      exportDate: new Date().toISOString(),
      exportType: 'complete',
      student: student,
      grades: getStudentGrades(studentId),
      subjects: {
        term1: getStudentSelectedSubjects(studentId, 1),
        term2: getStudentSelectedSubjects(studentId, 2),
        term3: getStudentSelectedSubjects(studentId, 3)
      },
      coeffs: getSubjectCoefficients(studentId),
      achievements: getStudentAchievements(studentId),
      goal: parseFloat(localStorage.getItem('smartgrade_goal_' + studentId) || 12),
      streak: getStudentStreak(studentId),
      profile: getProfile(studentId)
    };
    
    return JSON.stringify(completeData, null, 2);
  } catch(e) {
    console.error('Export error:', e);
    return null;
  }
}

function importCompleteUserData(studentId, jsonData) {
  if (!studentId) {
    var current = getCurrentStudent();
    if (!current) return { success: false, message: 'No user logged in' };
    studentId = current.id;
  }
  
  try {
    var data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    if (!data.version) {
      return { success: false, message: 'Invalid backup file format' };
    }
    
    // Restaurer les données
    if (data.grades) localStorage.setItem('smartgrade_grades_' + studentId, JSON.stringify(data.grades));
    if (data.subjects) {
      if (data.subjects.term1) localStorage.setItem('smartgrade_selected_' + studentId + '_term1', JSON.stringify(data.subjects.term1));
      if (data.subjects.term2) localStorage.setItem('smartgrade_selected_' + studentId + '_term2', JSON.stringify(data.subjects.term2));
      if (data.subjects.term3) localStorage.setItem('smartgrade_selected_' + studentId + '_term3', JSON.stringify(data.subjects.term3));
    }
    if (data.coeffs) localStorage.setItem('smartgrade_coeffs_' + studentId, JSON.stringify(data.coeffs));
    if (data.achievements) localStorage.setItem('smartgrade_achievements_' + studentId, JSON.stringify(data.achievements));
    if (data.goal !== undefined) localStorage.setItem('smartgrade_goal_' + studentId, data.goal);
    if (data.streak) localStorage.setItem('smartgrade_streak_' + studentId, JSON.stringify(data.streak));
    if (data.profile) localStorage.setItem('smartgrade_profile_' + studentId, JSON.stringify(data.profile));
    
    return { success: true, message: 'Data imported successfully' };
  } catch(e) {
    return { success: false, message: 'Invalid data: ' + e.message };
  }
}

// ============================================
// 15. INITIALISATION GLOBALE
// ============================================

(function initApp() {
  var savedTheme = getSavedTheme();
  if (savedTheme) document.body.classList.add('theme-' + savedTheme);
  
  var savedFontSize = localStorage.getItem('smartgrade_font') || 'medium';
  if (savedFontSize) document.body.classList.add('font-' + savedFontSize);
  
  initFontFamily();
  checkNightMode();
  initParticles();
  initThemeSelector();
  initMobileMenu();
  initHeaderProfile();
  
  setInterval(function() {
    if (manualThemeFlag !== 'dark' && manualThemeFlag !== 'light') {
      checkNightMode();
    }
  }, 60000);
  
  window.addEventListener('focus', function() { checkNightMode(); });
  window.addEventListener('pageshow', function() { initHeaderProfile(); initFontFamily(); checkNightMode(); });
  document.addEventListener('DOMContentLoaded', function() { initHeaderProfile(); initFontFamily(); checkNightMode(); });
})();

// ============================================
// 16. EXPORTER LES FONCTIONS GLOBALES
// ============================================

window.roundToTwo = roundToTwo;
window.getGradeLetter = getGradeLetter;
window.getCurrentTerm = getCurrentTerm;
window.formatNumber = formatNumber;
window.getGreeting = getGreeting;
window.formatDate = formatDate;
window.getStatusText = getStatusText;
window.getSequencesForTerm = getSequencesForTerm;
window.showToast = showToast;
window.initParticles = initParticles;
window.initThemeSelector = initThemeSelector;
window.initMobileMenu = initMobileMenu;
window.initHeaderProfile = initHeaderProfile;
window.initFontFamily = initFontFamily;
window.applyGlobalFont = applyGlobalFont;
window.closeBottomSheet = closeBottomSheet;
window.showConfirmDialog = showConfirmDialog;
window.getCurrentStudent = getCurrentStudent;
window.getAllStudents = getAllStudents;
window.getStudentById = getStudentById;
window.getStudentGrades = getStudentGrades;
window.getStudentAchievements = getStudentAchievements;
window.getStudentStreak = getStudentStreak;
window.getStudentSelectedSubjects = getStudentSelectedSubjects;
window.getSubjectCoefficients = getSubjectCoefficients;
window.getSubjectCoefficient = getSubjectCoefficient;
window.getProfile = getProfile;
window.calculateStudentTermAverage = calculateStudentTermAverage;
window.calculateSubjectTermAverage = calculateSubjectTermAverage;
window.calculateYearlyAverage = calculateYearlyAverage;
window.exportCompleteUserData = exportCompleteUserData;
window.importCompleteUserData = importCompleteUserData;

// ============================================
// 17. FONCTIONS POUR LES PAGES DÉVELOPPEUR
// ============================================

// Fonction pour obtenir les matières sélectionnées (alias)
function getStudentSelectedSubjectsForTerm(studentId, term) {
  return getStudentSelectedSubjects(studentId, term);
}

// Fonction pour obtenir les coefficients (alias)
function getSubjectCoefficientsForStudent(studentId) {
  return getSubjectCoefficients(studentId);
}

// Fonction pour obtenir les flashcards (alias)
function getStudentFlashcards(studentId) {
  try {
    var d = localStorage.getItem('smartgrade_flashcards_' + studentId);
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}

// Fonction pour obtenir les backups (alias)
function getStudentBackups(studentId) {
  try {
    var d = localStorage.getItem('smartgrade_backup_list_' + studentId);
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}

// Fonction pour obtenir les objectifs détaillés (alias)
function getStudentGoalsDetail(studentId) {
  try {
    var d = localStorage.getItem('smartgrade_goals_detail_' + studentId);
    return d ? JSON.parse(d) : {};
  } catch(e) { return {}; }
}

// Fonction pour obtenir les compensations (alias)
function getStudentCompensations(studentId) {
  try {
    var d = localStorage.getItem('smartgrade_compensations_' + studentId);
    return d ? JSON.parse(d) : {};
  } catch(e) { return {}; }
}

// Exporter les fonctions développeur
window.getStudentSelectedSubjectsForTerm = getStudentSelectedSubjectsForTerm;
window.getSubjectCoefficientsForStudent = getSubjectCoefficientsForStudent;
window.getStudentFlashcards = getStudentFlashcards;
window.getStudentBackups = getStudentBackups;
window.getStudentGoalsDetail = getStudentGoalsDetail;
window.getStudentCompensations = getStudentCompensations;

// Fonction de debug pour vérifier l'accès développeur
window.checkDevAccess = function() {
  try {
    var stored = localStorage.getItem('smartgrade_current');
    if (stored) {
      var user = JSON.parse(stored);
      if (user.name === 'HANS KEPPER' && user.class === 'B2' && user.number === 9) {
        console.log('[Dev] Access granted for', user.name);
        return true;
      }
    }
  } catch(e) {}
  console.log('[Dev] Access denied');
  return false;
};

// ============================================
// MAINTENANCE MODE - DÉTECTION UNIVERSELLE
// ============================================

(function detectMaintenance() {
  // Ne pas s'exécuter sur la page maintenance elle-même
  if (window.location.pathname.includes('maintenance.html')) {
    return;
  }
  
  // Ne pas s'exécuter deux fois
  if (sessionStorage.getItem('maintenance_check_done') === 'true') {
    return;
  }
  
  // Charger la configuration MAINTENANCE_MODE
  var maintenanceMode = false;
  
  try {
    // Vérifier si MAINTENANCE_MODE est défini globalement
    if (typeof MAINTENANCE_MODE !== 'undefined') {
      maintenanceMode = MAINTENANCE_MODE;
    }
    
    // Essayer de charger depuis le fichier de config (si disponible)
    // Certaines pages peuvent ne pas avoir chargé maintenance-config.js
    // On va vérifier via une requête synchrone (simple)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'maintenance-config.js', false);
    try {
      xhr.send();
      if (xhr.status === 200) {
        // Extraire la valeur de MAINTENANCE_MODE
        var configContent = xhr.responseText;
        var match = configContent.match(/MAINTENANCE_MODE\s*=\s*(true|false)/);
        if (match) {
          maintenanceMode = match[1] === 'true';
        }
      }
    } catch(e) {
      // Fichier non trouvé ou erreur, ignorer
    }
  } catch(e) {
    console.warn('[Maintenance] Erreur de détection:', e);
  }
  
  // Si maintenance activée, rediriger
  if (maintenanceMode === true) {
    console.log('[Maintenance] Mode activé - Redirection vers maintenance.html');
    sessionStorage.setItem('maintenance_check_done', 'true');
    window.location.href = 'maintenance.html';
  } else {
    // Marquer comme vérifié pour ne pas refaire la vérification
    sessionStorage.setItem('maintenance_check_done', 'true');
  }
})();




// Exposer globalement
window.forceApplyFontsToAllElements = forceApplyFontsToAllElements;

// Observer les changements de police
var fontObserver = new MutationObserver(function() {
  var newFont = localStorage.getItem('smartgrade_font_family');
  if (newFont !== window._lastAppliedFont) {
    window._lastAppliedFont = newFont;
    setTimeout(forceApplyFontsToAllElements, 50);
  }
});
fontObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

// Observer l'ajout de nouveaux éléments
var elementObserver = new MutationObserver(function(mutations) {
  var needUpdate = false;
  for (var i = 0; i < mutations.length; i++) {
    if (mutations[i].addedNodes.length > 0) {
      needUpdate = true;
      break;
    }
  }
  if (needUpdate) {
    setTimeout(forceApplyFontsToAllElements, 100);
  }
});
elementObserver.observe(document.body, { childList: true, subtree: true });
// ============================================
// FIN DE utils.js
// ============================================

// ============================================
// BOUT 1 : SERVICE WORKER - FORCE REGISTRATION
// ============================================

(function forceSWRegistration() {
  var excludedPages = ['offline.html', 'maintenance.html'];
  var currentPage = window.location.pathname.split('/').pop();
  
  if (excludedPages.indexOf(currentPage) !== -1) {
    console.log('[SW] Excluded page:', currentPage);
    return;
  }
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(function(registration) {
          console.log('[SW] Registered successfully');
          registration.update();
          if (navigator.serviceWorker.controller) {
            console.log('[SW] Controls this page');
          } else {
            console.log('[SW] Waiting to control page...');
            setTimeout(function() {
              if (!navigator.serviceWorker.controller) {
                window.location.reload();
              }
            }, 2000);
          }
        })
        .catch(function(error) {
          console.error('[SW] Registration failed:', error);
        });
    });
  } else {
    console.warn('[SW] Not supported');
  }
})();

// ============================================
// BOUT 2 : SERVICE WORKER - MESSAGE LISTENER
// ============================================

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log('[SW] Message received:', event.data);
  });
}

// ============================================
// FIN DE utils.js
// ============================================
console.log('Utils.js loaded');
console.log('[Font] Système de police forcée activé');
console.log('Utils.js chargé - Version corrigée');