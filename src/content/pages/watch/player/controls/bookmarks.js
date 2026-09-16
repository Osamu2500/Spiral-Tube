import '../../../../core/system/base-feature.js';
/**
 * Bookmarks Manager
 * Captures video timestamps and highlights
 */



export class BookmarksManager extends window.YPP.features.BaseFeature {
    static featureId = 'bookmarksManager';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'enableBookmarks'; }

    constructor() {
        super('BookmarksManager');
        this._initConstants();
        this._isActive = false;
        this._captureBtn = null;
    }

    _initConstants() {
        this._CONSTANTS = window.YPP.CONSTANTS || {};
        this._SELECTORS = this._CONSTANTS.SELECTORS || {};
    }

    async disable() {
        this._removeControls();
        super.disable();
    }



    _removeControls() {
        document.querySelectorAll('.ypp-capture-btn').forEach(btn => btn.remove());
    }



    createButton(video) {
        const placement = this.settings?.pb_bookmark || 'front';
        if (placement !== 'front') {
            return null;
        }

        const btn = document.createElement('button');
        btn.className = 'ypp-action-btn ypp-capture-btn';
        btn.title = 'Capture Highlight (Bookmark)';
        btn.setAttribute('aria-label', 'Capture Highlight');
        
        // Standard Material Bookmark SVG (24x24)
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`;
        
        this.addListener(btn, 'click', (e) => {
            e.stopPropagation();
            this._captureHighlight(video);
        });

        this._captureBtn = btn;
        return btn;
    }

    async _captureVideoFrame(video) {
        try {
            const canvas = document.createElement('canvas');
            // Scale down to max 320px width to keep IDB size small
            const maxWidth = 320;
            const scale = Math.min(1, maxWidth / video.videoWidth);
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Return compressed JPEG base64
            return canvas.toDataURL('image/jpeg', 0.6);
        } catch (e) {
            console.warn('[YPP] Failed to capture video frame for bookmark', e);
            return null;
        }
    }

    async _captureHighlight(video) {
        if (!video) return;

        const currentTime = video.currentTime;
        const videoId = new URLSearchParams(window.location.search).get('v') || '';
        const title = this._getVideoTitle();
        
        // Extract caption text
        let transcriptText = this._extractCaptionText();
        if (!transcriptText) {
            transcriptText = "No transcript captured (CC was off or unavailable).";
        }

        const imageBase64 = await this._captureVideoFrame(video);

        const newBookmark = {
            id: 'bm_' + Date.now(),
            videoId: videoId,
            videoTitle: title,
            timestamp: currentTime,
            text: transcriptText,
            image: imageBase64,
            createdAt: Date.now()
        };

        await this._saveBookmark(newBookmark);
        this._showBookmarkIndicator(video);
        this._showToast('Highlight captured!');
    }

    _showBookmarkIndicator(video) {
        const player = video.closest('.html5-video-player');
        if (!player) return;

        let indicator = player.querySelector('.ypp-bookmark-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'ypp-bookmark-indicator';
            indicator.innerHTML = `
                <div style="background: rgba(0,0,0,0.6); border-radius: 50%; padding: 24px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 24 24" width="48" fill="#fff"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                </div>
            `;
            
            Object.assign(indicator.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: '9999',
                display: 'none',
                opacity: '0',
                transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            });
            
            player.appendChild(indicator);
        }

        // Reset and trigger animation
        indicator.style.display = 'block';
        indicator.style.transition = 'none';
        indicator.style.opacity = '0';
        indicator.style.transform = 'translate(-50%, -50%) scale(0.5)';
        
        // Force reflow
        void indicator.offsetWidth;
        
        // Animate in
        indicator.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        indicator.style.opacity = '1';
        indicator.style.transform = 'translate(-50%, -50%) scale(1.5)';
        
        // Animate out
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 200);
        }, 600);
    }

    _getVideoTitle() {
        let titleEl = null;
        const selectors = this._SELECTORS.METADATA_SELECTORS?.TITLE || ['h1.ytd-watch-metadata', '#title h1'];
        for (const selector of selectors) {
            titleEl = document.querySelector(selector);
            if (titleEl && titleEl.textContent) break;
        }
        return titleEl ? titleEl.textContent.trim() : 'Unknown Video';
    }

    _extractCaptionText() {
        // Look for the currently active caption segments
        const captionSelectors = this._SELECTORS.CAPTIONS_WINDOW || ['.ytp-caption-window-bottom', '.ytp-caption-window-top'];
        let fullText = [];
        
        for (const selector of captionSelectors) {
            const containers = document.querySelectorAll(selector);
            containers.forEach(container => {
                // Ensure the container is actually visible
                if (container && container.style.display !== 'none' && getComputedStyle(container).opacity !== '0') {
                    const segments = container.querySelectorAll('.ytp-caption-segment');
                    segments.forEach(seg => {
                        let text = seg.textContent.trim();
                        // Clean up common YouTube accessibility/settings text that might leak into segments
                        text = text.replace(/.*\(auto-generated\).*/gi, '')
                                   .replace(/.*Click for settings.*/gi, '')
                                   .trim();
                        if (text) fullText.push(text);
                    });
                }
            });
        }
        
        let finalText = fullText.join(' ').replace(/\s+/g, ' ').trim();
        return finalText;
    }

    async _saveBookmark(bookmark) {
        if (!window.YPP.IDB) {
            console.error('BookmarksManager: IDB not available');
            return;
        }
        await window.YPP.IDB.set(window.YPP.IDB.STORES.BOOKMARKS, bookmark.id, bookmark);
    }

    _showToast(message) {
        if (this.utils.createToast) {
            this.utils.createToast(message);
        }
    }
};

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.BookmarksManager = BookmarksManager;
