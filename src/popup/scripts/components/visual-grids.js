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
  function initGlobalBarGrid() {
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

  function initCustomCursorUploader() {
      const normalInput = document.getElementById('fileNormalCursor');
      const pointerInput = document.getElementById('filePointerCursor');
      const normalBox = document.getElementById('uploadNormalCursor');
      const pointerBox = document.getElementById('uploadPointerCursor');
      const previewNormal = document.getElementById('previewNormalCursor');
      const previewPointer = document.getElementById('previewPointerCursor');
      const clearNormal = document.getElementById('clearNormalCursor');
      const clearPointer = document.getElementById('clearPointerCursor');

      if (!normalInput || !pointerInput) return;

      const handleUpload = (input, box, preview, settingKey) => {
          input.addEventListener('change', (e) => {
              const file = e.target.files[0];
              if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                      const base64 = ev.target.result;
                      preview.src = base64;
                      box.classList.add('has-image');
                      saveSettings({ [settingKey]: base64 });
                  };
                  reader.readAsDataURL(file);
              }
          });
      };

      const handleClear = (btn, box, preview, settingKey, input) => {
          btn.addEventListener('click', (e) => {
              e.stopPropagation();
              preview.src = '';
              box.classList.remove('has-image');
              input.value = '';
              saveSettings({ [settingKey]: null });
          });
      };

      const setupBoxClick = (box, input) => {
          box.addEventListener('click', (e) => {
              if (e.target.closest('.clear-cursor-btn')) return;
              input.click();
          });
      };

      handleUpload(normalInput, normalBox, previewNormal, 'normalCursorBase64');
      handleUpload(pointerInput, pointerBox, previewPointer, 'pointerCursorBase64');
      handleClear(clearNormal, normalBox, previewNormal, 'normalCursorBase64', normalInput);
      handleClear(clearPointer, pointerBox, previewPointer, 'pointerCursorBase64', pointerInput);
      setupBoxClick(normalBox, normalInput);
      setupBoxClick(pointerBox, pointerInput);

      // Load initial state
      chrome.storage.local.get('settings', (data) => {
          const settings = data.settings || {};
          if (settings.normalCursorBase64) {
              previewNormal.src = settings.normalCursorBase64;
              normalBox.classList.add('has-image');
          }
          if (settings.pointerCursorBase64) {
              previewPointer.src = settings.pointerCursorBase64;
              pointerBox.classList.add('has-image');
          }
      });
  }

  return {
    initGlobalBarGrid,
    initCardStyleGrid,
    initYoutubeStyleGrid,
    initCustomCursorUploader
  };
}
