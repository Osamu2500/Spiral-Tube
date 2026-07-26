export class SearchFilter extends window.YPP.features.BaseFeature {
    static featureId = 'searchFilter';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('SearchFilter');
        this._boundHandlePageChange = this._handlePageChange.bind(this);
        this._boundInjectButton = this._injectButton.bind(this);
        this._isIframeOpen = false;
    }
    
    getConfigKey() { 
        return 'autoVideoFilter'; // Can be decoupled later
    }

    async enable() {
        await super.enable();
        window.YPP.events?.on('app:pageChange', this._boundHandlePageChange);
        this._handlePageChange();
        
        // Also try to inject the button whenever the page updates
        this.addListener(window, 'yt-page-data-updated', this._boundInjectButton);
    }

    async disable() {
        await super.disable();
        window.YPP.events?.off('app:pageChange', this._boundHandlePageChange);
        if (this._btnContainer) {
            this._btnContainer.remove();
            this._btnContainer = null;
        }
        if (this._iframeHost) {
            this._iframeHost.remove();
            this._iframeHost = null;
        }
    }

    _handlePageChange() {
        if (!this.isEnabled) return;
        if (!window.location.pathname.startsWith('/results')) {
            if (this._btnContainer) this._btnContainer.style.display = 'none';
            if (this._iframeHost) this._iframeHost.style.display = 'none';
            return;
        }
        
        if (this._btnContainer) this._btnContainer.style.display = 'flex';
        this._injectButton();
    }
    
    _injectButton() {
        return; // User directive: completely remove ypp filter bar from search result page
    }
    
    _injectButtonLegacy() {
        this._btnContainer.id = 'ypp-search-filter-btn';
        this._btnContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-left: 8px;
            cursor: pointer;
            padding: 0 16px;
            height: 36px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.1);
            color: var(--yt-spec-text-primary, #fff);
            font-size: 1.4rem;
            font-weight: 500;
            font-family: "Roboto","Arial",sans-serif;
            transition: background-color 0.2s;
        `;
        
        this._btnContainer.innerHTML = `
            <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 6px; fill: currentColor;">
                <path d="M3 4c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v2.59c0 .26-.1.52-.29.71L15 13.17V19c0 .35-.2.68-.51.86l-4 2.29A.996.996 0 0 1 9 21.3V13.17L3.29 7.3A.996.996 0 0 1 3 6.59V4z"></path>
            </svg>
            YPP Filters
        `;
        
        this._btnContainer.addEventListener('mouseenter', () => {
            this._btnContainer.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        this._btnContainer.addEventListener('mouseleave', () => {
            this._btnContainer.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        this._btnContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this._toggleIframe();
        });
        
        if (filterMenu.parentNode) {
            filterMenu.parentNode.insertBefore(this._btnContainer, filterMenu.nextSibling);
        }
    }
    
    _toggleIframe() {
        if (this._isIframeOpen) {
            if (this._iframeHost) this._iframeHost.style.display = 'none';
            this._isIframeOpen = false;
        } else {
            this._showIframe();
            this._isIframeOpen = true;
        }
    }
    
    _showIframe() {
        if (!this._iframeHost) {
            this._iframeHost = document.createElement('div');
            this._iframeHost.style.cssText = `
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                width: 400px;
                height: 600px;
                background: #222;
                border: 1px solid #3a3a3a;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                z-index: 9999;
                overflow: hidden;
            `;
            
            const iframe = document.createElement('iframe');
            iframe.src = chrome.runtime.getURL('src/popup/popup.html') + '?tab=Filters';
            iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 12px;';
            
            this._iframeHost.appendChild(iframe);
            
            // Relative position container
            if (this._btnContainer) {
                this._btnContainer.style.position = 'relative';
                this._btnContainer.appendChild(this._iframeHost);
            }
            
            document.addEventListener('click', (e) => {
                if (this._isIframeOpen && !this._iframeHost.contains(e.target) && !this._btnContainer.contains(e.target)) {
                    this._iframeHost.style.display = 'none';
                    this._isIframeOpen = false;
                }
            });
        }
        
        this._iframeHost.style.display = 'block';
    }
};

window.YPP.features.SearchFilter = SearchFilter;
