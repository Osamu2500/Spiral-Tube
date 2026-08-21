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
        this._rescanInterval = null;

        // CARD SELECTORS — the elements that get the background color applied
        this.CARD_SELECTOR = [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'yt-lockup-view-model',
            '.ypp-grid-item'
        ].join(', ');

        // IntersectionObserver: process elements as they enter the viewport
        this.observer = new IntersectionObserver((entries) => {
            if (!this.enabled) return;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.processElement(entry.target);
                }
            });
        }, {
            rootMargin: '600px' // Pre-load well offscreen so all rows are ready
        });

        // MutationObserver: catch dynamically-added cards (YouTube SPA loads cards progressively)
        this.mutationObserver = new MutationObserver((mutations) => {
            if (!this.enabled) return;
            for (const mut of mutations) {
                for (const node of mut.addedNodes) {
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
        const needsExtraction = ['polaroid', 'neon', 'holographic'].includes(this.activeStyle);

        if (needsExtraction && !this.enabled) {
            this.start();
        } else if (!needsExtraction && this.enabled) {
            this.stop();
        }
    }

    start() {
        if (this.enabled) return;
        this.enabled = true;

        // Step 1: Immediately scan the entire DOM for cards that already exist.
        // This covers the first screen load.
        this.observeNewNodes(document.body);

        // Step 2: ALWAYS run MutationObserver — this catches every card YouTube
        // adds to the DOM after the initial load (SPA navigation, lazy loading).
        // The old code used `else if`, which meant MutationObserver was NEVER
        // started when sharedObserver was available — that's why lower rows missed colors.
        this.mutationObserver.observe(document.body, { childList: true, subtree: true });

        // Step 3: Also register with sharedObserver if available (belt-and-suspenders).
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.register(
                'thumbnail-color-manager',
                this.CARD_SELECTOR,
                (elements) => {
                    if (!this.enabled) return;
                    elements.forEach(node => this.observer.observe(node));
                },
                false
            );
        }

        // Step 4: Periodic rescan for the first 15 seconds.
        // YouTube can inject cards at any time. This is the ultimate safety net.
        let rescanCount = 0;
        this._rescanInterval = setInterval(() => {
            if (!this.enabled || rescanCount >= 15) {
                clearInterval(this._rescanInterval);
                this._rescanInterval = null;
                return;
            }
            rescanCount++;
            // Find cards that haven't been processed yet and observe them
            document.querySelectorAll(this.CARD_SELECTOR).forEach(node => {
                if (!node.hasAttribute('data-ypp-thumb-color') && !node.hasAttribute('data-ypp-color-wait')) {
                    this.observer.observe(node);
                }
            });
        }, 1000); // Every 1 second for 15 seconds
    }

    stop() {
        this.enabled = false;
        this.observer.disconnect();
        this.mutationObserver.disconnect();

        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('thumbnail-color-manager');
        }

        if (this._pollingInterval) {
            clearInterval(this._pollingInterval);
            this._pollingInterval = null;
        }
        if (this._rescanInterval) {
            clearInterval(this._rescanInterval);
            this._rescanInterval = null;
        }

        this.waitingElements.clear();
        document.querySelectorAll('[data-ypp-thumb-color], [data-ypp-color-wait]').forEach(el => {
            el.style.removeProperty('--ypp-thumb-color');
            el.style.removeProperty('--ypp-thumb-rgb');
            el.removeAttribute('data-ypp-thumb-color');
            el.removeAttribute('data-ypp-color-wait');
        });
    }

    observeNewNodes(root) {
        if (root.matches && root.matches(this.CARD_SELECTOR)) {
            this.observer.observe(root);
        }
        if (root.querySelectorAll) {
            root.querySelectorAll(this.CARD_SELECTOR).forEach(node => this.observer.observe(node));
        }
    }

    getImage(el) {
        // Try direct img selectors first (fastest)
        let img = el.querySelector('yt-image img, ytd-thumbnail img, yt-lockup-view-model img, .yt-core-image');
        // Fall back to shadow root (yt-image uses shadow DOM on some YouTube builds)
        if (!img) {
            const ytImage = el.querySelector('yt-image');
            if (ytImage && ytImage.shadowRoot) {
                img = ytImage.shadowRoot.querySelector('img');
            }
        }
        // Last resort: any img
        if (!img) {
            img = el.querySelector('img');
        }
        return img;
    }

    processElement(el) {
        if (el.hasAttribute('data-ypp-thumb-color')) return;

        const img = this.getImage(el);
        const src = img ? img.src : null;

        // Accept hqdefault thumbnails — don't block on maxres
        const isReady = src && !src.includes('data:image') && src.startsWith('http');

        if (!isReady) {
            if (!el.hasAttribute('data-ypp-color-wait')) {
                el.setAttribute('data-ypp-color-wait', 'true');
                this.waitingElements.add(el);
                this.startPolling();
            }
            return;
        }

        // Strip URL params (sqp=, v=, etc.) to maximize in-memory cache hits
        const cleanSrc = src.split('?')[0];

        if (this.cache.has(cleanSrc)) {
            const cached = this.cache.get(cleanSrc);
            this._applyColor(el, cached.colorStr, cached.rgbStr);
            return;
        }

        // ── PROVEN APPROACH from commit 7f2c736f ──────────────────────────────
        // Load the image in the content script context using new Image() +
        // crossOrigin = "Anonymous". This works because content scripts run
        // in the YouTube page origin, so i.ytimg.com sends CORS headers for it.
        // The background service-worker fetch() approach was failing because
        // i.ytimg.com doesn't send CORS headers for service-worker requests.
        const tempImg = new Image();
        tempImg.crossOrigin = 'Anonymous';

        tempImg.onload = () => {
            try {
                this.ctx.clearRect(0, 0, 10, 10);
                this.ctx.drawImage(tempImg, 0, 0, 10, 10);

                const data = this.ctx.getImageData(0, 0, 10, 10).data;
                let r = 0, g = 0, b = 0, count = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const pr = data[i];
                    const pg = data[i + 1];
                    const pb = data[i + 2];
                    const pa = data[i + 3];

                    if (pa < 200) continue; // Skip transparent/semi-transparent

                    // Skip near-black (letterbox bars) and near-white
                    if (pr < 15 && pg < 15 && pb < 15) continue;
                    if (pr > 240 && pg > 240 && pb > 240) continue;

                    // ── SKIN TONE FILTER ──────────────────────────────────────────
                    // If the pixel looks like human skin (flesh tones), skip it.
                    // This forces the algorithm to pick the environment/background color
                    // instead of making the card look like a giant face.
                    const isSkinTone = (pr > 95 && pg > 40 && pb > 20) &&
                                       (Math.max(pr, pg, pb) - Math.min(pr, pg, pb) > 15) &&
                                       (Math.abs(pr - pg) > 15) &&
                                       (pr > pg && pr > pb);
                    if (isSkinTone) continue;

                    r += pr;
                    g += pg;
                    b += pb;
                    count++;
                }

                // If we skipped everything (e.g., an image that is ONLY a face),
                // fallback to a soft vibrant default (like a pleasant teal or purple).
                if (count === 0) {
                    r = 80; g = 180; b = 200;
                    count = 1;
                }

                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                const enhanced = this.enhanceColor(r, g, b);
                const colorStr = `rgb(${enhanced.r}, ${enhanced.g}, ${enhanced.b})`;
                const rgbStr = `${enhanced.r}, ${enhanced.g}, ${enhanced.b}`;

                this.cache.set(cleanSrc, { colorStr, rgbStr });

                if (el.isConnected) {
                    this._applyColor(el, colorStr, rgbStr);
                }
            } catch (e) {
                // Silently ignore CORS/tainted canvas errors
            }
        };

        tempImg.onerror = () => {
            // Image rejected CORS — skip silently, card will show fallback beige
        };

        tempImg.src = cleanSrc;
    }

    _applyColor(el, colorStr, rgbStr) {
        el.style.setProperty('--ypp-thumb-color', colorStr);
        el.style.setProperty('--ypp-thumb-rgb', rgbStr);
        el.setAttribute('data-ypp-thumb-color', 'true');
        el.removeAttribute('data-ypp-color-wait');
        this.waitingElements.delete(el);
    }

    startPolling() {
        if (this._pollingInterval) return;
        this._pollingInterval = setInterval(() => {
            if (this.waitingElements.size === 0) {
                clearInterval(this._pollingInterval);
                this._pollingInterval = null;
                return;
            }
            for (const el of [...this.waitingElements]) {
                if (!document.body.contains(el)) {
                    this.waitingElements.delete(el);
                    continue;
                }
                const img = this.getImage(el);
                const src = img ? img.src : null;
                if (src && !src.includes('data:image') && src.startsWith('http')) {
                    this.waitingElements.delete(el);
                    el.removeAttribute('data-ypp-color-wait');
                    this.processElement(el);
                }
            }
        }, 250);
    }

    enhanceColor(r, g, b) {
        // ── Step 1: Normalize brightness ────────────────────────────────────────
        // Bring the dominant channel up to 215 (vivid but not blown-out white)
        const max = Math.max(r, g, b);
        if (max === 0) return { r: 80, g: 80, b: 80 };

        const brightnessTarget = 215;
        const brightnessBoost = Math.min(brightnessTarget / max, 3.5); // Up to 3.5× on dark images
        let nr = r * brightnessBoost;
        let ng = g * brightnessBoost;
        let nb = b * brightnessBoost;

        // ── Step 2: Boost saturation ─────────────────────────────────────────────
        // Push colors away from grey — grey = midpoint between new min/max.
        // satFactor > 1 makes colors more vivid. Increased to 2.1 for extra pop.
        const newMax = Math.max(nr, ng, nb);
        const newMin = Math.min(nr, ng, nb);
        const grey = (newMax + newMin) / 2;
        const satFactor = 2.1; // More vivid

        nr = grey + (nr - grey) * satFactor;
        ng = grey + (ng - grey) * satFactor;
        nb = grey + (nb - grey) * satFactor;

        return {
            r: Math.round(Math.min(255, Math.max(0, nr))),
            g: Math.round(Math.min(255, Math.max(0, ng))),
            b: Math.round(Math.min(255, Math.max(0, nb)))
        };
    }
}

window.YPP = window.YPP || {};
window.YPP.managers = window.YPP.managers || {};
window.YPP.managers.ThumbnailColorManager = ThumbnailColorManager;
