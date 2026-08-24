/**
 * @fileoverview
 * Auto PiP — Spiral Tube
 * 
 * Target: /watch route.
 * Purpose: Enters Picture-in-Picture automatically when the user switches tabs,
 * and exits PiP when the user comes back.
 */
export class AutoPiP extends window.YPP.features.BaseFeature {
    static featureId = 'autoPiP';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'autoPiP'; }

    constructor() {
        super('AutoPiP');
        this._boundAutoPiP = null;
        this._observer = null;
        this._originalVolume = null;
        this._pipReason = null; // 'hidden' or 'scroll'
        this._docPipWindow = null;
        this._videoContainer = null;
    }

    async enable() {
        await super.enable();
        if (this._boundAutoPiP) return; // Already enabled
        
        this._boundAutoPiP = async (reason = 'hidden') => {
            // Ignore PiP attempts on Shorts players to prevent crashes
            if (window.location.pathname.startsWith('/shorts/')) return;

            const video = document.querySelector('video.html5-main-video');
            if (!video) return;
            
            const shouldBePip = (document.hidden && reason === 'hidden') || (reason === 'scroll');
            // PIP-UP-5: Option to also pip paused videos
            const isActive = !video.ended && (!video.paused || this.settings?.pipPausedVideos === true);
            
            if (shouldBePip && isActive) {
                // Trigger PiP
                if (!document.pictureInPictureElement && !this._docPipWindow) {
                    try { 
                        // Try Document PiP first (V2)
                        if ('documentPictureInPicture' in window && this.settings?.useDocumentPip !== false) {
                            await this._enterDocumentPiP(video, reason);
                        } else if (document.pictureInPictureEnabled) {
                            // Fallback to Native Video PiP
                            await video.requestPictureInPicture(); 
                            this._pipReason = reason;
                            this._applyAudioDucking(video);
                            
                            const onEnded = async () => {
                                if (document.pictureInPictureElement) {
                                    try { await document.exitPictureInPicture(); } catch (_) {}
                                }
                                this.removeListener(video, 'ended', onEnded);
                            };
                            this.addListener(video, 'ended', onEnded);
                        }
                    } catch (e) {
                        this.utils.log?.('PiP failed', 'AUTO_PIP', 'warn', e);
                    }
                }
            } else if (!shouldBePip) {
                // Exit PiP
                if (document.pictureInPictureElement) {
                    try { await document.exitPictureInPicture(); } catch (_) {}
                }
                if (this._docPipWindow) {
                    this._docPipWindow.close(); // will trigger pagehide and restore
                }
                this._restoreAudio(video);
                this._pipReason = null;
            }
        };
        
        this.addListener(document, 'visibilitychange', () => this._boundAutoPiP('hidden'));
        
        // V4 Optimization: Use IntersectionObserver instead of scroll listener
        if (this.utils.isWatchPage()) {
            this._setupIntersectionObserver();
        }
        
        this.utils?.log?.('Auto PiP enabled', 'AUTO_PIP');
        
        // Instant apply if the tab is already hidden when toggled via popup
        if (document.hidden) {
            this._boundAutoPiP('hidden');
        }
    }

    async disable() {
        await super.disable();
        
        // PIP-BUG-1: Teardown observer FIRST before nulling _boundAutoPiP
        // This prevents the observer callback firing after the function is null, causing TypeError
        this._teardownIntersectionObserver();
        this._boundAutoPiP = null;
        
        // Exit PiP if currently active
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {});
        }
        if (this._docPipWindow) {
            this._docPipWindow.close();
        }
        
        const video = document.querySelector('video.html5-main-video');
        if (video) this._restoreAudio(video);
        
        this.utils?.log?.('Auto PiP disabled', 'AUTO_PIP');
    }
    
    // PIP-BUG-3: Reset PiP state on SPA navigation
    onVideoChange() {
        if (!this.isEnabled) return;
        // Close any active PiP from the previous video
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {});
        }
        if (this._docPipWindow) {
            this._docPipWindow.close();
        }
        // Reset tracking state
        this._videoContainer = null;
        this._pipReason = null;
        // Re-setup intersection observer for the new video's player
        if (this.utils.isWatchPage()) {
            this._setupIntersectionObserver();
        }
    }
    
    _setupIntersectionObserver() {
        this._teardownIntersectionObserver();
        this._observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (document.hidden || !this.isEnabled || !this.utils.isWatchPage()) return;
                
                if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
                    // Player is out of view
                    this._boundAutoPiP('scroll');
                } else if (entry.isIntersecting && this._pipReason === 'scroll' && (document.pictureInPictureElement || this._docPipWindow)) {
                    // Player is back in view
                    this._boundAutoPiP('visible');
                }
            });
        }, { threshold: 0.1 });
        
        const player = document.getElementById('movie_player');
        if (player) {
            this._observer.observe(player);
        } else {
            this.utils.pollFor(() => document.getElementById('movie_player'), 5000, 500)
                .then(p => { if (p && this._observer) this._observer.observe(p); })
                .catch(() => {});
        }
    }
    
    _teardownIntersectionObserver() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
    }

    async _enterDocumentPiP(video, reason) {
        if (this._docPipWindow) return;
        
        this._videoContainer = video.parentElement;

        // PIP-UP-3: Restore saved window dimensions
        let pipWidth = Math.min(video.clientWidth || 640, 640);
        let pipHeight = Math.min(video.clientHeight || 360, 360);
        try {
            if (chrome?.storage?.sync) {
                const saved = await chrome.storage.sync.get(['ypp_pip_width', 'ypp_pip_height']);
                if (saved.ypp_pip_width) pipWidth = saved.ypp_pip_width;
                if (saved.ypp_pip_height) pipHeight = saved.ypp_pip_height;
            }
        } catch (_) {}

        const pipWindow = await window.documentPictureInPicture.requestWindow({ width: pipWidth, height: pipHeight });
        this._docPipWindow = pipWindow;
        this._pipReason = reason;

        // PIP-UP-2: Grab video title and channel from main page
        const title = (
            document.querySelector('h1.ytd-watch-metadata yt-formatted-string')?.textContent ||
            document.querySelector('#title h1')?.textContent ||
            'YouTube'
        ).trim();
        const channel = document.querySelector('#channel-name a')?.textContent?.trim() || '';

        const style = pipWindow.document.createElement('style');
        style.textContent = `
            *, *::before, *::after { box-sizing: border-box; }
            body {
                margin: 0; padding: 0; background: #000; overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                position: relative; width: 100vw; height: 100vh;
            }
            video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }

            .pip-title-bar {
                position: absolute; top: 0; left: 0; right: 0; z-index: 10;
                background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%);
                padding: 10px 14px 28px;
                opacity: 0; transition: opacity 0.25s ease;
                pointer-events: none;
            }
            body:hover .pip-title-bar { opacity: 1; }
            .pip-title { color: #fff; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
            .pip-channel { color: rgba(255,255,255,0.65); font-size: 11px; margin: 2px 0 0; }

            .pip-controls {
                position: absolute; bottom: 0; left: 0; right: 0; z-index: 10;
                background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
                padding: 24px 12px 10px;
                opacity: 0; transition: opacity 0.25s ease;
            }
            body:hover .pip-controls { opacity: 1; }

            .pip-seek-wrap { position: relative; width: 100%; height: 16px; display: flex; align-items: center; margin-bottom: 4px; cursor: pointer; }
            .pip-seek-track { position: absolute; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.3); border-radius: 2px; transition: height 0.15s; overflow: hidden; }
            .pip-seek-wrap:hover .pip-seek-track { height: 5px; }
            .pip-seek-fill { height: 100%; width: 0%; background: #3ea6ff; border-radius: 2px; }
            .pip-seek-input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }

            .pip-btn-row { display: flex; align-items: center; gap: 4px; }
            .pip-btn {
                background: none; border: none; color: #fff; cursor: pointer;
                font-size: 17px; padding: 4px 8px; border-radius: 4px; opacity: 0.9;
                transition: opacity 0.15s, background 0.15s;
            }
            .pip-btn:hover { opacity: 1; background: rgba(255,255,255,0.12); }
            .pip-time { color: rgba(255,255,255,0.75); font-size: 11px; margin-left: 4px; user-select: none; white-space: nowrap; }
            .pip-close { margin-left: auto; font-size: 14px; }
        `;
        pipWindow.document.head.appendChild(style);

        // PIP-UP-2: Title bar
        const titleBar = pipWindow.document.createElement('div');
        titleBar.className = 'pip-title-bar';
        titleBar.innerHTML = `
            <p class="pip-title">${title}</p>
            ${channel ? `<p class="pip-channel">${channel}</p>` : ''}
        `;
        pipWindow.document.body.appendChild(titleBar);

        // Move video into PiP window
        pipWindow.document.body.appendChild(video);

        // PIP-UP-1: Full controls with seek bar
        const controls = pipWindow.document.createElement('div');
        controls.className = 'pip-controls';
        controls.innerHTML = `
            <div class="pip-seek-wrap">
                <div class="pip-seek-track"><div class="pip-seek-fill" id="pip-fill"></div></div>
                <input type="range" class="pip-seek-input" id="pip-seek" min="0" max="10000" value="0" />
            </div>
            <div class="pip-btn-row">
                <button class="pip-btn" id="pip-rewind" title="Back 5s (&larr;)">&#9194;</button>
                <button class="pip-btn" id="pip-play" title="Play/Pause (Space)">&#9654;</button>
                <button class="pip-btn" id="pip-fwd" title="Forward 5s (&rarr;)">&#9193;</button>
                <button class="pip-btn" id="pip-mute" title="Mute (M)">&#128266;</button>
                <span class="pip-time" id="pip-time">0:00 / 0:00</span>
                <button class="pip-btn pip-close" id="pip-close" title="Close (Esc)">&times;</button>
            </div>
        `;
        pipWindow.document.body.appendChild(controls);

        const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
        const seekBar  = pipWindow.document.getElementById('pip-seek');
        const seekFill = pipWindow.document.getElementById('pip-fill');
        const timeEl   = pipWindow.document.getElementById('pip-time');
        const playBtn  = pipWindow.document.getElementById('pip-play');
        const muteBtn  = pipWindow.document.getElementById('pip-mute');

        const onTimeUpdate = () => {
            if (!video.duration) return;
            const pct = (video.currentTime / video.duration) * 100;
            seekFill.style.width = `${pct}%`;
            seekBar.value = pct * 100;
            timeEl.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
        };
        const onPlayState = () => { playBtn.innerHTML = video.paused ? '&#9654;' : '&#9646;&#9646;'; };
        const onMuteState = () => { muteBtn.innerHTML = video.muted ? '&#128263;' : '&#128266;'; };

        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('durationchange', onTimeUpdate);
        video.addEventListener('play', onPlayState);
        video.addEventListener('pause', onPlayState);
        video.addEventListener('volumechange', onMuteState);
        onTimeUpdate(); onPlayState(); onMuteState();

        seekBar.addEventListener('input', () => {
            if (video.duration) video.currentTime = (parseInt(seekBar.value) / 10000) * video.duration;
        });
        playBtn.onclick = () => video.paused ? video.play() : video.pause();
        pipWindow.document.getElementById('pip-rewind').onclick = () => { video.currentTime = Math.max(0, video.currentTime - 5); };
        pipWindow.document.getElementById('pip-fwd').onclick = () => { video.currentTime = Math.min(video.duration || 0, video.currentTime + 5); };
        muteBtn.onclick = () => { video.muted = !video.muted; };
        pipWindow.document.getElementById('pip-close').onclick = () => pipWindow.close();

        // PIP-UP-4: Keyboard shortcuts
        pipWindow.document.addEventListener('keydown', e => {
            switch (e.key) {
                case ' ': case 'k': case 'K':
                    e.preventDefault(); video.paused ? video.play() : video.pause(); break;
                case 'ArrowLeft':  e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 5); break;
                case 'ArrowRight': e.preventDefault(); video.currentTime = Math.min(video.duration || 0, video.currentTime + 5); break;
                case 'm': case 'M': video.muted = !video.muted; break;
                case 'Escape': pipWindow.close(); break;
            }
        });

        // PIP-UP-3: Save window size on user resize
        pipWindow.addEventListener('resize', () => {
            try {
                if (chrome?.storage?.sync) {
                    chrome.storage.sync.set({ ypp_pip_width: pipWindow.outerWidth, ypp_pip_height: pipWindow.outerHeight });
                }
            } catch (_) {}
        });

        this._applyAudioDucking(video);

        // PIP-BUG-2: Re-query container at close time
        pipWindow.addEventListener('pagehide', () => {
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('durationchange', onTimeUpdate);
            video.removeEventListener('play', onPlayState);
            video.removeEventListener('pause', onPlayState);
            video.removeEventListener('volumechange', onMuteState);
            const container = document.querySelector('.html5-video-container') || this._videoContainer;
            if (container) container.appendChild(video);
            this._docPipWindow = null;
            this._pipReason = null;
            this._restoreAudio(video);
            this.utils.log?.('Document PiP closed', 'AUTO_PIP', 'debug');
        });
    }
    
    _applyAudioDucking(video) {
        if (this.settings?.pipAudioDucking !== false) {
            this._originalVolume = video.volume;
            video.volume = Math.max(0.1, video.volume * 0.5);
        }
    }
    
    _restoreAudio(video) {
        if (this._originalVolume !== null) {
            video.volume = this._originalVolume;
            this._originalVolume = null;
        }
    }
};
