export class HidePromos extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hidePromoShelves';
    static executionPhase = 'idle';
    static priority = 100;

    constructor() {
        super('HidePromos');
        this._boundProcess = this._processNodes.bind(this);
        this._debounceTimer = null;
        this._boundSchedule = this._scheduleProcess.bind(this);
    }

    getConfigKey() {
        return 'hidePromoShelves';
    }

    async enable() {
        await super.enable();
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'hide-promos',
                'ytd-rich-shelf-renderer, ytd-rich-section-renderer',
                this._boundProcess
            );
        }
        this.addListener(window, 'yt-page-data-updated', this._boundSchedule);
        this._scheduleProcess();
    }

    async disable() {
        await super.disable();
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
            this._debounceTimer = null;
        }
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('hide-promos');
        }
        const hiddenPromos = document.querySelectorAll('[data-ypp-promo="true"]');
        hiddenPromos.forEach(el => this._unhideElement(el));
        document.querySelectorAll('[data-ypp-promo-processed]').forEach(el => {
            el.removeAttribute('data-ypp-promo-processed');
        });
    }

    _scheduleProcess() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this._debounceTimer = null;
            const nodes = document.querySelectorAll('ytd-rich-shelf-renderer, ytd-rich-section-renderer');
            if (nodes.length > 0) this._processNodes(Array.from(nodes));
        }, 150);
    }

    _processNodes(nodes) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        
        nodes.forEach(node => {
            if (node.hasAttribute('data-ypp-promo-processed')) return;
            node.setAttribute('data-ypp-promo-processed', 'true');
            
            // Shorts are handled by HideShorts. Let's ignore them here.
            if (node.hasAttribute('is-shorts') || node.querySelector('[is-shorts]')) return;
            
            this._hideElement(node);
        });
    }

    _hideElement(node) {
        if (!node) return;
        node.setAttribute('data-ypp-promo', 'true');
        node.classList.add('ypp-is-promo');
        node.style.setProperty('display', 'none', 'important');
    }

    _unhideElement(node) {
        if (!node) return;
        node.removeAttribute('data-ypp-promo');
        node.classList.remove('ypp-is-promo');
        node.style.removeProperty('display');
    }
};

window.YPP.features.HidePromos = HidePromos;
