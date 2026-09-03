import { getHomeTab } from './tabs/tab-home.js';
import { getShortsTab } from './tabs/tab-shorts.js';
import { getPlayerTab } from './tabs/tab-player.js';
import { getSpeedTab } from './tabs/tab-speed.js';
import { getModesTab } from './tabs/tab-modes.js';
import { getSearchTab } from './tabs/tab-search.js';
import { getDeclutterTab } from './tabs/tab-declutter.js';
import { getSubscriptionsTab } from './tabs/tab-subscriptions.js';
import { getHistoryTab } from './tabs/tab-history.js';
import { getBookmarksTab } from './tabs/tab-bookmarks.js';
import { getAppearanceTab } from './tabs/tab-appearance.js';
import { getPopup_designTab } from './tabs/tab-popup-design.js';
import { getAdvancedTab } from './tabs/tab-advanced.js';
import { getHotkeyTab } from './tabs/tab-hotkey.js';
import { getGlobalTab } from './tabs/tab-global.js';

import { ICONS } from '../ui/popup-icons.js';

export const CUSTOM_SLOT_RENDERERS = new Map();

export function getPopupSchema(t) {
    return [
        getHomeTab(t),
        getShortsTab(t),
        getPlayerTab(t),
        getSpeedTab(t),
        getModesTab(t),
        getSearchTab(t),
        getDeclutterTab(t),
        getSubscriptionsTab(t),
        getHistoryTab(t),
        getBookmarksTab(t),
        getAppearanceTab(t),
        getPopup_designTab(t),
        getAdvancedTab(t),
        getHotkeyTab(t),
        getGlobalTab(t)
    ];
}
