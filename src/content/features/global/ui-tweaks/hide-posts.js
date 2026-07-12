export class HidePosts extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hidePosts';
    static executionPhase = 'idle';
    static priority = 102;

    constructor() {
        super('HidePosts');
        this._boundProcess = this._processNodes.bind(this);
    }

    getConfigKey() {
        return 'hidePosts';
    }

    async enable() {
        await super.enable();
    }

    _processNodes(nodes) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        
        nodes.forEach(node => {
            if (node.hasAttribute('data-ypp-post-processed')) return;
            node.setAttribute('data-ypp-post-processed', 'true');
            
            let isPost = false;
            
            if (node.tagName.toLowerCase() === 'ytd-post-renderer' || node.tagName.toLowerCase() === 'ytd-shared-post-renderer') {
                isPost = true;
            } else if (node.querySelector('ytd-post-renderer, ytd-shared-post-renderer')) {
                isPost = true;
            }

            if (isPost) {
                const target = window.YPP.Utils.findOutermostMatch(node, window.YPP.Utils.getVideoContainerSelectors()) || node;
                this._hideElement(target, 'post');
                target.style.setProperty('display', 'none', 'important');
            }
        });
    }

    _scheduleProcess() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        const nodes = document.querySelectorAll('ytd-rich-shelf-renderer, ytd-rich-item-renderer, ytd-rich-section-renderer, ytd-post-renderer, ytd-shared-post-renderer');
        if (nodes.length > 0) {
            this._processNodes(Array.from(nodes));
        }
    }
}

window.YPP.features.HidePosts = HidePosts;
