/**
 * Compact Player UI Feature (Style 24682)
 * Reduces vertical padding and button spacing on the new YouTube player control bar
 * so controls cover less of the video content.
 */

export class CompactPlayerUI extends window.YPP.features.BaseFeature {
    static featureId = 'compactPlayerUI';
    static executionPhase = 'idle';
    static priority = 18;

    constructor() {
        super('CompactPlayerUI');
        this.name = 'CompactPlayerUI';
    }

    getConfigKey() {
        return 'compactPlayerUI';
    }

    async enable() {
        await super.enable();
        this.applyCompactUI(true);
        this.utils?.log?.('Compact Player UI enabled (Style 24682)', 'COMPACT-PLAYER-UI');
    }

    async disable() {
        await super.disable();
        this.applyCompactUI(false);
        this.utils?.log?.('Compact Player UI disabled', 'COMPACT-PLAYER-UI');
    }

    async onUpdate() {
        this.applyCompactUI(this.isEnabled);
    }

    applyCompactUI(active) {
        const body = document.body;
        if (active) {
            if (body) body.classList.add('ypp-compact-player-ui');
        } else {
            if (body) body.classList.remove('ypp-compact-player-ui');
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.CompactPlayerUI = CompactPlayerUI;
