/**
 * Cinematic Mode — Netflix-style home feed overlay.
 * Monolithic file combining ObserverManager, HoverSimulator, HeroManager, CinematicController, and CinematicMode.
 */
import cinematicThemeCSS from './cinematic-theme.css?raw';

const CONFIG = {
    HOME_PATHS: ['/', '/index.html', '/feed/subscriptions'],
};

const STATES = {
    INITIALIZING: 'INITIALIZING',
    IDLE: 'IDLE',
    AUTO_PLAYING: 'AUTO_PLAYING',
    USER_HOVERING: 'USER_HOVERING'
};

class ObserverManager {
    constructor() {
        this.observers = new Set();
        this.intervals = new Set();
        this.timeouts = new Set();
    }

    addObserver(observer) {
        this.observers.add(observer);
        return observer;
    }

    addInterval(intervalId) {
        this.intervals.add(intervalId);
        return intervalId;
    }

    addTimeout(timeoutId) {
        this.timeouts.add(timeoutId);
        return timeoutId;
    }

    clearInterval(intervalId) {
        clearInterval(intervalId);
        this.intervals.delete(intervalId);
    }

    clearTimeout(timeoutId) {
        clearTimeout(timeoutId);
        this.timeouts.delete(timeoutId);
    }

    cleanupAll() {
        this.observers.forEach(obs => obs.disconnect());
        this.observers.clear();

        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();

        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();
    }
}

class HoverSimulator {
    static simulateHover(controller, element) {
        if (!element) return Promise.reject('No element provided');

        document.querySelectorAll('.netflix-active-preview').forEach(el => {
            if (el !== element) {
                el._isNetflixHeroPreview = false;
            }
        });
        element._isNetflixHeroPreview = true;
        element.classList.add('netflix-active-preview');

        if (!element._hoverLock) {
            const blockLeave = (e) => {
                if (element._isNetflixHeroPreview) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            };
            element.addEventListener('mouseleave', blockLeave, true);
            element.addEventListener('mouseout', blockLeave, true);
            const thumb = element.querySelector('#thumbnail, ytd-thumbnail, a#thumbnail');
            if (thumb) {
                thumb.addEventListener('mouseleave', blockLeave, true);
                thumb.addEventListener('mouseout', blockLeave, true);
            }
            element._hoverLock = true;
        }

        const MAX_RETRIES = 3;
        const RETRY_DELAY = 250;

        const attemptHover = (retryCount = 0) => {
            return new Promise(resolve => {
                const thumbnailContainer = element.querySelector('#thumbnail');

                if (!thumbnailContainer && retryCount < MAX_RETRIES) {
                    setTimeout(() => {
                        resolve(attemptHover(retryCount + 1));
                    }, RETRY_DELAY);
                    return;
                }

                if (!thumbnailContainer) {
                    resolve();
                    return;
                }

                setTimeout(() => {
                    const targets = [
                        element,
                        element.querySelector('ytd-thumbnail'),
                        element.querySelector('#thumbnail'),
                        element.querySelector('a#thumbnail'),
                        element.querySelector('.yt-lockup-view-model-wiz__content-image'),
                        element.querySelector('yt-image')
                    ].filter(Boolean);

                    const eventTypes = [
                        'pointerover',
                        'pointerenter',
                        'pointermove',
                        'mouseover',
                        'mouseenter',
                        'mousemove'
                    ];

                    eventTypes.forEach(eventType => {
                        targets.forEach(target => {
                            const rect = target.getBoundingClientRect();
                            const clientX = rect.width > 0 ? rect.left + rect.width / 2 : 200;
                            const clientY = rect.height > 0 ? rect.top + rect.height / 2 : 450;
                            try {
                                target.dispatchEvent(
                                    new PointerEvent(eventType, {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window,
                                        pointerId: 1,
                                        pointerType: 'mouse',
                                        isPrimary: true,
                                        clientX,
                                        clientY
                                    })
                                );
                            } catch (e) {}
                            try {
                                target.dispatchEvent(
                                    new MouseEvent(eventType, {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window,
                                        clientX,
                                        clientY
                                    })
                                );
                            } catch (e) {}
                        });
                    });

                    setTimeout(() => {
                        if (controller && !controller.state.isMuted && typeof controller.syncMuteState === 'function') {
                            controller.syncMuteState();
                        }
                        if (controller && typeof controller.updateMuteButtonVisibility === 'function') {
                            controller.updateMuteButtonVisibility();
                        }
                        resolve();
                    }, 1000);
                }, 100);
            });
        };

        return attemptHover();
    }

    static startActiveHoverSimulation(controller, element, observerManager) {
        if (controller.state.activeHoverInterval) {
            clearInterval(controller.state.activeHoverInterval);
            controller.state.activeHoverInterval = null;
        }
        if (!element) return;

        element.classList.add('netflix-active-preview');
        element._isNetflixHeroPreview = true;

        this.simulateHover(controller, element);

        controller.state.activeHoverInterval = setInterval(() => {
            if (!element || !element.classList.contains('netflix-active-preview')) {
                if (controller.state.activeHoverInterval) {
                    clearInterval(controller.state.activeHoverInterval);
                    controller.state.activeHoverInterval = null;
                }
                return;
            }
            const hasPreview = document.querySelector('ytd-video-preview[active][playing]:not([hidden])');
            const targets = [
                element,
                element.querySelector('ytd-thumbnail'),
                element.querySelector('#thumbnail'),
                element.querySelector('a#thumbnail'),
                element.querySelector('.yt-lockup-view-model-wiz__content-image'),
                element.querySelector('yt-image')
            ].filter(Boolean);

            const events = hasPreview
                ? ['pointermove', 'mousemove']
                : ['pointerover', 'pointerenter', 'pointermove', 'mouseover', 'mouseenter', 'mousemove'];

            events.forEach(eventType => {
                targets.forEach(target => {
                    const rect = target.getBoundingClientRect();
                    const clientX = rect.width > 0 ? rect.left + rect.width / 2 : 200;
                    const clientY = rect.height > 0 ? rect.top + rect.height / 2 : 450;
                    try {
                        target.dispatchEvent(
                            new PointerEvent(eventType, {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                pointerId: 1,
                                pointerType: 'mouse',
                                isPrimary: true,
                                clientX,
                                clientY
                            })
                        );
                    } catch (e) {}
                    try {
                        target.dispatchEvent(
                            new MouseEvent(eventType, {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                clientX,
                                clientY
                            })
                        );
                    } catch (e) {}
                });
            });
        }, 1000);
    }
}

class HeroManager {
    constructor(controller) {
        this.controller = controller;
        this.heroElement = null;
        this.status = 'inactive';
        this._previewChangeObserver = null;
    }

    create() {
        if (this.status !== 'inactive') return;
        this.status = 'creating';

        const heroWrapper = document.createElement('div');
        heroWrapper.className = 'netflix-hero fading';
        this.heroElement = heroWrapper;

        const bgContainer = document.createElement('div');
        bgContainer.className = 'netflix-hero-bg-container';
        heroWrapper.appendChild(bgContainer);

        const gradient = document.createElement('div');
        gradient.className = 'netflix-hero-gradient';
        heroWrapper.appendChild(gradient);

        const uiWrapper = document.createElement('div');
        uiWrapper.className = 'netflix-hero-ui fading';
        this.uiElement = uiWrapper;

        const contentOverlay = document.createElement('div');
        contentOverlay.className = 'netflix-hero-content';
        uiWrapper.appendChild(contentOverlay);

        const hideNativeVolume = document.createElement('style');
        hideNativeVolume.textContent = '.ytp-mute-button, .ytp-volume-area { display: none !important; }';
        heroWrapper.appendChild(hideNativeVolume);

        document.body.appendChild(heroWrapper);
        document.body.appendChild(uiWrapper);
        this.status = 'ready';

        this._setupPreviewChangeObserver();

        requestAnimationFrame(() => {
            if (this.heroElement === heroWrapper) {
                heroWrapper.classList.remove('fading');
            }
            if (this.uiElement === uiWrapper) {
                uiWrapper.classList.remove('fading');
            }
        });
    }

    _setupPreviewChangeObserver() {
        if (this._previewChangeObserver) return;

        let _lastHoveredCard = null;
        let _debounceTimer = null;

        this._previewChangeObserver = new MutationObserver((mutations) => {
            const isPreviewMutation = mutations.some(m =>
                m.target.tagName && m.target.tagName.toLowerCase() === 'ytd-video-preview'
            );
            if (!isPreviewMutation) return;

            clearTimeout(_debounceTimer);
            _debounceTimer = setTimeout(() => {
                const hoveredVideo = document.querySelector('ytd-rich-item-renderer:hover');

                if (hoveredVideo) {
                    if (hoveredVideo === _lastHoveredCard) return;
                    _lastHoveredCard = hoveredVideo;

                    this.controller.state.isUserHovering = true;
                    clearTimeout(this.controller.state.videoTimer);

                    if (!hoveredVideo.classList.contains('netflix-active-preview')) {
                        document.querySelectorAll('.netflix-active-preview').forEach(el => {
                            el.classList.remove('netflix-active-preview');
                            el._isNetflixHeroPreview = false;
                        });
                        hoveredVideo.classList.add('netflix-active-preview');
                        hoveredVideo._isNetflixHeroPreview = true;
                    }

                    this.updateContent(
                        hoveredVideo,
                        this.controller.state.isMuted,
                        this.controller.isRecentlyAdded.bind(this.controller)
                    );
                } else {
                    if (this.controller.state.isUserHovering) {
                        _lastHoveredCard = null;
                        this.controller.state.isUserHovering = false;

                        const currentVideo = this.controller.state.videoQueue[this.controller.state.currentVideoIndex];
                        if (currentVideo) {
                            this.updateContent(
                                currentVideo,
                                this.controller.state.isMuted,
                                this.controller.isRecentlyAdded.bind(this.controller)
                            );
                            setTimeout(() => {
                                this.controller.simulateHover(currentVideo);
                                this.controller.state.videoTimer = this.controller.observerManager.addTimeout(
                                    setTimeout(() => this.controller.playNextVideo(), 12000)
                                );
                            }, 50);
                        }
                    }
                }
            }, 200);
        });

        this._previewChangeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['active', 'playing', 'hidden'],
            subtree: true,
        });
    }

    destroy() {
        if (this.status === 'inactive') return;
        this.status = 'destroying';

        if (this._previewChangeObserver) {
            this._previewChangeObserver.disconnect();
            this._previewChangeObserver = null;
        }

        this.heroElement?.remove();
        this.uiElement?.remove();
        this.heroElement = null;
        this.uiElement = null;
        this.status = 'inactive';
    }

    extractMetadata(videoElement) {
        let videoId = null;
        const links = videoElement.querySelectorAll('a#video-title-link, a#video-title, a#thumbnail, a.yt-lockup-view-model-wiz__content-image, a[href*="/watch?v="]');
        for (const link of links) {
            if (link.href) {
                const match = link.href.match(/[?&]v=([^&]+)/) || link.href.match(/\/shorts\/([^?]+)/);
                if (match && match[1]) {
                    videoId = match[1];
                    break;
                }
            }
        }

        const extractTitle = (videoEl) => {
            const selectors = [
                '#video-title-link yt-formatted-string',
                '#video-title-link',
                '#video-title',
                'a[href*="/watch?v="] #video-title',
                'h3 a',
                '.yt-lockup-metadata-view-model-wiz__title',
                '[id*="video-title"]',
                '[title]'
            ];
            for (const sel of selectors) {
                const els = videoEl.querySelectorAll(sel);
                for (const el of els) {
                    const text = el.textContent?.trim() || el.getAttribute('title')?.trim();
                    if (text && text !== 'Video Title' && text.length > 0) {
                        return text;
                    }
                }
            }
            return null;
        };

        const extractChannelName = (videoEl, currentTitle) => {
            const selectors = [
                'ytd-channel-name a',
                '#text.ytd-channel-name',
                'ytd-channel-name yt-formatted-string',
                '#channel-name a',
                '#channel-name',
                'yt-formatted-string.ytd-channel-name',
                'ytd-channel-name',
                '.yt-lockup-metadata-view-model-wiz__sub-title',
                '.yt-core-attributed-string--link-inherit-color',
                'ytd-video-meta-block yt-formatted-string',
                'ytd-video-meta-block a',
                'a[href*="/@"]',
                'a[href*="/channel/"]',
                'a[href*="/c/"]',
                'a[href*="/user/"]'
            ];
            for (const sel of selectors) {
                const els = videoEl.querySelectorAll(sel);
                for (const el of els) {
                    const text = el.textContent?.trim() || el.getAttribute('title')?.trim();
                    if (text && text !== 'Channel Name' && text !== 'Video Title' && text.length > 0) {
                        if (text !== currentTitle) {
                            return text;
                        }
                    }
                }
            }
            return null;
        };

        const title = extractTitle(videoElement);
        const channelName = extractChannelName(videoElement, title);
        
        const avatarEl = videoElement.querySelector('yt-img-shadow img, yt-avatar-shape img, #avatar-link img, ytd-channel-name img');
        const avatar = avatarEl?.src || null;

        return { videoId, title, channelName, avatar };
    }

    updateContent(videoElement, isMuted, isRecentlyAdded, retryCount = 0) {
        if (this.status !== 'ready' || !this.heroElement) return;

        const metadata = this.extractMetadata(videoElement);
        
        if (metadata.videoId) {
            this.applyCrossFadeBackground(`url('https://i.ytimg.com/vi/${metadata.videoId}/maxresdefault.jpg')`);
        }
        
        if (!metadata.title || !metadata.channelName) {
            if (retryCount < 15) {
                setTimeout(() => this.updateContent(videoElement, isMuted, isRecentlyAdded, retryCount + 1), 200);
                return;
            }
        }
        
        metadata.title = metadata.title || 'Featured Video';
        metadata.channelName = metadata.channelName || 'YouTube Creator';

        const contentOverlay = this.uiElement ? this.uiElement.querySelector('.netflix-hero-content') : null;
        if (!contentOverlay) return;

        const content = {
            ...metadata,
            isRecent: isRecentlyAdded(videoElement)
        };
        
        delete contentOverlay._handlersAttached;

        this.safeSetInnerHTML(contentOverlay, this.generateHeroHTML(content, isMuted));
        this.controller.attachButtonHandlers(contentOverlay, videoElement);
    }

    applyCrossFadeBackground(newBgUrl) {
        const bgContainer = this.heroElement.querySelector('.netflix-hero-bg-container');
        if (!bgContainer) return;

        const existingLayers = bgContainer.querySelectorAll('.netflix-hero-bg-layer');
        const lastLayer = existingLayers[existingLayers.length - 1];
        if (lastLayer) {
            const currentBg = lastLayer.style.backgroundImage.replace(/['"]/g, '');
            const targetBg = newBgUrl.replace(/['"]/g, '');
            if (currentBg === targetBg) return;
        }

        const newLayer = document.createElement('div');
        newLayer.className = 'netflix-hero-bg-layer';
        newLayer.style.backgroundImage = newBgUrl;
        
        bgContainer.appendChild(newLayer);

        newLayer.offsetHeight;
        newLayer.style.opacity = '1';

        setTimeout(() => {
            const layers = bgContainer.querySelectorAll('.netflix-hero-bg-layer');
            if (layers.length > 1) {
                for (let i = 0; i < layers.length - 1; i++) {
                    layers[i].remove();
                }
            }
        }, 1000);
    }

    generateHeroHTML(content, isMuted) {
        return `
        <div class="channel-info">
            ${content.avatar ? `<img src="${content.avatar}" alt="Channel avatar" class="channel-avatar" onerror="this.style.display='none'">` : ''}
            <span class="channel-name">${content.channelName}</span>
        </div>
        <h1>${content.title}</h1>
        ${content.isRecent ? '<div class="recently-added-badge">Recently Added</div>' : ''}
        <div class="netflix-hero-buttons">
          <button class="netflix-play-button">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
            Play
          </button>
          <button class="netflix-unmute-button ${isMuted ? 'muted' : ''}">
            ${this.generateMuteButtonHTML(isMuted)}
          </button>
        </div>
        <div class="netflix-hero-nav">
          <button class="netflix-nav-button prev" aria-label="Previous video">
            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
          </button>
          <button class="netflix-nav-button next" aria-label="Next video">
            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
          </button>
        </div>
        `;
    }

    generateMuteButtonHTML(isMuted) {
        return isMuted 
            ? `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/></svg> Mute`
            : `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg> Unmute`;
    }

    safeSetInnerHTML(element, html) {
        if (!element || typeof html !== 'string') return;
        try {
            element.innerHTML = html;
        } catch (e) {
            console.error('[Cinematic] InnerHTML assignment failed:', e);
        }
    }
}

class CinematicController {
    constructor(settings) {
        this.settings = settings;
        this.state = {
            status: STATES.INITIALIZING,
            videoQueue: [],
            currentVideoIndex: 0,
            isMuted: settings?.cinematicMuted !== undefined ? settings.cinematicMuted : true,
            isUserHovering: false,
            videoTimer: null,
            activeHoverInterval: null,
            periodicTimer: null,
            previewWatcher: null,
            idleTimer: null,
            isIdle: false,
        };

        this.hero = new HeroManager(this);
        this.observerManager = new ObserverManager();
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
                if (this.state.isUserHovering) {
                    const heroOverlay = e.target.closest('.netflix-hero-content');
                    const isPreview = e.target.closest('ytd-video-preview');
                    if (!heroOverlay && !isPreview) {
                        this.handleUserHoverEnd();
                    }
                }
                this.state.killedCard = null;
            }
        }, { passive: true, capture: true });
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

    handleUserHoverStart(card) {
        const index = this.state.videoQueue.indexOf(card);
        if (this.state.isUserHovering && this.state.currentVideoIndex === index) return;

        this.state.isUserHovering = true;
        this.state.status = STATES.USER_HOVERING;
        
        this.observerManager.clearTimeout(this.state.videoTimer);
        
        this.releaseHeroVideo();
        this.state.currentVideoIndex = index !== -1 ? index : 0;
        this.hero.updateContent(card, this.state.isMuted, this.isRecentlyAdded.bind(this));

        card.classList.add('netflix-active-preview');
        card._isNetflixHeroPreview = true;

        HoverSimulator.simulateHover(this, card);
        setTimeout(() => { if (this.state.isUserHovering) HoverSimulator.simulateHover(this, card); }, 300);
        setTimeout(() => { if (this.state.isUserHovering) HoverSimulator.simulateHover(this, card); }, 800);

        // Maximum 20 seconds for the video preview
        this.observerManager.clearTimeout(this.state.killPreviewTimer);
        this.state.killPreviewTimer = this.observerManager.addTimeout(setTimeout(() => {
            if (this.state.isUserHovering) {
                this.releaseHeroVideo();
                this.state.isUserHovering = false;
                this.state.status = STATES.AUTO_PLAYING;
                this.state.killedCard = card;
                
                this.observerManager.clearTimeout(this.state.videoTimer);
                this.state.videoTimer = this.observerManager.addTimeout(setTimeout(() => this.playNextVideo(), 5000));
            }
        }, 20000));
    }

    handleUserHoverEnd() {
        this.state.isUserHovering = false;
        this.state.status = STATES.AUTO_PLAYING;
        
        this.releaseHeroVideo();
        this.observerManager.clearTimeout(this.state.killPreviewTimer);

        this.observerManager.clearTimeout(this.state.videoTimer);
        this.state.videoTimer = this.observerManager.addTimeout(setTimeout(
            () => this.playNextVideo(),
            5000
        ));
    }

    setupPreviewWatcher() {
        if (this.state.previewWatcher) return;
        
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
                video.pause();
                video.currentTime = 0;
            }
            p.classList.remove('ypp-projected-preview');
            if (this.hero && this.hero.heroElement && p.parentElement === this.hero.heroElement) {
                document.body.appendChild(p);
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
                const fade = setInterval(() => {
                    vol += 0.1;
                    if (vol >= 1) {
                        video.volume = 1;
                        clearInterval(fade);
                    } else {
                        video.volume = vol;
                    }
                }, 50);
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
            const isHidden = item.closest('[hidden]');
            const isAd = item.querySelector('.badge-style-type-ad') != null;
            const isShorts = item.querySelector('[overlay-style="SHORTS"]') != null ||
                             item.closest('ytd-rich-shelf-renderer[is-shorts]');
            const hasVideoLink = item.querySelector('#video-title-link, a#video-title, a#thumbnail, a[href*="/watch?v="]');
            return !isHidden && !isAd && !isShorts && hasVideoLink;
        });

        if (items.length === this.state.videoQueue.length) return;

        this.state.videoQueue = items;
        this.state.currentVideoIndex = 0;
        this.observerManager.clearTimeout(this.state.videoTimer);

        items.forEach((video, index) => {
            if (!video._cinematicHoverAttached) {
                video._cinematicHoverAttached = true;
                video.addEventListener('mouseenter', (e) => {
                    if (!e.isTrusted) return; 
                    
                    if (this.state.currentVideoIndex !== index) {
                        this.releaseHeroVideo();
                    }
                    this.state.isUserHovering = true;
                    this.state.currentVideoIndex = index;
                    this.observerManager.clearTimeout(this.state.videoTimer);
                    this.hero.updateContent(video, this.state.isMuted, this.isRecentlyAdded.bind(this));
                    video.classList.add('netflix-active-preview');
                    video._isNetflixHeroPreview = true;
                    HoverSimulator.simulateHover(this, video);
                }, { capture: true });

                video.addEventListener('mouseleave', (e) => {
                    if (!e.isTrusted) return; 
                    
                    this.state.isUserHovering = false;
                    this.observerManager.clearTimeout(this.state.videoTimer);
                    this.state.videoTimer = this.observerManager.addTimeout(
                        setTimeout(() => this.playNextVideo(), 5000)
                    );
                }, { capture: true });
            }
        });

        const firstVideo = items[0];
        if (firstVideo && !this.state.isUserHovering) {
            this.releaseHeroVideo();
            firstVideo.classList.add('netflix-active-preview');
            this.hero.updateContent(firstVideo, this.state.isMuted, this.isRecentlyAdded.bind(this));
            HoverSimulator.startActiveHoverSimulation(this, firstVideo, this.observerManager);
            setTimeout(() => { if (!this.state.isUserHovering) HoverSimulator.startActiveHoverSimulation(this, firstVideo, this.observerManager); }, 800);
            setTimeout(() => { if (!this.state.isUserHovering) HoverSimulator.startActiveHoverSimulation(this, firstVideo, this.observerManager); }, 2000);
            setTimeout(() => { if (!this.state.isUserHovering) HoverSimulator.startActiveHoverSimulation(this, firstVideo, this.observerManager); }, 4000);
            this.state.videoTimer = this.observerManager.addTimeout(
                setTimeout(() => this.playNextVideo(), 10000)
            );
        }
    }

    setupContentObserver() {
        const contents = document.querySelector('#contents');
        if (!contents) return;

        let debounceTimer;
        const observer = new MutationObserver(() => {
            this.observerManager.clearTimeout(debounceTimer);
            debounceTimer = this.observerManager.addTimeout(setTimeout(() => {
                this.updateVideoQueue();
            }, 500));
        });
        
        this.observerManager.addObserver(observer);
        observer.observe(contents, { childList: true, subtree: true });
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

            const observer = new MutationObserver(() => {
                const found = document.querySelector(selector);
                if (found) {
                    observer.disconnect();
                    resolve(found);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        });
    }
}

export class CinematicMode extends window.YPP.features.BaseFeature {
    static featureId = 'cinematicMode';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super();
        this._controller = null;
        this.onPageChange = this.onPageChange.bind(this);
    }

    getConfigKey() {
        return 'cinematicMode';
    }

    getDependencies() {
        return [];
    }

    onPageChange() {
        const isHome = CONFIG.HOME_PATHS.includes(window.location.pathname);
        if (isHome && this.settings?.cinematicMode) {
            this._activate();
        } else {
            this._teardown();
        }
    }

    async enable() {
        super.enable();
        const isHome = CONFIG.HOME_PATHS.includes(window.location.pathname);
        if (isHome && this.settings?.cinematicMode) {
            this._activate();
        }
    }

    disable() {
        super.disable();
        this._teardown();
    }

    async onUpdate() {
        if (this._controller && this.settings?.cinematicMuted !== undefined) {
            this._controller.state.isMuted = this.settings.cinematicMuted;
            this._controller.syncMuteState();
        }
    }

    _activate() {
        if (this._controller) return;
        if (!document.getElementById('ypp-cinematic-style')) {
            const style = document.createElement('style');
            style.id = 'ypp-cinematic-style';
            style.textContent = cinematicThemeCSS;
            document.head.appendChild(style);
        }
        this._controller = new CinematicController(this.settings);
        this._controller.init();
    }

    _teardown() {
        if (this._controller) {
            this._controller.destroy();
            this._controller = null;
        }
        const style = document.getElementById('ypp-cinematic-style');
        if (style) style.remove();
    }
}
