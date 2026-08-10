// popup-components.js — Specialized component initializers
import { t } from '../shared/i18n.js';

const escapeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export function initComponents(
  document,
  state,
  ui,
  updateSetting,
  notifyThemeChange,
  saveSettings
) {
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
          { key: 'ocean', label: t('ocean_blue'), meta: t('deep_blue'), color: '#051421' },
          { key: 'forest', label: t('forest'), meta: t('green'), color: '#0f1c15' },
          { key: 'cherry', label: t('cherry'), meta: t('pink'), color: '#26181b' },
          { key: 'kawaii', label: t('kawaii'), meta: t('pink_cute'), color: '#fff1f4' },
          { key: 'player-retouch', label: t('player_retouch'), meta: t('red_accent'), color: '#1a1a1a' },
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
          { key: 'claymorphism', label: t('claymorphism'), meta: t('puffy_3d'), color: '#f0e8ff' },
          { key: 'brutalism', label: t('brutalism'), meta: t('raw_ui'), color: '#ffffff' },
          { key: 'glassmorphism', label: t('glassmorphism'), meta: t('frosted'), color: '#0f0c29' },
          { key: 'colorize', label: t('colorize'), meta: t('glass_dynamic'), color: '#0f0f0f' },
        ],
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

      {
        name: 'New Additions',
        themes: [
          { key: 'autumn', label: 'Autumn', meta: 'New', color: '#1a1a1a' },
          { key: 'bento', label: 'Bento', meta: 'New', color: '#1a1a1a' },
          { key: 'christmas', label: 'Christmas', meta: 'New', color: '#1a1a1a' },
          { key: 'liquid-glass', label: 'Liquid Glass', meta: 'New', color: '#1a1a1a' },
          { key: 'nature', label: 'Nature', meta: 'New', color: '#d4e157' },
          { key: 'neumorphic', label: 'Neumorphic', meta: 'New', color: '#1a1a1a' },
          { key: 'startube', label: 'Startube', meta: 'New', color: '#1a1a1a' }
        ]
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
      themeGrid.style.display = 'flex';
      themeGrid.style.flexDirection = 'column';
      themeGrid.style.gap = '16px';

      themeCategories.forEach((category) => {
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

        category.themes.forEach((theme) => {
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


    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.getElementById('customThemeName').value = '';
        document.getElementById('customThemeBgBase').value = '#0f0f0f';
        document.getElementById('customThemeBgSurface').value = '#212121';
        document.getElementById('customThemeAccent').value = '#ff4e45';
        document.getElementById('customThemeText').value = '#ffffff';
        syncPreviews();
        
        chrome.storage.local.get('settings', (data) => {
          const settings = data.settings || {};
          settings.activeTheme = 'default';
          chrome.storage.local.set({ settings }, () => {
            initThemeSelector('default');
            applyThemeToPopup('default', settings.customThemes || {});
            notifyThemeChange('default');
          });
        });
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

  function initSearchViewMode() {
    const container = document.getElementById('searchViewModeToggle');
    if (!container) return;

    const btns = container.querySelectorAll('.view-mode-btn');

    const applyActiveState = (mode) => {
      btns.forEach((b) => {
        const isActive = b.dataset.mode === mode;
        b.classList.toggle('active', isActive);
        b.style.background = isActive ? 'rgba(62,166,255,0.22)' : 'transparent';
        b.style.color = isActive ? '#ff4e45' : 'rgba(255,255,255,0.5)';
      });
    };

    chrome.storage.local.get(['searchViewMode'], (result) => {
      const savedMode =
        result.searchViewMode || localStorage.getItem('ypp_searchViewMode') || 'grid';
      applyActiveState(savedMode);
    });

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        applyActiveState(mode);

        chrome.storage.local.set({ searchViewMode: mode });
        localStorage.setItem('ypp_searchViewMode', mode);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          if (tab && tab.url && tab.url.includes('youtube.com/results')) {
            chrome.tabs
              .sendMessage(tab.id, {
                type: 'YPP_SET_SEARCH_VIEW_MODE',
                mode: mode,
              })
              .catch(() => {});
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
      btns.forEach((b) => {
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

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        applyMode(mode);
        chrome.runtime.sendMessage(
          { action: 'PATCH_SETTINGS', payload: { hideWatchedMode: mode } },
          () => {
            if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
          }
        );
      });
    });
  }

  function initHideWatchedPageButtons() {
    const btns = document.querySelectorAll('.hw-page-btn');
    if (!btns.length) return;

    const applyState = (settings) => {
      btns.forEach((btn) => {
        const page = btn.dataset.page;
        const key = 'hideWatched' + page.charAt(0).toUpperCase() + page.slice(1);
        const isActive = settings[key] !== false;
        btn.classList.toggle('active', isActive);
        if (isActive) {
          btn.style.background = 'rgba(255, 78, 69, 0.18)';
          btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
          btn.style.color = '#fff';
        } else {
          btn.style.background = 'rgba(255, 255, 255, 0.04)';
          btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          btn.style.color = 'rgba(255, 255, 255, 0.5)';
        }
      });
    };

    // Initialise button states from storage on popup open
    chrome.storage.local.get('settings', (data) => {
      const settings = data.settings || {};
      applyState(settings);
    });

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        const key = 'hideWatched' + page.charAt(0).toUpperCase() + page.slice(1);
        const nextState = !btn.classList.contains('active');

        // Optimistically update the button visually immediately
        btn.classList.toggle('active', nextState);
        if (nextState) {
          btn.style.background = 'rgba(255, 78, 69, 0.18)';
          btn.style.borderColor = 'rgba(255, 78, 69, 0.6)';
          btn.style.color = '#fff';
        } else {
          btn.style.background = 'rgba(255, 255, 255, 0.04)';
          btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          btn.style.color = 'rgba(255, 255, 255, 0.5)';
        }

        // Save via PATCH_SETTINGS so it goes through the service worker,
        // syncs to chrome.storage.sync, AND triggers chrome.storage.onChanged
        // in the content script for real-time page filtering updates.
        chrome.runtime.sendMessage(
          { action: 'PATCH_SETTINGS', payload: { [key]: nextState } },
          () => {
            if (ui && ui.showSaveIndicator) ui.showSaveIndicator(document);
          }
        );
      });
    });
  }

  function initGlobalPlayerBarGrid() {
    const btns = document.querySelectorAll('.gpb-btn');
    if (!btns.length) return;

    const syncState = () => {
      btns.forEach((btn) => {
        const targetId = btn.dataset.target;
        const cb = document.getElementById(targetId);
        if (cb) btn.classList.toggle('active', cb.checked);
      });
    };

    // Sync initial state slightly after popup-state.js loads settings
    setTimeout(syncState, 150);

    btns.forEach((btn) => {
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
      btns.forEach((b) => {
        const isActive = b.dataset.style === styleVal;
        b.classList.toggle('active', isActive);
      });
    };

    chrome.storage.local.get('settings', (data) => {
      const styleVal = data.settings?.cardStyle || 'glass';
      applyStyle(styleVal);
    });

    btns.forEach((btn) => {
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
      btns.forEach((b) => {
        const isActive = b.dataset.style === styleVal;
        b.classList.toggle('active', isActive);
      });
    };

    chrome.storage.local.get('settings', (data) => {
      const styleVal = data.settings?.youtubePageTheme || 'default';
      applyStyle(styleVal);
    });

    btns.forEach((btn) => {
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
      btns.forEach((b) => {
        const isActive = b.dataset.style === styleVal;
        b.classList.toggle('active', isActive);
      });
    };

    chrome.storage.local.get('settings', (data) => {
      const styleVal = data.settings?.popupUiTheme || 'liquid-glass';
      applyStyle(styleVal);
    });

    btns.forEach((btn) => {
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
      btns.forEach((b) => {
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
      const savedCursor = data.settings?.customCursor || 'default';
      applyStyle(savedCursor);
    });

    btns.forEach((btn) => {
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

  function initAutoLikeInlineControls() {
    const typeBtn = document.getElementById('autoLikeDelayTypeBtn');
    const hiddenType = document.getElementById('autoLikeDelayType');
    const hiddenInput = document.getElementById('autoLikeThreshold');
    const sliderUI = document.getElementById('autoLikeThresholdUI');
    const sliderVal = document.getElementById('autoLikeThresholdValue');
    if (!typeBtn || !hiddenType || !hiddenInput || !sliderUI) return;

    const AUTO_LIKE_SEC_STEPS = [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 220, 240, 260, 280, 300];
    const AUTO_LIKE_PCT_STEPS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

    const getSteps = (type) => type === 'percent' ? AUTO_LIKE_PCT_STEPS : AUTO_LIKE_SEC_STEPS;

    const syncUIFromValue = (val, type) => {
      const steps = getSteps(type);
      let idx = steps.findIndex(v => v >= Number(val || 0));
      if (idx === -1) idx = 0;
      sliderUI.value = idx;
      if (sliderVal) sliderVal.textContent = steps[idx] + (type === 'percent' ? '%' : 's');
    };

    const updateVisuals = (type) => {
      hiddenType.value = type;
      const steps = getSteps(type);
      sliderUI.max = steps.length - 1;
      sliderUI.step = 1;
      if (type === 'percent') {
        typeBtn.textContent = '%';
        typeBtn.title = 'Switch to Seconds';
      } else {
        typeBtn.textContent = 's';
        typeBtn.title = 'Switch to Percent';
      }
      syncUIFromValue(hiddenInput.value, type);
    };

    const origDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    Object.defineProperty(hiddenInput, 'value', {
      get: function() { return origDesc.get.call(this); },
      set: function(val) {
        origDesc.set.call(this, val);
        syncUIFromValue(val, hiddenType.value || 'seconds');
      }
    });

    chrome.storage.local.get('settings', (data) => {
      const type = data.settings?.autoLikeDelayType || 'seconds';
      updateVisuals(type);
    });

    typeBtn.addEventListener('click', () => {
      const newType = hiddenType.value === 'percent' ? 'seconds' : 'percent';
      updateVisuals(newType);
      hiddenType.dispatchEvent(new Event('change', { bubbles: true }));
    });

    sliderUI.addEventListener('input', () => {
      const steps = getSteps(hiddenType.value || 'seconds');
      const idx = parseInt(sliderUI.value, 10) || 0;
      const val = steps[idx] !== undefined ? steps[idx] : 0;
      if (sliderVal) sliderVal.textContent = val + (hiddenType.value === 'percent' ? '%' : 's');
      hiddenInput.value = val;
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function initViewsFilterInlineSlider() {
    const sliderUI = document.getElementById('viewsHideThresholdUI');
    const sliderVal = document.getElementById('viewsHideThresholdValue');
    const hiddenInput = document.getElementById('viewsHideThreshold');
    if (!sliderUI || !hiddenInput) return;

    const discreteOptions = [
      { value: 0, label: t('off') },
      { value: 100, label: t('100') },
      { value: 500, label: t('500') },
      { value: 1000, label: t('1_000') },
      { value: 5000, label: t('5_000') },
      { value: 10000, label: t('10k') },
      { value: 50000, label: t('50k') },
      { value: 100000, label: t('100k') },
      { value: 500000, label: t('500k') },
      { value: 1000000, label: t('1m') },
      { value: 5000000, label: t('5m') },
      { value: 10000000, label: t('10m') },
    ];

    const updateUI = (val) => {
      let index = discreteOptions.findIndex((o) => o.value == val);
      if (index === -1) index = 0;
      sliderUI.value = index;
      if (sliderVal) sliderVal.textContent = discreteOptions[index].label;
    };

    chrome.storage.local.get('settings', (data) => {
      const val = data.settings?.viewsHideThreshold || 0;
      updateUI(val);
    });

    sliderUI.addEventListener('input', () => {
      const opt = discreteOptions[sliderUI.value];
      if (sliderVal) sliderVal.textContent = opt.label;
      hiddenInput.value = opt.value;
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function initBasicInlineSlider(baseId, defaultValue) {
    const sliderUI = document.getElementById(baseId + 'UI');
    const sliderVal = document.getElementById(baseId + 'Value');
    const hiddenInput = document.getElementById(baseId);
    if (!sliderUI || !hiddenInput) return;

    chrome.storage.local.get('settings', (data) => {
      const val = data.settings?.[baseId] !== undefined ? data.settings[baseId] : defaultValue;
      sliderUI.value = val;
      if (sliderVal) sliderVal.textContent = val;
    });

    sliderUI.addEventListener('input', () => {
      if (sliderVal) sliderVal.textContent = sliderUI.value;
      hiddenInput.value = sliderUI.value;
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function initDateFilterInlineSliders() {
    const olderUI = document.getElementById('dateFilterOlderThresholdUI');
    const olderVal = document.getElementById('dateFilterOlderThresholdValue');
    const olderHidden = document.getElementById('dateFilterOlderThreshold');

    const newerUI = document.getElementById('dateFilterNewerThresholdUI');
    const newerVal = document.getElementById('dateFilterNewerThresholdValue');
    const newerHidden = document.getElementById('dateFilterNewerThreshold');

    if (!olderUI || !newerUI) return;

    const discreteOptions = [
      { value: 0, label: t('off') },
      { value: 1, label: t('1_day') },
      { value: 2, label: t('2_days') },
      { value: 3, label: t('3_days') },
      { value: 7, label: t('1_week') },
      { value: 14, label: t('2_weeks') },
      { value: 21, label: t('3_weeks') },
      { value: 30, label: t('1_month') },
      { value: 90, label: t('3_months') },
      { value: 180, label: t('6_months') },
      { value: 365, label: t('1_year') },
      { value: 730, label: t('2_years') },
      { value: 1825, label: t('5_years') },
      { value: 3650, label: t('10_years') },
    ];

    const setupSlider = (sliderUI, sliderVal, hiddenInput, keyName) => {
      const updateUI = (val) => {
        let index = discreteOptions.findIndex((o) => o.value == val);
        if (index === -1) index = 0;
        sliderUI.value = index;
        if (sliderVal) sliderVal.textContent = discreteOptions[index].label;
      };
      chrome.storage.local.get('settings', (data) => {
        const val = data.settings?.[keyName] || 0;
        updateUI(val);
      });
      sliderUI.addEventListener('input', () => {
        const opt = discreteOptions[sliderUI.value];
        if (sliderVal) sliderVal.textContent = opt.label;
        hiddenInput.value = opt.value;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    };

    setupSlider(olderUI, olderVal, olderHidden, 'dateFilterOlderThreshold');
    setupSlider(newerUI, newerVal, newerHidden, 'dateFilterNewerThreshold');
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

  // Export these for external triggering if needed
  return {
    initThemeSelector,
    initPremiumAccentDropdown,
    initSearchViewMode,
    initHideWatchedModePill,
    initHideWatchedPageButtons,
    initGlobalPlayerBarGrid,
    initCardStyleGrid,
    initYoutubeStyleGrid,
    initPopupStyleGrid,
    initCursorStyleGrid,
    initAccentColorSwatches,
    initCustomThemeBuilder,
    initImageBackgroundTheme,
    applyThemeToPopup,
    initAutoLikeInlineControls,
    initViewsFilterInlineSlider,
    initDateFilterInlineSliders,
    initBasicInlineSlider,
  };
}

// UI Changes Restored

