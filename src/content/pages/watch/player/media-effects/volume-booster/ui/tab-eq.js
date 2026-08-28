export class EQTabUI {
    static build(uiState) {
        const { ctx, clearActivePreset, saveSettings, VolumeBoosterUI } = uiState;
        // Determine if global bar based on anchorBtn
        const isGlobalBar = !!uiState.anchorBtn.closest('.ypp-global-player-bar');

        const wrap = document.createElement('div');
        wrap.id = 'ypp-eq-tab-eq';

        // ── Canvas Curve
        const canvasEl = document.createElement('canvas');
        canvasEl.width  = isGlobalBar ? 268 : 308;
        canvasEl.height = isGlobalBar ? 52  : 50;
        canvasEl.className = 'ypp-eq-canvas';
        canvasEl.style.cursor = 'pointer';
        canvasEl.title = 'Click to cycle visualizer modes (Both, Curve, Bars, Waveform, Off)';
        canvasEl.onclick = () => {
            ctx._visualizerMode = ((ctx._visualizerMode || 0) + 1) % 5;
            saveSettings(ctx);
            if (!ctx.analyserNode) VolumeBoosterUI.drawCurve(ctx, canvasEl);
        };
        wrap.appendChild(canvasEl);

        // ── 10-Band Vertical EQ Faders
        const bandsSection = document.createElement('div');
        bandsSection.className = 'ypp-eq-bands';
        const sliderEls = [];
        const dbLabelEls = [];

        ctx._bands.forEach((band, i) => {
            const col = document.createElement('div');
            col.className = 'ypp-eq-band-col';

            const dbLabel = document.createElement('div');
            dbLabel.className = 'ypp-eq-band-db';
            dbLabel.style.color = band.color;
            const cur = ctx._eqGains[i];
            dbLabel.textContent = (cur >= 0 ? '+' : '') + cur;
            dbLabelEls.push(dbLabel);

            const track = document.createElement('div');
            track.className = 'ypp-eq-band-track';

            const centerLine = document.createElement('div');
            centerLine.className = 'ypp-eq-band-center';

            const slider = document.createElement('input');
            slider.type = 'range'; slider.min = -12; slider.max = 12; slider.step = 0.5;
            slider.value = ctx._eqGains[i];
            slider.className = 'ypp-eq-vslider';
            slider.style.setProperty('--band-color', band.color);
            slider.dataset.band = i;
            slider.oninput = (e) => {
                if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
                const db = parseFloat(e.target.value);
                ctx._setEQBand(i, db);
                dbLabel.textContent = (db >= 0 ? '+' : '') + db;
                VolumeBoosterUI.drawCurve(ctx, canvasEl);
                clearActivePreset();
                saveSettings(ctx);
            };
            slider.ondblclick = () => {
                if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
                ctx._setEQBand(i, 0);
                slider.value = 0;
                dbLabel.textContent = '0';
                VolumeBoosterUI.drawCurve(ctx, canvasEl);
                clearActivePreset();
                saveSettings(ctx);
            };
            sliderEls.push(slider);

            const freqLabel = document.createElement('div');
            freqLabel.className = 'ypp-eq-band-freq';
            freqLabel.textContent = band.label;

            track.append(centerLine, slider);
            col.append(dbLabel, track, freqLabel);
            bandsSection.appendChild(col);
        });
        
        wrap.appendChild(bandsSection);
        
        // Pass canvasEl to VolumeBoosterUI so it can draw animations there
        uiState.canvasEl = canvasEl;

        return wrap;
    }
}
