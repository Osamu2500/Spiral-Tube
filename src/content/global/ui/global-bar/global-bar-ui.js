import anime from 'animejs/lib/anime.es.js';

/**
 * Global Bar UI
 * Owns: Generating the custom player bar DOM, injecting it over arbitrary <video>
 * tags on external sites, and handling local playback/speed/filter state.
 * Refactored to 1:N architecture (one bar controls ALL tracked videos on the page).
 */



const ICONS = {
    play:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14c0 .89 1.01 1.4 1.73.88l10.49-7c.63-.42.63-1.36 0-1.78L9.73 4.26C9.01 3.74 8 4.25 8 5.14z"/></svg>`,
    pause:      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h2.5c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5H7c-.83 0-1.5-.67-1.5-1.5v-11C5.5 5.67 6.17 5 7 5zm7.5 0H17c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-2.5c-.83 0-1.5-.67-1.5-1.5v-11c0-.83.67-1.5 1.5-1.5z"/></svg>`,
    mute:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
    volumeHigh: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
    loop:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`,
    pip:        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>`,
    fullscreen: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
    close:      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`
};

const BAR_HTML = `
    <div class="ypp-gpb-controls">
        <div class="ypp-gpb-group">
            <button class="ypp-gpb-btn ypp-action-btn ypp-gpb-play-hero" id="ypp-gpb-play" title="Play / Pause">
                ${ICONS.play}
            </button>
            <div id="ypp-gpb-time" class="ypp-gpb-time-capsule" title="Current / Total Time">
                <span class="ypp-gpb-time-cur">0:00</span>
                <span class="ypp-gpb-time-sep"></span>
                <span class="ypp-gpb-time-tot">0:00</span>
            </div>
        </div>

        <div class="ypp-gpb-divider" id="ypp-gpb-div-1"></div>

        <div class="ypp-gpb-group">
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-mute" title="Mute / Unmute">
                ${ICONS.volumeHigh}
            </button>
            <div id="ypp-gpb-vol-wrap" class="ypp-gpb-vol-wrap" title="Volume">
                <input type="range" id="ypp-gpb-vol" min="0" max="1" step="0.02" value="1" class="ypp-gpb-vol-slider">
            </div>
            <button class="ypp-gpb-btn ypp-action-btn ypp-gpb-speed-pill" id="ypp-gpb-speed" title="Video Speed (Scroll to adjust, Click to cycle)">
                <span class="ypp-gpb-speed-value" id="ypp-gpb-speed-text">1.00x</span>
            </button>
        </div>

        <div id="ypp-gpb-features-container" class="ypp-gpb-group" style="display:none;"></div>

        <div class="ypp-gpb-divider" id="ypp-gpb-div-2" style="display:none;"></div>

        <div class="ypp-gpb-group">
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-loop" title="Toggle Loop">
                ${ICONS.loop}
            </button>
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-pip" title="Picture-in-Picture">
                ${ICONS.pip}
            </button>
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-fullscreen" title="Fullscreen">
                ${ICONS.fullscreen}
            </button>
        </div>

        <div class="ypp-gpb-divider" id="ypp-gpb-div-3"></div>

        <div class="ypp-gpb-group">
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-close" title="Hide Bar">
                ${ICONS.close}
            </button>
        </div>
    </div>
`;

export class GlobalBarUI {
    static featureId = 'globalBarUI';
    static executionPhase = 'idle';
    static priority = 999;


    constructor(filters) {
        this.trackedVideos = new Set();
        this.videoVisibility = new Map();
        
        this.filters = filters || window.YPP.features.FilterPresets?.PRESETS || [];
        this.settings = {};
        
        this.barElement = null;
        this._abortController = null;
        
        // Cache primary video to track changes
        this._currentPrimaryVideo = null;

        this._boundUpdateUIState = this.updateUIState.bind(this);
        this._boundHandleIntersection = this._handleIntersection.bind(this);
        this._boundWakeUpBar = this._wakeUpBar.bind(this);
        
        this._intersectionObserver = new IntersectionObserver(this._boundHandleIntersection, {
            threshold: [0, 0.25, 0.5, 0.75, 1.0]
        });
    }

    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.updatePosition();
        this.updateButtonVisibility();
    }

    update(settings) {
        this.updateSettings(settings);
    }

    updateButtonVisibility() {
        if (!this.barElement) return;
        const t = this.settings;
        const b = this.barElement;
        
        const setDisp = (sel, show) => {
            const el = b.querySelector(sel);
            if (el) {
                // Strict check to handle undefined properly (default true) and avoid string "false" trap
                const isVisible = show !== false && show !== 'false' && show !== 0;
                if (isVisible) el.style.removeProperty('display');
                else el.style.setProperty('display', 'none', 'important');
            }
        };

        const primary = this._currentPrimaryVideo || this._getPrimaryVideo();
        
        let capPip = true;
        let capFs = true;
        
        if (primary && primary._capabilities) {
             capPip = primary._capabilities.pip !== false;
             capFs = primary._capabilities.fullscreen !== false;
        } else if (primary && !primary._proxy) {
             capPip = document.pictureInPictureEnabled !== false;
             capFs = document.fullscreenEnabled !== false;
        }

        setDisp('#ypp-gpb-play', t.gpb_showPlay);
        setDisp('#ypp-gpb-time', t.gpb_showTime);
        setDisp('#ypp-gpb-mute', t.gpb_showVolume);
        setDisp('#ypp-gpb-vol-wrap', t.gpb_showVolume);
        setDisp('#ypp-gpb-speed', t.gpb_showSpeed);
        setDisp('#ypp-gpb-loop', t.gpb_showLoop);
        setDisp('#ypp-gpb-pip', t.gpb_showPip !== false && capPip);
        setDisp('#ypp-gpb-fullscreen', t.gpb_showFullscreen !== false && capFs);

        // Update Sub-features (Domain, Vol Booster, Filters)
        if (primary) {
            this._currentPrimaryVideo = null; // Force re-render to apply new visibility settings
            this._syncSubFeatureButtons(primary);
        }

        // Manage visibility of dividers logically based on adjacent groups
        const g1 = (t.gpb_showPlay !== false) || (t.gpb_showTime !== false);
        const g2 = (t.gpb_showVolume !== false) || (t.gpb_showSpeed !== false);
        const featsCont = b.querySelector('#ypp-gpb-features-container');
        const g3 = featsCont ? (featsCont.children.length > 0 && featsCont.style.display !== 'none') : false;
        const g4 = (t.gpb_showLoop !== false) || (t.gpb_showPip !== false) || (t.gpb_showFullscreen !== false);

        setDisp('#ypp-gpb-div-1', g1 && (g2 || g3 || g4));
        setDisp('#ypp-gpb-div-2', g2 && (g3 || g4));
        setDisp('#ypp-gpb-div-3', g3 && g4);

        // Manage visibility of groups logically
        const groups = b.querySelectorAll('.ypp-gpb-group');
        groups.forEach(group => {
            if (group.id === 'ypp-gpb-features-container') return; // Managed by _syncSubFeatureButtons
            if (group) {
                let hasVisible = false;
                Array.from(group.children).forEach(child => {
                    if (child.style.display !== 'none' && !child.classList.contains('ypp-gpb-divider')) {
                        hasVisible = true;
                    }
                });
                if (hasVisible) group.style.removeProperty('display');
                else group.style.setProperty('display', 'none', 'important');
            }
        });
    }

    trackVideo(video) {
        if (this.trackedVideos.has(video)) return;
        
        window.YPP.Utils?.log('Tracking new video for global bar', 'GlobalBarUI', 'debug');
        
        this.trackedVideos.add(video);
        // Proxy videos (from iframe bridge) get default visibility; real elements start at 0
        this.videoVisibility.set(video, video?._proxy ? 0.5 : 0);
        // IntersectionObserver only works on real DOM Elements, not proxy objects
        if (!video?._proxy) {
            this._intersectionObserver.observe(video);
            video.addEventListener('mousemove', this._boundWakeUpBar, { passive: true });
        }

        if (!this.barElement) {
            this.createBar();
        } else {
            this.updateUIState();
        }
    }

    _untrackVideo(video) {
        this.trackedVideos.delete(video);
        this.videoVisibility.delete(video);
        // IntersectionObserver only accepts real DOM Elements
        if (!video?._proxy) {
            this._intersectionObserver.unobserve(video);
            video.removeEventListener('mousemove', this._boundWakeUpBar);
        }

        if (this._currentPrimaryVideo === video) {
            this._currentPrimaryVideo = null;
        }

        if (this.trackedVideos.size === 0) {
            this.removeBar();
        } else {
            this.updateUIState();
        }
    }

    hasVideo(video) {
        return this.trackedVideos.has(video);
    }

    _handleIntersection(entries) {
        let changed = false;
        
        for (const entry of entries) {
            const video = entry.target;
            
            // Auto-remove video if it is completely disconnected from DOM
            if (!video.isConnected) {
                this._untrackVideo(video);
                changed = true;
                continue;
            }

            this.videoVisibility.set(video, entry.intersectionRatio);
            changed = true;
        }

        if (changed && this.barElement) {
            if (this._intersectionThrottle) clearTimeout(this._intersectionThrottle);
            this._intersectionThrottle = setTimeout(() => {
                this.updateUIState();
            }, 100);
        }
    }

    /** Create the singular global player bar DOM */
    createBar() {
        if (this.barElement) return;

        window.YPP.Utils?.log('Creating singular global player bar', 'GlobalBarUI', 'debug');

        const bar = document.createElement('div');
        bar.className = 'ypp-global-player-bar ypp-glass-panel';

        bar.innerHTML = BAR_HTML;

        // Apply visibility settings from preferences
        const t = this.settings;
        if (t.gpb_showPlay === false) bar.querySelector('#ypp-gpb-play').style.setProperty('display', 'none', 'important');
        if (t.gpb_showTime === false) bar.querySelector('#ypp-gpb-time').style.setProperty('display', 'none', 'important');
        if (t.gpb_showVolume === false) {
            bar.querySelector('#ypp-gpb-mute').style.setProperty('display', 'none', 'important');
            bar.querySelector('#ypp-gpb-vol-wrap').style.setProperty('display', 'none', 'important');
        }
        if (t.gpb_showLoop === false) bar.querySelector('#ypp-gpb-loop').style.setProperty('display', 'none', 'important');
        if (t.gpb_showPip === false) bar.querySelector('#ypp-gpb-pip').style.setProperty('display', 'none', 'important');
        if (t.gpb_showFullscreen === false) bar.querySelector('#ypp-gpb-fullscreen').style.setProperty('display', 'none', 'important');
        if (t.gpb_showSpeed === false) bar.querySelector('#ypp-gpb-speed').style.setProperty('display', 'none', 'important');

        this.barElement = bar;
        this.ICONS = ICONS;
        
        // Draggable Logic
        bar.addEventListener('mousedown', (e) => {
            if (e.target.closest('button, input, .ypp-gpb-time-capsule, .ypp-gpb-vol-wrap')) return;
            e.preventDefault();
            
            // Cancel transition during drag for 1:1 movement
            bar.style.transition = 'none';
            const rect = bar.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            // Create iframe shield to prevent iframes from swallowing mouse events
            let shield = document.createElement('div');
            shield.style.cssText = 'position: fixed; inset: 0; z-index: 2147483646; cursor: grabbing;';
            document.body.appendChild(shield);

            const onMouseMove = (moveEvent) => {
                bar.style.left = (moveEvent.clientX - offsetX) + 'px';
                bar.style.top = (moveEvent.clientY - offsetY) + 'px';
                bar.style.right = 'auto';
                bar.style.bottom = 'auto';
                bar.style.transform = 'none';
            };

            const onMouseUp = () => {
                bar.style.transition = ''; // Restore CSS transitions
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (shield) {
                    shield.remove();
                    shield = null;
                }
                
                // Save custom position to localStorage (site-specific)
                try {
                    localStorage.setItem('ypp_gpb_custom_pos', JSON.stringify({
                        left: bar.style.left,
                        top: bar.style.top
                    }));
                } catch(e){}
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        let targetContainer = document.body;
        
        // Use Popover API to escape ALL CSS containment (transforms, overflow: hidden)
        if ('popover' in bar) {
            bar.popover = "manual";
        } else {
            // Graceful degradation for older browsers lacking Popover API support
            bar.style.position = 'fixed';
            bar.style.zIndex = '2147483647';
        }
        
        targetContainer.appendChild(bar);
        
        if ('popover' in bar) {
            try { 
                bar.showPopover(); 
            } catch (e) {
                window.YPP.Utils?.log('showPopover failed, falling back to fixed positioning', 'GlobalBarUI', 'warn');
                bar.removeAttribute('popover');
                bar.style.position = 'fixed';
                bar.style.zIndex = '2147483647';
            }
        }

        // Position AFTER element is in DOM and top-layer (Popover API requires this)
        this.updatePosition();
        // Deferred re-apply: some browsers repaint the popover async
        setTimeout(() => this.updatePosition(), 50);

        this._entranceAnim = anime({
            targets: bar.querySelectorAll('.ypp-gpb-btn, .ypp-gpb-time, .ypp-gpb-vol-wrap'),
            translateY: [-12, 0],
            opacity: [0, 1],
            delay: anime.stagger(40, { start: 100 }),
            easing: 'spring(1, 80, 10, 0)',
            duration: 600,
        });

        this._abortController = new AbortController();
        const signal = this._abortController.signal;
        
        // Bind video events globally to capture them before YouTube swallows them
        document.addEventListener('play', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('pause', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('volumechange', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('ratechange', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('timeupdate', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('fullscreenchange', this._boundUpdateUIState, { signal });

        this._bindEvents(signal);
        
        // Initial state sync
        this.updateUIState();
        this._applyAdaptiveTheme();
    }

    _applyAdaptiveTheme() {
        if (!this.barElement) return;
        
        let isLight = false;
        
        // 1. Check meta theme-color
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta && themeMeta.content) {
            const color = themeMeta.content.toLowerCase();
            if (color === '#fff' || color === '#ffffff' || color === 'white') {
                isLight = true;
            }
        }
        
        // 2. Fallback to body background color calculation
        if (!isLight) {
            const bg = window.getComputedStyle(document.body).backgroundColor;
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
                // Luma calculation
                const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                if (luma > 200) {
                    isLight = true;
                }
            }
        }
        
        if (isLight) {
            this.barElement.classList.add('ypp-theme-light');
        } else {
            this.barElement.classList.remove('ypp-theme-light');
        }
    }

    /** Remove the global bar and clear tracked videos. */
    removeAll() {
        // Create an array to iterate over safely while modifying the set
        const videos = Array.from(this.trackedVideos);
        videos.forEach(v => this._untrackVideo(v));
        this.removeBar();
    }
    
    removeBar() {
        if (this._entranceAnim) {
            this._entranceAnim.pause();
            this._entranceAnim = null;
        }
        if (this._abortController) {
            this._abortController.abort();
            this._abortController = null;
        }
        if (this.barElement) {
            this.barElement.remove();
            this.barElement = null;
        }
        this._currentPrimaryVideo = null;
    }

    /** Position the singular bar. */
    updatePosition() {
        if (!this.barElement) return;

        const pos = this.settings.globalPlayerBarPosition || 'right';
        const bar = this.barElement;
        
        bar.classList.remove('ypp-bar-pos-right', 'ypp-bar-pos-left', 'ypp-bar-pos-top');
        bar.classList.add(`ypp-bar-pos-${pos}`);

        const setStyle = (prop, val) => bar.style.setProperty(prop, val, 'important');

        setStyle('position', 'fixed');
        setStyle('z-index', '2147483647');
        setStyle('display', 'flex');
        setStyle('visibility', 'visible');
        
        let customPos = null;
        try {
            const lastSetting = localStorage.getItem('ypp_gpb_pos_setting');
            if (lastSetting && lastSetting !== pos) {
                // User changed setting in popup! Wipe custom drag position
                localStorage.removeItem('ypp_gpb_custom_pos');
            }
            localStorage.setItem('ypp_gpb_pos_setting', pos);

            const saved = localStorage.getItem('ypp_gpb_custom_pos');
            if (saved) customPos = JSON.parse(saved);
        } catch(e) {}

        if (customPos && customPos.left && customPos.top) {
            setStyle('left', customPos.left);
            setStyle('top', customPos.top);
            setStyle('right', 'auto');
            setStyle('bottom', 'auto');
            setStyle('transform', 'none');
        } else if (pos === 'top') {
            setStyle('top', '16px');
            setStyle('bottom', 'auto');
            setStyle('left', '50%');
            setStyle('right', 'auto');
            setStyle('transform', 'translateX(-50%)');
        } else if (pos === 'left') {
            setStyle('left', '16px');
            setStyle('right', 'auto');
            setStyle('top', '50%');
            setStyle('bottom', 'auto');
            setStyle('transform', 'translateY(-50%)');
        } else {
            setStyle('right', '16px');
            setStyle('left', 'auto');
            setStyle('top', '50%');
            setStyle('bottom', 'auto');
            setStyle('transform', 'translateY(-50%)');
        }
    }

    // =========================================================================
    // UI SYNC
    // =========================================================================

    /** 
     * Get the "primary" video to reflect in the UI and apply targeted actions (Play/PiP).
     * Uses O(1) lookup based on IntersectionObserver results.
     */
    _getPrimaryVideo() {
        if (this.trackedVideos.size === 0) return null;
        
        let bestVideo = null;
        let maxScore = -1;
        
        for (const [video, ratio] of this.videoVisibility.entries()) {
            const area = (video.offsetWidth || 0) * (video.offsetHeight || 0);
            
            // Ignore tiny/hidden tracking pixels if there are other visible videos
            if (area < 10 && !video._proxy && this.trackedVideos.size > 1) continue;

            let score = ratio * 1000 + area; // base score combining visibility and size
            if (!video.paused) score += 1000000; // huge bonus for playing
            if (!video.muted && video.volume > 0) score += 500000; // bonus for sound

            if (score > maxScore) {
                maxScore = score;
                bestVideo = video;
            }
        }
        
        return bestVideo || this.trackedVideos.values().next().value;
    }

    /** Updates the bar's UI to reflect the primary video's state. */
    updateUIState() {
        if (!this.barElement) return;

        // 1. SPA Survival: If the website replaced the body, our bar is orphaned. Re-inject it.
        if (!this.barElement.isConnected) {
            window.YPP.Utils?.log('Global Player Bar was orphaned by SPA. Re-injecting.', 'GlobalBarUI', 'warn');
            document.body.appendChild(this.barElement);
            if ('popover' in this.barElement && !this.barElement.matches(':popover-open')) {
                try { this.barElement.showPopover(); } catch(e){}
            }
        }
        
        const primary = this._getPrimaryVideo();
        if (!primary) return;

        this._syncSubFeatureButtons(primary);

        // Initialize state cache if it doesn't exist
        this._uiStateCache = this._uiStateCache || {};

        let isAllMuted = true;
        for (const v of this.trackedVideos) {
            if (!v.muted && v.volume > 0) isAllMuted = false;
        }

        // Play/Pause
        const playBtn = this.barElement.querySelector('#ypp-gpb-play');
        const isPaused = primary.paused;
        if (playBtn && this._uiStateCache.paused !== isPaused) {
            playBtn.innerHTML = !isPaused ? this.ICONS.pause : this.ICONS.play;
            this._uiStateCache.paused = isPaused;
        }

        // Mute & Volume
        const muteBtn = this.barElement.querySelector('#ypp-gpb-mute');
        const volSlider = this.barElement.querySelector('#ypp-gpb-vol');
        if (muteBtn && volSlider) {
            if (this._uiStateCache.allMuted !== isAllMuted) {
                muteBtn.innerHTML = isAllMuted ? this.ICONS.mute : this.ICONS.volumeHigh;
                muteBtn.classList.toggle('active', isAllMuted);
                this._uiStateCache.allMuted = isAllMuted;
            }
            const primaryVol = primary.muted ? 0 : primary.volume;
            if (this._uiStateCache.volume !== primaryVol) {
                volSlider.value = primaryVol;
                this._uiStateCache.volume = primaryVol;
            }
        }

        // Time
        const timeEl = this.barElement.querySelector('#ypp-gpb-time');
        if (timeEl) {
            const formatTime = (s) => {
                if (!s || isNaN(s) || s < 0) return "0:00";
                const h = Math.floor(s / 3600);
                const m = Math.floor((s % 3600) / 60);
                const sec = Math.floor(s % 60).toString().padStart(2, '0');
                if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec}`;
                return `${m}:${sec}`;
            };
            
            const isLive = primary.duration === Infinity || isNaN(primary.duration) || primary.duration === 0;
            const curStr = formatTime(primary.currentTime);
            const totStr = isLive ? "LIVE" : formatTime(primary.duration);
            
            if (this._uiStateCache.curStr !== curStr || this._uiStateCache.totStr !== totStr) {
                const curSpan = timeEl.querySelector('.ypp-gpb-time-cur');
                const totSpan = timeEl.querySelector('.ypp-gpb-time-tot');
                if (curSpan) curSpan.textContent = curStr;
                if (totSpan) totSpan.textContent = totStr;
                this._uiStateCache.curStr = curStr;
                this._uiStateCache.totStr = totStr;
            }

            let tooltipStr = `${curStr} / ${totStr}`;
            if (this.settings.enableRemainingTime !== false && primary.duration && !isNaN(primary.duration)) {
                const speed = primary.playbackRate || 1;
                const rawLeft = Math.max(0, primary.duration - primary.currentTime);
                const adjustedLeft = rawLeft / speed;
                
                if (rawLeft > 0) {
                    if (Math.abs(speed - 1) <= 0.01) {
                        tooltipStr += `\nRemaining: -${formatTime(rawLeft)}`;
                    } else if (speed > 1) {
                        const totalSaved = primary.duration - (primary.duration / speed);
                        tooltipStr += `\nRemaining: -${formatTime(adjustedLeft)} (${formatTime(totalSaved)} saved at ${speed}x)`;
                    } else {
                        const totalExtra = (primary.duration / speed) - primary.duration;
                        tooltipStr += `\nRemaining: -${formatTime(adjustedLeft)} (${formatTime(totalExtra)} extra at ${speed}x)`;
                    }
                }
            }
            if (this._uiStateCache.timeTitle !== tooltipStr) {
                timeEl.title = tooltipStr;
                this._uiStateCache.timeTitle = tooltipStr;
            }
        }
        
        // Speed
        const speedBtn = this.barElement.querySelector('#ypp-gpb-speed');
        const speedText = this.barElement.querySelector('#ypp-gpb-speed-text');
        if (speedText) {
            const rate = primary.playbackRate || 1;
            if (this._uiStateCache.speed !== rate) {
                speedText.textContent = rate.toFixed(2) + 'x';
                if (speedBtn) {
                    speedBtn.classList.toggle('active-speed', Math.abs(rate - 1.0) > 0.01);
                }
                this._uiStateCache.speed = rate;
            }
        }

        // Loop
        const loopBtn = this.barElement.querySelector('#ypp-gpb-loop');
        if (loopBtn && this._uiStateCache.loop !== primary.loop) {
            loopBtn.classList.toggle('active', primary.loop);
            loopBtn.style.opacity = primary.loop ? '1' : '0.5';
            this._uiStateCache.loop = primary.loop;
        }

        // Fullscreen
        let isFs = !!document.fullscreenElement;
        
        if (!isFs) {
            for (const v of this.trackedVideos) {
                if (v.isConnected) {
                    if (v.getBoundingClientRect) {
                        const rect = v.getBoundingClientRect();
                        // Fake fullscreen detection: video takes up >98% of the viewport
                        if (rect.width >= window.innerWidth * 0.98 && rect.height >= window.innerHeight * 0.98) {
                            isFs = true;
                            break;
                        }
                    } else if (v._proxy && v._capabilities) {
                        // If it's a proxy, we rely on document.fullscreenElement (checked above)
                        // Or if the iframe passes a specific fullscreen flag in the future
                        if (v._capabilities.isFullscreen) {
                            isFs = true;
                            break;
                        }
                    }
                }
            }
        }
        
        if (this._uiStateCache.fullscreen !== isFs) {
            const fullscreenBtn = this.barElement.querySelector('#ypp-gpb-fullscreen');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = isFs
                    ? `<svg viewBox="0 0 36 36" fill="currentColor"><path d="m 5.390625,8 v 18.179687 h 25.21875 V 8 Z m 2.019531,2.009765 H 28.589844 V 24.169922 H 7.410156 Z M 19.45325,22.331983 h 1.762511 V 19.688214 H 23.85953 V 17.925702 H 19.45325 Z M 14.784019,14.491472 H 12.14025 v 1.762512 h 4.406281 v -4.40628 h -1.762512 z m 0,5.196743 H 12.14025 v -1.762512 h 4.406281 v 4.40628 h -1.762512 z m 4.669231,-7.840512 h 1.762511 v 2.643769 h 2.643769 v 1.762512 h -4.40628 z"/></svg>`
                    : this.ICONS.fullscreen;
            }
            this._uiStateCache.fullscreen = isFs;
        }

        const hasValidSrc = primary._proxy ? true : !!(primary.src || primary.currentSrc || primary.srcObject || (primary.querySelector && primary.querySelector('source')));
        const isActive = !primary.ended && hasValidSrc;
        const shouldHideBar = isFs || !isActive;

        // If the video is paused, force the bar to wake up from idle
        if (primary.paused) {
            this.barElement.style.opacity = '1';
            this.barElement.classList.remove('ypp-gpb-idle');
        }

        if (this._uiStateCache.shouldHideBar !== shouldHideBar) {
            if (shouldHideBar) {
                this.barElement.style.setProperty('opacity', '0', 'important');
                this.barElement.style.setProperty('pointer-events', 'none', 'important');
            } else {
                this.barElement.style.removeProperty('pointer-events');
                // The idle timer handles opacity when it's not explicitly hidden
                this.barElement.style.opacity = this.barElement.classList.contains('ypp-gpb-idle') ? '0' : '1';
            }
            this._uiStateCache.shouldHideBar = shouldHideBar;
        }
    }

    /**
     * Dynamically renders sub-feature buttons if the primary video changes.
     * Fixes stale bindings where volume/filters applied to off-screen videos.
     */
    _syncSubFeatureButtons(primary) {
        if (this._currentPrimaryVideo === primary) return;
        this._currentPrimaryVideo = primary;

        const featsCont = this.barElement.querySelector('#ypp-gpb-features-container');
        if (!featsCont || !window.YPP.featureManager) return;

        featsCont.innerHTML = ''; // Clear stale buttons

        if (this.settings.gpb_showVolumeBoost !== false) {
            const volFeature = window.YPP.featureManager.getFeature('volumeBoost');
            if (volFeature?.createButton) {
                featsCont.appendChild(volFeature.createButton(primary));
            }
        }
        
        if (this.settings.gpb_showFilters !== false) {
            const filterFeature = window.YPP.featureManager.getFeature('videoFilters');
            if (filterFeature?.createButton) {
                featsCont.appendChild(filterFeature.createButton(primary));
            }
        }

        if (this.settings.gpb_showDomainMemory !== false) {
            const domainFeature = window.YPP.featureManager.getFeature('domainMemory');
            if (domainFeature?.createButton) {
                featsCont.appendChild(domainFeature.createButton(primary));
            }
        }

        // Hide container if empty to avoid double dividers
        if (featsCont.children.length === 0) {
            featsCont.style.display = 'none';
        } else {
            featsCont.style.display = 'flex';
        }
    }

    // =========================================================================
    // EVENT BINDINGS
    // =========================================================================

    _bindEvents(signal) {
        this._bindPlaybackControls();
        this._bindVolumeControls();
        this._bindSpeedControls();
        this._bindWindowControls();
        this._bindKeyboardControls(signal);
        this._setupIdleTimer(signal);
    }

    _bindKeyboardControls(signal) {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            
            const primary = this._getPrimaryVideo();
            if (!primary) return;

            // Isolation: Only intercept if focused on body/html or the video itself
            if (e.target.tagName !== 'BODY' && e.target.tagName !== 'HTML' && e.target !== primary) return;

            switch (e.code) {
                case 'Space':
                    // Many sites already handle Space, so only prevent if we are sure it's not handled.
                    // Actually, if we prevent default it stops page scrolling.
                    e.preventDefault();
                    if (primary.paused) primary.play().catch(()=>{});
                    else primary.pause();
                    this.updateUIState();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    const willMute = !primary.muted;
                    for (const v of this.trackedVideos) v.muted = willMute;
                    this.updateUIState();
                    break;
                case 'KeyF':
                    e.preventDefault();
                    try {
                        if (document.fullscreenElement) document.exitFullscreen();
                        else primary.requestFullscreen();
                    } catch (_) {}
                    break;
            }
        }, { signal });
    }

    _wakeUpBar(e) {
        if (e && e.type === 'mousemove') {
            if (e.movementX === 0 && e.movementY === 0) return;
        }
        
        // Do not wake up the bar if it's explicitly hidden (e.g. fullscreen)
        if (this._uiStateCache && this._uiStateCache.shouldHideBar) return;

        const bar = this.barElement;
        if (!bar) return;

        bar.style.opacity = '1';
        bar.classList.remove('ypp-gpb-idle');
        clearTimeout(this._idleTimeout);
        
        this._idleTimeout = setTimeout(() => {
            const primary = this._getPrimaryVideo();
            // Only hide if a video is actually playing and we aren't hovering the bar
            if (primary && !primary.paused && !bar.matches(':hover')) {
                bar.style.opacity = '0';
                bar.classList.add('ypp-gpb-idle');
            }
        }, 2500);
    }

    _setupIdleTimer(signal) {
        const bar = this.barElement;
        if (!bar) return;

        // Ensure transition is set for smooth fading
        bar.style.transition = 'opacity 0.3s ease';

        bar.addEventListener('mousemove', this._boundWakeUpBar, { signal, passive: true });
        bar.addEventListener('mouseenter', this._boundWakeUpBar, { signal });
        bar.addEventListener('mouseleave', this._boundWakeUpBar, { signal });
        
        window.addEventListener('message', (e) => {
            if (e.data?.ypp && e.data.type === 'iframe-mousemove') this._boundWakeUpBar();
        }, { signal });
        
        // Initial timer start
        this._boundWakeUpBar();
    }

    _bindPlaybackControls() {
        const bar = this.barElement;
        
        const playBtn = bar.querySelector('#ypp-gpb-play');
        playBtn.onclick = (e) => { 
            e.stopPropagation(); 
            const primary = this._getPrimaryVideo();
            if (!primary) return;
            
            if (primary.paused) {
                primary.play().catch(err => window.YPP.Utils?.log('Play prevented: ' + err.message, 'GlobalBarUI', 'debug'));
            } else {
                primary.pause();
            }
            this.updateUIState();
        };

        const loopBtn = bar.querySelector('#ypp-gpb-loop');
        loopBtn.onclick = (e) => { 
            e.stopPropagation(); 
            const primary = this._getPrimaryVideo();
            if (!primary) return;
            
            primary.loop = !primary.loop;
            this.updateUIState();
        };
    }

    _bindVolumeControls() {
        const bar = this.barElement;

        const muteBtn = bar.querySelector('#ypp-gpb-mute');
        muteBtn.onclick = (e) => { 
            e.stopPropagation();
            let isAllMuted = true;
            for (const v of this.trackedVideos) {
                if (!v.muted && v.volume > 0) isAllMuted = false;
            }
            for (const v of this.trackedVideos) {
                v.muted = !isAllMuted;
            }
            this.updateUIState();
        };

        const volSlider = bar.querySelector('#ypp-gpb-vol');
        volSlider.oninput = (e) => {
            e.stopPropagation();
            const val = parseFloat(e.target.value);
            for (const v of this.trackedVideos) {
                v.volume = val;
                v.muted = val === 0;
            }
            this.updateUIState();
        };
    }

    _bindSpeedControls() {
        const bar = this.barElement;
        const speedBtn = bar.querySelector('#ypp-gpb-speed');
        if (!speedBtn) return;
        
        speedBtn.onclick = (e) => {
            e.stopPropagation();
            const primary = this._getPrimaryVideo();
            if (!primary) return;
            // Basic cycle logic: 1.0 -> 1.5 -> 2.0 -> 1.0
            const current = primary.playbackRate;
            let next = 1.0;
            if (current < 1.5) next = 1.5;
            else if (current < 2.0) next = 2.0;
            else next = 1.0;
            
            for (const v of this.trackedVideos) {
                v.playbackRate = next;
            }
            this.updateUIState();
            // Bug 7 fix: notify domain memory to persist the speed change
            window.YPP?.featureManager?.getFeature?.('domainMemory')?.recordChange?.('speed');
        };

        speedBtn.onwheel = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const primary = this._getPrimaryVideo();
            if (!primary) return;
            
            // Adjust speed by 0.05
            const delta = Math.sign(e.deltaY) * -0.05;
            let next = Math.max(0.1, Math.min(16.0, primary.playbackRate + delta));
            next = Math.round(next * 100) / 100; // Snap to 2 decimals
            
            for (const v of this.trackedVideos) {
                v.playbackRate = next;
            }
            this.updateUIState();
            // Bug 7 fix: notify domain memory to persist the speed change (debounced)
            window.YPP?.featureManager?.getFeature?.('domainMemory')?.recordChange?.('speed');
        };
    }

    _bindWindowControls() {
        const bar = this.barElement;

        const pipBtn = bar.querySelector('#ypp-gpb-pip');
        pipBtn.onclick = async (e) => {
            e.stopPropagation();
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    const primary = this._getPrimaryVideo();
                    if (primary) await primary.requestPictureInPicture();
                }
            } catch (_) {}
        };

        const fullscreenBtn = bar.querySelector('#ypp-gpb-fullscreen');
        fullscreenBtn.onclick = (e) => {
            e.stopPropagation();
            try {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    const primary = this._getPrimaryVideo();
                    if (primary) primary.requestFullscreen();
                }
            } catch (_) {}
        };

        const closeBtn = bar.querySelector('#ypp-gpb-close');
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            if (this.onDismiss) this.onDismiss();
            this.removeAll();
        };
    }
};

window.YPP.features.GlobalBarUI = GlobalBarUI;
