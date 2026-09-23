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
        // Collapse to a small corner window (bottom-right, 320x180)
        const W = 320, H = 180;
        this.state.width  = W;
        this.state.height = H;
        this.state.x = window.innerWidth  - W - 20;
        this.state.y = window.innerHeight - H - 20;
        this.container.style.width  = `${W}px`;
        this.container.style.height = `${H}px`;
        // Hide top bar in miniplayer
        if (this.topBar) this.topBar.style.display = 'none';
        if (this.bottomBar) this.bottomBar.style.display = 'none';
        // Remove backdrop from overlay
        this.overlay.style.background = 'transparent';
        this.overlay.style.backdropFilter = 'none';
        this.overlay.style.webkitBackdropFilter = 'none';
        this.overlay.style.pointerEvents = 'none';
        this.container.style.pointerEvents = 'auto';
        this._applyTransform();
        this._sendToIframe({ command: 'reflow' });
        this._saveState();
    },

    _exitMiniplayer() {
        if (!this.overlay || !this.topBar) return;
        // Restore backdrop
        this.overlay.style.background = 'radial-gradient(circle at center, rgba(12,12,18,0.4) 0%, rgba(2,2,6,0.85) 100%)';
        this.overlay.style.backdropFilter = 'blur(24px) saturate(200%)';
        this.overlay.style.webkitBackdropFilter = 'blur(24px) saturate(200%)';
        this.overlay.style.pointerEvents = '';
        this.container.style.pointerEvents = '';
        this.topBar.style.display = '';
        if (this.bottomBar) this.bottomBar.style.display = '';
        // Center and restore size
        this.state.width  = 640;
        this.state.height = 360;
        this.state.x = Math.round((window.innerWidth  - 640) / 2);
        this.state.y = Math.round((window.innerHeight - 360) / 2);
        this.container.style.width  = `${this.state.width}px`;
        this.container.style.height = `${this.state.height}px`;
        this._applyTransform();
    },

    _enterMusicMode() {
        if (!this.container) return;
        // Collapse to a thin audio bar (560 x 72)
        const W = 560, H = 72;
        this.state.width  = W;
        this.state.height = H;
        this.state.x = Math.round((window.innerWidth  - W) / 2);
        this.state.y = window.innerHeight - H - 24;
        this.container.style.width  = `${W}px`;
        this.container.style.height = `${H}px`;
        // Hide iframe, show only topbar
        if (this.iframe) this.iframe.style.display = 'none';
        if (this.bottomBar) this.bottomBar.style.display = 'none';
        this._applyTransform();
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
        if (!this.state.ratio) this.state.ratio = '16:9';
        if (!this.state.size) this.state.size = 1.5;
        
        const BASE_WIDTH = 400;
        const width = BASE_WIDTH * this.state.size;
        const ratioVal = this._parseRatio(this.state.ratio);
        const chromeHeight = (this.topBar ? this.topBar.offsetHeight : 40) + (this.bottomBar ? this.bottomBar.offsetHeight : 55);
        const height = (width / ratioVal) + chromeHeight;

        this.setSize(width, height);
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
