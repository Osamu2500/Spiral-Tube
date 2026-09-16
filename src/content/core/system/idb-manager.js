/**
 * @fileoverview YPP IndexedDB Manager (Proxy to Background Script)
 * @purpose Forwards IDB requests to the background service worker where the actual DB lives.
 * This solves the cross-origin IDB issue and allows popup/background to sync reliably.
 */

window.YPP = window.YPP || {};

window.YPP.IDB = (() => {
    const STORES = {
        WATCH_HISTORY: 'watch_history',
        BOOKMARKS:     'bookmarks',
        EQ_PRESETS:    'eq_presets',
        SUB_GROUPS:    'subscription_groups',
    };

    /** Helper to send message to background script */
    function _send(action, payload = {}) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action, ...payload }, (response) => {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError.message));
                }
                if (!response || !response.success) {
                    return reject(new Error(response?.error || 'Unknown IDB Error'));
                }
                resolve(response.result);
            });
        });
    }

    const api = {
        STORES,

        set(storeName, key, value) {
            return _send('IDB_SET', { storeName, key, value });
        },

        get(storeName, key) {
            return _send('IDB_GET', { storeName, key });
        },

        getAll(storeName) {
            return _send('IDB_GET_ALL', { storeName });
        },

        delete(storeName, key) {
            return _send('IDB_DELETE', { storeName, key });
        },

        clear(storeName) {
            return _send('IDB_CLEAR', { storeName });
        },

        exportAll() {
            return _send('IDB_EXPORT_ALL');
        },

        importAll(data) {
            return _send('IDB_IMPORT_ALL', { data });
        },

        pruneOlderThan(storeName, days) {
            return _send('IDB_PRUNE', { storeName, days });
        }
    };

    return api;
})();

