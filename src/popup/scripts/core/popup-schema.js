import { ICONS } from '../ui/popup-icons.js';
import { getHomeTab } from '../schema/tab-home.js';
import { getShortsTab } from '../schema/tab-shorts.js';
import { getPlayerTab } from '../schema/tab-player.js';
import { getSpeedTab } from '../schema/tab-speed.js';
import { getModesTab } from '../schema/tab-modes.js';
import { getSearchTab } from '../schema/tab-search.js';
import { getDeclutterTab } from '../schema/tab-declutter.js';
import { getSubscriptionsTab } from '../schema/tab-subscriptions.js';
import { getHistoryTab } from '../schema/tab-history.js';
import { getBookmarksTab } from '../schema/tab-bookmarks.js';
import { getAppearanceTab } from '../schema/tab-appearance.js';
import { getPopup_designTab } from '../schema/tab-popup_design.js';
import { getAdvancedTab } from '../schema/tab-advanced.js';
import { getHotkeyTab } from '../schema/tab-hotkey.js';
import { getGlobalTab } from '../schema/tab-global.js';

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
