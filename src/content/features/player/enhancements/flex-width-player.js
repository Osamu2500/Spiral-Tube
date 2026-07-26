/**
 * Flex Width Player Feature (Style 12492)
 * Removes hardcoded width limits on YouTube's player container,
 * allowing the video and sidebar chat/recommendations to flex organically with the window.
 */

export class FlexWidthPlayer extends window.YPP.features.BaseFeature {
    static featureId = 'flexWidthPlayer';
    static executionPhase = 'idle';
    static priority = 17;

    constructor() {
        super('FlexWidthPlayer');
        this.name = 'FlexWidthPlayer';
    }

    getConfigKey() {
        return 'flexWidthPlayer';
    }

    async enable() {
        await super.enable();
        this.applyFlexWidth(true);
        this.utils?.log?.('Flex Width Player enabled (Style 12492)', 'FLEX-WIDTH-PLAYER');
    }

    async disable() {
        await super.disable();
        this.applyFlexWidth(false);
        this.utils?.log?.('Flex Width Player disabled', 'FLEX-WIDTH-PLAYER');
    }

    async onUpdate() {
        this.applyFlexWidth(this.isEnabled);
    }

    applyFlexWidth(active) {
        const body = document.body;
        if (active) {
            if (body) body.classList.add('ypp-flex-width-player');
        } else {
            if (body) body.classList.remove('ypp-flex-width-player');
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.FlexWidthPlayer = FlexWidthPlayer;
