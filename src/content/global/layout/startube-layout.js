/**
 * StarTube Layout & 5-Star Rating Visualizer (Based on Script 485622 by lightbeam24)
 * Brings classic YouTube V3 watch page row aesthetics and interactive 5-star rating bar.
 */

export class StarTubeLayout extends window.YPP.features.BaseFeature {
    static featureId = 'starTubeLayout';
    static executionPhase = 'idle';
    static priority = 35;

    constructor() {
        super('StarTubeLayout');
        this.name = 'StarTubeLayout';
        this._starBar = null;
        this._selectedStar = 5;
    }

    getConfigKey() {
        return 'enableStarTubeLayout';
    }

    async enable() {
        await super.enable();
        document.body.classList.add('ypp-startube-layout');
        this._injectStarRatingBar();
        this.utils?.log?.('StarTube Layout & 5-Star Bar enabled (Script 485622)', 'STARTUBE');
    }

    async disable() {
        await super.disable();
        document.body.classList.remove('ypp-startube-layout');
        if (this._starBar && this._starBar.parentNode) {
            this._starBar.remove();
        }
        this._starBar = null;
        this.utils?.log?.('StarTube Layout disabled', 'STARTUBE');
    }

    _injectStarRatingBar() {
        const titleRow = document.querySelector('#above-the-fold #title, ytd-watch-metadata #title');
        if (!titleRow || titleRow.querySelector('.st-star-ratings')) return;

        const container = document.createElement('div');
        container.className = 'st-star-ratings';
        container.innerHTML = `
            <span class="st-ratings-before-text" style="font-size: 13px; font-weight: bold; color: var(--yt-spec-text-secondary, #666);">Rate:</span>
            <div class="st-stars" style="display: flex; gap: 4px;">
                ${[1, 2, 3, 4, 5].map(i => `
                    <button class="st-star" data-star="${i}" title="Rate ${i} star${i > 1 ? 's' : ''}" style="background: none; border: none; cursor: pointer; font-size: 20px; color: ${i <= this._selectedStar ? '#f5c518' : '#ccc'}; transition: transform 0.15s ease;">
                        ★
                    </button>
                `).join('')}
            </div>
            <span class="st-rating-label" style="font-size: 12px; color: var(--yt-spec-text-secondary, #888); margin-left: 6px;">
                (Classic V3 Star Rating)
            </span>
        `;

        container.querySelectorAll('.st-star').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = parseInt(btn.dataset.star, 10);
                this._selectedStar = val;
                container.querySelectorAll('.st-star').forEach(b => {
                    const idx = parseInt(b.dataset.star, 10);
                    b.style.color = idx <= val ? '#f5c518' : '#ccc';
                });
            });
            btn.addEventListener('mouseenter', () => {
                const val = parseInt(btn.dataset.star, 10);
                container.querySelectorAll('.st-star').forEach(b => {
                    const idx = parseInt(b.dataset.star, 10);
                    b.style.color = idx <= val ? '#f5c518' : '#ccc';
                });
            });
        });

        titleRow.appendChild(container);
        this._starBar = container;
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.StarTubeLayout = StarTubeLayout;
