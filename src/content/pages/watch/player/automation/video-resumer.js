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
        this.lastSave = null;  // RESUMER-BUG-5: declare properly in constructor
        
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
        } else if (window.location.pathname === '/') {
            this._injectContinueWatchingRow();
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
            // RESUMER-BUG-3: Use this.removeListener for consistency with addListener
            this.removeListener(this.videoElement, 'timeupdate', this.handleTimeUpdate);
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

            let savedTime, duration;
            try {
                const parsed = JSON.parse(savedTimeStr);
                // RESUMER-BUG-4: Support both new {time, duration} format and legacy string format
                if (typeof parsed === 'object' && parsed !== null) {
                    savedTime = parseFloat(parsed.time);
                    duration = parseFloat(parsed.duration) || null;
                } else {
                    savedTime = parseFloat(savedTimeStr);
                    duration = null;
                }
            } catch (_) {
                savedTime = parseFloat(savedTimeStr);
                duration = null;
            }
            
            // Don't seek if we're already close to it or it's within the first 5 seconds
            if (Math.abs(this.videoElement.currentTime - savedTime) > 2 && savedTime > 5) {
                
                // Check if it's near the end (e.g. 95%) - if so, don't resume, treat as watched
                const videoDuration = duration || this.videoElement.duration;
                if (videoDuration && savedTime / videoDuration > 0.95) {
                    if (chrome && chrome.storage && chrome.storage.sync) {
                        chrome.storage.sync.remove(key);
                    } else {
                        window.YPP.StorageManager.remove(key);
                    }
                    return;
                }

                // V4: Cloud Sync UI
                // RESUMER-UP-2: Smart Chapter-Aware Resume
                const smartTime = this._calculateResumeTime(savedTime);
                this._showSyncPanel(savedTime, smartTime);
            }
        } catch (e) {
            this.utils.log?.('Failed to restore time from storage', 'RESUMER', 'warn', e);
        }
    }

    // RESUMER-UP-2: Smart Chapter-Aware Resume
    _calculateResumeTime(savedTime) {
        // Find chapters from description links
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
        let resumeTime = Math.max(0, savedTime - 3); // Default 3s context rewind

        for (let i = sorted.length - 1; i >= 0; i--) {
            const chap = sorted[i];
            if (chap <= savedTime) {
                // If we are within 30s of a chapter start, snap to it
                if (savedTime - chap <= 30) {
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
            if (duration && (currentTime / duration > 0.95)) {
                if (chrome && chrome.storage && chrome.storage.sync) {
                    chrome.storage.sync.remove(key);
                } else {
                    window.YPP.StorageManager.remove(key);
                }
            } else if (currentTime > 5) {
                // RESUMER-BUG-4 & RESUMER-UP-4: Store time, duration, and timestamp
                const saveData = JSON.stringify({ time: currentTime, duration: duration || 0, savedAt: Date.now() });
                if (chrome && chrome.storage && chrome.storage.sync) {
                    chrome.storage.sync.set({ [key]: saveData }, () => this._pruneOldResumes());
                } else {
                    window.YPP.StorageManager.set(key, saveData);
                    this._pruneOldResumes();
                }
            }
        } catch (e) {
            // Ignore quota errors during unload
        }
    }

    // RESUMER-UP-4: Auto-delete old resumes (>50) to prevent storage bloat
    async _pruneOldResumes() {
        try {
            let data = {};
            if (chrome && chrome.storage && chrome.storage.sync) {
                data = await chrome.storage.sync.get(null);
            } else {
                data = window.localStorage;
            }
            
            const keys = Object.keys(data).filter(k => k.startsWith(this.STORAGE_KEY_PREFIX));
            if (keys.length <= 50) return;

            // Sort by savedAt timestamp (oldest first)
            const parsed = keys.map(k => {
                try {
                    const obj = JSON.parse(data[k]);
                    return { key: k, ts: obj.savedAt || 0 };
                } catch {
                    return { key: k, ts: 0 };
                }
            }).sort((a, b) => a.ts - b.ts);

            const toDelete = parsed.slice(0, parsed.length - 50).map(item => item.key);
            
            if (chrome && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.remove(toDelete);
            } else {
                toDelete.forEach(k => window.YPP.StorageManager.remove(k));
            }
            this.utils.log?.(`Pruned ${toDelete.length} old resume entries`, 'RESUMER');
        } catch (e) {}
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
        if (!this.videoElement || !this.videoId) return;

        // RESUMER-UP-3: Shift+B to toggle Bookmark Manager
        if (e.shiftKey && e.key.toLowerCase() === 'b' && !(e.ctrlKey || e.metaKey)) {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
            e.preventDefault();
            this._toggleBookmarkManager();
            return;
        }

        // Ctrl+B or Cmd+B to bookmark
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
            
            // RESUMER-UP-1: Sort by most recent and fetch titles
            const sortedItems = resumeItems.map(key => {
                let ts = 0, p = null;
                try {
                    p = typeof data[key] === 'string' ? JSON.parse(data[key]) : null;
                    ts = p?.savedAt || 0;
                } catch {}
                return { key, ts, p };
            }).sort((a, b) => b.ts - a.ts).slice(0, 5);

            for (const item of sortedItems) {
                const vidId = item.key.replace(this.STORAGE_KEY_PREFIX, '');
                const url = `https://www.youtube.com/watch?v=${vidId}`;
                const imgUrl = `https://i.ytimg.com/vi/${vidId}/mqdefault.jpg`;
                
                let progressWidth = 50;
                const parsed = item.p;
                if (parsed && parsed.time && parsed.duration && parsed.duration > 0) {
                    progressWidth = Math.min(100, Math.round((parsed.time / parsed.duration) * 100));
                }

                // RESUMER-UP-1: Fetch title via oEmbed
                let title = 'YouTube Video';
                try {
                    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
                    if (oembedRes.ok) {
                        const oembedData = await oembedRes.json();
                        title = oembedData.title || title;
                    }
                } catch (e) {}
                
                html += `
                    <a href="${url}" style="text-decoration:none; flex-shrink:0; width:210px; display:flex; flex-direction:column; gap:8px;">
                        <div style="position:relative; width:100%; border-radius:8px; overflow:hidden; aspect-ratio:16/9; background:#000;">
                            <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;" />
                            <div style="position:absolute; bottom:0; left:0; height:4px; background:red; width:${progressWidth}%;"></div>
                        </div>
                        <div style="color:var(--yt-spec-text-primary); font-size:14px; font-weight:500; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${title}</div>
                    </a>
                `;
            }
            
            html += `</div>`;
            row.innerHTML = html;
            
            contents.insertBefore(row, contents.firstChild);
            this.utils.log?.('Injected Continue Watching row', 'RESUMER', 'info');
        } catch (e) {
            this.utils.log?.('Failed to find home page grid for Continue Watching', 'RESUMER', 'warn');
        }
    }
    
    _showSyncPanel(savedTime, smartTime) {
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
            let contextMsg = smartTime < savedTime - 4 ? "(Snapped to chapter)" : "(Rewound 3s for context)";
            panel.innerHTML = `
                <div style="font-weight: 500; font-size: 16px; margin-bottom: 8px; display: flex; align-items: center;">
                    <span style="color: #3ea6ff; margin-right: 8px;">☁️</span> Cloud Sync Detected
                </div>
                <div style="font-size: 13px; margin-bottom: 4px; color: #aaaaaa;">
                    Resuming from ${mins}:${secs} on another device.
                </div>
                <div style="font-size: 11px; margin-bottom: 16px; color: #888;">
                    ${contextMsg}
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
                if (!this.videoElement) return;
                
                this.videoElement.currentTime = smartTime;
                this.utils.log?.(`Resumed at ${smartTime}s`, 'RESUMER');
                if (this.utils.createToast) this.utils.createToast('Playback Resumed', 'info');
            } else {
                updateText();
            }
        }, 1000);
    }

    // RESUMER-UP-3: Bookmark Manager Panel
    async _toggleBookmarkManager() {
        let modal = document.getElementById('ypp-bookmark-modal');
        if (modal) {
            modal.remove();
            return;
        }

        modal = document.createElement('div');
        modal.id = 'ypp-bookmark-modal';
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 400px; max-height: 80vh; background: #212121; color: white;
            border-radius: 12px; z-index: 10000; display: flex; flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8); font-family: Roboto, Arial, sans-serif;
            border: 1px solid #3d3d3d;
        `;

        modal.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid #3d3d3d; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 18px;">🔖 My Bookmarks</h2>
                <button id="ypp-bm-close" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
            <div id="ypp-bm-list" style="padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px;">
                <div style="color: #aaa; text-align: center;">Loading bookmarks...</div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#ypp-bm-close').onclick = () => modal.remove();

        // Fetch bookmarks
        let data = {};
        if (chrome && chrome.storage && chrome.storage.sync) {
            data = await chrome.storage.sync.get(null);
        } else {
            data = window.localStorage;
        }

        const keys = Object.keys(data).filter(k => k.startsWith(this.BOOKMARK_KEY_PREFIX));
        const listEl = modal.querySelector('#ypp-bm-list');
        listEl.innerHTML = '';

        if (keys.length === 0) {
            listEl.innerHTML = `<div style="color: #aaa; text-align: center;">No bookmarks found. Press Ctrl+B while watching to save a moment.</div>`;
            return;
        }

        for (const key of keys) {
            let parsed = null;
            try {
                parsed = typeof data[key] === 'string' ? JSON.parse(data[key]) : data[key];
            } catch {}
            if (!parsed) continue;

            const time = parsed.time;
            const parts = key.replace(this.BOOKMARK_KEY_PREFIX, '').split('_');
            const vidId = parts[0];

            const item = document.createElement('div');
            item.style.cssText = `
                display: flex; align-items: center; justify-content: space-between;
                background: #303030; padding: 12px; border-radius: 8px;
            `;
            
            const mins = Math.floor(time / 60);
            const secs = Math.floor(time % 60).toString().padStart(2, '0');
            const url = `/watch?v=${vidId}&t=${Math.floor(time)}s`;

            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <img src="https://i.ytimg.com/vi/${vidId}/default.jpg" style="width: 60px; border-radius: 4px;" />
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 14px; font-weight: 500;">Timestamp: ${mins}:${secs}</span>
                        <a href="${url}" style="font-size: 12px; color: #3ea6ff; text-decoration: none; margin-top: 4px;" class="ypp-bm-jump">Jump to Video</a>
                    </div>
                </div>
                <button class="ypp-bm-delete" style="background: #ff4e45; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
            `;

            item.querySelector('.ypp-bm-jump').onclick = (e) => {
                if (this.videoId === vidId) {
                    e.preventDefault();
                    this.videoElement.currentTime = time;
                    modal.remove();
                }
            };

            item.querySelector('.ypp-bm-delete').onclick = () => {
                if (chrome && chrome.storage && chrome.storage.sync) {
                    chrome.storage.sync.remove(key);
                } else {
                    window.YPP.StorageManager.remove(key);
                }
                item.remove();
                this._renderBookmarkMarkers();
            };

            listEl.appendChild(item);
        }
    }
};

window.YPP.features.VideoResumer = VideoResumer;
