// popup-components.js — Specialized component initializers

const escapeHTML = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

export function initComponents(document, state, ui, updateSetting, notifyThemeChange, saveSettings) {
    
    function applyThemeToPopup(themeKey, customThemesObj = null, nativeThemeMode = 'dark') {
        let actualThemeKey = themeKey;
        if (themeKey === 'system') {
            actualThemeKey = nativeThemeMode === 'light' ? 'minimalism' : 'midnight';
        }
        document.documentElement.setAttribute('data-ypp-theme', actualThemeKey);
        document.documentElement.classList.add('yt-spiral-tube-theme');
        const link = document.getElementById('ypp-active-theme-css');
        if (link) link.remove();
        
        const applyCustom = (themes) => {
            let style = document.getElementById('ypp-custom-theme-style');
            if (style) style.remove();
            
            if (actualThemeKey.startsWith('custom_') && themes && themes[actualThemeKey]) {
                const theme = themes[actualThemeKey];
                style = document.createElement('style');
                style.id = 'ypp-custom-theme-style';
                const cssVars = Object.entries(theme.variables || {})
                    .map(([k, v]) => `${k}: ${v} !important;`)
                    .join('\n');
                style.textContent = `:root {\n${cssVars}\n}`;
                document.head.appendChild(style);
            }
        };

        if (customThemesObj) {
            applyCustom(customThemesObj);
        } else if (themeKey.startsWith('custom_')) {
            chrome.storage.local.get('settings', (data) => {
                applyCustom(data.settings?.customThemes);
            });
        } else {
            applyCustom({});
        }
    }

    function initThemeSelector(currentTheme) {
        const themeGrid = document.getElementById('themeGrid');
        if (!themeGrid) return;

        const themeCategories = [
            {
                name: 'System & Basics',
                themes: [
                    { key: 'system', label: 'System Auto', meta: 'Follows OS', color: 'split' },
                    { key: 'default', label: 'YouTube Dark', meta: 'Default', color: '#0f0f0f' },
                    { key: 'midnight', label: 'Midnight', meta: 'OLED Black', color: '#000000' },
                    { key: 'minimalism', label: 'Minimalism', meta: 'Clean', color: '#fafafa' },
                    { key: 'material', label: 'Material You', meta: 'Google M3', color: '#1f1f1f' }
                ]
            },
            {
                name: 'Core Colors',
                themes: [
                    { key: 'ocean', label: 'Ocean Blue', meta: 'Deep Blue', color: '#051421' },
                    { key: 'forest', label: 'Forest', meta: 'Green', color: '#0f1c15' },
                    { key: 'cherry', label: 'Cherry', meta: 'Pink', color: '#26181b' },
                    { key: 'coffee', label: 'Coffee', meta: 'Latte', color: '#2a201c' },
                    { key: 'bloodmoon', label: 'Blood Moon', meta: 'Crimson', color: '#1a0505' }
                ]
            },
            {
                name: 'Dark & Moody',
                themes: [
                    { key: 'dracula', label: 'Dracula', meta: 'High Contrast', color: '#282a36' },
                    { key: 'nord', label: 'Nord', meta: 'Frost', color: '#2e3440' },
                    { key: 'discord', label: 'Discord Dark', meta: 'Chat', color: '#36393f' },
                    { key: 'hacker', label: 'Hacker Green', meta: 'Terminal', color: '#0a140a' },
                    { key: 'abyss', label: 'Abyss', meta: 'Deep Sea', color: '#01080a' },
                    { key: 'ember', label: 'Ember', meta: 'Hot Coals', color: '#141414' },
                    { key: 'sunset', label: 'Sunset Glow', meta: 'Warm', color: '#1a0b1a' },
                    { key: 'deepspace', label: 'Deep Space', meta: 'Nebula', color: '#020205' },
                    { key: 'nebula', label: 'Nebula', meta: 'Purple Space', color: '#0f0518' },
                    { key: 'terminalism', label: 'Terminalism', meta: 'Hacker', color: '#000000' }
                ]
            },
            {
                name: 'Sci-Fi & Cyber',
                themes: [
                    { key: 'cyberpunk', label: 'Cyberpunk', meta: 'Neon', color: '#0a0a0f' },
                    { key: 'outrun', label: 'Outrun Synth', meta: '80s Retro', color: '#1a0524' },
                    { key: 'hologram', label: 'Hologram', meta: 'Sci-Fi Cyan', color: '#e0f7fa' },
                    { key: 'maximalism', label: 'Maximalism', meta: 'Loud', color: '#ff00ff' },
                    { key: 'aurora', label: 'Aurora', meta: 'Lights', color: '#0a0a0a' }
                ]
            },
            {
                name: 'Retro & Aesthetics',
                themes: [
                    { key: 'retro', label: 'Retro OS', meta: 'Windows 95', color: '#c0c0c0' },
                    { key: 'vintage', label: 'Vintage', meta: 'Classic', color: '#e0cda7' },
                    { key: 'blue-sky', label: 'Blue Sky', meta: 'Airy Clouds', color: '#87ceeb' },
                    { key: 'technozen', label: 'Technozen', meta: 'Eco Tech', color: '#dff4e8' },
                    { key: 'frutiger-aero', label: 'Frutiger Aero', meta: 'Web 2.0', color: '#bfe6ff' },
                    { key: 'claymorphism', label: 'Claymorphism', meta: 'Puffy 3D', color: '#f0e8ff' },
                    { key: 'brutalism', label: 'Brutalism', meta: 'Raw UI', color: '#ffffff' },
                    { key: 'glassmorphism', label: 'Glassmorphism', meta: 'Frosted', color: '#0f0c29' }
                ]
            }
        ];

        chrome.storage.local.get('settings', (data) => {
            const nativeMode = data.settings?.nativeThemeMode || 'dark';
            
            // Update the system theme entry based on nativeMode
            const sysCat = themeCategories.find(c => c.name === 'System & Basics');
            if (sysCat) {
                const sysTheme = sysCat.themes.find(t => t.key === 'system');
                if (sysTheme) {
                    sysTheme.label = nativeMode === 'dark' ? 'Native Dark' : 'Native Light';
                    sysTheme.meta = 'Toggle to switch';
                    sysTheme.color = nativeMode === 'dark' ? '#0f0f0f' : '#ffffff';
                }
            }
            
            const customThemesObj = data.settings?.customThemes || {};
            const customThemes = Object.keys(customThemesObj).map(k => ({
                key: k,
                label: customThemesObj[k].name || 'Custom Theme',
                meta: 'Custom',
                color: customThemesObj[k].variables['--ypp-bg-base'] || '#000000',
                isCustom: true
            }));

            if (customThemes.length > 0) {
                themeCategories.unshift({
                    name: 'Custom Themes',
                    themes: customThemes
                });
            }

            themeGrid.innerHTML = '';
            themeGrid.style.display = 'flex';
            themeGrid.style.flexDirection = 'column';
            themeGrid.style.gap = '16px';
            
            themeCategories.forEach(category => {
                const categoryWrapper = document.createElement('div');
                categoryWrapper.className = 'theme-category-wrapper';
                
                const groupLabel = document.createElement('div');
                groupLabel.className = 'theme-group-label';
                groupLabel.textContent = category.name;
                groupLabel.style.width = '100%';
                groupLabel.style.fontSize = '11px';
                groupLabel.style.color = 'rgba(255,255,255,0.4)';
                groupLabel.style.textTransform = 'uppercase';
                groupLabel.style.letterSpacing = '0.05em';
                groupLabel.style.marginBottom = '8px';
                groupLabel.style.fontWeight = '600';
                categoryWrapper.appendChild(groupLabel);

                const innerGrid = document.createElement('div');
                innerGrid.className = 'theme-grid-inner';
                innerGrid.style.display = 'grid';
                innerGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
                innerGrid.style.gap = '8px';
                innerGrid.style.width = '100%';
                
                category.themes.forEach(theme => {
                    const btn = document.createElement('div');
                    btn.className = `theme-btn ${theme.key === currentTheme ? 'active' : ''}`;
                    btn.dataset.theme = theme.key;
                    
                    btn.style.backgroundColor = theme.color;
                    // Determine if color is light to set text color and border
                    const hex = theme.color.replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16) || 0;
                    const g = parseInt(hex.substr(2, 2), 16) || 0;
                    const b = parseInt(hex.substr(4, 2), 16) || 0;
                    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                    
                    if (brightness > 155) {
                        btn.style.color = '#000';
                        btn.style.border = '1px solid rgba(0,0,0,0.5)';
                    } else {
                        btn.style.color = '#fff';
                        btn.style.border = '1px solid rgba(255,255,255,0.3)';
                    }
                    
                    const info = document.createElement('div');
                    info.className = 'theme-info';
                    info.innerHTML = `
                        <span class="theme-name">${escapeHTML(theme.label)}</span>
                        <span class="theme-meta">${escapeHTML(theme.meta)}</span>
                    `;

                    btn.appendChild(info);

                    if (theme.isCustom) {
                        const delBtn = document.createElement('button');
                        delBtn.innerHTML = '✕';
                        delBtn.style.position = 'absolute';
                        delBtn.style.top = '4px';
                        delBtn.style.right = '4px';
                        delBtn.style.background = 'rgba(0,0,0,0.5)';
                        delBtn.style.border = 'none';
                        delBtn.style.color = '#fff';
                        delBtn.style.borderRadius = '50%';
                        delBtn.style.width = '16px';
                        delBtn.style.height = '16px';
                        delBtn.style.fontSize = '10px';
                        delBtn.style.cursor = 'pointer';
                        delBtn.style.display = 'none';
                        
                        btn.style.position = 'relative';
                        btn.addEventListener('mouseenter', () => delBtn.style.display = 'block');
                        btn.addEventListener('mouseleave', () => delBtn.style.display = 'none');
                        
                        delBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (confirm('Delete this custom theme?')) {
                                chrome.storage.local.get('settings', (d) => {
                                    const st = d.settings || {};
                                    if (st.customThemes) {
                                        delete st.customThemes[theme.key];
                                    }
                                    if (st.activeTheme === theme.key) {
                                        st.activeTheme = 'default';
                                    }
                                    chrome.storage.local.set({ settings: st }, () => {
                                        initThemeSelector(st.activeTheme);
                                        applyThemeToPopup(st.activeTheme, st.customThemes);
                                        notifyThemeChange(st.activeTheme);
                                        // storage.onChanged handles the update in content scripts
                                    });
                                });
                            }
                        });
                        btn.appendChild(delBtn);
                    }

                    btn.addEventListener('click', () => {
                        const wasActive = btn.classList.contains('active');
                        
                        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const newTheme = theme.key;
                        
                        if (theme.key === 'system') {
                            chrome.storage.local.get('settings', (d) => {
                                const st = d.settings || {};
                                if (wasActive) {
                                    // Toggle mode
                                    st.nativeThemeMode = (st.nativeThemeMode === 'light') ? 'dark' : 'light';
                                    
                                    // Update UI
                                    const nextMode = st.nativeThemeMode;
                                    theme.label = nextMode === 'dark' ? 'Native Dark' : 'Native Light';
                                    theme.color = nextMode === 'dark' ? '#0f0f0f' : '#ffffff';
                                    btn.style.backgroundColor = theme.color;
                                    const infoName = btn.querySelector('.theme-name');
                                    if (infoName) infoName.textContent = theme.label;
                                    
                                    if (nextMode === 'light') {
                                        btn.style.color = '#000';
                                        btn.style.border = '1px solid rgba(0,0,0,0.5)';
                                        document.body.classList.remove('ypp-theme-dark');
                                        localStorage.setItem('ypp-popup-dark', false);
                                    } else {
                                        btn.style.color = '#fff';
                                        btn.style.border = '1px solid rgba(255,255,255,0.3)';
                                        document.body.classList.add('ypp-theme-dark');
                                        localStorage.setItem('ypp-popup-dark', true);
                                    }
                                } else {
                                    const mode = st.nativeThemeMode || 'dark';
                                    if (mode === 'light') {
                                        document.body.classList.remove('ypp-theme-dark');
                                        localStorage.setItem('ypp-popup-dark', false);
                                    } else {
                                        document.body.classList.add('ypp-theme-dark');
                                        localStorage.setItem('ypp-popup-dark', true);
                                    }
                                }
                                st.activeTheme = newTheme;
                                st.premiumTheme = newTheme; // Sync with content script
                                
                                chrome.storage.local.set({ settings: st }, () => {
                                    applyThemeToPopup(newTheme, customThemesObj, st.nativeThemeMode);
                                    notifyThemeChange(newTheme, st);
                                    
                                    // Ensure content script gets the updated nativeThemeMode via storage.onChanged
                                });
                            });
                        } else {
                            // Update popup background color based on theme brightness
                            const hex = (theme.color || '#000000').replace('#', '');
                            const r = parseInt(hex.substr(0, 2), 16) || 0;
                            const g = parseInt(hex.substr(2, 2), 16) || 0;
                            const b = parseInt(hex.substr(4, 2), 16) || 0;
                            const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                            const isDark = brightness <= 155;
                            if (isDark) {
                                document.body.classList.add('ypp-theme-dark');
                                localStorage.setItem('ypp-popup-dark', true);
                            } else {
                                document.body.classList.remove('ypp-theme-dark');
                                localStorage.setItem('ypp-popup-dark', false);
                            }
                            
                            updateSetting('activeTheme', newTheme);
                            applyThemeToPopup(newTheme, customThemesObj);
                            notifyThemeChange(newTheme);
                        }
                    });

                    innerGrid.appendChild(btn);
                });
                
                categoryWrapper.appendChild(innerGrid);
                themeGrid.appendChild(categoryWrapper);
            });

            applyThemeToPopup(currentTheme, customThemesObj, nativeMode);
        });
    }

    function initCustomThemeBuilder() {
        const saveBtn = document.getElementById('saveCustomThemeBtn');
        const exportBtn = document.getElementById('exportCustomThemeBtn');
        const importBtn = document.getElementById('importCustomThemeBtn');
        const importFile = document.getElementById('importCustomThemeFile');
        
        if (!saveBtn) return;
        
        saveBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('customThemeName');
            const bgBase = document.getElementById('customThemeBgBase').value;
            const bgSurface = document.getElementById('customThemeBgSurface').value;
            const accent = document.getElementById('customThemeAccent').value;
            const text = document.getElementById('customThemeText').value;
            
            let name = nameInput.value.trim();
            if (!name) name = 'My Custom Theme';
            
            const themeKey = 'custom_' + Date.now();
            
            chrome.storage.local.get('settings', (data) => {
                const settings = data.settings || {};
                if (!settings.customThemes) settings.customThemes = {};
                
                settings.customThemes[themeKey] = {
                    name: name,
                    variables: {
                        '--ypp-bg-base': bgBase,
                        '--ypp-bg-surface': bgSurface,
                        '--ypp-accent-primary': accent,
                        '--ypp-text-primary': text,
                        '--ypp-bg-card': bgSurface,
                        '--ypp-text-secondary': text + 'b3', // slightly transparent text
                    }
                };
                
                settings.activeTheme = themeKey;
                
                chrome.storage.local.set({ settings }, () => {
                    initThemeSelector(themeKey);
                    applyThemeToPopup(themeKey, settings.customThemes);
                    notifyThemeChange(themeKey);
                    nameInput.value = '';
                    
                    if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
                    
                    // UI and background handle storage.onChanged
                });
            });
        });

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                chrome.storage.local.get('settings', (data) => {
                    const customThemes = data.settings?.customThemes || {};
                    if (Object.keys(customThemes).length === 0) {
                        alert('No custom themes to export.');
                        return;
                    }
                    const blob = new Blob([JSON.stringify(customThemes, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ypp-custom-themes.json';
                    a.click();
                    URL.revokeObjectURL(url);
                });
            });
        }

        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const imported = JSON.parse(ev.target.result);
                        chrome.storage.local.get('settings', (data) => {
                            const settings = data.settings || {};
                            if (!settings.customThemes) settings.customThemes = {};
                            
                            // Merge
                            for (const [key, theme] of Object.entries(imported)) {
                                if (key.startsWith('custom_') && theme.variables) {
                                    settings.customThemes[key] = theme;
                                }
                            }
                            
                            chrome.storage.local.set({ settings }, () => {
                                initThemeSelector(settings.activeTheme || 'default');
                                alert('Themes imported successfully!');
                                if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
                            });
                        });
                    } catch (err) {
                        alert('Invalid theme file.');
                    }
                };
                reader.readAsText(file);
                importFile.value = ''; // Reset
            });
        }
    }

    function initPremiumAccentDropdown() {
        const select = document.getElementById('premiumAccentSelect');
        const colorPicker = document.getElementById('accentColor');
        if (!select || !colorPicker) return;

        if (window.YPP && window.YPP.CONSTANTS && window.YPP.CONSTANTS.PREMIUM_COLORS) {
            const colors = window.YPP.CONSTANTS.PREMIUM_COLORS;
            for (const [key, hex] of Object.entries(colors)) {
                const label = key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const opt = document.createElement('option');
                opt.value = hex;
                opt.textContent = label;
                select.appendChild(opt);
            }
        }

        select.addEventListener('change', () => {
            if (select.value) {
                colorPicker.value = select.value;
                colorPicker.dispatchEvent(new Event('input'));
            }
        });

        colorPicker.addEventListener('input', () => {
            select.value = colorPicker.value || '';
        });

        setTimeout(() => {
            select.value = colorPicker.value || '';
        }, 100);
    }

    function initSearchViewMode() {
        const container = document.getElementById('searchViewModeToggle');
        if (!container) return;

        const btns = container.querySelectorAll('.view-mode-btn');

        const applyActiveState = (mode) => {
            btns.forEach(b => {
                const isActive = b.dataset.mode === mode;
                b.classList.toggle('active', isActive);
                b.style.background = isActive ? 'rgba(62,166,255,0.22)' : 'transparent';
                b.style.color = isActive ? '#ff4e45' : 'rgba(255,255,255,0.5)';
            });
        };

        chrome.storage.local.get(['searchViewMode'], (result) => {
            const savedMode = result.searchViewMode || localStorage.getItem('ypp_searchViewMode') || 'grid';
            applyActiveState(savedMode);
        });

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                applyActiveState(mode);

                chrome.storage.local.set({ searchViewMode: mode });
                localStorage.setItem('ypp_searchViewMode', mode);

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const tab = tabs[0];
                    if (tab && tab.url && tab.url.includes('youtube.com/results')) {
                        chrome.tabs.sendMessage(tab.id, {
                            type: 'YPP_SET_SEARCH_VIEW_MODE',
                            mode: mode
                        }).catch(() => {});
                    }
                });
            });
        });
    }


    function initHideWatchedModePill() {
        const btns = document.querySelectorAll('.hw-mode-btn');
        const hiddenInput = document.getElementById('hideWatchedMode');
        if (!btns.length || !hiddenInput) return;

        const applyMode = (mode) => {
            hiddenInput.value = mode;
            btns.forEach(b => {
                const isActive = b.dataset.mode === mode;
                b.classList.toggle('active', isActive);
                b.style.background = isActive ? 'rgba(62,166,255,0.22)' : 'transparent';
                b.style.color = isActive ? 'var(--accent, #3ea6ff)' : 'rgba(255,255,255,0.5)';
            });
        };

        chrome.storage.local.get('settings', (data) => {
            const mode = data.settings?.hideWatchedMode || 'dim';
            applyMode(mode);
        });

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                applyMode(btn.dataset.mode);
                saveSettings(() => ui.showSaveIndicator(document));
            });
        });
    }

    function initGlobalPlayerBarGrid() {
        const btns = document.querySelectorAll('.gpb-btn');
        if (!btns.length) return;
        
        const syncState = () => {
            btns.forEach(btn => {
                const targetId = btn.dataset.target;
                const cb = document.getElementById(targetId);
                if (cb) btn.classList.toggle('active', cb.checked);
            });
        };

        // Sync initial state slightly after popup-state.js loads settings
        setTimeout(syncState, 150);

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const cb = document.getElementById(targetId);
                if (cb) {
                    cb.checked = !cb.checked;
                    btn.classList.toggle('active', cb.checked);
                    cb.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });
    }

    function initCardStyleGrid() {
        const btns = document.querySelectorAll('.card-style-btn[data-style]');
        const hiddenInput = document.getElementById('cardStyle');
        if (!btns.length || !hiddenInput) return;

        const applyStyle = (styleVal) => {
            hiddenInput.value = styleVal;
            btns.forEach(b => {
                const isActive = b.dataset.style === styleVal;
                b.classList.toggle('active', isActive);
            });
        };

        chrome.storage.local.get('settings', (data) => {
            const styleVal = data.settings?.cardStyle || 'glass';
            applyStyle(styleVal);
        });

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                applyStyle(btn.dataset.style);
                const event = new Event('change', { bubbles: true });
                hiddenInput.dispatchEvent(event);
            });
        });
    }

    function initYoutubeStyleGrid() {
        const btns = document.querySelectorAll('.youtube-style-btn');
        const hiddenInput = document.getElementById('youtubePageTheme');
        if (!btns.length || !hiddenInput) return;

        const applyStyle = (styleVal) => {
            hiddenInput.value = styleVal;
            btns.forEach(b => {
                const isActive = b.dataset.style === styleVal;
                b.classList.toggle('active', isActive);
            });
        };

        chrome.storage.local.get('settings', (data) => {
            const styleVal = data.settings?.youtubePageTheme || 'default';
            applyStyle(styleVal);
        });

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                applyStyle(btn.dataset.style);
                const event = new Event('change', { bubbles: true });
                hiddenInput.dispatchEvent(event);
            });
        });
    }

    function initPopupStyleGrid() {
        const btns = document.querySelectorAll('.popup-style-btn');
        const hiddenInput = document.getElementById('popupUiTheme');
        if (!btns.length || !hiddenInput) return;

        const applyStyle = (styleVal) => {
            hiddenInput.value = styleVal;
            btns.forEach(b => {
                const isActive = b.dataset.style === styleVal;
                b.classList.toggle('active', isActive);
            });
        };

        chrome.storage.local.get('settings', (data) => {
            const styleVal = data.settings?.popupUiTheme || 'liquid-glass';
            applyStyle(styleVal);
        });

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                applyStyle(btn.dataset.style);
                const event = new Event('change', { bubbles: true });
                hiddenInput.dispatchEvent(event);
            });
        });
    }

    function initCursorStyleGrid() {
        const btns = document.querySelectorAll('.cursor-style-btn');
        const hiddenInput = document.getElementById('customCursor');
        if (!btns.length || !hiddenInput) return;

        const applyStyle = (styleVal) => {
            hiddenInput.value = styleVal;
            btns.forEach(b => {
                const isActive = b.dataset.style === styleVal;
                b.classList.toggle('active', isActive);
                if (isActive) {
                    b.style.background = 'rgba(255,255,255,0.15)';
                    b.style.border = '1px solid rgba(255,255,255,0.3)';
                } else {
                    b.style.background = 'rgba(255,255,255,0.03)';
                    b.style.border = '1px solid rgba(255,255,255,0.05)';
                }
            });
        };

        chrome.storage.local.get('settings', (data) => {
            const styleVal = data.settings?.customCursor || 'default';
            applyStyle(styleVal);
        });

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                applyStyle(btn.dataset.style);
                const event = new Event('change', { bubbles: true });
                hiddenInput.dispatchEvent(event);
            });
        });
    }

    function initAccentColorSwatches() {
        const swatches = document.querySelectorAll('.color-swatch[data-color]');
        const customInput = document.getElementById('accentColor');
        if (!customInput) return;

        const dualModeToggle = document.getElementById('dualColorMode');
        const secondaryGroup = document.getElementById('secondaryAccentGroup');
        const primaryInput = document.getElementById('primaryAccentColor');
        const secondaryInput = document.getElementById('secondaryAccentColor');

        const applySwatchActive = (color) => {
            let foundMatch = false;
            swatches.forEach(swatch => {
                const isActive = swatch.dataset.color.toLowerCase() === color.toLowerCase();
                swatch.classList.toggle('active', isActive);
                if (isActive) foundMatch = true;
            });
            if (!foundMatch && customInput) {
                customInput.value = color;
                if (customInput.previousElementSibling) customInput.previousElementSibling.classList.add('active');
            } else if (customInput && customInput.previousElementSibling) {
                customInput.previousElementSibling.classList.remove('active');
            }
            if (primaryInput) primaryInput.value = color;
        };

        chrome.storage.local.get('settings', (data) => {
            const color = data.settings?.accentColor || '#ff4e45';
            const dualMode = data.settings?.dualColorMode || false;
            const secColor = data.settings?.secondaryAccentColor || '#00e5ff';
            
            applySwatchActive(color);
            if (dualModeToggle) dualModeToggle.checked = dualMode;
            if (secondaryInput) secondaryInput.value = secColor;
            if (secondaryGroup) secondaryGroup.style.display = dualMode ? 'block' : 'none';
        });

        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = swatch.dataset.color;
                if (customInput) customInput.value = color;
                if (primaryInput) primaryInput.value = color;
                applySwatchActive(color);
                
                // If dual color mode is ON, and user clicks a swatch, we just update primary for now
                // Or maybe we can update the accentColor
                const event = new Event('change', { bubbles: true });
                if (customInput) customInput.dispatchEvent(event);
                if (primaryInput) primaryInput.dispatchEvent(event);
            });
        });

        if (customInput) {
            customInput.addEventListener('input', () => {
                applySwatchActive(customInput.value);
                if (primaryInput) primaryInput.value = customInput.value;
            });
        }
        
        if (primaryInput) {
            primaryInput.addEventListener('input', () => {
                applySwatchActive(primaryInput.value);
                if (customInput) customInput.value = primaryInput.value;
                const event = new Event('change', { bubbles: true });
                if (customInput) customInput.dispatchEvent(event);
            });
        }

        if (dualModeToggle) {
            dualModeToggle.addEventListener('change', () => {
                if (secondaryGroup) secondaryGroup.style.display = dualModeToggle.checked ? 'block' : 'none';
            });
        }
    }

    // Export these for external triggering if needed
    return {
        initThemeSelector,
        initPremiumAccentDropdown,
        initSearchViewMode,
        initHideWatchedModePill,
        initGlobalPlayerBarGrid,
        initCardStyleGrid,
        initYoutubeStyleGrid,
        initPopupStyleGrid,
        initCursorStyleGrid,
        initAccentColorSwatches,
        initCustomThemeBuilder,
        applyThemeToPopup
    };
}
