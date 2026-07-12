export class HideChannelCards extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hideChannelCards';
    static executionPhase = 'idle';
    static priority = 103;

    constructor() {
        super('HideChannelCards');
        this._allowedPages = ['/results'];
        this._boundProcess = this._processNodes.bind(this);
    }

    getConfigKey() {
        return 'hideChannelCards';
    }

    async enable() {
        await super.enable();
    }

    _processNodes(nodes) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        
        nodes.forEach(node => {
            if (node.hasAttribute('data-ypp-channel-processed')) return;
            node.setAttribute('data-ypp-channel-processed', 'true');
            
            let isChannel = false;
            if (node.tagName.toLowerCase() === 'ytd-channel-renderer') {
                isChannel = true;
            }

            if (isChannel) {
                const target = window.YPP.Utils.findOutermostMatch(node, ['ytd-item-section-renderer', ...window.YPP.Utils.getVideoContainerSelectors()]) || node;
                this._hideElement(target, 'channel');
                target.style.setProperty('display', 'none', 'important');
            }
        });
    }

    _scheduleProcess() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        const nodes = document.querySelectorAll('ytd-channel-renderer');
        if (nodes.length > 0) {
            this._processNodes(Array.from(nodes));
        }
    }
}

window.YPP.features.HideChannelCards = HideChannelCards;
