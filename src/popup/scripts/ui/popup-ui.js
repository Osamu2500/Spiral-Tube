const TITLES = {
    'favorites': 'Favorites',
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

const CONFIG = {
    SEARCH_DEBOUNCE_MS: 100,
    TOAST_TIMEOUT_MS: 5000,
    SAVE_INDICATOR_MS: 1200,
    CARD_SELECTORS: '.toggle-card, .setting-item, .mode-card',
    STORAGE_KEYS: {
        LAST_TAB: 'ypp-last-tab',
        COLLAPSE_PREFIX: 'ypp_collapse_',
        UPDATE_FLAG: 'ypp_has_update',
        SETTINGS: 'settings',
        SECTION_ORDER: 'sectionOrder'
    }
};

// ── Fuzzy Search Helpers ──────────────────────────────────────────────────────

/**
 * Simple fuzzy match: returns a score (higher = better match).
 * 0 = no match, >0 = match.
 */
function _fuzzyScore(text, query) {
    if (!query) return 0;
    const t = text.toLowerCase();
    const q = query.toLowerCase();
    if (t.startsWith(q)) return 3;      // strongest: starts with query
    if (t.includes(q)) return 2;        // strong: contains query
    // Fuzzy: all chars in query appear in order in text
    let ti = 0, qi = 0;
    while (ti < t.length && qi < q.length) {
        if (t[ti] === q[qi]) qi++;
        ti++;
    }
    return qi === q.length ? 1 : 0;     // weak: fuzzy match
}

/**
 * Wrap the first occurrence of `query` inside `el`'s text nodes with <mark>.
 */
function _highlightText(el, query) {
    if (!query) return;
    // Walk text nodes inside the name span only
    const nameEl = el.querySelector('.name, .feature-name, .section-title');
    if (!nameEl) return;
    const original = nameEl.textContent || '';
    const idx = original.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return;
    nameEl.innerHTML =
        _escapeHtml(original.slice(0, idx)) +
        `<mark class="search-highlight">${_escapeHtml(original.slice(idx, idx + query.length))}</mark>` +
        _escapeHtml(original.slice(idx + query.length));
}

function _clearHighlights(el) {
    el.querySelectorAll('mark.search-highlight').forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
    });
}

function _escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function _debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

export function switchTab(document, tabId) {
    const updateDOM = () => {
        const navItems = document.querySelectorAll('.nav-item[data-tab]');
        const tabs = document.querySelectorAll('.tab-content');
        const pageTitle = document.getElementById('page-title');

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
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_TAB, tabId);
    };

    if (document.startViewTransition) {
        try {
            document.startViewTransition(updateDOM);
        } catch (_) {
            // InvalidStateError: Transition was aborted because of invalid data.
            // Document hidden — happens when popup opens during a page navigation.
            requestAnimationFrame(updateDOM);
        }
    } else {
        requestAnimationFrame(updateDOM);
    }
}

function _initTabs(document) {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            if (tab) switchTab(document, tab);
        });
    });

    const lastTab = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_TAB);
    if (lastTab && document.getElementById(`tab-${lastTab}`)) {
        switchTab(document, lastTab);
    }
}

function _initCollapsibleSections(document) {
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        if (header) {
            header.style.cursor = 'pointer';
            const titleEl = header.querySelector('.section-title');
            const title = titleEl ? titleEl.textContent : 'section';
            
            const isCollapsed = localStorage.getItem(CONFIG.STORAGE_KEYS.COLLAPSE_PREFIX + title) === 'true';
            if (isCollapsed) {
                section.classList.add('collapsed');
            }

            header.addEventListener('click', () => {
                section.classList.toggle('collapsed');
                localStorage.setItem(CONFIG.STORAGE_KEYS.COLLAPSE_PREFIX + title, section.classList.contains('collapsed'));
            });
        }
    });
}

function _initSearch(document) {
    const featureSearchInput = document.getElementById('featureSearch');
    if (!featureSearchInput) return;

    const doSearch = (query) => {
        const allCards = document.querySelectorAll(CONFIG.CARD_SELECTORS);
        const allSections = document.querySelectorAll('.settings-section');
        const allTabs = document.querySelectorAll('.tab-content');

        document.body.classList.toggle('global-search-active', !!query);

        if (!query) {
            allCards.forEach(card => {
                card.style.display = '';
                _clearHighlights(card);
            });
            allSections.forEach(sec => sec.style.display = '');
            allTabs.forEach(tab => tab.style.display = '');

            // Restore collapsed state from localStorage
            allSections.forEach(section => {
                const header = section.querySelector('.section-header');
                if (header) {
                    const titleEl = header.querySelector('.section-title');
                    const title = titleEl ? titleEl.textContent : 'section';
                    const isCollapsed = localStorage.getItem(CONFIG.STORAGE_KEYS.COLLAPSE_PREFIX + title) === 'true';
                    section.classList.toggle('collapsed', isCollapsed);
                }
            });
            return;
        }

        allTabs.forEach(tab => {
            const cards = tab.querySelectorAll(CONFIG.CARD_SELECTORS);
            let tabHasMatches = false;

            cards.forEach(card => {
                _clearHighlights(card);
                const text = card.textContent || '';
                const score = _fuzzyScore(text, query);
                if (score > 0) {
                    card.style.display = '';
                    _highlightText(card, query);
                    tabHasMatches = true;
                } else {
                    card.style.display = 'none';
                }
            });

            const sections = tab.querySelectorAll('.settings-section');
            sections.forEach(sec => {
                const visibleCards = Array.from(
                    sec.querySelectorAll(CONFIG.CARD_SELECTORS)
                ).filter(c => c.style.display !== 'none');
                if (visibleCards.length === 0) {
                    sec.style.display = 'none';
                } else {
                    sec.style.display = '';
                    sec.classList.remove('collapsed');
                }
            });

            tab.style.display = tabHasMatches ? 'block' : 'none';
        });
    };

    featureSearchInput.addEventListener('input', _debounce((e) => {
        doSearch(e.target.value.trim());
    }, CONFIG.SEARCH_DEBOUNCE_MS));
}

export function initUI(document) {
    _initTabs(document);
    _initCollapsibleSections(document);
    _initSearch(document);
    _initWhatsNew(document);

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

/**
 * Check if the extension just updated and show a "What's New" toast banner.
 * Clears the badge and flag after displaying.
 */
function _initWhatsNew(doc) {
    // Disabled to prevent the annoying "New features" popup.
    /*
    try {
        chrome.storage.local.get(CONFIG.STORAGE_KEYS.UPDATE_FLAG, (data) => {
            if (chrome.runtime.lastError) {
                console.error('[YPP:UI] Storage get error in _initWhatsNew:', chrome.runtime.lastError.message);
                return;
            }
            if (!data[CONFIG.STORAGE_KEYS.UPDATE_FLAG]) return;
            const version = data[CONFIG.STORAGE_KEYS.UPDATE_FLAG];

            // Clear the flag and badge
            chrome.storage.local.remove(CONFIG.STORAGE_KEYS.UPDATE_FLAG);
            chrome.action.setBadgeText({ text: '' });

        // Create toast
        const toast = doc.createElement('div');
        toast.className = 'ypp-update-toast';
        toast.innerHTML = `
            <div class="update-toast-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            <div class="update-toast-text">
                <strong>Spiral Tube v${version}</strong>
                <span>New features &amp; improvements are ready!</span>
            </div>
            <button class="update-toast-close" title="Dismiss">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>`;

        doc.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => toast.classList.add('visible'));

        // Auto-dismiss after 5s
        const dismiss = () => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 400);
        };
        toast.querySelector('.update-toast-close').addEventListener('click', dismiss);
        setTimeout(dismiss, 5000);
        });
    } catch (e) {
        console.error('[YPP:UI] Error in _initWhatsNew:', e.message);
    }
    */
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
        }, CONFIG.SAVE_INDICATOR_MS);
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

    const gpbToggle = document.getElementById('enableGlobalBar');
    const gpbOptions = document.getElementById('globalBarOptions');
    if (gpbToggle && gpbOptions) {
        gpbOptions.style.display = gpbToggle.checked ? 'block' : 'none';
    }

    const showNavFavToggle = document.getElementById('showNavFavorites');
    const navFavBtn = document.querySelector('.nav-item[data-tab="favorites"]');
    if (showNavFavToggle && navFavBtn) {
        navFavBtn.style.display = showNavFavToggle.checked ? '' : 'none';
        if (!showNavFavToggle.checked && navFavBtn.classList.contains('active')) {
            switchTab(document, 'home');
        }
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
    try {
        chrome.storage.local.get(CONFIG.STORAGE_KEYS.SETTINGS, (data) => {
            if (chrome.runtime.lastError) {
                console.error('[YPP:UI] Error loading dual accent settings:', chrome.runtime.lastError.message);
                return;
            }
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
    } catch (e) {
        console.error('[YPP:UI] Exception in initDualAccentToggle:', (e).message);
    }

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
        try {
            chrome.storage.local.get(CONFIG.STORAGE_KEYS.SETTINGS, (data) => {
                if (chrome.runtime.lastError) {
                    console.error('[YPP:UI] Error persisting dual accent settings:', chrome.runtime.lastError.message);
                    return;
                }
                const settings = data.settings || {};
                settings.enableDualAccent = isDual;
                if (sec) settings.secondaryAccentColor = sec;
                chrome.storage.local.set({ [CONFIG.STORAGE_KEYS.SETTINGS]: settings });
            });
        } catch (e) {
            console.error('[YPP:UI] Exception saving dual accent settings:', (e).message);
        }
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
    try {
        chrome.storage.local.get([CONFIG.STORAGE_KEYS.SECTION_ORDER], (data) => {
            if (chrome.runtime.lastError) {
                console.error('[YPP:UI] Error loading section order:', chrome.runtime.lastError.message);
                return;
            }
            const orderMap = data[CONFIG.STORAGE_KEYS.SECTION_ORDER] || {};
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
    } catch (e) {
        console.error('[YPP:UI] Exception in initDragAndDrop loading:', (e).message);
    }

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
            try {
                const orderMap = {};
                doc.querySelectorAll('.tab-content').forEach(tab => {
                    const secs = Array.from(tab.querySelectorAll('.settings-section'));
                    const order = secs.map(s => s.querySelector('.section-title')?.textContent.trim() || '').filter(Boolean);
                    if (order.length) orderMap[tab.id] = order;
                });
                chrome.storage.local.set({ [CONFIG.STORAGE_KEYS.SECTION_ORDER]: orderMap }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('[YPP:UI] Error saving section order:', chrome.runtime.lastError.message);
                    }
                });
            } catch (e) {
                console.error('[YPP:UI] Exception saving section order:', (e).message);
            }
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
