import '../../../../../core/system/base-feature.js';
import './seamless-mode.css';
import './seamless-grid-cards.css';
import { UIStateController } from './ui-state-controller.js';
import { RelatedGridController } from './related-grid-controller.js';

/**
 * @fileoverview
 * Seamless Layout Engine (Pure CSS Grid implementation)
 * Achieves the 'Delhi' layout (comments on right, related below) using CSS Grid
 * instead of brittle DOM node moving, resolving synchronization bugs.
 */
export class SeamlessMode extends window.YPP.features.BaseFeature {
    static featureId = 'seamlessMode';
    static executionPhase = 'idle';
    static priority = 999;
    static isManagedExternally = true;

    getConfigKey() { return 'seamlessMode'; }
    
    constructor() {
        super('seamlessMode');
        
        this.uiStateController = new UIStateController(this);
        this.gridController = new RelatedGridController(this);
        
        this.isWatchPage = false;
        
        this._fullscreenListener = () => {
            if (!this.isEnabled || !this.isWatchPage) return;
            if (document.fullscreenElement) {
                document.body.classList.remove('ypp-seamless-mode');
            } else {
                document.body.classList.add('ypp-seamless-mode');
            }
        };
    }

    async enable() {
        try {
            await super.enable();
            this.utils.log('Initializing Seamless CSS Grid Layout Engine...', 'seamlessMode', 'info');
            this._checkPageContext();
            document.addEventListener('fullscreenchange', this._fullscreenListener);
            if (this.isWatchPage) {
                this._activateEngines();
            }
        } catch (error) {
            this.utils.log(error.message, 'seamlessMode', 'error');
        }
    }

    async disable() {
        try {
            this.utils.log('Shutting down Seamless Engine...', 'seamlessMode', 'info');
            document.removeEventListener('fullscreenchange', this._fullscreenListener);
            this._deactivateEngines();
            await super.disable();
        } catch (error) {
            this.utils.log(error.message, 'seamlessMode', 'error');
        }
    }

    async onPageChange() {
        if (!this.isEnabled) return;
        const wasOnWatchPage = this.isWatchPage;
        this._checkPageContext();
        if (this.isWatchPage) {
            if (wasOnWatchPage) {
                // SPA optimization: skip full teardown/activate if already on watch page
                // QuadObserverSystem handles mutations safely in the background
                return;
            }
            this._activateEngines();
        } else {
            this._deactivateEngines();
        }
    }

    async onUpdate() {
        if (!this.isEnabled || !this.isWatchPage) return;
        this._activateEngines();
    }

    _checkPageContext() {
        this.isWatchPage = location.pathname === '/watch';
    }

    _activateEngines() {
        // Enforce the CSS layout class
        document.body.classList.add('ypp-seamless-mode');
        // Enable grid controller for the bottom related videos
        this.gridController.enable();
        
        if (this.settings?.seamlessMode) {
            this.uiStateController.enable();
        }

        setTimeout(() => {
            const flexy = document.querySelector('ytd-watch-flexy');
            if (flexy) {
                const cols = flexy.querySelector('#columns');
                if (cols) {
                    const children = Array.from(cols.children).map(c => c.tagName + '#' + c.id).join(', ');
                    this.utils.log('COLUMNS CHILDREN: ' + children, 'seamlessMode', 'info');
                    
                    const prim = flexy.querySelector('#primary');
                    if (prim) {
                        const pChildren = Array.from(prim.children).map(c => c.tagName + '#' + c.id).join(', ');
                        this.utils.log('PRIMARY CHILDREN: ' + pChildren, 'seamlessMode', 'info');
                    }
                    
                    const pi = flexy.querySelector('#primary-inner');
                    if (pi) {
                        const piChildren = Array.from(pi.children).map(c => c.tagName + '#' + c.id).join(', ');
                        this.utils.log('PRIMARY INNER CHILDREN: ' + piChildren, 'seamlessMode', 'info');
                    }
                }
            }
        }, 2000);
    }

    _deactivateEngines() {
        document.body.classList.remove('ypp-seamless-mode');
        this.uiStateController.disable();
        this.gridController.disable();
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.SeamlessMode = SeamlessMode;
