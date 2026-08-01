// ============================================
// SMART GRADE - INSTALL HANDLER V5.0
// Installation personnalisée avec 20 thèmes
// ============================================

(function() {
  
  'use strict';
  
  // ============================================
  // 1. RÉCUPÉRER LES COULEURS DU THÈME ACTIF
  // ============================================
  
  function getActiveThemeColors() {
    // Récupérer les couleurs CSS actuelles
    var root = document.documentElement;
    var styles = getComputedStyle(root);
    
    var primary = styles.getPropertyValue('--primary').trim() || '#0f3b48';
    var secondary = styles.getPropertyValue('--secondary').trim() || '#00b4d8';
    var bgStart = styles.getPropertyValue('--bg-start').trim() || '#f0f4f8';
    var bgEnd = styles.getPropertyValue('--bg-end').trim() || '#e2e8f0';
    var cardBg = styles.getPropertyValue('--card-bg').trim() || 'rgba(255,255,255,0.95)';
    var text = styles.getPropertyValue('--text').trim() || '#1a2a3a';
    var textLight = styles.getPropertyValue('--text-light').trim() || '#4a627a';
    var border = styles.getPropertyValue('--border').trim() || 'rgba(0,0,0,0.08)';
    
    // Détecter le mode nuit
    var isNightMode = document.body.classList.contains('night-mode');
    
    return {
      primary: primary,
      secondary: secondary,
      bgStart: bgStart,
      bgEnd: bgEnd,
      cardBg: cardBg,
      text: text,
      textLight: textLight,
      border: border,
      isNightMode: isNightMode
    };
  }
  
  // ============================================
  // 2. DÉTECTION DU NAVIGATEUR
  // ============================================
  
  function getBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('chrome') !== -1 && ua.indexOf('edg') === -1 && ua.indexOf('opr') === -1) return 'chrome';
    if (ua.indexOf('edg') !== -1) return 'edge';
    if (ua.indexOf('opr') !== -1 || ua.indexOf('opera') !== -1) return 'opera';
    if (ua.indexOf('firefox') !== -1) return 'firefox';
    if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) return 'safari';
    if (ua.indexOf('samsung') !== -1) return 'samsung';
    return 'other';
  }
  
  // ============================================
  // 3. VÉRIFICATION SI DÉJÀ INSTALLÉ
  // ============================================
  
  function isInstalled() {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator && window.navigator.standalone === true) return true;
    if (localStorage.getItem('smartgrade_installed') === 'true') return true;
    return false;
  }
  
  // ============================================
  // 4. BANNIÈRE D'INSTALLATION PERSONNALISÉE
  // ============================================
  
  function showCustomInstallBanner() {
    // Vérifier si déjà installé ou refusé récemment
    if (isInstalled()) return;
    
    var dismissed = localStorage.getItem('smartgrade_install_dismissed');
    if (dismissed) {
      var diff = Date.now() - parseInt(dismissed);
      if (diff < 3 * 24 * 60 * 60 * 1000) { // 3 jours
        return;
      }
    }
    
    // Supprimer une ancienne bannière si elle existe
    var existing = document.getElementById('customInstallBanner');
    if (existing) existing.remove();
    
    // Récupérer les couleurs du thème actif
    var colors = getActiveThemeColors();
    var browser = getBrowser();
    
    // Créer la bannière
    var banner = document.createElement('div');
    banner.id = 'customInstallBanner';
    
    // Styles de base avec les couleurs du thème
    var isDark = colors.isNightMode;
    var bgColor = isDark ? 'rgba(10, 10, 20, 0.95)' : 'rgba(255, 255, 255, 0.98)';
    var shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)';
    var textColor = colors.text;
    var textLightColor = colors.textLight;
    var borderColor = colors.border;
    
    // Dégradé pour le bouton d'installation
    var gradient = 'linear-gradient(135deg, ' + colors.primary + ', ' + colors.secondary + ')';
    
    banner.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: 92%;
      max-width: 420px;
      background: ${bgColor};
      border-radius: 20px;
      padding: 18px 20px;
      border: 1px solid ${borderColor};
      box-shadow: 0 8px 40px ${shadowColor};
      z-index: 99999;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      animation: installBannerSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      gap: 14px;
    `;
    
    // Icône avec le dégradé du thème
    var iconBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
    
    banner.innerHTML = `
      <div style="
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: ${gradient};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 4px 16px rgba(15,59,72,0.2);
      ">
        <i class="fas fa-graduation-cap" style="color: white; font-size: 20px;"></i>
      </div>
      
      <div style="flex: 1; min-width: 0;">
        <div style="
          font-weight: 700;
          font-size: 0.9rem;
          color: ${textColor};
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          SMART GRADE
          <span style="
            font-size: 0.45rem;
            font-weight: 600;
            background: ${gradient};
            color: white;
            padding: 2px 8px;
            border-radius: 20px;
            letter-spacing: 0.5px;
          ">PWA</span>
        </div>
        <div style="
          font-size: 0.6rem;
          color: ${textLightColor};
          margin-top: 1px;
          opacity: 0.8;
        ">
          <i class="fas fa-mobile-alt" style="margin-right: 4px; font-size: 0.5rem;"></i>
          Install for offline access • ${browser.charAt(0).toUpperCase() + browser.slice(1)}
        </div>
      </div>
      
      <button id="installBannerBtn" style="
        padding: 8px 18px;
        border-radius: 30px;
        border: none;
        background: ${gradient};
        color: white;
        font-weight: 700;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.25s ease;
        font-family: inherit;
        flex-shrink: 0;
        box-shadow: 0 2px 12px rgba(15,59,72,0.2);
      ">
        <i class="fas fa-download" style="margin-right: 4px; font-size: 0.65rem;"></i> Install
      </button>
      
      <button id="installBannerClose" style="
        background: none;
        border: none;
        color: ${textLightColor};
        font-size: 1.2rem;
        cursor: pointer;
        padding: 4px 6px;
        transition: all 0.2s;
        flex-shrink: 0;
        opacity: 0.5;
        font-family: inherit;
      ">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.body.appendChild(banner);
    
    // Ajouter les styles d'animation
    addBannerStyles();
    
    // Événements
    document.getElementById('installBannerBtn').onclick = function() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(result) {
          if (result.outcome === 'accepted') {
            localStorage.setItem('smartgrade_installed', 'true');
            hideCustomInstallBanner();
          }
          deferredPrompt = null;
        });
      } else {
        // Fallback: ouvrir le menu d'installation du navigateur
        showInstallModal();
      }
    };
    
    document.getElementById('installBannerClose').onclick = function() {
      hideCustomInstallBanner();
      localStorage.setItem('smartgrade_install_dismissed', Date.now().toString());
    };
    
    // Fermer en cliquant en dehors (sur l'overlay)
    banner.addEventListener('click', function(e) {
      if (e.target === banner) {
        // Ne pas fermer sur le fond
      }
    });
  }
  
  // ============================================
  // 5. MODALE D'INSTALLATION PERSONNALISÉE
  // ============================================
  
  function showInstallModal() {
    var existing = document.getElementById('smartInstallModal');
    if (existing) {
      existing.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      return;
    }
    
    var colors = getActiveThemeColors();
    var isDark = colors.isNightMode;
    var gradient = 'linear-gradient(135deg, ' + colors.primary + ', ' + colors.secondary + ')';
    var bgColor = isDark ? 'rgba(10, 10, 20, 0.95)' : 'rgba(255, 255, 255, 0.98)';
    var shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)';
    var textColor = colors.text;
    var textLightColor = colors.textLight;
    var borderColor = colors.border;
    
    var modal = document.createElement('div');
    modal.id = 'smartInstallModal';
    modal.style.cssText = `
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 999999;
      align-items: center;
      justify-content: center;
      animation: installModalFadeIn 0.3s ease;
      padding: 20px;
    `;
    
    modal.innerHTML = `
      <div style="
        background: ${bgColor};
        border-radius: 28px;
        padding: 32px 28px;
        max-width: 380px;
        width: 100%;
        border: 1px solid ${borderColor};
        box-shadow: 0 20px 60px ${shadowColor};
        animation: installModalScaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        text-align: center;
      ">
        <div style="
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: ${gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 4px 24px rgba(15,59,72,0.3);
        ">
          <i class="fas fa-graduation-cap" style="font-size: 36px; color: white;"></i>
        </div>
        
        <h2 style="
          font-size: 1.4rem;
          font-weight: 800;
          color: ${textColor};
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        ">
          SMART GRADE
        </h2>
        
        <p style="
          font-size: 0.65rem;
          color: ${textLightColor};
          margin-bottom: 16px;
          opacity: 0.7;
        ">
          SIN GBHS FOUMBAN • Form 5B Science
        </p>
        
        <div style="
          background: rgba(0,0,0,0.03);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          border: 1px solid ${borderColor};
          text-align: left;
        ">
          <div style="display: flex; align-items: center; gap: 12px; padding: 4px 0;">
            <i class="fas fa-check-circle" style="color: ${colors.secondary}; font-size: 1rem;"></i>
            <span style="font-size: 0.75rem; color: ${textColor};">Works 100% offline</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 4px 0;">
            <i class="fas fa-check-circle" style="color: ${colors.secondary}; font-size: 1rem;"></i>
            <span style="font-size: 0.75rem; color: ${textColor};">All data stored locally</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 4px 0;">
            <i class="fas fa-check-circle" style="color: ${colors.secondary}; font-size: 1rem;"></i>
            <span style="font-size: 0.75rem; color: ${textColor};">Quick access from home screen</span>
          </div>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button onclick="closeInstallModal()" style="
            flex: 1;
            padding: 12px;
            border-radius: 40px;
            border: 1px solid ${borderColor};
            background: transparent;
            color: ${textColor};
            font-weight: 600;
            font-size: 0.8rem;
            cursor: pointer;
            font-family: inherit;
            transition: background 0.2s;
          ">
            Later
          </button>
          <button id="installModalBtn" style="
            flex: 2;
            padding: 12px;
            border-radius: 40px;
            border: none;
            background: ${gradient};
            color: white;
            font-weight: 700;
            font-size: 0.8rem;
            cursor: pointer;
            font-family: inherit;
            box-shadow: 0 2px 16px rgba(15,59,72,0.25);
            transition: transform 0.2s;
          ">
            <i class="fas fa-download"></i> Install Now
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    document.getElementById('installModalBtn').onclick = function() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(result) {
          if (result.outcome === 'accepted') {
            localStorage.setItem('smartgrade_installed', 'true');
            closeInstallModal();
          }
          deferredPrompt = null;
        });
      } else {
        // Instructions pour l'installation manuelle
        showManualInstallInstructions();
      }
    };
    
    addModalStyles();
  }
  
  // ============================================
  // 6. INSTRUCTIONS D'INSTALLATION MANUELLE
  // ============================================
  
  function showManualInstallInstructions() {
    var colors = getActiveThemeColors();
    var isDark = colors.isNightMode;
    var gradient = 'linear-gradient(135deg, ' + colors.primary + ', ' + colors.secondary + ')';
    var bgColor = isDark ? 'rgba(10, 10, 20, 0.95)' : 'rgba(255, 255, 255, 0.98)';
    var textColor = colors.text;
    var textLightColor = colors.textLight;
    var borderColor = colors.border;
    
    var existing = document.querySelector('.manual-install-overlay');
    if (existing) existing.remove();
    
    var overlay = document.createElement('div');
    overlay.className = 'manual-install-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    
    overlay.innerHTML = `
      <div style="
        background: ${bgColor};
        border-radius: 28px;
        padding: 32px 24px;
        max-width: 360px;
        width: 100%;
        border: 1px solid ${borderColor};
        text-align: center;
        animation: installModalScaleIn 0.4s ease;
      ">
        <div style="
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: ${gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        ">
          <i class="fas fa-mobile-alt" style="font-size: 28px; color: white;"></i>
        </div>
        
        <h3 style="font-size: 1.1rem; font-weight: 700; color: ${textColor}; margin-bottom: 8px;">
          Add to Home Screen
        </h3>
        
        <p style="font-size: 0.75rem; color: ${textLightColor}; line-height: 1.6; margin-bottom: 20px;">
          Tap the share icon <i class="fas fa-share-alt" style="color: ${colors.secondary};"></i> 
          then select <strong>"Add to Home Screen"</strong>
        </p>
        
        <button onclick="this.parentElement.parentElement.remove()" style="
          width: 100%;
          padding: 12px;
          border-radius: 40px;
          border: none;
          background: ${gradient};
          color: white;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: inherit;
        ">
          <i class="fas fa-check"></i> Got it
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Fermer en cliquant en dehors
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }
  
  // ============================================
  // 7. FERMER LA MODALE
  // ============================================
  
  function closeInstallModal() {
    var modal = document.getElementById('smartInstallModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  function hideCustomInstallBanner() {
    var banner = document.getElementById('customInstallBanner');
    if (banner) {
      banner.style.animation = 'installBannerSlideDown 0.4s ease forwards';
      setTimeout(function() {
        if (banner.parentNode) banner.remove();
      }, 400);
    }
  }
  
  // ============================================
  // 8. STYLES DYNAMIQUES
  // ============================================
  
  function addBannerStyles() {
    if (document.getElementById('installBannerStyles')) return;
    
    var style = document.createElement('style');
    style.id = 'installBannerStyles';
    style.textContent = `
      @keyframes installBannerSlideUp {
        from { transform: translateX(-50%) translateY(60px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      @keyframes installBannerSlideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(60px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  function addModalStyles() {
    if (document.getElementById('installModalStyles')) return;
    
    var style = document.createElement('style');
    style.id = 'installModalStyles';
    style.textContent = `
      @keyframes installModalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes installModalScaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      #smartInstallModal button:hover,
      .manual-install-overlay button:hover {
        transform: scale(1.02);
      }
      #installBannerBtn:hover {
        transform: scale(1.04);
        box-shadow: 0 4px 20px rgba(15,59,72,0.35);
      }
      #installBannerClose:hover {
        opacity: 1 !important;
        transform: rotate(90deg);
      }
      #customInstallBanner {
        transition: border-color 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }
  
  // ============================================
  // 9. OBSERVER LES CHANGEMENTS DE THÈME
  // ============================================
  
  function refreshBannerColors() {
    var banner = document.getElementById('customInstallBanner');
    if (!banner) return;
    
    var colors = getActiveThemeColors();
    var isDark = colors.isNightMode;
    var gradient = 'linear-gradient(135deg, ' + colors.primary + ', ' + colors.secondary + ')';
    
    // Mettre à jour les couleurs de la bannière
    banner.style.borderColor = colors.border;
    banner.style.background = isDark ? 'rgba(10, 10, 20, 0.95)' : 'rgba(255, 255, 255, 0.98)';
    
    // Mettre à jour l'icône
    var iconDiv = banner.querySelector('div[style*="border-radius: 14px;"]');
    if (iconDiv) {
      iconDiv.style.background = gradient;
    }
    
    // Mettre à jour le badge PWA
    var badgeSpan = banner.querySelector('span[style*="font-size: 0.45rem;"]');
    if (badgeSpan) {
      badgeSpan.style.background = gradient;
    }
    
    // Mettre à jour le bouton d'installation
    var installBtn = document.getElementById('installBannerBtn');
    if (installBtn) {
      installBtn.style.background = gradient;
    }
    
    // Mettre à jour les couleurs de texte
    var textElements = banner.querySelectorAll('[style*="font-weight: 700;"]');
    textElements.forEach(function(el) {
      if (el.style.color && el.style.color !== 'white') {
        el.style.color = colors.text;
      }
    });
  }
  
  // Observer les changements de thème
  var themeObserver = new MutationObserver(function() {
    refreshBannerColors();
    // Si la modale est ouverte, la mettre à jour aussi
    var modal = document.getElementById('smartInstallModal');
    if (modal && modal.style.display === 'flex') {
      // Re-créer la modale avec les nouvelles couleurs
      var modalBtn = document.getElementById('installModalBtn');
      if (modalBtn) {
        var colors = getActiveThemeColors();
        var gradient = 'linear-gradient(135deg, ' + colors.primary + ', ' + colors.secondary + ')';
        modalBtn.style.background = gradient;
        modalBtn.style.boxShadow = '0 2px 16px rgba(15,59,72,0.25)';
        
        // Mettre à jour l'icône
        var iconDiv = modal.querySelector('div[style*="border-radius: 50%;"]');
        if (iconDiv && iconDiv.parentElement === modal.querySelector('div:first-child')) {
          iconDiv.style.background = gradient;
        }
      }
    }
  });
  
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  // ============================================
  // 10. POINT D'ENTRÉE PRINCIPAL
  // ============================================
  
  var deferredPrompt = null;
  
  function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(result) {
        if (result.outcome === 'accepted') {
          localStorage.setItem('smartgrade_installed', 'true');
          hideCustomInstallBanner();
        }
        deferredPrompt = null;
      });
    } else {
      showInstallModal();
    }
  }
  
  function init() {
    // Désactiver le prompt natif
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      deferredPrompt = e;
      
      // Attendre que la page soit chargée pour afficher la bannière
      if (document.readyState === 'complete') {
        setTimeout(showCustomInstallBanner, 1000);
      } else {
        window.addEventListener('load', function() {
          setTimeout(showCustomInstallBanner, 1000);
        });
      }
    });
    
    // Vérifier si déjà installé
    if (isInstalled()) {
      localStorage.setItem('smartgrade_installed', 'true');
    }
    
    // Exposer les fonctions globalement
    window.installApp = install;
    window.showInstallModal = showInstallModal;
    window.closeInstallModal = closeInstallModal;
    
    // Ajouter les styles au chargement
    addBannerStyles();
    addModalStyles();
    
    console.log('[Install] ✅ Thème personnalisé - 20 couleurs + mode nuit');
    console.log('[Install] 📱 Navigateur:', getBrowser());
    console.log('[Install] 📦 Installé:', isInstalled());
  }
  
  // ============================================
  // 11. DÉMARRAGE
  // ============================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
