/**
 * @fileoverview
 * Action Buttons Controller
 * 
 * Scope: Responsible for maintaining the stacking and structural layout
 * of the Like/Share buttons when Seamless Mode is toggled.
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
        document.body.classList.add('ypp-seamless-actions-active');
        this.logger.info("ActionButtonsController Enabled");
    }

    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        document.body.classList.remove('ypp-seamless-actions-active');
        this.logger.info("ActionButtonsController Disabled");
    }
}
