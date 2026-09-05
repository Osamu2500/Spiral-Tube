import '../../../../core/system/base-feature.js';
/**
 * Card Pipeline (V3 Architecture)
 * --------------------------------
 * Centralized evaluation engine for all video cards on YouTube.
 * 
 * Instead of having 5 different filters scanning the DOM independently,
 * this pipeline evaluates every card once, extracts its metadata, and passes
 * a unified Context object through all registered filters.
 * 
 * It combines the verdicts of all filters to apply a single, comprehensive UI action.
 */
export class CardPipeline extends window.YPP.features.BaseFeature {
    static featureId = 'cardPipeline';
    static executionPhase = 'idle';
    static priority = 1; // Runs first

    static CARD_SELECTORS = [
        'ytd-rich-item-renderer',
        'ytd-video-renderer',
        'ytd-grid-video-renderer',
        'ytd-compact-video-renderer',
        'ytd-reel-item-renderer',
        'yt-lockup-view-model',
        'ytd-lockup-view-model',
        'ytm-video-with-context-renderer',
        'ytm-compact-video-renderer',
        'ytm-rich-item-renderer',
        'ytd-post-renderer',
        'ytd-backstage-post-thread-renderer',
        'ytd-shared-post-renderer',
        'ytd-playlist-renderer',
        'ytd-compact-playlist-renderer',
        'ytd-radio-renderer',
        'ytd-compact-radio-renderer'
    ].join(',');

    constructor() {
        super('CardPipeline');
        this._filters = [];
        this._boundProcessMutations = this._processMutations.bind(this);
    }

    getConfigKey() { return null; } // Always runs

    async enable() {
        await super.enable();
        this.isEnabled = true;

        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'v3-card-pipeline',
                CardPipeline.CARD_SELECTORS,
                this._boundProcessMutations,
                true,
                true
            );
        }

        // Catch newly loaded progress bars specifically (all 3 renderer eras)
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'v3-pipeline-progress',
                [
                    'ytd-thumbnail-overlay-resume-playback-renderer #progress',
                    '#progress.ytd-thumbnail-overlay-resume-playback-renderer',
                    '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment',
                    'yt-progress-bar-view-model',
                    '.yt-progress-bar-view-model-progress',
                    // ytw-* era: newer YouTube rollout (per-account, never gate behind pathname)
                    '.ytwThumbnailOverlayResumePlaybackRendererThumbnailOverlayResumePlaybackProgress'
                ].join(', '),
                (nodes) => {
                    if (!this.isEnabled) return;
                    nodes.forEach(bar => {
                        const card = bar.closest(CardPipeline.CARD_SELECTORS);
                        if (card) this.evaluateCard(card, true);
                    });
                },
                false,
                false
            );
        }
    }

    async disable() {
        await super.disable();
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('v3-card-pipeline');
            window.YPP.sharedObserver.unregister('v3-pipeline-progress');
        }
        this.isEnabled = false;
    }

    /**
     * Called by individual filters to register themselves into the pipeline.
     */
    registerFilter(filterInstance) {
        if (!this._filters.includes(filterInstance)) {
            this._filters.push(filterInstance);
            // Sort by priority (higher priority runs first)
            this._filters.sort((a, b) => (b.constructor.priority || 10) - (a.constructor.priority || 10));
        }
    }

    /**
     * Called by individual filters to unregister themselves from the pipeline.
     */
    unregisterFilter(filterInstance) {
        this._filters = this._filters.filter(f => f !== filterInstance);
    }

    /**
     * Called by filters when settings change to force a global re-evaluation
     */
    triggerGlobalReevaluation() {
        if (!this.isEnabled) return;
        document.querySelectorAll(CardPipeline.CARD_SELECTORS).forEach(card => {
            card.removeAttribute('data-ypp-v3-processed');
            this.evaluateCard(card);
        });
    }

    _processMutations(nodes) {
        if (!this.isEnabled) return;
        nodes.forEach(card => this.evaluateCard(card));
    }

    _getOutermostCard(card) {
        let match = card;
        let el = card.parentElement;
        while (el && el !== document.body) {
            if (el.matches && el.matches(CardPipeline.CARD_SELECTORS)) match = el;
            el = el.parentElement;
        }
        return match;
    }

    evaluateCard(card, forceReevaluate = false) {
        if (!card || !card.isConnected) return;
        if (card.hasAttribute('hidden') || card.style.display === 'none') return;
        
        const target = this._getOutermostCard(card);
        if (!target) return;

        // 0. Quick ID extraction to detect Polymer DOM recycling
        let currentVideoId = null;
        const attrId = target.dataset.videoId || target.dataset.ytVideoId || target.getAttribute('video-id');
        const thumb = target.querySelector('ytd-thumbnail[video-id]');
        const lockup = target.matches('yt-lockup-view-model, ytd-lockup-view-model') ? target : target.querySelector('yt-lockup-view-model, ytd-lockup-view-model');
        
        if (attrId) currentVideoId = attrId;
        else if (thumb) currentVideoId = thumb.getAttribute('video-id');
        else if (lockup) currentVideoId = lockup.getAttribute('video-id');
        else {
            const anchor = target.querySelector('a#thumbnail') || target.querySelector('a[href^="/watch"], a[href^="/shorts"]');
            if (anchor) {
                const href = anchor.getAttribute('href') || '';
                const m = href.match(/[?&]v=([^&]+)/);
                if (m) currentVideoId = m[1];
                else {
                    const s = href.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
                    if (s) currentVideoId = s[1];
                }
            }
        }

        const isRecycled = currentVideoId && target.dataset.yppV3ProcessedId && target.dataset.yppV3ProcessedId !== currentVideoId;

        if (isRecycled) {
            // Node was recycled for a new video. Clean up old state!
            target.removeAttribute('data-ypp-v3-processed');
            target.removeAttribute('data-ypp-v3-processed-id');
            target.removeAttribute('data-ypp-hidden-by');
            target.removeAttribute('data-ypp-hidden-reason');
            target.removeAttribute('data-ypp-dim-by');
            target.removeAttribute('data-ypp-dim-reason');
            target.removeAttribute('data-ypp-dimmed');
            target.removeAttribute('data-ypp-hidden');
            target.classList.remove('ypp-hidden', 'ypp-hidden-by-pipeline', 'ypp-dim-badge');
            target.style.removeProperty('display');
        }

        if (!forceReevaluate && target.hasAttribute('data-ypp-v3-processed')) {
            // Self-Healing: Re-apply visual states if YouTube's virtual DOM wiped the class/style
            if (target.dataset.yppHiddenBy === 'CardPipeline' || target.dataset.yppHidden) {
                if (target.style.display !== 'none' || !target.classList.contains('ypp-hidden')) {
                    target.classList.add('ypp-hidden', 'ypp-hidden-by-pipeline');
                    target.dataset.yppHidden = '1';
                    target.style.display = 'none';
                }
            } else if (target.dataset.yppDimBy === 'CardPipeline') {
                if (!target.classList.contains('ypp-dim-badge')) {
                    target.classList.add('ypp-dim-badge');
                }
                // Ensure opacity is applied since we rely on class mostly, but just in case
            }
            return;
        }

        // 1. Extract unified metadata
        const context = this._extractContext(target);

        // Whitelist short-circuit is now handled centrally in FilterPrimitives.applyFilter()

        // 2. Pass through all enabled filters
        const verdicts = [];
        for (const filter of this._filters) {
            if (filter.isEnabled && filter._shouldRunOnCurrentPage && filter._shouldRunOnCurrentPage()) {
                try {
                    const result = filter.evaluate(context);
                    if (result) verdicts.push(result); // { action: 'hide' | 'dim', reason: '...' }
                } catch (e) {
                    this.utils?.log(`Error in filter ${filter.name}: ${e.message}`, 'PIPELINE', 'error');
                }
            }
        }

        if (context.fullyParsed !== false) {
            target.setAttribute('data-ypp-v3-processed', '1');
            if (context.videoId) target.dataset.yppV3ProcessedId = context.videoId;
        }

        // 3. Resolve verdicts
        this._applyVerdicts(target, verdicts, context);
    }

    // _isChannelWhitelisted and _isChannelBlacklisted are now handled by FilterPrimitives

    _extractContext(card) {
        const parsers = window.YPP.Utils?.youtubeParsers;
        const ctx = {
            card: card,
            isPost: card.tagName.toLowerCase().includes('post-renderer') || card.tagName.toLowerCase().includes('post-thread'),
            isShort: !!(card.querySelector('ytd-reel-item-renderer') || card.classList.contains('ypp-is-short')),
            isMix: !!(card.querySelector('[class*="content-id-RD"], a[href*="start_radio"], a[href*="list=RD"], a[href*="list=AL"], [overlay-style="MIX"]') || card.tagName.toLowerCase().includes('radio-renderer') || card.classList.contains('ypp-is-mix') || (card.querySelector('#video-title, #video-title-link') && /^Mix\s*[-–—]/i.test(card.querySelector('#video-title, #video-title-link').textContent.trim())) || Array.from(card.querySelectorAll('ytd-thumbnail-overlay-bottom-panel-renderer, badge-shape, ytd-badge-supported-renderer, .badge, .yt-badge')).some(el => el.textContent.trim().toLowerCase() === 'mix')),
            isPlaylist: !!(card.querySelector('[class*="content-id-PL"], a[href*="list=PL"], [overlay-style="PLAYLIST"]') || card.tagName.toLowerCase().includes('playlist-renderer') || card.classList.contains('ypp-is-playlist')),
            isLive: !!card.querySelector('.badge-style-type-live-now, ytd-badge-supported-renderer[is-live], badge-shape.yt-badge-shape--thumbnail-live, badge-shape.yt-badge-shape--live, badge-shape.ytBadgeShapeThumbnailLive, badge-shape.ytBadgeShapeLive, ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"]'),
            isUpcoming: !!card.querySelector('[overlay-style="UPCOMING"], .badge-style-type-simple[aria-label*="Premiere"]'),
            isMembersOnly: !!card.querySelector('.badge-style-type-members-only, [aria-label*="Members only"], ytd-badge-supported-renderer[class*="members"]'),
            
            // Textual data
            title: '',
            views: undefined,
            ageDays: undefined,
            durationSeconds: undefined,
            channelPath: null,
            channelPaths: [], // For collabs
            videoId: null,
            progressPercent: null,
            fullyParsed: true // True if we successfully found expected metadata
        };

        if (ctx.isPost) return ctx;

        // Title
        const titleEl = card.querySelector('#video-title, #video-title-link');
        if (titleEl) ctx.title = titleEl.textContent.trim();

        if (parsers) {
            // Video ID
            const attrId = card.dataset.videoId || card.dataset.ytVideoId || card.getAttribute('video-id');
            const thumb = card.querySelector('ytd-thumbnail[video-id]');
            const lockupSel = 'yt-lockup-view-model, ytd-lockup-view-model';
            const lockup = card.matches(lockupSel) ? card : card.querySelector(lockupSel);
            
            if (attrId) ctx.videoId = attrId;
            else if (thumb) ctx.videoId = thumb.getAttribute('video-id');
            else if (lockup) ctx.videoId = lockup.getAttribute('video-id');
            else {
                const anchor = card.querySelector('a#thumbnail') || card.querySelector('a[href^="/watch"], a[href^="/shorts"]');
                if (anchor) {
                    const href = anchor.getAttribute('href') || '';
                    const m = href.match(/[?&]v=([^&]+)/);
                    if (m) ctx.videoId = m[1];
                    else {
                        const s = href.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
                        if (s) ctx.videoId = s[1];
                    }
                }
            }

            // Channel
            const channelResult = parsers.extractChannelFromContainer(card);
            if (channelResult) {
                if (Array.isArray(channelResult)) {
                    ctx.channelPaths = channelResult;
                    ctx.channelPath = channelResult[0];
                } else {
                    ctx.channelPath = channelResult;
                    ctx.channelPaths = [channelResult];
                }
            }

            // Views & Age
            const spans = card.querySelectorAll('span');
            
            // Views
            let viewsResult = parsers.resolveViewsFromSpans(spans);
            if (viewsResult && viewsResult.views !== undefined) {
                ctx.views = viewsResult.views;
            } else if (titleEl && titleEl.getAttribute('aria-label')) {
                const fallbackResult = parsers.extractViewCount(titleEl.getAttribute('aria-label'));
                if (fallbackResult && typeof fallbackResult === 'object' && fallbackResult.views !== undefined) {
                    ctx.views = fallbackResult.views;
                } else if (!isNaN(fallbackResult)) {
                    ctx.views = fallbackResult;
                }
            }
            
            if (ctx.views === undefined && !ctx.isLive && !ctx.isUpcoming) {
                ctx.fullyParsed = false; // Missing views on a regular video means it hasn't loaded
            }

            // Age
            let ageResult = parsers.resolveUploadAgeFromSpans(spans);
            if (ageResult && ageResult.ageDays !== undefined) {
                ctx.ageDays = ageResult.ageDays;
            } else if (titleEl && titleEl.getAttribute('aria-label')) {
                const fallbackAge = parsers.extractUploadAgeDays(titleEl.getAttribute('aria-label'));
                if (!isNaN(fallbackAge) && fallbackAge >= 0) {
                    ctx.ageDays = fallbackAge;
                }
            }
            else if (!ctx.isLive && !ctx.isUpcoming) ctx.fullyParsed = false; // Missing age
            
            // Duration
            const timeSpan = parsers._findTimeSpan(card);
            if (timeSpan) ctx.durationSeconds = parsers.parseDuration(timeSpan.textContent);
        }

        // Progress bar - handle all 3 renderer eras:
        // Legacy: ytd-thumbnail-overlay-resume-playback-renderer #progress
        // New: .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment / yt-progress-bar-view-model
        // ytw-* era: .ytwThumbnailOverlayResumePlaybackRendererThumbnailOverlayResumePlaybackProgress
        const progressBar = card.querySelector([
            '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment',
            '.yt-progress-bar-view-model-progress',
            'ytd-thumbnail-overlay-resume-playback-renderer #progress',
            'ytd-thumbnail-overlay-resume-playback-renderer [id="progress"]',
            '.thumbnail-overlay-resume-playback-progress',
            'yt-progress-bar-view-model',
            // ytw-* overlay era
            '.ytwThumbnailOverlayResumePlaybackRendererThumbnailOverlayResumePlaybackProgress'
        ].join(', '));
        if (progressBar) {
            const widthStr = progressBar.style.width;
            if (widthStr && widthStr.includes('%')) {
                ctx.progressPercent = parseFloat(widthStr);
            } else if (progressBar.getAttribute('aria-valuenow')) {
                ctx.progressPercent = parseFloat(progressBar.getAttribute('aria-valuenow'));
            } else {
                // Fallback: Rendered box geometry vs parent width (catches CSS variable / class styling)
                try {
                    const rect = progressBar.getBoundingClientRect();
                    const parent = progressBar.parentElement;
                    if (rect.width > 0 && parent && parent.clientWidth > 0) {
                        const pct = Math.round((rect.width / parent.clientWidth) * 100);
                        if (pct > 0 && pct <= 100) ctx.progressPercent = pct;
                    }
                } catch (e) {}
            }
        }

        // Currently Playing
        ctx.isCurrentlyPlaying = !!card.querySelector('ytd-thumbnail-overlay-now-playing-renderer[now-playing-badge], .ytd-thumbnail-overlay-now-playing-renderer[now-playing]');

        return ctx;
    }

    _applyVerdicts(target, verdicts, context) {
        if (verdicts.length === 0) {
            // Unhide/Undim
            if (window.YPP.utils?.filterPrimitives) {
                window.YPP.utils.filterPrimitives._clearState(target);
            } else {
                this._unhideElement(target);
            }
            return;
        }

        // If any verdict is 'hide', we hard hide. Otherwise, we dim.
        const shouldHide = verdicts.some(v => v.action === 'hide');
        const reasons = verdicts.map(v => v.reason).filter(r => r).join(', ');

        if (window.YPP.utils?.filterPrimitives) {
            window.YPP.utils.filterPrimitives.applyFilter(target, shouldHide ? 'hide' : 'dim', reasons, context.channelPath);
        }
    }

    _unhideElement(el) {
        el.classList.remove('ypp-hidden', 'ypp-hidden-by-pipeline');
        delete el.dataset.yppHiddenReason;
        delete el.dataset.yppHiddenBy;
        el.style.removeProperty('display');
        
        if (el.dataset.yppDimmed) {
            this._clearDimmedElement(el);
        }
    }

    _clearDimmedElement(element) {
        if (!element || !element.dataset.yppDimmed) return;
        delete element.dataset.yppDimmed;
        
        if (window.YPP.utils?.filterUI?.removeBadgeAnimated) {
            element.querySelectorAll('.ypp-dim-badge').forEach(window.YPP.utils.filterUI.removeBadgeAnimated);
        } else {
            element.querySelectorAll('.ypp-dim-badge').forEach(b => b.remove());
        }
        element.querySelectorAll('[data-ypp-badge-target]').forEach(t => delete t.dataset.yppBadgeTarget);
    }
}
window.YPP.features.CardPipeline = CardPipeline;
