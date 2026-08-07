/**
 * Auto PiP — Spiral Tube
 * Enters Picture-in-Picture automatically when the user switches tabs,
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
        this._scrollHandler = null;
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
            const isPlaying = !video.paused && !video.ended;
            
            if (shouldBePip && isPlaying) {
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
        
        // Scroll-triggered PiP
        this._scrollHandler = this.utils.debounce(() => {
            if (document.hidden) return; // Let visibility change handle it
            if (window.location.pathname !== '/watch') return;
            
            const playerRect = document.querySelector('#movie_player')?.getBoundingClientRect();
            if (playerRect && playerRect.bottom < 0) {
                // Player is out of view
                this._boundAutoPiP('scroll');
            } else if (this._pipReason === 'scroll' && (document.pictureInPictureElement || this._docPipWindow)) {
                // Player is back in view and we were the ones who PiP'd it due to scroll
                this._boundAutoPiP('visible'); // pass a reason that evaluates shouldBePip to false
            }
        }, 200);
        this.addListener(window, 'scroll', this._scrollHandler);
        
        this.utils?.log?.('Auto PiP enabled', 'AUTO_PIP');
    }

    async disable() {
        await super.disable();
        
        this._boundAutoPiP = null;
        this._scrollHandler = null;
        
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
    
    // --- V2 Document PiP & Audio Utilities ---
    
    async _enterDocumentPiP(video, reason) {
        if (this._docPipWindow) return;
        
        this._videoContainer = video.parentElement; // Usually .html5-video-container
        
        const pipWindow = await window.documentPictureInPicture.requestWindow({
            width: video.clientWidth || 640,
            height: video.clientHeight || 360,
        });
        this._docPipWindow = pipWindow;
        this._pipReason = reason;
        
        // Setup basic styling for PiP window
        const style = pipWindow.document.createElement('style');
        style.textContent = `
            body { margin: 0; padding: 0; background: black; overflow: hidden; display: flex; align-items: center; justify-content: center; }
            video { width: 100vw; height: 100vh; object-fit: contain; outline: none; }
            .pip-controls { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); padding: 8px 16px; border-radius: 20px; color: white; font-family: sans-serif; opacity: 0; transition: opacity 0.2s; display: flex; gap: 15px; }
            body:hover .pip-controls { opacity: 1; }
            .pip-btn { cursor: pointer; user-select: none; font-size: 14px; font-weight: bold; }
            .pip-btn:hover { color: #f12; }
        `;
        pipWindow.document.head.appendChild(style);
        
        // Move video
        pipWindow.document.body.appendChild(video);
        
        // Add custom minimal controls to the Doc PiP window
        const controls = pipWindow.document.createElement('div');
        controls.className = 'pip-controls';
        controls.innerHTML = `
            <div class="pip-btn" id="pip-play">⏯ Play/Pause</div>
            <div class="pip-btn" id="pip-mute">🔇 Mute</div>
            <div class="pip-btn" id="pip-close">✖ Close</div>
        `;
        pipWindow.document.body.appendChild(controls);
        
        pipWindow.document.getElementById('pip-play').onclick = () => video.paused ? video.play() : video.pause();
        pipWindow.document.getElementById('pip-mute').onclick = () => video.muted = !video.muted;
        pipWindow.document.getElementById('pip-close').onclick = () => pipWindow.close();
        
        this._applyAudioDucking(video);
        
        // Listen for closure
        pipWindow.addEventListener("pagehide", () => {
            this._videoContainer.appendChild(video);
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

window.YPP.features.AutoPiP = AutoPiP;
