/**
 * DOM Manager for Spiral Tube
 * Centralized utility for querying, caching, and polling DOM elements.
 * Prevents scattered string queries and handles YouTube SPA dynamically.
 */
window.YPP = window.YPP || {};
window.YPP.CONSTANTS = window.YPP.CONSTANTS || {};
window.YPP.Utils = window.YPP.Utils || {};

class DOMManagerClass {
    constructor() {
        this.cache = new Map();
        
        // Clear cache on navigation
        if (typeof window !== 'undefined') {
            window.addEventListener('yt-navigate-start', () => this.clearCache());
        }
    }

    /**
     * Clear all cached elements.
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Helper to safely query an element with optional caching.
     * @param {string} selector - The CSS selector.
     * @param {string} cacheKey - The key to store/retrieve the element from cache.
     * @param {boolean} force - If true, ignores cache and queries the DOM again.
     * @returns {Element|null}
     */
    get(selector, cacheKey, force = false) {
        if (!force && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            // Verify it's still in the document
            if (document.contains(cached)) {
                return cached;
            } else {
                this.cache.delete(cacheKey);
            }
        }
        
        const el = window.YPP.Utils.safeQuerySelector ? 
            window.YPP.Utils.safeQuerySelector(selector) : 
            document.querySelector(selector);
            
        if (el && cacheKey) {
            this.cache.set(cacheKey, el);
        }
        
        return el;
    }

    /**
     * Returns the main YouTube application root.
     * @param {boolean} force - Force refresh.
     * @returns {Element|null}
     */
    getAppRoot(force = false) {
        return this.get(window.YPP.CONSTANTS.SELECTORS?.APP || 'ytd-app', 'app-root', force);
    }

    /**
     * Returns the video player element.
     * Checks multiple known selectors to be resilient against UI updates.
     * @param {boolean} force - Force refresh.
     * @returns {HTMLVideoElement|null}
     */
    getVideo(force = false) {
        // First try constants if available
        let selectors = window.YPP.CONSTANTS.SELECTORS?.VIDEO;
        if (Array.isArray(selectors)) {
            selectors = selectors.join(', ');
        } else if (!selectors) {
            selectors = 'video.html5-main-video, video';
        }

        return this.get(selectors, 'main-video', force);
    }

    /**
     * Returns the current channel metadata link element (used in volume booster, etc).
     * @param {boolean} force 
     * @returns {Element|null}
     */
    getChannelLink(force = false) {
        const selectors = window.YPP.CONSTANTS.SELECTORS?.METADATA_SELECTORS?.CHANNEL || 
            ['ytd-video-owner-renderer #channel-name a', '#channel-name a'];
        
        const selectorString = Array.isArray(selectors) ? selectors.join(', ') : selectors;
        return this.get(selectorString, 'channel-link', force);
    }
}

window.YPP.DOMManager = new DOMManagerClass();
