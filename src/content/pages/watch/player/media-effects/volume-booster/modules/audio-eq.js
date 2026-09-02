/**
 * Audio EQ Module (Mixin)
 * Handles 10-Band EQ and Preset application.
 */
export const AudioEQMixin = {
    _setEQBand(index, db) {
        this._eqGains[index] = db;
        if (this._proxyCmd('_setEQBand', [index, db])) return;
        if (this._bypassed) return;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
        }
        if (this._eqNodes[index] && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
            this._eqNodes[index].gain.setTargetAtTime(db, this.ctx.currentTime, 0.05);
        }
    },

    applyPreset(presetName) {
        const preset = this._presets[presetName];
        if (preset) {
            const eq = preset.eq || preset; // fallback if it's just an array
            if (Array.isArray(eq)) eq.forEach((val, i) => this._setEQBand(i, val));
            
            if (preset.compressor) {
                this._compressorEnabled = true;
                if (this.compressorNode) {
                    this.compressorNode.ratio.setTargetAtTime(preset.compressor.ratio, this.ctx.currentTime, 0.05);
                    this.compressorNode.threshold.setTargetAtTime(preset.compressor.threshold, this.ctx.currentTime, 0.05);
                }
            } else {
                this._applyCompressorState();
            }
            if (preset.volume !== undefined) this.setVolume(preset.volume);
            if (preset.mono !== undefined) this.setMono(preset.mono);
            if (preset.width !== undefined) this.setWidth(preset.width);
            
            return true;
        }
        return false;
    }
};
