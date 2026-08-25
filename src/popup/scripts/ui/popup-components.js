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


import { initthemeselector } from '../components/theme-selector.js';
import { initpagebuttons } from '../components/page-buttons.js';
import { initvisualgrids } from '../components/visual-grids.js';
import { initinlinesliders } from '../components/inline-sliders.js';

export function initComponents(
  document,
  state,
  ui,
  updateSetting,
  notifyThemeChange,
  saveSettings
) {
    const theme_selector = initthemeselector(document, state, ui, updateSetting, notifyThemeChange, saveSettings);
    const page_buttons = initpagebuttons(document, state, ui, updateSetting, notifyThemeChange, saveSettings);
    const visual_grids = initvisualgrids(document, state, ui, updateSetting, notifyThemeChange, saveSettings);
    const inline_sliders = initinlinesliders(document, state, ui, updateSetting, notifyThemeChange, saveSettings);

  return Object.assign({}, 
    theme_selector,
    page_buttons,
    visual_grids,
    inline_sliders
  );
}
