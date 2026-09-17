/**
 * Audio Spatial Module (Mixin)
 * Handles Stereo Width Matrix, Mono Mix, Phase Inversion, Reverb, and Playback Speed.
 */
export const AudioSpatialMixin = {
    setVinylMode(enabled, bypassOnly = false) {
        if (!bypassOnly) this._vinylMode = !!enabled;
        if (this._boundVideo) {
            this._boundVideo.preservesPitch = !(bypassOnly ? !!enabled : this._vinylMode);
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
        
        // Simple IIR lowpass filter state to simulate high-frequency absorption in a room
        let lastOutL = 0;
        let lastOutR = 0;
        
        for (let i = 0; i < length; i++) {
            // High frequencies decay faster in real rooms (simulate by lowering cutoff over time)
            // Starts bright (alpha near 1.0), gets darker (alpha approaches 0.05)
            const progress = i / length;
            const alpha = Math.max(0.05, 1.0 - (progress * decay));
            
            const multiplier = Math.pow(1 - progress, decay);
            
            // Raw noise
            const noiseL = (Math.random() * 2 - 1) * multiplier;
            const noiseR = (Math.random() * 2 - 1) * multiplier;
            
            // Apply single-pole lowpass
            lastOutL = lastOutL + alpha * (noiseL - lastOutL);
            lastOutR = lastOutR + alpha * (noiseR - lastOutR);
            
            left[i] = lastOutL;
            right[i] = lastOutR;
        }
        return impulse;
    },

    setReverbEnvironment(envName) {
        this._reverbEnv = envName;
        if (this._proxyCmd('setReverbEnvironment', envName)) return;
        if (!this._audioConnected && this._needsAudioGraph && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
        }
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
    
    setReverbMix(value, bypassOnly = false) {
        if (!bypassOnly) this._reverbMix = value;
        if (this._proxyCmd('setReverbMix', value)) return;
        if (!this._audioConnected && this._needsAudioGraph && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
        }
        // Remove early return if bypassed, so bypass logic can force mix to 0
        if (this.reverbDryGain && this.reverbWetGain && this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch((e) => {
                    this.utils?.log?.('[YPP:Equaliser] setReverbMix resume failed: ' + e.message, 'Equaliser', 'info');
                });
            }
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
        if (!this._audioConnected && this._needsAudioGraph && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
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
        
        // M/S Processing for Stereo Width
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
        
        // Crossfeed circuit (Bauer-style approximation with HRTF head shadow)
        const crossSplitter = ctx.createChannelSplitter(2);
        const crossMerger = ctx.createChannelMerger(2);
        
        const delayLtoR = ctx.createDelay(); delayLtoR.delayTime.value = 0.00025; // ~250 microseconds
        const delayRtoL = ctx.createDelay(); delayRtoL.delayTime.value = 0.00025;
        
        // HRTF head shadow emulation (High-shelf cut instead of absolute lowpass)
        const hsfLtoR = ctx.createBiquadFilter(); hsfLtoR.type = 'highshelf'; hsfLtoR.frequency.value = 2500; hsfLtoR.gain.value = -12;
        const hsfRtoL = ctx.createBiquadFilter(); hsfRtoL.type = 'highshelf'; hsfRtoL.frequency.value = 2500; hsfRtoL.gain.value = -12;
        
        const crossGainLtoR = ctx.createGain(); crossGainLtoR.gain.value = 0;
        const crossGainRtoL = ctx.createGain(); crossGainRtoL.gain.value = 0;
        
        // Direct path
        const directGainL = ctx.createGain(); directGainL.gain.value = 1.0;
        const directGainR = ctx.createGain(); directGainR.gain.value = 1.0;
        
        merger.connect(crossSplitter);
        
        crossSplitter.connect(directGainL, 0);
        crossSplitter.connect(delayLtoR, 0);
        delayLtoR.connect(hsfLtoR);
        hsfLtoR.connect(crossGainLtoR);
        
        crossSplitter.connect(directGainR, 1);
        crossSplitter.connect(delayRtoL, 1);
        delayRtoL.connect(hsfRtoL);
        hsfRtoL.connect(crossGainRtoL);
        
        directGainL.connect(crossMerger, 0, 0);
        crossGainRtoL.connect(crossMerger, 0, 0);
        
        directGainR.connect(crossMerger, 0, 1);
        crossGainLtoR.connect(crossMerger, 0, 1);
        
        crossMerger.connect(output);
        
        this.crossfeedNodes = {
            directGainL, directGainR,
            crossGainLtoR, crossGainRtoL
        };
        
        return { input, output, widthGain };
    },

    setCrossfeed(enabled) {
        this._crossfeedEnabled = !!enabled;
        if (this._proxyCmd('setCrossfeed', enabled)) return;
        if (!this._audioConnected && this._needsAudioGraph && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
        }
        if (!this.crossfeedNodes || !this.ctx) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch((e) => {
                this.utils?.log?.('[YPP:Equaliser] setCrossfeed resume failed: ' + e.message, 'Equaliser', 'info');
            });
        }
        
        const crossLevel = enabled ? 0.35 : 0; // -9dB crossfeed
        const directLevel = enabled ? 0.85 : 1.0; // compensate for volume bump
        
        this.crossfeedNodes.crossGainLtoR.gain.setTargetAtTime(crossLevel, this.ctx.currentTime, 0.05);
        this.crossfeedNodes.crossGainRtoL.gain.setTargetAtTime(crossLevel, this.ctx.currentTime, 0.05);
        this.crossfeedNodes.directGainL.gain.setTargetAtTime(directLevel, this.ctx.currentTime, 0.05);
        this.crossfeedNodes.directGainR.gain.setTargetAtTime(directLevel, this.ctx.currentTime, 0.05);
    },

    _updateStereoWidth() {
        if (this._bypassed) return;
        if (!this._audioConnected && this._needsAudioGraph && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
        }
        if (this.widthMatrix && this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch((e) => {
                    this.utils?.log?.('[YPP:Equaliser] _updateStereoWidth resume failed: ' + e.message, 'Equaliser', 'info');
                });
            }
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
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
        }
        if (this.pannerNode && this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch((e) => {
                    this.utils?.log?.('[YPP:Equaliser] setBalance resume failed: ' + e.message, 'Equaliser', 'info');
                });
            }
            this.pannerNode.pan.setTargetAtTime(value, this.ctx.currentTime, 0.05);
        }
    }
};
