// ============================================
// SMART GRADE v5.0 - DATA TRANSFER SYSTEM
// Transfert Local + En Ligne + QR Code
// ============================================

// ============================================
// GÉNÉRER UN CODE DE TRANSFERT LOCAL
// ============================================

function generateTransferCode(studentId) {
  cleanExpiredCodes();
  
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  var codes = JSON.parse(localStorage.getItem('smartgrade_transfer_codes') || '{}');
  codes[code] = {
    studentId: studentId,
    data: exportAllData(studentId),
    created: Date.now(),
    expires: Date.now() + (10 * 60 * 1000)
  };
  localStorage.setItem('smartgrade_transfer_codes', JSON.stringify(codes));
  
  return code;
}

// ============================================
// NETTOYER LES CODES EXPIRÉS
// ============================================

function cleanExpiredCodes() {
  var codes = JSON.parse(localStorage.getItem('smartgrade_transfer_codes') || '{}');
  var now = Date.now();
  var changed = false;
  
  Object.keys(codes).forEach(function(key) {
    if (codes[key].expires < now) {
      delete codes[key];
      changed = true;
    }
  });
  
  if (changed) {
    localStorage.setItem('smartgrade_transfer_codes', JSON.stringify(codes));
  }
}

// ============================================
// RÉCUPÉRER LES DONNÉES D'UN CODE
// ============================================

function getTransferData(code) {
  var codes = JSON.parse(localStorage.getItem('smartgrade_transfer_codes') || '{}');
  var entry = codes[code];
  
  if (!entry) return null;
  
  if (Date.now() > entry.expires) {
    delete codes[code];
    localStorage.setItem('smartgrade_transfer_codes', JSON.stringify(codes));
    return null;
  }
  
  return entry;
}

// ============================================
// EXPORTER TOUTES LES DONNÉES
// ============================================

function exportAllData(id) {
  var d = {
    version: '5.0',
    exportDate: new Date().toISOString(),
    student: getStudentById(id),
    grades: getStudentGrades(id),
    subjects: {
      term1: getStudentSelectedSubjects(id, 1),
      term2: getStudentSelectedSubjects(id, 2),
      term3: getStudentSelectedSubjects(id, 3)
    },
    coeffs: getSubjectCoefficients(id),
    achievements: JSON.parse(localStorage.getItem('smartgrade_achievements_' + id) || '[]'),
    goal: getStudentGoal(id),
    streak: getStudentStreak(id),
    compensations: JSON.parse(localStorage.getItem('smartgrade_compensations_' + id) || '{}'),
    history: JSON.parse(localStorage.getItem('smartgrade_history_' + id) || '[]'),
    profile: JSON.parse(localStorage.getItem('smartgrade_profile_' + id) || '{}'),
    flashcards: JSON.parse(localStorage.getItem('smartgrade_flashcards_' + id) || '[]'),
    goals: JSON.parse(localStorage.getItem('smartgrade_goals_detail_' + id) || '{}')
  };
  return JSON.stringify(d);
}

// ============================================
// IMPORTER TOUTES LES DONNÉES
// ============================================

function importAllData(id, json) {
  try {
    var d = typeof json === 'string' ? JSON.parse(json) : json;
    if (!d.version) throw new Error('Invalid backup file');
    
    if (d.grades) saveStudentGrades(id, d.grades);
    
    if (d.subjects) {
      if (d.subjects.term1) saveStudentSelectedSubjects(id, 1, d.subjects.term1);
      if (d.subjects.term2) saveStudentSelectedSubjects(id, 2, d.subjects.term2);
      if (d.subjects.term3) saveStudentSelectedSubjects(id, 3, d.subjects.term3);
    }
    
    if (d.coeffs) saveSubjectCoefficients(id, d.coeffs);
    if (d.achievements) localStorage.setItem('smartgrade_achievements_' + id, JSON.stringify(d.achievements));
    if (d.goal !== undefined) saveStudentGoal(id, d.goal);
    if (d.streak) saveStudentStreak(id, d.streak);
    if (d.compensations) localStorage.setItem('smartgrade_compensations_' + id, JSON.stringify(d.compensations));
    if (d.profile) localStorage.setItem('smartgrade_profile_' + id, JSON.stringify(d.profile));
    if (d.flashcards) localStorage.setItem('smartgrade_flashcards_' + id, JSON.stringify(d.flashcards));
    if (d.goals) localStorage.setItem('smartgrade_goals_detail_' + id, JSON.stringify(d.goals));
    if (d.history) localStorage.setItem('smartgrade_history_' + id, JSON.stringify(d.history));
    
    addHistory(id, 'Data imported from transfer');
    return { success: true, message: 'Data imported successfully!' };
    
  } catch (e) {
    return { success: false, message: 'Invalid data: ' + e.message };
  }
}

// ============================================
// COPIER DANS LE PRESSE-PAPIER
// ============================================

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Code copied! Paste it on the other device.');
    }).catch(function() {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Code copied! Paste it on the other device.');
  } catch (e) {
    prompt('Copy this code manually:', text);
  }
  document.body.removeChild(textarea);
}

// ============================================
// TÉLÉCHARGER UN FICHIER JSON
// ============================================

function downloadJSON(data, filename) {
  var blob = new Blob([data], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================
// EXPORTER (BACKUP)
// ============================================

function exportData(id) {
  var data = exportAllData(id);
  var filename = 'SMART_GRADE_Backup_' + new Date().toISOString().split('T')[0] + '.json';
  downloadJSON(data, filename);
  showToast('Backup downloaded successfully!');
}

// ============================================
// SYNCHRONISATION
// ============================================

function simulateSync(id) {
  var key = 'smartgrade_sync_' + id;
  var lastSync = JSON.parse(localStorage.getItem(key) || 'null');
  var currentData = {
    studentId: id,
    timestamp: Date.now(),
    data: exportAllData(id)
  };
  
  if (!lastSync) {
    localStorage.setItem(key, JSON.stringify(currentData));
    addHistory(id, 'First sync completed');
    return { synced: true, message: 'First sync completed' };
  }
  
  if (lastSync.timestamp >= currentData.timestamp) {
    return { synced: false, message: 'Already up to date' };
  }
  
  localStorage.setItem(key, JSON.stringify(currentData));
  addHistory(id, 'Sync completed');
  return { synced: true, message: 'Sync completed' };
}

// ============================================
// AFFICHER LE STATUT DE SYNCHRO
// ============================================

function showSyncStatus() {
  var student = JSON.parse(localStorage.getItem('smartgrade_current') || 'null');
  if (!student) return;
  var key = 'smartgrade_sync_' + student.id;
  var lastSync = JSON.parse(localStorage.getItem(key) || 'null');
  var el = document.getElementById('syncStatus');
  if (el) {
    el.innerHTML = lastSync
      ? '<i class="fas fa-cloud-check" style="color:#2ecc71;"></i> Last sync: ' + formatDate(new Date(lastSync.timestamp).toISOString())
      : '<i class="fas fa-cloud-upload-alt" style="color:#f39c12;"></i> Not synced yet';
  }
}

// ============================================
// COMMAND SYSTEM
// ============================================

var COMMANDS = {
  export: function(id) {
    var data = exportAllData(id);
    downloadJSON(data, 'Backup_' + new Date().toISOString().split('T')[0] + '.json');
    return 'Backup downloaded';
  },
  transfer: function(id) {
    var code = generateTransferCode(id);
    copyToClipboard(code);
    return 'Transfer code: ' + code + ' (copied to clipboard)';
  },
  refresh: function() {
    location.reload();
    return 'Refreshing...';
  },
  theme: function() {
    var themes = [
      {name:'default',label:'Deep Teal'},{name:'crimson',label:'Crimson'},{name:'forest',label:'Forest'},
      {name:'ocean',label:'Ocean'},{name:'royal',label:'Royal'},{name:'sunset',label:'Sunset'},
      {name:'rose',label:'Rose'},{name:'turquoise',label:'Turquoise'},{name:'amber',label:'Amber'},
      {name:'graphite',label:'Graphite'},{name:'lavender',label:'Lavender'},{name:'cherry',label:'Cherry'},
      {name:'midnight',label:'Midnight'},{name:'mint',label:'Mint'},{name:'coral',label:'Coral'},
      {name:'indigo',label:'Indigo'},{name:'chocolate',label:'Chocolate'},{name:'electric',label:'Electric'},
      {name:'steel',label:'Steel'},{name:'lime',label:'Lime'}
    ];
    var t = themes[Math.floor(Math.random() * themes.length)];
    document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
    document.body.classList.add('theme-' + t.name);
    localStorage.setItem('smartgrade_theme', t.name);
    return 'Theme: ' + t.label;
  },
  reset: function(id) {
    if (confirm('Delete ALL grades? This cannot be undone.')) {
      saveStudentGrades(id, []);
      return 'All grades deleted';
    }
    return 'Cancelled';
  },
  help: function() {
    return 'Commands: export, transfer, refresh, theme, reset, help, about, stats, random';
  },
  about: function() {
    return 'SMART GRADE v5.0 - GBHS Foumban\nBy HANS KEEPER';
  },
  stats: function(id) {
    var g = getStudentGrades(id);
    var o = calculateYearlyAverage(id);
    return 'Grades: ' + g.length + ' | Overall: ' + formatNumber(o) + '/20 | Letter: ' + getGradeLetter(o);
  },
  random: function() {
    var q = ['Keep pushing!', 'Every grade counts!', 'You are doing great!', 'Consistency is key!', 'Knowledge is power!', 'Stay focused!'];
    return q[Math.floor(Math.random() * q.length)];
  }
};

function executeCommand(cmd, id) {
  cmd = cmd.toLowerCase().trim();
  if (COMMANDS[cmd]) return COMMANDS[cmd](id);
  return 'Unknown command. Type "help" for list.';
}
