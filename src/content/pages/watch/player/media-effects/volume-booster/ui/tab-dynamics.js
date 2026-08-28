export class DynamicsTabUI {
    static build(uiState) {
        const { ctx, panel, mkDynRow, clearActivePreset, saveSettings, VolumeBoosterUI } = uiState;
        const dynPanel = document.createElement('div');
        dynPanel.id = 'ypp-eq-tab-dyn';
        dynPanel.style.display = 'none';
        dynPanel.style.cssText = 'padding:16px 18px;display:none;';
        
        const getCompVal = (param, fallback) => {
            if (ctx.compressorNode && ctx.compressorNode[param]) return ctx.compressorNode[param].value;
            return fallback;
        };

        dynPanel.appendChild(mkDynRow('Threshold', -60, 0, 1, getCompVal('threshold', ctx._compThreshold ?? -24), 'dB', v => { if (ctx.setCompressorThreshold) ctx.setCompressorThreshold(v); }));
        dynPanel.appendChild(mkDynRow('Ratio', 1, 20, 0.5, getCompVal('ratio', ctx._compRatio ?? 12), ':1', v => { if (ctx.setCompressorRatio) ctx.setCompressorRatio(v); }));
        dynPanel.appendChild(mkDynRow('Attack', 0, 1, 0.01, getCompVal('attack', ctx._compAttack ?? 0.003), 's', v => { if (ctx.setCompressorAttack) ctx.setCompressorAttack(v); }));
        dynPanel.appendChild(mkDynRow('Release', 0, 1, 0.01, getCompVal('release', ctx._compRelease ?? 0.25), 's', v => { if (ctx.setCompressorRelease) ctx.setCompressorRelease(v); }));
        dynPanel.appendChild(mkDynRow('Knee', 0, 40, 1, getCompVal('knee', ctx._compKnee ?? 30), 'dB', v => { if (ctx.setCompressorKnee) ctx.setCompressorKnee(v); }));
        
        // Auto-Gain Normalizer
        const autoGainRow = document.createElement('div');
        autoGainRow.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; margin-top:12px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.05);';
        const autoGainLbl = document.createElement('div');
        autoGainLbl.innerHTML = '<div style="color:rgba(255,255,255,0.85); font-size:13px; font-weight:600;">Auto-Gain Normalizer</div><div style="color:rgba(255,255,255,0.4); font-size:10px;">Automatically rides volume to target loudness</div>';
        const autoGainBtn = document.createElement('button');
        autoGainBtn.className = 'ypp-eq-comp-btn' + (ctx._autoGain ? ' active' : '');
        autoGainBtn.style.margin = '0';
        autoGainBtn.textContent = ctx._autoGain ? 'ON' : 'OFF';
        autoGainBtn.onclick = () => {
            if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
            ctx.setAutoGain(!ctx._autoGain);
            autoGainBtn.classList.toggle('active', ctx._autoGain);
            autoGainBtn.textContent = ctx._autoGain ? 'ON' : 'OFF';
            saveSettings(ctx);
        };
        autoGainRow.append(autoGainLbl, autoGainBtn);
        dynPanel.appendChild(autoGainRow);
        panel.addEventListener('ypp-eq-update', () => {
            const inputs = dynPanel.querySelectorAll('input[type="range"]');
            const spans = dynPanel.querySelectorAll('div > span:last-child');
            if (inputs.length >= 5) {
                const values = [
                    getCompVal('threshold', ctx._compThreshold ?? -24),
                    getCompVal('ratio', ctx._compRatio ?? 12),
                    getCompVal('attack', ctx._compAttack ?? 0.003),
                    getCompVal('release', ctx._compRelease ?? 0.25),
                    getCompVal('knee', ctx._compKnee ?? 30)
                ];
                const units = ['dB', ':1', 's', 's', 'dB'];
                inputs.forEach((input, i) => {
                    input.value = values[i];
                    spans[i].textContent = values[i] + units[i];
                });
            }
            autoGainBtn.classList.toggle('active', !!ctx._autoGain);
            autoGainBtn.textContent = ctx._autoGain ? 'ON' : 'OFF';
        });

        return dynPanel;
    }
}