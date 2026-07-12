export class HidePodcasts extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hidePodcasts';
    static executionPhase = 'idle';
    static priority = 101;

    constructor() {
        super('HidePodcasts');
        this._boundProcess = this._processNodes.bind(this);
    }

    get isEnabled() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index') {
            return !!this.settings.hidePodcasts;
        }
        if (path === '/results') {
            return !!this.settings.hideSearchPodcasts;
        }
        return false;
    }

    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        return (path === '/' || path === '/index' || path === '/results');
    }

    async enable() {
        await super.enable();
    }

    _processNodes(nodes) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        
        nodes.forEach(node => {
            if (node.hasAttribute('data-ypp-podcast-processed')) return;
            node.setAttribute('data-ypp-podcast-processed', 'true');
            
            let isPodcast = false;
            
            if (node.querySelector('a[href^="/podcast?"]')) {
                isPodcast = true;
            } else {
                const badges = node.querySelectorAll('ytd-badge-supported-renderer, .badge-shape-wiz__text');
                for (let i = 0; i < badges.length; i++) {
                    const text = (badges[i].getAttribute('aria-label') || badges[i].textContent).trim().toLowerCase();
                    if (text === 'podcast' || text === 'podcasts') {
                        isPodcast = true;
                        break;
                    }
                }
            }

            if (isPodcast) {
                const target = window.YPP.Utils.findOutermostMatch(node, window.YPP.Utils.getVideoContainerSelectors()) || node;
                this._hideElement(target, 'podcast');
                target.style.setProperty('display', 'none', 'important');
            }
        });
    }

    _scheduleProcess() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        const nodes = document.querySelectorAll('ytd-rich-shelf-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-playlist-renderer, yt-lockup-view-model, ytd-lockup-view-model');
        if (nodes.length > 0) {
            this._processNodes(Array.from(nodes));
        }
    }
}

window.YPP.features.HidePodcasts = HidePodcasts;
