import '../../../../core/system/base-feature.js';

/**
 * @fileoverview
 * Watch Redesign Feature
 * 
 * Target: /watch route.
 * Purpose: Handles Glassmorphic Player UI.
 */
export class WatchRedesign extends (window.YPP.features.BaseFeature || Object) {
    static featureId = 'watchRedesign';
    static executionPhase = 'sequential-ui';
    static priority = 999;

    constructor() {
        super('WatchRedesign');
        this.configKey = null; // Controlled by multiple settings
        this.isWatchPage = false;
        
        // Settings state
        this.glassPlayerEnabled = false;
        this._mountInterval = null;
    }

    getConfigKey() { return null; }

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

    disable() {
        this.glassPlayerEnabled = false;
        if (this._mountInterval) {
            clearInterval(this._mountInterval);
            this._mountInterval = null;
        }
        this._applyFeatures();
        this._cleanup();
        
        // Completely destroy the style tag on disable to prevent zombie CSS
        document.getElementById('ypp-watch-redesign-style')?.remove();
        
        this.cleanupEvents();
    }

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
            html.ypp-glass-player-active ytd-watch-metadata #actions :is(ytd-button-renderer, yt-button-view-model) button,
            html.ypp-glass-player-active ytd-watch-metadata #actions ytd-toggle-button-renderer button,
            html.ypp-glass-player-active ytd-watch-metadata #actions yt-button-shape button {
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(8px) !important;
                border-radius: 24px !important;
                transition: all 0.2s ease !important;
            }
            
            html.ypp-glass-player-active ytd-watch-metadata #actions yt-button-shape button:hover {
                background: rgba(255, 255, 255, 0.15) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            }

            /* ========================================================
               PHASE 2: LIVE CHAT GLASSMORPHISM
               ======================================================== */
            html.ypp-glass-player-active ytd-live-chat-frame {
                border-radius: 16px !important;
                overflow: hidden !important;
                box-shadow: 0 12px 48px rgba(0,0,0,0.5) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
            }
            
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
        `;
        document.head.appendChild(style);
    }

    onPageChange(data) {
        this._checkRoute();
    }

    _checkRoute() {
        this.isWatchPage = window.location.pathname === '/watch';
        if (this.isWatchPage) {
            this._applyFeatures();
        } else {
            this._cleanup();
        }
    }

    _applyFeatures() {
        if (!this.isWatchPage) return;
        
        if (this.glassPlayerEnabled) {
            document.documentElement.classList.add('ypp-glass-player-active');
        } else {
            document.documentElement.classList.remove('ypp-glass-player-active');
        }
    }

    _cleanup() {
        document.documentElement.classList.remove('ypp-glass-player-active');
    }
}
