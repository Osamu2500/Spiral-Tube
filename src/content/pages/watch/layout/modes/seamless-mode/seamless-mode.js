import '../../../../../core/system/base-feature.js';
import { TelemetryLogger } from './telemetry-logger.js';
import { DOMTransactionManager } from './dom-transaction-manager.js';
import { ActionButtonsController } from './action-buttons-controller.js';
import { ChannelBarController } from './channel-bar-controller.js';
import { RelatedGridController } from './related-grid-controller.js';

/**
 * @fileoverview
 * Seamless Mode Orchestrator
 * Integrates multiple sub-controllers to relentlessly enforce a specific layout structure on the YouTube Watch Page.
 */
export class SeamlessMode extends window.YPP.features.BaseFeature {
    static featureId = 'seamlessMode';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'seamlessMode'; }
    
    constructor() {
        super('seamlessMode');
        
        this.logger = new TelemetryLogger('SeamlessModeOrchestrator');
        this.txManager = new DOMTransactionManager(this.logger);
        this.actionController = new ActionButtonsController(this.logger);
        this.channelBarController = new ChannelBarController(this.logger);
        this.gridController = new RelatedGridController(this.logger);
        
        this.isEnabled = false;
        this.isWatchPage = false;
        this.spaObserver = null;
        
        this._bindContexts();
    }

    _bindContexts() {
        this.enable = this.enable.bind(this);
        this.disable = this.disable.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this._executeMacroLayoutSwap = this._executeMacroLayoutSwap.bind(this);
    }

    enable() {
        if (this.isEnabled) return;
        this.isEnabled = true;
        
        this.logger.info('Initializing Enterprise Layout Engine v1.0...');
        
        this._checkPageContext();
        if (this.isWatchPage) {
            this._activateEngines();
        }
        
        this._startGlobalObserver();
    }

    disable() {
        if (!this.isEnabled) return;
        this.isEnabled = false;
        
        this.logger.info('Shutting down Engine and Rolling back transactions...');
        
        this._deactivateEngines();
        this._stopGlobalObserver();
        
        super.disable();
    }

    onPageChange() {
        this.logger.measure('PageChangeProcessing', () => {
            this._checkPageContext();
            
            if (this.isEnabled && this.isWatchPage) {
                setTimeout(() => this._activateEngines(), 150);
            } else {
                this._deactivateEngines();
            }
        });
    }

    _checkPageContext() {
        this.isWatchPage = location.pathname === '/watch';
    }

    _activateEngines() {
        this._executeMacroLayoutSwap();
        this.actionController.enable();
        this.channelBarController.enable();
        this.gridController.enable();
    }

    _deactivateEngines() {
        this.actionController.disable();
        this.channelBarController.disable();
        this.gridController.disable();
        this.txManager.rollbackAll();
    }

    _startGlobalObserver() {
        this._stopGlobalObserver(); 
        
        if (window.YPP && window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('seamless-global-spa', '#below, #related, #primary-inner, #secondary-inner', () => {
                if (!this.isEnabled || !this.isWatchPage) return;
                
                if (this._macroSwapTimer) clearTimeout(this._macroSwapTimer);
                
                this._macroSwapTimer = setTimeout(() => {
                    this._executeMacroLayoutSwap();
                }, 150);
            }, false);
        }
    }

    _stopGlobalObserver() {
        if (window.YPP && window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('seamless-global-spa');
        }
        if (this._macroSwapTimer) {
            clearTimeout(this._macroSwapTimer);
            this._macroSwapTimer = null;
        }
    }

    _executeMacroLayoutSwap() {
        if (!this.isEnabled || !this.isWatchPage) return;

        this.logger.measure('MacroLayoutSwapExecution', () => {
            const primaryInner = document.querySelector('#primary-inner');
            const secondaryInner = document.querySelector('#secondary-inner');
            
            if (!primaryInner || !secondaryInner) {
                this.logger.warn('Macro swap aborted: Missing primary/secondary inner containers');
                return;
            }

            const below = document.querySelector('#below');
            const related = document.querySelector('#related');

            if (!below || !related) {
                this.logger.warn('Macro swap aborted: Missing #below or #related content nodes');
                return;
            }

            this.txManager.moveNode('swap-below', below, secondaryInner);
            this.txManager.moveNode('swap-related', related, primaryInner);

            try {
                const tabviewFeature = window.YPP?.featureManager?.getFeature('tabviewSidebar');
                if (tabviewFeature && typeof tabviewFeature.onUpdate === 'function') {
                    tabviewFeature.onUpdate();
                }
            } catch (e) {
                this.logger.warn('Failed to coordinate with TabviewSidebar:', e);
            }
        });
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.SeamlessMode = SeamlessMode;
