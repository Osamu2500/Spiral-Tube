/**
 * Volume Booster / 10-Band Graphic Equalizer Orchestrator
 * Manages the Web Audio API graph for the active HTML5 video element.
 */
window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

window.YPP.features.VolumeBooster = class VolumeBooster extends window.YPP.features.BaseFeature {
    constructor() {
        super('VolumeBooster');
        this.name = 'VolumeBooster';
        this.settings = null;

        // Audio graph nodes
        this._audioConnected = false;
        this.ctx = null;
        this.source = null;
        this.gainNode = null;
        this.compressorNode = null;
        this.pannerNode = null;
        this.analyserNode = null;
        this.waveShaperNode = null;
        this.widenerSplitter = null;
        this.widenerMerger = null;
        this.widenerDelay = null;
        this.widenerGain = null;
        this._eqNodes = [];          // 10 BiquadFilterNodes
        
        // State
        this._compressorEnabled = true;
        this._monoEnabled = false;
        this._eqGains = new Array(10).fill(0);   // current dB per band
        this._eqFreqs = [60, 170, 310, 600, 1000, 3000, 6000, 10000, 14000, 16000];
        this._eqQs = new Array(10).fill(1.4);

        this._volumeGain = 1.0;                  // 1.0 = 100%
        this._balance = 0.0;                     // -1.0 (Left) to 1.0 (Right)
        this._widenerEnabled = false;
        this._warmthLevel = 0;                   // 0 to 100

        // DOM refs
        this._volumePopup = null;
        this._volumePopupOutsideHandler = null;
        this._boundVideo = null;
        this._initHandler = null;

        // 10 EQ band definitions — sub-bass → air
        this._bands = [
            { label: '60',  freq: 60,    type: 'lowshelf', color: '#ffffff' },
            { label: '170', freq: 170,   type: 'peaking',  color: '#ffffff' },
            { label: '310', freq: 310,   type: 'peaking',  color: '#ffffff' },
            { label: '600', freq: 600,   type: 'peaking',  color: '#ffffff' },
            { label: '1k',  freq: 1000,  type: 'peaking',  color: '#ffffff' },
            { label: '3k',  freq: 3000,  type: 'peaking',  color: '#ffffff' },
            { label: '6k',  freq: 6000,  type: 'peaking',  color: '#ffffff' },
            { label: '10k', freq: 10000, type: 'peaking',  color: '#ffffff' },
            { label: '14k', freq: 14000, type: 'peaking',  color: '#ffffff' },
            { label: '16k', freq: 16000, type: 'highshelf',color: '#ffffff' },
        ];

        // Presets — array index matches _bands order
        this._presets = {
            'Flat':       [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            'Bass Boost': [ 8,  6,  4,  2,  0, -1,  0,  0,  0,  0],
            'Acoustic':   [ 4,  4,  3,  1,  1,  1,  3,  4,  3,  2],
            'Classical':  [ 4,  3,  2,  1, -1, -1,  0,  2,  3,  4],
            'Dance':      [ 8,  6,  3,  0,  0, -1, -2, -2,  0,  1],
            'Electronic': [ 6,  5,  2,  0, -2,  1,  0,  1,  4,  5],
            'Lo-Fi':      [ 3,  2,  0, -2, -4, -4, -3, -2, -1,  0],
            'Pop':        [-2, -1,  1,  3,  4,  4,  2,  1,  0, -1],
            'Rock':       [ 6,  4,  2, -1, -2, -1,  1,  3,  4,  5],
            'Vocal':      [-2, -1,  0,  2,  4,  4,  3,  2,  1,  0],
            'Cinematic':  [ 5,  3,  1, -1, -2,  1,  3,  4,  4,  3],
        };
    }

    getConfigKey() { 
        return 'enableVolumeBoost'; 
    }

    _loadSettings(settings) {
        if (!settings) return;
        if (settings.volumeLevel !== undefined) this._volumeGain = settings.volumeLevel;
        if (settings.volumeBalance !== undefined) this._balance = settings.volumeBalance;
        if (settings.volumeCompressor !== undefined) this._compressorEnabled = settings.volumeCompressor;
        if (settings.volumeMono !== undefined) this._monoEnabled = settings.volumeMono;
        if (settings.volumeWidener !== undefined) this._widenerEnabled = settings.volumeWidener;
        if (settings.volumeWarmth !== undefined) this._warmthLevel = settings.volumeWarmth;
        if (settings.volumeEqBands) {
            try {
                const bands = JSON.parse(settings.volumeEqBands);
                if (Array.isArray(bands) && bands.length === 10) {
                    this._eqGains = bands.map(v => typeof v === 'number' ? v : 0);
                }
            } catch (e) {
                this.utils?.log?.('[YPP:VolumeBooster] Failed to parse EQ bands: ' + e.message, 'VolumeBooster', 'warn');
            }
        }
        if (settings.volumeEqFreqs) {
            try {
                const freqs = JSON.parse(settings.volumeEqFreqs);
                if (Array.isArray(freqs) && freqs.length === 10) this._eqFreqs = freqs;
            } catch (e) {}
        }
        if (settings.volumeEqQs) {
            try {
                const qs = JSON.parse(settings.volumeEqQs);
                if (Array.isArray(qs) && qs.length === 10) this._eqQs = qs;
            } catch (e) {}
        }
    }

    async enable() {
        await super.enable();
        this._loadSettings(this.settings);
        const video = document.querySelector('.html5-main-video') || document.querySelector('video');
        if (video && this._needsAudioGraph()) this.initAudioContext(video);
    }

    _cleanupVideoBindings() {
        // Clean up UI
        if (this._volumePopup) {
            if (this._volumeAnimCancel) this._volumeAnimCancel();
            this._volumePopup.remove();
            this._volumePopup = null;
        }
        if (this._volumePopupOutsideHandler) {
            if (this.removeListener) this.removeListener(document, 'click', this._volumePopupOutsideHandler);
            else document.removeEventListener('click', this._volumePopupOutsideHandler);
            this._volumePopupOutsideHandler = null;
        }
        if (this._volumePopupEscapeHandler) {
            if (this.removeListener) this.removeListener(document, 'keydown', this._volumePopupEscapeHandler);
            else document.removeEventListener('keydown', this._volumePopupEscapeHandler);
            this._volumePopupEscapeHandler = null;
        }
        
        if (this._resumeAudioContextBound) {
            document.removeEventListener('click', this._resumeAudioContextBound);
            document.removeEventListener('keydown', this._resumeAudioContextBound);
            document.removeEventListener('pointerdown', this._resumeAudioContextBound);
            this._resumeAudioContextBound = null;
        }

        // Clean up button
        const btn = this._boundVideo?.closest?.('body')?.querySelector?.('#ypp-volume-boost-btn[data-vb-id="' + this._id + '"]')
            || document.getElementById('ypp-volume-boost-btn');
        if (btn) btn.remove();

        // Safely bypass audio effects without destroying the graph
        if (this._audioConnected) {
            if (this.gainNode) this.gainNode.gain.setTargetAtTime(1, this.ctx.currentTime, 0.05);
            this._eqNodes.forEach(n => { if (n) n.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05); });
            if (this.compressorNode) {
                this.compressorNode.ratio.value = 1;
                this.compressorNode.threshold.value = 0;
            }
            if (this.pannerNode) this.pannerNode.pan.setTargetAtTime(0, this.ctx.currentTime, 0.05);
            if (this.source) {
                this.source.channelCount = 2;
                this.source.channelCountMode = 'max';
            }
        }
    }

    async disable() {
        this._cleanupVideoBindings();
        await super.disable();
    }

    onUpdate() {
        this._loadSettings(this.settings);
        if (this._audioConnected) {
            this._restoreAudioState();
        }
        this.enable();
    }

    onPageChange() {
        if (!this.settings || !this.settings.enableVolumeBoost) return;
        // Re-load from persisted settings on every page change to guarantee
        // that in-memory values always match what was saved to Chrome storage.
        this._loadSettings(this.settings);
        const video = document.querySelector('.html5-main-video') || document.querySelector('video');
        if (video) {
            if (this._audioConnected && this._boundVideo === video) {
                // Same video element reused (YouTube SPA) — just re-apply state
                this._restoreAudioState();
            } else if (this._needsAudioGraph()) {
                this.initAudioContext(video);
            }
        }
    }

    onVideoChange(videoElement) {
        // Called by FeatureManager when a new videoId is detected
        if (!this.settings || !this.settings.enableVolumeBoost) return;
        this._loadSettings(this.settings);
        const video = videoElement || document.querySelector('.html5-main-video') || document.querySelector('video');
        if (!video) return;
        if (this._audioConnected && this._boundVideo === video) {
            // Same video element: just restore the correct audio values
            this._restoreAudioState();
        } else if (this._needsAudioGraph()) {
            this.initAudioContext(video);
        }
    }

    _needsAudioGraph() {
        if (this._volumeGain !== 1.0) return true;
        if (this._balance !== 0.0) return true;
        if (this._monoEnabled) return true;
        if (this._eqGains && this._eqGains.some(g => g !== 0)) return true;
        return false;
    }

    _isSafeToBoost(video) {
        if (!video) return false;
        if (video.srcObject) return true;
        const src = video.currentSrc || video.src;
        // If no src yet (video element exists but hasn't loaded), trust same-origin pages.
        // YouTube always serves blob: URLs so an empty src is a transient loading state, not a CORS issue.
        if (!src) return window.location.hostname === 'www.youtube.com';
        if (src.startsWith('blob:') || src.startsWith('data:')) return true;
        try {
            const url = new URL(src);
            if (url.origin === window.location.origin) return true;
        } catch(e) {}
        if (video.crossOrigin === 'anonymous' || video.crossOrigin === 'use-credentials') return true;
        return false;
    }

    /**
     * Initializes the Web Audio API context and binds it to the video element.
     * Uses lazy initialization on 'play' or 'volumechange' to respect browser autoplay policies.
     * @param {HTMLVideoElement} video 
     */
    initAudioContext(video) {
        if (!this._isSafeToBoost(video)) {
            this.utils?.log?.('Volume Booster disabled: Cross-Origin Video detected without CORS.', 'VolumeBooster', 'warn');
            return;
        }

        // If we are already connected to THIS video, do nothing.
        // If video changed, we must disconnect the old and reconnect.
        if (this._audioConnected && this._boundVideo === video) return;
        
        // If we were connected to a DIFFERENT video, clean up the old bindings
        if (this._audioConnected && this._boundVideo && this._boundVideo !== video) {
            this._cleanupVideoBindings();
            this._audioConnected = false;
        }

        this._boundVideo = video;

        this._initHandler = () => {
            if (this._audioConnected) return;
            try {
                // Safely get or create AudioContext for this video
                if (video.__ypp_ctx && video.__ypp_source) {
                    this.ctx = video.__ypp_ctx;
                    this.source = video.__ypp_source;
                    // PREVENT AUDIO DOUBLING BUG: Disconnect source before rebuilding the graph
                    this.source.disconnect(); 
                } else {
                    const AC = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AC();
                    this.source = this.ctx.createMediaElementSource(video);
                    video.__ypp_ctx = this.ctx;
                    video.__ypp_source = this.source;
                }

                // Resume context BEFORE building graph — ensures currentTime is valid
                // and prevents audio silence on first interaction.
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume().catch(() => {});
                }

                this._buildAudioGraph();

                this._audioConnected = true;
                this._restoreAudioState();

            } catch (e) {
                this.utils?.log?.('[YPP:VolumeBooster] Audio engine init failed: ' + e.message, 'VolumeBooster', 'warn');
                this._audioConnected = false;
                // SAFETY: If graph build failed after source was captured, reconnect source
                // directly to destination to prevent complete audio silence.
                try {
                    if (this.source && this.ctx) {
                        this.source.connect(this.ctx.destination);
                    }
                } catch (_) { /* ignore secondary failure */ }
            }
        };

        // Attempt immediate init if already playing, otherwise wait for interaction
        this.addListener(video, 'play', this._initHandler, { once: true });
        this.addListener(video, 'volumechange', this._initHandler, { once: true });
        
        // Ensure AudioContext resumes on user interaction to fix autoplay policy violations
        if (!this._resumeAudioContextBound) {
            this._resumeAudioContextBound = () => {
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume().catch(() => {});
                }
            };
            document.addEventListener('click', this._resumeAudioContextBound);
            document.addEventListener('keydown', this._resumeAudioContextBound);
            document.addEventListener('pointerdown', this._resumeAudioContextBound);
        }

        if (!video.paused) this._initHandler();
    }

    _buildAudioGraph() {
        // 1. Build 10 EQ band nodes
        this._eqNodes = this._bands.map((band, i) => {
            const f = this.ctx.createBiquadFilter();
            f.type = band.type;
            f.frequency.value = this._eqFreqs[i];
            f.gain.value = this._eqGains[i];
            if (band.type === 'peaking') f.Q.value = this._eqQs[i];
            return f;
        });

        // 2. Panner Node for Balance
        this.pannerNode = this.ctx.createStereoPanner();
        this.pannerNode.pan.value = this._balance;

        // 3. Simple Compressor (to tame peaks)
        this.compressorNode = this.ctx.createDynamicsCompressor();
        this._applyCompressorState();

        // 4. Analyser for Visualization
        this.analyserNode = this.ctx.createAnalyser();
        this.analyserNode.fftSize = 256; 
        this.analyserNode.smoothingTimeConstant = 0.85;

        // 5. Master Gain
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = this._volumeGain;

        // Chain the nodes sequentially: Source -> EQ -> Panner -> Compressor -> Analyser
        let node = this.source;
        this._eqNodes.forEach(eq => { 
            node.connect(eq); 
            node = eq; 
        });
        
        node.connect(this.pannerNode);
        this.pannerNode.connect(this.compressorNode);
        this.compressorNode.connect(this.analyserNode);

        // Output routing - GainNode is placed at the absolute end of the chain
        const video = this._boundVideo || document.querySelector('.html5-main-video') || document.querySelector('video');
        if (video && video.__ypp_ext_compressor) {
            // Unboosted signal -> external compressor -> our gain node -> destination
            this.analyserNode.connect(video.__ypp_ext_compressor.input);
            try { video.__ypp_ext_compressor.output.disconnect(); } catch (e) {}
            video.__ypp_ext_compressor.output.connect(this.gainNode);
        } else {
            this.analyserNode.connect(this.gainNode);
        }
        
        this.gainNode.connect(this.ctx.destination);
    }

    _restoreAudioState() {
        this.setVolume(this._volumeGain);
        this.setBalance(this._balance);
        this.setMono(this._monoEnabled);
        this._applyCompressorState();
        
        // Restore EQ parameters safely
        this._eqNodes.forEach((n, i) => { 
            if (n) {
                n.gain.setTargetAtTime(this._eqGains[i], this.ctx.currentTime, 0.05); 
                n.frequency.setTargetAtTime(this._eqFreqs[i], this.ctx.currentTime, 0.05);
                if (this._bands[i].type === 'peaking') {
                    n.Q.setTargetAtTime(this._eqQs[i], this.ctx.currentTime, 0.05);
                }
            }
        });
    }

    _applyCompressorState() {
        if (!this.compressorNode) return;
        
        if (this._compressorEnabled) {
            this.compressorNode.threshold.value = -24;
            this.compressorNode.ratio.value = 4;
            this.compressorNode.attack.value = 0.02;
            this.compressorNode.release.value = 0.15;
        } else {
            this.compressorNode.threshold.value = 0;
            this.compressorNode.ratio.value = 1;
        }
    }

    setVolume(multiplier) {
        this._volumeGain = multiplier;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector('.html5-main-video') || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this.gainNode && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(multiplier, this.ctx.currentTime + 0.05);
        }
    }

    setBalance(pan) {
        this._balance = pan;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector('.html5-main-video') || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this.pannerNode && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            this.pannerNode.pan.cancelScheduledValues(this.ctx.currentTime);
            this.pannerNode.pan.setValueAtTime(this.pannerNode.pan.value, this.ctx.currentTime);
            this.pannerNode.pan.linearRampToValueAtTime(pan, this.ctx.currentTime + 0.05);
        }
    }

    setMono(enabled) {
        this._monoEnabled = enabled;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector('.html5-main-video') || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this.source && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            this.source.channelCount = enabled ? 1 : 2;
            this.source.channelCountMode = enabled ? 'clamped-max' : 'max';
        }
    }

    setCompressor(enabled) {
        this._compressorEnabled = enabled;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector('.html5-main-video') || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            this._applyCompressorState();
        }
    }

    _setEQBand(index, db) {
        this._eqGains[index] = db;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector('.html5-main-video') || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this._eqNodes[index] && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            this._eqNodes[index].gain.cancelScheduledValues(this.ctx.currentTime);
            this._eqNodes[index].gain.setValueAtTime(this._eqNodes[index].gain.value, this.ctx.currentTime);
            this._eqNodes[index].gain.linearRampToValueAtTime(db, this.ctx.currentTime + 0.05);
        }
    }

    _setEQBandFreq(index, freq) {
        this._eqFreqs[index] = freq;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector('.html5-main-video') || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this._eqNodes[index] && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            this._eqNodes[index].frequency.cancelScheduledValues(this.ctx.currentTime);
            this._eqNodes[index].frequency.setValueAtTime(this._eqNodes[index].frequency.value, this.ctx.currentTime);
            this._eqNodes[index].frequency.linearRampToValueAtTime(freq, this.ctx.currentTime + 0.05);
        }
    }

    _setEQBandQ(index, q) {
        this._eqQs[index] = q;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector('.html5-main-video') || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this._eqNodes[index] && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            if (this._bands[index].type === 'peaking') {
                this._eqNodes[index].Q.cancelScheduledValues(this.ctx.currentTime);
                this._eqNodes[index].Q.setValueAtTime(this._eqNodes[index].Q.value, this.ctx.currentTime);
                this._eqNodes[index].Q.linearRampToValueAtTime(q, this.ctx.currentTime + 0.05);
            }
        }
    }

    _applyPreset(name) {
        const gains = this._presets[name];
        if (!gains) return;
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        gains.forEach((db, i) => {
            this._setEQBand(i, db);
            this._setEQBandFreq(i, this._bands[i].freq); // Reset freq
            this._setEQBandQ(i, 1.4); // Reset Q
        });
    }

    createButton(initialVideo) {
        const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff">
            <path d="M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z"/>
        </svg>`;
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = 'Equalizer';
        btn.className = 'ypp-action-btn';
        btn.id = 'ypp-volume-boost-btn';
        this.addListener(btn, 'click', (e) => {
            e.stopPropagation();
            if (window.YPP.features.VolumeBoosterUI) {
                const activeVideo = document.querySelector('.html5-main-video') || document.querySelector('video');
                window.YPP.features.VolumeBoosterUI.toggleEQPanel(this, activeVideo, btn);
            }
        });
        return btn;
    }
};
