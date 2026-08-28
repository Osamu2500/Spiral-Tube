const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/content/pages/watch/player/media-effects/volume-booster/volume-booster-ui.js');
const uiDir = path.join(__dirname, '../src/content/pages/watch/player/media-effects/volume-booster/ui');

if (!fs.existsSync(uiDir)) {
    fs.mkdirSync(uiDir, { recursive: true });
}

let code = fs.readFileSync(srcPath, 'utf8');

// The file has very clear start and end markers for panels. Let's slice them.
const getSection = (startMarker, endMarker) => {
    const startIndex = code.indexOf(startMarker);
    if (startIndex === -1) return null;
    let endIndex = code.indexOf(endMarker, startIndex);
    if (endIndex === -1) {
        endIndex = code.indexOf('// ---', startIndex + startMarker.length);
        if (endIndex === -1) endIndex = code.indexOf('// ──', startIndex + startMarker.length);
    }
    return code.slice(startIndex, endIndex).trim();
};

const dynPanelStr = getSection('const dynPanel = document.createElement(\'div\');', 'panel.appendChild(dynPanel);') + '\n        panel.appendChild(dynPanel);';
const spaPanelStr = getSection('const spaPanel = document.createElement(\'div\');', 'panel.appendChild(spaPanel);') + '\n        panel.appendChild(spaPanel);';
const fxPanelStr = getSection('const fxPanel = document.createElement(\'div\');', 'panel.appendChild(fxPanel);') + '\n        panel.appendChild(fxPanel);';
const phaseRowStr = getSection('// Phase Inversion', 'panel.appendChild(spaPanel);');
const presetsRowStr = getSection('const presetsRow = document.createElement(\'div\');', 'panel.appendChild(presetsRow);') + '\n        panel.appendChild(presetsRow);';
const bandsStr = getSection('const bandsSection = document.createElement(\'div\');', '// --- EQ content wrapper');


fs.writeFileSync(path.join(uiDir, 'tab-dynamics.js'), `export class DynamicsTabUI {
    static build(uiState) {
        const { ctx, panel, mkDynRow, clearActivePreset, saveSettings, VolumeBoosterUI } = uiState;
        ${dynPanelStr.replace(/VolumeBoosterUI\.saveVolumeSettings/g, 'saveSettings')}
        return dynPanel;
    }
}`);

fs.writeFileSync(path.join(uiDir, 'tab-spatial.js'), `export class SpatialTabUI {
    static build(uiState) {
        const { ctx, panel, mkDynRow, saveSettings } = uiState;
        ${spaPanelStr.replace(/VolumeBoosterUI\.saveVolumeSettings/g, 'saveSettings')}
        ${phaseRowStr.replace(/VolumeBoosterUI\.saveVolumeSettings/g, 'saveSettings')}
        return spaPanel;
    }
}`);

fs.writeFileSync(path.join(uiDir, 'tab-fx.js'), `export class FXTabUI {
    static build(uiState) {
        const { ctx, panel, saveSettings } = uiState;
        ${fxPanelStr.replace(/VolumeBoosterUI\.saveVolumeSettings/g, 'saveSettings')}
        return fxPanel;
    }
}`);

// Delete these parts from the original code and replace with function calls
code = code.replace(dynPanelStr, 'const dynPanel = uiState.DynamicsTabUI.build(uiState);');
code = code.replace(spaPanelStr + '\n        ' + phaseRowStr, 'const spaPanel = uiState.SpatialTabUI.build(uiState);');
code = code.replace(fxPanelStr, 'const fxPanel = uiState.FXTabUI.build(uiState);');

// Insert imports
const imports = `import './volume-booster.css';
import { DynamicsTabUI } from './ui/tab-dynamics.js';
import { SpatialTabUI } from './ui/tab-spatial.js';
import { FXTabUI } from './ui/tab-fx.js';
`;
code = code.replace("import anime from 'animejs/lib/anime.es.js';", "import anime from 'animejs/lib/anime.es.js';\n" + imports);

// We need to inject uiState in toggleEQPanel BEFORE eqContentWrap
const uiStateInjection = `
        const saveSettings = VolumeBoosterUI.saveVolumeSettings.bind(VolumeBoosterUI);
        
        const mkDynRow = (label, min, max, step, val, unit, onChange) => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:12px;margin-bottom:14px;';
            const lbl = document.createElement('span');
            lbl.style.cssText = 'font-size:10px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.5px;min-width:80px;';
            lbl.textContent = label;
            const valEl = document.createElement('span');
            const fmtVal = Number(val.toFixed(3));
            valEl.textContent = fmtVal + unit;
            const sl = document.createElement('input');
            sl.type='range'; sl.min=min; sl.max=max; sl.step=step; sl.value=val;
            sl.className='ypp-eq-hslider';
            sl.style.flex='1';
            sl.oninput = (e) => { 
                const v = parseFloat(e.target.value);
                valEl.textContent = Number(v.toFixed(3)) + unit; 
                onChange(v); 
                
                if (!ctx._compressorEnabled && ctx.setCompressorEnabled) {
                    ctx.setCompressorEnabled(true);
                    const btn = panel.querySelector('#ypp-eq-comp-btn');
                    if (btn) btn.classList.add('active');
                }
                
                clearActivePreset(); 
                saveSettings(ctx); 
            };
            row.append(lbl, sl, valEl);
            return row;
        };

        const uiState = {
            ctx,
            panel,
            video,
            anchorBtn,
            clearActivePreset,
            saveSettings,
            mkDynRow,
            DynamicsTabUI,
            SpatialTabUI,
            FXTabUI
        };
`;

code = code.replace('// --- EQ content wrapper (bands + canvas)', uiStateInjection + '\n        // --- EQ content wrapper (bands + canvas)');

// Also remove mkDynRow definition from the main file since it's in uiState
const mkDynRowRegex = /const mkDynRow = \(\w+, \w+, \w+, \w+, \w+, \w+, \w+\) => \{[\s\S]*?return row;\s*\};\s*/;
code = code.replace(mkDynRowRegex, '');

// Extract CSS injection logic
const injectEQStylesRegex = /static injectEQStyles\(\) \{[\s\S]*?\n    \}/;
code = code.replace(injectEQStylesRegex, 'static injectEQStyles() { }');

fs.writeFileSync(srcPath, code);
console.log('UI Splitting complete');
