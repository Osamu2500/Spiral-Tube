export class HideMusic extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hideSearchMusic';
    static executionPhase = 'idle';
    static priority = 104;

    constructor() {
        super('HideMusic');
        this._allowedPages = ['/results'];
        this._boundProcess = this._processNodes.bind(this);
    }

    getConfigKey() {
        return 'hideSearchMusic';
    }

    async enable() {
        await super.enable();
    }

    _processNodes(nodes) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        
        nodes.forEach(node => {
            if (node.hasAttribute('data-ypp-music-processed')) return;
            node.setAttribute('data-ypp-music-processed', 'true');
            
            let isMusic = false;
            
            const titleElements = node.querySelectorAll('#title, #video-title, h3');
            for (let el of titleElements) {
                const titleText = (el.textContent || '').trim().toLowerCase();
                if (titleText === 'songs' || titleText === 'albums' || titleText === 'artists' || titleText === 'official music videos' || titleText === 'music videos') {
                    isMusic = true;
                    break;
                }
            }

            if (!isMusic) {
                const badges = node.querySelectorAll('ytd-badge-supported-renderer, .badge-shape-wiz__text');
                for (let i = 0; i < badges.length; i++) {
                    const text = (badges[i].getAttribute('aria-label') || badges[i].textContent).trim().toLowerCase();
                    if (text.includes('official artist') || text === 'music') {
                        isMusic = true;
                        break;
                    }
                }
            }

            if (isMusic) {
                const target = window.YPP.Utils.findOutermostMatch(node, ['ytd-item-section-renderer', 'ytd-shelf-renderer', ...window.YPP.Utils.getVideoContainerSelectors()]) || node;
                this._hideElement(target, 'music');
                target.style.setProperty('display', 'none', 'important');
            }
        });
    }

    _scheduleProcess() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        const nodes = document.querySelectorAll('ytd-shelf-renderer, ytd-item-section-renderer, ytd-video-renderer');
        if (nodes.length > 0) {
            this._processNodes(Array.from(nodes));
        }
    }
}

window.YPP.features.HideMusic = HideMusic;
