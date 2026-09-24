import '../system/base-feature.js';
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
            downloadThumbnail: { label: 'Download Thumbnail', fn: () => this._downloadThumbnail() },
            loop:        { label: 'Toggle Loop',        fn: () => this._toggleLoop() },
            pip:         { label: 'Picture-in-Picture',         fn: () => this._togglePiP() },
            ambientMode: { label: 'Toggle Ambient Mode', fn: () => this._toggleSetting('ambientMode') },
            copyVideoUrl: { label: 'Copy Video URL', fn: () => this._copyUrl() },
            copyVideoUrlAtTime: { label: 'Copy URL at Time', fn: () => this._copyUrlAtTime() },
            togglePlay: { label: 'Toggle Play/Pause', fn: () => this._togglePlay() },
            toggleMute: { label: 'Toggle Mute', fn: () => this._toggleMute() },
            toggleFullscreen: { label: 'Toggle Fullscreen', fn: () => this._toggleFullscreen() }
        };
        
        // Human-readable labels for toast notifications for all generic settings
        this.genericLabels = {
            enableGlobalBar: 'Player Bar',
            intentionalDelay: 'Intentional Delay',
            watchTimeAlert: 'Watch Time Alert',
            hideComments: 'Comments Visibility',
            hideRelated: 'Related Videos',
            hideLiveChat: 'Live Chat Visibility',
            aggressiveShortsBlock: 'Shorts Remover',
            hideEndScreens: 'End Screens Visibility',
            enableVolumeBoost: 'Equaliser',
            enableCinemaFilters: 'Video Filters',
            enableCustomSpeed: 'Custom Speed',
            autoCinema: 'Auto Cinema',

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
    // NEW UTILITY ACTIONS
    // =========================================================================

    _copyUrl() {
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete('t');
            navigator.clipboard.writeText(url.toString());
        } catch (e) { /* ignore */ }
    }

    _copyUrlAtTime() {
        const video = document.querySelector('video');
        if (!video) return;
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('t', Math.floor(video.currentTime) + 's');
            navigator.clipboard.writeText(url.toString());
        } catch (e) { /* ignore */ }
    }

    _downloadThumbnail() {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');
        if (!videoId) return;
        
        const imgUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const a = document.createElement('a');
        a.href = imgUrl;
        a.target = '_blank';
        
        fetch(imgUrl)
            .then(res => res.blob())
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                a.href = blobUrl;
                a.download = `thumbnail-${videoId}.jpg`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            })
            .catch(() => {
                a.click(); // Fallback to opening in new tab
            });
    }

    _togglePlay() {
        const video = document.querySelector('video');
        if (!video) return;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    _toggleMute() {
        const video = document.querySelector('video');
        if (!video) return;
        video.muted = !video.muted;
    }

    _toggleFullscreen() {
        if (!document.fullscreenElement) {
            // YouTube typically prefers #movie_player for fullscreen
            const player = document.querySelector('#movie_player') || document.documentElement;
            if (player.requestFullscreen) {
                player.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // =========================================================================
    // TOAST FEEDBACK
    // =========================================================================

    _showToast(label) {
        // Fallback or rename? Since _showToast is called by many functions, let's just override its implementation
        // to show a native YouTube Player Bezel.
        const player = document.querySelector('.html5-video-player');
        const container = player || document.body;

        const existing = container.querySelector('.ypp-bezel-wrapper');
        if (existing) existing.remove();

        const wrapper = document.createElement('div');
        wrapper.className = 'ypp-bezel-wrapper';
        
        if (!document.getElementById('ypp-bezel-styles')) {
            const style = document.createElement('style');
            style.id = 'ypp-bezel-styles';
            style.textContent = `
                .ypp-bezel-wrapper {
                    position: absolute;
                    top: 10%;
                    left: 50%;
                    transform: translate(-50%, 0);
                    pointer-events: none;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.65);
                    color: white;
                    border-radius: 40px;
                    padding: 12px 24px;
                    font-size: 16px;
                    font-weight: 500;
                    font-family: "YouTube Noto", Roboto, Arial, Helvetica, sans-serif;
                    white-space: nowrap;
                    opacity: 1;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    animation: ypp-bezel-fade 1.5s cubic-bezier(0.4, 0, 1, 1) forwards;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .ypp-bezel-wrapper::before {
                    content: '';
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 12px;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                @keyframes ypp-bezel-fade {
                    0% { opacity: 0; transform: translate(-50%, -20px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    80% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, -10px); }
                }
                body > .ypp-bezel-wrapper {
                    position: fixed;
                }
            `;
            document.head.appendChild(style);
        }

        wrapper.textContent = label;
        container.appendChild(wrapper);

        setTimeout(() => {
            if (wrapper.parentElement) wrapper.remove();
        }, 1500);
    }
}

window.YPP.features.KeyboardShortcuts = KeyboardShortcuts;
