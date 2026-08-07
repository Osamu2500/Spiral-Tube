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
    }

    getConfigKey() {
        return 'autoSubtitles'; // Assuming setting exists
    }

    async enable() {
        await super.enable();
        this._injectStyles();
        
        // Polling for the player and caption container
        this.pollFor(() => {
            const player = document.getElementById('movie_player');
            const native = document.getElementById('ytp-caption-window-container');
            if (player && native) {
                this._initRenderer(player, native);
                return true;
            }
            return false;
        }, 10000, 500).catch(() => {
            this.utils.log?.('AutoSubtitles: Player not found or polling aborted', 'SUBS', 'warn');
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
        if (this._chromeObserver) {
            this._chromeObserver.disconnect();
            this._chromeObserver = null;
        }
        this._cleanupDraggable();
        if (this._customContainer) {
            this._customContainer.remove();
            this._customContainer = null;
        }
        if (this._nativeContainer) {
            this._nativeContainer.style.opacity = '1';
            this._nativeContainer.style.visibility = 'visible';
            this._nativeContainer = null;
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
        if (this._abortController?.signal.aborted) return;
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
        
        // Smart Obstruction Avoidance
        const chromeBottom = player.querySelector('.ytp-chrome-bottom');
        if (chromeBottom) {
            this._chromeObserver = new ResizeObserver(() => {
                const isVisible = chromeBottom.style.opacity !== '0' && chromeBottom.style.display !== 'none';
                if (isVisible) {
                    const height = chromeBottom.getBoundingClientRect().height;
                    this._customContainer.style.setProperty('--obstruction-y', `-${height + 15}px`);
                } else {
                    this._customContainer.style.setProperty('--obstruction-y', `0px`);
                }
            });
            this._chromeObserver.observe(chromeBottom);
        }

        // Setup Draggable
        this._setupDraggable(this._customContainer);
    }

    _handleMutation(mutations) {
        if (this._abortController?.signal.aborted) return;
        
        // V4: Sync Fix for Rollup/Live Captions
        // YouTube often keeps multiple old lines in the DOM during rollups.
        // We only extract the most recent 1-2 lines to ensure it stays synced.
        let activeLines = Array.from(this._nativeContainer.querySelectorAll('.caption-visual-line'))
            .map(line => line.textContent.trim())
            .filter(text => text.length > 0);
            
        // Keep only the single most recent line for Rollup/Live captions
        activeLines = activeLines.slice(-1);
        
        let captions = activeLines.join('\n');
        
        // Fallback for different YouTube DOM structures
        if (!captions) {
            captions = Array.from(this._nativeContainer.querySelectorAll('.ytp-caption-segment'))
                .map(el => el.textContent.trim())
                .filter(text => text.length > 0)
                .join(' ');
        }
            
        if (!captions) {
            this._customContainer.classList.remove('active');
            clearTimeout(this._clearTimeout);
            this._clearTimeout = setTimeout(() => {
                this._customContainer.innerHTML = '';
            }, 300); // Wait for fade out
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
            const transId = 'ypp-trans-' + Math.random().toString(36).substr(2, 9);
            html += `<br/><span id="${transId}" class="dual-lang-sub" style="font-size: 0.8em; color: var(--yt-spec-text-secondary, #ccc);">...</span>`;
            
            this._getTranslation(captions.replace(/\n/g, ' ')).then(translated => {
                const transSpan = document.getElementById(transId);
                if (transSpan && translated) {
                    transSpan.textContent = translated;
                }
            });
        }
        
        // Render in our container
        clearTimeout(this._clearTimeout);
        this._customContainer.innerHTML = html;
        this._customContainer.classList.add('active');
        
        // Native container is hidden via CSS, but let's be sure
        this._nativeContainer.style.opacity = '0';
        this._nativeContainer.style.visibility = 'hidden';
    }

    _setupDraggable(container) {
        let isDragging = false;
        let startY, startBaseY;

        this._dragStart = (e) => {
            isDragging = true;
            startY = e.clientY;
            startBaseY = parseFloat(container.style.getPropertyValue('--base-y')) || 0;
            container.style.cursor = 'grabbing';
            container.classList.add('dragging');
            e.preventDefault();
        };

        this._dragMove = (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - startY;
            const newBaseY = startBaseY + deltaY;
            container.style.setProperty('--base-y', `${newBaseY}px`);
        };

        this._dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            container.style.cursor = 'grab';
            container.classList.remove('dragging');
            if (this.settings) {
                this.settings.customSubtitleBaseY = container.style.getPropertyValue('--base-y');
                // Ideally we'd persist this using FeatureManager
            }
        };

        container.addEventListener('mousedown', this._dragStart);
        document.addEventListener('mousemove', this._dragMove);
        document.addEventListener('mouseup', this._dragEnd);
        
        // Apply saved position
        if (this.settings?.customSubtitleBaseY) {
            container.style.setProperty('--base-y', this.settings.customSubtitleBaseY);
        } else {
            container.style.setProperty('--base-y', '0px');
        }
        container.style.setProperty('--obstruction-y', '0px');
    }

    _cleanupDraggable() {
        if (this._customContainer) {
            this._customContainer.removeEventListener('mousedown', this._dragStart);
        }
        document.removeEventListener('mousemove', this._dragMove);
        document.removeEventListener('mouseup', this._dragEnd);
    }
    
    // --- V2 Features ---
    
    async _getTranslation(text) {
        if (!text) return '';
        
        if (!this._translationCache) this._translationCache = new Map();
        if (this._translationCache.has(text)) return this._translationCache.get(text);
        
        const targetLang = this.settings?.targetLanguage || navigator.language.split('-')[0] || 'en';
        
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            const data = await response.json();
            const translatedText = data[0].map(item => item[0]).join('');
            
            if (this._translationCache.size > 100) this._translationCache.clear();
            this._translationCache.set(text, translatedText);
            
            return translatedText;
        } catch (e) {
            this.utils.log?.('Translation failed', 'SUBS', 'warn');
            return '';
        }
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
                --base-y: 0px;
                --obstruction-y: 0px;
                transform: translate(-50%, calc(var(--base-y) + var(--obstruction-y))) scale(0.95);
                width: 80%;
                text-align: center;
                pointer-events: auto;
                cursor: grab;
                z-index: 50;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
                opacity: 0;
            }
            
            .ypp-custom-subtitles.dragging {
                transition: none; /* Instant follow */
            }

            .ypp-custom-subtitles.active {
                opacity: 1;
                transform: translate(-50%, calc(var(--base-y) + var(--obstruction-y))) scale(1);
            }
            
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
