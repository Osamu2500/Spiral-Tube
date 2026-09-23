/**
 * engine/index.js
 *
 * Scope: Pro-Level Native Popup Player Engine — Spiral Tube
 * Description: Scratch-built floating window engine.
 *   - 60fps drag + 8-way resize with aspect-ratio locking on corners
 *   - Centered spawn by default (persists position after first move)
 *   - Correct flex layout: top-bar + iframe fills remaining space
 *   - Double-click video or thumbnail to open
 *   - Real-time video title scraping
 *   - Auto-popup when video scrolls off screen (if setting enabled)
 */

import { PopupDOM } from './PopupDOM.js';
import { PopupPhysics } from './PopupPhysics.js';
import { PopupEvents } from './PopupEvents.js';
import { PopupMetadata } from './PopupMetadata.js';
import { PopupState } from './PopupState.js';
import { PopupBottomBar } from './PopupBottomBar.js';
import { PopupMusicMode } from './PopupMusicMode.js';

window.PopupBottomBar = PopupBottomBar;

class SpiralPopupEngine {
    constructor() {
        this.overlay    = null;
        this.container  = null;
        this.iframe     = null;
        this.topBar     = null;
        this.musicModeUI = null;
        this.scrapeInterval = null;
        this.scrollObserver = null;
        this.physicsController = null;

        // Default state — will be overridden by saved state or centered on first spawn
        this.state = {
            x: 0, y: 0,
            width: 640, height: 360,
            isDragging: false,
            isResizing: false,
            isMaximized: false,
            isMusicMode: false,
            isMusicMaximized: false,
            resizeDir: null,
            hasBeenMoved: false   // track if user has ever moved it
        };

        this.preMaxState  = null;
        this.dragOffset   = { x: 0, y: 0 };
        this.resizeStart  = { w: 0, h: 0, startX: 0, startY: 0, mouseX: 0, mouseY: 0 };

        this._boundPointerMove   = this._onPointerMove.bind(this);
        this._boundPointerUp     = this._onPointerUp.bind(this);

        this._initMessageListener();
        this._initScrollObserver();
        this._initDoubleClickListener();
        this._initHoverButtonListener();
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /** Called programmatically to resize */
    setSize(width, height) {
        this.state.width  = width;
        this.state.height = height;

        // Re-center if it would go off screen
        const maxX = window.innerWidth  - width;
        const maxY = window.innerHeight - height;
        if (this.state.x > maxX) this.state.x = Math.max(0, maxX);
        if (this.state.y > maxY) this.state.y = Math.max(0, maxY);

        if (this.container) {
            this.container.style.width  = `${width}px`;
            this.container.style.height = `${height}px`;
            this._applyTransform();
        }
        this._saveState();
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    async spawn(url) {
        if (this.isSpawning) return;
        this.isSpawning = true;

        if (window.YPP && window.YPP.events) {
            window.YPP.events.emit('app:forceSaveResume');
        }
        
        try {
            const videoId = this._extractVideoId(url);
            if (!videoId) {
                console.warn('[SpiralEngine] Could not extract video ID from:', url);
                return;
            }

            // Destroy any existing popup first
            this.destroy();

            // Load persisted position/size
            const data = await chrome.storage.local.get(['ytpopState', 'popupRatio', 'popupSize']);
            const saved = data.ytpopState;

            // Always start from a known-good width based on popupSize setting
            const baseWidth = 400;
            const sizeMultiplier = data.popupSize ? parseFloat(data.popupSize) : 1.5;
            const ratio = this._parseRatio(data.popupRatio || '16:9');
            
            if (saved && saved.hasBeenMoved && saved.width && saved.height && saved.x !== undefined) {
                this.state.width = saved.width;
                this.state.height = saved.height;
                this.state.x = saved.x;
                this.state.y = saved.y;
                this.state.hasBeenMoved = true;
                
                // Safety check: ensure it's not completely off-screen
                const maxX = window.innerWidth - 50;
                const maxY = window.innerHeight - 50;
                if (this.state.x > maxX) this.state.x = Math.max(0, window.innerWidth - this.state.width);
                if (this.state.y > maxY) this.state.y = Math.max(0, window.innerHeight - this.state.height);
                if (this.state.x < 0) this.state.x = 0;
                if (this.state.y < 0) this.state.y = 0;
            } else {
                this.state.width  = baseWidth * sizeMultiplier;
                this.state.height = (this.state.width / ratio) + 95; // 40px top bar + 55px bottom bar
                this.state.x = Math.round((window.innerWidth  - this.state.width)  / 2);
                this.state.y = Math.round((window.innerHeight - this.state.height) / 2);
                this.state.hasBeenMoved = false;
            }

            this.state.isMaximized = false;
            this.state.isMusicMode = false;
            this.state.isMusicMaximized = false;

            this._buildDOM(videoId);
            this._attachPhysics();
            this._startMetadataScraper();
            
            if (!this.state.hasBeenMoved) {
                // Recalculate true height based on rendered DOM
                this._recalculateHeight();
                
                // Re-center perfectly using actual final height
                this.state.x = Math.round((window.innerWidth  - this.state.width)  / 2);
                this.state.y = Math.round((window.innerHeight - this.state.height) / 2);
            }
            this._applyTransform();
            this._saveState();
        } finally {
            this.isSpawning = false;
        }
    }

    destroy() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        document.querySelectorAll('.ytpop-overlay').forEach(el => el.remove());
        if (this.scrapeInterval) {
            clearInterval(this.scrapeInterval);
            this.scrapeInterval = null;
        }
        if (this.physicsController) {
            this.physicsController.abort();
            this.physicsController = null;
        }

        this.overlay   = null;
        this.container = null;
        this.iframe    = null;
        this.topBar    = null;
        this.musicModeUI = null;
    }

    _sendToIframe(msg) {
        try {
            if (this.iframe?.contentWindow) {
                this.iframe.contentWindow.postMessage(
                    { ...msg, _ytpopBridgeCmd: true },
                    'https://www.youtube.com'
                );
            }
        } catch (_) {}
    }
}

// Mix in all the modular logic to the prototype
Object.assign(SpiralPopupEngine.prototype, PopupDOM, PopupPhysics, PopupEvents, PopupMetadata, PopupState);

// Global singleton
window.spiralPopupEngine = new SpiralPopupEngine();
