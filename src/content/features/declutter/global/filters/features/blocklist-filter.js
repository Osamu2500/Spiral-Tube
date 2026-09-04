import '../core/base-filter-feature.js';
/**
 * Blocklist Filter (V3 CardPipeline Architecture)
 * ------------------------------------------------
 * Hides or dims videos from blocked channels and keyword-matched titles.
 *
 * V4 upgrade: Migrated from independent sharedObserver loop to the CardPipeline
 * evaluate() pattern. Benefits:
 *  - Respects filterMode (dim vs hide) automatically via context
 *  - Self-healing via pipeline recycling detection
 *  - Blacklisted channel badges always evaluated first (priority = 1)
 *  - No risk of fighting with pipeline's own state tracking
 */
export class BlocklistFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'blocklistFilter';
    static executionPhase = 'idle';
    // Highest priority so blacklisted channel verdict always wins over other filters
    static priority = 1;

    constructor() {
        super('BlocklistFilter');
        this._blockedChannels = [];
        this._blockedKeywords = [];
        this._blockedKeywordRegexes = [];
    }

    getConfigKey() {
        return 'blockedChannels'; // fallback; enable() handles the actual logic
    }

    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        return (
            path === '/' ||
            path === '/index' ||
            path.startsWith('/feed/subscriptions') ||
            path.startsWith('/results') ||
            path.startsWith('/watch') ||
            path.startsWith('/@') ||
            path.startsWith('/channel/') ||
            path.startsWith('/user/') ||
            path.startsWith('/c/')
        );
    }

    _parseList(val) {
        if (Array.isArray(val)) return val.map(s => s.trim().toLowerCase()).filter(Boolean);
        if (!val || typeof val !== 'string') return [];
        return val.split(/[\n,]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
    }

    _buildKeywordRegexes(keywords) {
        return keywords.map(kw => {
            try {
                return new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            } catch (_) {
                return null;
            }
        }).filter(Boolean);
    }

    async enable() {
        if (!this.settings) return;

        this._blockedChannels = this._parseList(this.settings.blockedChannels);
        this._blockedKeywords = this._parseList(this.settings.blockedKeywords);
        this._blockedKeywordRegexes = this._buildKeywordRegexes(this._blockedKeywords);

        if (this._blockedChannels.length === 0 && this._blockedKeywords.length === 0) return;

        this.utils?.log(
            `Enabled with ${this._blockedChannels.length} channels, ${this._blockedKeywords.length} keywords blocked.`,
            'BLOCKLIST', 'debug'
        );

        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) {
                pipeline.registerFilter(this);
                pipeline.triggerGlobalReevaluation();
            }
        }
        
        // Secondary check for Shorts (not in CardPipeline's CARD_SELECTORS)
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'blocklist-shorts-scan',
                'ytm-shorts-lockup-view-model, ytd-reel-item-renderer',
                (nodes) => this._processShorts(nodes),
                false, false
            );
        }
    }

    async disable() {
        await super.disable();
        this._blockedChannels = [];
        this._blockedKeywords = [];
        this._blockedKeywordRegexes = [];

        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) {
                if (typeof pipeline.unregisterFilter === 'function') pipeline.unregisterFilter(this);
                pipeline.triggerGlobalReevaluation();
            }
        }

        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('blocklist-shorts-scan');
        }
    }

    _processShorts(nodes) {
        if (!this.isEnabled) return;
        const parsers = window.YPP.Utils?.youtubeParsers;
        if (!parsers) return;

        nodes.forEach(node => {
            const channel = parsers.extractChannelFromContainer(node);
            if (!channel) return;
            const channels = Array.isArray(channel) ? channel : [channel];
            const shouldHide = channels.some(cp => {
                const n = cp.toLowerCase();
                return this._blockedChannels.some(ch => n === ch || n === `/@${ch}` || n.endsWith(`/${ch}`));
            });
            if (shouldHide) {
                node.style.setProperty('display', 'none', 'important');
            }
        });
    }

    async run(settings, oldSettings) {
        // Rebuild lists when settings change
        this._blockedChannels = this._parseList(settings?.blockedChannels);
        this._blockedKeywords = this._parseList(settings?.blockedKeywords);
        this._blockedKeywordRegexes = this._buildKeywordRegexes(this._blockedKeywords);

        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    evaluate(context) {
        if (!this._shouldRunOnCurrentPage()) return null;
        if (this._blockedChannels.length === 0 && this._blockedKeywords.length === 0) return null;

        const filterMode = this.settings?.filterMode || 'hide';
        // Blacklisted content always uses hide mode — dim still shows the content
        const action = 'hide';

        // 1. Check channel (highest priority — checked first)
        if (context.channelPath && this._blockedChannels.length > 0) {
            const normalizedChannel = context.channelPath.toLowerCase();
            for (const ch of this._blockedChannels) {
                if (normalizedChannel === ch ||
                    normalizedChannel === `/@${ch}` ||
                    normalizedChannel.endsWith(`/${ch}`)) {
                    return { action, reason: 'Blacklisted channel' };
                }
            }
            // Also check array of channel paths (collab videos)
            if (Array.isArray(context.channelPaths)) {
                for (const cp of context.channelPaths) {
                    const n = cp.toLowerCase();
                    for (const ch of this._blockedChannels) {
                        if (n === ch || n === `/@${ch}` || n.endsWith(`/${ch}`)) {
                            return { action, reason: 'Blacklisted channel' };
                        }
                    }
                }
            }
        }

        // 2. Check title keywords
        if (context.title && this._blockedKeywordRegexes.length > 0) {
            const title = context.title.toLowerCase();
            for (const regex of this._blockedKeywordRegexes) {
                if (regex.test(title)) {
                    return { action, reason: 'Blocked keyword' };
                }
            }
        }

        return null;
    }
}

window.YPP.features.BlocklistFilter = BlocklistFilter;
