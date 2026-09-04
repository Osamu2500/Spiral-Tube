/**
 * @fileoverview
 * Tabview Sidebar Controller
 * Manages the UI for the tabbed sidebar (Comments, Info, Videos) in Seamless Mode.
 * Extracted and merged from the standalone Tabview Sidebar feature.
 * Handles UI injection and state management, but delegates structural DOM swaps to the orchestrator.
 */
export class TabviewSidebarController {
    constructor(logger) {
        this.logger = logger;
        this.isEnabled = false;
        this._headerEl = null;
        this._activeTab = null;
        
        // Bind context
        this.enable = this.enable.bind(this);
        this.disable = this.disable.bind(this);
        this._switchTab = this._switchTab.bind(this);
    }

    enable() {
        if (this.isEnabled) return;
        this.isEnabled = true;
        
        document.body.classList.add('ypp-tabview-sidebar');
        
        if (!this._activeTab) {
            try {
                const savedTab = localStorage.getItem('ypp-tabview-active-tab');
                this._activeTab = savedTab || 'comments';
            } catch(e) {
                this._activeTab = 'comments';
            }
        }
        
        this._injectHeader();
        this._switchTab(this._activeTab);
        
        this.logger?.info('TabviewSidebarController activated.');
    }

    disable() {
        if (!this.isEnabled) return;
        this.isEnabled = false;
        
        document.body.classList.remove('ypp-tabview-sidebar');
        
        if (this._headerEl && this._headerEl.parentNode) {
            this._headerEl.remove();
        }
        this._headerEl = null;
        
        this.logger?.info('TabviewSidebarController deactivated.');
    }

    getActiveTab() {
        return this._activeTab;
    }

    _injectHeader() {
        const secondaryInner = document.querySelector('#secondary-inner') || document.querySelector('#secondary.ytd-watch-flexy');
        if (!secondaryInner) return;

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
            btn.addEventListener('click', () => {
                this._switchTab(tab.id);
                // Dispatch event to notify orchestrator that macro swap might be needed
                document.dispatchEvent(new CustomEvent('ypp-tabview-changed', { detail: { tab: tab.id } }));
            });
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

        window.requestAnimationFrame(() => {
            const headerBtns = Array.from(this._headerEl.querySelectorAll('.ypp-tabview-btn'));
            const hideComments = document.body.classList.contains('ypp-hide-comments');
            const hideRelated = document.body.classList.contains('ypp-hide-related');

            headerBtns.forEach(btn => {
                const tab = btn.dataset.tab;
                btn.classList.toggle('active', tab === tabId);
                
                if (tab === 'comments') {
                    btn.style.display = hideComments ? 'none' : '';
                } else if (tab === 'related') {
                    btn.style.display = hideRelated ? 'none' : '';
                }
            });

            if (tabId === 'comments') {
                const comments = document.querySelector('#comments');
                if (comments && typeof comments.scrollIntoView === 'function') {
                    setTimeout(() => {
                        if (document.body.classList.contains('ypp-hide-comments')) return;
                        try { comments.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch(e) {}
                    }, 50);
                }
            }
        });
    }
}
