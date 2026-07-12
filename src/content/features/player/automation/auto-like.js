/**
 * Auto Like Feature
 * Automatically likes a video after a configurable delay or percentage of playback.
 * Respects subscription status, active ads, and previous user actions.
 */

// ── Selectors ────────────────────────────────────────────────────────────────

const SELECTORS = {
    LIKE_BUTTON: [
        'ytd-watch-metadata ytd-toggle-button-renderer:first-child button',
        'segmented-like-dislike-button-view-model button:first-child',
        'like-button-view-model button',
        '[aria-label*="like this video" i]',
        '[aria-label*="I like this" i]',
        'button.yt-spec-button-shape-next--tonal[aria-label*="like" i]',
    ],
    DISLIKE_BUTTON: [
        'dislike-button-view-model button',
        '[aria-label*="dislike this video" i]',
        '[aria-label*="I dislike this" i]',
    ],
    SUBSCRIBE_BUTTON: [
        'ytd-subscribe-button-renderer',
        'yt-smartimation',
    ],
    VIDEO: 'video.html5-main-video',
    MOVIE_PLAYER: '#movie_player',
    AD_ELEMENTS: '.video-ads, .ytp-ad-module',
};

const LIKED_STORAGE_KEY = (videoId) => `ypp_liked_${videoId}`;
const VIDEO_ID_REGEX = /[?&]v=([^&]+)/;
const AD_RECHECK_INTERVAL_MS = 2000;
const LIKE_BUTTON_WAIT_MS = 10000;
const VIDEO_ELEMENT_WAIT_MS = 15000;
const HUMANIZE_VARIANCE_PERCENT = 0.2;

// ── Feature Class ─────────────────────────────────────────────────────────────

export class AutoLike extends window.YPP.features.BaseFeature {
    static featureId     = 'autoLike';
    static executionPhase = 'idle';
    static priority      = 999;

    constructor() {
        super('AutoLike');
        this._attempted  = new Set();
        this._timeoutId  = null;
        this._progressCheckHandler = null;
        this._progressVideo        = null;
    }

    getConfigKey() { return 'autoLike'; }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    async enable() {
        await super.enable();
        this.onBusEvent('page:changed', () => this._tryLike());
        this._tryLike();
    }

    async disable() {
        await super.disable(); // cleans up all addListener & onBusEvent
        this._clearPendingTimeout();
        this._detachProgressListener();
        this._attempted.clear();
    }

    onVideoChange(videoId) {
        if (!this.isEnabled) return;
        this._clearPendingTimeout();
        this._detachProgressListener();
        this._tryLike();
    }

    // ── Core trigger ─────────────────────────────────────────────────────────

    _tryLike() {
        if (!this.utils.isWatchPage()) return;

        const videoId = this._getCurrentVideoId();
        if (!videoId)                            return;
        if (this._hasAlreadyAttempted(videoId))  return;

        this._clearPendingTimeout();
        this._detachProgressListener();

        if (this.settings.autoLikeSubscribedOnly && !this._isSubscribed()) {
            this.utils.log?.(`Skipped auto-like for ${videoId}: not subscribed`, 'AutoLike', 'info');
            return;
        }

        const delayType = this.settings.autoLikeDelayType || 'seconds';
        if (delayType === 'percent') {
            this._scheduleByPercent(videoId);
        } else {
            this._scheduleBySeconds(videoId);
        }
    }

    // ── Delay strategies ──────────────────────────────────────────────────────

    _scheduleBySeconds(videoId) {
        let delaySeconds = this.settings.autoLikeDelaySeconds ?? 1;

        if (this.settings.autoLikeHumanize) {
            const variance = delaySeconds * HUMANIZE_VARIANCE_PERCENT;
            delaySeconds  += (Math.random() * variance * 2) - variance;
        }

        const delayMs = Math.max(0, delaySeconds * 1000);
        this._timeoutId = setTimeout(() => this._checkAdsAndLike(videoId), delayMs);
    }

    async _scheduleByPercent(videoId) {
        try {
            const video = await this.waitForElement(SELECTORS.VIDEO, VIDEO_ELEMENT_WAIT_MS);
            if (!video) return;

            this._progressVideo         = video;
            this._progressCheckHandler  = () => this._onVideoTimeUpdate(video, videoId);
            this.addListener(video, 'timeupdate', this._progressCheckHandler);
        } catch {
            // Feature was disabled or timed out — no action needed
        }
    }

    _onVideoTimeUpdate(video, videoId) {
        if (this._getCurrentVideoId() !== videoId) {
            this._detachProgressListener();
            return;
        }

        const targetPercent = this.settings.autoLikeDelayPercent ?? 50;
        const currentPercent = video.duration > 0
            ? (video.currentTime / video.duration) * 100
            : 0;

        if (currentPercent >= targetPercent || video.ended) {
            this._detachProgressListener();
            this._checkAdsAndLike(videoId);
        }
    }

    // ── Ad gating ─────────────────────────────────────────────────────────────

    _checkAdsAndLike(videoId) {
        if (this.settings.autoLikeWaitAds && this._isAdPlaying()) {
            this._timeoutId = setTimeout(
                () => this._checkAdsAndLike(videoId),
                AD_RECHECK_INTERVAL_MS
            );
            return;
        }
        this._performLike(videoId);
    }

    // ── Like action ───────────────────────────────────────────────────────────

    async _performLike(videoId) {
        try {
            const likeBtn = await this._resolveLikeButton();
            if (!likeBtn) {
                this.utils.log?.(`Like button not found for ${videoId}`, 'AutoLike', 'warn');
                return;
            }

            if (this._isAlreadyLiked(likeBtn)) {
                this._markAttempted(videoId);
                return;
            }

            if (this._isDisliked()) {
                this.utils.log?.(`User disliked ${videoId} — skipping auto-like`, 'AutoLike', 'info');
                this._markAttempted(videoId);
                return;
            }

            likeBtn.click();
            this._markAttempted(videoId);
            this.utils.log?.(`Auto-liked video ${videoId}`, 'AutoLike', 'info');
        } catch {
            // Feature was disabled mid-await — no action needed
        }
    }

    async _resolveLikeButton() {
        let btn = this._findLikeButton();
        if (btn) return btn;

        // Build a compound selector for waitForElement
        const compoundSelector = SELECTORS.LIKE_BUTTON.join(', ');
        btn = await this.waitForElement(compoundSelector, LIKE_BUTTON_WAIT_MS);
        return btn ?? this._findLikeButton();
    }

    // ── DOM queries ───────────────────────────────────────────────────────────

    _findLikeButton() {
        for (const selector of SELECTORS.LIKE_BUTTON) {
            const btn = document.querySelector(selector);
            if (btn) return btn;
        }
        return null;
    }

    _findDislikeButton() {
        for (const selector of SELECTORS.DISLIKE_BUTTON) {
            const btn = document.querySelector(selector);
            if (btn) return btn;
        }
        return null;
    }

    _isAlreadyLiked(likeBtn) {
        const isPressed = likeBtn.getAttribute('aria-pressed') === 'true';
        const isActive  = likeBtn.classList.contains('active')
                       || likeBtn.classList.contains('style-default-active');
        return isPressed || isActive;
    }

    _isDisliked() {
        const btn = this._findDislikeButton();
        if (!btn) return false;
        const isPressed = btn.getAttribute('aria-pressed') === 'true';
        const isActive  = btn.classList.contains('active')
                       || btn.classList.contains('style-default-active');
        return isPressed || isActive;
    }

    _isSubscribed() {
        for (const selector of SELECTORS.SUBSCRIBE_BUTTON) {
            const el = document.querySelector(selector);
            if (!el) continue;
            if (el.hasAttribute('subscribed') || el.querySelector('[subscribed]')) return true;
            const label = el.textContent?.trim().toLowerCase() ?? '';
            if (label.includes('subscribed') && !label.includes('unsubscribe')) return true;
        }
        // No subscribe button found — treat as subscribed (e.g. own channel, or logged out)
        return true;
    }

    _isAdPlaying() {
        const player = document.getElementById(SELECTORS.MOVIE_PLAYER.slice(1));
        if (player?.classList.contains('ad-showing')) return true;

        const adEl = document.querySelector(SELECTORS.AD_ELEMENTS);
        return !!adEl && adEl.getBoundingClientRect().height > 0;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    _getCurrentVideoId() {
        return window.location.href.match(VIDEO_ID_REGEX)?.[1] ?? null;
    }

    _hasAlreadyAttempted(videoId) {
        if (this._attempted.has(videoId)) return true;
        try { return !!localStorage.getItem(LIKED_STORAGE_KEY(videoId)); } catch { return false; }
    }

    _markAttempted(videoId) {
        this._attempted.add(videoId);
        try { localStorage.setItem(LIKED_STORAGE_KEY(videoId), '1'); } catch { /* quota exceeded */ }
    }

    _clearPendingTimeout() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    }

    _detachProgressListener() {
        if (this._progressVideo && this._progressCheckHandler) {
            this.removeListener(this._progressVideo, 'timeupdate', this._progressCheckHandler);
        }
        this._progressVideo        = null;
        this._progressCheckHandler = null;
    }
}

window.YPP.features.AutoLike = AutoLike;
