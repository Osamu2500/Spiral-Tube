/**
 * Audio Dynamics Module (Mixin)
 * Handles Compressor, Limiter, and Auto-Gain Normalizer logic.
 */
export const AudioDynamicsMixin = {
    _applyCompressorState() {
        if (!this.compressorNode) return;
        
        if (!this._compressorEnabled) {
            this.compressorNode.ratio.value = 1;
            this.compressorNode.threshold.value = 0;
            return;
        }
        
        this.compressorNode.threshold.value = this._compThreshold ?? -24;
        this.compressorNode.ratio.value = this._compRatio ?? 12;
        this.compressorNode.attack.value = this._compAttack ?? 0.003;
        this.compressorNode.release.value = this._compRelease ?? 0.25;
        this.compressorNode.knee.value = this._compKnee ?? 30;
    },

    setCompressorEnabled(enabled) {
        this._compressorEnabled = enabled;
        if (this._proxyCmd('setCompressorEnabled', enabled)) return;
        this._applyCompressorState();
    },

    setCompressorThreshold(value) {
        this._compThreshold = value;
        if (this._proxyCmd('setCompressorThreshold', value)) return;
        if (this.compressorNode) this.compressorNode.threshold.value = value;
    },

    setCompressorRatio(value) {
        this._compRatio = value;
        if (this._proxyCmd('setCompressorRatio', value)) return;
        if (this.compressorNode) this.compressorNode.ratio.value = value;
    },

    setCompressorAttack(value) {
        this._compAttack = value;
        if (this._proxyCmd('setCompressorAttack', value)) return;
        if (this.compressorNode) this.compressorNode.attack.value = value;
    },

    setCompressorRelease(value) {
        this._compRelease = value;
        if (this._proxyCmd('setCompressorRelease', value)) return;
        if (this.compressorNode) this.compressorNode.release.value = value;
    },

    setCompressorKnee(value) {
        this._compKnee = value;
        if (this._proxyCmd('setCompressorKnee', value)) return;
        if (this.compressorNode) this.compressorNode.knee.value = value;
    },

    setAutoGain(enabled) {
        this._autoGain = enabled;
        if (this._proxyCmd('setAutoGain', enabled)) return;
        if (this.agcNode && this.agcMakeup) {
            this.agcNode.ratio.value = enabled ? 10 : 1;
            this.agcMakeup.gain.value = enabled ? 4.0 : 1.0;
        }
    }
};
