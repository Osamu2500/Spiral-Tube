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


export function initpagebuttons(document, state, ui, updateSetting, notifyThemeChange, saveSettings) {
  function initHideWatchedModePill() {
      const btns = document.querySelectorAll('.hw-mode-btn');
      const hiddenInput = document.getElementById('hideWatchedMode');
      if (!btns.length || !hiddenInput) return;
  
      const applyMode = (mode) => {
        hiddenInput.value = mode;
        btns.forEach((b) => {
          const isActive = b.dataset.mode === mode;
          b.classList.toggle('active', isActive);
          b.style.background = isActive ? 'rgba(62,166,255,0.22)' : 'transparent';
          b.style.color = isActive ? 'var(--accent, #3ea6ff)' : 'rgba(255,255,255,0.5)';
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const mode = data.settings?.hideWatchedMode || 'dim';
        applyMode(mode);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode;
          applyMode(mode);
          chrome.runtime.sendMessage(
            { action: 'PATCH_SETTINGS', payload: { hideWatchedMode: mode } },
            () => {
              if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
            }
          );
        });
      });
    }

  function initHideWatchedPageButtons() {
      const btns = document.querySelectorAll('.hw-page-btn');
      if (!btns.length) return;
  
      const applyState = (settings) => {
        btns.forEach((btn) => {
          const page = btn.dataset.page;
          const key = 'hideWatched' + page.charAt(0).toUpperCase() + page.slice(1);
          const isActive = settings[key] !== false;
          btn.classList.toggle('active', isActive);
          if (isActive) {
            btn.style.background = 'rgba(255, 78, 69, 0.18)';
            btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
            btn.style.color = '#fff';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.04)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'rgba(255, 255, 255, 0.5)';
          }
        });
      };
  
      // Initialise button states from storage on popup open
      chrome.storage.local.get('settings', (data) => {
        const settings = data.settings || {};
        applyState(settings);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const page = btn.dataset.page;
          const key = 'hideWatched' + page.charAt(0).toUpperCase() + page.slice(1);
          const nextState = !btn.classList.contains('active');
  
          // Optimistically update the button visually immediately
          btn.classList.toggle('active', nextState);
          if (nextState) {
            btn.style.background = 'rgba(255, 78, 69, 0.18)';
            btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
            btn.style.color = '#fff';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.04)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'rgba(255, 255, 255, 0.5)';
          }
  
          // Save via PATCH_SETTINGS so it goes through the service worker,
          // syncs to chrome.storage.sync, AND triggers chrome.storage.onChanged
          // in the content script for real-time page filtering updates.
          chrome.runtime.sendMessage(
            { action: 'PATCH_SETTINGS', payload: { [key]: nextState } },
            () => {
              if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
            }
          );
        });
      });
    }

  function initMetaFilterPageButtons() {
      const btns = document.querySelectorAll('.meta-page-btn');
      if (!btns.length) return;
  
      const applyState = (settings) => {
        btns.forEach((btn) => {
          const page = btn.dataset.page;
          const key = 'metaFilter' + page.charAt(0).toUpperCase() + page.slice(1);
          const isActive = settings[key] !== false;
          btn.classList.toggle('active', isActive);
          if (isActive) {
            btn.style.background = 'rgba(255, 78, 69, 0.18)';
            btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
            btn.style.color = '#fff';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.04)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'rgba(255, 255, 255, 0.5)';
          }
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const settings = data.settings || {};
        applyState(settings);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const page = btn.dataset.page;
          const key = 'metaFilter' + page.charAt(0).toUpperCase() + page.slice(1);
          const nextState = !btn.classList.contains('active');
  
          btn.classList.toggle('active', nextState);
          if (nextState) {
            btn.style.background = 'rgba(255, 78, 69, 0.18)';
            btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
            btn.style.color = '#fff';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.04)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'rgba(255, 255, 255, 0.5)';
          }
  
          chrome.runtime.sendMessage(
            { action: 'PATCH_SETTINGS', payload: { [key]: nextState } },
            () => {
              if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
            }
          );
        });
      });
    }

  function initShortsFilterPageButtons() {
      const btns = document.querySelectorAll('.shorts-page-btn');
      if (!btns.length) return;
  
      const applyState = (settings) => {
        btns.forEach((btn) => {
          const page = btn.dataset.page;
          const key = 'shortsFilter' + page.charAt(0).toUpperCase() + page.slice(1);
          const isActive = settings[key] !== false;
          btn.classList.toggle('active', isActive);
          if (isActive) {
            btn.style.background = 'rgba(255, 78, 69, 0.18)';
            btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
            btn.style.color = '#fff';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.04)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'rgba(255, 255, 255, 0.5)';
          }
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const settings = data.settings || {};
        applyState(settings);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const page = btn.dataset.page;
          const key = 'shortsFilter' + page.charAt(0).toUpperCase() + page.slice(1);
          const nextState = !btn.classList.contains('active');
  
          btn.classList.toggle('active', nextState);
          if (nextState) {
            btn.style.background = 'rgba(255, 78, 69, 0.18)';
            btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
            btn.style.color = '#fff';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.04)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'rgba(255, 255, 255, 0.5)';
          }
  
          chrome.runtime.sendMessage(
            { action: 'PATCH_SETTINGS', payload: { [key]: nextState } },
            () => {
              if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
            }
          );
        });
      });
    }

  function createPageButtonInitializer(selector, keyPrefix) {
    return function() {
      const btns = document.querySelectorAll(selector);
      if (!btns.length) return;
  
      const applyState = (settings) => {
        btns.forEach((btn) => {
          const page = btn.dataset.page;
          const key = keyPrefix + page.charAt(0).toUpperCase() + page.slice(1);
          const isActive = settings[key] !== false;
          btn.classList.toggle('active', isActive);
          if (isActive) {
            btn.style.background = 'rgba(255, 78, 69, 0.18)';
            btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
            btn.style.color = '#fff';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.04)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'rgba(255, 255, 255, 0.5)';
          }
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const settings = data.settings || {};
        applyState(settings);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const page = btn.dataset.page;
          const key = keyPrefix + page.charAt(0).toUpperCase() + page.slice(1);
          const nextState = !btn.classList.contains('active');
  
          btn.classList.toggle('active', nextState);
          if (nextState) {
            btn.style.background = 'rgba(255, 78, 69, 0.18)';
            btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
            btn.style.color = '#fff';
          } else {
            btn.style.background = 'rgba(255, 255, 255, 0.04)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'rgba(255, 255, 255, 0.5)';
          }
  
          chrome.runtime.sendMessage(
            { action: 'PATCH_SETTINGS', payload: { [key]: nextState } },
            () => {
              if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
            }
          );
        });
      });
    }
  }

  const initPlaylistsPageButtons = createPageButtonInitializer('.playlists-page-btn', 'hidePlaylists');
  const initMixesPageButtons = createPageButtonInitializer('.mixes-page-btn', 'hideMixes');
  const initPodcastsPageButtons = createPageButtonInitializer('.podcasts-page-btn', 'hidePodcasts');
  const initPostsPageButtons = createPageButtonInitializer('.posts-page-btn', 'hidePosts');

  return {
    initHideWatchedModePill,
    initHideWatchedPageButtons,
    initMetaFilterPageButtons,
    initShortsFilterPageButtons,
    initPlaylistsPageButtons,
    initMixesPageButtons,
    initPodcastsPageButtons,
    initPostsPageButtons
  };
}
