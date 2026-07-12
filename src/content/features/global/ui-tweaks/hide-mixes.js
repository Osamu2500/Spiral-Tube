export class HideMixes extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hideMixes';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('HideMixes');
        this._boundProcess = this._processNodes.bind(this);
        
        this._debounceTimer = null;
        this._boundSchedule = this._scheduleProcess.bind(this);
    }

    get isEnabled() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index') {
            return !!this.settings.hideMixes;
        }
        if (path === '/results') {
            return !!this.settings.hideSearchMixes;
        }
        return false;
    }

    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        return (path === '/' || path === '/index' || path === '/results');
    }

    async enable() {
        await super.enable();
        
        // Add global class to hide elements matching the mix criteria if they are tagged
        document.documentElement.classList.add(window.YPP.CONSTANTS.CSS_CLASSES.HIDE_MIXES);
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'hide-mixes',
                'ytd-rich-shelf-renderer, ytd-horizontal-card-list-renderer, ytd-radio-renderer, ytd-rich-item-renderer, yt-lockup-view-model, ytd-lockup-view-model',
                this._boundProcess
            );
        }
        
        // React to infinite scroll and virtual DOM recycling
        this.addListener(window, 'yt-page-data-updated', this._boundSchedule);
        
        // Process existing nodes
        this._scheduleProcess();
    }

    async disable() {
        await super.disable();
        
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
            this._debounceTimer = null;
        }
        
        document.documentElement.classList.remove(window.YPP.CONSTANTS.CSS_CLASSES.HIDE_MIXES);
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('hide-mixes');
        }
        
        // Un-hide all previously hidden mixes, also clears any leftover data-ypp-mix
        const hiddenMixes = document.querySelectorAll('[data-ypp-mix="true"]');
        hiddenMixes.forEach(el => {
            this._unhideElement(el);
        });
        
        // Clear all processing stamps
        document.querySelectorAll('[data-ypp-mix-processed]').forEach(el => {
            el.removeAttribute('data-ypp-mix-processed');
        });
    }

    _scheduleProcess() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this._debounceTimer = null;
            const nodes = document.querySelectorAll('ytd-rich-shelf-renderer, ytd-horizontal-card-list-renderer, ytd-radio-renderer, ytd-rich-item-renderer, yt-lockup-view-model, ytd-lockup-view-model');
            if (nodes.length > 0) {
                this._processNodes(Array.from(nodes));
            }
        }, 150);
    }

    /**
     * Process newly added nodes from the shared observer
     * @param {Element[]} nodes 
     */
    _processNodes(nodes) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        
        nodes.forEach(node => {
            // For ytd-radio-renderer (Mixes in search/sidebar)
            if (node.tagName.toLowerCase() === 'ytd-radio-renderer') {
                if (node.hasAttribute('data-ypp-mix-processed')) return;
                node.setAttribute('data-ypp-mix-processed', 'true');
                this._hideElement(node, 'mix');
                return;
            }
            
            // For shelf renderers and grid items, check the title
            // If no title has loaded yet, poll for it
            let hasText = false;
            const titleElements = node.querySelectorAll('#title, #video-title, .yt-lockup-metadata-view-model-wiz__title, h3');
            for (let el of titleElements) {
                if (el.textContent && el.textContent.trim()) { hasText = true; break; }
            }
            
            if (!hasText) {
                if (!node.hasAttribute('data-ypp-mix-observing')) {
                    node.setAttribute('data-ypp-mix-observing', 'true');
                    
                    window.YPP.Utils.pollFor(() => {
                        const els = node.querySelectorAll('#title, #video-title, .yt-lockup-metadata-view-model-wiz__title, h3');
                        for (let el of els) {
                            if (el.textContent && el.textContent.trim()) return true;
                        }
                        return false;
                    }, 5000, 200).then(found => {
                        if (found) {
                            node.removeAttribute('data-ypp-mix-observing');
                            this._checkAndHideMix(node);
                        }
                    }).catch(() => {
                        node.removeAttribute('data-ypp-mix-observing');
                    });
                }
                return; 
            }
            
            this._checkAndHideMix(node);
        });
    }

    /**
     * Check title and hide if it's a mix
     * @param {Element} node
     * @param {string} titleText
     */
    _checkAndHideMix(node) {
        let isMixShelf = false;
        let finalTitle = "";

        // Check for "Mix" badges on the thumbnail (very reliable for grid items)
        const badges = node.querySelectorAll('ytd-thumbnail-overlay-bottom-panel-renderer, ytd-badge-supported-renderer, .badge-shape-wiz__text');
        for (let i = 0; i < badges.length; i++) {
            if (badges[i].textContent.trim().toLowerCase() === 'mix') {
                isMixShelf = true;
                finalTitle = "badge-mix";
                break;
            }
        }

        if (!isMixShelf && node.querySelector('ytd-radio-renderer') !== null) {
            isMixShelf = true;
            finalTitle = "radio-renderer";
        }

        if (!isMixShelf) {
            const titleElements = node.querySelectorAll('#title, #video-title, .yt-lockup-metadata-view-model-wiz__title, h3');
            for (let el of titleElements) {
                const titleText = (el.textContent || '').trim().toLowerCase();
                if (!titleText) continue;
                
                finalTitle = titleText; // keep the last valid one for the stamp
                
                if (
                    titleText === 'mix' ||
                    titleText.startsWith('mix -') ||
                    titleText.startsWith('mix \u2013') || // en-dash
                    titleText.startsWith('mix \u2014') || // em-dash
                    titleText.startsWith('mix |') || // pipe
                    titleText.endsWith(' mix') ||
                    titleText.includes('mix for you') ||
                    titleText.includes('your mix')
                ) {
                    isMixShelf = true;
                    break;
                }
            }
        }

        const previousStamp = node.getAttribute('data-ypp-mix-processed');
        const currentStamp = (isMixShelf ? "1:" : "0:") + finalTitle;
        if (previousStamp === currentStamp) return; 
        
        node.setAttribute('data-ypp-mix-processed', currentStamp);
        
        if (isMixShelf) {
            this._hideElement(node, 'mix');
        } else {
            // Un-hide if it was recycled from a mix to a non-mix
            this._unhideElement(node);
        }
    }

    /**
     * Re-displays a previously hidden element if it's no longer a mix
     * @param {Element} node
     */
    _unhideElement(node) {
        if (!node || !window.YPP.Utils) return;
        const target = window.YPP.Utils.findOutermostMatch(node, window.YPP.Utils.getVideoContainerSelectors()) || node;

        target.removeAttribute('data-ypp-mix');
        target.classList.remove('ypp-is-mix');
        if (!target.classList.contains('ypp-is-watched') && 
            !target.classList.contains('ypp-hidden-duration') && 
            !target.classList.contains('ypp-hidden-channel')) {
            target.style.removeProperty('display');
        }
    }

    _hideElement(node, type) {
        if (!node || !window.YPP.Utils) return;
        const target = window.YPP.Utils.findOutermostMatch(node, window.YPP.Utils.getVideoContainerSelectors()) || node;

        target.setAttribute('data-ypp-mix', 'true');
        target.classList.add('ypp-is-mix');
        // Force hiding with inline styles to override any grid layout display: flex
        target.style.setProperty('display', 'none', 'important');
    }
};

window.YPP.features.HideMixes = HideMixes;
