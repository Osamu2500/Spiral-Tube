/**
 * Cinematic Mode — Netflix-style home feed overlay.
 * Completely rebuilt from ground up using 100% of the original extension code from homepage upgrade.
 */

import cinematicThemeCSS from './cinematic-theme.css?raw';

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');

const CONFIG = {
    PREVIEW_DELAY: 7750,
    FADE_DURATION: 1250,
    HOME_PATHS: ['/', '/index.html', '/feed/subscriptions'],
    HOVER_EVENTS: ['mouseenter', 'mouseover', 'pointerenter'],
    CHECK_INTERVAL: 500,
    CONTENT_UPDATE_DELAY: 100,
    SCROLL_AMOUNT: 70,
};

function safeSetInnerHTML(element, html) {
    if (!element || typeof html !== 'string') return;
    const template = document.createElement('template');
    template.innerHTML = html;
    element.textContent = '';
    element.appendChild(template.content.cloneNode(true));
}

function safeInsertAdjacent(element, position, html) {
    if (!element || typeof html !== 'string') return;
    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    switch (position) {
        case 'beforebegin':
            element.parentNode?.insertBefore(fragment, element);
            break;
        case 'afterbegin':
            element.insertBefore(fragment, element.firstChild);
            break;
        case 'beforeend':
            element.appendChild(fragment);
            break;
        case 'afterend':
            element.parentNode?.insertBefore(fragment, element.nextSibling);
            break;
    }
}

class HeroManager {
    constructor(controller) {
        this.controller = controller;
        this.state = {
            status: 'inactive',
            heroElement: null,
            observers: new Set(),
            currentVideo: null,
        };
    }

    async create(videoElement) {
        if (this.state.status !== 'inactive') return;

        this.state.status = 'creating';
        this.state.currentVideo = videoElement;

        const heroWrapper = document.createElement('div');
        heroWrapper.className = 'netflix-hero';
        this.state.heroElement = heroWrapper;

        const navHTML = `
          <div class="netflix-hero-nav">
            <button class="netflix-nav-button prev" aria-label="Previous video">
              <svg viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
              </svg>
            </button>
            <button class="netflix-nav-button next" aria-label="Next video">
              <svg viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        `;
        safeInsertAdjacent(heroWrapper, 'afterbegin', navHTML);

        await this._waitForPreview(videoElement);

        const preview = document.querySelector('ytd-video-preview');
        if (!preview) {
            this.state.status = 'inactive';
            return;
        }

        preview.parentNode?.insertBefore(heroWrapper, preview);
        heroWrapper.appendChild(preview);
        preview.classList.add('ypp-projected-preview');

        const gradient = document.createElement('div');
        gradient.className = 'netflix-hero-gradient';
        heroWrapper.appendChild(gradient);

        const contentOverlay = document.createElement('div');
        contentOverlay.className = 'netflix-hero-content';
        heroWrapper.appendChild(contentOverlay);

        const navButtons = heroWrapper.querySelector('.netflix-hero-nav');
        if (navButtons) {
            this.controller.attachButtonHandlers(heroWrapper, videoElement);
        }

        this._setupPreviewChangeObserver();
        this.state.status = 'ready';
        this.update(videoElement);
    }

    update(videoElement) {
        if (this.state.status !== 'ready') return;
        if (!this.state.heroElement) return;

        const existingContent = this.state.heroElement.querySelector('.netflix-hero-content');
        if (!existingContent) return;

        const preview = this.state.heroElement.querySelector('ytd-video-preview') || document.querySelector('ytd-video-preview');
        if (preview && !preview.classList.contains('ypp-projected-preview')) {
            preview.classList.add('ypp-projected-preview');
            if (preview.parentElement !== this.state.heroElement) {
                this.state.heroElement.appendChild(preview);
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

        if (!title || !channelName) {
            if (!videoElement._heroRetryCount) videoElement._heroRetryCount = 0;
            if (videoElement._heroRetryCount < 15) {
                videoElement._heroRetryCount++;
                setTimeout(() => this.update(videoElement), 200);
                return;
            }
        }

        const content = {
            title: title || 'Video Title',
            avatar:
                videoElement.querySelector(
                    'yt-avatar-shape img, yt-img-shadow img, #avatar-link img, ytd-channel-name img'
                )?.src || null,
            channelName: channelName || 'Channel Name',
            isRecent: this.controller.isRecentlyAdded(videoElement),
        };

        if (content.title && content.channelName) {
            safeSetInnerHTML(existingContent, this.controller.generateHeroHTML(content));
            const unmuteButton = existingContent.querySelector('.netflix-unmute-button');
            if (unmuteButton) {
                unmuteButton.classList.toggle('muted', this.controller.state.isMuted);
                safeSetInnerHTML(
                    unmuteButton,
                    this.controller.generateMuteButtonHTML(this.controller.state.isMuted)
                );
            }
            this.controller.attachButtonHandlers(existingContent, videoElement);
        }
    }

    destroy() {
        if (this.state.status === 'inactive') return;

        this.state.status = 'destroying';

        this.state.observers.forEach(observer => observer.disconnect());
        this.state.observers.clear();

        this.state.heroElement?.remove();

        this.state = {
            status: 'inactive',
            heroElement: null,
            observers: new Set(),
            currentVideo: null,
        };
    }

    _waitForPreview(videoElement) {
        return new Promise(resolve => {
            this.controller.simulateHover(videoElement);

            const observer = new MutationObserver((mutations, obs) => {
                const preview = document.querySelector('ytd-video-preview');
                if (preview) {
                    obs.disconnect();
                    resolve(preview);
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });

            this.state.observers.add(observer);
        });
    }

    _setupPreviewChangeObserver() {
        const observer = new MutationObserver(() => {
            const hoveredVideo = document.querySelector('ytd-rich-item-renderer:hover');

            if (hoveredVideo) {
                this.controller.state.isUserHovering = true;
                clearTimeout(this.controller.state.videoTimer);
                this.update(hoveredVideo);
                setTimeout(() => this.controller.simulateHover(hoveredVideo), 50);
            } else {
                if (this.controller.state.isUserHovering) {
                    this.controller.state.isUserHovering = false;

                    const currentVideo = this.controller.state.videoQueue[this.controller.state.currentVideoIndex];
                    if (currentVideo) {
                        this.update(currentVideo);
                        setTimeout(() => {
                            this.controller.simulateHover(currentVideo);
                            this.controller.state.videoTimer = setTimeout(
                                () => this.controller.playNextVideo(),
                                CONFIG.PREVIEW_DELAY
                            );
                        }, 50);
                    }
                }
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['active', 'playing', 'hidden'],
            subtree: true,
        });

        this.state.observers.add(observer);
    }
}

class CinematicController {
    constructor(settings, utils) {
        this.settings = settings;
        this.utils = utils;
        this.state = {
            enabled: true,
            videoQueue: [],
            currentVideoIndex: 0,
            videoTimer: null,
            isUserHovering: false,
            isMuted: settings?.cinematicMuted !== undefined ? settings.cinematicMuted : isFirefox,
            periodicTimer: null,
            observers: new Set(),
            listeners: [],
        };
        this.heroManager = new HeroManager(this);
    }

    async makeHeroPreview(videoElement) {
        if (this.heroManager.state.status !== 'inactive') {
            return;
        }
        await this.heroManager.create(videoElement);
    }

    async updateHeroContent(video) {
        if (this.heroManager.state.status === 'ready') {
            this.heroManager.update(video);
        }
    }

    simulateHover(element) {
        if (!element) return Promise.reject('No element provided');

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
                    CONFIG.HOVER_EVENTS.forEach(eventType => {
                        [element, thumbnailContainer].forEach(target => {
                            target.dispatchEvent(
                                new MouseEvent(eventType, {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window,
                                })
                            );
                        });
                    });

                    setTimeout(() => {
                        if (!this.state.isMuted) {
                            this.syncMuteState();
                        }
                        this.updateMuteButtonVisibility();
                        resolve();
                    }, 1000);
                }, 100);
            });
        };

        return attemptHover();
    }

    generateHeroHTML(content) {
        return `
        <div class="channel-info">
          ${
            content.avatar
              ? `<img src="${content.avatar}" class="channel-avatar" onerror="this.style.display='none'">`
              : ''
          }
          <h2 class="channel-name">${content.channelName}</h2>
        </div>   
        ${content.isRecent ? '<span class="recently-badge">Recently Added</span>' : ''}
        <h1>${content.title}</h1>
        <div class="netflix-hero-buttons">
          <button class="netflix-play-button">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
            Play
          </button>
          <button class="netflix-unmute-button secondary">
            ${this.generateMuteButtonHTML(this.state.isMuted)}
          </button>
        </div>
      `;
    }

    generateMuteButtonHTML(isMuted) {
        return isMuted
            ? `
        <svg viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
        </svg>
        Unmute
        `
            : `
        <svg viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
        </svg>
        Mute
    `;
    }

    attachButtonHandlers(overlay, video) {
        const playButton = overlay.querySelector('.netflix-play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                const videoLink = video?.querySelector('#video-title-link, a#video-title, a#thumbnail, a[href*="/watch?v="]')?.href;
                if (videoLink) {
                    window.location.href = videoLink;
                }
            });
        }

        const unmuteButton = overlay.querySelector('.netflix-unmute-button');
        if (unmuteButton) {
            const newButton = unmuteButton.cloneNode(true);
            unmuteButton.parentNode.replaceChild(newButton, unmuteButton);

            newButton.classList.toggle('muted', this.state.isMuted);
            safeSetInnerHTML(newButton, this.generateMuteButtonHTML(this.state.isMuted));

            newButton.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                this.handleMuteToggle(newButton);
            });
        }

        const prevButton = overlay.querySelector('.netflix-nav-button.prev');
        const nextButton = overlay.querySelector('.netflix-nav-button.next');

        if (prevButton) {
            prevButton.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateVideo('prev');
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateVideo('next');
            });
        }
    }

    syncMuteState() {
        if (isFirefox) return;

        const preview = document.querySelector('ytd-video-preview');
        const muteButton = preview?.querySelector('yt-mute-toggle-button button, .ytp-mute-button');

        if (muteButton) {
            const isMutedNow = muteButton
                .getAttribute('aria-label')
                ?.toLowerCase()
                .includes('unmute');
            if (isMutedNow !== this.state.isMuted) {
                muteButton.click();
            }
        }
    }

    handleMuteToggle(button) {
        try {
            const preview = document.querySelector('ytd-video-preview');
            const muteButton = preview?.querySelector('yt-mute-toggle-button button, .ytp-mute-button');

            if (muteButton) {
                this.state.isMuted = !this.state.isMuted;

                muteButton.click();

                button.classList.toggle('muted', this.state.isMuted);
                safeSetInnerHTML(button, this.generateMuteButtonHTML(this.state.isMuted));

                if (window.chrome?.storage?.sync) {
                    window.chrome.storage.sync.set({ cinematicMuted: this.state.isMuted });
                }
            }
        } catch (error) {
            console.debug('[Cinematic] Mute toggle handled silently', error);
        }
    }

    setupScrollHandler() {
        const originalOverflow = document.body.style.overflow;
        let scrollHandler = null;
        let keyboardHandler = null;

        const createScrollHandler = () => e => {
            const contents = document.querySelector('#contents');
            if (contents) {
                e.preventDefault();
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    contents.scrollLeft += e.deltaX;
                } else {
                    contents.scrollLeft += e.deltaY;
                }
            }
        };

        const createKeyboardHandler = () => e => {
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
                case 'Space':
                    e.preventDefault();
                    contents.scrollLeft += CONFIG.SCROLL_AMOUNT;
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    contents.scrollLeft -= CONFIG.SCROLL_AMOUNT;
                    break;
            }
        };

        const updateScrollBehavior = async () => {
            if (scrollHandler) {
                document.body.removeEventListener('wheel', scrollHandler);
                document.removeEventListener('keydown', keyboardHandler);
                scrollHandler = null;
                keyboardHandler = null;
            }

            if (CONFIG.HOME_PATHS.includes(window.location.pathname)) {
                document.body.style.overflow = 'hidden';

                try {
                    await this.waitForElement('#contents');
                    scrollHandler = createScrollHandler();
                    keyboardHandler = createKeyboardHandler();
                    document.body.addEventListener('wheel', scrollHandler, {
                        passive: false,
                    });
                    document.addEventListener('keydown', keyboardHandler);
                    this.state.listeners.push(
                        { target: document.body, event: 'wheel', fn: scrollHandler },
                        { target: document, event: 'keydown', fn: keyboardHandler }
                    );
                } catch (error) {
                    // Silently fail if contents not ready
                }
            } else {
                document.body.style.overflow = originalOverflow;
            }
        };

        updateScrollBehavior();

        ['popstate', 'pushstate', 'replacestate'].forEach(event => {
            window.addEventListener(event, updateScrollBehavior);
        });
    }

    updateMuteButtonVisibility() {
        setTimeout(() => {
            const preview = document.querySelector('ytd-video-preview');
            const muteButton = preview?.querySelector('yt-mute-toggle-button button, .ytp-mute-button');
            const heroButton = document.querySelector('.netflix-unmute-button');

            if (muteButton) {
                if (heroButton) heroButton.style.opacity = '1';
            } else {
                if (heroButton) heroButton.style.opacity = '0';
            }
        }, 1000);
    }

    isRecentlyAdded(element) {
        const metadataItems = element.querySelectorAll('#metadata-line .inline-metadata-item');
        const timeElement = Array.from(metadataItems).find(item =>
            item.textContent.toLowerCase().includes('ago')
        );
        const timeText = timeElement?.textContent?.toLowerCase() || '';
        const timeMatch = timeText.match(/(\d+)\s+(hour|day|minute)s?\s+ago/);

        if (!timeMatch) return false;

        const [, count, unit] = timeMatch;
        const numCount = parseInt(count, 10);

        return (
            unit === 'minute' ||
            unit === 'hour' ||
            (unit === 'day' && numCount <= 2)
        );
    }

    updateVideoQueue() {
        const allVideos = document.querySelectorAll(
            'ytd-rich-grid-renderer ytd-rich-item-renderer, #contents ytd-rich-item-renderer'
        );
        const newQueue = Array.from(allVideos).filter(item =>
            item.querySelector('#video-title-link, a#video-title, a#thumbnail, a[href*="/watch?v="]')
        );

        if (newQueue.length !== this.state.videoQueue.length) {
            this.state.videoQueue = newQueue;
            this.state.currentVideoIndex = 0;
            clearTimeout(this.state.videoTimer);

            newQueue.forEach(video => {
                video
                    .querySelectorAll('.recently-badge-container')
                    .forEach(badge => badge.remove());

                if (this.isRecentlyAdded(video)) {
                    const badgeContainer = document.createElement('div');
                    badgeContainer.className = 'recently-badge-container';
                    safeSetInnerHTML(
                        badgeContainer,
                        '<span class="recently-badge">Recently Added</span>'
                    );

                    const thumbnail = video.querySelector('ytd-thumbnail');
                    if (thumbnail) {
                        thumbnail.appendChild(badgeContainer);
                    }
                }
            });

            const firstVideo = this.state.videoQueue[0];
            if (firstVideo) {
                document
                    .querySelectorAll('.netflix-active-preview')
                    .forEach(el => el.classList.remove('netflix-active-preview'));

                firstVideo.classList.add('netflix-active-preview');
                this.updateHeroContent(firstVideo);
                this.simulateHover(firstVideo);

                this.state.videoTimer = setTimeout(() => this.playNextVideo(), CONFIG.PREVIEW_DELAY);
            }
        }
    }

    setupContentObserver() {
        const contentsObserver = new MutationObserver(() => {
            setTimeout(() => {
                this.updateVideoQueue();
            }, CONFIG.CONTENT_UPDATE_DELAY);
        });

        const grid = document.querySelector('ytd-rich-grid-renderer, #contents');
        if (grid) {
            contentsObserver.observe(grid, {
                childList: true,
                subtree: true,
            });
            this.state.observers.add(contentsObserver);
        }
    }

    navigateVideo(direction) {
        if (this.state.isUserHovering) return;

        const heroWrapper = document.querySelector('.netflix-hero');
        if (!heroWrapper) return;

        clearTimeout(this.state.videoTimer);

        const currentIndex = this.state.currentVideoIndex;
        const queueLength = this.state.videoQueue.length;
        if (queueLength === 0) return;

        const newIndex =
            direction === 'next'
                ? (currentIndex + 1) % queueLength
                : (currentIndex - 1 + queueLength) % queueLength;

        this.state.currentVideoIndex = newIndex;
        this.handleVideoTransition(heroWrapper, newIndex);
    }

    playNextVideo() {
        if (this.state.isUserHovering) return;

        const heroWrapper = document.querySelector('.netflix-hero');
        if (!heroWrapper) return;

        this.navigateVideo('next');
        this.updateMuteButtonVisibility();
    }

    handleVideoTransition(heroWrapper, targetIndex) {
        document.querySelectorAll('.netflix-active-preview').forEach(video => {
            video.classList.remove('netflix-active-preview');
        });

        heroWrapper.classList.add('fading');

        setTimeout(() => {
            const nextVideo = this.state.videoQueue[targetIndex];

            if (!nextVideo) return;

            this.state.currentVideoIndex = targetIndex;
            nextVideo.classList.add('netflix-active-preview');

            this.updateHeroContent(nextVideo);

            this.simulateHover(nextVideo).then(() => {
                this.syncMuteState();
            });

            heroWrapper.classList.remove('fading');

            this.updateMuteButtonVisibility();

            clearTimeout(this.state.videoTimer);
            this.state.videoTimer = setTimeout(() => this.playNextVideo(), CONFIG.PREVIEW_DELAY);
        }, CONFIG.FADE_DURATION);
    }

    setupPeriodicCheck() {
        this.state.periodicTimer = setInterval(() => {
            if (!this.state.isUserHovering) {
                const activePreview = document.querySelector(
                    'ytd-video-preview[active][playing]:not([hidden])'
                );
                if (!activePreview) {
                    const currentVideo = this.state.videoQueue[this.state.currentVideoIndex];
                    if (currentVideo) {
                        this.updateHeroContent(currentVideo);
                        this.simulateHover(currentVideo);
                    }
                }
            }
        }, CONFIG.CHECK_INTERVAL);
    }

    waitForElement(selector) {
        return new Promise(resolve => {
            const existing = document.querySelector(selector);
            if (existing) {
                return resolve(existing);
            }

            const observer = new MutationObserver(() => {
                const found = document.querySelector(selector);
                if (found) {
                    observer.disconnect();
                    resolve(found);
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });

            this.state.observers.add(observer);
        });
    }

    async initializeVideoPreview() {
        try {
            const firstVideo = await this.waitForElement('ytd-rich-item-renderer');

            await this.makeHeroPreview(firstVideo);

            this.updateVideoQueue();
            this.setupContentObserver();

            firstVideo.classList.add('netflix-active-preview');
            this.simulateHover(firstVideo);

            this.state.videoTimer = setTimeout(() => this.playNextVideo(), CONFIG.PREVIEW_DELAY);
            this.setupPeriodicCheck();
        } catch (error) {
            console.error('[Cinematic] Initialization error:', error);
        }
    }

    init() {
        document.documentElement.setAttribute('dark', '');
        document.body.classList.add('cinematic', 'cinematic-home');

        const hideDrawer = () => {
            const appDrawer = document.querySelector('tp-yt-app-drawer');
            if (appDrawer) {
                appDrawer.removeAttribute('opened');
            }
        };

        hideDrawer();
        const retryTimes = [100, 500, 1000, 2000, 3000];
        retryTimes.forEach(delay => {
            setTimeout(hideDrawer, delay);
        });

        this.setupScrollHandler();
        this.initializeVideoPreview();

        const darkModeObserver = new MutationObserver(() => {
            if (!document.documentElement.hasAttribute('dark')) {
                document.documentElement.setAttribute('dark', '');
            }
        });

        darkModeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dark'],
        });
        this.state.observers.add(darkModeObserver);
    }

    destroy() {
        clearTimeout(this.state.videoTimer);
        if (this.state.periodicTimer) clearInterval(this.state.periodicTimer);

        this.state.observers.forEach(obs => obs.disconnect());
        this.state.observers.clear();

        this.state.listeners.forEach(({ target, event, fn }) => {
            target.removeEventListener(event, fn);
        });
        this.state.listeners = [];

        document.body.classList.remove('cinematic-home');
        document.body.classList.remove('cinematic');
        this.heroManager.destroy();
    }
}

export class CinematicMode extends window.YPP.features.BaseFeature {
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
        this._controller = new CinematicController(this.settings, this.utils);
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
