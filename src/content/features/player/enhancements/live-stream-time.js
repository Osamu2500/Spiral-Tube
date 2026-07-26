/**
 * Live Stream Time Feature (Style 8167)
 * Displays current elapsed livestream duration in the video player controls
 * by unhiding native time indicators that YouTube hides during live broadcasts.
 */

export class LiveStreamTime extends window.YPP.features.BaseFeature {
    static featureId = 'liveStreamTime';
    static executionPhase = 'idle';
    static priority = 16;

    constructor() {
        super('LiveStreamTime');
        this.name = 'LiveStreamTime';
    }

    getConfigKey() {
        return 'showLiveStreamTime';
    }

    async enable() {
        await super.enable();
        this.applyLiveStreamTime(true);
        this.utils?.log?.('Live Stream Time enabled (Style 8167)', 'LIVE-STREAM-TIME');
    }

    async disable() {
        await super.disable();
        this.applyLiveStreamTime(false);
        this.utils?.log?.('Live Stream Time disabled', 'LIVE-STREAM-TIME');
    }

    async onUpdate() {
        this.applyLiveStreamTime(this.isEnabled);
    }

    applyLiveStreamTime(active) {
        const body = document.body;
        if (active) {
            if (body) body.classList.add('ypp-live-stream-time');
        } else {
            if (body) body.classList.remove('ypp-live-stream-time');
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.LiveStreamTime = LiveStreamTime;
