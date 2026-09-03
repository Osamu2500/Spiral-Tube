import anime from 'animejs/lib/anime.es.js';
import { ICONS, BAR_HTML } from './global-bar-icons.js';
import { makeDraggable } from './global-bar-draggable.js';
import { bindEvents, wakeUpBar } from './global-bar-events.js';
import { updateUIState, syncSubFeatureButtons } from './global-bar-state.js';

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

        this._boundUpdateUIState = () => this.updateUIState();
        this._boundHandleIntersection = this._handleIntersection.bind(this);
        this._boundWakeUpBar = (e) => wakeUpBar(this, e);
        
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

    get ICONS() {
        return ICONS;
    }

    updateButtonVisibility() {
        if (!this.barElement) return;
        const t = this.settings;
        const b = this.barElement;
        
        const setDisp = (sel, show) => {
            const el = b.querySelector(sel);
            if (el) {
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

        if (primary) {
            this._currentPrimaryVideo = null;
            syncSubFeatureButtons(this, primary);
        }

        const g1 = (t.gpb_showPlay !== false) || (t.gpb_showTime !== false);
        const g2 = (t.gpb_showVolume !== false) || (t.gpb_showSpeed !== false);
        const featsCont = b.querySelector('#ypp-gpb-features-container');
        const g3 = featsCont ? (featsCont.children.length > 0 && featsCont.style.display !== 'none') : false;
        const g4 = (t.gpb_showLoop !== false) || (t.gpb_showPip !== false) || (t.gpb_showFullscreen !== false);

        setDisp('#ypp-gpb-div-1', g1 && (g2 || g3 || g4));
        setDisp('#ypp-gpb-div-2', g2 && (g3 || g4));
        setDisp('#ypp-gpb-div-3', g3 && g4);

        const groups = b.querySelectorAll('.ypp-gpb-group');
        groups.forEach(group => {
            if (group.id === 'ypp-gpb-features-container') return;
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
        this.videoVisibility.set(video, video?._proxy ? 0.5 : 0);
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

    createBar() {
        if (this.barElement) return;

        window.YPP.Utils?.log('Creating singular global player bar', 'GlobalBarUI', 'debug');

        const bar = document.createElement('div');
        bar.className = 'ypp-global-player-bar ypp-glass-panel';
        bar.innerHTML = BAR_HTML;

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
        
        makeDraggable(this.barElement);

        let targetContainer = document.body;
        
        if ('popover' in bar) {
            bar.popover = "manual";
        } else {
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

        this.updatePosition();
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
        
        document.addEventListener('play', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('pause', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('volumechange', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('ratechange', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('timeupdate', this._boundUpdateUIState, { capture: true, signal });
        document.addEventListener('fullscreenchange', this._boundUpdateUIState, { signal });

        bindEvents(this, signal);
        
        this.updateUIState();
        this._applyAdaptiveTheme();
    }

    _applyAdaptiveTheme() {
        if (!this.barElement) return;
        
        let isLight = false;
        
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta && themeMeta.content) {
            const color = themeMeta.content.toLowerCase();
            if (color === '#fff' || color === '#ffffff' || color === 'white') {
                isLight = true;
            }
        }
        
        if (!isLight) {
            const bg = window.getComputedStyle(document.body).backgroundColor;
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
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

    removeAll() {
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

    _getPrimaryVideo() {
        if (this.trackedVideos.size === 0) return null;
        
        let bestVideo = null;
        let maxScore = -1;
        
        for (const [video, ratio] of this.videoVisibility.entries()) {
            const area = (video.offsetWidth || 0) * (video.offsetHeight || 0);
            
            if (area < 10 && !video._proxy && this.trackedVideos.size > 1) continue;

            let score = ratio * 1000 + area;
            if (!video.paused) score += 1000000;
            if (!video.muted && video.volume > 0) score += 500000;

            if (score > maxScore) {
                maxScore = score;
                bestVideo = video;
            }
        }
        
        return bestVideo || this.trackedVideos.values().next().value;
    }

    updateUIState() {
        updateUIState(this);
    }
}

window.YPP.features.GlobalBarUI = GlobalBarUI;
