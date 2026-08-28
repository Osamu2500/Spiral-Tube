import { VideoFiltersUI } from '../video-filters-ui.js';

export class AdjustTabUI {
    static build(ctx, video) {
        const wrap = document.createElement('div');
        Object.assign(wrap.style, { padding: '0' });

        // ── Global Intensity ──
        const intensitySection = document.createElement('div');
        Object.assign(intensitySection.style, {
            padding: '10px 14px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.02)'
        });
        intensitySection.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:6px;letter-spacing:0.6px;text-transform:uppercase;">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                    Global Intensity
                </span>
                <span id="ypp-int-val" style="color:#fff;font-weight:800;font-size:10px;background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:20px;">${ctx.filterIntensity}%</span>
            </div>
        `;
        const intSlider = document.createElement('input');
        intSlider.type = 'range'; intSlider.className = 'ypp-vcp-slider';
        intSlider.min = '0'; intSlider.max = '100';
        intSlider.value = ctx.filterIntensity !== undefined ? ctx.filterIntensity : 100;
        
        const intSliderContainer = document.createElement('div');
        intSliderContainer.className = 'ypp-slider-container';
        const intTooltip = document.createElement('div');
        intTooltip.className = 'ypp-slider-tooltip';
        intSliderContainer.appendChild(intSlider);
        intSliderContainer.appendChild(intTooltip);

        const trackPct = (val, min, max) => ((val - min) / (max - min)) * 100;

        const updateIntTrack = (v) => {
            const pct = trackPct(Number(v), 0, 100);
            intSlider.style.setProperty('--fill-start', '0%');
            intSlider.style.setProperty('--fill-end', pct + '%');
            intSlider.style.setProperty('--track-fill', pct + '%');
            intSlider.style.setProperty('--track-color', 'rgba(255,255,255,0.6)');
            intTooltip.textContent = v + '%';
        };
        updateIntTrack(intSlider.value);
        intSlider.oninput = (e) => {
            ctx.filterIntensity = Number(e.target.value);
            intensitySection.querySelector('#ypp-int-val').textContent = ctx.filterIntensity + '%';
            updateIntTrack(e.target.value);
            ctx._applyComputedFilter(video);
            VideoFiltersUI.saveFilterSettings(ctx);
        };
        intensitySection.appendChild(intSliderContainer);
        wrap.appendChild(intensitySection);

        // ── Copy / Paste Buttons ──
        const cpRow = document.createElement('div');
        cpRow.className = 'ypp-adj-copy-paste';
        const copyBtn = document.createElement('button');
        copyBtn.className = 'ypp-adj-cp-btn';
        copyBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copy Settings`;
        copyBtn.onclick = () => {
            const data = JSON.stringify({ adjustments: ctx.filterAdjustments, intensity: ctx.filterIntensity, filterIndex: ctx.currentFilterIndex }, null, 2);
            navigator.clipboard?.writeText(data).then(() => {
                copyBtn.textContent = '✓ Copied!';
                setTimeout(() => { copyBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copy Settings`; }, 1500);
            });
        };
        const pasteBtn = document.createElement('button');
        pasteBtn.className = 'ypp-adj-cp-btn';
        pasteBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg> Paste Settings`;
        pasteBtn.onclick = async () => {
            try {
                const text = await navigator.clipboard?.readText();
                const parsed = JSON.parse(text);
                if (parsed.adjustments) {
                    Object.assign(ctx.filterAdjustments, parsed.adjustments);
                    if (parsed.intensity !== undefined) ctx.filterIntensity = parsed.intensity;
                    ctx._applyComputedFilter(video);
                    VideoFiltersUI.saveFilterSettings(ctx);
                    const tab = wrap.closest('[data-tab-content]') || wrap.parentElement;
                    wrap.remove();
                    const newAdj = AdjustTabUI.build(ctx, video);
                    tab?.appendChild(newAdj);
                    pasteBtn.textContent = '✓ Applied!';
                }
            } catch { pasteBtn.textContent = '✗ Invalid'; }
            setTimeout(() => { pasteBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg> Paste Settings`; }, 2000);
        };
        const saveBtn = document.createElement('button');
        saveBtn.className = 'ypp-adj-cp-btn';
        saveBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> Save Preset`;
        saveBtn.onclick = () => {
            const name = prompt('Enter a name for your custom preset:');
            if (!name) return;
            const newPreset = {
                category: 'My Presets',
                name: name.trim(),
                css: 'none',
                adjustments: { ...ctx.filterAdjustments },
                intensity: ctx.filterIntensity,
                preview: 'linear-gradient(135deg, #1f4037, #99f2c8)',
                overlay: null
            };
            if (chrome?.storage?.local) {
                chrome.storage.local.get('ypp_custom_presets', (data) => {
                    let custom = data.ypp_custom_presets || [];
                    custom.push(newPreset);
                    chrome.storage.local.set({ ypp_custom_presets: custom }, () => {
                        saveBtn.textContent = '✓ Saved!';
                        setTimeout(() => { 
                            saveBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> Save`; 
                            const tabs = document.querySelectorAll('.ypp-cinema-tab-btn');
                            if (tabs.length > 0) tabs[0].click();
                        }, 800);
                    });
                });
            }
        };

        const exportBtn = document.createElement('button');
        exportBtn.className = 'ypp-adj-cp-btn';
        exportBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Export`;
        exportBtn.onclick = () => {
            if (chrome?.storage?.local) {
                chrome.storage.local.get('ypp_custom_presets', (data) => {
                    const custom = data.ypp_custom_presets || [];
                    if (custom.length === 0) return alert('No custom presets to export!');
                    const blob = new Blob([JSON.stringify(custom, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'spiral_presets.json';
                    a.click();
                    URL.revokeObjectURL(url);
                    exportBtn.textContent = '✓ Exported!';
                    setTimeout(() => exportBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Export`, 2000);
                });
            }
        };

        const importBtn = document.createElement('button');
        importBtn.className = 'ypp-adj-cp-btn';
        importBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg> Import`;
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        importBtn.appendChild(fileInput);
        importBtn.onclick = () => fileInput.click();
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (!Array.isArray(imported)) throw new Error('Invalid format');
                    if (chrome?.storage?.local) {
                        chrome.storage.local.get('ypp_custom_presets', (data) => {
                            let custom = data.ypp_custom_presets || [];
                            const merged = [...custom, ...imported];
                            chrome.storage.local.set({ ypp_custom_presets: merged }, () => {
                                importBtn.textContent = '✓ Imported!';
                                setTimeout(() => {
                                    importBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg> Import`;
                                    const tabs = document.querySelectorAll('.ypp-cinema-tab-btn');
                                    if (tabs.length > 0) tabs[0].click(); // Refresh presets tab
                                }, 1500);
                            });
                        });
                    }
                } catch (err) {
                    alert('Failed to import presets. Invalid JSON file.');
                }
            };
            reader.readAsText(file);
            fileInput.value = ''; // reset
        };

        const compareBtn = document.createElement('button');
        compareBtn.className = 'ypp-adj-cp-btn ypp-adj-cp-compare-btn';
        compareBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> Hold to Compare`;
        
        let pointerDownTime = 0;
        let isHolding = false;

        const updateCompareState = (val) => {
            if (ctx.isComparing === val) return;
            ctx.isComparing = val;
            if (ctx._syncCompareUI) ctx._syncCompareUI(val);
            ctx._applyComputedFilter(video);
        };

        compareBtn.onpointerdown = (e) => {
            e.preventDefault();
            pointerDownTime = Date.now();
            isHolding = true;
            updateCompareState(true);
        };
        const restore = (e) => {
            if (e) e.preventDefault();
            if (!isHolding) return;
            isHolding = false;
            
            const holdDuration = Date.now() - pointerDownTime;
            if (holdDuration < 250) {
                updateCompareState(false);
                setTimeout(() => updateCompareState(!ctx.isComparing), 10);
            } else {
                updateCompareState(false);
            }
        };
        compareBtn.onpointerup = restore;
        compareBtn.onpointerleave = restore;
        compareBtn.onpointercancel = restore;
        compareBtn.oncontextmenu = (e) => e.preventDefault();

        cpRow.appendChild(copyBtn);
        cpRow.appendChild(pasteBtn);
        cpRow.appendChild(saveBtn);
        cpRow.appendChild(exportBtn);
        cpRow.appendChild(importBtn);
        cpRow.appendChild(compareBtn);
        wrap.appendChild(cpRow);

        // ── SVG icon map ──
        const SVG = {
            brightness: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg>`,
            contrast:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/></svg>`,
            saturate:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
            hueRotate:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/></svg>`,
            dehaze:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`,
            clarity:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/></svg>`,
            sharpness:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2z"/></svg>`,
            grain:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/></svg>`,
            sepia:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84z"/></svg>`,
            grayscale:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2z"/></svg>`,
            invert:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11 1L1 11l10 10L21 11 11 1zm0 17.17L3.83 11 11 3.83V18.17z"/></svg>`,
            blur:       `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 5.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>`,
            opacity:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/></svg>`,
            temperature:`<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4z"/></svg>`,
            vibrance:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4z"/></svg>`,
            highlights: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>`,
            shadows:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 21h20L12 3zm0 3.99L19.53 19H4.47L12 6.99z"/></svg>`,
            vignette:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`,
            exposure:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zM11 9h2v2h2v2h-2v2h-2v-2H9v-2h2V9zM3 5.27L4.28 4 20 19.72 18.73 21l-2.83-2.83C14.68 19.3 13.39 20 12 20c-4.42 0-8-3.58-8-8 0-1.39.7-2.68 1.83-3.9L3 5.27z"/></svg>`,
            tint:       `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22A10 10 0 0 1 2 12 10 10 0 0 1 12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10m0-2a8 8 0 0 0 8-8 8 8 0 0 0-8-8 8 8 0 0 0-8 8 8 8 0 0 0 8 8z"/></svg>`,
            fade:       `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3H3v18h2V3zm4 0v18h2V3H9zm4 0v18h2V3h-2zm4 0v18h2V3h-2z"/></svg>`,
            noiseReduce:`<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
            aberration: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-12h-2v4h2V8zm0 6h-2v2h2v-2z"/></svg>`,
            bloom:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z"/></svg>`,
            scanlines:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h20v2H2zm0 6h20v2H2zm0 6h20v2H2z"/></svg>`,
            letterbox:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h20v4H2zm0 12h20v4H2z"/></svg>`,
            vhs:        `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 9H8v-2h4v2zm0 4H8v-2h4v2zm4-4h-2v-2h2v2zm0 4h-2v-2h2v2z"/></svg>`
        };

        const SECTION_ICONS = {
            exposure: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
            color:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5" fill="currentColor" opacity="0.9"/><circle cx="17.5" cy="10.5" r="2.5" fill="currentColor" opacity="0.55"/><circle cx="8.5" cy="7" r="2.5" fill="currentColor" opacity="0.7"/><path d="M12 22C6.5 22 2 17.5 2 12A10 10 0 0 1 12 2c0 2.76 2.24 5 5 5a5 5 0 0 1 5 5c0 5.52-4.48 10-10 10z"/></svg>`,
            effects:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
            stylized: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22l14-14M16 2l6 6M2 16l6 6"/></svg>`,
            other:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`,
        };

        const SECTIONS = [
            {
                id: 'exposure', label: 'Exposure', open: true,
                sliders: [
                    { id: 'exposure',    label: 'Exposure',    svgKey: 'exposure',    min: -100, max: 100, def: 0,   unit: '' },
                    { id: 'brightness',  label: 'Brightness',  svgKey: 'brightness',  min: 0,    max: 200, def: 100, unit: '%' },
                    { id: 'contrast',    label: 'Contrast',    svgKey: 'contrast',    min: 0,    max: 200, def: 100, unit: '%' },
                    { id: 'highlights',  label: 'Highlights',  svgKey: 'highlights',  min: -100, max: 100, def: 0,   unit: '%' },
                    { id: 'shadows',     label: 'Shadows',     svgKey: 'shadows',     min: -100, max: 100, def: 0,   unit: '%' },
                    { id: 'fade',        label: 'Fade',        svgKey: 'fade',        min: 0,    max: 100, def: 0,   unit: '%' },
                ]
            },
            {
                id: 'color', label: 'Color', open: true,
                sliders: [
                    { id: 'saturate',    label: 'Saturation',  svgKey: 'saturate',    min: 0,   max: 300, def: 100, unit: '%' },
                    { id: 'vibrance',    label: 'Vibrance',    svgKey: 'vibrance',    min: 0,   max: 200, def: 100, unit: '%' },
                    { id: 'temperature', label: 'Temperature', svgKey: 'temperature', min: -100,max: 100, def: 0,   unit: 'K' },
                    { id: 'tint',        label: 'Tint',        svgKey: 'tint',        min: -100,max: 100, def: 0,   unit: '' },
                    { id: 'hueRotate',   label: 'Hue Rotate',  svgKey: 'hueRotate',   min: 0,   max: 360, def: 0,   unit: '°' },
                    { id: 'sepia',       label: 'Sepia',       svgKey: 'sepia',       min: 0,   max: 100, def: 0,   unit: '%' },
                    { id: 'grayscale',   label: 'Grayscale',   svgKey: 'grayscale',   min: 0,   max: 100, def: 0,   unit: '%' },
                ]
            },
            {
                id: 'effects', label: 'Effects', open: true,
                sliders: [
                    { id: 'clarity',      label: 'Clarity',        svgKey: 'clarity',     min: -100,max: 100, def: 0,   unit: '%' },
                    { id: 'dehaze',       label: 'Dehaze',         svgKey: 'dehaze',      min: -100,max: 100, def: 0,   unit: '%' },
                    { id: 'sharpness',    label: 'Sharpness',      svgKey: 'sharpness',   min: -100,max: 100, def: 0,   unit: '%' },
                    { id: 'noiseReduction',label:'Noise Reduce',   svgKey: 'noiseReduce', min: 0,   max: 100, def: 0,   unit: '%' },
                    { id: 'blur',         label: 'Blur',           svgKey: 'blur',        min: 0,   max: 20,  def: 0,   unit: 'px' },
                    { id: 'vignette',     label: 'Vignette',       svgKey: 'vignette',    min: 0,   max: 100, def: 0,   unit: '%' },
                    { id: 'grain',        label: 'Film Grain',     svgKey: 'grain',       min: 0,   max: 100, def: 0,   unit: '%' },
                ]
            },
            {
                id: 'stylized', label: 'Stylized', open: true,
                sliders: [
                    { id: 'aberration',   label: 'Aberration',     svgKey: 'aberration',  min: 0,   max: 100, def: 0,   unit: '%' },
                    { id: 'bloom',        label: 'Bloom',          svgKey: 'bloom',       min: 0,   max: 100, def: 0,   unit: '%' },
                    { id: 'scanlines',    label: 'Scanlines',      svgKey: 'scanlines',   min: 0,   max: 100, def: 0,   unit: '%' },
                    { id: 'letterbox',    label: 'Letterbox',      svgKey: 'letterbox',   min: 0,   max: 100, def: 0,   unit: '%' },
                    { id: 'vhs',          label: 'VHS Glitch',     svgKey: 'vhs',         min: 0,   max: 100, def: 0,   unit: '%' },
                ]
            },
            {
                id: 'other', label: 'Other', open: true,
                sliders: [
                    { id: 'invert',      label: 'Invert',          svgKey: 'invert',      min: 0,   max: 100, def: 0,   unit: '%' },
                    { id: 'opacity',     label: 'Opacity',         svgKey: 'opacity',     min: 0,   max: 100, def: 100, unit: '%' },
                ]
            }
        ];

        // Ensure new adjustment keys are initialized
        ['temperature','vibrance','highlights','shadows','vignette','exposure','tint','fade','noiseReduction','aberration','bloom','scanlines','letterbox','vhs'].forEach(k => {
            if (ctx.filterAdjustments[k] === undefined) {
                ctx.filterAdjustments[k] = (k === 'vibrance') ? 100 : 0;
            }
        });

        // Helper: is this value non-default?
        const isModified = (cfg) => {
            const v = ctx.filterAdjustments[cfg.id] !== undefined ? ctx.filterAdjustments[cfg.id] : cfg.def;
            return Math.abs(v - cfg.def) > 0.01;
        };

        SECTIONS.forEach(section => {
            const sec = document.createElement('div');
            sec.className = `ypp-adj-section${section.open ? ' open' : ''}`;

            // Header
            const hdr = document.createElement('div');
            hdr.className = 'ypp-adj-section-header';
            const dot = document.createElement('div');
            dot.className = 'ypp-adj-active-dot';
            const anyModified = section.sliders.some(isModified);
            if (anyModified) dot.classList.add('visible');
            hdr.innerHTML = `
                <div class="ypp-adj-section-title">
                    <span class="ypp-adj-section-icon">${SECTION_ICONS[section.id] || ''}</span>
                    <span>${section.label}</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span class="ypp-adj-chevron">▼</span>
                </div>
            `;
            hdr.querySelector('.ypp-adj-section-title').appendChild(dot);
            hdr.onclick = () => { sec.classList.toggle('open'); };

            // Body (grid)
            const bodyWrapper = document.createElement('div');
            bodyWrapper.className = 'ypp-adj-section-body-wrapper';
            const body = document.createElement('div');
            body.className = 'ypp-adj-section-body';
            const bodyInner = document.createElement('div');
            bodyInner.className = 'ypp-adj-section-body-inner';
            body.appendChild(bodyInner);
            bodyWrapper.appendChild(body);

            section.sliders.forEach(cfg => {
                const currentValue = ctx.filterAdjustments[cfg.id] !== undefined ? ctx.filterAdjustments[cfg.id] : cfg.def;
                const modified = Math.abs(currentValue - cfg.def) > 0.01;

                const card = document.createElement('div');
                card.className = `ypp-adjust-card${modified ? ' modified' : ''}`;

                const headerRow = document.createElement('div');
                headerRow.className = 'ypp-adjust-card-header';

                const titleEl = document.createElement('div');
                titleEl.className = 'ypp-adjust-card-title';
                titleEl.innerHTML = `<span style="opacity:0.65;display:flex;">${SVG[cfg.svgKey] || ''}</span><span>${cfg.label}</span>`;

                const valWrap = document.createElement('div');
                valWrap.style.cssText = 'display:flex;align-items:center;gap:4px;';

                const val = document.createElement('div');
                val.className = 'ypp-adjust-card-val';
                val.textContent = currentValue + cfg.unit;

                const resetBtn = document.createElement('button');
                resetBtn.className = 'ypp-adj-reset';
                resetBtn.innerHTML = '↺';
                resetBtn.title = `Reset ${cfg.label}`;

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.className = 'ypp-vcp-slider';
                slider.min = cfg.min; slider.max = cfg.max;
                slider.value = currentValue;

                const sliderContainer = document.createElement('div');
                sliderContainer.className = 'ypp-slider-container';
                const tooltip = document.createElement('div');
                tooltip.className = 'ypp-slider-tooltip';
                sliderContainer.appendChild(slider);
                sliderContainer.appendChild(tooltip);

                // Live track fill via CSS variables (hardware optimized)
                const updateTrack = (v) => {
                    const pct = trackPct(Number(v), cfg.min, cfg.max);
                    const defPct = trackPct(cfg.def, cfg.min, cfg.max);
                    const isMod = Math.abs(Number(v) - cfg.def) > 0.01;
                    const color = isMod ? '#3ea6ff' : 'rgba(255,255,255,0.6)';
                    
                    slider.style.setProperty('--fill-start', Math.min(pct, defPct) + '%');
                    slider.style.setProperty('--fill-end', Math.max(pct, defPct) + '%');
                    slider.style.setProperty('--track-fill', pct + '%'); // For tooltip positioning
                    slider.style.setProperty('--track-color', color);
                    tooltip.textContent = v + cfg.unit;
                };
                updateTrack(currentValue);

                slider.oninput = (e) => {
                    const v = Number(e.target.value);
                    ctx.filterAdjustments[cfg.id] = v;
                    val.textContent = v + cfg.unit;
                    const nowModified = Math.abs(v - cfg.def) > 0.01;
                    card.classList.toggle('modified', nowModified);
                    updateTrack(v);
                    // Update section dot
                    dot.classList.toggle('visible', section.sliders.some(s => {
                        const sv = ctx.filterAdjustments[s.id] !== undefined ? ctx.filterAdjustments[s.id] : s.def;
                        return Math.abs(sv - s.def) > 0.01;
                    }));
                    ctx._applyComputedFilter(video);
                };
                // Save to storage only on release (not on every drag tick)
                slider.onchange = () => VideoFiltersUI.saveFilterSettings(ctx);

                resetBtn.onclick = (e) => {
                    e.stopPropagation();
                    ctx.filterAdjustments[cfg.id] = cfg.def;
                    slider.value = cfg.def;
                    val.textContent = cfg.def + cfg.unit;
                    card.classList.remove('modified');
                    updateTrack(cfg.def);
                    dot.classList.toggle('visible', section.sliders.some(s => {
                        const sv = ctx.filterAdjustments[s.id] !== undefined ? ctx.filterAdjustments[s.id] : s.def;
                        return Math.abs(sv - s.def) > 0.01;
                    }));
                    ctx._applyComputedFilter(video);
                    VideoFiltersUI.saveFilterSettings(ctx);
                };

                valWrap.appendChild(val);
                valWrap.appendChild(resetBtn);
                headerRow.appendChild(titleEl);
                headerRow.appendChild(valWrap);
                card.appendChild(headerRow);
                card.appendChild(sliderContainer);
                bodyInner.appendChild(card);
            });

            sec.appendChild(hdr);
            sec.appendChild(bodyWrapper);
            wrap.appendChild(sec);
        });

        return wrap;
    }
}
