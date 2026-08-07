/**
 * Mini Player Scroll — Spiral Tube
 * Auto-activates YouTube's native miniplayer when the video scrolls out of view,
 * and restores the full player when the user scrolls back up.
 *
 * V2 Fixes:
 * - MINI-BUG-1: Verify actual player state before clicking toggle button
 * - MINI-BUG-2: Added yt-navigate-finish listener to reset state across SPA navs
 * - MINI-BUG-3: Replaced unreliable body attribute check with proper player element check
 * - MINI-BUG-4: Throttled scroll handler with requestAnimationFrame
 */

export class MiniPlayerScroll extends window.YPP.features.BaseFeature {
    static featureId = 'miniPlayerScroll';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('MiniPlayerScroll');
        this.isMini = false;
        this._scrollPending = false;  // MINI-BUG-4: rAF throttle flag

        this._boundHandleScroll = this._onScroll.bind(this);
        this._boundHandleNavigation = this._handleNavigation.bind(this);
    }

    getConfigKey() {
        return 'enableMiniPlayer';
    }

    async enable() {
        await super.enable();
        // MINI-BUG-2: Reset state in case isMini was left dirty
        this.isMini = this._isNativelyMini();
        this.addListener(window, 'scroll', this._boundHandleScroll, { passive: true });
        // MINI-BUG-2: Handle SPA navigation to reset isMini state
        this.addListener(window, 'yt-navigate-finish', this._boundHandleNavigation);
        this._handleScroll(); // Check initial state
    }

    async disable() {
        await super.disable();

        // MINI-BUG-1: Only click to close miniplayer if it's ACTUALLY open
        if (this.isMini && this._isNativelyMini()) {
            const miniBtn = document.querySelector('.ytp-miniplayer-button');
            if (miniBtn) miniBtn.click();
        }
        this.isMini = false;
    }

    // MINI-BUG-2: Reset state on SPA video navigation
    _handleNavigation() {
        if (!this.isEnabled) return;
        // After navigation, miniplayer is always closed — reset our tracking state
        this.isMini = false;
        this._handleScroll();
    }

    // MINI-BUG-3: Reliable native miniplayer state detection
    _isNativelyMini() {
        // YouTube adds class 'miniplayer-active' to #ytd-player or uses the attribute on ytd-miniplayer
        return !!(
            document.querySelector('ytd-miniplayer[active]') ||
            document.querySelector('#player-container-outer[miniplayer]') ||
            document.querySelector('.ytp-miniplayer-ui')
        );
    }

    // MINI-BUG-4: rAF-throttled scroll entry point
    _onScroll() {
        if (!this._scrollPending) {
            this._scrollPending = true;
            requestAnimationFrame(() => {
                this._handleScroll();
                this._scrollPending = false;
            });
        }
    }

    _handleScroll() {
        if (!this.isEnabled) return;

        const playerContainer = document.querySelector('#player-container-outer') || document.querySelector('#player');
        if (!playerContainer) return;

        const rect = playerContainer.getBoundingClientRect();
        const isPastVideo = rect.bottom < 0;

        const miniBtn = document.querySelector('.ytp-miniplayer-button');
        if (!miniBtn) return;

        // MINI-BUG-3: Use reliable state check instead of unreliable body attribute
        const isNativeMini = this._isNativelyMini();

        if (isPastVideo && !this.isMini && !isNativeMini) {
            miniBtn.click();
            this.isMini = true;
            this.utils?.log?.('Auto-enabled miniplayer on scroll', 'MINIPLAYER', 'debug');
        } else if (!isPastVideo && this.isMini && isNativeMini) {
            // MINI-BUG-1: Only close if it's actually open
            miniBtn.click();
            this.isMini = false;
            this.utils?.log?.('Restored player from miniplayer on scroll', 'MINIPLAYER', 'debug');
        } else if (!isPastVideo && this.isMini && !isNativeMini) {
            // State desync — user manually closed miniplayer
            this.isMini = false;
        }
    }
};

window.YPP.features.MiniPlayerScroll = MiniPlayerScroll;
