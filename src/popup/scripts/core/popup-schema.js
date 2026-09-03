import { ICONS } from '../ui/popup-icons.js';
import {
    getHomeTab, getShortsTab, getPlayerTab, getSpeedTab, getModesTab,
    getSearchTab, getDeclutterTab, getSubscriptionsTab, getHistoryTab,
    getBookmarksTab, getAppearanceTab, getPopup_designTab, getAdvancedTab,
    getHotkeyTab, getGlobalTab
} from '../schema/index.js';

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
