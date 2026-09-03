import { DEFAULT_SETTINGS } from '../default-settings.js';
import { PREMIUM_COLORS, THEMES, CARD_STYLES, YOUTUBE_PAGE_THEMES } from './themes.js';
import { SELECTORS, CSS_CLASSES } from './selectors.js';
import { GRID, TIMINGS, STUDY, PLAYER, AMBIENT, THUMBNAIL, TYPOGRAPHY } from './core.js';

window.YPP = window.YPP || {};
window.YPP.CONSTANTS = {
    DEFAULT_SETTINGS,
    PREMIUM_COLORS,
    SELECTORS,
    CSS_CLASSES,
    GRID,
    TIMINGS,
    STUDY,
    PLAYER,
    AMBIENT,
    THUMBNAIL,
    TYPOGRAPHY,
    THEMES
};

// Deep freeze CONSTANTS.DEFAULT_SETTINGS to prevent accidental state mutation
const deepFreeze = obj => {
    if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
        Object.keys(obj).forEach(prop => deepFreeze(obj[prop]));
        Object.freeze(obj);
    }
    return obj;
};

if (window.YPP.CONSTANTS && window.YPP.CONSTANTS.DEFAULT_SETTINGS) {
    deepFreeze(window.YPP.CONSTANTS.DEFAULT_SETTINGS);
}

export * from './themes.js';
export * from './selectors.js';
export * from './core.js';
export const CONSTANTS = window.YPP.CONSTANTS;
