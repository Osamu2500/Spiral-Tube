window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

window.YPP.features.SmartDownload = class SmartDownload extends window.YPP.features.BaseFeature {
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
        if (this.downloadButtonObserver) return;

        document.querySelectorAll(this.DL_BTN_SELECTORS).forEach(btn => this.forceEnableDownloadButton(btn));

        this.downloadButtonObserver = new MutationObserver(() => {
            document.querySelectorAll(this.DL_BTN_SELECTORS).forEach(btn => {
                if (btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true' ||
                    btn.style.pointerEvents === 'none' || btn.dataset.yppForced !== '1') {
                    btn.dataset.yppForced = '0';
                    this.forceEnableDownloadButton(btn);
                }
            });
        });

        this.downloadButtonObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'aria-disabled', 'style']
        });
    }

    stopDownloadButtonWatcher() {
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
