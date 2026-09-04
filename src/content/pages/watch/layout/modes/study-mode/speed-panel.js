export class SpeedPanel {
    constructor(parent) {
        this.parent = parent;
        this.speedPanel = null;
        this.controlBtn = null;
        this.timerDisplay = null;
    }

    injectSpeedControl() {
        if (window.YPP && window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('study-mode-controls', '.ytp-right-controls', (elements) => {
                const rightControls = elements[0];
                this._createButtonInControls(rightControls);
            }, true);
        }
    }

    _createButtonInControls(rightControls) {
        if (!rightControls || document.getElementById('ypp-study-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'ypp-study-btn';
        btn.className = 'ytp-button';
        btn.title = 'Study Mode Speed';
        btn.innerHTML = `<span style="font-size: 13px; font-weight: 500; color: #3ea6ff;">${this.parent.config.speed}x</span>`;
        btn.onclick = (e) => {
            e.stopPropagation();
            this.toggleSpeedPanel();
        };

        rightControls.insertBefore(btn, rightControls.firstChild);
        this.controlBtn = btn;
    }

    toggleSpeedPanel() {
        if (this.speedPanel) {
            this.removeSpeedPanel();
        } else {
            this.createSpeedPanel();
        }
    }

    createSpeedPanel() {
        const panel = document.createElement('div');
        panel.id = 'ypp-study-panel';
        panel.style.cssText = `
            position: absolute;
            bottom: 60px;
            right: 24px;
            background: rgba(5, 5, 5, 0.75);
            backdrop-filter: blur(32px) saturate(180%);
            -webkit-backdrop-filter: blur(32px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            padding: 16px;
            border-radius: 20px;
            z-index: 6000;
            width: 280px;
            color: #fff;
            font-family: 'Inter', Roboto, sans-serif;
            animation: ypp-spring-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            will-change: transform, opacity;
        `;

        if (!document.getElementById('ypp-study-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ypp-study-keyframes';
            style.textContent = `
                @keyframes ypp-spring-up {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        const titleRow = document.createElement('div');
        titleRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;';
        
        const title = document.createElement('div');
        title.textContent = '📚 Study Mode';
        title.style.cssText = 'font-size: 15px; font-weight: 500;';
        
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.textContent = this.parent.sessionTimerManager._formatTime(this.parent.sessionTimerManager.elapsedSeconds);
        this.timerDisplay.style.cssText = 'font-size: 13px; font-weight: 500; color: #4ade80; background: rgba(74, 222, 128, 0.15); padding: 4px 8px; border-radius: 6px; font-variant-numeric: tabular-nums;';
        
        titleRow.appendChild(title);
        titleRow.appendChild(this.timerDisplay);
        panel.appendChild(titleRow);

        const presetsContainer = document.createElement('div');
        presetsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px;';
        
        this.parent.SPEED_PRESETS.forEach(speed => {
            const btn = document.createElement('button');
            btn.textContent = `${speed}x`;
            btn.style.cssText = `
                background: ${this.parent.config.speed === speed ? 'rgba(62, 166, 255, 0.3)' : 'rgba(255,255,255,0.1)'};
                border: 1px solid ${this.parent.config.speed === speed ? '#3ea6ff' : 'rgba(255,255,255,0.2)'};
                color: #fff;
                padding: 6px 4px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            `;
            btn.onclick = () => this.setSpeed(speed);
            presetsContainer.appendChild(btn);
        });
        panel.appendChild(presetsContainer);

        const sliderLabel = document.createElement('div');
        sliderLabel.textContent = '🎚️ Custom Speed';
        sliderLabel.style.cssText = 'font-size: 12px; color: #ddd; margin-bottom: 8px;';
        panel.appendChild(sliderLabel);

        const sliderRow = document.createElement('div');
        sliderRow.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 12px;';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0.25';
        slider.max = '3.0';
        slider.step = '0.05';
        slider.value = this.parent.config.speed;
        slider.style.cssText = 'flex: 1; cursor: pointer;';

        const speedValue = document.createElement('span');
        speedValue.textContent = `${this.parent.config.speed}x`;
        speedValue.style.cssText = 'font-size: 12px; color: #3ea6ff; font-weight: 500; min-width: 40px;';

        slider.oninput = (e) => {
            const newSpeed = parseFloat(e.target.value);
            speedValue.textContent = `${newSpeed}x`;
            this.setSpeed(newSpeed);
        };

        sliderRow.appendChild(slider);
        sliderRow.appendChild(speedValue);
        panel.appendChild(sliderRow);

        const divider = document.createElement('div');
        divider.style.cssText = 'height: 1px; background: rgba(255,255,255,0.1); margin: 12px 0;';
        panel.appendChild(divider);

        const captionToggle = document.createElement('div');
        captionToggle.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 0;';
        
        const captionLabel = document.createElement('span');
        captionLabel.textContent = '📝 Auto Captions';
        captionLabel.style.cssText = 'font-size: 12px;';

        const toggleSwitch = document.createElement('input');
        toggleSwitch.type = 'checkbox';
        toggleSwitch.checked = this.parent.config.enableCaptions;
        toggleSwitch.style.cursor = 'pointer';
        toggleSwitch.onchange = (e) => {
            this.parent.config.enableCaptions = e.target.checked;
            this.parent.saveConfig();
            if (this.parent.config.enableCaptions) {
                this.parent._enableCaptions();
            }
        };

        captionToggle.appendChild(captionLabel);
        captionToggle.appendChild(toggleSwitch);
        panel.appendChild(captionToggle);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: transparent;
            border: none;
            color: #aaa;
            font-size: 24px;
            cursor: pointer;
            width: 20px;
            height: 20px;
            line-height: 16px;
            padding: 0;
        `;
        closeBtn.onclick = () => this.removeSpeedPanel();
        panel.appendChild(closeBtn);

        const container = document.getElementById('movie_player') || document.body;
        container.appendChild(panel);
        this.speedPanel = panel;
    }

    removeSpeedPanel() {
        if (this.speedPanel) {
            this.speedPanel.remove();
            this.speedPanel = null;
        }
    }

    removeUI() {
        if (this.controlBtn) {
            this.controlBtn.remove();
            this.controlBtn = null;
        }
        this.removeSpeedPanel();
    }

    setSpeed(speed) {
        this.parent.config.speed = speed;
        this.parent.saveConfig();
        
        const video = window.YPP.DOMManager?.getVideo();
        if (video) {
            video.playbackRate = speed;
        }

        if (this.controlBtn) {
            this.controlBtn.innerHTML = `<span style="font-size: 13px; font-weight: 500; color: #3ea6ff;">${speed}x</span>`;
        }

        if (this.speedPanel) {
            this.removeSpeedPanel();
            this.createSpeedPanel();
        }
    }
}
