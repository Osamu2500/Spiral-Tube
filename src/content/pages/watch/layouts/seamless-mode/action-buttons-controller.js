/**
 * @fileoverview
 * Action Buttons Controller
 * Responsible for maintaining the stacking of the Like/Share buttons.
 */
export class ActionButtonsController {
    constructor(logger) {
        this.logger = logger;
        this.enabled = false;
        this.styleElement = null;
    }

    enable() {
        if (this.enabled) return;
        this.enabled = true;
        if (!this.styleElement) {
            this.styleElement = document.createElement("style");
            this.styleElement.id = "seamless-action-buttons-enforcer";
            this.styleElement.textContent = `
                ytd-watch-metadata #top-row {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    flex-wrap: nowrap !important;
                    width: 100% !important;
                    overflow: visible !important;
                    max-height: none !important;
                }
                ytd-watch-metadata #owner {
                    width: 100% !important;
                    display: block !important;
                    margin-bottom: 12px !important;
                }
                ytd-watch-metadata #actions {
                    margin-top: 12px !important;
                    padding-top: 0 !important;
                    width: 100% !important;
                    display: block !important;
                    overflow: visible !important;
                    max-width: none !important;
                }
                ytd-watch-metadata #actions-inner {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    flex-direction: row !important;
                    justify-content: flex-start !important;
                    align-items: center !important;
                    width: 100% !important;
                    gap: 8px !important;
                }
            `;
            document.head.appendChild(this.styleElement);
        }
        this.logger.info("ActionButtonsController Enabled");
    }

    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        if (this.styleElement) {
            this.styleElement.remove();
            this.styleElement = null;
        }
        this.logger.info("ActionButtonsController Disabled");
    }
}
