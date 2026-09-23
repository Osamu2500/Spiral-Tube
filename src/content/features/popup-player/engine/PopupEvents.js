export const PopupEvents = {
    _initMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'openPopup' && request.sourceUrl) {
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

    _initContextMenuListener() {
        document.addEventListener('contextmenu', (e) => {
            // Are we right-clicking a video player? (let YouTube handle it)
            const onPlayer = e.target.closest('.html5-video-player') || e.target.closest('video');
            if (onPlayer) return;

            // Ignore right-clicks on buttons or channel links
            if (e.target.closest('button, yt-icon-button, tp-yt-paper-icon-button, .ytd-channel-name, a[href*="/channel/"], a[href*="/@"]')) {
                return;
            }

            // Are we right-clicking a video card?
            let thumb = e.target.closest('ytd-thumbnail a#thumbnail, a.ytd-thumbnail, yt-lockup-view-model a[href], ytm-shorts-lockup-view-model a[href]');
            if (!thumb) {
                const cardContainer = e.target.closest('ytd-thumbnail, yt-lockup-view-model, ytm-shorts-lockup-view-model, ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
                if (cardContainer) {
                    thumb = e.target.closest('a[href]') || cardContainer.querySelector('a[href*="/watch?v="], a[href*="/shorts/"]');
                }
            }
            if (thumb && (!thumb.href || (!thumb.href.includes('/watch?v=') && !thumb.href.includes('/shorts/')))) {
                thumb = null;
            }

            if (thumb) {
                // We found a video card, intercept right-click
                e.preventDefault();
                e.stopPropagation();

                // Remove existing menu if any
                const existing = document.querySelector('.ytpop-ctx-menu');
                if (existing) existing.remove();

                // Create custom context menu
                const menu = document.createElement('div');
                menu.className = 'ytpop-ctx-menu';
                menu.style.position = 'fixed';
                
                // Ensure menu stays within viewport
                let left = e.clientX;
                let top = e.clientY;
                menu.style.left = left + 'px';
                menu.style.top = top + 'px';
                menu.style.zIndex = '999999';

                const item = document.createElement('div');
                item.className = 'ytpop-ctx-item';
                item.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> Open in Popup Player';
                item.addEventListener('click', () => {
                    menu.remove();
                    this.spawn(thumb.href);
                });
                
                const miniItem = document.createElement('div');
                miniItem.className = 'ytpop-ctx-item';
                miniItem.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><rect x="14" y="11" width="5" height="3" rx="1"></rect></svg> Open as Miniplayer';
                miniItem.addEventListener('click', async () => {
                    menu.remove();
                    await this.spawn(thumb.href);
                    this._enterMiniplayer();
                });

                const pipItem = document.createElement('div');
                pipItem.className = 'ytpop-ctx-item';
                pipItem.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><rect x="12" y="11" width="8" height="4" rx="1"></rect></svg> Open in Picture-in-Picture';
                pipItem.addEventListener('click', async () => {
                    menu.remove();
                    await this.spawn(thumb.href);
                    setTimeout(() => this._enterPiP(), 2000);
                });

                const tabItem = document.createElement('div');
                tabItem.className = 'ytpop-ctx-item';
                tabItem.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Open in New Tab';
                tabItem.addEventListener('click', () => {
                    menu.remove();
                    window.open(thumb.href, '_blank');
                });
                
                menu.appendChild(item);
                menu.appendChild(miniItem);
                menu.appendChild(pipItem);
                menu.appendChild(tabItem);
                document.body.appendChild(menu);

                // Adjust position if it flows off screen
                requestAnimationFrame(() => {
                    const rect = menu.getBoundingClientRect();
                    if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
                    if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 10) + 'px';
                });

                // Close on outside click or scroll
                const closeMenu = (evt) => {
                    if (!menu.contains(evt.target)) {
                        menu.remove();
                        document.removeEventListener('click', closeMenu);
                        document.removeEventListener('contextmenu', closeMenu);
                        document.removeEventListener('scroll', closeMenu, true);
                    }
                };
                
                setTimeout(() => {
                    document.addEventListener('click', closeMenu);
                    document.addEventListener('contextmenu', closeMenu);
                    document.addEventListener('scroll', closeMenu, true);
                }, 0);
            }
        }, true);
    }
};
