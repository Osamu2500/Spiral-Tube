// @ts-check
// Lazily resolve Utils so this module works even if utils.js is evaluated after popup-state.js.
const getUtils = () => window.YPP?.Utils || {
    log: (/** @type {string} */ msg, tag = 'POPUP', level = 'log') => {
        const c = /** @type {any} */(console);
        if (c[level]) c[level](`[YPP:${tag}] ${msg}`);
    }
};

/**
 * @typedef {Object} PopupState
 * @property {Record<string, any>} elements
 * @property {string[]} settingKeys
 * @property {Record<string, any>} settings
 * @property {Array<{key?: string, value?: any, fullState?: Record<string, any>}>} _settingsWriteQueue
 * @property {boolean} _isWritingSettings
 * @property {boolean} isLoaded
 */

/** @type {ReturnType<typeof setTimeout> | null} */
let _writeTimeout = null;

/** @type {PopupState} */
export const state = {
    elements: {},
    settingKeys: [],
    settings: {},
    _settingsWriteQueue: [],
    _isWritingSettings: false,
    isLoaded: false
};

/** @param {Document} document */
export function initStorage(document) {
    const inputs = document.querySelectorAll('input[id]:not(#featureSearch), select[id], textarea[id]');
    inputs.forEach((/** @type {any} */ el) => {
        state.settingKeys.push(el.id);
        state.elements[el.id] = el;
    });
}

/** @param {Array<(settings: Record<string, any>) => void>} [updateUICallbacks] */
export function loadSettings(updateUICallbacks) {
    const Utils = getUtils();
    try {
        (async () => {
            const getStorage = async (/** @type {chrome.storage.StorageArea} */ area) => {
                if (!area) return {};
                try {
                    return await new Promise(resolve => {
                        let isResolved = false;
                        // 2-second safety timeout: if context is dead, the callback
                        // may never fire — this prevents the Promise hanging forever.
                        const timeoutId = setTimeout(() => {
                            if (isResolved) return;
                            isResolved = true;
                            resolve({});
                        }, 2000);
                        const cb = (/** @type {any} */ res) => {
                            if (isResolved) return;
                            isResolved = true;
                            clearTimeout(timeoutId);
                            resolve(chrome.runtime.lastError ? {} : (res || {}));
                        };
                        area.get('settings', cb);
                    });
                } catch (e) { return {}; }
            };

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
                raw = syncTime >= localTime 
                    ? { ...localSettings, ...syncSettings } 
                    : { ...syncSettings, ...localSettings };
            } else {
                raw = syncSettings || localSettings || {};
            }

            const defaultSettings = (window.YPP && window.YPP.CONSTANTS) 
                ? window.YPP.CONSTANTS.DEFAULT_SETTINGS 
                : {};
            
            state.settings = { ...defaultSettings, ...raw };

            state.settingKeys.forEach(key => {
                const el = state.elements[key];
                if (el) {
                    if (el.type === 'checkbox') {
                        el.checked = state.settings[key] !== undefined ? state.settings[key] : (defaultSettings[key] !== undefined ? defaultSettings[key] : false);
                        // experimentalTileUI is now default
                    } else if (el.type === 'range') {
                        el.value = state.settings[key] !== undefined ? state.settings[key] : (defaultSettings[key] !== undefined ? defaultSettings[key] : el.value);
                        const display = document.getElementById(key + 'Value');
                        if (display) {
                            display.textContent = el.value;
                        }
                    } else if (el.type === 'color' || el.type === 'text' || el.type === 'select-one') {
                        el.value = state.settings[key] || defaultSettings[key] || '';
                    } else if (el.type === 'hidden') {
                        el.value = state.settings[key] !== undefined ? state.settings[key] : (defaultSettings[key] !== undefined ? defaultSettings[key] : el.value);
                        if (key === 'hideWatchedMode') {
                            const mode = el.value;
                            document.querySelectorAll('.hw-mode-btn').forEach((/** @type {any} */ b) => {
                                const isActive = b.dataset.mode === mode;
                                b.classList.toggle('active', isActive);
                                b.style.background = isActive ? 'rgba(62,166,255,0.22)' : 'transparent';
                                b.style.color = isActive ? 'var(--accent, #3ea6ff)' : 'rgba(255,255,255,0.5)';
                            });
                        }
                        if (key === 'sidebarLayout') {
                            const layout = el.value || 'compact';
                            document.querySelectorAll('.sidebar-layout-btn').forEach((/** @type {any} */ b) => {
                                const isActive = b.dataset.layout === layout;
                                b.classList.toggle('active', isActive);
                                b.style.background = isActive ? 'rgba(62,166,255,0.22)' : 'transparent';
                                b.style.color = isActive ? 'var(--accent, #3ea6ff)' : 'rgba(255,255,255,0.5)';
                            });
                            document.querySelectorAll('.layout-card').forEach((/** @type {any} */ c) => {
                                const isActive = c.dataset.layout === layout;
                                c.style.borderColor = isActive ? 'var(--accent, rgba(62,166,255,0.5))' : 'rgba(255,255,255,0.08)';
                                c.style.background = isActive ? 'rgba(62,166,255,0.05)' : 'rgba(255,255,255,0.04)';
                            });
                        }
                        if (key === 'cardStyle') {
                            const styleVal = el.value || 'glass';
                            document.querySelectorAll('.card-style-btn').forEach((/** @type {any} */ b) => {
                                const isActive = b.dataset.style === styleVal;
                                b.classList.toggle('active', isActive);
                            });
                        }
                    }
                }
            });

            state.isLoaded = true;

            if (updateUICallbacks) {
                updateUICallbacks.forEach(cb => cb(state.settings));
            }
        })();
    } catch (/** @type {any} */ e) {
        Utils.log('Critical Load Error: ' + /** @type {any} */(e).message, 'POPUP', 'error');
    }
}

export function gatherSettings() {
    const s = {};
    state.settingKeys.forEach(key => {
        const el = state.elements[key];
        if (el) {
            /** @type {Record<string, any>} */(s)[key] = el.type === 'checkbox' ? el.checked : (el.type === 'range' ? Number(el.value) : el.value);
        }
    });
    return s;
}

/** @param {(() => void)} [showIndicatorCb] */
export function saveSettings(showIndicatorCb) {
    if (!state.isLoaded) return;
    const s = gatherSettings();
    state._settingsWriteQueue.push({ fullState: s });
    
    if (_writeTimeout) clearTimeout(_writeTimeout);
    _writeTimeout = setTimeout(() => {
        _processWriteQueue();
    }, 300);
    
    if (showIndicatorCb) showIndicatorCb();
}

function _processWriteQueue() {
    const Utils = getUtils();
    if (state._isWritingSettings || state._settingsWriteQueue.length === 0) return;
    state._isWritingSettings = true;
    
    const updates = [...state._settingsWriteQueue];
    state._settingsWriteQueue = [];
    
    (async () => {
        let delta = {};
        updates.forEach(update => {
            if (update.fullState) {
                Object.assign(delta, update.fullState);
            } else if (update.key) {
                /** @type {Record<string, any>} */(delta)[update.key] = update.value;
            }
        });

        // Update local state optimistically
        Object.assign(state.settings, delta);
        
        try {
            await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    action: 'PATCH_SETTINGS',
                    payload: delta
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(response);
                    }
                });
            });
        } catch (/** @type {any} */ e) {
            Utils.log('Delta Save Error: ' + /** @type {any} */(e).message, 'POPUP', 'warn');
        }
        
        state._isWritingSettings = false;
        if (state._settingsWriteQueue.length > 0) {
            _processWriteQueue();
        }
    })();
}

/** @param {{key?: string, value?: any, fullState?: Record<string, any>}} payload */
export function queueSettingsWrite(payload) {
    state._settingsWriteQueue.push(payload);
    
    // Debounce the actual write process to prevent Chrome Storage Quota limits
    if (_writeTimeout) clearTimeout(_writeTimeout);
    _writeTimeout = setTimeout(() => {
        _processWriteQueue();
    }, 300);
}

/**
 * @param {string} key
 * @param {any} value
 */
export function updateSetting(key, value) {
    queueSettingsWrite({ key, value });
}

/** @param {string} newTheme */
export function notifyThemeChange(newTheme) {
    updateSetting('activeTheme', newTheme);
}

