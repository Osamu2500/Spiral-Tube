import '../../../core/system/base-feature.js';

/**
 * @fileoverview
 * AutoHideTopbar
 * 
 * Target: /watch route.
 * Purpose: Dynamically adds or removes the auto-hide top bar class based on user settings.
 */
export class AutoHideTopbar extends window.YPP.features.BaseFeature {
    static featureId = 'autoHideTopbar';
    static executionPhase = 'idle';
    static priority = 50;

    constructor() {
        super('AutoHideTopbar');
        this.hoverArea = 60; // top 60px triggers the topbar
        this._boundMouseMove = this._handleMouseMove.bind(this);
        this.isHoveringTop = false;
        this.resizeDebounce = null;
    }

    getConfigKey() { return 'hideTopBarOnPlayer'; }

    async enable() {
        await super.enable();
        if (this._shouldRunOnCurrentPage()) {
            this._activate();
        }

        this.onBusEvent('app:pageChange', () => {
            if (this._shouldRunOnCurrentPage()) {
                this._activate();
            } else {
                this._deactivate();
            }
        });
    }

    async disable() {
        await super.disable();
        this._deactivate();
    }

    _activate() {
        if (!document.body.classList.contains('ypp-hide-top-bar')) {
            document.body.classList.add('ypp-hide-top-bar');
            this._triggerResize();
        }
        document.addEventListener('mousemove', this._boundMouseMove);
    }

    _deactivate() {
        if (document.body.classList.contains('ypp-hide-top-bar')) {
            document.body.classList.remove('ypp-hide-top-bar');
            document.body.classList.remove('ypp-show-top-bar');
            this._triggerResize();
        }
        document.removeEventListener('mousemove', this._boundMouseMove);
    }

    _handleMouseMove(e) {
        if (e.clientY <= this.hoverArea) {
            if (!this.isHoveringTop) {
                this.isHoveringTop = true;
                document.body.classList.add('ypp-show-top-bar');
            }
        } else {
            // Check if cursor is over the masthead itself before hiding
            const masthead = document.querySelector('#masthead-container');
            if (masthead && masthead.contains(e.target)) return;

            if (this.isHoveringTop) {
                this.isHoveringTop = false;
                document.body.classList.remove('ypp-show-top-bar');
            }
        }
    }

    _triggerResize() {
        clearTimeout(this.resizeDebounce);
        this.resizeDebounce = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }

    _shouldRunOnCurrentPage() {
        return window.location.pathname === '/watch';
    }
}
