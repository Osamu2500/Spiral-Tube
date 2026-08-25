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


export function initinlinesliders(document, state, ui, updateSetting, notifyThemeChange, saveSettings) {
  function initSearchViewMode() {
      const container = document.getElementById('searchViewModeToggle');
      if (!container) return;
  
      const btns = container.querySelectorAll('.view-mode-btn');
  
      const applyActiveState = (mode) => {
        btns.forEach((b) => {
          const isActive = b.dataset.mode === mode;
          b.classList.toggle('active', isActive);
          b.style.background = isActive ? 'rgba(62,166,255,0.22)' : 'transparent';
          b.style.color = isActive ? '#ff4e45' : 'rgba(255,255,255,0.5)';
        });
      };
  
      chrome.storage.local.get(['searchViewMode'], (result) => {
        const savedMode =
          result.searchViewMode || localStorage.getItem('ypp_searchViewMode') || 'grid';
        applyActiveState(savedMode);
      });
  
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode;
          applyActiveState(mode);
  
          chrome.storage.local.set({ searchViewMode: mode });
          localStorage.setItem('ypp_searchViewMode', mode);
  
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab && tab.url && tab.url.includes('youtube.com/results')) {
              chrome.tabs
                .sendMessage(tab.id, {
                  type: 'YPP_SET_SEARCH_VIEW_MODE',
                  mode: mode,
                })
                .catch(() => {});
            }
          });
        });
      });
    }

  function initAutoLikeInlineControls() {
      const typeBtn = document.getElementById('autoLikeDelayTypeBtn');
      const hiddenType = document.getElementById('autoLikeDelayType');
      const hiddenInput = document.getElementById('autoLikeThreshold');
      const sliderUI = document.getElementById('autoLikeThresholdUI');
      const sliderVal = document.getElementById('autoLikeThresholdValue');
      if (!typeBtn || !hiddenType || !hiddenInput || !sliderUI) return;
  
      const AUTO_LIKE_SEC_STEPS = [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 220, 240, 260, 280, 300];
      const AUTO_LIKE_PCT_STEPS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  
      const getSteps = (type) => type === 'percent' ? AUTO_LIKE_PCT_STEPS : AUTO_LIKE_SEC_STEPS;
  
      const syncUIFromValue = (val, type) => {
        const steps = getSteps(type);
        let idx = steps.findIndex(v => v >= Number(val || 0));
        if (idx === -1) idx = 0;
        sliderUI.value = idx;
        if (sliderVal) sliderVal.textContent = steps[idx] + (type === 'percent' ? '%' : 's');
      };
  
      const updateVisuals = (type) => {
        hiddenType.value = type;
        const steps = getSteps(type);
        sliderUI.max = steps.length - 1;
        sliderUI.step = 1;
        if (type === 'percent') {
          typeBtn.textContent = '%';
          typeBtn.title = 'Switch to Seconds';
        } else {
          typeBtn.textContent = 's';
          typeBtn.title = 'Switch to Percent';
        }
        syncUIFromValue(hiddenInput.value, type);
      };
  
      const origDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      Object.defineProperty(hiddenInput, 'value', {
        get: function() { return origDesc.get.call(this); },
        set: function(val) {
          origDesc.set.call(this, val);
          syncUIFromValue(val, hiddenType.value || 'seconds');
        }
      });
  
      chrome.storage.local.get('settings', (data) => {
        const type = data.settings?.autoLikeDelayType || 'seconds';
        updateVisuals(type);
      });
  
      typeBtn.addEventListener('click', () => {
        const newType = hiddenType.value === 'percent' ? 'seconds' : 'percent';
        updateVisuals(newType);
        hiddenType.dispatchEvent(new Event('change', { bubbles: true }));
      });
  
      sliderUI.addEventListener('input', () => {
        const steps = getSteps(hiddenType.value || 'seconds');
        const idx = parseInt(sliderUI.value, 10) || 0;
        const val = steps[idx] !== undefined ? steps[idx] : 0;
        if (sliderVal) sliderVal.textContent = val + (hiddenType.value === 'percent' ? '%' : 's');
        hiddenInput.value = val;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

  function initViewsFilterInlineSlider() {
      const sliderUI = document.getElementById('viewsHideThresholdUI');
      const sliderVal = document.getElementById('viewsHideThresholdValue');
      const hiddenInput = document.getElementById('viewsHideThreshold');
      if (!sliderUI || !hiddenInput) return;
  
      const discreteOptions = [
        { value: 0, label: t('off') },
        { value: 100, label: t('100') },
        { value: 500, label: t('500') },
        { value: 1000, label: t('1_000') },
        { value: 5000, label: t('5_000') },
        { value: 10000, label: t('10k') },
        { value: 50000, label: t('50k') },
        { value: 100000, label: t('100k') },
        { value: 500000, label: t('500k') },
        { value: 1000000, label: t('1m') },
        { value: 5000000, label: t('5m') },
        { value: 10000000, label: t('10m') },
      ];
  
      const updateUI = (val) => {
        let index = discreteOptions.findIndex((o) => o.value == val);
        if (index === -1) index = 0;
        sliderUI.value = index;
        if (sliderVal) sliderVal.textContent = discreteOptions[index].label;
      };
  
      chrome.storage.local.get('settings', (data) => {
        const val = data.settings?.viewsHideThreshold || 0;
        updateUI(val);
      });
  
      sliderUI.addEventListener('input', () => {
        const opt = discreteOptions[sliderUI.value];
        if (sliderVal) sliderVal.textContent = opt.label;
        hiddenInput.value = opt.value;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

  function initBasicInlineSlider(baseId, defaultValue) {
      const sliderUI = document.getElementById(baseId + 'UI');
      const sliderVal = document.getElementById(baseId + 'Value');
      const hiddenInput = document.getElementById(baseId);
      if (!sliderUI || !hiddenInput) return;
  
      chrome.storage.local.get('settings', (data) => {
        const val = data.settings?.[baseId] !== undefined ? data.settings[baseId] : defaultValue;
        sliderUI.value = val;
        if (sliderVal) sliderVal.textContent = val;
      });
  
      sliderUI.addEventListener('input', () => {
        if (sliderVal) sliderVal.textContent = sliderUI.value;
        hiddenInput.value = sliderUI.value;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

  function initDateFilterInlineSliders() {
      const olderUI = document.getElementById('dateFilterOlderThresholdUI');
      const olderVal = document.getElementById('dateFilterOlderThresholdValue');
      const olderHidden = document.getElementById('dateFilterOlderThreshold');
  
      const newerUI = document.getElementById('dateFilterNewerThresholdUI');
      const newerVal = document.getElementById('dateFilterNewerThresholdValue');
      const newerHidden = document.getElementById('dateFilterNewerThreshold');
  
      if (!olderUI || !newerUI) return;
  
      const discreteOptions = [
        { value: 0, label: t('off') },
        { value: 1, label: t('1_day') },
        { value: 2, label: t('2_days') },
        { value: 3, label: t('3_days') },
        { value: 7, label: t('1_week') },
        { value: 14, label: t('2_weeks') },
        { value: 21, label: t('3_weeks') },
        { value: 30, label: t('1_month') },
        { value: 90, label: t('3_months') },
        { value: 180, label: t('6_months') },
        { value: 365, label: t('1_year') },
        { value: 730, label: t('2_years') },
        { value: 1825, label: t('5_years') },
        { value: 3650, label: t('10_years') },
      ];
  
      const setupSlider = (sliderUI, sliderVal, hiddenInput, keyName) => {
        const updateUI = (val) => {
          let index = discreteOptions.findIndex((o) => o.value == val);
          if (index === -1) index = 0;
          sliderUI.value = index;
          if (sliderVal) sliderVal.textContent = discreteOptions[index].label;
        };
        chrome.storage.local.get('settings', (data) => {
          const val = data.settings?.[keyName] || 0;
          updateUI(val);
        });
        sliderUI.addEventListener('input', () => {
          const opt = discreteOptions[sliderUI.value];
          if (sliderVal) sliderVal.textContent = opt.label;
          hiddenInput.value = opt.value;
          hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        });
      };
  
      setupSlider(olderUI, olderVal, olderHidden, 'dateFilterOlderThreshold');
      setupSlider(newerUI, newerVal, newerHidden, 'dateFilterNewerThreshold');
    }

  return {
    initSearchViewMode,
    initAutoLikeInlineControls,
    initViewsFilterInlineSlider,
    initBasicInlineSlider,
    initDateFilterInlineSliders
  };
}
