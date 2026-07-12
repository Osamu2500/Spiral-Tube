/**
 * Smart Download Feature
 * Intercepts the YouTube download button and redirects to ssvid.net instead,
 * bypassing YouTube Premium's download gate.
 */

// ── Selectors ──────────────────────────────────────────────────────────────────

// Intentionally narrow — only real download buttons, not generic yt-button-shape
const DOWNLOAD_BUTTON_SELECTORS = [
    'ytd-download-button-renderer button',
    'button[aria-label="Download video"]',
    'button[aria-label*="Download" i]:not([aria-label*="chapter" i])',
    '.ytp-download-button',
].join(', ');

// Renderer-level wrappers to also un-disable
const DOWNLOAD_RENDERER_SELECTOR =
    'ytd-download-button-renderer, .yt-button-shape-with-explainer';

// ── Feature Class ──────────────────────────────────────────────────────────────

export class SmartDownload extends window.YPP.features.BaseFeature {
    static featureId      = 'smartDownload';
    static executionPhase = 'idle';
    static priority       = 999;

    constructor() {
        super('SmartDownload');
        this._handleClick        = this._onDownloadClick.bind(this);
        this._attributeObserver  = null;
    }

    getConfigKey() { return 'smartDownload'; }

    // ── Lifecycle ──────────────────────────────────────────────────────────────

    async enable() {
        await super.enable();
        // Capture phase so we intercept before YouTube's own handlers
        this.addListener(document, 'click', this._handleClick, true);
        this._attachButtonWatcher();
    }

    async disable() {
        await super.disable(); // removes addListener registrations
        this._detachButtonWatcher();
    }

    onVideoChange() {
        if (!this.isEnabled) return;
        // Re-scan after SPA navigation — the download button re-renders
        this._processExistingButtons();
    }

    // ── Click interception ─────────────────────────────────────────────────────

    _onDownloadClick(event) {
        const btn = event.target.closest(DOWNLOAD_BUTTON_SELECTORS);
        if (!btn) return;

        const label = (btn.getAttribute('aria-label') ?? btn.innerText ?? '').toLowerCase();
        if (!label.includes('download')) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        const videoUrl = this._getCleanVideoUrl();
        this._copyToClipboard(videoUrl);

        window.open(
            `https://ssvid.net/en/youtube-video-downloader-4`,
            '_blank',
            'noopener,noreferrer'
        );
    }

    // ── Button un-gating ───────────────────────────────────────────────────────

    _attachButtonWatcher() {
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'smart-download',
                DOWNLOAD_BUTTON_SELECTORS,
                (nodes) => this._processButtons(nodes)
            );
        }
        this._processExistingButtons();
    }

    _detachButtonWatcher() {
        window.YPP.sharedObserver?.unregister('smart-download');
        this._attributeObserver?.disconnect();
        this._attributeObserver = null;
    }

    _processExistingButtons() {
        const existing = Array.from(document.querySelectorAll(DOWNLOAD_BUTTON_SELECTORS));
        if (existing.length) this._processButtons(existing);
    }

    _processButtons(nodes) {
        nodes.forEach(node => {
            const buttons = this._resolveButtons(node);
            buttons.forEach(btn => this._unGateButton(btn));
        });
    }

    /** Resolve a node to a list of matching download buttons. */
    _resolveButtons(node) {
        if (node.matches?.(DOWNLOAD_BUTTON_SELECTORS)) return [node];
        return Array.from(node.querySelectorAll?.(DOWNLOAD_BUTTON_SELECTORS) ?? []);
    }

    /** Remove Premium gating from a download button and watch for re-gating. */
    _unGateButton(btn) {
        if (btn.dataset.yppForced === '1') return;
        btn.dataset.yppForced = '1';

        this._removeDisabledState(btn);
        this._removeDisabledState(btn.closest(DOWNLOAD_RENDERER_SELECTOR));

        // Watch for YouTube re-applying disabled state
        if (!btn.dataset.yppObserved) {
            btn.dataset.yppObserved = 'true';
            this._ensureAttributeObserver();
            this._attributeObserver?.observe(btn, {
                attributes: true,
                attributeFilter: ['disabled', 'aria-disabled', 'style'],
            });
        }
    }

    _removeDisabledState(el) {
        if (!el) return;
        el.removeAttribute('disabled');
        el.removeAttribute('aria-disabled');
        el.style.removeProperty('pointer-events');
        el.style.removeProperty('opacity');
        el.style.removeProperty('cursor');
    }

    _ensureAttributeObserver() {
        if (this._attributeObserver) return;
        this._attributeObserver = new MutationObserver(mutations => {
            mutations.forEach(({ target }) => {
                if (target.dataset.yppForced !== '1') return;
                // YouTube re-disabled it — undo it
                target.dataset.yppForced = '0';
                this._unGateButton(target);
            });
        });
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    _getCleanVideoUrl() {
        const url     = new URL(window.location.href);
        const videoId = url.searchParams.get('v');
        return videoId
            ? `https://www.youtube.com/watch?v=${videoId}`
            : `https://www.youtube.com${url.pathname}`;
    }

    _copyToClipboard(text) {
        try {
            navigator.clipboard.writeText(text).catch(() => {});
        } catch { /* non-secure context — skip */ }
    }
}

window.YPP.features.SmartDownload = SmartDownload;
