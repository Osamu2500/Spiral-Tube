/**
 * Auto Cinema — Spiral Tube
 * Automatically clicks the theater button whenever a watch page loads
 * to ensure the video expands.
 */



export class AutoCinema extends window.YPP.features.BaseFeature {
    static featureId = 'autoCinema';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'autoCinema'; }

    constructor() {
        super('AutoCinema');
        this._navHandler = this._onNavigation.bind(this);
        this._resizeHandler = this._onResize.bind(this);
        this._resizeTimeout = null;
    }

    async enable() {
        await super.enable();
        this._userOverridden = false;
        
        // Listen to manual button clicks to respect user override
        // Use raw addEventListener (not this.addListener) because capture-phase listeners
        // on document need special handling and this is cleaned up explicitly in disable().
        this._buttonClickListener = (e) => {
            const btn = e.target.closest('.ytp-size-button');
            if (btn && e.isTrusted) {
                this._userOverridden = true;
            }
        };
        document.addEventListener('click', this._buttonClickListener, true);

        // Run immediately if we're on a watch page
        if (location.pathname === '/watch') {
            this._clickTheaterButton();
        }
        // And on every subsequent navigation
        this.addListener(window, 'yt-navigate-finish', this._navHandler);
        // And window resizes (YouTube sometimes breaks theater on resize)
        this.addListener(window, 'resize', this._resizeHandler);
        
        this.utils?.log?.('Auto Cinema enabled', 'AUTO_CINEMA');
    }

    async disable() {
        // Clean up the capture-phase listener explicitly (not tracked by addListener)
        if (this._buttonClickListener) {
            document.removeEventListener('click', this._buttonClickListener, true);
            this._buttonClickListener = null;
        }
        if (this._resizeTimeout) { clearTimeout(this._resizeTimeout); this._resizeTimeout = null; }
        if (this._clickTimeout) { clearTimeout(this._clickTimeout); this._clickTimeout = null; }
        // super.disable() calls cleanupEvents() which removes all this.addListener() registrations
        await super.disable();
        this.utils?.log?.('Auto Cinema disabled', 'AUTO_CINEMA');
    }

    _onNavigation() {
        this._userOverridden = false; // Reset override on new video loads
        if (location.pathname === '/watch') {
            this._clickTheaterButton();
        }
    }

    _onResize() {
        if (location.pathname !== '/watch') return;
        
        // Debounce resize
        if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(() => {
            this._clickTheaterButton();
        }, 500);
    }

    async _clickTheaterButton() {
        if (this._userOverridden) return;
        if (this.settings?.zenMode) return; // Prevent conflict with Zen Mode
        
        try {
            const btn = await this.utils?.pollFor?.(
                () => document.querySelector('.ytp-size-button'),
                6000, 400
            );
            if (!btn) return;
            
            // Debounce the click to prevent UI flickering
            if (this._clickTimeout) clearTimeout(this._clickTimeout);
            this._clickTimeout = setTimeout(() => {
                const flexy = document.querySelector('ytd-watch-flexy');
                // Check if theater mode is already active
                const isTheater = flexy && flexy.hasAttribute('theater');
                if (!isTheater && !this._userOverridden) {
                    btn.click();
                }
            }, 300); // Wait 300ms for YouTube's own layout calculation to settle
        } catch (_) { /* silent fail */ }
    }
};

window.YPP.features.AutoCinema = AutoCinema;
