import '../../../../core/system/base-feature.js';
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
    }

    constructor() {
        super('AutoSubtitles');
        this._chromeObserver = null;
        this._customContainer = null;
        this._nativeContainer = null;
        this._currentStyle = 'netflix';
        this._lastCaptionText = null;
        this._navVersion = 0;           

        // V3 State
        this._timedTextTrack = null;
        this._timedTextTranslation = null;
        this._renderLoopId = null;

        // V6 Performance State
        this._currentTrackIndex = -1;
        this._wordSpansCache = null;
        this._lastEventRef = null;

        this._handleTimedText = this._handleTimedText.bind(this);
        this._handleNavigation = this._handleNavigation.bind(this);
    }

    getConfigKey() {
        return 'netflixSubtitles';
    }

    async enable() {
        await super.enable();

        // V3: Listen for intercepted API payloads from page-bridge
        this.addListener(window, 'ypp-timedtext-intercepted', this._handleTimedText);

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
    }

    async disable() {
        await super.disable();

        // Step 1: Immediately hide the custom container
        if (this._customContainer) {
            this._customContainer.style.display = 'none';
        }

        // Step 2: Full teardown
        this._teardown();

        // Step 4: Nuclear — purge any remaining orphaned containers
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

    // FIX-1: SPA navigation handler — reuse DOM state instead of full teardown
    _handleNavigation() {
        if (!this.isEnabled) return;
        
        // Don't fully teardown, just clear state to avoid DOM thrashing
        if (this._renderLoopId) {
            cancelAnimationFrame(this._renderLoopId);
            this._renderLoopId = null;
        }
        this._lastCaptionText = null;
        this._lastEventRef = null;
        this._wordSpansCache = null;
        this._currentTrackIndex = -1;
        
        // V3: Clear tracks on video change
        this._timedTextTrack = null;
        this._timedTextTranslation = null;
        
        // Clear visually
        if (this._customContainer) {
            this._customContainer.innerHTML = '';
            this._customContainer.classList.remove('active');
        }

        // SUB-BUG-3: Increment version so any in-flight poll callbacks are discarded
        this._navVersion++;
        this._startPolling();
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
        if (this._renderLoopId) {
            cancelAnimationFrame(this._renderLoopId);
            this._renderLoopId = null;
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
    }

    // _autoEnableCC was removed to respect native YouTube CC preferences

    _initRenderer(player, native) {
        if (!this._abortController || this._abortController.signal.aborted) return;
        this._nativeContainer = native;

        // Reuse our custom Netflix-style container instead of creating a new one on every video change
        if (!this._customContainer || !document.contains(this._customContainer)) {
            if (this._customContainer) this._customContainer.remove();
            
            this._customContainer = document.createElement('div');
            this._currentStyle = this.settings?.subtitleStyle || 'netflix';
            this._customContainer.className = `ypp-custom-subtitles style-${this._currentStyle}`;
            player.appendChild(this._customContainer);
            
            // Setup Draggable only when creating
            this._setupDraggable(this._customContainer);    
        }

        // V3: Start renderer loop
        this._startV3Renderer();

        // FIX-4: Smart Obstruction Avoidance via MutationObserver
        // Always disconnect the old observer in case YouTube replaced the internal player chrome
        if (this._chromeObserver) {
            this._chromeObserver.disconnect();
            this._chromeObserver = null;
        }

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
    }

    _handleTimedText(e) {
        if (!this.isEnabled) return;
        const { url, data } = e.detail;

        if (url.includes('&tlang=')) {
            // Secondary track (translation)
            this._timedTextTranslation = this._parseTimedText(data);
        } else {
            // Primary track
            this._timedTextTrack = this._parseTimedText(data);
            
            // If dual language is active, automatically fetch the native translation track
            if (this.settings?.dualLanguage) {
                const targetLang = this.settings?.targetLanguage || navigator.language.split('-')[0] || 'en';
                if (!url.includes(`&tlang=${targetLang}`)) {
                    const transUrl = url + `&tlang=${targetLang}`;
                    fetch(transUrl).catch(()=>{}); // This will be intercepted
                }
            }
        }
    }

    _parseTimedText(data) {
        if (!data || !data.events) return [];
        const track = [];
        for (const evt of data.events) {
            if (!evt.segs || !evt.dDurationMs) continue;
            let text = '';
            const words = [];
            let currentOffset = 0;
            
            for (const seg of evt.segs) {
                if (seg.utf8) {
                    text += seg.utf8;
                    words.push({ text: seg.utf8.trim(), offset: seg.tOffsetMs || 0 });
                }
            }
            if (text.trim()) {
                track.push({
                    start: evt.tStartMs,
                    duration: evt.dDurationMs,
                    end: evt.tStartMs + evt.dDurationMs,
                    text: text.trim(),
                    words: words
                });
            }
        }
        return track;
    }

    _findSubtitleIndexAtTime(timeMs) {
        if (!this._timedTextTrack || this._timedTextTrack.length === 0) return -1;
        let left = 0;
        let right = this._timedTextTrack.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const event = this._timedTextTrack[mid];
            if (timeMs >= event.start && timeMs <= event.end) {
                return mid;
            }
            if (timeMs < event.start) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return -1;
    }

    _startV3Renderer() {
        if (this._renderLoopId) cancelAnimationFrame(this._renderLoopId);
        
        const loop = () => {
            if (!this.isEnabled || !this._customContainer) {
                this._renderLoopId = null;
                return;
            }
            
            const player = document.getElementById('movie_player');
            const video = player?.querySelector('video');
            
            // Check if CC is actually turned on natively
            const ccBtn = document.querySelector('.ytp-subtitles-button');
            const ccIsOn = ccBtn && ccBtn.getAttribute('aria-pressed') === 'true';

            if (!video || video.paused || !this._timedTextTrack || !ccIsOn) {
                if (!ccIsOn) this._clearV3Event();
                this._renderLoopId = requestAnimationFrame(loop);
                return;
            }
            
            // Advance event time by 150ms so sentences appear exactly as words are spoken
            const eventTimeMs = (video.currentTime * 1000) + 150;
            // Advance karaoke highlight by 50ms to keep it tightly in sync
            const karaokeTimeMs = (video.currentTime * 1000) + 50;
            
            let currentEvent = null;
            let transEvent = null;
            
            // V6 Performance: Use cursor and binary search
            if (this._currentTrackIndex >= 0 && this._currentTrackIndex < this._timedTextTrack.length) {
                const ev = this._timedTextTrack[this._currentTrackIndex];
                if (eventTimeMs >= ev.start && eventTimeMs <= ev.end) {
                    currentEvent = ev;
                } else if (eventTimeMs > ev.end && this._currentTrackIndex + 1 < this._timedTextTrack.length && eventTimeMs >= this._timedTextTrack[this._currentTrackIndex + 1].start && eventTimeMs <= this._timedTextTrack[this._currentTrackIndex + 1].end) {
                    // Check immediately next event
                    this._currentTrackIndex++;
                    currentEvent = this._timedTextTrack[this._currentTrackIndex];
                }
            }
            
            if (!currentEvent) {
                // If it jumped or not initialized, fallback to binary search
                this._currentTrackIndex = this._findSubtitleIndexAtTime(eventTimeMs);
                if (this._currentTrackIndex !== -1) {
                    currentEvent = this._timedTextTrack[this._currentTrackIndex];
                }
            }
            
            if (currentEvent) {
                // We don't binary search translations strictly for now, just find matching the same time window.
                transEvent = this._timedTextTranslation?.find(e => eventTimeMs >= e.start && eventTimeMs <= e.end);
                this._renderV3Event(currentEvent, transEvent, karaokeTimeMs);
            } else {
                this._clearV3Event();
            }
            
            this._renderLoopId = requestAnimationFrame(loop);
        };
        this._renderLoopId = requestAnimationFrame(loop);
    }

    _clearV3Event() {
        if (this._lastCaptionText !== '') {
            this._customContainer.classList.remove('active');
            this._customContainer.innerHTML = '';
            this._lastCaptionText = '';
            this._lastEventRef = null;
            this._wordSpansCache = null;
        }
    }

    _renderV3Event(event, transEvent, timeMs) {
        const isKaraoke = this.settings?.karaokeMode;
        
        // V6 Performance: Skip full re-render if it's the exact same event object.
        if (this._lastEventRef === event) {
            if (isKaraoke && this._wordSpansCache) {
                // Only update the active word classes directly in DOM
                for (let i = 0; i < event.words.length; i++) {
                    const wordStart = event.start + event.words[i].offset;
                    const isActive = timeMs >= wordStart;
                    const span = this._wordSpansCache[i];
                    if (span) {
                        if (isActive && !span.classList.contains('active-word')) {
                            span.classList.add('active-word');
                        } else if (!isActive && span.classList.contains('active-word')) {
                            span.classList.remove('active-word');
                        }
                    }
                }
            }
            return; // We only needed to update the karaoke state!
        }
        
        this._lastEventRef = event;
        let captions = event.text;

        // HTML Safety for text-manipulation modes
        if (this.settings?.bionicReading) {
            const temp = document.createElement('div');
            temp.innerHTML = captions;
            captions = temp.textContent;
        }

        this._lastCaptionText = captions;

        let processedCaptions = captions;
        if (this.settings?.bionicReading === true) {
            processedCaptions = captions.split('\n').map(line => this._applyBionicReading(line)).join('<br/>');
        } else {
            processedCaptions = captions.replace(/\n/g, '<br/>');
        }

        let html = `<span>${processedCaptions}</span>`;

        if (this.settings?.dualLanguage && transEvent) {
            html += `<br/><span class="dual-lang-sub" style="font-size: 0.8em; color: var(--yt-spec-text-secondary, #ccc);">${transEvent.text}</span>`;
        }

        if (isKaraoke) {
            // V3: Exact Karaoke timing using tOffsetMs
            html = `<span>` + event.words.map((w, i) => {
                const wordStart = event.start + w.offset;
                const isActive = timeMs >= wordStart;
                return `<span class="ypp-word ${isActive ? 'active-word' : ''}" id="ypp-word-${i}">${w.text}</span>`;
            }).join(' ') + `</span>`;
        }

        // Render instantly
        if (this._customContainer.innerHTML !== html) {
            this._customContainer.innerHTML = html;
        }
        
        // V6 Performance: Cache the spans if Karaoke is enabled
        if (isKaraoke) {
            this._wordSpansCache = Array.from(this._customContainer.querySelectorAll('.ypp-word'));
        } else {
            this._wordSpansCache = null;
        }
        
        if (!this._customContainer.classList.contains('active')) {
            this._customContainer.classList.add('active');
        }
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
            let newBaseY = startBaseY + deltaY;
            
            // V2: Clamp drag position to prevent losing subtitles off-screen
            const maxUp = -(window.innerHeight * 0.8);
            const maxDown = window.innerHeight * 0.2;
            newBaseY = Math.max(maxUp, Math.min(maxDown, newBaseY));
            
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



    _applyBionicReading(text) {
        return text.split(' ').map(word => {
            if (word.length <= 1) return `<b>${word}</b>`;
            const half = Math.ceil(word.length / 2);
            return `<b style="font-weight:900;">${word.substring(0, half)}</b>${word.substring(half)}`;
        }).join(' ');
    }
};

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.AutoSubtitles = AutoSubtitles;
