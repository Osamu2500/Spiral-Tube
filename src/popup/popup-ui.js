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
            
            if (isActive && window.anime) {
                const animatableItems = tab.querySelectorAll('.toggle-card, .setting-item, .mode-card');
                if (animatableItems.length > 0) {
                    try {
                        animatableItems.forEach(el => {
                            el.style.transform = 'translateX(-12px)';
                            el.style.opacity = '0';
                        });
                        
                        window.anime({
                            targets: animatableItems,
                            translateX: [ -12, 0 ],
                            opacity: [ 0, 1 ],
                            delay: window.anime.stagger(40, { start: 100 }),
                            easing: 'spring(1, 80, 10, 0)',
                            duration: 600,
                        });
                    } catch (e) {
                        console.error('Animation error:', e);
                        animatableItems.forEach(el => {
                            el.style.transform = '';
                            el.style.opacity = '1';
                        });
                    }
                }
            }
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
        const allCards = document.querySelectorAll('.toggle-card, .setting-item');
        const allSections = document.querySelectorAll('.settings-section');
        const allTabs = document.querySelectorAll('.tab-content');
        
        if (!query) {
            allCards.forEach(card => card.style.display = '');
            allSections.forEach(sec => sec.style.display = '');
            allTabs.forEach(tab => tab.style.display = ''); 
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
                sec.style.display = visibleCards.length === 0 ? 'none' : '';
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

        if (e.target.closest('.toggle') || e.target.closest('input') || e.target.closest('button')) return;
        if (e.target.closest('.sub-setting-row, .sub-options, .mode-settings, .shortcut-panel-row')) return;

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
    const secSwatches = document.getElementById('secondaryAccentSwatches');
    const primaryInput = document.getElementById('accentColor');
    const secInput = document.getElementById('secondaryAccentColor');
    if (!dualToggle) return;

    // Load saved state
    chrome.storage.local.get('settings', (data) => {
        const isDual = data.settings?.enableDualAccent || false;
        const secColor = data.settings?.secondaryAccentColor || '#b62bcf';
        dualToggle.checked = isDual;
        if (secInput) secInput.value = secColor;
        if (secSwatches) {
            secSwatches.style.opacity = isDual ? '1' : '0.4';
            secSwatches.style.pointerEvents = isDual ? 'auto' : 'none';
        }
        if (isDual && primaryInput) {
            applyAccentColor(document, primaryInput.value, secColor);
        }
    });

    const reapply = () => {
        const isDual = dualToggle.checked;
        if (secSwatches) {
            secSwatches.style.opacity = isDual ? '1' : '0.4';
            secSwatches.style.pointerEvents = isDual ? 'auto' : 'none';
        }
        const sec = (isDual && secInput?.value) ? secInput.value : null;
        applyAccentColor(document, primaryInput?.value || '#ff4e45', sec);
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
}

export function syncModeCards(document) {
    const modeCardIds = [
        'zenMode', 'cinemaMode', 'studyMode', 'enableFocusMode',
        'minimalMode', 'ambientMode', 'audioModeEnabled'
    ];

    modeCardIds.forEach(id => {
        const checkbox = document.getElementById(id);
        const card = document.getElementById('modeCard-' + id);
        if (checkbox && card) {
            card.classList.toggle('mode-active', checkbox.checked);
        }
    });
}


