/**
 * Player Settings Menu Helper
 * Handles injecting custom options into the native YouTube player settings menu.
 */
const CONSTANTS = {
    ICONS: {
        DOT: '<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="4"/></svg>',
        SPEED: '<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M5 4l15 8-15 8V4z"/></svg>',
        SNAPSHOT: '<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM9 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l.59-.65L9.88 4h4.24l1.24 1.35.59.65H20v12zM12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-8c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>',
        BOOKMARK: '<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>',
        LOOP: '<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v6z"/></svg>',
        PIP: '<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>',
        VOLUME: '<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z"/></svg>',
        CINEMA: '<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>'
    },
    NATIVE_ITEMS: [
        { id: 'pb_native_play', selector: '.ytp-play-button', label: 'Play/Pause' },
        { id: 'pb_native_next', selector: '.ytp-next-button', label: 'Next Video' },
        { id: 'pb_native_mute', selector: '.ytp-mute-button', label: 'Mute/Unmute' },
        { id: 'pb_native_cast', selector: '.ytp-remote-button', label: 'Cast to TV' },
        { id: 'pb_native_autoplay', selector: '.ytp-autonav-button, .ytp-autonav-toggle-button', label: 'Autoplay' },
        { id: 'pb_native_cc', selector: '.ytp-subtitles-button', label: 'Subtitles/CC' },
        { id: 'pb_native_miniplayer', selector: '.ytp-miniplayer-button', label: 'Miniplayer' },
        { id: 'pb_native_theater', selector: '.ytp-size-button', label: 'Theater Mode' },
        { id: 'pb_native_fullscreen', selector: '.ytp-fullscreen-button', label: 'Fullscreen' }
    ]
};

export class PlayerSettingsMenu {
    static featureId = 'playerSettingsMenu';
    static executionPhase = 'idle';
    static priority = 999;

    constructor(playerFeature) {
        this.player = playerFeature;
        this.controls = new window.YPP.features.PlayerControls(playerFeature);
        this.domObserver = window.YPP.sharedObserver;
    }

    setupSettingsObserver(video) {
        // Use sharedObserver instead of a raw MutationObserver
        // YouTube creates the .ytp-panel-menu dynamically when settings is clicked
        this.domObserver.register('player-settings-menu', '.ytp-settings-menu .ytp-panel-menu', (elements) => {
            const settingsMenu = document.querySelector('.ytp-settings-menu');
            if (settingsMenu) {
                this.injectSettingsMenuItems(settingsMenu, video);
            }
        }, true);
    }

    cleanupSettingsObserver() {
        if (this.domObserver) {
            this.domObserver.unregister('player-settings-menu');
        }
    }

    createSettingsMenuItem(label, iconContent, onClick) {
        const item = document.createElement('div');
        item.className = 'ytp-menuitem ypp-custom-menuitem';
        item.setAttribute('role', 'menuitem');
        item.setAttribute('tabindex', '0');
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'ytp-menuitem-icon';
        iconDiv.innerHTML = iconContent || CONSTANTS.ICONS.DOT;
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'ytp-menuitem-label';
        labelDiv.textContent = label;
        
        item.appendChild(iconDiv);
        item.appendChild(labelDiv);
        
        this.player.addListener(item, 'click', (e) => {
            // Click natively, then optionally close settings menu
            onClick(e);
            const closeBtn = document.querySelector('.ytp-settings-button');
            if (closeBtn) closeBtn.click();
        });
        
        return item;
    }

    createSettingsToggleItem(label, iconContent, settingKey, currentValue, onChange) {
        const item = document.createElement('div');
        item.className = 'ytp-menuitem ypp-custom-menuitem';
        item.setAttribute('role', 'menuitemcheckbox');
        item.setAttribute('aria-checked', String(!!currentValue));
        item.setAttribute('tabindex', '0');
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'ytp-menuitem-icon';
        iconDiv.innerHTML = iconContent || CONSTANTS.ICONS.DOT;
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'ytp-menuitem-label';
        labelDiv.textContent = label;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'ytp-menuitem-content';
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'ytp-menuitem-toggle-checkbox';
        contentDiv.appendChild(checkboxDiv);
        
        item.appendChild(iconDiv);
        item.appendChild(labelDiv);
        item.appendChild(contentDiv);
        
        this.player.addListener(item, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isChecked = item.getAttribute('aria-checked') === 'true';
            const newValue = !isChecked;
            item.setAttribute('aria-checked', String(newValue));
            
            // Sync with extension storage
            if (window.YPP.Utils && window.YPP.Utils.saveSettings) {
                window.YPP.Utils.saveSettings({ [settingKey]: newValue });
            }
            if (onChange) onChange(newValue);
        });
        
        return item;
    }

    injectSettingsMenuItems(menuElement, video) {
        return;
    }
}

window.YPP.features.PlayerSettingsMenu = PlayerSettingsMenu;
