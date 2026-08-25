import '../../../../../core/system/base-feature.js';
/**
 * Feature: Auto Subtitles (Netflix-Style) — V6
 * Intercepts YouTube's native captions and renders them with a premium, custom UI.
 *
 * V6 Fixes:
 * - FIX-1: SPA re-initialization via yt-navigate-finish
 * - FIX-2: Bionic Reading is now opt-in (not opt-out)
 * - FIX-3: Translation race condition fixed via _lastTransId guard
 * - FIX-4: Obstruction avoidance now uses MutationObserver (opacity-aware)
 * - FIX-5: Draggable position persisted to chrome.storage.sync
 * - FIX-6: Removed redundant inline opacity/visibility from _handleMutation
 * - FIX-7: Caption deduplication to skip redundant re-renders
 */

export class AutoSubtitles extends window.YPP.features.BaseFeature {
    static featureId = 'autoSubtitles';
    static executionPhase = 'idle';
    static priority = 999;

    // --- STATIC INIT: Run once when the class is first loaded ---
    // Cleans up any orphaned subtitle DOM left over from a previous page session
    // (e.g. extension update, content script re-injection, hard reload with feature OFF)
    static _purgeOrphans() {
        // Remove any leftover custom containers
        document.querySelectorAll('.ypp-custom-subtitles').forEach(el => el.remove());
        // Remove stale style tag that hides native subtitles
        const stale = document.getElementById('ypp-netflix-subs-style');
        if (stale) stale.remove();
        // Restore native subtitle container visibility if it was hidden
        const native = document.getElementById('ytp-caption-window-container');
        if (native) {
            native.style.removeProperty('opacity');
            native.style.removeProperty('visibility');
            native.style.removeProperty('pointer-events');
        }
    }

    constructor() {
        super('AutoSubtitles');
        this._observer = null;
        this._chromeObserver = null;
        this._customContainer = null;
        this._nativeContainer = null;
        this._currentStyle = 'netflix';
        this._clearTimeout = null;
        this._lastCaptionText = null;   // FIX-7: deduplication
        this._lastTransId = null;       // FIX-3: translation race guard
        this._translationCache = null;
        this._navVersion = 0;           // SUB-BUG-3: stale poll guard

        this._handleMutation = this._handleMutation.bind(this);
        this._handleNavigation = this._handleNavigation.bind(this);
    }

    getConfigKey() {
        return 'netflixSubtitles';
    }

    async enable() {
        await super.enable();
        this._injectStyles();

        // FIX-1: Listen for SPA navigations so subtitles re-attach on new videos
        this.addListener(window, 'yt-navigate-finish', this._handleNavigation);

        // SUBS-UP-3: Fullscreen repositioning — lift subtitles when in fullscreen
        this.addListener(document, 'fullscreenchange', () => {
            if (!this._customContainer) return;
            if (document.fullscreenElement) {
                this._customContainer.style.setProperty('--fullscreen-y', '-48px');
            } else {
                this._customContainer.style.setProperty('--fullscreen-y', '0px');
            }
        });

        this._startPolling();
        this._autoEnableCC();

        // SUBS-UP-4: After 5s, warn user if no captions appear
        this._ccToastShown = false;
        this._ccCheckTimer = setTimeout(() => {
            if (this.isEnabled && this._customContainer && !this._customContainer.classList.contains('active')) {
                if (!this._ccToastShown) {
                    this._ccToastShown = true;
                    this.utils.createToast?.('🎬 Netflix Subtitles: No captions detected. Press C to enable CC.', 'info', 7000);
                }
            }
        }, 5000);
    }

    async disable() {
        await super.disable();

        // Clear CC check timer
        if (this._ccCheckTimer) { clearTimeout(this._ccCheckTimer); this._ccCheckTimer = null; }
        // Clear karaoke timer
        if (this._karaokeTimer) { clearTimeout(this._karaokeTimer); this._karaokeTimer = null; }

        // Step 1: Immediately hide the custom container
        if (this._customContainer) {
            this._customContainer.style.display = 'none';
        }

        // Step 2: Full teardown
        this._teardown();

        // Step 3: Remove the CSS !important rule
        this._removeStyles();

        // Step 4: Restore native container
        const nativeToRestore = this._nativeContainer || document.getElementById('ytp-caption-window-container');
        if (nativeToRestore) {
            nativeToRestore.style.removeProperty('opacity');
            nativeToRestore.style.removeProperty('visibility');
            nativeToRestore.style.removeProperty('pointer-events');
        }

        // Step 5: Nuclear — purge any remaining orphaned containers
        document.querySelectorAll('.ypp-custom-subtitles').forEach(el => el.remove());

        this._nativeContainer = null;
    }

    onUpdate(settings, oldSettings) {
        if (settings.subtitleStyle !== oldSettings?.subtitleStyle) {
            this._currentStyle = settings.subtitleStyle || 'netflix';
            if (this._customContainer) {
                this._customContainer.className = `ypp-custom-subtitles style-${this._currentStyle}`;
            }
        }
        // SUBS-UP-2: Apply scale and opacity CSS variables live when settings change
        if (this._customContainer) {
            const scale = settings.subtitleScale ?? 1;
            const bgOpacity = settings.subtitleBgOpacity ?? 0.4;
            this._customContainer.style.setProperty('--subtitle-scale', scale);
            this._customContainer.style.setProperty('--subtitle-bg-opacity', bgOpacity);
        }
    }

    // FIX-1: SPA navigation handler — teardown old state and re-init
    _handleNavigation() {
        if (!this.isEnabled) return;
        this._teardown();
        this._lastCaptionText = null;
        this._lastTransId = null;
        // SUB-BUG-4: Clear translation cache on video change to avoid stale translations
        if (this._translationCache) this._translationCache.clear();
        // SUB-BUG-3: Increment version so any in-flight poll callbacks are discarded
        this._navVersion++;
        this._startPolling();
        this._autoEnableCC();
    }

    // Shared polling logic used by enable() and _handleNavigation()
    _startPolling() {
        const expectedVersion = this._navVersion;
        this.pollFor(() => {
            // SUB-BUG-3: If user navigated again while polling, discard this callback
            if (this._navVersion !== expectedVersion) return true; // abort gracefully
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
    }

    // Tears down observers and removes the custom container, but does NOT touch native styles
    _teardown() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        if (this._chromeObserver) {
            this._chromeObserver.disconnect();
            this._chromeObserver = null;
        }
        clearTimeout(this._clearTimeout);
        this._cleanupDraggable();
        if (this._customContainer) {
            this._customContainer.remove();
            this._customContainer = null;
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
        if (!this._abortController || this._abortController.signal.aborted) return;
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

        // FIX-4: Smart Obstruction Avoidance via MutationObserver (opacity-aware, not resize-based)
        const chromeBottom = player.querySelector('.ytp-chrome-bottom');
        if (chromeBottom) {
            this._chromeObserver = new MutationObserver(() => {
                if (!this._customContainer) return;
                const opacity = parseFloat(chromeBottom.style.opacity ?? '1');
                const isVisible = opacity > 0.1 && chromeBottom.style.display !== 'none';
                if (isVisible) {
                    const height = chromeBottom.getBoundingClientRect().height;
                    this._customContainer.style.setProperty('--obstruction-y', `-${height + 15}px`);
                } else {
                    this._customContainer.style.setProperty('--obstruction-y', `0px`);
                }
            });
            this._chromeObserver.observe(chromeBottom, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }

        // Setup Draggable
        this._setupDraggable(this._customContainer);
    }

    _handleMutation() {
        if (!this._abortController || this._abortController.signal.aborted) return;
        if (!this._nativeContainer || !this._customContainer) return;

        // Extract only the single most recent caption line
        let activeLines = Array.from(this._nativeContainer.querySelectorAll('.caption-visual-line'));

        // Fallback for different YouTube DOM structures
        if (activeLines.length === 0) {
            activeLines = Array.from(this._nativeContainer.querySelectorAll('.ytp-caption-segment'));
        }

        let captions = '';
        if (activeLines.length > 0) {
            captions = activeLines[activeLines.length - 1].textContent.trim();
        }

        if (!captions) {
            this._customContainer.classList.remove('active');
            clearTimeout(this._clearTimeout);
            this._clearTimeout = setTimeout(() => {
                if (this._customContainer) this._customContainer.innerHTML = '';
            }, 300);
            return;
        }

        // FIX-7: Skip re-render if caption text hasn't changed
        if (captions === this._lastCaptionText) return;
        this._lastCaptionText = captions;

        // FIX-2: Bionic Reading is now opt-in (default OFF)
        let processedCaptions = captions;
        if (this.settings?.bionicReading === true) {
            processedCaptions = captions.split('\n').map(line => this._applyBionicReading(line)).join('<br/>');
        } else {
            processedCaptions = captions.replace(/\n/g, '<br/>');
        }

        // Dual-Language Translation
        let html = `<span>${processedCaptions}</span>`;
        if (this.settings?.dualLanguage) {
            // FIX-3: Generate a unique ID and track it; skip stale resolutions
            const transId = 'ypp-trans-' + Math.random().toString(36).substr(2, 9);
            this._lastTransId = transId;
            html += `<br/><span id="${transId}" class="dual-lang-sub" style="font-size: 0.8em; color: var(--yt-spec-text-secondary, #ccc);">...</span>`;

            this._getTranslation(captions.replace(/\n/g, ' ')).then(translated => {
                // FIX-3: Only update if this translation is still the latest one
                if (this._lastTransId !== transId) return;
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

        // SUBS-UP-1: Karaoke — highlight the active word based on video time
        if (this.settings?.karaokeMode === true) {
            this._startKaraoke(captions);
        }
    }

    // SUBS-UP-1: Karaoke word highlight
    _startKaraoke(rawText) {
        if (this._karaokeTimer) clearTimeout(this._karaokeTimer);
        const video = document.querySelector('video.html5-main-video');
        if (!video || !this._customContainer) return;

        const words = rawText.split(' ');
        const msPerWord = Math.min(800, Math.max(150, (words.length > 0 ? 4000 / words.length : 400)));

        // Wrap each word in a span for highlight control
        const mainSpan = this._customContainer.querySelector('span');
        if (!mainSpan) return;
        mainSpan.innerHTML = words.map((w, i) =>
            `<span class="ypp-word" id="ypp-word-${i}">${w}</span>`
        ).join(' ');

        let wordIdx = 0;
        const highlightNext = () => {
            if (!this._customContainer || wordIdx >= words.length) return;
            // Remove previous
            const prev = this._customContainer.querySelector('.ypp-word.active-word');
            if (prev) prev.classList.remove('active-word');
            // Highlight current
            const el = this._customContainer.querySelector(`#ypp-word-${wordIdx}`);
            if (el) el.classList.add('active-word');
            wordIdx++;
            if (wordIdx < words.length) {
                this._karaokeTimer = setTimeout(highlightNext, msPerWord);
            }
        };
        highlightNext();
    }

    _setupDraggable(container) {
        let isDragging = false;
        let startY, startBaseY;

        const STORAGE_KEY = 'ypp_subtitle_base_y';

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
            // FIX-5: Persist position to chrome.storage.sync
            const newY = container.style.getPropertyValue('--base-y');
            try {
                if (chrome?.storage?.sync) {
                    chrome.storage.sync.set({ [STORAGE_KEY]: newY });
                }
            } catch (_) {}
        };

        container.addEventListener('mousedown', this._dragStart);
        document.addEventListener('mousemove', this._dragMove);
        document.addEventListener('mouseup', this._dragEnd);

        // FIX-5: Restore persisted position from chrome.storage.sync
        container.style.setProperty('--obstruction-y', '0px');
        try {
            if (chrome?.storage?.sync) {
                chrome.storage.sync.get(STORAGE_KEY).then(data => {
                    const saved = data[STORAGE_KEY];
                    container.style.setProperty('--base-y', saved || '0px');
                }).catch(() => {
                    container.style.setProperty('--base-y', '0px');
                });
            } else {
                container.style.setProperty('--base-y', '0px');
            }
        } catch (_) {
            container.style.setProperty('--base-y', '0px');
        }
    }

    _cleanupDraggable() {
        if (this._customContainer && this._dragStart) {
            this._customContainer.removeEventListener('mousedown', this._dragStart);
        }
        if (this._dragMove) document.removeEventListener('mousemove', this._dragMove);
        if (this._dragEnd) document.removeEventListener('mouseup', this._dragEnd);
        this._dragStart = null;
        this._dragMove = null;
        this._dragEnd = null;
    }

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

    _applyBionicReading(text) {
        return text.split(' ').map(word => {
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
                bottom: 2%;
                left: 50%;
                --base-y: 0px;
                --obstruction-y: 0px;
                --fullscreen-y: 0px;
                --subtitle-scale: 1;
                --subtitle-bg-opacity: 0.4;
                transform: translate(-50%, calc(var(--base-y) + var(--obstruction-y) + var(--fullscreen-y))) scale(calc(var(--subtitle-scale) * 0.95));
                width: 80%;
                text-align: center;
                pointer-events: auto;
                cursor: grab;
                z-index: 50;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
                opacity: 0;
            }

            .ypp-custom-subtitles.dragging {
                transition: none;
            }

            .ypp-custom-subtitles.active {
                opacity: 1;
                transform: translate(-50%, calc(var(--base-y) + var(--obstruction-y) + var(--fullscreen-y))) scale(var(--subtitle-scale));
            }

            /* Karaoke Highlight */
            .ypp-word { transition: color 0.1s ease, text-shadow 0.1s ease; }
            .ypp-word.active-word { color: #FFD700 !important; text-shadow: 0 0 10px rgba(255,215,0,0.8) !important; }

            /* Profile: Netflix */
            .ypp-custom-subtitles.style-netflix {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: clamp(16px, 3.5vh, 42px);
                font-weight: 700;
                color: #ffffff;
                text-shadow: 0px 0px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.8);
                background: rgba(0, 0, 0, var(--subtitle-bg-opacity));
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

            /* Profile: Accessibility */
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

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.AutoSubtitles = AutoSubtitles;
