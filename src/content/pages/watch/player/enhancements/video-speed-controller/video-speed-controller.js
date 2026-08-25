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
    }

    getConfigKey() {
        return 'enableCustomSpeed';
    }

    async enable() {
        if (!this.settings || this.settings.enableCustomSpeed === false) return;
        
        this.utils?.log('Enabling Global Video Speed Controller', 'VSC');
        
        // Inject page script for forced speed to make sure it always works natively
        if (this.settings?.vscForceSpeed !== false) {
            const scriptId = 'ypp-vsc-page-script';
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = chrome.runtime.getURL('src/content/pages/watch/player/enhancements/vsc-page-script.js');
                (document.head || document.documentElement).appendChild(script);
            }
        }
        
        // Scan and observe using centralized engine
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
            this._fallbackScanner = (e) => {
                if (e.target && (e.target.tagName === 'VIDEO' || (this.settings?.vscAudioSupport && e.target.tagName === 'AUDIO'))) {
                    this.scanForVideos();
                }
            };
            this.addListener(document, 'play', this._fallbackScanner, true);
            this.addListener(document, 'loadeddata', this._fallbackScanner, true);
        }

        // Global keyboard shortcuts are now handled via shortcuts class
        this.shortcuts.register();

        // Cross-tab sync listener
        if (this.settings?.vscRememberSpeed !== false) {
            this._storageListener = (changes, area) => {
                // The settings are stored under the 'settings' key in chrome.storage.local
                if (area === 'local' && changes.settings && changes.settings.newValue) {
                    const newSpeed = changes.settings.newValue.vscLastSpeed;
                    if (newSpeed && Math.abs(newSpeed - this.settings.vscLastSpeed) > 0.01) {
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
}
