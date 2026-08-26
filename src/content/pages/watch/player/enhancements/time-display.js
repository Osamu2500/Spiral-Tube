import '../../../../core/system/base-feature.js';
export class TimeDisplay extends window.YPP.features.BaseFeature {
    static featureId = 'timeDisplay';
    static executionPhase = 'sequential-ui';
    static priority = 10;

    constructor() {
        super('TimeDisplay');
        this.name = 'TimeDisplay';
        this._mode = 'remaining'; // 'remaining' | 'chapter' | 'hidden'
        this._boundTimeUpdate = null;
        this._videoElement = null;
        this._timeDisplays = new Set();
        this._updateFns = new Set();
        this._handleNavigation = this._handleNavigation.bind(this);
        this._handleClick = this._handleClick.bind(this);
    }

    getConfigKey() { return 'enableRemainingTime'; }

    _isWatchPage() {
        const path = window.location.pathname;
        return path === '/watch' || path.startsWith('/watch/') || !!document.querySelector('#movie_player');
    }

    async enable() {
        await super.enable();
        if (!this.settings?.enableRemainingTime) return;

        this._injectStyles();
        
        this.addListener(window, 'yt-navigate-finish', this._handleNavigation);
        this.addListener(window, 'yt-page-data-updated', this._handleNavigation);
        this.addListener(window, 'yt-player-updated', this._handleNavigation);

        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('time-display-container', '.ytp-time-display, .ytp-time-wrapper', () => {
                this._initDisplays();
            }, true);
        }

        if (this._isWatchPage()) {
            this._initDisplays();
        }
    }

    async disable() {
        await super.disable();
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('time-display-container');
        }
        this._unbindVideoListeners();
        this._cleanupDisplays();
    }

    _injectStyles() {
        if (document.getElementById('ypp-time-display-styles')) return;
        const style = document.createElement('style');
        style.id = 'ypp-time-display-styles';
        style.textContent = `
            .ytp-time-display { cursor: pointer !important; }
            .ypp-custom-time { 
                display: none; 
                font-variant-numeric: tabular-nums;
                margin-left: 4px;
                opacity: 0.85;
            }
            .ypp-time-mode-active .ypp-custom-time { display: inline !important; }
        `;
        document.head.appendChild(style);
    }

    _handleNavigation() {
        if (!this.settings?.enableRemainingTime || !this._isWatchPage()) return;
        setTimeout(() => this._initDisplays(), 300);
    }

    _cleanupDisplays() {
        this._timeDisplays.forEach(td => {
            td.removeEventListener('click', this._handleClick, true);
            td.classList.remove('ypp-time-mode-remaining');
            const custom = td.querySelector('.ypp-custom-time');
            if (custom) custom.remove();
        });
        this._timeDisplays.clear();
        this._updateFns.clear();
    }

    _initDisplays() {
        if (!this.settings?.enableRemainingTime || !this._isWatchPage()) return;
        
        const displays = document.querySelectorAll('#movie_player .ytp-time-display');
        displays.forEach(td => {
            if (this._timeDisplays.has(td)) return;
            
            // Avoid miniplayer
            if (td.closest('.ytp-miniplayer-ui')) return;

            let customSpan = td.querySelector('.ypp-custom-time');
            if (!customSpan) {
                customSpan = document.createElement('span');
                customSpan.className = 'ypp-custom-time';
                td.appendChild(customSpan);
            }

            td.addEventListener('click', this._handleClick, true);
            this._timeDisplays.add(td);
            
            if (this._mode !== 'hidden') {
                td.classList.add('ypp-time-mode-active');
            }

            const updateFn = () => this._updateTime(td, customSpan);
            this._updateFns.add(updateFn);
            updateFn();
        });
    }

    _handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Cycle modes: remaining -> chapter -> hidden
        if (this._mode === 'remaining') {
            this._mode = 'chapter';
        } else if (this._mode === 'chapter') {
            this._mode = 'hidden';
        } else {
            this._mode = 'remaining';
        }
        
        this._timeDisplays.forEach(td => {
            if (this._mode !== 'hidden') {
                td.classList.add('ypp-time-mode-active');
            } else {
                td.classList.remove('ypp-time-mode-active');
            }
        });
        
        this._updateFns.forEach(fn => fn());
    }

    _unbindVideoListeners() {
        if (this._videoElement && this._boundTimeUpdate) {
            this._videoElement.removeEventListener('timeupdate', this._boundTimeUpdate.throttled);
            this._videoElement.removeEventListener('ratechange', this._boundTimeUpdate.handler);
            this._videoElement.removeEventListener('durationchange', this._boundTimeUpdate.handler);
            this._boundTimeUpdate = null;
        }
    }

    _bindVideoListeners(video) {
        if (video === this._videoElement && this._boundTimeUpdate) return;
        this._unbindVideoListeners();
        this._videoElement = video;

        const handler = () => {
            this._updateFns.forEach(fn => fn());
        };
        const throttledUpdate = window.YPP.Utils?.throttle?.(handler, 500) ?? handler;
        this._boundTimeUpdate = { throttled: throttledUpdate, handler };

        video.addEventListener('timeupdate', throttledUpdate);
        video.addEventListener('ratechange', handler);
        video.addEventListener('durationchange', handler);
    }

    _format(s) {
        if (s === undefined || s === null || isNaN(s) || s < 0) return '0:00';
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    }

    _updateTime(td, customSpan) {
        if (!this.settings?.enableRemainingTime || this._mode === 'hidden') return;

        // Ensure customSpan is still in the DOM (YouTube SPA might wipe it)
        if (!td.contains(customSpan)) {
            td.appendChild(customSpan);
        }

        const video = td.closest('.html5-video-player')?.querySelector('video') || document.querySelector('video.html5-main-video');
        if (!video) return;

        this._bindVideoListeners(video);

        // Live stream protection
        if (!video.duration || video.duration === Infinity || isNaN(video.currentTime) || video.duration <= 0) {
            customSpan.textContent = 'Live';
            return;
        }

        const speed = video.playbackRate || 1;
        const duration = video.duration;
        const currentTime = video.currentTime;
        
        let targetDuration = duration;
        let prefix = '';
        
        if (this._mode === 'chapter') {
            // Try to find current chapter end time
            const chapters = document.querySelectorAll('.ytp-chapters-container .ytp-chapter-hover-container');
            if (chapters && chapters.length > 0) {
                let accumulatedWidth = 0;
                let foundChapter = false;
                for (const chap of chapters) {
                    const widthPercent = parseFloat(chap.style.width || '0');
                    accumulatedWidth += widthPercent;
                    const chapEndTime = (accumulatedWidth / 100) * duration;
                    if (currentTime < chapEndTime) {
                        targetDuration = chapEndTime;
                        foundChapter = true;
                        break;
                    }
                }
                if (!foundChapter) targetDuration = duration;
            }
            prefix = 'Ch: ';
        }
        
        const rawLeft = Math.max(0, targetDuration - currentTime);
        const adjustedLeft = rawLeft / speed;

        if (rawLeft <= 0) {
            customSpan.textContent = `${prefix}0:00`;
            return;
        }

        if (Math.abs(speed - 1) <= 0.01) {
            customSpan.textContent = ` • -${this._format(rawLeft)}`;
        } else {
            if (speed > 1) {
                const totalSaved = targetDuration - (targetDuration / speed);
                customSpan.textContent = ` • -${this._format(adjustedLeft)} (${this._format(totalSaved)} saved)`;
            } else {
                const totalExtra = (targetDuration / speed) - targetDuration;
                customSpan.textContent = ` • -${this._format(adjustedLeft)} (${this._format(totalExtra)} extra)`;
            }
        }
        
        if (prefix) {
            customSpan.textContent = ` • ${prefix}` + customSpan.textContent.substring(3);
        }
    }
}

window.YPP.features.TimeDisplay = TimeDisplay;
