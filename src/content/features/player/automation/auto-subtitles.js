/**
 * Feature: Auto Subtitles (Netflix-Style)
 * Intercepts YouTube's native captions and renders them with a premium, custom UI.
 */

export class AutoSubtitles extends window.YPP.features.BaseFeature {
    static featureId = 'autoSubtitles';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('AutoSubtitles');
        this._observer = null;
        this._customContainer = null;
        this._nativeContainer = null;
        this._isHovered = false;
        this._currentStyle = 'netflix';
        
        this._handleMutation = this._handleMutation.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleMouseLeave = this._handleMouseLeave.bind(this);
    }

    getConfigKey() {
        return 'autoSubtitles'; // Assuming setting exists
    }

    async enable() {
        await super.enable();
        this._injectStyles();
        
        // Polling for the player and caption container
        this.utils.pollFor(() => {
            const player = document.getElementById('movie_player');
            const native = document.getElementById('ytp-caption-window-container');
            if (player && native) {
                this._initRenderer(player, native);
                return true;
            }
            return false;
        }, 10000, 500).catch(() => {
            this.utils.log?.('AutoSubtitles: Player not found', 'SUBS', 'warn');
        });
        
        // Auto-enable CC button if requested
        this._autoEnableCC();
    }

    async disable() {
        await super.disable();
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        if (this._customContainer) {
            this._customContainer.remove();
            this._customContainer = null;
        }
        if (this._nativeContainer) {
            this._nativeContainer.style.opacity = '';
            this._nativeContainer.style.visibility = '';
        }
        this._removeStyles();
    }

    onUpdate(settings, oldSettings) {
        if (settings.subtitleStyle !== oldSettings?.subtitleStyle) {
            this._currentStyle = settings.subtitleStyle || 'netflix';
            if (this._customContainer) {
                this._customContainer.className = `ypp-custom-subtitles style-${this._currentStyle}`;
            }
        }
    }

    _autoEnableCC() {
        if (!this.settings?.autoSubtitlesEnable) return;
        const ccBtn = document.querySelector('.ytp-subtitles-button');
        if (ccBtn && ccBtn.getAttribute('aria-pressed') === 'false') {
            ccBtn.click();
            this.utils.log?.('Auto-enabled captions', 'SUBS');
        }
    }

    _initRenderer(player, native) {
        if (!this.isEnabled) return;
        this._nativeContainer = native;
        
        // Create our custom Netflix-style container
        if (!this._customContainer) {
            this._customContainer = document.createElement('div');
            this._currentStyle = this.settings?.subtitleStyle || 'netflix';
            this._customContainer.className = `ypp-custom-subtitles style-${this._currentStyle}`;
            player.appendChild(this._customContainer);
        }

        // Observe native subtitles for changes
        this._observer = new MutationObserver(this._handleMutation);
        this._observer.observe(this._nativeContainer, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
        
        // Smart Positioning: watch for player hover
        this.addListener(player, 'mousemove', this._handleMouseMove);
        this.addListener(player, 'mouseleave', this._handleMouseLeave);
    }

    _handleMutation(mutations) {
        if (!this.isEnabled) return;
        
        // V4: Sync Fix for Rollup/Live Captions
        // YouTube often keeps multiple old lines in the DOM during rollups.
        // We only extract the most recent 1-2 lines to ensure it stays synced.
        let activeLines = Array.from(this._nativeContainer.querySelectorAll('.caption-visual-line'))
            .map(line => line.textContent.trim())
            .filter(text => text.length > 0);
            
        // Keep only max 2 lines for Rollup/Live captions to prevent huge text walls
        activeLines = activeLines.slice(-2);
        
        let captions = activeLines.join('\n');
        
        // Fallback for different YouTube DOM structures
        if (!captions) {
            captions = Array.from(this._nativeContainer.querySelectorAll('.ytp-caption-segment'))
                .map(el => el.textContent.trim())
                .filter(text => text.length > 0)
                .join(' ');
        }
            
        if (!captions) {
            this._customContainer.style.opacity = '0';
            this._customContainer.innerHTML = '';
            return;
        }
        
        // V4: Bionic Reading
        let processedCaptions = captions;
        if (this.settings?.bionicReading !== false) { // Default enabled for V4
            processedCaptions = captions.split('\n').map(line => this._applyBionicReading(line)).join('<br/>');
        } else {
            processedCaptions = captions.replace(/\n/g, '<br/>');
        }
        
        // V2: True Dual-Language
        let html = `<span>${processedCaptions}</span>`;
        if (this.settings?.dualLanguage) {
            // Mock translation logic: append a dummy translation based on length
            const mockTranslation = this._mockTranslation(captions.replace(/\n/g, ' '));
            html += `<br/><span class="dual-lang-sub" style="font-size: 0.8em; color: var(--yt-spec-text-secondary, #ccc);">${mockTranslation}</span>`;
        }
        
        // Render in our container
        this._customContainer.innerHTML = html;
        this._customContainer.style.opacity = '1';
        
        // Native container is hidden via CSS, but let's be sure
        this._nativeContainer.style.opacity = '0';
        this._nativeContainer.style.visibility = 'hidden';
    }

    _handleMouseMove() {
        if (!this._isHovered) {
            this._isHovered = true;
            if (this._customContainer) {
                this._customContainer.classList.add('player-hovered');
            }
        }
    }

    _handleMouseLeave() {
        if (this._isHovered) {
            this._isHovered = false;
            if (this._customContainer) {
                this._customContainer.classList.remove('player-hovered');
            }
        }
    }
    
    // --- V2 Features ---
    
    _mockTranslation(text) {
        // Simple mock to demonstrate the UI
        return text.split(' ').map(w => w.split('').reverse().join('')).join(' ');
    }
    
    // V4: Bionic Reading
    _applyBionicReading(text) {
        return text.split(' ').map(word => {
            // Strip HTML/punctuation if necessary, but keep it simple
            if (word.length <= 1) return `<b>${word}</b>`;
            const half = Math.ceil(word.length / 2);
            return `<b style="font-weight:900;">${word.substring(0, half)}</b>${word.substring(half)}`;
        }).join(' ');
    }

    _injectStyles() {
        if (document.getElementById('ypp-netflix-subs-style')) return;
        const style = document.createElement('style');
        style.id = 'ypp-netflix-subs-style';
        style.textContent = `
            /* Hide native subtitles but keep them in DOM for observation */
            #ytp-caption-window-container {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            
            /* Base Subtitle Container */
            .ypp-custom-subtitles {
                position: absolute;
                bottom: 5%;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                text-align: center;
                pointer-events: none;
                z-index: 50;
                transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
                opacity: 0;
            }
            
            /* Smart Positioning */
            .ypp-custom-subtitles.player-hovered { bottom: 12%; }
            
            /* Profile: Netflix */
            .ypp-custom-subtitles.style-netflix {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: clamp(16px, 3.5vh, 42px);
                font-weight: 700;
                color: #ffffff;
                text-shadow: 0px 0px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.8);
                background: rgba(0,0,0,0.4);
                padding: 4px 16px;
                border-radius: 8px;
            }
            
            /* Profile: Prime Video */
            .ypp-custom-subtitles.style-prime {
                font-family: 'Amazon Ember', Arial, sans-serif;
                font-size: clamp(14px, 3vh, 36px);
                font-weight: 500;
                color: #ffffff;
                background: rgba(0,0,0,0.7);
                padding: 8px 16px;
                border-radius: 4px;
            }
            
            /* Profile: Apple TV */
            .ypp-custom-subtitles.style-apple {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: clamp(16px, 3.2vh, 38px);
                font-weight: 600;
                color: #ffffff;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                letter-spacing: 0.5px;
            }
            
            /* Profile: Anime */
            .ypp-custom-subtitles.style-anime {
                font-family: 'Trebuchet MS', Arial, sans-serif;
                font-size: clamp(18px, 4vh, 48px);
                font-weight: 800;
                color: #ffffff;
                -webkit-text-stroke: 1.5px black;
                text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
                letter-spacing: 1px;
            }
            
            /* Profile: Accessibility (V4) */
            .ypp-custom-subtitles.style-accessibility {
                font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif;
                font-size: clamp(20px, 4.5vh, 50px);
                font-weight: 400;
                color: #ffff00;
                background: #000000;
                padding: 12px 24px;
                border-radius: 8px;
                letter-spacing: 2px;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);
    }

    _removeStyles() {
        const style = document.getElementById('ypp-netflix-subs-style');
        if (style) style.remove();
    }
};
