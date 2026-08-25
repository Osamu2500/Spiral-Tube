import '../../../../core/system/base-feature.js';
import { CONFIG } from './constants.js';
import { CinematicController } from './cinematic-controller.js';

export class CinematicMode extends window.YPP.features.BaseFeature {
    static featureId = 'cinematicMode';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super();
        this._controller = null;
        this.onPageChange = this.onPageChange.bind(this);
    }

    getConfigKey() {
        return 'cinematicMode';
    }

    getDependencies() {
        return [];
    }

    onPageChange() {
        const isHome = CONFIG.HOME_PATHS.includes(window.location.pathname);
        if (isHome && this.settings?.cinematicMode) {
            this._activate();
        } else {
            this._teardown();
        }
    }

    async enable() {
        super.enable();
        const isHome = CONFIG.HOME_PATHS.includes(window.location.pathname);
        if (isHome && this.settings?.cinematicMode) {
            this._activate();
        }
    }

    disable() {
        super.disable();
        this._teardown();
    }

    async onUpdate() {
        if (this._controller && this.settings?.cinematicMuted !== undefined) {
            this._controller.state.isMuted = this.settings.cinematicMuted;
            this._controller.syncMuteState();
        }
    }

    _activate() {
        if (this._controller) return;
        if (!document.getElementById('ypp-cinematic-style')) {
            const style = document.createElement('style');
            style.id = 'ypp-cinematic-style';
            // cinematicThemeCSS is a global variable injected by the build system
            if (typeof cinematicThemeCSS !== 'undefined') {
                style.textContent = cinematicThemeCSS;
            } else {
                console.warn('[CinematicMode] cinematicThemeCSS is undefined');
            }
            document.head.appendChild(style);
        }
        this._controller = new CinematicController(this.settings);
        this._controller.init();
    }

    _teardown() {
        if (this._controller) {
            this._controller.destroy();
            this._controller = null;
        }
        const style = document.getElementById('ypp-cinematic-style');
        if (style) style.remove();
    }
}
