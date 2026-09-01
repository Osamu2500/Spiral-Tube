import '../../../core/system/base-feature.js';
/**
 * Base Class for filter features that hide elements on specific pages.
 * Handles page scoping, unified hiding mechanics via CSS classes, and cleanup.
 */
export class BaseFilterFeature extends window.YPP.features.BaseFeature {
    static featureId = 'baseFilterFeature';
    static executionPhase = 'idle';
    static priority = 999;

    constructor(name) {
        super(name);
        this._hiddenElements = new WeakSet();
        this._allowedPages = ['/', '/index'];
    }

    get allowedPages() {
        return this._allowedPages;
    }

    /**
     * Checks if the feature should run on the current page to avoid unintended filtering.
     * @returns {boolean}
     */
    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        return this.allowedPages.some(p => path === p);
    }

    /**
     * Hides an element using standard CSS classes and records its state.
     * @param {Element} el 
     * @param {string} reason 
     */
    _hideElement(el, reason = '') {
        if (!el || this._hiddenElements.has(el)) return;
        if (el.classList.contains('ypp-whitelisted')) return;
        
        const parsers = window.YPP.Utils?.youtubeParsers;
        const channelPath = parsers ? parsers.extractChannelFromContainer(el) : null;
        
        let useDimMode = this._settings?.filterMode === 'dim';
        if (this.constructor.name === 'HideWatched' && this._settings?.hideWatchedMode) {
            useDimMode = this._settings.hideWatchedMode === 'dim';
        }
        
        if (useDimMode) {
            if (window.YPP.utils?.filterUI?.applyDimMode) {
                window.YPP.utils.filterUI.applyDimMode(el, reason, channelPath);
            }
            this._hiddenElements.add(el);
            this._emitHiddenEvent(el, reason);
            // Report to FilterWarning system
            try { window.YPP.events?.emit('filter:warning:record', { hidden: 1, total: this._lastTotalCount || 1 }); } catch (_) {}
            return;
        }

        el.classList.add('ypp-hidden', `ypp-hidden-by-${this.constructor.name.toLowerCase()}`);
        if (reason) {
            el.dataset.yppHiddenReason = reason;
        }
        el.dataset.yppHiddenBy = this.constructor.name;
        this._hiddenElements.add(el);
        
        this._emitHiddenEvent(el, reason);
        // Report to FilterWarning system
        try { window.YPP.events?.emit('filter:warning:record', { hidden: 1, total: this._lastTotalCount || 1 }); } catch (_) {}
    }

    /**
     * Unhides an element that was hidden by this feature.
     * @param {Element} el 
     */
    _unhideElement(el) {
        if (!el || !this._hiddenElements.has(el)) return;
        
        el.classList.remove('ypp-hidden', `ypp-hidden-by-${this.constructor.name.toLowerCase()}`);
        delete el.dataset.yppHiddenReason;
        delete el.dataset.yppHiddenBy;
        
        if (el.dataset.yppDimmed) {
            BaseFilterFeature.clearDimmedElement(el);
        }
        
        this._hiddenElements.delete(el);
    }

    /**
     * Helper to clear dim styling and badges.
     */
    static clearDimmedElement(element) {
        if (!element || !element.dataset.yppDimmed) return;
        delete element.dataset.yppDimmed;
        
        if (window.YPP.utils?.filterUI?.removeBadgeAnimated) {
            element.querySelectorAll('.ypp-dim-badge').forEach(window.YPP.utils.filterUI.removeBadgeAnimated);
        } else {
            element.querySelectorAll('.ypp-dim-badge').forEach(b => b.remove());
        }
        element.querySelectorAll('[data-ypp-badge-target]').forEach(t => delete t.dataset.yppBadgeTarget);
    }

    /**
     * Unhides all elements currently tracked as hidden by this feature.
     */
    _unhideAll() {
        document.querySelectorAll(`[data-ypp-hidden-by="${this.constructor.name}"]`).forEach(el => {
            this._unhideElement(el);
        });
        document.querySelectorAll(`[data-ypp-dimmed]`).forEach(el => {
            BaseFilterFeature.clearDimmedElement(el);
        });
    }

    /**
     * Emits an event for analytics or global counting of hidden elements.
     * @param {Element} el 
     * @param {string} reason 
     */
    _emitHiddenEvent(el, reason) {
        window.YPP.events?.emit('filter:hidden', {
            feature: this.constructor.name,
            element: el,
            reason,
            url: el.querySelector('a')?.href
        });
    }

    async disable() {
        await super.disable();
        this._unhideAll();
    }
};

window.YPP.features.BaseFilterFeature = BaseFilterFeature;
