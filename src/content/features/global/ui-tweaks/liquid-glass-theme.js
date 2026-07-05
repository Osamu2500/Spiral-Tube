import cssText from './liquid-glass-theme.css?raw';

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

window.YPP.features.LiquidGlassTheme = class LiquidGlassTheme extends window.YPP.features.BaseFeature {
    constructor() {
        super('LiquidGlassTheme');
        this._styleId = 'ypp-liquid-glass-style';
    }

    getConfigKey() {
        return 'liquidGlassTheme';
    }

    enable() {
        this._injectStyles();
    }

    disable() {
        this._removeStyles();
    }

    onUpdate() {
        if (this.settings[this.getConfigKey()]) {
            this.enable();
        } else {
            this.disable();
        }
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
