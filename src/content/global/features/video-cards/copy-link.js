import '../../../core/system/base-feature.js';
export class CopyLinkButton extends window.YPP.features.BaseFeature {
    static featureId = 'copyLinkButton';
    static executionPhase = 'idle';
    static priority = 100;

    constructor() {
        super('CopyLinkButton');
    }

    getConfigKey() { return 'copyLinkButton'; }

    /** Per-page toggle check */
    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        const s = this.settings || {};

        if (path === '/' || path === '/index') return s.copyLinkHome !== false;

        if (path.startsWith('/@') || path.startsWith('/channel/') ||
            path.startsWith('/user/') || path.startsWith('/c/')) {
            return s.copyLinkChannel !== false;
        }

        if (path.startsWith('/feed/subscriptions')) return s.copyLinkSubs !== false;
        if (path.startsWith('/results'))            return s.copyLinkSearch !== false;
        if (path.startsWith('/watch'))              return s.copyLinkRelated !== false;

        return true;
    }

    async enable() {
        await super.enable();
        this._injectStyles();
        
        if (this.events) {
            this._processDebounced = this.utils.debounce(() => {
                if (!this.isEnabled) return;
                const nodes = document.querySelectorAll('ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-grid-media, ytd-playlist-video-renderer, ytd-grid-video-renderer, ytd-watch-metadata, ytd-reel-item-renderer, ytd-reel-video-renderer, ytd-rich-item-renderer');
                this._processNodes(Array.from(nodes));
            }, 300);
            
            if (window.YPP.sharedObserver && window.YPP.sharedObserver.setHasMutatedListeners) {
                window.YPP.sharedObserver.setHasMutatedListeners(true);
            }
            this.addListener(this.events, 'dom:mutated', this._processDebounced);
            
            this._processDebounced();
        }
    }

    async disable() {
        await super.disable();
        document.querySelectorAll('.ypp-copy-link-btn').forEach(btn => btn.remove());
    }

    _createButton(node) {
        const btn = document.createElement('button');
        btn.className = 'ypp-copy-link-btn';
        // Icon for link
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>`;
        btn.title = "Copy Link\nShift + Click: Include Timestamp\nCtrl + Click: Markdown Format";
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Fetch href based on node context
            let linkEl = node.querySelector('a#video-title') || node.querySelector('a#video-title-link') || node.querySelector('a#thumbnail') || node.querySelector('a.yt-simple-endpoint[href^="/watch"]');
            let cleanUrl = window.location.href; // Default to current URL (e.g. watch page)
            
            if (linkEl && linkEl.href) {
                cleanUrl = linkEl.href;
            }
            
            if (cleanUrl) {
                try {
                    const urlObj = new URL(cleanUrl);
                    urlObj.searchParams.delete('si');
                    urlObj.searchParams.delete('pp');
                    
                    // Add Timestamp if Shift + Click
                    if (e.shiftKey) {
                        const videoEl = document.querySelector('video');
                        // Only add timestamp if on the watch page or we can easily get it
                        if (videoEl && window.location.pathname.startsWith('/watch')) {
                            const time = Math.floor(videoEl.currentTime);
                            urlObj.searchParams.set('t', time + 's');
                        }
                    }
                    cleanUrl = urlObj.toString();
                } catch(err) {}
                
                let finalCopyString = cleanUrl;
                let successMessage = 'Link copied to clipboard!';
                
                // Markdown Format if Ctrl + Click
                if (e.ctrlKey || e.metaKey) {
                    let title = "YouTube Video";
                    const titleEl = node.querySelector('#title, #video-title, .title, span#video-title');
                    if (titleEl && titleEl.textContent) {
                        title = titleEl.textContent.trim();
                    } else if (window.location.pathname.startsWith('/watch')) {
                        title = document.title.replace(' - YouTube', '');
                    }
                    finalCopyString = `[${title}](${cleanUrl})`;
                    successMessage = 'Markdown link copied!';
                }
                
                navigator.clipboard.writeText(finalCopyString).then(() => {
                    if (window.YPP?.Utils?.createToast) {
                        window.YPP.Utils.createToast(successMessage, 'success');
                    }
                    btn.classList.add('copied');
                    setTimeout(() => btn.classList.remove('copied'), 2000);
                });
            }
        });
        return btn;
    }

    _processNodes(nodes) {
        if (!this.isEnabled) return;
        
        if (!this._shouldRunOnCurrentPage()) {
            document.querySelectorAll('.ypp-copy-link-btn').forEach(btn => btn.remove());
            return;
        }
        
        nodes.forEach(node => {
            // Watch Page Player Action Menu
            if (node.tagName.toLowerCase() === 'ytd-watch-metadata') {
                const menuRenderer = node.querySelector('ytd-menu-renderer');
                if (!menuRenderer || node.querySelector('.ypp-copy-link-btn.watch-page')) return;
                const btn = this._createButton(node);
                btn.classList.add('watch-page');
                menuRenderer.parentElement.insertBefore(btn, menuRenderer);
                return;
            }

            // Shorts Shelves & Player
            if (node.tagName.toLowerCase() === 'ytd-reel-item-renderer' || node.tagName.toLowerCase() === 'ytd-reel-video-renderer') {
                const menuRenderer = node.querySelector('ytd-menu-renderer') || node.querySelector('ytd-shorts-player-controls');
                if (!menuRenderer || node.querySelector('.ypp-copy-link-btn')) return;
                const btn = this._createButton(node);
                if (node.tagName.toLowerCase() === 'ytd-reel-item-renderer') {
                    // Option A for short cards -> inject into thumbnail
                    const overlays = node.querySelector('ytd-thumbnail #overlays');
                    if (overlays) {
                        btn.classList.add('thumbnail-overlay');
                        overlays.appendChild(btn);
                    }
                } else {
                    menuRenderer.parentElement.insertBefore(btn, menuRenderer);
                }
                return;
            }

            // Regular Video Cards (Option A: Thumbnail Overlay)
            const thumbnail = node.querySelector('ytd-thumbnail');
            if (thumbnail) {
                const overlays = thumbnail.querySelector('#overlays');
                if (!overlays || thumbnail.querySelector('.ypp-copy-link-btn.thumbnail-overlay')) return;

                const btn = this._createButton(node);
                btn.classList.add('thumbnail-overlay');
                overlays.appendChild(btn);
            }
        });
    }

    _injectStyles() {
        if (document.getElementById('ypp-copy-link-css')) return;
        const style = document.createElement('style');
        style.id = 'ypp-copy-link-css';
        style.textContent = `
            /* Default/Watch page button styling */
            .ypp-copy-link-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: var(--yt-spec-icon-inactive, #909090);
                transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s, color 0.2s, opacity 0.2s;
                margin-right: 4px;
                vertical-align: middle;
                z-index: 10;
            }
            .ypp-copy-link-btn svg {
                width: 24px;
                height: 24px;
                transition: transform 0.2s ease;
            }
            .ypp-copy-link-btn.watch-page:hover {
                background-color: var(--yt-spec-badge-chip-background, rgba(0, 0, 0, 0.1));
                color: var(--yt-spec-text-primary, #0f0f0f);
            }
            [dark] .ypp-copy-link-btn.watch-page:hover {
                background-color: var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1));
                color: var(--yt-spec-text-primary, #f1f1f1);
            }
            
            /* THUMBNAIL OVERLAY (Option A) Styling */
            .ypp-copy-link-btn.thumbnail-overlay {
                position: absolute;
                top: 4px;
                left: 4px;
                margin: 0;
                padding: 4px;
                width: 28px;
                height: 28px;
                background-color: rgba(0, 0, 0, 0.8);
                color: #fff;
                border-radius: 4px;
                opacity: 0;
                pointer-events: none; /* Let hover pass through when hidden */
            }
            .ypp-copy-link-btn.thumbnail-overlay svg {
                width: 18px;
                height: 18px;
            }
            /* Show on hover of the video thumbnail */
            ytd-thumbnail:hover .ypp-copy-link-btn.thumbnail-overlay,
            ytd-reel-item-renderer:hover .ypp-copy-link-btn.thumbnail-overlay {
                opacity: 1;
                pointer-events: auto;
            }
            .ypp-copy-link-btn.thumbnail-overlay:hover {
                background-color: rgba(0, 0, 0, 0.95);
                color: #3ea6ff; /* YouTube Blue */
                transform: scale(1.1);
            }

            /* Animations and States */
            .ypp-copy-link-btn:active {
                transform: scale(0.85);
            }
            .ypp-copy-link-btn.copied {
                color: #4CAF50 !important;
                background-color: rgba(76, 175, 80, 0.1) !important;
            }
            .ypp-copy-link-btn.thumbnail-overlay.copied {
                background-color: rgba(0, 0, 0, 0.95) !important;
            }
            .ypp-copy-link-btn.copied svg {
                transform: scale(1.15) rotate(-5deg);
            }
        `;
        document.head.appendChild(style);
    }
}

window.YPP.features.CopyLinkButton = CopyLinkButton;
