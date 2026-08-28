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
            } catch (e) {}
        });
        this._fxNodes = [];
    },

    _makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
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

    _createCrackleBuffer() {
        const sampleRate = this.ctx.sampleRate;
        const length = Math.floor(sampleRate * 3);
        const buffer = this.ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            let val = (Math.random() * 2 - 1) * 0.015;
            if (Math.random() < 0.002) val += (Math.random() * 2 - 1) * 0.5;
            if (Math.random() < 0.00008) val += (Math.random() * 2 - 1) * 1.0;
            data[i] = val;
        }
        return buffer;
    },

    _createHumBuffer(freq) {
        const sampleRate = this.ctx.sampleRate;
        const length = Math.floor(sampleRate * 1);
        const buffer = this.ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            data[i] = (Math.sin(2 * Math.PI * freq * t) * 0.5) +
                      (Math.sin(2 * Math.PI * (freq * 2) * t) * 0.25) +
                      (Math.sin(2 * Math.PI * (freq * 3) * t) * 0.12) +
                      (Math.sin(2 * Math.PI * (freq * 5) * t) * 0.06);
        }
        return buffer;
    },

    _generateImpulseResponse(lengthInSeconds = 2, decay = 2.0, reverse = false) {
        const sampleRate = this.ctx.sampleRate;
        const length = Math.floor(sampleRate * lengthInSeconds);
        const impulse = this.ctx.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        for (let i = 0; i < length; i++) {
            const n = reverse ? length - 1 - i : i;
            const envelope = Math.pow(1 - n / length, decay);
            left[i] = (Math.random() * 2 - 1) * envelope;
            right[i] = (Math.random() * 2 - 1) * envelope;
        }
        return impulse;
    },

    _createConvolver(length = 2.5, decay = 2.0, reverse = false) {
        const convolver = this.ctx.createConvolver();
        convolver.buffer = this._generateImpulseResponse(length, decay, reverse);
        return convolver;
    },

    _createAutoPanner(speed = 0.2, width = 3) {
        const panner = this.ctx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        
        const osc = this.ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = speed;
        const gain = this.ctx.createGain(); gain.gain.value = width;
        
        if (panner.positionX) {
            osc.connect(gain); gain.connect(panner.positionX);
            panner.positionZ.value = 1.5; 
            osc.start();
            return { output: panner, nodes: [panner, osc, gain] };
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

        const bufferTime = 0.1;
        const delayTime = 0.1;
        const delay1 = this.ctx.createDelay(1); const delay2 = this.ctx.createDelay(1);
        delay1.delayTime.value = 0.2; delay2.delayTime.value = 0.2; // Base delay

        const rate = 1.0 - pitchRatio;
        
        const lfoBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * bufferTime), this.ctx.sampleRate);
        const fadeBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * bufferTime), this.ctx.sampleRate);
        const lfoData = lfoBuffer.getChannelData(0); const fadeData = fadeBuffer.getChannelData(0);
        
        for (let i = 0; i < lfoData.length; i++) {
            const x = i / lfoData.length;
            lfoData[i] = x;
            fadeData[i] = Math.sin(Math.PI * x); // Sine window
        }

        const mod1 = this.ctx.createBufferSource(); mod1.buffer = lfoBuffer; mod1.loop = true;
        const mod2 = this.ctx.createBufferSource(); mod2.buffer = lfoBuffer; mod2.loop = true;
        const modGain1 = this.ctx.createGain(); modGain1.gain.value = delayTime * rate;
        const modGain2 = this.ctx.createGain(); modGain2.gain.value = delayTime * rate;
        
        mod1.connect(modGain1); modGain1.connect(delay1.delayTime);
        mod2.connect(modGain2); modGain2.connect(delay2.delayTime);
        
        const fade1 = this.ctx.createBufferSource(); fade1.buffer = fadeBuffer; fade1.loop = true;
        const fade2 = this.ctx.createBufferSource(); fade2.buffer = fadeBuffer; fade2.loop = true;
        const fadeGain1 = this.ctx.createGain(); fadeGain1.gain.value = 0;
        const fadeGain2 = this.ctx.createGain(); fadeGain2.gain.value = 0;
        
        fade1.connect(fadeGain1.gain); fade2.connect(fadeGain2.gain);
        
        inputNode.connect(delay1); delay1.connect(fadeGain1); fadeGain1.connect(outputNode);
        inputNode.connect(delay2); delay2.connect(fadeGain2); fadeGain2.connect(outputNode);
        
        const t = this.ctx.currentTime + 0.05;
        mod1.start(t); fade1.start(t);
        mod2.start(t + bufferTime / 2); fade2.start(t + bufferTime / 2);

        return { 
            output: outputNode, 
            nodes: [delay1, delay2, mod1, mod2, modGain1, modGain2, fade1, fade2, fadeGain1, fadeGain2, outputNode] 
        };
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

    setFX(effectName) {
        this._activeFX = effectName;
        window.YPP?.Utils?.saveSettings({ volumeActiveEffect: effectName });
        if (this._proxyCmd('setFX', effectName)) return;
        if (!this._audioConnected || !this.fxInput) return;

        this.fxInput.disconnect();
        this._cleanupFX();

        if (effectName === 'radio') {
            // ── MEGAPHONE v3 (Convolution Reverb) ──
            const inputSat = this.ctx.createWaveShaper(); inputSat.curve = this._makeDistortionCurve(30); inputSat.oversample = '4x';
            const convolver = this._createConvolver(0.08, 20.0); // Tin can IR
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
            const hardClip = this.ctx.createWaveShaper(); hardClip.curve = this._makeDistortionCurve(100);
            this.fxInput.connect(inputSat); inputSat.connect(convolver); convolver.connect(hp); 
            hp.connect(lp); lp.connect(hardClip); hardClip.connect(this.fxOutput);
            this._fxNodes = [inputSat, convolver, hp, lp, hardClip];

        } else if (effectName === 'underwater') {
            // ── UNDERWATER v2 ──
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 600; lp1.Q.value = 2.0;
            const lp2 = this.ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 400; lp2.Q.value = 1.0;
            const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.3;
            const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 250;
            lfo.connect(lfoGain); lfoGain.connect(lp1.frequency); lfo.start();
            const chorus = this._createChorus(lp2, 0.15, 0.006, 0.4);
            const muffle = this.ctx.createBiquadFilter(); muffle.type = 'highshelf'; muffle.frequency.value = 1200; muffle.gain.value = -18;
            this.fxInput.connect(lp1); lp1.connect(lp2); lp2.connect(chorus.output); chorus.output.connect(muffle); muffle.connect(this.fxOutput);
            this._fxNodes = [lp1, lp2, lfo, lfoGain, muffle, ...chorus.nodes];

        } else if (effectName === 'vinyl') {
            // ── VINYL LO-FI v2 ──
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
            let crackleSrc = null, humSrc = null;
            try {
                crackleSrc = this.ctx.createBufferSource(); crackleSrc.buffer = this._createCrackleBuffer(); crackleSrc.loop = true; crackleSrc.connect(crackleGain); crackleSrc.start();
                humSrc = this.ctx.createBufferSource(); humSrc.buffer = this._createHumBuffer(60); humSrc.loop = true; humSrc.connect(humGain); humSrc.start();
            } catch (e) {}
            this.fxInput.connect(warmHP); warmHP.connect(warmLP); warmLP.connect(midDip); midDip.connect(airShelf); airShelf.connect(sat);
            sat.connect(wowDelay); wowDelay.connect(flutterDelay); flutterDelay.connect(this.fxOutput);
            crackleGain.connect(this.fxOutput); humGain.connect(this.fxOutput);
            this._fxNodes = [warmLP, warmHP, midDip, airShelf, sat, wowDelay, wowLfo, wowGain, flutterDelay, flutterLfo, flutterGain, crackleGain, humGain];
            if (crackleSrc) this._fxNodes.push(crackleSrc);
            if (humSrc) this._fxNodes.push(humSrc);

        } else if (effectName === 'adam') {
            // ── ADAM (TikTok AI Narrator) v2 ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 80;
            const comp = this.ctx.createDynamicsCompressor(); comp.threshold.value = -35; comp.ratio.value = 10;
            this.fxInput.connect(hp); hp.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [hp, comp];

        } else if (effectName === 'chipmunk') {
            // ── CHIPMUNK v3 (True Pitch Shift) ──
            const pitch = this._createPitchShifter(this.fxInput, 1.8);
            const comp = this.ctx.createDynamicsCompressor();
            pitch.output.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, comp];

        } else if (effectName === 'deep') {
            // ── DEEP VOICE v3 (True Pitch Shift) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.6);
            const comp = this.ctx.createDynamicsCompressor();
            pitch.output.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, comp];

        } else if (effectName === 'demonic') {
            // ── DEMONIC v3 (Pitch Shift + Ring Mod + Reverb) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.4);
            const rm = this._createRingMod(pitch.output, 25, 0.7);
            const convolver = this._createConvolver(1.0, 2.0);
            rm.output.connect(convolver); convolver.connect(this.fxOutput);
            rm.output.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, ...rm.nodes, convolver];

        } else if (effectName === 'ethereal') {
            // ── ETHEREAL v3 (Shimmer Convolution Reverb) ──
            const convolver = this._createConvolver(5.0, 1.0);
            const pitch = this._createPitchShifter(this.fxInput, 2.0); // Shimmer pitch
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.5;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.8;
            
            this.fxInput.connect(dryGain); dryGain.connect(this.fxOutput);
            pitch.output.connect(convolver);
            this.fxInput.connect(convolver);
            convolver.connect(wetGain); wetGain.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, convolver, wetGain, dryGain];

        } else if (effectName === 'telephone') {
            // ── TELEPHONE v3 (Bandpass + Crackle IR) ──
            const convolver = this._createConvolver(0.02, 30.0);
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 400;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(70);
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(convolver); convolver.connect(this.fxOutput);
            this._fxNodes = [hp, lp, ws, convolver];

        } else if (effectName === 'vader') {
            // ── DARTH VADER v3 (True Pitch + Comb + Reverb) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.5);
            const rm = this._createRingMod(pitch.output, 30, 0.85);
            const convolver = this._createConvolver(2.0, 3.0);
            rm.output.connect(convolver);
            convolver.connect(this.fxOutput);
            rm.output.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, ...rm.nodes, convolver];

        } else if (effectName === 'robot') {
            // ── ROBOT (DALEK) v3 (Pitch + Ringmod) ──
            const pitch = this._createPitchShifter(this.fxInput, 1.2);
            const rm1 = this._createRingMod(pitch.output, 50, 1.0);
            const rm2 = this._createRingMod(rm1.output, 100, 0.4);
            rm2.output.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, ...rm1.nodes, ...rm2.nodes];

        } else if (effectName === 'astronaut') {
            // ── ASTRONAUT v3 (Comms IR + Squelch Space) ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 400;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3500;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(60);
            const convolver = this._createConvolver(0.1, 10.0); // Tin can IR
            
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.05;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate), this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch (e) {}
            
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(convolver);
            convolver.connect(this.fxOutput); noiseGain.connect(this.fxOutput);
            
            this._fxNodes = [hp, lp, ws, convolver, noiseGain];
            if (noiseSrc) this._fxNodes.push(noiseSrc);

        } else if (effectName === 'cathedral') {
            // ── CATHEDRAL v3 (True Convolution) ──
            const convolver = this._createConvolver(4.0, 1.5);
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.5;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.9;
            this.fxInput.connect(dryGain); dryGain.connect(this.fxOutput);
            this.fxInput.connect(convolver); convolver.connect(wetGain); wetGain.connect(this.fxOutput);
            this._fxNodes = [convolver, wetGain, dryGain];

        } else if (effectName === 'stadium') {
            // ── STADIUM v3 (Convolution + Slapback) ──
            const convolver = this._createConvolver(3.0, 2.0);
            const slap = this.ctx.createDelay(); slap.delayTime.value = 0.15;
            const slapFb = this.ctx.createGain(); slapFb.gain.value = 0.4;
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.5;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.9;
            
            this.fxInput.connect(dryGain); dryGain.connect(this.fxOutput);
            this.fxInput.connect(slap); slap.connect(slapFb); slapFb.connect(slap);
            slap.connect(convolver); this.fxInput.connect(convolver);
            convolver.connect(wetGain); wetGain.connect(this.fxOutput);
            
            this._fxNodes = [convolver, slap, slapFb, wetGain, dryGain];

        } else if (effectName === 'empty_room') {
            // ── EMPTY ROOM v3 (Short Convolution) ──
            const convolver = this._createConvolver(0.8, 5.0);
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.4;
            const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.9;
            this.fxInput.connect(dryGain); dryGain.connect(this.fxOutput);
            this.fxInput.connect(convolver); convolver.connect(wetGain); wetGain.connect(this.fxOutput);
            this._fxNodes = [convolver, wetGain, dryGain];

        } else if (effectName === 'alien') {
            // ── ALIEN OVERLORD v3 (8D Panner + Ringmod + Chorus) ──
            const rm = this._createRingMod(this.fxInput, 12, 0.85);
            const chorus = this._createChorus(rm.output, 0.35, 0.008, 0.65);
            const panner = this._createAutoPanner(0.15, 4); // Slow 8D swirl
            chorus.output.connect(panner.output); panner.output.connect(this.fxOutput);
            this._fxNodes = [...rm.nodes, ...chorus.nodes, ...panner.nodes];

        } else if (effectName === 'dream') {
            // ── LUCID DREAM v3 (8D Panner + Convolution) ──
            const convolver = this._createConvolver(3.0, 2.0);
            const panner = this._createAutoPanner(0.08, 5); // Very slow 8D swirl
            const wetGain = this.ctx.createGain(); wetGain.gain.value = 0.6;
            
            this.fxInput.connect(panner.output); panner.output.connect(this.fxOutput);
            panner.output.connect(convolver); convolver.connect(wetGain); wetGain.connect(this.fxOutput);
            this._fxNodes = [convolver, wetGain, ...panner.nodes];

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
            rm.output.connect(lpRoll); lpRoll.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, bc, bc2, srComb, srFb, lpRoll, ...rm.nodes];

        } else if (effectName === 'witness') {
            // ── WITNESS PROTECTION v3 (Pitch Down + Scramble + Room IR) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.7); // Deep voice
            const rm1 = this._createRingMod(pitch.output, 127, 0.7);
            const rm2 = this._createRingMod(rm1.output, 73, 0.5);
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(5);
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(20);
            const convolver = this._createConvolver(0.3, 5.0); // Interview room
            
            rm2.output.connect(bc); bc.connect(lp); lp.connect(ws); ws.connect(convolver); convolver.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, ...rm1.nodes, ...rm2.nodes, bc, lp, ws, convolver];

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
            } catch (e) {}
            
            this.fxInput.connect(ws); ws.connect(signalGain);
            signalGain.connect(bp1); signalGain.connect(bp2);
            bp1.connect(this.fxOutput); bp2.connect(this.fxOutput);
            noiseGain.connect(panner.output); panner.output.connect(bp1); panner.output.connect(this.fxOutput);
            
            this._fxNodes = [ws, bp1, bp2, dropoutOsc, dropoutGain, signalGain, noiseGain, ...panner.nodes];
            if (noiseSrc) this._fxNodes.push(noiseSrc);

        } else if (effectName === 'cyberpunk') {
            // ── CYBERPUNK SYNTH v3 (Bitcrush + Ring Buzz + Pumping Delays) ──
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(5);
            const midScoop = this.ctx.createBiquadFilter(); midScoop.type = 'peaking'; midScoop.frequency.value = 800; midScoop.Q.value = 1.5; midScoop.gain.value = -8;
            const highPres = this.ctx.createBiquadFilter(); highPres.type = 'peaking'; highPres.frequency.value = 3500; highPres.Q.value = 1.5; highPres.gain.value = 7;
            const rm = this._createRingMod(highPres, 220, 0.35);
            const d1 = this.ctx.createDelay(); d1.delayTime.value = 0.125;
            const d2 = this.ctx.createDelay(); d2.delayTime.value = 0.1875;
            const fb1 = this.ctx.createGain(); fb1.gain.value = 0.45;
            const fb2 = this.ctx.createGain(); fb2.gain.value = 0.35;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(50);
            
            const pumpLfo = this.ctx.createOscillator(); pumpLfo.type = 'triangle'; pumpLfo.frequency.value = 2.0;
            const pumpGain = this.ctx.createGain(); pumpGain.gain.value = 0.15;
            const pumpOut = this.ctx.createGain(); pumpOut.gain.value = 0.85;
            pumpLfo.connect(pumpGain); pumpGain.connect(pumpOut.gain); pumpLfo.start();
            
            this.fxInput.connect(bc); bc.connect(midScoop); midScoop.connect(highPres);
            rm.output.connect(ws);
            ws.connect(d1); d1.connect(fb1); fb1.connect(ws); d1.connect(pumpOut);
            ws.connect(d2); d2.connect(fb2); fb2.connect(ws); d2.connect(pumpOut);
            rm.output.connect(pumpOut);
            pumpOut.connect(this.fxOutput);
            
            this._fxNodes = [bc, midScoop, highPres, ...rm.nodes, d1, d2, fb1, fb2, ws, pumpLfo, pumpGain, pumpOut];

        } else if (effectName === 'sulfux') {
            // ── SULFUR HEXAFLUORIDE v3 (Pitch Drop + Sub Formants + Chorus + Room) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.3); // Insanely deep
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 700; lp1.Q.value = 1.5;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 100; f1.Q.value = 3.0; f1.gain.value = 14;
            const f2 = this.ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 250; f2.Q.value = 2.0; f2.gain.value = 8;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(30);
            const chorus = this._createChorus(ws, 0.6, 0.005, 0.25);
            const convolver = this._createConvolver(1.0, 3.0); // dense heavy room
            
            pitch.output.connect(lp1); lp1.connect(f1); f1.connect(f2); f2.connect(ws);
            chorus.output.connect(convolver); convolver.connect(this.fxOutput);
            
            this._fxNodes = [...pitch.nodes, lp1, f1, f2, ws, convolver, ...chorus.nodes];

        } else if (effectName === 'far_away') {
            // ── FAR AWAY v3 (Distant Convolver + Bandpass + Multi-echo) ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 800; hp.Q.value = 0.5;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000; lp.Q.value = 0.5;
            const distLP = this.ctx.createBiquadFilter(); distLP.type = 'lowpass'; distLP.frequency.value = 1000;
            const convolver = this._createConvolver(2.0, 4.0); // distant blurry reverb
            const echo1 = this.ctx.createDelay(); echo1.delayTime.value = 0.08;
            const echo2 = this.ctx.createDelay(); echo2.delayTime.value = 0.22;
            const fb1 = this.ctx.createGain(); fb1.gain.value = 0.35;
            const fb2 = this.ctx.createGain(); fb2.gain.value = 0.2;
            
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(distLP); distLP.connect(convolver);
            convolver.connect(this.fxOutput);
            convolver.connect(echo1); echo1.connect(fb1); fb1.connect(echo1); echo1.connect(this.fxOutput);
            convolver.connect(echo2); echo2.connect(fb2); fb2.connect(echo2); echo2.connect(this.fxOutput);
            
            this._fxNodes = [hp, lp, distLP, convolver, echo1, echo2, fb1, fb2];

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
            
            merge.connect(ws); comb.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [...rm1.nodes, ...rm2.nodes, merge, comb, combFb, combLp, ws];

        } else if (effectName === 'zombie') {
            // ── ZOMBIE v3 (Pitch Drop + Sub EQ + Drag Echo + Convolver) ──
            const pitch = this._createPitchShifter(this.fxInput, 0.6);
            const chorus = this._createChorus(pitch.output, 0.5, 0.025, 0.8);
            const sub = this.ctx.createBiquadFilter(); sub.type = 'peaking'; sub.frequency.value = 80; sub.Q.value = 3.0; sub.gain.value = 8;
            const ws1 = this.ctx.createWaveShaper(); ws1.curve = this._makeDistortionCurve(40);
            
            const dragDelay = this.ctx.createDelay(); dragDelay.delayTime.value = 0.08;
            const dragFb = this.ctx.createGain(); dragFb.gain.value = 0.5;
            const convolver = this._createConvolver(2.0, 1.0); // muddy room
            
            chorus.output.connect(sub); sub.connect(ws1);
            ws1.connect(dragDelay); dragDelay.connect(dragFb); dragFb.connect(dragDelay);
            ws1.connect(convolver); dragDelay.connect(convolver);
            convolver.connect(this.fxOutput);
            
            this._fxNodes = [...pitch.nodes, ...chorus.nodes, sub, ws1, dragDelay, dragFb, convolver];

        } else if (effectName === 'child') {
            // ── CHILD v3 (True Pitch Up + Vocal Tract Formants) ──
            const pitch = this._createPitchShifter(this.fxInput, 1.6);
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 700; hp.Q.value = 0.8;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 2000; f1.Q.value = 2.0; f1.gain.value = 7;
            const f2 = this.ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 3500; f2.Q.value = 1.8; f2.gain.value = 5;
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -28; comp.ratio.value = 5; comp.attack.value = 0.002; comp.release.value = 0.08;
            
            pitch.output.connect(hp); hp.connect(f1); f1.connect(f2); f2.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [...pitch.nodes, hp, f1, f2, comp];

        } else if (effectName === 'mask') {
            // ── MASK v3 (Boxy Mid + Nasal Boost + Muffled Lowpass) ──
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 2000; lp1.Q.value = 0.7;
            const lp2 = this.ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 1500; lp2.Q.value = 0.7;
            const boxMid = this.ctx.createBiquadFilter(); boxMid.type = 'peaking'; boxMid.frequency.value = 350; boxMid.Q.value = 1.5; boxMid.gain.value = 5;
            const nasal = this.ctx.createBiquadFilter(); nasal.type = 'peaking'; nasal.frequency.value = 700; nasal.Q.value = 2.0; nasal.gain.value = 3;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(5);
            
            this.fxInput.connect(lp1); lp1.connect(lp2); lp2.connect(boxMid); boxMid.connect(nasal); nasal.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [lp1, lp2, boxMid, nasal, ws];

        } else if (effectName === 'helmet') {
            // ── HELMET v3 (Short Convolver + Resonant Comb + Slapback) ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4000;
            const res = this.ctx.createBiquadFilter(); res.type = 'peaking'; res.frequency.value = 900; res.Q.value = 5.0; res.gain.value = 6;
            const convolver = this._createConvolver(0.05, 10.0); // very short metal enclosure
            
            const comb = this.ctx.createDelay(); comb.delayTime.value = 0.008;
            const combFb = this.ctx.createGain(); combFb.gain.value = 0.55;
            const slap = this.ctx.createDelay(); slap.delayTime.value = 0.025;
            const slapGain = this.ctx.createGain(); slapGain.gain.value = 0.45;
            
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(res); res.connect(convolver);
            
            convolver.connect(this.fxOutput);
            convolver.connect(comb); comb.connect(combFb); combFb.connect(comb); comb.connect(this.fxOutput);
            convolver.connect(slap); slap.connect(slapGain); slapGain.connect(this.fxOutput);
            
            this._fxNodes = [hp, lp, res, convolver, comb, combFb, slap, slapGain];
        } else if (effectName === 'ghost') {
            // ── GHOST v3 (8D Panner + Multi-voice chorus + Shimmer + Convolver) ──
            const chorus = this._createChorus(this.fxInput, 0.35, 0.012, 0.7);
            const convolver = this._createConvolver(4.0, 1.5);
            const panner = this._createAutoPanner(0.1, 5); // slow orbit
            const shimmer = this.ctx.createBiquadFilter(); shimmer.type = 'highshelf'; shimmer.frequency.value = 8000; shimmer.gain.value = 5;
            
            chorus.output.connect(convolver);
            convolver.connect(shimmer); shimmer.connect(panner.output); panner.output.connect(this.fxOutput);
            this._fxNodes = [...chorus.nodes, convolver, shimmer, ...panner.nodes];
            
        } else if (effectName === 'rain') {
            // ── RAIN v3 (Pink Noise + Crackle + Thunder) ──
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.18;
            const crackleGain = this.ctx.createGain(); crackleGain.gain.value = 0.4;
            let noiseSrc = null, crackleSrc = null, thunderSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 2), this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
                
                crackleSrc = this.ctx.createBufferSource(); crackleSrc.buffer = this._createCrackleBuffer(); crackleSrc.loop = true; crackleSrc.connect(crackleGain); crackleSrc.start();
                
                thunderSrc = this.ctx.createBufferSource();
                const bt = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 2), this.ctx.sampleRate);
                const dt = bt.getChannelData(0); for (let i = 0; i < dt.length; i++) dt[i] = Math.random() * 2 - 1;
                thunderSrc.buffer = bt; thunderSrc.loop = true;
            } catch (e) {}
            
            const pinkLp = this.ctx.createBiquadFilter(); pinkLp.type = 'lowpass'; pinkLp.frequency.value = 4000;
            const pinkHp = this.ctx.createBiquadFilter(); pinkHp.type = 'highpass'; pinkHp.frequency.value = 100;
            const thunderGain = this.ctx.createGain(); thunderGain.gain.value = 0.06;
            const thunderBp = this.ctx.createBiquadFilter(); thunderBp.type = 'lowpass'; thunderBp.frequency.value = 150;
            const thunderLfo = this.ctx.createOscillator(); thunderLfo.type = 'sine'; thunderLfo.frequency.value = 0.05;
            
            if (thunderSrc) { thunderSrc.connect(thunderGain); thunderSrc.start(); }
            thunderLfo.connect(thunderGain.gain); thunderLfo.start();
            
            this.fxInput.connect(this.fxOutput);
            noiseGain.connect(pinkLp); pinkLp.connect(pinkHp); pinkHp.connect(this.fxOutput);
            crackleGain.connect(this.fxOutput);
            thunderGain.connect(thunderBp); thunderBp.connect(this.fxOutput);
            
            this._fxNodes = [noiseGain, crackleGain, pinkLp, pinkHp, thunderLfo, thunderGain, thunderBp];
            if (noiseSrc) this._fxNodes.push(noiseSrc);
            if (crackleSrc) this._fxNodes.push(crackleSrc);
            if (thunderSrc) this._fxNodes.push(thunderSrc);

        } else if (effectName === 'forest') {
            // ── FOREST v3 (Wind + Insects + Birds + Ambience Convolver) ──
            const convolver = this._createConvolver(2.0, 3.0);
            const windGain = this.ctx.createGain(); windGain.gain.value = 0.07;
            const windLp = this.ctx.createBiquadFilter(); windLp.type = 'bandpass'; windLp.frequency.value = 500; windLp.Q.value = 0.4;
            
            let windSrc = null;
            try {
                windSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 2), this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                windSrc.buffer = b; windSrc.loop = true; windSrc.connect(windGain); windSrc.start();
            } catch (e) {}
            
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
            
            this.fxInput.connect(this.fxOutput);
            windGain.connect(windLp); windLp.connect(this.fxOutput);
            insectGain.connect(this.fxOutput);
            chirpVca.connect(convolver); convolver.connect(this.fxOutput);
            chirpVca.connect(this.fxOutput);
            
            this._fxNodes = [convolver, windGain, windLp, insectOsc, insectGain, insectLfo, insectLfoG, chirpOsc, chirpLfo, chirpLfoG, chirpVca];
            if (windSrc) this._fxNodes.push(windSrc);

        } else if (effectName === 'cave') {
            // ── CAVE v3 (Massive Convolution Reverb) ──
            const convolver = this._createConvolver(6.0, 1.0); // 6s tail
            const preLp = this.ctx.createBiquadFilter(); preLp.type = 'lowpass'; preLp.frequency.value = 3000;
            const stone = this.ctx.createBiquadFilter(); stone.type = 'peaking'; stone.frequency.value = 300; stone.Q.value = 4.0; stone.gain.value = 4;
            
            this.fxInput.connect(preLp); preLp.connect(stone);
            stone.connect(this.fxOutput); // Dry
            stone.connect(convolver); convolver.connect(this.fxOutput); // Wet
            
            this._fxNodes = [convolver, preLp, stone];
        } else {
            // None — bypass
            this.fxInput.connect(this.fxOutput);
        }
    }
};
