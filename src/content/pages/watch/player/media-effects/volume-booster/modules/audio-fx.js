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
            
        } else if (effectName === 'helium') {
            // Helium (Formant Pitch Up approximation: highpass + extreme high peaking)
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 800;
            const pk = this.ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 3500; pk.Q.value = 2.0; pk.gain.value = 10;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(10);
            this.fxInput.connect(hp); hp.connect(pk); pk.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [hp, pk, ws];
            
        } else if (effectName === 'sulfux') {
            // Sulfux (Formant Pitch Down approximation: steep lowpass + low peaking)
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 800;
            const pk = this.ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 150; pk.Q.value = 2.0; pk.gain.value = 12;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(20);
            this.fxInput.connect(lp); lp.connect(pk); pk.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [lp, pk, ws];

        } else if (effectName === 'far_away') {
            // Far Away (Thin bandpass + delay + low volume)
            const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2000; bp.Q.value = 1.0;
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.05;
            const gain = this.ctx.createGain(); gain.gain.value = 0.2;
            this.fxInput.connect(bp); bp.connect(delay); delay.connect(gain); gain.connect(this.fxOutput);
            this._fxNodes = [bp, delay, gain];

        } else if (effectName === 'whisper') {
            // Whisper (Heavy saturation + bandpass to extract breathy textures)
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(150); ws.oversample = '4x';
            const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4000; bp.Q.value = 0.5;
            const gain = this.ctx.createGain(); gain.gain.value = 2.0;
            this.fxInput.connect(ws); ws.connect(bp); bp.connect(gain); gain.connect(this.fxOutput);
            this._fxNodes = [ws, bp, gain];

        } else if (effectName === 'autotune') {
            // Auto-Tune / Vocoder approx (Ring modulation + fast slapback comb filter)
            const rm = this._createRingMod(this.fxInput, 180, 0.5); // Fixed pitch
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.01; // 10ms for comb filter effect
            const fb = this.ctx.createGain(); fb.gain.value = 0.8;
            rm.output.connect(delay); delay.connect(fb); fb.connect(delay);
            rm.output.connect(this.fxOutput); delay.connect(this.fxOutput);
            this._fxNodes = [...rm.nodes, delay, fb];

        } else if (effectName === 'zombie') {
            // Zombie (Slow chorus + heavy low end + distortion)
            const chorus = this._createChorus(this.fxInput, 0.8, 0.02, 1.0);
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(50);
            chorus.output.connect(lp); lp.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [...chorus.nodes, lp, ws];

        } else if (effectName === 'child') {
            // Child (Highpass + peaking in high-mids)
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 600;
            const pk = this.ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 2500; pk.Q.value = 1.5; pk.gain.value = 8;
            this.fxInput.connect(hp); hp.connect(pk); pk.connect(this.fxOutput);
            this._fxNodes = [hp, pk];

        } else if (effectName === 'mask') {
            // Mask (Muffled lowpass + slight lower-mid boost)
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1200;
            const pk = this.ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 300; pk.Q.value = 1.0; pk.gain.value = 4;
            this.fxInput.connect(lp); lp.connect(pk); pk.connect(this.fxOutput);
            this._fxNodes = [lp, pk];

        } else if (effectName === 'helmet') {
            // Helmet (Bandpass + short slapback)
            const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1000; bp.Q.value = 1.0;
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.015;
            const fb = this.ctx.createGain(); fb.gain.value = 0.5;
            this.fxInput.connect(bp); bp.connect(this.fxOutput);
            bp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(this.fxOutput);
            this._fxNodes = [bp, delay, fb];

        } else if (effectName === 'empty_room') {
            // Empty Room (Short reverb via delays)
            const delay1 = this.ctx.createDelay(); delay1.delayTime.value = 0.04;
            const delay2 = this.ctx.createDelay(); delay2.delayTime.value = 0.07;
            const fb = this.ctx.createGain(); fb.gain.value = 0.4;
            const mix = this.ctx.createGain(); mix.gain.value = 0.5;
            this.fxInput.connect(this.fxOutput);
            this.fxInput.connect(delay1); delay1.connect(fb); fb.connect(delay2); delay2.connect(fb);
            delay1.connect(mix); delay2.connect(mix); mix.connect(this.fxOutput);
            this._fxNodes = [delay1, delay2, fb, mix];

        } else if (effectName === 'ghost') {
            // Ghost (Reverse-like delay wobble + ethereal chorus)
            const chorus = this._createChorus(this.fxInput, 0.4, 0.01, 0.8);
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.3;
            const fb = this.ctx.createGain(); fb.gain.value = 0.7;
            const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.5;
            const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 0.05;
            lfo.connect(lfoGain); lfoGain.connect(delay.delayTime); lfo.start();
            chorus.output.connect(this.fxOutput);
            chorus.output.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(this.fxOutput);
            this._fxNodes = [...chorus.nodes, delay, fb, lfo, lfoGain];

        } else if (effectName === 'rain') {
            // Rain (White/Pink noise + crackle)
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.1;
            const crackleGain = this.ctx.createGain(); crackleGain.gain.value = 0.3;
            let noiseSrc = null, crackleSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
                const d = b.getChannelData(0);
                for(let i=0; i<d.length; i++) d[i] = Math.random()*2-1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
                
                crackleSrc = this.ctx.createBufferSource(); crackleSrc.buffer = this._createCrackleBuffer();
                crackleSrc.loop = true; crackleSrc.connect(crackleGain); crackleSrc.start();
            } catch(e){}
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000;
            this.fxInput.connect(this.fxOutput);
            noiseGain.connect(lp); crackleGain.connect(lp); lp.connect(this.fxOutput);
            this._fxNodes = [noiseGain, crackleGain, lp];
            if (noiseSrc) this._fxNodes.push(noiseSrc);
            if (crackleSrc) this._fxNodes.push(crackleSrc);

        } else if (effectName === 'forest') {
            // Forest (Wind noise + chirps)
            const windGain = this.ctx.createGain(); windGain.gain.value = 0.05;
            let windSrc = null;
            try {
                windSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
                const d = b.getChannelData(0);
                for(let i=0; i<d.length; i++) d[i] = Math.random()*2-1;
                windSrc.buffer = b; windSrc.loop = true; windSrc.connect(windGain); windSrc.start();
            } catch(e){}
            const windLp = this.ctx.createBiquadFilter(); windLp.type = 'lowpass'; windLp.frequency.value = 800;
            
            const chirpOsc = this.ctx.createOscillator(); chirpOsc.type = 'sine'; chirpOsc.frequency.value = 4000;
            const chirpLfo = this.ctx.createOscillator(); chirpLfo.type = 'square'; chirpLfo.frequency.value = 0.5;
            const chirpLfoGain = this.ctx.createGain(); chirpLfoGain.gain.value = 1000;
            chirpLfo.connect(chirpLfoGain); chirpLfoGain.connect(chirpOsc.frequency);
            const chirpVca = this.ctx.createGain(); chirpVca.gain.value = 0.02;
            chirpOsc.connect(chirpVca); chirpOsc.start(); chirpLfo.start();

            this.fxInput.connect(this.fxOutput);
            windGain.connect(windLp); windLp.connect(this.fxOutput);
            chirpVca.connect(this.fxOutput);
            this._fxNodes = [windGain, windLp, chirpOsc, chirpLfo, chirpLfoGain, chirpVca];
            if (windSrc) this._fxNodes.push(windSrc);

        } else if (effectName === 'cave') {
            // Cave (Long delay + reverb-like feedback + lowpass)
            const delay = this.ctx.createDelay(); delay.delayTime.value = 0.6;
            const fb = this.ctx.createGain(); fb.gain.value = 0.55;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1000;
            this.fxInput.connect(this.fxOutput);
            this.fxInput.connect(delay); delay.connect(fb); fb.connect(delay);
            delay.connect(lp); lp.connect(this.fxOutput);
            this._fxNodes = [delay, fb, lp];

        } else {
            // None
            this.fxInput.connect(this.fxOutput);
        }
    }
};
