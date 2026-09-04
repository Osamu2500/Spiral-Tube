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
        
        // Elements
        const display = document.createElement('span');
        display.className = 'ypp-vsc-speed-display'; // Fix class name to match CSS!
        display.textContent = '1.00';

        const ICONS = {
            rewind: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>`,
            slower: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 13H5v-2h14v2z"/></svg>`,
            faster: `<svg viewBox="0 24 24" fill="currentColor" width="18" height="18"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
            advance: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>`,
            close: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>`
        };

        const formatKey = (key) => key ? key.replace('Shift+', '⇧') : '';
        const step = this.vsc.settings?.vscSpeedStep ?? 0.25;

        const getShortcutKey = (action) => {
            const sc = this.vsc.shortcuts.getShortcuts().find(s => s.action === action);
            return sc ? sc.key : '';
        };

        const btnRewind = this.createButton(ICONS.rewind, `Rewind 10s (${formatKey(getShortcutKey('rewind'))})`, () => { video.currentTime -= 10; });
        const btnSlower = this.createButton(ICONS.slower, `Slower -${step}x (${formatKey(getShortcutKey('decrease'))})`, () => this.vsc.adjustSpeed(video, -step));
        const btnFaster = this.createButton(ICONS.faster, `Faster +${step}x (${formatKey(getShortcutKey('increase'))})`, () => this.vsc.adjustSpeed(video, step));
        const btnAdvance = this.createButton(ICONS.advance, `Advance 10s (${formatKey(getShortcutKey('advance'))})`, () => { video.currentTime += 10; });
        const btnClose = this.createButton(ICONS.close, `Hide Controller (${formatKey(getShortcutKey('showHide'))})`, () => { controller.style.display = 'none'; });
        btnClose.classList.add('ypp-vsc-close');

        // Assemble
        container.appendChild(display);
        container.appendChild(btnRewind);
        container.appendChild(btnSlower);
        container.appendChild(btnFaster);
        container.appendChild(btnAdvance);
        container.appendChild(btnClose);
        
        // Apply Opacity
        const opacity = this.vsc.settings?.vscControllerOpacity ?? 0.3;
        container.style.opacity = opacity;
        // Increase opacity on hover
        this.vsc.addListener(container, 'mouseenter', () => container.style.opacity = '1');
        this.vsc.addListener(container, 'mouseleave', () => container.style.opacity = opacity);

        controller.appendChild(container);

        // Generate unique class name for this video's controller (instead of anchorName)
        const controllerClass = `ypp-vsc-${Math.random().toString(36).substr(2, 9)}`;
        controller.classList.add(controllerClass);
        
        // Ensure absolute positioning
        controller.style.position = 'absolute';
        controller.style.zIndex = '9999999';

        // Append to parent element so it naturally flows with fullscreen video
        const parent = video.parentElement || document.body;
        parent.insertBefore(controller, video.nextSibling || video);
        
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let startX, startY;

        const updateTransform = () => {
            controller.style.setProperty('--ypp-vsc-x', `${translateX}px`);
            controller.style.setProperty('--ypp-vsc-y', `${translateY}px`);
        };

        this.vsc.addListener(display, 'mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            e.preventDefault(); // prevent text selection
            controller.style.transition = 'none'; // Disable transition during drag
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                controller.style.transition = ''; // Restore CSS transitions
            }
        };

        this.vsc.addListener(window, 'mousemove', onMouseMove);
        this.vsc.addListener(window, 'mouseup', onMouseUp);

        // Store state
        this.vsc.controllers.set(video, {
            element: controller,
            display: display,
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
        
        // Listen to document for mouse events because video players often have complex overlays
        // In iframes, moving the mouse anywhere should reveal the controls.
        // Listen to the video container instead of document to prevent UI showing when reading other parts of the site
        const videoContainer = video.parentElement || video;
        if (videoContainer) {
            this.vsc.addListener(videoContainer, 'mousemove', triggerShow);
            this.vsc.addListener(videoContainer, 'click', () => { 
                this.vsc._lastActiveVideo = video; 
                triggerShow();
            });
        }
        
        // Also listen to the controller itself so it doesn't hide while hovered
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
        btn.title = title;
        this.vsc.addListener(btn, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        });
        btn.onmousedown = (e) => e.stopPropagation();
        return btn;
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
