/**
 * Player Bar UI
 * Owns: Generating the custom player bar DOM, injecting it into the YouTube watch page player,
 * and handling the visibility/styling of native YouTube buttons based on settings.
 */
export class PlayerBarUI {
    static featureId = 'playerBarUI';
    static executionPhase = 'idle';
    static priority = 999;

    constructor(manager) {
        this.manager = manager;
        this.injectedButtons = false;
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
        this.updateCustomStyles();
        this.injectedButtons = false;
        
        if (!this._navigateListener) {
            this._navigateListener = () => {
                this.injectedButtons = false; // Reset to allow re-injection on new pages
                this.attemptInjection();
                setTimeout(() => this.attemptInjection(), 1000);
                setTimeout(() => this.attemptInjection(), 2000);
                setTimeout(() => this.attemptInjection(), 4000);
            };
            
            this._dataUpdatedListener = () => {
                // Debounce simple attempts on data update without resetting injectedButtons
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

    _startHeartbeat() {
        if (this._heartbeatTimer) return;
        this._heartbeatTimer = setInterval(() => {
            if (!this.isActive) return;
            // V5: Double Check System - Microscopic DOM check to detect orphaned UI
            const isShorts = window.location.pathname.startsWith('/shorts');
            const selector = isShorts ? 'ytd-reel-video-renderer[is-active] .ypp-player-controls' : '.ypp-player-controls';
            const container = document.querySelector(selector);
            
            // If the container is missing or destroyed, instantly attempt reinjection
            if (!container || !document.contains(container) || container.children.length === 0) {
                this.attemptInjection();
            }
        }, 2000);
    }

    _stopHeartbeat() {
        if (this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = null;
        }
    }

    async onUpdate() {
        if (!this.isActive) return;
        this.updateCustomStyles();
        this.injectedButtons = false;
        this.attemptInjection();
    }

    attemptInjection() {
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
            // V5: Ad-Transition Hardening
            // If an Ad is showing, DO NOT inject. Ads use hijacked player modules that will be destroyed anyway.
            const isAdShowing = video.closest('.ad-showing') || document.querySelector('.ytp-ad-player-overlay, .ytp-ad-module[style*="display: block"]');
            if (isAdShowing && !isShorts) {
                this.injectedButtons = false; // Mark for reinjection when Ad finishes
                return; // Abort
            }
            // Remove stale instances from previous extension reloads
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
                // Verify custom player bar is in the correct container (.ytp-right-controls if present)
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
                this.attemptInjection();
                // Check a few times in case video element lags behind controls
                setTimeout(() => this.attemptInjection(), 500);
                setTimeout(() => this.attemptInjection(), 1500);
            }, true);
            
            // Also listen to video element just in case it is added AFTER the player bar
            window.YPP.sharedObserver.register('player-bar-injection-vid', window.YPP.CONSTANTS.SELECTORS.VIDEO[0], () => {
                this.attemptInjection();
            }, true);

            window.YPP.sharedObserver.register('player-bar-injection-shorts', 'ytd-reel-video-renderer[is-active]', () => {
                this.attemptInjection();
            }, true);

            // Watch inner right/chrome controls so when YouTube replaces native buttons on cold load, we re-inject immediately
            window.YPP.sharedObserver.register('player-bar-injection-right', '.ytp-right-controls, .ytp-chrome-controls', () => {
                this.attemptInjection();
            }, true);
        }
        // ALWAYS run a lightweight fallback check so if YouTube mutates innerHTML without adding new nodes, we catch it
        // Removed fallback polling loop; relying entirely on robust sharedObserver rules
    }

    injectControls(video, controls, isShorts) {
        if (this.injectedButtons || !this.isActive) return;

        // Clean up any stale controls first
        if (isShorts) {
            const activeShort = video.closest('ytd-reel-video-renderer');
            if (activeShort) {
                const existing = activeShort.querySelectorAll('.ypp-player-controls');
                existing.forEach(e => e.remove());
            }
        } else {
            const existing = document.querySelectorAll('.ypp-player-controls');
            existing.forEach(e => e.remove());
        }
        
        // V3: Clean up stale detached overflow menus from the body
        document.querySelectorAll('.ypp-overflow-menu').forEach(e => e.remove());

        this.updateCustomStyles();

        if (this.manager.settingsMenuHelper) {
            this.manager.settingsMenuHelper.setupSettingsObserver(video);
        }

        const container = document.createElement('div');
        container.className = 'ypp-player-controls' + (isShorts ? ' ypp-shorts-controls' : '');

        // Helper to check if a button should be on the front bar or back (overflow)
        const isFront = (val) => val === 'front' || val === true || typeof val === 'undefined';
        const isBack = (val) => val === 'back';

        // Ensure controlsHelper is available synchronously
        if (!this.manager.controlsHelper && window.YPP?.features?.PlayerControls) {
            this.manager.controlsHelper = new window.YPP.features.PlayerControls(this.manager);
        }

        const overflowContainer = document.createElement('div');
        overflowContainer.className = 'ypp-overflow-menu';
        
        // V1 Upgrade: Glassmorphism and animations
        overflowContainer.style.cssText = `
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
        `;
        
        const overflowPanel = document.createElement('div');
        overflowPanel.className = 'ypp-overflow-panel';
        overflowPanel.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;
        overflowContainer.appendChild(overflowPanel);

        let hasOverflowItems = false;

        // Native YouTube Buttons that can be moved to overflow
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

        // Create generic overflow menu item builder
        const appendToOverflow = (label, svgHtml, onClickAction) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'ypp-overflow-item';
            menuItem.setAttribute('role', 'menuitem');
            menuItem.setAttribute('tabindex', '0');
            
            // Item styling
            menuItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 16px;
                cursor: pointer;
                color: #fff;
                font-size: 13px;
                font-family: "YouTube Noto", Roboto, Arial, sans-serif;
                transition: background 0.15s ease;
            `;
            
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = 'transparent';
            });
            
            const iconDiv = document.createElement('div');
            iconDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex-shrink: 0;';
            iconDiv.innerHTML = svgHtml; 
            
            // Ensure icons inside inherit color or remain white
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
                
                // V3: Robust Action Feedback (Micro-toast inside menu)
                if (!menuItem._originalSvg) menuItem._originalSvg = iconDiv.innerHTML;
                
                if (toastTimeout1) clearTimeout(toastTimeout1);
                if (toastTimeout2) clearTimeout(toastTimeout2);
                
                iconDiv.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="#4CAF50"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;
                iconDiv.style.transform = 'scale(1.2)';
                iconDiv.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                
                toastTimeout1 = setTimeout(() => {
                    iconDiv.style.transform = 'scale(1)';
                }, 150);

                toastTimeout2 = setTimeout(() => {
                    // Restore and close
                    iconDiv.innerHTML = menuItem._originalSvg;
                    
                    // Re-apply fill to restored SVG
                    const restoredSvgs = iconDiv.querySelectorAll('svg');
                    restoredSvgs.forEach(svg => {
                        svg.style.width = '24px';
                        svg.style.height = '24px';
                        svg.setAttribute('fill', '#fff');
                    });
                    
                    overflowContainer.style.opacity = '0';
                    overflowContainer.style.transform = 'translateY(10px)';
                    overflowContainer.style.pointerEvents = 'none';
                }, 400); // Wait 400ms so the user sees the checkmark
            });
            overflowPanel.appendChild(menuItem);
            hasOverflowItems = true;
        };

        nativeFeatures.forEach(item => {
            if (isBack(this.settings[item.id])) {
                appendToOverflow(item.label, item.icon, () => {
                    const targetBtn = document.querySelector(item.selector);
                    if (targetBtn) targetBtn.click();
                });
            }
        });

        // Setup Custom Player Bar Features Map
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
            const settingValue = this.settings[id]; // 'front', 'back', 'hidden'
            if (settingValue === 'hidden' || settingValue === false) return;

            const builder = featureBuilders[id];
            if (!builder) return;

            const btn = builder();
            if (!btn) return;

            if (isBack(settingValue)) {
                const svgHtml = btn.innerHTML; // Extract SVG
                const label = btn.getAttribute('aria-label') || btn.title || 'Tool';
                
                appendToOverflow(label, svgHtml, () => {
                    btn.click();
                });
            } else {
                container.appendChild(btn);
            }
        });

        // Add Overflow Toggle Button if needed
        if (hasOverflowItems) {
            const gearSvg = `<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;
            const overflowToggle = this.manager.controlsHelper.createButton(gearSvg, 'More Extension Actions', (e) => {
                const isOpening = overflowContainer.style.opacity === '0' || overflowContainer.style.opacity === '';
                
                if (isOpening) {
                    // Position logic
                    const rect = overflowToggle.getBoundingClientRect();
                    overflowContainer.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
                    overflowContainer.style.right = (window.innerWidth - rect.right - 20) + 'px';
                    
                    // Show
                    overflowContainer.style.opacity = '1';
                    overflowContainer.style.transform = 'translateY(0)';
                    overflowContainer.style.pointerEvents = 'auto';
                } else {
                    // Hide
                    overflowContainer.style.opacity = '0';
                    overflowContainer.style.transform = 'translateY(10px)';
                    overflowContainer.style.pointerEvents = 'none';
                }
            });
            container.appendChild(overflowToggle);
            
            // Append overflow menu to body so it escapes hidden overflow of player bar
            document.body.appendChild(overflowContainer);
            
            // Track instances for the click handler
            this._currentOverflowContainer = overflowContainer;
            this._currentOverflowToggle = overflowToggle;
            
            // V3: Fix Massive Event Listener Leak
            if (!this._handleDocumentClick) {
                this._handleDocumentClick = (e) => {
                    if (this._currentOverflowContainer && this._currentOverflowToggle) {
                        if (!this._currentOverflowContainer.contains(e.target) && !this._currentOverflowToggle.contains(e.target)) {
                            this._currentOverflowContainer.style.opacity = '0';
                            this._currentOverflowContainer.style.transform = 'translateY(10px)';
                            this._currentOverflowContainer.style.pointerEvents = 'none';
                        }
                    }
                };
            }
            document.removeEventListener('click', this._handleDocumentClick);
            document.addEventListener('click', this._handleDocumentClick);
            
            // V3: Fix detached DOM ResizeObserver leak
            if (this._resizeObserver) {
                this._resizeObserver.disconnect();
            }
            this._resizeObserver = new ResizeObserver(() => {
                if (this._currentOverflowContainer && this._currentOverflowContainer.style.opacity === '1') {
                    const rect = this._currentOverflowToggle.getBoundingClientRect();
                    this._currentOverflowContainer.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
                    this._currentOverflowContainer.style.right = (window.innerWidth - rect.right - 20) + 'px';
                }
            });
            this._resizeObserver.observe(document.body);
        }

        if (isShorts) {
            controls.appendChild(container);
        } else {
            // Find where to insert our controls within .ytp-chrome-bottom
            let rightControls = controls.querySelector('.ytp-right-controls') || controls.querySelector('.ytp-right-controls-right');
            const fullscreenBtn = controls.querySelector('.ytp-fullscreen-button');
            const chromeControls = controls.querySelector('.ytp-chrome-controls');
            
            // V5: Safe Container Fallback
            // If YouTube is testing a new layout without `.ytp-right-controls`, we inject
            // directly before the fullscreen button to ensure the sequence remains visually consistent.
            if (rightControls && document.contains(rightControls)) {
                // Insert inside the right controls as the very first item
                rightControls.insertBefore(container, rightControls.firstChild);
            } else if (fullscreenBtn && fullscreenBtn.parentNode && document.contains(fullscreenBtn)) {
                // Fallback: insert right before the fullscreen button inside its parent
                fullscreenBtn.parentNode.insertBefore(container, fullscreenBtn);
            } else if (chromeControls && document.contains(chromeControls)) {
                chromeControls.appendChild(container);
            } else {
                controls.appendChild(container);
            }
        }
        
        this.injectedButtons = true;
    }

    updateCustomStyles() {
        let styleNode = document.getElementById('ypp-player-overrides');
        if (!styleNode) {
            styleNode = document.createElement('style');
            styleNode.id = 'ypp-player-overrides';
            document.head.appendChild(styleNode);
        }

        const hiddenSelectors = [];
        const isHiddenOrBack = (val) => val === 'hidden' || val === 'back';
        if (isHiddenOrBack(this.settings.pb_native_play)) hiddenSelectors.push('.ytp-play-button', '.ytp-play-button-container');
        if (isHiddenOrBack(this.settings.pb_native_next)) hiddenSelectors.push('.ytp-next-button');
        if (isHiddenOrBack(this.settings.pb_native_mute)) hiddenSelectors.push('.ytp-mute-button', '.ytp-volume-area', '.ytp-volume-panel');
        if (isHiddenOrBack(this.settings.pb_native_cast)) hiddenSelectors.push('button[data-tooltip-target-id="ytp-remote-button"]', '.ytp-remote-button', '.ytp-remote-button-container', 'yt-button-shape[aria-label*="Cast"]');
        if (isHiddenOrBack(this.settings.pb_native_autoplay)) hiddenSelectors.push('.ytp-autonav-toggle-button-container', 'button[data-tooltip-target-id="ytp-autonav-toggle-button"]', 'button.ytp-button[aria-label*="Autoplay"]', '.ytp-autonav-toggle-button', '.ytp-autonav-button');
        if (isHiddenOrBack(this.settings.pb_native_cc)) hiddenSelectors.push('.ytp-subtitles-button', '.ytp-subtitles-button-container');
        if (isHiddenOrBack(this.settings.pb_native_miniplayer)) hiddenSelectors.push('.ytp-miniplayer-button', '.ytp-miniplayer-button-container');
        if (isHiddenOrBack(this.settings.pb_native_theater)) hiddenSelectors.push('.ytp-size-button', '.ytp-size-button-container');
        if (isHiddenOrBack(this.settings.pb_native_fullscreen)) hiddenSelectors.push('.ytp-fullscreen-button', '.ytp-fullscreen-button-container');

        if (hiddenSelectors.length > 0) {
            const selectors = hiddenSelectors.map(sel => [
                `html body .html5-video-player ${sel}`,
                `html body.ypp-compact-player-ui .html5-video-player ${sel}`,
                `html body #movie_player .ytp-chrome-controls ${sel}`,
                `html body .html5-video-player .ytp-chrome-controls ${sel}`,
                `html body.ypp-compact-player-ui #movie_player .ytp-chrome-controls ${sel}`,
                `html body.ypp-compact-player-ui .html5-video-player .ytp-chrome-controls ${sel}`,
                `html body.ypp-compact-player-ui .html5-video-player .ytp-left-controls ${sel}`,
                `html body.ypp-compact-player-ui .html5-video-player .ytp-right-controls ${sel}`
            ].join(',\n')).join(',\n');
            styleNode.textContent = `${selectors} { display: none !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important; overflow: hidden !important; }`;
        } else {
            styleNode.textContent = '';
        }
        
        // V2: Auto-hide CSS Framework (Optional clean mode)
        styleNode.textContent += `
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
        `;
    }

    cleanup() {
        this._stopHeartbeat();
        
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._handleDocumentClick) {
            document.removeEventListener('click', this._handleDocumentClick);
            this._handleDocumentClick = null;
        }
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('player-bar-injection');
            window.YPP.sharedObserver.unregister('player-bar-injection-vid');
            window.YPP.sharedObserver.unregister('player-bar-injection-shorts');
            window.YPP.sharedObserver.unregister('player-bar-injection-right');
        }
        document.querySelectorAll('.ypp-player-controls').forEach(controls => controls.remove());
        document.querySelectorAll('.ypp-overflow-menu').forEach(menu => menu.remove());
        this.injectedButtons = false;

        if (this.manager.settingsMenuHelper) {
            this.manager.settingsMenuHelper.cleanupSettingsObserver();
        }
        
        const styleNode = document.getElementById('ypp-player-overrides');
        if (styleNode) styleNode.remove();
        
        // Remove legacy nodes if they exist
        const legacyStyle = document.getElementById('ypp-custom-player-bar-styles');
        if (legacyStyle) legacyStyle.remove();
        const legacyVis = document.getElementById('ypp-custom-player-bar-style-vis');
        if (legacyVis) legacyVis.remove();
    }
};

window.YPP.features.PlayerBarUI = PlayerBarUI;
