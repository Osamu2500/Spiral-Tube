/**
 * Watch Redesign Feature
 * Handles Glassmorphic Player UI and Sidebar Comments
 */



export class WatchRedesign extends (window.YPP.features.BaseFeature || Object) {
    static featureId = 'watchRedesign';
    static executionPhase = 'sequential-ui';
    static priority = 999;

    constructor() {
        super('WatchRedesign');
        this.configKey = null; // Controlled by multiple settings (glassPlayerUI, sidebarComments)
        this.isWatchPage = false;
        
        // Settings state
        this.glassPlayerEnabled = false;
        this._mountInterval = null; // Track interval
    }

    getConfigKey() { return null; }

    /**
     * Handles enabling/disabling parts of the feature when settings change
     */
    enable() {
        if (!this.settings) return;
        
        try {
            this._injectCSS();
            this._checkRoute();
            
            this.glassPlayerEnabled = !!this.settings.glassPlayerUI;
            
            this._applyFeatures();
        } catch (e) {
            this.utils?.log?.('Error enabling WatchRedesign: ' + e.message, 'WATCH_REDESIGN', 'error');
        }
    }

    onUpdate() {
        this.enable();
    }

    /**
     * Disables all features
     */
    disable() {
        this.glassPlayerEnabled = false;
        if (this._mountInterval) {
            clearInterval(this._mountInterval);
            this._mountInterval = null;
        }
        this._applyFeatures();
        this._cleanup();
        this.cleanupEvents();
    }

    /**
     * Injects the required CSS
     */
    _injectCSS() {
        if (document.getElementById('ypp-watch-redesign-style')) return;
        
        const style = document.createElement('style');
        style.id = 'ypp-watch-redesign-style';
        style.textContent = `
            /* ========================================================
               PHASE 1: GLASS PLAYER UI
               ======================================================== */
            html.ypp-glass-player-active ytd-watch-flexy .html5-video-player {
                border-radius: 16px !important;
                overflow: hidden !important;
                box-shadow: 0 12px 48px rgba(0,0,0,0.5) !important;
            }

            /* Glassmorphic Bottom Control Bar */
            html.ypp-glass-player-active .ytp-chrome-bottom {
                background: rgba(10, 10, 12, 0.6) !important;
                backdrop-filter: blur(12px) !important;
                -webkit-backdrop-filter: blur(12px) !important;
                border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 0 0 16px 16px !important;
                text-shadow: none !important;
                width: 100% !important;
                left: 0 !important;
                padding-left: 12px !important;
                padding-right: 12px !important;
                box-sizing: border-box !important;
            }

            /* Player Controls Hover Glow */
            html.ypp-glass-player-active .ytp-chrome-controls .ytp-button:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 8px !important;
                transform: scale(1.05) !important;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            html.ypp-glass-player-active .ytp-chrome-controls .ytp-button {
                transition: all 0.2s ease !important;
            }

            /* Progress Bar Re-styling */
            html.ypp-glass-player-active .ytp-swatch-background-color {
                background-color: var(--ypp-accent-color, #ff4e45) !important;
            }
            
            html.ypp-glass-player-active .ytp-play-progress {
                background: linear-gradient(90deg, var(--ypp-accent-color, #ff4e45), #ff8a84) !important;
            }

            /* Glassmorphic Menus (Settings, Tooltips) */
            html.ypp-glass-player-active .ytp-popup {
                background: rgba(20, 20, 24, 0.75) !important;
                backdrop-filter: blur(24px) !important;
                -webkit-backdrop-filter: blur(24px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 12px !important;
                box-shadow: 0 16px 40px rgba(0,0,0,0.5) !important;
            }
            html.ypp-glass-player-active .ytp-panel-menu {
                background: transparent !important;
            }

            /* Action Buttons under player (Like, Share, etc.) */
            html:not([data-ypp-ui-style]).ypp-glass-player-active ytd-watch-metadata #actions ytd-button-renderer button,
            html:not([data-ypp-ui-style]).ypp-glass-player-active ytd-watch-metadata #actions ytd-toggle-button-renderer button,
            html:not([data-ypp-ui-style]).ypp-glass-player-active ytd-watch-metadata #actions ytd-download-button-renderer button,
            html:not([data-ypp-ui-style]).ypp-glass-player-active ytd-watch-metadata #actions yt-button-shape button {
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(8px) !important;
                border-radius: 24px !important;
                transition: all 0.2s ease !important;
            }
            
            html:not([data-ypp-ui-style]).ypp-glass-player-active ytd-watch-metadata #actions yt-button-shape button:hover {
                background: rgba(255, 255, 255, 0.15) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            }
            
            /* Watch Metadata Padding & Alignment Fixes */
            html ytd-watch-metadata {
                margin-top: 8px !important;
            }
            html ytd-watch-metadata #top-row {
                margin-top: 8px !important;
            }
            html ytd-watch-metadata #bottom-row {
                margin-top: 8px !important;
            }
            
            /* Download button spacing & native rendering fix */
            html ytd-watch-metadata #actions ytd-download-button-renderer {
                margin-left: 0px !important;
            }
            html ytd-watch-metadata #actions ytd-download-button-renderer yt-button-shape button {
                background-color: var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1)) !important;
                color: var(--yt-spec-text-primary, #fff) !important;
                border-radius: 18px !important;
                padding: 0 16px !important;
                height: 36px !important;
                border: none !important;
            }
            html ytd-watch-metadata #actions ytd-download-button-renderer yt-button-shape button yt-icon {
                fill: var(--yt-spec-text-primary, #fff) !important;
                color: var(--yt-spec-text-primary, #fff) !important;
            }
            html ytd-watch-metadata #actions ytd-download-button-renderer yt-button-shape button:hover {
                background-color: var(--yt-spec-button-chip-background-hover, rgba(255, 255, 255, 0.2)) !important;
            }
            
            /* AI Badge alignment inside actions */
            html #actions .ytd-badge-supported-renderer, 
            html #actions ytd-badge-supported-renderer {
                margin-right: 8px !important;
                display: flex !important;
                align-items: center !important;
                height: 36px !important; /* align with buttons */
                border-radius: 18px !important;
                background-color: var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1)) !important;
                padding: 0 12px !important;
                box-sizing: border-box !important;
                order: -1 !important;
            }

            /* ========================================================
               PHASE 2: SIDEBAR COMMENTS
               ======================================================== */
               
            /* ========================================================
               PHASE 3: LIVE CHAT GLASSMORPHISM
               ======================================================== */
            html.ypp-glass-player-active ytd-live-chat-frame {
                border-radius: 16px !important;
                overflow: hidden !important;
                box-shadow: 0 12px 48px rgba(0,0,0,0.5) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
            }
            
            /* Apply glass to iframe interior by targeting wrapper, but we only have CSS on host.
               YouTube's live chat is an iframe. We can style the container. */
            html.ypp-glass-player-active #chat {
                border-radius: 16px !important;
            }
            
            /* THEATER MODE OVERLAY FOR LIVE CHAT */
            html.ypp-glass-player-active ytd-watch-flexy[flexy][theater] #chat {
                position: absolute !important;
                top: 24px !important;
                right: 24px !important;
                bottom: 120px !important; /* space for controls */
                z-index: 1000 !important;
                background: rgba(10, 10, 12, 0.6) !important;
                backdrop-filter: blur(16px) !important;
                -webkit-backdrop-filter: blur(16px) !important;
                border-radius: 16px !important;
                min-height: 400px !important;
                max-height: calc(100vh - 150px) !important;
                box-shadow: 0 16px 64px rgba(0,0,0,0.6) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                opacity: 0.9 !important;
                transition: opacity 0.3s ease, transform 0.3s ease !important;
            }
            
            html.ypp-glass-player-active ytd-watch-flexy[flexy][theater] #chat:hover {
                opacity: 1 !important;
            }
            
            /* CSS-only Sidebar Comments via CSS Grid and display: contents */
            /* We use :not(:has(...)) so that if any distraction-free mode is active on the body, 
               this custom grid layout is instantly disabled without any JS delay/glitch. */
            
            /* Decrease gap between player/sidebar and topbar */
        `;
        document.head.appendChild(style);
    }

    /**
     * Handles SPA navigation (called by BaseFeature)
     */
    onPageChange(data) {
        this._checkRoute();
    }

    /**
     * Checks if current route is the watch page
     */
    _checkRoute() {
        this.isWatchPage = window.location.pathname === '/watch';
        if (this.isWatchPage) {
            this._applyFeatures();
        } else {
            this._cleanup();
        }
    }

    /**
     * Applies the selected features if on the watch page
     */
    _applyFeatures() {
        if (!this.isWatchPage) return;
        
        // Phase 1: Glass Player UI
        if (this.glassPlayerEnabled) {
            document.documentElement.classList.add('ypp-glass-player-active');
        } else {
            document.documentElement.classList.remove('ypp-glass-player-active');
        }
        
        // Move AI Badge to Actions
        this._moveAIBadge();
    }

    _moveAIBadge() {
        // Clear existing interval if any
        if (this._badgeInterval) {
            clearInterval(this._badgeInterval);
        }
        
        // Attempt to find and move the AI badge periodically
        this._badgeInterval = setInterval(() => {
            const watchMetadata = document.querySelector('ytd-watch-metadata');
            if (!watchMetadata) return;
            
            // Native AI Badge is often rendered right under the title or top-row
            // It has class .ytd-badge-supported-renderer
            // We need to make sure we don't grab generic badges (like "Premium"), so we look for "AI" or specific parent
            const badges = Array.from(watchMetadata.querySelectorAll('ytd-badge-supported-renderer'));
            const aiBadge = badges.find(b => b.textContent.includes('AI') && b.closest('#actions') === null);
            
            const actionsContainer = watchMetadata.querySelector('#actions-inner') || watchMetadata.querySelector('#actions');
            
            if (aiBadge && actionsContainer) {
                // Prepend it to the left of the action buttons
                actionsContainer.insertBefore(aiBadge, actionsContainer.firstChild);
            }
        }, 1000);
    }

    /**
     * Cleans up DOM modifications when leaving watch page
     */
    _cleanup() {
        document.documentElement.classList.remove('ypp-glass-player-active');
        if (this._badgeInterval) {
            clearInterval(this._badgeInterval);
            this._badgeInterval = null;
        }
    }
}

window.YPP.features.WatchRedesign = WatchRedesign;
