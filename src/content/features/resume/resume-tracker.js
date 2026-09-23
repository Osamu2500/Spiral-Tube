import '../../core/system/base-feature.js';
import { SyncPanelUI } from './ui/sync-panel.js';
import { BookmarkModalUI } from './ui/bookmark-modal.js';
import { ResumeDataManager } from './resume-data.js';

/**
 * @fileoverview
 * Feature: Smart Video Resumer
 * 
 * Target: /watch route.
 * Purpose: Remembers exact playback position locally utilizing ResumeDataManager.
 * Automatically seeks to saved position on load.
 */
export class ResumeTracker extends window.YPP.features.BaseFeature {
    static featureId = 'videoResumer'; // Keep ID for backwards config compatibility
    static executionPhase = 'idle';
    static priority = 999;
    static targetPages = ['watch'];
    static allowInIframe = true;

    static CONFIG = {
        POLL_TIMEOUT: 10000,
        POLL_INTERVAL: 500,
        MARKER_DELAY_MS: 2000,
        SAVE_THROTTLE_MS: 10000,
        MIN_RESUME_SECONDS: 5,
        CHAPTER_SNAP_SECONDS: 30,
        CONTEXT_REWIND_SECONDS: 3,
        MAX_RESUME_HISTORY: 50,
        COMPLETION_THRESHOLD: 0.95
    };

    constructor() {
        super('ResumeTracker');
        
        this.videoElement = null;
        this.videoId = null;
        this.saveInterval = null;
        this.lastSave = null;
        
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
        this.handleHotkey = this.handleHotkey.bind(this);
        this.STORAGE_KEY_PREFIX = 'ypp_resume_';
        this.BOOKMARK_KEY_PREFIX = 'ypp_bookmark_';
        this.currentCategoryId = null;
        this.cachedMetadata = null;
        
        this.syncPanel = new SyncPanelUI(this.utils);
        this.bookmarkModal = new BookmarkModalUI(this.utils);
    }

    getConfigKey() {
        return 'videoResumer';
    }

    async enable() {
        await super.enable();
        this.addListener(window, 'yt-navigate-finish', this.handleNavigation);
        if (this.utils.isWatchPage()) {
            this.init();
        }
    }

    async disable() {
        await super.disable();
        this.cleanup();
    }

    async onUpdate() {
        if (this.utils.isWatchPage() && !this.videoElement) {
            this.init();
        }
    }

    handleNavigation() {
        if (this.videoElement && this.videoId) {
            ResumeDataManager.removeVideo(this.STORAGE_KEY_PREFIX + this.videoId);
        }
        
        this.cleanup();
        if (!this.isEnabled) return;
        
        if (this.utils.isWatchPage()) {
            this.init();
        }
    }

    cleanup() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
        if (this.videoElement) {
            this.removeListener(this.videoElement, 'timeupdate', this.handleTimeUpdate);
        }
        document.removeEventListener('keydown', this.handleHotkey);
        this.videoElement = null;
        this.videoId = null;
        
        document.querySelectorAll('.ypp-bookmark-marker').forEach(el => el.remove());
        const syncPanel = document.getElementById('ypp-sync-panel');
        if (syncPanel) syncPanel.remove();
    }

    getVideoId() {
        return new URLSearchParams(window.location.search).get('v');
    }

    async init() {
        this.videoId = this.getVideoId();
        if (!this.videoId) return;

        try {
            const video = await this.utils.pollFor(() => {
                const v = document.querySelector('video.video-stream.html5-main-video');
                if (v && v.readyState >= 1) return v;
                return null;
            }, ResumeTracker.CONFIG.POLL_TIMEOUT, ResumeTracker.CONFIG.POLL_INTERVAL);

            if (video && this.isEnabled) {
                this.videoElement = video;
                
                await this.restoreTime();

                this.addListener(this.videoElement, 'timeupdate', this.handleTimeUpdate);
                this.addListener(window, 'pagehide', () => this.forceSave());
                this.addListener(document, 'visibilitychange', () => {
                    if (document.hidden) this.forceSave();
                });
                
                if (window.YPP && window.YPP.events) {
                    this.addListener(window.YPP.events, 'app:forceSaveResume', () => this.forceSave());
                }
                
                this.addListener(document, 'keydown', this.handleHotkey);
                
                this.cachedMetadata = null;
                this._updateMetadataCache();
                
                setTimeout(() => this._renderBookmarkMarkers(), ResumeTracker.CONFIG.MARKER_DELAY_MS);
            }
        } catch (e) {
            this.utils.log?.('Smart Video Resumer timed out', 'RESUMER', 'warn');
        }
    }

    async restoreTime() {
        if (!this.videoId || !this.videoElement) return;
        
        try {
            const allVideos = await ResumeDataManager.getAllVideos();
            const savedVideo = allVideos.find(v => v.id === this.videoId);
            
            if (!savedVideo) return;
            
            const savedTime = savedVideo.time;
            const duration = savedVideo.duration;
            this.currentCategoryId = savedVideo.categoryId;
            
            if (Math.abs(this.videoElement.currentTime - savedTime) > 2 && savedTime > ResumeTracker.CONFIG.MIN_RESUME_SECONDS) {
                const videoDuration = duration || this.videoElement.duration;
                if (videoDuration && savedTime / videoDuration > ResumeTracker.CONFIG.COMPLETION_THRESHOLD) {
                    ResumeDataManager.removeVideo(this.STORAGE_KEY_PREFIX + this.videoId);
                    return;
                }

                const smartTime = this._calculateResumeTime(savedTime);
                this.syncPanel.show(savedTime, smartTime, this.videoElement, null);
            }
        } catch (e) {
            this.utils.log?.('Failed to restore time from storage', 'RESUMER', 'warn', e);
        }
    }

    _calculateResumeTime(savedTime) {
        const chapters = [];
        const timeLinks = document.querySelectorAll('a.yt-core-attributed-string__link');
        timeLinks.forEach(link => {
            const text = link.textContent.trim();
            const timeMatch = text.match(/^(?:(?:(\d+):)?(\d+):)?(\d+)$/);
            if (timeMatch && link.href.includes('&t=')) {
                const url = new URL(link.href);
                const tMatch = url.searchParams.get('t')?.replace('s','');
                if (tMatch && !isNaN(parseInt(tMatch))) {
                    chapters.push(parseInt(tMatch));
                }
            }
        });
        
        const sorted = [...new Set(chapters)].sort((a, b) => a - b);
        let resumeTime = Math.max(0, savedTime - ResumeTracker.CONFIG.CONTEXT_REWIND_SECONDS);

        for (let i = sorted.length - 1; i >= 0; i--) {
            const chap = sorted[i];
            if (chap <= savedTime) {
                if (savedTime - chap <= ResumeTracker.CONFIG.CHAPTER_SNAP_SECONDS) {
                    resumeTime = chap;
                }
                break;
            }
        }
        return resumeTime;
    }

    forceSave() {
        if (!this.videoElement || !this.videoId) return;
        
        const currentTime = this.videoElement.currentTime;
        const duration = this.videoElement.duration;
        const key = this.STORAGE_KEY_PREFIX + this.videoId;
        
        try {
            if (duration && (currentTime / duration > ResumeTracker.CONFIG.COMPLETION_THRESHOLD)) {
                ResumeDataManager.removeVideo(key);
            } else if (currentTime > ResumeTracker.CONFIG.MIN_RESUME_SECONDS) {
                const meta = this.cachedMetadata || {};
                let title = meta.title;
                if (!title) {
                    const titleMeta = document.querySelector('meta[property="og:title"]');
                    const titleHeading = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, h1 yt-formatted-string');
                    title = titleMeta?.content?.replace(/ - YouTube$/, '') || titleHeading?.textContent?.trim() || document.title.replace(/ - YouTube$/, '');
                }
                
                let channel = meta.channel;
                if (channel === undefined) {
                    const channelEl = document.querySelector('#channel-name a, ytd-channel-name a, .ytd-channel-name a, .yt-formatted-string.ytd-channel-name');
                    channel = channelEl?.textContent?.trim() || '';
                }
                
                const thumbnail = meta.thumbnail || `https://i.ytimg.com/vi/${this.videoId}/mqdefault.jpg`;
                if (title === 'YouTube') title = 'YouTube Video';

                const saveData = JSON.stringify({ 
                    time: currentTime, 
                    duration: duration || 0, 
                    savedAt: Date.now(),
                    title,
                    channel,
                    thumbnail,
                    categoryId: this.currentCategoryId || null
                });
                
                if (chrome && chrome.storage && chrome.storage.sync) {
                    chrome.storage.sync.set({ [key]: saveData }, () => this._pruneOldResumes());
                } else {
                    window.YPP.StorageManager.set(key, saveData);
                    this._pruneOldResumes();
                }
            }
        } catch (e) {}
    }

    _updateMetadataCache() {
        if (!this.videoId || !this.videoElement) return;
        const titleMeta = document.querySelector('meta[property="og:title"]');
        const titleHeading = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, h1 yt-formatted-string');
        const title = titleMeta?.content?.replace(/ - YouTube$/, '') || titleHeading?.textContent?.trim() || document.title.replace(/ - YouTube$/, '');
        
        const channelEl = document.querySelector('#channel-name a, ytd-channel-name a, .ytd-channel-name a, .yt-formatted-string.ytd-channel-name');
        const channel = channelEl?.textContent?.trim() || '';
        
        const thumbnail = `https://i.ytimg.com/vi/${this.videoId}/mqdefault.jpg`;
        
        if (title && title !== 'YouTube' && channel) {
            this.cachedMetadata = { title, channel, thumbnail };
        } else {
            setTimeout(() => {
                if (this.videoElement) this._updateMetadataCache();
            }, 1500);
        }
    }

    async _pruneOldResumes() {
        try {
            let data = {};
            if (chrome && chrome.storage && chrome.storage.sync) {
                data = await chrome.storage.sync.get(null);
            } else {
                data = window.localStorage;
            }
            
            const keys = Object.keys(data).filter(k => k.startsWith(this.STORAGE_KEY_PREFIX));
            if (keys.length <= ResumeTracker.CONFIG.MAX_RESUME_HISTORY) return;

            const parsed = keys.map(k => {
                try {
                    const obj = JSON.parse(data[k]);
                    return { key: k, ts: obj.savedAt || 0 };
                } catch {
                    return { key: k, ts: 0 };
                }
            }).sort((a, b) => a.ts - b.ts);

            const toDelete = parsed.slice(0, parsed.length - ResumeTracker.CONFIG.MAX_RESUME_HISTORY).map(item => item.key);
            
            if (chrome && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.remove(toDelete);
            } else {
                toDelete.forEach(k => window.YPP.StorageManager.remove(k));
            }
            this.utils.log?.(`Pruned ${toDelete.length} old resume entries`, 'RESUMER');
        } catch (e) {}
    }

    handleTimeUpdate() {
        if (!this.videoElement || !this.videoId) return;
        const now = Date.now();
        if (!this.lastSave || now - this.lastSave > ResumeTracker.CONFIG.SAVE_THROTTLE_MS) {
            this.forceSave();
            this.lastSave = now;
        }
    }
    
    handleHotkey(e) {
        if (!this.videoElement || !this.videoId) return;

        if (e.shiftKey && e.key.toLowerCase() === 'b' && !(e.ctrlKey || e.metaKey)) {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
            e.preventDefault();
            this.bookmarkModal.toggle(this.videoId, this.videoElement, () => this._renderBookmarkMarkers());
            return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            const time = this.videoElement.currentTime;
            const key = this.BOOKMARK_KEY_PREFIX + this.videoId + '_' + Math.floor(time);
            
            if (chrome && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.set({ [key]: { time, date: Date.now() } });
            } else {
                window.YPP.StorageManager.set(key, JSON.stringify({ time, date: Date.now() }));
            }
            
            if (this.utils.createToast) {
                this.utils.createToast('Timestamp Bookmarked (Press Shift+B to view)', 'success');
            }
            this.utils.log?.(`Bookmarked at ${time}s`, 'RESUMER');
            this._renderBookmarkMarkers();
        }
    }
    
    async _renderBookmarkMarkers() {
        if (!this.videoId || !this.videoElement || !this.videoElement.duration) return;
        
        document.querySelectorAll('.ypp-bookmark-marker').forEach(el => el.remove());
        
        const progressList = document.querySelector('.ytp-progress-list');
        if (!progressList) return;
        
        const allBookmarks = await ResumeDataManager.getAllBookmarks();
        const videoBookmarks = allBookmarks.filter(b => b.videoId === this.videoId);
        
        videoBookmarks.forEach(bm => {
            const time = bm.time;
            const percent = (time / this.videoElement.duration) * 100;
            if (percent > 100 || percent < 0) return;
            
            const marker = document.createElement('div');
            marker.className = 'ypp-bookmark-marker';
            marker.style.cssText = `
                position: absolute;
                left: ${percent}%;
                width: 4px;
                height: 100%;
                background-color: #ffcc00;
                transform: translateX(-50%);
                z-index: 40;
                cursor: pointer;
            `;
            marker.title = `Bookmark at ${Math.floor(time)}s`;
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                this.videoElement.currentTime = time;
            });
            progressList.appendChild(marker);
        });
    }
};

window.YPP.features.ResumeTracker = ResumeTracker;
