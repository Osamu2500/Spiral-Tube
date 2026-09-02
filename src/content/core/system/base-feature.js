window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

/**
 * Base Class for all Spiral Tube Features
 * Enforces a standard lifecycle: init -> enable/disable -> update -> destroy
 */
window.YPP.features.BaseFeature = class BaseFeature {
    static CONFIG = {
        LOG_CATEGORY: 'MAIN',
        LOG_LEVEL: 'debug'
    };

    // Metadata properties to be overridden by child classes
    static featureId = null;
    static executionPhase = 'idle'; // 'sequential-ui', 'post-layout', 'idle'
    static priority = 999;

    constructor(name) {
        this.name = name || this.constructor.featureId || this.constructor.name;
        this.isEnabled = false;
        this.settings = {};
        this.utils = window.YPP.Utils;
        
        // Next-Gen Architecture
        this.events = window.YPP.events;
        this.domApi = window.YPP.DomAPI;
        // Note: this.observer and this.delegator are lazy getters defined below.
        
        this.eventListeners = [];
        this.busListeners = [];
        this.observerIds = [];
        this.intervalIds = [];
        this.timeoutIds = [];
        this.injectedElements = [];
        this.settingWatchers = new Map();

        // Lazy getters: resolve at call-time so construction doesn't race against
        // main.js creating sharedObserver and sharedEventDelegator.
        Object.defineProperty(this, 'observer', {
            get() { return window.YPP.sharedObserver; },
            configurable: true
        });
        Object.defineProperty(this, 'delegator', {
            get() { return window.YPP.sharedEventDelegator; },
            configurable: true
        });
    }

    /**
     * Called by FeatureManager with new settings
     * @param {Object} settings Current extension settings
     */
    async update(settings) {
        let settingsChanged = false;
        const oldSettings = { ...this.settings };
        if (settings) {
            for (const key in settings) {
                if (settings[key] !== this.settings[key]) {
                    settingsChanged = true;
                    break;
                }
            }
        }
        
        this.settings = { ...this.settings, ...settings };

        // Fallback for features that extend BaseFeature but implement run() instead of update()/enable()
        if (typeof this.run === 'function' && this.run !== window.YPP.features.BaseFeature.prototype.run) {
            return this.run(settings);
        }

        const configKey = this.getConfigKey();
        
        let shouldBeEnabled = true;
        if (configKey && this.settings.hasOwnProperty(configKey)) {
            shouldBeEnabled = !!this.settings[configKey];
        }

        if (shouldBeEnabled && !this.isEnabled) {
            this.utils?.log(`Enabling feature: ${this.name}`, BaseFeature.CONFIG.LOG_CATEGORY, BaseFeature.CONFIG.LOG_LEVEL);
            this._abortController = new AbortController();
            await this.enable();
            this.isEnabled = true;
        } else if (!shouldBeEnabled && this.isEnabled) {
            this.utils?.log(`Disabling feature: ${this.name}`, BaseFeature.CONFIG.LOG_CATEGORY, BaseFeature.CONFIG.LOG_LEVEL);
            if (this._abortController) {
                this._abortController.abort();
                this._abortController = null;
            }
            await this.disable();
            this.isEnabled = false;
        } else if (this.isEnabled && settingsChanged) {
            this._triggerSettingWatchers(this.settings, oldSettings);
            if (typeof this.onUpdate === 'function') {
                await this.onUpdate(settings, oldSettings);
            }
        }
    }

    /**
     * Override this to return the settings key for this feature.
     * By default, it camelCases the class name.
     * Return null explicitly if the feature is always on.
     * @returns {string|null}
     */
    getConfigKey() {
        if (!this.name) return null;
        return this.name.charAt(0).toLowerCase() + this.name.slice(1);
    }

    /**
     * Enable the feature. Override this method in child classes.
     */
    async enable() {
        // Base implementation does nothing
    }

    /**
     * Disable the feature. Override this method in child classes.
     */
    async disable() {
        this.cleanupEvents();
    }

    /**
     * Wait for element, bound to feature's lifecycle (aborts if feature disabled)
     * @param {string} selector - CSS selector
     * @param {number} timeout - Timeout in ms
     * @returns {Promise<Element>}
     */
    waitForElement(selector, timeout) {
        return this.utils.waitForElement(selector, timeout, this._abortController?.signal);
    }

    /**
     * Poll for condition, bound to feature's lifecycle (aborts if feature disabled)
     * @param {Function} conditionFn - Function returning truthy value
     * @param {number} timeout - Timeout in ms
     * @param {number} intervalMs - Polling interval in ms
     * @returns {Promise<any>}
     */
    pollFor(conditionFn, timeout, intervalMs) {
        return this.utils.pollFor(conditionFn, timeout, intervalMs, this._abortController?.signal);
    }

    /**
     * Safely add an event listener and track it for automatic cleanup
     * @param {EventTarget} target - Target element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {boolean|Object} options - Event listener options
     */
    addListener(target, event, handler, options = false) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(event, handler, options);
        this.eventListeners.push({ target, event, handler, options });
    }

    /**
     * Safely remove an event listener and untrack it
     * @param {EventTarget} target - Target element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {boolean|Object} options - Event listener options
     */
    removeListener(target, event, handler, options = false) {
        if (!target || !target.removeEventListener) return;
        target.removeEventListener(event, handler, options);
        this.eventListeners = this.eventListeners.filter(
            l => !(l.target === target && l.event === event && l.handler === handler)
        );
    }

    /**
     * Remove all tracked event listeners, intervals, and nodes
     */
    cleanupEvents() {
        // Timers
        this.intervalIds.forEach(id => clearInterval(id));
        this.intervalIds = [];
        
        this.timeoutIds.forEach(id => clearTimeout(id));
        this.timeoutIds = [];

        // Elements
        this.injectedElements.forEach(el => {
            try { if (el && el.parentNode) el.parentNode.removeChild(el); } catch (e) {}
        });
        this.injectedElements = [];

        // Standard DOM event listeners
        this.eventListeners.forEach(({ target, event, handler, options }) => {
            try {
                if (target.removeEventListener) {
                    target.removeEventListener(event, handler, options);
                }
            } catch (e) {
                this.utils?.log(`Cleanup error: ${e.message}`, BaseFeature.CONFIG.LOG_CATEGORY, 'error');
            }
        });
        this.eventListeners = [];
        
        // EventBus listeners
        this.busListeners.forEach(unsub => {
            try { unsub(); } catch (e) {
                this.utils?.log(`Bus cleanup error: ${e.message}`, BaseFeature.CONFIG.LOG_CATEGORY, 'error');
            }
        });
        this.busListeners = [];
        
        // DOM Observers
        if (this.observer) {
            this.observerIds.forEach(id => {
                try { this.observer.unregister(id); } catch (e) {}
            });
        }
        this.observerIds = [];
    }

    /**
     * Safely subscribe to the EventBus and track it for cleanup
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    onBusEvent(event, handler) {
        if (!this.events) return;
        const unsub = this.events.on(event, handler.bind(this));
        this.busListeners.push(unsub);
    }

    /**
     * Register a DOM Observer safely bound to this feature's lifecycle
     */
    registerObserver(id, selector, callback, immediate = true, lazy = false) {
        if (!this.observer) return;
        // Scope the ID so multiple features don't collide
        const scopedId = `${this.name}_${id}`;
        this.observerIds.push(scopedId);
        
        // Bind the callback safely to catch errors within the feature context
        const safeCallback = (nodes) => {
            if (!this.isEnabled) return;
            try {
                callback.call(this, nodes);
            } catch (e) {
                this.utils?.log(`Observer error in ${this.name}: ${e.message}`, BaseFeature.CONFIG.LOG_CATEGORY, 'error');
            }
        };
        
        this.observer.register(scopedId, selector, safeCallback, immediate, lazy);
    }

    /**
     * Manually unregister a DOM Observer
     */
    unregisterObserver(id) {
        if (!this.observer) return;
        const scopedId = `${this.name}_${id}`;
        this.observer.unregister(scopedId);
        this.observerIds = this.observerIds.filter(i => i !== scopedId);
    }

    /**
     * Safely start an interval bound to this feature's lifecycle
     */
    setInterval(handler, timeout) {
        const id = setInterval(handler, timeout);
        this.intervalIds.push(id);
        return id;
    }

    /**
     * Clear a safely started interval
     */
    clearInterval(id) {
        clearInterval(id);
        this.intervalIds = this.intervalIds.filter(i => i !== id);
    }

    /**
     * Safely start a timeout bound to this feature's lifecycle
     */
    setTimeout(handler, timeout) {
        const id = setTimeout(handler, timeout);
        this.timeoutIds.push(id);
        return id;
    }

    /**
     * Clear a safely started timeout
     */
    clearTimeout(id) {
        clearTimeout(id);
        this.timeoutIds = this.timeoutIds.filter(i => i !== id);
    }

    /**
     * Safely append an element to the DOM, bound to feature's lifecycle
     */
    injectElement(element, parent = document.body) {
        if (!element || !parent) return;
        parent.appendChild(element);
        this.injectedElements.push(element);
        return element;
    }

    /**
     * Safely inject a stylesheet, bound to feature's lifecycle
     */
    injectStyle(cssString) {
        const style = document.createElement('style');
        style.textContent = cssString;
        document.head.appendChild(style);
        this.injectedElements.push(style);
        return style;
    }

    /**
     * Subscribe to specific setting changes rather than parsing the full settings object on every update.
     * @param {string} key - Setting key
     * @param {Function} callback - Callback called with (newValue, oldValue)
     */
    watchSetting(key, callback) {
        if (!this.settingWatchers.has(key)) {
            this.settingWatchers.set(key, []);
        }
        this.settingWatchers.get(key).push(callback);
    }

    /**
     * Trigger setting watchers if the setting changed
     * @param {Object} newSettings
     * @param {Object} oldSettings
     * @private
     */
    _triggerSettingWatchers(newSettings, oldSettings) {
        for (const [key, callbacks] of this.settingWatchers.entries()) {
            const newVal = newSettings[key];
            const oldVal = oldSettings[key];
            if (newVal !== oldVal) {
                callbacks.forEach(cb => {
                    try { cb.call(this, newVal, oldVal); }
                    catch(e) { this.utils?.log(`Error in setting watcher for ${key} in ${this.name}: ${e.message}`, BaseFeature.CONFIG.LOG_CATEGORY, 'error'); }
                });
            }
        }
    }

    /**
     * Lifecycle Hook: Called when standard YouTube SPA navigation completes
     */
    onPageChange(url) {
        // Override in child class
    }

    /**
     * Lifecycle Hook: Called when the YouTube player loads a new video
     */
    onVideoChange(videoId) {
        // Override in child class
    }

    /**
     * Legacy run support for older FeatureManager approach
     * @param {Object} settings 
     */
    async run(settings) {
        return this.update(settings);
    }

    /**
     * Mark an element as processed for a specific uniqueId.
     * Automatically handles DOM recycling by tearing down previous state.
     * @param {HTMLElement} element 
     * @param {string} uniqueId 
     * @param {Function} [onRecycled] - Callback to clean up old state if recycled
     * @returns {boolean} True if already processed for THIS id, False if needs processing
     */
    isProcessed(element, uniqueId, onRecycled) {
        if (!element || !uniqueId) return false;
        
        const currentId = element.getAttribute(`data-ypp-processed-${this.name}`);
        if (currentId === uniqueId) return true;
        
        if (currentId) {
            if (typeof onRecycled === 'function') onRecycled(element, currentId);
        }
        
        element.setAttribute(`data-ypp-processed-${this.name}`, uniqueId);
        return false;
    }
};
