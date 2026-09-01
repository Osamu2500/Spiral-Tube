const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('f:/Youtube 2.0/src');
const playerCoreDir = path.join(srcDir, 'content', 'pages', 'watch', 'player', 'core');

const stylesContent = `export class PlayerBarStyles {
    static injectStaticStyles() {
        if (document.getElementById('ypp-player-static-styles')) return;
        const style = document.createElement('style');
        style.id = 'ypp-player-static-styles';
        style.textContent = \`
            html body.ypp-auto-hide-controls .html5-video-player:not(:hover) .ypp-player-controls {
                opacity: 0 !important;
                pointer-events: none !important;
                transition: opacity 0.3s ease !important;
            }
            html body.ypp-auto-hide-controls .html5-video-player:hover .ypp-player-controls {
                opacity: 1 !important;
                pointer-events: auto !important;
                transition: opacity 0.2s ease !important;
            }
        \`;
        document.head.appendChild(style);
    }

    static updateCustomStyles(settings, currentHash) {
        const s = settings || {};
        const hash = [
            s.pb_native_play, s.pb_native_next, s.pb_native_mute, s.pb_native_cast,
            s.pb_native_autoplay, s.pb_native_cc, s.pb_native_miniplayer,
            s.pb_native_theater, s.pb_native_fullscreen
        ].join('|');
        if (hash === currentHash) return hash;

        let styleNode = document.getElementById('ypp-player-overrides');
        if (!styleNode) {
            styleNode = document.createElement('style');
            styleNode.id = 'ypp-player-overrides';
            document.head.appendChild(styleNode);
        }

        const hiddenSelectors = [];
        const isHiddenOrBack = (val) => val === 'hidden' || val === 'back';
        if (isHiddenOrBack(s.pb_native_play)) hiddenSelectors.push('.ytp-play-button', '.ytp-play-button-container');
        if (isHiddenOrBack(s.pb_native_next)) hiddenSelectors.push('.ytp-next-button');
        if (isHiddenOrBack(s.pb_native_mute)) hiddenSelectors.push('.ytp-mute-button', '.ytp-volume-area', '.ytp-volume-panel');
        if (isHiddenOrBack(s.pb_native_cast)) hiddenSelectors.push('button[data-tooltip-target-id="ytp-remote-button"]', '.ytp-remote-button', '.ytp-remote-button-container', 'yt-button-shape[aria-label*="Cast"]');
        if (isHiddenOrBack(s.pb_native_autoplay)) hiddenSelectors.push('.ytp-autonav-toggle-button-container', 'button[data-tooltip-target-id="ytp-autonav-toggle-button"]', 'button.ytp-button[aria-label*="Autoplay"]', '.ytp-autonav-toggle-button', '.ytp-autonav-button');
        if (isHiddenOrBack(s.pb_native_cc)) hiddenSelectors.push('.ytp-subtitles-button', '.ytp-subtitles-button-container');
        if (isHiddenOrBack(s.pb_native_miniplayer)) hiddenSelectors.push('.ytp-miniplayer-button', '.ytp-miniplayer-button-container');
        if (isHiddenOrBack(s.pb_native_theater)) hiddenSelectors.push('.ytp-size-button', '.ytp-size-button-container');
        if (isHiddenOrBack(s.pb_native_fullscreen)) hiddenSelectors.push('.ytp-fullscreen-button', '.ytp-fullscreen-button-container');

        if (hiddenSelectors.length > 0) {
            const selectors = hiddenSelectors.map(sel => [
                \`html body .html5-video-player \${sel}\`,
                \`html body.ypp-compact-player-ui .html5-video-player \${sel}\`,
                \`html body #movie_player .ytp-chrome-controls \${sel}\`,
                \`html body .html5-video-player .ytp-chrome-controls \${sel}\`,
                \`html body.ypp-compact-player-ui #movie_player .ytp-chrome-controls \${sel}\`,
                \`html body.ypp-compact-player-ui .html5-video-player .ytp-chrome-controls \${sel}\`,
                \`html body.ypp-compact-player-ui .html5-video-player .ytp-left-controls \${sel}\`,
                \`html body.ypp-compact-player-ui .html5-video-player .ytp-right-controls \${sel}\`
            ].join(',\\n')).join(',\\n');
            styleNode.textContent = \`\${selectors} { display: none !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important; overflow: hidden !important; }\`;
        } else {
            styleNode.textContent = '';
        }
        return hash;
    }

    static removeStyles() {
        const styleNode = document.getElementById('ypp-player-overrides');
        if (styleNode) styleNode.remove();
        
        const legacyStyle = document.getElementById('ypp-custom-player-bar-styles');
        if (legacyStyle) legacyStyle.remove();
        const legacyVis = document.getElementById('ypp-custom-player-bar-style-vis');
        if (legacyVis) legacyVis.remove();
    }
}
`;

const overflowContent = `export class PlayerBarOverflow {
    constructor(controlsHelper) {
        this.controlsHelper = controlsHelper;
        this.container = null;
        this.toggle = null;
        this._resizeObserver = null;
        this._handleDocumentClick = null;
        this.createOverflowMenu();
    }

    createOverflowMenu() {
        this.container = document.createElement('div');
        this.container.className = 'ypp-overflow-menu';
        
        this.container.style.cssText = \`
            display: flex;
            flex-direction: column;
            position: fixed;
            background: rgba(28, 28, 28, 0.65);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 8px 0;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            z-index: 9999999;
            min-width: 180px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            pointer-events: none;
        \`;
        
        const overflowPanel = document.createElement('div');
        overflowPanel.className = 'ypp-overflow-panel';
        overflowPanel.style.cssText = \`
            display: flex;
            flex-direction: column;
            gap: 4px;
        \`;
        this.container.appendChild(overflowPanel);
        this.panel = overflowPanel;
        this.hasItems = false;
        
        return this.container;
    }

    appendToOverflow(label, svgHtml, onClickAction) {
        const menuItem = document.createElement('div');
        menuItem.className = 'ypp-overflow-item';
        menuItem.setAttribute('role', 'menuitem');
        menuItem.setAttribute('tabindex', '0');
        
        menuItem.style.cssText = \`
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 16px;
            cursor: pointer;
            color: #fff;
            font-size: 13px;
            font-family: "YouTube Noto", Roboto, Arial, sans-serif;
            transition: background 0.15s ease;
        \`;
        
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'transparent';
        });
        
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex-shrink: 0;';
        iconDiv.innerHTML = svgHtml; 
        
        const svgs = iconDiv.querySelectorAll('svg');
        svgs.forEach(svg => {
            svg.style.width = '24px';
            svg.style.height = '24px';
            svg.setAttribute('fill', '#fff');
        });
        
        const labelDiv = document.createElement('div');
        labelDiv.style.flex = '1';
        labelDiv.textContent = label;
        
        menuItem.appendChild(iconDiv);
        menuItem.appendChild(labelDiv);
        let toastTimeout1, toastTimeout2;
        
        menuItem.addEventListener('click', (e) => {
            onClickAction();
            
            if (!menuItem._originalSvg) menuItem._originalSvg = iconDiv.innerHTML;
            
            if (toastTimeout1) clearTimeout(toastTimeout1);
            if (toastTimeout2) clearTimeout(toastTimeout2);
            
            iconDiv.innerHTML = \`<svg viewBox="0 0 24 24" width="24" height="24" fill="#4CAF50"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>\`;
            iconDiv.style.transform = 'scale(1.2)';
            iconDiv.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            toastTimeout1 = setTimeout(() => {
                iconDiv.style.transform = 'scale(1)';
            }, 150);

            toastTimeout2 = setTimeout(() => {
                iconDiv.innerHTML = menuItem._originalSvg;
                const restoredSvgs = iconDiv.querySelectorAll('svg');
                restoredSvgs.forEach(svg => {
                    svg.style.width = '24px';
                    svg.style.height = '24px';
                    svg.setAttribute('fill', '#fff');
                });
                this.hideMenu();
            }, 400); 
        });
        
        this.panel.appendChild(menuItem);
        this.hasItems = true;
    }
    
    hideMenu() {
        if (this.container) {
            this.container.style.opacity = '0';
            this.container.style.transform = 'translateY(10px)';
            this.container.style.pointerEvents = 'none';
        }
    }

    createToggleButton(targetContainer) {
        if (!this.hasItems) return null;
        
        const gearSvg = \`<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>\`;
        this.toggle = this.controlsHelper.createButton(gearSvg, 'More Extension Actions', (e) => {
            const isOpening = this.container.style.opacity === '0' || this.container.style.opacity === '';
            
            if (isOpening) {
                const rect = this.toggle.getBoundingClientRect();
                this.container.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
                this.container.style.right = (window.innerWidth - rect.right - 20) + 'px';
                this.container.style.opacity = '1';
                this.container.style.transform = 'translateY(0)';
                this.container.style.pointerEvents = 'auto';
            } else {
                this.hideMenu();
            }
        });
        
        targetContainer.appendChild(this.toggle);
        document.body.appendChild(this.container);
        
        this.setupListeners();
        return this.toggle;
    }
    
    setupListeners() {
        if (!this._handleDocumentClick) {
            this._handleDocumentClick = (e) => {
                if (this.container && this.toggle) {
                    if (!this.container.contains(e.target) && !this.toggle.contains(e.target)) {
                        this.hideMenu();
                    }
                }
            };
        }
        document.removeEventListener('click', this._handleDocumentClick);
        document.addEventListener('click', this._handleDocumentClick);
        
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
        this._resizeObserver = new ResizeObserver(() => {
            if (this.container && this.container.style.opacity === '1') {
                const rect = this.toggle.getBoundingClientRect();
                this.container.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
                this.container.style.right = (window.innerWidth - rect.right - 20) + 'px';
            }
        });
        this._resizeObserver.observe(document.body);
    }

    destroy() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._handleDocumentClick) {
            document.removeEventListener('click', this._handleDocumentClick);
            this._handleDocumentClick = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        if (this.toggle) {
            this.toggle.remove();
            this.toggle = null;
        }
    }
}
`;

const uiContent = `import { PlayerBarStyles } from './player-bar-styles.js';
import { PlayerBarOverflow } from './player-bar-overflow.js';

export class PlayerBarUI {
    static featureId = 'playerBarUI';
    static executionPhase = 'idle';
    static priority = 999;

    constructor(manager) {
        this.manager = manager;
        this.injectedButtons = false;
        this._stylesHash = null;
        this._retryTimer = null;
        this.overflowManager = null;
        this.setupInjectionObserver();
    }

    get isActive() {
        const isWatchOrShorts = window.location.pathname.startsWith('/watch') || window.location.pathname.startsWith('/shorts');
        if (this.manager && typeof this.manager.isActive === 'boolean') {
            return this.manager.isActive || isWatchOrShorts;
        }
        return isWatchOrShorts;
    }

    get settings() {
        return this.manager?.settings || window.YPP?.MainApp?.getSettings?.() || window.YPP?.CONSTANTS?.DEFAULT_SETTINGS || {};
    }

    async enable() {
        if (!this.isActive) return;
        PlayerBarStyles.injectStaticStyles();
        this.updateCustomStyles();
        this.injectedButtons = false;
        
        if (!this._navigateListener) {
            this._navigateListener = () => {
                this.injectedButtons = false;
                this._scheduleRetry();
            };
            
            this._dataUpdatedListener = () => {
                if (this._attemptTimer) clearTimeout(this._attemptTimer);
                this._attemptTimer = setTimeout(() => this.attemptInjection(), 300);
            };

            ['yt-navigate-finish'].forEach(evt => {
                document.addEventListener(evt, this._navigateListener);
                window.addEventListener(evt, this._navigateListener);
            });
            
            ['yt-page-data-updated'].forEach(evt => {
                document.addEventListener(evt, this._dataUpdatedListener);
                window.addEventListener(evt, this._dataUpdatedListener);
            });
        }
        
        this.setupInjectionObserver();
        this._startHeartbeat();
    }

    _scheduleRetry(attempt = 0) {
        const delays = [0, 300, 800, 2000, 4000];
        if (attempt >= delays.length) return;
        if (this._retryTimer) clearTimeout(this._retryTimer);
        this._retryTimer = setTimeout(() => {
            this._retryTimer = null;
            this.attemptInjection();
            if (!this.injectedButtons) {
                this._scheduleRetry(attempt + 1);
            }
        }, delays[attempt]);
    }

    _startHeartbeat() {
        if (this._heartbeatTimer) return;
        this._heartbeatTimer = setInterval(() => {
            if (!this.isActive || document.hidden) return;
            const isShorts = window.location.pathname.startsWith('/shorts');
            const selector = isShorts ? 'ytd-reel-video-renderer[is-active] .ypp-player-controls' : '.ypp-player-controls';
            const container = document.querySelector(selector);
            if (!container || !document.contains(container) || container.children.length === 0) {
                this.attemptInjection();
            }
        }, 5000);
    }

    _stopHeartbeat() {
        if (this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = null;
        }
    }

    async update(settings) {
        if (!this.isActive) return;
        if (settings && this.manager && this.manager.settings !== settings) {
             this.manager.settings = { ...this.manager.settings, ...settings };
        }
        this.updateCustomStyles();
        this.injectedButtons = false;
        this.attemptInjection();
    }

    attemptInjection(forceRebuild = false) {
        if (!this.isActive) return;
        this.updateCustomStyles();
        
        const isShorts = window.location.pathname.startsWith('/shorts');
        const video = isShorts 
            ? document.querySelector('ytd-reel-video-renderer[is-active] video') 
            : document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]);
        
        const controls = isShorts 
            ? document.querySelector('ytd-reel-video-renderer[is-active] .overlay.ytd-reel-video-renderer') 
            : document.querySelector(window.YPP.CONSTANTS.SELECTORS.PLAYER_BAR);
        
        if (video && controls) {
            const isAdShowing = video.closest('.ad-showing') || document.querySelector('.ytp-ad-player-overlay, .ytp-ad-module[style*="display: block"]');
            if (isAdShowing && !isShorts) {
                this.injectedButtons = false;
                return;
            }
            const existingAll = controls.querySelectorAll('.ypp-player-controls');
            if (existingAll.length > 1) {
                for (let i = 1; i < existingAll.length; i++) {
                    existingAll[i].remove();
                }
            }
            
            const current = controls.querySelector('.ypp-player-controls');
            let needsReinject = false;

            if (!current || !document.contains(current) || current.children.length === 0) {
                needsReinject = true;
            } else if (!isShorts) {
                const rightControls = controls.querySelector('.ytp-right-controls') || controls.querySelector('.ytp-right-controls-right');
                if (rightControls && current.parentNode !== rightControls) {
                    needsReinject = true;
                }
            }

            if (!needsReinject && current && this.settings) {
                if (this.settings.enableVolumeBoost !== false && this.settings.pb_volume !== 'hidden' && !current.querySelector('#ypp-volume-boost-btn')) {
                    needsReinject = true;
                }
            }

            if (!needsReinject && forceRebuild && current && current.parentNode) {
                needsReinject = true;
            }

            if (needsReinject) {
                if (current && current.parentNode) current.remove();
                this.injectedButtons = false;
                this.injectControls(video, controls, isShorts);
            }
        }
    }

    setupInjectionObserver() {
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('player-bar-injection', window.YPP.CONSTANTS.SELECTORS.PLAYER_BAR, () => {
                this._scheduleRetry();
            }, true);
            
            window.YPP.sharedObserver.register('player-bar-injection-vid', window.YPP.CONSTANTS.SELECTORS.VIDEO[0], () => {
                this.attemptInjection();
            }, true);

            window.YPP.sharedObserver.register('player-bar-injection-shorts', 'ytd-reel-video-renderer[is-active]', () => {
                this.attemptInjection();
            }, true);

            window.YPP.sharedObserver.register('player-bar-injection-right', '.ytp-right-controls, .ytp-chrome-controls', () => {
                this.attemptInjection();
            }, true);
        }
    }

    injectControls(video, controls, isShorts) {
        if (this.injectedButtons || !this.isActive) return;

        if (isShorts) {
            const activeShort = video.closest('ytd-reel-video-renderer');
            if (activeShort) {
                activeShort.querySelectorAll('.ypp-player-controls').forEach(e => e.remove());
            }
        } else {
            document.querySelectorAll('.ypp-player-controls').forEach(e => e.remove());
        }
        
        if (this.overflowManager) {
            this.overflowManager.destroy();
            this.overflowManager = null;
        }

        this.updateCustomStyles();

        const container = document.createElement('div');
        container.className = 'ypp-player-controls' + (isShorts ? ' ypp-shorts-controls' : '');

        const isBack = (val) => val === 'back';

        if (!this.manager.controlsHelper && window.YPP?.features?.PlayerControls) {
            this.manager.controlsHelper = new window.YPP.features.PlayerControls(this.manager);
        }

        this.overflowManager = new PlayerBarOverflow(this.manager.controlsHelper);

        const nativeFeatures = [
            { id: 'pb_native_play', selector: '.ytp-play-button', label: 'Play/Pause', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M5 3l14 9-14 9V3z"/></svg>' },
            { id: 'pb_native_next', selector: '.ytp-next-button', label: 'Next Video', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M5 4l10 8-10 8V4zM15 4h4v16h-4z"/></svg>' },
            { id: 'pb_native_mute', selector: '.ytp-mute-button', label: 'Mute/Unmute', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07"/></svg>' },
            { id: 'pb_native_cast', selector: '.ytp-remote-button', label: 'Cast to TV', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z M1 18v3h3c0-1.66-1.34-3-3-3zM1 14v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"/></svg>' },
            { id: 'pb_native_autoplay', selector: '.ytp-autonav-button, .ytp-autonav-toggle-button', label: 'Autoplay', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>' },
            { id: 'pb_native_cc', selector: '.ytp-subtitles-button', label: 'Subtitles', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z"/></svg>' },
            { id: 'pb_native_miniplayer', selector: '.ytp-miniplayer-button', label: 'Miniplayer', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/></svg>' },
            { id: 'pb_native_theater', selector: '.ytp-size-button', label: 'Theater Mode', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/></svg>' },
            { id: 'pb_native_fullscreen', selector: '.ytp-fullscreen-button', label: 'Fullscreen', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>' }
        ];

        nativeFeatures.forEach(item => {
            if (isBack(this.settings[item.id])) {
                this.overflowManager.appendToOverflow(item.label, item.icon, () => {
                    const targetBtn = document.querySelector(item.selector);
                    if (targetBtn) targetBtn.click();
                });
            }
        });

        const featureBuilders = {
            'pb_speed': () => {
                if (this.manager.controlsHelper && this.settings.enableCustomSpeed !== false) {
                    return this.manager.controlsHelper.createSpeedControls(video);
                }
                return null;
            },
            'pb_pip': () => {
                if (this.manager.controlsHelper && document.pictureInPictureEnabled) {
                    return this.manager.controlsHelper.createPiPButton(video);
                }
                return null;
            }
        };

        const dynamicFeatures = [
            { id: 'pb_snapshot', key: 'snapshotButton', override: 'enableSnapshot' },
            { id: 'pb_loop', key: 'loopButton', override: 'enableLoop' },
            { id: 'pb_bookmark', key: 'bookmarksManager', override: 'enableBookmarks' },
            { id: 'pb_volume', key: 'volumeBoost', override: 'enableVolumeBoost' },
            { id: 'pb_cinema', key: 'videoFilters', override: 'enableCinemaFilters' }
        ];

        dynamicFeatures.forEach(config => {
            featureBuilders[config.id] = () => {
                if (this.settings[config.override] === false) return null;
                let feature = window.YPP.featureManager && window.YPP.featureManager.getFeature(config.key);
                if (!feature && config.key === 'volumeBoost') {
                    feature = window.YPP.featureManager && window.YPP.featureManager.getFeature('VolumeBooster');
                }
                if (feature && feature.createButton) {
                    return feature.createButton(video);
                }
                return null;
            };
        });

        const defaultSeq = ['pb_speed', 'pb_pip', 'pb_snapshot', 'pb_loop', 'pb_bookmark', 'pb_volume', 'pb_cinema'];
        let sequence = this.settings.playerBarSequence;
        if (!sequence || !Array.isArray(sequence) || sequence.length === 0) {
            sequence = defaultSeq;
        }

        const missing = defaultSeq.filter(x => !sequence.includes(x));
        const fullSequence = [...sequence, ...missing];

        fullSequence.forEach(id => {
            const settingValue = this.settings[id];
            if (settingValue === 'hidden' || settingValue === false) return;

            const builder = featureBuilders[id];
            if (!builder) return;

            const btn = builder();
            if (!btn) return;

            if (isBack(settingValue)) {
                const svgHtml = btn.innerHTML;
                const label = btn.getAttribute('aria-label') || btn.title || 'Tool';
                this.overflowManager.appendToOverflow(label, svgHtml, () => btn.click());
            } else {
                container.appendChild(btn);
            }
        });

        this.overflowManager.createToggleButton(container);

        if (isShorts) {
            controls.appendChild(container);
        } else {
            let rightControls = controls.querySelector('.ytp-right-controls') || controls.querySelector('.ytp-right-controls-right');
            const chromeControls = controls.querySelector('.ytp-chrome-controls');

            const getDirectChild = (parent, descendant) => {
                if (!parent || !descendant) return null;
                let node = descendant;
                while (node && node.parentNode !== parent) {
                    node = node.parentNode;
                    if (!node || node === document.body) return null;
                }
                return node;
            };

            if (rightControls && document.contains(rightControls)) {
                const settingsBtn  = rightControls.querySelector('.ytp-settings-button');
                const theaterBtn   = rightControls.querySelector('.ytp-size-button');
                const fullscreenBtn = rightControls.querySelector('.ytp-fullscreen-button');
                const rawAnchor = settingsBtn || theaterBtn || fullscreenBtn || null;
                const insertionPoint = getDirectChild(rightControls, rawAnchor);
                if (insertionPoint) {
                    rightControls.insertBefore(container, insertionPoint);
                } else {
                    rightControls.appendChild(container);
                }
            } else if (chromeControls && document.contains(chromeControls)) {
                const settingsBtn  = chromeControls.querySelector('.ytp-settings-button');
                const theaterBtn   = chromeControls.querySelector('.ytp-size-button');
                const fullscreenBtn = chromeControls.querySelector('.ytp-fullscreen-button');
                const rawAnchor = settingsBtn || theaterBtn || fullscreenBtn || null;
                const insertionPoint = getDirectChild(chromeControls, rawAnchor);
                if (insertionPoint) {
                    chromeControls.insertBefore(container, insertionPoint);
                } else {
                    chromeControls.appendChild(container);
                }
            } else {
                controls.appendChild(container);
            }
        }
        
        if (this._localObserver) {
            this._localObserver.disconnect();
        }
        
        const targetContainer = isShorts ? controls : (controls.querySelector('.ytp-right-controls') || controls.querySelector('.ytp-chrome-controls') || controls);
        if (targetContainer) {
            this._localObserver = new MutationObserver((mutations) => {
                if (!document.contains(container) || container.children.length === 0) {
                    this._localObserver.disconnect();
                    this.injectedButtons = false;
                    this.attemptInjection();
                }
            });
            this._localObserver.observe(targetContainer, { childList: true });
        }
        
        this.injectedButtons = true;
    }

    updateCustomStyles() {
        this._stylesHash = PlayerBarStyles.updateCustomStyles(this.settings, this._stylesHash);
    }

    disable() {
        this._stopHeartbeat();
        if (this._retryTimer) { clearTimeout(this._retryTimer); this._retryTimer = null; }
        this._stylesHash = null;
        
        if (this.overflowManager) {
            this.overflowManager.destroy();
            this.overflowManager = null;
        }
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('player-bar-injection');
            window.YPP.sharedObserver.unregister('player-bar-injection-vid');
            window.YPP.sharedObserver.unregister('player-bar-injection-shorts');
            window.YPP.sharedObserver.unregister('player-bar-injection-right');
        }
        
        if (this._localObserver) {
            this._localObserver.disconnect();
            this._localObserver = null;
        }
        
        document.querySelectorAll('.ypp-player-controls').forEach(controls => controls.remove());
        this.injectedButtons = false;
        
        PlayerBarStyles.removeStyles();
    }
}
`;

fs.writeFileSync(path.join(playerCoreDir, 'player-bar-styles.js'), stylesContent, 'utf-8');
fs.writeFileSync(path.join(playerCoreDir, 'player-bar-overflow.js'), overflowContent, 'utf-8');
fs.writeFileSync(path.join(playerCoreDir, 'player-bar-ui.js'), uiContent, 'utf-8');

console.log("Migration successful");
