/**
 * Video Speed Controller (Main)
 * Manages playback speed manipulation and handles the core integration with HTML5 media elements.
 */
import '../../../../../core/system/base-feature.js';
import { VscUI } from './vsc-ui.js';
import { VscShortcuts } from './vsc-shortcuts.js';

export class VideoSpeedController extends window.YPP.features.BaseFeature {
    static featureId = 'videoSpeedController';
    static executionPhase = 'idle';
    static priority = 6;

    constructor() {
        super('VideoSpeedController');
        this.controllers = new WeakMap();
        this.markers = new WeakMap();
        this._mutationObserver = null;
        this._lastActiveVideo = null;
        this.ui = new VscUI(this);
        this.shortcuts = new VscShortcuts(this);
        this._pageScriptInjected = false;
    }

    getConfigKey() {
        return 'enableCustomSpeed';
    }

    async enable() {
        if (!this.settings || this.settings.enableCustomSpeed === false) return;
        
        this.utils?.log('Enabling Global Video Speed Controller', 'VSC');
        
        // Inject inline page script for forced speed to make sure it always works natively
        if (this.settings?.vscForceSpeed !== false) {
            this.injectPageScript();
            this.syncSpeedToPage();
        }

        this.watchSetting('vscForceSpeed', (newVal) => {
            if (newVal) {
                this.injectPageScript();
                this.syncSpeedToPage();
            } else {
                this.disablePageScript();
            }
        });

        this.watchSetting('vscHideByDefault', (newVal) => {
            const selector = this.settings?.vscAudioSupport ? 'video, audio' : 'video';
            document.querySelectorAll(selector).forEach(video => {
                const state = this.controllers.get(video);
                if (state) {
                    if (newVal) {
                        state.controller.style.display = 'none';
                        state.controller.classList.add('ypp-vsc-hidden');
                    } else {
                        state.controller.style.display = 'flex';
                        state.controller.classList.remove('ypp-vsc-hidden');
                        this.ui.hideControllerDelay(video);
                    }
                }
            });
        });

        const setupObserver = () => {
            if (window.YPP.sharedObserver) {
                window.YPP.sharedObserver.unregister('video-speed-controller');
            }
            
            const selector = this.settings?.vscAudioSupport ? 'video, audio' : 'video';
            if (window.YPP.sharedObserver) {
                window.YPP.sharedObserver.register('video-speed-controller', selector, (elements) => {
                    elements.forEach(node => {
                        if (node.tagName === 'VIDEO' || (this.settings?.vscAudioSupport && node.tagName === 'AUDIO')) {
                            this.ui.attachToVideo(node);
                        }
                    });
                }, true); // immediate=true scans for existing videos automatically
            } else {
                // Fallback for external sites without sharedObserver
                this.scanForVideos();
                if (this._fallbackScanner) {
                    this.removeListener(document, 'play', this._fallbackScanner, true);
                    this.removeListener(document, 'loadeddata', this._fallbackScanner, true);
                }
                this._fallbackScanner = (e) => {
                    if (e.target && (e.target.tagName === 'VIDEO' || (this.settings?.vscAudioSupport && e.target.tagName === 'AUDIO'))) {
                        this.scanForVideos();
                    }
                };
                this.addListener(document, 'play', this._fallbackScanner, true);
                this.addListener(document, 'loadeddata', this._fallbackScanner, true);
            }
        };

        // Scan and observe initially
        setupObserver();

        this.watchSetting('vscAudioSupport', () => {
            setupObserver();
        });

        // Global keyboard shortcuts are now handled via shortcuts class
        this.shortcuts.register();

        this.watchSetting('vscRememberSpeed', (newVal) => {
            if (newVal === false) {
                if (this._storageListener) {
                    chrome.storage.onChanged.removeListener(this._storageListener);
                    this._storageListener = null;
                }
            } else {
                if (!this._storageListener) {
                    this.setupCrossTabSync();
                }
            }
        });

        // Cross-tab sync listener setup
        if (this.settings?.vscRememberSpeed !== false) {
            this.setupCrossTabSync();
        }
    }

    setupCrossTabSync() {
        if (this._storageListener) return;
        this._storageListener = (changes, area) => {
            // The settings are stored under the 'settings' key in chrome.storage.local
            if (area === 'local' && changes.settings && changes.settings.newValue) {
                const newSpeed = changes.settings.newValue.vscLastSpeed;
                if (newSpeed && Math.abs(newSpeed - (this.settings.vscLastSpeed || 1)) > 0.01) {
                    this.settings.vscLastSpeed = newSpeed;
                    const selector = this.settings?.vscAudioSupport ? 'video, audio' : 'video';
                    document.querySelectorAll(selector).forEach(video => {
                        if (Math.abs(video.playbackRate - newSpeed) > 0.01) {
                            video.playbackRate = newSpeed;
                            const state = this.controllers.get(video);
                            if (state) state.display.textContent = newSpeed.toFixed(2);
                        }
                    });
                }
            }
        };
        chrome.storage.onChanged.addListener(this._storageListener);
    }

    async disable() {
        await super.disable();
        if (this._saveSpeedTimeout) clearTimeout(this._saveSpeedTimeout);

        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('video-speed-controller');
        }

        if (this._storageListener) {
            chrome.storage.onChanged.removeListener(this._storageListener);
            this._storageListener = null;
        }

        this.shortcuts.unregister();

        if (this._fallbackScanner) {
            this.removeListener(document, 'play', this._fallbackScanner, true);
            this.removeListener(document, 'loadeddata', this._fallbackScanner, true);
            this._fallbackScanner = null;
        }

        const selector = this.settings?.vscAudioSupport ? 'video, audio' : 'video';
        document.querySelectorAll(selector).forEach(video => {
            const state = this.controllers.get(video);
            if (state && state.cleanup) state.cleanup();
        });
        document.querySelectorAll('ypp-vsc-controller').forEach(c => c.remove());
        this.controllers = new WeakMap();
    }

    onUpdate() {
        this.shortcuts.unregister();
        this.shortcuts.register();
    }

    onVideoChange(videoId) {
        if (!this.isEnabled) return;
        
        // Re-apply speed upon SPA navigation when video element is reused and its src changes
        const savedSpeed = (this.settings?.vscRememberSpeed !== false && this.settings?.vscLastSpeed) ? this.settings.vscLastSpeed : 1.0;
        if (savedSpeed !== 1.0) {
            const selector = this.settings?.vscAudioSupport ? 'video, audio' : 'video';
            document.querySelectorAll(selector).forEach(video => {
                if (video.readyState >= 1) {
                    this.setSpeed(video, savedSpeed);
                } else {
                    const onLoadedMeta = () => {
                        this.setSpeed(video, savedSpeed);
                        video.removeEventListener('loadedmetadata', onLoadedMeta);
                    };
                    video.addEventListener('loadedmetadata', onLoadedMeta);
                }
            });
        }
    }

    _queryAllShadows(root, selector) {
        const nodes = Array.from(root.querySelectorAll(selector));
        const allElements = root.querySelectorAll('*');
        for (const el of allElements) {
            if (el.shadowRoot) {
                nodes.push(...this._queryAllShadows(el.shadowRoot, selector));
            }
        }
        return nodes;
    }

    scanForVideos() {
        const selector = this.settings?.vscAudioSupport ? 'video, audio' : 'video';
        let mediaElements = [];
        try {
            mediaElements = this._queryAllShadows(document, selector);
        } catch (e) {
            mediaElements = Array.from(document.querySelectorAll(selector));
        }
        mediaElements.forEach(node => {
            this.ui.attachToVideo(node);
        });
    }

    handleRateChange(video, e) {
        const state = this.controllers.get(video);
        if (!state) return;

        const actualSpeed = video.playbackRate;
        const targetSpeed = this.settings.vscLastSpeed || 1.0;

        if (Math.abs(actualSpeed - targetSpeed) < 0.01) {
            state.display.textContent = actualSpeed.toFixed(2);
            return;
        }

        if (e.detail && e.detail.origin === 'videoSpeed') return;

        if (state.blockNativeUpdatesUntil && Date.now() < state.blockNativeUpdatesUntil) {
            video.playbackRate = targetSpeed;
            e.stopImmediatePropagation();
            return;
        }

        const timeSinceUser = Date.now() - state.lastInteraction;
        if (timeSinceUser < 300) {
            // User did this (via native UI, though usually blocked by vscForceSpeed, 
            // or our UI but without origin set for some reason)
            this._debouncedSaveSpeed(actualSpeed);
            this.settings.vscLastSpeed = actualSpeed;
            state.display.textContent = actualSpeed.toFixed(2);
            return;
        }
        
        // If force speed is enabled, the browser must have reset it (e.g., src change)
        // because the page script blocks JS setters. We must re-apply the target speed.
        if (this.settings?.vscForceSpeed !== false) {
            this.setSpeed(video, targetSpeed);
            e.stopImmediatePropagation();
        } else {
            // If we aren't forcing speed, just accept the external change
            state.display.textContent = actualSpeed.toFixed(2);
        }
    }

    setSpeed(video, speed) {
        const state = this.controllers.get(video);
        if (!state) return;

        speed = Math.max(0.1, Math.min(speed, 16.0));
        video.playbackRate = speed;
        
        this.settings.vscLastSpeed = speed;
        this._debouncedSaveSpeed(speed);
        
        if (this.settings?.vscForceSpeed !== false) {
            window.dispatchEvent(new CustomEvent('ypp-vsc-force-speed', {
                detail: { enabled: true, speed: speed }
            }));
        }
        
        state.display.textContent = speed.toFixed(2);
        this.ui.showController(video);
        this.ui.hideControllerDelay(video);

        // Block native speed changes from overriding our explicit set command for the next 500ms
        state.blockNativeUpdatesUntil = Date.now() + 500;

        video.dispatchEvent(new CustomEvent('ratechange', {
            bubbles: true,
            composed: true,
            detail: { origin: 'videoSpeed', speed: speed }
        }));
    }

    adjustSpeed(video, delta) {
        let current = video.playbackRate;
        let newSpeed = Math.round((current + delta) * 100) / 100;
        this.setSpeed(video, newSpeed);
        this.ui.showOSDFlash(video, newSpeed.toFixed(2) + 'x');
    }

    _debouncedSaveSpeed(speed) {
        if (this._saveSpeedTimeout) clearTimeout(this._saveSpeedTimeout);
        this._saveSpeedTimeout = setTimeout(() => {
            if (this.settings?.vscRememberSpeed !== false && window.YPP.StorageManager) {
                chrome.runtime.sendMessage({ action: 'PATCH_SETTINGS', payload: { vscLastSpeed: speed } }, () => {});
            }
        }, 500);
    }

    findLargestVideo() {
        let largest = null;
        let maxArea = -1;
        const selector = this.settings?.vscAudioSupport ? 'video, audio' : 'video';
        document.querySelectorAll(selector).forEach(video => {
            const rect = video.getBoundingClientRect();
            const area = rect.width * rect.height;
            if (area > maxArea) {
                maxArea = area;
                largest = video;
            }
        });
        return largest;
    }

    injectPageScript() {
        if (this._pageScriptInjected) return;
        if (document.getElementById('ypp-vsc-page-script')) return;

        const scriptContent = `
            (function() {
                if (window.__ypp_vsc_injected) return;
                window.__ypp_vsc_injected = true;
            
                let forcedSpeed = null;
                let isForcing = false;
            
                window.addEventListener('ypp-vsc-force-speed', (e) => {
                    forcedSpeed = e.detail.speed;
                    isForcing = !!e.detail.enabled;
                    
                    if (isForcing && forcedSpeed) {
                        const medias = document.querySelectorAll('video, audio');
                        medias.forEach(media => {
                            if (Math.abs(media.playbackRate - forcedSpeed) > 0.01) {
                                try {
                                    const originalSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate').set;
                                    originalSetter.call(media, forcedSpeed);
                                } catch (err) {}
                            }
                        });
                    }
                });
            
                const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
                if (!originalDescriptor) return;
            
                const originalSet = originalDescriptor.set;
                
                Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
                    get: originalDescriptor.get,
                    set: function(val) {
                        if (isForcing && forcedSpeed !== null) {
                            if (Math.abs(val - forcedSpeed) > 0.01) {
                                return; // Blocked
                            }
                        }
                        return originalSet.call(this, val);
                    },
                    configurable: true,
                    enumerable: true
                });
            })();
        `;

        const script = document.createElement('script');
        script.id = 'ypp-vsc-page-script';
        script.textContent = scriptContent;
        (document.head || document.documentElement).appendChild(script);
        this._pageScriptInjected = true;
    }

    syncSpeedToPage() {
        if (!this.settings?.vscForceSpeed) return;
        const speed = this.settings.vscLastSpeed || 1.0;
        window.dispatchEvent(new CustomEvent('ypp-vsc-force-speed', {
            detail: { enabled: true, speed: speed }
        }));
    }

    disablePageScript() {
        window.dispatchEvent(new CustomEvent('ypp-vsc-force-speed', {
            detail: { enabled: false, speed: null }
        }));
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.VideoSpeedController = VideoSpeedController;
