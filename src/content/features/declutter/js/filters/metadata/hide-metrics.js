/**
 * HideMetrics
 * -----------------------------------------
 * Hides numerical metrics (views, subscriber counts) globally via CSS classes.
 * Specifically avoids running on the Watch and Channel pages to keep metrics visible there.
 */
import '../../core/base-filter-feature.js';

export class HideMetrics extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hideMetrics';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('HideMetrics');
        this._bound = this._apply.bind(this);
    }

    getConfigKey() { return 'hideMetrics'; }

    async enable() {
        await super.enable();
        this._apply();
        window.YPP.events?.on('page:changed', this._bound);
    }

    async disable() {
        await super.disable();
        window.YPP.events?.off('page:changed', this._bound);
        document.body.classList.remove('ypp-hide-metrics');
    }

    _apply() {
        if (!this.isEnabled) return;
        
        const path = window.location.pathname;
        const isWatchPage = path === '/watch' || path.startsWith('/shorts/');
        const isChannelPage = path.startsWith('/@') || path.startsWith('/channel/') || path.startsWith('/c/');
        
        if (isWatchPage || isChannelPage) {
            document.body.classList.remove('ypp-hide-metrics');
            return;
        }
        
        document.body.classList.add('ypp-hide-metrics');
    }
}

window.YPP.features.HideMetrics = HideMetrics;
