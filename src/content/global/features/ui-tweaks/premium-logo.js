import '../../../core/system/base-feature.js';
export class PremiumLogo extends window.YPP.features.BaseFeature {
    static featureId = 'premiumLogo';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('PremiumLogo');
    }

    getConfigKey() {
        return 'premiumLogo';
    }

    async enable() {
        await super.enable();
        document.body.classList.add('ypp-premium-logo');
    }

    async disable() {
        await super.disable();
        document.body.classList.remove('ypp-premium-logo');
    }
};

window.YPP.features.PremiumLogo = PremiumLogo;
