/**
 * engine.js
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

class SpiralPopupEngine {
    constructor() {
        this.overlay    = null;
        this.container  = null;
        this.iframe     = null;
        this.topBar     = null;
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
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /** Called by custom-ui.js to programmatically resize */
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
        const videoId = this._extractVideoId(url);
        if (!videoId) {
            console.warn('[SpiralEngine] Could not extract video ID from:', url);
            return;
        }

        // Destroy any existing popup first
        if (this.overlay) this.destroy();

        // Load persisted position/size
        const data = await chrome.storage.local.get(['ytpopState', 'popupRatio', 'popupSize']);
        const saved = data.ytpopState;

        // Always start from a known-good width based on popupSize setting
        const baseWidth = 400;
        const sizeMultiplier = data.popupSize ? parseFloat(data.popupSize) : 1.5;
        const ratio = this._parseRatio(data.popupRatio || '16:9');
        this.state.width  = baseWidth * sizeMultiplier;
        this.state.height = this.state.width / ratio;

        if (saved && saved.hasBeenMoved) {
            // User has manually positioned it before — restore that position
            this.state.x = Math.max(0, Math.min(saved.x, window.innerWidth  - this.state.width));
            this.state.y = Math.max(0, Math.min(saved.y, window.innerHeight - this.state.height));
            this.state.hasBeenMoved = true;
        } else {
            // Default: center on screen
            this.state.x = Math.round((window.innerWidth  - this.state.width)  / 2);
            this.state.y = Math.round((window.innerHeight - this.state.height) / 2);
            this.state.hasBeenMoved = false;
        }

        this.state.isMaximized = false;

        this._buildDOM(videoId);
        this._attachPhysics();
        this._startMetadataScraper();

        // Notify custom-ui.js
        setTimeout(() => document.dispatchEvent(new Event('ytpop-ready')), 50);
    }

    destroy() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
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
    }

    // ── DOM Construction ──────────────────────────────────────────────────────

    _buildDOM(videoId) {
        // ── Overlay (full-screen transparent sheet, pointer-events:none) ──
        this.overlay = document.createElement('div');
        this.overlay.className = 'ytpop-overlay';
        this.overlay.style.cssText = [
            'position:fixed',
            'inset:0',
            'z-index:2147483647',
            'pointer-events:none',
            'overflow:hidden',
        ].join(';');

        // ── Container (the floating window) ──
        this.container = document.createElement('div');
        this.container.className = 'ytpop-container';
        this.container.style.cssText = [
            'position:absolute',
            'pointer-events:auto',
            'display:flex',
            'flex-direction:column',
            `width:${this.state.width}px`,
            `height:${this.state.height}px`,
            `transform:translate(${this.state.x}px,${this.state.y}px)`,
            'will-change:transform',
            'border-radius:12px',
            'overflow:hidden',
            'box-shadow:0 24px 80px rgba(0,0,0,0.7),0 4px 16px rgba(0,0,0,0.5)',
            'background:#0c0c10',
            'border:1px solid rgba(255,255,255,0.08)',
        ].join(';');

        // ── Top Bar ──
        this.topBar = document.createElement('div');
        this.topBar.className = 'ytpop-top-bar';
        this.topBar.style.cssText = [
            'display:flex',
            'align-items:center',
            'gap:6px',
            'padding:0 8px',
            'height:40px',
            'min-height:40px',
            'flex-shrink:0',       // CRITICAL: prevent bar from shrinking
            'cursor:move',
            'user-select:none',
            'touch-action:none',
            'background:rgba(10,10,14,0.95)',
            'border-bottom:1px solid rgba(255,255,255,0.07)',
            'overflow:visible',    // allow dropdowns to overflow
        ].join(';');

        // Title
        const titleEl = document.createElement('div');
        titleEl.className = 'ytpop-title';
        titleEl.style.cssText = [
            'flex:1',
            'overflow:hidden',
            'white-space:nowrap',
            'text-overflow:ellipsis',
            'font-size:12px',
            'font-weight:500',
            'color:rgba(255,255,255,0.55)',
            'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
            'pointer-events:none',
        ].join(';');
        titleEl.textContent = 'Spiral Tube Player';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'ytpop-ctrl-btn ytpop-close-btn';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.style.cssText = [
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'width:26px',
            'height:26px',
            'padding:0',
            'flex-shrink:0',
            'background:rgba(220,38,38,0.1)',
            'border:1px solid rgba(220,38,38,0.2)',
            'border-radius:6px',
            'color:rgba(255,100,100,0.7)',
            'cursor:pointer',
            'transition:background 0.15s,color 0.15s',
        ].join(';');
        closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(220,38,38,0.85)';
            closeBtn.style.color = '#fff';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(220,38,38,0.1)';
            closeBtn.style.color = 'rgba(255,100,100,0.7)';
        });
        closeBtn.addEventListener('click', () => this.destroy());

        this.topBar.appendChild(titleEl);
        this.topBar.appendChild(closeBtn);

        // ── Iframe (fills all remaining height) ──
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen');
        this.iframe.setAttribute('allowfullscreen', 'true');
        this.iframe.style.cssText = [
            'flex:1',              // fills all space below the top bar
            'width:100%',
            'min-height:0',        // CRITICAL: allows flex child to shrink below content size
            'border:none',
            'display:block',
            'background:#000',
        ].join(';');
        this.iframe.src = chrome.runtime.getURL(
            `src/content/features/popup-player/popup-player-embed.html?v=${videoId}`
        );

        // ── Assemble ──
        this.container.appendChild(this.topBar);
        this.container.appendChild(this.iframe);
        this._buildResizeHandles();
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);
    }

    _buildResizeHandles() {
        const DIRS = ['n','s','e','w','ne','nw','se','sw'];
        const EDGE = '8px';
        const CORNER = '14px';
        const INSET = '-5px';

        DIRS.forEach(dir => {
            const h = document.createElement('div');
            h.className = `ytpop-resize-handle ytpop-rh-${dir}`;
            h.style.cssText = 'position:absolute;z-index:20;touch-action:none;';

            const isCorner = dir.length === 2;
            const sz = isCorner ? CORNER : EDGE;

            if (dir.includes('n')) { h.style.top    = INSET; h.style.cursor = 'n-resize'; }
            if (dir.includes('s')) { h.style.bottom = INSET; h.style.cursor = 's-resize'; }
            if (dir.includes('e')) { h.style.right  = INSET; h.style.cursor = 'e-resize'; }
            if (dir.includes('w')) { h.style.left   = INSET; h.style.cursor = 'w-resize'; }

            if (!isCorner) {
                if (dir === 'n' || dir === 's') { h.style.width = '100%'; h.style.height = sz; h.style.left = '0'; }
                if (dir === 'e' || dir === 'w') { h.style.height = '100%'; h.style.width = sz; h.style.top = '0'; }
            } else {
                h.style.width  = sz;
                h.style.height = sz;
                if (dir === 'ne' || dir === 'sw') h.style.cursor = 'nesw-resize';
                if (dir === 'nw' || dir === 'se') h.style.cursor = 'nwse-resize';
            }

            h.addEventListener('pointerdown', (e) => this._startResize(e, dir));
            this.container.appendChild(h);
        });
    }

    // ── Physics ───────────────────────────────────────────────────────────────

    _attachPhysics() {
        // Top bar: drag
        this.topBar.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button, .ytpop-dropdown-menu, .ytpop-custom-dropdown')) return;
            e.preventDefault();
            this.state.isDragging = true;
            this.dragOffset.x = e.clientX - this.state.x;
            this.dragOffset.y = e.clientY - this.state.y;
            this.iframe.style.pointerEvents = 'none';
        });

        // Top bar: double-click to maximize/restore
        this.topBar.addEventListener('dblclick', (e) => {
            if (e.target.closest('button, .ytpop-dropdown-menu, .ytpop-custom-dropdown')) return;
            e.preventDefault();
            this._toggleMaximize();
        });

        if (this.physicsController) this.physicsController.abort();
        this.physicsController = new AbortController();
        const signal = this.physicsController.signal;

        document.addEventListener('pointermove',   this._boundPointerMove, { signal });
        document.addEventListener('pointerup',     this._boundPointerUp, { signal });
        document.addEventListener('pointercancel', this._boundPointerUp, { signal });
    }

    _startResize(e, dir) {
        e.preventDefault();
        e.stopPropagation();
        this.state.isResizing = true;
        this.state.resizeDir  = dir;
        this.resizeStart = {
            w: this.state.width,  h: this.state.height,
            startX: this.state.x, startY: this.state.y,
            mouseX: e.clientX,    mouseY: e.clientY,
        };
        this.iframe.style.pointerEvents = 'none';
    }

    _onPointerMove(e) {
        if (this.state.isDragging) {
            let x = e.clientX - this.dragOffset.x;
            let y = e.clientY - this.dragOffset.y;

            // Clamp to viewport
            x = Math.max(0, Math.min(x, window.innerWidth  - this.state.width));
            y = Math.max(0, Math.min(y, window.innerHeight - this.state.height));

            this.state.x = x;
            this.state.y = y;
            this.state.hasBeenMoved = true;
            this._applyTransform();

        } else if (this.state.isResizing) {
            const dx  = e.clientX - this.resizeStart.mouseX;
            const dy  = e.clientY - this.resizeStart.mouseY;
            const dir = this.state.resizeDir;
            const MIN_W = 300;
            const MIN_H = 169;

            let newW = this.resizeStart.w;
            let newH = this.resizeStart.h;
            let newX = this.resizeStart.startX;
            let newY = this.resizeStart.startY;

            if (dir.includes('e')) newW += dx;
            if (dir.includes('s')) newH += dy;
            if (dir.includes('w')) { newW -= dx; if (newW >= MIN_W) newX += dx; }
            if (dir.includes('n')) { newH -= dy; if (newH >= MIN_H) newY += dy; }

            // Corner: lock to 16:9
            if (dir.length === 2) {
                newH = newW / (16 / 9);
                if (dir.includes('n')) {
                    newY = this.resizeStart.startY + (this.resizeStart.h - newH);
                }
            }

            if (newW >= MIN_W) { this.state.width = newW; this.state.x = newX; }
            if (newH >= MIN_H) { this.state.height = newH; this.state.y = newY; }

            this.container.style.width  = `${this.state.width}px`;
            this.container.style.height = `${this.state.height}px`;
            this._applyTransform();
        }
    }

    _onPointerUp() {
        if (this.state.isDragging || this.state.isResizing) {
            this.state.isDragging = false;
            this.state.isResizing = false;
            if (this.iframe) this.iframe.style.pointerEvents = 'auto';
            this._saveState();
        }
    }

    _applyTransform() {
        requestAnimationFrame(() => {
            if (this.container) {
                this.container.style.transform = `translate(${this.state.x}px,${this.state.y}px)`;
            }
        });
    }

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
    }

    // ── Persistence ───────────────────────────────────────────────────────────

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
    }

    // ── Metadata ──────────────────────────────────────────────────────────────

    _startMetadataScraper() {
        if (this.scrapeInterval) clearInterval(this.scrapeInterval);
        this.scrapeInterval = setInterval(() => {
            if (!this.overlay || !this.topBar) { clearInterval(this.scrapeInterval); return; }
            const node = document.querySelector(
                'h1.ytd-watch-metadata yt-formatted-string, h1.title yt-formatted-string'
            );
            if (node) {
                const titleEl = this.topBar.querySelector('.ytpop-title');
                if (titleEl && titleEl.textContent !== node.textContent) {
                    titleEl.textContent = node.textContent;
                }
            }
        }, 1500);
    }

    // ── Event listeners ───────────────────────────────────────────────────────

    _initMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'openPopup' && request.sourceUrl) {
                this.spawn(request.sourceUrl);
                sendResponse({ success: true });
            }
        });
    }

    _initDoubleClickListener() {
        let clickTimer = null;
        let lastTarget = null;
        let isSimulated = false;

        // We must intercept clicks in the capture phase to beat YouTube's SPA router
        document.addEventListener('click', (e) => {
            // Let simulated single-clicks pass through to YouTube
            if (isSimulated || !e.isTrusted) {
                isSimulated = false;
                return;
            }

            // Ignore clicks inside our own popup or if it's a right click
            if (e.target.closest('.ytpop-overlay') || e.button !== 0) return;

            // Are we clicking the video player or a thumbnail?
            const onPlayer = e.target.closest('.html5-video-player') || e.target.closest('video');
            const thumb = e.target.closest('ytd-thumbnail a#thumbnail, a.ytd-thumbnail');

            if (!onPlayer && !thumb) {
                // Not a relevant target, clear any pending timer
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    lastTarget = null;
                }
                return;
            }

            const targetUrl = onPlayer ? window.location.href : thumb.href;
            if (!targetUrl) return;

            // Intercept the click so YouTube doesn't navigate immediately
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Store the original target so we can simulate the click on it later
            const clickedElement = e.target;

            if (clickTimer && lastTarget === clickedElement) {
                // --- DOUBLE CLICK DETECTED ---
                clearTimeout(clickTimer);
                clickTimer = null;
                lastTarget = null;
                this.spawn(targetUrl);
            } else {
                // --- FIRST CLICK DETECTED ---
                // Clear any existing timer for a different target
                if (clickTimer) clearTimeout(clickTimer);
                
                lastTarget = clickedElement;
                
                // Wait 280ms to see if a second click comes
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                    lastTarget = null;
                    // --- SINGLE CLICK CONFIRMED ---
                    // Re-dispatch a click event to let YouTube handle it
                    isSimulated = true;
                    // Note: YouTube's Polymer router usually works fine with element.click()
                    // or dispatching a synthetic MouseEvent.
                    clickedElement.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: e.clientX,
                        clientY: e.clientY
                    }));
                }, 280);
            }
        }, true);
    }

    _initScrollObserver() {
        const tryObserve = () => {
            const el = document.querySelector('#player-container, #ytd-player');
            if (!el) { setTimeout(tryObserve, 2000); return; }

            this.scrollObserver = new IntersectionObserver((entries) => {
                const entry = entries[0];
                chrome.storage.local.get({ autoMiniOnScroll: false }, (data) => {
                    if (data.autoMiniOnScroll && !entry.isIntersecting && !this.overlay) {
                        const vid = document.querySelector('video');
                        if (vid && vid.readyState > 1 && !vid.paused) {
                            this.spawn(window.location.href);
                        }
                    }
                });
            }, { threshold: 0.1 });

            this.scrollObserver.observe(el);
        };
        tryObserve();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    _extractVideoId(urlStr) {
        try {
            const url = new URL(urlStr);
            if (url.searchParams.has('v')) return url.searchParams.get('v');
            if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2];
            if (url.hostname === 'youtu.be') return url.pathname.slice(1);
        } catch (_) {}
        return null;
    }

    _parseRatio(ratioStr) {
        if (!ratioStr) return 16 / 9;
        const parts = ratioStr.split(':').map(Number);
        if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) return parts[0] / parts[1];
        return 16 / 9;
    }
}

// Global singleton
window.spiralPopupEngine = new SpiralPopupEngine();
