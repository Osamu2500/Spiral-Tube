/**
 * Compact Player UI Feature (Style 24682)
 * Dynamically calculates dimensions, button spacing, icon scale, and chapter title boundaries
 * for YouTube's player control bar so controls cover minimal video area while remaining ergonomic.
 */

export class CompactPlayerUI extends window.YPP.features.BaseFeature {
    static featureId = 'compactPlayerUI';
    static executionPhase = 'idle';
    static priority = 18;

    constructor() {
        super('CompactPlayerUI');
        this.name = 'CompactPlayerUI';
        this.resizeObserver = null;
        this.mutationObserver = null;
        this.onResizeBound = this.handleResize.bind(this);
        this.onFullscreenBound = this.handleFullscreenChange.bind(this);
        this.onNavigateBound = this.handleNavigate.bind(this);
        this.recalculateDebounce = null;
        this.styleElement = null;
    }

    getConfigKey() {
        return 'compactPlayerUI';
    }

    async enable() {
        await super.enable();
        this.injectStyles();
        this.applyCompactUI(true);
        this.setupObservers();
        this.attachEventListeners();
        this.recalculateLayout();
        this.utils?.log?.('Compact Player UI enabled (Style 24682)', 'COMPACT-PLAYER-UI');
    }

    async disable() {
        await super.disable();
        this.applyCompactUI(false);
        this.cleanupObservers();
        this.detachEventListeners();
        this.removeStyles();
        this.resetPlayerCustomProperties();
        this.utils?.log?.('Compact Player UI disabled', 'COMPACT-PLAYER-UI');
    }

    async onUpdate() {
        if (this.isEnabled) {
            this.injectStyles();
            this.applyCompactUI(true);
            this.recalculateLayout();
        } else {
            this.applyCompactUI(false);
            this.removeStyles();
            this.resetPlayerCustomProperties();
        }
    }

    applyCompactUI(active) {
        const body = document.body;
        if (active) {
            if (body) body.classList.add('ypp-compact-player-ui');
        } else {
            if (body) body.classList.remove('ypp-compact-player-ui');
        }
    }

    injectStyles() {
        if (document.getElementById('ypp-compact-player-ui-style')) return;
        const style = document.createElement('style');
        style.id = 'ypp-compact-player-ui-style';
        style.textContent = `
            /* Compact Player Controls (Style 24682) */
            body.ypp-compact-player-ui #movie_player,
            body.ypp-compact-player-ui .html5-video-player {
                --ypp-compact-bar-height: 36px;
                --ypp-compact-btn-width: 34px;
                --ypp-compact-icon-scale: 0.85;
                --ypp-compact-progress-bottom: 34px;
                --ypp-compact-time-font: 12px;
                --ypp-compact-chapter-max-width: 240px;
            }

            /* Never show hidden elements or empty containers! */
            body.ypp-compact-player-ui [hidden],
            body.ypp-compact-player-ui [style*="display: none"],
            body.ypp-compact-player-ui [style*="display:none"],
            body.ypp-compact-player-ui [style*="display : none"],
            body.ypp-compact-player-ui .ytp-button[hidden],
            body.ypp-compact-player-ui .ytp-button[style*="display: none"],
            body.ypp-compact-player-ui .ytp-button[style*="display:none"],
            body.ypp-compact-player-ui .ytp-button[style*="display : none"],
            body.ypp-compact-player-ui .ytp-button[class*="-hidden"],
            body.ypp-compact-player-ui .ytp-button[class*="hidden"],
            body.ypp-compact-player-ui .ytp-button[aria-hidden="true"],
            body.ypp-compact-player-ui .ytp-button[aria-disabled="true"],
            body.ypp-compact-player-ui .ytp-autonav-toggle-button-container[hidden],
            body.ypp-compact-player-ui .ytp-autonav-toggle-button-container[style*="none"],
            body.ypp-compact-player-ui .ytp-remote-button-container[hidden],
            body.ypp-compact-player-ui .ytp-remote-button-container[style*="none"],
            body.ypp-compact-player-ui .ypp-action-btn[hidden],
            body.ypp-compact-player-ui .ypp-action-btn[style*="display: none"],
            body.ypp-compact-player-ui .ypp-action-btn[style*="display:none"],
            body.ypp-compact-player-ui .ypp-action-btn[style*="display : none"],
            body.ypp-compact-player-ui .ypp-action-btn[aria-hidden="true"],
            body.ypp-compact-player-ui .ypp-player-controls [hidden],
            body.ypp-compact-player-ui .ypp-player-controls [style*="display: none"],
            body.ypp-compact-player-ui .ypp-player-controls [style*="display:none"],
            body.ypp-compact-player-ui .ypp-player-controls:empty {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                overflow: hidden !important;
            }

            /* 1. Control Bar Height & Smooth Hover Transition */
            body.ypp-compact-player-ui .ytp-chrome-bottom {
                height: var(--ypp-compact-bar-height, 36px) !important;
                padding-bottom: 2px !important;
                opacity: 0.88;
                transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s ease !important;
            }
            body.ypp-compact-player-ui .ytp-chrome-bottom:hover {
                opacity: 1;
            }

            /* 2. Controls Flex Layout */
            body.ypp-compact-player-ui .ytp-chrome-controls {
                height: var(--ypp-compact-bar-height, 36px) !important;
                line-height: var(--ypp-compact-bar-height, 36px) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
            }
            body.ypp-compact-player-ui .ytp-left-controls,
            body.ypp-compact-player-ui .ytp-right-controls {
                display: flex !important;
                align-items: center !important;
                height: 100% !important;
            }

            /* 3. Ergonomic Button Dimensions & Icon Scale (Only for visible buttons without overriding display!) */
            body.ypp-compact-player-ui .ytp-chrome-controls .ytp-button:not([hidden]):not([style*="none"]):not([class*="hidden"]):not([aria-hidden="true"]):not([aria-disabled="true"]),
            body.ypp-compact-player-ui .ytp-left-controls .ytp-button:not([hidden]):not([style*="none"]):not([class*="hidden"]):not([aria-hidden="true"]):not([aria-disabled="true"]),
            body.ypp-compact-player-ui .ytp-right-controls .ytp-button:not([hidden]):not([style*="none"]):not([class*="hidden"]):not([aria-hidden="true"]):not([aria-disabled="true"]),
            body.ypp-compact-player-ui .ypp-action-btn:not([hidden]):not([style*="none"]):not([class*="hidden"]):not([aria-hidden="true"]) {
                width: var(--ypp-compact-btn-width, 34px) !important;
                height: var(--ypp-compact-bar-height, 36px) !important;
                line-height: var(--ypp-compact-bar-height, 36px) !important;
                padding: 0 2px !important;
                margin: 0 !important;
                vertical-align: middle !important;
                box-sizing: border-box !important;
            }
            body.ypp-compact-player-ui .ytp-chrome-controls .ytp-button svg,
            body.ypp-compact-player-ui .ypp-action-btn svg,
            body.ypp-compact-player-ui .ypp-gpb-btn svg {
                width: 20px !important;
                height: 20px !important;
                max-width: 20px !important;
                max-height: 20px !important;
                margin: auto !important;
                display: block !important;
                transform: scale(var(--ypp-compact-icon-scale, 1)) !important;
                transform-origin: center center !important;
                transition: transform 0.15s ease !important;
                pointer-events: none !important;
            }
            body.ypp-compact-player-ui .ytp-chrome-controls .ytp-button:hover svg,
            body.ypp-compact-player-ui .ypp-action-btn:hover svg,
            body.ypp-compact-player-ui .ypp-gpb-btn:hover svg {
                transform: scale(calc(var(--ypp-compact-icon-scale, 1) * 1.1)) !important;
            }

            /* 4. Custom Player Bar & Buttons Compact Adaptation */
            body.ypp-compact-player-ui .ypp-player-controls:not(.ypp-floating-action-bar) {
                height: var(--ypp-compact-bar-height, 36px) !important;
                padding: 0 2px !important;
                gap: 2px !important;
                margin: 0 4px 0 0 !important;
                display: inline-flex !important;
                align-items: center !important;
                vertical-align: middle !important;
            }
            body.ypp-compact-player-ui .ypp-action-btn:not([hidden]):not([style*="none"]) {
                border-radius: 6px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            body.ypp-compact-player-ui .ypp-speed-controls {
                height: var(--ypp-compact-bar-height, 36px) !important;
                padding: 0 2px !important;
                gap: 2px !important;
                margin: 0 !important;
                display: inline-flex !important;
                align-items: center !important;
                vertical-align: middle !important;
            }
            body.ypp-compact-player-ui .ypp-speed-btn {
                height: calc(var(--ypp-compact-bar-height, 36px) - 10px) !important;
                line-height: 1 !important;
                padding: 0 4px !important;
                margin: 0 !important;
                font-size: 11px !important;
                font-weight: 500 !important;
                border-radius: 4px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            body.ypp-compact-player-ui .ypp-floating-action-bar {
                gap: 6px !important;
                padding: 8px 6px !important;
                border-radius: 20px !important;
            }
            body.ypp-compact-player-ui .ypp-floating-action-bar .ypp-action-btn:not([hidden]):not([style*="none"]) {
                width: var(--ypp-compact-btn-width, 34px) !important;
                height: var(--ypp-compact-btn-width, 34px) !important;
            }

            /* 5. Progress Bar Alignment */
            body.ypp-compact-player-ui .ytp-progress-bar-container {
                bottom: var(--ypp-compact-progress-bottom, 34px) !important;
                height: 5px !important;
                transition: bottom 0.2s ease, height 0.15s ease !important;
            }
            body.ypp-compact-player-ui .ytp-progress-bar-container:hover {
                height: 7px !important;
            }
            body.ypp-compact-player-ui .ytp-scrubber-button {
                transform: scale(0.8) !important;
            }

            /* 6. Time Display & Dynamic Chapter Truncation */
            body.ypp-compact-player-ui .ytp-time-display {
                font-size: var(--ypp-compact-time-font, 12px) !important;
                line-height: var(--ypp-compact-bar-height, 36px) !important;
                padding: 0 8px !important;
                display: inline-flex !important;
                align-items: center !important;
            }
            body.ypp-compact-player-ui .ytp-chapter-container {
                max-width: var(--ypp-compact-chapter-max-width, 240px) !important;
                overflow: hidden !important;
                white-space: nowrap !important;
                text-overflow: ellipsis !important;
            }
            body.ypp-compact-player-ui .ytp-chapter-title-content {
                font-size: var(--ypp-compact-time-font, 12px) !important;
                line-height: var(--ypp-compact-bar-height, 36px) !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }

            /* 7. Volume Slider Spacing */
            body.ypp-compact-player-ui .ytp-volume-panel {
                margin-right: 4px !important;
            }

            /* 8. Shorter Gradient Footprint */
            body.ypp-compact-player-ui .ytp-gradient-bottom {
                height: 52px !important;
                opacity: 0.6 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
        this.styleElement = style;
    }

    removeStyles() {
        const style = document.getElementById('ypp-compact-player-ui-style');
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
        this.styleElement = null;
    }

    setupObservers() {
        this.cleanupObservers();

        const getPlayer = () => document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        const player = getPlayer();
        if (player && window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                this.requestRecalculate();
            });
            this.resizeObserver.observe(player);
            
            const leftControls = player.querySelector('.ytp-left-controls');
            const rightControls = player.querySelector('.ytp-right-controls');
            if (leftControls) this.resizeObserver.observe(leftControls);
            if (rightControls) this.resizeObserver.observe(rightControls);
        }
    }

    cleanupObservers() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
    }

    attachEventListeners() {
        window.addEventListener('resize', this.onResizeBound, { passive: true });
        document.addEventListener('fullscreenchange', this.onFullscreenBound, { passive: true });
        window.addEventListener('yt-navigate-finish', this.onNavigateBound, { passive: true });
        window.addEventListener('yt-player-updated', this.onNavigateBound, { passive: true });
        window.addEventListener('yt-page-data-updated', this.onNavigateBound, { passive: true });
    }

    detachEventListeners() {
        window.removeEventListener('resize', this.onResizeBound);
        document.removeEventListener('fullscreenchange', this.onFullscreenBound);
        window.removeEventListener('yt-navigate-finish', this.onNavigateBound);
        window.removeEventListener('yt-player-updated', this.onNavigateBound);
        window.removeEventListener('yt-page-data-updated', this.onNavigateBound);
    }

    handleResize() {
        this.requestRecalculate();
    }

    handleFullscreenChange() {
        this.requestRecalculate();
    }

    handleNavigate() {
        this.setupObservers();
        this.requestRecalculate();
    }

    requestRecalculate() {
        if (this.recalculateDebounce) {
            clearTimeout(this.recalculateDebounce);
        }
        this.recalculateDebounce = setTimeout(() => {
            this.recalculateDebounce = null;
            requestAnimationFrame(() => this.recalculateLayout());
        }, 150);
    }

    recalculateLayout() {
        if (!this.isEnabled) return;
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        if (!player) return;

        const width = player.clientWidth || window.innerWidth;
        const isFullscreen = player.classList.contains('ytp-fullscreen') || Boolean(document.fullscreenElement);
        const isTheater = player.classList.contains('ytp-big-mode');
        const isSmall = width < 640;

        let barHeight = 36;
        let btnWidth = 34;
        let iconScale = 0.85;
        let progressBottom = 34;
        let timeFont = 12;

        if (isFullscreen) {
            barHeight = 40;
            btnWidth = 38;
            iconScale = 0.92;
            progressBottom = 38;
            timeFont = 13;
        } else if (isSmall) {
            barHeight = 32;
            btnWidth = 30;
            iconScale = 0.78;
            progressBottom = 30;
            timeFont = 11;
        } else if (isTheater) {
            barHeight = 36;
            btnWidth = 34;
            iconScale = 0.85;
            progressBottom = 34;
            timeFont = 12;
        }

        const leftControls = player.querySelector('.ytp-left-controls');
        const rightControls = player.querySelector('.ytp-right-controls');

        const leftWidth = leftControls ? leftControls.offsetWidth : 200;
        const rightWidth = rightControls ? rightControls.offsetWidth : 250;
        const availableGap = Math.max(80, width - leftWidth - rightWidth - 32);
        const chapterMaxWidth = Math.max(120, Math.min(360, availableGap));

        player.style.setProperty('--ypp-compact-bar-height', `${barHeight}px`);
        player.style.setProperty('--ypp-compact-btn-width', `${btnWidth}px`);
        player.style.setProperty('--ypp-compact-icon-scale', iconScale.toString());
        player.style.setProperty('--ypp-compact-progress-bottom', `${progressBottom}px`);
        player.style.setProperty('--ypp-compact-time-font', `${timeFont}px`);
        player.style.setProperty('--ypp-compact-chapter-max-width', `${chapterMaxWidth}px`);
    }

    resetPlayerCustomProperties() {
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        if (!player) return;
        player.style.removeProperty('--ypp-compact-bar-height');
        player.style.removeProperty('--ypp-compact-btn-width');
        player.style.removeProperty('--ypp-compact-icon-scale');
        player.style.removeProperty('--ypp-compact-progress-bottom');
        player.style.removeProperty('--ypp-compact-time-font');
        player.style.removeProperty('--ypp-compact-chapter-max-width');
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.CompactPlayerUI = CompactPlayerUI;
