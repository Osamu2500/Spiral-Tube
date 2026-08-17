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
        'ytd-shared-post-renderer'
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

        // Catch newly loaded progress bars specifically
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'v3-pipeline-progress',
                'ytd-thumbnail-overlay-resume-playback-renderer #progress, #progress.ytd-thumbnail-overlay-resume-playback-renderer, .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment, yt-progress-bar-view-model, .yt-progress-bar-view-model-progress',
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

        if (!forceReevaluate && target.hasAttribute('data-ypp-v3-processed')) return;

        // 1. Extract unified metadata
        const context = this._extractContext(target);

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
        }

        // 3. Resolve verdicts
        this._applyVerdicts(target, verdicts, context);
    }

    _extractContext(card) {
        const parsers = window.YPP.Utils?.youtubeParsers;
        const ctx = {
            card: card,
            isPost: card.tagName.toLowerCase().includes('post-renderer') || card.tagName.toLowerCase().includes('post-thread'),
            isShort: card.querySelector('ytd-reel-item-renderer') || card.classList.contains('ypp-is-short'),
            isMix: card.querySelector('[class*="content-id-RD"]') || card.querySelector('a[href*="start_radio=1"]') || card.tagName.toLowerCase().includes('radio-renderer') || card.classList.contains('ypp-is-mix'),
            isPlaylist: card.querySelector('[class*="content-id-PL"]') || card.tagName.toLowerCase().includes('playlist-renderer'),
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
            const viewsResult = parsers.resolveViewsFromSpans(spans);
            if (viewsResult && viewsResult.views !== undefined) ctx.views = viewsResult.views;
            else if (!ctx.isLive && !ctx.isUpcoming) ctx.fullyParsed = false; // Missing views on a regular video means it hasn't loaded

            const ageResult = parsers.resolveUploadAgeFromSpans(spans);
            if (ageResult && ageResult.ageDays !== undefined) ctx.ageDays = ageResult.ageDays;
            else if (!ctx.isLive && !ctx.isUpcoming) ctx.fullyParsed = false; // Missing age
            
            // Duration
            const timeSpan = parsers._findTimeSpan(card);
            if (timeSpan) ctx.durationSeconds = parsers.parseDuration(timeSpan.textContent);
        }

        // Progress
        const progressBar = card.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment, .yt-progress-bar-view-model-progress, ytd-thumbnail-overlay-resume-playback-renderer #progress, ytd-thumbnail-overlay-resume-playback-renderer [id="progress"], .thumbnail-overlay-resume-playback-progress, yt-progress-bar-view-model');
        if (progressBar) {
            const widthStr = progressBar.style.width;
            if (widthStr && widthStr.includes('%')) {
                ctx.progressPercent = parseFloat(widthStr);
            } else if (progressBar.getAttribute('aria-valuenow')) {
                ctx.progressPercent = parseFloat(progressBar.getAttribute('aria-valuenow'));
            }
        }

        // Currently Playing
        ctx.isCurrentlyPlaying = !!card.querySelector('ytd-thumbnail-overlay-now-playing-renderer[now-playing-badge], .ytd-thumbnail-overlay-now-playing-renderer[now-playing]');

        return ctx;
    }

    _applyVerdicts(target, verdicts, context) {
        if (verdicts.length === 0) {
            // Unhide/Undim
            this._unhideElement(target);
            return;
        }

        // If any verdict is 'hide', we hard hide. Otherwise, we dim.
        const shouldHide = verdicts.some(v => v.action === 'hide');
        const reasons = verdicts.map(v => v.reason).filter(r => r).join(', ');

        if (shouldHide) {
            // Hard hide
            if (target.dataset.yppDimmed) this._clearDimmedElement(target);
            target.classList.add('ypp-hidden', 'ypp-hidden-by-pipeline');
            target.dataset.yppHiddenReason = reasons;
            target.dataset.yppHiddenBy = 'CardPipeline';
            target.style.display = 'none'; // Ensure it's hidden
            
            try { window.YPP.FilterWarning?.record(1, 1); } catch (_) {}
        } else {
            // Dim
            target.classList.remove('ypp-hidden', 'ypp-hidden-by-pipeline');
            delete target.dataset.yppHiddenReason;
            delete target.dataset.yppHiddenBy;
            target.style.removeProperty('display');
            
            if (window.YPP.utils?.filterUI?.applyDimMode) {
                window.YPP.utils.filterUI.applyDimMode(target, reasons, context.channelPath);
            }
            try { window.YPP.FilterWarning?.record(1, 1); } catch (_) {}
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
