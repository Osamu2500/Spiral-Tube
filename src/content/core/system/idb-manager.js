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

    const ACTIONS = {
        SET: 'IDB_SET',
        GET: 'IDB_GET',
        GET_ALL: 'IDB_GET_ALL',
        DELETE: 'IDB_DELETE',
        CLEAR: 'IDB_CLEAR',
        EXPORT_ALL: 'IDB_EXPORT_ALL',
        IMPORT_ALL: 'IDB_IMPORT_ALL',
        PRUNE: 'IDB_PRUNE'
    };

    /**
     * Helper to send message to background script and map response/error appropriately.
     * @param {string} action The IDB action constant to dispatch.
     * @param {Object} [payload={}] The payload needed for the action.
     * @returns {Promise<any>} Solves with the IDB result or rejects with an Error.
     */
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
            return _send(ACTIONS.SET, { storeName, key, value });
        },

        get(storeName, key) {
            return _send(ACTIONS.GET, { storeName, key });
        },

        getAll(storeName) {
            return _send(ACTIONS.GET_ALL, { storeName });
        },

        delete(storeName, key) {
            return _send(ACTIONS.DELETE, { storeName, key });
        },

        clear(storeName) {
            return _send(ACTIONS.CLEAR, { storeName });
        },

        exportAll() {
            return _send(ACTIONS.EXPORT_ALL);
        },

        importAll(data) {
            return _send(ACTIONS.IMPORT_ALL, { data });
        },

        pruneOlderThan(storeName, days) {
            return _send(ACTIONS.PRUNE, { storeName, days });
        }
    };

    return api;
})();

