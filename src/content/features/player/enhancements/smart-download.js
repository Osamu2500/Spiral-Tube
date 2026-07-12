export class SmartDownload extends window.YPP.features.BaseFeature {
    static featureId = 'smartDownload';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('SmartDownload');
        this.DL_BTN_SELECTORS = [
            'ytd-download-button-renderer button',
            'button[aria-label="Download video"]',
            'button[aria-label*="Download"]',
            '.ytp-download-button',
            'yt-button-shape button'
        ].join(', ');
        
        this.downloadInterceptActive = false;
        this.downloadButtonObserver = null;
        this._handleClick = this.handleDownloadClick.bind(this);
    }

    getConfigKey() {
        return 'smartDownload';
    }

    async enable() {
        await super.enable();
        if (this.downloadInterceptActive) return;
        this.downloadInterceptActive = true;
        
        document.addEventListener('click', this._handleClick, true);
        this.startDownloadButtonWatcher();
    }

    async disable() {
        await super.disable();
        this.downloadInterceptActive = false;
        document.removeEventListener('click', this._handleClick, true);
        this.stopDownloadButtonWatcher();
    }

    forceEnableDownloadButton(btn) {
        if (btn.dataset.yppForced === '1') return;
        btn.dataset.yppForced = '1';

        btn.removeAttribute('disabled');
        btn.removeAttribute('aria-disabled');
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';

        const renderer = btn.closest('ytd-download-button-renderer, yt-button-shape, .yt-button-shape-with-explainer');
        if (renderer) {
            renderer.removeAttribute('disabled');
            renderer.removeAttribute('aria-disabled');
            renderer.style.pointerEvents = 'auto';
            renderer.style.opacity = '1';
        }
    }

    startDownloadButtonWatcher() {
        this._processButtons = (nodes) => {
            if (!this.downloadButtonObserver) {
                this.downloadButtonObserver = new MutationObserver((mutations) => {
                    mutations.forEach(m => {
                        if (m.target && m.target.matches && m.target.matches(this.DL_BTN_SELECTORS)) {
                            if (m.target.hasAttribute('disabled') || m.target.getAttribute('aria-disabled') === 'true' || m.target.style.pointerEvents === 'none') {
                                m.target.dataset.yppForced = '0';
                                this.forceEnableDownloadButton(m.target);
                            }
                        }
                    });
                });
            }

            nodes.forEach(node => {
                const btns = node.matches && node.matches(this.DL_BTN_SELECTORS) ? [node] : Array.from(node.querySelectorAll ? node.querySelectorAll(this.DL_BTN_SELECTORS) : []);
                btns.forEach(btn => {
                    this.forceEnableDownloadButton(btn);
                    if (!btn.dataset.yppObserved) {
                        btn.dataset.yppObserved = "true";
                        this.downloadButtonObserver.observe(btn, { attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'style'] });
                    }
                });
            });
        };
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('smart-download', this.DL_BTN_SELECTORS, this._processButtons);
        }
        
        const existing = Array.from(document.querySelectorAll(this.DL_BTN_SELECTORS));
        if (existing.length) {
            this._processButtons(existing);
        }
    }

    stopDownloadButtonWatcher() {
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('smart-download');
        }
        if (this.downloadButtonObserver) {
            this.downloadButtonObserver.disconnect();
            this.downloadButtonObserver = null;
        }
    }

    handleDownloadClick(e) {
        const btn = e.target.closest(this.DL_BTN_SELECTORS);
        if (!btn) return;

        const label = (btn.getAttribute('aria-label') || btn.innerText || '').toLowerCase();
        if (!label.includes('download')) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        const videoUrl = this.getCleanVideoUrl();

        try {
            navigator.clipboard.writeText(videoUrl).catch(() => {});
        } catch (_) {}

        window.open('https://ssvid.net/en/youtube-video-downloader-4', '_blank', 'noopener,noreferrer');
    }

    getCleanVideoUrl() {
        const url = new URL(window.location.href);
        const videoId = url.searchParams.get('v');
        if (videoId) {
            return `https://www.youtube.com/watch?v=${videoId}`;
        }
        return `https://www.youtube.com${url.pathname}`;
    }
};

window.YPP.features.SmartDownload = SmartDownload;
