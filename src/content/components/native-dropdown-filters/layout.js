import '../../core/system/base-feature.js';
import { DropdownFilterFeature } from './feature.js';

export class NativeDropdownFiltersLayout extends window.YPP.features.BaseFeature {
    static featureId = 'nativeDropdownFilters';
    static executionPhase = 'idle';

    getConfigKey() {
        return null; // Feature enabled state is checked per-element inside the logic
    }

    constructor() {
        super('NativeDropdownFilters');
        this.featureLogic = new DropdownFilterFeature();
    }

    async enable() {
        await super.enable();
        
        // Playlist Menus
        this.observer.register('playlistDropdownObs', 'tp-yt-paper-dialog.ytd-popup-container ytd-add-to-playlist-renderer, ytd-add-to-playlist-renderer', (node) => {
            if (this.settings.enablePlaylistPopupFilter) {
                this.featureLogic.injectFilter(node, 'playlist');
            }
        });

        // Sidebar Subscriptions (Show More expander / list)
        this.observer.register('sidebarDropdownObs', 'div#items:has(a#endpoint[href="/feed/subscriptions"])', (node) => {
            if (this.settings.enableSidebarFilter) {
                this.featureLogic.injectFilter(node, 'sidebar');
            }
        });

        // Notifications Menu
        this.observer.register('notificationDropdownObs', 'yt-multi-page-menu-section-renderer:has(ytd-notification-renderer) div#items, ytd-multi-page-menu-renderer[menu-style="multi-page-menu-style-type-notifications"] div#items', (node) => {
            if (this.settings.enableNotificationFilter) {
                this.featureLogic.injectFilter(node, 'notification');
            }
        });

        this.observer.start();
    }

    async disable() {
        await super.disable();
        this.observer.unregister('playlistDropdownObs');
        this.observer.unregister('sidebarDropdownObs');
        this.observer.unregister('notificationDropdownObs');
        this.featureLogic.removeAllFilters();
    }
}
