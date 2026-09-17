import '../../../../../core/system/base-feature.js';
import './equaliser.css';

import { EqualiserUI } from './equaliser-ui.js';
import { EQ_BANDS, EQ_PRESETS } from './constants/eq-presets.js';
import { AudioEQMixin } from './modules/audio-eq.js';
import { AudioDynamicsMixin } from './modules/audio-dynamics.js';
import { AudioSpatialMixin } from './modules/audio-spatial.js';
import { AudioFXMixin } from './modules/audio-fx.js';

/**
 * @class Equaliser
 * @extends window.YPP.features.BaseFeature
 * @description Master orchestrator for the Web Audio API graph.
 * Handles the lifecycle of the AudioContext, connects media nodes to the graph,
 * and delegates processing to modular mixins (EQ, Dynamics, Spatial, FX).
 * 
 * **Production Code Audit**: 
 * - Memory leak prevention: Uses WeakRefs/WeakMaps for DOM caching.
 * - Performance: Graph updates are batched where possible.
 */
export class Equaliser extends window.YPP.features.BaseFeature {
    static featureId = 'volumeBoost';
    static executionPhase = 'sequential-ui';
    static priority = 7;
    static targetPages = ['watch']; // Only run on player page

    constructor() {
        super('Equaliser');
        this.name = 'Equaliser';
        this._id = 'vb_' + Math.random().toString(36).substring(2, 9);
        this.settings = null;

        // Audio graph nodes
        this._audioConnected = false;
        this.ctx = null;
        this.source = null;
        this.gainNode = null;
        this.compressorNode = null;
        this.limiterNode = null;
        this.pannerNode = null;
        this.analyserNode = null;
        this.nativeVolumeGain = null;
        this._eqNodes = [];          // 10 BiquadFilterNodes
        
        // State
        this._compressorEnabled = true;
        this._monoEnabled = false;
        this._eqGains = new Array(10).fill(0);   // current dB per band
        this._volumeGain = 1.0;                  // 1.0 = 100%
        this._balance = 0.0;                     // -1.0 (Left) to 1.0 (Right)
        this._stereoWidth = 1.0;                 // 0.0 (Mono) to 2.0 (Wide)
        this._bypassed = false;
        
        // Audio Effects (TikTok Styles)
        this._activeFX = 'none';
        this._fxNodes = [];
        
        // Vinyl Mode
        this._vinylMode = false;
        this._playbackRate = 1.0;

        // Reverb Environment
        this._reverbEnv = 'None';                // 'None', 'Studio', 'Club', 'Concert Hall', 'Cave'
        this._reverbMix = 0.0;                   // 0.0 to 1.0

        // Phase Inversion
        this._invertL = false;
        this._invertR = false;

        // Auto-Gain
        this._autoGain = false;

        // DOM refs (Performance Cache)
        this._domCache = new WeakMap();
        this._volumePopup = null;
        this._volumePopupOutsideHandler = null;
        this._boundVideo = null;
        this._onInit = null;

        // Visibility change handler ref for cleanup
        this._onVisibilityChange = null;

        // 10 EQ band definitions — sub-bass → air
        this._bands = [
            { label: '60',  freq: 60,    type: 'lowshelf', color: '#ffffff' },
            { label: '170', freq: 170,   type: 'peaking',  color: '#ffffff' },
            { label: '310', freq: 310,   type: 'peaking',  color: '#ffffff' },
            { label: '600', freq: 600,   type: 'peaking',  color: '#ffffff' },
            { label: '1k',  freq: 1000,  type: 'peaking',  color: '#ffffff' },
            { label: '3k',  freq: 3000,  type: 'peaking',  color: '#ffffff' },
            { label: '6k',  freq: 6000,  type: 'peaking',  color: '#ffffff' },
            { label: '10k', freq: 10000, type: 'peaking',  color: '#ffffff' },
            { label: '14k', freq: 14000, type: 'peaking',  color: '#ffffff' },
            { label: '16k', freq: 16000, type: 'highshelf',color: '#ffffff' },
        ];
        // Presets — array index matches _bands order
        this._presets = {
            'Flat':           { eq: [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0] },
            'Bass Boost':     { eq: [ 8,  6,  4,  2,  0, -1,  0,  0,  0,  0] },
            'Vocal Enhancer': { eq: [-2, -1,  0,  2,  4,  4,  3,  2,  1,  0], compressor: { ratio: 6, threshold: -20 } },
            'Night Mode':     { eq: [ 2,  2,  0,  0,  0,  1,  1, -2, -3, -5], compressor: { ratio: 20, threshold: -35 }, volume: 1.2, mono: true, width: 0.8 },
            'Electronic':     { eq: [ 5,  4,  1,  0, -1,  1,  3,  4,  5,  6] }
        };
    }

    getConfigKey() { 
        return 'enableVolumeBoost'; 
    }

    _loadSettings(settings) {
        if (!settings) return;
        
        // Helper to validate types and default assignments safely
        const assignIfType = (key, type, targetKey) => {
            if (settings[key] !== undefined && typeof settings[key] === type) {
                this[targetKey] = settings[key];
            }
        };

        assignIfType('volumeLevel', 'number', '_volumeGain');
        assignIfType('volumeBalance', 'number', '_balance');
        assignIfType('volumeCompressor', 'boolean', '_compressorEnabled');
        assignIfType('volumeCompThreshold', 'number', '_compThreshold');
        assignIfType('volumeCompRatio', 'number', '_compRatio');
        assignIfType('volumeCompAttack', 'number', '_compAttack');
        assignIfType('volumeCompRelease', 'number', '_compRelease');
        assignIfType('volumeCompKnee', 'number', '_compKnee');
        assignIfType('volumeWarmth', 'number', '_warmthAmount');
        assignIfType('volumeMono', 'boolean', '_monoEnabled');
        assignIfType('volumeStereoWidth', 'number', '_stereoWidth');
        assignIfType('volumeBypassed', 'boolean', '_bypassed');
        assignIfType('volumeActiveEffect', 'string', '_activeFX');
        assignIfType('volumeVinylMode', 'boolean', '_vinylMode');
        assignIfType('volumePlaybackRate', 'number', '_playbackRate');
        assignIfType('volumeReverbEnv', 'string', '_reverbEnv');
        assignIfType('volumeReverbMix', 'number', '_reverbMix');
        assignIfType('volumeInvertL', 'boolean', '_invertL');
        assignIfType('volumeInvertR', 'boolean', '_invertR');
        assignIfType('volumeAutoGain', 'boolean', '_autoGain');
        assignIfType('volumeCrossfeed', 'boolean', '_crossfeedEnabled');
        if (settings.volumeEqBands) {
            try {
                const bands = JSON.parse(settings.volumeEqBands);
                if (Array.isArray(bands) && bands.length === 10) {
                    this._eqGains = bands.map(v => typeof v === 'number' ? v : 0);
                }
            } catch (e) {
                this.utils?.log?.('[YPP:Equaliser] Failed to parse EQ bands: ' + e.message, 'Equaliser', 'warn');
            }
        }
        assignIfType('volumeVisualizerMode', 'string', '_visualizerMode');
        if (settings.volumeCustomPresets) {
            try {
                const custom = JSON.parse(settings.volumeCustomPresets);
                if (typeof custom === 'object' && custom !== null) {
                    this._presets = { ...this._presets, ...custom };
                }
            } catch (e) {
                this.utils?.log?.('[YPP:Equaliser] Failed to parse custom presets: ' + e.message, 'Equaliser', 'warn');
            }
        }
    }

    _proxyCmd(cmd, value) {
        if (this._boundVideo && this._boundVideo._proxy) {
            this._boundVideo[`vb_${cmd}`] = value;
            return true;
        }
        return false;
    }




    



    






    setBypass(enabled) {
        this._bypassed = enabled;
        if (this._proxyCmd('setBypass', enabled)) return;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
        }
        
        if (this._audioConnected) {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch((e) => {
                    this.utils?.log?.('[YPP:Equaliser] setBypass resume failed: ' + e.message, 'Equaliser', 'info');
                });
            }
            
            if (this.gainNode) {
                this.gainNode.gain.setTargetAtTime(enabled ? 1 : this._volumeGain, this.ctx.currentTime, 0.05);
            }
            
            if (this.widthMatrix) {
                this.widthMatrix.widthGain.gain.setTargetAtTime(enabled ? 1 : this._stereoWidth, this.ctx.currentTime, 0.05);
            }
            
            this._eqNodes.forEach((n, i) => { 
                if (n) n.gain.setTargetAtTime(enabled ? 0 : this._eqGains[i], this.ctx.currentTime, 0.05); 
            });
            
            this._applyCompressorState();
            this.setMono(this._monoEnabled, enabled);
            
            if (this.reverbDryGain && this.reverbWetGain) {
                const effectiveMix = (this._reverbEnv === 'None') ? 0.0 : this._reverbMix;
                this.reverbDryGain.gain.setTargetAtTime(enabled ? 1.0 : (1.0 - effectiveMix), this.ctx.currentTime, 0.05);
                this.reverbWetGain.gain.setTargetAtTime(enabled ? 0.0 : effectiveMix, this.ctx.currentTime, 0.05);
            }
            
            if (this.phaseGainL) this.phaseGainL.gain.setTargetAtTime(enabled ? 1.0 : (this._invertL ? -1 : 1), this.ctx.currentTime, 0.05);
            if (this.phaseGainR) this.phaseGainR.gain.setTargetAtTime(enabled ? 1.0 : (this._invertR ? -1 : 1), this.ctx.currentTime, 0.05);
            
            if (this.agcNode) this.agcNode.ratio.setTargetAtTime(enabled ? 1.0 : (this._autoGain ? 2.5 : 1), this.ctx.currentTime, 0.05);
            if (this.agcMakeup) this.agcMakeup.gain.setTargetAtTime(enabled ? 1.0 : (this._autoGain ? 2.0 : 1.0), this.ctx.currentTime, 0.05);
            
            if (this._boundVideo) {
                this._boundVideo.preservesPitch = enabled ? true : !this._vinylMode;
                if (this._playbackRate !== 1.0) this._boundVideo.playbackRate = enabled ? 1.0 : this._playbackRate;
            }
            
            // Bypass FX and remaining Spatial/Dynamic modules
            if (this.setWarmth) this.setWarmth(enabled ? 0 : this._warmthAmount, true);
            if (this.setVinylMode) this.setVinylMode(enabled ? false : this._vinylMode, true);
            if (this.setReverbMix) this.setReverbMix(enabled ? 0 : this._reverbMix, true);
            if (this.setFX) this.setFX(enabled ? 'none' : this._activeFX, true);
            if (this.crossfeedNodes) {
                const crossLevel = (enabled || !this._crossfeedEnabled) ? 0 : 0.35;
                const directLevel = (enabled || !this._crossfeedEnabled) ? 1.0 : 0.85;
                this.crossfeedNodes.crossGainLtoR.gain.setTargetAtTime(crossLevel, this.ctx.currentTime, 0.05);
                this.crossfeedNodes.crossGainRtoL.gain.setTargetAtTime(crossLevel, this.ctx.currentTime, 0.05);
                this.crossfeedNodes.directGainL.gain.setTargetAtTime(directLevel, this.ctx.currentTime, 0.05);
                this.crossfeedNodes.directGainR.gain.setTargetAtTime(directLevel, this.ctx.currentTime, 0.05);
            }
        }
    }

    async enable() {
        await super.enable();
        this._loadSettings(this.settings);
        
        // Initial application if already connected
        if (this._audioConnected && !this._bypassed) {
            this._applyAllState();
        }
    // -- Keyboard Shortcuts --
        this.addListener(document, 'keydown', (e) => {
            if (!this._audioConnected) return;
            if (e.target.matches('input, textarea, [contenteditable]')) return;
            
            let handled = false;
            if (e.altKey && e.code === 'KeyV') {
                e.preventDefault();
                this.setBypass(!this._bypassed);
                this.utils?.log?.('[YPP:Equaliser] Toggled Bypass via Hotkey: ' + this._bypassed, 'Equaliser');
                handled = true;
            }
            else if (e.altKey && e.code === 'KeyM') {
                e.preventDefault();
                this.setMono(!this._monoEnabled);
                this.utils?.log?.('[YPP:Equaliser] Toggled Mono via Hotkey: ' + this._monoEnabled, 'Equaliser');
                handled = true;
            }
            
            if (handled && this._volumePopup && EqualiserUI) {
                const anchorBtn = document.querySelector(`#ypp-volume-boost-btn[data-vb-id="${this._id}"]`);
                if (anchorBtn) {
                    EqualiserUI.toggleEQPanel(this, this._boundVideo, anchorBtn);
                    setTimeout(() => EqualiserUI.toggleEQPanel(this, this._boundVideo, anchorBtn), 10);
                }
            }
        });

        // FIX Bug 4: Use waitForElement with a timeout so we don't miss the
        // video element when enable() is called right after SPA navigation
        // before YouTube has rendered the player.
        const findAndInit = async () => {
            let video = window.YPP.DOMManager?.getVideo() || document.querySelector('video');

            if (!video) {
                // Retry up to 3 s via BaseFeature's pollFor/waitForElement
                try {
                    video = await this.waitForElement(
                        window.YPP.CONSTANTS.SELECTORS.VIDEO[0] || 'video',
                        3000
                    );
                } catch (_) {
                    video = null;
                }
            }

            if (video && !this._audioConnected) {
                this.initAudioContext(video);
            }
        };

        findAndInit();
    }

    onUpdate() {
        this._loadSettings(this.settings);
        if (this._audioConnected && !this._bypassed) {
            this._applyAllState();
        }
    }
    
    _applyAllState() {
        if (this.gainNode) this.gainNode.gain.setTargetAtTime(this._volumeGain, this.ctx.currentTime, 0.05);
        if (this.widthMatrix) this.widthMatrix.widthGain.gain.setTargetAtTime(this._stereoWidth, this.ctx.currentTime, 0.05);
        this._eqNodes.forEach((n, i) => { if (n) n.gain.setTargetAtTime(this._eqGains[i], this.ctx.currentTime, 0.05); });
        this._applyCompressorState();
        this.setMono(this._monoEnabled, this._bypassed);
        if (this.reverbDryGain && this.reverbWetGain) {
            const effectiveMix = (this._reverbEnv === 'None') ? 0.0 : this._reverbMix;
            this.reverbDryGain.gain.setTargetAtTime(1.0 - effectiveMix, this.ctx.currentTime, 0.05);
            this.reverbWetGain.gain.setTargetAtTime(effectiveMix, this.ctx.currentTime, 0.05);
        }
        if (this.phaseGainL) this.phaseGainL.gain.setTargetAtTime(this._invertL ? -1 : 1, this.ctx.currentTime, 0.05);
        if (this.phaseGainR) this.phaseGainR.gain.setTargetAtTime(this._invertR ? -1 : 1, this.ctx.currentTime, 0.05);
        if (this.agcNode) this.agcNode.ratio.setTargetAtTime(this._autoGain ? 2.5 : 1, this.ctx.currentTime, 0.05);
        if (this.agcMakeup) this.agcMakeup.gain.setTargetAtTime(this._autoGain ? 2.0 : 1.0, this.ctx.currentTime, 0.05);
    }

    async disable() {
        // _visibilityHandler is now handled by this.addListener, so it will be cleaned up automatically by super.disable()
        this._onVisibilityChange = null;

        // Clean up UI
        if (this._volumePopup) {
            this._volumePopup.remove();
            this._volumePopup = null;
        }
        this._volumePopupOutsideHandler = null;
        this._volumePopupEscapeHandler = null;
        
        // Call super to run cleanupEvents and remove all tracked listeners
        await super.disable();

        // Scope button removal to this feature instance, but ONLY if the feature is explicitly disabled in settings
        if (this.settings && this.settings.enableVolumeBoost === false) {
            const btn = document.querySelector(`#ypp-volume-boost-btn[data-vb-id="${this._id}"]`);
            if (btn) btn.remove();
        }

        // Clean up event listeners
        if (this._boundVideo && this._onInit) {
            this._onInit = null; // release closure reference
        }

        // Safely bypass audio effects without destroying the graph
        if (this._audioConnected) {
            // Reset Gain
            if (this.gainNode) {
                this.gainNode.gain.setTargetAtTime(1, this.ctx.currentTime, 0.05);
            }
            
            // Reset EQ
            this._eqNodes.forEach(n => { 
                if (n) n.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05); 
            });
            
            // Bypass compressor safely
            if (this.compressorNode) {
                this.compressorNode.ratio.value = 1;
                this.compressorNode.threshold.value = 0;
            }
            
            // Bypass limiter safely
            if (this.limiterNode) {
                this.limiterNode.ratio.value = 1;
                this.limiterNode.threshold.value = 0;
            }
            
            // Bypass width
            if (this.widthMatrix) {
                this.widthMatrix.widthGain.gain.setTargetAtTime(this._stereoWidth, this.ctx.currentTime, 0.05);
            }
            
            if (this.reverbDryGain && this.reverbWetGain) {
                this.reverbDryGain.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.05);
                this.reverbWetGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.05);
            }
            
            if (this.phaseGainL) this.phaseGainL.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.05);
            if (this.phaseGainR) this.phaseGainR.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.05);
            
            if (this.agcNode) this.agcNode.ratio.setTargetAtTime(1.0, this.ctx.currentTime, 0.05);
            if (this.agcMakeup) this.agcMakeup.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.05);
            
            // Note: nativeVolumeGain is NOT bypassed here, so native volume still works
            
            // Restore Vinyl Mode
            if (this._boundVideo) {
                this._boundVideo.preservesPitch = true;
                if (this._playbackRate !== 1.0) this._boundVideo.playbackRate = 1.0;
            }
            
            // Reset Panner & Mono
            if (this.pannerNode) {
                this.pannerNode.pan.setTargetAtTime(0, this.ctx.currentTime, 0.05);
            }
            if (this.source) {
                this.source.channelCount = 2;
                this.source.channelCountMode = 'max';
            }
        }
    }

    onUpdate() {
        this._loadSettings(this.settings);
        if (this._audioConnected) {
            this._restoreAudioState();
        }
        this.enable();
    }

    onPageChange() {
        if (!this.settings || !this.settings.enableVolumeBoost) return;
        // Re-load from persisted settings on every page change to guarantee
        // that in-memory values always match what was saved to Chrome storage.
        this._loadSettings(this.settings);
        const video = window.YPP.DOMManager?.getVideo();
        if (video) {
            if (this._audioConnected && this._boundVideo === video) {
                // Same video element reused (YouTube SPA) — just re-apply state
                this._restoreAudioState();
            } else if (!this._audioConnected) {
                this.initAudioContext(video);
            }
        }
    }

    onVideoChange(videoElement) {
        // Called by FeatureManager when a new videoId is detected (app:videoChange event)
        if (!this.settings || !this.settings.enableVolumeBoost) return;
        this._loadSettings(this.settings);

        const tryInit = async () => {
            let video = videoElement || window.YPP.DOMManager?.getVideo() || document.querySelector('video');
            if (!video) {
                try {
                    video = await this.utils.pollFor({
                        target: window.YPP.CONSTANTS.SELECTORS.VIDEO[0] || 'video',
                        maxAttempts: 15,
                        intervalMs: 200
                    });
                } catch (e) {
                    this.utils?.log?.('[YPP:Equaliser] Could not find video element on navigation', 'Equaliser', 'warn');
                    return;
                }
            }
            if (!video) return;

            if (this._audioConnected && this._boundVideo === video) {
                // Same video element: just restore the correct audio values
                this._restoreAudioState();
            } else if (!this._audioConnected) {
                this.initAudioContext(video);
            } else if (this._boundVideo && this._boundVideo !== video) {
                // Video element was swapped — reconnect to new one
                if (this.source) {
                    try { this.source.disconnect(); } catch (e) { /* Safe to ignore if already disconnected */ }
                }
                this._audioConnected = false;
                this.initAudioContext(video);
            }
        };

        tryInit();
    }

    /**
     * FIX Bug 2: Removed _needsAudioGraph() guard.
     * The graph must always be built when the feature is enabled so that
     * the EQ panel works immediately even at 100% / flat EQ default state.
     * _needsAudioGraph is kept only as a lazy-init guard inside setVolume/setBalance/setEQ.
     */
    _needsAudioGraph() {
        if (this._volumeGain !== 1.0) return true;
        if (this._balance !== 0.0) return true;
        if (this._stereoWidth !== 1.0) return true;
        if (this._monoEnabled) return true;
        if (this._eqGains && this._eqGains.some(g => g !== 0)) return true;
        
        // Also check if any Dynamics, Spatial, or FX features are active
        if (this._warmthAmount > 0) return true;
        if (this._autoGain) return true;
        if (this._compressorEnabled && (this._compThreshold > -24 || this._compRatio !== 1)) return true;
        
        if (this._reverbEnv && this._reverbEnv !== 'None') return true;
        if (this._crossfeedEnabled) return true;
        if (this._invertL || this._invertR) return true;
        
        if (this._activeFX && this._activeFX !== 'none') return true;
        if (this._vinylMode) return true;
        
        return false;
    }

    /**
     * FIX Bug 1: Enhanced safety check.
     * currentSrc may be empty when the video element first appears on YouTube
     * because YouTube sets it asynchronously after the element is injected.
     * Returns true if we can determine the source is safe, OR if we simply
     * cannot determine safety yet (caller will retry on loadedmetadata).
     */
    _isSafeToBoost(video) {
        if (!video) return false;
        if (video.srcObject) return true;

        const src = video.currentSrc || video.src;

        // FIX: src may be empty on YouTube before loadedmetadata — treat as
        // "safe but not yet determined" by returning 'pending' string, not false.
        // Caller checks for this.
        if (!src) return 'pending';

        if (src.startsWith('blob:') || src.startsWith('data:')) return true;
        try {
            const url = new URL(src);
            if (url.origin === window.location.origin) return true;
        } catch(e) {
            // Ignore invalid URL parse, proceed to cross-origin check
        }
        if (video.crossOrigin === 'anonymous' || video.crossOrigin === 'use-credentials') return true;
        return false;
    }

    /**
     * Initializes the Web Audio API context and binds it to the video element.
     * Uses lazy initialization on 'play' or 'volumechange' to respect browser autoplay policies.
     * @param {HTMLVideoElement} video 
     */
    initAudioContext(video) {
        const safeResult = this._isSafeToBoost(video);

        // FIX Bug 1: If src isn't assigned yet, wait for loadedmetadata and retry.
        if (safeResult === 'pending') {
            const retryOnMeta = () => {
                if (this._audioConnected) return; // Already handled
                const safe = this._isSafeToBoost(video);
                if (safe === true) {
                    this._doInitAudioContext(video);
                } else if (safe !== 'pending') {
                    this.utils?.log?.('Equaliser disabled: Cross-Origin Video detected.', 'Equaliser', 'warn');
                }
            };
            // Use addListener so it is tracked and cleaned up by disable()
            this.addListener(video, 'loadedmetadata', retryOnMeta, { once: true });
            this.addListener(video, 'canplay', retryOnMeta, { once: true });
            return;
        }

        if (!safeResult) {
            this.utils?.log?.('Equaliser disabled: Cross-Origin Video detected without CORS.', 'Equaliser', 'warn');
            return;
        }

        this._doInitAudioContext(video);
    }

    /**
     * Internal: performs the actual AudioContext setup after safety is confirmed.
     * @param {HTMLVideoElement} video
     */
    _doInitAudioContext(video) {
        // If we are already connected to THIS video, do nothing.
        if (this._audioConnected && this._boundVideo === video) return;
        
        // If we were connected to a DIFFERENT video, cleanly disconnect old source
        if (this._audioConnected && this._boundVideo && this._boundVideo !== video) {
            if (this.source) {
                try { this.source.disconnect(); } catch (e) { /* Safe to ignore */ }
            }
            this._audioConnected = false;
        }

        this._boundVideo = video;

        this._onInit = () => {
            if (this._audioConnected) return;
            try {
                // Safely get or create AudioContext for this video.
                // FIX Bug 3 (companion): Respect __ypp_ctx/__ypp_source set by AudioEQ
                // or AudioCompressor so we don't call createMediaElementSource twice.
                if (video.__ypp_ctx && video.__ypp_source) {
                    this.ctx = video.__ypp_ctx;
                    this.source = video.__ypp_source;
                    // PREVENT AUDIO DOUBLING BUG: Disconnect source before rebuilding the graph
                    try { this.source.disconnect(); } catch (e) { /* Safe to ignore */ }
                } else {
                    const AC = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AC();
                    this.source = this.ctx.createMediaElementSource(video);
                    video.__ypp_ctx = this.ctx;
                    video.__ypp_source = this.source;
                }

                this._buildAudioGraph();
                
                // IMPORTANT: AudioContext often starts in 'suspended' state without user interaction.
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume().catch((e) => {
                        this.utils?.log?.('[YPP:Equaliser] init AudioContext resume failed: ' + e.message, 'Equaliser', 'info');
                    });
                }

                // FIX Bug 6: Resume AudioContext when tab becomes visible again.
                // Chrome/Firefox suspend AudioContext when tabs are backgrounded.
                if (!this._onVisibilityChange) {
                    this._onVisibilityChange = () => {
                        if (document.visibilityState === 'visible' && this.ctx && this.ctx.state === 'suspended') {
                            this.ctx.resume().catch((e) => {
                                this.utils?.log?.('[YPP:Equaliser] Could not resume audio context on visibility change: ' + e.message, 'Equaliser', 'info');
                            });
                        }
                    };
                    this.addListener(document, 'visibilitychange', this._onVisibilityChange);
                }

                // Also heal on user interaction as fallback
                const resumeAudio = () => {
                    if (this.ctx && this.ctx.state === 'suspended') {
                        this.ctx.resume().catch((e) => {
                            this.utils?.log?.('[YPP:Equaliser] Could not resume audio context on interaction: ' + e.message, 'Equaliser', 'info');
                        });
                    }
                    // Self-remove the listeners tracked via this.addListener
                    ['click', 'touchstart', 'keydown'].forEach(evt => {
                        if (this._resumeListeners && this._resumeListeners[evt]) {
                            document.removeEventListener(evt, this._resumeListeners[evt], true);
                            delete this._resumeListeners[evt];
                        }
                    });
                };
                
                this._resumeListeners = {};
                ['click', 'touchstart', 'keydown'].forEach(evt => {
                    this._resumeListeners[evt] = resumeAudio;
                    this.addListener(document, evt, resumeAudio, { capture: true });
                });

            } catch (e) {
                this.utils?.log?.('[YPP:Equaliser] Audio engine init failed: ' + e.message, 'Equaliser', 'warn');
                this._audioConnected = false;
            }
        };

        // FIX Bug 5: Removed { once: true } — _audioConnected guards idempotency.
        // With once:true, the listener was consumed before _isSafeToBoost resolved,
        // leaving no way to retry when the src finally became available.
        this.addListener(video, 'play', this._onInit);
        this.addListener(video, 'volumechange', this._onInit);
        
        // Ensure native volume changes map to our graph when active
        this._onNativeVolume = () => {
            if (this._audioConnected && this.nativeVolumeGain && this.ctx) {
                const target = video.muted ? 0 : video.volume;
                // Only adjust if there's a difference to avoid unnecessary automation
                if (Math.abs(this.nativeVolumeGain.gain.value - target) > 0.01) {
                    this.nativeVolumeGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
                }
            }
        };
        this.addListener(video, 'volumechange', this._onNativeVolume);
        
        if (!video.paused) this._onInit();
    }

    /**
     * Constructs the audio processing chain.
     * Topology: source -> eqNodes -> panner -> compressor -> gain -> analyser -> destination
     */
    _buildAudioGraph() {
        try {
            // 0. Phase Inversion
            this.phaseSplitter = this.ctx.createChannelSplitter(2);
            this.phaseGainL = this.ctx.createGain();
            this.phaseGainR = this.ctx.createGain();
            this.phaseMerger = this.ctx.createChannelMerger(2);
            this.phaseGainL.gain.value = this._invertL ? -1 : 1;
            this.phaseGainR.gain.value = this._invertR ? -1 : 1;
            
            this.phaseSplitter.connect(this.phaseGainL, 0);
            this.phaseSplitter.connect(this.phaseGainR, 1);
            this.phaseGainL.connect(this.phaseMerger, 0, 0);
            this.phaseGainR.connect(this.phaseMerger, 0, 1);

            // 1. Setup Input/EQ Nodes
            this.inputGain = this.ctx.createGain();
            this.fxInput = this.ctx.createGain();
            this.fxOutput = this.ctx.createGain();
            this.fxInput.connect(this.fxOutput); // Default bypass connection
            this.eqInGain = this.ctx.createGain();
            this._eqNodes = this._bands.map((band, i) => {
                const f = this.ctx.createBiquadFilter();
                f.type = band.type;
                f.frequency.value = band.freq;
                f.gain.value = this._eqGains[i];
                if (band.type === 'peaking') f.Q.value = 1.4;
                return f;
            });

            // 2. Dynamics: Compressor
            this.compressorNode = this.ctx.createDynamicsCompressor();
            this.compressorNode.threshold.value = this._compressorEnabled ? (this._compThreshold ?? -24) : 0;
            this.compressorNode.knee.value = this._compKnee ?? 30;
            this.compressorNode.ratio.value = this._compressorEnabled ? (this._compRatio ?? 4) : 1;
            this.compressorNode.attack.value = this._compAttack ?? 0.003;
            this.compressorNode.release.value = this._compRelease ?? 0.25;
            
            // Reverb System (Parallel Dry/Wet)
            this.reverbNode = this.ctx.createConvolver();
            this.reverbDryGain = this.ctx.createGain();
            this.reverbWetGain = this.ctx.createGain();
            
            // Stereo Width & Panning
            this.widthMatrix = this._createStereoWidthMatrix(this.ctx);
            this.pannerNode = this.ctx.createStereoPanner();
            
            // Warmth Node
            this.warmthNode = this.ctx.createWaveShaper();
            this.warmthNode.oversample = '2x';
            this.warmthLpNode = this.ctx.createBiquadFilter();
            this.warmthLpNode.type = 'lowpass';
            if (this._warmthAmount > 0 && this._makeTubeCurve) {
                this.warmthNode.curve = this._makeTubeCurve(this._warmthAmount);
                this.warmthLpNode.frequency.value = 15000 - (this._warmthAmount / 100) * 7000;
            } else {
                this.warmthNode.curve = new Float32Array([-1, 1]); // bypass linear
                this.warmthLpNode.frequency.value = 24000;
            }
            
            // ── ROUTING ──
            this.source.connect(this.phaseSplitter);
            this.phaseMerger.connect(this.inputGain);
            this.inputGain.connect(this.fxInput);
            this.fxOutput.connect(this.eqInGain);
            
            this.eqInGain.connect(this._eqNodes[0]);
            for (let i = 0; i < 9; i++) {
                this._eqNodes[i].connect(this._eqNodes[i + 1]);
            }
            this._eqNodes[9].connect(this.warmthNode);
            this.warmthNode.connect(this.warmthLpNode);
            this.warmthLpNode.connect(this.compressorNode);
            
            // Split to Reverb (Dry and Wet)
            this.compressorNode.connect(this.reverbDryGain);
            this.compressorNode.connect(this.reverbNode);
            this.reverbNode.connect(this.reverbWetGain);
            
            // Recombine at Stereo Width
            this.reverbDryGain.connect(this.widthMatrix.input);
            this.reverbWetGain.connect(this.widthMatrix.input);
            
            // 4. Master Gain
            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.value = this._volumeGain;

            // 4.2 Auto-Gain Leveling Amplifier (RMS Leveling)
            this.agcNode = this.ctx.createDynamicsCompressor();
            this.agcNode.threshold.value = -24;
            this.agcNode.knee.value = 20;
            this.agcNode.ratio.value = this._autoGain ? 2.5 : 1;
            this.agcNode.attack.value = 0.5; // Slow attack
            this.agcNode.release.value = 1.0; // Slow release
            
            this.agcMakeup = this.ctx.createGain();
            this.agcMakeup.gain.value = this._autoGain ? 2.0 : 1.0; // Approx +6dB makeup

            // 4.5. Hard Limiter
            this.limiterNode = this.ctx.createDynamicsCompressor();
            this.limiterNode.threshold.value = -0.5;
            this.limiterNode.ratio.value = 20;
            this.limiterNode.knee.value = 0;
            this.limiterNode.attack.value = 0.002;
            this.limiterNode.release.value = 0.1;

            // 5. Analyser
            this.analyserNode = this.ctx.createAnalyser();
            this.analyserNode.fftSize = 128;
            this.analyserNode.smoothingTimeConstant = 0.85;
            
            // Final Output chain
            this.widthMatrix.output.connect(this.pannerNode);
            this.pannerNode.connect(this.agcNode);
            this.agcNode.connect(this.agcMakeup);
            this.agcMakeup.connect(this.gainNode);
            this.gainNode.connect(this.limiterNode);
            
            // 4.6. Native Volume Sync Gain
            this.nativeVolumeGain = this.ctx.createGain();
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            this.nativeVolumeGain.gain.value = (video && video.muted) ? 0 : (video ? video.volume : 1);
            
            this.limiterNode.connect(this.nativeVolumeGain);
            this.nativeVolumeGain.connect(this.analyserNode);
            
            // Chain to AudioCompressor if it is active, otherwise go straight to destination
            if (video && video.__ypp_ext_compressor) {
                this.analyserNode.connect(video.__ypp_ext_compressor.input);
                video.__ypp_ext_compressor.output.connect(this.ctx.destination);
            } else {
                this.analyserNode.connect(this.ctx.destination);
            }
            
            this.utils?.log?.('[YPP:Equaliser] AudioContext and Reverb initialized successfully', 'Equaliser');
            this._audioConnected = true;
            this._restoreAudioState();
            this.setCrossfeed(this._crossfeedEnabled);
            this.setReverbEnvironment(this._reverbEnv);
            this.setReverbMix(this._reverbMix);
        } catch (error) {
            this.utils?.log?.('[YPP:Equaliser] Audio graph build failed: ' + error.message, 'Equaliser', 'error');
        }
    }



    /**
     * Restores all internal audio states (gains, mono, etc.) to the graph.
     * Useful when re-enabling or after initial graph construction.
     */
    _restoreAudioState() {
        if (this._bypassed) {
            if (this.gainNode) this.gainNode.gain.setTargetAtTime(1, this.ctx.currentTime, 0.05);
            if (this.pannerNode) this.pannerNode.pan.setTargetAtTime(0, this.ctx.currentTime, 0.05);
            if (this.widthMatrix) this.widthMatrix.widthGain.gain.setTargetAtTime(1, this.ctx.currentTime, 0.05);
            this.setMono(false, true); // Use internal bypass param if added, or just rely on state
            if (this.compressorNode) {
                this.compressorNode.ratio.value = 1;
                this.compressorNode.threshold.value = 0;
            }
            this._eqNodes.forEach((n) => { 
                if (n) n.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05); 
            });
            if (this.setWarmth) this.setWarmth(0, true);
            if (this.setReverbMix) this.setReverbMix(0, true);
            if (this.setFX) this.setFX('none', true);
            if (this.setVinylMode) this.setVinylMode(false, true);
            return;
        }

        this.setVolume(this._volumeGain);
        this.setBalance(this._balance);
        this.setWidth(this._stereoWidth);
        this.setMono(this._monoEnabled);
        this._applyCompressorState();
        this.setWarmth(this._warmthAmount || 0);
        this.setReverbMix(this._reverbMix);
        if (this.setFX) this.setFX(this._activeFX);
        if (this.setVinylMode) this.setVinylMode(this._vinylMode);
        
        // Restore EQ gains safely
        this._eqNodes.forEach((n, i) => { 
            if (n) n.gain.setTargetAtTime(this._eqGains[i], this.ctx.currentTime, 0.05); 
        });
    }



    setVolume(multiplier) {
        this._volumeGain = multiplier;
        if (this._proxyCmd('setVolume', multiplier)) return;
        if (this._bypassed) return;
        // FIX Bug 2: Only use _needsAudioGraph as lazy-init guard (not in enable/onVideoChange)
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || window.YPP.DOMManager?.getVideo();
            if (video) this.initAudioContext(video);
        }
        if (this.gainNode && this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch((e) => {
                    this.utils?.log?.('[YPP:Equaliser] setVolume resume failed: ' + e.message, 'Equaliser', 'info');
                });
            }
            // Ramp gracefully to avoid audio clipping/clicks
            this.gainNode.gain.setTargetAtTime(multiplier, this.ctx.currentTime, 0.05);
        }
    }







    // Removed duplicate setBypass

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

    createButton(initialVideo) {
        const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff">
            <path d="M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z"/>
        </svg>`;
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = 'Equalizer';
        btn.className = 'ypp-action-btn';
        btn.id = 'ypp-volume-boost-btn';
        btn.dataset.vbId = this._id;
        this.addListener(btn, 'click', (e) => {
            e.stopPropagation();
            if (EqualiserUI) {
                const activeVideo = initialVideo || this._boundVideo || window.YPP.DOMManager?.getVideo();
                if (activeVideo && (!this._audioConnected || this._boundVideo !== activeVideo)) {
                    this.initAudioContext(activeVideo);
                }
                
                try {
                    EqualiserUI.toggleEQPanel(this, activeVideo, btn);
                } catch (err) {
                    this.utils?.log?.('[YPP:Equaliser] ERROR in toggleEQPanel: ' + err.message, 'Equaliser', 'error');
                }
            } else {
                this.utils?.log?.('[YPP:Equaliser] EqualiserUI is undefined', 'Equaliser', 'error');
            }
        });

        return btn;
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

Object.assign(Equaliser.prototype, AudioEQMixin);
Object.assign(Equaliser.prototype, AudioDynamicsMixin);
Object.assign(Equaliser.prototype, AudioSpatialMixin);
Object.assign(Equaliser.prototype, AudioFXMixin);

window.YPP.features.Equaliser = Equaliser;
