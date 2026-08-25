import '../../../core/system/base-feature.js';
export class CustomCursor extends window.YPP.features.BaseFeature {
    static featureId = 'customCursor';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('CustomCursor');
        this.styleElement = null;
    }

    // Always run this feature (null = no boolean on/off toggle)
    getConfigKey() {
        return null;
    }

    enable() {
        this._applyCursorFromSettings();
    }

    async onUpdate() {
        this._applyCursorFromSettings();
    }

    disable() {
        if (this.styleElement) {
            this.styleElement.textContent = '';
        }
    }

    _applyCursorFromSettings() {
        const styleVal = (this.settings && this.settings.customCursor) || 'default';
        this.applyCursor(styleVal);
    }

    applyCursor(styleVal) {
        if (!this.styleElement) {
            this.styleElement = document.createElement('style');
            this.styleElement.id = 'ypp-custom-cursor-style';
            document.head.appendChild(this.styleElement);
        }

        if (!styleVal || styleVal === 'default') {
            this.styleElement.textContent = '';
            return;
        }

        // Generate the absolute URL base for the cursor images
        const extensionUrl = chrome.runtime.getURL('');
        const baseCursor = `${extensionUrl}src/assets/cursors/${styleVal}/cursor`;
        const basePointer = `${extensionUrl}src/assets/cursors/${styleVal}/pointer`;

        const normalFallbacks = `url('${baseCursor}.gif'), url('${baseCursor}.cur'), url('${baseCursor}.png'), auto`;
        const pointerFallbacks = `url('${basePointer}.gif'), url('${basePointer}.cur'), url('${basePointer}.png'), pointer`;

        this.styleElement.textContent = `
            * {
                cursor: ${normalFallbacks} !important;
            }

            
            a, a *, button, button *, [role="button"], [role="button"] *, 
            [role="link"], [role="link"] *, [role="tab"], [role="tab"] *, 
            [role="menuitem"], [role="menuitem"] *, 
            input[type="button"], input[type="submit"], input[type="reset"], 
            input[type="checkbox"], input[type="radio"],
            select, .ytp-button, tp-yt-paper-button, tp-yt-paper-tab, 
            tp-yt-paper-icon-button, yt-icon-button, ytd-button-renderer, yt-button-view-model, yt-download-button-view-model, yt-segmented-like-dislike-button-view-model,
            ytd-toggle-button-renderer, ytd-subscribe-button-renderer, 
            ytd-thumbnail, ytd-rich-grid-media, ytd-compact-video-renderer, 
            ytd-playlist-panel-video-renderer, .ytp-progress-bar-container, 
            .ytp-volume-panel, [cursor="pointer"], [style*="cursor: pointer"], 
            [style*="cursor:pointer"] {
                cursor: ${pointerFallbacks} !important;
            }

            input[type="text"], input[type="search"], input[type="password"], 
            input[type="email"], input[type="number"], textarea, 
            [contenteditable="true"], [contenteditable="true"] * {
                cursor: text !important;
            }
        `;
    }
}

window.YPP.features.CustomCursor = CustomCursor;
