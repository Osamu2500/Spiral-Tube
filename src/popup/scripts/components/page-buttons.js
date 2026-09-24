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
  function initFeatureModeButtons() {
      const btns = document.querySelectorAll('.feature-mode-btn');
      if (!btns.length) return;
  
      const applyMode = (feature, mode) => {
        const hiddenInput = document.getElementById(`${feature}Mode`);
        if (hiddenInput) hiddenInput.value = mode;

        btns.forEach((b) => {
          if (b.dataset.feature === feature) {
            const isActive = b.dataset.mode === mode;
            b.classList.toggle('active', isActive);
            b.style.background = isActive ? 'rgba(62,166,255,0.22)' : 'transparent';
            b.style.color = isActive ? 'var(--accent, #3ea6ff)' : 'rgba(255,255,255,0.5)';
          }
        });
      };
  
      chrome.storage.local.get('settings', (data) => {
        const settings = data.settings || {};
        
        // Find all unique features that have these buttons
        const features = new Set();
        btns.forEach(b => features.add(b.dataset.feature));

        features.forEach(feature => {
          const modeKey = `${feature}Mode`;
          // Default to 'hide' for shorts/mixes etc if not set, or 'dim' for hideWatched for legacy reasons
          const defaultMode = feature === 'hideWatched' ? 'dim' : 'hide';
          const mode = settings[modeKey] || defaultMode;
          applyMode(feature, mode);
        });
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          // Prevent the toggle from activating the main switch when clicking the mode pills inside the inline slot
          e.preventDefault();
          e.stopPropagation();

          const feature = btn.dataset.feature;
          const mode = btn.dataset.mode;
          applyMode(feature, mode);
          chrome.runtime.sendMessage(
            { action: 'PATCH_SETTINGS', payload: { [`${feature}Mode`]: mode } },
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

  const initHideWatchedPageButtons = createPageButtonInitializer('.hw-page-btn', 'hideWatched');
  const initShortsFilterPageButtons = createPageButtonInitializer('.shorts-page-btn', 'shortsFilter');
  const initPlaylistsPageButtons = createPageButtonInitializer('.playlists-page-btn', 'hidePlaylists');
  const initMixesPageButtons = createPageButtonInitializer('.mixes-page-btn', 'hideMixes');
  const initPodcastsPageButtons = createPageButtonInitializer('.podcasts-page-btn', 'hidePodcasts');
  const initPostsPageButtons = createPageButtonInitializer('.posts-page-btn', 'hidePosts');
  const initViewsFilterPageButtons = createPageButtonInitializer('.views-page-btn', 'viewsFilter');
  const initDateFilterPageButtons = createPageButtonInitializer('.date-page-btn', 'dateFilter');

  return {
    initFeatureModeButtons,
    initHideWatchedPageButtons,
    initViewsFilterPageButtons,
    initDateFilterPageButtons,
    initShortsFilterPageButtons,
    initPlaylistsPageButtons,
    initMixesPageButtons,
    initPodcastsPageButtons,
    initPostsPageButtons
  };
}
