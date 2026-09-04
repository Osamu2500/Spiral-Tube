import '../../../../../core/system/base-feature.js';
import { SpeedPanel } from './speed-panel.js';
import { SessionTimer } from './session-timer.js';
import { SmartCaptions } from './smart-captions.js';
import { NotePanel } from './note-panel.js';

/**
 * @fileoverview
 * Study Mode Feature - Optimized playback for learning
 * Target: /watch route.
 * Purpose: Custom playback speed, auto captions logic, and learning-focused controls (notes, timer).
 */
export class StudyMode extends window.YPP.features.BaseFeature {
    static featureId = 'studyMode';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'studyMode'; }
    
    constructor() {
        super('StudyMode');
        
        // Configuration
        this.config = {
            speed: this.settings?.studySpeed || 1.0,
            enableCaptions: this.settings?.studyCaptions || false
        };
        
        this.SPEED_PRESETS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
        
        // Sub-managers
        this.speedPanel = new SpeedPanel(this);
        this.sessionTimerManager = new SessionTimer(this);
        this.smartCaptionsManager = new SmartCaptions(this);
        this.notePanel = new NotePanel(this);
        
        this._visibilityHandler = this._onVisibilityChange.bind(this);
        
        this.loadConfig();
    }

    enable() {
        try {
            this.utils?.createToast(`Study Mode: ${this.config.speed}x Speed ${this.config.enableCaptions ? '+ Captions' : ''}`);

            this._boundEnforceState = () => this._enforceState();

            if (window.YPP && window.YPP.sharedObserver) {
                window.YPP.sharedObserver.register('study-mode-video', 'video', (elements) => {
                    const video = elements[0];
                    if (video) {
                        video.removeEventListener('ratechange', this._boundEnforceState);
                        this.addListener(video, 'ratechange', this._boundEnforceState);
                        this._enforceState();
                    }
                }, true);
            }

            this.speedPanel.injectSpeedControl();
            this.sessionTimerManager.startSessionTimer();
            this.addListener(document, 'visibilitychange', this._visibilityHandler);
            this.notePanel.injectNotePanel();
            this.smartCaptionsManager.initSmartCaptions();
        } catch (error) {
            this.utils?.log(`Error enabling study mode: ${error.message}`, 'STUDY', 'error');
        }
    }

    async disable() {
        await super.disable();

        try {
            if (window.YPP && window.YPP.sharedObserver) {
                window.YPP.sharedObserver.unregister('study-mode-video');
                window.YPP.sharedObserver.unregister('study-mode-controls');
                window.YPP.sharedObserver.unregister('study-mode-captions');
            }

            const video = window.YPP.DOMManager?.getVideo();
            if (video && this._boundEnforceState) {
                video.removeEventListener('ratechange', this._boundEnforceState);
            }

            this.speedPanel.removeUI();

            if (video?.playbackRate === this.config.speed) {
                video.playbackRate = 1.0;
                this.utils?.createToast('Study Mode Disabled');
            }

            this.sessionTimerManager.stopSessionTimer();
            this.notePanel.removeNotePanel();
        } catch (error) {
            this.utils?.log(`Error disabling study mode: ${error.message}`, 'STUDY', 'error');
        }
    }

    async onVideoChange(videoId) {
        if (!this.isEnabled) return;
        
        try {
            const rightControls = await this.utils.waitForElement('.ytp-right-controls', 5000);
            if (rightControls) {
                this.speedPanel._createButtonInControls(rightControls);
            }
            
            const video = await this.utils.waitForElement('video', 5000);
            if (video && this._boundEnforceState) {
                video.removeEventListener('ratechange', this._boundEnforceState);
                this.addListener(video, 'ratechange', this._boundEnforceState);
                this._enforceState();
            }

            await this.notePanel.injectNotePanel();
            if (this.notePanel.notesPanel) {
                this.notePanel.loadNotes();
            }
        } catch (e) {}
    }

    _enforceState() {
        try {
            const video = window.YPP.DOMManager?.getVideo();
            if (video) {
                if (video.playbackRate !== this.config.speed) {
                    video.playbackRate = this.config.speed;
                }
                if (this.config.enableCaptions) {
                    this._enableCaptions();
                }
            }
        } catch (error) {}
    }

    _enableCaptions() {
        try {
            const subtitlesBtn = document.querySelector('.ytp-subtitles-button');
            if (subtitlesBtn?.getAttribute('aria-pressed') === 'false') {
                subtitlesBtn.click();
            }
        } catch (error) {}
    }

    async loadConfig() {
        try {
            const configData = await window.YPP.StorageManager.get('ypp_study_mode');
            if (configData) {
                this.config = { ...this.config, ...configData };
            }
        } catch (error) {
            this.utils?.log('Failed to load config: ' + error.message, 'STUDY', 'error');
        }
    }

    async saveConfig() {
        try {
            await window.YPP.StorageManager.set('ypp_study_mode', this.config);
        } catch (error) {
            this.utils?.log('Failed to save config: ' + error.message, 'STUDY', 'error');
        }
    }

    _onVisibilityChange() {
        const video = window.YPP.DOMManager?.getVideo();
        if (!video) return;

        if (document.hidden) {
            if (!video.paused) {
                this._wasPlayingBeforeHide = true;
                video.pause();
                this.utils?.log('Study Mode: Auto-paused video', 'STUDY');
            }
        } else {
            if (this._wasPlayingBeforeHide) {
                video.play();
                this._wasPlayingBeforeHide = false;
                this.utils?.log('Study Mode: Auto-resumed video', 'STUDY');
            }
        }
    }
}
