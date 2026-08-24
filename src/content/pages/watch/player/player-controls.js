/**
 * @fileoverview
 * Player Controls Helper
 * Handles creation and interactions of custom player buttons (Speed, PiP).
 */
const CONSTANTS = {
    SELECTORS: {
        SPEED_CONTROLS: 'ypp-speed-controls',
        SPEED_BTN: 'ypp-speed-btn',
        ACTION_BTN: 'ypp-action-btn',
        ACTIVE_CLASS: 'active'
    },
    ICONS: {
        PIP: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>`
    }
};

export class PlayerControls {
    static featureId = 'playerControls';
    static executionPhase = 'idle';
    static priority = 999;

    constructor(playerFeature) {
        this.player = playerFeature || {};
        if (!this.player.addListener) {
            this.player.addListener = (target, event, handler, options) => {
                target?.addEventListener?.(event, handler, options);
            };
        }
        this.utils = window.YPP.Utils;
    }

    createSpeedControls(video) {
        const container = document.createElement('div');
        container.className = CONSTANTS.SELECTORS.SPEED_CONTROLS;
        
        let html = '';
        ['1', '1.5', '2', '3'].forEach(rate => {
            const isActive = video.playbackRate === parseFloat(rate);
            const activeClass = isActive ? ` ${CONSTANTS.SELECTORS.ACTIVE_CLASS}` : '';
            html += `<button class="${CONSTANTS.SELECTORS.SPEED_BTN}${activeClass}" data-speed="${rate}">${rate}x</button>`;
        });
        container.innerHTML = html;
        
        // Event delegation
        this.player.addListener(container, 'click', (e) => {
            const btn = e.target.closest('.' + CONSTANTS.SELECTORS.SPEED_BTN);
            if (!btn) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const rate = btn.dataset.speed;
            const newSpeed = parseFloat(rate);
            const vsc = window.YPP.featureManager?.getFeature('videoSpeedController');
            
            if (vsc) {
                if (!vsc.controllers.has(video)) vsc.attachToVideo(video);
                vsc.setSpeed(video, newSpeed);
            } else {
                video.playbackRate = newSpeed;
            }
            
            this.updateSpeedButtons(container, rate);
        });
        
        return container;
    }

    createPiPButton(video) {
        const btn = this.createButton(CONSTANTS.ICONS.PIP, 'Picture-in-Picture', async () => {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    await video.requestPictureInPicture();
                }
            } catch (e) {
                this.utils?.log?.('[YPP:PLAYER] PiP failed: ' + e.message, 'PLAYER', 'error');
            }
        });
        this.player.addListener(video, 'enterpictureinpicture', () => btn.classList.add(CONSTANTS.SELECTORS.ACTIVE_CLASS));
        this.player.addListener(video, 'leavepictureinpicture', () => btn.classList.remove(CONSTANTS.SELECTORS.ACTIVE_CLASS));
        return btn;
    }

    createButton(svgContent, title, onClick) {
        const btn = document.createElement('button');
        btn.innerHTML = svgContent;
        btn.title = title;
        btn.setAttribute('aria-label', title);
        btn.tabIndex = 0;
        btn.className = CONSTANTS.SELECTORS.ACTION_BTN;
        
        // Native YouTube tooltip hooks
        btn.dataset.titleNoTooltip = title;
        btn.dataset.tooltipTargetId = "ypp-custom-button";
        
        const actionHandler = (e) => {
            e.stopPropagation();
            onClick(e);
        };
        
        this.player.addListener(btn, 'click', actionHandler);
        this.player.addListener(btn, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                actionHandler(e);
            }
        });
        
        this.player.addListener(btn, 'mouseenter', () => {
            btn.dataset.title = title;
            btn.removeAttribute('title');
        });
        this.player.addListener(btn, 'mouseleave', () => {
            btn.title = title;
            delete btn.dataset.title;
        });

        return btn;
    }

    createGenericToggleButton(svgContent, title, settingKey, currentValue, onChange) {
        const btn = this.createButton(svgContent, title, (e) => {
            const newState = !btn.classList.contains(CONSTANTS.SELECTORS.ACTIVE_CLASS);
            btn.classList.toggle(CONSTANTS.SELECTORS.ACTIVE_CLASS, newState);
            if (window.YPP.Utils && window.YPP.Utils.saveSettings) {
                window.YPP.Utils.saveSettings({ [settingKey]: newState });
            }
            if (onChange) onChange(newState);
        });
        if (currentValue) btn.classList.add(CONSTANTS.SELECTORS.ACTIVE_CLASS);
        return btn;
    }

    updateSpeedButtons(container, activeSpeed) {
        container.querySelectorAll('.' + CONSTANTS.SELECTORS.SPEED_BTN).forEach(b => {
            b.classList.toggle(CONSTANTS.SELECTORS.ACTIVE_CLASS, b.dataset.speed === activeSpeed);
        });
    }
};
