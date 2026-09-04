import '../../../core/system/base-feature.js';

/**
 * @fileoverview
 * Redirect Shorts
 * 
 * Target: /shorts/* paths.
 * Scope: Safely redirects YouTube Shorts URLs to the standard Watch player.
 * Safety: Does not affect unrelated files, routes, or features. Confined to Shorts path checks.
 */
export class RedirectShorts extends window.YPP.features.BaseFeature {
    static featureId = 'redirectShorts';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('RedirectShorts');
    }

    // --- Core Lifecycle ---

    getConfigKey() { 
        return 'redirectShorts'; 
    }

    async enable() {
        await super.enable();
        this.checkRedirect();
        this.addListener(window, 'yt-navigate-start', this.checkRedirect);
    }

    async disable() {
        await super.disable();
    }

    onPageChange(url) {
        if (!this.isEnabled) return;
        this.checkRedirect();
    }

    // --- Feature Logic ---

    checkRedirect = () => {
        if (!this.settings?.redirectShorts) return;

        const path = location.pathname;
        if (!path.startsWith('/shorts/')) return;

        const videoId = path.split('/shorts/')[1]?.split('/')[0];

        // Ensure valid YouTube video ID length (11 characters)
        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            this.utils?.log(`Redirecting Short to Watch: ${videoId}`, 'RedirectShorts', 'info');
            
            const targetUrl = `/watch?v=${videoId}`;
            const app = document.querySelector('ytd-app');
            
            // Try SPA redirect first to avoid full page reload
            if (app && typeof app.fire === 'function') {
                app.fire('yt-navigate', { 
                    endpoint: { 
                        commandMetadata: { 
                            webCommandMetadata: { url: targetUrl } 
                        } 
                    } 
                });
            } else {
                // Fallback navigation
                location.replace(targetUrl);
            }
        } else if (videoId) {
            this.utils?.log(`Invalid video ID format: ${videoId}`, 'RedirectShorts', 'warn');
        }
    };
}
