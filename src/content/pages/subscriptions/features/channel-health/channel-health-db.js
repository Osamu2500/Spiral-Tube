import { ChannelHealthAPI } from './channel-health-api.js';

export class ChannelHealthDB {
    static DB_NAME_PREFIX = 'YPP_ChannelHealth';
    static DB_VERSION = 1;
    static _accountId = null;
    
    static async _getAccountId() {
        if (this._accountId !== null) return this._accountId;
        
        // Wait for DOM to be ready to ensure page-bridge is injected
        if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
            await new Promise(r => {
                const onReady = () => { r(); document.removeEventListener('DOMContentLoaded', onReady); };
                document.addEventListener('DOMContentLoaded', onReady);
                setTimeout(r, 1000); // safety fallback
            });
        }

        try {
            const config = await ChannelHealthAPI.getYoutubeConfig();
            let id = config?.dataSyncId || config?.pageId || config?.sessionIndex || 'default';
            id = String(id).replace(/[^a-zA-Z0-9_-]/g, '');
            this._accountId = id;
            return id;
        } catch(e) {
            this._accountId = 'default';
            return 'default';
        }
    }

    static async _getDB() {
        const accId = await this._getAccountId();
        const dbName = `${this.DB_NAME_PREFIX}_${accId}`;

        if (this._db && this._db.name === dbName) return this._db;
        
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(dbName, this.DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('cache')) {
                    db.createObjectStore('cache');
                }
                if (!db.objectStoreNames.contains('unsubs')) {
                    const store = db.createObjectStore('unsubs', { keyPath: 'id' });
                    store.createIndex('unsubTime', 'unsubTime', { unique: false });
                }
            };
            req.onsuccess = () => {
                this._db = req.result;
                resolve(this._db);
            };
            req.onerror = () => reject(req.error);
        });
    }

    static async getScanCache() {
        try {
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('cache', 'readonly');
                const store = tx.objectStore('cache');
                const req = store.get('v4_channels');
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            });
        } catch (e) {
            return null;
        }
    }

    static async saveScanCache(data) {
        try {
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('cache', 'readwrite');
                const store = tx.objectStore('cache');
                const req = store.put(data, 'v4_channels');
                req.onsuccess = () => resolve(true);
                req.onerror = () => resolve(false);
            });
        } catch (e) {
            return false;
        }
    }

    static async getSettings() {
        try {
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('cache', 'readonly');
                const store = tx.objectStore('cache');
                const req = store.get('v4_settings');
                req.onsuccess = () => resolve(req.result || { activeDays: 30, deadDays: 90 });
                req.onerror = () => resolve({ activeDays: 30, deadDays: 90 });
            });
        } catch (e) {
            return { activeDays: 30, deadDays: 90 };
        }
    }

    static async saveSettings(settings) {
        try {
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('cache', 'readwrite');
                const store = tx.objectStore('cache');
                const req = store.put(settings, 'v4_settings');
                req.onsuccess = () => resolve(true);
                req.onerror = () => resolve(false);
            });
        } catch (e) {
            return false;
        }
    }

    static async getSafeList() {
        try {
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('cache', 'readonly');
                const store = tx.objectStore('cache');
                const req = store.get('v4_safelist');
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            });
        } catch (e) {
            return [];
        }
    }

    static async toggleSafeList(channelId) {
        try {
            let list = await this.getSafeList();
            const idx = list.indexOf(channelId);
            let isSafe = false;
            if (idx > -1) {
                list.splice(idx, 1);
                isSafe = false;
            } else {
                list.push(channelId);
                isSafe = true;
            }
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('cache', 'readwrite');
                const store = tx.objectStore('cache');
                const req = store.put(list, 'v4_safelist');
                req.onsuccess = () => resolve(isSafe);
                req.onerror = () => resolve(null);
            });
        } catch(e) {
            return null;
        }
    }

    static async addUnsubChannel(channelData) {
        try {
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('unsubs', 'readwrite');
                const store = tx.objectStore('unsubs');
                if (!channelData.unsubTime) channelData.unsubTime = Date.now();
                const req = store.put(channelData);
                req.onsuccess = () => resolve(true);
                req.onerror = () => resolve(false);
            });
        } catch (e) {
            return false;
        }
    }

    static async getUnsubChannels() {
        try {
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('unsubs', 'readonly');
                const store = tx.objectStore('unsubs');
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            });
        } catch (e) {
            return [];
        }
    }

    static async removeUnsubChannel(id) {
        try {
            const db = await this._getDB();
            return new Promise((resolve) => {
                const tx = db.transaction('unsubs', 'readwrite');
                const store = tx.objectStore('unsubs');
                const req = store.delete(id);
                req.onsuccess = () => resolve(true);
                req.onerror = () => resolve(false);
            });
        } catch (e) {
            return false;
        }
    }

    static async purgeOldUnsubs() {
        try {
            const channels = await this.getUnsubChannels();
            const now = Date.now();
            const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
            
            const db = await this._getDB();
            const tx = db.transaction('unsubs', 'readwrite');
            const store = tx.objectStore('unsubs');
            
            channels.forEach(ch => {
                if (now - ch.unsubTime > THIRTY_DAYS) {
                    store.delete(ch.id);
                }
            });
            
            return new Promise((resolve) => {
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch(e) {
            return false;
        }
    }
}
