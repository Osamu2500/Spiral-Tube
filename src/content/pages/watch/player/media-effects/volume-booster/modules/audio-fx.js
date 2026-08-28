/**
 * Audio FX Module (Mixin)
 * Handles Voice FX (Adam, Vinyl, Chipmunk, Demonic, Ethereal, Telephone, etc.).
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
        const length = sampleRate * 2; // 2 seconds
        const buffer = this.ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            // Subtle white noise
            let val = (Math.random() * 2 - 1) * 0.02;
            // Occasional loud crackles
            if (Math.random() < 0.003) val += (Math.random() * 2 - 1) * 0.4;
            // Very rare pop
            if (Math.random() < 0.0001) val += (Math.random() * 2 - 1) * 0.9;
            data[i] = val;
        }
        return buffer;
    },

    _createHumBuffer(freq) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * 1; // 1 second loop
        const buffer = this.ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            // Fundamental hum + some harmonics for analogue tape feel
            data[i] = (Math.sin(2 * Math.PI * freq * t) * 0.5) +
                      (Math.sin(2 * Math.PI * (freq * 2) * t) * 0.2) +
                      (Math.sin(2 * Math.PI * (freq * 3) * t) * 0.1);
        }
        return buffer;
    },

    _createChorus(inputNode, speed = 1.5, depth = 0.002, mix = 0.5) {
        const delay = this.ctx.createDelay();
        delay.delayTime.value = 0.02; // 20ms base delay
        
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = speed;
        
        const depthGain = this.ctx.createGain();
        depthGain.gain.value = depth;
        
        osc.connect(depthGain);
        depthGain.connect(delay.delayTime);
        osc.start();
        
        const dryGain = this.ctx.createGain();
        dryGain.gain.value = 1.0 - mix;
        
        const wetGain = this.ctx.createGain();
        wetGain.gain.value = mix;
        
        inputNode.connect(dryGain);
        inputNode.connect(delay);
        delay.connect(wetGain);
        
        const outputNode = this.ctx.createGain();
        dryGain.connect(outputNode);
        wetGain.connect(outputNode);
        
        return { output: outputNode, nodes: [delay, osc, depthGain, dryGain, wetGain, outputNode] };
    },

    _createRingMod(inputNode, freq = 50, mix = 1.0) {
        // To do true ring modulation we need to multiply the signal with a sine wave.
        // Web Audio API doesn't have a multiplier node, but a GainNode's gain param can be audio-rate modulated!
        const rmNode = this.ctx.createGain();
        rmNode.gain.value = 0; // The oscillator will swing it between -1 and 1
        
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(rmNode.gain);
        osc.start();
        
        const dryGain = this.ctx.createGain();
        dryGain.gain.value = 1.0 - mix;
        
        const wetGain = this.ctx.createGain();
        wetGain.gain.value = mix;
        
        inputNode.connect(dryGain);
        inputNode.connect(rmNode);
        rmNode.connect(wetGain);
        
        const outputNode = this.ctx.createGain();
        dryGain.connect(outputNode);
        wetGain.connect(outputNode);
        
        return { output: outputNode, nodes: [rmNode, osc, dryGain, wetGain, outputNode] };
    },

    setFX(effectName) {
        this._activeFX = effectName;
        window.YPP?.Utils?.saveSettings({ volumeActiveEffect: effectName });
        
        if (this._proxyCmd('setFX', effectName)) return;
        if (!this._audioConnected || !this.fxInput) return;
        
        // Reset routing
        this.fxInput.disconnect();
        this._cleanupFX();

        if (effectName === 'radio') {
            // Megaphone / Radio (Bandpass + Hard Distortion)
            const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1000; bp.Q.value = 0.5;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(100); ws.oversample = '4x';
            this.fxInput.connect(bp); bp.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [bp, ws];
            
        } else if (effectName === 'underwater') {
            // Underwater (Steep Lowpass + LFO on frequency)
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400;
            const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.2;
            const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 200;
            lfo.connect(lfoGain); lfoGain.connect(lp.frequency);
            this.fxInput.connect(lp); lp.connect(this.fxOutput); lfo.start();
            this._fxNodes = [lp, lfo, lfoGain];
            
        } else if (effectName === 'vinyl') {
            // Leveled Up Vinyl Lo-Fi (Bandpass + Crackle + Hum + Saturation + Wow/Flutter)
            const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 0.8;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(18);
            
            // Wow and flutter using delay modulated by an LFO
            const wowDelay = this.ctx.createDelay(); wowDelay.delayTime.value = 0.03;
            const wowLfo = this.ctx.createOscillator(); wowLfo.type = 'sine'; wowLfo.frequency.value = 0.33; // 33 RPM
            const wowGain = this.ctx.createGain(); wowGain.gain.value = 0.002;
            wowLfo.connect(wowGain); wowGain.connect(wowDelay.delayTime);
            wowLfo.start();
            
            const crackleGain = this.ctx.createGain(); crackleGain.gain.value = 0.18;
            const humGain = this.ctx.createGain(); humGain.gain.value = 0.08;
            
            let crackleSrc = null, humSrc = null;
            try {
                crackleSrc = this.ctx.createBufferSource(); crackleSrc.buffer = this._createCrackleBuffer();
                crackleSrc.loop = true; crackleSrc.connect(crackleGain); crackleSrc.start();
                
                humSrc = this.ctx.createBufferSource(); humSrc.buffer = this._createHumBuffer(60);
                humSrc.loop = true; humSrc.connect(humGain); humSrc.start();
            } catch(e) {}
            
            this.fxInput.connect(bp); bp.connect(ws); ws.connect(wowDelay);
            wowDelay.connect(this.fxOutput);
            crackleGain.connect(this.fxOutput); humGain.connect(this.fxOutput);
            
            this._fxNodes = [bp, ws, wowDelay, wowLfo, wowGain, crackleGain, humGain];
            if (crackleSrc) this._fxNodes.push(crackleSrc);
            if (humSrc) this._fxNodes.push(humSrc);
            
        } else if (effectName === 'adam') {
            // Leveled Up "Adam" AI Narrator (Broadcast EQ + Exciter + Aggressive Comp + Saturation)
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 90;
            const lowshelf = this.ctx.createBiquadFilter(); lowshelf.type = 'lowshelf'; lowshelf.frequency.value = 150; lowshelf.gain.value = 5.0;
            const dip = this.ctx.createBiquadFilter(); dip.type = 'peaking'; dip.frequency.value = 500; dip.Q.value = 1.2; dip.gain.value = -3.0;
            const presence = this.ctx.createBiquadFilter(); presence.type = 'highshelf'; presence.frequency.value = 4000; presence.gain.value = 6.0;
            
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(10);
            const chorus = this._createChorus(presence, 1.5, 0.002, 0.2); 
            
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -40; comp.ratio.value = 8; comp.attack.value = 0.002; comp.release.value = 0.15;
            const makeup = this.ctx.createGain(); makeup.gain.value = 4.5;
            
            this.fxInput.connect(hp); hp.connect(lowshelf); lowshelf.connect(dip); dip.connect(presence);
            chorus.output.connect(ws); ws.connect(comp); comp.connect(makeup); makeup.connect(this.fxOutput);
            
            this._fxNodes = [hp, lowshelf, dip, presence, ws, comp, makeup, ...chorus.nodes];
            
        } else if (effectName === 'chipmunk') {
            // Faux Chipmunk (Highpass + Saturation)
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(30);
            this.fxInput.connect(hp); hp.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [hp, ws];
            
        } else if (effectName === 'deep') {
            // Faux Deep Voice
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 800;
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.03; 
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(50);
            this.fxInput.connect(lp); lp.connect(ws); ws.connect(this.fxOutput); ws.connect(delay); delay.connect(this.fxOutput);
            this._fxNodes = [lp, ws, delay];
            
        } else if (effectName === 'demonic') {
            // Demonic
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(60);
            const wobbleDelay = this.ctx.createDelay(); wobbleDelay.delayTime.value = 0.05; 
            const wobbleLfo = this.ctx.createOscillator(); wobbleLfo.type = 'sine'; wobbleLfo.frequency.value = 0.1; 
            const wobbleGain = this.ctx.createGain(); wobbleGain.gain.value = 0.005; 
            wobbleLfo.connect(wobbleGain); wobbleGain.connect(wobbleDelay.delayTime);
            this.fxInput.connect(lp); lp.connect(ws); ws.connect(wobbleDelay); wobbleDelay.connect(this.fxOutput); wobbleLfo.start();
            this._fxNodes = [lp, ws, wobbleDelay, wobbleLfo, wobbleGain];
            
        } else if (effectName === 'ethereal') {
            // Ethereal
            const delay1 = this.ctx.createDelay(); delay1.delayTime.value = 0.4;
            const fb1 = this.ctx.createGain(); fb1.gain.value = 0.6;
            const delay2 = this.ctx.createDelay(); delay2.delayTime.value = 0.7;
            const fb2 = this.ctx.createGain(); fb2.gain.value = 0.5;
            this.fxInput.connect(this.fxOutput);
            this.fxInput.connect(delay1); delay1.connect(fb1); fb1.connect(delay1); delay1.connect(this.fxOutput);
            this.fxInput.connect(delay2); delay2.connect(fb2); fb2.connect(delay2); delay2.connect(this.fxOutput);
            this._fxNodes = [delay1, fb1, delay2, fb2];
            
        } else if (effectName === 'telephone') {
            // Telephone
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(100);
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [hp, lp, ws];
            
        } else if (effectName === 'vader') {
            // Darth Vader (Deep RingMod + Distortion + Comb Filter Reverb)
            const rm = this._createRingMod(this.fxInput, 35, 0.8);
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 800;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(40);
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.025;
            const fb = this.ctx.createGain(); fb.gain.value = 0.5;
            
            rm.output.connect(ws); ws.connect(lp);
            lp.connect(delay); delay.connect(fb); fb.connect(delay);
            delay.connect(this.fxOutput); lp.connect(this.fxOutput);
            
            this._fxNodes = [...rm.nodes, lp, ws, delay, fb];
            
        } else if (effectName === 'robot') {
            // Robot / Dalek (50Hz RingMod + Hard Clipping)
            const rm = this._createRingMod(this.fxInput, 50, 1.0);
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(80);
            rm.output.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [...rm.nodes, ws];
            
        } else if (effectName === 'astronaut') {
            // Astronaut / Space Comms (Telephone + White Noise + Slapback Delay)
            const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 2.0;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(50);
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.15;
            const delayGain = this.ctx.createGain(); delayGain.gain.value = 0.3;
            
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.05;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
                const d = b.getChannelData(0);
                for(let i=0; i<d.length; i++) d[i] = Math.random()*2-1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch(e){}
            
            this.fxInput.connect(bp); bp.connect(ws);
            ws.connect(this.fxOutput);
            ws.connect(delay); delay.connect(delayGain); delayGain.connect(this.fxOutput);
            noiseGain.connect(this.fxOutput);
            
            this._fxNodes = [bp, ws, delay, delayGain, noiseGain];
            if (noiseSrc) this._fxNodes.push(noiseSrc);
            
        } else if (effectName === '8bit') {
            // 8-Bit Retro (Bitcrusher)
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(4);
            this.fxInput.connect(bc); bc.connect(this.fxOutput);
            this._fxNodes = [bc];
            
        } else if (effectName === 'cathedral') {
            // Cathedral (Massive lush reverb via multiple delays)
            const fb = this.ctx.createGain(); fb.gain.value = 0.8; 
            const mixer = this.ctx.createGain(); mixer.gain.value = 0.4;
            this.fxInput.connect(this.fxOutput); 
            this._fxNodes = [fb, mixer];
            [0.073, 0.111, 0.137, 0.173].forEach(d => {
                const del = this.ctx.createDelay(); del.delayTime.value = d;
                this.fxInput.connect(del); del.connect(fb); fb.connect(del); del.connect(mixer);
                this._fxNodes.push(del);
            });
            mixer.connect(this.fxOutput);
            
        } else if (effectName === 'witness') {
            // Witness Protection (RingMod Scrambler + Bitcrush)
            const rm = this._createRingMod(this.fxInput, 150, 1.0);
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(5);
            rm.output.connect(bc); bc.connect(this.fxOutput);
            this._fxNodes = [...rm.nodes, bc];
            
        } else if (effectName === 'tv_static') {
            // TV Static (White noise + bandpass filtering)
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.25;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
                const d = b.getChannelData(0);
                for(let i=0; i<d.length; i++) d[i] = Math.random()*2-1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch(e){}
            
            const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4000; bp.Q.value = 1.0;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(30);
            
            this.fxInput.connect(ws); ws.connect(bp); bp.connect(this.fxOutput);
            noiseGain.connect(this.fxOutput);
            
            this._fxNodes = [bp, ws, noiseGain];
            if (noiseSrc) this._fxNodes.push(noiseSrc);
            
        } else if (effectName === 'stadium') {
            // Stadium Announcer (Loud, massive slapback echo + reverb)
            const bp = this.ctx.createBiquadFilter(); bp.type = 'peaking'; bp.frequency.value = 3000; bp.Q.value = 1.0; bp.gain.value = 5.0;
            const delay1 = this.ctx.createDelay(); delay1.delayTime.value = 0.12;
            const fb1 = this.ctx.createGain(); fb1.gain.value = 0.4;
            const delay2 = this.ctx.createDelay(); delay2.delayTime.value = 0.25;
            const fb2 = this.ctx.createGain(); fb2.gain.value = 0.3;
            
            this.fxInput.connect(bp); bp.connect(this.fxOutput);
            bp.connect(delay1); delay1.connect(fb1); fb1.connect(delay1); delay1.connect(this.fxOutput);
            bp.connect(delay2); delay2.connect(fb2); fb2.connect(delay2); delay2.connect(this.fxOutput);
            
            this._fxNodes = [bp, delay1, fb1, delay2, fb2];
            
        } else if (effectName === 'alien') {
            // Alien Overlord (Slow RingMod + Deep Flanger/Chorus)
            const rm = this._createRingMod(this.fxInput, 15, 0.9);
            const chorus = this._createChorus(rm.output, 0.5, 0.005, 0.7);
            const eq = this.ctx.createBiquadFilter(); eq.type = 'lowpass'; eq.frequency.value = 1200;
            
            chorus.output.connect(eq); eq.connect(this.fxOutput);
            
            this._fxNodes = [...rm.nodes, ...chorus.nodes, eq];
            
        } else if (effectName === 'dream') {
            // Lucid Dream (Heavy chorus + long blurred delay + lowpass)
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500;
            const chorus = this._createChorus(this.fxInput, 0.2, 0.008, 0.8);
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.4;
            const fb = this.ctx.createGain(); fb.gain.value = 0.6;
            
            chorus.output.connect(lp);
            lp.connect(this.fxOutput);
            lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(this.fxOutput);
            
            this._fxNodes = [...chorus.nodes, lp, delay, fb];
            
        } else if (effectName === 'cyberpunk') {
            // Cyberpunk Synth (Bitcrush + syncopated delays + robotic EQ)
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(6);
            const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2500; bp.Q.value = 3.0;
            
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.125;
            const fb = this.ctx.createGain(); fb.gain.value = 0.4;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(40);
            
            this.fxInput.connect(bc); bc.connect(bp); bp.connect(this.fxOutput);
            bp.connect(delay); delay.connect(fb); fb.connect(ws); ws.connect(delay); delay.connect(this.fxOutput);
            
            this._fxNodes = [bc, bp, delay, fb, ws];
            
        } else {
            // None
            this.fxInput.connect(this.fxOutput);
        }
    }
};
