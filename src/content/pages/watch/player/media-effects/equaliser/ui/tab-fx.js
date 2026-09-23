export class FXTabUI {
    static build(uiState) {
        const { ctx, panel, saveSettings } = uiState;
        
        const fxPanel = document.createElement('div');
        fxPanel.id = 'ypp-eq-tab-fx';
        fxPanel.style.cssText = 'padding:12px 18px;display:none;';
        
        const title = document.createElement('div');
        title.style.cssText = 'color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;margin-bottom:8px;';
        title.textContent = 'Voice FX / Modulators';
        fxPanel.appendChild(title);
        
        const effects = [
            { id: 'none', label: '🚫 None (Bypass)', cat: 'all' },
            { id: 'adam', label: '🗣️ Adam (TikTok)', cat: 'tech' },
            { id: 'vinyl', label: '📻 Vinyl Lo-Fi', cat: 'tech' },
            { id: 'helium', label: '🎈 Helium', cat: 'voices' },
            { id: 'sulfux', label: '🧪 Sulfur Hexafluoride', cat: 'voices' },
            { id: 'autotune', label: '🎤 Auto-Tune', cat: 'tech' },
            { id: 'whisper', label: '🤫 Whisper', cat: 'voices' },
            { id: 'chipmunk', label: '🐿️ Chipmunk', cat: 'voices' },
            { id: 'child', label: '🧒 Child', cat: 'voices' },
            { id: 'deep', label: '👹 Deep Voice', cat: 'voices' },
            { id: 'demonic', label: '👿 Demonic', cat: 'voices' },
            { id: 'zombie', label: '🧟 Zombie', cat: 'voices' },
            { id: 'ghost', label: '👻 Ghost', cat: 'voices' },
            { id: 'mask', label: '😷 Mask', cat: 'env' },
            { id: 'helmet', label: '🪖 Helmet', cat: 'env' },
            { id: 'radio', label: '📣 Megaphone', cat: 'tech' },
            { id: 'telephone', label: '☎️ Telephone', cat: 'tech' },
            { id: 'underwater', label: '🫧 Underwater', cat: 'env' },
            { id: 'rain', label: '🌧️ Rain', cat: 'env' },
            { id: 'forest', label: '🌲 Forest', cat: 'env' },
            { id: 'cave', label: '🦇 Cave', cat: 'env' },
            { id: 'empty_room', label: '🚪 Empty Room', cat: 'env' },
            { id: 'far_away', label: '🚶 Far Away', cat: 'env' },
            { id: 'ethereal', label: '✨ Ethereal', cat: 'env' },
            { id: 'vader', label: '🌌 Darth Vader', cat: 'voices' },
            { id: 'robot', label: '🤖 Robot (Dalek)', cat: 'tech' },
            { id: 'astronaut', label: '🧑‍🚀 Astronaut', cat: 'tech' },
            { id: '8bit', label: '👾 8-Bit Retro', cat: 'tech' },
            { id: 'cathedral', label: '⛪ Cathedral', cat: 'env' },
            { id: 'witness', label: '🕵️ Witness', cat: 'voices' },
            { id: 'tv_static', label: '📺 TV Static', cat: 'tech' },
            { id: 'stadium', label: '🏟️ Stadium', cat: 'env' },
            { id: 'alien', label: '👽 Alien Overlord', cat: 'voices' },
            { id: 'dream', label: '☁️ Lucid Dream', cat: 'env' },
            { id: 'cyberpunk', label: '🌆 Cyberpunk', cat: 'tech' },
            { id: 'demon_lord', label: '🔥 Demon Lord', cat: 'voices' },
            { id: 'walkie_talkie', label: '📻 Walkie Talkie', cat: 'tech' },
            { id: 'drunk', label: '🥴 Drunk', cat: 'voices' },
            { id: 'bee', label: '🐝 Bee', cat: 'voices' }
        ];
        
        // Categories Pill Row
        const catRow = document.createElement('div');
        catRow.className = 'ypp-eq-presets-row';
        catRow.style.cssText = 'padding: 4px 0 12px 0; border-bottom: none; margin: 0;';
        
        const categories = [
            { id: 'all', label: 'All' },
            { id: 'voices', label: 'Voices' },
            { id: 'env', label: 'Environments' },
            { id: 'tech', label: 'Tech / Lo-Fi' }
        ];
        
        const grid = document.createElement('div');
        grid.className = 'ypp-eq-fx-grid';
        
        let activeCatBtn = null;
        let activeBtn = null;
        
        const renderGrid = (catId) => {
            grid.innerHTML = '';
            effects.forEach(fx => {
                if (catId !== 'all' && fx.cat !== catId && fx.id !== 'none') return;
                
                const btn = document.createElement('button');
                btn.className = 'ypp-eq-fx-btn';
                btn.textContent = fx.label;
                btn.dataset.id = fx.id;
                
                if (fx.id === (ctx._activeFX || 'none')) {
                    btn.classList.add('active');
                    activeBtn = btn;
                }
                
                btn.addEventListener('click', () => {
                    if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
                    if (activeBtn) activeBtn.classList.remove('active');
                    btn.classList.add('active');
                    activeBtn = btn;
                    
                    if (ctx.setFX) ctx.setFX(fx.id);
                    saveSettings(ctx);
                });
                grid.appendChild(btn);
            });
        };
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'ypp-eq-preset-btn';
            btn.textContent = cat.label;
            
            if (cat.id === 'all') {
                btn.classList.add('active');
                activeCatBtn = btn;
            }
            
            btn.addEventListener('click', () => {
                if (activeCatBtn) activeCatBtn.classList.remove('active');
                btn.classList.add('active');
                activeCatBtn = btn;
                renderGrid(cat.id);
            });
            catRow.appendChild(btn);
        });
        
        fxPanel.appendChild(catRow);
        fxPanel.appendChild(grid);
        
        renderGrid('all');

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