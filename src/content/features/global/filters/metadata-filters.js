/**
 * Metadata Filters
 * Hides videos based on Views and Upload Date (Age).
 */
export class MetadataFilters extends window.YPP.features.BaseFilterFeature {
    static featureId = 'metadataFilters';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('MetadataFilters');
        this._boundProcess = this._processCards.bind(this);
    }

    getConfigKey() { return 'metadataFilters'; } // Dummy key, always runs if sub-settings enabled

    async init(settings) {
        this._settings = settings;
        if (settings.viewsFilterEnabled || settings.dateFilterEnabled) {
            this.enable();
        } else {
            this.disable();
        }
    }

    /**
     * Per-page toggle respecting metadataFilter[Page] settings (Advanced Mode).
     * Falls back to true if the per-page key is not set.
     */
    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        const s = this._settings || {};

        if (path === '/' || path === '/index') return s.metaFilterHome !== false;
        if (path.startsWith('/feed/subscriptions')) return s.metaFilterSubs !== false;
        if (path.startsWith('/results')) return s.metaFilterSearch !== false;
        if (path.startsWith('/@') || path.startsWith('/channel/') ||
            path.startsWith('/user/') || path.startsWith('/c/')) return s.metaFilterChannel !== false;
        if (path.startsWith('/watch')) return s.metaFilterRelated !== false;
        return false;
    }

    run(settings) {
        this._settings = settings;
        if (settings.viewsFilterEnabled || settings.dateFilterEnabled) {
            this.enable();
        } else {
            this.disable();
        }
    }

    async enable() {
        await super.enable();
        if (this._isEnabled) return;
        this._isEnabled = true;
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'metadata-filters',
                'ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-lockup-view-model',
                this._boundProcess
            );
        }
        this._processCards();
    }

    async disable() {
        await super.disable();
        this._isEnabled = false;
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('metadata-filters');
        }
        
        this._unhideAll();
        
        document.querySelectorAll('[data-ypp-meta-processed]').forEach(el => {
            el.removeAttribute('data-ypp-meta-processed');
        });
    }

    _processCards(elements = null) {
        if (!this._isEnabled || !this._shouldRunOnCurrentPage()) return;

        const cardsToProcess = elements || document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-lockup-view-model');
        
        cardsToProcess.forEach(card => this._evaluateCard(card));
    }
    
    _isLiveVideo(element) {
        const LIVE_INDICATOR_SELECTORS =
            'badge-shape.yt-badge-shape--thumbnail-live, badge-shape.yt-badge-shape--live, ' +
            'badge-shape.ytBadgeShapeThumbnailLive, badge-shape.ytBadgeShapeLive, ' +
            '.yt-spec-avatar-shape--live-ring, .yt-spec-avatar-shape__live-badge, ' +
            '.ytSpecAvatarShapeLiveRing, .ytSpecAvatarShapeLiveBadge, ' +
            'ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"], ' +
            '.badge-style-type-live-now';
        return !!element.querySelector(LIVE_INDICATOR_SELECTORS);
    }

    _evaluateCard(card) {
        if (card.hasAttribute('hidden') || card.style.display === 'none') return;
        if (card.hasAttribute('data-ypp-meta-processed')) return;

        // Skip shorts and mixes
        if (card.querySelector('ytd-reel-item-renderer, ytd-radio-renderer')) return;
        if (card.classList.contains('ypp-is-mix') || card.classList.contains('ypp-is-short')) return;

        let shouldHide = false;
        let hideReason = '';
        
        const parsers = window.YPP.Utils?.youtubeParsers;
        if (!parsers) return;

        // 1. Views Filter
        if (this._settings.viewsFilterEnabled) {
            const minViews = parseInt(this._settings.viewsHideThreshold, 10) || 0;
            const viewsResult = parsers.resolveViewsFromSpans(card.querySelectorAll('span'));
            
            if (viewsResult && viewsResult.views !== undefined) {
                const viewsNumber = viewsResult.views;
                if (viewsNumber < minViews && !this._isLiveVideo(card)) {
                    shouldHide = true;
                    hideReason = 'Views too low';
                }
            }
        }

        // 2. Date Filter
        if (!shouldHide && this._settings.dateFilterEnabled) {
            const maxDaysOlder = parseInt(this._settings.dateFilterOlderThreshold, 10) || 0; // if > 0, hide older than this
            const maxDaysNewer = parseInt(this._settings.dateFilterNewerThreshold, 10) || 0; // if > 0, hide newer than this
            
            const ageResult = parsers.resolveUploadAgeFromSpans(card.querySelectorAll('span'));
            
            if (ageResult && ageResult.ageDays !== undefined) {
                const days = ageResult.ageDays;
                
                if (maxDaysNewer > 0 && days < maxDaysNewer) {
                    shouldHide = true;
                    hideReason = 'Video too new';
                } else if (maxDaysOlder > 0 && days > maxDaysOlder) {
                    shouldHide = true;
                    hideReason = 'Video too old';
                }
            }
        }

        card.setAttribute('data-ypp-meta-processed', 'true');

        if (shouldHide) {
            this._hideElement(card, hideReason);
        }
    }
}

window.YPP.features.MetadataFilters = MetadataFilters;
