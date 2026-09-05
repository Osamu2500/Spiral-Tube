import '../../../../features/declutter/global/filters/core/base-filter-feature.js';
export class ChannelBlacklist extends window.YPP.features.BaseFilterFeature {
    static featureId = 'channelBlacklist';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('ChannelBlacklist');
        this._channels = new Set();
    }

    getConfigKey() { return 'channelBlacklistEnabled'; }

    async init(settings) {
        this._settings = settings;
        this._updateChannels(settings.channelBlacklist);
        if (settings.channelBlacklistEnabled) this.enable();
        else this.disable();
    }

    run(settings) {
        this._settings = settings;
        this._updateChannels(settings.channelBlacklist);
        if (settings.channelBlacklistEnabled) this.enable();
        else this.disable();
        
        if (this._isEnabled && window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }
    
    _updateChannels(text) {
        this._channels.clear();
        if (typeof text !== 'string') return;
        const list = text.split('\n').map(c => c.trim().toLowerCase()).filter(c => c);
        list.forEach(c => {
            if (c.startsWith('@')) this._channels.add('/' + c);
            else if (c.startsWith('youtube.com/')) this._channels.add('/' + c.split('youtube.com/')[1]);
            else this._channels.add('/@' + c);
        });
    }

    async enable() {
        await super.enable();
        if (this._isEnabled) return;
        this._isEnabled = true;
        
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) {
                pipeline.registerFilter(this);
                pipeline.triggerGlobalReevaluation();
            }
        }
    }

    async disable() {
        await super.disable();
        this._isEnabled = false;
        
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) {
                if (typeof pipeline.unregisterFilter === 'function') pipeline.unregisterFilter(this);
                pipeline.triggerGlobalReevaluation();
            }
        }
    }

    evaluate(context) {
        if (!this._shouldRunOnCurrentPage() || this._channels.size === 0) return null;
        
        const channels = context.channelPaths || [];
        const isBlacklisted = channels.some(ch => this._channels.has(ch));

        if (isBlacklisted) {
            return { action: 'hide', reason: 'blacklist' };
        }
        
        return null;
    }
}
window.YPP.features.ChannelBlacklist = ChannelBlacklist;
