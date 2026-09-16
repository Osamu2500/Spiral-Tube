import { storage } from '../../shared/utils/modules/chrome-storage.js';
import { idbApi } from './idb-service.js';

const FILE_NAME = 'ypp_full_backup.json';
const LEGACY_FILE_NAME = 'ypp_subscription_folders_backup.json';

export interface SyncPreferences {
    settings: boolean;
    subs: boolean;
    design: boolean;
    bookmarks: boolean;
    history: boolean;
    autoSync: boolean;
}

export interface BackupPayload {
    version: string;
    timestamp: string;
    storage: Record<string, any>;
    idb?: any;
}

export interface BackupInfo {
    timestamp: string;
    version: string;
    sizeBytes: number;
    fileId: string;
}

/**
 * Validates that a downloaded backup payload is structurally sound.
 * Returns an error message string if invalid, or null if valid.
 */
function validateBackup(payload: any): string | null {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return 'Backup file is corrupt or empty.';
    }
    // Legacy format (just an object without version) is allowed
    if (payload.storage !== undefined) {
        // New format — must have version and storage object
        if (typeof payload.version !== 'string') {
            return 'Backup is missing version information.';
        }
        if (typeof payload.storage !== 'object' || payload.storage === null) {
            return 'Backup storage data is malformed.';
        }
        if (Object.keys(payload.storage).length === 0) {
            return 'Backup appears to be empty (no settings found).';
        }
    }
    return null;
}

// Use our token cache that works across Chrome and Edge
async function getAuthToken(interactive = false): Promise<string> {
    // First try our custom cache (works in Edge via launchWebAuthFlow)
    const token = await storage.get<string>('google_auth_token');
    const expires = await storage.get<number>('google_auth_expires');
    if (token && expires && expires > Date.now()) {
        return token;
    }
    // Fallback to Chrome's built-in (works in Chrome)
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive }, (t) => {
            if (chrome.runtime.lastError || !t) {
                return reject(new Error(chrome.runtime.lastError?.message || 'Not signed in'));
            }
            resolve(t as string);
        });
    });
}

async function deleteBackupFile(token: string, fileName: string): Promise<void> {
    const file = await findBackupFile(token, fileName);
    if (!file) return;
    await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
}


async function findBackupFile(token: string, fileName = FILE_NAME): Promise<any> {
    const query = encodeURIComponent(`name='${fileName}'`);
    const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,modifiedTime)`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        chrome.identity.removeCachedAuthToken({ token }, () => {});
        throw new Error('Failed to search Drive files.');
    }
    
    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0] : null;
}

async function filterSyncData(storageData: any): Promise<{ filteredData: Record<string, any>; prefs: SyncPreferences }> {
    const local = await chrome.storage.local.get('ypp_sync_prefs');
    const prefs: SyncPreferences = local.ypp_sync_prefs || { settings: true, subs: true, design: true, bookmarks: true, history: true, autoSync: false };
    
    // Deep clone to avoid mutating in-memory state
    const clonedData = structuredClone(storageData);
    const filteredData: Record<string, any> = {};

    // 1. Core / General Settings
    if (prefs.settings) {
        const generalKeys = ['sidebar_order', 'favorite_settings', 'globalPlayerBarBlocklist', 'ypp_domain_profiles', 'ypp_domain_scope_prefs', 'ypp_custom_presets', 'searchViewMode'];
        generalKeys.forEach(k => { if (clonedData[k] !== undefined) filteredData[k] = clonedData[k]; });
    }

    // 2. Subscriptions
    if (prefs.subs) {
        if (clonedData.ypp_subscription_folders) filteredData.ypp_subscription_folders = clonedData.ypp_subscription_folders;
        if (clonedData.ypp_folder_config) filteredData.ypp_folder_config = clonedData.ypp_folder_config;
    }

    // 3. Bookmarks
    if (prefs.bookmarks) {
        if (clonedData.ypp_video_bookmarks) filteredData.ypp_video_bookmarks = clonedData.ypp_video_bookmarks;
        if (clonedData.ypp_bookmarks) filteredData.ypp_bookmarks = clonedData.ypp_bookmarks;
        if (clonedData.ytProVideos) filteredData.ytProVideos = clonedData.ytProVideos;
    }

    // 4. Design
    if (prefs.design && clonedData.customScalePreset !== undefined) {
        filteredData.customScalePreset = clonedData.customScalePreset;
    }

    // 5. Settings Object (Mixed: General & Design)
    const designKeys = ['popupWidth', 'popupHeight', 'popupZoom', 'popupRadius', 'fontScale', 'featureGridCols', 'popupDensity', 'accentColor', 'secondaryAccentColor'];
    
    if (clonedData.settings) {
        const newSettings: Record<string, any> = {};
        for (const [k, v] of Object.entries(clonedData.settings)) {
            const isDesignKey = designKeys.includes(k);
            if ((isDesignKey && prefs.design) || (!isDesignKey && prefs.settings)) {
                newSettings[k] = v;
            }
        }
        if (Object.keys(newSettings).length > 0) {
            filteredData.settings = newSettings;
        }
    }

    return { filteredData, prefs };
}

export async function syncUp() {
    try {
        const token = await getAuthToken(true);
        const storage = await chrome.storage.local.get(null);
        
        const { filteredData, prefs } = await filterSyncData(storage);

        let idbData = null;
        if (prefs.history !== false) {
            try {
                idbData = await idbApi.exportAll();
            } catch (e) {
                console.warn('[YPP] Failed to export IDB for sync:', e);
            }
        }
        
        const manifest = chrome.runtime.getManifest();
        const payload: BackupPayload = {
            version: manifest.version,
            timestamp: new Date().toISOString(),
            storage: filteredData
        };
        if (idbData) payload.idb = idbData;
        
        const fileContent = JSON.stringify(payload);
        const existingFile = await findBackupFile(token, FILE_NAME);
        
        const metadata = {
            name: FILE_NAME,
            parents: ['appDataFolder']
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([fileContent], { type: 'application/json' }));

        let fetchUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        let method = 'POST';

        if (existingFile) {
            fetchUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`;
            method = 'PATCH';
        }

        const response = await fetch(fetchUrl, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        });

        if (!response.ok) {
            chrome.identity.removeCachedAuthToken({ token }, () => {});
            throw new Error('Failed to upload sync data to Drive');
        }
        
        const syncTime = new Date().toISOString();
        await chrome.storage.local.set({ ypp_last_sync_time: syncTime });
        
        return { success: true, timestamp: syncTime };
    } catch (error) {
        console.error('[YPP] Sync Up Error:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function syncDown() {
    try {
        const token = await getAuthToken(true);
        
        let existingFile = await findBackupFile(token, FILE_NAME);
        let isLegacy = false;
        
        if (!existingFile) {
            existingFile = await findBackupFile(token, LEGACY_FILE_NAME);
            isLegacy = true;
        }
        
        if (!existingFile) {
            return { success: true, message: 'No backup found' };
        }

        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            chrome.identity.removeCachedAuthToken({ token }, () => {});
            throw new Error('Failed to download sync data from Drive');
        }
        
        const downloadedData = await response.json() as BackupPayload;

        // Validate backup integrity before doing anything
        const validationError = validateBackup(downloadedData);
        if (validationError) {
            throw new Error(validationError);
        }

        if (isLegacy) {
            await chrome.storage.local.set({ ypp_subscription_folders: downloadedData });
        } else {
            const rawStorageData = downloadedData.storage || downloadedData; // support old format
            const { filteredData: storageData, prefs } = await filterSyncData(rawStorageData);
            await chrome.storage.local.set(storageData);

            // Also push the settings object into chrome.storage.sync so both areas stay consistent.
            // This ensures popup scale, accent colors, and all UI settings apply immediately.
            if (storageData.settings) {
                try {
                    await chrome.storage.sync.set({ settings: { ...storageData.settings, lastUpdated: Date.now() } });
                } catch (e) {
                    console.warn('[YPP] Could not push restored settings to sync storage:', e);
                }
            }

            // Restore IDB data if present and allowed
            if (downloadedData.idb && prefs.history !== false) {
                try {
                    await idbApi.importAll(downloadedData.idb);
                } catch (e) {
                    console.warn('[YPP] Failed to import IDB from sync:', e);
                }
            }
        }
        
        const syncTime = new Date().toISOString();
        await chrome.storage.local.set({ ypp_last_sync_time: syncTime });
        
        return { success: true, data: downloadedData, timestamp: syncTime };
    } catch (error) {
        console.error('[YPP] Sync Down Error:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function syncReset() {
    try {
        // Clear all local storage (keep internal auth tokens)
        const keysToKeep = ['google_auth_token', 'google_auth_expires'];
        const allData = await storage.getAll();
        const toRemove = Object.keys(allData).filter(k => !keysToKeep.includes(k));
        await storage.remove(toRemove);

        // Also delete the Drive backup file if signed in
        try {
            const token = await getAuthToken(false);
            await deleteBackupFile(token, FILE_NAME);
            await deleteBackupFile(token, LEGACY_FILE_NAME);
        } catch (_) {
            // Not signed in — that's fine, local reset still succeeded
        }

        return { success: true };
    } catch (error) {
        console.error('[YPP] Reset Error:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Fetches only the metadata of the backup file on Drive (file ID, size,
 * modified time, version embedded in filename) WITHOUT downloading the
 * entire backup. Used by the UI to show "Last cloud backup" info.
 */
export async function getBackupInfo(): Promise<BackupInfo | null> {
    try {
        const token = await getAuthToken(false);
        const query = encodeURIComponent(`name='${FILE_NAME}'`);
        const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,modifiedTime,size)&pageSize=1`;
        const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!resp.ok) return null;
        const data = await resp.json();
        const file = data.files?.[0];
        if (!file) return null;

        // Fetch just the version from the payload (first ~100 bytes is enough)
        // We use a Range header to avoid downloading the whole file
        const dlResp = await fetch(
            `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
            { headers: { Authorization: `Bearer ${token}`, Range: 'bytes=0-512' } }
        );
        let version = 'unknown';
        let timestamp = file.modifiedTime;
        try {
            const partial = await dlResp.text();
            // Grab version from partial JSON — it's always near the start
            const vMatch = partial.match(/"version"\s*:\s*"([^"]+)"/);
            const tsMatch = partial.match(/"timestamp"\s*:\s*"([^"]+)"/);
            if (vMatch) version = vMatch[1];
            if (tsMatch) timestamp = tsMatch[1];
        } catch (_) { /* ignore partial parse errors */ }

        return {
            fileId: file.id,
            timestamp,
            version,
            sizeBytes: parseInt(file.size || '0', 10)
        };
    } catch {
        return null;
    }
}
