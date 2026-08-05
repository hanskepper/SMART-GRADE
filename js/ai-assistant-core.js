// ============================================
// SMART GRADE - AI ASSISTANT (CORE)
// STREAMING + TYPEWRITER INTELLIGENT
// Détection LaTeX - Rendu complet des équations
// ============================================

// ============================================
// CONFIGURATION
// ============================================

const GROQ_TOKEN_PART1 = 'gsk_IHPePgnuqvsG';
const GROQ_TOKEN_PART2 = 'DtlktY3KWGdyb3FY';
const GROQ_TOKEN_PART3 = 'C0w55WOKIDEb5XpEH1IdpSSD';

const MISTRAL_TOKEN_PART1 = 'TQatuY13B8';
const MISTRAL_TOKEN_PART2 = 'TdBEz09H2BP';
const MISTRAL_TOKEN_PART3 = 'U22lfbSsbae';

function getGroqToken() {
  return GROQ_TOKEN_PART1 + GROQ_TOKEN_PART2 + GROQ_TOKEN_PART3;
}

function getMistralToken() {
  return MISTRAL_TOKEN_PART1 + MISTRAL_TOKEN_PART2 + MISTRAL_TOKEN_PART3;
}

const MODELS = {
  'groq': { 
    name: 'Groq', 
    url: 'https://api.groq.com/openai/v1/chat/completions', 
    model: 'qwen/qwen3.6-27b', 
    auth: 'Bearer ' + getGroqToken(),
    available: true,
    supportsStreaming: true
  },
  'mistral-devstral': { 
    name: 'Devstral', 
    url: 'https://api.mistral.ai/v1/chat/completions', 
    model: 'devstral-medium-latest', 
    auth: 'Bearer ' + getMistralToken(),
    available: true,
    supportsStreaming: true
  },
  'mistral-codestral': { 
    name: 'Codestral', 
    url: 'https://api.mistral.ai/v1/chat/completions', 
    model: 'codestral-latest', 
    auth: 'Bearer ' + getMistralToken(),
    available: true,
    supportsStreaming: true
  }
};

const SUBJECTS_LIST = ["COMPUTER SCIENCES", "MATHEMATICS", "CHEMISTRY", "HUMAN BIOLOGY", "GEOLOGY", "PHYSICS", "ADDITIONAL MATHEMATICS", "BIOLOGY", "ECONOMICS", "ENGLISH LANGUAGE", "GEOGRAPHY", "CITIZENSHIP", "FRENCH", "FOOD AND NUTRITION"];

const SMART_GRADE_INFO = `
SMART GRADE v5.0 Ultimate - Grade Management System for SIN GBHS FOUMBAN Form 5B Science

FEATURES:
- 14 subjects with customizable coefficients (1-10)
- 3 terms, 6 sequences per year
- Grade tracking with automatic average calculation
- 20 color themes + 12 font families
- Night mode (auto 20h-6h)
- 23 achievement badges
- Fingerprint login + 4-digit PIN
- Flashcards, Goals, Export to JSON/CSV/HTML/PDF
- Progressive Web App (works offline)

SUBJECTS: ${SUBJECTS_LIST.join(", ")}

GRADING SCALE:
- 18-20: A+ (Excellent)
- 16-17.9: A (Very Good)
- 14-15.9: B+ (Good)
- 12-13.9: B (Above Average)
- 10-11.9: C (Average)
- 8-9.9: D (Below Average)
- 0-7.9: F (Needs Work)

The user is a Form 5B Science student at GBHS Foumban, Cameroon.
Be helpful, encouraging, and educational. Use LaTeX, markdown tables, mermaid diagrams.
NEVER use emojis. Use plain text only.
`;

// ============================================
// VARIABLES
// ============================================

var currentModel = 'groq';
var currentUser = null;
var conversations = [];
var currentConvId = null;
var isLoading = false;
var streamingActive = false;
var mathJaxRenderTimeout = null;

// ============================================
// MATHJAX RENDU OPTIMISÉ
// ============================================

function renderMathJaxOptimized() {
  if (!window.MathJax) {
    console.warn('MathJax not loaded');
    loadMathJax();
    return;
  }

  if (mathJaxRenderTimeout) {
    clearTimeout(mathJaxRenderTimeout);
    mathJaxRenderTimeout = null;
  }

  mathJaxRenderTimeout = setTimeout(function() {
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise().then(function() {
        console.log('MathJax rendered');
        mathJaxRenderTimeout = null;
      }).catch(function(err) {
        console.warn('MathJax error:', err);
        mathJaxRenderTimeout = null;
      });
    } else if (window.MathJax && MathJax.Hub) {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
      mathJaxRenderTimeout = null;
    }
  }, 150);
}

function loadMathJax() {
  if (document.getElementById('mathjax-script')) return;
  
  var script = document.createElement('script');
  script.id = 'mathjax-script';
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
  script.async = true;
  script.onload = function() {
    console.log('MathJax loaded');
    setTimeout(renderMathJaxOptimized, 500);
  };
  document.head.appendChild(script);
}

function finalRenderComplete() {
  // 1. MathJax
  if (window.MathJax) {
    if (MathJax.typesetPromise) {
      MathJax.typesetPromise().then(function() {
        console.log('MathJax final render complete');
      });
    } else if (MathJax.Hub) {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    }
  }
  
  // 2. Mermaid
  if (typeof renderMermaidDiagrams === 'function') {
    renderMermaidDiagrams();
  }
  
  // 3. Prism
  if (typeof Prism !== 'undefined') {
    document.querySelectorAll('pre code').forEach(function(block) {
      Prism.highlightElement(block);
    });
  }
  
  // 4. Tableaux
  document.querySelectorAll('.table-wrapper').forEach(function(el) {
    el.style.overflowX = 'auto';
  });
}

// ============================================
// DÉTECTION DES ÉQUATIONS LATEX
// ============================================

function detectLatexBlocks(text) {
  var blocks = [];
  var i = 0;
  var insideLatex = false;
  var latexStart = 0;
  var latexType = '';
  
  while (i < text.length) {
    // Détection $$ ... $$
    if (i < text.length - 1 && text[i] === '$' && text[i+1] === '$') {
      if (!insideLatex) {
        insideLatex = true;
        latexStart = i;
        latexType = 'display';
        i += 2;
      } else {
        insideLatex = false;
        blocks.push({
          type: 'latex',
          content: text.substring(latexStart + 2, i),
          start: latexStart,
          end: i + 2,
          display: true
        });
        i += 2;
      }
      continue;
    }
    
    // Détection $ ... $
    if (text[i] === '$' && !insideLatex) {
      if (i < text.length - 1 && text[i+1] === '$') {
        i++;
        continue;
      }
      insideLatex = true;
      latexStart = i;
      latexType = 'inline';
      i++;
      continue;
    }
    
    if (text[i] === '$' && insideLatex && latexType === 'inline') {
      insideLatex = false;
      blocks.push({
        type: 'latex',
        content: text.substring(latexStart + 1, i),
        start: latexStart,
        end: i + 1,
        display: false
      });
      i++;
      continue;
    }
    
    i++;
  }
  
  // Équation non fermée
  if (insideLatex) {
    blocks.push({
      type: 'latex',
      content: text.substring(latexStart + (latexType === 'display' ? 2 : 1)),
      start: latexStart,
      end: text.length,
      display: latexType === 'display',
      incomplete: true
    });
  }
  
  return blocks;
}

// ============================================
// TYPEWRITER INTELLIGENT AVEC DÉTECTION LATEX
// ============================================

function typewriterSmart(messageId, fullText, speed, onComplete) {
  speed = speed || 25;
  
  var msgElement = document.getElementById('msg_' + messageId);
  if (!msgElement) { if (onComplete) onComplete(); return; }
  
  var bubble = msgElement.querySelector('.message-bubble');
  if (!bubble) { if (onComplete) onComplete(); return; }
  
  var timeHtml = bubble.querySelector('.message-time');
  
  // Détecter les équations
  var latexBlocks = detectLatexBlocks(fullText);
  var currentText = '';
  var index = 0;
  var isPaused = false;
  
  function renderCurrent(isFinal) {
    var formatted = formatMessage(currentText);
    
    if (timeHtml) {
      var timeHtmlClone = timeHtml.cloneNode(true);
      
      if (!isFinal) {
        if (!timeHtmlClone.querySelector('.typing-indicator')) {
          var indicator = document.createElement('span');
          indicator.className = 'typing-indicator';
          timeHtmlClone.appendChild(indicator);
        }
        if (!timeHtmlClone.querySelector('.typewriter-cursor')) {
          var cursor = document.createElement('span');
          cursor.className = 'typewriter-cursor';
          timeHtmlClone.appendChild(cursor);
        }
      } else {
        var indicator = timeHtmlClone.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
        var cursor = timeHtmlClone.querySelector('.typewriter-cursor');
        if (cursor) cursor.remove();
      }
      
      bubble.innerHTML = formatted;
      bubble.appendChild(timeHtmlClone);
    } else {
      bubble.innerHTML = formatted;
    }
    
    var container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    
    if (window.MathJax && !isPaused) {
      renderMathJaxOptimized();
    }
    
    if (isFinal) {
      setTimeout(function() {
        finalRenderComplete();
        if (onComplete) onComplete();
      }, 300);
    }
  }
  
  function addLetter() {
    if (isPaused) return;
    
    if (index >= fullText.length) {
      renderCurrent(true);
      return;
    }
    
    // Vérifier si on est à une équation
    var nextLatex = null;
    for (var i = 0; i < latexBlocks.length; i++) {
      var lb = latexBlocks[i];
      if (lb.start <= index && lb.end > index) {
        nextLatex = lb;
        break;
      }
    }
    
    if (nextLatex) {
      // PAUSE - RENDRE L'ÉQUATION COMPLÈTE
      isPaused = true;
      
      // Ajouter indicateur de chargement
      var loadingEl = document.createElement('span');
      loadingEl.className = 'latex-loading';
      loadingEl.innerHTML = ' ⏳';
      
      var timeEl = bubble.querySelector('.message-time');
      if (timeEl) {
        timeEl.appendChild(loadingEl);
      }
      
      var eqEnd = nextLatex.end;
      currentText = fullText.substring(0, eqEnd);
      index = eqEnd;
      
      renderCurrent(false);
      
      // FORCER MATHJAX
      setTimeout(function() {
        if (window.MathJax) {
          renderMathJaxOptimized();
        }
        var loading = bubble.querySelector('.latex-loading');
        if (loading) loading.remove();
        
        isPaused = false;
        setTimeout(addLetter, speed * 2);
      }, 200);
      
      return;
    }
    
    // Lettre normale
    currentText += fullText[index];
    index++;
    
    renderCurrent(false);
    
    var char = fullText[index - 1];
    var delay = speed;
    
    if (char === ' ' || char === '\n') {
      delay = speed * 1.5;
    } else if (char === '.' || char === '!' || char === '?' || char === ',') {
      delay = speed * 2.5;
    }
    
    setTimeout(addLetter, delay);
  }
  
  setTimeout(addLetter, 100);
}

// Alias pour compatibilité
var typewriterEffect = typewriterSmart;

// ============================================
// UTILITIES
// ============================================

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function formatTime(timestamp) {
  var date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function cleanAIResponse(text) {
  if (!text) return '';
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

function getSystemPrompt(userName) {
  var now = new Date();
  var currentDate = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  var currentTime = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return 'You are SMART GRADE AI, a helpful homework assistant for ' + userName + ', a Form 5B Science student at GBHS Foumban, Cameroon.\n\n' + 
    'CURRENT DATE AND TIME: ' + currentDate + ' at ' + currentTime + '\n\n' +
    SMART_GRADE_INFO + '\n\n' +
    'RULES:\n' +
    '1. Use LaTeX: $E = mc^2$ or $$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n' +
    '2. Use ```mermaid ... ``` for diagrams\n' +
    '3. Use markdown tables\n' +
    '4. Use ```language ... ``` for code\n' +
    '5. Be encouraging and educational\n' +
    '6. NEVER use emojis. Plain text only.\n' +
    '7. Use the CURRENT DATE provided above when responding to questions about dates, events, or current time.';
}

// ============================================
// AVATARS
// ============================================

function getUserAvatar(userId) {
  if (!userId) return '<i class="fas fa-user-graduate"></i>';

  var profile = getProfile(userId);
  var student = getStudentById(userId);

  if (profile && profile.avatarBase64 && profile.avatarBase64 !== '') {
    return '<img src="' + profile.avatarBase64 + '">';
  }

  var gender = (student && student.gender) || 'boy';
  var avatarPath = gender === 'girl' ? './icons/avatar-girl.png' : './icons/avatar-boy.png';
  return '<img src="' + avatarPath + '">';
}

function getAssistantAvatar() {
  return '<i class="fas fa-robot"></i>';
}

// ============================================
// FORMAT MESSAGE
// ============================================

function formatMessage(text) {
  if (!text) return '';

  var fixedText = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  fixedText = fixedText.replace(/<(\w+)[^>]*>\s*<\/\1>/gi, '');

  // PROTÉGER LES ÉQUATIONS LATEX
  fixedText = fixedText.replace(/\\\[([\s\S]*?)\\\]/g, function(match, content) {
    return '$$' + content + '$$';
  });

  fixedText = fixedText.replace(/\\\(([\s\S]*?)\\\)/g, function(match, content) {
    return '$' + content + '$';
  });

  // Tableaux
  fixedText = fixedText.replace(/<table([\s\S]*?)<\/table>/gi, function(match) {
    return '<div class="table-wrapper">' + match + '</div>';
  });

  marked.setOptions({ breaks: true, gfm: true, tables: true });
  var html = marked.parse(fixedText);

  // Wrappers tableaux
  html = html.replace(/<table/g, function(match, offset) {
    var before = html.substring(Math.max(0, offset - 60), offset);
    if (before.includes('table-wrapper')) {
      return match;
    }
    return '<div class="table-wrapper">' + match;
  });

  html = html.replace(/<\/table>/g, function(match, offset) {
    var after = html.substring(offset, Math.min(html.length, offset + 80));
    if (after.includes('</div>')) {
      return match;
    }
    return match + '</div>';
  });

  // Liens
  html = html.replace(/<a href=/g, '<a class="markdown-link" target="_blank" rel="noopener noreferrer" href=');

  // Mermaid - avec placeholder pendant le typewriter
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, function(match, code) {
    var imgId = 'mermaid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    var escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return '<div class="mermaid-wrapper" id="' + imgId + '">' +
      '<div class="mermaid-container">' +
        '<div class="mermaid-code" style="display:none;">' + escapedCode + '</div>' +
        '<div class="mermaid-actions">' +
          '<button class="mermaid-download-btn" onclick="downloadMermaidImage(\'' + imgId + '\')">' +
            '<i class="fas fa-download"></i>' +
          '</button>' +
          '<button class="mermaid-zoom-btn" onclick="openZoom(\'' + imgId + '\')">' +
            '<i class="fas fa-search-plus"></i>' +
          '</button>' +
        '</div>' +
        '<div class="mermaid-render" id="mermaid_render_' + imgId + '">' +
          '<div style="text-align:center;padding:20px;color:var(--text-light);">' +
            '<i class="fas fa-spinner fa-spin"></i> Diagram loading...' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  });

  // Code normal
  html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, function(match, lang, code) {
    var escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<div class="code-block-wrapper">' +
      '<button class="copy-code-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i> Copy</button>' +
      '<pre><code class="language-' + lang + '">' + escapedCode + '</code></pre>' +
      '</div>';
  });

  return html;
}

// ============================================
// RENDER CHAT
// ============================================

function renderCurrentChat() {
  var container = document.getElementById('chatMessages');
  var conv = conversations.find(function(c) { return c.id === currentConvId; });

  if (!conv || conv.messages.length === 0) {
    container.innerHTML = '<div class="empty-chat">' +
      '<i class="fas fa-comment-dots"></i>' +
      '<p>Start a conversation</p>' +
      '<p style="font-size:0.65rem;">Ask about homework, get explanations, or solve problems</p>' +
      '</div>';
    return;
  }

  var now = new Date();
  var dateStr = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  var timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  var html = '';
  html += '<div style="text-align:center;font-size:0.5rem;color:var(--text-light);padding:4px 0;border-bottom:1px solid var(--border);margin-bottom:8px;">' +
    '<i class="far fa-calendar-alt"></i> ' + dateStr + ' - ' + timeStr +
    '</div>';

  for (var i = 0; i < conv.messages.length; i++) {
    var msg = conv.messages[i];
    var isUser = msg.role === 'user';
    var content = isUser ? msg.content : cleanAIResponse(msg.content);

    var avatarHtml = isUser ? getUserAvatar(currentUser.id) : getAssistantAvatar();

    var isStreaming = streamingActive && i === conv.messages.length - 1 && !isUser;

    var formattedContent = formatMessage(content);

    html += '<div class="message ' + (isUser ? 'user' : 'assistant') + '" id="msg_' + msg.id + '">' +
      '<div class="message-icon">' + avatarHtml + '</div>' +
      '<div class="message-bubble">' +
        formattedContent +
        '<div class="message-time">' +
          '<i class="far fa-clock"></i> ' + formatTime(msg.timestamp) +
          (isStreaming ? ' <span class="typing-indicator"></span>' : '') +
          '<span class="message-actions">' +
            '<button onclick="copyMessage(\'' + msg.id + '\')" title="Copy"><i class="fas fa-copy"></i></button>' +
            (isUser ? '<button onclick="editMessage(\'' + msg.id + '\')" title="Edit"><i class="fas fa-edit"></i></button>' : '') +
            '<button onclick="deleteMessage(\'' + msg.id + '\')" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>' +
          '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;

  setTimeout(function() {
    if (typeof renderMermaidDiagrams === 'function') {
      renderMermaidDiagrams();
    }
    if (window.MathJax) {
      MathJax.typesetPromise().then(function() {
        console.log('MathJax rendered');
      }).catch(function(err) {
        console.warn('MathJax error:', err);
      });
    }
    if (typeof Prism !== 'undefined') {
      document.querySelectorAll('pre code').forEach(function(block) {
        Prism.highlightElement(block);
      });
    }
    document.querySelectorAll('.MathJax_Display').forEach(function(el) {
      if (el.scrollWidth > el.clientWidth) {
        el.style.overflowX = 'auto';
      }
    });
  }, 400);
}

// ============================================
// UPDATE MESSAGE EN TEMPS RÉEL (STREAMING)
// ============================================

function updateMessageContent(messageId, content) {
  var container = document.getElementById('chatMessages');
  if (!container) return;

  var msgElement = document.getElementById('msg_' + messageId);
  if (msgElement) {
    var bubble = msgElement.querySelector('.message-bubble');
    if (bubble) {
      var formatted = formatMessage(content);
      var timeStr = formatTime(new Date().toISOString());
      
      bubble.innerHTML = formatted + 
        '<div class="message-time">' +
          '<i class="far fa-clock"></i> ' + timeStr +
          ' <span class="typing-indicator"></span>' +
          '<span class="message-actions">' +
            '<button onclick="copyMessage(\'' + messageId + '\')" title="Copy"><i class="fas fa-copy"></i></button>' +
            '<button onclick="deleteMessage(\'' + messageId + '\')" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>' +
          '</span>' +
        '</div>';
      
      setTimeout(function() {
        if (typeof renderMermaidDiagrams === 'function') {
          renderMermaidDiagrams();
        }
        if (window.MathJax) {
          renderMathJaxOptimized();
        }
        if (typeof Prism !== 'undefined') {
          document.querySelectorAll('pre code').forEach(function(block) {
            Prism.highlightElement(block);
          });
        }
      }, 100);
    }
  }
}

// ============================================
// DISPLAY FULL TEXT (FALLBACK)
// ============================================

function displayFullText(messageId, fullText) {
  var msgElement = document.getElementById('msg_' + messageId);
  if (!msgElement) return;
  
  var bubble = msgElement.querySelector('.message-bubble');
  if (!bubble) return;
  
  var formatted = formatMessage(fullText);
  var timeHtml = bubble.querySelector('.message-time');
  
  if (timeHtml) {
    var timeHtmlClone = timeHtml.cloneNode(true);
    var indicator = timeHtmlClone.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
    var cursor = timeHtmlClone.querySelector('.typewriter-cursor');
    if (cursor) cursor.remove();
    bubble.innerHTML = formatted;
    bubble.appendChild(timeHtmlClone);
  } else {
    bubble.innerHTML = formatted;
  }
  
  setTimeout(function() {
    finalRenderComplete();
  }, 200);
}

// ============================================
// ACTIONS SUR LES MESSAGES
// ============================================

function copyMessage(messageId) {
  var conv = conversations.find(function(c) { return c.id === currentConvId; });
  if (!conv) return;

  var msg = conv.messages.find(function(m) { return m.id === messageId; });
  if (!msg) return;

  var content = msg.role === 'user' ? msg.content : cleanAIResponse(msg.content);

  navigator.clipboard.writeText(content).then(function() {
    showToast('Message copied');
  }).catch(function() {
    var textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Message copied');
  });
}

function editMessage(messageId) {
  var conv = conversations.find(function(c) { return c.id === currentConvId; });
  if (!conv) return;

  var msgIndex = conv.messages.findIndex(function(m) { return m.id === messageId; });
  if (msgIndex === -1) return;

  var oldContent = conv.messages[msgIndex].content;

  showPromptDialog({
    title: 'Edit Message',
    message: 'Modify your message and the AI will respond again.',
    defaultValue: oldContent,
    confirmText: 'Save & Regenerate',
    onConfirm: function(newText) {
      if (!newText || !newText.trim()) return;
      if (newText === oldContent) return;

      conv.messages = conv.messages.slice(0, msgIndex);
      conv.messages[msgIndex].content = newText.trim();
      conv.messages[msgIndex].timestamp = new Date().toISOString();

      saveConversations();
      renderCurrentChat();

      setTimeout(function() {
        sendMessageFromEdit();
      }, 300);
    }
  });
}

async function sendMessageFromEdit() {
  if (isLoading) return;

  var conv = conversations.find(function(c) { return c.id === currentConvId; });
  if (!conv) return;

  isLoading = true;
  var thinkingDiv = showThinking();

  var historyMessages = conv.messages.slice(-10).map(function(msg) {
    return { role: msg.role, content: msg.role === 'user' ? msg.content : cleanAIResponse(msg.content) };
  });
  var apiMessages = [{ role: 'system', content: getSystemPrompt(currentUser ? currentUser.name : 'student') }].concat(historyMessages);

  var result = await sendMessageWithFallback(apiMessages);

  if (thinkingDiv) thinkingDiv.remove();

  var assistantId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 6);
  if (result.success) {
    var response = cleanAIResponse(result.response);
    conv.messages.push({ id: assistantId, role: 'assistant', content: response, timestamp: new Date().toISOString() });
    if (result.model !== currentModel) showToast('Used fallback: ' + MODELS[result.model].name);
  } else {
    conv.messages.push({ id: assistantId, role: 'assistant', content: '[ERROR] ' + result.error + '\n\nPlease try again later.', timestamp: new Date().toISOString() });
    showToast(result.error);
  }

  saveConversations();
  renderCurrentChat();
  renderConvListSettings();
  isLoading = false;
}

function deleteMessage(messageId) {
  showConfirmDialog({
    title: 'Delete Message',
    message: 'Delete this message?',
    icon: 'fa-trash-alt',
    iconColor: '#e74c3c',
    confirmText: 'Delete',
    onConfirm: function() {
      var conv = conversations.find(function(c) { return c.id === currentConvId; });
      if (!conv) return;

      conv.messages = conv.messages.filter(function(m) { return m.id !== messageId; });
      saveConversations();
      renderCurrentChat();
      renderConvListSettings();
      showToast('Message deleted');
    }
  });
}

// ============================================
// EXPORT CONVERSATION
// ============================================

function exportConversation() {
  var conv = conversations.find(function(c) { return c.id === currentConvId; });
  if (!conv) return;

  showConfirmDialog({
    title: 'Export Conversation',
    message: 'Export this conversation as JSON?',
    icon: 'fa-download',
    iconColor: '#2ecc71',
    confirmText: 'Export',
    onConfirm: function() {
      var data = {
        conversation: conv,
        exportDate: new Date().toISOString(),
        version: '5.0'
      };

      var jsonStr = JSON.stringify(data, null, 2);
      var blob = new Blob([jsonStr], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.download = 'chat_' + conv.title.replace(/\s/g, '_') + '.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Conversation exported');
    }
  });
}

// ============================================
// THINKING ANIMATION
// ============================================

function showThinking() {
  var container = document.getElementById('chatMessages');
  var thinkingDiv = document.createElement('div');
  thinkingDiv.className = 'message assistant';
  thinkingDiv.id = 'thinkingIndicator';
  thinkingDiv.innerHTML = '<div class="message-icon"><i class="fas fa-brain"></i></div>' +
    '<div class="message-bubble">' +
      '<div class="thinking-container">' +
        '<div class="thinking-dots"><span></span><span></span><span></span></div>' +
        '<div class="thinking-text"><i class="fas fa-microchip"></i> ' + MODELS[currentModel].name + ' is thinking...</div>' +
        '<div class="thinking-progress"><div class="thinking-progress-bar"></div></div>' +
      '</div>' +
    '</div>';
  container.appendChild(thinkingDiv);
  container.scrollTop = container.scrollHeight;
  return thinkingDiv;
}

// ============================================
// API CALL AVEC STREAMING
// ============================================

async function callAIAPIStream(messages, modelKey, onChunk) {
  var config = MODELS[modelKey];
  if (!config || !config.available) throw new Error(modelKey + ' not available');
  if (!config.supportsStreaming) throw new Error(modelKey + ' does not support streaming');

  var response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': config.auth
    },
    body: JSON.stringify({
      model: config.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000,
      stream: true
    })
  });

  if (!response.ok) {
    var errorText = await response.text();
    if (response.status === 401) throw new Error('Invalid API key');
    if (response.status === 429) throw new Error('Rate limit exceeded');
    throw new Error('API error: ' + response.status);
  }

  var reader = response.body.getReader();
  var decoder = new TextDecoder();
  var fullText = '';
  var buffer = '';

  while (true) {
    var { done, value } = await reader.read();
    if (done) break;

    var chunk = decoder.decode(value);
    buffer += chunk;
    
    var lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line === '') continue;
      
      if (line.startsWith('data: ')) {
        var jsonStr = line.substring(6);
        if (jsonStr === '[DONE]') continue;

        try {
          var data = JSON.parse(jsonStr);
          var content = data.choices[0].delta.content || '';
          if (content) {
            fullText += content;
            if (onChunk) onChunk(content, fullText);
          }
        } catch(e) {
          // Ignorer les erreurs de parsing
        }
      }
    }
  }

  return fullText;
}

async function callAIAPI(messages, modelKey) {
  var config = MODELS[modelKey];
  if (!config || !config.available) throw new Error(modelKey + ' not available');

  var response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': config.auth
    },
    body: JSON.stringify({
      model: config.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    var errorText = await response.text();
    if (response.status === 401) throw new Error('Invalid API key');
    if (response.status === 429) throw new Error('Rate limit exceeded');
    throw new Error('API error: ' + response.status);
  }

  var data = await response.json();
  return data.choices[0].message.content;
}

async function sendMessageWithFallback(messages) {
  if (MODELS[currentModel].available) {
    try {
      var response = await callAIAPI(messages, currentModel);
      return { success: true, response: response, model: currentModel };
    } catch (error) {
      console.error('Model ' + currentModel + ' failed:', error.message);
    }
  }

  var fallbackOrder = ['groq', 'mistral-devstral', 'mistral-codestral'];
  for (var i = 0; i < fallbackOrder.length; i++) {
    var model = fallbackOrder[i];
    if (model === currentModel) continue;
    if (!MODELS[model].available) continue;
    try {
      var response = await callAIAPI(messages, model);
      return { success: true, response: response, model: model };
    } catch (error) {
      console.error('Fallback ' + model + ' failed:', error.message);
    }
  }

  return { success: false, error: 'All AI services unavailable. Please try again later.' };
}

// ============================================
// SEND MESSAGE AVEC TYPEWRITER INTELLIGENT
// ============================================

async function sendMessage() {
  var input = document.getElementById('messageInput');
  var message = input.value.trim();
  if (!message) { showToast('Enter a message'); return; }
  if (isLoading) { showToast('Please wait...'); return; }

  var conv = conversations.find(function(c) { return c.id === currentConvId; });
  if (!conv) return;

  var messageId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 6);
  conv.messages.push({ id: messageId, role: 'user', content: message, timestamp: new Date().toISOString() });

  if (conv.messages.length === 1) {
    conv.title = message.substring(0, 20) + (message.length > 20 ? '...' : '');
  }

  saveConversations();
  renderCurrentChat();
  input.value = '';
  input.style.height = 'auto';
  isLoading = true;
  streamingActive = true;

  var assistantId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 6);
  var assistantMessage = { 
    id: assistantId, 
    role: 'assistant', 
    content: '', 
    timestamp: new Date().toISOString() 
  };
  conv.messages.push(assistantMessage);
  
  renderCurrentChat();

  var historyMessages = conv.messages.slice(-10).filter(function(msg) {
    return msg.role === 'user' || msg.role === 'assistant';
  }).map(function(msg) {
    return { role: msg.role, content: msg.role === 'user' ? msg.content : cleanAIResponse(msg.content) };
  });
  var apiMessages = [{ role: 'system', content: getSystemPrompt(currentUser ? currentUser.name : 'student') }].concat(historyMessages);

  try {
    var modelSupportsStreaming = MODELS[currentModel] && MODELS[currentModel].supportsStreaming;
    var fullResponse = '';
    
    if (modelSupportsStreaming) {
      await callAIAPIStream(apiMessages, currentModel, function(chunk, fullText) {
        fullResponse = fullText;
        var lastMsg = conv.messages[conv.messages.length - 1];
        if (lastMsg && lastMsg.id === assistantId) {
          lastMsg.content = fullText;
        }
      });
    } else {
      fullResponse = await callAIAPI(apiMessages, currentModel);
      var lastMsg = conv.messages[conv.messages.length - 1];
      if (lastMsg && lastMsg.id === assistantId) {
        lastMsg.content = fullResponse;
      }
    }

    var cleanedResponse = cleanAIResponse(fullResponse);
    
    var lastMsg = conv.messages[conv.messages.length - 1];
    if (lastMsg && lastMsg.id === assistantId) {
      lastMsg.content = cleanedResponse;
    }
    
    saveConversations();
    
    // TYPEWRITER INTELLIGENT AVEC DÉTECTION LATEX
    typewriterSmart(assistantId, cleanedResponse, 18, function() {
      console.log('Typewriter terminé');
      streamingActive = false;
      isLoading = false;
      saveConversations();
      renderConvListSettings();
      
      setTimeout(function() {
        if (typeof renderMermaidDiagrams === 'function') {
          renderMermaidDiagrams();
        }
        if (window.MathJax) {
          MathJax.typesetPromise();
        }
        if (typeof Prism !== 'undefined') {
          document.querySelectorAll('pre code').forEach(function(block) {
            Prism.highlightElement(block);
          });
        }
      }, 300);
    });
    
    streamingActive = false;
    
  } catch(error) {
    var lastMsg = conv.messages[conv.messages.length - 1];
    if (lastMsg && lastMsg.id === assistantId) {
      var errorMsg = '[ERROR] ' + error.message + '\n\nPlease try again later.';
      lastMsg.content = errorMsg;
      displayFullText(assistantId, errorMsg);
    }
    showToast(error.message);
    streamingActive = false;
    isLoading = false;
    saveConversations();
    renderCurrentChat();
    renderConvListSettings();
  }
}

// ============================================
// CONVERSATIONS
// ============================================

function loadConversations() {
  if (!currentUser) return;
  var saved = localStorage.getItem('smartgrade_ai_conversations_' + currentUser.id);
  conversations = saved ? JSON.parse(saved) : [];

  if (conversations.length === 0) {
    createNewConversation();
  } else {
    var lastActive = localStorage.getItem('smartgrade_ai_lastconv_' + currentUser.id);
    if (lastActive && conversations.find(function(c) { return c.id === lastActive; })) {
      currentConvId = lastActive;
    } else {
      currentConvId = conversations[0].id;
    }
    renderCurrentChat();
    renderConvListSettings();
  }
}

function saveConversations() {
  if (!currentUser) return;
  localStorage.setItem('smartgrade_ai_conversations_' + currentUser.id, JSON.stringify(conversations));
  localStorage.setItem('smartgrade_ai_lastconv_' + currentUser.id, currentConvId);
}

function createNewConversation() {
  var newId = Date.now().toString();
  conversations.unshift({
    id: newId,
    title: 'Chat ' + new Date().toLocaleDateString(),
    messages: [],
    createdAt: new Date().toISOString(),
    model: currentModel
  });
  currentConvId = newId;
  saveConversations();
  renderCurrentChat();
  renderConvListSettings();
  showToast('New conversation created');
}

function clearAllConversations() {
  showConfirmDialog({
    title: 'Clear All Conversations',
    message: 'Delete all conversations?',
    detail: 'This cannot be undone.',
    icon: 'fa-trash-alt',
    iconColor: '#e74c3c',
    confirmText: 'Clear All',
    onConfirm: function() {
      conversations = [];
      createNewConversation();
      showToast('All conversations cleared');
    }
  });
}

function selectConversation(convId) {
  currentConvId = convId;
  saveConversations();
  renderCurrentChat();
  renderConvListSettings();
}

function deleteConversation(convId) {
  if (conversations.length === 1) { showToast('Cannot delete last conversation'); return; }

  showConfirmDialog({
    title: 'Delete Conversation',
    message: 'Delete this conversation?',
    icon: 'fa-trash-alt',
    iconColor: '#e74c3c',
    confirmText: 'Delete',
    onConfirm: function() {
      conversations = conversations.filter(function(c) { return c.id !== convId; });
      if (currentConvId === convId) currentConvId = conversations[0].id;
      saveConversations();
      renderCurrentChat();
      renderConvListSettings();
      showToast('Conversation deleted');
    }
  });
}

function renderConvListSettings() {
  var container = document.getElementById('convListSettings');
  if (!container) return;

  if (conversations.length === 0) {
    container.innerHTML = '<p style="font-size:0.65rem;color:var(--text-light);text-align:center;padding:12px;">No conversations</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < conversations.length; i++) {
    var conv = conversations[i];
    var isActive = currentConvId === conv.id;
    var lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length-1].content.substring(0, 30) : 'No messages';

    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-radius:10px;margin-bottom:4px;cursor:pointer;transition:all 0.2s;' +
      (isActive ? 'background:linear-gradient(135deg,var(--primary),var(--secondary));color:white;' : 'background:rgba(0,0,0,0.02);') +
      '" onclick="selectConversation(\'' + conv.id + '\')">' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:0.75rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(conv.title) + '</div>' +
        '<div style="font-size:0.55rem;opacity:0.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(lastMsg) + '</div>' +
      '</div>' +
      '<button onclick="event.stopPropagation();deleteConversation(\'' + conv.id + '\')" style="background:none;border:none;color:' + (isActive ? 'white' : 'var(--text-light)') + ';cursor:pointer;padding:4px 6px;"><i class="fas fa-trash-alt" style="font-size:0.7rem;"></i></button>' +
    '</div>';
  }
  container.innerHTML = html;
}

// ============================================
// MODEL SELECTION
// ============================================

function selectModel(model) {
  if (!MODELS[model].available) {
    showToast(MODELS[model].name + ' not available');
    return;
  }

  var conv = conversations.find(function(c) { return c.id === currentConvId; });
  if (conv && conv.messages && conv.messages.length > 0) {
    showToast('Cannot change model after conversation started. Create a new chat.');
    return;
  }

  currentModel = model;

  document.querySelectorAll('.model-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.model === model);
  });

  var modelStatus = document.getElementById('modelStatus');
  var modelInfo = document.getElementById('activeModelInfo');
  if (modelStatus) modelStatus.innerHTML = MODELS[model].name + ' - Ready';
  if (modelInfo) modelInfo.innerHTML = MODELS[model].name;

  showToast('Switched to ' + MODELS[model].name);
}

// ============================================
// SWITCH ONGLETS
// ============================================

function switchAITab(tab) {
  document.querySelectorAll('.ai-tab').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  document.querySelectorAll('.ai-tab-content').forEach(function(content) {
    content.classList.toggle('active', content.id === 'tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  });
}

// ============================================
// COPY CODE
// ============================================

function copyCode(btn) {
  var wrapper = btn.closest('.code-block-wrapper');
  var code = wrapper.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Copied';
    setTimeout(function() { btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 1500);
    showToast('Code copied');
  });
}

// ============================================
// DATE / HEURE
// ============================================

function updateDateTimeDisplay() {
  var now = new Date();
  var dateEl = document.getElementById('currentDateDisplay');
  var timeEl = document.getElementById('currentTimeDisplay');

  if (dateEl) {
    dateEl.innerHTML = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  if (timeEl) {
    timeEl.innerHTML = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

// ============================================
// PROMPT DIALOG
// ============================================

function showPromptDialog(options) {
  var existingModal = document.querySelector('.custom-prompt-modal');
  if (existingModal) existingModal.remove();

  var modal = document.createElement('div');
  modal.className = 'custom-prompt-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:2000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px);';

  modal.innerHTML = `
    <div style="background:var(--card-bg);border-radius:24px;padding:24px;max-width:320px;width:85%;text-align:center;animation:fadeInModal 0.2s ease;border:1px solid var(--border);">
      <i class="fas ${options.icon || 'fa-edit'}" style="font-size:48px;color:var(--primary);margin-bottom:16px;"></i>
      <h3 style="margin-bottom:8px;color:var(--text);">${options.title}</h3>
      <p style="font-size:0.7rem;color:var(--text-light);margin-bottom:16px;">${options.message}</p>
      <input type="text" id="promptInput" class="prompt-input" value="${options.defaultValue || ''}" maxlength="${options.maxlength || '50'}" placeholder="${options.placeholder || ''}">
      <div style="display:flex;gap:12px;margin-top:16px;">
        <button class="prompt-cancel-btn" style="flex:1;padding:12px;border-radius:40px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;">${options.cancelText || 'Cancel'}</button>
        <button class="prompt-ok-btn" style="flex:1;padding:12px;border-radius:40px;background:var(--primary);color:white;border:none;cursor:pointer;">${options.confirmText || 'OK'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  var input = document.getElementById('promptInput');
  input.focus();
  input.select();

  modal.querySelector('.prompt-cancel-btn').onclick = function() {
    modal.remove();
    if (options.onCancel) options.onCancel();
  };

  modal.querySelector('.prompt-ok-btn').onclick = function() {
    var value = input.value.trim();
    modal.remove();
    if (options.onConfirm) options.onConfirm(value);
  };

  input.onkeypress = function(e) {
    if (e.key === 'Enter') {
      var value = input.value.trim();
      modal.remove();
      if (options.onConfirm) options.onConfirm(value);
    }
  };

  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.remove();
      if (options.onCancel) options.onCancel();
    }
  };
}

// ============================================
// CONFIRM DIALOG
// ============================================

function showConfirmDialog(options) {
  var existingModal = document.querySelector('.custom-confirm-modal');
  if (existingModal) existingModal.remove();

  var modal = document.createElement('div');
  modal.className = 'custom-confirm-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:2000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px);';

  modal.innerHTML = `
    <div style="background:var(--card-bg);border-radius:24px;padding:24px;max-width:320px;width:85%;text-align:center;animation:fadeInModal 0.2s ease;border:1px solid var(--border);">
      <i class="fas ${options.icon || 'fa-question-circle'}" style="font-size:48px;color:${options.iconColor || 'var(--primary)'};margin-bottom:16px;"></i>
      <h3 style="margin-bottom:8px;color:var(--text);">${options.title}</h3>
      <p style="font-size:0.75rem;color:var(--text-light);margin-bottom:16px;">${options.message}</p>
      ${options.detail ? '<p style="font-size:0.65rem;color:var(--text-light);margin-bottom:16px;">' + options.detail + '</p>' : ''}
      <div style="display:flex;gap:12px;">
        <button class="confirm-cancel-btn" style="flex:1;padding:12px;border-radius:40px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;">${options.cancelText || 'Cancel'}</button>
        <button class="confirm-ok-btn" style="flex:1;padding:12px;border-radius:40px;background:${options.confirmColor || 'var(--primary)'};color:white;border:none;cursor:pointer;">${options.confirmText || 'Confirm'}</button>
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
// INITIALISATION
// ============================================

function initChatPage() {
  currentUser = getCurrentStudent();
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  updateHeaderAvatar();
  initMobileMenu();
  initThemeSelector();

  var savedFont = localStorage.getItem('smartgrade_font_family') || 'inter';
  var fontMap = {
    'inter': 'Inter, sans-serif',
    'roboto': 'Roboto, sans-serif',
    'cinzel': 'Cinzel, serif',
    'quicksand': 'Quicksand, sans-serif',
    'courier-prime': '"Courier Prime", monospace',
    'fredoka': 'Fredoka, sans-serif',
    'pacifico': 'Pacifico, cursive',
    'bangers': 'Bangers, cursive',
    'lobster': 'Lobster, cursive',
    'permanent-marker': '"Permanent Marker", cursive',
    'comfortaa': 'Comfortaa, sans-serif',
    'righteous': 'Righteous, sans-serif'
  };
  document.body.style.fontFamily = fontMap[savedFont] || 'Inter, sans-serif';

  var allEls = document.querySelectorAll('*');
  for (var i = 0; i < allEls.length; i++) {
    if (allEls[i].style) {
      allEls[i].style.fontFamily = document.body.style.fontFamily;
    }
  }

  updateDateTimeDisplay();
  setInterval(updateDateTimeDisplay, 1000);

  loadConversations();

  var textarea = document.getElementById('messageInput');
  textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  var observer = new MutationObserver(function() {
    if (window.MathJax) MathJax.typesetPromise();
    if (typeof renderMermaidDiagrams === 'function') {
      renderMermaidDiagrams();
    }
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  addExportButtonToSettings();
}

function addExportButtonToSettings() {
  setTimeout(function() {
    var settingsCards = document.querySelectorAll('.settings-card');
    if (settingsCards.length > 0) {
      var lastCard = settingsCards[settingsCards.length - 1];
      var exportBtn = document.createElement('button');
      exportBtn.className = 'btn btn-secondary';
      exportBtn.style.cssText = 'margin-top:12px;width:100%;padding:10px;font-size:0.75rem;border-radius:40px;';
      exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Conversation (JSON)';
      exportBtn.onclick = exportConversation;
      lastCard.appendChild(exportBtn);
    }
  }, 500);
}

// ============================================
// EXPORTER LES FONCTIONS
// ============================================

window.sendMessage = sendMessage;
window.selectModel = selectModel;
window.switchAITab = switchAITab;
window.createNewConversation = createNewConversation;
window.clearAllConversations = clearAllConversations;
window.selectConversation = selectConversation;
window.deleteConversation = deleteConversation;
window.copyCode = copyCode;
window.copyMessage = copyMessage;
window.editMessage = editMessage;
window.deleteMessage = deleteMessage;
window.exportConversation = exportConversation;
window.updateMessageContent = updateMessageContent;
window.typewriterSmart = typewriterSmart;
window.displayFullText = displayFullText;
window.renderMathJaxOptimized = renderMathJaxOptimized;
window.finalRenderComplete = finalRenderComplete;

// ============================================
// DÉMARRER
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatPage);
} else {
  initChatPage();
}

console.log('AI Assistant Core loaded with SMART TYPEWRITER + LaTeX detection');
