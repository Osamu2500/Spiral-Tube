export function bindEvents(ctx, signal) {
    bindPlaybackControls(ctx, signal);
    bindVolumeControls(ctx, signal);
    bindSpeedControls(ctx, signal);
    bindWindowControls(ctx, signal);
    bindKeyboardControls(ctx, signal);
    setupIdleTimer(ctx, signal);
}

function bindPlaybackControls(ctx, signal) {
    const playBtn = ctx._uiElements?.playBtn || ctx.barElement.querySelector('#ypp-gpb-play');
    playBtn.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        const primary = ctx._getPrimaryVideo();
        if (!primary) return;
        
        if (primary.paused) {
            primary.play().catch(err => window.YPP.Utils?.log('Play prevented: ' + err.message, 'GlobalBarUI', 'debug'));
        } else {
            primary.pause();
        }
        ctx.updateUIState();
    }, { signal });

    const loopBtn = ctx._uiElements?.loopBtn || ctx.barElement.querySelector('#ypp-gpb-loop');
    loopBtn.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        const primary = ctx._getPrimaryVideo();
        if (!primary) return;
        
        primary.loop = !primary.loop;
        ctx.updateUIState();
    }, { signal });
}

function bindVolumeControls(ctx, signal) {
    const muteBtn = ctx._uiElements?.muteBtn || ctx.barElement.querySelector('#ypp-gpb-mute');
    muteBtn.addEventListener('click', (e) => { 
        e.stopPropagation();
        let isAllMuted = true;
        for (const v of ctx.trackedVideos) {
            if (!v.muted && v.volume > 0) isAllMuted = false;
        }
        for (const v of ctx.trackedVideos) {
            v.muted = !isAllMuted;
        }
        ctx.updateUIState();
    }, { signal });

    const volSlider = ctx._uiElements?.volSlider || ctx.barElement.querySelector('#ypp-gpb-vol');
    volSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        for (const v of ctx.trackedVideos) {
            if (val <= 1.0) {
                v.volume = val;
                v.muted = val === 0;
                if (v._proxy) v.volumeBoostGain = 1.0;
            } else {
                v.volume = 1.0;
                v.muted = false;
                if (v._proxy) v.volumeBoostGain = val;
            }
        }
        
        // Native context
        const volFeature = window.YPP?.featureManager?.getFeature?.('volumeBoost');
        if (volFeature) {
            volFeature.setVolume(val <= 1.0 ? 1.0 : val);
        }
        ctx.updateUIState();
    }, { signal });
}

function bindSpeedControls(ctx, signal) {
    const speedBtn = ctx._uiElements?.speedBtn || ctx.barElement.querySelector('#ypp-gpb-speed');
    if (!speedBtn) return;
    
    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const primary = ctx._getPrimaryVideo();
        if (!primary) return;
        // Basic cycle logic: 1.0 -> 1.5 -> 2.0 -> 1.0
        const current = primary.playbackRate;
        let next = 1.0;
        if (current < 1.5) next = 1.5;
        else if (current < 2.0) next = 2.0;
        else next = 1.0;
        
        for (const v of ctx.trackedVideos) {
            v.playbackRate = next;
        }
        ctx.updateUIState();
        // Notify domain memory to persist the speed change
        window.YPP?.featureManager?.getFeature?.('domainMemory')?.recordChange?.('speed');
    }, { signal });

    speedBtn.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const primary = ctx._getPrimaryVideo();
        if (!primary) return;
        
        // Adjust speed by 0.05
        const delta = Math.sign(e.deltaY) * -0.05;
        let next = Math.max(0.1, Math.min(16.0, primary.playbackRate + delta));
        next = Math.round(next * 100) / 100; // Snap to 2 decimals
        
        for (const v of ctx.trackedVideos) {
            v.playbackRate = next;
        }
        ctx.updateUIState();
        // Notify domain memory to persist the speed change (debounced)
        window.YPP?.featureManager?.getFeature?.('domainMemory')?.recordChange?.('speed');
    }, { passive: false, signal });
}

function bindWindowControls(ctx, signal) {
    const pipBtn = ctx.barElement.querySelector('#ypp-gpb-pip');
    if (pipBtn) {
        pipBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    const primary = ctx._getPrimaryVideo();
                    if (primary) await primary.requestPictureInPicture();
                }
            } catch (_) {}
        }, { signal });
    }

    const fullscreenBtn = ctx._uiElements?.fullscreenBtn || ctx.barElement.querySelector('#ypp-gpb-fullscreen');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            try {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    const primary = ctx._getPrimaryVideo();
                    if (primary) primary.requestFullscreen();
                }
            } catch (_) {}
        }, { signal });
    }

    const closeBtn = ctx.barElement.querySelector('#ypp-gpb-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (ctx.onDismiss) ctx.onDismiss();
            ctx.removeAll();
        }, { signal });
    }
}

function bindKeyboardControls(ctx, signal) {
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in an input
        if (e.target.closest('input, textarea, [contenteditable="true"]')) return;
        
        const primary = ctx._getPrimaryVideo();
        if (!primary) return;

        // Isolation: Only intercept if focused on body/html or the video itself
        if (e.target.tagName !== 'BODY' && e.target.tagName !== 'HTML' && e.target !== primary) return;

        switch (e.code) {
            case 'Space':
                // Many sites already handle Space, so only prevent if we are sure it's not handled.
                e.preventDefault();
                if (primary.paused) primary.play().catch(()=>{});
                else primary.pause();
                ctx.updateUIState();
                break;
            case 'KeyM':
                e.preventDefault();
                const willMute = !primary.muted;
                for (const v of ctx.trackedVideos) v.muted = willMute;
                ctx.updateUIState();
                break;
            case 'KeyF':
                e.preventDefault();
                try {
                    if (document.fullscreenElement) document.exitFullscreen();
                    else primary.requestFullscreen();
                } catch (_) {}
                break;
        }
    }, { signal });
}

export function wakeUpBar(ctx, e) {
    if (e && e.type === 'mousemove') {
        if (e.movementX === 0 && e.movementY === 0) return;
    }
    
    // Do not wake up the bar if it's explicitly hidden (e.g. fullscreen)
    if (ctx._uiStateCache && ctx._uiStateCache.shouldHideBar) return;

    const bar = ctx.barElement;
    if (!bar) return;

    bar.style.opacity = '1';
    bar.classList.remove('ypp-gpb-idle');
    clearTimeout(ctx._idleTimeout);
    
    ctx._idleTimeout = setTimeout(() => {
        const primary = ctx._getPrimaryVideo();
        // Only hide if a video is actually playing and we aren't hovering the bar
        if (primary && !primary.paused && !bar.matches(':hover')) {
            bar.style.opacity = '0';
            bar.classList.add('ypp-gpb-idle');
        }
    }, 2500);
}

function setupIdleTimer(ctx, signal) {
    const bar = ctx.barElement;
    if (!bar) return;

    // Ensure transition is set for smooth fading
    bar.style.transition = 'opacity 0.3s ease';

    bar.addEventListener('mousemove', ctx._boundWakeUpBar, { signal, passive: true });
    bar.addEventListener('mouseenter', ctx._boundWakeUpBar, { signal });
    bar.addEventListener('mouseleave', ctx._boundWakeUpBar, { signal });
    
    window.addEventListener('message', (e) => {
        if (e.data?.ypp && e.data.type === 'iframe-mousemove') ctx._boundWakeUpBar();
    }, { signal });
    
    // Initial timer start
    ctx._boundWakeUpBar();
}
