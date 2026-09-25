/**
 * Video Speed Controller: UI
 * Handles the creation, attachment, and event binding of the custom on-screen 
 * speed controller interface that overlays HTML5 video/audio elements.
 */
export class VscUI {
    constructor(vsc) {
        this.vsc = vsc;
    }

    attachToVideo(video) {
        if (this.vsc.controllers.has(video)) return;
        if (!video.isConnected) return;
        if (video.hasAttribute('data-ypp-vsc-attached')) return;
        video.setAttribute('data-ypp-vsc-attached', 'true');

        this.vsc.utils?.log('Attaching VSC to video', 'VSC');

        const controller = document.createElement('ypp-vsc-controller');

        // UI Container
        const container = document.createElement('div');
        container.className = 'ypp-vsc-panel';
        
        // Controls Row
        const controlsRow = document.createElement('div');
        controlsRow.className = 'ypp-vsc-controls-row';

        // Elements
        const displayWrapper = document.createElement('div');
        displayWrapper.className = 'ypp-vsc-display-wrapper';
        displayWrapper.setAttribute('data-ypp-tooltip', 'Click to reset to 1.0x (Drag to move)');

        const ICONS = {
            grip: `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
            rewind: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>`,
            slower: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 13H5v-2h14v2z"/></svg>`,
            faster: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
            advance: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>`,
            close: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>`
        };

        const dragHandle = document.createElement('span');
        dragHandle.className = 'ypp-vsc-drag-handle';
        dragHandle.innerHTML = ICONS.grip;

        const display = document.createElement('span');
        display.className = 'ypp-vsc-speed-display';
        display.textContent = '1.00';

        displayWrapper.appendChild(dragHandle);
        displayWrapper.appendChild(display);

        const formatKey = (key) => key ? key.replace('Shift+', '⇧') : '';
        const defaultStep = this.vsc.settings?.vscSpeedStep ?? 0.25;
        const fineStep = 0.05;

        const getShortcutKey = (action) => {
            const sc = this.vsc.shortcuts.getShortcuts().find(s => s.action === action);
            return sc ? sc.key : '';
        };

        const updateInteraction = () => {
            const state = this.vsc.controllers.get(video);
            if (state) state.lastInteraction = Date.now();
        };

        const btnRewind = this.createButton(ICONS.rewind, `Rewind 10s (${formatKey(getShortcutKey('rewind'))})`, (e) => { updateInteraction(); video.currentTime -= 10; });
        const btnSlower = this.createButton(ICONS.slower, `Slower (Hold Shift for fine adjust)`, (e) => { 
            updateInteraction(); 
            this.vsc.adjustSpeed(video, -(e.shiftKey ? fineStep : defaultStep)); 
        });
        const btnFaster = this.createButton(ICONS.faster, `Faster (Hold Shift for fine adjust)`, (e) => { 
            updateInteraction(); 
            this.vsc.adjustSpeed(video, e.shiftKey ? fineStep : defaultStep); 
        });
        const btnAdvance = this.createButton(ICONS.advance, `Advance 10s (${formatKey(getShortcutKey('advance'))})`, (e) => { updateInteraction(); video.currentTime += 10; });
        const btnClose = this.createButton(ICONS.close, `Hide Controller (${formatKey(getShortcutKey('showHide'))})`, (e) => { updateInteraction(); controller.style.display = 'none'; });
        btnClose.classList.add('ypp-vsc-close');

        // Presets Row
        const presetsRow = document.createElement('div');
        presetsRow.className = 'ypp-vsc-presets-row';
        const presetSpeeds = [1.0, 1.5, 2.0, 2.5, 3.0];
        const presetElements = [];
        
        presetSpeeds.forEach(speed => {
            const presetBtn = document.createElement('button');
            presetBtn.className = 'ypp-vsc-preset-btn';
            presetBtn.textContent = speed.toFixed(1) + 'x';
            presetBtn.dataset.speed = speed;
            presetBtn.setAttribute('data-ypp-tooltip', `Set speed to ${speed}x`);
            this.vsc.addListener(presetBtn, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateInteraction();
                this.vsc.setSpeed(video, speed);
                this.showOSDFlash(video, speed.toFixed(2) + 'x');
            });
            presetElements.push(presetBtn);
            presetsRow.appendChild(presetBtn);
        });

        // Assemble Controls Row
        controlsRow.appendChild(displayWrapper);
        controlsRow.appendChild(btnRewind);
        controlsRow.appendChild(btnSlower);
        controlsRow.appendChild(btnFaster);
        controlsRow.appendChild(btnAdvance);
        controlsRow.appendChild(btnClose);
        
        container.appendChild(controlsRow);
        container.appendChild(presetsRow);
        
        // Apply Opacity
        const opacity = this.vsc.settings?.vscControllerOpacity ?? 0.3;
        container.style.opacity = opacity;
        // Increase opacity on hover
        this.vsc.addListener(container, 'mouseenter', () => container.style.opacity = '1');
        this.vsc.addListener(container, 'mouseleave', () => container.style.opacity = opacity);

        controller.appendChild(container);

        const controllerClass = `ypp-vsc-${Math.random().toString(36).substr(2, 9)}`;
        controller.classList.add(controllerClass);
        
        // Ensure absolute positioning
        controller.style.position = 'absolute';
        controller.style.zIndex = '9999999';

        // Append to parent element so it naturally flows with fullscreen video
        const parent = video.parentElement || document.body;
        parent.insertBefore(controller, video.nextSibling || video);
        
        // Load saved position
        let translateX = 0;
        let translateY = 0;
        if (this.vsc.settings?.vscPositionX !== undefined) {
            translateX = this.vsc.settings.vscPositionX;
            translateY = this.vsc.settings.vscPositionY;
        }
        
        let isDragging = false;
        let startX, startY;

        const updateTransform = () => {
            controller.style.setProperty('--ypp-vsc-x', `${translateX}px`);
            controller.style.setProperty('--ypp-vsc-y', `${translateY}px`);
        };
        updateTransform();

        // Reset speed on clicking the number
        let dragHasMoved = false;
        
        this.vsc.addListener(displayWrapper, 'mousedown', (e) => {
            isDragging = true;
            dragHasMoved = false;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            e.preventDefault(); // prevent text selection
            controller.style.transition = 'none'; // Disable transition during drag
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;
            dragHasMoved = true;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        };

        const onMouseUp = (e) => {
            if (isDragging) {
                isDragging = false;
                controller.style.transition = ''; // Restore CSS transitions
                
                // Save position to memory
                if (dragHasMoved) {
                    chrome.runtime.sendMessage({ action: 'PATCH_SETTINGS', payload: { 
                        vscPositionX: translateX, 
                        vscPositionY: translateY 
                    } }, () => {});
                } else if (e.target === display || e.target === displayWrapper || e.target === dragHandle || dragHandle.contains(e.target)) {
                    // It was a click, not a drag. Reset speed.
                    updateInteraction();
                    this.vsc.setSpeed(video, 1.0);
                    this.showOSDFlash(video, '1.00x');
                }
            }
        };

        this.vsc.addListener(window, 'mousemove', onMouseMove);
        this.vsc.addListener(window, 'mouseup', onMouseUp);

        // Store state
        this.vsc.controllers.set(video, {
            element: controller,
            display: display,
            presets: presetElements,
            manualHide: false,
            hideTimeout: null,
            fightbackCount: 0,
            fightbackTimer: null,
            lastInteraction: 0,
            cleanup: () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            }
        });

        // Initialize speed from memory
        const savedSpeed = (this.vsc.settings.vscRememberSpeed !== false && this.vsc.settings.vscLastSpeed) ? this.vsc.settings.vscLastSpeed : 1.0;
        if (savedSpeed !== 1.0) {
            this.vsc.setSpeed(video, savedSpeed);
        }

        // Event Listeners for UI state
        this.vsc.addListener(video, 'ratechange', (e) => this.vsc.handleRateChange(video, e));

        const triggerShow = () => {
            if (this.vsc.settings?.vscHideByDefault) return;
            this.showController(video);
            this.hideControllerDelay(video);
        };

        // UI auto-hide logic for external websites
        this.vsc.addListener(video, 'play', () => {
            this.vsc._lastActiveVideo = video;
            triggerShow();
        });
        this.vsc.addListener(video, 'pause', triggerShow);
        
        const videoContainer = video.parentElement || video;
        if (videoContainer) {
            this.vsc.addListener(videoContainer, 'mousemove', triggerShow);
            this.vsc.addListener(videoContainer, 'click', () => { 
                this.vsc._lastActiveVideo = video; 
                triggerShow();
            });
        }
        
        this.vsc.addListener(controller, 'mouseenter', () => {
            this.showController(video);
            if (this.vsc.controllers.has(video)) {
                const state = this.vsc.controllers.get(video);
                if (state.hideTimeout) {
                    clearTimeout(state.hideTimeout);
                    state.hideTimeout = null;
                }
            }
        });
        this.vsc.addListener(controller, 'mouseleave', () => this.hideControllerDelay(video));

        if (this.vsc.settings?.vscHideByDefault) {
            controller.style.display = 'none';
            controller.classList.add('ypp-vsc-hidden');
        } else {
            this.hideControllerDelay(video);
        }
    }

    createButton(html, title, onClick) {
        const btn = document.createElement('button');
        btn.className = 'ypp-vsc-btn';
        btn.innerHTML = html;
        btn.setAttribute('data-ypp-tooltip', title);
        this.vsc.addListener(btn, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
        });
        btn.addEventListener('mousedown', (e) => e.stopPropagation());
        return btn;
    }

    updateSpeedDisplay(video, speed) {
        const state = this.vsc.controllers.get(video);
        if (!state) return;
        
        state.display.textContent = speed.toFixed(2);
        
        if (state.presets) {
            state.presets.forEach(btn => {
                if (parseFloat(btn.dataset.speed) === parseFloat(speed.toFixed(1))) {
                    btn.classList.add('ypp-vsc-active');
                } else {
                    btn.classList.remove('ypp-vsc-active');
                }
            });
        }
    }

    showOSDFlash(video, text) {
        const state = this.vsc.controllers.get(video);
        if (!state) return;

        let osd = video.parentElement.querySelector('.ypp-vsc-osd');
        if (!osd) {
            osd = document.createElement('div');
            osd.className = 'ypp-vsc-osd';
            video.parentElement.insertBefore(osd, video.nextSibling || video);
        }

        osd.textContent = text;
        
        // Retrigger animation
        osd.classList.remove('ypp-vsc-osd-show');
        void osd.offsetWidth; // trigger reflow
        osd.classList.add('ypp-vsc-osd-show');
        
        if (state.osdTimeout) clearTimeout(state.osdTimeout);
        state.osdTimeout = setTimeout(() => {
            osd.classList.remove('ypp-vsc-osd-show');
        }, 800);
    }

    showController(video) {
        const state = this.vsc.controllers.get(video);
        if (!state) return;

        if (state.hideTimeout) {
            clearTimeout(state.hideTimeout);
            state.hideTimeout = null;
        }

        state.element.classList.remove('ypp-vsc-hidden');
        state.element.style.display = ''; // Reset display in case it was closed
    }

    hideControllerDelay(video) {
        // If inside a YouTube player, let native .ytp-autohide handle it
        if (video.closest('.html5-video-player')) return;

        const state = this.vsc.controllers.get(video);
        if (!state) return;

        if (state.hideTimeout) clearTimeout(state.hideTimeout);
        state.hideTimeout = setTimeout(() => {
            state.element.classList.add('ypp-vsc-hidden');
        }, 2500);
    }
}
