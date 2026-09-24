import { PopupMusicMode } from './PopupMusicMode.js';

export const PopupDOM = {
    _buildDOM(videoId) {
        // ── Overlay (full-screen transparent sheet, glassmorphism) ──
        this.overlay = document.createElement('div');
        this.overlay.className = 'ytpop-overlay ytpop-overlay--active';
        this.overlay.style.cssText = [
            'position:fixed',
            'inset:0',
            'background:radial-gradient(circle at center, rgba(12,12,18,0.4) 0%, rgba(2,2,6,0.85) 100%)',
            'backdrop-filter:blur(24px) saturate(200%)',
            '-webkit-backdrop-filter:blur(24px) saturate(200%)',
            'z-index:2147483647',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'transition:opacity 0.25s ease',
        ].join(';');

        // Close on background click — respect user setting
        this.overlay.addEventListener('click', async (e) => {
            if (e.target === this.overlay) {
                const data = await chrome.storage.local.get('settings');
                const closePref = data.settings?.closeOnBackdropClick || 'none';
                if (closePref === 'always' || (closePref === 'miniplayer' && this.state.width === 320)) {
                    this.destroy();
                }
            }
        });

        // ── Container (the floating window) ──
        this.container = document.createElement('div');
        this.container.className = 'ytpop-container';
        this.container.style.cssText = [
            'position:absolute',
            'top:0',
            'left:0',
            'pointer-events:auto',
            'display:flex',
            'flex-direction:column',
            `width:${this.state.width}px`,
            `transform:translate(${this.state.x}px,${this.state.y}px)`,
            'will-change:transform',
            'border-radius:16px',
            'overflow:hidden',
            'box-shadow:0 32px 90px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
            'background:rgba(12,12,18,0.25)', // More transparent
            'backdrop-filter:blur(40px) saturate(200%)',
            '-webkit-backdrop-filter:blur(40px) saturate(200%)',
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
            'background:transparent', // Glassmorphic (no solid background)
            'border-bottom:none',
            'overflow:visible',    // allow dropdowns to overflow
        ].join(';');

        // Helper to create buttons
        const createBtn = (icon, label, action) => {
            const btn = document.createElement('button');
            btn.className = 'ytpop-ctrl-btn';
            btn.title = label;
            btn.setAttribute('aria-label', label);
            btn.style.cssText = [
                'display:flex',
                'align-items:center',
                'gap:6px',
                'padding:5px 12px',
                'background:rgba(255,255,255,0.06)',
                'backdrop-filter:blur(12px)',
                'border:1px solid rgba(255,255,255,0.1)',
                'border-radius:20px', // Pill shape
                'color:rgba(255,255,255,0.85)',
                'font-size:12px',
                'font-weight:500',
                'cursor:pointer',
                'transition:background 0.15s ease'
            ].join(';');
            btn.innerHTML = `${icon} <span>${label}</span>`;
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255,255,255,0.12)';
                btn.style.color = '#fff';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(255,255,255,0.06)';
                btn.style.color = 'rgba(255,255,255,0.85)';
            });
            if (action) btn.addEventListener('click', action);
            return btn;
        };

        const watchPageBtn = createBtn(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`, 'Watch page', () => {
            this.destroy();
            window.location.href = `/watch?v=${videoId}`;
        });

        const miniplayerBtn = createBtn(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`, 'Miniplayer', () => this._enterMiniplayer());
        const musicModeBtn = createBtn(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`, 'Music mode', () => this._enterMusicMode());
        const pipBtn = createBtn(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><rect x="12" y="11" width="8" height="4" rx="1" ry="1"></rect></svg>`, 'PiP', () => this._enterPiP());
        
        const spacer = document.createElement('div');
        spacer.style.flex = '1';

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
            'margin-left:8px'
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

        this.topBar.appendChild(watchPageBtn);
        this.topBar.appendChild(miniplayerBtn);
        this.topBar.appendChild(musicModeBtn);
        this.topBar.appendChild(pipBtn);
        this.topBar.appendChild(spacer);
        
        // ── Native Ratio and Size Dropdowns ──
        const createDropdown = (label, options, currentValue, onChange) => {
            const container = document.createElement('div');
            container.className = 'ytpop-custom-dropdown';
            
            const btn = document.createElement('button');
            btn.className = 'ytpop-dropdown-btn ytpop-ctrl-btn';
            btn.style.cssText = 'display:flex;align-items:center;gap:6px;padding:5px 12px;background:rgba(255,255,255,0.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:20px;color:rgba(255,255,255,0.85);font-size:12px;font-weight:500;cursor:pointer;';
            btn.innerHTML = `<span>${label}: </span><strong>${currentValue}</strong> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
            
            const menu = document.createElement('div');
            menu.className = 'ytpop-dropdown-menu';
            
            options.forEach(opt => {
                const item = document.createElement('div');
                item.className = 'ytpop-dropdown-item';
                if (opt == currentValue) item.classList.add('active');
                item.textContent = opt;
                item.addEventListener('click', () => {
                    menu.classList.remove('show');
                    btn.querySelector('strong').textContent = opt;
                    onChange(opt);
                });
                menu.appendChild(item);
            });
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.ytpop-dropdown-menu.show').forEach(m => {
                    if (m !== menu) m.classList.remove('show');
                });
                menu.classList.toggle('show');
            });
            
            container.appendChild(btn);
            container.appendChild(menu);
            return container;
        };

        const ratioDropdown = createDropdown('Ratio', ['16:9', '21:9', '4:3', '1:1', '9:16'], this.state.ratio || '16:9', (val) => {
            this.state.ratio = val;
            chrome.storage.local.set({ popupRatio: val });
            this._applyCustomResize();
        });

        const sizeDropdown = createDropdown('Size', [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0], this.state.size || 1.5, (val) => {
            this.state.size = parseFloat(val);
            chrome.storage.local.set({ popupSize: val });
            this._applyCustomResize();
        });

        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            document.querySelectorAll('.ytpop-dropdown-menu.show').forEach(m => m.classList.remove('show'));
        });

        this.topBar.appendChild(ratioDropdown);
        this.topBar.appendChild(sizeDropdown);
        this.topBar.appendChild(closeBtn);

        // ── Iframe (fills all remaining height) ──
        this.iframe = document.createElement('iframe');
        this.iframe.name = 'ytpop-iframe';
        this.iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen');
        this.iframe.setAttribute('allowfullscreen', 'true');
        this.iframe.style.cssText = [
            'flex:1',              // fills all space below the top bar
            'width:100%',
            'min-height:0',        // CRITICAL: allows flex child to shrink below content size
            'border:none',
            'display:block',
            'background:#000',
            `aspect-ratio: ${(this.state.ratio || '16:9').replace(':', '/')}`,
        ].join(';');
        
        // Use native watch page — popup-player-bridge.js runs inside it (all_frames: true)
        // and handles CSS injection, playback forcing, and postMessage communication.
        const watchUrl = new URL(window.location.origin + `/watch`);
        watchUrl.searchParams.set('v', videoId);
        watchUrl.searchParams.set('ytpop', '1'); // Signal to bridge that it's inside our popup
        this.iframe.src = watchUrl.href;

        // Store videoId for mode switching
        this._videoId = videoId;
        // Auto-switch to 9:16 ratio for Shorts
        const isShorts = window.location.href.includes('/shorts/');
        if (isShorts) {
            this.state.ratio = '9:16';
            if (this.iframe) this.iframe.style.aspectRatio = '9/16';
        }

        // ── Bottom Metadata Bar ──
        this.bottomBar = window.PopupBottomBar.create(this, videoId);

        // ── Music Mode UI ──
        this.musicModeUI = new PopupMusicMode(this);

        // Fetch metadata async
        this._fetchMetadata(videoId);

        // ── Miniplayer Hover Overlay ──
        this.miniHoverOverlay = document.createElement('div');
        this.miniHoverOverlay.className = 'ytpop-mini-hover-overlay';
        
        const miniExpandBtn = document.createElement('button');
        miniExpandBtn.className = 'ytpop-mini-btn';
        miniExpandBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
        miniExpandBtn.onclick = (e) => { e.stopPropagation(); this._exitMiniplayer(); };

        const miniMusicBtn = document.createElement('button');
        miniMusicBtn.className = 'ytpop-mini-btn';
        miniMusicBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
        miniMusicBtn.onclick = (e) => { e.stopPropagation(); this._enterMusicMode(); };

        this.miniHoverOverlay.appendChild(miniExpandBtn);
        this.miniHoverOverlay.appendChild(miniMusicBtn);

        // ── Assemble ──
        this.container.appendChild(this.topBar);
        this.container.appendChild(this.iframe);
        this.container.appendChild(this.bottomBar);
        this.container.appendChild(this.miniHoverOverlay);
        this.container.appendChild(this.musicModeUI.dockRoot);
        this.container.appendChild(this.musicModeUI.maxPanelRoot);
        this._buildResizeHandles();
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);
    },

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
};
