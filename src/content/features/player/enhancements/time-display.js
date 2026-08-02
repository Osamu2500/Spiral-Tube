/**
 * Time Display Feature
 * Injects speed-aware remaining time into the native YouTube player controls.
 */

export class TimeDisplay extends window.YPP.features.BaseFeature {
    static featureId = 'timeDisplay';
    static executionPhase = 'sequential-ui';
    static priority = 10;

    constructor() {
        super('TimeDisplay');
        this.name = 'TimeDisplay';
        this.settings = null;
        this._boundTimeUpdate = null;
        this._videoElement = null;
        this._pollInterval = null;
        this._timeRemainingNodes = new Set();
        this._updateFns = new Set();
        this._handleNavigation = this._handleNavigation.bind(this);
    }

    getConfigKey() { return 'enableRemainingTime'; }

    _isWatchPage() {
        const path = window.location.pathname;
        return path === '/watch' || 
               path.startsWith('/watch/') || 
               path === '/shorts' || 
               path.startsWith('/shorts/') || 
               !!document.querySelector('#movie_player');
    }

    _findTimeDisplays() {
        const displays = document.querySelectorAll(
            '#movie_player .ytp-time-display, ' +
            '.html5-video-player .ytp-time-display, ' +
            '.ytp-time-display'
        );
        return Array.from(displays).filter(el => !el.closest('.ytp-miniplayer-ui'));
    }

    enable() {
        if (!this.settings || !this.settings.enableRemainingTime) return;
        this.isEnabled = true;

        const Utils = window.YPP.Utils;
        if (!Utils) return;

        this.addListener(window, 'yt-navigate-finish', this._handleNavigation);
        this.addListener(window, 'yt-page-data-updated', this._handleNavigation);
        this.addListener(window, 'yt-player-updated', this._handleNavigation);

        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('time-display-container', '.ytp-time-display, .ytp-time-wrapper', (elements) => {
                this.showAll();
            }, true);
        }

        if (this._isWatchPage()) {
            this.showAll();
        }
    }

    showAll() {
        if (!this.isEnabled || !this.settings?.enableRemainingTime || !this._isWatchPage()) return;
        const timeDisplays = this._findTimeDisplays();
        timeDisplays.forEach(td => this.showRemainingTime(td));
        this._updateFns.forEach(fn => fn());
    }

    _handleNavigation() {
        if (!this.isEnabled || !this._isWatchPage()) return;
        setTimeout(() => {
            this.showAll();
        }, 300);
    }

    async disable() {
        this.isEnabled = false;
        await super.disable();
        try {
            if (window.YPP.sharedObserver) {
                window.YPP.sharedObserver.unregister('time-display-container');
            }

            this._unbindVideoListeners();

            this._timeRemainingNodes.forEach(node => {
                if (node && node.parentNode) node.remove();
            });
            this._timeRemainingNodes.clear();

            document.querySelectorAll('.ypp-time-remaining').forEach(el => el.remove());
            this._updateFns = new Set();
            this._videoElement = null;
        } catch (err) {
            this.utils?.log('TimeDisplay disable error', 'TIME-DISPLAY', 'error', err);
        }
    }

    onUpdate() {
        this.enable();
    }

    _unbindVideoListeners() {
        if (this._videoElement && this._boundTimeUpdate) {
            this._videoElement.removeEventListener('timeupdate', this._boundTimeUpdate.throttled);
            this._videoElement.removeEventListener('ratechange', this._boundTimeUpdate.handler);
            this._videoElement.removeEventListener('durationchange', this._boundTimeUpdate.handler);
            this._videoElement.removeEventListener('loadedmetadata', this._boundTimeUpdate.handler);
            this._videoElement.removeEventListener('play', this._boundTimeUpdate.handler);
            this._videoElement.removeEventListener('seeked', this._boundTimeUpdate.handler);
            this._boundTimeUpdate = null;
        }
    }

    _bindVideoListeners(video, update) {
        if (video === this._videoElement && this._boundTimeUpdate) {
            this._boundTimeUpdate.raws.add(update);
            return;
        }
        this._unbindVideoListeners();
        this._videoElement = video;

        const handler = () => {
            if (this._boundTimeUpdate?.raws) {
                this._boundTimeUpdate.raws.forEach(fn => fn());
            }
        };
        const throttledUpdate = window.YPP.Utils?.throttle?.(handler, 500) ?? handler;
        this._boundTimeUpdate = { throttled: throttledUpdate, handler, raws: new Set([update]) };

        video.addEventListener('timeupdate', throttledUpdate);
        video.addEventListener('ratechange', handler);
        video.addEventListener('durationchange', handler);
        video.addEventListener('loadedmetadata', handler);
        video.addEventListener('play', handler);
        video.addEventListener('seeked', handler);
    }

    showRemainingTime(timeDisplay) {
        if (!timeDisplay || !this.isEnabled || !this.settings?.enableRemainingTime) return;

        const durationNode = timeDisplay.querySelector('.ytp-time-duration') || 
                             timeDisplay.querySelector('[class*="time-duration"]') || 
                             timeDisplay.querySelector('.ytp-time-current')?.parentNode?.querySelector('.ytp-time-duration');
        if (!durationNode) return;

        // Cleanup legacy structures
        ['ypp-time-dashboard', 'ypp-native-time-metrics', 'ypp-dedicated-time-metrics'].forEach(id => {
            const old = document.getElementById(id);
            if (old) old.remove();
        });
        document.querySelectorAll('.ypp-time-separator-appended').forEach(el => el.remove());

        let timeRemainingNode = timeDisplay.querySelector('.ypp-time-remaining');
        if (!timeRemainingNode) {
            timeRemainingNode = document.createElement('span');
            timeRemainingNode.className = 'ypp-time-remaining';
            timeRemainingNode.style.cssText = `
                display: inline-block !important;
                margin-left: 5px !important;
                opacity: 0.9 !important;
                font-weight: 500 !important;
                color: inherit !important;
                vertical-align: baseline !important;
                white-space: nowrap !important;
            `;

            if (durationNode.parentNode) {
                durationNode.parentNode.insertBefore(timeRemainingNode, durationNode.nextSibling);
            } else {
                timeDisplay.appendChild(timeRemainingNode);
            }
        }
        this._timeRemainingNodes.add(timeRemainingNode);

        const format = (s) => {
            if (s === undefined || s === null || isNaN(s) || s < 0) return '0:00';
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = Math.floor(s % 60);
            if (h > 0) {
                return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
            }
            return `${m}:${sec.toString().padStart(2, '0')}`;
        };

        const update = () => {
            if (!this.isEnabled || !this.settings?.enableRemainingTime) return;

            const video = timeDisplay.closest('.html5-video-player')?.querySelector('video') || 
                          document.querySelector('video.html5-main-video') || 
                          document.querySelector('#movie_player video') || 
                          document.querySelector('video');
            if (video) {
                this._bindVideoListeners(video, update);
            }

            if (!video || !video.duration || !isFinite(video.duration) || isNaN(video.currentTime) || video.duration <= 0) {
                if (timeRemainingNode) timeRemainingNode.style.display = 'none';
                return;
            }

            // Ensure node remains attached immediately after durationNode
            const curDurationNode = timeDisplay.querySelector('.ytp-time-duration') || 
                                    timeDisplay.querySelector('[class*="time-duration"]');
            if (curDurationNode && curDurationNode.parentNode && curDurationNode.nextSibling !== timeRemainingNode) {
                curDurationNode.parentNode.insertBefore(timeRemainingNode, curDurationNode.nextSibling);
            }

            const speed = video.playbackRate || 1;
            const duration = video.duration;
            const currentTime = video.currentTime;
            const rawLeft = Math.max(0, duration - currentTime);
            const adjustedLeft = rawLeft / speed;

            if (rawLeft <= 0) {
                timeRemainingNode.style.display = 'none';
                return;
            }

            timeRemainingNode.style.display = 'inline-block';

            if (Math.abs(speed - 1) <= 0.01) {
                timeRemainingNode.textContent = ` (-${format(rawLeft)})`;
            } else {
                if (speed > 1) {
                    const totalSaved = duration - (duration / speed);
                    timeRemainingNode.textContent = ` (-${format(adjustedLeft)} · ${format(totalSaved)} saved)`;
                } else {
                    const totalExtra = (duration / speed) - duration;
                    timeRemainingNode.textContent = ` (-${format(adjustedLeft)} · ${format(totalExtra)} extra)`;
                }
            }
        };

        this._updateFns.add(update);
        update();
    }
}

window.YPP.features.TimeDisplay = TimeDisplay;
