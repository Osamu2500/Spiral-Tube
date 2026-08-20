const FILE_NAME = 'ypp_full_backup.json';
const LEGACY_FILE_NAME = 'ypp_subscription_folders_backup.json';

async function getAuthToken(interactive = false): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive }, (token) => {
            if (chrome.runtime.lastError || !token) {
                return reject(chrome.runtime.lastError);
            }
            resolve(token);
        });
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

export async function syncUp() {
    try {
        const token = await getAuthToken(true);
        const storage = await chrome.storage.local.get(null);
        
        const keysToExclude = ['timerState', 'ypp_last_sync_time', 'ypp_backup_time', 'ypp_settings_backup'];
        keysToExclude.forEach(key => delete storage[key]);
        
        const fileContent = JSON.stringify(storage);
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
        
        const downloadedData = await response.json();

        // Basic Schema Validation
        if (typeof downloadedData !== 'object' || Array.isArray(downloadedData) || downloadedData === null) {
            throw new Error('Invalid backup schema from Drive');
        }
        
        if (isLegacy) {
            await chrome.storage.local.set({ ypp_subscription_folders: downloadedData });
        } else {
            const keysToExclude = ['timerState', 'ypp_last_sync_time', 'ypp_backup_time', 'ypp_settings_backup'];
            keysToExclude.forEach(key => delete downloadedData[key]);
            
            await chrome.storage.local.set(downloadedData);
        }
        
        const syncTime = new Date().toISOString();
        await chrome.storage.local.set({ ypp_last_sync_time: syncTime });
        
        return { success: true, data: downloadedData, timestamp: syncTime };
    } catch (error) {
        console.error('[YPP] Sync Down Error:', error);
        return { success: false, error: (error as Error).message };
    }
}
