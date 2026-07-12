export class CustomCursor extends window.YPP.features.BaseFeature {
    constructor() {
        super('CustomCursor');
        this.styleElement = null;
    }

    init() {
        this.addSettingListener('customCursor', (val) => this.applyCursor(val));
    }

    enable() {
        const current = window.YPP.Settings.get('customCursor', 'default');
        this.applyCursor(current);
    }

    disable() {
        if (this.styleElement) {
            this.styleElement.textContent = '';
        }
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

        // Generate the absolute URL for the cursor image
        const extensionUrl = chrome.runtime.getURL('');
        const cursorUrl = `${extensionUrl}assets/cursors/${styleVal}-pointer.png`;

        this.styleElement.textContent = `
            * {
                cursor: url('${cursorUrl}'), auto !important;
            }
            a, button, [role="button"], input, select, textarea, .ytp-button, .yt-spec-button-shape-next,
            [cursor="pointer"], [style*="cursor: pointer"] {
                cursor: url('${cursorUrl}'), pointer !important;
            }
        `;
    }
}
