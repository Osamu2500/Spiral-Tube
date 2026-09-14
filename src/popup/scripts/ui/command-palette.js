import { switchTab } from './popup-ui.js';

export function initCommandPalette(doc) {
    const overlay = doc.getElementById('command-palette-overlay');
    const input = doc.getElementById('command-palette-input');
    const resultsContainer = doc.getElementById('command-palette-results');
    if (!overlay || !input || !resultsContainer) return;

    let isVisible = false;
    let selectedIndex = 0;
    let currentResults = [];

    // Press Cmd/Ctrl + K to toggle
    doc.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            togglePalette();
        }
        if (e.key === 'Escape' && isVisible) {
            e.preventDefault();
            closePalette();
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePalette();
        }
    });

    input.addEventListener('input', () => {
        renderResults(input.value);
    });

    input.addEventListener('keydown', (e) => {
        if (!isVisible || currentResults.length === 0) return;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % currentResults.length;
            updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
            updateSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeSelected();
        }
    });

    function togglePalette() {
        if (isVisible) {
            closePalette();
        } else {
            openPalette();
        }
    }

    function openPalette() {
        isVisible = true;
        overlay.classList.add('visible');
        input.value = '';
        renderResults('');
        setTimeout(() => input.focus(), 10);
    }

    function closePalette() {
        isVisible = false;
        overlay.classList.remove('visible');
        input.blur();
    }

    function renderResults(query) {
        query = query.toLowerCase().trim();
        resultsContainer.innerHTML = '';
        currentResults = [];

        // Scrape all tabs and settings for search results
        const allTabs = Array.from(doc.querySelectorAll('.nav-item[data-tab]'));
        const allSettings = Array.from(doc.querySelectorAll('.toggle-card, .setting-item'));

        if (!query) {
            // Show tabs as default actions
            allTabs.forEach(tabBtn => {
                currentResults.push({
                    type: 'tab',
                    title: tabBtn.querySelector('.nav-label')?.textContent || tabBtn.dataset.tab,
                    desc: 'Navigate to tab',
                    action: () => switchTab(doc, tabBtn.dataset.tab),
                    element: tabBtn
                });
            });
        } else {
            allSettings.forEach(setting => {
                const nameEl = setting.querySelector('.name');
                const descEl = setting.querySelector('.desc');
                const title = nameEl ? nameEl.textContent : '';
                const desc = descEl ? descEl.textContent : '';
                
                if (title.toLowerCase().includes(query) || desc.toLowerCase().includes(query)) {
                    currentResults.push({
                        type: 'setting',
                        title: title,
                        desc: desc,
                        action: () => {
                            // Find which tab this setting belongs to
                            const tab = setting.closest('.tab-content');
                            if (tab) {
                                const tabId = tab.id.replace('tab-', '');
                                switchTab(doc, tabId);
                                setTimeout(() => {
                                    setting.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    setting.style.boxShadow = '0 0 0 2px var(--accent-primary)';
                                    setTimeout(() => setting.style.boxShadow = '', 1500);
                                }, 300);
                            }
                        },
                        element: setting
                    });
                }
            });
            
            allTabs.forEach(tabBtn => {
                const title = tabBtn.querySelector('.nav-label')?.textContent || tabBtn.dataset.tab;
                if (title.toLowerCase().includes(query)) {
                    currentResults.push({
                        type: 'tab',
                        title: title,
                        desc: 'Navigate to tab',
                        action: () => switchTab(doc, tabBtn.dataset.tab),
                        element: tabBtn
                    });
                }
            });
        }

        selectedIndex = 0;
        
        currentResults.forEach((result, idx) => {
            const item = doc.createElement('div');
            item.className = 'cmd-item';
            if (idx === 0) item.classList.add('selected');
            
            const iconWrap = doc.createElement('div');
            iconWrap.className = 'cmd-item-icon';
            if (result.type === 'tab') {
                iconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>';
            } else {
                iconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
            }
            
            const content = doc.createElement('div');
            content.className = 'cmd-item-content';
            content.innerHTML = `<div class="cmd-item-title">${result.title}</div><div class="cmd-item-desc">${result.desc}</div>`;
            
            const actionLabel = doc.createElement('div');
            actionLabel.className = 'cmd-item-action';
            actionLabel.textContent = result.type === 'tab' ? 'Go to Tab' : 'Go to Setting';
            
            item.appendChild(iconWrap);
            item.appendChild(content);
            item.appendChild(actionLabel);
            
            item.addEventListener('click', () => {
                result.action();
                closePalette();
            });
            
            item.addEventListener('mouseenter', () => {
                selectedIndex = idx;
                updateSelection();
            });
            
            resultsContainer.appendChild(item);
        });
        
        if (currentResults.length === 0) {
            resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center; opacity: 0.5; font-size: 13px;">No results found</div>';
        }
    }

    function updateSelection() {
        const items = resultsContainer.querySelectorAll('.cmd-item');
        items.forEach((item, idx) => {
            if (idx === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    function executeSelected() {
        if (currentResults[selectedIndex]) {
            currentResults[selectedIndex].action();
            closePalette();
        }
    }
}
