export class ThumbnailColorManager {
    constructor() {
        this.cache = new Map();
        this.canvas = document.createElement('canvas');
        this.canvas.width = 10;
        this.canvas.height = 10;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.enabled = false;
        this.activeStyle = '';
        this.waitingElements = new Set();
        this._pollingInterval = null;

        this.observer = new IntersectionObserver((entries) => {
            if (!this.enabled) return;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.processElement(entry.target);
                }
            });
        }, {
            rootMargin: '300px' // Pre-load slightly offscreen
        });

        this.mutationObserver = new MutationObserver((mutations) => {
            if (!this.enabled) return;
            for (let mut of mutations) {
                for (let node of mut.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.observeNewNodes(node);
                    }
                }
            }
        });
    }

    updateSettings(settings) {
        if (!settings) return;
        this.activeStyle = settings.cardStyle || 'default';
        const needsExtraction = [
            'polaroid', 
            'neon',
            'holographic'
        ].includes(this.activeStyle);
        
        if (needsExtraction && !this.enabled) {
            this.start();
        } else if (!needsExtraction && this.enabled) {
            this.stop();
        }
    }

    start() {
        if (this.enabled) return;
        this.enabled = true;
        this.observeNewNodes(document.body);
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.register('thumbnail-color-manager', 'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, yt-lockup-view-model, .ypp-grid-item', (elements) => {
                if (this.enabled) {
                    elements.forEach(node => this.observer.observe(node));
                }
            }, false);
        } else if (this.mutationObserver) {
            this.mutationObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    stop() {
        this.enabled = false;
        this.observer.disconnect();
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('thumbnail-color-manager');
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }

        if (this._pollingInterval) {
            clearInterval(this._pollingInterval);
            this._pollingInterval = null;
        }
        this.waitingElements.clear();
        document.querySelectorAll('[data-ypp-thumb-color]').forEach(el => {
            el.style.removeProperty('--ypp-thumb-color');
            el.style.removeProperty('--ypp-thumb-rgb');
            el.removeAttribute('data-ypp-thumb-color');
        });
    }

    observeNewNodes(root) {
        if (root.matches && root.matches('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, yt-lockup-view-model, .ypp-grid-item')) {
            this.observer.observe(root);
        }
        if (root.querySelectorAll) {
            const nodes = root.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, yt-lockup-view-model, .ypp-grid-item');
            nodes.forEach(node => this.observer.observe(node));
        }
    }

    getImage(el) {
        // Try normal img selector first
        let img = el.querySelector('yt-image img, ytd-thumbnail img, yt-lockup-view-model img, .yt-core-image, img');
        // Try shadow root fallback for yt-image
        if (!img) {
            const ytImage = el.querySelector('yt-image');
            if (ytImage && ytImage.shadowRoot) {
                img = ytImage.shadowRoot.querySelector('img');
            }
        }
        return img;
    }

    processElement(el) {
        if (el.hasAttribute('data-ypp-thumb-color')) return;

        const img = this.getImage(el);
        const src = img ? img.src : null;

        // Allow hqdefault thumbnails — don't wait for maxres
        const isReady = src && !src.includes('data:image');

        if (!isReady) {
            if (!el.hasAttribute('data-ypp-color-wait')) {
                el.setAttribute('data-ypp-color-wait', 'true');
                this.waitingElements.add(el);
                this.startPolling();
            }
            return;
        }

        // Strip URL params to maximize cache hits (e.g. sqp=... on YouTube CDN URLs)
        const cleanSrc = src.split('?')[0];

        if (this.cache.has(cleanSrc)) {
            const cached = this.cache.get(cleanSrc);
            el.style.setProperty('--ypp-thumb-color', cached.colorStr);
            el.style.setProperty('--ypp-thumb-rgb', cached.rgbStr);
            el.setAttribute('data-ypp-thumb-color', 'true');
            return;
        }

        // ---- ORIGINAL PROVEN APPROACH FROM COMMIT 7f2c736f ----
        // Use new Image() with crossOrigin=Anonymous in the CONTENT SCRIPT context.
        // This works because content scripts run in the page's origin context,
        // which means YouTube CDN (i.ytimg.com) allows the crossOrigin request.
        // The background service worker fetch() approach was FAILING silently due
        // to CORS / OffscreenCanvas issues in the service worker context.
        const tempImg = new Image();
        tempImg.crossOrigin = 'Anonymous'; // Crucial for canvas pixel reading

        tempImg.onload = () => {
            try {
                this.ctx.clearRect(0, 0, 10, 10);
                this.ctx.drawImage(tempImg, 0, 0, 10, 10);

                const data = this.ctx.getImageData(0, 0, 10, 10).data;
                let r = 0, g = 0, b = 0, count = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const alpha = data[i + 3];
                    if (alpha < 255) continue;

                    // Exclude pure black letterboxes and pure white
                    if (data[i] < 15 && data[i + 1] < 15 && data[i + 2] < 15) continue;
                    if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) continue;

                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }

                if (count > 0) {
                    r = Math.floor(r / count);
                    g = Math.floor(g / count);
                    b = Math.floor(b / count);

                    const enhanced = this.enhanceColorForGlow(r, g, b);
                    const colorStr = `rgb(${enhanced.r}, ${enhanced.g}, ${enhanced.b})`;
                    const rgbStr = `${enhanced.r}, ${enhanced.g}, ${enhanced.b}`;

                    this.cache.set(cleanSrc, { colorStr, rgbStr });

                    if (el.isConnected) {
                        el.style.setProperty('--ypp-thumb-color', colorStr);
                        el.style.setProperty('--ypp-thumb-rgb', rgbStr);
                        el.setAttribute('data-ypp-thumb-color', 'true');
                    }
                }
            } catch (e) {
                // Ignore CORS tainted canvas errors silently
            }
        };

        tempImg.onerror = () => {
            // Some images might strictly reject CORS — skip them silently
        };

        tempImg.src = cleanSrc;
    }

    startPolling() {
        if (this._pollingInterval) return;
        this._pollingInterval = setInterval(() => {
            if (this.waitingElements.size === 0) {
                clearInterval(this._pollingInterval);
                this._pollingInterval = null;
                return;
            }

            for (const el of this.waitingElements) {
                if (!document.body.contains(el)) {
                    this.waitingElements.delete(el);
                    continue;
                }
                const currentImg = this.getImage(el);
                const currentSrc = currentImg ? currentImg.src : null;
                if (currentSrc && !currentSrc.includes('data:image')) {
                    this.waitingElements.delete(el);
                    el.removeAttribute('data-ypp-color-wait');
                    this.processElement(el);
                }
            }
        }, 300); // Poll every 300ms
    }

    enhanceColorForGlow(r, g, b) {
        // Boost vibrance for a rich polaroid background effect
        const max = Math.max(r, g, b);

        if (max === 0) return { r: 50, g: 50, b: 50 }; // Fallback dark grey

        // Push brightness up by at most 40%
        let boost = 255 / max;
        boost = Math.min(boost, 1.4);

        return {
            r: Math.min(255, Math.floor(r * boost)),
            g: Math.min(255, Math.floor(g * boost)),
            b: Math.min(255, Math.floor(b * boost))
        };
    }
}

window.YPP = window.YPP || {};
window.YPP.managers = window.YPP.managers || {};
window.YPP.managers.ThumbnailColorManager = ThumbnailColorManager;
