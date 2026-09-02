export class SmartCaptions {
    constructor(parent) {
        this.parent = parent;
        this.lastSpeedChangeTime = 0;
        this.originalSpeed = null;
    }

    initSmartCaptions() {
        this.lastSpeedChangeTime = 0;
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('study-mode-captions', '.ytp-caption-segment', () => {
                if (!this.parent.config.forceSubtitles) return;
                
                const captionContainer = document.querySelector('.ytp-caption-window-container');
                if (!captionContainer) return;
                
                const text = captionContainer.textContent.trim();
                const video = window.YPP.DOMManager?.getVideo();
                if (!video) return;

                const now = Date.now();
                if (now - this.lastSpeedChangeTime < 2000) return;

                if (text.length > 80) {
                    if (this.originalSpeed === null) {
                        this.originalSpeed = video.playbackRate;
                        const newSpeed = Math.max(0.25, this.originalSpeed - 0.15);
                        
                        video.playbackRate = newSpeed;
                        this.lastSpeedChangeTime = now;
                        window.dispatchEvent(new CustomEvent('ypp-vsc-force-speed', {
                            detail: { enabled: true, speed: newSpeed }
                        }));
                    }
                } else {
                    if (this.originalSpeed !== null) {
                        video.playbackRate = this.originalSpeed;
                        this.lastSpeedChangeTime = now;
                        window.dispatchEvent(new CustomEvent('ypp-vsc-force-speed', {
                            detail: { enabled: true, speed: this.originalSpeed }
                        }));
                        this.originalSpeed = null;
                    }
                }
            }, false);
        }
    }
}
