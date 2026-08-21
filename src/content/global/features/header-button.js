export class HeaderButton extends window.YPP.features.BaseFeature {
    static instance = null;

    constructor() {
        super({
            id: 'header-button',
            name: 'Header Settings Button',
            description: 'Injects a quick-access settings gear into the YouTube masthead.',
            category: 'global',
            settings: [
                { id: 'enableHeaderButton', type: 'boolean', defaultValue: true }
            ]
        });
        
        HeaderButton.instance = this;

        this.headerButtonHost = null;
        this.headerButtonElement = null;
        this.headerDropdownHost = null;
        this.headerDropdownShadow = null;
        this.headerDropdownOpen = false;
        this.headerDropdownResizeHandler = null;
        this.headerDropdownReadyPromise = null;

        // Keep track of DOM events for cleanup
        this._documentClickHandler = this.onHeaderDocumentClick.bind(this);
        this._documentKeydownHandler = this.onHeaderDocumentKeydown.bind(this);
    }

    init() {
        if (!this.settings.enableHeaderButton) return;
        this.createHeaderButton();
    }

    enable() {
        if (!this.settings.enableHeaderButton) return;
        this.createHeaderButton();
    }

    disable() {
        this.removeHeaderButton();
    }

    // React to URL changes (SPA navs) by ensuring button stays alive
    onNavigate() {
        if (this.settings.enableHeaderButton) {
            this.createHeaderButton();
        }
    }

    getHeaderButtonCSS() {
        return `
            .yh-header-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                margin-right: 8px;
                padding: 0;
                border: none;
                border-radius: 50%;
                background: transparent;
                color: var(--yt-spec-text-secondary, #909090);
                cursor: pointer;
                outline: none;
                transition: background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
            }
            .yh-header-btn:hover {
                background: var(--yt-spec-10-percent-layer, rgba(0, 0, 0, 0.06));
            }
            .yh-header-btn.active {
                box-shadow: 0 0 0 2px #8ab4f8;
            }
            .yh-header-btn-icon {
                width: 22px;
                height: 22px;
                display: block;
                fill: currentColor;
                pointer-events: none;
            }
        `;
    }

    getHeaderDropdownCSS() {
        return `
            .yh-dropdown-card {
                position: fixed;
                display: flex;
                background: #111111;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                overflow: hidden;
                z-index: 2147483640;
                /* Add a subtle backdrop blur matching the popup theme */
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
            }
            .yh-dropdown-iframe {
                width: 100%;
                height: 100%;
                border: none;
                display: block;
                background: transparent;
            }
        `;
    }

    getHeaderButtonIconMarkup() {
        // SVG icon for the gear
        return `
            <svg class="yh-header-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.484.484 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.47.47 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58ZM12 15.6A3.61 3.61 0 0 1 8.4 12c0-1.98 1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6Z"/>
            </svg>
        `;
    }

    createHeaderButton() {
        if (this.headerButtonHost && this.headerButtonHost.isConnected) return;

        const anchor = document.querySelector('ytd-masthead #end #buttons');
        if (!anchor) {
            // Masthead not ready, retry slightly later
            setTimeout(() => this.createHeaderButton(), 500);
            return;
        }

        this.headerButtonHost = document.createElement('span');
        this.headerButtonHost.id = 'ypp-header-button-host';

        const shadow = this.headerButtonHost.attachShadow({ mode: 'closed' });

        const style = document.createElement('style');
        style.textContent = this.getHeaderButtonCSS();
        shadow.appendChild(style);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'yh-header-btn';
        button.setAttribute('aria-label', 'Spiral Tube Settings');
        button.title = 'Spiral Tube Settings';
        button.innerHTML = this.getHeaderButtonIconMarkup();

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleHeaderDropdown();
        });

        shadow.appendChild(button);
        anchor.insertBefore(this.headerButtonHost, anchor.firstChild);

        this.headerButtonElement = button;
    }

    removeHeaderButton() {
        this.closeHeaderDropdown();
        if (this.headerButtonHost) {
            this.headerButtonHost.remove();
        }
        this.headerButtonHost = null;
        this.headerButtonElement = null;
    }

    toggleHeaderDropdown() {
        if (this.headerDropdownOpen) {
            this.closeHeaderDropdown();
        } else {
            this.openHeaderDropdown();
        }
    }

    positionHeaderDropdown(card) {
        if (!this.headerButtonElement) return;
        
        // Define dropdown constraints
        const GAP = 8;
        const EDGE_PAD = 8;
        const WIDTH = 450; // Increased width for the new glassmorphic popup
        const MAX_HEIGHT = 700;

        const rect = this.headerButtonElement.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let left = rect.right - WIDTH;
        left = Math.max(EDGE_PAD, Math.min(left, vw - WIDTH - EDGE_PAD));

        const top = rect.bottom + GAP;
        const spaceBelow = vh - top - EDGE_PAD;
        const height = Math.max(1, Math.min(MAX_HEIGHT, spaceBelow));

        Object.assign(card.style, {
            left: left + 'px',
            top: top + 'px',
            width: WIDTH + 'px',
            height: height + 'px',
        });
    }

    onHeaderDropdownResize() {
        if (!this.headerDropdownOpen || !this.headerDropdownShadow) return;
        const card = this.headerDropdownShadow.querySelector('.yh-dropdown-card');
        if (card) this.positionHeaderDropdown(card);
    }

    onHeaderDocumentClick(e) {
        // If the click is inside the dropdown or the button, ignore it.
        // But since they are in shadow DOMs, the target might be the host.
        const isClickInButton = this.headerButtonHost && (e.target === this.headerButtonHost || this.headerButtonHost.contains(e.target));
        const isClickInDropdown = this.headerDropdownHost && (e.target === this.headerDropdownHost || this.headerDropdownHost.contains(e.target));
        
        // If tutorial is active, we don't close the dropdown
        if (window._yppTutorialActive) return;
        
        if (this.headerDropdownOpen && !isClickInButton && !isClickInDropdown) {
            this.closeHeaderDropdown();
        }
    }

    onHeaderDocumentKeydown(e) {
        if (window._yppTutorialActive) return;
        if (e.key === 'Escape' && this.headerDropdownOpen) {
            this.closeHeaderDropdown();
        }
    }

    openHeaderDropdown() {
        if (this.headerDropdownOpen || !this.headerButtonElement) return;
        this.headerDropdownOpen = true;

        this.headerDropdownHost = document.createElement('div');
        this.headerDropdownHost.id = 'ypp-header-dropdown-host';

        this.headerDropdownShadow = this.headerDropdownHost.attachShadow({ mode: 'closed' });

        const style = document.createElement('style');
        style.textContent = this.getHeaderDropdownCSS();
        this.headerDropdownShadow.appendChild(style);

        const card = document.createElement('div');
        card.className = 'yh-dropdown-card';

        const iframe = document.createElement('iframe');
        iframe.className = 'yh-dropdown-iframe';
        card.appendChild(iframe);

        this.headerDropdownShadow.appendChild(card);
        document.body.appendChild(this.headerDropdownHost);

        this.positionHeaderDropdown(card);
        this.headerButtonElement.classList.add('active');

        this.headerDropdownReadyPromise = new Promise(resolve => {
            iframe.addEventListener(
                'load',
                () => requestAnimationFrame(() => resolve()),
                { once: true },
            );
        });
        
        // Load the popup html standalone inside the iframe
        iframe.src = chrome.runtime.getURL('src/popup/popup.html?standalone=true');

        document.addEventListener('click', this._documentClickHandler);
        document.addEventListener('keydown', this._documentKeydownHandler);
        
        this.headerDropdownResizeHandler = this.onHeaderDropdownResize.bind(this);
        window.addEventListener('resize', this.headerDropdownResizeHandler);
    }

    closeHeaderDropdown() {
        if (!this.headerDropdownOpen) return;
        this.headerDropdownOpen = false;

        document.removeEventListener('click', this._documentClickHandler);
        document.removeEventListener('keydown', this._documentKeydownHandler);
        
        if (this.headerDropdownResizeHandler) {
            window.removeEventListener('resize', this.headerDropdownResizeHandler);
            this.headerDropdownResizeHandler = null;
        }

        if (this.headerDropdownHost) {
            this.headerDropdownHost.remove();
            this.headerDropdownHost = null;
        }
        this.headerDropdownShadow = null;
        this.headerDropdownReadyPromise = null;
        
        if (this.headerButtonElement) {
            this.headerButtonElement.classList.remove('active');
        }
    }

    // --- Tutorial Integration Helpers ---
    getButtonElement() {
        return this.headerButtonElement;
    }

    getDropdownRect() {
        if (!this.headerDropdownShadow) return null;
        const card = this.headerDropdownShadow.querySelector('.yh-dropdown-card');
        return card ? card.getBoundingClientRect() : null;
    }

    postMessageToDropdown(msg) {
        if (!this.headerDropdownShadow) return;
        const iframe = this.headerDropdownShadow.querySelector('.yh-dropdown-iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg, '*');
        }
    }

    setInteractive(interactive) {
        if (this.headerButtonHost) {
            this.headerButtonHost.style.pointerEvents = interactive ? 'auto' : 'none';
        }
        if (this.headerDropdownHost) {
            this.headerDropdownHost.style.pointerEvents = interactive ? 'auto' : 'none';
        }
    }
}
