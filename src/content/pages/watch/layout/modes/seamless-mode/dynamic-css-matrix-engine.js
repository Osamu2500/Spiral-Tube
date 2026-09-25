/**
 * @fileoverview
 * Dynamic CSS Matrix Engine
 * Generates an indestructible wall of CSS rules that Polymer cannot wipe out.
 */
export class DynamicCSSMatrixEngine {
    constructor(utils) {
        this.utils = utils;
        this.styleElement = null;
        this.targets = [
            'ytd-compact-video-renderer',
            'ytd-rich-item-renderer',
            'ytd-compact-playlist-renderer',
            'ytd-compact-radio-renderer',
            'ytd-compact-movie-renderer',
            'yt-lockup-view-model',
            'ytd-lockup-view-model'
        ];
    }
    
    inject(cols) {
        // Validation: Ensure cols is a safe integer to prevent invalid CSS or injection
        const safeCols = Math.max(1, Math.min(12, parseInt(cols, 10) || 4));

        if (!this.styleElement) {
            this.styleElement = document.createElement('style');
            this.styleElement.id = 'seamless-massive-grid-enforcer';
            document.head.appendChild(this.styleElement);
        }
        
        // We define the structural CSS Grid architecture for watch page cards
        const css = `
            /* ── 1. Grid Container Override ── */
            /* Enforce responsive column count from settings (auto-fits based on width) */
            body.ypp-seamless-mode ytd-watch-flexy ytd-watch-next-secondary-results-renderer #items,
            body.ypp-seamless-mode ytd-watch-flexy #secondary #related #items,
            body.ypp-seamless-mode ytd-watch-flexy #related #items,
            body.ypp-seamless-mode ytd-watch-flexy #related #contents,
            body.ypp-seamless-mode ytd-watch-flexy ytd-watch-next-secondary-results-renderer #contents,
            body.ypp-seamless-mode ytd-watch-flexy #related ytd-item-section-renderer #contents {
                display: grid !important;
                grid-template-columns: repeat(
                  auto-fit,
                  minmax(
                    max(
                      var(--ypp-seamless-column-min, 220px),
                      calc((100% - ((${safeCols} - 1) * 24px)) / ${safeCols})
                    ),
                    1fr
                  )
                ) !important;
                gap: 24px !important;
                align-items: start !important;
            }
        `;
        
        this.styleElement.textContent = css;
        this.utils.log(`Injected elegant CSS Grid rule blocks for ${safeCols} columns.`, 'seamlessMode', 'info');
    }
    
    remove() {
        if (this.styleElement) {
            this.styleElement.remove();
            this.styleElement = null;
        }
    }
}
