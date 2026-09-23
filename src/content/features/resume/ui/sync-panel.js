export class SyncPanelUI {
    constructor(utils) {
        this.utils = utils;
    }

    show(savedTime, smartTime, videoElement, onCancel) {
        if (document.getElementById('ypp-sync-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'ypp-sync-panel';
        panel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: rgba(15, 15, 15, 0.95);
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Roboto, Arial, sans-serif;
            box-shadow: 0 8px 16px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            width: 280px;
        `;
        
        let seconds = 3;
        let interval;
        
        const updateText = () => {
            const mins = Math.floor(savedTime / 60);
            const secs = Math.floor(savedTime % 60).toString().padStart(2, '0');
            let contextMsg = smartTime < savedTime - 4 ? "(Snapped to chapter)" : "(Rewound 3s for context)";
            panel.innerHTML = `
                <div style="font-weight: 500; font-size: 16px; margin-bottom: 8px; display: flex; align-items: center;">
                    <span style="color: #3ea6ff; margin-right: 8px;">☁️</span> Cloud Sync Detected
                </div>
                <div style="font-size: 13px; margin-bottom: 4px; color: #aaaaaa;">
                    Resuming from ${mins}:${secs} on another device.
                </div>
                <div style="font-size: 11px; margin-bottom: 16px; color: #888;">
                    ${contextMsg}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: #ff4e45;">Resuming in ${seconds}s...</span>
                    <button id="ypp-sync-cancel" style="background: transparent; color: #3ea6ff; border: none; font-size: 14px; font-weight: 500; cursor: pointer; text-transform: uppercase;">Cancel</button>
                </div>
            `;
            
            panel.querySelector('#ypp-sync-cancel').addEventListener('click', () => {
                clearInterval(interval);
                panel.remove();
                this.utils.log?.('Auto-resume cancelled by user', 'RESUMER', 'info');
                if (onCancel) onCancel();
            });
        };
        
        updateText();
        document.body.appendChild(panel); // Extracted, use body
        
        interval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(interval);
                panel.remove();
                if (!videoElement) return;
                
                videoElement.currentTime = smartTime;
                this.utils.log?.(`Resumed at ${smartTime}s`, 'RESUMER');
                if (this.utils.createToast) this.utils.createToast('Playback Resumed', 'info');
            } else {
                updateText();
            }
        }, 1000);
    }
}
