/**
 * Audio Spatial Module (Mixin)
 * Handles Stereo Width Matrix, Mono Mix, Phase Inversion, Reverb, and Playback Speed.
 */
export const AudioSpatialMixin = {
    setVinylMode(enabled) {
        this._vinylMode = !!enabled;
        if (this._boundVideo) {
            this._boundVideo.preservesPitch = !this._vinylMode;
        }
    },

    setPlaybackRate(rate) {
        this._playbackRate = rate;
        if (this._proxyCmd('setPlaybackRate', rate)) return;
        if (this._boundVideo) {
            this._boundVideo.playbackRate = rate;
        }
    },
    
    _generateSyntheticIR(duration, decay) {
        if (!this.ctx) return null;
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.ctx.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        
        for (let i = 0; i < length; i++) {
            const multiplier = Math.pow(1 - i / length, decay);
            left[i] = (Math.random() * 2 - 1) * multiplier;
            right[i] = (Math.random() * 2 - 1) * multiplier;
        }
        return impulse;
    },

    setReverbEnvironment(envName) {
        this._reverbEnv = envName;
        if (this._proxyCmd('setReverbEnvironment', envName)) return;
        if (!this.reverbNode) return;
        
        let duration = 0, decay = 0;
        switch (envName) {
            case 'Studio': duration = 0.5; decay = 5.0; break;
            case 'Club': duration = 1.5; decay = 3.0; break;
            case 'Concert Hall': duration = 3.0; decay = 2.0; break;
            case 'Cave': duration = 5.0; decay = 1.0; break;
            case 'None':
            default:
                this.reverbNode.buffer = null;
                this.setReverbMix(this._reverbMix);
                return;
        }
        this.reverbNode.buffer = this._generateSyntheticIR(duration, decay);
        this.setReverbMix(this._reverbMix);
    },
    
    setReverbMix(value) {
        this._reverbMix = value;
        if (this._proxyCmd('setReverbMix', value)) return;
        if (this._bypassed) return;
        if (this.reverbDryGain && this.reverbWetGain && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
            const effectiveMix = (this._reverbEnv === 'None') ? 0.0 : value;
            this.reverbDryGain.gain.setTargetAtTime(1.0 - effectiveMix, this.ctx.currentTime, 0.05);
            this.reverbWetGain.gain.setTargetAtTime(effectiveMix, this.ctx.currentTime, 0.05);
        }
    },

    setPhaseInvert(channel, inverted) {
        if (this._proxyCmd('setPhaseInvert', [channel, inverted])) {
            if (channel === 'L') this._invertL = inverted;
            else if (channel === 'R') this._invertR = inverted;
            return;
        }
        if (channel === 'L') {
            this._invertL = inverted;
            if (this.phaseGainL) this.phaseGainL.gain.value = inverted ? -1 : 1;
        } else if (channel === 'R') {
            this._invertR = inverted;
            if (this.phaseGainR) this.phaseGainR.gain.value = inverted ? -1 : 1;
        }
    },

    _createStereoWidthMatrix(ctx) {
        const input = ctx.createGain();
        const output = ctx.createGain();
        const widthGain = ctx.createGain();
        const splitter = ctx.createChannelSplitter(2);
        const merger = ctx.createChannelMerger(2);
        const mid = ctx.createGain(); mid.gain.value = 0.5;
        const rInvert = ctx.createGain(); rInvert.gain.value = -1;
        const side = ctx.createGain(); side.gain.value = 0.5;
        const sideInvert = ctx.createGain(); sideInvert.gain.value = -1;

        input.connect(splitter);
        splitter.connect(mid, 0); splitter.connect(mid, 1);
        splitter.connect(rInvert, 1);
        splitter.connect(side, 0);
        rInvert.connect(side);
        widthGain.gain.value = this._stereoWidth;
        side.connect(widthGain);
        mid.connect(merger, 0, 0);
        widthGain.connect(merger, 0, 0);
        widthGain.connect(sideInvert);
        mid.connect(merger, 0, 1);
        sideInvert.connect(merger, 0, 1);
        merger.connect(output);
        
        return { input, output, widthGain };
    },

    _updateStereoWidth() {
        if (this._bypassed) return;
        if (this.widthMatrix && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
            if (this._monoEnabled) {
                this.widthMatrix.widthGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
            } else {
                let currentWidth = this._stereoWidth;
                if (this._monoMix && this._monoMix > 0) {
                    currentWidth = currentWidth * (1 - (this._monoMix / 100));
                }
                this.widthMatrix.widthGain.gain.setTargetAtTime(currentWidth, this.ctx.currentTime, 0.05);
            }
        }
    },

    setWidth(value) {
        this._stereoWidth = value;
        if (this._proxyCmd('setWidth', value)) return;
        if (this._bypassed) return;
        this._updateStereoWidth();
    },
    
    setMonoMix(percentage) {
        this._monoMix = percentage;
        if (this._proxyCmd('setMonoMix', percentage)) return;
        this._updateStereoWidth();
    },

    setMono(enabled, forceBypass = false) {
        this._monoEnabled = forceBypass ? false : enabled;
        if (this._proxyCmd('setMono', [enabled, forceBypass])) return;
        this._updateStereoWidth();
    },

    setBalance(value) {
        this._balance = value;
        if (this._proxyCmd('setBalance', value)) return;
        if (this._bypassed) return;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this.pannerNode && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
            this.pannerNode.pan.setTargetAtTime(value, this.ctx.currentTime, 0.05);
        }
    }
};
