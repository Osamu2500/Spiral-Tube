// popup-components.js — Specialized component initializers
import { t } from '../../../shared/locales/i18n.js';

const escapeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};


export function initthemeselector(document, state, ui, updateSetting, notifyThemeChange, saveSettings) {
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
          name: t('system_basics'),
          themes: [
            { key: 'system', label: t('system_auto'), meta: t('follows_os'), color: 'split' },
            { key: 'default', label: t('youtube_dark'), meta: t('default'), color: '#0f0f0f' },
            { key: 'midnight', label: t('midnight'), meta: t('oled_black'), color: '#000000' },
            { key: 'minimalism', label: t('minimalism'), meta: t('clean'), color: '#fafafa' },
            { key: 'material', label: t('material_you'), meta: t('google_m3'), color: '#1f1f1f' },
          ],
        },
        {
          name: t('core_colors'),
          themes: [
            { key: 'ocean', label: t('ocean_blue'), meta: t('deep_blue'), color: '#051421' },{ key: 'cherry', label: t('cherry'), meta: t('pink'), color: '#26181b' },
            { key: 'kawaii', label: t('kawaii'), meta: t('pink_cute'), color: '#fff1f4' },
            { key: 'coffee', label: t('coffee'), meta: t('latte'), color: '#2a201c' },
            { key: 'bloodmoon', label: t('blood_moon'), meta: t('crimson'), color: '#1a0505' },
          ],
        },
        {
          name: t('dark_moody'),
          themes: [
            { key: 'dracula', label: t('dracula'), meta: t('high_contrast'), color: '#282a36' },
            { key: 'nord', label: t('nord'), meta: t('frost'), color: '#2e3440' },
            { key: 'discord', label: t('discord_dark'), meta: t('chat'), color: '#36393f' },
            { key: 'hacker', label: t('hacker_green'), meta: t('terminal'), color: '#0a140a' },
            { key: 'abyss', label: t('abyss'), meta: t('deep_sea'), color: '#01080a' },
            { key: 'ember', label: t('ember'), meta: t('hot_coals'), color: '#141414' },
            { key: 'sunset', label: t('sunset_glow'), meta: t('warm'), color: '#1a0b1a' },
            { key: 'deepspace', label: t('deep_space'), meta: t('nebula'), color: '#020205' },
            { key: 'nebula', label: t('nebula'), meta: t('purple_space'), color: '#0f0518' },
            { key: 'terminalism', label: t('terminalism'), meta: t('hacker'), color: '#000000' },
            { key: 'harry-potter', label: t('hogwarts_magic'), meta: 'Gold & Parchment', color: '#14151f' },
          ],
        },
        {
          name: t('sci_fi_cyber'),
          themes: [
            { key: 'cyberpunk', label: t('cyberpunk'), meta: t('neon'), color: '#0a0a0f' },
            { key: 'outrun', label: t('outrun_synth'), meta: t('80s_retro'), color: '#1a0524' },
            { key: 'hologram', label: t('hologram'), meta: t('sci_fi_cyan'), color: '#e0f7fa' },
            { key: 'maximalism', label: t('maximalism'), meta: t('loud'), color: '#ff00ff' },
            { key: 'aurora', label: t('aurora'), meta: t('lights'), color: '#0a0a0a' },
          ],
        },
        {
          name: t('retro_aesthetics'),
          themes: [
            { key: 'retro', label: t('retro_os'), meta: t('windows_95'), color: '#c0c0c0' },
            { key: 'vintage', label: t('vintage'), meta: t('classic'), color: '#e0cda7' },
            { key: 'blue-sky', label: t('blue_sky'), meta: t('airy_clouds'), color: '#87ceeb' },
            { key: 'technozen', label: t('technozen'), meta: t('eco_tech'), color: '#dff4e8' },
            { key: 'frutiger-aero', label: t('frutiger_aero'), meta: t('web_2_0'), color: '#bfe6ff' },
            { key: 'claymorphism', label: 'Claymorphism', meta: 'Puffy 3D', color: '#f0e8ff' },
            { key: 'brutalism', label: 'Brutalism', meta: 'Raw UI', color: '#ffffff' },
            { key: 'neo-brutalism', label: 'Neo-Brutal', meta: 'Bold Offset', color: '#f4f4f0' },
            { key: 'glassmorphism', label: 'Glassmorphism', meta: 'Frosted Glass', color: '#0f0c29' },
            { key: 'colorize', label: t('colorize'), meta: t('glass_dynamic'), color: '#0f0f0f' },
            { key: 'vaporwave', label: 'Vaporwave', meta: '90s Neon', color: '#b967ff' },
            { key: 'retro-wave', label: 'Retro Wave', meta: '80s Synth', color: '#2b003a' },
            { key: 'y2k', label: 'Y2K', meta: 'Late 90s', color: '#e6e6fa' },
            { key: 'grunge', label: 'Grunge', meta: 'Zine & Torn', color: '#1c1c1c' },
          ],
        },
        {
          name: 'Nature & Seasonal',
          themes: [
            { key: 'autumn', label: 'Autumn', meta: 'Seasonal', color: '#b5541b' },
            { key: 'nature', label: 'Nature', meta: 'Forest', color: '#2e8b57' },
            { key: 'christmas', label: 'Christmas', meta: 'Festive', color: '#165016' },
            { key: 'sakura', label: 'Sakura', meta: 'Cherry Blossom', color: '#fff0f5' },
          ]
        },
        {
          name: 'Art, Culture & Design',
          themes: [
            { key: 'kawaii', label: 'Kawaii', meta: 'Bubbly Pink', color: '#ffb6c1' },
            { key: 'steampunk', label: 'Steampunk', meta: 'Brass & Copper', color: '#f5deb3' },
            { key: 'origami', label: 'Origami', meta: 'Paper Folds', color: '#fdfbf7' },
            { key: 'gothic', label: 'Gothic', meta: 'Dark Arches', color: '#121212' },
            { key: 'woodblock', label: 'Woodblock', meta: 'Ukiyo-e Art', color: '#f5e6c8' },
            { key: 'neumorphic', label: 'Neumorphic', meta: 'Soft 3D', color: '#e0e5ec' },
            { key: 'liquid-glass', label: 'Liquid Glass', meta: 'Apple', color: '#1a1a1a' },
          ]
        },
        {
          name: 'UserStyles',
          themes: [
            { key: 'fluent', label: t('fluent'), meta: 'UI Fix', color: '#111111' },
            { key: 'crystal-glass', label: t('crystal_glass'), meta: 'Frosted', color: '#f0f0f0' },
            { key: 'ice-blue', label: t('ice_blue'), meta: 'Cold', color: '#e0f7fa' },
            { key: 'cairo-red', label: t('cairo_red'), meta: 'Pure Red', color: '#ff0000' },
            { key: 'pink', label: t('cherry'), meta: 'Pink', color: '#ffb6c1' },
            { key: 'retrowave-green', label: t('hacker_green'), meta: 'Retro', color: '#00ff00' },
          ],
        },
      ];
  
      chrome.storage.local.get('settings', (data) => {
        const nativeMode = data.settings?.nativeThemeMode || 'dark';
  
        // Update the system theme entry based on nativeMode
        const sysCat = themeCategories.find((c) => c.name === 'System & Basics');
        if (sysCat) {
          const sysTheme = sysCat.themes.find((t) => t.key === 'system');
          if (sysTheme) {
            sysTheme.label = nativeMode === 'dark' ? t('native_dark') : t('native_light');
            sysTheme.meta = t('toggle_to_switch');
            sysTheme.color = nativeMode === 'dark' ? '#0f0f0f' : '#ffffff';
          }
        }
  
        const customThemesObj = data.settings?.customThemes || {};
        const customThemes = Object.keys(customThemesObj).map((k) => ({
          key: k,
          label: customThemesObj[k].name || t('custom_theme'),
          meta: t('custom'),
          color: customThemesObj[k].variables['--ypp-bg-base'] || '#000000',
          isCustom: true,
        }));
  
        if (customThemes.length > 0) {
          themeCategories.unshift({
            name: t('custom_themes'),
            themes: customThemes,
          });
        }
  
        themeGrid.innerHTML = '';
        themeGrid.style.display = 'grid';
        themeGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        themeGrid.style.gap = '8px';
        themeGrid.style.width = '100%';
  
        // Flatten all themes into a single array
        const allThemes = [];
        themeCategories.forEach(category => {
          category.themes.forEach(theme => {
            allThemes.push(theme);
          });
        });
  
        allThemes.forEach((theme) => {
            const btn = document.createElement('div');
            btn.className = `theme-btn ${theme.key === currentTheme ? 'active' : ''}`;
            btn.dataset.theme = theme.key;
  
            btn.style.backgroundColor = theme.color;
            // Determine if color is light to set text color and border
            const hex = theme.color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16) || 0;
            const g = parseInt(hex.substr(2, 2), 16) || 0;
            const b = parseInt(hex.substr(4, 2), 16) || 0;
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
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
              btn.addEventListener('mouseenter', () => (delBtn.style.display = 'block'));
              btn.addEventListener('mouseleave', () => (delBtn.style.display = 'none'));
  
              delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(t('delete_this_custom_theme'))) {
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
  
              document
                .querySelectorAll('.theme-btn[data-theme]')
                .forEach((b) => b.classList.remove('active'));
              btn.classList.add('active');
              const newTheme = theme.key;
  
              if (theme.key === 'system') {
                chrome.storage.local.get('settings', (d) => {
                  const st = d.settings || {};
                  if (wasActive) {
                    // Toggle mode
                    st.nativeThemeMode = st.nativeThemeMode === 'light' ? 'dark' : 'light';
  
                    // Update UI
                    const nextMode = st.nativeThemeMode;
                    theme.label = nextMode === 'dark' ? t('native_dark') : t('native_light');
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
                  st.premiumTheme = true; // Sync with content script
  
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
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
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
  
            themeGrid.appendChild(btn);
          });
  
        applyThemeToPopup(currentTheme, customThemesObj, nativeMode);
      });
    }

  function initCustomThemeBuilder() {
      const saveBtn = document.getElementById('saveCustomThemeBtn');
      const exportBtn = document.getElementById('exportCustomThemeBtn');
      const importBtn = document.getElementById('importCustomThemeBtn');
      const importFile = document.getElementById('importCustomThemeFile');
      const resetBtn = document.getElementById('resetCustomThemeBtn');
  
      if (!saveBtn) return;
  
      const colorIds = ['customThemeBgBase', 'customThemeBgSurface', 'customThemeAccent', 'customThemeText'];
      const syncPreviews = () => {
        colorIds.forEach(id => {
          const el = document.getElementById(id);
          const preview = document.getElementById('preview' + id.replace('customTheme', ''));
          if (el && preview) preview.style.backgroundColor = el.value;
        });
      };
      colorIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', syncPreviews);
      });
      
      chrome.storage.local.get('settings', (data) => {
        const settings = data.settings || {};
        const activeKey = settings.activeTheme;
        if (activeKey && settings.customThemes && settings.customThemes[activeKey]) {
          const vars = settings.customThemes[activeKey].variables;
          if (vars['--ypp-bg-base']) document.getElementById('customThemeBgBase').value = vars['--ypp-bg-base'];
          if (vars['--ypp-bg-surface']) document.getElementById('customThemeBgSurface').value = vars['--ypp-bg-surface'];
          if (vars['--ypp-accent-primary']) document.getElementById('customThemeAccent').value = vars['--ypp-accent-primary'];
          if (vars['--ypp-text-primary']) document.getElementById('customThemeText').value = vars['--ypp-text-primary'];
        }
        syncPreviews();
      });
  
  
      const randomBtn = document.getElementById('randomCustomThemeBtn');
  
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          document.getElementById('customThemeName').value = '';
          
          const resetColor = (id, color) => {
            const el = document.getElementById(id);
            if (el) {
              el.value = color;
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          };
          
          resetColor('customThemeBgBase', '#0f0f0f');
          resetColor('customThemeBgSurface', '#212121');
          resetColor('customThemeAccent', '#ff4e45');
          resetColor('customThemeText', '#ffffff');
          
          syncPreviews();
          
          chrome.storage.local.get('settings', (data) => {
            const settings = data.settings || {};
            settings.activeTheme = 'default';
            chrome.storage.local.set({ settings }, () => {
              if (typeof initThemeSelector === 'function') initThemeSelector('default');
              if (typeof applyThemeToPopup === 'function') applyThemeToPopup('default', settings.customThemes || {});
              if (typeof notifyThemeChange === 'function') notifyThemeChange('default');
            });
          });
        });
      }
  
      if (randomBtn) {
        randomBtn.addEventListener('click', () => {
          const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          };
  
          const randomColor = (id) => {
            const el = document.getElementById(id);
            if (el) {
              el.value = getRandomColor();
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          };
  
          randomColor('customThemeBgBase');
          randomColor('customThemeBgSurface');
          randomColor('customThemeAccent');
          randomColor('customThemeText');
          
          syncPreviews();
        });
      }
  
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
            },
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
              alert(t('no_custom_themes_to_export'));
              return;
            }
            const blob = new Blob([JSON.stringify(customThemes, null, 2)], {
              type: 'application/json',
            });
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
                  alert(t('themes_imported_successfully'));
                  if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
                });
              });
            } catch (err) {
              alert(t('invalid_theme_file'));
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
          const label = key
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
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
        swatches.forEach((swatch) => {
          const isActive = swatch.dataset.color.toLowerCase() === color.toLowerCase();
          swatch.classList.toggle('active', isActive);
          if (isActive) foundMatch = true;
        });
        if (!foundMatch && customInput) {
          customInput.value = color;
          if (customInput.previousElementSibling)
            customInput.previousElementSibling.classList.add('active');
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
  
      swatches.forEach((swatch) => {
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
          if (secondaryGroup)
            secondaryGroup.style.display = dualModeToggle.checked ? 'block' : 'none';
        });
      }
    }

  function initImageBackgroundTheme() {
      const uploadBtn = document.getElementById('uploadImageThemeBtn');
      const fileInput = document.getElementById('imageThemeFileInput');
      const clearBtn = document.getElementById('clearImageThemeBtn');
      const previewContainer = document.getElementById('imageThemePreviewContainer');
      const previewDiv = document.getElementById('imageThemePreview');
      const overrideBadge = document.getElementById('imageThemeOverrideBadge');
      const intensitySlider = document.getElementById('imageThemeIntensity');
      const blurSlider = document.getElementById('imageThemeBlur');
      const brightnessSlider = document.getElementById('imageThemeBrightness');
      const saturationSlider = document.getElementById('imageThemeSaturation');
      const extractColorsCheck = document.getElementById('imageThemeExtractColors');
  
      if (!fileInput) return;
  
      const extractAndApplyPalette = (imgSource) => {
          const sampleCanvas = document.createElement('canvas');
          const sampleCtx = sampleCanvas.getContext('2d');
          sampleCanvas.width = 64;
          sampleCanvas.height = 64;
          sampleCtx.drawImage(imgSource, 0, 0, 64, 64);
          const data = sampleCtx.getImageData(0, 0, 64, 64).data;
          const colorCounts = {};
          
          // Use a bucket size of 32 for broader grouping
          for (let i = 0; i < data.length; i += 4) {
              const r = Math.round(data[i] / 32) * 32;
              const g = Math.round(data[i+1] / 32) * 32;
              const b = Math.round(data[i+2] / 32) * 32;
              const rgb = `${r},${g},${b}`;
              colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
          }
          
          const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
          const palette = [];
          
          // Euclidean distance for better visual distinctness check
          const dist = (c1, c2) => Math.sqrt(Math.pow(c1[0]-c2[0], 2) + Math.pow(c1[1]-c2[1], 2) + Math.pow(c1[2]-c2[2], 2));
          
          for (const [rgbStr] of sortedColors) {
              const rgb = rgbStr.split(',').map(Number);
              let distinct = true;
              for (const p of palette) {
                  // Ensure at least ~70 distance between selected palette colors
                  if (dist(rgb, p) < 70) {
                      distinct = false;
                      break;
                  }
              }
              if (distinct) {
                  palette.push(rgb);
                  if (palette.length >= 4) break;
              }
          }
          
          // Fallback: fill with next most common if distinctness is too strict
          while (palette.length < 4 && sortedColors.length > palette.length) {
              palette.push(sortedColors[palette.length][0].split(',').map(Number));
          }
          while (palette.length < 4) palette.push([0,0,0]);
          
          const hexPalette = palette.map(rgb => '#' + rgb[0].toString(16).padStart(2,'0') + rgb[1].toString(16).padStart(2,'0') + rgb[2].toString(16).padStart(2,'0'));
          
          updateSetting('extractedPalette', hexPalette);
          updateSetting('accentColor', hexPalette[0]);
          
          const boxesContainer = document.getElementById('extractedPaletteBoxes');
          if (boxesContainer) {
              boxesContainer.style.display = 'flex';
              for (let i = 0; i < 4; i++) {
                  const box = document.getElementById('paletteBox' + (i+1));
                  if (box) box.style.backgroundColor = hexPalette[i];
              }
          }
          
          const customInput = document.getElementById('accentColor');
          if (customInput) {
              customInput.value = hexPalette[0];
              customInput.dispatchEvent(new Event('input', {bubbles:true}));
          }
      };
  
      // Load saved settings
      chrome.storage.local.get('settings', (data) => {
        const settings = data.settings || {};
        
        if (settings.customBackgroundImage) {
          if(previewDiv) {
              previewDiv.style.backgroundImage = `url("${settings.customBackgroundImage}")`;
          }
          if(overrideBadge) overrideBadge.style.display = 'flex';
          
          if (settings.extractedPalette && settings.extractedPalette.length === 4) {
              const boxesContainer = document.getElementById('extractedPaletteBoxes');
              if (boxesContainer) {
                  boxesContainer.style.display = 'flex';
                  for (let i = 0; i < 4; i++) {
                      const box = document.getElementById('paletteBox' + (i+1));
                      if (box) box.style.backgroundColor = settings.extractedPalette[i];
                  }
              }
          }
        } else {
          if(previewDiv) previewDiv.style.backgroundImage = 'none';
          if(overrideBadge) overrideBadge.style.display = 'none';
        }
        
        if (intensitySlider) {
            intensitySlider.value = settings.customBackgroundImageIntensity ?? 0.6;
            const valEl = document.getElementById('customBackgroundImageIntensityValue');
            if (valEl) valEl.textContent = Math.round((settings.customBackgroundImageIntensity ?? 0.6) * 100) + '%';
        }
        if (blurSlider) {
            blurSlider.value = settings.customBackgroundImageBlur ?? 0;
            const valEl = document.getElementById('customBackgroundImageBlurValue');
            if (valEl) valEl.textContent = (settings.customBackgroundImageBlur ?? 0) + 'px';
        }
        if (brightnessSlider) {
            brightnessSlider.value = settings.customBackgroundImageBrightness ?? 1.0;
            const valEl = document.getElementById('customBackgroundImageBrightnessValue');
            if (valEl) valEl.textContent = Number(settings.customBackgroundImageBrightness ?? 1.0).toFixed(1) + 'x';
        }
        if (saturationSlider) {
            saturationSlider.value = settings.customBackgroundImageSaturation ?? 1.0;
            const valEl = document.getElementById('customBackgroundImageSaturationValue');
            if (valEl) valEl.textContent = Number(settings.customBackgroundImageSaturation ?? 1.0).toFixed(1) + 'x';
        }
        if (extractColorsCheck) extractColorsCheck.checked = settings.customBackgroundImageExtractColors ?? true;
        
        updatePreviewStyles();
      });
  
      const updatePreviewStyles = () => {
          if (!previewDiv) return;
          const blur = blurSlider ? blurSlider.value : 0;
          const bright = brightnessSlider ? brightnessSlider.value : 1.0;
          const sat = saturationSlider ? saturationSlider.value : 1.0;
          const int = intensitySlider ? intensitySlider.value : 0.6;
          
          previewDiv.style.filter = `blur(${blur}px) brightness(${bright}) saturate(${sat})`;
          previewDiv.style.opacity = int;
      };
  
      const bindSlider = (slider, key, isFloat = true, formatter = (v)=>v) => {
          if (!slider) return;
          slider.addEventListener('input', () => {
              const val = isFloat ? parseFloat(slider.value) : parseInt(slider.value, 10);
              updateSetting(key, val);
              const displayEl = document.getElementById(slider.id + 'Value') || document.getElementById('customBackgroundImageIntensityValue');
              if (displayEl && slider.id !== 'imageThemeIntensity') displayEl.textContent = formatter(val);
              else if (displayEl && slider.id === 'imageThemeIntensity') displayEl.textContent = Math.round(val * 100) + '%';
              
              updatePreviewStyles();
          });
      };
  
      bindSlider(intensitySlider, 'customBackgroundImageIntensity', true);
      bindSlider(blurSlider, 'customBackgroundImageBlur', false, (v) => v + 'px');
      bindSlider(brightnessSlider, 'customBackgroundImageBrightness', true, (v) => v.toFixed(1) + 'x');
      bindSlider(saturationSlider, 'customBackgroundImageSaturation', true, (v) => v.toFixed(1) + 'x');
  
      if (extractColorsCheck) {
        extractColorsCheck.addEventListener('change', () => {
          updateSetting('customBackgroundImageExtractColors', extractColorsCheck.checked);
          if (extractColorsCheck.checked) {
            chrome.storage.local.get('settings', (data) => {
              const bgUrl = data.settings?.customBackgroundImage;
              if (bgUrl) {
                const img = new Image();
                img.onload = () => {
                  const sampleCanvas = document.createElement('canvas');
                  const sampleCtx = sampleCanvas.getContext('2d');
                  sampleCanvas.width = 1;
                  sampleCanvas.height = 1;
                  sampleCtx.drawImage(img, 0, 0, 1, 1);
                  const pixel = sampleCtx.getImageData(0, 0, 1, 1).data;
                  const averageColor = '#' + pixel[0].toString(16).padStart(2, '0') + pixel[1].toString(16).padStart(2, '0') + pixel[2].toString(16).padStart(2, '0');
                  updateSetting('accentColor', averageColor);
                  const customInput = document.getElementById('accentColor');
                  if (customInput) {
                    customInput.value = averageColor;
                    customInput.dispatchEvent(new Event('input', {bubbles:true}));
                  }
                  extractAndApplyPalette(img);
                };
                img.src = bgUrl;
              }
            });
          }
        });
      }
  
      if(uploadBtn) uploadBtn.addEventListener('click', (e) => {
          if (fileInput) fileInput.click();
      });
  
      if(clearBtn) clearBtn.addEventListener('click', () => {
        if(previewDiv) {
          previewDiv.style.backgroundImage = 'none';
        }
        if(overrideBadge) overrideBadge.style.display = 'none';
        const boxesContainer = document.getElementById('extractedPaletteBoxes');
        if (boxesContainer) boxesContainer.style.display = 'none';
        updateSetting('customBackgroundImage', null);
        updateSetting('extractedPalette', null);
        if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
      });
  
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const MAX_SIZE = 1280;
            let width = img.width;
            let height = img.height;
  
            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            if (extractColorsCheck && extractColorsCheck.checked) {
              extractAndApplyPalette(canvas);
            } else {
               const boxesContainer = document.getElementById('extractedPaletteBoxes');
               if (boxesContainer) boxesContainer.style.display = 'none';
            }
            
            updateSetting('customBackgroundImage', dataUrl);
            
            if(previewDiv) {
              previewDiv.style.backgroundImage = `url("${dataUrl}")`;
            }
            if(overrideBadge) overrideBadge.style.display = 'flex';
            
            if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

  return {
    applyThemeToPopup,
    initThemeSelector,
    initCustomThemeBuilder,
    initPremiumAccentDropdown,
    initAccentColorSwatches,
    initImageBackgroundTheme
  };
}
