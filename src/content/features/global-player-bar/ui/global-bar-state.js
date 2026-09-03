export function syncSubFeatureButtons(ctx, primary) {
    if (ctx._currentPrimaryVideo === primary) return;
    ctx._currentPrimaryVideo = primary;

    const featsCont = ctx.barElement.querySelector('#ypp-gpb-features-container');
    if (!featsCont || !window.YPP.featureManager) return;

    featsCont.innerHTML = ''; // Clear stale buttons

    if (ctx.settings.gpb_showVolumeBoost !== false) {
        const volFeature = window.YPP.featureManager.getFeature('volumeBoost');
        if (volFeature?.createButton) {
            featsCont.appendChild(volFeature.createButton(primary));
        }
    }
    
    if (ctx.settings.gpb_showFilters !== false) {
        const filterFeature = window.YPP.featureManager.getFeature('videoFilters');
        if (filterFeature?.createButton) {
            featsCont.appendChild(filterFeature.createButton(primary));
        }
    }

    if (ctx.settings.gpb_showDomainMemory !== false) {
        const domainFeature = window.YPP.featureManager.getFeature('domainMemory');
        if (domainFeature?.createButton) {
            featsCont.appendChild(domainFeature.createButton(primary));
        }
    }

    // Hide container if empty to avoid double dividers
    if (featsCont.children.length === 0) {
        featsCont.style.display = 'none';
    } else {
        featsCont.style.display = 'flex';
    }
}

export function updateUIState(ctx) {
    if (!ctx.barElement) return;

    // 1. SPA Survival: If the website replaced the body, our bar is orphaned. Re-inject it.
    if (!ctx.barElement.isConnected) {
        window.YPP.Utils?.log('Global Player Bar was orphaned by SPA. Re-injecting.', 'GlobalBarUI', 'warn');
        document.body.appendChild(ctx.barElement);
        if ('popover' in ctx.barElement && !ctx.barElement.matches(':popover-open')) {
            try { ctx.barElement.showPopover(); } catch(e){}
        }
    }
    
    const primary = ctx._getPrimaryVideo();
    if (!primary) return;

    syncSubFeatureButtons(ctx, primary);

    // Initialize state cache if it doesn't exist
    ctx._uiStateCache = ctx._uiStateCache || {};

    let isAllMuted = true;
    for (const v of ctx.trackedVideos) {
        if (!v.muted && v.volume > 0) isAllMuted = false;
    }

    // Play/Pause
    const playBtn = ctx.barElement.querySelector('#ypp-gpb-play');
    const isPaused = primary.paused;
    if (playBtn && ctx._uiStateCache.paused !== isPaused) {
        playBtn.innerHTML = !isPaused ? ctx.ICONS.pause : ctx.ICONS.play;
        ctx._uiStateCache.paused = isPaused;
    }

    // Mute & Volume
    const muteBtn = ctx.barElement.querySelector('#ypp-gpb-mute');
    const volSlider = ctx.barElement.querySelector('#ypp-gpb-vol');
    if (muteBtn && volSlider) {
        if (ctx._uiStateCache.allMuted !== isAllMuted) {
            muteBtn.innerHTML = isAllMuted ? ctx.ICONS.mute : ctx.ICONS.volumeHigh;
            muteBtn.classList.toggle('active', isAllMuted);
            ctx._uiStateCache.allMuted = isAllMuted;
        }
        const primaryVol = primary.muted ? 0 : primary.volume;
        if (ctx._uiStateCache.volume !== primaryVol) {
            volSlider.value = primaryVol;
            ctx._uiStateCache.volume = primaryVol;
        }
    }

    // Time
    const timeEl = ctx.barElement.querySelector('#ypp-gpb-time');
    if (timeEl) {
        const formatTime = (s) => {
            if (!s || isNaN(s) || s < 0) return "0:00";
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = Math.floor(s % 60).toString().padStart(2, '0');
            if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec}`;
            return `${m}:${sec}`;
        };
        
        const isLive = primary.duration === Infinity || isNaN(primary.duration) || primary.duration === 0;
        const curStr = formatTime(primary.currentTime);
        const totStr = isLive ? "LIVE" : formatTime(primary.duration);
        
        if (ctx._uiStateCache.curStr !== curStr || ctx._uiStateCache.totStr !== totStr) {
            const curSpan = timeEl.querySelector('.ypp-gpb-time-cur');
            const totSpan = timeEl.querySelector('.ypp-gpb-time-tot');
            if (curSpan) curSpan.textContent = curStr;
            if (totSpan) totSpan.textContent = totStr;
            ctx._uiStateCache.curStr = curStr;
            ctx._uiStateCache.totStr = totStr;
        }

        let tooltipStr = `${curStr} / ${totStr}`;
        if (ctx.settings.enableRemainingTime !== false && primary.duration && !isNaN(primary.duration)) {
            const speed = primary.playbackRate || 1;
            const rawLeft = Math.max(0, primary.duration - primary.currentTime);
            const adjustedLeft = rawLeft / speed;
            
            if (rawLeft > 0) {
                if (Math.abs(speed - 1) <= 0.01) {
                    tooltipStr += `\nRemaining: -${formatTime(rawLeft)}`;
                } else if (speed > 1) {
                    const totalSaved = primary.duration - (primary.duration / speed);
                    tooltipStr += `\nRemaining: -${formatTime(adjustedLeft)} (${formatTime(totalSaved)} saved at ${speed}x)`;
                } else {
                    const totalExtra = (primary.duration / speed) - primary.duration;
                    tooltipStr += `\nRemaining: -${formatTime(adjustedLeft)} (${formatTime(totalExtra)} extra at ${speed}x)`;
                }
            }
        }
        if (ctx._uiStateCache.timeTitle !== tooltipStr) {
            timeEl.title = tooltipStr;
            ctx._uiStateCache.timeTitle = tooltipStr;
        }
    }
    
    // Speed
    const speedBtn = ctx.barElement.querySelector('#ypp-gpb-speed');
    const speedText = ctx.barElement.querySelector('#ypp-gpb-speed-text');
    if (speedText) {
        const rate = primary.playbackRate || 1;
        if (ctx._uiStateCache.speed !== rate) {
            speedText.textContent = rate.toFixed(2) + 'x';
            if (speedBtn) {
                speedBtn.classList.toggle('active-speed', Math.abs(rate - 1.0) > 0.01);
            }
            ctx._uiStateCache.speed = rate;
        }
    }

    // Loop
    const loopBtn = ctx.barElement.querySelector('#ypp-gpb-loop');
    if (loopBtn && ctx._uiStateCache.loop !== primary.loop) {
        loopBtn.classList.toggle('active', primary.loop);
        loopBtn.style.opacity = primary.loop ? '1' : '0.5';
        ctx._uiStateCache.loop = primary.loop;
    }

    // Fullscreen
    let isFs = !!document.fullscreenElement;
    
    if (!isFs) {
        for (const v of ctx.trackedVideos) {
            if (v.isConnected) {
                if (v.getBoundingClientRect) {
                    const rect = v.getBoundingClientRect();
                    // Fake fullscreen detection: video takes up >98% of the viewport
                    if (rect.width >= window.innerWidth * 0.98 && rect.height >= window.innerHeight * 0.98) {
                        isFs = true;
                        break;
                    }
                } else if (v._proxy && v._capabilities) {
                    // If it's a proxy, we rely on document.fullscreenElement (checked above)
                    // Or if the iframe passes a specific fullscreen flag in the future
                    if (v._capabilities.isFullscreen) {
                        isFs = true;
                        break;
                    }
                }
            }
        }
    }
    
    if (ctx._uiStateCache.fullscreen !== isFs) {
        const fullscreenBtn = ctx.barElement.querySelector('#ypp-gpb-fullscreen');
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = isFs
                ? `<svg viewBox="0 0 36 36" fill="currentColor"><path d="m 5.390625,8 v 18.179687 h 25.21875 V 8 Z m 2.019531,2.009765 H 28.589844 V 24.169922 H 7.410156 Z M 19.45325,22.331983 h 1.762511 V 19.688214 H 23.85953 V 17.925702 H 19.45325 Z M 14.784019,14.491472 H 12.14025 v 1.762512 h 4.406281 v -4.40628 h -1.762512 z m 0,5.196743 H 12.14025 v -1.762512 h 4.406281 v 4.40628 h -1.762512 z m 4.669231,-7.840512 h 1.762511 v 2.643769 h 2.643769 v 1.762512 h -4.40628 z"/></svg>`
                : ctx.ICONS.fullscreen;
        }
        ctx._uiStateCache.fullscreen = isFs;
    }

    const hasValidSrc = primary._proxy ? true : !!(primary.src || primary.currentSrc || primary.srcObject || (primary.querySelector && primary.querySelector('source')));
    const isActive = !primary.ended && hasValidSrc;
    const shouldHideBar = isFs || !isActive;

    // If the video is paused, force the bar to wake up from idle
    if (primary.paused) {
        ctx.barElement.style.opacity = '1';
        ctx.barElement.classList.remove('ypp-gpb-idle');
    }

    if (ctx._uiStateCache.shouldHideBar !== shouldHideBar) {
        if (shouldHideBar) {
            ctx.barElement.style.setProperty('opacity', '0', 'important');
            ctx.barElement.style.setProperty('pointer-events', 'none', 'important');
        } else {
            ctx.barElement.style.removeProperty('pointer-events');
            // The idle timer handles opacity when it's not explicitly hidden
            ctx.barElement.style.opacity = ctx.barElement.classList.contains('ypp-gpb-idle') ? '0' : '1';
        }
        ctx._uiStateCache.shouldHideBar = shouldHideBar;
    }
}
