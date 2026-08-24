import { STATES } from './constants.js';
import { ObserverManager } from './observer-manager.js';
import { HoverSimulator } from './hover-simulator.js';
import { HeroManager } from './hero-manager.js';

export class CinematicController {
    constructor(settings) {
        this.settings = settings;
        this.state = {
            status: STATES.INITIALIZING,
            videoQueue: [],
            currentVideoIndex: 0,
            isMuted: settings?.cinematicMuted !== undefined ? settings.cinematicMuted : true,
            isUserHovering: false,
            videoTimer: null,
            postHoverTimer: null,
            activeHoverInterval: null,
            periodicTimer: null,
            previewWatcher: null,
            idleTimer: null,
            isIdle: false,
            simTimers: [],
        };

        this.hero = new HeroManager(this);
        this.observerManager = new ObserverManager();
        this.attachedHoverCards = new WeakSet();
    }

    simulateHover(element) {
        return HoverSimulator.simulateHover(this, element);
    }

    init() {
        document.documentElement.setAttribute('dark', '');
        document.body.classList.add('cinematic', 'cinematic-home');

        this._setupDrawerHiding();
        this._setupDarkModePersistence();

        this.setupEventDelegation();
        this.setupIdleDetection();
        this.setupKeyboardShortcuts();
        
        this.hero.create();
        this.initializeVideoPreview();
        this.setupScrollHandler();
    }

    _setupDrawerHiding() {
        const hideDrawer = () => {
            const appDrawer = document.querySelector('tp-yt-app-drawer');
            if (appDrawer) appDrawer.removeAttribute('opened');
        };
        hideDrawer();
        [100, 500, 1000, 2000, 3000].forEach(delay => setTimeout(hideDrawer, delay));
    }

    _setupDarkModePersistence() {
        const darkObserver = new MutationObserver(() => {
            if (!document.documentElement.hasAttribute('dark')) {
                document.documentElement.setAttribute('dark', '');
            }
        });
        darkObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dark'],
        });
        this.observerManager.addObserver(darkObserver);
    }

    destroy() {
        document.documentElement.removeAttribute('dark');
        document.body.classList.remove('cinematic', 'cinematic-home');
        
        this.hero.destroy();
        this.observerManager.cleanupAll();
        
        document.querySelectorAll('.netflix-active-preview').forEach(el => {
            el.classList.remove('netflix-active-preview');
        });
        
        this.state.status = STATES.INITIALIZING;
    }

    setupEventDelegation() {
        const contents = document.querySelector('#contents') || document.documentElement;
        
        contents.addEventListener('pointermove', (e) => {
            if (!e.isTrusted) return;

            const card = e.target.closest('ytd-rich-item-renderer');
            if (card) {
                if (card === this.state.killedCard && !this.state.isUserHovering) return;

                if (!this.state.isUserHovering || this.state.currentVideoIndex !== this.state.videoQueue.indexOf(card)) {
                    this.state.killedCard = null;
                    this.handleUserHoverStart(card);
                }
            } else {
                this.state.killedCard = null;
                if (this.state.isUserHovering) {
                    this.handleUserHoverEnd();
                }
            }
        }, { passive: true, capture: true });
        
        // Intercept all leave events to prevent native YouTube from stopping the video early
        const preventLeave = (e) => {
            if (!this.state.isUserHovering || !e.target.closest) return;
            const card = e.target.closest('ytd-rich-item-renderer');
            if (card && card.classList.contains('netflix-active-preview')) {
                if (e.relatedTarget && card.contains(e.relatedTarget)) return;
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.handleUserHoverEnd();
            }
        };
        
        contents.addEventListener('mouseleave', preventLeave, { capture: true });
        contents.addEventListener('mouseout', preventLeave, { capture: true });
        contents.addEventListener('pointerleave', preventLeave, { capture: true });
        contents.addEventListener('pointerout', preventLeave, { capture: true });
    }

    setupIdleDetection() {
        const resetIdle = () => {
            if (this.state.isIdle) {
                this.state.isIdle = false;
                if (!this.state.isUserHovering) {
                    this.playNextVideo();
                }
            }
            this.observerManager.clearTimeout(this.state.idleTimer);
            this.state.idleTimer = this.observerManager.addTimeout(setTimeout(() => {
                this.state.isIdle = true;
                this.observerManager.clearTimeout(this.state.videoTimer);
                this.releaseHeroVideo();
            }, 300000));
        };

        window.addEventListener('mousemove', resetIdle, { passive: true });
        window.addEventListener('keydown', resetIdle, { passive: true });
        window.addEventListener('scroll', resetIdle, { passive: true });
        resetIdle();
    }

    setupKeyboardShortcuts() {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input field
            const tag = e.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

            if (e.key === 'm' || e.key === 'M') {
                this.toggleMute();
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        // We can't easily remove this listener on destroy without a reference, 
        // but since cinematic mode is a singleton for the page lifecycle, it's fine.
    }

    handleUserHoverStart(card) {
        const index = this.state.videoQueue.indexOf(card);
        if (this.state.currentVideoIndex === index && card.classList.contains('netflix-active-preview')) {
            this.state.isUserHovering = true;
            this.state.status = STATES.USER_HOVERING;
            this.observerManager.clearTimeout(this.state.videoTimer);
            this.observerManager.clearTimeout(this.state.postHoverTimer);
            return;
        }
        if (this.state.isUserHovering && this.state.currentVideoIndex === index) return;

        this.state.isUserHovering = true;
        this.state.status = STATES.USER_HOVERING;
        
        this.observerManager.clearTimeout(this.state.videoTimer);
        this.observerManager.clearTimeout(this.state.postHoverTimer);
        
        this.releaseHeroVideo();
        this.state.currentVideoIndex = index !== -1 ? index : 0;
        this.hero.updateContent(card, this.state.isMuted, this.isRecentlyAdded.bind(this));

        card.classList.add('netflix-active-preview');
        card._isNetflixHeroPreview = true;

        HoverSimulator.simulateHover(this, card);
        setTimeout(() => { if (this.state.isUserHovering) HoverSimulator.simulateHover(this, card); }, 300);
        setTimeout(() => { if (this.state.isUserHovering) HoverSimulator.simulateHover(this, card); }, 800);
    }

    handleUserHoverEnd() {
        if (!this.state.isUserHovering) return;
        this.state.isUserHovering = false;
        this.state.status = STATES.AUTO_PLAYING;
        
        this.observerManager.clearTimeout(this.state.videoTimer);
        this.observerManager.clearTimeout(this.state.postHoverTimer);

        // Continue playing the current video preview for 12 seconds after cursor leaves
        this.state.postHoverTimer = this.observerManager.addTimeout(setTimeout(() => {
            this.releaseHeroVideo();
            this.playNextVideo();
        }, 12000));
    }

    setupPreviewWatcher() {
        if (this.state.previewWatcher) return;
        
        if (window.YPP && window.YPP.sharedObserver) {
            const watcherId = 'cinematic-preview-watcher';
            window.YPP.sharedObserver.register(watcherId, 'ytd-video-preview:not(.ypp-projected-preview)', () => {
                const heroElement = document.querySelector('.netflix-hero');
                if (!heroElement) return;
                
                let activePreview = document.querySelector(
                    'ytd-rich-item-renderer.netflix-active-preview ytd-video-preview:not(.ypp-projected-preview)'
                );

                if (!activePreview && document.querySelector('.netflix-active-preview')) {
                    const anyPreview = document.querySelector('ytd-video-preview:not(.ypp-projected-preview)');
                    if (anyPreview) {
                        activePreview = anyPreview;
                    }
                }
                
                if (activePreview) {
                    activePreview._yppOwnerCard = activePreview.closest('ytd-rich-item-renderer') || document.querySelector('.netflix-active-preview');
                    activePreview.classList.add('ypp-projected-preview');
                    const gradient = heroElement.querySelector('.netflix-hero-gradient');
                    if (gradient) {
                        heroElement.insertBefore(activePreview, gradient);
                    } else {
                        heroElement.appendChild(activePreview);
                    }
                    
                    if (!activePreview._yppLeaveBlocked) {
                        const blockLeave = (e) => {
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        };
                        activePreview.addEventListener('mouseleave', blockLeave, true);
                        activePreview.addEventListener('mouseout', blockLeave, true);
                        activePreview._yppLeaveBlocked = true;
                    }

                    this.syncMuteState();
                }
            }, false);
            
            // Mock observer for cleanup compatibility
            this.state.previewWatcher = { disconnect: () => window.YPP.sharedObserver.unregister(watcherId) };
            this.observerManager.addObserver(this.state.previewWatcher);
        } else {
            const observer = new MutationObserver(() => {
                const heroElement = document.querySelector('.netflix-hero');
                if (!heroElement) return;
                
                let activePreview = document.querySelector(
                    'ytd-rich-item-renderer.netflix-active-preview ytd-video-preview:not(.ypp-projected-preview)'
                );

                if (!activePreview && document.querySelector('.netflix-active-preview')) {
                    const anyPreview = document.querySelector('ytd-video-preview:not(.ypp-projected-preview)');
                    if (anyPreview) {
                        activePreview = anyPreview;
                    }
                }
                
                if (activePreview) {
                    activePreview._yppOwnerCard = activePreview.closest('ytd-rich-item-renderer') || document.querySelector('.netflix-active-preview');
                    activePreview.classList.add('ypp-projected-preview');
                    const gradient = heroElement.querySelector('.netflix-hero-gradient');
                    if (gradient) {
                        heroElement.insertBefore(activePreview, gradient);
                    } else {
                        heroElement.appendChild(activePreview);
                    }
                    
                    if (!activePreview._yppLeaveBlocked) {
                        const blockLeave = (e) => {
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        };
                        activePreview.addEventListener('mouseleave', blockLeave, true);
                        activePreview.addEventListener('mouseout', blockLeave, true);
                        activePreview._yppLeaveBlocked = true;
                    }

                    this.syncMuteState();
                }
            });
            
            this.state.previewWatcher = this.observerManager.addObserver(observer);
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    async initializeVideoPreview() {
        try {
            await this.waitForElement('ytd-rich-item-renderer');
            this.setupPreviewWatcher();
            
            this.updateVideoQueue();
            this.setupContentObserver();

            const firstValidVideo = this.state.videoQueue[0];
            if (firstValidVideo && !this.state.isUserHovering) {
                this.state.currentVideoIndex = 0;
                this.hero.updateContent(firstValidVideo, this.state.isMuted, this.isRecentlyAdded.bind(this));
                
                this.observerManager.clearTimeout(this.state.videoTimer);
                this.state.videoTimer = this.observerManager.addTimeout(setTimeout(() => this.playNextVideo(), 5000));
                this.state.status = STATES.AUTO_PLAYING;
            }
            
            this.setupPeriodicCheck();
        } catch (error) {
            console.error('[Cinematic] Initialization error:', error);
        }
    }

    playNextVideo() {
        if (this.state.isUserHovering || this.state.isIdle) return;

        if (this.hero.heroElement) this.hero.heroElement.classList.add('fading');

        setTimeout(() => {
            this.releaseHeroVideo();
            this.updateVideoQueue();

            let targetIndex = this.state.currentVideoIndex + 1;
            if (targetIndex >= this.state.videoQueue.length) {
                targetIndex = 0;
                const contents = document.querySelector('#contents');
                if (contents) contents.scrollLeft = 0;
            }

            this.state.currentVideoIndex = targetIndex;
            const nextVideo = this.state.videoQueue[targetIndex];

            if (!nextVideo) return;

            const contents = document.querySelector('#contents');
            if (contents) {
                const cardRect = nextVideo.getBoundingClientRect();
                if (cardRect.right > window.innerWidth || cardRect.left < 0) {
                    contents.scrollBy({ left: cardRect.left - 100, behavior: 'smooth' });
                }
            }

            this.hero.updateContent(nextVideo, this.state.isMuted, this.isRecentlyAdded.bind(this));

            if (this.hero.heroElement) this.hero.heroElement.classList.remove('fading');

            setTimeout(() => this.syncMuteState(), 100);
            this.updateMuteButtonVisibility();

            this.observerManager.clearTimeout(this.state.videoTimer);
            this.state.videoTimer = this.observerManager.addTimeout(setTimeout(() => this.playNextVideo(), 5000));
        }, 1250);
    }

    navigateVideo(direction) {
        if (this.state.isUserHovering) return;
        
        this.observerManager.clearTimeout(this.state.videoTimer);
        this.releaseHeroVideo();

        let newIndex = this.state.currentVideoIndex + (direction === 'next' ? 1 : -1);
        if (newIndex < 0) newIndex = this.state.videoQueue.length - 1;
        if (newIndex >= this.state.videoQueue.length) newIndex = 0;

        this.state.currentVideoIndex = newIndex;
        const targetVideo = this.state.videoQueue[newIndex];
        
        if (targetVideo) {
                this.hero.updateContent(targetVideo, this.state.isMuted, this.isRecentlyAdded.bind(this));
                setTimeout(() => this.syncMuteState(), 100);
            }

        this.state.videoTimer = this.observerManager.addTimeout(setTimeout(() => this.playNextVideo(), 10000));
    }

    releaseHeroVideo() {
        if (this.state.activeHoverInterval) {
            clearInterval(this.state.activeHoverInterval);
            this.state.activeHoverInterval = null;
        }

        document.querySelectorAll('.netflix-active-preview').forEach(el => {
            el.classList.remove('netflix-active-preview');
            el._isNetflixHeroPreview = false;
            
            const targets = [
                el,
                el.querySelector('ytd-thumbnail'),
                el.querySelector('#thumbnail'),
                el.querySelector('a#thumbnail'),
                el.querySelector('.yt-lockup-view-model-wiz__content-image')
            ].filter(Boolean);
            
            ['pointerout', 'pointerleave', 'mouseout', 'mouseleave'].forEach(eventType => {
                targets.forEach(target => {
                    try {
                        target.dispatchEvent(new PointerEvent(eventType, { bubbles: true, cancelable: true, view: window }));
                    } catch (e) {}
                    try {
                        target.dispatchEvent(new MouseEvent(eventType, { bubbles: true, cancelable: true, view: window }));
                    } catch (e) {}
                });
            });
        });

        document.querySelectorAll('ytd-video-preview').forEach(p => {
            const video = p.querySelector('video');
            if (video) {
                try {
                    video.pause();
                    video.currentTime = 0;
                } catch (e) {}
            }
            p.classList.remove('ypp-projected-preview');
            if (this.hero && this.hero.heroElement && p.parentElement === this.hero.heroElement) {
                const ownerCard = p.closest('ytd-rich-item-renderer') || p._yppOwnerCard;
                if (ownerCard && !document.documentElement.contains(ownerCard)) {
                    p.remove();
                } else {
                    document.body.appendChild(p);
                }
            }
        });
    }

    syncMuteState() {
        const preview = document.querySelector('ytd-video-preview');
        if (!preview) return;
        
        const video = preview.querySelector('video');
        const muteButton = preview.querySelector('yt-mute-toggle-button button, .ytp-mute-button');
        
        if (video) {
            if (!this.state.isMuted) {
                video.muted = false;
                video.volume = 0;
                let vol = 0;
                const fade = this.observerManager.addInterval(setInterval(() => {
                    vol += 0.1;
                    if (vol >= 1) {
                        video.volume = 1;
                        clearInterval(fade);
                    } else {
                        video.volume = vol;
                    }
                }, 50));
            } else {
                video.muted = true;
            }
        } else if (muteButton) {
            const isCurrentlyMuted = muteButton.getAttribute('aria-pressed') === 'false' || 
                                     muteButton.getAttribute('data-title-no-tooltip') === 'Unmute';
            
            if (this.state.isMuted !== isCurrentlyMuted) {
                muteButton.click();
            }
        }
    }

    updateMuteButtonVisibility() {
        if (!this.hero || !this.hero.uiElement) return;
        
        const preview = document.querySelector('ytd-video-preview');
        const unmuteBtn = this.hero.uiElement.querySelector('.netflix-unmute-button');
        
        if (unmuteBtn) {
            unmuteBtn.style.display = preview ? 'flex' : 'none';
        }
    }

    toggleMute() {
        this.state.isMuted = !this.state.isMuted;
        this.syncMuteState();
        
        const unmuteButton = document.querySelector('.netflix-unmute-button');
        if (unmuteButton) {
            unmuteButton.classList.toggle('muted', this.state.isMuted);
            this.hero.safeSetInnerHTML(
                unmuteButton,
                this.hero.generateMuteButtonHTML(this.state.isMuted)
            );
        }
    }

    attachButtonHandlers(container, videoElement) {
        if (container._handlersAttached) return;
        container._handlersAttached = true;

        const prevButton = container.querySelector('.netflix-nav-button.prev');
        const nextButton = container.querySelector('.netflix-nav-button.next');
        const playButton = container.querySelector('.netflix-play-button');
        const unmuteButton = container.querySelector('.netflix-unmute-button');

        if (prevButton) prevButton.addEventListener('click', () => this.navigateVideo('prev'));
        if (nextButton) nextButton.addEventListener('click', () => this.navigateVideo('next'));
        
        if (playButton) {
            playButton.addEventListener('click', () => {
                const videoId = this.hero.extractMetadata(videoElement).videoId;
                if (videoId) window.location.href = `/watch?v=${videoId}`;
            });
        }
        
        if (unmuteButton) {
            unmuteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMute();
            });
        }
    }

    updateVideoQueue() {
        let items = Array.from(document.querySelectorAll(
            'ytd-rich-grid-renderer ytd-rich-item-renderer, #contents ytd-rich-item-renderer'
        ));
        items = items.filter(item => {
            const isHidden = item.closest('[hidden]') ||
                             item.style.display === 'none' ||
                             window.getComputedStyle(item).display === 'none' ||
                             item.hasAttribute('data-ypp-mix') ||
                             item.closest('[data-ypp-mix="true"]') != null ||
                             item.classList.contains('ypp-is-mix') ||
                             item.classList.contains('ypp-is-watched') ||
                             item.classList.contains('ypp-hidden-duration') ||
                             item.classList.contains('ypp-hidden-channel');
            const isAd = item.querySelector('.badge-style-type-ad') != null;
            const isShorts = item.querySelector('[overlay-style="SHORTS"]') != null ||
                             item.closest('ytd-rich-shelf-renderer[is-shorts]');
            const isMix = item.querySelector('a[href*="list="], a[href*="start_radio"], ytd-radio-renderer, yt-collection-thumbnail-view-model, yt-collections-stack, [overlay-style="PLAYLIST"], [overlay-style="MIX"], .yt-lockup-view-model-wiz__collection-stack') != null ||
                          Array.from(item.querySelectorAll('ytd-thumbnail-overlay-bottom-panel-renderer, ytd-badge-supported-renderer, .badge-shape-wiz__text, #video-title, #video-title-link, .yt-lockup-view-model-wiz__title')).some(b => {
                              const txt = b && b.textContent && b.textContent.trim().toLowerCase();
                              return txt === 'mix' || (txt && (txt.startsWith('mix - ') || txt.includes('youtube mix') || txt.includes('my mix')));
                          });
            if (isMix) {
                item.setAttribute('data-ypp-mix', 'true');
                item.classList.add('ypp-is-mix');
            }
            const hasVideoLink = item.querySelector('#video-title-link, a#video-title, a#thumbnail, a[href*="/watch?v="]');
            return !isHidden && !isAd && !isShorts && !isMix && hasVideoLink;
        });

        const queueUnchanged = items.length === this.state.videoQueue.length &&
                               items.every((item, idx) => item === this.state.videoQueue[idx]);
        if (queueUnchanged) return;

        this.state.videoQueue = items;
        this.state.currentVideoIndex = 0;
        this.observerManager.clearTimeout(this.state.videoTimer);
        if (this.state.simTimers) {
            this.state.simTimers.forEach(t => this.observerManager.clearTimeout(t));
        }
        this.state.simTimers = [];

        items.forEach((video, index) => {
            if (!this.attachedHoverCards.has(video)) {
                this.attachedHoverCards.add(video);
                video.addEventListener('mouseenter', (e) => {
                    if (!e.isTrusted) return; 
                    this.handleUserHoverStart(video);
                }, { capture: true });
                video.addEventListener('mouseleave', (e) => {
                    if (!e.isTrusted) return;
                    this.handleUserHoverEnd();
                }, { capture: true });
            }
        });

        const firstVideo = items[0];
        if (firstVideo && !this.state.isUserHovering) {
            this.releaseHeroVideo();
            firstVideo.classList.add('netflix-active-preview');
            this.hero.updateContent(firstVideo, this.state.isMuted, this.isRecentlyAdded.bind(this));
            HoverSimulator.startActiveHoverSimulation(this, firstVideo, this.observerManager);
            this.state.simTimers.push(
                this.observerManager.addTimeout(setTimeout(() => { if (!this.state.isUserHovering) HoverSimulator.startActiveHoverSimulation(this, firstVideo, this.observerManager); }, 800)),
                this.observerManager.addTimeout(setTimeout(() => { if (!this.state.isUserHovering) HoverSimulator.startActiveHoverSimulation(this, firstVideo, this.observerManager); }, 2000)),
                this.observerManager.addTimeout(setTimeout(() => { if (!this.state.isUserHovering) HoverSimulator.startActiveHoverSimulation(this, firstVideo, this.observerManager); }, 4000))
            );
            this.state.videoTimer = this.observerManager.addTimeout(
                setTimeout(() => this.playNextVideo(), 5000)
            );
        }
    }

    setupContentObserver() {
        const grid = document.querySelector('ytd-rich-grid-renderer') || document.querySelector('#contents');
        if (!grid) return;

        const chipBar = document.querySelector('ytd-feed-filter-chip-bar-renderer');
        if (chipBar && !chipBar._topicSwitchListenerAttached) {
            chipBar._topicSwitchListenerAttached = true;
            chipBar.addEventListener('click', () => {
                setTimeout(() => this.updateVideoQueue(), 400);
                setTimeout(() => this.updateVideoQueue(), 1000);
            });
        }

        let debounceTimer;
        const observer = new MutationObserver(() => {
            this.observerManager.clearTimeout(debounceTimer);
            debounceTimer = this.observerManager.addTimeout(setTimeout(() => {
                this.updateVideoQueue();
            }, 300));
        });
        
        this.observerManager.addObserver(observer);
        observer.observe(grid, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-ypp-mix', 'class', 'hidden', 'style']
        });
    }

    setupPeriodicCheck() {
        this.state.periodicTimer = this.observerManager.addInterval(setInterval(() => {
            if (!this.state.isUserHovering && !this.state.isIdle) {
                const activePreview = document.querySelector('ytd-video-preview[active][playing]:not([hidden])');
                if (!activePreview) {
                    const currentVideo = this.state.videoQueue[this.state.currentVideoIndex];
                    if (currentVideo) {
                        if (!currentVideo.classList.contains('netflix-active-preview')) {
                            currentVideo.classList.add('netflix-active-preview');
                            currentVideo._isNetflixHeroPreview = true;
                        }
                        HoverSimulator.simulateHover(this, currentVideo);
                    }
                }
            }
        }, 3000));
    }

    setupScrollHandler() {
        const scrollHandler = (e) => {
            const contents = document.querySelector('#contents');
            if (contents) {
                e.preventDefault();
                contents.scrollLeft += (Math.abs(e.deltaX) > Math.abs(e.deltaY)) ? e.deltaX : e.deltaY;
            }
        };
        document.body.addEventListener('wheel', scrollHandler, { passive: false });

        const keyboardHandler = (e) => {
            const contents = document.querySelector('#contents');
            if (!contents) return;
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateVideo('prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateVideo('next');
                    break;
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    contents.scrollLeft += 70;
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    contents.scrollLeft -= 70;
                    break;
            }
        };
        document.addEventListener('keydown', keyboardHandler);
    }

    isRecentlyAdded(element) {
        const metadataItems = element.querySelectorAll('#metadata-line .inline-metadata-item');
        const timeEl = Array.from(metadataItems).find(i => i.textContent.toLowerCase().includes('ago'));
        const match = timeEl?.textContent?.toLowerCase().match(/(\d+)\s+(minute|hour|day)s?\s+ago/);
        if (!match) return false;
        const [, count, unit] = match;
        return unit === 'minute' || unit === 'hour' || (unit === 'day' && parseInt(count, 10) <= 2);
    }

    waitForElement(selector) {
        return new Promise(resolve => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);

            if (window.YPP && window.YPP.sharedObserver) {
                const observerId = 'cinematic-wait-' + Date.now() + Math.random();
                window.YPP.sharedObserver.register(observerId, selector, (elements) => {
                    window.YPP.sharedObserver.unregister(observerId);
                    resolve(elements[0]);
                }, true); // immediate = true
            } else {
                const observer = new MutationObserver(() => {
                    const found = document.querySelector(selector);
                    if (found) {
                        observer.disconnect();
                        resolve(found);
                    }
                });
                observer.observe(document.documentElement, { childList: true, subtree: true });
            }
        });
    }
}
