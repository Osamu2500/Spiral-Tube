/**
 * @fileoverview
 * Channel Bar Controller
 * 
 * Scope: Responsible for maintaining the alignment of the Avatar, Channel Name,
 * Join Button, Subscribe Button, and Bell Icon on a single horizontal line.
 * Does not affect unrelated files/functionality outside its scope.
 */
export class ChannelBarController {
    static CLASSES = {
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
     * Enables the channel bar layout override
     */
    enable() {
        try {
            if (this.isEnabled) return;
            this.isEnabled = true;
            document.body.classList.add(ChannelBarController.CLASSES.CHANNEL_ACTIVE);
            this.utils.log('ChannelBarController Enabled', 'seamlessMode', 'info');
        } catch (error) {
            this.utils.log(error.message, 'seamlessMode', 'error');
        }
    }

    /**
     * Disables the channel bar layout override
     */
    disable() {
        try {
            if (!this.isEnabled) return;
            this.isEnabled = false;
            document.body.classList.remove(ChannelBarController.CLASSES.CHANNEL_ACTIVE);
            this.utils.log('ChannelBarController Disabled', 'seamlessMode', 'info');
        } catch (error) {
            this.utils.log(error.message, 'seamlessMode', 'error');
        }
    }
}
