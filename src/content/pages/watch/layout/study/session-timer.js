export class SessionTimer {
    constructor(parent) {
        this.parent = parent;
        this.sessionStart = null;
        this.sessionTimer = null;
        this.elapsedSeconds = 0;
    }

    startSessionTimer() {
        if (!this.sessionStart) {
            this.sessionStart = Date.now() - (this.elapsedSeconds * 1000);
        }
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        this.sessionTimer = setInterval(() => {
            if (document.hidden) return;
            const video = document.querySelector('video');
            if (video && !video.paused) {
                this.elapsedSeconds++;
                if (this.parent.speedPanel && this.parent.speedPanel.timerDisplay) {
                    this.parent.speedPanel.timerDisplay.textContent = this._formatTime(this.elapsedSeconds);
                }
                
                // Pomodoro 25-min check (1500 seconds)
                if (this.elapsedSeconds > 0 && this.elapsedSeconds % 1500 === 0) {
                    video.pause();
                    this._showBreakNotification();
                }
            }
        }, 1000);
    }

    _showBreakNotification() {
        if (document.getElementById('ypp-study-break-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'ypp-study-break-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px);
            z-index: 999999; display: flex; align-items: center; justify-content: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: rgba(30, 30, 30, 0.9); border: 1px solid rgba(74, 222, 128, 0.3);
            border-radius: 16px; padding: 32px; width: 340px; text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); font-family: 'Inter', sans-serif;
            color: #fff;
        `;

        const pomodoros = Math.floor(this.elapsedSeconds / 1500);

        modal.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 12px;">🍅</div>
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #4ade80;">Pomodoro Completed!</div>
            <div style="font-size: 14px; color: #aaa; margin-bottom: 24px;">You've studied for ${pomodoros * 25} minutes. Take a 5 minute break.</div>
            <button id="ypp-break-dismiss" style="
                width: 100%; padding: 12px; border-radius: 8px; border: none; background: rgba(74, 222, 128, 0.2);
                color: #4ade80; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s;
            " onmouseover="this.style.background='rgba(74, 222, 128, 0.3)'" onmouseout="this.style.background='rgba(74, 222, 128, 0.2)'">Resume Study Session</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('ypp-break-dismiss').onclick = () => {
            overlay.remove();
        };
    }

    stopSessionTimer() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
    }

    _formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
