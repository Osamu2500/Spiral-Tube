export const SidebarManager = {
  init() {
    const DATA = window.ARCHITECTURE_DATA;
    document.getElementById('fileCount').innerText = `${DATA.length} modules`;
    this.renderTree(DATA);
    this.bindSearch(DATA);
  },
  
  renderTree(DATA) {
    const container = document.getElementById('sidebar');
    const tree = {};
    
    DATA.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      parts.forEach((part, i) => {
        if (!current[part]) current[part] = { _files: [] };
        if (i === parts.length - 1) {
          current[part]._file = file;
        }
        current = current[part];
      });
    });
    
    function buildHTML(node, pathStr) {
      let html = '';
      for (const key in node) {
        if (key.startsWith('_')) continue;
        
        const hasFile = !!node[key]._file;
        const fullPath = pathStr ? `${pathStr}/${key}` : key;
        
        if (hasFile) {
          html += `<div class="tree-item file-item" data-id="${fullPath}" onclick="window.SidebarManager.onItemClick('${fullPath}')">
                     <i data-lucide="file-code"></i> <span>${key}</span>
                   </div>`;
        } else {
          html += `<div class="tree-folder">
                     <div class="tree-item folder-item" onclick="this.nextElementSibling.classList.toggle('open')">
                       <i data-lucide="folder" class="folder-icon"></i> <span>${key}</span>
                     </div>
                     <div class="tree-children open">${buildHTML(node[key], fullPath)}</div>
                   </div>`;
        }
      }
      return html;
    }
    
    container.innerHTML = buildHTML(tree, '');
    if (window.lucide) window.lucide.createIcons();
  },
  
  onItemClick(id) {
    this.setActive(id);
    if (window.GraphEngine) {
      window.GraphEngine.clearHighlights();
      if (window.GraphEngine.cy) {
        window.GraphEngine.cy.elements().addClass('locked');
      }
      window.GraphEngine.highlightNode(id, true);
    }
    if (window.DetailsPanel) {
      window.DetailsPanel.open(id);
    }
  },
  
  setActive(id) {
    document.querySelectorAll('.tree-item').forEach(el => el.classList.remove('active'));
    const item = document.querySelector(`.file-item[data-id="${id}"]`);
    if (item) {
      item.classList.add('active');
      // Auto-scroll
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  
  clearActive() {
    document.querySelectorAll('.tree-item').forEach(el => el.classList.remove('active'));
  },
  
  bindSearch(DATA) {
    document.getElementById('search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.file-item').forEach(el => {
        const id = el.getAttribute('data-id').toLowerCase();
        
        // Basic ID search fallback
        let match = id.includes(q);
        
        // Deep search in data
        if (!match && q.length > 2) {
          const file = DATA.find(f => f.path.toLowerCase() === id);
          if (file) {
            const fullText = `${file.purpose} ${file.exports} ${file.targets} ${file.storage}`.toLowerCase();
            match = fullText.includes(q);
          }
        }
        
        if (match) {
          el.classList.remove('search-hidden');
          let parent = el.parentElement;
          while(parent && parent.classList.contains('tree-children')) {
            parent.classList.add('open');
            parent = parent.parentElement.parentElement; // Jump to next tree-children
          }
        } else {
          el.classList.add('search-hidden');
        }
      });
    });
  }
};
