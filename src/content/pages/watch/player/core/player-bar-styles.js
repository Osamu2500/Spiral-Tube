export class PlayerBarStyles {
    static injectStaticStyles() {
        if (document.getElementById('ypp-player-static-styles')) return;
        const style = document.createElement('style');
        style.id = 'ypp-player-static-styles';
        style.textContent = `
            html body.ypp-auto-hide-controls .html5-video-player:not(:hover) .ypp-player-controls {
                opacity: 0 !important;
                pointer-events: none !important;
                transition: opacity 0.3s ease !important;
            }
            html body.ypp-auto-hide-controls .html5-video-player:hover .ypp-player-controls {
                opacity: 1 !important;
                pointer-events: auto !important;
                transition: opacity 0.2s ease !important;
            }
        `;
        document.head.appendChild(style);
    }

    static updateCustomStyles(settings, currentHash) {
        const s = settings || {};
        const hash = [
            s.pb_native_play, s.pb_native_next, s.pb_native_mute, s.pb_native_cast,
            s.pb_native_autoplay, s.pb_native_cc, s.pb_native_miniplayer,
            s.pb_native_theater, s.pb_native_fullscreen
        ].join('|');
        if (hash === currentHash) return hash;

        let styleNode = document.getElementById('ypp-player-overrides');
        if (!styleNode) {
            styleNode = document.createElement('style');
            styleNode.id = 'ypp-player-overrides';
            document.head.appendChild(styleNode);
        }

        const hiddenSelectors = [];
        const isHiddenOrBack = (val) => val === 'hidden' || val === 'back';
        if (isHiddenOrBack(s.pb_native_play)) hiddenSelectors.push('.ytp-play-button', '.ytp-play-button-container');
        if (isHiddenOrBack(s.pb_native_next)) hiddenSelectors.push('.ytp-next-button');
        if (isHiddenOrBack(s.pb_native_mute)) hiddenSelectors.push('.ytp-mute-button', '.ytp-volume-area', '.ytp-volume-panel');
        if (isHiddenOrBack(s.pb_native_cast)) hiddenSelectors.push('button[data-tooltip-target-id="ytp-remote-button"]', '.ytp-remote-button', '.ytp-remote-button-container', 'yt-button-shape[aria-label*="Cast"]');
        if (isHiddenOrBack(s.pb_native_autoplay)) hiddenSelectors.push('.ytp-autonav-toggle-button-container', 'button[data-tooltip-target-id="ytp-autonav-toggle-button"]', 'button.ytp-button[aria-label*="Autoplay"]', '.ytp-autonav-toggle-button', '.ytp-autonav-button');
        if (isHiddenOrBack(s.pb_native_cc)) hiddenSelectors.push('.ytp-subtitles-button', '.ytp-subtitles-button-container');
        if (isHiddenOrBack(s.pb_native_miniplayer)) hiddenSelectors.push('.ytp-miniplayer-button', '.ytp-miniplayer-button-container');
        if (isHiddenOrBack(s.pb_native_theater)) hiddenSelectors.push('.ytp-size-button', '.ytp-size-button-container');
        if (isHiddenOrBack(s.pb_native_fullscreen)) hiddenSelectors.push('.ytp-fullscreen-button', '.ytp-fullscreen-button-container');

        if (hiddenSelectors.length > 0) {
            const selectors = hiddenSelectors.map(sel => [
                `html body .html5-video-player ${sel}`,
                `html body.ypp-compact-player-ui .html5-video-player ${sel}`,
                `html body #movie_player .ytp-chrome-controls ${sel}`,
                `html body .html5-video-player .ytp-chrome-controls ${sel}`,
                `html body.ypp-compact-player-ui #movie_player .ytp-chrome-controls ${sel}`,
                `html body.ypp-compact-player-ui .html5-video-player .ytp-chrome-controls ${sel}`,
                `html body.ypp-compact-player-ui .html5-video-player .ytp-left-controls ${sel}`,
                `html body.ypp-compact-player-ui .html5-video-player .ytp-right-controls ${sel}`
            ].join(',\n')).join(',\n');
            styleNode.textContent = `${selectors} { display: none !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important; overflow: hidden !important; }`;
        } else {
            styleNode.textContent = '';
        }
        return hash;
    }

    static removeStyles() {
        const styleNode = document.getElementById('ypp-player-overrides');
        if (styleNode) styleNode.remove();
        
        const legacyStyle = document.getElementById('ypp-custom-player-bar-styles');
        if (legacyStyle) legacyStyle.remove();
        const legacyVis = document.getElementById('ypp-custom-player-bar-style-vis');
        if (legacyVis) legacyVis.remove();
    }
}
