window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

/**
 * Player Bar UI
 * Owns: Generating the custom player bar DOM, injecting it into the YouTube watch page player,
 * and handling the visibility/styling of native YouTube buttons based on settings.
 */
window.YPP.features.PlayerBarUI = class PlayerBarUI {
    constructor(manager) {
        this.manager = manager;
        this.injectedButtons = false;
        this.startInjectionPolling();
    }

    startInjectionPolling() {
        if (this._pollingInterval) clearInterval(this._pollingInterval);
        this._pollingInterval = setInterval(() => {
            if (!this.manager.isActive) return;
            
            const isShorts = window.location.pathname.startsWith('/shorts');
            const video = isShorts 
                ? document.querySelector('ytd-reel-video-renderer[is-active] video') 
                : document.querySelector('video.html5-main-video');
            const controls = isShorts 
                ? document.querySelector('ytd-reel-video-renderer[is-active] .overlay.ytd-reel-video-renderer') 
                : document.querySelector('.ytp-chrome-bottom');
            
            if (video && controls) {
                if (!controls.querySelector('.ypp-player-controls')) {
                    this.injectedButtons = false;
                    this.injectControls(video, controls, isShorts);
                }
            }
        }, 1000);
    }

    get settings() {
        return this.manager.settings;
    }

    injectControls(video, controls, isShorts) {
        if (this.injectedButtons || !this.manager.isActive) return;

        // Clean up any stale controls first
        if (isShorts) {
            const activeShort = video.closest('ytd-reel-video-renderer');
            if (activeShort) {
                const existing = activeShort.querySelector('.ypp-player-controls');
                if (existing) existing.remove();
            }
        } else {
            const existing = document.querySelector('.ypp-player-controls');
            if (existing) existing.remove();
        }

        this.applyNativeButtonStyles();

        if (this.manager.settingsMenuHelper) {
            this.manager.settingsMenuHelper.setupSettingsObserver(video);
        }
        this.applyNativeButtonVisibility();

        const container = document.createElement('div');
        container.className = 'ypp-player-controls' + (isShorts ? ' ypp-shorts-controls' : '');

        // Helper to check if a button should be on the front bar (handles legacy true/false)
        const isFront = (val) => val === 'front' || val === true || typeof val === 'undefined';

        // Ensure controlsHelper is available synchronously
        if (!this.manager.controlsHelper && window.YPP?.features?.PlayerControls) {
            this.manager.controlsHelper = new window.YPP.features.PlayerControls(this.manager);
        }

        // Use controlsHelper to create core toggles
        if (this.manager.controlsHelper && this.settings.enableCustomSpeed !== false && isFront(this.settings.pb_speed)) {
            container.appendChild(this.manager.controlsHelper.createSpeedControls(video));
        }
            
        // Button Feature Registrations (call their createButton methods)
        const addFeatureButton = (featureKey, pbKey, overrideSettingsKey) => {
            if (this.settings[overrideSettingsKey] === false) return; // Feature disabled globally
            if (!isFront(this.settings[pbKey])) return; // Hidden from front bar
            
            const feature = window.YPP.featureManager && window.YPP.featureManager.getFeature(featureKey);
            if (feature && feature.createButton) {
                const btn = feature.createButton(video);
                if (btn) container.appendChild(btn);
            }
        };

        addFeatureButton('snapshotButton', 'pb_snapshot', 'enableSnapshot');
        addFeatureButton('loopButton', 'pb_loop', 'enableLoop');
        addFeatureButton('bookmarksManager', 'pb_bookmark', 'enableBookmarks');
        addFeatureButton('volumeBoost', 'pb_volume', 'enableVolumeBoost');
        addFeatureButton('videoFilters', 'pb_cinema', 'enableCinemaFilters');

        if (this.manager.controlsHelper && document.pictureInPictureEnabled && this.settings.enablePiP !== false && (!this.settings.pb_pip || this.settings.pb_pip === 'front')) {
            container.appendChild(this.manager.controlsHelper.createPiPButton(video));
        }

        if (isShorts) {
            controls.appendChild(container);
        } else {
            // Find where to insert our controls within .ytp-chrome-bottom
            let rightControls = controls.querySelector('.ytp-right-controls') || controls.querySelector('.ytp-right-controls-right');
            const fullscreenBtn = controls.querySelector('.ytp-fullscreen-button');
            const chromeControls = controls.querySelector('.ytp-chrome-controls');
            
            if (rightControls) {
                // Insert inside the right controls as the very first item
                rightControls.insertBefore(container, rightControls.firstChild);
            } else if (fullscreenBtn && fullscreenBtn.parentNode) {
                // Fallback: insert right before the fullscreen button inside its parent
                fullscreenBtn.parentNode.insertBefore(container, fullscreenBtn);
            } else if (chromeControls) {
                chromeControls.appendChild(container);
            } else {
                controls.appendChild(container);
            }
        }
        
        this.injectedButtons = true;
    }

    applyNativeButtonStyles() {
        let style = document.getElementById('ypp-custom-player-bar-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'ypp-custom-player-bar-styles';
            document.head.appendChild(style);
        }

        let css = '';
        const hideMap = {
            'pb_native_play': '.ytp-play-button',
            'pb_native_next': '.ytp-next-button',
            'pb_native_mute': '.ytp-mute-button',
            'pb_native_cast': '.ytp-remote-button',
            'pb_native_autoplay': '.ytp-autonav-button, .ytp-autonav-toggle-button',
            'pb_native_cc': '.ytp-subtitles-button',
            'pb_native_settings': '.ytp-settings-button',
            'pb_native_miniplayer': '.ytp-miniplayer-button',
            'pb_native_theater': '.ytp-size-button',
            'pb_native_fullscreen': '.ytp-fullscreen-button'
        };

        for (const [key, selector] of Object.entries(hideMap)) {
            if (this.settings[key] === 'hidden' || this.settings[key] === true) {
                css += `${selector} { display: none !important; }\n`;
            }
        }
        style.textContent = css;
    }

    applyNativeButtonVisibility() {
        let styleNode = document.getElementById('ypp-custom-player-bar-style-vis');
        if (!styleNode) {
            styleNode = document.createElement('style');
            styleNode.id = 'ypp-custom-player-bar-style-vis';
            document.head.appendChild(styleNode);
        }

        const hiddenSelectors = [];
        if (this.settings.pb_native_play === 'hidden') hiddenSelectors.push('.ytp-play-button');
        if (this.settings.pb_native_next === 'hidden') hiddenSelectors.push('.ytp-next-button');
        if (this.settings.pb_native_mute === 'hidden') hiddenSelectors.push('.ytp-mute-button', '.ytp-volume-area');
        if (this.settings.pb_native_cast === 'hidden') hiddenSelectors.push('button[data-tooltip-target-id="ytp-remote-button"]', '.ytp-remote-button');
        if (this.settings.pb_native_autoplay === 'hidden') hiddenSelectors.push('button[data-tooltip-target-id="ytp-autonav-toggle-button"]', 'button.ytp-button[aria-label*="Autoplay"]', '.ytp-autonav-toggle-button', '.ytp-autonav-button');
        if (this.settings.pb_native_cc === 'hidden') hiddenSelectors.push('.ytp-subtitles-button');
        if (this.settings.pb_native_miniplayer === 'hidden') hiddenSelectors.push('.ytp-miniplayer-button');
        if (this.settings.pb_native_theater === 'hidden') hiddenSelectors.push('.ytp-size-button');
        if (this.settings.pb_native_fullscreen === 'hidden') hiddenSelectors.push('.ytp-fullscreen-button');

        if (hiddenSelectors.length > 0) {
            styleNode.textContent = `${hiddenSelectors.join(', ')} { display: none !important; }`;
        } else {
            styleNode.textContent = '';
        }
    }

    cleanup() {
        if (this._pollingInterval) {
            clearInterval(this._pollingInterval);
            this._pollingInterval = null;
        }
        document.querySelectorAll('.ypp-player-controls').forEach(controls => controls.remove());
        this.injectedButtons = false;

        if (this.manager.settingsMenuHelper) {
            this.manager.settingsMenuHelper.cleanupSettingsObserver();
        }
        
        const styleNode = document.getElementById('ypp-custom-player-bar-styles');
        if (styleNode) styleNode.remove();
        
        const visNode = document.getElementById('ypp-custom-player-bar-style-vis');
        if (visNode) visNode.remove();
    }
};
