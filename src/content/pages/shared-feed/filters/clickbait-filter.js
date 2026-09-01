import './base-filter-feature.js';
/**
 * Clickbait Filter Module (V3 Architecture)
 * Detects and hides videos with clickbait characteristics, such as ALL CAPS titles.
 */

export class ClickbaitFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'clickbaitFilter';
    static executionPhase = 'idle';
    static priority = 90;

    constructor() {
        super('ClickbaitFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'hideClickbaitEnabled'; }

    _shouldRunOnCurrentPage() {
        return true; // Apply globally wherever pipeline runs
    }

    async enable() {
        await super.enable();
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.registerFilter(this);
        }
    }

    async disable() {
        await super.disable();
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    async run(settings, oldSettings) {
        if (this.isEnabled && window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    evaluate(context) {
        if (!this.settings?.hideClickbaitEnabled) return null;
        if (!context.title) return null;
        if (context.isPost) return null;

        const title = context.title;

        // Check for ALL CAPS (more than 80% caps, excluding spaces and symbols)
        if (this.settings?.hideClickbaitAllCaps) {
            const text = title.replace(/[^a-zA-Z]/g, '');
            if (text.length > 5) {
                let upperCount = 0;
                for (let i = 0; i < text.length; i++) {
                    if (text[i] === text[i].toUpperCase()) {
                        upperCount++;
                    }
                }
                const ratio = upperCount / text.length;
                if (ratio >= 0.8) {
                    return { action: 'hide', reason: 'ALL CAPS title' };
                }
            }
        }
        
        // Check for excessive emojis
        if (this.settings?.hideClickbaitEmojis !== false) {
            // Match most emojis (approximate ranges)
            const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu;
            const matches = title.match(emojiRegex);
            if (matches && matches.length >= 4) {
                return { action: 'hide', reason: 'Excessive emojis' };
            }
        }
        
        // Check for excessive punctuation
        if (this.settings?.hideClickbaitPunctuation !== false) {
            if (/[!?]{3,}/.test(title)) {
                return { action: 'hide', reason: 'Excessive punctuation' };
            }
        }

        return null;
    }
}

window.YPP.features.ClickbaitFilter = ClickbaitFilter;
