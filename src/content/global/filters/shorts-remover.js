import '../../core/system/base-feature.js';
/**
 * @fileoverview
 * Hide Shorts
 * 
 * Target: /shorts route.
 * Purpose: Identifies and hides YouTube Shorts from the DOM across the platform.
 * Targets: search results, shelves, feed, and recommended videos.
 * Utilizes MutationObserver and robust selector heuristics.
 */
export class ShortsRemover extends window.YPP.features.BaseFeature {
    static featureId = 'aggressiveShortsBlock';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('ShortsRemover');
        this.handleShortsAdded = this.handleShortsAdded.bind(this);
        this._isMonitoringShorts = false;
    }

    getConfigKey() { return null; } // Controlled purely by the .ypp-nuke-shorts body class

    async enable() {
        await super.enable();
        this.applySettings();
    }

    async disable() {
        await super.disable();
        this._cleanupDOM();
        this.stopShortsMonitoring();
    }

    onUpdate() {
        this.applySettings();
    }

    onPageChange() {
        if (!document.body.classList.contains('ypp-nuke-shorts')) return;
        
        // Temporarily stop to force re-registration of the observer with correct selector for new page
        this.stopShortsMonitoring();
        
        // Clean up DOM stamps only so recycled DOM elements are correctly re-evaluated
        document.querySelectorAll('[data-ypp-is-short]').forEach(el => el.removeAttribute('data-ypp-is-short'));
        
        // Manually restart processing for the new page
        this.removeShortsFromDOM();
        this.startShortsMonitoring();
    }

    applySettings() {
        // We now rely purely on the global ypp-nuke-shorts class managed by GlobalLayoutManager
        // If the class is present, we need to monitor the DOM to add attributes
        if (document.body.classList.contains('ypp-nuke-shorts')) {
            this.removeShortsFromDOM();
            this.startShortsMonitoring();
        } else {
            this._cleanupDOM();
            this.stopShortsMonitoring();
        }
    }
    
    _hideShortsContainer(el) {
        // Explicitly remove dedicated shorts shelves entirely to fix layout gaps
        const dedicatedShelf = this.utils.findOutermostMatch(el, [
            'ytd-rich-section-renderer[is-shorts]',
            'ytd-rich-shelf-renderer[is-shorts]',
            'ytd-shelf-renderer[is-shorts]',
            'yt-collection-shelf-view-model[is-shorts]',
            'ytd-reel-shelf-renderer',
            'ytm-reel-shelf-renderer'
        ]);
        
        if (dedicatedShelf && dedicatedShelf.isConnected) {
            dedicatedShelf.remove();
            return true;
        }

        // Safely hide individual cells. Avoid generic ytd-rich-section-renderer.
        const container = this.utils.findOutermostMatch(el, [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-reel-item-renderer',
            'ytd-rich-grid-slim-media',
            'yt-lockup-view-model',
            'yt-chip-cloud-chip-renderer',
            'ytm-video-with-context-renderer',
            'ytm-compact-video-renderer',
            'ytm-shorts-lockup-view-model'
        ]);
        if (container) {
            container.style.setProperty('display', 'none', 'important');
            return true;
        }
        return false;
    }

    _cleanupDOM() {
        document.querySelectorAll('[data-ypp-is-short]').forEach(el => {
            el.removeAttribute('data-ypp-is-short');
            el.style.removeProperty('display');
        });
    }

    removeShortsFromDOM() {
        const SHORTS_PATTERNS = [
            'yt-lockup-view-model',
            'ytm-shorts-lockup-view-model',
            '.pivot-shorts',
            'ytd-reel-shelf-renderer',
            'ytd-rich-shelf-renderer[is-shorts]',
            'ytd-rich-section-renderer[is-shorts]',
            'ytd-rich-section-renderer:has(ytd-rich-grid-slim-media)',
            'ytd-rich-section-renderer:has(ytd-reel-item-renderer)',
            'ytd-shelf-renderer[is-shorts]',
            'ytm-reel-shelf-renderer',
            'grid-shelf-view-model',
            'ytd-reel-item-renderer',
            'ytd-rich-grid-slim-media',
            'ytd-guide-entry-renderer:has(a[title="Shorts"])',
            'ytd-mini-guide-entry-renderer:has(a[title="Shorts"])',
            'tp-yt-paper-tab[aria-label="Shorts"]',
            'yt-tab-shape[tab-title="Shorts"]',
            'yt-collection-shelf-view-model[is-shorts]'
        ];

        let removed = 0;
        try {
            const combinedSelector = SHORTS_PATTERNS.join(', ');
            const elements = document.querySelectorAll(combinedSelector);
            elements.forEach(el => {
                if (this._isShortsElement(el)) {
                    if (this._hideShortsContainer(el)) {
                        el.setAttribute('data-ypp-is-short', 'true');
                        removed++;
                    }
                }
            });
            
            // Search specific shorts videos if enabled
            if (window.location.pathname === '/results') {
                document.querySelectorAll('a[href^="/shorts/"]').forEach(link => {
                    const videoEl = link.closest('ytd-video-renderer, ytd-compact-video-renderer, ytm-video-with-context-renderer');
                    if (videoEl && this._hideShortsContainer(videoEl)) {
                        videoEl.setAttribute('is-search', 'true');
                        removed++;
                    }
                });
            }
        } catch (err) {
            this.utils?.log(`Error removing shorts: ${err.message}`, 'ShortsRemover', 'error');
        }

        this._removeShortsChips();
        this._removeShortsByHeuristics();

        if (removed > 0) {
            this.utils?.log(`Removed ${removed} Shorts elements from DOM`, 'ShortsRemover');
        }
    }

    _isShortsElement(element) {
        if (!element) return false;
        
        // Fast paths
        const tagName = element.tagName?.toLowerCase();
        if (tagName === 'ytm-shorts-lockup-view-model') return true;
        if (tagName === 'ytd-reel-shelf-renderer' || tagName === 'ytm-reel-shelf-renderer') return true;
        if (tagName === 'ytd-rich-grid-slim-media' || tagName === 'ytd-reel-item-renderer' || tagName === 'reels-video-with-pill-title-renderer' || tagName === 'ytd-reel-video-renderer' || tagName === 'ytd-shorts') return true;
        if (element.classList?.contains('pivot-shorts')) return true;
        
        // Detailed checks
        if (element.hasAttribute('is-shorts')) return true;
        
        const href = element.getAttribute('href');
        if (href && (href.startsWith('/shorts/') || href.includes('/shorts/'))) return true;
        
        // Restrict to thumbnail links to avoid accidentally matching shorts links inside community post text
        if (element.querySelector('a#thumbnail[href*="/shorts"], a.ytd-thumbnail[href*="/shorts"], yt-image a[href*="/shorts"]')) return true;
        
        if (element.querySelector('ytd-rich-grid-slim-media, ytd-reel-item-renderer, yt-icon[icon="yt-icons:shorts"], yt-icon-shape[icon="yt-icons:shorts"], span[aria-label="Shorts"], ytd-badge-supported-renderer[aria-label="Shorts"]')) return true;
        
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel?.toLowerCase() === 'shorts') return true;
        
        const title = element.querySelector('#title, [title]');
        if (title?.textContent?.trim().toLowerCase() === 'shorts' || 
            title?.getAttribute('title')?.trim().toLowerCase() === 'shorts') {
            return true;
        }

        const titleRow = element.querySelector('.ytShelfHeaderLayoutTitleRow');
        if (titleRow?.textContent?.trim().toLowerCase() === 'shorts') {
            return true;
        }
        
        const timeStatus = element.querySelector('ytd-thumbnail-overlay-time-status-renderer');
        if (timeStatus?.getAttribute('overlay-style') === 'SHORTS') return true;

        return false;
    }

    _removeShortsChips() {
        const chips = document.querySelectorAll("yt-chip-cloud-chip-renderer");
        chips.forEach(chip => {
            const textElement = chip.querySelector("#text");
            if (textElement && textElement.innerText.trim() === "Shorts") {
                if (this._hideShortsContainer(chip)) {
                    chip.setAttribute('data-ypp-is-short', 'true');
                }
            }
        });
    }

    _removeShortsByHeuristics() {
        
        const elementsToCheck = document.querySelectorAll(
            'ytd-shelf-renderer, ytd-rich-shelf-renderer, yt-collection-shelf-view-model, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytm-video-with-context-renderer, ytm-compact-video-renderer'
        );
        
        elementsToCheck.forEach(el => {
            if (this._isShortsElement(el)) {
                if (this._hideShortsContainer(el)) {
                    el.setAttribute('data-ypp-is-short', 'true');
                }
            } else {
                // Secondary check for badges
                const badge = el.querySelector('span[aria-label="Shorts"], ytd-badge-supported-renderer');
                if (badge?.getAttribute('aria-label') === 'Shorts' || badge?.textContent?.trim() === 'Shorts') {
                    if (this._hideShortsContainer(el)) {
                        el.setAttribute('data-ypp-is-short', 'true');
                    }
                }
            }
        });
    }

    startShortsMonitoring() {
        if (this._isMonitoringShorts) return;
        this.utils?.log('Starting continuous Shorts monitoring via DOMObserver', 'ShortsRemover');
        const isSearchPage = window.location.pathname === '/results';
        const monitorSelector = isSearchPage
            ? 'ytd-rich-item-renderer, yt-lockup-view-model, yt-collection-shelf-view-model, ytd-reel-shelf-renderer, ytd-rich-shelf-renderer, ytd-rich-section-renderer, ytd-guide-entry-renderer, yt-chip-cloud-chip-renderer'
            : 'ytd-rich-item-renderer, yt-lockup-view-model, yt-collection-shelf-view-model, ytd-video-renderer, ytd-grid-video-renderer, ytd-reel-shelf-renderer, ytd-rich-shelf-renderer, ytd-rich-section-renderer, ytd-guide-entry-renderer, yt-chip-cloud-chip-renderer';

        this.observer.register(
            'shorts-monitor',
            monitorSelector,
            this.handleShortsAdded,
            false 
        );
        this._isMonitoringShorts = true;
    }

    stopShortsMonitoring() {
        if (this._isMonitoringShorts) {
            this.observer.unregister('shorts-monitor');
            this._isMonitoringShorts = false;
            this.utils?.log('Stopped Shorts monitoring', 'ShortsRemover');
        }
    }

    handleShortsAdded(elements) {
        if (!elements || !Array.isArray(elements) || elements.length === 0) {
            this.removeShortsFromDOM();
            return;
        }

        let removed = 0;
        elements.forEach(el => {
            if (!el) return;
            
            // Search specific shorts videos if enabled
            if (window.location.pathname === '/results' && el.tagName?.toLowerCase() === 'ytd-video-renderer') {
                if (el.querySelector('a[href^="/shorts/"]')) {
                    if (this._hideShortsContainer(el)) {
                        el.setAttribute('is-search', 'true');
                        removed++;
                    }
                }
            }

            if (this._isShortsElement(el)) {
                if (this._hideShortsContainer(el)) {
                    el.setAttribute('data-ypp-is-short', 'true');
                    removed++;
                }
                return;
            }
            
            if (el.tagName && el.tagName.toLowerCase() === 'yt-chip-cloud-chip-renderer') {
                const textElement = el.querySelector("#text");
                if (textElement && textElement.innerText.trim() === "Shorts") {
                    if (this._hideShortsContainer(el)) {
                        el.setAttribute('data-ypp-is-short', 'true');
                        removed++;
                    }
                }
                return;
            }

            try {
                const nestedShorts = el.querySelectorAll('ytd-reel-shelf-renderer, a[href^="/shorts/"], ytm-shorts-lockup-view-model');
                if (nestedShorts.length > 0 && this._isShortsElement(el)) {
                     if (this._hideShortsContainer(el)) {
                         el.setAttribute('data-ypp-is-short', 'true');
                         removed++;
                     }
                }
            } catch(e) {}
        });

        if (removed > 0) {
            this.utils?.log(`Dynamic removal: ${removed} Shorts elements`, 'ShortsRemover');
        }
    }
};

