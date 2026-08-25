import '../../../../core/system/base-feature.js';
/**
 * SplitScrolling Feature
 * ─────────────────────────────────────────────────────────────────────────────
 * Makes the "Up Next" sidebar (#secondary) independently scrollable on the
 * watch page. The main column (video + description + comments) stays fixed
 * while the user scrolls through related videos in the sidebar.
 *
 * HOW IT WORKS:
 * ─────────────────────────────────────────────────────────────────────────────
 * A single <style> block is injected into <head> once and left there.
 * Activation/deactivation is handled purely by toggling the body class
 * `ypp-split-scrolling-enabled` — cheaper than DOM node insertion/removal.
 *
 * ROOT CAUSE HISTORY (why the CSS is the way it is):
 * ─────────────────────────────────────────────────────────────────────────────
 * Problem 1 — position:sticky silently failing:
 *   `position:sticky` only works when NO ancestor in the stacking context
 *   has overflow:hidden/auto/scroll. YouTube's layout applies overflow:hidden
 *   to #page-manager and ytd-watch-flexy, which broke sticky entirely.
 *   Fix: `overflow:clip`. Unlike `overflow:hidden`, clip does NOT create a
 *   scroll container (no BFC), so sticky positioning is preserved.
 *
 * Problem 2 — height context missing:
 *   `height: calc(100vh - <masthead>)` on #secondary requires the containing
 *   block to have a defined height. Without it the value resolves to `auto`.
 *   Fix: `min-height: 100vh` on ytd-watch-flexy.
 *
 * Problem 3 — lifecycle mismatch (fixed):
 *   The feature previously used run() with manual enable()/disable() calls,
 *   bypassing BaseFeature.update() lifecycle (isEnabled was never set, so
 *   onPageChange() was never dispatched to this feature). Refactored to pure
 *   enable()/disable() — FeatureManager now tracks state correctly.
 *
 * COMPATIBILITY NOTES:
 * ─────────────────────────────────────────────────────────────────────────────
 * • hide-scrollbar (ypp-hide-scrollbar): the global theme feature applies
 *   scrollbar-width:none to all elements. The CSS below re-asserts hidden
 *   scrollbar on #secondary when that class is present so the override is
 *   explicit and survives specificity changes.
 */




/** @constant {string} ID of the injected <style> element */
const _SPLIT_SCROLL_STYLE_ID = 'ypp-split-scrolling-style';

/** @constant {string} Body class that activates the split-scroll CSS */
const _SPLIT_SCROLL_ACTIVE_CLASS = 'ypp-split-scrolling-enabled';

export class SplitScrolling extends window.YPP.features.BaseFeature {
    static featureId = 'splitScrolling';
    static executionPhase = 'idle';
    static priority = 999;


    constructor() {
        super('SplitScrolling');
        this._onScroll = this._onScroll.bind(this);
        this._scrollDebounceTimer = null;
    }

    // ── BaseFeature contract ──────────────────────────────────────────────────

    /** @returns {string} The chrome.storage key that controls this feature */
    getConfigKey() { return 'splitScrolling'; }

    /**
     * Activate split scrolling.
     * Injects the shared <style> block (idempotent) then enables via body class.
     */
    enable() {
        this._injectStyles();
        document.body.classList.add(_SPLIT_SCROLL_ACTIVE_CLASS);
    }

    /**
     * Deactivate split scrolling.
     * Removes the body class; the <style> block is kept in <head> so
     * re-enabling is instant (no DOM allocation overhead).
     */
    disable() {
        document.body.classList.remove(_SPLIT_SCROLL_ACTIVE_CLASS);
        const secondary = document.getElementById('secondary');
        if (secondary) secondary.removeEventListener('scroll', this._onScroll);
        
        if (this._scrollDebounceTimer) {
            clearTimeout(this._scrollDebounceTimer);
            this._scrollDebounceTimer = null;
        }
        
        if (this._sidebarObserver) {
            this._sidebarObserver.disconnect();
            this._sidebarObserver = null;
        }
        
        this._scrollBound = false;
        super.disable(); // runs BaseFeature.cleanupEvents() — future-safe
    }

    /**
     * Called by FeatureManager on every YouTube SPA navigation.
     *
     * The body class survives SPA navigation automatically. However YouTube
     * occasionally clears injected <style> elements during hard tab-switches
     * or when the page renderer is fully destroyed and rebuilt. We defensively
     * re-inject if the style element is missing.
     *
     * @param {string} _url - Current URL (unused — we act unconditionally)
     */
    onPageChange(_url) {
        if (this.isEnabled) {
            if (!document.getElementById(_SPLIT_SCROLL_STYLE_ID)) {
                this._injectStyles();
            }
            // Defensively clear memory flag to re-bind on new page
            this._scrollBound = false;
            this._initScrollObserver();
        }
    }

// ── Private helpers ───────────────────────────────────────────────────────

/**
 * Initialize scroll observer for shadow and scroll-to-top button
 * @private
 */
_initScrollObserver() {
    if (this._scrollBound) return;
    this._scrollBound = true;

    // We can't rely just on onPageChange because the sidebar might be rebuilt
    // So we use a MutationObserver or just set up the event when the element exists
    const setup = () => {
        const secondary = document.getElementById('secondary');
        if (!secondary) {
            setTimeout(setup, 1000);
            return;
        }

        // V2: Add scroll-to-top button
        let topBtn = document.getElementById('ypp-scroll-top-btn');
        if (!topBtn) {
            topBtn = document.createElement('button');
            topBtn.id = 'ypp-scroll-top-btn';
            topBtn.className = 'ypp-scroll-top-btn';
            topBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 4l-8 8h6v8h4v-8h6z"/></svg>';
            topBtn.title = 'Scroll to top';
            topBtn.addEventListener('click', () => {
                secondary.scrollTo({ top: 0, behavior: 'smooth' });
                // Clear saved position when returning to top
                try {
                    const videoId = new URLSearchParams(window.location.search).get('v');
                    if (videoId) sessionStorage.removeItem(`ypp-scroll-${videoId}`);
                } catch(e) {}
            });
            secondary.appendChild(topBtn);
        }

        // Use a MutationObserver to wait for YouTube to populate the sidebar before restoring scroll
        // V4: Prevent leak by tracking the observer
        if (this._sidebarObserver) {
            this._sidebarObserver.disconnect();
        }
        
        this._sidebarObserver = new MutationObserver((mutations, obs) => {
            if (secondary.scrollHeight > window.innerHeight) {
                obs.disconnect();
                this._sidebarObserver = null;
                
                // Restore scroll position or set to 0
                try {
                    const videoId = new URLSearchParams(window.location.search).get('v');
                    if (videoId) {
                        const savedScroll = sessionStorage.getItem(`ypp-scroll-${videoId}`);
                        if (savedScroll) {
                            secondary.scrollTop = parseInt(savedScroll, 10);
                        } else {
                            secondary.scrollTop = 0;
                        }
                    }
                } catch (e) {}
            }
        });
        this._sidebarObserver.observe(secondary, { childList: true, subtree: true });

        secondary.removeEventListener('scroll', this._onScroll);
        secondary.addEventListener('scroll', this._onScroll, { passive: true });
    };

    setup();
}

/**
 * Scroll event handler, debounced for performance
 * @private
 */
_onScroll(e) {
    if (!this.isEnabled) return;
    const secondary = e.target;
    if (!secondary) return;
    
    const scrollPos = secondary.scrollTop;
    const isScrolled = scrollPos > 50;
    secondary.classList.toggle('ypp-is-scrolling', isScrolled);
    
    const topBtn = document.getElementById('ypp-scroll-top-btn');
    if (topBtn) {
        if (scrollPos > 2000) {
            topBtn.classList.add('pulse-anim');
        } else {
            topBtn.classList.remove('pulse-anim');
        }
    }
    
    // V3: Debounce sessionStorage for high performance
    if (this._scrollDebounceTimer) {
        clearTimeout(this._scrollDebounceTimer);
        this._scrollDebounceTimer = null;
    }
    this._scrollDebounceTimer = setTimeout(() => {
        try {
            const videoId = new URLSearchParams(window.location.search).get('v');
            if (videoId) {
                sessionStorage.setItem(`ypp-scroll-${videoId}`, scrollPos);
            }
        } catch(err) {}
    }, 300);
}

    /**
     * Inject the split-scrolling <style> block into <head>.
     * Guarded by an ID check — safe to call multiple times.
     * @private
     */
    _injectStyles() {
        if (document.getElementById(_SPLIT_SCROLL_STYLE_ID)) return;

        const style = document.createElement('style');
        style.id    = _SPLIT_SCROLL_STYLE_ID;
        style.setAttribute('data-ypp-feature', 'splitScrolling');

        // Build selector prefix used throughout to keep rules scoped.
        // `ytd-watch-flexy:not([hidden])` targets only the active watch page —
        // the element persists in the DOM between navigations but gets [hidden]
        // while on non-watch pages, preventing unwanted style application.
        const watchCtx = 'html:not(.ypp-sidebar-comments-active) body.ypp-split-scrolling-enabled ytd-watch-flexy:not([hidden])';

        style.textContent = `
            /* ══ YPP: Independent Sidebar Scroll ══════════════════════════════ */

            /*
             * overflow:clip on ancestors — the critical fix.
             *
             * overflow:clip visually clips overflowing content, just like
             * overflow:hidden, but does NOT create a block formatting context
             * (BFC). A BFC is what causes position:sticky to silently stop
             * working. Using clip instead of hidden preserves sticky while
             * still preventing scroll-bar emergence on these containers.
             */
            body.ypp-split-scrolling-enabled #page-manager {
                overflow: clip !important;
            }

            ${watchCtx} {
                overflow: clip !important;
                /* Establish a height context so the child height:calc() resolves */
                min-height: 100vh !important;
            }

            /*
             * #columns is a flex container. overflow:visible lets the sticky
             * child escape, and align-items:flex-start stops it from
             * stretching to the container height (which would prevent scrolling).
             */
            ${watchCtx} #columns {
                overflow: visible !important;
                align-items: flex-start !important;
            }

            /* ── The sticky, independently-scrollable sidebar ─────────────── */

            ${watchCtx} #secondary {
                position: sticky !important;
                top: var(--ytd-masthead-height, 56px) !important;
                height: calc(100vh - var(--ytd-masthead-height, 56px)) !important;
                box-sizing: border-box !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                margin-top: 0 !important;
                padding-top: var(--ytd-margin-6x, 24px) !important;
                scrollbar-width: none !important; /* User requested NO scrollbar */
                -ms-overflow-style: none !important;
                transition: box-shadow 0.3s ease !important;
            }
            
            ${watchCtx} #secondary::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
            }

            /* Scroll Shadow */
            ${watchCtx} #secondary.ypp-is-scrolling {
                box-shadow: inset 0 10px 15px -10px rgba(0,0,0,0.3) !important;
            }

            /* ── Scroll to Top Button ─────────────── */
            .ypp-scroll-top-btn {
                position: fixed !important;
                bottom: 30px !important;
                right: 30px !important;
                width: 44px !important;
                height: 44px !important;
                border-radius: 50% !important;
                background: rgba(255, 255, 255, 0.1) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                color: #fff !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                backdrop-filter: blur(8px) !important;
                -webkit-backdrop-filter: blur(8px) !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transform: translateY(10px) !important;
                transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1) !important;
                z-index: 9999 !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
            }
            
            #secondary.ypp-is-scrolling .ypp-scroll-top-btn {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) !important;
            }

            .ypp-scroll-top-btn:hover {
                background: rgba(255, 255, 255, 0.2) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important;
            }
            
            /* V2: Pulse Animation */
            @keyframes ypp-pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
            }
            .ypp-scroll-top-btn.pulse-anim {
                animation: ypp-pulse 2s infinite;
            }
            
            .ypp-scroll-top-btn svg {
                width: 24px !important;
                height: 24px !important;
                fill: currentColor !important;
            }

            /* ── Breathing room at the bottom of the sidebar list ─────────── */

            ${watchCtx} #secondary-inner {
                padding-bottom: 40px !important;
            }
        `;

        document.head.appendChild(style);
    }
};

window.YPP.features.SplitScrolling = SplitScrolling;
