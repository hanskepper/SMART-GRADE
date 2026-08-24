// ============================================
// SMART GRADE v5.0 - DATABASE.JS
// AVEC AVATARS EN BASE64 (JSON)
// ============================================

// ============================================
// AVATARS PAR DÉFAUT (chargés depuis JSON)
// ============================================

var DEFAULT_AVATAR_BOY_BASE64 = null;
var DEFAULT_AVATAR_GIRL_BASE64 = null;
var avatarsLoaded = false;

// Charger les avatars depuis les fichiers JSON
async function loadDefaultAvatars() {
  if (avatarsLoaded) return;
  
  try {
    // Charger avatar garçon
    var boyResponse = await fetch('./icons/avatar-boy.json');
    if (boyResponse.ok) {
      var boyData = await boyResponse.json();
      DEFAULT_AVATAR_BOY_BASE64 = boyData.avatar || boyData.image || boyData.data;
    }
    
    // Charger avatar fille
    var girlResponse = await fetch('./icons/avatar-girl.json');
    if (girlResponse.ok) {
      var girlData = await girlResponse.json();
      DEFAULT_AVATAR_GIRL_BASE64 = girlData.avatar || girlData.image || girlData.data;
    }
    
    avatarsLoaded = true;
    console.log('[Avatars] Chargés depuis JSON');
  } catch(e) {
    console.error('[Avatars] Erreur:', e);
  }
}

// Obtenir l'avatar par défaut en Base64
function getDefaultAvatarBase64(gender) {
  if (gender === 'girl' && DEFAULT_AVATAR_GIRL_BASE64) {
    return DEFAULT_AVATAR_GIRL_BASE64;
  }
  if (gender === 'boy' && DEFAULT_AVATAR_BOY_BASE64) {
    return DEFAULT_AVATAR_BOY_BASE64;
  }
  return null;
}

// Obtenir le chemin PNG pour l'affichage (plus rapide)
function getDefaultAvatarPNG(gender) {
  return gender === 'girl' ? './icons/avatar-girl.png' : './icons/avatar-boy.png';
}

// ============================================
// TOAST SYSTEM
// ============================================

function showToast(message) {
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<i class="fas fa-info-circle"></i> ' + message;
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
  }, 3000);
}

// ============================================
// SUBJECTS CONSTANTS
// ============================================

var SUBJECT_ICONS = {
  1: 'fa-laptop-code',
  2: 'fa-square-root-variable',
  3: 'fa-flask',
  4: 'fa-dna',
  5: 'fa-mountain',
  6: 'fa-atom',
  7: 'fa-calculator',
  8: 'fa-leaf',
  9: 'fa-chart-line',
  10: 'fa-language',
  11: 'fa-earth-africa',
  12: 'fa-landmark',
  13: 'fa-flag',
  14: 'fa-apple-whole'
};

var DEFAULT_SUBJECTS = [
  { id: 1, name: "COMPUTER SCIENCES", code: "CS", coefficient: 5, icon: 'fa-laptop-code' },
  { id: 2, name: "MATHEMATICS", code: "MATH", coefficient: 5, icon: 'fa-square-root-variable' },
  { id: 3, name: "CHEMISTRY", code: "CHM", coefficient: 5, icon: 'fa-flask' },
  { id: 4, name: "HUMAN BIOLOGY", code: "HBIO", coefficient: 5, icon: 'fa-dna' },
  { id: 5, name: "GEOLOGY", code: "GEL", coefficient: 5, icon: 'fa-mountain' },
  { id: 6, name: "PHYSICS", code: "PHY", coefficient: 5, icon: 'fa-atom' },
  { id: 7, name: "ADDITIONAL MATHEMATICS", code: "AMATH", coefficient: 5, icon: 'fa-calculator' },
  { id: 8, name: "BIOLOGY", code: "BIO", coefficient: 5, icon: 'fa-leaf' },
  { id: 9, name: "ECONOMICS", code: "ECO", coefficient: 5, icon: 'fa-chart-line' },
  { id: 10, name: "ENGLISH LANGUAGE", code: "ENG", coefficient: 5, icon: 'fa-language' },
  { id: 11, name: "GEOGRAPHY", code: "GEO", coefficient: 5, icon: 'fa-earth-africa' },
  { id: 12, name: "CITIZENSHIP", code: "CIV", coefficient: 5, icon: 'fa-landmark' },
  { id: 13, name: "FRENCH", code: "FR", coefficient: 5, icon: 'fa-flag' },
  { id: 14, name: "FOOD AND NUTRITION", code: "FDN", coefficient: 5, icon: 'fa-apple-whole' }
];

// ============================================
// 22 BADGES ACHIEVEMENT
// ============================================
var ACHIEVEMENTS = [
  { id: 38, name: "Welcome Aboard", desc: "First login after installation" },
  { id: 36, name: "Photo Uploader", desc: "Add a profile photo" },
  { id: 1, name: "First Grade", desc: "Add your very first grade" },
  { id: 2, name: "Perfect Score", desc: "Get 20/20 in any subject" },
  { id: 3, name: "High Average", desc: "Overall average 12/20 and above" },
  { id: 4, name: "Bookworm", desc: "Record 10+ grades" },
  { id: 5, name: "Dedication", desc: "Record 30+ grades" },
  { id: 6, name: "Scholar", desc: "Unlock 8 achievements" },
  { id: 7, name: "Rising Star", desc: "Improve by 1+ point in a term" },
  { id: 8, name: "Unstoppable", desc: "All 3 terms have grades entered" },
  { id: 9, name: "Subject Completion", desc: "Add grades in all subjects of a term" },
  { id: 10, name: "Active Semester", desc: "Complete a full term (all sequences)" },
  { id: 11, name: "Discipline Mastery", desc: "Average above 15 in one subject" },
  { id: 12, name: "Study Progress", desc: "Record 25+ grades" },
  { id: 13, name: "Full Achievement", desc: "Unlock ALL 22 achievement badges" },
  { id: 14, name: "Excellent Result", desc: "Get 20/20 in a subject" },
  { id: 25, name: "Comeback King", desc: "Improve by 5+ points between sequences" },
  { id: 34, name: "Theme Collector", desc: "Try 10 different themes" },
  { id: 50, name: "Font Collector", desc: "Try 6 different fonts" },
  { id: 57, name: "Timetable Viewer", desc: "View timetable 10 times" },
  { id: 58, name: "Flashcard Beginner", desc: "Create 5 custom flashcards" },
  { id: 59, name: "Flashcard Master", desc: "Create 10 custom flashcards" }
];

// ============================================
// STUDENTS MANAGEMENT
// ============================================

function getAllStudents() {
  var d = localStorage.getItem('smartgrade_students');
  if (!d) return [];
  try { return JSON.parse(d); } catch(e) { return []; }
}

function saveAllStudents(s) {
  localStorage.setItem('smartgrade_students', JSON.stringify(s));
}

function getStudentById(id) {
  var students = getAllStudents();
  for (var i = 0; i < students.length; i++) {
    if (students[i].id === id) return students[i];
  }
  return null;
}

function createStudentAccount(name, number, className, pin, gender) {
  var s = getAllStudents();
  for (var i = 0; i < s.length; i++) {
    if (s[i].class === className && s[i].number === number) {
      return { success: false, message: 'Number ' + number + ' already taken in ' + className };
    }
  }
  
  var nid = s.length > 0 ? Math.max.apply(null, s.map(function(x) { return x.id; })) + 1 : 1;
  
  var st = {
    id: nid,
    name: name,
    number: number,
    class: className,
    pin: pin,
    gender: gender || 'boy',
    createdAt: new Date().toISOString(),
    hasFingerprint: false,
    fingerprintHash: null
  };
  
  s.push(st);
  saveAllStudents(s);
  saveStudentGrades(nid, []);
  saveStudentAchievements(nid, []);
  
  for (var t = 1; t <= 3; t++) {
    saveStudentSelectedSubjects(nid, t, DEFAULT_SUBJECTS.map(function(x) { return x.id; }));
  }
  
  var c = {};
  DEFAULT_SUBJECTS.forEach(function(x) { c[x.id] = 5; });
  saveSubjectCoefficients(nid, c);
  saveStudentGoal(nid, 12);
  saveStudentStreak(nid, { days: 0, lastLogin: null });
  
  saveProfile(nid, { 
    avatarBase64: '', 
    bio: '', 
    gender: gender
  });
  
  return { success: true, student: st };
}

function deleteStudent(id) {
  var s = getAllStudents().filter(function(x) { return x.id !== id; });
  saveAllStudents(s);
  var keys = [
    'smartgrade_grades_', 'smartgrade_achievements_', 'smartgrade_coeffs_',
    'smartgrade_goal_', 'smartgrade_streak_', 'smartgrade_compensations_',
    'smartgrade_history_', 'smartgrade_sync_', 'smartgrade_profile_',
    'smartgrade_flashcards_', 'smartgrade_goals_detail_', 'smartgrade_used_themes_',
    'smartgrade_used_fonts_', 'smartgrade_welcome_badge_', 'smartgrade_timetable_views_'
  ];
  for (var i = 0; i < keys.length; i++) {
    localStorage.removeItem(keys[i] + id);
  }
  for (var t = 1; t <= 3; t++) {
    localStorage.removeItem('smartgrade_selected_' + id + '_term' + t);
  }
}

function getUsedNumbersInClass(c) {
  var students = getAllStudents();
  var numbers = [];
  for (var i = 0; i < students.length; i++) {
    if (students[i].class === c) numbers.push(students[i].number);
  }
  return numbers;
}

function getCurrentStudent() {
  var d = localStorage.getItem('smartgrade_current');
  if (!d) return null;
  try {
    var p = JSON.parse(d);
    return getStudentById(p.id);
  } catch(e) { return null; }
}

function setCurrentStudent(s) {
  localStorage.setItem('smartgrade_current', JSON.stringify({
    id: s.id,
    name: s.name,
    number: s.number,
    class: s.class,
    gender: s.gender || 'boy'
  }));
}

function clearCurrentStudent() {
  localStorage.removeItem('smartgrade_current');
}

// ============================================
// GENDER FUNCTIONS
// ============================================

function getStudentGender(studentId) {
  var student = getStudentById(studentId);
  return student ? (student.gender || 'boy') : 'boy';
}

// ============================================
// GRADES MANAGEMENT
// ============================================

function getStudentGrades(id) {
  var d = localStorage.getItem('smartgrade_grades_' + id);
  if (!d) return [];
  try { return JSON.parse(d); } catch(e) { return []; }
}

function saveStudentGrades(id, g) {
  localStorage.setItem('smartgrade_grades_' + id, JSON.stringify(g));
}

// ============================================
// SUBJECTS MANAGEMENT
// ============================================

function getStudentSelectedSubjects(id, term) {
  var d = localStorage.getItem('smartgrade_selected_' + id + '_term' + term);
  if (!d) return DEFAULT_SUBJECTS.map(function(s) { return s.id; });
  try { return JSON.parse(d); } catch(e) { return DEFAULT_SUBJECTS.map(function(s) { return s.id; }); }
}

function saveStudentSelectedSubjects(id, term, subjs) {
  localStorage.setItem('smartgrade_selected_' + id + '_term' + term, JSON.stringify(subjs));
}

function getActiveSubjectsWithCoefficients(id, term) {
  var sel = getStudentSelectedSubjects(id, term);
  return DEFAULT_SUBJECTS.filter(function(s) { return sel.indexOf(s.id) !== -1; }).map(function(s) {
    s.coefficient = getSubjectCoefficient(id, s.id);
    return s;
  });
}

function getSubjectCoefficients(id) {
  var d = localStorage.getItem('smartgrade_coeffs_' + id);
  if (!d) {
    var c = {};
    DEFAULT_SUBJECTS.forEach(function(s) { c[s.id] = 5; });
    return c;
  }
  try { return JSON.parse(d); } catch(e) {
    var c = {};
    DEFAULT_SUBJECTS.forEach(function(s) { c[s.id] = 5; });
    return c;
  }
}

function getSubjectCoefficient(id, sid) {
  var c = getSubjectCoefficients(id);
  return c[sid] || 5;
}

function saveSubjectCoefficients(id, c) {
  localStorage.setItem('smartgrade_coeffs_' + id, JSON.stringify(c));
}

// ============================================
// CALCULATIONS
// ============================================

function getSubjectSequenceAverage(sid, seq, grades) {
  var sg = grades.filter(function(g) { return g.subjectId === sid && g.sequenceId === seq; });
  if (sg.length === 0) return 0;
  var sum = 0;
  for (var i = 0; i < sg.length; i++) sum += sg[i].value;
  return Math.round((sum / sg.length) * 100) / 100;
}

function calculateSubjectTermAverage(sid, term, grades) {
  var seq = getSequencesForTerm(term);
  var tg = grades.filter(function(g) { return g.subjectId === sid && (g.sequenceId === seq[0] || g.sequenceId === seq[1]); });
  if (tg.length === 0) return 0;
  var sum = 0;
  for (var i = 0; i < tg.length; i++) sum += tg[i].value;
  return Math.round((sum / tg.length) * 100) / 100;
}

function calculateStudentTermAverage(id, term) {
  var subs = getActiveSubjectsWithCoefficients(id, term);
  var grades = getStudentGrades(id);
  var totalWeighted = 0;
  var totalCoeff = 0;
  for (var i = 0; i < subs.length; i++) {
    var avg = calculateSubjectTermAverage(subs[i].id, term, grades);
    totalWeighted += avg * subs[i].coefficient;
    totalCoeff += subs[i].coefficient;
  }
  return totalCoeff > 0 ? Math.round((totalWeighted / totalCoeff) * 100) / 100 : 0;
}

function calculateYearlyAverage(id) {
  var t1 = calculateStudentTermAverage(id, 1);
  var t2 = calculateStudentTermAverage(id, 2);
  var t3 = calculateStudentTermAverage(id, 3);
  return Math.round(((t1 + t2 + t3) / 3) * 100) / 100;
}

// ============================================
// ACHIEVEMENTS
// ============================================

function getStudentAchievements(id) {
  var d = localStorage.getItem('smartgrade_achievements_' + id);
  if (!d) return [];
  try { return JSON.parse(d); } catch(e) { return []; }
}

function saveStudentAchievements(id, a) {
  localStorage.setItem('smartgrade_achievements_' + id, JSON.stringify(a));
}

// ============================================
// GOAL
// ============================================

function getStudentGoal(id) {
  var d = localStorage.getItem('smartgrade_goal_' + id);
  if (!d) return 12;
  try { return parseFloat(d); } catch(e) { return 12; }
}

function saveStudentGoal(id, g) {
  localStorage.setItem('smartgrade_goal_' + id, g);
}

// ============================================
// STREAK MANAGEMENT
// ============================================

function getStudentStreak(id) {
  var d = localStorage.getItem('smartgrade_streak_' + id);
  if (!d) return { days: 0, lastLogin: null };
  try { return JSON.parse(d); } catch(e) { return { days: 0, lastLogin: null }; }
}

function saveStudentStreak(id, s) {
  localStorage.setItem('smartgrade_streak_' + id, JSON.stringify(s));
}

function updateStreakOnVisit(id) {
  if (!id) return;
  var s = getStudentStreak(id);
  var today = new Date().toISOString().split('T')[0];
  
  if (!s.lastLogin) {
    s = { days: 1, lastLogin: today };
    saveStudentStreak(id, s);
    return s;
  }
  
  var ld = new Date(s.lastLogin);
  var cd = new Date(today);
  var diff = Math.floor((cd - ld) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return s;
  
  if (diff === 1) {
    s.days += 1;
    s.lastLogin = today;
    saveStudentStreak(id, s);
    return s;
  }
  
  s = { days: 1, lastLogin: today };
  saveStudentStreak(id, s);
  return s;
}

// ============================================
// THEME & FONT
// ============================================

function getSavedTheme() {
  return localStorage.getItem('smartgrade_theme') || 'default';
}

function saveTheme(t) {
  localStorage.setItem('smartgrade_theme', t);
}

function getSavedFontSize() {
  return localStorage.getItem('smartgrade_font') || 'medium';
}

function saveFontSize(f) {
  localStorage.setItem('smartgrade_font', f);
}

// ============================================
// COMPENSATION
// ============================================

function applyCompensation(studentId, termNum, removedSubjectId) {
  var grades = getStudentGrades(studentId);
  var subs = getActiveSubjectsWithCoefficients(studentId, termNum);
  var termAvg = calculateStudentTermAverage(studentId, termNum);
  var subjAvg = calculateSubjectTermAverage(removedSubjectId, termNum, grades);
  var remaining = subs.filter(function(s) { return s.id !== removedSubjectId; });
  if (remaining.length === 0) return { success: false, message: 'Need at least 1 remaining subject' };
  var gap = Math.round((subjAvg - termAvg) * 100) / 100;
  var adj = Math.round((gap / remaining.length) * 100) / 100;
  var seq1 = (termNum - 1) * 2 + 1;
  var seq2 = seq1 + 1;
  for (var i = 0; i < remaining.length; i++) {
    var s = remaining[i];
    var g1 = null;
    var g2 = null;
    for (var k = 0; k < grades.length; k++) {
      if (grades[k].subjectId === s.id && grades[k].sequenceId === seq1) g1 = grades[k];
      if (grades[k].subjectId === s.id && grades[k].sequenceId === seq2) g2 = grades[k];
    }
    if (g1 && g1.value > 0) {
      g1.value = Math.round((g1.value + adj) * 100) / 100;
    }
    if (g2 && g2.value > 0) {
      g2.value = Math.round((g2.value + adj) * 100) / 100;
    }
  }
  saveStudentGrades(studentId, grades);
  var newSel = getStudentSelectedSubjects(studentId, termNum).filter(function(id) { return id !== removedSubjectId; });
  saveStudentSelectedSubjects(studentId, termNum, newSel);
  var compData = {
    termNum: termNum,
    removedSubjectId: removedSubjectId,
    removedAvg: subjAvg,
    termAvgBefore: termAvg,
    termAvgAfter: calculateStudentTermAverage(studentId, termNum),
    adjustment: adj,
    date: new Date().toISOString()
  };
  var comps = getAllComps(studentId);
  comps[termNum] = compData;
  saveAllComps(studentId, comps);
  
  return { success: true, data: compData };
}

function getAllComps(studentId) {
  var d = localStorage.getItem('smartgrade_compensations_' + studentId);
  return d ? JSON.parse(d) : {};
}

function saveAllComps(studentId, comps) {
  localStorage.setItem('smartgrade_compensations_' + studentId, JSON.stringify(comps));
}

// ============================================
// PROFILE - AVEC AVATARS EN BASE64 (JSON)
// ============================================

function getProfile(studentId) {
  var d = localStorage.getItem('smartgrade_profile_' + studentId);
  var student = getStudentById(studentId);
  var gender = (student && student.gender) || 'boy';
  
  if (!d) {
    var defaultProfile = { 
      avatarBase64: '', 
      bio: '', 
      favorites: []
    };
    saveProfile(studentId, defaultProfile);
    return defaultProfile;
  }
  try {
    var p = JSON.parse(d);
    return {
      avatarBase64: p.avatarBase64 || '',
      bio: p.bio || '',
      favorites: p.favorites || []
    };
  } catch(e) {
    return { avatarBase64: '', bio: '', favorites: [] };
  }
}

function saveProfile(studentId, profile) {
  localStorage.setItem('smartgrade_profile_' + studentId, JSON.stringify(profile));
}

// Obtenir l'avatar par défaut (PNG pour affichage rapide)
function getDefaultAvatarPNG(gender) {
  return gender === 'girl' ? './icons/avatar-girl.png' : './icons/avatar-boy.png';
}

// Obtenir l'avatar par défaut en Base64 depuis JSON
async function getDefaultAvatarBase64Async(gender) {
  if (!avatarsLoaded) {
    await loadDefaultAvatars();
  }
  if (gender === 'girl' && DEFAULT_AVATAR_GIRL_BASE64) {
    return DEFAULT_AVATAR_GIRL_BASE64;
  }
  if (gender === 'boy' && DEFAULT_AVATAR_BOY_BASE64) {
    return DEFAULT_AVATAR_BOY_BASE64;
  }
  return null;
}

// ============================================
// FLASHCARDS
// ============================================

function getFlashcards(studentId) {
  var d = localStorage.getItem('smartgrade_flashcards_' + studentId);
  if (!d) return [];
  try { return JSON.parse(d); } catch(e) { return []; }
}

function saveFlashcards(studentId, cards) {
  localStorage.setItem('smartgrade_flashcards_' + studentId, JSON.stringify(cards));
}

// ============================================
// GOALS DETAIL
// ============================================

function getGoalsDetail(studentId) {
  var d = localStorage.getItem('smartgrade_goals_detail_' + studentId);
  if (!d) return {};
  try { return JSON.parse(d); } catch(e) { return {}; }
}

function saveGoalsDetail(studentId, goals) {
  localStorage.setItem('smartgrade_goals_detail_' + studentId, JSON.stringify(goals));
}

// ============================================
// BADGE FUNCTIONS
// ============================================

function unlockWelcomeBadge(studentId) {
  if (!studentId) return false;
  
  var achievements = getStudentAchievements(studentId);
  for (var i = 0; i < achievements.length; i++) {
    if (achievements[i].id === 38 && achievements[i].unlocked) return true;
  }
  
  achievements.push({
    id: 38,
    name: "Welcome Aboard",
    desc: "First login after installation",
    unlocked: true,
    unlockDate: new Date().toLocaleDateString(),
    notified: false
  });
  saveStudentAchievements(studentId, achievements);
  showToast('Badge unlocked: Welcome Aboard!');
  return true;
}

function checkFirstGradeBadge(studentId) {
  var grades = getStudentGrades(studentId);
  if (grades.length >= 1) {
    unlockBadgeById(studentId, 1);
  }
}

function checkPerfectScoreBadge(studentId) {
  var grades = getStudentGrades(studentId);
  for (var i = 0; i < grades.length; i++) {
    if (grades[i].value >= 19.95) {
      unlockBadgeById(studentId, 2);
      break;
    }
  }
}

function checkHighAverageBadge(studentId) {
  var yearly = calculateYearlyAverage(studentId);
  if (yearly >= 12) {
    unlockBadgeById(studentId, 3);
  }
}

function checkBookwormBadge(studentId) {
  var grades = getStudentGrades(studentId);
  if (grades.length >= 10) {
    unlockBadgeById(studentId, 4);
  }
}

function checkDedicationBadge(studentId) {
  var grades = getStudentGrades(studentId);
  if (grades.length >= 30) {
    unlockBadgeById(studentId, 5);
  }
}

function checkScholarBadge(studentId) {
  var achievements = getStudentAchievements(studentId);
  var unlocked = 0;
  for (var i = 0; i < achievements.length; i++) {
    if (achievements[i].unlocked && achievements[i].id !== 13) unlocked++;
  }
  if (unlocked >= 8) {
    unlockBadgeById(studentId, 6);
  }
}

function checkRisingStarBadge(studentId) {
  var t1 = calculateStudentTermAverage(studentId, 1);
  var t2 = calculateStudentTermAverage(studentId, 2);
  var t3 = calculateStudentTermAverage(studentId, 3);
  if ((t2 - t1 >= 1) || (t3 - t2 >= 1)) {
    unlockBadgeById(studentId, 7);
  }
}

function checkUnstoppableBadge(studentId) {
  var t1 = calculateStudentTermAverage(studentId, 1);
  var t2 = calculateStudentTermAverage(studentId, 2);
  var t3 = calculateStudentTermAverage(studentId, 3);
  if (t1 > 0 && t2 > 0 && t3 > 0) {
    unlockBadgeById(studentId, 8);
  }
}

function checkSubjectCompletionBadge(studentId) {
  for (var term = 1; term <= 3; term++) {
    var selected = getStudentSelectedSubjects(studentId, term);
    var grades = getStudentGrades(studentId);
    var allHaveGrades = true;
    for (var i = 0; i < selected.length; i++) {
      var hasGrade = false;
      for (var k = 0; k < grades.length; k++) {
        if (grades[k].subjectId === selected[i]) {
          hasGrade = true;
          break;
        }
      }
      if (!hasGrade) {
        allHaveGrades = false;
        break;
      }
    }
    if (allHaveGrades && selected.length > 0) {
      unlockBadgeById(studentId, 9);
      break;
    }
  }
}

function checkActiveSemesterBadge(studentId) {
  for (var term = 1; term <= 3; term++) {
    var selected = getStudentSelectedSubjects(studentId, term);
    var grades = getStudentGrades(studentId);
    var allComplete = true;
    var seq1 = (term - 1) * 2 + 1;
    var seq2 = seq1 + 1;
    for (var i = 0; i < selected.length; i++) {
      var hasSeq1 = false;
      var hasSeq2 = false;
      for (var k = 0; k < grades.length; k++) {
        if (grades[k].subjectId === selected[i] && grades[k].sequenceId === seq1) hasSeq1 = true;
        if (grades[k].subjectId === selected[i] && grades[k].sequenceId === seq2) hasSeq2 = true;
      }
      if (!hasSeq1 || !hasSeq2) {
        allComplete = false;
        break;
      }
    }
    if (allComplete && selected.length > 0) {
      unlockBadgeById(studentId, 10);
      break;
    }
  }
}

function checkDisciplineMasteryBadge(studentId) {
  var grades = getStudentGrades(studentId);
  var subjects = {};
  for (var i = 0; i < grades.length; i++) {
    if (!subjects[grades[i].subjectId]) subjects[grades[i].subjectId] = [];
    subjects[grades[i].subjectId].push(grades[i].value);
  }
  for (var subj in subjects) {
    var sum = 0;
    for (var j = 0; j < subjects[subj].length; j++) sum += subjects[subj][j];
    var avg = sum / subjects[subj].length;
    if (avg >= 15) {
      unlockBadgeById(studentId, 11);
      break;
    }
  }
}

function checkStudyProgressBadge(studentId) {
  var grades = getStudentGrades(studentId);
  if (grades.length >= 25) {
    unlockBadgeById(studentId, 12);
  }
}

function checkFullAchievementBadge(studentId) {
  var achievements = getStudentAchievements(studentId);
  var requiredBadges = [1,2,3,4,5,6,7,8,9,10,11,12,14,25,34,36,38,50,57,58,59];
  var unlockedCount = 0;
  
  for (var i = 0; i < achievements.length; i++) {
    if (achievements[i].unlocked && requiredBadges.indexOf(achievements[i].id) !== -1) {
      unlockedCount++;
    }
  }
  
  if (unlockedCount >= requiredBadges.length) {
    unlockBadgeById(studentId, 13);
  }
}

function checkExcellentResultBadge(studentId) {
  var grades = getStudentGrades(studentId);
  for (var i = 0; i < grades.length; i++) {
    if (grades[i].value >= 19.95) {
      unlockBadgeById(studentId, 14);
      break;
    }
  }
}

function checkComebackBadge(studentId) {
  var grades = getStudentGrades(studentId);
  var subjects = {};
  
  for (var i = 0; i < grades.length; i++) {
    var g = grades[i];
    if (!subjects[g.subjectId]) subjects[g.subjectId] = [];
    subjects[g.subjectId].push({
      sequenceId: g.sequenceId,
      value: g.value
    });
  }
  
  for (var subjId in subjects) {
    var notes = subjects[subjId];
    notes.sort(function(a, b) {
      return a.sequenceId - b.sequenceId;
    });
    
    for (var i = 1; i < notes.length; i++) {
      var prevValue = notes[i-1].value;
      var currentValue = notes[i].value;
      var improvement = currentValue - prevValue;
      
      if (improvement >= 5) {
        unlockBadgeById(studentId, 25);
        return true;
      }
    }
  }
}

function trackThemeUsage(studentId, themeName) {
  var usedThemes = JSON.parse(localStorage.getItem('smartgrade_used_themes_' + studentId) || '[]');
  var alreadyUsed = false;
  for (var i = 0; i < usedThemes.length; i++) {
    if (usedThemes[i] === themeName) {
      alreadyUsed = true;
      break;
    }
  }
  if (!alreadyUsed) {
    usedThemes.push(themeName);
    localStorage.setItem('smartgrade_used_themes_' + studentId, JSON.stringify(usedThemes));
    if (usedThemes.length >= 10) {
      unlockBadgeById(studentId, 34);
    }
  }
}

function checkPhotoBadge(studentId) {
  var profile = getProfile(studentId);
  if (profile.avatarBase64 && profile.avatarBase64 !== '' && profile.avatarBase64.length > 100) {
    unlockBadgeById(studentId, 36);
  }
}

function trackFontUsage(studentId, fontId) {
  var usedFonts = JSON.parse(localStorage.getItem('smartgrade_used_fonts_' + studentId) || '[]');
  var alreadyUsed = false;
  for (var i = 0; i < usedFonts.length; i++) {
    if (usedFonts[i] === fontId) {
      alreadyUsed = true;
      break;
    }
  }
  if (!alreadyUsed) {
    usedFonts.push(fontId);
    localStorage.setItem('smartgrade_used_fonts_' + studentId, JSON.stringify(usedFonts));
    if (usedFonts.length >= 6) {
      unlockBadgeById(studentId, 50);
    }
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
  var customCount = 0;
  for (var i = 0; i < cards.length; i++) {
    if (!cards[i].isOriginal) customCount++;
  }
  if (customCount >= 5) unlockBadgeById(studentId, 58);
  if (customCount >= 10) unlockBadgeById(studentId, 59);
}

// ============================================
// UNLOCK BADGE (fonction principale)
// ============================================

function unlockBadgeById(studentId, badgeId) {
  if (!studentId) return false;
  
  var achievements = getStudentAchievements(studentId);
  var existing = null;
  for (var i = 0; i < achievements.length; i++) {
    if (achievements[i].id === badgeId) {
      existing = achievements[i];
      break;
    }
  }
  
  if (existing && existing.unlocked) return true;
  
  var badge = null;
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    if (ACHIEVEMENTS[i].id === badgeId) {
      badge = ACHIEVEMENTS[i];
      break;
    }
  }
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
  
  var msg = 'Badge unlocked: ' + badge.name;
  console.log(msg);
  showToast(msg);
  
  if (badgeId !== 13) {
    checkFullAchievementBadge(studentId);
  }
  
  return true;
}

// ============================================
// CHECK ALL BADGES
// ============================================

function checkAndUnlockAllNewBadges(studentId) {
  if (!studentId) return;
  
  unlockWelcomeBadge(studentId);
  checkFirstGradeBadge(studentId);
  checkPerfectScoreBadge(studentId);
  checkHighAverageBadge(studentId);
  checkBookwormBadge(studentId);
  checkDedicationBadge(studentId);
  checkScholarBadge(studentId);
  checkRisingStarBadge(studentId);
  checkUnstoppableBadge(studentId);
  checkSubjectCompletionBadge(studentId);
  checkActiveSemesterBadge(studentId);
  checkDisciplineMasteryBadge(studentId);
  checkStudyProgressBadge(studentId);
  checkExcellentResultBadge(studentId);
  checkComebackBadge(studentId);
  checkPhotoBadge(studentId);
  checkFlashcardBadges(studentId);
  
  checkFullAchievementBadge(studentId);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getSequencesForTerm(term) {
  var s = (term - 1) * 2 + 1;
  return [s, s + 1];
}

function roundToTwo(num) {
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

// ============================================
// MIGRATION DES UTILISATEURS EXISTANTS
// ============================================

function migrateExistingUsersGender() {
  var students = getAllStudents();
  var modified = false;
  
  for (var i = 0; i < students.length; i++) {
    if (!students[i].gender) {
      var name = students[i].name.toLowerCase();
      var girlIndicators = ['a', 'e', 'ia', 'na', 'la', 'ma', 'elle', 'ina', 'ette'];
      var isGirl = false;
      for (var g = 0; g < girlIndicators.length; g++) {
        if (name.endsWith(girlIndicators[g])) {
          isGirl = true;
          break;
        }
      }
      students[i].gender = isGirl ? 'girl' : 'boy';
      modified = true;
      console.log('[Migration]', students[i].name, '→', students[i].gender);
    }
  }
  
  if (modified) {
    saveAllStudents(students);
    console.log('[Migration] Migration des genres terminée');
  }
}

// ============================================
// INITIALISATION
// ============================================

// Charger les avatars au démarrage
loadDefaultAvatars();

// Migrer les utilisateurs existants
migrateExistingUsersGender();

// ============================================
// EXPORT GLOBAL FUNCTIONS
// ============================================

window.getCurrentStudent = getCurrentStudent;
window.getStudentById = getStudentById;
window.getAllStudents = getAllStudents;
window.getStudentGrades = getStudentGrades;
window.saveStudentGrades = saveStudentGrades;
window.getStudentAchievements = getStudentAchievements;
window.saveStudentAchievements = saveStudentAchievements;
window.getStudentStreak = getStudentStreak;
window.saveStudentStreak = saveStudentStreak;
window.updateStreakOnVisit = updateStreakOnVisit;
window.getStudentSelectedSubjects = getStudentSelectedSubjects;
window.saveStudentSelectedSubjects = saveStudentSelectedSubjects;
window.getSubjectCoefficients = getSubjectCoefficients;
window.getSubjectCoefficient = getSubjectCoefficient;
window.saveSubjectCoefficients = saveSubjectCoefficients;
window.getActiveSubjectsWithCoefficients = getActiveSubjectsWithCoefficients;
window.calculateStudentTermAverage = calculateStudentTermAverage;
window.calculateSubjectTermAverage = calculateSubjectTermAverage;
window.calculateYearlyAverage = calculateYearlyAverage;
window.getProfile = getProfile;
window.saveProfile = saveProfile;
window.getFlashcards = getFlashcards;
window.saveFlashcards = saveFlashcards;
window.getGoalsDetail = getGoalsDetail;
window.saveGoalsDetail = saveGoalsDetail;
window.applyCompensation = applyCompensation;
window.getAllComps = getAllComps;
window.saveAllComps = saveAllComps;
window.checkAndUnlockAllNewBadges = checkAndUnlockAllNewBadges;
window.unlockBadgeById = unlockBadgeById;
window.trackThemeUsage = trackThemeUsage;
window.trackFontUsage = trackFontUsage;
window.incrementTimetableView = incrementTimetableView;
window.checkFlashcardBadges = checkFlashcardBadges;
window.checkPhotoBadge = checkPhotoBadge;
window.unlockWelcomeBadge = unlockWelcomeBadge;
window.getSavedTheme = getSavedTheme;
window.saveTheme = saveTheme;
window.getSavedFontSize = getSavedFontSize;
window.saveFontSize = saveFontSize;
window.getSequencesForTerm = getSequencesForTerm;
window.roundToTwo = roundToTwo;
window.showToast = showToast;
window.getStudentGender = getStudentGender;
window.getDefaultAvatarPNG = getDefaultAvatarPNG;
window.getDefaultAvatarBase64Async = getDefaultAvatarBase64Async;

console.log('Database.js chargé - Version avec avatars PNG + JSON');