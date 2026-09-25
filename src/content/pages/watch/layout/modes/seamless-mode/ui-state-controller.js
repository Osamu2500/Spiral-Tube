/**
 * @fileoverview
 * UI State Controller (Seamless Mode)
 * 
 * Scope: Consolidates the toggling of layout CSS classes for the 
 * Channel Bar and Action Buttons (Like/Share) when Seamless Mode is active.
 * Does not affect unrelated files/functionality outside its scope.
 */
export class UIStateController {
    static CLASSES = {
        ACTIONS_ACTIVE: 'ypp-seamless-actions-active',
        CHANNEL_ACTIVE: 'ypp-seamless-channel-active'
    };

    /**
     * @param {Object} parentFeature - The parent seamless mode feature instance
     */
    constructor(parentFeature) {
        this.utils = parentFeature.utils;
        this.isEnabled = false;
    }

    /**
     * Enables the UI layout overrides
     */
    enable() {
        try {
            if (this.isEnabled) return;
            this.isEnabled = true;
            document.body.classList.add(UIStateController.CLASSES.ACTIONS_ACTIVE);
            document.body.classList.add(UIStateController.CLASSES.CHANNEL_ACTIVE);
            this.utils.log('UIStateController Enabled', 'seamlessMode', 'info');
        } catch (error) {
            this.utils.log(error.message, 'seamlessMode', 'error');
        }
    }

    /**
     * Disables the UI layout overrides
     */
    disable() {
        try {
            if (!this.isEnabled) return;
            this.isEnabled = false;
            document.body.classList.remove(UIStateController.CLASSES.ACTIONS_ACTIVE);
            document.body.classList.remove(UIStateController.CLASSES.CHANNEL_ACTIVE);
            this.utils.log('UIStateController Disabled', 'seamlessMode', 'info');
        } catch (error) {
            this.utils.log(error.message, 'seamlessMode', 'error');
        }
    }
}
