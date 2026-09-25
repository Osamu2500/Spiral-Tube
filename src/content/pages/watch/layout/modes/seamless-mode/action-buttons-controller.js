/**
 * @fileoverview
 * Action Buttons Controller
 * 
 * Scope: Responsible for maintaining the stacking and structural layout
 * of the Like/Share buttons when Seamless Mode is toggled.
 * Does not affect unrelated files/functionality outside its scope.
 */
export class ActionButtonsController {
    static CLASSES = {
        ACTIONS_ACTIVE: 'ypp-seamless-actions-active'
    };

    /**
     * @param {Object} parentFeature - The parent seamless mode feature instance
     */
    constructor(parentFeature) {
        this.utils = parentFeature.utils;
        this.isEnabled = false;
    }

    /**
     * Enables the action buttons layout override
     */
    enable() {
        try {
            if (this.isEnabled) return;
            this.isEnabled = true;
            document.body.classList.add(ActionButtonsController.CLASSES.ACTIONS_ACTIVE);
            this.utils.log('ActionButtonsController Enabled', 'seamlessMode', 'info');
        } catch (error) {
            this.utils.log(error.message, 'seamlessMode', 'error');
        }
    }

    /**
     * Disables the action buttons layout override
     */
    disable() {
        try {
            if (!this.isEnabled) return;
            this.isEnabled = false;
            document.body.classList.remove(ActionButtonsController.CLASSES.ACTIONS_ACTIVE);
            this.utils.log('ActionButtonsController Disabled', 'seamlessMode', 'info');
        } catch (error) {
            this.utils.log(error.message, 'seamlessMode', 'error');
        }
    }
}
