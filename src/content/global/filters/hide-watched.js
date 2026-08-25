import './base-filter-feature.js';
/**
 * HideWatched — v3 (Pipeline Architecture)
 * -----------------------------------------
 * Hides or dims video cards that have been watched using a layered detection strategy.
 * This version uses the centralized CardPipeline instead of manipulating CSS directly.
 */
export class HideWatched extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hideWatched';
    static executionPhase = 'idle';
    static priority = 9;

    constructor() {
        super('HideWatched');
    }

    getConfigKey() { return 'hideWatched'; }

    /** Per-page toggle check */
    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        const s = this.settings || {};

        if (path === '/' || path === '/index') return s.hideWatchedHome !== false;

        if (path.startsWith('/@') || path.startsWith('/channel/') ||
            path.startsWith('/user/') || path.startsWith('/c/')) {
            return s.hideWatchedChannel !== false;
        }

        if (path.startsWith('/feed/subscriptions')) return s.hideWatchedSubs !== false;
        if (path.startsWith('/results'))            return s.hideWatchedSearch !== false;
        if (path.startsWith('/watch'))              return s.hideWatchedRelated !== false;

        return false;
    }

    async enable() {
        await super.enable();
        
        // WatchedStore: instant mark/unmark on manual actions
        this._unsubscribeStore = window.YPP.WatchedStore?.onChange?.((change) => {
            if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
            if (window.YPP.FeatureManager) {
                const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
                if (pipeline) pipeline.triggerGlobalReevaluation();
            }
        });

        // React to user manually marking from the MarkWatched feature
        this.onBusEvent('watched:updated', () => {
            if (this._shouldRunOnCurrentPage() && window.YPP.FeatureManager) {
                const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
                if (pipeline) pipeline.triggerGlobalReevaluation();
            }
        });

        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.registerFilter(this);
        }
    }

    async disable() {
        await super.disable();

        if (this._unsubscribeStore) {
            this._unsubscribeStore();
            this._unsubscribeStore = null;
        }

        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    async onUpdate(newSettings, oldSettings) {
        if (this.isEnabled && window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    /**
     * Pipeline evaluation method
     */
    evaluate(context) {
        if (!this.settings) return null;
        if (!this._shouldRunOnCurrentPage()) return null;
        if (context.isCurrentlyPlaying) return null;

        const watchedIds = window.YPP.WatchedStore?.getAll() ?? new Set();
        const threshold = this.settings.hideWatchedThreshold ?? 80;
        let isWatched = false;

        // 1. Manual mark list
        if (context.videoId && watchedIds.has(context.videoId)) {
            isWatched = true;
        }

        // 2. Native progress bar
        if (!isWatched && context.progressPercent !== null && context.progressPercent !== undefined) {
            if (context.progressPercent >= threshold) {
                isWatched = true;
            }
        }

        // 3. "WATCHED" Badge
        if (!isWatched && context.card) {
            const badges = context.card.querySelectorAll(
                'ytd-badge-supported-renderer, ' +
                'ytd-thumbnail-overlay-bottom-panel-renderer, ' +
                'ytd-thumbnail-overlay-playback-status-renderer'
            );
            for (const badge of badges) {
                if (window.getComputedStyle(badge).display === 'none') continue;
                const text = badge.textContent.trim().toUpperCase();
                if (text === 'WATCHED' || text === 'VIEWED' || text === 'PLAYED') {
                    isWatched = true;
                    break;
                }
            }
        }

        if (isWatched) {
            const mode = this.settings.hideWatchedMode || 'dim';
            // hideWatchedMode can be 'hide', 'dim', or 'delete'.
            // For CardPipeline, both 'hide' and 'delete' should return action: 'hide'.
            // Actually, if we want to actually delete it, we could let CardPipeline handle it later,
            // but for now, 'hide' is fully supported and removes the visual glitch.
            if (mode === 'hide' || mode === 'delete') {
                return { action: 'hide', reason: 'Watched' };
            } else {
                return { action: 'dim', reason: 'Watched' };
            }
        }

        return null;
    }
}

window.YPP.features.HideWatched = HideWatched;
