import '../../../../core/system/base-feature.js';
// @ts-nocheck

export class SnapshotButton extends window.YPP.features.BaseFeature {
    static featureId = 'snapshotButton';
    static executionPhase = 'idle';
    static priority = 999;
    static playerBarConfig = { pbKey: 'pb_snapshot', overrideKey: 'enableSnapshot', order: 10 };

    constructor() {
        super('SnapshotButton');
        this._isRecording = false;
        this._pressTimer = null;
        this._mediaRecorder = null;
        this._recordedChunks = [];
        this._recordingStartTime = 0;
        this._indicator = null;
    }

    getConfigKey() {
        return 'enableSnapshot';
    }

    createButton(video) {
        const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM9 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l.59-.65L9.88 4h4.24l1.24 1.35.59.65H20v12zM12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-8c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>`;
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = 'Take Snapshot (Click) / Record Snippet (Hold)';
        btn.className = 'ypp-action-btn';
        
        // Use pointer events for hold-to-record
        this.addListener(btn, 'pointerdown', (e) => {
            if (e.button !== 0) return; // Only left click
            this._startPress(video);
        });

        this.addListener(btn, 'pointerup', (e) => {
            if (e.button !== 0) return;
            this._endPress(video);
        });

        this.addListener(btn, 'pointerleave', () => {
            if (this._pressTimer || this._isRecording) {
                this._endPress(video);
            }
        });

        // Prevent context menu or default drag
        this.addListener(btn, 'contextmenu', (e) => e.preventDefault());
        
        return btn;
    }

    _startPress(video) {
        this._isRecording = false;
        
        this._pressTimer = setTimeout(() => {
            this._startRecording(video);
        }, 400); // Hold for 400ms to start recording
    }

    _endPress(video) {
        if (this._pressTimer) {
            clearTimeout(this._pressTimer);
            this._pressTimer = null;
        }

        if (this._isRecording) {
            this._stopRecording(video);
        } else {
            // It was a quick click
            this.takeSnapshot(video);
        }
    }

    _startRecording(video) {
        if (!video) return;
        try {
            // Attempt to capture stream
            const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
            if (!stream) throw new Error('Capture stream not supported');

            let options = { mimeType: 'video/webm; codecs=vp9' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm; codecs=vp8' };
            }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm' };
            }

            this._mediaRecorder = new MediaRecorder(stream, options);
            this._recordedChunks = [];
            
            this._mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    this._recordedChunks.push(e.data);
                }
            };
            
            this._mediaRecorder.onstop = () => {
                this._downloadRecording();
            };

            this._mediaRecorder.start();
            this._isRecording = true;
            this._recordingStartTime = Date.now();
            this._showRecordingIndicator(video);
        } catch (e) {
            this._showErrorToast('Cannot record snippet. Video is restricted by cross-origin (CORS) rules or DRM protection.');
            this._isRecording = false;
        }
    }

    _stopRecording(video) {
        this._isRecording = false;
        this._hideRecordingIndicator();
        
        if (this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
            this._mediaRecorder.stop();
        }
    }

    _downloadRecording() {
        if (this._recordedChunks.length === 0) return;
        
        const duration = ((Date.now() - this._recordingStartTime) / 1000).toFixed(1);
        const blob = new Blob(this._recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        let title = document.title.replace(/ - YouTube$/, '').trim();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
        const timeStr = `${timestamp[0]}_${timestamp[1].substring(0,6)}`;
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `YPP_Snippet_${duration}s_${title}_${timeStr}.webm`;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this._recordedChunks = [];
        this._showToast(`🎥 Snippet saved (${duration}s)`);
    }

    _showRecordingIndicator(video) {
        const playerContainer = video.closest('.html5-video-player');
        if (!playerContainer) return;

        this._indicator = document.createElement('div');
        this._indicator.style.cssText = `
            position: absolute; top: 24px; left: 24px; z-index: 9999;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
            padding: 8px 16px; border-radius: 20px; color: white;
            font-family: 'Inter', Roboto, sans-serif; font-size: 14px; font-weight: 600;
            display: flex; align-items: center; gap: 8px;
            animation: ypp-pulse 1.5s infinite; border: 1px solid rgba(255,255,255,0.1);
        `;
        this._indicator.innerHTML = `<div style="width:10px;height:10px;background:#ef4444;border-radius:50%;"></div> Recording Snippet...`;
        
        if (!document.getElementById('ypp-recording-styles')) {
            const style = document.createElement('style');
            style.id = 'ypp-recording-styles';
            style.textContent = `@keyframes ypp-pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`;
            document.head.appendChild(style);
        }
        
        playerContainer.appendChild(this._indicator);
    }

    _hideRecordingIndicator() {
        if (this._indicator && this._indicator.parentNode) {
            this._indicator.remove();
            this._indicator = null;
        }
    }

    takeSnapshot(video) {
        if (!video) return;
        
        // Shutter flash animation
        this._playShutterAnimation(video);

        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let targetWidth = video.videoWidth;
        let targetHeight = video.videoHeight;
        
        if (targetWidth > MAX_WIDTH || targetHeight > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / targetWidth, MAX_HEIGHT / targetHeight);
            targetWidth = targetWidth * ratio;
            targetHeight = targetHeight * ratio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        
        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.getImageData(0, 0, 1, 1);
        } catch (e) {
            this._showErrorToast('Cannot capture snapshot. Video is restricted by cross-origin (CORS) rules or DRM protection.');
            return;
        }

        try {
            canvas.toBlob(blob => {
                if (blob) {
                    const item = new window.ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item]).then(() => {
                        this._showSuccessToast(canvas);
                    }).catch(err => {
                        this._showErrorToast('Failed to copy to clipboard: ' + err);
                    });
                }
            }, 'image/png');
        } catch (e) {
            this._showErrorToast('Security error: Cannot copy restricted content.');
        }
    }

    _playShutterAnimation(video) {
        const playerContainer = video.closest('.html5-video-player');
        if (!playerContainer) return;

        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute; inset: 0; z-index: 9999;
            background: white; opacity: 0; pointer-events: none;
            transition: opacity 0.1s ease-out;
        `;
        playerContainer.appendChild(flash);

        flash.offsetHeight;
        flash.style.opacity = '0.8';

        setTimeout(() => {
            flash.style.transition = 'opacity 0.4s ease-in';
            flash.style.opacity = '0';
            setTimeout(() => {
                if (flash.parentNode) flash.remove();
            }, 400);
        }, 100);
    }

    _showSuccessToast(canvas) {
        const toast = document.createElement('div');
        toast.className = 'ypp-toast-snapshot show';
        
        toast.style.cssText = `
            position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px);
            background: rgba(0, 0, 0, 0.85); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
            color: white; padding: 12px 20px; border-radius: 12px; z-index: 999999;
            font-family: 'Inter', Roboto, sans-serif; font-weight: 500; font-size: 14px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1);
            display: flex; align-items: center; gap: 16px;
            opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">📸</span>
                <span>Copied to clipboard</span>
            </div>
            <button class="ypp-snapshot-download-btn" style="
                background: linear-gradient(135deg, #6366f1, #a855f7);
                border: none; border-radius: 6px; color: white; padding: 6px 12px;
                font-size: 12px; font-weight: 600; cursor: pointer;
                transition: transform 0.2s;
            ">Download</button>
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        const btn = toast.querySelector('.ypp-snapshot-download-btn');
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => {
            let title = document.title.replace(/ - YouTube$/, '').trim();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
            const timeStr = `${timestamp[0]}_${timestamp[1].substring(0,6)}`;
            
            const link = document.createElement('a');
            link.download = `YPP_Snapshot_${title}_${timeStr}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            btn.textContent = 'Downloaded!';
        };

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 400);
        }, 5000);
    }

    _showToast(msg) {
        if (window.YPP.utils?.showToast) {
            window.YPP.utils.showToast(msg);
        } else {
            this._showErrorToast(msg, 'rgba(0, 0, 0, 0.8)');
        }
    }

    _showErrorToast(msg, bg = 'rgba(220, 38, 38, 0.9)') {
        if (window.YPP.utils?.showToast && bg === 'rgba(0, 0, 0, 0.8)') {
            window.YPP.utils.showToast(msg);
            return;
        }
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = `position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: ${bg}; color: white; padding: 12px 24px; border-radius: 8px; z-index: 999999; font-family: sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none; transition: opacity 0.5s;`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
};

window.YPP.features.SnapshotButton = SnapshotButton;
