/**
 * PopupState.js
 *
 * Scope: Popup Player State & Transition Manager
 * Description: Manages dimensions, storage state, and flawless transitions between
 * normal player, miniplayer, and music mode.
 * 
 * NOTE: strictly scoped to the Popup Player feature. It does not affect any
 * unrelated files or core functionality outside its scope.
 */
export const PopupState = {
    _saveState() {
        chrome.storage.local.set({
            ytpopState: {
                x: this.state.x,
                y: this.state.y,
                width: this.state.width,
                height: this.state.height,
                hasBeenMoved: this.state.hasBeenMoved,
            }
        });
    },

    _toggleMaximize() {
        if (!this.state.isMaximized) {
            this.preMaxState = {
                x: this.state.x, y: this.state.y,
                width: this.state.width, height: this.state.height,
            };
            this.state.isMaximized = true;
            this.state.x = 0; this.state.y = 0;
            this.state.width  = window.innerWidth;
            this.state.height = window.innerHeight;
        } else {
            this.state.isMaximized = false;
            if (this.preMaxState) {
                Object.assign(this.state, this.preMaxState);
            }
        }
        if (this.container) {
            this.container.style.width  = `${this.state.width}px`;
            this.container.style.height = `${this.state.height}px`;
            this._applyTransform();
        }
        this._saveState();
    },

    _enterMiniplayer() {
        if (!this.container || !this.overlay) return;
        
        if (!this.state.isMiniplayer && !this.state.isMusicMode) {
            this.savedFullWidth = this.state.width || 640;
            this.savedFullHeight = this.state.height || 360;
        }

        // Clean up Music Mode UI if transitioning from it
        if (this.state.isMusicMode) {
            this.state.isMusicMode = false;
            if (this.musicModeUI) this.musicModeUI.dockRoot.style.display = 'none';
        }

        this.state.isMiniplayer = true;
        this.container.classList.add('is-miniplayer');
        
        // Use miniSize modifier
        const miniScale = this.state.miniSize || 1;
        const W = Math.round(320 * miniScale);
        const H = Math.round(180 * miniScale);
        this.state.width  = W;
        this.state.height = H;
        this.state.x = window.innerWidth  - W - 20;
        this.state.y = window.innerHeight - H - 20;
        this.container.style.width  = `${W}px`;
        this.container.style.height = `${H}px`;
        
        // Hide top bar in miniplayer
        if (this.topBar) this.topBar.style.display = 'none';
        if (this.bottomBar) this.bottomBar.style.display = 'none';
        
        // Show standard iframe (just in case we came from music mode)
        if (this.iframe) {
            this.iframe.style.display = 'block';
            this.iframe.style.position = '';
            this.iframe.style.width = '100%';
            this.iframe.style.height = ''; 
        }

        // Remove backdrop from overlay
        this.overlay.style.background = 'transparent';
        this.overlay.style.backdropFilter = 'none';
        this.overlay.style.webkitBackdropFilter = 'none';
        this.overlay.style.pointerEvents = 'none';
        this.container.style.pointerEvents = 'auto';
        
        // Allow external hover UI to break out of container bounds
        this.container.style.overflow = 'visible';
        if (this.iframe) this.iframe.style.borderRadius = '16px';

        this._applyTransform();
        this._sendToIframe({ command: 'reflow' });
        this._saveState();
    },

    _exitMiniplayer() {
        if (!this.overlay || !this.topBar) return;
        this.state.isMiniplayer = false;
        this.container.classList.remove('is-miniplayer');
        
        // Restore backdrop
        this.overlay.style.background = 'radial-gradient(circle at center, rgba(12,12,18,0.4) 0%, rgba(2,2,6,0.85) 100%)';
        this.overlay.style.backdropFilter = 'blur(24px) saturate(200%)';
        this.overlay.style.webkitBackdropFilter = 'blur(24px) saturate(200%)';
        this.overlay.style.pointerEvents = '';
        this.container.style.pointerEvents = '';
        
        // Restore container overflow and iframe border radius
        this.container.style.overflow = 'hidden';
        if (this.iframe) this.iframe.style.borderRadius = '';

        this.topBar.style.display = 'flex';
        if (this.bottomBar) this.bottomBar.style.display = 'flex';
        
        // Center and restore size
        this.state.width  = this.savedFullWidth || 640;
        this.state.height = this.savedFullHeight || 360;
        this.state.x = Math.round((window.innerWidth  - this.state.width) / 2);
        this.state.y = Math.round((window.innerHeight - this.state.height) / 2);
        this.container.style.width  = `${this.state.width}px`;
        this.container.style.height = `${this.state.height}px`;
        this._applyTransform();
        this._sendToIframe({ command: 'reflow' });
        this._saveState();
    },

    _enterMusicMode() {
        if (!this.container) return;
        
        if (!this.state.isMiniplayer && !this.state.isMusicMode) {
            this.savedFullWidth = this.state.width || 640;
            this.savedFullHeight = this.state.height || 360;
        }

        // Clean up Miniplayer UI if transitioning from it
        if (this.state.isMiniplayer) {
            this.state.isMiniplayer = false;
            this.container.classList.remove('is-miniplayer');
        }

        this.state.isMusicMode = true;
        this.container.classList.add('is-music-mode');
        
        // Collapse to a thin audio bar (dock)
        const W = 480, H = 112;
        this.state.width  = W;
        this.state.height = H;
        
        // Hide standard UI
        if (this.iframe) this.iframe.style.display = 'none';
        if (this.topBar) this.topBar.style.display = 'none';
        if (this.bottomBar) this.bottomBar.style.display = 'none';
        
        // Remove backdrop from overlay
        if (this.overlay) {
            this.overlay.style.background = 'transparent';
            this.overlay.style.backdropFilter = 'none';
            this.overlay.style.webkitBackdropFilter = 'none';
            this.overlay.style.pointerEvents = 'none';
        }
        this.container.style.pointerEvents = 'auto';
        
        // Show Music Dock
        if (this.musicModeUI) {
            this.musicModeUI.dockRoot.style.display = 'flex';
        }
        
        // Position at bottom right
        this.state.x = window.innerWidth - W - 24;
        this.state.y = window.innerHeight - H - 24;
        
        this.container.style.width  = `${W}px`;
        this.container.style.height = `${H}px`;
        this._applyTransform();
        this._saveState();
    },

    _minimizeMusicMode() {
        if (!this.container) return;
        this._enterMusicMode();
    },

    _exitMusicMode() {
        if (!this.container) return;
        this.state.isMusicMode = false;
        this.container.classList.remove('is-music-mode');
        
        // Restore backdrop
        if (this.overlay) {
            this.overlay.style.background = 'radial-gradient(circle at center, rgba(12,12,18,0.4) 0%, rgba(2,2,6,0.85) 100%)';
            this.overlay.style.backdropFilter = 'blur(24px) saturate(200%)';
            this.overlay.style.webkitBackdropFilter = 'blur(24px) saturate(200%)';
            this.overlay.style.pointerEvents = '';
        }
        this.container.style.pointerEvents = '';

        // Hide Music UI
        if (this.musicModeUI) {
            this.musicModeUI.dockRoot.style.display = 'none';
        }
        
        // Show standard UI
        if (this.iframe) {
            this.iframe.style.display = 'block';
            this.iframe.style.position = '';
            this.iframe.style.width = '100%';
            this.iframe.style.height = ''; 
        }
        if (this.topBar) this.topBar.style.display = 'flex';
        if (this.bottomBar) this.bottomBar.style.display = 'flex';
        
        // Center and restore size
        this.state.width  = this.savedFullWidth || 640;
        this.state.height = this.savedFullHeight || 360;
        this.state.x = Math.round((window.innerWidth  - this.state.width) / 2);
        this.state.y = Math.round((window.innerHeight - this.state.height) / 2);
        this.container.style.width  = `${this.state.width}px`;
        this.container.style.height = `${this.state.height}px`;
        this._applyTransform();
        this._sendToIframe({ command: 'reflow' });
        this._saveState();
    },

    _enterPiP() {
        // Tell the bridge script inside the iframe to trigger PiP
        this._sendToIframe({ command: 'pip' });
    },

    _openInWindow() {
        if (!this._videoId) return;
        window.open(`https://www.youtube.com/watch?v=${this._videoId}`, '_blank');
        this.destroy();
    },

    _applyCustomResize() {
        if (this.state.isMiniplayer) {
            const miniScale = this.state.miniSize || 1;
            const W = Math.round(320 * miniScale);
            const H = Math.round(180 * miniScale);
            this.state.width = W;
            this.state.height = H;
            this.state.x = window.innerWidth - W - 20;
            this.state.y = window.innerHeight - H - 20;
            this.container.style.width = `${W}px`;
            this.container.style.height = `${H}px`;
            this._applyTransform();
            this._saveState();
            return;
        }

        if (!this.state.ratio) this.state.ratio = '16:9';
        if (!this.state.size) this.state.size = 1.5;
        
        const BASE_WIDTH = 400;
        const width = BASE_WIDTH * this.state.size;
        
        // Let recalculateHeight handle setting the correct height
        this.state.width = width;
        this._recalculateHeight();
    },

    _recalculateHeight() {
        if (this.state.isMaximized || this.state.isMusicMode || this.state.width === 320) return; // 320 is miniplayer width
        
        const ratioVal = this.state.ratio ? this._parseRatio(this.state.ratio) : (16/9);
        const chromeHeight = (this.topBar ? this.topBar.offsetHeight : 40) + (this.bottomBar ? this.bottomBar.offsetHeight : 120);
        const height = (this.state.width / ratioVal) + chromeHeight;
        
        this.setSize(this.state.width, height);

        // Always perfectly center it when its size changes, acting more like a modal
        this.state.x = Math.round((window.innerWidth  - this.state.width)  / 2);
        this.state.y = Math.round((window.innerHeight - height) / 2);
        this.state.hasBeenMoved = false;
        this._applyTransform();
        this._saveState();
    },

    _extractVideoId(urlStr) {
        try {
            const url = new URL(urlStr);
            if (url.searchParams.has('v')) return url.searchParams.get('v');
            if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2];
            if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2];
            if (url.hostname === 'youtu.be') return url.pathname.slice(1);
        } catch (_) {}
        return null;
    },

    _parseRatio(ratioStr) {
        if (!ratioStr) return 16 / 9;
        const parts = ratioStr.split(':').map(Number);
        if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) return parts[0] / parts[1];
        return 16 / 9;
    }
};
