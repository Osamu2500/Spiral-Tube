import '../../core/system/base-feature.js';

/**
 * @fileoverview
 * Redirect Home
 * 
 * Target: / paths.
 * Scope: Safely redirects YouTube Homepage to Subscriptions, Watch Later, or Library via SPA router.
 * Safety: Confined to home path checks.
 */
export class RedirectHomeFeature extends window.YPP.features.BaseFeature {
    constructor() {
        super('bypassHomepage');
        this.featureKey = 'bypassHomepage';
        this.bypassTarget = 'off';
    }

    getConfigKey() { return null; } // Custom handling via bypassTarget

    enable() {
        this.utils.log('Redirect Home Active', 'NAVIGATION', 'info');
        this.boundCheck = () => this.checkRedirect();
        this.checkRedirect();
        // Hook into SPA navigation start to intercept before render
        this.addListener(document, 'yt-navigate-start', this.boundCheck);
    }

    onUpdate(newSettings) {
        if (!newSettings) return;
        this.bypassTarget = newSettings.bypassHomepage || 'off';
        this.checkRedirect();
    }

    checkRedirect() {
        if (!this.bypassTarget || this.bypassTarget === 'off') return;
        
        const path = window.location.pathname;
        if (path === '/' || path === '/index') {
            let targetUrl = '';
            switch (this.bypassTarget) {
                case 'subscriptions':
                    targetUrl = '/feed/subscriptions';
                    break;
                case 'watch_later':
                    targetUrl = '/playlist?list=WL';
                    break;
                case 'library':
                    targetUrl = '/feed/you';
                    break;
            }
            if (targetUrl) {
                this.utils.log(`Redirecting Home to: ${targetUrl}`, 'NAVIGATION', 'info');
                const app = document.querySelector('ytd-app');
                // Try SPA redirect first to avoid full page reload
                if (app && typeof app.fire === 'function') {
                    try {
                        app.fire('yt-navigate', { 
                            endpoint: { 
                                commandMetadata: { 
                                    webCommandMetadata: { url: targetUrl } 
                                } 
                            } 
                        });
                    } catch (e) {
                        this.utils.log(`SPA redirect failed, falling back to replace: ${e.message}`, 'NAVIGATION', 'warn');
                        window.location.replace(targetUrl);
                    }
                } else {
                    // Fallback navigation
                    window.location.replace(targetUrl);
                }
            }
        }
    }
}

window.YPP.features = window.YPP.features || {};
window.YPP.features.RedirectHomeFeature = RedirectHomeFeature;
