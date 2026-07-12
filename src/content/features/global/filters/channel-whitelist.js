export class ChannelWhitelist extends window.YPP.features.BaseFilterFeature {
    static featureId = 'channelWhitelist';
    static executionPhase = 'idle';
    static priority = 1; // High priority so it can protect elements from being hidden by other filters

    constructor() {
        super('ChannelWhitelist');
        this._boundProcess = this._processCards.bind(this);
        this._channels = new Set();
    }

    getConfigKey() { return 'channelWhitelistEnabled'; }

    async init(settings) {
        this._settings = settings;
        this._updateChannels(settings.channelWhitelist);
        if (settings.channelWhitelistEnabled) this.enable();
        else this.disable();
    }

    run(settings) {
        this._settings = settings;
        this._updateChannels(settings.channelWhitelist);
        if (settings.channelWhitelistEnabled) this.enable();
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
                'channel-whitelist',
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
            window.YPP.sharedObserver.unregister('channel-whitelist');
        }
        document.querySelectorAll('.ypp-whitelisted').forEach(el => {
            el.classList.remove('ypp-whitelisted');
        });
        document.querySelectorAll('[data-ypp-whitelist-processed]').forEach(el => {
            el.removeAttribute('data-ypp-whitelist-processed');
        });
    }

    _processCards(elements = null) {
        if (!this._isEnabled || !this._shouldRunOnCurrentPage() || this._channels.size === 0) return;
        const cardsToProcess = elements || document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-lockup-view-model');
        cardsToProcess.forEach(card => this._evaluateCard(card));
    }

    _evaluateCard(card) {
        if (card.hasAttribute('data-ypp-whitelist-processed')) return;
        
        const parsers = window.YPP.Utils.youtubeParsers;
        if (!parsers) return;

        const channelPath = parsers.extractChannelFromContainer(card);
        if (channelPath && this._channels.has(channelPath)) {
            card.setAttribute('data-ypp-whitelist-processed', 'true');
            // Add a class that protects the card from being hidden by other features
            card.classList.add('ypp-whitelisted');
            
            // If it was already hidden, unhide it
            if (card.classList.contains('ypp-hidden')) {
                card.classList.remove('ypp-hidden');
                card.classList.forEach(cls => {
                    if (cls.startsWith('ypp-hidden-by-')) {
                        card.classList.remove(cls);
                    }
                });
                card.style.removeProperty('display');
            }
            if (card.dataset.yppDimmed) {
                if (window.YPP.features.BaseFilterFeature) {
                    window.YPP.features.BaseFilterFeature.clearDimmedElement(card);
                }
            }
        } else if (channelPath) {
            card.setAttribute('data-ypp-whitelist-processed', 'true');
        }
    }
}
window.YPP.features.ChannelWhitelist = ChannelWhitelist;
