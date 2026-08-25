import '../../../../core/system/base-feature.js';
export class IntentionalDelay extends window.YPP.features.BaseFeature {
    static featureId = 'intentionalDelay';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('IntentionalDelay');
        this._boundCheck = this._onPageChange.bind(this);
        this._overlay = null;
        this._activeVideoId = null;
        this._rafId = null;
    }

    getConfigKey() { return 'intentionalDelay'; }

    async enable() {
        await super.enable();
        this._onPageChange();
        window.YPP.events?.on('page:changed', this._boundCheck);
        this._injectStyles();
    }

    async disable() {
        await super.disable();
        this._removeOverlay();
        window.YPP.events?.off('page:changed', this._boundCheck);
    }

    _injectStyles() {
        if (document.getElementById('ypp-intentional-delay-styles')) return;
        const style = document.createElement('style');
        style.id = 'ypp-intentional-delay-styles';
        style.textContent = `
            .ypp-id-overlay {
                position: fixed; inset: 0; z-index: 999999;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                opacity: 0;
                transition: opacity 0.5s ease-out;
                font-family: 'Inter', Roboto, sans-serif;
                color: #fff;
            }
            .ypp-id-overlay.ypp-visible { opacity: 1; }
            .ypp-id-content {
                display: flex; flex-direction: column; align-items: center;
                text-align: center;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                padding: 48px;
                box-shadow: 0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
            }
            .ypp-id-breathe-text {
                font-size: 32px; font-weight: 700; margin: 0 0 16px 0;
                background: linear-gradient(135deg, #fff, #a8c0ff);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                animation: ypp-breathe 4s infinite ease-in-out;
            }
            .ypp-id-subtitle {
                font-size: 16px; color: rgba(255,255,255,0.7); margin: 0 0 32px 0;
            }
            @keyframes ypp-breathe {
                0%, 100% { opacity: 0.7; transform: scale(0.98); }
                50% { opacity: 1; transform: scale(1.02); }
            }
            .ypp-id-ring-container {
                position: relative; width: 120px; height: 120px; margin-bottom: 32px;
            }
            .ypp-id-ring {
                transform: rotate(-90deg); transform-origin: 50% 50%;
                width: 100%; height: 100%;
            }
            .ypp-id-ring circle {
                fill: transparent; stroke-width: 6; stroke-linecap: round;
            }
            .ypp-id-ring-bg { stroke: rgba(255,255,255,0.1); }
            .ypp-id-ring-progress {
                stroke: url(#ypp-id-gradient);
                stroke-dasharray: 283; stroke-dashoffset: 283;
            }
            .ypp-id-time-text {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                font-size: 36px; font-weight: 600; font-variant-numeric: tabular-nums;
            }
            .ypp-id-skip {
                padding: 12px 32px; border: none; border-radius: 12px;
                background: linear-gradient(135deg, #6366f1, #a855f7);
                color: #fff; font-size: 16px; font-weight: 600; cursor: pointer;
                opacity: 0; transform: translateY(10px); pointer-events: none;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 8px 24px rgba(99,102,241,0.3);
            }
            .ypp-id-skip.ypp-ready {
                opacity: 1; transform: translateY(0); pointer-events: auto;
            }
            .ypp-id-skip:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.5); }
        `;
        document.head.appendChild(style);
    }

    _onPageChange() {
        if (!this.settings?.intentionalDelay) return;
        if (!location.pathname.startsWith('/watch')) return;
        
        // Skip delay if the video was opened in a background tab
        if (document.hidden) return;
        
        const videoId = new URL(location.href).searchParams.get('v');
        if (!videoId || this._activeVideoId === videoId) return;
        
        this._activeVideoId = videoId;
        this._showOverlay();
    }

    _sendCommand(cmd) {
        const script = document.createElement('script');
        script.textContent = `
            try {
                const player = document.getElementById('movie_player');
                if (player && player.${cmd}) player.${cmd}();
            } catch(e) {}
        `;
        document.body.appendChild(script);
        script.remove();
    }

    _showOverlay() {
        this._removeOverlay();
        
        // Safely pause via native JS context
        this._sendCommand('pauseVideo');

        const duration = this.settings?.intentionalDelayTime ?? 3;

        let sessionStart = sessionStorage.getItem('ypp_watch_session_start');
        if (!sessionStart) {
            sessionStart = Date.now().toString();
            sessionStorage.setItem('ypp_watch_session_start', sessionStart);
        }
        
        const elapsedMinutes = Math.floor((Date.now() - parseInt(sessionStart)) / 60000);
        const isBinge = elapsedMinutes > 90;
        
        let subtitleText = "Is this video intentional, or are you just scrolling?";
        if (isBinge) {
            subtitleText = `You've been watching for over ${elapsedMinutes} minutes. Take a breath and stretch.`;
        }

        this._overlay = document.createElement('div');
        this._overlay.className = 'ypp-id-overlay';
        this._overlay.innerHTML = `
            <div class="ypp-id-content">
                <h2 class="ypp-id-breathe-text">Take a breath.</h2>
                <p class="ypp-id-subtitle">${subtitleText}</p>
                
                <div class="ypp-id-ring-container">
                    <svg class="ypp-id-ring" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="ypp-id-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#6366f1" />
                                <stop offset="100%" stop-color="#a855f7" />
                            </linearGradient>
                        </defs>
                        <circle class="ypp-id-ring-bg" cx="50" cy="50" r="45"></circle>
                        <circle class="ypp-id-ring-progress" cx="50" cy="50" r="45"></circle>
                    </svg>
                    <div class="ypp-id-time-text">${duration}</div>
                </div>

                <button class="ypp-id-skip">Proceed to Video</button>
            </div>
        `;
        document.body.appendChild(this._overlay);
        
        // Trigger fade in
        requestAnimationFrame(() => {
            if (this._overlay) this._overlay.classList.add('ypp-visible');
        });

        const progressEl = this._overlay.querySelector('.ypp-id-ring-progress');
        const textEl = this._overlay.querySelector('.ypp-id-time-text');
        const btn = this._overlay.querySelector('.ypp-id-skip');
        const totalLength = 283; // 2 * pi * 45

        const startTime = performance.now();
        const durationMs = duration * 1000;

        const updateTimer = (currentTime) => {
            if (!this._overlay) return;
            
            const elapsed = currentTime - startTime;
            const remaining = Math.max(0, durationMs - elapsed);
            
            if (remaining > 0) {
                // Update ring
                const progress = elapsed / durationMs;
                progressEl.style.strokeDashoffset = totalLength * (1 - progress);
                
                // Update text
                textEl.textContent = Math.ceil(remaining / 1000);
                
                this._rafId = requestAnimationFrame(updateTimer);
            } else {
                progressEl.style.strokeDashoffset = 0;
                textEl.textContent = "0";
                btn.classList.add('ypp-ready');
                this._rafId = null;
            }
        };

        this._rafId = requestAnimationFrame(updateTimer);

        this.addListener(btn, 'click', () => {
            this._removeOverlay();
            this._sendCommand('playVideo');
        });
    }

    _removeOverlay() {
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        if (this._overlay) {
            const el = this._overlay;
            el.classList.remove('ypp-visible');
            setTimeout(() => {
                if (el && el.parentNode) el.remove();
            }, 500);
            this._overlay = null;
        }
    }
};

window.YPP.features.IntentionalDelay = IntentionalDelay;
