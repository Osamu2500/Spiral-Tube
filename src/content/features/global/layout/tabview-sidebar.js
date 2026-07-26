/**
 * Tabview Sidebar Feature (Based on Script 560618: YouTube Improvements - Layout & Video Enhancer)
 * Converts watch page right sidebar into clean tabs: Related Videos, Comments, and Video Info.
 */

import './tabview-sidebar.css';

export class TabviewSidebar extends window.YPP.features.BaseFeature {
    static featureId = 'tabviewSidebar';
    static executionPhase = 'idle';
    static priority = 25;

    constructor() {
        super('TabviewSidebar');
        this.name = 'TabviewSidebar';
        this._headerEl = null;
        this._activeTab = 'related';
    }

    getConfigKey() {
        return 'enableTabviewSidebar';
    }

    async enable() {
        await super.enable();
        document.body.classList.add('ypp-tabview-sidebar');
        this._injectHeader();
        this.utils?.log?.('Tabview Sidebar enabled (Script 560618)', 'TABVIEW-SIDEBAR');
    }

    async disable() {
        await super.disable();
        document.body.classList.remove('ypp-tabview-sidebar');
        if (this._headerEl && this._headerEl.parentNode) {
            this._headerEl.remove();
        }
        this._headerEl = null;
        this.utils?.log?.('Tabview Sidebar disabled', 'TABVIEW-SIDEBAR');
    }

    async onUpdate() {
        const enabled = Boolean(this.settings?.enableTabviewSidebar);
        if (enabled) {
            document.body.classList.add('ypp-tabview-sidebar');
            this._injectHeader();
        } else {
            document.body.classList.remove('ypp-tabview-sidebar');
            if (this._headerEl && this._headerEl.parentNode) {
                this._headerEl.remove();
                this._headerEl = null;
            }
        }
    }

    _injectHeader() {
        const secondary = document.querySelector('#secondary.ytd-watch-flexy');
        if (!secondary || secondary.querySelector('.ypp-tabview-header')) return;

        const header = document.createElement('div');
        header.className = 'ypp-tabview-header';

        const tabs = [
            { id: 'related', label: 'Videos' },
            { id: 'comments', label: 'Comments' },
            { id: 'info', label: 'Info' }
        ];

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `ypp-tabview-btn ${tab.id === this._activeTab ? 'active' : ''}`;
            btn.textContent = tab.label;
            btn.dataset.tab = tab.id;
            btn.addEventListener('click', () => this._switchTab(tab.id));
            header.appendChild(btn);
        });

        secondary.insertBefore(header, secondary.firstChild);
        this._headerEl = header;
    }

    _switchTab(tabId) {
        this._activeTab = tabId;
        if (!this._headerEl) return;

        this._headerEl.querySelectorAll('.ypp-tabview-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // Toggle visibility of right column components
        const related = document.querySelector('#related');
        const comments = document.querySelector('#comments');
        if (related) {
            related.style.display = tabId === 'related' ? '' : 'none';
        }
        if (comments) {
            // If comments tab is active, bring into view or scroll
            if (tabId === 'comments') {
                comments.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.TabviewSidebar = TabviewSidebar;
