import '../../../../core/system/base-feature.js';
// @ts-nocheck

export class LoopButton extends window.YPP.features.BaseFeature {
    static featureId = 'loopButton';
    static executionPhase = 'idle';
    static priority = 999;
    static playerBarConfig = { pbKey: 'pb_loop', overrideKey: 'enableLoop', order: 9 };

    constructor() {
        super('LoopButton');
    }

    getConfigKey() {
        return 'enableLoop';
    }

    async enable() {
        await super.enable();
        this._injectStyles();
    }

    _injectStyles() {
        if (document.getElementById('ypp-loop-button-styles')) return;
        const style = document.createElement('style');
        style.id = 'ypp-loop-button-styles';
        style.textContent = `
            .ypp-action-btn.ypp-loop-active svg {
                fill: #a855f7 !important;
                filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.6)) !important;
                transform: scale(1.1);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .ypp-action-btn svg {
                transition: all 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }

    createButton(video) {
        const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v6z"/></svg>`;
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = 'Loop Video';
        btn.className = 'ypp-action-btn';
        
        if (this.settings?.loop || video.loop) {
            btn.classList.add('ypp-loop-active');
            video.loop = true;
        }

        this.addListener(btn, 'click', (e) => {
            e.stopPropagation();
            this.toggleLoop(video, btn);
        });
        
        return btn;
    }

    toggleLoop(video, btn) {
        if (!video) return;
        
        video.loop = !video.loop;
        
        if (video.loop) {
            btn.classList.add('ypp-loop-active');
            this._showToast('Loop enabled');
        } else {
            btn.classList.remove('ypp-loop-active');
            this._showToast('Loop disabled');
        }
    }

    _showToast(msg) {
        if (window.YPP.utils?.showToast) {
            window.YPP.utils.showToast(msg);
        } else {
            const toast = document.createElement('div');
            toast.textContent = msg;
            toast.style.cssText = 'position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.8); color: white; padding: 12px 24px; border-radius: 8px; z-index: 999999; font-family: sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none; transition: opacity 0.5s;';
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 500);
            }, 2000);
        }
    }
};

window.YPP.features.LoopButton = LoopButton;
