/**
 * Clean Mix URLs
 * Intercepts clicks on Mix links (RD*) and strips the Mix playlist ID,
 * turning them into standard video links.
 */
export class CleanMixUrls extends window.YPP.features.BaseFeature {
    static featureId = 'cleanMixUrls';

    constructor() {
        super('CleanMixUrls');
        this.matchPatterns = [/.*/];
        this._mixClickHandler = this._mixClickHandler.bind(this);
    }

    getConfigKey() { return 'cleanMixUrls'; }

    onActivate() {
        document.addEventListener('click', this._mixClickHandler, true);
    }

    onDeactivate() {
        document.removeEventListener('click', this._mixClickHandler, true);
    }

    _mixClickHandler(e) {
        const a = e.target.closest('a[href]');
        if (a && a.href.includes('list=RD')) {
            try {
                const url = new URL(a.href, window.location.origin);
                const list = url.searchParams.get('list');
                if (list && list.startsWith('RD')) {
                    url.searchParams.delete('list');
                    url.searchParams.delete('start_radio');
                    a.href = url.pathname + url.search + url.hash;
                }
            } catch (err) {}
        }
    }
}

window.YPP.features.CleanMixUrls = CleanMixUrls;
