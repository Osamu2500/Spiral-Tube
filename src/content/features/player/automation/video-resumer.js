/**
 * Feature: Smart Video Resumer
 * Remembers exact playback position locally utilizing localStorage.
 * Automatically seeks to saved position on load.
 */


/**
 * Feature: Smart Video Resumer
 * Remembers exact playback position locally utilizing localStorage.
 * Automatically seeks to saved position on load.
 */



export class VideoResumer extends window.YPP.features.BaseFeature {
    static featureId = 'videoResumer';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('VideoResumer');
        
        this.videoElement = null;
        this.videoId = null;
        this.saveInterval = null;
        
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
        this.handleHotkey = this.handleHotkey.bind(this);
        this.STORAGE_KEY_PREFIX = 'ypp_resume_';
        this.BOOKMARK_KEY_PREFIX = 'ypp_bookmark_';
    }

    getConfigKey() {
        return 'videoResumer';
    }

    async enable() {
        await super.enable();
        
        // Listen for SPA navigation
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
        this.cleanup();
        if (!this.isEnabled) return;
        
        if (this.utils.isWatchPage()) {
            this.init();
        } else if (window.location.pathname === '/') {
            this._injectContinueWatchingRow(); // V3 Fix: Polling inside method
        }
    }

    cleanup() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
        if (this.videoElement) {
            this.videoElement.removeEventListener('timeupdate', this.handleTimeUpdate);
        }
        document.removeEventListener('keydown', this.handleHotkey);
        this.videoElement = null;
        this.videoId = null;
        
        // V4: Cleanup injected DOM elements
        document.querySelectorAll('.ypp-bookmark-marker').forEach(el => el.remove());
        const syncPanel = document.getElementById('ypp-sync-panel');
        if (syncPanel) syncPanel.remove();
        const continueRow = document.getElementById('ypp-continue-watching-row');
        if (continueRow) continueRow.remove();
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
                // Ensure the video is actually for this page
                if (v && v.readyState >= 1) return v;
                return null;
            }, 10000, 500);

            if (video && this.isEnabled) {
                this.videoElement = video;
                
                // Restore previous time if available
                await this.restoreTime();

                // Save time periodically
                this.addListener(this.videoElement, 'timeupdate', this.handleTimeUpdate);
                this.addListener(window, 'pagehide', () => this.forceSave());
                this.addListener(document, 'visibilitychange', () => {
                    if (document.hidden) this.forceSave();
                });
                
                // Hotkey for Bookmarking
                this.addListener(document, 'keydown', this.handleHotkey);
                
                // V2: Progress Bar Markers
                setTimeout(() => this._renderBookmarkMarkers(), 2000);
            }
        } catch (e) {
            this.utils.log?.('Smart Video Resumer timed out', 'RESUMER', 'warn');
        }
    }

    async restoreTime() {
        if (!this.videoId || !this.videoElement) return;
        
        try {
            let savedTimeStr = null;
            const key = this.STORAGE_KEY_PREFIX + this.videoId;
            
            // Cloud Sync
            if (chrome && chrome.storage && chrome.storage.sync) {
                const data = await chrome.storage.sync.get(key);
                savedTimeStr = data[key];
            } else {
                savedTimeStr = await window.YPP.StorageManager.get(key);
            }
            
            if (!savedTimeStr) return;

            const savedTime = parseFloat(savedTimeStr);
            if (isNaN(savedTime)) return;
            
            // Don't seek if we're already close to it or it's within the first 5 seconds
            if (Math.abs(this.videoElement.currentTime - savedTime) > 2 && savedTime > 5) {
                
                // Check if it's near the end (e.g. 95%) - if so, don't resume, treat as watched
                const duration = this.videoElement.duration;
                if (duration && savedTime / duration > 0.95) {
                    if (chrome && chrome.storage && chrome.storage.sync) {
                        chrome.storage.sync.remove(key);
                    } else {
                        window.YPP.StorageManager.remove(key);
                    }
                    return;
                }

                // V4: Cloud Sync UI
                this._showSyncPanel(savedTime);
            }
        } catch (e) {
            this.utils.log?.('Failed to restore time from storage', 'RESUMER', 'warn', e);
        }
    }

    forceSave() {
        if (!this.videoElement || !this.videoId) return;
        
        const currentTime = this.videoElement.currentTime;
        const duration = this.videoElement.duration;
        const key = this.STORAGE_KEY_PREFIX + this.videoId;
        
        try {
            if (duration && (currentTime / duration > 0.95)) {
                if (chrome && chrome.storage && chrome.storage.sync) {
                    chrome.storage.sync.remove(key);
                } else {
                    window.YPP.StorageManager.remove(key);
                }
            } else if (currentTime > 5) {
                if (chrome && chrome.storage && chrome.storage.sync) {
                    chrome.storage.sync.set({ [key]: currentTime.toString() });
                } else {
                    window.YPP.StorageManager.set(key, currentTime.toString());
                }
            }
        } catch (e) {
            // Ignore quota errors during unload
        }
    }

    handleTimeUpdate() {
        // Throttle saves directly in connection with time update to avoid drift bugs
        if (!this.videoElement || !this.videoId) return;
        
        const now = Date.now();
        // Relaxed interval to 10 seconds for performance, relying on pagehide for accuracy
        if (!this.lastSave || now - this.lastSave > 10000) {
            this.forceSave();
            this.lastSave = now;
        }
    }
    
    handleHotkey(e) {
        // Ctrl+B or Cmd+B to bookmark
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            if (!this.videoElement || !this.videoId) return;
            
            const time = this.videoElement.currentTime;
            const key = this.BOOKMARK_KEY_PREFIX + this.videoId + '_' + Math.floor(time);
            
            if (chrome && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.set({ [key]: { time, date: Date.now() } });
            } else {
                window.YPP.StorageManager.set(key, JSON.stringify({ time, date: Date.now() }));
            }
            
            if (this.utils.createToast) {
                this.utils.createToast('Timestamp Bookmarked', 'success');
            }
            this.utils.log?.(`Bookmarked at ${time}s`, 'RESUMER');
            
            // Re-render markers
            this._renderBookmarkMarkers();
        }
    }
    
    // --- V2 Features ---
    
    async _renderBookmarkMarkers() {
        if (!this.videoId || !this.videoElement || !this.videoElement.duration) return;
        
        // Find existing markers and clear them
        document.querySelectorAll('.ypp-bookmark-marker').forEach(el => el.remove());
        
        const progressList = document.querySelector('.ytp-progress-list');
        if (!progressList) return;
        
        let allKeys = [];
        if (chrome && chrome.storage && chrome.storage.sync) {
            const data = await chrome.storage.sync.get(null);
            allKeys = Object.keys(data);
        } else {
            // Mock for non-extension environments
            allKeys = Object.keys(window.localStorage);
        }
        
        const prefix = this.BOOKMARK_KEY_PREFIX + this.videoId;
        allKeys.filter(k => k.startsWith(prefix)).forEach(key => {
            const timePart = key.split('_').pop();
            const time = parseFloat(timePart);
            if (isNaN(time)) return;
            
            const percent = (time / this.videoElement.duration) * 100;
            if (percent > 100 || percent < 0) return;
            
            const marker = document.createElement('div');
            marker.className = 'ypp-bookmark-marker';
            marker.style.cssText = `
                position: absolute;
                left: ${percent}%;
                width: 4px;
                height: 100%;
                background-color: #ffcc00; /* Yellow */
                transform: translateX(-50%);
                z-index: 40;
                cursor: pointer;
            `;
            marker.title = `Bookmark at ${Math.floor(time)}s`;
            marker.onclick = (e) => {
                e.stopPropagation();
                this.videoElement.currentTime = time;
            };
            progressList.appendChild(marker);
        });
    }
    
    async _injectContinueWatchingRow() {
        if (document.getElementById('ypp-continue-watching-row')) return;
        
        let allKeys = [];
        let data = {};
        if (chrome && chrome.storage && chrome.storage.sync) {
            data = await chrome.storage.sync.get(null);
            allKeys = Object.keys(data);
        } else {
            data = window.localStorage;
            allKeys = Object.keys(data);
        }
        
        const resumeItems = allKeys.filter(k => k.startsWith(this.STORAGE_KEY_PREFIX));
        if (resumeItems.length === 0) return;
        
        // V3 Fix: Use pollFor to reliably wait for the grid to render
        try {
            const contents = await this.utils.pollFor(() => {
                const el = document.querySelector('ytd-rich-grid-renderer #contents');
                return el && el.children.length > 0 ? el : null;
            }, 10000, 500);
            
            if (document.getElementById('ypp-continue-watching-row')) return; // double check after polling
            
            const row = document.createElement('div');
            row.id = 'ypp-continue-watching-row';
            row.style.cssText = `
                margin: 24px 0;
                padding: 16px;
                background: var(--yt-spec-10-percent-layer);
                border-radius: 12px;
            `;
            
            let html = `<h2 style="color:var(--yt-spec-text-primary); margin-top:0; font-size:20px; margin-bottom:16px;">▶ Continue Watching</h2><div style="display:flex; gap:16px; overflow-x:auto; padding-bottom:8px;">`;
            
            resumeItems.slice(0, 5).forEach(key => {
                const vidId = key.replace(this.STORAGE_KEY_PREFIX, '');
                const url = `https://www.youtube.com/watch?v=${vidId}`;
                const imgUrl = `https://i.ytimg.com/vi/${vidId}/mqdefault.jpg`;
                
                html += `
                    <a href="${url}" style="text-decoration:none; flex-shrink:0; width:210px;">
                        <div style="position:relative; width:100%; border-radius:8px; overflow:hidden; aspect-ratio:16/9; background:#000;">
                            <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;" />
                            <div style="position:absolute; bottom:0; left:0; height:4px; background:red; width:50%;"></div>
                        </div>
                    </a>
                `;
            });
            
            html += `</div>`;
            row.innerHTML = html;
            
            contents.insertBefore(row, contents.firstChild);
            this.utils.log?.('Injected Continue Watching row', 'RESUMER', 'info');
        } catch (e) {
            this.utils.log?.('Failed to find home page grid for Continue Watching', 'RESUMER', 'warn');
        }
    }
    
    _showSyncPanel(savedTime) {
        if (document.getElementById('ypp-sync-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'ypp-sync-panel';
        panel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: rgba(15, 15, 15, 0.95);
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Roboto, Arial, sans-serif;
            box-shadow: 0 8px 16px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            width: 280px;
        `;
        
        let seconds = 3;
        
        const updateText = () => {
            const mins = Math.floor(savedTime / 60);
            const secs = Math.floor(savedTime % 60).toString().padStart(2, '0');
            panel.innerHTML = `
                <div style="font-weight: 500; font-size: 16px; margin-bottom: 8px; display: flex; align-items: center;">
                    <span style="color: #3ea6ff; margin-right: 8px;">☁️</span> Cloud Sync Detected
                </div>
                <div style="font-size: 13px; margin-bottom: 16px; color: #aaaaaa;">
                    Resuming from ${mins}:${secs} on another device.
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: #ff4e45;">Resuming in ${seconds}s...</span>
                    <button id="ypp-sync-cancel" style="background: transparent; color: #3ea6ff; border: none; font-size: 14px; font-weight: 500; cursor: pointer; text-transform: uppercase;">Cancel</button>
                </div>
            `;
            
            panel.querySelector('#ypp-sync-cancel').onclick = () => {
                clearInterval(interval);
                panel.remove();
                this.utils.log?.('Auto-resume cancelled by user', 'RESUMER', 'info');
            };
        };
        
        updateText();
        document.body.appendChild(panel);
        
        const interval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(interval);
                panel.remove();
                // Context Rewind: Rewind 3 seconds
                const resumeTime = Math.max(0, savedTime - 3);
                this.videoElement.currentTime = resumeTime;
                this.utils.log?.(`Resumed at ${resumeTime}s (rewound 3s)`, 'RESUMER');
                if (this.utils.createToast) this.utils.createToast('Playback Resumed (Cloud Sync)', 'info');
            } else {
                updateText();
            }
        }, 1000);
    }
};

window.YPP.features.VideoResumer = VideoResumer;
