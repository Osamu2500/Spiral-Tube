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
            related: { parent: null, nextSibling: null, placeholder: null },
            actions: { parent: null, nextSibling: null, placeholder: null }
        };
        
        // Observers & Intervals
        this.observer = null;
        this.fallbackInterval = null;
        
        this._bindMethods();
    }

    _bindMethods() {
        this._swapNodes = this._swapNodes.bind(this);
        this._restoreNodes = this._restoreNodes.bind(this);
        this._handleMutations = this._handleMutations.bind(this);
        this._createPlaceholder = this._createPlaceholder.bind(this);
    }

    enable() {
        this.isEnabled = true;
        this.Utils.log('Seamless Mode Enabled: Initializing SPA Observers...', 'SEAMLESS_MODE', 'info');
        
        this._swapNodes();
        this._startObserving();
    }

    disable() {
        this.isEnabled = false;
        this.Utils.log('Seamless Mode Disabled: Restoring Original DOM Structure...', 'SEAMLESS_MODE', 'info');
        
        this._stopObserving();
        this._restoreNodes();
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
        }
    }

    _startObserving() {
        this._stopObserving(); // Clear existing
        
        // Primary highly-responsive mutation observer
        const targetNode = document.querySelector('ytd-watch-flexy') || document.body;
        if (targetNode) {
            this.observer = new MutationObserver(this._handleMutations);
            this.observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        }
        
        // Fallback polling for dynamically lazy-loaded async chunks
        this.fallbackInterval = setInterval(() => {
            if (this.isEnabled) this._swapNodes();
        }, 1500);
    }

    _stopObserving() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
            this.fallbackInterval = null;
        }
    }

    _handleMutations(mutations) {
        if (!this.isEnabled) return;
        
        let needsSwapCheck = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // If major structural nodes are injected natively by SPA, we intercept and swap
                for (const node of mutation.addedNodes) {
                    if (node.id === 'below' || node.id === 'related' || node.id === 'primary-inner' || node.id === 'secondary-inner') {
                        needsSwapCheck = true;
                        break;
                    }
                }
            }
            if (needsSwapCheck) break;
        }
        
        if (needsSwapCheck) {
            this._swapNodes();
        }
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

            // Advanced DOM Manipulation 1: Action Buttons below Channel Card
            const topRow = document.querySelector('ytd-watch-metadata #top-row');
            const owner = document.querySelector('ytd-watch-metadata #owner');
            const actions = document.querySelector('ytd-watch-metadata #actions');
            
            if (topRow && owner && actions && actions.parentElement !== topRow) {
                // By default #actions is in #top-row. If YouTube changed it, we adapt.
                // We want #actions to be a distinct block BELOW #owner.
                // Best way: append #actions directly after #owner inside #top-row, and force #top-row to block or flex-column via CSS.
            }
            
            if (topRow && owner && actions && actions.nextElementSibling !== null) {
                 // Actions might be before or inline. Let's ensure it's explicitly after Owner
                 if (actions.previousElementSibling !== owner) {
                     this.originalLocations.actions.parent = actions.parentElement;
                     this.originalLocations.actions.nextSibling = actions.nextSibling;
                     
                     if (!this.originalLocations.actions.placeholder) {
                         this.originalLocations.actions.placeholder = this._createPlaceholder('actions');
                     }
                     if (actions.parentElement) actions.parentElement.insertBefore(this.originalLocations.actions.placeholder, actions);
                     
                     // Move actions to explicitly be immediately after owner
                     owner.insertAdjacentElement('afterend', actions);
                     
                     // Add custom class so CSS can force them to stack
                     topRow.classList.add('ypp-seamless-stacked-actions');
                 }
            }

            // Advanced DOM Manipulation 2: Guarantee Grid Layout for Related Videos
            // Find the exact container that holds the compact video renderers
            const compactVideos = related.querySelectorAll('ytd-compact-video-renderer, ytd-compact-playlist-renderer');
            if (compactVideos.length > 0) {
                // The direct parent of the first video is the true items container
                const trueItemsContainer = compactVideos[0].parentElement;
                if (trueItemsContainer && !trueItemsContainer.classList.contains('ypp-seamless-grid-container')) {
                    trueItemsContainer.classList.add('ypp-seamless-grid-container');
                }
            }

            this.domSwapped = true;
            this.Utils.log('Successfully swapped #below and #related nodes.', 'SEAMLESS_MODE', 'debug');
        } catch (e) {
            this.Utils.log('Error swapping nodes in Seamless Mode', 'SEAMLESS_MODE', 'warn');
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

            // Restore Action Buttons
            const actions = document.querySelector('ytd-watch-metadata #actions');
            if (actions && this.originalLocations.actions.placeholder && this.originalLocations.actions.placeholder.parentElement) {
                this.originalLocations.actions.placeholder.parentElement.insertBefore(actions, this.originalLocations.actions.placeholder);
                this.originalLocations.actions.placeholder.remove();
            }
            
            const topRow = document.querySelector('ytd-watch-metadata #top-row');
            if (topRow) topRow.classList.remove('ypp-seamless-stacked-actions');

            // Remove Custom Grid Classes
            if (related) {
                const gridContainers = related.querySelectorAll('.ypp-seamless-grid-container');
                gridContainers.forEach(c => c.classList.remove('ypp-seamless-grid-container'));
            }

            // Reset state
            this.domSwapped = false;
            this.originalLocations = {
                below: { parent: null, nextSibling: null, placeholder: null },
                related: { parent: null, nextSibling: null, placeholder: null },
                actions: { parent: null, nextSibling: null, placeholder: null }
            };
            this.Utils.log('Successfully restored original DOM nodes.', 'SEAMLESS_MODE', 'debug');
        } catch (e) {
            this.Utils.log('Error restoring nodes in Seamless Mode', 'SEAMLESS_MODE', 'error', e);
        }
    }
}

window.YPP.features.SeamlessMode = SeamlessMode;
