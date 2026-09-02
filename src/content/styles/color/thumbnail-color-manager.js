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

        // Let the central EventBus handle dynamically-added cards
        if (window.YPP && window.YPP.events) {
            window.YPP.events.on('dom:thumbnailsAdded', (payload) => {
                if (!this.enabled) return;
                payload.nodes.forEach(n => this.observer.observe(n.el));
            });
        }
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

        // EventBus listener (registered in constructor) will automatically handle dynamically-added cards.



        // Step 4: Periodic rescan for the first 15 seconds.
        // YouTube can inject cards at any time. This is the ultimate safety net.
        let rescanCount = 0;
        this._rescanInterval = window.setInterval(() => {
            if (!this.enabled || rescanCount >= 15) {
                window.clearInterval(this._rescanInterval);
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

        if (this._pollingInterval) {
            window.clearInterval(this._pollingInterval);
            this._pollingInterval = null;
        }
        if (this._rescanInterval) {
            window.clearInterval(this._rescanInterval);
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
        const tempImg = new Image();
        tempImg.crossOrigin = 'Anonymous';

        tempImg.onload = () => {
            try {
                this.ctx.clearRect(0, 0, 10, 10);
                this.ctx.drawImage(tempImg, 0, 0, 10, 10);

                const data = this.ctx.getImageData(0, 0, 10, 10).data;
                
                // Hue bins: 12 bins of 30 degrees each
                const bins = new Array(12).fill(0).map(() => ({ r: 0, g: 0, b: 0, count: 0, weight: 0 }));

                let totalValidPixels = 0;
                let saturatedPixels = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const pr = data[i];
                    const pg = data[i + 1];
                    const pb = data[i + 2];
                    const pa = data[i + 3];

                    if (pa < 200) continue; // Skip transparent

                    // Skip near-black and near-white
                    if (pr < 20 && pg < 20 && pb < 20) continue;
                    if (pr > 235 && pg > 235 && pb > 235) continue;

                    totalValidPixels++;

                    // ── SKIN TONE FILTER ──────────────────────────────────────────
                    const isSkinTone = (pr > 95 && pg > 40 && pb > 20) &&
                                       (Math.max(pr, pg, pb) - Math.min(pr, pg, pb) > 15) &&
                                       (Math.abs(pr - pg) > 15) &&
                                       (pr > pg && pr > pb);
                    if (isSkinTone) continue;

                    // Calculate HSL to find Hue
                    const rNorm = pr / 255;
                    const gNorm = pg / 255;
                    const bNorm = pb / 255;
                    const max = Math.max(rNorm, gNorm, bNorm);
                    const min = Math.min(rNorm, gNorm, bNorm);
                    let h, s, l = (max + min) / 2;

                    if (max === min) {
                        h = s = 0; // achromatic
                    } else {
                        const d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch (max) {
                            case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                            case gNorm: h = (bNorm - rNorm) / d + 2; break;
                            case bNorm: h = (rNorm - gNorm) / d + 4; break;
                        }
                        h /= 6;
                    }

                    // Skip very low saturation (muddy/grey pixels)
                    if (s < 0.15) continue;

                    saturatedPixels++;

                    const hueDegree = h * 360;
                    const binIndex = Math.floor(hueDegree / 30) % 12;
                    
                    // Weight highly saturated and mid-lightness pixels heavier
                    const weight = s * (1 - Math.abs(l - 0.5));
                    
                    bins[binIndex].r += pr;
                    bins[binIndex].g += pg;
                    bins[binIndex].b += pb;
                    bins[binIndex].count++;
                    bins[binIndex].weight += weight;
                }

                // If less than 5% of valid pixels have color, treat as Black & White
                let isGreyscale = (totalValidPixels > 0 && saturatedPixels < totalValidPixels * 0.05);

                // Find the dominant hue bin
                let bestBin = null;
                let maxWeight = -1;
                for (const bin of bins) {
                    if (bin.count > 0 && bin.weight > maxWeight) {
                        maxWeight = bin.weight;
                        bestBin = bin;
                    }
                }

                let r, g, b;
                if (isGreyscale) {
                    // Pure white for B&W thumbnails
                    r = 250; g = 250; b = 250;
                } else if (bestBin) {
                    // Average ONLY the pixels that share the dominant hue
                    r = Math.round(bestBin.r / bestBin.count);
                    g = Math.round(bestBin.g / bestBin.count);
                    b = Math.round(bestBin.b / bestBin.count);
                } else {
                    // Fallback to white if no bins were populated
                    r = 250; g = 250; b = 250;
                    isGreyscale = true;
                }

                let colorStr, rgbStr;
                if (isGreyscale) {
                    // Bypass enhancement for B&W to prevent turning it into vibrant red
                    colorStr = `rgb(${r}, ${g}, ${b})`;
                    rgbStr = `${r}, ${g}, ${b}`;
                } else {
                    const enhanced = this.enhanceColor(r, g, b);
                    colorStr = `rgb(${enhanced.r}, ${enhanced.g}, ${enhanced.b})`;
                    rgbStr = `${enhanced.r}, ${enhanced.g}, ${enhanced.b}`;
                }

                this.cache.set(cleanSrc, { colorStr, rgbStr });

                if (el.isConnected) {
                    this._applyColor(el, colorStr, rgbStr);
                }
            } catch (e) {
                // Silently ignore CORS/tainted canvas errors
            }
        };

        tempImg.onerror = () => {
            // Image rejected CORS — skip silently
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
        this._pollingInterval = window.setInterval(() => {
            if (this.waitingElements.size === 0) {
                window.clearInterval(this._pollingInterval);
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
        // ── HSL FORCED VIBRANCY ALGORITHM ───────────────────────────────────────
        // Instead of blindly multiplying RGB values, we convert to HSL and mathematically
        // FORCE the saturation and lightness into the "Vibrant & Rich" sweet spot.
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                case gNorm: h = (bNorm - rNorm) / d + 2; break;
                case bNorm: h = (rNorm - gNorm) / d + 4; break;
            }
            h /= 6;
        }

        // FORCE high saturation (minimum 70%, maximum 95%)
        // This instantly cures muddy/pastel colors.
        s = Math.max(0.70, Math.min(s * 1.5, 0.95)); 
        
        // FORCE rich lightness (minimum 40%, maximum 65%)
        // Keeps colors deeply pigmented but bright enough to pop.
        l = Math.max(0.40, Math.min(l * 1.2, 0.65));

        // Convert back to RGB
        let rr, gg, bb;
        if (s === 0) {
            rr = gg = bb = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            rr = hue2rgb(p, q, h + 1/3);
            gg = hue2rgb(p, q, h);
            bb = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(rr * 255),
            g: Math.round(gg * 255),
            b: Math.round(bb * 255)
        };
    }
}

window.YPP = window.YPP || {};
window.YPP.managers = window.YPP.managers || {};
window.YPP.managers.ThumbnailColorManager = ThumbnailColorManager;
