export class PinVideo extends window.YPP.features.BaseFeature {
    static featureId = 'pinVideoOnScroll';
    static executionPhase = 'idle';
    static priority = 20;

    constructor() {
        super('PinVideo');
        this.name = 'PinVideo';
        this.styleElement = null;
        this._boundScroll = this._onScroll.bind(this);
        this._ticking = false;
        this._playerInner = null;
        this._below = null;
        this._mastheadHeight = 56;
    }

    getConfigKey() { return 'pinVideoOnScroll'; }

    async enable() {
        await super.enable();
        this._injectStyles();
        document.body.classList.add('ypp-pin-video-scroll');
        
        // Setup dynamic depth of field
        window.addEventListener('scroll', this._boundScroll, { passive: true });
        
        this.utils?.log?.('Pin Video on Scroll (Parallax Mode V2) enabled', 'PIN-VIDEO');
    }

    async disable() {
        await super.disable();
        document.body.classList.remove('ypp-pin-video-scroll');
        this._removeStyles();
        window.removeEventListener('scroll', this._boundScroll);
        this._resetEffects();
    }

    onUpdate() {
        if (this.isEnabled) {
            this._injectStyles();
            document.body.classList.add('ypp-pin-video-scroll');
            window.addEventListener('scroll', this._boundScroll, { passive: true });
        } else {
            document.body.classList.remove('ypp-pin-video-scroll');
            this._removeStyles();
            window.removeEventListener('scroll', this._boundScroll);
            this._resetEffects();
        }
    }

    _onScroll() {
        if (!this._ticking) {
            window.requestAnimationFrame(() => {
                this._updateDepthOfField();
                this._ticking = false;
            });
            this._ticking = true;
        }
    }

    _updateDepthOfField() {
        if (!this._playerInner) this._playerInner = document.querySelector('#player');
        if (!this._below) this._below = document.querySelector('#below');
        
        if (!this._playerInner || !this._below) return;

        // Don't apply in fullscreen
        if (document.fullscreenElement) {
            this._resetEffects();
            return;
        }

        const belowRect = this._below.getBoundingClientRect();
        const playerRect = this._playerInner.getBoundingClientRect();
        
        // The bottom of where the video naturally is (if it wasn't overlapping)
        // Since it's sticky, playerRect.bottom is constant when sticky.
        // We measure how far #below's top is from the top of the viewport.
        // When belowRect.top <= playerRect.bottom, overlap begins.
        
        const overlap = playerRect.bottom - belowRect.top;
        
        if (overlap > 0) {
            // Calculate percentage of overlap relative to the video height
            let percentage = overlap / playerRect.height;
            if (percentage > 1) percentage = 1;
            
            // Max blur 12px, max dimming 50%
            const blurAmount = percentage * 12;
            const brightnessAmount = 1 - (percentage * 0.6);
            
            this._playerInner.style.filter = `blur(${blurAmount}px) brightness(${brightnessAmount})`;
            // Optional: slight scale down to enhance depth
            const scale = 1 - (percentage * 0.05);
            this._playerInner.style.transform = `scale(${scale})`;
        } else {
            this._resetEffects();
        }
    }

    _resetEffects() {
        if (this._playerInner) {
            this._playerInner.style.filter = '';
            this._playerInner.style.transform = '';
        }
    }

    _injectStyles() {
        if (document.getElementById('ypp-pin-video-styles')) return;
        const style = document.createElement('style');
        style.id = 'ypp-pin-video-styles';
        style.textContent = `
            /* Parallax Background Video Effect */
            
            /* Keep video container sticky at the top, but push it to z-index 0 */
            body.ypp-pin-video-scroll ytd-watch-flexy[is-two-columns_]:not([fullscreen]) #player-container-outer {
                position: sticky !important;
                top: var(--ytd-masthead-height, 56px) !important;
                z-index: 0 !important;
            }

            /* Inner player transitions for V2 Depth of Field */
            body.ypp-pin-video-scroll #player {
                transform-origin: center top;
                will-change: filter, transform;
            }

            /* Make the content below the video (title, description, comments) scroll OVER the video */
            body.ypp-pin-video-scroll ytd-watch-flexy[is-two-columns_]:not([fullscreen]) #below {
                position: relative !important;
                z-index: 10 !important;
                background: var(--yt-spec-base-background) !important;
                padding-top: 16px !important;
                border-top-left-radius: 16px !important;
                border-top-right-radius: 16px !important;
                box-shadow: 0 -12px 32px rgba(0,0,0,0.6), 0 -2px 8px rgba(0,0,0,0.3) !important;
                transition: box-shadow 0.3s ease !important;
            }
            
            /* In some layouts, #secondary (related videos) might overlap if theater mode is on, handle it gracefully */
            body.ypp-pin-video-scroll ytd-watch-flexy[theater]:not([fullscreen]) #secondary {
                position: relative !important;
                z-index: 10 !important;
                background: var(--yt-spec-base-background) !important;
                padding-top: 16px !important;
                border-top-left-radius: 16px !important;
                border-top-right-radius: 16px !important;
                box-shadow: 0 -12px 32px rgba(0,0,0,0.6) !important;
            }
        `;
        document.head.appendChild(style);
        this.styleElement = style;
    }

    _removeStyles() {
        if (this.styleElement && this.styleElement.parentNode) {
            this.styleElement.parentNode.removeChild(this.styleElement);
        }
        this.styleElement = null;
    }
}

window.YPP.features.PinVideo = PinVideo;
