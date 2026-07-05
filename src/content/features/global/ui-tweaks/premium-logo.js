window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

window.YPP.features.PremiumLogo = class PremiumLogo extends window.YPP.features.BaseFeature {
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
