import cssText from './retro-ui-theme.css?raw';

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

window.YPP.features.RetroUiTheme = class RetroUiTheme extends window.YPP.features.BaseFeature {
    constructor() {
        super('RetroUiTheme');
        this._styleId = 'ypp-retro-theme-styles';
    }

    async update(settings) {
        this.settings = { ...this.settings, ...settings };
        if (this.settings.youtubePageTheme === 'retro') {
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
        document.documentElement.removeAttribute('data-ypp-card-style-override');
    }

    _injectStyles() {
        if (document.getElementById(this._styleId)) return;
        const style = document.createElement('style');
        style.id = this._styleId;
        style.textContent = cssText;
        document.head.appendChild(style);

        // Force the card style to retro so layout CSS handles cards correctly
        document.documentElement.setAttribute('data-ypp-card-style-override', 'retro');
    }

    _removeStyles() {
        const style = document.getElementById(this._styleId);
        if (style) style.remove();
    }
};
