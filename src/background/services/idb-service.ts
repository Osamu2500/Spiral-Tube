import { storage } from '../../shared/utils/storage/chrome-storage.js';

const CONFIG = {
    DB_NAME: 'spiral-tube-db',
    DB_VERSION: 1
};

export const STORES = {
    WATCH_HISTORY: 'watch_history',
    BOOKMARKS: 'bookmarks',
    EQ_PRESETS: 'eq_presets',
    SUB_GROUPS: 'subscription_groups',
};

let _db: IDBDatabase | null = null;

/** Open (or reuse) the database connection */
function _open(): Promise<IDBDatabase> {
    if (_db) return Promise.resolve(_db);

    return new Promise((resolve, reject) => {
        const req = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);

        req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            const db = (e.target as IDBOpenDBRequest).result;
            // Create all stores if they don't exist yet
            for (const storeName of Object.values(STORES)) {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName); // key-value: key = record key
                }
            }
        };

        req.onsuccess = (e: Event) => {
            _db = (e.target as IDBOpenDBRequest).result;
            // Re-open on unexpected close
            _db.onclose = () => { _db = null; };
            resolve(_db);
        };

        req.onerror = () => reject(req.error);
    });
}

/** Generic transaction helper */
async function _tx(storeName: string, mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest): Promise<any> {
    const db = await _open();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const req = fn(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export const idbApi = {
    STORES,

    /**
     * Set a value in the specified store by key.
     * @param {string} storeName
     * @param {string} key
     * @param {any} value
     * @returns {Promise<any>}
     */
    set(storeName: string, key: string, value: any): Promise<any> {
        return _tx(storeName, 'readwrite', store => store.put(value, key));
    },

    /**
     * Get a value from the specified store by key.
     * @param {string} storeName
     * @param {string} key
     * @returns {Promise<any>}
     */
    get(storeName: string, key: string): Promise<any> {
        return _tx(storeName, 'readonly', store => store.get(key));
    },

    /**
     * Get all key-value pairs from the specified store.
     * @param {string} storeName
     * @returns {Promise<Array<{key: string, value: any}>>}
     */
    getAll(storeName: string): Promise<Array<{key: string, value: any}>> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await _open();
                const tx = db.transaction(storeName, 'readonly');
                
                // Add error handler on transaction itself to catch premature aborts/failures
                tx.onerror = () => reject(tx.error);

                const store = tx.objectStore(storeName);
                const results: any[] = [];

                const keysReq = store.getAllKeys();
                const valsReq = store.getAll();

                keysReq.onsuccess = () => {
                    valsReq.onsuccess = () => {
                        keysReq.result.forEach((k, i) => {
                            results.push({ key: k, value: valsReq.result[i] });
                        });
                        resolve(results);
                    };
                    valsReq.onerror = () => reject(valsReq.error);
                };
                keysReq.onerror = () => reject(keysReq.error);
            } catch (e) {
                console.error(`[YPP:IDB] Failed to getAll for ${storeName}:`, (e as Error).message);
                reject(e);
            }
        });
    },

    /**
     * Delete a value from the specified store by key.
     * @param {string} storeName
     * @param {string} key
     * @returns {Promise<any>}
     */
    delete(storeName: string, key: string): Promise<any> {
        return _tx(storeName, 'readwrite', store => store.delete(key));
    },

    /**
     * Clear all data from the specified store.
     * @param {string} storeName
     * @returns {Promise<any>}
     */
    clear(storeName: string): Promise<any> {
        return _tx(storeName, 'readwrite', store => store.clear());
    },

    /**
     * Export all data from all stores.
     * @returns {Promise<Record<string, any>>}
     */
    async exportAll(): Promise<Record<string, any>> {
        const result: Record<string, any> = {};
        for (const storeName of Object.values(STORES)) {
            try {
                result[storeName] = await idbApi.getAll(storeName);
            } catch (e) {
                console.warn(`[YPP:IDB] Failed to export store ${storeName}:`, (e as Error).message);
                result[storeName] = [];
            }
        }
        return result;
    },

    /**
     * Import data into stores. Merges with existing data.
     * @param {Record<string, any>} data
     * @returns {Promise<void>}
     */
    async importAll(data: Record<string, any>): Promise<void> {
        for (const [storeName, records] of Object.entries(data)) {
            if (!Object.values(STORES).includes(storeName)) continue;
            // Removed idbApi.clear(storeName) so that syncDown merges items instead of wiping local items.
            for (const { key, value } of (records || [])) {
                try {
                    await idbApi.set(storeName, key, value);
                } catch (e) {
                    console.warn(`[YPP:IDB] Failed to import key ${key} into ${storeName}:`, (e as Error).message);
                }
            }
        }
    },

    async pruneOlderThan(storeName: string, days: number) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().split('T')[0];

        const all: any = await idbApi.getAll(storeName);
        const toDelete = all.filter(({ key }: {key: string}) => typeof key === 'string' && key < cutoffStr);
        for (const { key } of toDelete) {
            await idbApi.delete(storeName, key);
        }
        return toDelete.length;
    }
};

// Migrate bookmarks from chrome.storage.local to IDB
async function migrateBookmarks() {
    try {
        const data = await chrome.storage.local.get(['ypp_bookmarks', 'ypp_video_bookmarks']);
        let migrated = false;
        
        if (data.ypp_bookmarks && Array.isArray(data.ypp_bookmarks)) {
            for (const bm of data.ypp_bookmarks) {
                if (bm && bm.id) {
                    try {
                        await idbApi.set(STORES.BOOKMARKS, bm.id, bm);
                    } catch (e) {
                        console.warn(`[YPP:IDB] Migration failed for bookmark ${bm.id}:`, (e as Error).message);
                    }
                }
            }
            await chrome.storage.local.remove('ypp_bookmarks');
            migrated = true;
        }

        if (data.ypp_video_bookmarks && typeof data.ypp_video_bookmarks === 'object') {
            for (const [key, bm] of Object.entries(data.ypp_video_bookmarks)) {
                try {
                    await idbApi.set(STORES.BOOKMARKS, key, bm);
                } catch (e) {
                    console.warn(`[YPP:IDB] Migration failed for video bookmark ${key}:`, (e as Error).message);
                }
            }
            await chrome.storage.local.remove('ypp_video_bookmarks');
            migrated = true;
        }
        
        if (migrated) {
            console.info('[YPP:IDB] Migrated bookmarks to IndexedDB');
        }
    } catch (e) {
        console.error('[YPP:IDB] Failed to migrate bookmarks to IndexedDB:', (e as Error).message);
    }
}

// Run migration on startup
migrateBookmarks();

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action && request.action.startsWith('IDB_')) {
        const { action, storeName, key, value, data, days } = request;
        
        const respond = (result: any) => sendResponse({ success: true, result });
        const respondError = (error: any) => sendResponse({ success: false, error: error?.message || String(error) });

        switch (action) {
            case 'IDB_SET':
                idbApi.set(storeName, key, value).then(respond).catch(respondError);
                return true;
            case 'IDB_GET':
                idbApi.get(storeName, key).then(respond).catch(respondError);
                return true;
            case 'IDB_GET_ALL':
                idbApi.getAll(storeName).then(respond).catch(respondError);
                return true;
            case 'IDB_DELETE':
                idbApi.delete(storeName, key).then(respond).catch(respondError);
                return true;
            case 'IDB_CLEAR':
                idbApi.clear(storeName).then(respond).catch(respondError);
                return true;
            case 'IDB_EXPORT_ALL':
                idbApi.exportAll().then(respond).catch(respondError);
                return true;
            case 'IDB_IMPORT_ALL':
                idbApi.importAll(data).then(respond).catch(respondError);
                return true;
            case 'IDB_PRUNE':
                idbApi.pruneOlderThan(storeName, days).then(respond).catch(respondError);
                return true;
        }
    }
});
