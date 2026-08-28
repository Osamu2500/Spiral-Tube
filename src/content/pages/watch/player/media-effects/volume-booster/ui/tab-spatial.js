export class SpatialTabUI {
    static build(uiState) {
        const { ctx, panel, mkDynRow, saveSettings } = uiState;
        const spaPanel = document.createElement('div');
        spaPanel.id = 'ypp-eq-tab-spa';
        spaPanel.style.cssText = 'padding:16px 18px;display:none;';
        
        const stereoRow = mkDynRow('Stereo Width', 0, 200, 1, Math.round(ctx._stereoWidth * 100), '%', v => {
            if (ctx.setWidth) {
                ctx.setWidth(v / 100);
                saveSettings(ctx);
            }
        });
        spaPanel.appendChild(stereoRow);
        
        const monoRow2 = mkDynRow('Mono Mix', 0, 100, 1, 0, '%', v => {
            if (ctx.setMono) {
                ctx.setMono(v > 50);
                saveSettings(ctx);
            }
        });
        spaPanel.appendChild(monoRow2);
        
        const speedRow = mkDynRow('Playback Speed', 0.25, 2.0, 0.05, ctx._playbackRate || 1.0, 'x', v => {
            if (ctx.setPlaybackRate) {
                ctx.setPlaybackRate(v);
                saveSettings(ctx);
            }
        });
        spaPanel.appendChild(speedRow);
        
        // Reverb Environment
        const envTitle = document.createElement('div');
        envTitle.style.cssText = 'color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;margin:16px 0 8px;';
        envTitle.textContent = 'Spatial Reverb (Synthetic IR)';
        spaPanel.appendChild(envTitle);
        
        const envRow = document.createElement('div');
        envRow.className = 'ypp-eq-presets-row';
        envRow.style.margin = '0';
        const envs = ['None', 'Studio', 'Club', 'Concert Hall', 'Cave'];
        let activeEnvBtn = null;
        envs.forEach(env => {
            const btn = document.createElement('button');
            btn.className = 'ypp-eq-preset-btn';
            btn.textContent = env;
            if (env === (ctx._reverbEnv || 'None')) { btn.classList.add('active'); activeEnvBtn = btn; }
            btn.onclick = () => {
                if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
                if (activeEnvBtn) activeEnvBtn.classList.remove('active');
                btn.classList.add('active');
                activeEnvBtn = btn;
                if (ctx.setReverbEnvironment) ctx.setReverbEnvironment(env);
                saveSettings(ctx);
            };
            envRow.appendChild(btn);
        });
        spaPanel.appendChild(envRow);

        const revMixRow = mkDynRow('Reverb Mix', 0, 100, 1, Math.round((ctx._reverbMix || 0) * 100), '%', v => {
            if (ctx.setReverbMix) {
                ctx.setReverbMix(v / 100);
                saveSettings(ctx);
            }
        });
        spaPanel.appendChild(revMixRow);
        
        // Phase Inversion
        const phaseRow = document.createElement('div');
        phaseRow.style.cssText = 'display:flex; gap:8px; margin-top:16px; align-items:center;';
        
        const phaseLBtn = document.createElement('button');
        phaseLBtn.className = 'ypp-eq-comp-btn' + (ctx._invertL ? ' active' : '');
        phaseLBtn.innerHTML = 'Ø L';
        phaseLBtn.title = 'Invert Left Channel Phase (Fixes hollow audio)';
        phaseLBtn.onclick = () => {
            if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
            ctx.setPhaseInvert('L', !ctx._invertL);
            phaseLBtn.classList.toggle('active', ctx._invertL);
            saveSettings(ctx);
        };

        const phaseRBtn = document.createElement('button');
        phaseRBtn.className = 'ypp-eq-comp-btn' + (ctx._invertR ? ' active' : '');
        phaseRBtn.innerHTML = 'Ø R';
        phaseRBtn.title = 'Invert Right Channel Phase';
        phaseRBtn.onclick = () => {
            if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
            ctx.setPhaseInvert('R', !ctx._invertR);
            phaseRBtn.classList.toggle('active', ctx._invertR);
            saveSettings(ctx);
        };
        
        const phaseLbl = document.createElement('span');
        phaseLbl.style.cssText = 'color:rgba(255,255,255,0.7);font-size:11px; margin-right:8px; flex:1;';
        phaseLbl.textContent = 'Phase Invert';
        
        phaseRow.append(phaseLbl, phaseLBtn, phaseRBtn);
        spaPanel.appendChild(phaseRow);
        panel.addEventListener('ypp-eq-update', () => {
            stereoRow.querySelector('input').value = Math.round(ctx._stereoWidth * 100);
            stereoRow.querySelector('span:last-child').textContent = Math.round(ctx._stereoWidth * 100) + '%';
            monoRow2.querySelector('input').value = ctx._monoEnabled ? 100 : 0;
            monoRow2.querySelector('span:last-child').textContent = ctx._monoEnabled ? '100%' : '0%';
            speedRow.querySelector('input').value = ctx._playbackRate || 1.0;
            speedRow.querySelector('span:last-child').textContent = (ctx._playbackRate || 1.0) + 'x';
            revMixRow.querySelector('input').value = Math.round((ctx._reverbMix || 0) * 100);
            revMixRow.querySelector('span:last-child').textContent = Math.round((ctx._reverbMix || 0) * 100) + '%';
            
            if (activeEnvBtn) activeEnvBtn.classList.remove('active');
            const targetEnv = ctx._reverbEnv || 'None';
            const newEnvBtn = Array.from(envRow.querySelectorAll('button')).find(b => b.textContent === targetEnv);
            if (newEnvBtn) { newEnvBtn.classList.add('active'); activeEnvBtn = newEnvBtn; }
            
            phaseLBtn.classList.toggle('active', !!ctx._invertL);
            phaseRBtn.classList.toggle('active', !!ctx._invertR);
        });

        return spaPanel;
    }
}