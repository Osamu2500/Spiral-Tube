export const PopupEvents = {
    _isEnabled: false,
    _openTrigger: 'both',

    _initSettingsListener() {
        chrome.storage.local.get({ floatingPlayer: false, popupOpenTrigger: 'both' }, (data) => {
            this._isEnabled = data.floatingPlayer;
            this._openTrigger = data.popupOpenTrigger;
        });

        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'local') {
                if (changes.floatingPlayer !== undefined) {
                    this._isEnabled = changes.floatingPlayer.newValue;
                }
                if (changes.popupOpenTrigger !== undefined) {
                    this._openTrigger = changes.popupOpenTrigger.newValue;
                }
            }
        });
    },

    _initMessageListener() {
        this._initSettingsListener();
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'openPopup' && request.sourceUrl) {
                if (!this._isEnabled) return;
                this.spawn(request.sourceUrl);
                sendResponse({ success: true });
            }
        });
    },

    _initDoubleClickListener() {
        let clickTimer = null;
        let lastTarget = null;
        let isSimulated = false;

        // We must intercept clicks in the capture phase to beat YouTube's SPA router
        document.addEventListener('click', (e) => {
            if (!this._isEnabled || this._openTrigger === 'hover') return;
            
            // Let simulated single-clicks pass through to YouTube
            if (isSimulated || !e.isTrusted) {
                isSimulated = false;
                return;
            }

            // Ignore clicks inside our own popup or if it's a right click
            if (e.target.closest('.ytpop-overlay') || e.button !== 0) return;

            // Are we clicking the video player or a thumbnail?
            const onPlayer = e.target.closest('.html5-video-player') || e.target.closest('video');
            
            // Ignore clicks on buttons, channel links, or custom UI
            if (e.target.closest('button, yt-icon-button, tp-yt-paper-icon-button, .ytd-channel-name, a[href*="/channel/"], a[href*="/@"]')) {
                return;
            }

            // Modern YouTube uses yt-lockup-view-model instead of just ytd-thumbnail
            let thumb = e.target.closest('ytd-thumbnail a#thumbnail, a.ytd-thumbnail, yt-lockup-view-model a[href], ytm-shorts-lockup-view-model a[href]');
            
            // Fallback: if we clicked anywhere inside a video card container, try to find the video anchor
            if (!thumb) {
                const cardContainer = e.target.closest('ytd-thumbnail, yt-lockup-view-model, ytm-shorts-lockup-view-model, ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
                if (cardContainer) {
                    thumb = e.target.closest('a[href]') || cardContainer.querySelector('a[href*="/watch?v="], a[href*="/shorts/"]');
                }
            }
            
            // Ensure the found anchor actually points to a video
            if (thumb && (!thumb.href || (!thumb.href.includes('/watch?v=') && !thumb.href.includes('/shorts/')))) {
                thumb = null;
            }

            if (!onPlayer && !thumb) {
                // Not a relevant target, clear any pending timer
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    lastTarget = null;
                }
                return;
            }

            const targetUrl = onPlayer ? window.location.href : thumb.href;
            if (!targetUrl) return;

            // Intercept the click so YouTube doesn't navigate immediately
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Store the original target so we can simulate the click on it later
            const clickedElement = e.target;

            if (clickTimer && lastTarget === targetUrl) {
                // --- DOUBLE CLICK DETECTED ---
                clearTimeout(clickTimer);
                clickTimer = null;
                lastTarget = null;
                this.spawn(targetUrl);
            } else {
                // --- FIRST CLICK DETECTED ---
                // Clear any existing timer for a different target
                if (clickTimer) clearTimeout(clickTimer);
                
                lastTarget = targetUrl;
                
                // Wait 280ms to see if a second click comes
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                    lastTarget = null;
                    // --- SINGLE CLICK CONFIRMED ---
                    // Re-dispatch a click event to let YouTube handle it
                    isSimulated = true;
                    // Note: YouTube's Polymer router usually works fine with element.click()
                    // or dispatching a synthetic MouseEvent.
                    clickedElement.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: e.clientX,
                        clientY: e.clientY
                    }));
                }, 280);
            }
        }, true);
    },

    _initScrollObserver() {
        const tryObserve = () => {
            const el = document.querySelector('#player-container, #ytd-player');
            if (!el) { setTimeout(tryObserve, 2000); return; }

            this.scrollObserver = new IntersectionObserver((entries) => {
                const entry = entries[0];
                chrome.storage.local.get({ autoMiniOnScroll: false }, (data) => {
                    if (data.autoMiniOnScroll && !entry.isIntersecting && !this.overlay) {
                        const vid = document.querySelector('video');
                        if (vid && vid.readyState > 1 && !vid.paused) {
                            this.spawn(window.location.href);
                        }
                    }
                });
            }, { threshold: 0.1 });

            this.scrollObserver.observe(el);
        };
        tryObserve();
    },

    _initHoverButtonListener() {
        // Hover button removed — it was causing a ghost element to appear
        // in the top-left of the homepage on load. The popup player can still
        // be opened via double-click on any thumbnail (when trigger is 'both' or 'double-click').
    }
};
