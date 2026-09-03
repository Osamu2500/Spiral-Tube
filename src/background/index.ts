import { initContextMenu } from './services/context-menu.js';
import { setupMessageRouter } from './core/message-router.js';
import { mergeSettings } from './services/settings-utils.js';
import { DEFAULT_SETTINGS } from '../shared/config/default-settings.js';
import { handleAlarm } from './handlers/timer-handler.js';

// Setup message routing for all background tasks
setupMessageRouter();

// Timer Alarm Listener
chrome.alarms.onAlarm.addListener(handleAlarm);

// Update Available
chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload();
});

// Initialization
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[YPP] Service Worker Installed:', details.reason);
  try {
    const localData = await chrome.storage.local.get('settings');
    const syncData = await chrome.storage.sync.get('settings');
    const localSettings = localData.settings || {};
    const syncSettings = syncData.settings || {};
    
    const existingSettings = mergeSettings(localSettings, syncSettings);

    const newSettings = { ...DEFAULT_SETTINGS, ...existingSettings };

    if ((existingSettings?.schemaVersion || 0) < 2) {
      newSettings.hideVideoTitle       = false;
      newSettings.hideChannelBar       = false;
      newSettings.hideVideoDescription = false;
      newSettings.hideActionButtons    = false;
      newSettings.schemaVersion        = 2;
    }

    try {
      await chrome.storage.sync.set({ settings: newSettings });
    } catch (e) {
      console.warn('[YPP] Sync storage full, falling back to local only', e);
    }
    await chrome.storage.local.set({ settings: newSettings });
    console.log('[YPP] Settings initialized and merged successfully.');

    initContextMenu();
  } catch (error) {
    console.error(
      '[YPP] Critical: Error initializing settings:',
      error
    );
  }
});
