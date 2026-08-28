const TITLES = {
    'home': 'Home & Feed',
    'shorts': 'Shorts Tools',
    'player': 'Player Features',
    'modes': 'Viewing Modes',
    'speed': 'Video Speed Controller',
    'search': 'Search Settings',
    'subscriptions': 'Subscriptions',
    'history': 'History & Watch Time',
    'bookmarks': 'Bookmarks',
    'customization': 'Appearance & UI',
    'theming': 'Theme Engine',
    'advanced': 'Advanced & System',
    'global': 'Global Configuration',
    'declutter': 'Declutter Features'
};

function switchTab(document, tabId) {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabs = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');

    requestAnimationFrame(() => {
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabId);
        });

        tabs.forEach(tab => {
            const isActive = tab.id === `tab-${tabId}`;
            tab.classList.toggle('active', isActive);
        });

        if (pageTitle) {
            pageTitle.textContent = TITLES[tabId] || 'Settings';
        }
        
        localStorage.setItem('ypp-last-tab', tabId);
    });
}

function initTabs(document) {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            if (tab) switchTab(document, tab);
        });
    });

    const lastTab = localStorage.getItem('ypp-last-tab');
    if (lastTab && document.getElementById(`tab-${lastTab}`)) {
        switchTab(document, lastTab);
    }
}

function initCollapsibleSections(document) {
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        if (header) {
            header.style.cursor = 'pointer';
            const titleEl = header.querySelector('.section-title');
            const title = titleEl ? titleEl.textContent : 'section';
            
            const isCollapsed = localStorage.getItem('ypp_collapse_' + title) === 'true';
            if (isCollapsed) {
                section.classList.add('collapsed');
            }

            header.addEventListener('click', () => {
                section.classList.toggle('collapsed');
                localStorage.setItem('ypp_collapse_' + title, section.classList.contains('collapsed'));
            });
        }
    });
}

function initSearch(document) {
    const featureSearchInput = document.getElementById('featureSearch');
    if (!featureSearchInput) return;

    featureSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.toggle-card, .setting-item, .mode-card');
        const allSections = document.querySelectorAll('.settings-section');
        const allTabs = document.querySelectorAll('.tab-content');
        
        document.body.classList.toggle('global-search-active', !!query);

        if (!query) {
            allCards.forEach(card => card.style.display = '');
            allSections.forEach(sec => sec.style.display = '');
            allTabs.forEach(tab => tab.style.display = '');
            
            // Restore collapsed state based on localStorage
            allSections.forEach(section => {
                const header = section.querySelector('.section-header');
                if (header) {
                    const titleEl = header.querySelector('.section-title');
                    const title = titleEl ? titleEl.textContent : 'section';
                    const isCollapsed = localStorage.getItem('ypp_collapse_' + title) === 'true';
                    
                    if (isCollapsed) {
                        section.classList.add('collapsed');
                    } else {
                        section.classList.remove('collapsed');
                    }
                }
            });
            return;
        }

        allTabs.forEach(tab => {
            const cards = tab.querySelectorAll('.toggle-card, .setting-item, .mode-card');
            let tabHasMatches = false;

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = '';
                    tabHasMatches = true;
                } else {
                    card.style.display = 'none';
                }
            });

            const sections = tab.querySelectorAll('.settings-section');
            sections.forEach(sec => {
                const visibleCards = Array.from(sec.querySelectorAll('.toggle-card, .setting-item, .mode-card')).filter(c => c.style.display !== 'none');
                if (visibleCards.length === 0) {
                    sec.style.display = 'none';
                } else {
                    sec.style.display = '';
                    // Force expand the section if there are matches
                    sec.classList.remove('collapsed');
                }
            });

            tab.style.display = tabHasMatches ? 'block' : 'none';
        });
    });
}

export function initUI(document) {
    initTabs(document);
    initCollapsibleSections(document);
    initSearch(document);

    // Global event delegation for all toggle cards (schema-generated & hardcoded)
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.toggle-card');
        if (!card) return;

        if (e.target.closest('.toggle') || e.target.closest('input') || e.target.closest('button') || e.target.closest('select')) return;
        if (e.target.closest('.sub-setting-row, .sub-options, .mode-settings, .shortcut-panel-row, .inline-slider-wrapper, .children-container')) return;

        const input = card.querySelector('input[type="checkbox"]');
        if (!input) return;

        input.checked = !input.checked;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    });
}

export function showSaveIndicator(document) {
    const badge = document.querySelector('.status-badge');
    if (badge) {
        const originalText = badge.textContent;
        badge.textContent = 'Saved ✓';
        badge.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
            badge.textContent = originalText;
            badge.style.background = '';
        }, 1200);
    }
}

export function updateDependencyUI(document) {
    const ambientModeToggle = document.getElementById('ambientMode');
    const ambientCard = document.getElementById('modeCard-ambientMode');
    if (ambientModeToggle && ambientCard) {
        const settingsTray = ambientCard.querySelector('.mode-settings');
        if (settingsTray) {
            settingsTray.style.display = ambientModeToggle.checked ? 'block' : 'none';
        }
    }

    const hwToggle = document.getElementById('hideWatched');
    const hwOptions = document.getElementById('hideWatchedOptions');
    if (hwToggle && hwOptions) {
        hwOptions.style.display = hwToggle.checked ? 'block' : 'none';
    }

    const cssToggle = document.getElementById('enableCustomCSS');
    const cssOptions = document.getElementById('customCSSOptions');
    if (cssToggle && cssOptions) {
        cssOptions.style.display = cssToggle.checked ? 'block' : 'none';
    }

    const gpbToggle = document.getElementById('enableGlobalPlayerBar');
    const gpbOptions = document.getElementById('globalPlayerBarOptions');
    if (gpbToggle && gpbOptions) {
        gpbOptions.style.display = gpbToggle.checked ? 'block' : 'none';
    }
}

export function applyAccentColor(document, hex, secondaryHex = null) {
    if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    const root = document.documentElement.style;
    const useDual = secondaryHex && /^#[0-9a-fA-F]{6}$/.test(secondaryHex);
    const sec = useDual ? secondaryHex : `color-mix(in srgb, ${hex} 55%, #a855f7)`;
    root.setProperty('--accent-primary', hex);
    root.setProperty('--accent-secondary', sec);
    root.setProperty('--red', hex);
    root.setProperty('--accent-glow', hex + '66');
    root.setProperty('--accent-glow-sm', hex + '38');
    root.setProperty('--red-dim', hex + '24');
    root.setProperty('--red-glow', hex + '66');
    const grad = `linear-gradient(135deg, ${hex} 0%, ${sec} 100%)`;
    root.setProperty('--accent-gradient', grad);
    root.setProperty('--accent-grad', grad);

    // Create a beautiful background glow effect using the primary and secondary colors
    const bgGlow = `radial-gradient(circle at top left, color-mix(in srgb, ${hex} 10%, transparent), transparent 45%), radial-gradient(circle at bottom right, color-mix(in srgb, ${sec} 10%, transparent), transparent 45%)`;
    root.setProperty('--bg-glow-effect', bgGlow);

    // Apply gradient to buttons and active elements when dual mode is on
    if (useDual) {
        root.setProperty('--accent-btn-bg', grad);
    } else {
        root.setProperty('--accent-btn-bg', hex);
    }
}

export function updateCustomizationPreview(document, state) {
    if (state.elements['cardStyle']) document.documentElement.setAttribute('data-card-style', state.elements['cardStyle'].value);
    if (state.elements['accentColor']) {
        const dualToggle = document.getElementById('enableDualAccent');
        const secInput = document.getElementById('secondaryAccentColor');
        const isDual = dualToggle?.checked && secInput?.value;
        applyAccentColor(document, state.elements['accentColor'].value, isDual ? secInput.value : null);
    }
}

export function initDualAccentToggle(document) {
    const dualToggle = document.getElementById('enableDualAccent');
    const secSwatchesContainer = document.getElementById('secondaryAccentSwatches');
    const primaryInput = document.getElementById('accentColor');
    const secInput = document.getElementById('secondaryAccentColor');
    if (!dualToggle) return;

    const secSwatches = document.querySelectorAll('.secondary-color-swatch[data-sec-color]');

    const applySecSwatchActive = (color) => {
        if (!color) return;
        let foundMatch = false;
        secSwatches.forEach((swatch) => {
            const isActive = swatch.dataset.secColor.toLowerCase() === color.toLowerCase();
            swatch.classList.toggle('active', isActive);
            if (isActive) foundMatch = true;
        });
        if (!foundMatch && secInput) {
            secInput.value = color;
            if (secInput.previousElementSibling)
                secInput.previousElementSibling.classList.add('active');
        } else if (secInput && secInput.previousElementSibling) {
            secInput.previousElementSibling.classList.remove('active');
        }
    };

    // Load saved state
    chrome.storage.local.get('settings', (data) => {
        const isDual = data.settings?.enableDualAccent || false;
        const secColor = data.settings?.secondaryAccentColor || '#b62bcf';
        dualToggle.checked = isDual;
        if (secInput) secInput.value = secColor;
        applySecSwatchActive(secColor);
        if (secSwatchesContainer) {
            secSwatchesContainer.style.opacity = isDual ? '1' : '0.4';
            secSwatchesContainer.style.pointerEvents = isDual ? 'auto' : 'none';
        }
        if (isDual && primaryInput) {
            applyAccentColor(document, primaryInput.value, secColor);
        }
    });

    const reapply = () => {
        const isDual = dualToggle.checked;
        if (secSwatchesContainer) {
            secSwatchesContainer.style.opacity = isDual ? '1' : '0.4';
            secSwatchesContainer.style.pointerEvents = isDual ? 'auto' : 'none';
        }
        const sec = (isDual && secInput?.value) ? secInput.value : null;
        applyAccentColor(document, primaryInput?.value || '#ff4e45', sec);
        if (sec) applySecSwatchActive(sec);
        
        // Persist
        chrome.storage.local.get('settings', (data) => {
            const settings = data.settings || {};
            settings.enableDualAccent = isDual;
            if (sec) settings.secondaryAccentColor = sec;
            chrome.storage.local.set({ settings });
        });
    };

    dualToggle.addEventListener('change', reapply);
    if (secInput) secInput.addEventListener('input', () => { if (dualToggle.checked) reapply(); });
    
    secSwatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
            if (!dualToggle.checked) return;
            const color = swatch.dataset.secColor;
            if (secInput) secInput.value = color;
            applySecSwatchActive(color);
            reapply();
        });
    });
}

export function syncModeCards(document) {
    const modeCardIds = [
        'zenMode', 'cinemaMode', 'studyMode', 'enableFocusMode',
        'minimalMode', 'audioModeEnabled', 'seamlessMode', 'ambientMode'
    ];

    modeCardIds.forEach(id => {
        const checkbox = document.getElementById(id);
        const card = document.getElementById('modeCard-' + id);
        if (checkbox && card) {
            card.classList.toggle('mode-active', checkbox.checked);
        }
    });
}



export function initDragAndDrop(doc) {
    let draggedSection = null;

    // Load saved order
    chrome.storage.local.get(['sectionOrder'], (data) => {
        const orderMap = data.sectionOrder || {};
        const tabs = doc.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            if (orderMap[tab.id]) {
                const savedOrder = orderMap[tab.id];
                const sections = Array.from(tab.querySelectorAll('.settings-section'));
                sections.sort((a, b) => {
                    const titleA = a.querySelector('.section-title')?.textContent.trim() || '';
                    const titleB = b.querySelector('.section-title')?.textContent.trim() || '';
                    let idxA = savedOrder.indexOf(titleA);
                    let idxB = savedOrder.indexOf(titleB);
                    if (idxA === -1) idxA = 999;
                    if (idxB === -1) idxB = 999;
                    return idxA - idxB;
                });
                sections.forEach(sec => tab.appendChild(sec));
            }
        });
    });

    const sections = doc.querySelectorAll('.settings-section');
    sections.forEach(section => {
        const handle = section.querySelector('.drag-handle');
        if (!handle) return;
        
        handle.style.cursor = 'grab';
        handle.style.opacity = '0.5';
        handle.addEventListener('mouseenter', () => handle.style.opacity = '1');
        handle.addEventListener('mouseleave', () => handle.style.opacity = '0.5');
        
        handle.addEventListener('mousedown', () => {
            handle.style.cursor = 'grabbing';
            section.setAttribute('draggable', 'true');
        });
        handle.addEventListener('mouseup', () => {
            handle.style.cursor = 'grab';
            section.removeAttribute('draggable');
        });
        section.addEventListener('mouseleave', () => section.removeAttribute('draggable'));

        section.addEventListener('dragstart', (e) => {
            draggedSection = section;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', '');
            
            setTimeout(() => {
                section.style.opacity = '0.4';
                section.style.transform = 'scale(0.98)';
                section.style.boxShadow = 'none';
            }, 0);
        });

        section.addEventListener('dragend', () => {
            if (draggedSection) {
                draggedSection.style.opacity = '1';
                draggedSection.style.transform = 'none';
                draggedSection.style.boxShadow = '';
            }
            draggedSection = null;
            section.removeAttribute('draggable');
            if (handle) handle.style.cursor = 'grab';
            
            // Save order
            const orderMap = {};
            doc.querySelectorAll('.tab-content').forEach(tab => {
                const secs = Array.from(tab.querySelectorAll('.settings-section'));
                const order = secs.map(s => s.querySelector('.section-title')?.textContent.trim() || '').filter(Boolean);
                if (order.length) orderMap[tab.id] = order;
            });
            chrome.storage.local.set({ sectionOrder: orderMap });
        });

        section.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedSection || draggedSection === section) return;
            const bounding = section.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            
            if (e.clientY - offset > 0) {
                section.style.boxShadow = '0 2px 0 0 var(--accent-primary)';
            } else {
                section.style.boxShadow = '0 -2px 0 0 var(--accent-primary)';
            }
        });

        section.addEventListener('dragleave', (e) => {
            section.style.boxShadow = '';
        });

        section.addEventListener('drop', (e) => {
            e.preventDefault();
            section.style.boxShadow = '';
            if (!draggedSection || draggedSection === section) return;
            
            const bounding = section.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            
            if (e.clientY - offset > 0) {
                section.after(draggedSection);
            } else {
                section.before(draggedSection);
            }
        });
    });
}
