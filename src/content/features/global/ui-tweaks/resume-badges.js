export class ResumeBadges extends window.YPP.features.BaseFeature {
    static featureId = 'resumeBadges';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('ResumeBadges');
        this.STORAGE_KEY = 'ytProVideos';
        this.videoData = {};
        this.videoElement = null;
        this.isTracking = false;
        
        this._onTimeUpdate = this.handleTimeUpdate.bind(this);
        this._saveData = this.saveData.bind(this);
        
        // Debounce storage writes
        this.lastSaveTime = 0;
        this.SAVE_INTERVAL = 5000; 
    }

    getConfigKey() {
        return 'resumeBadges';
    }

    async enable() {
        await super.enable();
        
        const stored = await new Promise(resolve => chrome.storage.local.get(this.STORAGE_KEY, resolve));
        if (stored && stored[this.STORAGE_KEY]) {
            // Convert array format to map for quick lookup
            this.videoData = {};
            stored[this.STORAGE_KEY].forEach(v => {
                const id = v.videolink.match(/[?&]v=([^&#]+)/)?.[1];
                if (id) {
                    this.videoData[id] = v;
                }
            });
        }
        
        this.addListener(window, 'beforeunload', this._saveData);
        
        this.startThumbnailObserver();
        
        if (this.utils.isWatchPage()) {
            this.startVideoTracking();
        }
    }

    async disable() {
        await super.disable();
        this._saveData();
        this.stopVideoTracking();
        
        if (this.thumbnailObserver) {
            this.thumbnailObserver.disconnect();
            this.thumbnailObserver = null;
        }
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('resume-badges');
        }
        
        document.querySelectorAll('.yt-pro-pbar-wrap, .yt-pro-resume-badge').forEach(el => el.remove());
    }

    onVideoChange(videoId) {
        if (!this.isEnabled) return;
        this._saveData();
        this.startVideoTracking(videoId);
    }

    onPageChange(url) {
        if (!this.isEnabled) return;
        if (this.utils.isWatchPage()) {
            this.startVideoTracking();
        } else {
            this.stopVideoTracking();
        }
    }

    startVideoTracking(videoId) {
        this.stopVideoTracking();
        
        let activeId = videoId || new URLSearchParams(window.location.search).get('v');
        if (!activeId) return;
        
        this.activeVideoId = activeId;
        
        this.pollFor('resume-badges-video', 'video.html5-main-video', (video) => {
            if (this.isTracking || !this.isEnabled) return;
            this.videoElement = video;
            this.isTracking = true;
            this.addListener(this.videoElement, 'timeupdate', this._onTimeUpdate);
        });
    }

    stopVideoTracking() {
        if (this.videoElement) {
            this.removeListener(this.videoElement, 'timeupdate', this._onTimeUpdate);
            this.videoElement = null;
        }
        this.isTracking = false;
        this.activeVideoId = null;
    }

    handleTimeUpdate() {
        if (!this.activeVideoId || !this.videoElement || this.videoElement.paused) return;
        
        const time = this.videoElement.currentTime;
        const duration = this.videoElement.duration;
        
        if (!duration || duration < 60) return; // Ignore shorts/short videos
        if (time < 10) return; // Ignore if barely started
        
        if (!this.videoData[this.activeVideoId]) {
            this.videoData[this.activeVideoId] = {};
        }
        
        this.videoData[this.activeVideoId].time = time;
        this.videoData[this.activeVideoId].duration = duration;
        this.videoData[this.activeVideoId].updatedAt = Date.now();
        
        // Mark as completed if > 95%
        if (time / duration > 0.95) {
            this.videoData[this.activeVideoId].complete = true;
        }
        
        const now = Date.now();
        if (now - this.lastSaveTime > this.SAVE_INTERVAL) {
            this._saveData();
            this.lastSaveTime = now;
        }
    }

    async saveData() {
        // Save data is now handled by SmartHistory feature entirely.
        // ResumeBadges is now just a read-only consumer for UI rendering.
    }

    startThumbnailObserver() {
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('resume-badges', 'ytd-thumbnail:not([data-ypp-resume-processed="true"])', (elements) => {
                this.processThumbnailsElements(elements);
            }, true);
        } else {
            this.thumbnailObserver = new MutationObserver((mutations) => {
                let shouldProcess = false;
                for (let m of mutations) {
                    if (m.addedNodes.length) {
                        shouldProcess = true;
                        break;
                    }
                }
                if (shouldProcess) this.processThumbnails();
            });
            this.thumbnailObserver.observe(document.body, { childList: true, subtree: true });
            this.processThumbnails();
        }
    }

    processThumbnails() {
        const thumbnails = document.querySelectorAll('ytd-thumbnail:not([data-ypp-resume-processed="true"])');
        this.processThumbnailsElements(thumbnails);
    }

    processThumbnailsElements(thumbnails) {
        thumbnails.forEach(thumb => {
            if (thumb.hasAttribute('data-ypp-resume-processed')) return;
            
            const anchor = thumb.querySelector('a#thumbnail');
            if (!anchor) return;
            
            const href = anchor.getAttribute('href');
            if (!href) return;
            
            const match = href.match(/[?&]v=([^&#]+)/);
            if (!match) return;
            
            const videoId = match[1];
            thumb.setAttribute('data-ypp-resume-processed', 'true');
            
            const data = this.videoData[videoId];
            if (!data || !data.time || !data.duration || data.complete) return;
            
            // Add progress bar
            const percent = (data.time / data.duration) * 100;
            const wrap = document.createElement('div');
            wrap.className = 'yt-pro-pbar-wrap';
            wrap.innerHTML = `<div class="yt-pro-pbar" style="width: ${percent}%;"></div>`;
            
            // Add time badge
            const timeBadge = document.createElement('div');
            timeBadge.className = 'yt-pro-resume-badge';
            timeBadge.innerHTML = `<span>&#9654;</span> ${this.formatTime(data.time)}`;
            
            const overlays = thumb.querySelector('#overlays');
            if (overlays) {
                overlays.appendChild(wrap);
                overlays.appendChild(timeBadge);
            }
        });
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const s = Math.floor(seconds);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        const pad = n => n < 10 ? '0' + n : '' + n;
        return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
    }
};

window.YPP.features.ResumeBadges = ResumeBadges;
