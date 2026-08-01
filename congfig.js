// ============================================
// SMART GRADE v5.0 - CONFIGURATION
// ============================================

var APP_CONFIG = {
  // 🔑 TOKEN GITHUB
  githubTokenPart1: 'ghp_f4TjBSdBbxx8mlQXFK3RW',
  githubTokenPart2: 'OyRwKQwzo1z7Ei5',
  
  // 📦 GISTS - TOUS LES IDs SONT MAINTENANT À JOUR
  gists: {
    transfer: '1bfd71bdd3000bc36897dce828c4059d',
    homeworks: '235b10d5857c3c2ba651763084037d0d',  // ← NOUVEAU GIST
    chat: 'c5aecf9b63facc6fa6af50eee3dd4b1b',
    universal: '63e5bc65589c1ce622459ab48c167a1b'
  },
  
  // 📱 VERSION
  version: '5.0',
  codename: 'Ultimate',
  buildDate: '2026-07-08',
  
  // 🏫 ÉCOLE
  school: 'SIN GBHS FOUMBAN',
  className: 'Form 5B Science',
  academicYear: '2026-2027',
  
  // 👨‍💻 DÉVELOPPEUR
  developer: 'HANS KEPPER',
  email: 'hanskepper52@gmail.com',
  phone: '+237 698 640 885',
  country: 'Cameroon',
  github: 'hanskepper',
  
  // 📚 TRIMESTRES
  terms: [
    { id: 1, name: 'Term 1', sequences: [1, 2], months: 'Sep-Dec' },
    { id: 2, name: 'Term 2', sequences: [3, 4], months: 'Jan-Mar' },
    { id: 3, name: 'Term 3', sequences: [5, 6], months: 'Apr-Jun' }
  ],
  
  // 📊 NOTES
  grading: {
    max: 20,
    min: 0,
    passingGrade: 10,
    excellentGrade: 16,
    letters: [
      { min: 18, letter: 'A+', color: '#2ecc71' },
      { min: 16, letter: 'A', color: '#2ecc71' },
      { min: 14, letter: 'B+', color: '#3498db' },
      { min: 12, letter: 'B', color: '#3498db' },
      { min: 10, letter: 'C', color: '#f39c12' },
      { min: 8, letter: 'D', color: '#e67e22' },
      { min: 0, letter: 'F', color: '#e74c3c' }
    ]
  },
  
  // ⏱️ LIMITES
  limits: {
    maxSubjectsPerTerm: 14,
    minSubjectsPerTerm: 10,
    maxFavorites: 6,
    maxHistoryItems: 50,
    maxFlashcardsPerSubject: 100,
    defaultCoefficient: 5,
    pinLength: 4,
    transferCodeLength: 6,
    transferCodeExpiryMinutes: 10,
    maxAvatarSizeMB: 5,
    avatarResizeSize: 300,
    maxConversations: 50,
    maxBackups: 20
  },
  
  // 🔥 STREAKS
  streaks: {
    milestones: [3, 7, 15, 30],
    names: ['Beginner', 'Regular', 'Dedicated', 'Legendary']
  },
  
  // 🎨 THÈMES (20)
  themes: [
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
  ],
  
  // 🔤 POLICES (12)
  fonts: [
    { id: 'inter', name: 'Inter', google: 'Inter' },
    { id: 'roboto', name: 'Roboto', google: 'Roboto' },
    { id: 'cinzel', name: 'Cinzel', google: 'Cinzel' },
    { id: 'quicksand', name: 'Quicksand', google: 'Quicksand' },
    { id: 'courier-prime', name: 'Courier Prime', google: 'Courier+Prime' },
    { id: 'fredoka', name: 'Fredoka', google: 'Fredoka' },
    { id: 'pacifico', name: 'Pacifico', google: 'Pacifico' },
    { id: 'bangers', name: 'Bangers', google: 'Bangers' },
    { id: 'lobster', name: 'Lobster', google: 'Lobster' },
    { id: 'permanent-marker', name: 'Permanent Marker', google: 'Permanent+Marker' },
    { id: 'comfortaa', name: 'Comfortaa', google: 'Comfortaa' },
    { id: 'righteous', name: 'Righteous', google: 'Righteous' }
  ],
  
  // 🌙 MODE NUIT
  nightMode: {
    active: true,
    startHour: 20,
    endHour: 6,
    autoMode: true
  },
  
  // 🛠️ FONCTIONNALITÉS
  features: {
    pwa: true,
    offline: true,
    biometric: true,
    qrCode: true,
    camera: true,
    notifications: true,
    export: true,
    backup: true,
    flashcards: true,
    goals: true,
    timetable: true,
    achievements: true,
    streaks: true,
    chat: true,
    transfer: true,
    homework: true,
    cloudSync: true,
    aiAssistant: true,
    multiSearch: true,
    notebook: true,
    developerTools: true,
    autoSave: true,
    autoUpdate: true
  }
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function getGithubToken() {
  return APP_CONFIG.githubTokenPart1 + APP_CONFIG.githubTokenPart2;
}

function getGistId(type) {
  if (type && APP_CONFIG.gists[type]) {
    return APP_CONFIG.gists[type];
  }
  return APP_CONFIG.gists.universal || APP_CONFIG.gistId;
}

function getConfig() {
  return APP_CONFIG;
}

function getVersion() {
  return APP_CONFIG.version + ' ' + APP_CONFIG.codename;
}

function getSchoolInfo() {
  return APP_CONFIG.school + ' - ' + APP_CONFIG.className;
}

function isFeatureEnabled(feature) {
  return APP_CONFIG.features[feature] === true;
}

function getThemes() {
  return APP_CONFIG.themes;
}

function getFonts() {
  return APP_CONFIG.fonts;
}

// ============================================
// EXPORT (pour Node.js)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_CONFIG;
}

console.log('[Config] SMART GRADE v' + APP_CONFIG.version);
console.log('[Config] Gist Transfer:', APP_CONFIG.gists.transfer);
console.log('[Config] Gist Homeworks:', APP_CONFIG.gists.homeworks);
console.log('[Config] Gist Chat:', APP_CONFIG.gists.chat);
