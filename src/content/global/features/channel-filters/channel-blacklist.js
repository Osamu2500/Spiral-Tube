import '../../filters/base-filter-feature.js';
export class ChannelBlacklist extends window.YPP.features.BaseFilterFeature {
    static featureId = 'channelBlacklist';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('ChannelBlacklist');
        this._boundProcess = this._processCards.bind(this);
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
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'channel-blacklist',
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
            window.YPP.sharedObserver.unregister('channel-blacklist');
        }
        this._unhideAll();
        document.querySelectorAll('[data-ypp-blacklist-processed]').forEach(el => {
            el.removeAttribute('data-ypp-blacklist-processed');
        });
    }

    _processCards(elements = null) {
        if (!this._isEnabled || !this._shouldRunOnCurrentPage() || this._channels.size === 0) return;
        const cardsToProcess = elements || document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-lockup-view-model');
        cardsToProcess.forEach(card => this._evaluateCard(card));
    }

    _evaluateCard(card) {
        if (card.hasAttribute('hidden') || card.style.display === 'none') return;
        if (card.hasAttribute('data-ypp-blacklist-processed')) return;
        
        const parsers = window.YPP.Utils.youtubeParsers;
        if (!parsers) return;

        const channelResult = parsers.extractChannelFromContainer(card);
        if (!channelResult) return;
        
        const channels = Array.isArray(channelResult) ? channelResult : [channelResult];
        const isBlacklisted = channels.some(ch => this._channels.has(ch));

        if (isBlacklisted) {
            card.setAttribute('data-ypp-blacklist-processed', 'true');
            this._hideElement(card, 'blacklist');
        } else {
            card.setAttribute('data-ypp-blacklist-processed', 'true');
        }
    }
}
window.YPP.features.ChannelBlacklist = ChannelBlacklist;
