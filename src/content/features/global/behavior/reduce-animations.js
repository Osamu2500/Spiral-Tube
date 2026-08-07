/**
 * ReduceAnimations Feature
 *
 * Three-speed animation suppression for YouTube:
 *   'off'      → no suppression (default YouTube behaviour)
 *   'balanced' → halves all durations (max 0.15s), preserves easing — subtle and smooth
 *   'minimal'  → near-zero durations (0.01ms), disables scroll-behaviour, kills iteration counts
 *
 * Extra capabilities:
 *   • Respects OS `prefers-reduced-motion` — auto-activates Minimal on accessibility setting
 *   • Intercepts `Element.prototype.scrollIntoView` in Minimal mode to stop JS smooth-scrolls
 *   • Exempts extension-owned elements (toasts, PiP, subtitles) from suppression
 *   • Fully reversible on disable — no page reload needed
 */

export class ReduceAnimations extends window.YPP.features.BaseFeature {
    static featureId = 'reduceAnimations';

    constructor() {
        super('ReduceAnimations');
        this.name = 'ReduceAnimations';
        this._currentMode = 'off';
        this._originalScrollIntoView = null;
        this._originalAnimate = null;
        this._motionQuery = null;
        this._motionHandler = null;
    }

    getConfigKey() {
        return 'reduceAnimations';
    }

    async enable() {
        await super.enable();
        const mode = this._resolveMode();
        this._applyMode(mode);
    }

    async disable() {
        await super.disable();
        this._clearMode();
    }

    /** Called by FeatureManager whenever settings change live in the popup */
    onSettingsUpdate(settings) {
        if (!this._isEnabled) return;
        const mode = this._resolveMode(settings);
        if (mode !== this._currentMode) {
            this._clearMode();
            this._applyMode(mode);
        }
    }

    // ─── Mode Resolution ──────────────────────────────────────────────────────

    _resolveMode(settings) {
        const stored = (settings || this.settings)?.reduceAnimations;
        // 2B: Check OS prefers-reduced-motion — override to minimal if set
        const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
        if (prefersReduced && (!stored || stored === 'off')) {
            // First time auto-activation toast
            if (!this._osAutoActivated) {
                this._osAutoActivated = true;
                setTimeout(() => {
                    this.utils?.createToast?.(
                        '♿ Reduce Animations: Minimal mode auto-activated (OS accessibility setting detected)',
                        'info', 5000
                    );
                }, 1000);
            }
            return 'minimal';
        }
        if (stored === 'balanced' || stored === 'minimal') return stored;
        if (stored === true) return 'minimal'; // legacy boolean support
        return 'off';
    }

    // ─── Apply / Clear ────────────────────────────────────────────────────────

    _applyMode(mode) {
        this._currentMode = mode;

        // Remove any existing classes first
        document.body.classList.remove(
            'ypp-reduce-anim-balanced',
            'ypp-reduce-anim-minimal'
        );

        if (mode === 'off') return;

        document.body.classList.add(`ypp-reduce-anim-${mode}`);

        // 2D: Intercept JS smooth scroll and Web Animations API in Minimal mode
        if (mode === 'minimal') {
            this._patchScrollIntoView();
            this._patchWebAnimationsAPI();
        }

        // 2B: Listen for OS setting changes live
        if (!this._motionQuery) {
            this._motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this._motionHandler = () => this.onSettingsUpdate(this.settings);
            this._motionQuery.addEventListener('change', this._motionHandler);
        }

        this.utils?.log?.(`ReduceAnimations: mode = ${mode}`, 'REDUCE-ANIM');
    }

    _clearMode() {
        document.body.classList.remove(
            'ypp-reduce-anim-balanced',
            'ypp-reduce-anim-minimal'
        );
        this._restoreScrollIntoView();
        this._restoreWebAnimationsAPI();
        if (this._motionQuery && this._motionHandler) {
            this._motionQuery.removeEventListener('change', this._motionHandler);
            this._motionQuery = null;
            this._motionHandler = null;
        }
        this._currentMode = 'off';
    }

    // ─── 2D: scrollIntoView Patch ─────────────────────────────────────────────

    _patchScrollIntoView() {
        if (this._originalScrollIntoView) return; // already patched
        this._originalScrollIntoView = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = function (options) {
            if (options && typeof options === 'object') {
                options = { ...options, behavior: 'auto' };
            } else if (options === undefined) {
                options = { behavior: 'auto' };
            }
            return Element.prototype._yppOrigScrollIntoView.call(this, options);
        };
        Element.prototype._yppOrigScrollIntoView = this._originalScrollIntoView;
    }

    _restoreScrollIntoView() {
        if (!this._originalScrollIntoView) return;
        Element.prototype.scrollIntoView = this._originalScrollIntoView;
        delete Element.prototype._yppOrigScrollIntoView;
        this._originalScrollIntoView = null;
    }

    // ─── 2F: Web Animations API Patch ─────────────────────────────────────────

    _patchWebAnimationsAPI() {
        if (this._originalAnimate) return;
        this._originalAnimate = Element.prototype.animate;
        const origAnimate = this._originalAnimate;
        
        Element.prototype.animate = function(keyframes, options) {
            // Instantly finish JS animations by forcing duration to 0
            if (options) {
                if (typeof options === 'number') {
                    options = 0;
                } else {
                    options.duration = 0;
                    options.iterations = 1;
                }
            } else {
                options = 0;
            }
            return origAnimate.call(this, keyframes, options);
        };
        Element.prototype._yppOrigAnimate = origAnimate;
    }

    _restoreWebAnimationsAPI() {
        if (!this._originalAnimate) return;
        Element.prototype.animate = this._originalAnimate;
        delete Element.prototype._yppOrigAnimate;
        this._originalAnimate = null;
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.ReduceAnimations = ReduceAnimations;
