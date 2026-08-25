/**
 * Keyboard Shortcuts Feature
 *
 * Provides configurable keyboard shortcuts for toggling extension features
 * and controlling video playback. All shortcuts are active only on YouTube
 * watch and shorts pages to avoid interfering with other YouTube interactions.
 *
 * Default shortcuts:
 *   Shift+Z  → Toggle Zen Mode
 *   Shift+F  → Toggle Focus Mode
 *   Shift+C  → Toggle Cinema Mode / Theater
 *   Shift+S  → Take Snapshot
 *   Shift+L  → Toggle Loop
 *   Shift+P  → Toggle Picture-in-Picture
 *   Shift+,  → Speed -0.25x
 *   Shift+.  → Speed +0.25x
 *   Shift+R  → Reset speed to 1x
 *   Shift+M  → Toggle Ambient Mode
 *
 * Users can remap any shortcut via the popup Settings tab.
 * Shortcuts stored in settings as `shortcut_<action>` keys (e.g. `shortcut_zenMode`).
 */



export class KeyboardShortcuts extends window.YPP.features.BaseFeature {
    static featureId = 'keyboardShortcuts';
    static executionPhase = 'idle';
    static priority = 5;

    constructor() {
        super('KeyboardShortcuts');

        this.actions = {
            zenMode:     { label: 'Toggle Zen Mode',     fn: () => this._toggleSetting('zenMode') },
            focusMode:   { label: 'Toggle Focus Mode',   fn: () => this._toggleSetting('enableFocusMode') },
            cinemaMode:  { label: 'Toggle Cinema / Theater',  fn: () => this._toggleCinema() },
            snapshot:    { label: 'Take Snapshot',    fn: () => this._triggerSnapshot() },
            loop:        { label: 'Toggle Loop',        fn: () => this._toggleLoop() },
            pip:         { label: 'Picture-in-Picture',         fn: () => this._togglePiP() },
            ambientMode: { label: 'Toggle Ambient Mode', fn: () => this._toggleSetting('ambientMode') },
        };
        
        // Human-readable labels for toast notifications for all generic settings
        this.genericLabels = {
            enableGlobalPlayerBar: 'Player Bar',
            intentionalDelay: 'Intentional Delay',
            watchTimeAlert: 'Watch Time Alert',
            hideComments: 'Comments Visibility',
            hideRelated: 'Related Videos',
            hideLiveChat: 'Live Chat Visibility',
            aggressiveShortsBlock: 'Shorts Remover',
            hideEndScreens: 'End Screens Visibility',
            hideAnnotations: 'Annotations',
            enableVolumeBoost: 'Volume Booster',
            enableCinemaFilters: 'Video Filters',
            enableCustomSpeed: 'Custom Speed',
            autoCinema: 'Auto Cinema',
            enableTranscript: 'Transcript',
            trueBlack: 'True Black Dark Mode',
            hideScrollbar: 'Scrollbar',
            grayscaleThumbnails: 'Grayscale Thumbs',
            grid4x4: '4x4 Grid Layout',
            hideMixes: 'Mixes',
            hideWatched: 'Watched Videos',
            hideMerch: 'Merch & Offers',
            hideFundraiser: 'Fundraisers',
            hideChannelCards: 'Channel Cards',
            hideFeed: 'Home Feed',
            hideTrending: 'Trending Tab',
            searchGrid: 'Search Grid',
            cleanSearch: 'Clean Search',
            shortsAutoScroll: 'Shorts Auto Scroll',
            shortsVolumeNormalizer: 'Shorts Volume',
            autoSkipAds: 'Auto Skip Ads',
            autoPlayNext: 'Auto Play Next',
            sponsorBlock: 'SponsorBlock'
        };
    }

    getConfigKey() {
        return 'keyboardShortcuts';
    }

    async enable() {
        await super.enable();
        this._registerBindings();
        this.utils?.log('Keyboard Shortcuts enabled', 'SHORTCUTS', 'debug');
    }

    async onUpdate() {
        this._registerBindings();
        this.utils?.log('Keyboard Shortcuts updated', 'SHORTCUTS', 'debug');
    }

    _registerBindings() {
        const bindings = [];
        const shortcuts = this.settings?.advancedShortcuts || [];
        
        for (const sc of shortcuts) {
            if (!sc.key || !sc.action) continue;
            
            let fn;
            let label;
            
            if (this.actions[sc.action]) {
                fn = this.actions[sc.action].fn;
                label = this.actions[sc.action].label;
            } else {
                const settingKey = sc.action;
                fn = () => this._toggleSetting(settingKey);
                label = `Toggle ${this.genericLabels[settingKey] || settingKey}`;
            }
            
            bindings.push({
                combo: sc.key,
                callback: () => {
                    fn();
                    this._showToast(label);
                }
            });
        }
        
        window.YPP.hotkeysManager?.register('keyboard-shortcuts', bindings);
    }

    async disable() {
        await super.disable();
        window.YPP.hotkeysManager?.unregister('keyboard-shortcuts');
        this.utils?.log('Keyboard Shortcuts disabled', 'SHORTCUTS', 'debug');
    }

    // ACTION IMPLEMENTATIONS
    // =========================================================================

    async _toggleSetting(key) {
        const currentVal = this.settings?.[key] || false;
        const delta = { [key]: !currentVal };
        
        chrome.runtime.sendMessage({ action: 'PATCH_SETTINGS', payload: delta }, () => {
            this.settings = { ...this.settings, ...delta };
        });
    }

    _toggleCinema() {
        const selectors = [
            '.ytp-size-button',
            'button[data-tooltip-target-id="ytp-size-button"]',
            '.ytp-button[data-tooltip-target-id="ytp-size-button"]',
        ];
        for (const sel of selectors) {
            const btn = document.querySelector(sel);
            if (btn) { btn.click(); return; }
        }
        const watchFlexy = document.querySelector('ytd-watch-flexy');
        if (watchFlexy) {
            watchFlexy.toggleAttribute('theater');
        }
    }

    _triggerSnapshot() {
        const video = document.querySelector('video');
        if (!video) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `snapshot-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    _toggleLoop() {
        const video = document.querySelector('video');
        if (!video) return;
        video.loop = !video.loop;
        document.querySelectorAll('.ypp-action-btn').forEach(btn => {
            if (btn.title === 'Loop Video') btn.classList.toggle('active', video.loop);
        });
    }

    async _togglePiP() {
        const video = document.querySelector('video');
        if (!video || !document.pictureInPictureEnabled) return;
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        } catch (e) { /* ignore */ }
    }

    // =========================================================================
    // TOAST FEEDBACK
    // =========================================================================

    _showToast(label) {
        document.querySelector('.ypp-shortcut-toast')?.remove();

        const toast = document.createElement('div');
        toast.className = 'ypp-shortcut-toast';
        toast.textContent = label;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 1800);
        });
    }
}

window.YPP.features.KeyboardShortcuts = KeyboardShortcuts;
