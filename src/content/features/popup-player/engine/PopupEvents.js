export const PopupEvents = {
    _isEnabled: false,
    _openTrigger: 'both',

    _initSettingsListener() {
        chrome.storage.local.get('settings', (data) => {
            const settings = data.settings || {};
            this._isEnabled = settings.floatingPlayer ?? false;
            this._openTrigger = settings.popupOpenTrigger ?? 'both';
        });

        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'local' && changes.settings) {
                const newSettings = changes.settings.newValue || {};
                if (newSettings.floatingPlayer !== undefined) {
                    this._isEnabled = newSettings.floatingPlayer;
                }
                if (newSettings.popupOpenTrigger !== undefined) {
                    this._openTrigger = newSettings.popupOpenTrigger;
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

        window.addEventListener('message', (e) => {
            if (!e.data || !e.data._ytpopBridge) return;
            
            if (e.data.type === 'timeUpdate' && this.currentVideoId) {
                chrome.storage.local.get('settings', (data) => {
                    const settings = data.settings || {};
                    if (settings.videoResumer && e.data.currentTime > 5 && chrome.storage.sync) {
                        const key = 'ypp_resume_' + this.currentVideoId;
                        const saveData = JSON.stringify({ 
                            time: e.data.currentTime, 
                            duration: e.data.duration || 0, 
                            savedAt: Date.now(),
                            title: 'Popup Video',
                            channel: 'YouTube',
                            thumbnail: `https://i.ytimg.com/vi/${this.currentVideoId}/mqdefault.jpg`,
                            categoryId: null
                        });
                        chrome.storage.sync.set({ [key]: saveData });
                    }
                });
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
                chrome.storage.local.get('settings', (data) => {
                    const settings = data.settings || {};
                    if (settings.autoMiniOnScroll && !entry.isIntersecting && !this.overlay) {
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
        const injectButtons = () => {
            if (!this._isEnabled || this._openTrigger === 'double-click') return;

            const thumbs = document.querySelectorAll('ytd-thumbnail, ytm-shorts-lockup-view-model, ytd-reel-item-renderer, yt-lockup-view-model, yt-lockup-thumbnail');
            thumbs.forEach(container => {
                // Find the target to append to
                let targetAppend = container;
                if (container.tagName === 'YTD-REEL-ITEM-RENDERER') {
                    targetAppend = container.querySelector('ytd-thumbnail, #thumbnail-container') || container;
                } else if (container.tagName === 'YT-LOCKUP-VIEW-MODEL') {
                    targetAppend = container.querySelector('yt-lockup-thumbnail') || container;
                }

                if (targetAppend.querySelector('.ytpop-hover-btn')) return; // Already injected

                // Ensure there's a valid video link
                const anchor = container.querySelector('a#thumbnail, a[href*="/watch?v="], a[href*="/shorts/"]') || container.closest('a[href*="/watch?v="], a[href*="/shorts/"]');
                if (!anchor || !anchor.href) return;

                const hoverBtn = document.createElement('div');
                hoverBtn.className = 'ytpop-hover-btn';
                hoverBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 7 L4 17 L20 17 Z" /></svg>`;
                
                hoverBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.spawn(anchor.href);
                });

                if (getComputedStyle(targetAppend).position === 'static') {
                    targetAppend.style.position = 'relative';
                }

                targetAppend.appendChild(hoverBtn);
            });
        };

        // Run injection periodically to catch new cards
        setInterval(injectButtons, 1500);
        document.addEventListener('yt-page-data-updated', injectButtons);
        document.addEventListener('yt-navigate-finish', injectButtons);
    }
};
