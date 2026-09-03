import { DEFAULT_SETTINGS } from '../../shared/config/default-settings.js';
import { mergeSettings } from '../services/settings-utils.js';

const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function handleGetSettings(sendResponse: (response: any) => void) {
  try {
    const [localData, syncData] = await Promise.all([
      chrome.storage.local.get('settings'),
      chrome.storage.sync.get('settings')
    ]);

    const localSettings = localData.settings || {};
    const syncSettings = syncData.settings || {};

    let currentSettings = mergeSettings(localSettings, syncSettings);
    
    if (Object.keys(currentSettings).length === 0) {
      currentSettings = DEFAULT_SETTINGS;
    }

    sendResponse(currentSettings);
  } catch (error) {
    console.error('[YPP] Error getting settings:', error);
    sendResponse(DEFAULT_SETTINGS);
  }
}

export async function handlePatchSettings(payload: any, sendResponse: (response: any) => void) {
  try {
    const [localData, syncData] = await Promise.all([
      chrome.storage.local.get('settings'),
      chrome.storage.sync.get('settings')
    ]);

    const localSettings = localData.settings || {};
    const syncSettings = syncData.settings || {};

    let currentSettings = mergeSettings(localSettings, syncSettings);

    const newSettings = { ...currentSettings, ...payload, lastUpdated: Date.now() };

    try {
      await chrome.storage.sync.set({ settings: newSettings });
    } catch (e) {
      console.warn('[YPP] Sync storage full, falling back to local only', e);
    }
    await chrome.storage.local.set({ settings: newSettings });

    const backupData = await chrome.storage.local.get('ypp_backup_time');
    const now = Date.now();
    if (
      !backupData.ypp_backup_time ||
      now - backupData.ypp_backup_time > BACKUP_INTERVAL_MS
    ) {
      if (Object.keys(currentSettings).length > 0) {
        await chrome.storage.local.set({
          ypp_settings_backup: currentSettings, 
          ypp_backup_time: now,
        });
        console.log('[YPP] Automated daily backup created.');
      }
    }

    sendResponse({ success: true, settings: newSettings });
  } catch (error) {
    console.error('[YPP] Error in PATCH_SETTINGS:', error);
    sendResponse({ success: false, error: (error as Error).message });
  }
}

export async function handleRestoreBackup(sendResponse: (response: any) => void) {
  try {
    const backupData = await chrome.storage.local.get('ypp_settings_backup');
    if (backupData.ypp_settings_backup) {
      const restoredSettings = { ...backupData.ypp_settings_backup, lastUpdated: Date.now() };
      try {
        await chrome.storage.sync.set({ settings: restoredSettings });
      } catch (e) {}
      await chrome.storage.local.set({ settings: restoredSettings });

      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No backup found' });
    }
  } catch (error) {
    sendResponse({ success: false, error: (error as Error).message });
  }
}
