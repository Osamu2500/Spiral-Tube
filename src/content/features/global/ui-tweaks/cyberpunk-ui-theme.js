import cssText from './cyberpunk-ui-theme.css?raw';

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

window.YPP.features.CyberpunkUiTheme = class CyberpunkUiTheme extends window.YPP.features.BaseFeature {
    constructor() {
        super('CyberpunkUiTheme');
        this._styleId = 'ypp-cyberpunk-style';
    }

    async update(settings) {
        this.settings = { ...this.settings, ...settings };
        if (this.settings.youtubePageTheme === 'cyberpunk') {
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
