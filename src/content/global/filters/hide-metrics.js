import './base-filter-feature.js';
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
        this._injectStyles();
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
        
        // HideMetrics does not use standard _shouldRunOnCurrentPage because it might be active globally EXCEPT watch/channel
        if (isWatchPage || isChannelPage) {
            document.body.classList.remove('ypp-hide-metrics');
            return;
        }
        
        document.body.classList.add('ypp-hide-metrics');
    }

    _injectStyles() {
        if (document.getElementById('ypp-hide-metrics-css')) return;
        const style = document.createElement('style');
        style.id = 'ypp-hide-metrics-css';
        style.textContent = `
            body.ypp-hide-metrics ytd-video-meta-block #metadata-line span,
            body.ypp-hide-metrics ytd-video-meta-block #metadata-line .ytd-video-meta-block,
            body.ypp-hide-metrics ytm-badge-and-byline-renderer .ytm-badge-and-byline-separator {
                display: none !important;
            }
            body.ypp-hide-metrics ytd-video-meta-block #metadata-line span:first-child,
            body.ypp-hide-metrics ytd-video-meta-block #metadata-line span:nth-child(2)::before {
                display: inline !important; /* Keep upload date, hide views */
            }
            /* Hide the separator dots natively injected via ::before */
            body.ypp-hide-metrics ytd-video-meta-block #metadata-line span:nth-child(n+3)::before {
                display: none !important;
                content: none !important;
            }
        `;
        document.head.appendChild(style);
    }
};

window.YPP.features.HideMetrics = HideMetrics;
