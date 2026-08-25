export class AudioEQ extends window.YPP.features.BaseFeature {
    static featureId = 'audioEQ';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('AudioEQ');
        this.audioContext = null;
        this.sourceNode = null;
        this.bassFilter = null;
        this.trebleFilter = null;
        this.gainNode = null;
        
        this._boundHandleRateChange = this._handleRateChange.bind(this);
    }

    getConfigKey() {
        // Return null so AudioEQ is always available to apply bass/treble settings to playing videos
        return null; 
    }

    async enable() {
        await super.enable();
        
        // We actually want to run if bass/treble/transcript are relevant, not just audioModeEnabled.
        // We'll hook into the video element anyway, but only apply EQ if settings exist.
        const video = document.querySelector('video');
        if (video) {
            this._initAudioContext(video);
        }

        // Catch newly injected video elements
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('audio-eq', 'video', (elements) => {
                this._initAudioContext(elements[0]);
            });
        }
    }

    async disable() {
        await super.disable();
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('audio-eq');
        }
        
        if (this.bassFilter) this.bassFilter.gain.value = 0;
        if (this.trebleFilter) this.trebleFilter.gain.value = 0;
        // Note: Disconnecting the sourceNode from Web Audio API is tricky without breaking the stream.
        // Setting gains to 0 effectively bypasses the EQ.
    }

    onUpdate() {
        this._applyEQ();
    }

    _initAudioContext(video) {
        if (!video || this.audioContext) return;
        
        // FIX Bug 3: Share the AudioContext and MediaElementSource with VolumeBooster
        // and AudioCompressor so we never call createMediaElementSource twice on the
        // same video element (which throws InvalidStateError in Chrome).
        //
        // Priority order:
        //   1. Reuse video.__ypp_ctx / video.__ypp_source if set by VolumeBooster
        //   2. Create fresh context and set video.__ypp_ctx / video.__ypp_source
        //      so later features can share them.
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;

            if (video.__ypp_ctx && video.__ypp_source) {
                // Another feature already created the AudioContext and source node — reuse them.
                this.audioContext = video.__ypp_ctx;
                this.sourceNode = video.__ypp_source;
            } else {
                // First to init — create and register for sharing.
                this.audioContext = new AudioContextClass();
                this.sourceNode = this.audioContext.createMediaElementSource(video);
                video.__ypp_ctx = this.audioContext;
                video.__ypp_source = this.sourceNode;
            }
            
            // Setup Bass (Lowshelf)
            this.bassFilter = this.audioContext.createBiquadFilter();
            this.bassFilter.type = 'lowshelf';
            this.bassFilter.frequency.value = 250; 
            
            // Setup Treble (Highshelf)
            this.trebleFilter = this.audioContext.createBiquadFilter();
            this.trebleFilter.type = 'highshelf';
            this.trebleFilter.frequency.value = 4000;

            // Check if VolumeBooster already has a full graph connected.
            // If so, we must insert our filters INTO the existing chain rather
            // than creating a parallel path which would double the audio.
            const vb = window.YPP.featureManager?.getFeature('volumeBoost');
            if (vb && vb._audioConnected && vb.gainNode && vb.analyserNode) {
                // VolumeBooster is already active — insert bass/treble between
                // the analyser output and destination.
                // Disconnect analyser → old destination, re-route through our filters.
                try { vb.analyserNode.disconnect(); } catch (_) {}
                vb.analyserNode.connect(this.bassFilter);
                this.bassFilter.connect(this.trebleFilter);
                // Chain to AudioCompressor if active, else destination
                if (video.__ypp_ext_compressor) {
                    this.trebleFilter.connect(video.__ypp_ext_compressor.input);
                    video.__ypp_ext_compressor.output.connect(this.audioContext.destination);
                } else {
                    this.trebleFilter.connect(this.audioContext.destination);
                }
            } else {
                // VolumeBooster not yet active — connect source → filters → destination.
                // VolumeBooster will disconnect the source and rebuild the full graph
                // when it initialises later (it always calls source.disconnect() first).
                this.sourceNode.connect(this.bassFilter);
                this.bassFilter.connect(this.trebleFilter);
                this.trebleFilter.connect(this.audioContext.destination);
            }

            // Handle speed change pitch correction issues in Chrome
            this.addListener(video, 'ratechange', this._boundHandleRateChange);

            this._applyEQ();
            
            this.utils?.log('Audio EQ graph initialized successfully (shared context)', 'AUDIO', 'debug');
        } catch (e) {
            this.utils?.log(`Failed to init AudioContext: ${e.message}`, 'AUDIO', 'error');
            // MediaElementAudioSourceNode can only be created once per HTMLMediaElement.
        }
    }

    _applyEQ() {
        if (!this.audioContext || !this.settings) return;

        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const bass = this.settings.volumeBoostBass || 0;
        const treble = this.settings.volumeBoostTreble || 0;

        // Apply gain directly
        if (this.bassFilter) this.bassFilter.gain.value = bass;
        if (this.trebleFilter) this.trebleFilter.gain.value = treble;
    }

    _handleRateChange(e) {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
};

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.AudioEQ = AudioEQ;

