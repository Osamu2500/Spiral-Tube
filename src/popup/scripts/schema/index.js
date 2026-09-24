import { getHomeTab } from './tabs/pages/tab-home.js';
import { getShortsTab } from './tabs/pages/tab-shorts.js';
import { getPlayerTab } from './tabs/playback/tab-player.js';
import { getSpeedTab } from './tabs/playback/tab-speed.js';
import { getModesTab } from './tabs/ui/tab-modes.js';
import { getSearchTab } from './tabs/pages/tab-search.js';
import { getDeclutterTab } from './tabs/ui/tab-declutter.js';
import { getSubscriptionsTab } from './tabs/pages/tab-subscriptions.js';
import { getHistoryTab } from './tabs/pages/tab-history.js';
import { getBookmarksTab } from './tabs/features/tab-bookmarks.js';
import { getAppearanceTab } from './tabs/ui/tab-appearance.js';
import { getPopupDesignTab } from './tabs/ui/tab-popup-design.js';
import { getAdvancedTab } from './tabs/advanced/tab-advanced.js';
import { getHotkeyTab } from './tabs/advanced/tab-hotkey.js';
import { getGlobalTab } from './tabs/advanced/tab-global.js';

import { ICONS } from '../ui/popup-icons.js';

export const CUSTOM_SLOT_RENDERERS = new Map();

export function getPopupSchema(t) {
    return [
        getHomeTab(t),
        getShortsTab(t),
        getPlayerTab(t),
        getModesTab(t),
        getSpeedTab(t),
        getSearchTab(t),
        getDeclutterTab(t),
        getSubscriptionsTab(t),
        getHistoryTab(t),
        getBookmarksTab(t),
        getAppearanceTab(t),
        getPopupDesignTab(t),
        getAdvancedTab(t),
        getHotkeyTab(t),
        getGlobalTab(t)
    ];
}
