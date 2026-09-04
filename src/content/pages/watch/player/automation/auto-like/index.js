import '../../../../../core/system/base-feature.js';
import * as DOM from './dom.js';
import { passesHeuristics } from './heuristics.js';

/**
 * @fileoverview
 * Auto Like Feature
 * 
 * Target: /watch and /shorts routes.
 * Purpose: Automatically likes a video after a configurable delay or percentage of playback.
 * Respects subscription status, active ads, and previous user actions.
 */

const LIKED_STORAGE_KEY = (videoId) => `ypp_liked_${videoId}`;
// Fixed Regex: matches ?v=ID, &v=ID, or /shorts/ID
const VIDEO_ID_REGEX = /(?:v=|shorts\/)([^&/?]+)/; 
const AD_RECHECK_INTERVAL_MS = 2000;
const HUMANIZE_VARIANCE_PERCENT = 0.2;

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
        
        this._sponsorCache = { id: null, value: 0 };
    }

    getConfigKey() { return 'autoLike'; }

    async enable() {
        await super.enable();
        this.onBusEvent('page:changed', () => this._tryLike());
        this._tryLike();
    }

    async disable() {
        await super.disable(); 
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

    _tryLike() {
        const isWatchOrShorts = this.utils.isWatchPage() || window.location.pathname.startsWith('/shorts/');
        if (!isWatchOrShorts) return;

        const videoId = this._getCurrentVideoId();
        if (!videoId)                            return;
        if (this._hasAlreadyAttempted(videoId))  return;

        this._clearPendingTimeout();
        this._detachProgressListener();

        if (this.settings.autoLikeSubscribedOnly && !DOM.isSubscribed()) {
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

    _scheduleBySeconds(videoId) {
        // Fallback to autoLikeThreshold if autoLikeDelaySeconds is missing
        let delaySeconds = this.settings.autoLikeDelaySeconds ?? this.settings.autoLikeThreshold ?? 1;

        if (this.settings.autoLikeHumanize) {
            const variance = delaySeconds * HUMANIZE_VARIANCE_PERCENT;
            delaySeconds  += (Math.random() * variance * 2) - variance;
        }

        const delayMs = Math.max(0, delaySeconds * 1000);
        this._timeoutId = this.setTimeout(() => this._checkAdsAndLike(videoId), delayMs);
    }

    async _scheduleByPercent(videoId) {
        try {
            const video = await this.waitForElement(DOM.SELECTORS.VIDEO, DOM.VIDEO_ELEMENT_WAIT_MS);
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

        // Fallback to autoLikeThreshold if autoLikeDelayPercent is missing
        const targetPercent = this.settings.autoLikeDelayPercent ?? this.settings.autoLikeThreshold ?? 50;
        const currentPercent = video.duration > 0
            ? (video.currentTime / video.duration) * 100
            : 0;
            
        // Heuristic Liking: calculate actual time played vs skipped
        let playedSeconds = 0;
        if (video.played) {
            for (let i = 0; i < video.played.length; i++) {
                playedSeconds += (video.played.end(i) - video.played.start(i));
            }
        }
        
        const playedPercent = video.duration > 0 ? (playedSeconds / video.duration) * 100 : 0;
        const isHeuristicPassed = playedPercent >= (targetPercent * 0.8); // Must actually play 80% of the target time

        if ((currentPercent >= targetPercent && isHeuristicPassed) || video.ended) {
            this._detachProgressListener();
            
            // Log binding ensures that context is not lost during callback
            const logFn = this.utils.log ? this.utils.log.bind(this.utils) : null;
            if (!passesHeuristics(videoId, this._sponsorCache, logFn)) {
                this._markAttempted(videoId);
                return;
            }
            
            this._checkAdsAndLike(videoId);
        }
    }

    _checkAdsAndLike(videoId) {
        if (this.settings.autoLikeWaitAds && DOM.isAdPlaying()) {
            this._timeoutId = this.setTimeout(
                () => this._checkAdsAndLike(videoId),
                AD_RECHECK_INTERVAL_MS
            );
            return;
        }
        this._performLike(videoId);
    }

    async _performLike(videoId) {
        try {
            const likeBtn = await DOM.resolveLikeButton(this.waitForElement.bind(this));
            if (!likeBtn) {
                this.utils.log?.(`Like button not found for ${videoId}`, 'AutoLike', 'warn');
                return;
            }

            if (DOM.isButtonPressed(likeBtn)) {
                this._markAttempted(videoId);
                return;
            }

            if (DOM.isDisliked()) {
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
            this.clearTimeout(this._timeoutId);
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

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.AutoLike = AutoLike;
