/**
 * Filters Manager
 * -----------------------------------------
 * Coordinates infinite loader loops caused by hiding too many videos.
 * On page navigation, triggers a full CardPipeline re-evaluation.
 */
import '../../../../core/system/base-feature.js';
export class FiltersManager extends window.YPP.features.BaseFeature {
    static featureId = 'filtersManager';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('FiltersManager');
        this._infiniteLoopCounter = 0;
        this._lastLoaderTime = 0;
        this._lastScrollY = 0;
        this._boundProcessLoader = this._processLoader.bind(this);
    }

    getConfigKey() { return null; } // Always runs

    async enable() {
        await super.enable();
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'infinite-loader-detector',
                'tp-yt-paper-spinner',
                this._boundProcessLoader,
                false,
                false
            );
        }

        // On page navigation, trigger a full re-evaluation via CardPipeline
        this.onBusEvent('app:pageChange', () => {
            this._triggerPipelineReevaluation();
        });
        
        this._triggerPipelineReevaluation();
    }

    async disable() {
        await super.disable();
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('infinite-loader-detector');
        }
    }

    _triggerPipelineReevaluation() {
        const pipeline = window.YPP.featureManager?.getFeature('CardPipeline');
        if (pipeline?.isEnabled) {
            pipeline.triggerGlobalReevaluation();
        }
    }

    _processLoader(nodes) {
        if (!this.isEnabled || nodes.length === 0) return;
        
        const now = Date.now();
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - this._lastScrollY);

        if (now - this._lastLoaderTime > 10000) {
            this._infiniteLoopCounter = 0;
        }
        
        // Only count as problematic if user hasn't scrolled significantly
        if (scrollDelta < 100) {
            this._infiniteLoopCounter++;
            this._lastLoaderTime = now;
            if (this._infiniteLoopCounter >= 4) {
                this._infiniteLoopCounter = 0;
                this._lastLoaderTime = now + 10000;
                window.YPP.Utils.log('Infinite loader loop detected due to excessive hiding.', 'FILTERS', 'warn');
                try {
                    window.YPP.Utils.createToast('Too many videos hidden! YouTube is stuck loading. Scroll down or disable some filters.', 'warn', 5000);
                } catch (e) {}
            }
        } else {
            this._infiniteLoopCounter = 0;
        }
        this._lastScrollY = currentScrollY;
    }
}
window.YPP.features.FiltersManager = FiltersManager;

// ─── High-Filtering Warning System ────────────────────────────────────────────
// Tracks hidden vs visible card ratio across all filters.
// Shows a non-intrusive banner when 85%+ of cards are filtered.

window.YPP.FilterWarning = (() => {
    const HIGH_RATIO = 0.85;
    const MIN_CARDS  = 10;
    const BANNER_ID  = 'ypp-filter-warning-banner';
    const DISMISS_MS = 10000;

    let _hiddenCount = 0;
    let _totalCount  = 0;
    let _lastWarned  = 0;
    let _dismissTimer = null;

    function _getOrCreateBanner() {
        let banner = document.getElementById(BANNER_ID);
        if (!banner) {
            banner = document.createElement('div');
            banner.id = BANNER_ID;
            banner.style.cssText = [
                'position:fixed',
                'bottom:24px',
                'left:50%',
                'transform:translateX(-50%)',
                'z-index:99999',
                'background:rgba(30,20,0,0.92)',
                'color:#fde68a',
                'border:1px solid rgba(245,158,11,0.55)',
                'border-radius:10px',
                'padding:10px 18px',
                'font:500 13px/1.4 Roboto,Arial,sans-serif',
                'display:flex',
                'align-items:center',
                'gap:10px',
                'box-shadow:0 4px 24px rgba(0,0,0,0.5)',
                'backdrop-filter:blur(8px)',
                'max-width:500px',
                'animation:ypp-badge-in 200ms ease-out',
            ].join(';');

            const msg = document.createElement('span');
            banner.appendChild(msg);

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = 'background:none;border:none;color:inherit;cursor:pointer;font-size:16px;opacity:0.7;padding:0;line-height:1;flex-shrink:0;';
            closeBtn.addEventListener('click', dismiss);
            banner.appendChild(closeBtn);

            document.body?.appendChild(banner);
        }
        return banner;
    }

    function showWarning(hiddenCount, totalCount) {
        const banner = _getOrCreateBanner();
        const msg = banner.querySelector('span');
        const pct = Math.round((hiddenCount / totalCount) * 100);
        if (msg) {
            msg.textContent = `⚠️ ${pct}% of videos are being filtered (${hiddenCount}/${totalCount}). Your filters may be too aggressive.`;
        }
        banner.style.display = 'flex';

        clearTimeout(_dismissTimer);
        _dismissTimer = setTimeout(dismiss, DISMISS_MS);
    }

    function dismiss() {
        const banner = document.getElementById(BANNER_ID);
        if (banner) {
            banner.classList.add('ypp-badge-leaving');
            setTimeout(() => banner.remove(), 200);
        }
        clearTimeout(_dismissTimer);
    }

    function record(hiddenCount, totalCount) {
        _hiddenCount += hiddenCount;
        _totalCount  += totalCount;

        // Debounce: only evaluate once per second to avoid spam
        const now = Date.now();
        if (now - _lastWarned < 1000) return;
        _lastWarned = now;

        const h = _hiddenCount;
        const t = _totalCount;
        _hiddenCount = 0;
        _totalCount  = 0;

        if (t >= MIN_CARDS && h / t >= HIGH_RATIO) {
            showWarning(h, t);
        }
    }

    // Bind to event bus instead of global method calls
    setTimeout(() => {
        if (window.YPP?.events) {
            window.YPP.events.on('filter:warning:record', (data) => {
                if (data) record(data.hidden || 1, data.total || 1);
            });
        }
    }, 0);

    return { dismiss };
})();
