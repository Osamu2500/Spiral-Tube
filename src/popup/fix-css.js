const fs = require('fs');
const path = 'src/popup/popup.css';
let css = fs.readFileSync(path, 'utf8');

css += `
/* Global Search Overhaul */
body.global-search-active .sidebar { display: none; }
body.global-search-active .app-container { grid-template-columns: 1fr; }
body.global-search-active .tab-content { display: block; opacity: 1; transform: translateY(0); padding-bottom: 0; }
body.global-search-active .settings-section { margin-bottom: 24px; }

/* Spiral Tube Custom Logo */
.spiral-tube svg { width: 20px; height: 20px; }

/* Enhanced Gradient Colors */
.ypp-theme-liquid-glass {
  --bg-primary: #0a0e14;
  --bg-secondary: rgba(20, 25, 35, 0.6);
  --bg-card: rgba(255, 255, 255, 0.03);
  --accent-grad: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
}
.ypp-theme-aurora {
  --bg-primary: #050b14;
  --bg-card: rgba(255, 255, 255, 0.04);
  --accent-grad: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
}

/* Drag Handle */
.drag-handle {
    cursor: grab;
    display: inline-flex;
    align-items: center;
    color: var(--text-3);
    margin-right: 8px;
    opacity: 0.5;
    transition: 0.2s;
}
.drag-handle:hover { opacity: 1; color: var(--accent-primary); }
.settings-section.dragging { opacity: 0.5; border: 1px dashed var(--accent-primary); }
`;

fs.writeFileSync(path, css);
console.log('CSS appended.');
