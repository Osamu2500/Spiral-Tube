export class SmartHistory extends window.YPP.features.BaseFeature {
    static featureId = 'smartHistory';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('SmartHistory');
        
        this.STORAGE_KEY = 'ytProVideos';
        this.SETTINGS_KEY = 'resumeSettings';
        
        this.defaultSettings = {
            pauseResume: false,
            minWatchTime: 60,
            minVideoLength: 120,
            markPlayedTime: 10,
            deleteAfter: 0
        };

        this.videoElement = null;
        this.isTracking = false;
        
        this._onTimeUpdate = this.handleTimeUpdate.bind(this);
        this._onBeforeUnload = this.forceSave.bind(this);
        
        this.lastSaveTime = 0;
        this.SAVE_INTERVAL = 5000;
        
        this.currentVideoData = null;
        this.resumeBlacklist = false;
        this.initialResumeDone = false;
    }

    getConfigKey() {
        return 'smartHistory';
    }

    async enable() {
        await super.enable();
        
        await this.initStorage();
        
        if (this.utils.isWatchPage()) {
            this.startVideoTracking();
        }
        
        this.addListener(window, 'beforeunload', this._onBeforeUnload);
    }

    async disable() {
        await super.disable();
        this.forceSave();
        this.stopVideoTracking();
    }

    onVideoChange(videoId) {
        if (!this.isEnabled) return;
        this.forceSave();
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
    
    async initStorage() {
        const bytes = await new Promise(resolve => chrome.storage.local.getBytesInUse(this.STORAGE_KEY, resolve));
        if (bytes === 0 || bytes === undefined) {
            await new Promise(resolve => chrome.storage.local.set({ [this.STORAGE_KEY]: [] }, resolve));
        }
        
        const settingsBytes = await new Promise(resolve => chrome.storage.local.getBytesInUse(this.SETTINGS_KEY, resolve));
        if (settingsBytes === 0 || settingsBytes === undefined) {
            await new Promise(resolve => chrome.storage.local.set({ [this.SETTINGS_KEY]: this.defaultSettings }, resolve));
        }
    }

    extractWatchID(link) {
        if (!link) return '';
        const m = link.match(/[?&]v=([^&#]+)/);
        return m ? m[1] : '';
    }

    startVideoTracking(videoId) {
        this.stopVideoTracking();
        
        let activeId = videoId || new URLSearchParams(window.location.search).get('v');
        if (!activeId) return;
        
        this.activeVideoId = activeId;
        this.initialResumeDone = false;
        this.resumeBlacklist = false;
        
        this.pollFor('smart-history-video', 'video.html5-main-video', async (video) => {
            if (this.isTracking || !this.isEnabled) return;
            this.videoElement = video;
            this.isTracking = true;
            
            // Fetch current settings and previous history
            const data = await new Promise(resolve => chrome.storage.local.get([this.STORAGE_KEY, this.SETTINGS_KEY], resolve));
            this.settings = data[this.SETTINGS_KEY] || this.defaultSettings;
            const history = data[this.STORAGE_KEY] || [];
            
            const existing = history.find(v => this.extractWatchID(v.videolink) === activeId);
            this.currentVideoData = existing || null;
            
            if (existing && existing.doNotResume) {
                this.resumeBlacklist = true;
            }
            
            // Auto resume check
            this.checkAutoResume();
            
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
        this.currentVideoData = null;
    }
    
    checkAutoResume() {
        if (!this.isEnabled || !this.videoElement || this.initialResumeDone) return;
        if (this.settings.pauseResume || this.resumeBlacklist) return;
        
        const duration = this.videoElement.duration;
        if (!duration || isNaN(duration)) {
            // Need to wait for duration
            const onMeta = () => {
                this.removeListener(this.videoElement, 'loadedmetadata', onMeta);
                this.checkAutoResume();
            };
            this.addListener(this.videoElement, 'loadedmetadata', onMeta);
            return;
        }
        
        if (duration < this.settings.minVideoLength) {
            this.initialResumeDone = true;
            return;
        }
        
        if (this.currentVideoData) {
            const time = this.currentVideoData.time;
            if (time > this.settings.minWatchTime && !this.currentVideoData.complete && !this.currentVideoData.doNotResume) {
                this.videoElement.currentTime = time;
                console.log(`[SmartHistory] Auto-resumed video to ${time}s`);
            }
        }
        this.initialResumeDone = true;
    }
    
    grabTitle() {
        const el = document.querySelector("h1.ytd-watch-metadata yt-formatted-string") ||
                   document.querySelector("ytd-watch-metadata h1 yt-formatted-string") ||
                   document.querySelector("h1.title.style-scope.ytd-video-primary-info-renderer") ||
                   document.querySelector("h1[class*='title']");
        return el ? el.textContent.trim() : "";
    }
    
    grabChannel() {
        const el = document.querySelector("ytd-video-owner-renderer a.yt-simple-endpoint.yt-formatted-string");
        return el ? el.textContent.trim() : "";
    }

    async handleTimeUpdate() {
        if (!this.activeVideoId || !this.videoElement || this.videoElement.paused) return;
        
        const time = this.videoElement.currentTime;
        const duration = this.videoElement.duration;
        
        if (!duration || duration < this.settings.minVideoLength) return;
        if (time < 3) return; // Ignore very first instant
        
        const now = Date.now();
        if (now - this.lastSaveTime < this.SAVE_INTERVAL) return;
        this.lastSaveTime = now;
        
        this.saveCurrentState(time, duration);
    }
    
    forceSave() {
        if (!this.activeVideoId || !this.videoElement) return;
        const time = this.videoElement.currentTime;
        const duration = this.videoElement.duration;
        if (duration && time > 3 && duration >= this.settings.minVideoLength) {
            this.saveCurrentState(time, duration);
        }
    }

    async saveCurrentState(time, duration) {
        if (!this.activeVideoId) return;
        
        const link = `https://www.youtube.com/watch?v=${this.activeVideoId}`;
        const title = this.grabTitle() || (this.currentVideoData ? this.currentVideoData.title : "Unknown Title");
        const channel = this.grabChannel() || (this.currentVideoData ? this.currentVideoData.channel : "");
        const thumbnail = `https://i.ytimg.com/vi/${this.activeVideoId}/mqdefault.jpg`;
        
        // Mark complete if within markPlayedTime of end, or > 95%
        const isComplete = (duration - time <= this.settings.markPlayedTime) || (time / duration > 0.95);
        
        const data = await new Promise(resolve => chrome.storage.local.get(this.STORAGE_KEY, resolve));
        let history = data[this.STORAGE_KEY] || [];
        
        const existing = history.find(v => this.extractWatchID(v.videolink) === this.activeVideoId);
        
        const watchCount = existing ? (existing.watchCount || 1) : 1;
        const doNotResume = existing ? existing.doNotResume : false;
        
        // We do NOT increment watchCount here unless it's a completely new watch session (Youtube-Pro-Plus increments on first click, but this is fine for now).
        
        const videoObj = {
            videolink: link,
            title: title,
            time: time,
            duration: duration,
            complete: isComplete,
            timestamp: Date.now(),
            thumbnail: thumbnail,
            channel: channel,
            watchCount: watchCount,
            doNotResume: doNotResume
        };
        
        // Update history: filter out old, push new to end
        history = history.filter(v => this.extractWatchID(v.videolink) !== this.activeVideoId);
        history.push(videoObj);
        
        // Keep max 1000 items
        if (history.length > 1000) {
            history.sort((a, b) => a.timestamp - b.timestamp);
            history = history.slice(history.length - 1000);
        }
        
        this.currentVideoData = videoObj;
        
        await new Promise(resolve => chrome.storage.local.set({ [this.STORAGE_KEY]: history }, resolve));
    }
};

window.YPP.features.SmartHistory = SmartHistory;
