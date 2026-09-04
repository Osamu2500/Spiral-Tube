export class HeroManager {
    constructor(controller) {
        this.controller = controller;
        this.heroElement = null;
        this.status = 'inactive';
        this._hasSetupEvents = false;
        this._unsubHeroChanged = null;
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
        if (this._hasSetupEvents) return;
        this._hasSetupEvents = true;

        let _lastHoveredCard = null;
        let _debounceTimer = null;

        if (window.YPP && window.YPP.events) {
            this._unsubHeroChanged = window.YPP.events.on('dom:heroChanged', () => {
                clearTimeout(_debounceTimer);
                _debounceTimer = setTimeout(() => {
                    const hoveredVideo = document.querySelector('ytd-rich-item-renderer:hover');

                    if (hoveredVideo) {
                        if (hoveredVideo === _lastHoveredCard) return;
                        _lastHoveredCard = hoveredVideo;

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
                        _lastHoveredCard = null;
                    }
                }, 200);
            });
        }
    }

    destroy() {
        if (this.status === 'inactive') return;
        this.status = 'destroying';

        if (this._unsubHeroChanged) {
            this._unsubHeroChanged();
            this._unsubHeroChanged = null;
        }
        this._hasSetupEvents = false;

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
            ${content.avatar ? '<img src="' + content.avatar + '" alt="Channel avatar" class="channel-avatar" onerror="this.style.display=\'none\'">' : ''}
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
