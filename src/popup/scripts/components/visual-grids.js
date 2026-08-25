// popup-components.js — Specialized component initializers
import { t } from '../../../shared/locales/i18n.js';

const escapeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};


export function initvisualgrids(document, state, ui, updateSetting, notifyThemeChange, saveSettings) {
  function initGlobalPlayerBarGrid() {
      const btns = document.querySelectorAll('.gpb-btn');
      if (!btns.length) return;
  
      const syncState = () => {
        btns.forEach((btn) => {
          const targetId = btn.dataset.target;
          const cb = document.getElementById(targetId);
          if (cb) btn.classList.toggle('active', cb.checked);
        });
      };
  
      // Sync initial state slightly after popup-state.js loads settings
      setTimeout(syncState, 150);
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.target;
          const cb = document.getElementById(targetId);
          if (cb) {
            cb.checked = !cb.checked;
            btn.classList.toggle('active', cb.checked);
            cb.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });
    }

  function initCardStyleGrid() {
      const btns = document.querySelectorAll('.card-style-btn[data-style]');
      const hiddenInput = document.getElementById('cardStyle');
      if (!btns.length || !hiddenInput) return;
  
      const applyStyle = (styleVal) => {
        hiddenInput.value = styleVal;
        btns.forEach((b) => {
          const isActive = b.dataset.style === styleVal;
          b.classList.toggle('active', isActive);
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const styleVal = data.settings?.cardStyle || 'glass';
        applyStyle(styleVal);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          applyStyle(btn.dataset.style);
          const event = new Event('change', { bubbles: true });
          hiddenInput.dispatchEvent(event);
        });
      });
    }

  function initYoutubeStyleGrid() {
      const btns = document.querySelectorAll('.youtube-style-btn');
      const hiddenInput = document.getElementById('youtubePageTheme');
      if (!btns.length || !hiddenInput) return;
  
      const applyStyle = (styleVal) => {
        hiddenInput.value = styleVal;
        btns.forEach((b) => {
          const isActive = b.dataset.style === styleVal;
          b.classList.toggle('active', isActive);
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const styleVal = data.settings?.youtubePageTheme || 'default';
        applyStyle(styleVal);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const styleName = btn.dataset.style;
          applyStyle(styleName);
          const event = new Event('change', { bubbles: true });
          hiddenInput.dispatchEvent(event);
  
          // Auto-apply corresponding theme if it exists
          const relatedThemeBtn = document.querySelector(`.theme-btn[data-theme="${styleName}"]`);
          if (relatedThemeBtn) {
            relatedThemeBtn.click();
          }
  
          // Auto-apply corresponding card style if it exists
          const relatedCardStyleBtn = document.querySelector(`.card-style-btn[data-style="${styleName}"]`);
          if (relatedCardStyleBtn) {
            relatedCardStyleBtn.click();
          }
        });
      });
    }

  function initPopupStyleGrid() {
      const btns = document.querySelectorAll('.popup-style-btn');
      const hiddenInput = document.getElementById('popupUiTheme');
      if (!btns.length || !hiddenInput) return;
  
      const applyStyle = (styleVal) => {
        hiddenInput.value = styleVal;
        btns.forEach((b) => {
          const isActive = b.dataset.style === styleVal;
          b.classList.toggle('active', isActive);
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const styleVal = data.settings?.popupUiTheme || 'liquid-glass';
        applyStyle(styleVal);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          applyStyle(btn.dataset.style);
          const event = new Event('change', { bubbles: true });
          hiddenInput.dispatchEvent(event);
        });
      });
    }

  function initCursorStyleGrid() {
      const btns = document.querySelectorAll('.cursor-style-btn');
      const hiddenInput = document.getElementById('customCursor');
      if (!btns.length || !hiddenInput) return;
  
      const applyStyle = (styleVal) => {
        hiddenInput.value = styleVal;
        btns.forEach((b) => {
          const isActive = b.dataset.style === styleVal;
          b.classList.toggle('active', isActive);
          if (isActive) {
            b.style.background = 'rgba(255,255,255,0.15)';
            b.style.border = '1px solid rgba(255,255,255,0.3)';
          } else {
            b.style.background = 'rgba(255,255,255,0.03)';
            b.style.border = '1px solid rgba(255,255,255,0.05)';
          }
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const savedCursor = data.settings?.customCursor || 'default';
        applyStyle(savedCursor);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          applyStyle(btn.dataset.style);
          const event = new Event('change', { bubbles: true });
          hiddenInput.dispatchEvent(event);
        });
      });
    }

  return {
    initGlobalPlayerBarGrid,
    initCardStyleGrid,
    initYoutubeStyleGrid,
    initPopupStyleGrid,
    initCursorStyleGrid
  };
}
