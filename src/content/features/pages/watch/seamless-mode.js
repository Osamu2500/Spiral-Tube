export class SeamlessMode extends window.YPP.features.BaseFeature {
    static featureId = 'seamlessMode';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'seamlessMode'; }
    
    constructor() {
        super('seamlessMode');
        this.CONSTANTS = window.YPP.CONSTANTS || {};
        this.Utils = window.YPP.Utils || {};
        
        // Mode State
        this.isEnabled = false;
        this.domSwapped = false;
        
        // Track Original Locations for Flawless Restoration
        this.originalLocations = {
            below: { parent: null, nextSibling: null, placeholder: null },
            related: { parent: null, nextSibling: null, placeholder: null }
        };
        
        // Observers & Intervals
        this.observer = null;
        this.enforcementInterval = null;
        
        this._bindMethods();
    }

    _bindMethods() {
        this._swapNodes = this._swapNodes.bind(this);
        this._restoreNodes = this._restoreNodes.bind(this);
        this._handleMutations = this._handleMutations.bind(this);
        this._createPlaceholder = this._createPlaceholder.bind(this);
        this._aggressivelyEnforceLayouts = this._aggressivelyEnforceLayouts.bind(this);
    }

    enable() {
        this.isEnabled = true;
        this.Utils.log('Seamless Mode Enabled: Initializing SPA Observers and Ultra-Aggressive Layout Engine...', 'SEAMLESS_MODE', 'info');
        
        this._swapNodes();
        this._startObserving();
    }

    disable() {
        this.isEnabled = false;
        this.Utils.log('Seamless Mode Disabled: Restoring Original DOM Structure and resetting inline styles...', 'SEAMLESS_MODE', 'info');
        
        this._stopObserving();
        this._restoreNodes();
        this._cleanupInlineStyles();
        super.disable();
    }

    onPageChange() {
        const isWatchPage = location.pathname === '/watch';
        if (isWatchPage && this.isEnabled) {
            this.Utils.log('Page Navigated to Watch Page: Re-applying Seamless Layout...', 'SEAMLESS_MODE', 'info');
            // Allow YouTube SPA to mount its basic nodes before aggressive swapping
            setTimeout(this._swapNodes, 100);
            this._startObserving();
        } else {
            this._stopObserving();
            this._restoreNodes();
            this._cleanupInlineStyles();
        }
    }

    _startObserving() {
        this._stopObserving(); // Clear existing
        
        // Primary highly-responsive mutation observer for DOM swaps
        const targetNode = document.querySelector('ytd-watch-flexy') || document.body;
        if (targetNode) {
            this.observer = new MutationObserver(this._handleMutations);
            this.observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        }
        
        // Ultra-aggressive enforcement loop running 5 times a second
        this.enforcementInterval = setInterval(() => {
            if (this.isEnabled) {
                this._swapNodes();
                this._aggressivelyEnforceLayouts();
            }
        }, 200);
    }

    _stopObserving() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.enforcementInterval) {
            clearInterval(this.enforcementInterval);
            this.enforcementInterval = null;
        }
    }

    _handleMutations(mutations) {
        if (!this.isEnabled) return;
        
        let needsSwapCheck = false;
        let needsLayoutCheck = false;
        
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.id === 'below' || node.id === 'related' || node.id === 'primary-inner' || node.id === 'secondary-inner') {
                        needsSwapCheck = true;
                    }
                    if (node.tagName && node.tagName.toLowerCase() === 'ytd-compact-video-renderer') {
                        needsLayoutCheck = true;
                    }
                }
            }
            if (needsSwapCheck && needsLayoutCheck) break;
        }
        
        if (needsSwapCheck) this._swapNodes();
        if (needsLayoutCheck || needsSwapCheck) this._aggressivelyEnforceLayouts();
    }

    _createPlaceholder(id) {
        const placeholder = document.createElement('div');
        placeholder.id = `ypp-seamless-placeholder-${id}`;
        placeholder.style.display = 'none';
        placeholder.dataset.yppSeamlessPlaceholder = 'true';
        return placeholder;
    }

    _swapNodes() {
        if (!this.isEnabled) return;

        const primaryInner = document.querySelector('#primary-inner');
        const secondaryInner = document.querySelector('#secondary-inner');
        
        if (!primaryInner || !secondaryInner) return;

        const below = document.querySelector('#below');
        const related = document.querySelector('#related');

        if (!below || !related) return;

        // Skip if they are already in the correct containers
        if (below.parentElement === secondaryInner && related.parentElement === primaryInner) {
            this.domSwapped = true;
            return;
        }

        try {
            // Document original locations so we can restore them flawlessly without guessing
            if (below.parentElement !== secondaryInner) {
                this.originalLocations.below.parent = below.parentElement;
                this.originalLocations.below.nextSibling = below.nextSibling;
                
                if (!this.originalLocations.below.placeholder) {
                    this.originalLocations.below.placeholder = this._createPlaceholder('below');
                }
                
                // Inject placeholder where #below used to be
                if (below.parentElement) {
                    below.parentElement.insertBefore(this.originalLocations.below.placeholder, below);
                }
                
                // Move #below to Right Sidebar (#secondary-inner)
                secondaryInner.appendChild(below);
            }

            if (related.parentElement !== primaryInner) {
                this.originalLocations.related.parent = related.parentElement;
                this.originalLocations.related.nextSibling = related.nextSibling;
                
                if (!this.originalLocations.related.placeholder) {
                    this.originalLocations.related.placeholder = this._createPlaceholder('related');
                }
                
                // Inject placeholder where #related used to be
                if (related.parentElement) {
                    related.parentElement.insertBefore(this.originalLocations.related.placeholder, related);
                }
                
                // Move #related to Under Video (#primary-inner)
                primaryInner.appendChild(related);
            }

            this.domSwapped = true;
            this.Utils.log('Successfully swapped #below and #related nodes.', 'SEAMLESS_MODE', 'debug');
        } catch (e) {
            this.Utils.log('Error swapping nodes in Seamless Mode', 'SEAMLESS_MODE', 'warn');
        }
    }

    /**
     * Ultra-aggressive layout enforcement.
     * Manually forces inline CSS on every element to guarantee it complies,
     * overriding any YouTube Polymer data bindings or CSS recalculations.
     */
    _aggressivelyEnforceLayouts() {
        if (!this.isEnabled) return;

        // 1. Force Action Buttons Stacking
        try {
            const topRow = document.querySelector('ytd-watch-metadata #top-row');
            if (topRow) {
                topRow.style.setProperty('display', 'flex', 'important');
                topRow.style.setProperty('flex-direction', 'column', 'important');
                topRow.style.setProperty('align-items', 'stretch', 'important');
                topRow.style.setProperty('flex-wrap', 'nowrap', 'important');
                topRow.style.setProperty('width', '100%', 'important');
                
                // Strip restrictions that might hide buttons
                topRow.style.removeProperty('overflow');
                topRow.style.removeProperty('max-height');
            }

            const actions = document.querySelector('ytd-watch-metadata #actions');
            if (actions) {
                actions.style.setProperty('margin-top', '12px', 'important');
                actions.style.setProperty('width', '100%', 'important');
                actions.style.setProperty('display', 'block', 'important');
                actions.style.removeProperty('overflow');
            }

            const actionsInner = document.querySelector('ytd-watch-metadata #actions-inner');
            if (actionsInner) {
                actionsInner.style.setProperty('display', 'flex', 'important');
                actionsInner.style.setProperty('flex-wrap', 'wrap', 'important');
                actionsInner.style.setProperty('justify-content', 'flex-start', 'important');
                actionsInner.style.setProperty('width', '100%', 'important');
            }
            
            const owner = document.querySelector('ytd-watch-metadata #owner');
            if (owner) {
                owner.style.setProperty('width', '100%', 'important');
                owner.style.setProperty('display', 'block', 'important');
                owner.style.setProperty('margin-bottom', '12px', 'important');
            }
        } catch (e) {
            this.Utils.log('Error enforcing action button inline styles.', 'SEAMLESS_MODE', 'warn');
        }

        // 2. Force Related Videos Grid View
        try {
            const related = document.querySelector('#related');
            if (related) {
                const compactVideos = related.querySelectorAll('ytd-compact-video-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer');
                
                if (compactVideos.length > 0) {
                    // Force the actual parent container into a Grid
                    const trueItemsContainer = compactVideos[0].parentElement;
                    if (trueItemsContainer) {
                        trueItemsContainer.style.setProperty('display', 'grid', 'important');
                        trueItemsContainer.style.setProperty('grid-template-columns', 'repeat(auto-fill, minmax(280px, 1fr))', 'important');
                        trueItemsContainer.style.setProperty('gap', '16px', 'important');
                        trueItemsContainer.style.setProperty('justify-content', 'start', 'important');
                        trueItemsContainer.style.setProperty('width', '100%', 'important');
                        trueItemsContainer.classList.add('ypp-seamless-grid-enforced'); // Mark for cleanup
                    }

                    // Force every individual video card into column orientation (Thumbnail top, Text bottom)
                    compactVideos.forEach(video => {
                        video.style.setProperty('width', '100%', 'important');
                        video.style.setProperty('margin', '0', 'important');
                        video.style.setProperty('padding', '0', 'important');
                        
                        const innerDiv = video.querySelector('div, #dismissible');
                        if (innerDiv) {
                            innerDiv.style.setProperty('display', 'flex', 'important');
                            innerDiv.style.setProperty('flex-direction', 'column', 'important');
                            innerDiv.style.setProperty('align-items', 'stretch', 'important');
                        }

                        const thumbnail = video.querySelector('ytd-thumbnail');
                        if (thumbnail) {
                            thumbnail.style.setProperty('width', '100%', 'important');
                            thumbnail.style.setProperty('height', 'auto', 'important');
                            thumbnail.style.setProperty('aspect-ratio', '16/9', 'important');
                            thumbnail.style.setProperty('margin-right', '0', 'important');
                            thumbnail.style.setProperty('margin-bottom', '8px', 'important');
                        }

                        const details = video.querySelector('.details');
                        if (details) {
                            details.style.setProperty('padding-top', '4px', 'important');
                            details.style.setProperty('width', '100%', 'important');
                        }
                    });
                }
            }
        } catch (e) {
            this.Utils.log('Error enforcing related video inline styles.', 'SEAMLESS_MODE', 'warn');
        }
    }

    _cleanupInlineStyles() {
        // Strip inline styles so normal layout restores
        const elements = [
            document.querySelector('ytd-watch-metadata #top-row'),
            document.querySelector('ytd-watch-metadata #actions'),
            document.querySelector('ytd-watch-metadata #actions-inner'),
            document.querySelector('ytd-watch-metadata #owner')
        ];
        
        elements.forEach(el => {
            if (el) el.removeAttribute('style');
        });

        const gridContainer = document.querySelector('.ypp-seamless-grid-enforced');
        if (gridContainer) {
            gridContainer.removeAttribute('style');
            gridContainer.classList.remove('ypp-seamless-grid-enforced');
        }

        const related = document.querySelector('#related');
        if (related) {
            const compactVideos = related.querySelectorAll('ytd-compact-video-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer');
            compactVideos.forEach(video => {
                video.removeAttribute('style');
                const innerDiv = video.querySelector('div, #dismissible');
                if (innerDiv) innerDiv.removeAttribute('style');
                const thumbnail = video.querySelector('ytd-thumbnail');
                if (thumbnail) thumbnail.removeAttribute('style');
                const details = video.querySelector('.details');
                if (details) details.removeAttribute('style');
            });
        }
    }

    _restoreNodes() {
        if (!this.domSwapped) return;

        const below = document.querySelector('#below');
        const related = document.querySelector('#related');

        try {
            // Restore #below to its exact original location via placeholder
            if (below && this.originalLocations.below.placeholder && this.originalLocations.below.placeholder.parentElement) {
                this.originalLocations.below.placeholder.parentElement.insertBefore(below, this.originalLocations.below.placeholder);
                this.originalLocations.below.placeholder.remove();
            } else if (below && this.originalLocations.below.parent) {
                // Fallback if placeholder is lost
                this.originalLocations.below.parent.insertBefore(below, this.originalLocations.below.nextSibling);
            }

            // Restore #related to its exact original location via placeholder
            if (related && this.originalLocations.related.placeholder && this.originalLocations.related.placeholder.parentElement) {
                this.originalLocations.related.placeholder.parentElement.insertBefore(related, this.originalLocations.related.placeholder);
                this.originalLocations.related.placeholder.remove();
            } else if (related && this.originalLocations.related.parent) {
                // Fallback if placeholder is lost
                this.originalLocations.related.parent.insertBefore(related, this.originalLocations.related.nextSibling);
            }

            // Reset state
            this.domSwapped = false;
            this.originalLocations = {
                below: { parent: null, nextSibling: null, placeholder: null },
                related: { parent: null, nextSibling: null, placeholder: null }
            };
            this.Utils.log('Successfully restored original DOM nodes.', 'SEAMLESS_MODE', 'debug');
        } catch (e) {
            this.Utils.log('Error restoring nodes in Seamless Mode', 'SEAMLESS_MODE', 'error', e);
        }
    }
}

window.YPP.features.SeamlessMode = SeamlessMode;
