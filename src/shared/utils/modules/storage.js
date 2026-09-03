import { CONSTANTS } from '../../config/constants/index.js';
import { SettingsSchema } from '../../config/settings-schema.js';

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

export const saveSettings = async (settings) => {
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

