export class ChannelHealthDB {
    static DB_NAME = 'YPP_ChannelHealth';
    static DB_VERSION = 1;
    
    static async _getDB() {
        if (this._db) return this._db;
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
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
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cache', 'readonly');
            const store = tx.objectStore('cache');
            const req = store.get('v4_channels');
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
    }

    static async saveScanCache(data) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cache', 'readwrite');
            const store = tx.objectStore('cache');
            const req = store.put(data, 'v4_channels');
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    static async addUnsubChannel(channelData) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('unsubs', 'readwrite');
            const store = tx.objectStore('unsubs');
            // Ensure we have unsubTime
            if (!channelData.unsubTime) channelData.unsubTime = Date.now();
            const req = store.put(channelData);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    static async getUnsubChannels() {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('unsubs', 'readonly');
            const store = tx.objectStore('unsubs');
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    static async removeUnsubChannel(id) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('unsubs', 'readwrite');
            const store = tx.objectStore('unsubs');
            const req = store.delete(id);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    static async purgeOldUnsubs() {
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
            tx.oncomplete = () => resolve();
        });
    }
}
