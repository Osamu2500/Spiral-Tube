import '../../../../core/system/base-feature.js';
/**
 * @fileoverview
 * Shorts Auto Scroll
 * 
 * Target: /shorts route.
 * Purpose: Automatically scrolls to the next Shorts video when the current one finishes.
 * Targets: /shorts/ paths and ytd-reel-video-renderer elements.
 * Encapsulated logic, does not affect unrelated YouTube navigation.
 */
export class ShortsAutoScroll extends window.YPP.features.BaseFeature {
    static featureId = 'shortsAutoScroll';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('ShortsAutoScroll');
        this._timeupdateHandler = null;
        this._isMonitoring = false;
        // Keep track of the last scrolled video to prevent double-skipping
        this._lastScrolledVideo = null;
        
        // Smart Feed Control state
        this._sessionStartTime = null;
        this._skipCountByCreator = new Map();
        this._currentVideoStartTime = null;
        
        // State variables
        this._loopCount = 0;
        this._lastTime = 0;
    }

    getConfigKey() { return 'shortsAutoScroll'; }

    async enable() {
        await super.enable();
        if (location.pathname.startsWith('/shorts/')) {
            this.startMonitoring();
        }
    }

    async disable() {
        await super.disable();
        this.stopMonitoring();
    }

    onPageChange(url) {
        if (!this.isEnabled) return;
        if (url.includes('/shorts/')) {
            this.startMonitoring();
        } else {
            this.stopMonitoring();
        }
    }

    onUpdate(settings, oldSettings) {
        if (settings.shortsPlaybackSpeed !== oldSettings?.shortsPlaybackSpeed) {
            const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');
            if (activeReel) {
                const video = activeReel.querySelector('video');
                if (video) video.playbackRate = settings.shortsPlaybackSpeed || 1.0;
            }
        }
    }

    startMonitoring() {
        if (this._isMonitoring) return;
        this.utils?.log('Starting Shorts Auto-Scroll interval monitoring', 'AutoScroll');
        
        this._sessionStartTime = Date.now();
        this._skipCountByCreator.clear();
        
        this._timeupdateHandler = (e) => {
            if (document.hidden) return;
            if (e.target && e.target.tagName === 'VIDEO' && e.target.closest('ytd-reel-video-renderer[is-active]')) {
                // Pass video to avoid re-querying
                this._checkAndScroll(e.target, e.target.closest('ytd-reel-video-renderer'));
            }
        };
        document.addEventListener('timeupdate', this._timeupdateHandler, true);

        this._isMonitoring = true;
    }

    stopMonitoring() {
        if (!this._isMonitoring) return;
        if (this._timeupdateHandler) {
            document.removeEventListener('timeupdate', this._timeupdateHandler, true);
            this._timeupdateHandler = null;
        }
        
        // Restore playback speed when disabled
        const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');
        if (activeReel) {
            const video = activeReel.querySelector('video');
            if (video && video.playbackRate !== 1.0) {
                video.playbackRate = 1.0;
            }
        }
        
        this._isMonitoring = false;
        this._lastScrolledVideo = null;
        this._loopCount = 0;
        this.utils?.log('Stopped Shorts Auto-Scroll monitoring', 'AutoScroll');
    }

    _checkAndScroll(video, activeReel) {
        if (!activeReel || !video) return;
        if (isNaN(video.duration) || video.duration === 0) return;
        
        const nextButton = document.querySelector('#navigation-button-down :is(ytd-button-renderer, yt-button-view-model) button, .navigation-button.down button');

        // Variable Speed Playback (Attention-Span Optimizer)
        let targetSpeed = this.settings?.shortsPlaybackSpeed || 1.0;
        
        if (this.settings?.variableSpeed !== false && video.duration > 30) {
            const timeRemaining = video.duration - video.currentTime;
            if (timeRemaining > 5) {
                targetSpeed = Math.max(1.25, targetSpeed); // Speed up boring parts
            } else {
                targetSpeed = 1.0; // Slow down for the punchline
            }
        }
        
        if (video.playbackRate !== targetSpeed) {
            video.playbackRate = targetSpeed;
        }

        // Anti-Doomscroll: Stop auto-scrolling if session limit reached
        if (this.settings?.shortsSessionLimitMinutes) {
            const sessionDurationMins = (Date.now() - this._sessionStartTime) / 60000;
            if (sessionDurationMins >= this.settings.shortsSessionLimitMinutes) {
                this.stopMonitoring();
                this.utils?.log('Shorts session limit reached. Stopping auto-scroll.', 'AutoScroll', 'warn');
                return;
            }
        }
        
        // Setup state for new video
        if (this._lastScrolledVideo !== video) {
            this._currentVideoStartTime = Date.now();
            this._lastScrolledVideo = video;
            this._loopCount = 0;
            this._lastTime = video.currentTime;
            
            const channelNameEl = activeReel.querySelector('#channel-name a, .ytd-channel-name a');
            const titleEl = activeReel.querySelector('h2.title');
            const creator = channelNameEl ? channelNameEl.textContent.trim() : '';
            const titleText = titleEl ? titleEl.textContent.trim() : '';
            
            // Topic Banning
            if (this._isBannedTopic(creator, titleText)) {
                this.utils?.log(`Auto-skipping banned topic: ${titleText}`, 'AutoScroll', 'info');
                if (nextButton) nextButton.click();
                return;
            }
            
            // Engagement Tracking: Skip if creator is ignored
            if (creator) {
                const skipCount = this._skipCountByCreator.get(creator) || 0;
                if (skipCount >= 3) {
                    this.utils?.log(`Auto-skipping ${creator} due to low engagement`, 'AutoScroll', 'info');
                    if (nextButton) nextButton.click();
                    return; // Skip rest of checks
                }
            }
        }
        
        // Loop Tracking: Only count if it jumped back from near the end
        if (video.currentTime < this._lastTime - 1) {
            const wasNearEnd = video.duration && this._lastTime > (video.duration - 2);
            if (wasNearEnd) {
                this._loopCount++;
                
                // Auto-Bookmark
                if (this._loopCount === 3 && this.settings?.shortsAutoBookmark) {
                    this.utils?.log('Short looped 3 times! Bookmarking...', 'AutoScroll', 'info');
                    this._autoBookmark(activeReel);
                }
            } else {
                this.utils?.log('Manual rewind detected, ignoring loop count', 'AutoScroll', 'debug');
            }
        }
        this._lastTime = video.currentTime;
        
        const targetLoops = this.settings?.shortsAllowedLoops || 0;

        // If the video has ended naturally OR is within 0.1s of ending (which catches it before it loops)
        if (video.ended || (video.currentTime > 0 && video.duration > 0 && video.duration - video.currentTime <= 0.1)) {
            
            // Prevent scrolling multiple times for the same video instance during transition
            if (video.currentTime > 0.5 && (Date.now() - this._currentVideoStartTime) < 1000) {
                return; // Debounce transition
            }
            
            // Should we let it loop?
            if (this._loopCount < targetLoops) {
                return; // Wait for it to loop naturally
            }

            if (nextButton) {
                this.utils?.log('Short ended. Auto-scrolling to next.', 'AutoScroll', 'info');
                nextButton.click();
            }
        }
    }
    
    // --- Features ---
    
    _isBannedTopic(creator, title) {
        const bannedWords = this.settings?.shortsBannedWords || [];
        if (!bannedWords.length) return false;
        
        const textToScan = `${creator} ${title}`.toLowerCase();
        return bannedWords.some(word => textToScan.includes(word.toLowerCase()));
    }
    
    _autoBookmark(activeReel) {
        // Find the "Save" or "Like" button and click it to bookmark
        const likeBtn = activeReel.querySelector('#like-button button, [aria-label*="like" i]');
        if (likeBtn && likeBtn.getAttribute('aria-pressed') !== 'true') {
            likeBtn.click();
        }
    }
    
    // Hook into YouTube's navigation to track manual skips
    onBusEvent(eventName, data) {
        if (eventName === 'page:changed' && location.pathname.startsWith('/shorts/')) {
            if (this._lastScrolledVideo && this._currentVideoStartTime) {
                const watchedTimeMs = Date.now() - this._currentVideoStartTime;
                if (watchedTimeMs > 0 && watchedTimeMs < 3000) { // Skipped within 3 seconds
                    const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');
                    if (activeReel) {
                        const channelNameEl = activeReel.querySelector('#channel-name a, .ytd-channel-name a');
                        if (channelNameEl) {
                            const creator = channelNameEl.textContent.trim();
                            const currentSkips = this._skipCountByCreator.get(creator) || 0;
                            this._skipCountByCreator.set(creator, currentSkips + 1);
                        }
                    }
                }
            }
        }
    }
};

