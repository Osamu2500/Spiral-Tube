import '../subscriptions.css';
import { SubsUIFilter } from './subs-ui-filter.js';
import { SubsUISidebar } from './subs-ui-sidebar.js';
import { SubsUIModal } from './subs-ui-modal.js';

export class SubscriptionUI extends window.YPP.features.BaseFeature {
    static featureId = 'subscriptionUI';
    static executionPhase = 'idle';
    static priority = 999;

    constructor(manager) {
        super('SubscriptionUI');
        this.manager = manager;
        this.isModalOpen = false;
        this.draggedChannel = null;
        this._lastSidebarKey = null;
        this._debouncedFilter = null;
    }

    async enable() {
        await super.enable();
        if (!this.manager && window.YPP.Main?.featureManager) {
            this.manager = window.YPP.Main.featureManager.getFeature('subscriptionsOrganizer')?.manager
                        || window.YPP.Main.featureManager.getFeature('subscriptionFolders');
        }

        if (!this.manager) {
            window.YPP.Utils.log('Dependency missing: SubscriptionManager', 'SubUI', 'error');
            return;
        }

        if (!this._debouncedFilter) {
            this._debouncedFilter = window.YPP.Utils.debounce(
                (groupName) => SubsUIFilter._filterFeedNow(this, groupName),
                50
            );
        }

        window.YPP.Utils.log('Started Subscription UI', 'SubUI');
        this.observer = this.observer || window.YPP.sharedObserver;
        if (!this.observer) {
            window.YPP.Utils.log('SharedObserver unavailable — SubscriptionUI cannot register DOM watchers', 'SubUI', 'warn');
            return;
        }
        this.observePage();
    }

    disable() {
        if (this.observer) {
            this.observer.unregister('subs-ui-feed');
            this.observer.unregister('subs-ui-channels');
            this.observer.unregister('subs-ui-home');
        }
        document
            .querySelectorAll('#ypp-manage-subs-btn, #ypp-organize-btn, #ypp-subs-filter-bar, #ypp-sidebar-group-section, .ypp-modal-overlay')
            .forEach(el => el.remove());

        document.querySelector('ytd-browse[page-subtype="channels"] #contents')
            ?.classList.remove('ypp-grid-layout');

        this.isModalOpen = false;
        this._lastSidebarKey = null;
        super.disable();
    }

    observePage() {
        this.observer.start();

        this.observer.register(
            'subs-ui-feed',
            'ytd-browse[page-subtype="subscriptions"] #contents, ytd-browse[page-subtype="subscriptions"] #title-container',
            () => {
                this.injectManageButton();
                this.injectFilterBar();
            }
        );

        this.observer.register(
            'subs-ui-channels',
            'ytd-browse[page-subtype="channels"] #contents, ytd-browse[page-subtype="channels"] #title-container',
            () => {
                this.injectOrganizerButton();
                this.applyGridClass();
            }
        );

        this.observer.register(
            'subs-ui-home',
            'ytd-browse[page-subtype="home"] #contents',
            () => this.injectFilterBar()
        );

        this.checkRoute();
    }

    checkRoute() {
        const path = window.location.pathname;
        const groupParam = new URLSearchParams(window.location.search).get('ypp_group');

        if (path === '/feed/subscriptions') {
            this.injectManageButton();
            this.injectFilterBar();
            if (groupParam) setTimeout(() => this.filterFeed(groupParam), 500);
        } else if (path === '/feed/channels') {
            this.injectOrganizerButton();
            this.applyGridClass();
        } else if (path === '/' || path === '/index') {
            this.injectFilterBar();
        }

        this.injectSidebarGroups();
    }

    applyGridClass() {
        document.querySelector('ytd-browse[page-subtype="channels"] #contents')
            ?.classList.add('ypp-grid-layout');
    }

    injectManageButton() {
        if (document.getElementById('ypp-manage-subs-btn')) return;
        const container = document.querySelector('ytd-browse[page-subtype="subscriptions"] #title-container');
        if (!container) return;

        const btn = this._createButton('Manage Groups', 'ypp-manage-subs-btn');
        this.addListener(btn, 'click', () => this.openOrganizer());
        container.appendChild(btn);
    }

    injectOrganizerButton() {
        if (document.getElementById('ypp-organize-btn')) return;
        const container = document.querySelector('ytd-browse[page-subtype="channels"] #title-container');
        if (!container) return;

        const btn = this._createButton('Organize', 'ypp-organize-btn');
        this.addListener(btn, 'click', () => this.openOrganizer());
        container.appendChild(btn);
    }

    _createButton(text, id) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.className = 'ypp-btn-primary';
        btn.textContent = text;
        return btn;
    }

    injectFilterBar() {
        SubsUIFilter.injectFilterBar(this);
    }

    reapplyFilters() {
        SubsUIFilter.reapplyFilters(this);
    }

    filterFeed(groupName) {
        if (this._debouncedFilter) {
            this._debouncedFilter(groupName);
        } else {
            SubsUIFilter._filterFeedNow(this, groupName);
        }
    }

    injectSidebarGroups() {
        SubsUISidebar.injectSidebarGroups(this);
    }

    openOrganizer() {
        SubsUIModal.openOrganizer(this);
    }

    addChannelToGroup(groupName, channel) {
        return SubsUIModal._addChannelToGroup(this, groupName, channel);
    }
};

window.YPP.features.SubscriptionUI = SubscriptionUI;
