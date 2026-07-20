export class CopyLinkButton extends window.YPP.features.BaseFeature {
    static featureId = 'copyLinkButton';
    static executionPhase = 'idle';
    static priority = 100;

    constructor() {
        super('CopyLinkButton');
    }

    getConfigKey() { return 'copyLinkButton'; }

    async enable() {
        await super.enable();
        this._injectStyles();
        
        // Use event-driven dom:mutated to handle recycling instead of setInterval
        if (this.events) {
            // Debounce the processing to avoid doing it on every micro-mutation
            this._processDebounced = this.utils.debounce(() => {
                if (!this.isEnabled) return;
                const nodes = document.querySelectorAll('ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-grid-media, ytd-playlist-video-renderer, ytd-grid-video-renderer');
                this._processNodes(Array.from(nodes));
            }, 300);
            
            // Tell DOMObserver we are listening so it emits the event
            if (window.YPP.sharedObserver && window.YPP.sharedObserver.setHasMutatedListeners) {
                window.YPP.sharedObserver.setHasMutatedListeners(true);
            }
            this.addListener(this.events, 'dom:mutated', this._processDebounced);
            
            // Initial run
            this._processDebounced();
        }
    }

    async disable() {
        await super.disable();
        document.querySelectorAll('.ypp-copy-link-btn').forEach(btn => btn.remove());
    }

    _processNodes(nodes) {
        if (!this.isEnabled) return;
        
        nodes.forEach(node => {
            // Find the action menu container
            const menuContainer = node.querySelector('#menu');
            if (!menuContainer) return;
            
            // If button already exists in this menu, skip
            if (menuContainer.querySelector('.ypp-copy-link-btn')) return;
            
            const btn = document.createElement('button');
            btn.className = 'ypp-copy-link-btn';
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>`;
            btn.title = "Copy Link";
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Dynamically fetch href to handle recycled video elements
                const linkEl = node.querySelector('a#video-title') || node.querySelector('a#video-title-link') || node.querySelector('a.yt-simple-endpoint[href^="/watch"]');
                
                if (linkEl && linkEl.href) {
                    let cleanUrl = linkEl.href;
                    // Strip tracking parameters
                    try {
                        const urlObj = new URL(cleanUrl);
                        urlObj.searchParams.delete('si');
                        urlObj.searchParams.delete('pp');
                        cleanUrl = urlObj.toString();
                    } catch(err) {}
                    
                    navigator.clipboard.writeText(cleanUrl).then(() => {
                        // Show native toast
                        if (window.YPP?.Utils?.createToast) {
                            window.YPP.Utils.createToast('Link copied to clipboard!', 'success');
                        }
                        btn.classList.add('copied');
                        setTimeout(() => btn.classList.remove('copied'), 2000);
                    });
                }
            });
            
            // Remove inline style manipulation to prevent breaking YouTube's native hover rules
            // Place inside #menu, before the three-dots renderer if it exists
            const menuRenderer = menuContainer.querySelector('ytd-menu-renderer');
            if (menuRenderer) {
                menuContainer.insertBefore(btn, menuRenderer);
            } else {
                menuContainer.appendChild(btn);
            }
        });
    }

    _injectStyles() {
        if (document.getElementById('ypp-copy-link-css')) return;
        const style = document.createElement('style');
        style.id = 'ypp-copy-link-css';
        style.textContent = `
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
                transition: background-color 0.2s, color 0.2s;
                margin-right: 4px;
                vertical-align: middle;
            }
            .ypp-copy-link-btn svg {
                width: 24px;
                height: 24px;
            }
            .ypp-copy-link-btn:hover {
                background-color: var(--yt-spec-badge-chip-background, rgba(0, 0, 0, 0.1));
                color: var(--yt-spec-text-primary, #0f0f0f);
            }
            [dark] .ypp-copy-link-btn:hover {
                background-color: var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1));
                color: var(--yt-spec-text-primary, #f1f1f1);
            }
            .ypp-copy-link-btn.copied {
                color: #4CAF50 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

window.YPP.features.CopyLinkButton = CopyLinkButton;
