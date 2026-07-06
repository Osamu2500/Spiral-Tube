import cssText from './forest-ui-theme.css?raw';

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

window.YPP.features.ForestUiTheme = class ForestUiTheme extends window.YPP.features.BaseFeature {
    constructor() {
        super('ForestUiTheme');
        this._styleId = 'ypp-forest-theme-styles';
        this._observer = null;
    }

    _setup() {
        if (this._settings.youtubePageTheme === 'forest') {
            this._injectStyles();
        }
    }

    _teardown() {
        this._removeStyles();
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        document.documentElement.removeAttribute('data-ypp-card-style-override');
    }

    _injectStyles() {
        if (document.getElementById(this._styleId)) return;
        const style = document.createElement('style');
        style.id = this._styleId;
        style.textContent = cssText;
        document.head.appendChild(style);

        // Force the card style to forest
        document.documentElement.setAttribute('data-ypp-card-style-override', 'forest');
    }

    _removeStyles() {
        const style = document.getElementById(this._styleId);
        if (style) {
            style.remove();
        }
    }

    onSettingsChanged(changes) {
        if (changes.youtubePageTheme) {
            if (changes.youtubePageTheme.newValue === 'forest') {
                this._injectStyles();
            } else {
                this._teardown();
            }
        }
    }
};
