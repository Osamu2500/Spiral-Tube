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
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'viewsFilterEnabled'; }

    async run(settings, oldSettings) {
        // Trigger global re-evaluation when settings change
        if (this._isEnabled && window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    async enable() {
        await super.enable();
        if (this._isEnabled) return;
        this._isEnabled = true;
        
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.registerFilter(this);
        }
    }

    async disable() {
        await super.disable();
        this._isEnabled = false;
        
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    evaluate(context) {
        // Return null if fullyParsed is false so the pipeline won't stamp it yet
        // Wait, CardPipeline handles fullyParsed... Actually CardPipeline doesn't abort on fullyParsed = false,
        // it just passes the context to filters. If the filter needs something missing, it should just not hide.
        // Wait! We NEED to ensure it doesn't get stamped if missing.
        
        if (context.isShort || context.isMix) return null;

        let shouldHide = false;
        let hideReason = '';

        if (this.settings?.viewsFilterEnabled) {
            const minViews = parseInt(this.settings.viewsHideThreshold, 10) || 0;
            if (context.views !== undefined) {
                if (context.views < minViews && !context.isLive) {
                    shouldHide = true;
                    hideReason = 'Views too low';
                }
            } else if (!context.isLive && !context.isUpcoming) {
                // If views are enabled but not found yet, and we aren't live/upcoming, we aren't fully parsed!
                // We should throw an error to prevent pipeline from stamping?
                // Actually we can just tell the pipeline it's not fully parsed.
                context.fullyParsed = false;
            }
        }

        if (!shouldHide && this.settings?.dateFilterEnabled) {
            const maxDaysOlder = parseInt(this.settings.dateFilterOlderThreshold, 10) || 0;
            const maxDaysNewer = parseInt(this.settings.dateFilterNewerThreshold, 10) || 0;
            
            if (context.ageDays !== undefined) {
                if (maxDaysNewer > 0 && context.ageDays < maxDaysNewer) {
                    shouldHide = true;
                    hideReason = 'Video too new';
                } else if (maxDaysOlder > 0 && context.ageDays > maxDaysOlder) {
                    shouldHide = true;
                    hideReason = 'Video too old';
                }
            } else if (!context.isLive && !context.isUpcoming) {
                context.fullyParsed = false;
            }
        }

        if (shouldHide) {
            return { action: 'hide', reason: hideReason };
        }
        return null;
    }
}

window.YPP.features.MetadataFilters = MetadataFilters;
