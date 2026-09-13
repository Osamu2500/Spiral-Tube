export const DetailsPanel = {
  open(id) {
    const DATA = window.ARCHITECTURE_DATA;
    const file = DATA.find(f => f.path === id);
    if (!file) return;
    
    document.getElementById('d-title').innerText = file.path.split('/').pop();
    
    const content = `
      <div class="section">
        <div class="section-title"><i data-lucide="info"></i> Purpose</div>
        <div class="text-value">${file.purpose}</div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="hard-drive"></i> File Stats</div>
        <div class="pill-container">
          <span class="pill stat">${file.size}</span>
          <span class="pill stat">${file.loc} lines</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title"><i data-lucide="box"></i> Exports</div>
        <div class="pill-container">
          ${this.renderPills(file.exports, 'export')}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="arrow-down-to-line"></i> Depends On</div>
        <div class="pill-container">
          ${this.renderLinks(file.depends)}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="arrow-up-to-line"></i> Depended By</div>
        <div class="pill-container">
          ${this.renderLinks(file.dependedBy)}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="mouse-pointer-2"></i> DOM Targets</div>
        <div class="pill-container">
          ${this.renderPills(file.targets, 'target')}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="database"></i> Storage Keys</div>
        <div class="pill-container">
          ${this.renderPills(file.storage, 'storage')}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="eye"></i> Observers</div>
        <div class="pill-container">
          ${this.renderPills(file.observers, 'observer')}
        </div>
      </div>
    `;
    
    document.getElementById('d-content').innerHTML = content;
    if (window.lucide) window.lucide.createIcons();
    document.getElementById('details-panel').classList.add('open');
  },
  
  close() {
    document.getElementById('details-panel').classList.remove('open');
  },
  
  renderPills(str, typeClass = '') {
    if (!str || str === 'none' || (Array.isArray(str) && str.length === 0)) {
      return '<span class="pill">none</span>';
    }
    const items = Array.isArray(str) ? str : str.split(',').map(s => s.trim());
    return items.map(s => `<span class="pill ${typeClass}">${s}</span>`).join('');
  },
  
  renderLinks(arr) {
    if (!arr || arr.length === 0) return '<span class="pill">none</span>';
    return arr.map(id => `<span class="pill interactive" onclick="window.SidebarManager.onItemClick('${id}')">${id.split('/').pop()}</span>`).join('');
  }
};
