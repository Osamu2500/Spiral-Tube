/**
 * Audio FX Module (Mixin)
 * Handles Voice FX — leveled up with Convolution Reverbs, 8D Spatial Audio, and True Pitch Shifting.
 */
export const AudioFXMixin = {
    _cleanupFX() {
        this._fxNodes.forEach(node => {
            try {
                node.disconnect();
                if (node.stop) node.stop();
            } catch (e) { /* Safe to ignore, node might already be disconnected/stopped */ }
        });
        this._fxNodes.push();
    },

    _makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const drive = k / 10;
        const maxTanh = Math.tanh(drive);
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2 / n_samples) - 1;
            curve[i] = Math.tanh(x * drive) / maxTanh;
        }
        return curve;
    },

    _makeTubeCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        // Warmth 0-100 mapped to tube drive
        const drive = k / 25; 
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2 / n_samples) - 1;
            // Asymmetrical soft clipping (even harmonics)
            if (x < 0) {
                curve[i] = -1 + Math.exp(x * (1 + drive)); // Soft compression on negative cycle
            } else {
                curve[i] = Math.tanh(x * (1 + drive)); // Harder saturation on positive cycle
            }
        }
        return curve;
    },


    _makeBitcrushCurve(bits) {
        const steps = Math.pow(2, bits);
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
            let x = (i * 2 / n_samples) - 1;
            curve[i] = Math.round(x * steps) / steps;
        }
        return curve;
    },

    _getBuffer(type, freq = 60) {
        if (!this._bufferCache) this._bufferCache = {};
        const key = `${type}_${freq}`;
        if (this._bufferCache[key]) return this._bufferCache[key];

        const sampleRate = this.ctx.sampleRate;
        let buffer, data;

        if (type === 'crackle') {
            const length = Math.floor(sampleRate * 3);
            buffer = this.ctx.createBuffer(1, length, sampleRate);
            data = buffer.getChannelData(0);
            for (let i = 0; i < length; i++) {
                let val = (Math.random() * 2 - 1) * 0.015;
                if (Math.random() < 0.002) val += (Math.random() * 2 - 1) * 0.5;
                if (Math.random() < 0.00008) val += (Math.random() * 2 - 1) * 1.0;
                data[i] = val;
            }
        } else if (type === 'hum') {
            const length = Math.floor(sampleRate * 1);
            buffer = this.ctx.createBuffer(1, length, sampleRate);
            data = buffer.getChannelData(0);
            for (let i = 0; i < length; i++) {
                const t = i / sampleRate;
                data[i] = (Math.sin(2 * Math.PI * freq * t) * 0.5) +
                          (Math.sin(2 * Math.PI * (freq * 2) * t) * 0.25) +
                          (Math.sin(2 * Math.PI * (freq * 3) * t) * 0.12) +
                          (Math.sin(2 * Math.PI * (freq * 5) * t) * 0.06);
            }
        } else if (type === 'pink') {
            const length = Math.floor(sampleRate * 2);
            buffer = this.ctx.createBuffer(1, length, sampleRate);
            data = buffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < length; i++) {
                let white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.11; // compensate gain
                b6 = white * 0.115926;
            }
        } else if (type === 'brown') {
            const length = Math.floor(sampleRate * 2);
            buffer = this.ctx.createBuffer(1, length, sampleRate);
            data = buffer.getChannelData(0);
            let lastOut = 0;
            for (let i = 0; i < length; i++) {
                let white = Math.random() * 2 - 1;
                data[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = data[i];
                data[i] *= 3.5; // compensate gain
            }
        } else if (type === 'white') {
            const length = Math.floor(sampleRate * 2);
            buffer = this.ctx.createBuffer(1, length, sampleRate);
            data = buffer.getChannelData(0);
            for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
        }

        this._bufferCache[key] = buffer;
        return buffer;
    },

    _generateImpulseResponse(lengthInSeconds = 2, decay = 2.0, reverse = false) {
        const sampleRate = this.ctx.sampleRate;
        const length = Math.floor(sampleRate * lengthInSeconds);
        const impulse = this.ctx.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        let lastOutL = 0; let lastOutR = 0;
        const filter = 0.6;
        for (let i = 0; i < length; i++) {
            const n = reverse ? length - 1 - i : i;
            const envelope = Math.pow(1 - n / length, decay);
            const noiseL = (Math.random() * 2 - 1) * envelope;
            const noiseR = (Math.random() * 2 - 1) * envelope;
            lastOutL = filter * lastOutL + (1 - filter) * noiseL;
            lastOutR = filter * lastOutR + (1 - filter) * noiseR;
            left[i] = lastOutL; right[i] = lastOutR;
        }
        return impulse;
    },

    _createConvolver(length = 2.5, decay = 2.0, reverse = false) {
        const convolver = this.ctx.createConvolver();
        convolver.buffer = this._generateImpulseResponse(length, decay, reverse);
        return convolver;
    },

    _createSchroederReverb(inputNode, roomSize = 0.8, dampening = 3000) {
        const outputNode = this.ctx.createGain();
        const combDelays = [0.0297, 0.0371, 0.0411, 0.0437];
        const allpassDelays = [0.005, 0.0017];
        
        const combFilters = [];
        const combGains = [];
        const dampFilters = [];
        
        // Normalize gain to prevent +30dB piling up at high room sizes!
        const normalization = (1.0 - roomSize) * 2.0;
        
        const merger = this.ctx.createGain();
        merger.gain.value = normalization;
        
        const input = this.ctx.createGain();
        if (inputNode) inputNode.connect(input);

        // 4 Parallel Comb Filters
        for (let i = 0; i < combDelays.length; i++) {
            const delay = this.ctx.createDelay();
            delay.delayTime.value = combDelays[i];
            
            const feedback = this.ctx.createGain();
            feedback.gain.value = roomSize; // Determines decay time

            const damp = this.ctx.createBiquadFilter();
            damp.type = 'highshelf';
            damp.frequency.value = dampening;
            damp.gain.value = -6; // Attenuate highs safely instead of lowpass peak

            input.connect(delay);
            delay.connect(damp);
            damp.connect(feedback);
            feedback.connect(delay);
            
            delay.connect(merger);
            
            combFilters.push(delay);
            combGains.push(feedback);
            dampFilters.push(damp);
        }

        // 2 Series All-Pass Filters
        const ap1 = this.ctx.createBiquadFilter();
        ap1.type = 'allpass';
        ap1.frequency.value = 1 / allpassDelays[0];

        const ap2 = this.ctx.createBiquadFilter();
        ap2.type = 'allpass';
        ap2.frequency.value = 1 / allpassDelays[1];

        merger.connect(ap1);
        ap1.connect(ap2);
        ap2.connect(outputNode);

        return { 
            input: input,
            output: outputNode, 
            nodes: [input, ...combFilters, ...combGains, ...dampFilters, merger, ap1, ap2, outputNode]
        };
    },

    _createAutoPanner(speed = 0.2, width = 3) {
        const panner = this.ctx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        
        const oscX = this.ctx.createOscillator(); oscX.type = 'sine'; oscX.frequency.value = speed;
        const gainX = this.ctx.createGain(); gainX.gain.value = width;
        
        // Z axis needs a cosine wave (90 degrees out of phase) for circular panning
        // We can approximate by using a second oscillator with the same frequency but starting slightly later,
        // or just rely on a separate sine wave offset slightly in frequency to create complex lissajous curves
        const oscZ = this.ctx.createOscillator(); oscZ.type = 'sine'; oscZ.frequency.value = speed * 1.05;
        const gainZ = this.ctx.createGain(); gainZ.gain.value = width;

        if (panner.positionX) {
            oscX.connect(gainX); gainX.connect(panner.positionX);
            oscZ.connect(gainZ); gainZ.connect(panner.positionZ);
            oscX.start(); oscZ.start();
            return { output: panner, nodes: [panner, oscX, gainX, oscZ, gainZ] };
        } else {
            return { output: panner, nodes: [panner] };
        }
    },

    _createPitchShifter(inputNode, pitchRatio) {
        const outputNode = this.ctx.createGain();
        if (pitchRatio === 1.0) {
            inputNode.connect(outputNode);
            return { output: outputNode, nodes: [outputNode] };
        }

        const bufferTime = 0.100;
        const delayTime = 0.100;
        const numTaps = 4;
        const rate = 1.0 - pitchRatio;
        
        const lfoBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * bufferTime), this.ctx.sampleRate);
        const fadeBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * bufferTime), this.ctx.sampleRate);
        const lfoData = lfoBuffer.getChannelData(0); 
        const fadeData = fadeBuffer.getChannelData(0);
        
        for (let i = 0; i < lfoData.length; i++) {
            const x = i / lfoData.length;
            lfoData[i] = x;
            // Hann window scaled for 4 overlapping taps
            fadeData[i] = (0.5 - 0.5 * Math.cos(2 * Math.PI * x)) / (numTaps / 2);
        }

        const nodes = [outputNode];
        const t = this.ctx.currentTime + 0.05;

        for (let i = 0; i < numTaps; i++) {
            const delay = this.ctx.createDelay(1);
            delay.delayTime.value = 0.2; // Base delay

            const mod = this.ctx.createBufferSource();
            mod.buffer = lfoBuffer;
            mod.loop = true;

            const modGain = this.ctx.createGain();
            modGain.gain.value = delayTime * rate;

            mod.connect(modGain);
            modGain.connect(delay.delayTime);

            const fade = this.ctx.createBufferSource();
            fade.buffer = fadeBuffer;
            fade.loop = true;

            const fadeGain = this.ctx.createGain();
            fadeGain.gain.value = 0;

            fade.connect(fadeGain.gain);
            
            inputNode.connect(delay);
            delay.connect(fadeGain);
            fadeGain.connect(outputNode);

            const offset = (bufferTime / numTaps) * i;
            mod.start(t + offset);
            fade.start(t + offset);

            nodes.push(delay, mod, modGain, fade, fadeGain);
        }

        return { output: outputNode, nodes };
    },

    _createChorus(inputNode, speed = 1.5, depth = 0.002, mix = 0.5) {
        const delay1 = this.ctx.createDelay(); delay1.delayTime.value = 0.018;
        const delay2 = this.ctx.createDelay(); delay2.delayTime.value = 0.025;

        const osc1 = this.ctx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = speed;
        const osc2 = this.ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = speed * 1.33;

        const depthGain1 = this.ctx.createGain(); depthGain1.gain.value = depth;
        const depthGain2 = this.ctx.createGain(); depthGain2.gain.value = depth * 0.75;
        osc1.connect(depthGain1); depthGain1.connect(delay1.delayTime);
        osc2.connect(depthGain2); depthGain2.connect(delay2.delayTime);
        osc1.start(); osc2.start();

        const dryGain = this.ctx.createGain(); dryGain.gain.value = 1.0 - mix;
        const wet1 = this.ctx.createGain(); wet1.gain.value = mix * 0.6;
        const wet2 = this.ctx.createGain(); wet2.gain.value = mix * 0.4;

        inputNode.connect(dryGain);
        inputNode.connect(delay1); delay1.connect(wet1);
        inputNode.connect(delay2); delay2.connect(wet2);

        const outputNode = this.ctx.createGain();
        dryGain.connect(outputNode); wet1.connect(outputNode); wet2.connect(outputNode);

        return { output: outputNode, nodes: [delay1, delay2, osc1, osc2, depthGain1, depthGain2, dryGain, wet1, wet2, outputNode] };
    },

    _createRingMod(inputNode, freq = 50, mix = 1.0) {
        const rmNode = this.ctx.createGain(); rmNode.gain.value = 0;
        const osc = this.ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
        osc.connect(rmNode.gain); osc.start();
        const dryGain = this.ctx.createGain(); dryGain.gain.value = 1.0 - mix;
        const wetGain = this.ctx.createGain(); wetGain.gain.value = mix;
        inputNode.connect(dryGain); inputNode.connect(rmNode); rmNode.connect(wetGain);
        const outputNode = this.ctx.createGain();
        dryGain.connect(outputNode); wetGain.connect(outputNode);
        return { output: outputNode, nodes: [rmNode, osc, dryGain, wetGain, outputNode] };
    },

    async setFX(effectName, bypassOnly = false) {
        if (!effectName) effectName = 'none';
        if (!bypassOnly) {
            this._activeFX = effectName;
            window.YPP?.Utils?.saveSettings({ volumeActiveEffect: effectName });
        }
        if (this._proxyCmd('setFX', effectName)) return;

        if (!this._audioConnected && this._needsAudioGraph && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) {
                this.initAudioContext(video);
            }
        }

        if (!this._audioConnected || !this.fxInput) return;

        if (this.ctx.state === 'suspended') {
            try {
                await this.ctx.resume();
            } catch (e) {
                this.utils?.log?.('[YPP:Equaliser] setFX resume failed: ' + e.message, 'Equaliser', 'info');
            }
        }

        this.fxInput.disconnect();
        this._cleanupFX();

        // --- MASTER LEVEL BALANCER ---
        const fxTarget = this.ctx.createGain();
        const effectGains = {
            'radio': 0.8,
            'demonic': 0.35,
            'vader': 0.45,
            'robot': 0.45,
            'astronaut': 0.4,
            'alien': 0.6,
            'dream': 0.6,
            'witness': 0.4,
            'telephone': 0.4,
            'ghost': 0.4,
            'bee': 0.5,
            'sulfux': 0.3,
            'deep': 0.5,
            'zombie': 0.4,
            'mask': 0.8,
            'helmet': 0.8,
            'child': 0.7,
            'ethereal': 0.7,
            'tv_static': 0.45,
            'walkie_talkie': 0.4,
            'autotune': 0.5,
            'cyberpunk': 0.4,
            'stadium': 0.7,
            'cathedral': 0.7,
            'empty_room': 0.8,
            'far_away': 0.8,
            'helium': 0.8,
            'chipmunk': 0.8,
            'whisper': 0.8,
            'adam': 0.8,
        };
        fxTarget.gain.value = effectGains[effectName] || 1.0;
        fxTarget.connect(this.fxOutput);
        this._fxNodes.push(fxTarget);

        const connectOut = (lastNode) => {
            const comp = this.ctx.createDynamicsCompressor();
            // Softer compression to prevent severe volume ducking
            comp.threshold.value = -12;
            comp.ratio.value = 1.5;
            comp.knee.value = 10;
            comp.attack.value = 0.01;
            comp.release.value = 0.1;
            
            const makeup = this.ctx.createGain();
            makeup.gain.value = 1.35; // gentle makeup gain
            
            lastNode.connect(comp);
            comp.connect(makeup);
            makeup.connect(fxTarget);
            this._fxNodes.push(comp, makeup);
        };

        const connectBackground = (node) => {
            if (this.widthMatrix && this.widthMatrix.input) {
                // Route directly to stereo widening/master, bypassing main compressor
                node.connect(this.widthMatrix.input);
            } else {
                node.connect(this.fxOutput);
            }
        };

        if (effectName === 'radio') {
            // ── MEGAPHONE v4 (Convolution Reverb) ──
            const inputSat = this.ctx.createWaveShaper(); inputSat.curve = this._makeDistortionCurve(40); inputSat.oversample = '4x';
            const convolver = this._createConvolver(0.1, 15.0); // Tin can IR
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 600; hp.Q.value = 2.0;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2500;
            const hardClip = this.ctx.createWaveShaper(); hardClip.curve = this._makeDistortionCurve(80);
            
            this.fxInput.connect(inputSat); inputSat.connect(convolver); convolver.connect(hp); 
            hp.connect(lp); lp.connect(hardClip); 
            connectOut(hardClip);
            this._fxNodes.push(inputSat, convolver, hp, lp, hardClip);

        } else if (effectName === 'underwater') {
            // ── UNDERWATER v3 (Dynamic LFO + Chorus + Deep Cutoff) ──
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 600; lp1.Q.value = 2.0;
            const lp2 = this.ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 400; lp2.Q.value = 1.0;
            const killHighs = this.ctx.createBiquadFilter(); killHighs.type = 'lowpass'; killHighs.frequency.value = 1500; killHighs.Q.value = 0.5;
            const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.3;
            const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 250;
            lfo.connect(lfoGain); lfoGain.connect(lp1.frequency); lfo.start();
            const chorus = this._createChorus(lp2, 0.15, 0.006, 0.4);
            const muffle = this.ctx.createBiquadFilter(); muffle.type = 'highshelf'; muffle.frequency.value = 1200; muffle.gain.value = -18;
            
            this.fxInput.connect(lp1); lp1.connect(lp2); lp2.connect(chorus.output); 
            chorus.output.connect(muffle); muffle.connect(killHighs); killHighs.connect(fxTarget);
            this._fxNodes.push(lp1, lp2, killHighs, lfo, lfoGain, muffle, ...chorus.nodes);

        } else if (effectName === 'vinyl') {
            // ── VINYL LO-FI v3 (Wow/Flutter + Cached Noise + Parallel Routing) ──
            const warmLP = this.ctx.createBiquadFilter(); warmLP.type = 'lowpass'; warmLP.frequency.value = 6000;
            const warmHP = this.ctx.createBiquadFilter(); warmHP.type = 'highpass'; warmHP.frequency.value = 60;
            const midDip = this.ctx.createBiquadFilter(); midDip.type = 'peaking'; midDip.frequency.value = 1000; midDip.Q.value = 0.8; midDip.gain.value = -3;
            const airShelf = this.ctx.createBiquadFilter(); airShelf.type = 'highshelf'; airShelf.frequency.value = 8000; airShelf.gain.value = -6;
            const sat = this.ctx.createWaveShaper(); sat.curve = this._makeDistortionCurve(12);
            
            const wowDelay = this.ctx.createDelay(); wowDelay.delayTime.value = 0.03;
            const wowLfo = this.ctx.createOscillator(); wowLfo.type = 'sine'; wowLfo.frequency.value = 0.55;
            const wowGain = this.ctx.createGain(); wowGain.gain.value = 0.003;
            wowLfo.connect(wowGain); wowGain.connect(wowDelay.delayTime); wowLfo.start();
            
            const flutterDelay = this.ctx.createDelay(); flutterDelay.delayTime.value = 0.005;
            const flutterLfo = this.ctx.createOscillator(); flutterLfo.type = 'sine'; flutterLfo.frequency.value = 7.0;
            const flutterGain = this.ctx.createGain(); flutterGain.gain.value = 0.0004;
            flutterLfo.connect(flutterGain); flutterGain.connect(flutterDelay.delayTime); flutterLfo.start();
            
            const crackleGain = this.ctx.createGain(); crackleGain.gain.value = 0.22;
            const humGain = this.ctx.createGain(); humGain.gain.value = 0.05;
            
            let crackleSrc = this.ctx.createBufferSource(); crackleSrc.buffer = this._getBuffer('crackle'); crackleSrc.loop = true; crackleSrc.connect(crackleGain); crackleSrc.start();
            let humSrc = this.ctx.createBufferSource(); humSrc.buffer = this._getBuffer('hum', 60); humSrc.loop = true; humSrc.connect(humGain); humSrc.start();
            
            this.fxInput.connect(warmHP); warmHP.connect(warmLP); warmLP.connect(midDip); midDip.connect(airShelf); airShelf.connect(sat);
            sat.connect(wowDelay); wowDelay.connect(flutterDelay); flutterDelay.connect(fxTarget);
            
            // Bypass compressor for noise
            connectBackground(crackleGain); connectBackground(humGain);
            
            this._fxNodes.push(warmLP, warmHP, midDip, airShelf, sat, wowDelay, wowLfo, wowGain, flutterDelay, flutterLfo, flutterGain, crackleGain, humGain, crackleSrc, humSrc);

        } else if (effectName === 'adam') {
            // ── ADAM (TikTok AI Narrator) v4 ──
            const pitch = this._createPitchShifter(this.fxInput, 1.05); // Tiny pitch up
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 90;
            const airBoost = this.ctx.createBiquadFilter(); airBoost.type = 'highshelf'; airBoost.frequency.value = 6000; airBoost.gain.value = 4;
            const comp = this.ctx.createDynamicsCompressor(); comp.threshold.value = -35; comp.ratio.value = 12; comp.attack.value = 0.005;
            
            pitch.output.connect(hp); hp.connect(airBoost); airBoost.connect(comp);
            connectOut(comp);
            this._fxNodes.push(...pitch.nodes, hp, airBoost, comp);

        } else if (effectName === 'helium') {
            // ── HELIUM v4 (Pitch Up + Formant EQ) ──
            const pitch = this._createPitchShifter(this.fxInput, 1.6);
            
            // Formant mimicking EQ: Cut low chest resonance, boost small throat resonances
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 250; hp.Q.value = 0.5;
            const peak1 = this.ctx.createBiquadFilter(); peak1.type = 'peaking'; peak1.frequency.value = 3500; peak1.Q.value = 2.0; peak1.gain.value = 6;
            const peak2 = this.ctx.createBiquadFilter(); peak2.type = 'peaking'; peak2.frequency.value = 5500; peak2.Q.value = 2.0; peak2.gain.value = 4;
            
            pitch.output.connect(hp); hp.connect(peak1); peak1.connect(peak2); peak2.connect(fxTarget);
            this._fxNodes.push(...pitch.nodes, hp, peak1, peak2);

        } else if (effectName === 'whisper') {
            // ── WHISPER (Highpass + Noise + Breath) ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200; hp.Q.value = 1.0;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4000;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(10);
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.1;
            const noiseSrc = this.ctx.createBufferSource(); noiseSrc.buffer = this._getBuffer('pink'); noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(ws);
            noiseGain.connect(hp);
            connectOut(ws);
            this._fxNodes.push(hp, lp, ws, noiseGain, noiseSrc);

        } else if (effectName === 'chipmunk') {
            // ── CHIPMUNK v4 (Pitch Up + Formant EQ + Fast Tremolo) ──
            const pitch = this._createPitchShifter(this.fxInput, 1.8);
            
            // Formant EQ
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300; hp.Q.value = 0.5;
            const peak1 = this.ctx.createBiquadFilter(); peak1.type = 'peaking'; peak1.frequency.value = 4000; peak1.Q.value = 2.0; peak1.gain.value = 8;
            
            // Tremolo for chaotic energy
            const tremoloGain = this.ctx.createGain(); tremoloGain.gain.value = 0.8;
            const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 12.0; // Fast flutter
            const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 0.2;
            lfo.connect(lfoGain); lfoGain.connect(tremoloGain.gain); lfo.start();
            
            pitch.output.connect(hp); hp.connect(peak1); peak1.connect(tremoloGain); tremoloGain.connect(fxTarget);
            this._fxNodes.push(...pitch.nodes, hp, peak1, tremoloGain, lfo, lfoGain);

        } else if (effectName === 'deep') {
            // ── DEEP VOICE v5 (Sub-Harmonic Pitch Down) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.6);
            
            // Sub-harmonic generator
            const subLp = this.ctx.createBiquadFilter(); subLp.type = 'lowpass'; subLp.frequency.value = 150;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(30);
            const subGain = this.ctx.createGain(); subGain.gain.value = 1.5;
            
            pitch.output.connect(subLp); subLp.connect(ws); ws.connect(subGain); subGain.connect(fxTarget);
            pitch.output.connect(fxTarget);
            this._fxNodes.push(...pitch.nodes, subLp, ws, subGain);

        } else if (effectName === 'demonic') {
            // ── DEMONIC v4 (Sub-Harmonics + Ring Mod + Schroeder) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.4);
            const rm = this._createRingMod(pitch.output, 25, 0.7);
            
            const subLp = this.ctx.createBiquadFilter(); subLp.type = 'lowpass'; subLp.frequency.value = 120;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(50);
            
            const reverb = this._createSchroederReverb(ws, 0.8, 2000);
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 1.2;
            
            rm.output.connect(subLp); subLp.connect(ws); ws.connect(reverb.input);
            reverb.output.connect(wetGain); wetGain.connect(fxTarget);
            rm.output.connect(fxTarget);
            
            this._fxNodes.push(...pitch.nodes, ...rm.nodes, subLp, ws, ...reverb.nodes, wetGain);

        } else if (effectName === 'ethereal') {
            // ── ETHEREAL v4 (Schroeder Reverb + Shimmer) ──
            const reverb = this._createSchroederReverb(this.fxInput, 0.9, 5000);
            const pitch = this._createPitchShifter(reverb.output, 2.0); // Shimmer pitch
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.5;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.8;
            
            this.fxInput.connect(dryGain); dryGain.connect(fxTarget);
            pitch.output.connect(wetGain); wetGain.connect(fxTarget);
            
            this._fxNodes.push(...pitch.nodes, ...reverb.nodes, wetGain, dryGain);

        } else if (effectName === 'telephone') {
            // ── TELEPHONE v3 (Bandpass + Crackle IR) ──
            const convolver = this._createConvolver(0.02, 30.0);
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 400;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(70);
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(convolver); convolver.connect(fxTarget);
            this._fxNodes.push(hp, lp, ws, convolver);

        } else if (effectName === 'vader') {
            // ── DARTH VADER v3 (True Pitch + Comb + Reverb) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.5);
            const rm = this._createRingMod(pitch.output, 30, 0.85);
            const convolver = this._createConvolver(2.0, 3.0);
            rm.output.connect(convolver);
            convolver.connect(fxTarget);
            rm.output.connect(fxTarget);
            this._fxNodes.push(...pitch.nodes, ...rm.nodes, convolver);

        } else if (effectName === 'robot') {
            // ── ROBOT (DALEK) v4 (Ringmod + Bandpass + Hard Clip) ──
            const rm1 = this._createRingMod(this.fxInput, 30, 0.9); // Deep metallic thrum
            const rm2 = this._createRingMod(rm1.output, 60, 0.5); // Higher metallic edge
            
            // Bandpass to focus on the intelligible robot frequencies and remove muddy lows/harsh highs
            const bp = this.ctx.createBiquadFilter(); 
            bp.type = 'bandpass'; 
            bp.frequency.value = 1200; 
            bp.Q.value = 1.2;
            
            const ws = this.ctx.createWaveShaper(); 
            ws.curve = this._makeDistortionCurve(10); // Slight clipping for gritty mechanical sound
            
            const makeUp = this.ctx.createGain();
            makeUp.gain.value = 2.0;
            
            rm2.output.connect(bp); bp.connect(ws); ws.connect(makeUp); makeUp.connect(fxTarget);
            this._fxNodes.push(...rm1.nodes, ...rm2.nodes, bp, ws, makeUp);

        } else if (effectName === 'astronaut') {
            // ── ASTRONAUT v4 (Comms IR + Slapback Echo + Squelch Space) ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(50);
            const convolver = this._createConvolver(0.1, 10.0); // Tin can IR
            
            const echo = this.ctx.createDelay(); echo.delayTime.value = 0.25;
            const echoGain = this.ctx.createGain(); echoGain.gain.value = 0.3;
            
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.05;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate), this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch (e) { /* Safe to ignore */ }
            
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(convolver);
            
            convolver.connect(fxTarget); 
            convolver.connect(echo); echo.connect(echoGain); echoGain.connect(fxTarget);
            
            noiseGain.connect(fxTarget);
            
            this._fxNodes.push(hp, lp, ws, convolver, echo, echoGain, noiseGain);
            if (noiseSrc) this._fxNodes.push(noiseSrc);

        } else if (effectName === 'cathedral') {
            // ── CATHEDRAL v4 (Schroeder Reverb) ──
            const reverb = this._createSchroederReverb(this.fxInput, 0.95, 2000); // Large room, damp highs
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.55;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.9;
            this.fxInput.connect(dryGain); dryGain.connect(fxTarget);
            reverb.output.connect(wetGain); wetGain.connect(fxTarget);
            this._fxNodes.push(...reverb.nodes, wetGain, dryGain);

        } else if (effectName === 'stadium') {
            // ── STADIUM v4 (Schroeder Reverb + Slapback) ──
            const reverb = this._createSchroederReverb(this.fxInput, 0.85, 4000);
            const slap = this.ctx.createDelay(); slap.delayTime.value = 0.15;
            const slapFb = this.ctx.createGain(); slapFb.gain.value = 0.4;
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.5;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.9;
            
            this.fxInput.connect(dryGain); dryGain.connect(fxTarget);
            this.fxInput.connect(slap); slap.connect(slapFb); slapFb.connect(slap);
            slap.connect(reverb.input);
            
            reverb.output.connect(wetGain); wetGain.connect(fxTarget);
            
            this._fxNodes.push(...reverb.nodes, slap, slapFb, wetGain, dryGain);

        } else if (effectName === 'empty_room') {
            // ── EMPTY ROOM v4 (Short Schroeder) ──
            const reverb = this._createSchroederReverb(this.fxInput, 0.5, 6000);
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.4;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.9;
            this.fxInput.connect(dryGain); dryGain.connect(fxTarget);
            reverb.output.connect(wetGain); wetGain.connect(fxTarget);
            this._fxNodes.push(...reverb.nodes, wetGain, dryGain);

        } else if (effectName === 'alien') {
            // ── ALIEN OVERLORD v4 (8D Panner + Ringmod + Chorus) ──
            const rm = this._createRingMod(this.fxInput, 15, 0.85); // slightly faster warble
            const chorus = this._createChorus(rm.output, 0.35, 0.008, 0.65);
            const panner = this._createAutoPanner(0.15, 4); // Slow 8D swirl
            chorus.output.connect(panner.output); 
            connectOut(panner.output);
            this._fxNodes.push(...rm.nodes, ...chorus.nodes, ...panner.nodes);

        } else if (effectName === 'dream') {
            // ── LUCID DREAM v4 (8D Panner + Schroeder Reverb) ──
            const reverb = this._createSchroederReverb(this.fxInput, 0.95, 3000);
            const panner = this._createAutoPanner(0.08, 5); // Very slow 8D swirl
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.6;
            
            this.fxInput.connect(panner.output); panner.output.connect(fxTarget);
            panner.output.connect(reverb.input); reverb.output.connect(wetGain); wetGain.connect(fxTarget);
            this._fxNodes.push(...reverb.nodes, wetGain, ...panner.nodes);

        } else if (effectName === '8bit') {
            // ── 8-BIT RETRO v3 (Pitch Lock + Dual Bitcrush + Sample Rate Decimation) ──
            const pitch = this._createPitchShifter(this.fxInput, 1.3); // slightly high pitched
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(4);
            const bc2 = this.ctx.createWaveShaper(); bc2.curve = this._makeBitcrushCurve(6);
            const srComb = this.ctx.createDelay(); srComb.delayTime.value = 1 / 8000;
            const srFb = this.ctx.createGain(); srFb.gain.value = 0.92;
            const rm = this._createRingMod(bc2, 22.05, 0.2);
            const lpRoll = this.ctx.createBiquadFilter(); lpRoll.type = 'lowpass'; lpRoll.frequency.value = 4000;
            
            pitch.output.connect(bc); bc.connect(srComb); srComb.connect(srFb); srFb.connect(srComb); srComb.connect(bc2);
            rm.output.connect(lpRoll); lpRoll.connect(fxTarget);
            this._fxNodes.push(...pitch.nodes, bc, bc2, srComb, srFb, lpRoll, ...rm.nodes);

        } else if (effectName === 'witness') {
            // ── WITNESS PROTECTION v3 (Pitch Down + Scramble + Room IR) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.7); // Deep voice
            const rm1 = this._createRingMod(pitch.output, 127, 0.7);
            const rm2 = this._createRingMod(rm1.output, 73, 0.5);
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(5);
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(20);
            const convolver = this._createConvolver(0.3, 5.0); // Interview room
            
            rm2.output.connect(bc); bc.connect(lp); lp.connect(ws); ws.connect(convolver); convolver.connect(fxTarget);
            this._fxNodes.push(...pitch.nodes, ...rm1.nodes, ...rm2.nodes, bc, lp, ws, convolver);

        } else if (effectName === 'tv_static') {
            // ── TV STATIC v3 (Noise Bands + Dropout LFO + Panned Static) ──
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(40);
            const bp1 = this.ctx.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 3000; bp1.Q.value = 0.8;
            const bp2 = this.ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 7000; bp2.Q.value = 1.0;
            const dropoutOsc = this.ctx.createOscillator(); dropoutOsc.type = 'square'; dropoutOsc.frequency.value = 3.7;
            const dropoutGain = this.ctx.createGain(); dropoutGain.gain.value = 0.3;
            const signalGain = this.ctx.createGain(); signalGain.gain.value = 0.7;
            
            dropoutOsc.connect(dropoutGain); dropoutGain.connect(signalGain.gain); dropoutOsc.start();
            
            const panner = this._createAutoPanner(0.3, 3); // Static moves left/right
            
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.3;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 2), this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch (e) { /* Safe to ignore */ }
            
            this.fxInput.connect(ws); ws.connect(signalGain);
            signalGain.connect(bp1); signalGain.connect(bp2);
            bp1.connect(fxTarget); bp2.connect(fxTarget);
            noiseGain.connect(panner.output); panner.output.connect(bp1); panner.output.connect(fxTarget);
            
            this._fxNodes.push(ws, bp1, bp2, dropoutOsc, dropoutGain, signalGain, noiseGain, ...panner.nodes);
            if (noiseSrc) this._fxNodes.push(noiseSrc);

        } else if (effectName === 'walkie_talkie') {
            // ── WALKIE TALKIE (Police Scanner) ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 600; hp.Q.value = 1.0;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2500; lp.Q.value = 1.2;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(100);
            
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.08;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate), this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch (e) { /* Safe to ignore */ }
            
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(fxTarget);
            noiseGain.connect(hp); // Static goes through the bandpass filters too
            
            this._fxNodes.push(hp, lp, ws, noiseGain);
            if (noiseSrc) this._fxNodes.push(noiseSrc);

        } else if (effectName === 'cyberpunk') {
            // ── CYBERPUNK SYNTH v4 (Synth Chorus + Overdrive + Digital Delay) ──
            // Drive
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(10);
            const highPres = this.ctx.createBiquadFilter(); highPres.type = 'peaking'; highPres.frequency.value = 4000; highPres.Q.value = 1.0; highPres.gain.value = 4;
            
            // Synth Chorus (Flanger style)
            const chorus = this._createChorus(highPres, 0.6, 0.008, 0.5);
            
            // Ping-pong style delays
            const d1 = this.ctx.createDelay(); d1.delayTime.value = 0.15; // 1/8 note
            const d2 = this.ctx.createDelay(); d2.delayTime.value = 0.225; // dotted 1/8 note
            const fb = this.ctx.createGain(); fb.gain.value = 0.35;
            
            // Pump LFO
            const pumpLfo = this.ctx.createOscillator(); pumpLfo.type = 'triangle'; pumpLfo.frequency.value = 2.0;
            const pumpGain = this.ctx.createGain(); pumpGain.gain.value = 0.2;
            const pumpOut = this.ctx.createGain(); pumpOut.gain.value = 0.8;
            pumpLfo.connect(pumpGain); pumpGain.connect(pumpOut.gain); pumpLfo.start();
            
            this.fxInput.connect(ws); ws.connect(highPres);
            
            chorus.output.connect(d1);
            d1.connect(fb); fb.connect(d2); d2.connect(fb);
            
            chorus.output.connect(pumpOut);
            d1.connect(pumpOut); d2.connect(pumpOut);
            
            pumpOut.connect(fxTarget);
            
            this._fxNodes.push(ws, highPres, d1, d2, fb, pumpLfo, pumpGain, pumpOut, ...chorus.nodes);

        } else if (effectName === 'sulfux') {
            // ── SULFUR HEXAFLUORIDE v4 (Pitch Drop + Sub Formants + Chorus + Room) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.3); // Insanely deep
            // Enhance formants to sound heavy but clear
            const subBoost = this.ctx.createBiquadFilter(); subBoost.type = 'lowshelf'; subBoost.frequency.value = 150; subBoost.gain.value = 12;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 200; f1.Q.value = 2.0; f1.gain.value = 8;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(20);
            const chorus = this._createChorus(ws, 0.8, 0.01, 0.3);
            const convolver = this._createConvolver(1.5, 2.5); // heavy room
            
            const dryMix = this.ctx.createGain(); dryMix.gain.value = 0.9;
            const wetMix = this.ctx.createGain(); wetMix.gain.value = 0.4;
            
            pitch.output.connect(subBoost); subBoost.connect(f1); f1.connect(ws);
            chorus.output.connect(dryMix);
            chorus.output.connect(convolver); convolver.connect(wetMix);
            
            connectOut(dryMix); connectOut(wetMix);
            
            this._fxNodes.push(...pitch.nodes, subBoost, f1, ws, convolver, dryMix, wetMix, ...chorus.nodes);

        } else if (effectName === 'far_away') {
            // ── FAR AWAY v4 (Distant Schroeder + Bandpass + Multi-echo) ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 800; hp.Q.value = 0.5;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000; lp.Q.value = 0.5;
            const distLP = this.ctx.createBiquadFilter(); distLP.type = 'lowpass'; distLP.frequency.value = 1000;
            const reverb = this._createSchroederReverb(this.fxInput, 0.9, 1500); // distant blurry reverb
            const echo1 = this.ctx.createDelay(); echo1.delayTime.value = 0.08;
            const echo2 = this.ctx.createDelay(); echo2.delayTime.value = 0.22;
            const fb1 = this.ctx.createGain(); fb1.gain.value = 0.35;
            const fb2 = this.ctx.createGain(); fb2.gain.value = 0.2;
            
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(distLP); 
            distLP.connect(reverb.input);
            reverb.output.connect(fxTarget);
            reverb.output.connect(echo1); echo1.connect(fb1); fb1.connect(echo1); echo1.connect(fxTarget);
            reverb.output.connect(echo2); echo2.connect(fb2); fb2.connect(echo2); echo2.connect(fxTarget);
            
            this._fxNodes.push(hp, lp, distLP, ...reverb.nodes, echo1, echo2, fb1, fb2);

        } else if (effectName === 'autotune') {
            // ── AUTO-TUNE (ROBOTIC) v3 (Pitch-lock Combs + Hard Clip) ──
            const rm1 = this._createRingMod(this.fxInput, 130, 0.6);
            const rm2 = this._createRingMod(this.fxInput, 196, 0.4);
            const merge = this.ctx.createGain(); merge.gain.value = 0.7;
            rm1.output.connect(merge); rm2.output.connect(merge);
            
            const comb = this.ctx.createDelay(); comb.delayTime.value = 1 / 130;
            const combFb = this.ctx.createGain(); combFb.gain.value = 0.75;
            const combLp = this.ctx.createBiquadFilter(); combLp.type = 'lowpass'; combLp.frequency.value = 5000;
            
            merge.connect(comb); comb.connect(combFb); combFb.connect(combLp); combLp.connect(comb);
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(25);
            
            merge.connect(ws); comb.connect(ws); ws.connect(fxTarget);
            this._fxNodes.push(...rm1.nodes, ...rm2.nodes, merge, comb, combFb, combLp, ws);

        } else if (effectName === 'zombie') {
            // ── ZOMBIE v4 (Pitch Drop + Throat Rasp + Drag Echo + Schroeder) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.55);
            const rm = this._createRingMod(pitch.output, 40, 0.3); // Throat rasp
            const chorus = this._createChorus(rm.output, 0.5, 0.025, 0.8);
            const sub = this.ctx.createBiquadFilter(); sub.type = 'peaking'; sub.frequency.value = 90; sub.Q.value = 2.0; sub.gain.value = 10;
            const ws1 = this.ctx.createWaveShaper(); ws1.curve = this._makeDistortionCurve(45);
            
            const dragDelay = this.ctx.createDelay(); dragDelay.delayTime.value = 0.1;
            const dragFb = this.ctx.createGain(); dragFb.gain.value = 0.4;
            const reverb = this._createSchroederReverb(this.fxInput, 0.9, 1500); // dark muddy room
            
            chorus.output.connect(sub); sub.connect(ws1);
            ws1.connect(dragDelay); dragDelay.connect(dragFb); dragFb.connect(dragDelay);
            
            const dryMix = this.ctx.createGain(); dryMix.gain.value = 0.8;
            ws1.connect(dryMix);
            
            ws1.connect(reverb.input); dragDelay.connect(reverb.input);
            
            connectOut(dryMix);
            connectOut(reverb.output);
            
            this._fxNodes.push(...pitch.nodes, ...rm.nodes, ...chorus.nodes, sub, ws1, dragDelay, dragFb, ...reverb.nodes, dryMix);

        } else if (effectName === 'child') {
            // ── CHILD v3 (True Pitch Up + Vocal Tract Formants) ──
            const pitch = this._createPitchShifter(this.fxInput, 1.6);
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 700; hp.Q.value = 0.8;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 2000; f1.Q.value = 2.0; f1.gain.value = 7;
            const f2 = this.ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 3500; f2.Q.value = 1.8; f2.gain.value = 5;
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -28; comp.ratio.value = 5; comp.attack.value = 0.002; comp.release.value = 0.08;
            
            pitch.output.connect(hp); hp.connect(f1); f1.connect(f2); f2.connect(comp); comp.connect(fxTarget);
            this._fxNodes.push(...pitch.nodes, hp, f1, f2, comp);

        } else if (effectName === 'mask') {
            // ── MASK v4 (Fabric Muffler) ──
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 2000; lp1.Q.value = 0.7;
            const shelf = this.ctx.createBiquadFilter(); shelf.type = 'highshelf'; shelf.frequency.value = 2000; shelf.gain.value = -25; // Steep cut
            const boxMid = this.ctx.createBiquadFilter(); boxMid.type = 'peaking'; boxMid.frequency.value = 300; boxMid.Q.value = 1.5; boxMid.gain.value = 6; // Boxiness
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(5);
            
            this.fxInput.connect(lp1); lp1.connect(shelf); shelf.connect(boxMid); boxMid.connect(ws); ws.connect(fxTarget);
            this._fxNodes.push(lp1, shelf, boxMid, ws);

        } else if (effectName === 'helmet') {
            // ── HELMET v4 (Fabric Muffler + Comb Filter + Slapback) ──
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 3000;
            const shelf = this.ctx.createBiquadFilter(); shelf.type = 'highshelf'; shelf.frequency.value = 2000; shelf.gain.value = -15; // Muffle but less than mask
            const boxMid = this.ctx.createBiquadFilter(); boxMid.type = 'peaking'; boxMid.frequency.value = 300; boxMid.Q.value = 1.5; boxMid.gain.value = 6;
            
            const comb = this.ctx.createDelay(); comb.delayTime.value = 0.005; // 5ms for glass resonance
            const combFb = this.ctx.createGain(); combFb.gain.value = 0.8;
            const slap = this.ctx.createDelay(); slap.delayTime.value = 0.020;
            const slapGain = this.ctx.createGain(); slapGain.gain.value = 0.45;
            
            this.fxInput.connect(lp1); lp1.connect(shelf); shelf.connect(boxMid);
            
            boxMid.connect(fxTarget);
            boxMid.connect(comb); comb.connect(combFb); combFb.connect(comb); comb.connect(fxTarget);
            boxMid.connect(slap); slap.connect(slapGain); slapGain.connect(fxTarget);
            
            this._fxNodes.push(lp1, shelf, boxMid, comb, combFb, slap, slapGain);
        } else if (effectName === 'ghost') {
            // ── GHOST v4 (8D Panner + Multi-voice chorus + Shimmer + Schroeder) ──
            const chorus = this._createChorus(this.fxInput, 0.35, 0.012, 0.7);
            const reverb = this._createSchroederReverb(this.fxInput, 0.95, 4000);
            const panner = this._createAutoPanner(0.1, 5); // slow orbit
            const shimmer = this.ctx.createBiquadFilter(); shimmer.type = 'highshelf'; shimmer.frequency.value = 8000; shimmer.gain.value = 5;
            
            chorus.output.connect(reverb.input);
            reverb.output.connect(shimmer); shimmer.connect(panner.output); panner.output.connect(fxTarget);
            this._fxNodes.push(...chorus.nodes, ...reverb.nodes, shimmer, ...panner.nodes);
            
        } else if (effectName === 'rain') {
            // ── RAIN v4 (Cached Pink Noise + Parallel Routing + Thunder) ──
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.18;
            const crackleGain = this.ctx.createGain(); crackleGain.gain.value = 0.35;
            
            const noiseSrc = this.ctx.createBufferSource(); noiseSrc.buffer = this._getBuffer('pink'); noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            const crackleSrc = this.ctx.createBufferSource(); crackleSrc.buffer = this._getBuffer('crackle'); crackleSrc.loop = true; crackleSrc.connect(crackleGain); crackleSrc.start();
            const thunderSrc = this.ctx.createBufferSource(); thunderSrc.buffer = this._getBuffer('brown'); thunderSrc.loop = true;
            
            const pinkLp = this.ctx.createBiquadFilter(); pinkLp.type = 'lowpass'; pinkLp.frequency.value = 4000;
            const pinkHp = this.ctx.createBiquadFilter(); pinkHp.type = 'highpass'; pinkHp.frequency.value = 100;
            
            const thunderGain = this.ctx.createGain(); thunderGain.gain.value = 0.08;
            const thunderBp = this.ctx.createBiquadFilter(); thunderBp.type = 'lowpass'; thunderBp.frequency.value = 150;
            const thunderLfo = this.ctx.createOscillator(); thunderLfo.type = 'sine'; thunderLfo.frequency.value = 0.05;
            
            thunderSrc.connect(thunderGain); thunderSrc.start();
            thunderLfo.connect(thunderGain.gain); thunderLfo.start();
            
            this.fxInput.connect(fxTarget);
            
            noiseGain.connect(pinkLp); pinkLp.connect(pinkHp); 
            connectBackground(pinkHp);
            connectBackground(crackleGain);
            
            thunderGain.connect(thunderBp); 
            connectBackground(thunderBp);
            
            this._fxNodes.push(noiseGain, crackleGain, pinkLp, pinkHp, thunderLfo, thunderGain, thunderBp, noiseSrc, crackleSrc, thunderSrc);

        } else if (effectName === 'forest') {
            // ── FOREST v5 (Pink Noise + Insects + Birds + Schroeder Ambience + Parallel) ──
            const reverb = this._createSchroederReverb(this.fxInput, 0.8, 3000);
            const windGain = this.ctx.createGain(); windGain.gain.value = 0.07;
            const windLp = this.ctx.createBiquadFilter(); windLp.type = 'bandpass'; windLp.frequency.value = 500; windLp.Q.value = 0.4;
            
            const windSrc = this.ctx.createBufferSource(); windSrc.buffer = this._getBuffer('pink'); windSrc.loop = true; windSrc.connect(windGain); windSrc.start();
            
            const insectOsc = this.ctx.createOscillator(); insectOsc.type = 'square'; insectOsc.frequency.value = 6000;
            const insectGain = this.ctx.createGain(); insectGain.gain.value = 0.005;
            const insectLfo = this.ctx.createOscillator(); insectLfo.type = 'sine'; insectLfo.frequency.value = 15;
            const insectLfoG = this.ctx.createGain(); insectLfoG.gain.value = 2000;
            insectLfo.connect(insectLfoG); insectLfoG.connect(insectOsc.frequency);
            insectOsc.connect(insectGain); insectOsc.start(); insectLfo.start();
            
            const chirpOsc = this.ctx.createOscillator(); chirpOsc.type = 'sine'; chirpOsc.frequency.value = 3500;
            const chirpLfo = this.ctx.createOscillator(); chirpLfo.type = 'square'; chirpLfo.frequency.value = 0.4;
            const chirpLfoG = this.ctx.createGain(); chirpLfoG.gain.value = 800;
            chirpLfo.connect(chirpLfoG); chirpLfoG.connect(chirpOsc.frequency);
            const chirpVca = this.ctx.createGain(); chirpVca.gain.value = 0.025;
            chirpOsc.connect(chirpVca); chirpOsc.start(); chirpLfo.start();
            
            this.fxInput.connect(fxTarget);
            
            windGain.connect(windLp); connectBackground(windLp);
            connectBackground(insectGain);
            
            chirpVca.connect(reverb.input); 
            connectBackground(reverb.output);
            connectBackground(chirpVca);
            
            this._fxNodes.push(...reverb.nodes, windGain, windLp, insectOsc, insectGain, insectLfo, insectLfoG, chirpOsc, chirpLfo, chirpLfoG, chirpVca, windSrc);

        } else if (effectName === 'cave') {
            // ── CAVE v4 (Massive Schroeder Reverb) ──
            const reverb = this._createSchroederReverb(this.fxInput, 0.98, 2000); // Massive tail
            const preLp = this.ctx.createBiquadFilter(); preLp.type = 'lowpass'; preLp.frequency.value = 3000;
            const stone = this.ctx.createBiquadFilter(); stone.type = 'peaking'; stone.frequency.value = 300; stone.Q.value = 4.0; stone.gain.value = 4;
            
            this.fxInput.connect(preLp); preLp.connect(stone);
            stone.connect(fxTarget); // Dry
            stone.connect(reverb.input); reverb.output.connect(fxTarget); // Wet
            
            this._fxNodes.push(...reverb.nodes, preLp, stone);
        } else if (effectName === 'demon_lord') {
            // ── DEMON LORD v4 (Very deep + resonating + chorus + Schroeder) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.45);
            const sub = this.ctx.createBiquadFilter(); sub.type = 'lowshelf'; sub.frequency.value = 200; sub.gain.value = 15;
            const res = this.ctx.createBiquadFilter(); res.type = 'peaking'; res.frequency.value = 1500; res.Q.value = 4.0; res.gain.value = 8;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(10);
            const chorus = this._createChorus(ws, 0.4, 0.02, 0.7);
            const reverb = this._createSchroederReverb(this.fxInput, 0.9, 1500); // long evil cave
            
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.5;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.9;
            
            pitch.output.connect(sub); sub.connect(res); res.connect(ws);
            chorus.output.connect(dryGain);
            chorus.output.connect(reverb.input); reverb.output.connect(wetGain);
            
            connectOut(dryGain); connectOut(wetGain);
            this._fxNodes.push(...pitch.nodes, sub, res, ws, ...reverb.nodes, dryGain, wetGain, ...chorus.nodes);


        } else if (effectName === 'drunk') {
            // ── DRUNK v4 (Pitch Wobble + Woozy Panner + Muffle) ──
            const delay = this.ctx.createDelay(1); delay.delayTime.value = 0.15;
            const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.25; // very slow dizzy wobble
            const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 0.08; // heavy pitch drift
            lfo.connect(lfoGain); lfoGain.connect(delay.delayTime); lfo.start();
            
            const muffle = this.ctx.createBiquadFilter(); muffle.type = 'lowpass'; muffle.frequency.value = 1200;
            const mud = this.ctx.createBiquadFilter(); mud.type = 'peaking'; mud.frequency.value = 300; mud.Q.value = 1.0; mud.gain.value = 6;
            
            const panner = this._createAutoPanner(0.4, 2.5); // Drifting left and right
            
            this.fxInput.connect(delay); delay.connect(muffle); muffle.connect(mud); mud.connect(panner.output);
            panner.output.connect(fxTarget);
            
            this._fxNodes.push(delay, lfo, lfoGain, muffle, mud, ...panner.nodes);

        } else if (effectName === 'bee') {
            // ── BEE (High Pitch + Fast Ringmod + 8D Pan) ──
            const pitch = this._createPitchShifter(this.fxInput, 2.0); // 2x pitch
            const rm = this._createRingMod(pitch.output, 150, 0.8); // Buzzzzz
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1000;
            const panner = this._createAutoPanner(2.5, 4); // Fly around fast
            
            rm.output.connect(hp); hp.connect(panner.output);
            connectOut(panner.output);
            
            this._fxNodes.push(...pitch.nodes, ...rm.nodes, hp, ...panner.nodes);

        } else {
            // None — bypass
            this.fxInput.connect(fxTarget);
        }
    }
};
