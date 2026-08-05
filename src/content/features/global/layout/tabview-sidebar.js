/**
 * Tabview Sidebar Feature (Based on Script 560618: YouTube Improvements - Layout & Video Enhancer)
 * Converts watch page right sidebar into clean tabs: Comments, Info, and Related Videos.
 * Seamlessly integrates with Seamless Mode to orchestrate DOM swapping and Grid layouts.
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
        this._activeTab = null;
    }

    getConfigKey() {
        return 'enableTabviewSidebar';
    }

    _isSeamlessActive() {
        return Boolean(
            this.settings?.seamlessMode ||
            window.YPP?.featureManager?.getFeature('seamlessMode')?.isEnabled ||
            document.body.classList.contains('ypp-seamless-mode')
        );
    }

    async enable() {
        await super.enable();
        document.body.classList.add('ypp-tabview-sidebar');
        if (!this._activeTab) {
            try {
                const savedTab = localStorage.getItem('ypp-tabview-active-tab');
                this._activeTab = savedTab || (this._isSeamlessActive() ? 'comments' : 'related');
            } catch(e) {
                this._activeTab = this._isSeamlessActive() ? 'comments' : 'related';
            }
        }
        this._injectHeader();
        this._switchTab(this._activeTab);
        this.utils?.log?.('Tabview Sidebar enabled (Integrated with Seamless Mode)', 'TABVIEW-SIDEBAR');
    }

    async disable() {
        await super.disable();
        document.body.classList.remove('ypp-tabview-sidebar');
        if (this._headerEl && this._headerEl.parentNode) {
            this._headerEl.remove();
        }
        this._headerEl = null;

        // Restore visibility of all components
        const below = document.querySelector('#below');
        const related = document.querySelector('#related');
        const primaryInner = document.querySelector('#primary-inner');
        const secondaryInner = document.querySelector('#secondary-inner');

        if (below) {
            below.style.display = '';
            Array.from(below.children).forEach(child => {
                child.style.display = '';
            });
        }
        if (related) {
            related.style.display = '';
        }

        // If Seamless mode is NOT active, ensure normal DOM placement is restored
        if (!this._isSeamlessActive()) {
            if (below && primaryInner && below.parentElement !== primaryInner) {
                primaryInner.appendChild(below);
            }
            if (related && secondaryInner && related.parentElement !== secondaryInner) {
                secondaryInner.appendChild(related);
            }
        }
        this.utils?.log?.('Tabview Sidebar disabled', 'TABVIEW-SIDEBAR');
    }

    async onUpdate() {
        const enabled = Boolean(this.settings?.enableTabviewSidebar || this._isSeamlessActive());
        if (enabled) {
            if (!this.isEnabled) {
                this.isEnabled = true;
            }
            document.body.classList.add('ypp-tabview-sidebar');
            if (!this._activeTab) {
                try {
                    const savedTab = localStorage.getItem('ypp-tabview-active-tab');
                    this._activeTab = savedTab || (this._isSeamlessActive() ? 'comments' : 'related');
                } catch(e) {
                    this._activeTab = this._isSeamlessActive() ? 'comments' : 'related';
                }
            }
            this._injectHeader();
            this._switchTab(this._activeTab);
        } else {
            this.disable();
        }
    }

    _injectHeader() {
        const secondaryInner = document.querySelector('#secondary-inner') || document.querySelector('#secondary.ytd-watch-flexy');
        if (!secondaryInner) return;

        // If header already exists, make sure it's at the top of secondaryInner
        let header = secondaryInner.querySelector('.ypp-tabview-header');
        if (header) {
            this._headerEl = header;
            if (secondaryInner.firstChild !== header) {
                secondaryInner.insertBefore(header, secondaryInner.firstChild);
            }
            return;
        }

        header = document.createElement('div');
        header.className = 'ypp-tabview-header';

        const tabs = [
            {
                id: 'comments',
                label: 'Comments',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 6px; vertical-align: -2px;"><path fill="currentColor" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>'
            },
            {
                id: 'info',
                label: 'Info',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 6px; vertical-align: -2px;"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
            },
            {
                id: 'related',
                label: 'Videos',
                icon: '<svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 6px; vertical-align: -2px;"><path fill="currentColor" d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>'
            }
        ];

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `ypp-tabview-btn ${tab.id === this._activeTab ? 'active' : ''}`;
            btn.innerHTML = `${tab.icon}<span>${tab.label}</span>`;
            btn.dataset.tab = tab.id;
            btn.addEventListener('click', () => this._switchTab(tab.id));
            header.appendChild(btn);
        });
        
        const slider = document.createElement('div');
        slider.className = 'ypp-tabview-slider';
        header.appendChild(slider);

        secondaryInner.insertBefore(header, secondaryInner.firstChild);
        this._headerEl = header;
    }

    _switchTab(tabId) {
        this._activeTab = tabId;
        try { localStorage.setItem('ypp-tabview-active-tab', tabId); } catch(e) {}
        document.body.setAttribute('data-ypp-active-tab', tabId);
        
        if (!this._headerEl) return;

        // Batch DOM reads
        const headerBtns = Array.from(this._headerEl.querySelectorAll('.ypp-tabview-btn'));
        const related = document.querySelector('#related');
        const comments = document.querySelector('#comments');
        const below = document.querySelector('#below');
        const primaryInner = document.querySelector('#primary-inner');
        const secondaryInner = document.querySelector('#secondary-inner');

        const isSeamless = this._isSeamlessActive();
        const seamlessFeature = window.YPP?.featureManager?.getFeature('seamlessMode');
        const gridController = seamlessFeature?.gridController;

        // Batch DOM writes in rAF
        window.requestAnimationFrame(() => {
            const hideComments = document.body.classList.contains('ypp-hide-comments');
            const hideRelated = document.body.classList.contains('ypp-hide-related');

            headerBtns.forEach(btn => {
                const tab = btn.dataset.tab;
                btn.classList.toggle('active', tab === tabId);
                
                // Hide tabs if the user explicitly hid the content via declutter
                if (tab === 'comments') {
                    btn.style.display = hideComments ? 'none' : '';
                } else if (tab === 'related') {
                    btn.style.display = hideRelated ? 'none' : '';
                }
            });

            // Physical DOM nodes only move when absolutely required (between primary and secondary)
            // CSS handles all visibility via the data-ypp-active-tab attribute.
            if (tabId === 'comments' || tabId === 'info') {
                if (below && secondaryInner && below.parentElement !== secondaryInner) {
                    secondaryInner.appendChild(below);
                }
                
                if (isSeamless && related && primaryInner && related.parentElement !== primaryInner) {
                    primaryInner.appendChild(related);
                    if (gridController && typeof gridController.enable === 'function') {
                        gridController.enable();
                    }
                }
                
                if (tabId === 'comments' && comments && typeof comments.scrollIntoView === 'function') {
                    // Smooth scroll without blocking main thread execution
                    setTimeout(() => {
                        if (document.body.classList.contains('ypp-hide-comments')) return;
                        try { comments.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch(e) {}
                    }, 50);
                }
            } else if (tabId === 'related') {
                if (related && secondaryInner && related.parentElement !== secondaryInner) {
                    if (isSeamless && gridController && typeof gridController.cleanup === 'function') {
                        gridController.cleanup();
                    }
                    secondaryInner.appendChild(related);
                }
            }
        });
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.TabviewSidebar = TabviewSidebar;
