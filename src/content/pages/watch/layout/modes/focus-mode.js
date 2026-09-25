import '../../../../core/system/base-feature.js';

/**
 * @fileoverview
 * Focus Mode Feature
 * 
 * Target: /watch route.
 * Purpose: Reduces visual distractions, manages strict-mode timers, and handles dopamine detox grayscale modes.
 */

export class FocusMode extends window.YPP.features.BaseFeature {
    static featureId = 'focusMode';
    static executionPhase = 'idle';
    static priority = 999;
    static isManagedExternally = true;

    /**
     * Initialize Focus Mode
     * @constructor
     */
    constructor() {
        super('FocusMode');
        this._initConstants();
        this.strictModeEndTime = null;
    }

    /**
     * Initialize constants from centralized config
     * @private
     */
    _initConstants() {
        this._CONSTANTS = window.YPP.CONSTANTS || {};
        this._CSS_CLASSES = this._CONSTANTS.CSS_CLASSES || {};
    }

    getConfigKey() {
        return 'enableFocusMode';
    }

    async enable() {
        // Load persisted strict mode state to prevent reload bypass
        try {
            if (chrome?.storage?.local) {
                const data = await chrome.storage.local.get('ypp_strictModeEndTime');
                if (data.ypp_strictModeEndTime) {
                    this.strictModeEndTime = data.ypp_strictModeEndTime;
                }
            }
        } catch (e) {
            this.utils.log?.('Failed to load strict mode state', 'FOCUS', 'warn');
        }

        this.observer.register(
            'focus-mode',
            '#contents, ytd-watch-flexy, ytd-comments', 
            () => {
                // Dynamically eject comments/related if YouTube injects them later
                if (this.isEnabled && this.settings?.enableFocusMode) {
                    this._ejectDistractions();
                }
            },
            false
        );
        await super.enable();
        this._run();
    }

    async disable() {
        this.observer.unregister('focus-mode');
        this._toggleDetox(false);
        this._toggleFocus(false);
        await super.disable();
    }

    async onPageChange(url) {
        if (!this.isEnabled) return;
        
        if (this.utils.isWatchPage()) {
            this._run();
        } else {
            this._toggleDetox(false);
            this._toggleFocus(false);
        }
    }

    async onUpdate() {
        this._run();
    }

    // =========================================================================
    // PRIVATE METHODS
    // =========================================================================

    /**
     * Run focus mode with settings
     * @private
     */
    _run() {
        if (!this.settings) return;

        try {
            this._toggleDetox(this.settings.dopamineDetox);
            
            let shouldEnableFocus = this.settings.enableFocusMode;
            
            // Prevent circumventing Strict Mode via popup settings sync
            if (!shouldEnableFocus && this._isStrictModeActive()) {
                shouldEnableFocus = true;
                this.utils.createToast?.('Strict Mode Active! Solve math to disable.', 5000);
                this._promptStrictMathUnlock();
                
                // Re-sync blocked state to popup immediately
                if (chrome?.runtime?.sendMessage) {
                    chrome.runtime.sendMessage({ 
                        action: 'PATCH_SETTINGS', 
                        payload: { enableFocusMode: true } 
                    }).catch(() => {});
                }
            }
            
            this._toggleFocus(shouldEnableFocus);
        } catch (error) {
            this.utils.log?.(`Error running focus mode: ${error.message}`, 'FOCUS', 'error');
        }
    }

    // =========================================================================
    // DOPAMINE DETOX
    // =========================================================================

    /**
     * Toggle grayscale dopamine detox mode
     * @private
     * @param {boolean} enable
     */
    _toggleDetox(enable) {
        const detoxClass = this._CSS_CLASSES.DOPAMINE_DETOX || 'ypp-dopamine-detox';
        document.body.classList.toggle(detoxClass, enable);
        this.utils.log?.(`Dopamine detox ${enable ? 'enabled' : 'disabled'}`, 'FOCUS');
    }

    // =========================================================================
    // FOCUS MODE
    // =========================================================================

    /**
     * Toggle Focus Mode layout
     * @private
     * @param {boolean} enable
     */
    _toggleFocus(enable) {
        if (enable) {
            if (this.settings?.hideChat) document.body.classList.add('ypp-hide-chat');
            if (this.settings?.hideLiveChat) document.body.classList.add('ypp-hide-live-chat');
            
            this._ejectDistractions();
            this.utils.log?.('Focus mode enabled', 'FOCUS');
        } else {
            document.body.classList.remove('ypp-hide-chat', 'ypp-hide-live-chat');
            this._restoreDistractions();
            this.utils.log?.('Focus mode disabled', 'FOCUS');
        }
    }

    // =========================================================================
    // DOM EJECTION (True Distraction Removal)
    // =========================================================================

    _ejectDistractions() {
        if (!this.ejectedNodes) this.ejectedNodes = new Map();

        const targets = {
            'comments': document.querySelector(this._CONSTANTS?.SELECTORS?.COMMENTS_SECTION?.[1] || '#comments'),
            'related': document.querySelector('ytd-watch-next-secondary-results-renderer, #secondary #related')
        };

        for (const [key, container] of Object.entries(targets)) {
            if (container && container.hasChildNodes()) {
                let data = this.ejectedNodes.get(key);
                if (!data) {
                    data = { container, fragment: document.createDocumentFragment() };
                    this.ejectedNodes.set(key, data);
                }
                
                // Idempotently sweep new dynamically loaded children into the fragment
                while (container.firstChild) {
                    data.fragment.appendChild(container.firstChild);
                }
            }
        }
    }

    _restoreDistractions() {
        if (!this.ejectedNodes) return;

        for (const [key, data] of this.ejectedNodes.entries()) {
            if (data.container && data.fragment) {
                data.container.appendChild(data.fragment);
            }
        }
        this.ejectedNodes.clear();
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    /**
     * Toggle a specific feature
     * @param {string} feature - Feature name
     * @param {boolean} enable
     */
    toggleFeature(feature, enable) {
        if (!this.settings) return;

        this.settings[feature] = enable;

        switch (feature) {
            case 'dopamineDetox':
                this._toggleDetox(enable);
                break;
            case 'enableFocusMode':
                if (!enable && this._isStrictModeActive()) {
                    this.utils.createToast?.('Strict Mode Active! Solve math to disable.', 5000);
                    this._promptStrictMathUnlock();
                    return;
                }
                this._toggleFocus(enable);
                break;
        }
    }

    // =========================================================================
    // FOCUS MODE V2 - STRICT MODE TIMER
    // =========================================================================

    _isStrictModeActive() {
        if (!this.strictModeEndTime) return false;
        return Date.now() < this.strictModeEndTime;
    }

    activateStrictMode(minutes = 30) {
        this.strictModeEndTime = Date.now() + (minutes * 60 * 1000);
        
        // Persist to prevent page reload bypass
        try {
            if (chrome?.storage?.local) {
                chrome.storage.local.set({ ypp_strictModeEndTime: this.strictModeEndTime });
            }
        } catch (e) {}

        this.utils.createToast?.(`Strict Mode Locked for ${minutes}m`);
        this.toggleFeature('enableFocusMode', true);
        this.toggleFeature('dopamineDetox', true);
    }

    _promptStrictMathUnlock() {
        if (document.getElementById('ypp-strict-modal')) return;

        const num1 = Math.floor(Math.random() * 50) + 15;
        const num2 = Math.floor(Math.random() * 50) + 15;
        const answer = num1 * num2;
        
        this._createMathModal(num1, num2, answer);
    }

    _createMathModal(num1, num2, answer) {
        const overlay = document.createElement('div');
        overlay.id = 'ypp-strict-modal';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(15px);
            z-index: 999999; display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: rgba(25, 25, 30, 0.7); backdrop-filter: blur(20px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px; padding: 40px; width: 380px; text-align: center;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            font-family: 'Inter', Roboto, sans-serif;
            color: #fff; transform: scale(0.9) translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        modal.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 16px;">🔒</div>
            <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Strict Mode Active</div>
            <div style="font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 32px;">Solve the equation to unlock Focus Mode:</div>
            <div style="font-size: 36px; font-weight: 800; margin-bottom: 32px; color: #ff4e45; text-shadow: 0 4px 12px rgba(255, 78, 69, 0.3);">${num1} &times; ${num2}</div>
            <input type="number" id="ypp-strict-input" placeholder="Your Answer" style="
                width: 100%; padding: 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15);
                background: rgba(0, 0, 0, 0.3); color: #fff; font-size: 20px; text-align: center;
                box-sizing: border-box; outline: none; margin-bottom: 20px; transition: border-color 0.2s, box-shadow 0.2s;
            " autocomplete="off" />
            <div style="display: flex; gap: 16px;">
                <button id="ypp-strict-cancel" style="
                    flex: 1; padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
                    color: #fff; cursor: pointer; font-size: 15px; font-weight: 600; transition: background 0.2s;
                ">Cancel</button>
                <button id="ypp-strict-submit" style="
                    flex: 1; padding: 14px; border-radius: 12px; border: none; background: #ff4e45;
                    color: #fff; cursor: pointer; font-size: 15px; font-weight: 600; transition: background 0.2s; box-shadow: 0 4px 12px rgba(255, 78, 69, 0.3);
                ">Unlock</button>
            </div>
            <div id="ypp-strict-error" style="color: #ff4e45; font-size: 13px; margin-top: 16px; min-height: 20px; font-weight: 500;"></div>
        `;

        overlay.appendChild(modal);
        this.injectElement(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1) translateY(0)';
        });

        const input = document.getElementById('ypp-strict-input');
        const submitBtn = document.getElementById('ypp-strict-submit');
        const cancelBtn = document.getElementById('ypp-strict-cancel');
        const errorDiv = document.getElementById('ypp-strict-error');

        // Enhance input/button styles dynamically to keep innerHTML cleaner
        input.onfocus = () => { input.style.borderColor = '#ff4e45'; input.style.boxShadow = '0 0 0 3px rgba(255, 78, 69, 0.2)'; };
        input.onblur = () => { input.style.borderColor = 'rgba(255, 255, 255, 0.15)'; input.style.boxShadow = 'none'; };
        cancelBtn.onmouseover = () => cancelBtn.style.background = 'rgba(255,255,255,0.1)';
        cancelBtn.onmouseout = () => cancelBtn.style.background = 'rgba(255,255,255,0.05)';
        submitBtn.onmouseover = () => submitBtn.style.background = '#ff665e';
        submitBtn.onmouseout = () => submitBtn.style.background = '#ff4e45';

        input.focus();

        const validate = () => {
            if (parseInt(input.value.trim(), 10) === answer) {
                // Unlock successful
                this.strictModeEndTime = null;
                try { if (chrome?.storage?.local) chrome.storage.local.remove('ypp_strictModeEndTime'); } catch(e) {}
                
                this.toggleFeature('enableFocusMode', false);
                this.toggleFeature('dopamineDetox', false);
                this.utils.createToast?.('Strict Mode Unlocked!');
                overlay.remove();
                
                // Sync globally instead of querying popup DOM
                if (chrome?.runtime?.sendMessage) {
                    chrome.runtime.sendMessage({ 
                        action: 'PATCH_SETTINGS', 
                        payload: { enableFocusMode: false, dopamineDetox: false } 
                    }).catch(() => {});
                }
            } else {
                // Unlock failed
                errorDiv.textContent = 'Incorrect. Try again.';
                input.value = '';
                input.focus();
                
                if (window.anime) {
                    window.anime({
                        targets: modal,
                        translateX: [{value: -10, duration: 50}, {value: 10, duration: 50}, {value: -10, duration: 50}, {value: 10, duration: 50}, {value: 0, duration: 50}],
                        easing: 'easeInOutSine'
                    });
                } else if (typeof modal.animate === 'function') {
                    modal.animate([
                        { transform: 'scale(1) translateX(0)' },
                        { transform: 'scale(1) translateX(-15px)', offset: 0.2 },
                        { transform: 'scale(1) translateX(15px)', offset: 0.4 },
                        { transform: 'scale(1) translateX(-15px)', offset: 0.6 },
                        { transform: 'scale(1) translateX(15px)', offset: 0.8 },
                        { transform: 'scale(1) translateX(0)' }
                    ], { duration: 300, easing: 'ease-in-out' });
                }
            }
        };

        submitBtn.addEventListener('click', validate);
        cancelBtn.addEventListener('click', () => overlay.remove());
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') validate();
            if (e.key === 'Escape') overlay.remove();
        });
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.FocusMode = FocusMode;
