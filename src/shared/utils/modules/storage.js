import { CONSTANTS } from '../../config/constants/index.js';
import { SettingsSchema } from '../../config/settings-schema.js';
import { signIn } from './google-auth.js';
import { pushData, pullData } from './drive-sync.js';

export const safeJsonParse = (jsonString, fallback = null) => {
        if (!jsonString || typeof jsonString !== 'string') {
            return fallback;
        }

        try {
            return JSON.parse(jsonString);
        } catch (error) {
            window.YPP.Utils?.log('JSON parse error: ' + error.message, 'UTILS', 'warn');
            return fallback;
        }
    };

export const safeJsonStringify = (obj, fallback = '{}') => {
        try {
            return JSON.stringify(obj);
        } catch (error) {
            window.YPP.Utils?.log('JSON stringify error: ' + error.message, 'UTILS', 'warn');
            return fallback;
        }
    };

let syncTimeout = null;
const SYNC_DEBOUNCE_MS = 5000;

export const syncToCloud = (settings) => {
    return new Promise((resolve) => {
        if (syncTimeout) {
            clearTimeout(syncTimeout);
        }
        syncTimeout = setTimeout(async () => {
            try {
                const token = await signIn(false).catch(() => null);
                if (token) {
                    await pushData(token, 'spiral-tube-settings.json', settings);
                    window.YPP.Utils?.log('Cloud sync completed', 'SYNC', 'debug');
                    
                    // Update UI timestamp if necessary
                    const event = new CustomEvent('cloud-sync-completed', { detail: { timestamp: Date.now() } });
                    document.dispatchEvent(event);
                }
            } catch (error) {
                window.YPP.Utils?.log('Cloud sync failed: ' + error.message, 'SYNC', 'warn');
            }
            resolve();
        }, SYNC_DEBOUNCE_MS);
    });
};

export const syncFromCloud = async () => {
    try {
        const token = await signIn(false).catch(() => null);
        if (token) {
            const data = await pullData(token, 'spiral-tube-settings.json');
            if (data) {
                await saveSettings(data, false);
                return data;
            }
        }
    } catch (error) {
        window.YPP.Utils?.log('Cloud pull failed: ' + error.message, 'SYNC', 'warn');
    }
    return null;
};

export const loadSettings = async () => {
        try {
            if (!chrome?.storage) {
                window.YPP.Utils?.log('Chrome storage not available', 'UTILS', 'warn');
                return CONSTANTS.DEFAULT_SETTINGS || {};
            }

            const getStorage = (area) => new Promise(resolve => {
                try {
                    area.get('settings', res => resolve(chrome.runtime.lastError ? {} : (res || {})));
                } catch (e) { resolve({}); }
            });

            // Fetch from both sync and local storage
            const [syncData, localData] = await Promise.all([
                getStorage(chrome.storage.sync),
                getStorage(chrome.storage.local)
            ]);
            
            const syncSettings = syncData?.settings;
            const localSettings = localData?.settings;
            
            let raw = {};
            if (syncSettings && localSettings) {
                const syncTime = syncSettings.lastUpdated || 0;
                const localTime = localSettings.lastUpdated || 0;
                // Merge, preferring the most recently updated settings
                raw = syncTime >= localTime 
                    ? { ...localSettings, ...syncSettings } 
                    : { ...syncSettings, ...localSettings };
            } else {
                raw = syncSettings || localSettings || {};
            }

            // Run through schema validator if available (settings-schema.js loads before utils)
            if (window.YPP?.SettingsSchema) {
                return window.YPP.SettingsSchema.validateAndMerge(raw);
            }

            // Fallback: merge raw over defaults
            return Object.assign({}, CONSTANTS.DEFAULT_SETTINGS || {}, raw);
        } catch (error) {
            window.YPP.Utils?.log('Error loading settings: ' + error.message, 'UTILS', 'error');
            return CONSTANTS.DEFAULT_SETTINGS || {};
        }
    };

export const saveSettings = async (settings, triggerCloudSync = true) => {
        try {
            if (!chrome?.storage) {
                window.YPP.Utils?.log('Chrome storage not available', 'UTILS', 'warn');
                return;
            }
            
            const currentSettings = await window.YPP.Utils.loadSettings();
            const newSettings = { ...currentSettings, ...settings, lastUpdated: Date.now() };

            // Try saving to sync storage first
            try {
                await chrome.storage.sync.set({ settings: newSettings });
            } catch (e) {
                window.YPP.Utils?.log('Sync storage quota exceeded, falling back to local: ' + e.message, 'UTILS', 'warn');
            }
            
            // Always save to local as a reliable backup
            await chrome.storage.local.set({ settings: newSettings });
            
            if (triggerCloudSync) {
                if (syncTimeout) clearTimeout(syncTimeout);
                syncTimeout = setTimeout(() => {
                    syncToCloud(newSettings);
                }, SYNC_DEBOUNCE_MS);
            }
            
            window.YPP.Utils?.log('Settings saved', 'UTILS', 'debug');
        } catch (error) {
            window.YPP.Utils?.log('Error saving settings: ' + error.message, 'UTILS', 'error');
        }
    };

export const getSetting = async (key, fallback = null) => {
        if (!key || typeof key !== 'string') return fallback;
        try {
            if (!chrome?.storage?.local) return fallback;
            const result = await chrome.storage.local.get([key]);
            return result[key] !== undefined ? result[key] : fallback;
        } catch (error) {
            window.YPP.Utils?.log(`Error reading storage key "${key}": ${error.message}`, 'UTILS', 'warn');
            return fallback;
        }
    };

