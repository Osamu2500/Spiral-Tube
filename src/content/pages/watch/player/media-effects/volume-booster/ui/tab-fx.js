export class FXTabUI {
    static build(uiState) {
        const { ctx, panel, saveSettings } = uiState;
        
        const fxPanel = document.createElement('div');
        fxPanel.id = 'ypp-eq-tab-fx';
        fxPanel.style.cssText = 'padding:16px 18px;display:none;';
        
        const title = document.createElement('div');
        title.style.cssText = 'color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;margin-bottom:12px;';
        title.textContent = 'Voice FX / Modulators';
        fxPanel.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'ypp-eq-fx-grid';
        
        const effects = [
            { id: 'none', label: 'None (Bypass)' },
            { id: 'adam', label: 'Adam (TikTok)' },
            { id: 'vinyl', label: 'Vinyl Lo-Fi' },
            { id: 'radio', label: 'Megaphone' },
            { id: 'underwater', label: 'Underwater' },
            { id: 'chipmunk', label: 'High Pitch' },
            { id: 'deep', label: 'Deep Voice' },
            { id: 'demonic', label: 'Demonic' },
            { id: 'ethereal', label: 'Ethereal' },
            { id: 'telephone', label: 'Telephone' },
            { id: 'vader', label: 'Darth Vader' },
            { id: 'robot', label: 'Robot (Dalek)' },
            { id: 'astronaut', label: 'Astronaut' },
            { id: '8bit', label: '8-Bit Retro' },
            { id: 'cathedral', label: 'Cathedral' },
            { id: 'witness', label: 'Witness Protection' },
            { id: 'tv_static', label: 'TV Static' }
        ];
        
        let activeBtn = null;
        
        effects.forEach(fx => {
            const btn = document.createElement('button');
            btn.className = 'ypp-eq-fx-btn';
            btn.textContent = fx.label;
            btn.dataset.id = fx.id;
            
            if (fx.id === (ctx._activeFX || 'none')) {
                btn.classList.add('active');
                activeBtn = btn;
            }
            
            btn.onclick = () => {
                if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
                if (activeBtn) activeBtn.classList.remove('active');
                btn.classList.add('active');
                activeBtn = btn;
                
                if (ctx.setFX) ctx.setFX(fx.id);
                saveSettings(ctx);
            };
            
            grid.appendChild(btn);
        });
        
        fxPanel.appendChild(grid);

        panel.addEventListener('ypp-eq-update', () => {
            if (activeBtn) activeBtn.classList.remove('active');
            const targetFx = ctx._activeFX || 'none';
            const newBtn = Array.from(grid.querySelectorAll('button')).find(b => b.dataset.id === targetFx);
            if (newBtn) {
                newBtn.classList.add('active');
                activeBtn = newBtn;
            }
        });

        return fxPanel;
    }
}