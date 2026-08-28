import '../../../../../core/system/base-feature.js';
/**
 * Volume Booster / 10-Band Graphic Equalizer Orchestrator
 * Manages the Web Audio API graph for the active HTML5 video element.
 */

import { VolumeBoosterUI } from './volume-booster-ui.js';
import { EQ_BANDS, EQ_PRESETS } from './constants/eq-presets.js';
import { AudioEQMixin } from './modules/audio-eq.js';
import { AudioDynamicsMixin } from './modules/audio-dynamics.js';
import { AudioSpatialMixin } from './modules/audio-spatial.js';
import { AudioFXMixin } from './modules/audio-fx.js';


export class VolumeBooster extends window.YPP.features.BaseFeature {
    static featureId = 'volumeBoost';
    static executionPhase = 'sequential-ui';
    static priority = 7;

    constructor() {
        super('VolumeBooster');
        this.name = 'VolumeBooster';
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

        // DOM refs
        this._volumePopup = null;
        this._volumePopupOutsideHandler = null;
        this._boundVideo = null;
        this._initHandler = null;

        // Pending init retry timer
        this._initRetryTimer = null;
        // Visibility change handler ref for cleanup
        this._visibilityHandler = null;

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
        if (settings.volumeLevel !== undefined) this._volumeGain = settings.volumeLevel;
        if (settings.volumeBalance !== undefined) this._balance = settings.volumeBalance;
        if (settings.volumeCompressor !== undefined) this._compressorEnabled = settings.volumeCompressor;
        if (settings.volumeCompThreshold !== undefined) this._compThreshold = settings.volumeCompThreshold;
        if (settings.volumeCompRatio !== undefined) this._compRatio = settings.volumeCompRatio;
        if (settings.volumeCompAttack !== undefined) this._compAttack = settings.volumeCompAttack;
        if (settings.volumeCompRelease !== undefined) this._compRelease = settings.volumeCompRelease;
        if (settings.volumeCompKnee !== undefined) this._compKnee = settings.volumeCompKnee;
        if (settings.volumeMono !== undefined) this._monoEnabled = settings.volumeMono;
        if (settings.volumeStereoWidth !== undefined) this._stereoWidth = settings.volumeStereoWidth;
        if (settings.volumeBypassed !== undefined) this._bypassed = settings.volumeBypassed;
        if (settings.volumeActiveEffect !== undefined) this._activeFX = settings.volumeActiveEffect;
        if (settings.volumeVinylMode !== undefined) this._vinylMode = settings.volumeVinylMode;
        if (settings.volumePlaybackRate !== undefined) this._playbackRate = settings.volumePlaybackRate;
        if (settings.volumeReverbEnv !== undefined) this._reverbEnv = settings.volumeReverbEnv;
        if (settings.volumeReverbMix !== undefined) this._reverbMix = settings.volumeReverbMix;
        if (settings.volumeInvertL !== undefined) this._invertL = settings.volumeInvertL;
        if (settings.volumeInvertR !== undefined) this._invertR = settings.volumeInvertR;
        if (settings.volumeAutoGain !== undefined) this._autoGain = settings.volumeAutoGain;
        if (settings.volumeEqBands) {
            try {
                const bands = JSON.parse(settings.volumeEqBands);
                if (Array.isArray(bands) && bands.length === 10) {
                    this._eqGains = bands.map(v => typeof v === 'number' ? v : 0);
                }
            } catch (e) {
                this.utils?.log?.('[YPP:VolumeBooster] Failed to parse EQ bands: ' + e.message, 'VolumeBooster', 'warn');
            }
        }
        if (settings.volumeVisualizerMode !== undefined) {
            this._visualizerMode = settings.volumeVisualizerMode;
        }
        if (settings.volumeCustomPresets) {
            try {
                const custom = JSON.parse(settings.volumeCustomPresets);
                if (typeof custom === 'object' && custom !== null) {
                    this._presets = { ...this._presets, ...custom };
                }
            } catch (e) {
                this.utils?.log?.('[YPP:VolumeBooster] Failed to parse custom presets: ' + e.message, 'VolumeBooster', 'warn');
            }
        }
        if (settings.volumeChannelProfiles) {
            try {
                this._channelProfiles = JSON.parse(settings.volumeChannelProfiles);
            } catch (e) { }
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
            const video = this._boundVideo || document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        
        if (this._audioConnected) {
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
            
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
            
            if (this.agcNode) this.agcNode.ratio.setTargetAtTime(enabled ? 1.0 : (this._autoGain ? 10 : 1), this.ctx.currentTime, 0.05);
            if (this.agcMakeup) this.agcMakeup.gain.setTargetAtTime(enabled ? 1.0 : (this._autoGain ? 4.0 : 1.0), this.ctx.currentTime, 0.05);
            
            if (this._boundVideo) {
                this._boundVideo.preservesPitch = enabled ? true : !this._vinylMode;
                if (this._playbackRate !== 1.0) this._boundVideo.playbackRate = enabled ? 1.0 : this._playbackRate;
            }
        }
    }

    async enable() {
        await super.enable();
        this._loadSettings(this.settings);

        // -- Keyboard Shortcuts --
        this.addListener(document, 'keydown', (e) => {
            if (!this._audioConnected) return;
            if (e.target.matches('input, textarea, [contenteditable]')) return;
            
            let handled = false;
            if (e.altKey && e.code === 'KeyV') {
                e.preventDefault();
                this.setBypass(!this._bypassed);
                this.utils?.log?.('[YPP:VolumeBooster] Toggled Bypass via Hotkey: ' + this._bypassed, 'VolumeBooster');
                handled = true;
            }
            else if (e.altKey && e.code === 'KeyM') {
                e.preventDefault();
                this.setMono(!this._monoEnabled);
                this.utils?.log?.('[YPP:VolumeBooster] Toggled Mono via Hotkey: ' + this._monoEnabled, 'VolumeBooster');
                handled = true;
            }
            
            if (handled && this._volumePopup && VolumeBoosterUI) {
                const anchorBtn = document.querySelector(`#ypp-volume-boost-btn[data-vb-id="${this._id}"]`);
                if (anchorBtn) {
                    VolumeBoosterUI.toggleEQPanel(this, this._boundVideo, anchorBtn);
                    setTimeout(() => VolumeBoosterUI.toggleEQPanel(this, this._boundVideo, anchorBtn), 10);
                }
            }
        });

        // FIX Bug 4: Use waitForElement with a timeout so we don't miss the
        // video element when enable() is called right after SPA navigation
        // before YouTube has rendered the player.
        const findAndInit = async () => {
            let video = document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');

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

    async disable() {
        // Cancel any pending retry timer
        if (this._initRetryTimer) {
            clearTimeout(this._initRetryTimer);
            this._initRetryTimer = null;
        }

        // Remove visibility change handler
        if (this._visibilityHandler) {
            document.removeEventListener('visibilitychange', this._visibilityHandler);
            this._visibilityHandler = null;
        }

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
        if (this._boundVideo && this._initHandler) {
            this._initHandler = null; // release closure reference
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
        const video = document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
        if (video) {
            if (this._audioConnected && this._boundVideo === video) {
                // Same video element reused (YouTube SPA) — just re-apply state
                this._restoreAudioState();
            } else if (!this._audioConnected) {
                this.initAudioContext(video);
            }
        }
    }

    onVideoChange() {
        // Called by FeatureManager when a new videoId is detected (app:videoChange event)
        if (!this.settings || !this.settings.enableVolumeBoost) return;
        this._loadSettings(this.settings);

        const tryInit = async () => {
            let video = document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
            if (!video) {
                try {
                    video = await this.utils.pollFor({
                        target: window.YPP.CONSTANTS.SELECTORS.VIDEO[0] || 'video',
                        maxAttempts: 15,
                        intervalMs: 200
                    });
                } catch (e) {
                    this.utils?.log?.('[YPP:VolumeBooster] Could not find video element on navigation', 'VolumeBooster', 'warn');
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
                    try { this.source.disconnect(); } catch (e) {}
                }
                this._audioConnected = false;
                this.initAudioContext(video);
            }
            
            this._applyChannelProfile();
        };

        tryInit();
    }

    _applyChannelProfile() {
        if (!this._channelProfiles || Object.keys(this._channelProfiles).length === 0) return;
        
        let attempts = 0;
        const currentUrl = window.location.href;
        const tryMatch = () => {
            if (window.location.href !== currentUrl) return; // abort if navigated away
            const el = document.querySelector('ytd-video-owner-renderer ytd-channel-name yt-formatted-string a') || document.querySelector('#owner #channel-name a');
            if (el && el.textContent) {
                const channel = el.textContent.trim();
                const presetName = this._channelProfiles[channel];
                if (presetName && this._presets[presetName]) {
                    this.applyPreset(presetName);
                    this.utils?.log?.(`[YPP:VolumeBooster] Auto-applied preset "${presetName}" for channel "${channel}"`, 'VolumeBooster');
                    // Sync UI if open
                    if (this._volumePopup && VolumeBoosterUI) {
                        const anchorBtn = document.querySelector(`#ypp-volume-boost-btn[data-vb-id="${this._id}"]`);
                        if (anchorBtn) {
                            VolumeBoosterUI.toggleEQPanel(this, this._boundVideo, anchorBtn);
                            setTimeout(() => VolumeBoosterUI.toggleEQPanel(this, this._boundVideo, anchorBtn), 10);
                        }
                    }
                }
                return;
            }
            if (++attempts < 10) setTimeout(tryMatch, 500);
        };
        tryMatch();
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
        } catch(e) {}
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
                    this.utils?.log?.('Volume Booster disabled: Cross-Origin Video detected.', 'VolumeBooster', 'warn');
                }
            };
            // Use addListener so it is tracked and cleaned up by disable()
            this.addListener(video, 'loadedmetadata', retryOnMeta, { once: true });
            this.addListener(video, 'canplay', retryOnMeta, { once: true });
            return;
        }

        if (!safeResult) {
            this.utils?.log?.('Volume Booster disabled: Cross-Origin Video detected without CORS.', 'VolumeBooster', 'warn');
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
                try { this.source.disconnect(); } catch (e) {}
            }
            this._audioConnected = false;
        }

        this._boundVideo = video;

        this._initHandler = () => {
            if (this._audioConnected) return;
            try {
                // Safely get or create AudioContext for this video.
                // FIX Bug 3 (companion): Respect __ypp_ctx/__ypp_source set by AudioEQ
                // or AudioCompressor so we don't call createMediaElementSource twice.
                if (video.__ypp_ctx && video.__ypp_source) {
                    this.ctx = video.__ypp_ctx;
                    this.source = video.__ypp_source;
                    // PREVENT AUDIO DOUBLING BUG: Disconnect source before rebuilding the graph
                    try { this.source.disconnect(); } catch (e) {}
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
                    this.ctx.resume().catch(() => {});
                }

                // FIX Bug 6: Resume AudioContext when tab becomes visible again.
                // Chrome/Firefox suspend AudioContext when tabs are backgrounded.
                if (!this._visibilityHandler) {
                    this._visibilityHandler = () => {
                        if (document.visibilityState === 'visible' && this.ctx && this.ctx.state === 'suspended') {
                            this.ctx.resume().catch(() => {});
                        }
                    };
                    document.addEventListener('visibilitychange', this._visibilityHandler);
                }

                // Also heal on user interaction as fallback
                const resumeAudio = () => {
                    if (this.ctx && this.ctx.state === 'suspended') {
                        this.ctx.resume().catch(() => {});
                    }
                    ['click', 'touchstart', 'keydown'].forEach(evt => document.removeEventListener(evt, resumeAudio, true));
                };
                ['click', 'touchstart', 'keydown'].forEach(evt => document.addEventListener(evt, resumeAudio, true));

            } catch (e) {
                this.utils?.log?.('[YPP:VolumeBooster] Audio engine init failed: ' + e.message, 'VolumeBooster', 'warn');
                this._audioConnected = false;
            }
        };

        // FIX Bug 5: Removed { once: true } — _audioConnected guards idempotency.
        // With once:true, the listener was consumed before _isSafeToBoost resolved,
        // leaving no way to retry when the src finally became available.
        this.addListener(video, 'play', this._initHandler);
        this.addListener(video, 'volumechange', this._initHandler);
        if (!video.paused) this._initHandler();
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
            
            // ── ROUTING ──
            this.source.connect(this.phaseSplitter);
            this.phaseMerger.connect(this.inputGain);
            this.inputGain.connect(this.fxInput);
            this.fxOutput.connect(this.eqInGain);
            
            this.eqInGain.connect(this._eqNodes[0]);
            for (let i = 0; i < 9; i++) {
                this._eqNodes[i].connect(this._eqNodes[i + 1]);
            }
            this._eqNodes[9].connect(this.compressorNode);
            
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

            // 4.2 Auto-Gain Leveling Amplifier
            this.agcNode = this.ctx.createDynamicsCompressor();
            this.agcNode.threshold.value = -40;
            this.agcNode.knee.value = 40;
            this.agcNode.ratio.value = this._autoGain ? 10 : 1;
            this.agcNode.attack.value = 0.1;
            this.agcNode.release.value = 0.5;
            
            this.agcMakeup = this.ctx.createGain();
            this.agcMakeup.gain.value = this._autoGain ? 4.0 : 1.0;

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
            this.limiterNode.connect(this.analyserNode);
            
            // Chain to AudioCompressor if it is active, otherwise go straight to destination
            const video = this._boundVideo || document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
            if (video && video.__ypp_ext_compressor) {
                this.analyserNode.connect(video.__ypp_ext_compressor.input);
                video.__ypp_ext_compressor.output.connect(this.ctx.destination);
            } else {
                this.analyserNode.connect(this.ctx.destination);
            }
            
            this.utils?.log?.('[YPP:VolumeBooster] AudioContext and Reverb initialized successfully', 'VolumeBooster');
            this._audioConnected = true;
            this._restoreAudioState();
            this.setReverbEnvironment(this._reverbEnv);
            this.setReverbMix(this._reverbMix);
        } catch (error) {
            this.utils?.log?.('[YPP:VolumeBooster] Audio graph build failed: ' + error.message, 'VolumeBooster', 'error');
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
            return;
        }

        this.setVolume(this._volumeGain);
        this.setBalance(this._balance);
        this.setWidth(this._stereoWidth);
        this.setMono(this._monoEnabled);
        this._applyCompressorState();
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
            const video = this._boundVideo || document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this.gainNode && this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
            // Ramp gracefully to avoid audio clipping/clicks
            this.gainNode.gain.setTargetAtTime(multiplier, this.ctx.currentTime, 0.05);
        }
    }







    setBypass(enabled) {
        this._bypassed = enabled;
        if (!this._audioConnected && this._needsAudioGraph()) {
            const video = this._boundVideo || document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
            if (video) this.initAudioContext(video);
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
        this._restoreAudioState();
    }



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
            if (VolumeBoosterUI) {
                const activeVideo = this._boundVideo || document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
                // Synchronously initialize AudioContext during a guaranteed user gesture (click)
                // This prevents the AudioContext from being created in a 'suspended' state,
                // which would otherwise cause the video to buffer and the audio to mute.
                if (activeVideo && !this._audioConnected) {
                    this.initAudioContext(activeVideo);
                }
                
                VolumeBoosterUI.toggleEQPanel(this, activeVideo, btn);
            }
        });

        return btn;
    }
};

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

Object.assign(VolumeBooster.prototype, AudioEQMixin);
Object.assign(VolumeBooster.prototype, AudioDynamicsMixin);
Object.assign(VolumeBooster.prototype, AudioSpatialMixin);
Object.assign(VolumeBooster.prototype, AudioFXMixin);

window.YPP.features.VolumeBooster = VolumeBooster;
