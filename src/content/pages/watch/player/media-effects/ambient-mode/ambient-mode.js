import '../../../../../core/system/base-feature.js';
const SELECTORS = {
    CINEMATICS: '#cinematics, ytd-watch-flexy #cinematics',
    VIDEO: 'ytd-player video'
};

export class AmbientMode extends window.YPP.features.BaseFeature {
    static featureId = 'ambientMode';
    static executionPhase = 'idle';
    static priority = 13;

    constructor() {
        super('AmbientMode');
        this.styleNode = null;
    }

    getConfigKey() {
        return 'ambientMode';
    }

    async enable() {
        if (!this.utils.isWatchPage()) return;
        await super.enable();

        document.body.classList.add('ypp-ambient-mode-active');
        this.applyNextAmbientStyles();
    }

    async disable() {
        await super.disable();
        document.body.classList.remove('ypp-ambient-mode-active');

        if (this.styleNode && this.styleNode.parentNode) {
            this.styleNode.remove();
            this.styleNode = null;
        }
        const existingNode = document.getElementById('ypp-next-ambient-style');
        if (existingNode) existingNode.remove();
    }

    async onUpdate() {
        if (this.isEnabled) {
            this.applyNextAmbientStyles();
        }
    }

    async onPageChange(url) {
        if (!this.isEnabled) return;
        if (this.utils.isWatchPage()) {
            await this.disable();
            this.isEnabled = true;
            await this.enable();
        } else {
            await this.disable();
            this.isEnabled = true;
        }
    }

    async onVideoChange(videoId) {
        if (!this.isEnabled || !this.utils.isWatchPage()) return;
        this.applyNextAmbientStyles();
    }

    applyNextAmbientStyles() {
        const intensity = this.settings?.ambientIntensity ?? 0.6;
        const blur = this.settings?.ambientBlur ?? 120;

        let styleNode = document.getElementById('ypp-next-ambient-style');
        if (!styleNode) {
            styleNode = document.createElement('style');
            styleNode.id = 'ypp-next-ambient-style';
            document.head.appendChild(styleNode);
            this.styleNode = styleNode;
        }

        styleNode.textContent = `
            body.ypp-ambient-mode-active html[dark="true"] #cinematics.ytd-watch-flexy,
            body.ypp-ambient-mode-active #cinematics.ytd-watch-flexy { 
                width: 100% !important; 
                height: 100% !important; 
            }
            body.ypp-ambient-mode-active div#cinematics { 
                overflow: visible !important; 
            }
            body.ypp-ambient-mode-active #cinematics > div > canvas { 
                transition: opacity 0.5s ease-in !important; 
                filter: saturate(1.2) blur(${blur}px) !important; 
                opacity: ${intensity} !important; 
            }
            body.ypp-ambient-mode-active #cinematics > div > canvas:not([style*="height:"]) { 
                filter: blur(10px) !important; 
            }
            body.ypp-ambient-mode-active ytd-playlist-panel-renderer#playlist { 
                background: transparent !important; 
                backdrop-filter: blur(20px) !important; 
            }
            body.ypp-ambient-mode-active ytd-playlist-panel-renderer#playlist:hover { 
                background: #222 !important; 
                transition: 0.5s !important; 
            }
            body.ypp-ambient-mode-active ytd-playlist-panel-renderer {
                background: rgba(255, 255, 255, 0.08) !important;
                backdrop-filter: blur(16px) saturate(120%) !important;
                -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
                border-radius: 12px !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35) !important;
            }
        `;
    }
}

window.YPP = window.YPP || {};
