import '../../../../core/system/base-feature.js';
/**
 * @fileoverview
 * Zen Mode Feature
 * 
 * Target: /watch route.
 * Purpose: Reduces distractions on the Watch Page and adds an ambient glow effect
 * and spatial audio.
 * 
 * Refactored for performance: Cached DOM elements, optimized canvas operations.
 */

export class ZenMode extends window.YPP.features.BaseFeature {
    static featureId = 'zenMode';
    static executionPhase = 'idle';
    static priority = 999;
    static isManagedExternally = true;

    getConfigKey() { return 'zenMode'; }
    
    constructor() {
        super('zenMode');
        this.CONSTANTS = window.YPP.CONSTANTS || {};
        this.Utils = window.YPP.Utils || {};
        
        // State
        this.zenToastShown = false;
        this.ambientActive = false;
        this.animationFrame = null;
        
        // V2 Features
        this.audioContext = null;
        this.delayNode = null;
        this.gainNode = null;
        
        // Cached Elements
        this.canvas = null;
        this.ctx = null;
        this.videoElement = null;
        this.playerElement = null;

        // Configuration
        this.FPS = 30; // Increased to 30 FPS since we removed CPU readback
        this.FRAME_INTERVAL = 1000 / this.FPS;
        this.CANVAS_SIZE = 16; // Small resolution for blur base

        // Bindings
        this._loop = this._loop.bind(this);
    }

    async enable() {
        await super.enable();
        
        const isWatchPage = location.pathname === '/watch';
        if (isWatchPage) {
            this._applyAmbientMode();
            
            // Show toast notification once per session
            if (!this.zenToastShown) {
                this.Utils.createToast?.('Zen Mode Enabled (V2)');
                this.zenToastShown = true;
            }
            this._enableAudioSpatialization();
        }
    }

    async disable() {
        this.zenToastShown = false;
        this._disableAudioSpatialization();
        this._removeAmbientMode();
        
        await super.disable();
    }

    async onPageChange() {
        if (!this.isEnabled) return;
        
        // Re-acquire elements after navigation
        this._clearCache();
        const isWatchPage = location.pathname === '/watch';
        
        if (isWatchPage) {
            this._applyAmbientMode(); // Restart/Refresh loop
            this._enableAudioSpatialization();
        } else {
            this._disableAudioSpatialization();
            this._removeAmbientMode();
        }
    }
    
    async onUpdate() {
        if (this.isEnabled && location.pathname === '/watch') {
            this._applyAmbientMode();
            this._enableAudioSpatialization();
        }
    }

    _clearCache() {
        this.videoElement = null;
        this.playerElement = null;
    }

    async autoCinema() {
        // Obsolete legacy function
        // watch-manager.js now explicitly handles the theater-mode override css class
    }

    async _applyAmbientMode() {
        if (this.ambientActive) return;
        this.ambientActive = true;

        this._initCanvas();
        this.lastUpdate = 0;
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('zen-mode-player', 'ytd-player, #player-container-outer, .html5-video-player', (elements) => {
                const player = elements[0];
                const video = document.querySelector('video');
                if (player && video && this.ambientActive) {
                    this.playerElement = player;
                    this.videoElement = video;
                    if (!this.animationFrame) {
                        this.animationFrame = requestAnimationFrame(this._loop);
                    }
                }
            }, true);
        } else {
            // Fallback
            this.playerElement = document.querySelector('ytd-player') || document.querySelector('.html5-video-player');
            this.videoElement = document.querySelector('video');
            if (this.playerElement && this.videoElement) {
                this.animationFrame = requestAnimationFrame(this._loop);
            }
        }
    }

    _initCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.CANVAS_SIZE;
            this.canvas.height = this.CANVAS_SIZE;
            this.canvas.id = 'ypp-zen-glow-canvas';
            this.canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                filter: blur(100px);
                opacity: 0.6;
                z-index: -1;
                pointer-events: none;
                transform: scale(1.1);
                transition: opacity 0.5s ease;
            `;
            this.ctx = this.canvas.getContext('2d', { alpha: false });
        }
        
        // Ensure it's in the DOM behind the player
        if (this.playerElement && !document.getElementById('ypp-zen-glow-canvas')) {
            this.playerElement.style.position = 'relative';
            this.playerElement.style.zIndex = '0';
            this.playerElement.insertBefore(this.canvas, this.playerElement.firstChild);
        }
    }

    _loop(timestamp) {
        if (!this.ambientActive) return;

        if (!document.hidden) {
            if (timestamp - this.lastUpdate > this.FRAME_INTERVAL) {
                this.lastUpdate = timestamp;
                
                // Ensure canvas is attached
                this._initCanvas();
                
                // Cache Video Element (fallback if poller missed it or it changed)
                if (!this.videoElement || !this.videoElement.isConnected) {
                    this.videoElement = document.querySelector('video');
                }

                const video = this.videoElement;
                if (video && !video.paused && !video.ended && video.readyState >= 2 && this.ctx) {
                    try {
                        this.ctx.drawImage(video, 0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
                    } catch (e) {}
                }
            }
        }

        this.animationFrame = requestAnimationFrame(this._loop);
    }

    _removeAmbientMode() {
        this.ambientActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('zen-mode-player');
        }

        // Clean up canvas robustly
        if (this.canvas) {
            this.canvas.style.opacity = '0';
            const canvasToRemove = this.canvas;
            this.canvas = null;
            this.ctx = null;
            setTimeout(() => {
                if (canvasToRemove && canvasToRemove.parentNode) {
                    canvasToRemove.remove();
                }
            }, 500);
        }
        
        // Clear references
        this.videoElement = null;
        this.playerElement = null;
    }

    // =========================================================================
    // ZEN MODE V2 - AUDIO SPATIALIZATION
    // =========================================================================

    _enableAudioSpatialization() {
        const video = document.querySelector('video');
        if (!video || window.YPP.zenAudioInitialized) return;
        
        try {
            window.YPP.zenAudioInitialized = true;
            window.YPP.audioContext = window.YPP.audioContext || new (window.AudioContext || window.webkitAudioContext)();
            
            if (!window.YPP.audioSource) {
                window.YPP.audioSource = window.YPP.audioContext.createMediaElementSource(video);
            }
            
            this.audioContext = window.YPP.audioContext;
            
            // Create a Delay node to simulate room reflections
            this.delayNode = this.audioContext.createDelay();
            this.delayNode.delayTime.value = 0.04; // 40ms delay for small room feel
            
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 0.25; // 25% wet mix
            
            // Route: Source -> Delay -> Gain -> Destination
            window.YPP.audioSource.connect(this.delayNode);
            this.delayNode.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            // Re-connect original dry signal
            window.YPP.audioSource.connect(this.audioContext.destination);
            
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        } catch (e) {
            this.Utils?.log('Failed to init Zen Audio Spatialization', 'ZEN', 'warn');
        }
    }

    _disableAudioSpatialization() {
        if (this.delayNode && this.gainNode) {
            try {
                this.delayNode.disconnect();
                this.gainNode.disconnect();
                window.YPP.audioSource.disconnect(this.delayNode);
            } catch (e) {}
            this.delayNode = null;
            this.gainNode = null;
            window.YPP.zenAudioInitialized = false;
        }
        
        // IMPORTANT FIX: Never suspend the GLOBAL audio context as it breaks other features!
        // Instead, just disconnect our nodes (handled above).
        this.audioContext = null; 
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.ZenMode = ZenMode;
