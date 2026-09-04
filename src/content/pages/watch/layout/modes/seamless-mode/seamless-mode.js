import '../../../../../core/system/base-feature.js';
import { TelemetryLogger } from './telemetry-logger.js';
import { DOMTransactionManager } from './dom-transaction-manager.js';
import { ActionButtonsController } from './action-buttons-controller.js';
import { ChannelBarController } from './channel-bar-controller.js';
import { RelatedGridController } from './related-grid-controller.js';
import { TabviewSidebarController } from './tabview-sidebar-controller.js';

/**
 * @fileoverview
 * Seamless Layout Engine (formerly Seamless Mode Orchestrator)
 * Integrates multiple sub-controllers to relentlessly enforce a specific layout structure on the YouTube Watch Page.
 * Now manages both the Grid layouts and the Tabview Sidebar UI to prevent DOM conflicts.
 */
export class SeamlessMode extends window.YPP.features.BaseFeature {
    static featureId = 'seamlessMode';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return null; } // Custom handling based on multiple settings
    
    constructor() {
        super('seamlessMode');
        
        this.logger = new TelemetryLogger('SeamlessLayoutEngine');
        this.txManager = new DOMTransactionManager(this.logger);
        this.actionController = new ActionButtonsController(this.logger);
        this.channelBarController = new ChannelBarController(this.logger);
        this.gridController = new RelatedGridController(this.logger);
        this.tabviewController = new TabviewSidebarController(this.logger);
        
        this.isEnabled = false;
        this.isWatchPage = false;
        
        this._bindContexts();
    }

    _bindContexts() {
        this.enable = this.enable.bind(this);
        this.disable = this.disable.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this._executeMacroLayoutSwap = this._executeMacroLayoutSwap.bind(this);
        this._onTabviewChanged = this._onTabviewChanged.bind(this);
    }

    async update(settings) {
        let settingsChanged = false;
        const oldSettings = { ...this.settings };
        if (settings) {
            for (const key in settings) {
                if (settings[key] !== this.settings[key]) {
                    settingsChanged = true;
                    break;
                }
            }
        }
        
        this.settings = { ...this.settings, ...settings };

        const shouldBeEnabled = Boolean(this.settings.seamlessMode);

        if (shouldBeEnabled && !this.isEnabled) {
            this.logger.info('Enabling Seamless Layout Engine');
            this._abortController = new AbortController();
            await this.enable();
        } else if (!shouldBeEnabled && this.isEnabled) {
            this.logger.info('Disabling Seamless Layout Engine');
            if (this._abortController) this._abortController.abort();
            await this.disable();
        } else if (this.isEnabled && settingsChanged) {
            this._triggerSettingWatchers(this.settings, oldSettings);
            this._executeMacroLayoutSwap();
        }
    }

    enable() {
        if (this.isEnabled) return;
        this.isEnabled = true;
        
        this.logger.info('Initializing Enterprise Layout Engine v2.0 (with Tabview)...');
        
        this._checkPageContext();
        if (this.isWatchPage) {
            this._activateEngines();
        }
        
        this._startGlobalObserver();
        this.addListener(document, 'ypp-tabview-changed', this._onTabviewChanged);
    }

    disable() {
        if (!this.isEnabled) return;
        this.isEnabled = false;
        
        this.logger.info('Shutting down Engine and Rolling back transactions...');
        
        this._deactivateEngines();
        this._stopGlobalObserver();
        this.removeListener(document, 'ypp-tabview-changed', this._onTabviewChanged);
        
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
        this.tabviewController.enable();
        
        this._executeMacroLayoutSwap();
        
        if (this.settings.seamlessMode) {
            this.actionController.enable();
            this.channelBarController.enable();
        }
    }

    _deactivateEngines() {
        this.actionController.disable();
        this.channelBarController.disable();
        this.gridController.disable();
        this.tabviewController.disable();
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

    _onTabviewChanged(e) {
        if (!this.isEnabled || !this.isWatchPage) return;
        this._executeMacroLayoutSwap();
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

            if (!below || !related) return;

            const isSeamless = Boolean(this.settings.seamlessMode);
            const activeTab = this.tabviewController.getActiveTab();

            if (isSeamless) {
                if (activeTab === 'comments' || activeTab === 'info') {
                    // Comments/Info go to Sidebar, Related goes to Primary (Grid)
                    this.txManager.moveNode('swap-below', below, secondaryInner);
                    this.txManager.moveNode('swap-related', related, primaryInner);
                    this.gridController.enable();
                } else if (activeTab === 'related') {
                    // Related goes to Sidebar
                    this.gridController.disable();
                    this.txManager.moveNode('swap-related', related, secondaryInner);
                    // 'below' returns to primary
                    this.txManager.moveNode('swap-below', below, primaryInner);
                }
            } else {
                // Should have been disabled, but if reached here, rollback
                this.txManager.rollbackAll();
            }
        });
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.SeamlessMode = SeamlessMode;
