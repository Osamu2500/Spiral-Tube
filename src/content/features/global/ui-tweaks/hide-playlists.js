export class HidePlaylists extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hidePlaylists';
    static executionPhase = 'idle';
    static priority = 100;

    constructor() {
        super('HidePlaylists');
        this._boundProcess = this._processNodes.bind(this);
    }

    get isEnabled() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index') {
            return !!this.settings.hidePlaylists;
        }
        if (path === '/results') {
            return !!this.settings.hideSearchPlaylists;
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
            if (node.hasAttribute('data-ypp-playlist-processed')) return;
            node.setAttribute('data-ypp-playlist-processed', 'true');
            
            let isPlaylist = false;
            
            if (node.tagName.toLowerCase() === 'ytd-playlist-renderer') {
                isPlaylist = true;
            } else if (node.querySelector('a[href^="/playlist?"]')) {
                isPlaylist = true;
            } else if (node.querySelector('ytd-thumbnail-overlay-bottom-panel-renderer yt-icon[icon="yt-icons:playlist"]')) {
                isPlaylist = true;
            }

            if (isPlaylist) {
                const target = window.YPP.Utils.findOutermostMatch(node, window.YPP.Utils.getVideoContainerSelectors()) || node;
                this._hideElement(target, 'playlist');
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

window.YPP.features.HidePlaylists = HidePlaylists;
