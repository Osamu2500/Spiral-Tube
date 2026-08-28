/**
 * Audio FX Module (Mixin)
 * Handles Voice FX — all effects leveled up with richer Web Audio API chains.
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
        const length = sampleRate * 3;
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
        const length = sampleRate * 1;
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

    /** Dual-voice chorus for a richer, fuller sound */
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
            // ── MEGAPHONE v2 ──
            const inputSat = this.ctx.createWaveShaper(); inputSat.curve = this._makeDistortionCurve(30); inputSat.oversample = '4x';
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500; hp.Q.value = 1.2;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000; lp.Q.value = 1.2;
            const mid = this.ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 1500; mid.Q.value = 1.5; mid.gain.value = 6;
            const hardClip = this.ctx.createWaveShaper(); hardClip.curve = this._makeDistortionCurve(120); hardClip.oversample = '4x';
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.015;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch (e) {}
            this.fxInput.connect(inputSat); inputSat.connect(hp); hp.connect(mid); mid.connect(lp); lp.connect(hardClip); hardClip.connect(this.fxOutput);
            noiseGain.connect(this.fxOutput);
            this._fxNodes = [inputSat, hp, lp, mid, hardClip, noiseGain];
            if (noiseSrc) this._fxNodes.push(noiseSrc);

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
            // ── ADAM (TikTok AI Narrator) v2 ── Pristine broadcast chain
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 80; hp.Q.value = 0.7;
            const lowShelf = this.ctx.createBiquadFilter(); lowShelf.type = 'lowshelf'; lowShelf.frequency.value = 120; lowShelf.gain.value = 4;
            const boxDip = this.ctx.createBiquadFilter(); boxDip.type = 'peaking'; boxDip.frequency.value = 400; boxDip.Q.value = 1.5; boxDip.gain.value = -4;
            const presence = this.ctx.createBiquadFilter(); presence.type = 'peaking'; presence.frequency.value = 3500; presence.Q.value = 1.2; presence.gain.value = 7;
            const airShelf = this.ctx.createBiquadFilter(); airShelf.type = 'highshelf'; airShelf.frequency.value = 10000; airShelf.gain.value = 4;
            const chorus = this._createChorus(airShelf, 2.0, 0.0015, 0.15);
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(8);
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -35; comp.ratio.value = 10; comp.attack.value = 0.001; comp.release.value = 0.12; comp.knee.value = 6;
            const limiter = this.ctx.createDynamicsCompressor();
            limiter.threshold.value = -2; limiter.ratio.value = 20; limiter.attack.value = 0.001; limiter.release.value = 0.05;
            const makeup = this.ctx.createGain(); makeup.gain.value = 5.0;
            this.fxInput.connect(hp); hp.connect(lowShelf); lowShelf.connect(boxDip); boxDip.connect(presence); presence.connect(airShelf);
            chorus.output.connect(ws); ws.connect(comp); comp.connect(limiter); limiter.connect(makeup); makeup.connect(this.fxOutput);
            this._fxNodes = [hp, lowShelf, boxDip, presence, airShelf, ws, comp, limiter, makeup, ...chorus.nodes];

        } else if (effectName === 'chipmunk') {
            // ── CHIPMUNK v2 ──
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1000;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 2800; f1.Q.value = 3.0; f1.gain.value = 10;
            const f2 = this.ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 4500; f2.Q.value = 2.5; f2.gain.value = 8;
            const f3 = this.ctx.createBiquadFilter(); f3.type = 'peaking'; f3.frequency.value = 6500; f3.Q.value = 2.0; f3.gain.value = 5;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(25);
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -30; comp.ratio.value = 6; comp.attack.value = 0.001; comp.release.value = 0.05;
            this.fxInput.connect(hp); hp.connect(f1); f1.connect(f2); f2.connect(f3); f3.connect(ws); ws.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [hp, f1, f2, f3, ws, comp];

        } else if (effectName === 'deep') {
            // ── DEEP VOICE v2 ──
            const sub = this.ctx.createBiquadFilter(); sub.type = 'lowshelf'; sub.frequency.value = 200; sub.gain.value = 10;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 1.5;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 120; f1.Q.value = 3.0; f1.gain.value = 8;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(35);
            const chorus = this._createChorus(ws, 0.8, 0.004, 0.3);
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -25; comp.ratio.value = 4; comp.attack.value = 0.005; comp.release.value = 0.2;
            this.fxInput.connect(sub); sub.connect(f1); f1.connect(lp); lp.connect(ws);
            chorus.output.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [sub, lp, f1, ws, comp, ...chorus.nodes];

        } else if (effectName === 'demonic') {
            // ── DEMONIC v2 ──
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; lp.Q.value = 2.0;
            const sub = this.ctx.createBiquadFilter(); sub.type = 'peaking'; sub.frequency.value = 80; sub.Q.value = 2.5; sub.gain.value = 10;
            const rm = this._createRingMod(this.fxInput, 25, 0.7);
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(80); ws.oversample = '4x';
            const wobbleDelay = this.ctx.createDelay(); wobbleDelay.delayTime.value = 0.06;
            const wobbleLfo = this.ctx.createOscillator(); wobbleLfo.type = 'sine'; wobbleLfo.frequency.value = 0.08;
            const wobbleGain = this.ctx.createGain(); wobbleGain.gain.value = 0.008;
            wobbleLfo.connect(wobbleGain); wobbleGain.connect(wobbleDelay.delayTime); wobbleLfo.start();
            const echo = this.ctx.createDelay(); echo.delayTime.value = 0.15;
            const echoFb = this.ctx.createGain(); echoFb.gain.value = 0.4;
            rm.output.connect(lp); lp.connect(sub); sub.connect(ws); ws.connect(wobbleDelay);
            wobbleDelay.connect(this.fxOutput);
            wobbleDelay.connect(echo); echo.connect(echoFb); echoFb.connect(echo); echo.connect(this.fxOutput);
            this._fxNodes = [...rm.nodes, lp, sub, ws, wobbleDelay, wobbleLfo, wobbleGain, echo, echoFb];

        } else if (effectName === 'ethereal') {
            // ── ETHEREAL v2 ── Multi-tap delay matrix + slow chorus + shimmer
            const chorus = this._createChorus(this.fxInput, 0.25, 0.006, 0.4);
            const shimmer = this.ctx.createBiquadFilter(); shimmer.type = 'highshelf'; shimmer.frequency.value = 6000; shimmer.gain.value = 6;
            this.fxInput.connect(this.fxOutput);
            this._fxNodes = [...chorus.nodes, shimmer];
            [0.11, 0.19, 0.28, 0.41, 0.53].forEach((t, i) => {
                const d = this.ctx.createDelay(); d.delayTime.value = t;
                const fb = this.ctx.createGain(); fb.gain.value = 0.65 - i * 0.08;
                const lpFb = this.ctx.createBiquadFilter(); lpFb.type = 'lowpass'; lpFb.frequency.value = 4000 - i * 400;
                chorus.output.connect(d); d.connect(fb); fb.connect(lpFb); lpFb.connect(d);
                d.connect(shimmer);
                this._fxNodes.push(d, fb, lpFb);
            });
            shimmer.connect(this.fxOutput);

        } else if (effectName === 'telephone') {
            // ── TELEPHONE v2 ── Old POTS line with tremolo + noise floor
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 350; hp.Q.value = 1.5;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; lp.Q.value = 1.5;
            const boost = this.ctx.createBiquadFilter(); boost.type = 'peaking'; boost.frequency.value = 1000; boost.Q.value = 0.8; boost.gain.value = 4;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(90); ws.oversample = '4x';
            const tremOsc = this.ctx.createOscillator(); tremOsc.type = 'sine'; tremOsc.frequency.value = 50;
            const tremGain = this.ctx.createGain(); tremGain.gain.value = 0.03;
            const carrier = this.ctx.createGain(); carrier.gain.value = 1.0;
            tremOsc.connect(tremGain); tremGain.connect(carrier.gain); tremOsc.start();
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.02;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch (e) {}
            this.fxInput.connect(hp); hp.connect(boost); boost.connect(lp); lp.connect(ws); ws.connect(carrier); carrier.connect(this.fxOutput);
            noiseGain.connect(this.fxOutput);
            this._fxNodes = [hp, lp, boost, ws, tremOsc, tremGain, carrier, noiseGain];
            if (noiseSrc) this._fxNodes.push(noiseSrc);

        } else if (effectName === 'vader') {
            // ── DARTH VADER v2 ── Deep RingMod + comb breathing + sub + reverb tail
            const rm = this._createRingMod(this.fxInput, 30, 0.85);
            const sub = this.ctx.createBiquadFilter(); sub.type = 'peaking'; sub.frequency.value = 70; sub.Q.value = 3.0; sub.gain.value = 8;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 1.5;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(55);
            const comb = this.ctx.createDelay(); comb.delayTime.value = 0.022;
            const combFb = this.ctx.createGain(); combFb.gain.value = 0.55;
            const combLp = this.ctx.createBiquadFilter(); combLp.type = 'lowpass'; combLp.frequency.value = 800;
            const revDelay1 = this.ctx.createDelay(); revDelay1.delayTime.value = 0.09;
            const revDelay2 = this.ctx.createDelay(); revDelay2.delayTime.value = 0.14;
            const revFb = this.ctx.createGain(); revFb.gain.value = 0.45;
            const revMix = this.ctx.createGain(); revMix.gain.value = 0.3;
            rm.output.connect(sub); sub.connect(lp); lp.connect(ws);
            ws.connect(comb); comb.connect(combLp); combLp.connect(combFb); combFb.connect(comb);
            ws.connect(this.fxOutput); comb.connect(this.fxOutput);
            ws.connect(revDelay1); revDelay1.connect(revFb); revFb.connect(revDelay2); revDelay2.connect(revFb);
            revDelay1.connect(revMix); revDelay2.connect(revMix); revMix.connect(this.fxOutput);
            this._fxNodes = [...rm.nodes, sub, lp, ws, comb, combFb, combLp, revDelay1, revDelay2, revFb, revMix];

        } else if (effectName === 'robot') {
            // ── ROBOT (DALEK) v2 ── Multi-harmonic ringmod + comb + gated tremolo
            const rm = this._createRingMod(this.fxInput, 50, 1.0);
            const rm2 = this._createRingMod(rm.output, 100, 0.4);
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(100); ws.oversample = '4x';
            const comb1 = this.ctx.createDelay(); comb1.delayTime.value = 0.01;
            const comb2 = this.ctx.createDelay(); comb2.delayTime.value = 0.0075;
            const cFb1 = this.ctx.createGain(); cFb1.gain.value = 0.6;
            const cFb2 = this.ctx.createGain(); cFb2.gain.value = 0.5;
            const gateOsc = this.ctx.createOscillator(); gateOsc.type = 'square'; gateOsc.frequency.value = 8;
            const gateGain = this.ctx.createGain(); gateGain.gain.value = 0.4;
            const gateOut = this.ctx.createGain(); gateOut.gain.value = 0.6;
            gateOsc.connect(gateGain); gateGain.connect(gateOut.gain); gateOsc.start();
            rm2.output.connect(ws);
            ws.connect(comb1); comb1.connect(cFb1); cFb1.connect(comb1);
            ws.connect(comb2); comb2.connect(cFb2); cFb2.connect(comb2);
            ws.connect(gateOut); comb1.connect(gateOut); comb2.connect(gateOut);
            gateOut.connect(this.fxOutput);
            this._fxNodes = [...rm.nodes, ...rm2.nodes, ws, comb1, comb2, cFb1, cFb2, gateOsc, gateGain, gateOut];

        } else if (effectName === 'astronaut') {
            // ── ASTRONAUT v2 ── Space comms bandpass + radio fade LFO + slapback + static
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 400; hp.Q.value = 1.5;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3500; lp.Q.value = 1.5;
            const presBoost = this.ctx.createBiquadFilter(); presBoost.type = 'peaking'; presBoost.frequency.value = 1200; presBoost.Q.value = 1.0; presBoost.gain.value = 5;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(60); ws.oversample = '4x';
            const slapback = this.ctx.createDelay(); slapback.delayTime.value = 0.18;
            const slapGain = this.ctx.createGain(); slapGain.gain.value = 0.25;
            const fadeLfo = this.ctx.createOscillator(); fadeLfo.type = 'sine'; fadeLfo.frequency.value = 0.12;
            const fadeGain = this.ctx.createGain(); fadeGain.gain.value = 0.15;
            const carrier = this.ctx.createGain(); carrier.gain.value = 0.85;
            fadeLfo.connect(fadeGain); fadeGain.connect(carrier.gain); fadeLfo.start();
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.07;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch (e) {}
            this.fxInput.connect(hp); hp.connect(presBoost); presBoost.connect(lp); lp.connect(ws); ws.connect(carrier);
            carrier.connect(this.fxOutput);
            ws.connect(slapback); slapback.connect(slapGain); slapGain.connect(this.fxOutput);
            noiseGain.connect(this.fxOutput);
            this._fxNodes = [hp, lp, presBoost, ws, slapback, slapGain, fadeLfo, fadeGain, carrier, noiseGain];
            if (noiseSrc) this._fxNodes.push(noiseSrc);

        } else if (effectName === '8bit') {
            // ── 8-BIT RETRO v2 ── Hard bitcrush + comb "sample rate" decimation + square ring mod
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(4);
            const bc2 = this.ctx.createWaveShaper(); bc2.curve = this._makeBitcrushCurve(6);
            const srComb = this.ctx.createDelay(); srComb.delayTime.value = 1 / 8000;
            const srFb = this.ctx.createGain(); srFb.gain.value = 0.92;
            const rm = this._createRingMod(bc2, 22.05, 0.2);
            const lpRoll = this.ctx.createBiquadFilter(); lpRoll.type = 'lowpass'; lpRoll.frequency.value = 4000;
            this.fxInput.connect(bc); bc.connect(srComb); srComb.connect(srFb); srFb.connect(srComb); srComb.connect(bc2);
            rm.output.connect(lpRoll); lpRoll.connect(this.fxOutput);
            this._fxNodes = [bc, bc2, srComb, srFb, lpRoll, ...rm.nodes];

        } else if (effectName === 'cathedral') {
            // ── CATHEDRAL v2 ── Huge 8-tap diffuse reverb + pre-delay + shimmer decay
            const preDelay = this.ctx.createDelay(); preDelay.delayTime.value = 0.04;
            const mix = this.ctx.createGain(); mix.gain.value = 0.35;
            const shimmer = this.ctx.createBiquadFilter(); shimmer.type = 'highshelf'; shimmer.frequency.value = 5000; shimmer.gain.value = 3;
            this.fxInput.connect(this.fxOutput);
            this.fxInput.connect(preDelay);
            this._fxNodes = [preDelay, mix, shimmer];
            [0.053, 0.083, 0.107, 0.149, 0.181, 0.227, 0.283, 0.367].forEach((t, i) => {
                const d = this.ctx.createDelay(); d.delayTime.value = t;
                const fb = this.ctx.createGain(); fb.gain.value = 0.78 - i * 0.05;
                const lpFb = this.ctx.createBiquadFilter(); lpFb.type = 'lowpass'; lpFb.frequency.value = 5000 - i * 350;
                preDelay.connect(d); d.connect(fb); fb.connect(lpFb); lpFb.connect(d);
                d.connect(mix);
                this._fxNodes.push(d, fb, lpFb);
            });
            mix.connect(shimmer); shimmer.connect(this.fxOutput);

        } else if (effectName === 'witness') {
            // ── WITNESS PROTECTION v2 ── Dual ringmod scramble + bitcrush + lowpass
            const rm1 = this._createRingMod(this.fxInput, 127, 0.7);
            const rm2 = this._createRingMod(rm1.output, 73, 0.5);
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(5);
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(20);
            rm2.output.connect(bc); bc.connect(lp); lp.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [...rm1.nodes, ...rm2.nodes, bc, lp, ws];

        } else if (effectName === 'tv_static') {
            // ── TV STATIC v2 ── Dual noise bands + dropout LFO + signal distortion
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(40);
            const bp1 = this.ctx.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 3000; bp1.Q.value = 0.8;
            const bp2 = this.ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 7000; bp2.Q.value = 1.0;
            const dropoutOsc = this.ctx.createOscillator(); dropoutOsc.type = 'square'; dropoutOsc.frequency.value = 3.7;
            const dropoutGain = this.ctx.createGain(); dropoutGain.gain.value = 0.3;
            const signalGain = this.ctx.createGain(); signalGain.gain.value = 0.7;
            dropoutOsc.connect(dropoutGain); dropoutGain.connect(signalGain.gain); dropoutOsc.start();
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.3;
            let noiseSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
            } catch (e) {}
            this.fxInput.connect(ws); ws.connect(signalGain);
            signalGain.connect(bp1); signalGain.connect(bp2);
            bp1.connect(this.fxOutput); bp2.connect(this.fxOutput);
            noiseGain.connect(bp1); noiseGain.connect(this.fxOutput);
            this._fxNodes = [ws, bp1, bp2, dropoutOsc, dropoutGain, signalGain, noiseGain];
            if (noiseSrc) this._fxNodes.push(noiseSrc);

        } else if (effectName === 'stadium') {
            // ── STADIUM ANNOUNCER v2 ── Mid-high boost + 4 cascaded slapbacks + reverb
            const presBoost = this.ctx.createBiquadFilter(); presBoost.type = 'peaking'; presBoost.frequency.value = 2500; presBoost.Q.value = 0.8; presBoost.gain.value = 6;
            const airShelf = this.ctx.createBiquadFilter(); airShelf.type = 'highshelf'; airShelf.frequency.value = 8000; airShelf.gain.value = 3;
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -20; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
            this.fxInput.connect(presBoost); presBoost.connect(airShelf); airShelf.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [presBoost, airShelf, comp];
            [[0.09, 0.45], [0.18, 0.35], [0.32, 0.25], [0.55, 0.15]].forEach(([t, fbv]) => {
                const d = this.ctx.createDelay(); d.delayTime.value = t;
                const fb = this.ctx.createGain(); fb.gain.value = fbv;
                const gainMix = this.ctx.createGain(); gainMix.gain.value = 0.5;
                comp.connect(d); d.connect(fb); fb.connect(d); d.connect(gainMix); gainMix.connect(this.fxOutput);
                this._fxNodes.push(d, fb, gainMix);
            });

        } else if (effectName === 'alien') {
            // ── ALIEN OVERLORD v2 ── Slow ringmod + detuned dual chorus + formant shift + bitcrush
            const rm = this._createRingMod(this.fxInput, 12, 0.85);
            const chorus = this._createChorus(rm.output, 0.35, 0.008, 0.65);
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 200; f1.Q.value = 3.0; f1.gain.value = 8;
            const f2 = this.ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 900; f2.Q.value = 2.0; f2.gain.value = -6;
            const f3 = this.ctx.createBiquadFilter(); f3.type = 'peaking'; f3.frequency.value = 2500; f3.Q.value = 2.5; f3.gain.value = 5;
            const bc = this.ctx.createWaveShaper(); bc.curve = this._makeBitcrushCurve(8);
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500;
            chorus.output.connect(f1); f1.connect(f2); f2.connect(f3); f3.connect(bc); bc.connect(lp); lp.connect(this.fxOutput);
            this._fxNodes = [...rm.nodes, ...chorus.nodes, f1, f2, f3, bc, lp];

        } else if (effectName === 'dream') {
            // ── LUCID DREAM v2 ── Dual chorus + shimmer reverb + long feedback decay
            const slowChorus = this._createChorus(this.fxInput, 0.15, 0.009, 0.5);
            const fastChorus = this._createChorus(slowChorus.output, 0.8, 0.003, 0.3);
            const shimmerShelf = this.ctx.createBiquadFilter(); shimmerShelf.type = 'highshelf'; shimmerShelf.frequency.value = 7000; shimmerShelf.gain.value = 5;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000;
            const revDelay = this.ctx.createDelay(); revDelay.delayTime.value = 0.45;
            const revFb = this.ctx.createGain(); revFb.gain.value = 0.65;
            const revLp = this.ctx.createBiquadFilter(); revLp.type = 'lowpass'; revLp.frequency.value = 3000;
            fastChorus.output.connect(lp); lp.connect(shimmerShelf);
            shimmerShelf.connect(this.fxOutput);
            shimmerShelf.connect(revDelay); revDelay.connect(revFb); revFb.connect(revLp); revLp.connect(revDelay); revDelay.connect(this.fxOutput);
            this._fxNodes = [...slowChorus.nodes, ...fastChorus.nodes, shimmerShelf, lp, revDelay, revFb, revLp];

        } else if (effectName === 'cyberpunk') {
            // ── CYBERPUNK SYNTH v2 ── Bitcrush + metal EQ + ring buzz + syncopated delays + pump
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

        } else if (effectName === 'helium') {
            // ── HELIUM v2 ── Dual formant high boosts + saturation + fast chorus
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 3000; f1.Q.value = 2.5; f1.gain.value = 12;
            const f2 = this.ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 5000; f2.Q.value = 2.0; f2.gain.value = 8;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(15);
            const chorus = this._createChorus(ws, 4.0, 0.001, 0.2);
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -25; comp.ratio.value = 5; comp.attack.value = 0.001; comp.release.value = 0.05;
            this.fxInput.connect(hp); hp.connect(f1); f1.connect(f2); f2.connect(ws);
            chorus.output.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [hp, f1, f2, ws, comp, ...chorus.nodes];

        } else if (effectName === 'sulfux') {
            // ── SULFUR HEXAFLUORIDE v2 ── Deep sub formants + dual LP + slow chorus + comp
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 700; lp1.Q.value = 1.5;
            const lp2 = this.ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 500; lp2.Q.value = 1.0;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 100; f1.Q.value = 3.0; f1.gain.value = 14;
            const f2 = this.ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 250; f2.Q.value = 2.0; f2.gain.value = 8;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(30);
            const chorus = this._createChorus(ws, 0.6, 0.005, 0.25);
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -20; comp.ratio.value = 6; comp.attack.value = 0.005; comp.release.value = 0.2;
            this.fxInput.connect(lp1); lp1.connect(lp2); lp2.connect(f1); f1.connect(f2); f2.connect(ws);
            chorus.output.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [lp1, lp2, f1, f2, ws, comp, ...chorus.nodes];

        } else if (effectName === 'far_away') {
            // ── FAR AWAY v2 ── Thin bandpass + heavy distance LP + multi-echo
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 800; hp.Q.value = 0.5;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000; lp.Q.value = 0.5;
            const distLP = this.ctx.createBiquadFilter(); distLP.type = 'lowpass'; distLP.frequency.value = 1000;
            const gain = this.ctx.createGain(); gain.gain.value = 0.18;
            const echo1 = this.ctx.createDelay(); echo1.delayTime.value = 0.08;
            const echo2 = this.ctx.createDelay(); echo2.delayTime.value = 0.22;
            const fb1 = this.ctx.createGain(); fb1.gain.value = 0.35;
            const fb2 = this.ctx.createGain(); fb2.gain.value = 0.2;
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(distLP); distLP.connect(gain); gain.connect(this.fxOutput);
            gain.connect(echo1); echo1.connect(fb1); fb1.connect(echo1); echo1.connect(this.fxOutput);
            gain.connect(echo2); echo2.connect(fb2); fb2.connect(echo2); echo2.connect(this.fxOutput);
            this._fxNodes = [hp, lp, distLP, gain, echo1, echo2, fb1, fb2];

        } else if (effectName === 'whisper') {
            // ── WHISPER v2 ── Two-stage saturation + breathy bandpass + chorus shimmer
            const ws1 = this.ctx.createWaveShaper(); ws1.curve = this._makeDistortionCurve(200); ws1.oversample = '4x';
            const ws2 = this.ctx.createWaveShaper(); ws2.curve = this._makeDistortionCurve(100); ws2.oversample = '4x';
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2000;
            const lpTop = this.ctx.createBiquadFilter(); lpTop.type = 'lowpass'; lpTop.frequency.value = 8000;
            const breathy = this.ctx.createBiquadFilter(); breathy.type = 'peaking'; breathy.frequency.value = 5000; breathy.Q.value = 0.8; breathy.gain.value = 6;
            const chorus = this._createChorus(breathy, 2.5, 0.002, 0.25);
            const gain = this.ctx.createGain(); gain.gain.value = 1.8;
            this.fxInput.connect(ws1); ws1.connect(ws2); ws2.connect(hp); hp.connect(lpTop); lpTop.connect(breathy);
            chorus.output.connect(gain); gain.connect(this.fxOutput);
            this._fxNodes = [ws1, ws2, hp, lpTop, breathy, gain, ...chorus.nodes];

        } else if (effectName === 'autotune') {
            // ── AUTO-TUNE (ROBOTIC) v2 ── Multi-freq ringmod + comb filter pitch-lock + hard clip
            const rm1 = this._createRingMod(this.fxInput, 130, 0.6);
            const rm2 = this._createRingMod(this.fxInput, 196, 0.4);
            const merge = this.ctx.createGain(); merge.gain.value = 0.7;
            rm1.output.connect(merge); rm2.output.connect(merge);
            const comb = this.ctx.createDelay(); comb.delayTime.value = 1 / 130;
            const combFb = this.ctx.createGain(); combFb.gain.value = 0.75;
            const combLp = this.ctx.createBiquadFilter(); combLp.type = 'lowpass'; combLp.frequency.value = 5000;
            merge.connect(comb); comb.connect(combFb); combFb.connect(combLp); combLp.connect(comb);
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(25);
            merge.connect(ws); comb.connect(ws);
            ws.connect(this.fxOutput);
            this._fxNodes = [...rm1.nodes, ...rm2.nodes, merge, comb, combFb, combLp, ws];

        } else if (effectName === 'zombie') {
            // ── ZOMBIE v2 ── Wide slow chorus + sub emphasis + multi-stage distortion + drag echo
            const chorus = this._createChorus(this.fxInput, 0.5, 0.025, 0.8);
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 600; lp1.Q.value = 2.0;
            const sub = this.ctx.createBiquadFilter(); sub.type = 'peaking'; sub.frequency.value = 80; sub.Q.value = 3.0; sub.gain.value = 8;
            const ws1 = this.ctx.createWaveShaper(); ws1.curve = this._makeDistortionCurve(40);
            const ws2 = this.ctx.createWaveShaper(); ws2.curve = this._makeDistortionCurve(60);
            const dragDelay = this.ctx.createDelay(); dragDelay.delayTime.value = 0.08;
            const dragFb = this.ctx.createGain(); dragFb.gain.value = 0.5;
            chorus.output.connect(sub); sub.connect(lp1); lp1.connect(ws1); ws1.connect(ws2);
            ws2.connect(dragDelay); dragDelay.connect(dragFb); dragFb.connect(dragDelay);
            ws2.connect(this.fxOutput); dragDelay.connect(this.fxOutput);
            this._fxNodes = [...chorus.nodes, sub, lp1, ws1, ws2, dragDelay, dragFb];

        } else if (effectName === 'child') {
            // ── CHILD v2 ── Multi-formant EQ for small vocal tract + punch comp
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 700; hp.Q.value = 0.8;
            const f1 = this.ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 2000; f1.Q.value = 2.0; f1.gain.value = 7;
            const f2 = this.ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 3500; f2.Q.value = 1.8; f2.gain.value = 5;
            const f3 = this.ctx.createBiquadFilter(); f3.type = 'peaking'; f3.frequency.value = 5000; f3.Q.value = 1.5; f3.gain.value = 3;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(8);
            const comp = this.ctx.createDynamicsCompressor();
            comp.threshold.value = -28; comp.ratio.value = 5; comp.attack.value = 0.002; comp.release.value = 0.08;
            this.fxInput.connect(hp); hp.connect(f1); f1.connect(f2); f2.connect(f3); f3.connect(ws); ws.connect(comp); comp.connect(this.fxOutput);
            this._fxNodes = [hp, f1, f2, f3, ws, comp];

        } else if (effectName === 'mask') {
            // ── MASK v2 ── Multi-stage lowpass + box mid + nasal boost + gentle saturation
            const lp1 = this.ctx.createBiquadFilter(); lp1.type = 'lowpass'; lp1.frequency.value = 2000; lp1.Q.value = 0.7;
            const lp2 = this.ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 1500; lp2.Q.value = 0.7;
            const boxMid = this.ctx.createBiquadFilter(); boxMid.type = 'peaking'; boxMid.frequency.value = 350; boxMid.Q.value = 1.5; boxMid.gain.value = 5;
            const nasal = this.ctx.createBiquadFilter(); nasal.type = 'peaking'; nasal.frequency.value = 700; nasal.Q.value = 2.0; nasal.gain.value = 3;
            const ws = this.ctx.createWaveShaper(); ws.curve = this._makeDistortionCurve(5);
            this.fxInput.connect(lp1); lp1.connect(lp2); lp2.connect(boxMid); boxMid.connect(nasal); nasal.connect(ws); ws.connect(this.fxOutput);
            this._fxNodes = [lp1, lp2, boxMid, nasal, ws];

        } else if (effectName === 'helmet') {
            // ── HELMET v2 ── Bandpass + resonant comb interior + slapback + hi-shelf cut
            const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4000;
            const res = this.ctx.createBiquadFilter(); res.type = 'peaking'; res.frequency.value = 900; res.Q.value = 5.0; res.gain.value = 6;
            const hsCut = this.ctx.createBiquadFilter(); hsCut.type = 'highshelf'; hsCut.frequency.value = 5000; hsCut.gain.value = -8;
            const comb = this.ctx.createDelay(); comb.delayTime.value = 0.008;
            const combFb = this.ctx.createGain(); combFb.gain.value = 0.55;
            const slap = this.ctx.createDelay(); slap.delayTime.value = 0.025;
            const slapGain = this.ctx.createGain(); slapGain.gain.value = 0.45;
            this.fxInput.connect(hp); hp.connect(lp); lp.connect(res); res.connect(hsCut);
            hsCut.connect(this.fxOutput);
            hsCut.connect(comb); comb.connect(combFb); combFb.connect(comb); comb.connect(this.fxOutput);
            hsCut.connect(slap); slap.connect(slapGain); slapGain.connect(this.fxOutput);
            this._fxNodes = [hp, lp, res, hsCut, comb, combFb, slap, slapGain];

        } else if (effectName === 'empty_room') {
            // ── EMPTY ROOM v2 ── Pre-delay + early reflections + diffuse tail
            const preDelay = this.ctx.createDelay(); preDelay.delayTime.value = 0.01;
            const earlyR1 = this.ctx.createDelay(); earlyR1.delayTime.value = 0.018;
            const earlyR2 = this.ctx.createDelay(); earlyR2.delayTime.value = 0.031;
            const earlyR3 = this.ctx.createDelay(); earlyR3.delayTime.value = 0.047;
            const earlyGain = this.ctx.createGain(); earlyGain.gain.value = 0.4;
            const d1 = this.ctx.createDelay(); d1.delayTime.value = 0.065;
            const d2 = this.ctx.createDelay(); d2.delayTime.value = 0.082;
            const fb = this.ctx.createGain(); fb.gain.value = 0.35;
            const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6000;
            this.fxInput.connect(this.fxOutput);
            this.fxInput.connect(preDelay);
            preDelay.connect(earlyR1); preDelay.connect(earlyR2); preDelay.connect(earlyR3);
            earlyR1.connect(earlyGain); earlyR2.connect(earlyGain); earlyR3.connect(earlyGain);
            earlyGain.connect(this.fxOutput);
            earlyGain.connect(d1); d1.connect(fb); fb.connect(d2); d2.connect(fb);
            d1.connect(lp); d2.connect(lp); lp.connect(this.fxOutput);
            this._fxNodes = [preDelay, earlyR1, earlyR2, earlyR3, earlyGain, d1, d2, fb, lp];

        } else if (effectName === 'ghost') {
            // ── GHOST v2 ── Multi-voice chorus + triple wobble delays + shimmer + eerie gate
            const chorus = this._createChorus(this.fxInput, 0.35, 0.012, 0.7);
            const shimmer = this.ctx.createBiquadFilter(); shimmer.type = 'highshelf'; shimmer.frequency.value = 8000; shimmer.gain.value = 5;
            const gateLfo = this.ctx.createOscillator(); gateLfo.type = 'sine'; gateLfo.frequency.value = 0.2;
            const gateGain = this.ctx.createGain(); gateGain.gain.value = 0.2;
            const gateOut = this.ctx.createGain(); gateOut.gain.value = 0.8;
            gateLfo.connect(gateGain); gateGain.connect(gateOut.gain); gateLfo.start();
            chorus.output.connect(shimmer); shimmer.connect(gateOut); gateOut.connect(this.fxOutput);
            this._fxNodes = [...chorus.nodes, shimmer, gateLfo, gateGain, gateOut];
            [[0.25, 0.4, 0.06], [0.38, 0.27, 0.04], [0.52, 0.18, 0.05]].forEach(([dt, rate, depth]) => {
                const d = this.ctx.createDelay(); d.delayTime.value = dt;
                const fb = this.ctx.createGain(); fb.gain.value = 0.62;
                const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = rate;
                const lfoG = this.ctx.createGain(); lfoG.gain.value = depth;
                lfo.connect(lfoG); lfoG.connect(d.delayTime); lfo.start();
                chorus.output.connect(d); d.connect(fb); fb.connect(d); d.connect(gateOut);
                this._fxNodes.push(d, fb, lfo, lfoG);
            });

        } else if (effectName === 'rain') {
            // ── RAIN v2 ── Pink-ish noise + crackle + distant thunder LFO thump
            const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.18;
            const crackleGain = this.ctx.createGain(); crackleGain.gain.value = 0.4;
            let noiseSrc = null, crackleSrc = null, thunderSrc = null;
            try {
                noiseSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
                const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                noiseSrc.buffer = b; noiseSrc.loop = true; noiseSrc.connect(noiseGain); noiseSrc.start();
                crackleSrc = this.ctx.createBufferSource(); crackleSrc.buffer = this._createCrackleBuffer(); crackleSrc.loop = true; crackleSrc.connect(crackleGain); crackleSrc.start();
                thunderSrc = this.ctx.createBufferSource();
                const bt = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
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
            // ── FOREST v2 ── Multi-band wind noise + insect hum + bird chirp + reverb ambience
            const windGain = this.ctx.createGain(); windGain.gain.value = 0.07;
            const windLp = this.ctx.createBiquadFilter(); windLp.type = 'bandpass'; windLp.frequency.value = 500; windLp.Q.value = 0.4;
            let windSrc = null;
            try {
                windSrc = this.ctx.createBufferSource();
                const b = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
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
            const revDelay = this.ctx.createDelay(); revDelay.delayTime.value = 0.12;
            const revFb = this.ctx.createGain(); revFb.gain.value = 0.5;
            const revMix = this.ctx.createGain(); revMix.gain.value = 0.3;
            this.fxInput.connect(this.fxOutput);
            windGain.connect(windLp); windLp.connect(this.fxOutput);
            insectGain.connect(this.fxOutput);
            chirpVca.connect(revDelay); revDelay.connect(revFb); revFb.connect(revDelay); revDelay.connect(revMix); revMix.connect(this.fxOutput);
            chirpVca.connect(this.fxOutput);
            this._fxNodes = [windGain, windLp, insectOsc, insectGain, insectLfo, insectLfoG, chirpOsc, chirpLfo, chirpLfoG, chirpVca, revDelay, revFb, revMix];
            if (windSrc) this._fxNodes.push(windSrc);

        } else if (effectName === 'cave') {
            // ── CAVE v2 ── Stone resonance + long dual-echo + heavy lowpass tails
            const preLp = this.ctx.createBiquadFilter(); preLp.type = 'lowpass'; preLp.frequency.value = 3000;
            const stone = this.ctx.createBiquadFilter(); stone.type = 'peaking'; stone.frequency.value = 300; stone.Q.value = 4.0; stone.gain.value = 4;
            const mainDelay = this.ctx.createDelay(); mainDelay.delayTime.value = 0.55;
            const mainFb = this.ctx.createGain(); mainFb.gain.value = 0.6;
            const mainLp = this.ctx.createBiquadFilter(); mainLp.type = 'lowpass'; mainLp.frequency.value = 1200;
            const delay2 = this.ctx.createDelay(); delay2.delayTime.value = 0.38;
            const fb2 = this.ctx.createGain(); fb2.gain.value = 0.45;
            const lp2 = this.ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 900;
            this.fxInput.connect(preLp); preLp.connect(stone); stone.connect(this.fxOutput);
            stone.connect(mainDelay); mainDelay.connect(mainFb); mainFb.connect(mainLp); mainLp.connect(mainDelay); mainDelay.connect(this.fxOutput);
            stone.connect(delay2); delay2.connect(fb2); fb2.connect(lp2); lp2.connect(delay2); delay2.connect(this.fxOutput);
            this._fxNodes = [preLp, stone, mainDelay, mainFb, mainLp, delay2, fb2, lp2];

        } else {
            // None — bypass
            this.fxInput.connect(this.fxOutput);
        }
    }
};
