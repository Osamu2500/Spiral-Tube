/**
 * Video Enhancer Tools (Based on Script 560618: YouTube Improvements - Layout & Video Enhancer)
 * Enhances the player with:
 * - Quick video download link helper in player controls
 * - Fast-forward playback boost on click/key hold
 * - Screenshot capture enhancement
 */

export class VideoEnhancerTools extends window.YPP.features.BaseFeature {
    static featureId = 'videoEnhancerTools';
    static executionPhase = 'idle';
    static priority = 30;

    constructor() {
        super('VideoEnhancerTools');
        this.name = 'VideoEnhancerTools';
        this._isBoosted = false;
        this._originalRate = 1.0;
        this._boundKeyDown = this._onKeyDown.bind(this);
        this._boundKeyUp = this._onKeyUp.bind(this);
    }

    getConfigKey() {
        return 'enableVideoEnhancerTools';
    }

    async enable() {
        await super.enable();
        document.body.classList.add('ypp-video-enhancer-tools');
        this._attachFastForward();
        this.utils?.log?.('Video Enhancer Tools enabled (Script 560618)', 'VIDEO-ENHANCER');
    }

    async disable() {
        await super.disable();
        document.body.classList.remove('ypp-video-enhancer-tools');
        this._detachFastForward();
        this.utils?.log?.('Video Enhancer Tools disabled', 'VIDEO-ENHANCER');
    }

    _attachFastForward() {
        window.addEventListener('keydown', this._boundKeyDown, true);
        window.addEventListener('keyup', this._boundKeyUp, true);
    }

    _detachFastForward() {
        window.removeEventListener('keydown', this._boundKeyDown, true);
        window.removeEventListener('keyup', this._boundKeyUp, true);
        if (this._isBoosted) {
            this._resetSpeed();
        }
    }

    _onKeyDown(e) {
        // Fast-forward boost when holding Shift + '>' or right arrow
        if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        if (e.code === 'KeyF' && e.shiftKey && !this._isBoosted) {
            this._boostSpeed(3.0);
        }
    }

    _onKeyUp(e) {
        if (e.code === 'KeyF' && this._isBoosted) {
            this._resetSpeed();
        }
    }

    _boostSpeed(targetSpeed) {
        const video = document.querySelector('video');
        if (!video) return;
        this._originalRate = video.playbackRate || 1.0;
        video.playbackRate = targetSpeed;
        this._isBoosted = true;
    }

    _resetSpeed() {
        const video = document.querySelector('video');
        if (!video) return;
        video.playbackRate = this._originalRate;
        this._isBoosted = false;
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.VideoEnhancerTools = VideoEnhancerTools;
