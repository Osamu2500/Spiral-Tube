import '../../../core/system/base-feature.js';
/**
 * Customize YouTube UI Feature (Style 21084 & Style 16687)
 * Manages granular UI customization toggles for hiding clutter across YouTube:
 * - Paid Promotion banner overlay
 * - Thanks / Donate buttons
 * - Share / Clip / Remix action buttons
 * - YouTube Logo Country Code superscript
 * - Watermark branding in the player
 * - Useless sidebar guide links and footer
 */

export class CustomizeYouTubeUI extends window.YPP.features.BaseFeature {
    static featureId = 'customizeYouTubeUI';
    static executionPhase = 'idle';
    static priority = 21;

    constructor() {
        super('CustomizeYouTubeUI');
        this.name = 'CustomizeYouTubeUI';
        this.toggleMap = {
            hideThanksDonate: 'ypp-hide-thanks-donate',
            hideActionButtons: 'ypp-hide-action-buttons',
            hidePaidPromotion: 'ypp-hide-paid-promotion',
            hideCountryCode: 'ypp-hide-country-code',
            hidePlayerBranding: 'ypp-hide-player-branding',
            hideUselessGuideLinks: 'ypp-hide-useless-guide-links'
        };
    }

    getConfigKey() {
        // Can be triggered when any of these change
        return 'hidePaidPromotion';
    }

    async enable() {
        await super.enable();
        this.applyAllCustomizations();
        this.utils?.log?.('Customize YouTube UI enabled (Styles 21084 & 16687)', 'CUSTOMIZE-YOUTUBE-UI');
    }

    async disable() {
        await super.disable();
        const body = document.body;
        if (body) {
            Object.values(this.toggleMap).forEach(cls => body.classList.remove(cls));
        }
        this.utils?.log?.('Customize YouTube UI disabled', 'CUSTOMIZE-YOUTUBE-UI');
    }

    async onUpdate() {
        this.applyAllCustomizations();
    }

    applyAllCustomizations() {
        const body = document.body;
        if (!body) return;

        Object.entries(this.toggleMap).forEach(([key, className]) => {
            const enabled = Boolean(this.settings?.[key]);
            if (enabled) {
                body.classList.add(className);
            } else {
                body.classList.remove(className);
            }
        });
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.CustomizeYouTubeUI = CustomizeYouTubeUI;
