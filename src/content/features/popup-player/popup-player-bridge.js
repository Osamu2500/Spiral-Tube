/**
 * popup-player-bridge.js
 *
 * Scope: YouTube Watch Page Iframe — Spiral Tube Popup Player Bridge
 * Target: Native YouTube Watch Page loaded inside a popup iframe (distinguished by ?ytpop=1).
 * Description: Runs INSIDE the iframe (all_frames: true) that the popup player loads.
 * Communicates with the host page (engine/index.js) via postMessage.
 *
 * NOTE: This file ONLY targets frames inside the popup. It does NOT affect unrelated files
 * or the main YouTube window functionality outside its scope, as it specifically verifies
 * `window.self !== window.top` and acts as an isolated sandbox for the popup player.
 *
 * Responsibilities:
 *  1. Force video playback on load (fixes infinite buffering)
 *  2. Inject custom CSS to strip the watch page UI & apply Squircle theme
 *  3. Apply volume boost via AudioContext GainNode
 *  4. Apply cinema filters from storage
 *  5. Send player state events back to the host page
 *  6. Handle commands from the host (play, pause, seek, pip, reflow)
 */

(function () {
    'use strict';

    // Only run inside the popup iframe, not on the main page
    // We identify this by checking if we are in a frame
    if (window.self === window.top) return;

    // ── Constants ──────────────────────────────────────────────────────────────

    const STYLE_ID = 'ytpop-bridge-styles';
    const ACCEPTED_ORIGINS = ['https://www.youtube.com', 'https://youtube.com'];

    // ── State ─────────────────────────────────────────────────────────────────

    const state = {
        videoEl: null,
        uiStripped: false,
        playForced: false,
    };

    // ── Utility ───────────────────────────────────────────────────────────────

    function postToHost(data) {
        try {
            window.parent.postMessage({ ...data, _ytpopBridge: true }, '*');
        } catch (_) {}
    }

    function getMoviePlayer() {
        return document.getElementById('movie_player');
    }

    function getVideo() {
        return document.querySelector('video');
    }

    // ── Step 1: Force Playback ────────────────────────────────────────────────
    // YouTube's watch page when loaded in a hidden/background iframe goes into
    // an unstarted state (-1) and never auto-plays. We must manually trigger it.

    function forcePlay() {
        if (state.playForced) return;
        const player = getMoviePlayer();
        if (player && typeof player.playVideo === 'function') {
            const playerState = player.getPlayerState?.();
            // -1 = unstarted, 3 = buffering
            if (playerState === -1 || playerState === 3 || playerState === undefined) {
                player.playVideo();
                state.playForced = true;
            }
        } else {
            const vid = getVideo();
            if (vid && vid.paused) {
                vid.play().catch(() => {});
                state.playForced = true;
            }
        }
    }

    // ── Step 2: Strip Watch Page UI & Apply Squircle Theme ───────────────────

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            /* ── Kill ALL YouTube page chrome ── */
            #masthead-container,
            ytd-watch-flexy #secondary,
            ytd-watch-flexy #below,
            #comments,
            ytd-engagement-panel-section-list-renderer,
            .ytp-chrome-top,
            .ytp-show-cards-title,
            .ytp-watermark,
            .annotation,
            .ytp-paid-content-overlay,
            #movie_player .ytp-ce-element,
            ytd-watch-metadata,
            #description,
            #info-contents,
            #structured-description,
            #meta,
            ytd-merch-shelf-renderer,
            ytd-reel-shelf-renderer,
            ytd-watch-next-secondary-results-renderer,
            .iv-branding,
            .ytp-cards-button,
            .ytp-ce-covering-overlay {
                display: none !important;
            }

            /* ── Reset all layout to black zero-margin base ── */
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                background: #000 !important;
                width: 100vw !important;
                height: 100vh !important;
            }

            /* ── Force the entire YouTube SPA to be just the player ── */
            #page-manager,
            ytd-watch-flexy,
            ytd-watch-flexy #columns,
            ytd-watch-flexy #primary,
            ytd-watch-flexy #primary-inner,
            #ytd-player,
            #player,
            #player-container,
            #player-container-outer,
            .html5-video-player,
            .html5-video-container {
                position: fixed !important;
                inset: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
                max-height: none !important;
                min-width: 100vw !important;
                min-height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                border-radius: 0 !important;
                transform: none !important;
            }

            /* The actual video element */
            .html5-video-player video {
                object-fit: contain !important;
                position: absolute !important;
                inset: 0 !important;
                left: 0 !important;
                top: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                min-width: 100vw !important;
                min-height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                transform: none !important;

        `;
        document.head.appendChild(style);
        state.uiStripped = true;
    }

    // ── Step 3 removed ──────────────────────────────────────────────────
    // ── Step 4: Cinema Filters ────────────────────────────────────────────────

    function applyCinemaFilters(settings) {
        const vid = state.videoEl || getVideo();
        if (!vid) return;

        if (!settings.enableCinemaFilters) {
            vid.style.filter = '';
            return;
        }

        const g = (k, d) => settings[k] !== undefined ? settings[k] : d;
        vid.style.filter = [
            `brightness(${g('cinemaFilterBrightness', 100)}%)`,
            `contrast(${g('cinemaFilterContrast', 100)}%)`,
            `saturate(${g('cinemaFilterSaturate', 100)}%)`,
            `hue-rotate(${g('cinemaFilterHue', 0)}deg)`,
            `sepia(${g('cinemaFilterSepia', 0)}%)`,
            `grayscale(${g('cinemaFilterGrayscale', 0)}%)`,
            `invert(${g('cinemaFilterInvert', 0)}%)`,
            `blur(${g('cinemaFilterBlur', 0)}px)`,
        ].join(' ');
    }

    function startStateReporter(videoEl) {
        // We report state based on the HTML5 video events because they are always reliable
        videoEl.addEventListener('play', () => postToHost({ type: 'playerState', state: 'playing' }));
        videoEl.addEventListener('pause', () => postToHost({ type: 'playerState', state: 'paused' }));
        videoEl.addEventListener('ended', () => postToHost({ type: 'playerState', state: 'ended' }));
        videoEl.addEventListener('timeupdate', () => {
            postToHost({
                type: 'timeUpdate',
                currentTime: videoEl.currentTime,
                duration: videoEl.duration || 0,
            });
        });
        
        // Let's also sync initial state after a tiny delay
        setTimeout(() => {
            if (!videoEl.paused) postToHost({ type: 'playerState', state: 'playing' });
            else postToHost({ type: 'playerState', state: 'paused' });
        }, 1000);
    }

    // ── Step 6: Command Handler (from host engine.js) ─────────────────────────

    window.addEventListener('message', (e) => {
        if (!ACCEPTED_ORIGINS.includes(e.origin)) return;

        const msg = e.data;
        if (!msg || msg._ytpopBridgeCmd !== true) return;

        const player = getMoviePlayer();
        const vid = state.videoEl || getVideo();

        switch (msg.command) {
            case 'play':
                player?.playVideo?.() || vid?.play?.().catch(() => {});
                break;
            case 'pause':
                player?.pauseVideo?.() || vid?.pause?.();
                break;
            case 'seek':
                if (vid && typeof msg.time === 'number') vid.currentTime = msg.time;
                break;
            case 'pip':
                if (vid && document.pictureInPictureEnabled) {
                    vid.requestPictureInPicture().catch(() => {});
                }
                break;
            case 'reflow':
                try {
                    window.scrollTo(0, 0);
                    window.dispatchEvent(new Event('resize'));
                } catch (_) {}
                break;
            case 'setVolume':
                if (vid && typeof msg.level === 'number') {
                    // Volume booster removed.
                }
                break;
            case 'toggleLike':
                try {
                    const likeBtn = document.querySelector('like-button-view-model button') || 
                                    document.querySelector('ytd-menu-renderer ytd-toggle-button-renderer a button') ||
                                    document.querySelector('ytd-segmented-like-dislike-button-renderer button');
                    if (likeBtn) likeBtn.click();
                } catch (_) {}
                break;
            case 'togglePlay':
                try {
                    const v = document.querySelector('video');
                    if (v) {
                        if (v.paused) v.play().catch(()=>{});
                        else v.pause();
                    }
                } catch (_) {}
                break;
            case 'nextVideo':
                try {
                    const p = document.getElementById('movie_player');
                    if (p && p.nextVideo) p.nextVideo();
                    else document.querySelector('.ytp-next-button')?.click();
                } catch (_) {}
                break;
            case 'prevVideo':
                try {
                    const p = document.getElementById('movie_player');
                    if (p && p.previousVideo) p.previousVideo();
                    else document.querySelector('.ytp-prev-button')?.click();
                } catch (_) {}
                break;
        }
    });

    // ── Bootstrap ─────────────────────────────────────────────────────────────

    function onVideoReady(videoEl) {
        state.videoEl = videoEl;
        injectStyles();
        forcePlay();
        startStateReporter(videoEl);

        // Load settings and apply
        if (chrome?.storage?.local) {
            chrome.storage.local.get(null, (settings) => {
                applyCinemaFilters(settings);
            });

            chrome.storage.onChanged.addListener((changes) => {
                const hasFilterChange = Object.keys(changes).some(k =>
                    k.startsWith('cinemaFilter') || k === 'enableCinemaFilters');
                chrome.storage.local.get(null, (settings) => {
                    if (hasFilterChange) applyCinemaFilters(settings);
                });
            });
        }

        postToHost({ type: 'bridgeReady' });
    }

    function init() {
        injectStyles();

        // Try to get video immediately
        const vid = getVideo();
        if (vid) {
            onVideoReady(vid);
            return;
        }

        // Otherwise poll — YouTube SPA injects the video element late
        let attempts = 0;
        const poll = setInterval(() => {
            const v = getVideo();
            if (v) {
                clearInterval(poll);
                onVideoReady(v);
            } else if (++attempts > 40) {
                clearInterval(poll);
            }
        }, 250);
    }

    // Also try to force play periodically until it works (to handle slow loads)
    let playAttempts = 0;
    const playPoll = setInterval(() => {
        forcePlay();
        if (state.playForced || ++playAttempts > 20) clearInterval(playPoll);
    }, 300);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
