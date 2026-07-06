import cssText from './nature-ui-theme.css?raw';

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

window.YPP.features.NatureUiTheme = class NatureUiTheme extends window.YPP.features.BaseFeature {
    constructor() {
        super('NatureUiTheme');
        this._styleId = 'ypp-nature-style';
    }

    async update(settings) {
        this.settings = { ...this.settings, ...settings };
        if (this.settings.youtubePageTheme === 'nature') {
            if (!this.isEnabled) {
                this.enable();
                this.isEnabled = true;
            }
        } else {
            if (this.isEnabled) {
                this.disable();
                this.isEnabled = false;
            }
        }
    }

    enable() {
        this._injectStyles();
    }

    disable() {
        this._removeStyles();
    }

    _injectStyles() {
        if (document.getElementById(this._styleId)) return;
        const style = document.createElement('style');
        style.id = this._styleId;
        style.textContent = cssText;
        document.head.appendChild(style);
    }

    _removeStyles() {
        const style = document.getElementById(this._styleId);
        if (style) style.remove();
    }
};
