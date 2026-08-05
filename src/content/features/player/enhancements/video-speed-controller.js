// f:\Youtube 2.0\src\content\features\player\enhancements\video-speed-controller.js
import './video-speed-controller.css';




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
                script.src = chrome.runtime.getURL('src/content/features/player/enhancements/vsc-page-script.js');
                (document.head || document.documentElement).appendChild(script);
            }
        }
        
        // Scan and observe using centralized engine
        const selector = this.settings?.vscAudioSupport ? 'video, audio' : 'video';
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('video-speed-controller', selector, (elements) => {
                elements.forEach(node => {
                    if (node.tagName === 'VIDEO' || (this.settings?.vscAudioSupport && node.tagName === 'AUDIO')) {
                        this.attachToVideo(node);
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

        // Global keyboard shortcuts are now handled via registerShortcuts()
        this.registerShortcuts();

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

        if (window.YPP.hotkeysManager) {
            window.YPP.hotkeysManager.unregister('vsc');
        } else if (this._localHotkeyListener) {
            this.removeListener(document, 'keydown', this._localHotkeyListener, true);
            this._localHotkeyListener = null;
        }

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
        if (window.YPP.hotkeysManager) {
            window.YPP.hotkeysManager.unregister('vsc');
        }
        this.registerShortcuts();
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
            this.attachToVideo(node);
        });
    }

    attachToVideo(video) {
        if (this.controllers.has(video)) return;
        if (!video.isConnected) return;
        if (video.hasAttribute('data-ypp-vsc-attached')) return;
        video.setAttribute('data-ypp-vsc-attached', 'true');

        this.utils?.log('Attaching VSC to video', 'VSC');

        const controller = document.createElement('ypp-vsc-controller');
        
        // Inject CSS natively into the document head
        const styleId = 'ypp-vsc-style';
        if (!document.getElementById(styleId)) {
            const link = document.createElement('link');
            link.id = styleId;
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL('src/content/features/player/enhancements/video-speed-controller.css');
            document.head.appendChild(link);
        }

        // UI Container
        const container = document.createElement('div');
        container.className = 'ypp-vsc-panel';
        
        // Elements
        const display = document.createElement('span');
        display.className = 'ypp-vsc-speed-display'; // Fix class name to match CSS!
        display.textContent = '1.00';

        const ICONS = {
            rewind: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>`,
            slower: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 13H5v-2h14v2z"/></svg>`,
            faster: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
            advance: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>`,
            close: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>`
        };

        const formatKey = (key) => key ? key.replace('Shift+', '⇧') : '';
        const step = this.settings?.vscSpeedStep ?? 0.25;

        const getShortcutKey = (action) => {
            const sc = this.getShortcuts().find(s => s.action === action);
            return sc ? sc.key : '';
        };

        const btnRewind = this.createButton(ICONS.rewind, `Rewind 10s (${formatKey(getShortcutKey('rewind'))})`, () => { video.currentTime -= 10; });
        const btnSlower = this.createButton(ICONS.slower, `Slower -${step}x (${formatKey(getShortcutKey('decrease'))})`, () => this.adjustSpeed(video, -step));
        const btnFaster = this.createButton(ICONS.faster, `Faster +${step}x (${formatKey(getShortcutKey('increase'))})`, () => this.adjustSpeed(video, step));
        const btnAdvance = this.createButton(ICONS.advance, `Advance 10s (${formatKey(getShortcutKey('advance'))})`, () => { video.currentTime += 10; });
        const btnClose = this.createButton(ICONS.close, `Hide Controller (${formatKey(getShortcutKey('showHide'))})`, () => { controller.style.display = 'none'; });
        btnClose.classList.add('ypp-vsc-close');

        // Assemble
        container.appendChild(display);
        container.appendChild(btnRewind);
        container.appendChild(btnSlower);
        container.appendChild(btnFaster);
        container.appendChild(btnAdvance);
        container.appendChild(btnClose);
        
        // Apply Opacity
        const opacity = this.settings?.vscControllerOpacity ?? 0.3;
        container.style.opacity = opacity;
        // Increase opacity on hover
        this.addListener(container, 'mouseenter', () => container.style.opacity = '1');
        this.addListener(container, 'mouseleave', () => container.style.opacity = opacity);

        controller.appendChild(container);

        // Generate unique class name for this video's controller (instead of anchorName)
        const controllerClass = `ypp-vsc-${Math.random().toString(36).substr(2, 9)}`;
        controller.classList.add(controllerClass);
        
        // Ensure absolute positioning
        controller.style.position = 'absolute';
        controller.style.zIndex = '9999999';

        // Append to parent element so it naturally flows with fullscreen video
        const parent = video.parentElement || document.body;
        parent.insertBefore(controller, video.nextSibling || video);
        
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let startX, startY;

        const updateTransform = () => {
            controller.style.setProperty('--ypp-vsc-x', `${translateX}px`);
            controller.style.setProperty('--ypp-vsc-y', `${translateY}px`);
        };

        this.addListener(display, 'mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            e.preventDefault(); // prevent text selection
            controller.style.transition = 'none'; // Disable transition during drag
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                controller.style.transition = ''; // Restore CSS transitions
            }
        };

        this.addListener(window, 'mousemove', onMouseMove);
        this.addListener(window, 'mouseup', onMouseUp);

        // Store state
        this.controllers.set(video, {
            element: controller,
            display: display,
            manualHide: false,
            hideTimeout: null,
            fightbackCount: 0,
            fightbackTimer: null,
            lastInteraction: 0,
            cleanup: () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            }
        });

        // Initialize speed from memory
        const savedSpeed = (this.settings.vscRememberSpeed !== false && this.settings.vscLastSpeed) ? this.settings.vscLastSpeed : 1.0;
        if (savedSpeed !== 1.0) {
            this.setSpeed(video, savedSpeed);
        }

        // Event Listeners for UI state
        this.addListener(video, 'ratechange', (e) => this.handleRateChange(video, e));

        const triggerShow = () => {
            if (this.settings?.vscHideController) return;
            this.showController(video);
            this.hideControllerDelay(video);
        };

        // UI auto-hide logic for external websites
        this.addListener(video, 'play', () => {
            this._lastActiveVideo = video;
            triggerShow();
        });
        this.addListener(video, 'pause', triggerShow);
        
        // Listen to document for mouse events because video players often have complex overlays
        // In iframes, moving the mouse anywhere should reveal the controls.
        // Listen to the video container instead of document to prevent UI showing when reading other parts of the site
        const container = video.parentElement || video;
        if (container) {
            this.addListener(container, 'mousemove', triggerShow);
            this.addListener(container, 'click', () => { 
                this._lastActiveVideo = video; 
                triggerShow();
            });
        }
        
        // Also listen to the controller itself so it doesn't hide while hovered
        this.addListener(controller, 'mouseenter', () => {
            this.showController(video);
            if (this.controllers.has(video)) {
                const state = this.controllers.get(video);
                if (state.hideTimeout) {
                    clearTimeout(state.hideTimeout);
                    state.hideTimeout = null;
                }
            }
        });
        this.addListener(controller, 'mouseleave', () => this.hideControllerDelay(video));

        if (this.settings?.vscHideController) {
            controller.style.display = 'none';
            controller.classList.add('ypp-vsc-hidden');
        } else {
            this.hideControllerDelay(video);
        }
    }

    createButton(html, title, onClick) {
        const btn = document.createElement('button');
        btn.className = 'ypp-vsc-btn';
        btn.innerHTML = html;
        btn.title = title;
        this.addListener(btn, 'pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        });
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        btn.onmousedown = (e) => e.stopPropagation();
        return btn;
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

    showOSDFlash(video, text) {
        const state = this.controllers.get(video);
        if (!state) return;

        let osd = video.parentElement.querySelector('.ypp-vsc-osd');
        if (!osd) {
            osd = document.createElement('div');
            osd.className = 'ypp-vsc-osd';
            video.parentElement.insertBefore(osd, video.nextSibling || video);
        }

        osd.textContent = text;
        
        // Retrigger animation
        osd.classList.remove('ypp-vsc-osd-show');
        void osd.offsetWidth; // trigger reflow
        osd.classList.add('ypp-vsc-osd-show');
        
        if (state.osdTimeout) clearTimeout(state.osdTimeout);
        state.osdTimeout = setTimeout(() => {
            osd.classList.remove('ypp-vsc-osd-show');
        }, 800);
    }

    showController(video) {
        const state = this.controllers.get(video);
        if (!state) return;

        if (state.hideTimeout) {
            clearTimeout(state.hideTimeout);
            state.hideTimeout = null;
        }

        state.element.classList.remove('ypp-vsc-hidden');
        state.element.style.display = ''; // Reset display in case it was closed
    }

    hideControllerDelay(video) {
        // If inside a YouTube player, let native .ytp-autohide handle it
        if (video.closest('.html5-video-player')) return;

        const state = this.controllers.get(video);
        if (!state) return;

        if (state.hideTimeout) clearTimeout(state.hideTimeout);
        state.hideTimeout = setTimeout(() => {
            state.element.classList.add('ypp-vsc-hidden');
        }, 2500);
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
        this.showController(video);
        this.hideControllerDelay(video);

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
        this.showOSDFlash(video, newSpeed.toFixed(2) + 'x');
    }

    _debouncedSaveSpeed(speed) {
        if (this._saveSpeedTimeout) clearTimeout(this._saveSpeedTimeout);
        this._saveSpeedTimeout = setTimeout(() => {
            if (this.settings?.vscRememberSpeed !== false && window.YPP.StorageManager) {
                chrome.runtime.sendMessage({ action: 'PATCH_SETTINGS', payload: { vscLastSpeed: speed } }, () => {});
            }
        }, 500);
    }

    getShortcuts() {
        if (!this.settings) return [];
        // Only return defaults if the user has literally NEVER touched the settings (undefined).
        // If it's an empty array `[]`, it means they explicitly deleted all shortcuts, so respect that.
        if (this.settings.vscShortcuts === undefined) {
            return [
                { action: 'decrease', key: 'Z', value: 0.25 },
                { action: 'increase', key: 'X', value: 0.25 },
                { action: 'rewind', key: 'S', value: 10 },
                { action: 'advance', key: 'D', value: 10 },
                { action: 'reset', key: 'R', value: 1.0 },
                { action: 'showHide', key: 'V', value: 0 }
            ];
        }
        return this.settings.vscShortcuts || [];
    }

    registerShortcuts() {
        const shortcuts = this.getShortcuts();
        if (!shortcuts || shortcuts.length === 0) return;

        const bindings = [];
        for (const sc of shortcuts) {
            if (!sc.key) continue;
            bindings.push({
                combo: sc.key,
                callback: (e) => {
                    // Prevent hijacking shortcuts when typing in search box or comments (Shadow DOM support)
                    const path = e.composedPath ? e.composedPath() : (e.path || [e.target]);
                    for (const node of path) {
                        if (node && node.tagName) {
                            const tag = node.tagName.toUpperCase();
                            if (tag === 'INPUT' || tag === 'TEXTAREA' || node.isContentEditable) {
                                return;
                            }
                        }
                    }
                    if (window.YPP.utils?.isInputFocused?.()) {
                        return;
                    }

                    let video = this._lastActiveVideo;
                    if (!video || !video.isConnected) {
                        video = this.findLargestVideo();
                    }
                    if (!video) return;

                    if (!this.controllers.has(video)) {
                        this.attachToVideo(video);
                    }

                    const state = this.controllers.get(video);
                    if (state) state.lastInteraction = Date.now();

                    const val = parseFloat(sc.value) || 0;
                    switch (sc.action) {
                        case 'showHide':
                            const controllerEl = video.parentElement?.querySelector('ypp-vsc-controller');
                            if (controllerEl) {
                                controllerEl.style.display = controllerEl.style.display === 'none' ? 'block' : 'none';
                            }
                            break;
                        case 'decrease':
                            this.adjustSpeed(video, -val);
                            break;
                        case 'increase':
                            this.adjustSpeed(video, val);
                            break;
                        case 'rewind':
                            video.currentTime -= val;
                            break;
                        case 'advance':
                            video.currentTime += val;
                            break;
                        case 'reset':
                        case 'preferred':
                            this.setSpeed(video, val);
                            this.showOSDFlash(video, val.toFixed(2) + 'x');
                            break;
                        case 'mute':
                            video.muted = !video.muted;
                            break;
                        case 'decreaseVolume':
                            video.volume = Math.max(0, video.volume - 0.1);
                            break;
                        case 'increaseVolume':
                            video.volume = Math.min(1, video.volume + 0.1);
                            break;
                        case 'pause':
                            if (video.paused) video.play();
                            else video.pause();
                            break;
                        case 'setMarker':
                            this.markers.set(video, video.currentTime);
                            break;
                        case 'jumpMarker':
                            if (this.markers.has(video)) {
                                video.currentTime = this.markers.get(video);
                            }
                            break;
                    }

                    this.showController(video);
                    this.hideControllerDelay(video);
                }
            });
        }
        if (window.YPP.hotkeysManager) {
            window.YPP.hotkeysManager.register('vsc', bindings);
        } else {
            // Local fallback for external sites where hotkeysManager is not loaded
            if (this._localHotkeyListener) {
                this.removeListener(document, 'keydown', this._localHotkeyListener, true);
            }
            this._localHotkeyListener = (e) => {
                // Prevent hijacking shortcuts when typing in search box or comments
                const path = e.composedPath ? e.composedPath() : (e.path || [e.target]);
                for (const node of path) {
                    if (node && node.tagName) {
                        const tag = node.tagName.toUpperCase();
                        if (tag === 'INPUT' || tag === 'TEXTAREA' || node.isContentEditable) {
                            return;
                        }
                    }
                }
                if (window.YPP.utils?.isInputFocused?.()) {
                    return;
                }

                const key = e.key.toUpperCase();
                const combo = (e.shiftKey ? 'SHIFT+' : '') + key;
                const binding = bindings.find(b => b.combo.toUpperCase() === combo);
                if (binding) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    binding.callback(e);
                }
            };
            this.addListener(document, 'keydown', this._localHotkeyListener, true);
        }
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
};

window.YPP.features.VideoSpeedController = VideoSpeedController;
