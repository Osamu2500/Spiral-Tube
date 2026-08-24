export function wireEvents(feature, browse, data) {
    const root = feature.container;

    // ── Play all ─────────────────────────────────────────────────────
    feature.addListener(root.querySelector('#ypp-pl-play'), 'click', () => {
        const first = data.videos[0];
        if (first?.href) window.location.href = first.href;
    });

    // ── Shuffle ───────────────────────────────────────────────────────
    feature.addListener(root.querySelector('#ypp-pl-shuffle'), 'click', () => {
        const vids = data.videos.filter(v => v.href);
        if (!vids.length) return;
        const pick = vids[Math.floor(Math.random() * vids.length)];
        window.location.href = pick.href;
    });

    // ── Secondary Actions (Save, Share, Menu) ─────────────────────────
    
    const _clickNativeButtonAt = (customBtn, nativeBtn) => {
        if (!nativeBtn || !customBtn) return;
        nativeBtn.click();
    };

    const saveBtn = root.querySelector('#ypp-pl-save');
    feature.addListener(saveBtn, 'click', () => {
        const btns = Array.from(document.querySelectorAll('ytd-playlist-header-renderer button, yt-playlist-header-view-model button'));
        const nativeSave = btns.find(b => {
            const label = (b.getAttribute('aria-label') || b.title || b.textContent || '').toLowerCase();
            return label.includes('save') && !label.includes('watch later');
        });
        _clickNativeButtonAt(saveBtn, nativeSave);
    });

    const shareBtn = root.querySelector('#ypp-pl-share');
    feature.addListener(shareBtn, 'click', () => {
        const btns = Array.from(document.querySelectorAll('ytd-playlist-header-renderer button, yt-playlist-header-view-model button'));
        const nativeShare = btns.find(b => {
            const label = (b.getAttribute('aria-label') || b.title || b.textContent || '').toLowerCase();
            return label.includes('share') || label.includes('partager') || label.includes('compartir');
        }) || document.querySelector('button[aria-label="Share"], button[aria-label="Partager"]');
        _clickNativeButtonAt(shareBtn, nativeShare);
    });

    const menuBtn = root.querySelector('#ypp-pl-menu');
    feature.addListener(menuBtn, 'click', () => {
        const nativeMenuBtn = document.querySelector('ytd-playlist-header-renderer ytd-menu-renderer button, yt-playlist-header-view-model button[aria-label*="Action"], yt-playlist-header-view-model button[aria-label*="More"], yt-playlist-header-view-model button[aria-label*="Menu"]');
        _clickNativeButtonAt(menuBtn, nativeMenuBtn);
    });

    // ── Remove Watched Videos ──────────────────────────────────────────
    feature.addListener(root.querySelector('#ypp-pl-remove-watched'), 'click', async (e) => {
        const btn = e.currentTarget;
        
        const ITEM_SEL = 'ytd-playlist-video-renderer, yt-lockup-view-model';
        const nativeItems = browse ? Array.from(browse.querySelectorAll(ITEM_SEL)) : [];
        const threshold = feature.settings?.hideWatchedThreshold ?? 10; 
        
        const watchedIndices = new Set();
        nativeItems.forEach((item, idx) => {
            const progressSelectors = [
                'ytd-thumbnail-overlay-resume-playback-renderer #progress',
                'ytd-thumbnail-overlay-resume-playback-renderer',
                '[overlay-style="DEFAULT"] #progress',
                '#progress[style*="width"]'
            ];
            for (const psel of progressSelectors) {
                const prog = item.querySelector(psel);
                if (prog) {
                    const w = parseInt(prog.style.width, 10);
                    if (!isNaN(w) && w >= threshold) { watchedIndices.add(idx); break; }
                    if (prog.tagName === 'YTD-THUMBNAIL-OVERLAY-RESUME-PLAYBACK-RENDERER') {
                        watchedIndices.add(idx); break;
                    }
                }
            }
        });
        
        const watchedCards = Array.from(root.querySelectorAll('.ypp-pl-card[data-progress]'))
            .filter(c => parseInt(c.dataset.progress, 10) >= threshold);
        watchedCards.forEach(c => watchedIndices.add(parseInt(c.dataset.index, 10)));
        
        const sortedIndices = Array.from(watchedIndices).sort((a, b) => b - a);

        if (!sortedIndices.length) {
            btn.innerHTML = '<span>No watched videos found</span>';
            setTimeout(() => { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4h6v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg><span>Clean</span>'; }, 2000);
            return;
        }

        btn.disabled = true;
        btn.textContent = `Removing 0 / ${sortedIndices.length}…`;

        let removed = 0;
        for (const idx of sortedIndices) {
            if (!feature.isEnabled || !document.body.classList.contains('ypp-playlist-redesign')) {
                break;
            }

            const success = await removeNativeVideo(feature, idx);
            if (success) {
                const card = root.querySelector(`.ypp-pl-card[data-index="${idx}"]`);
                if (card) {
                    card.style.transition = 'opacity 0.3s, transform 0.3s';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => card.remove(), 320);
                }
                removed++;
                btn.textContent = `Removing ${removed} / ${sortedIndices.length}…`;
            }
            await new Promise(r => setTimeout(r, 900));
        }

        btn.disabled = false;
        btn.textContent = removed > 0 ? `✓ Removed ${removed} video${removed !== 1 ? 's' : ''}` : 'None removed';
        
        if (removed > 0) {
            updateStatsAfterRemoval(feature);
        }

        setTimeout(() => {
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4h6v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg><span>Clean</span>';
        }, 3000);
    });

    // ── Column switcher ───────────────────────────────────────────────
    const grid = root.querySelector('#ypp-pl-grid');
    const setColumns = (cols) => {
        if (!grid) return;
        feature._currentCols = String(cols);
        grid.className = `ypp-pl-grid ypp-pl-cols-${feature._currentCols}`;
        root.querySelectorAll('.ypp-col-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.cols === feature._currentCols);
        });
    };

    root.querySelectorAll('.ypp-col-btn').forEach(btn => {
        feature.addListener(btn, 'click', () => {
            const cols = btn.dataset.cols;
            setColumns(cols);
            try { window.YPP.StorageManager.set('playlistCols', cols); } catch (_) {}
        });
    });

    setColumns(feature._currentCols);

    // ── Filter input ──────────────────────────────────────────────────
    feature.addListener(root.querySelector('#ypp-pl-filter'), 'input', e => {
        const q = e.target.value.toLowerCase().trim();
        root.querySelectorAll('.ypp-pl-card').forEach(card => {
            const match = !q || (card.dataset.title || '').includes(q);
            card.style.display = match ? '' : 'none';
        });
    });

    // ── Card Context Menu (Native Integration) ─────────────────────────
    feature.addListener(grid, 'click', e => {
        const menuBtn = e.target.closest('.ypp-pl-card-menu');
        if (!menuBtn) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const card = menuBtn.closest('.ypp-pl-card');
        const idx = parseInt(card.dataset.index, 10);
        
        const ITEM_SEL = 'ytd-playlist-video-renderer, yt-lockup-view-model';
        const nativeItems = browse ? Array.from(browse.querySelectorAll(ITEM_SEL)) : [];
        const nativeItem = nativeItems[idx];
        
        if (nativeItem) {
            const nativeBtn = nativeItem.querySelector('yt-icon-button.dropdown-trigger button, ytd-menu-renderer button, button#button[aria-label*="Action"]');
            if (nativeBtn) {
                _clickNativeButtonAt(menuBtn, nativeBtn);
            }
        }
    });

    // ── Native Sub-Menu Integration (Sort Dropdown & Filter Chips) ──
    const sortContainer = root.querySelector('#ypp-pl-native-sort-container');
    if (sortContainer && browse) {
        const nativeSort = browse.querySelector('yt-sort-filter-sub-menu-renderer, yt-sort-filter-sub-menu-view-model, yt-dropdown-menu');
        if (nativeSort) sortContainer.appendChild(nativeSort);
    }

    const chipsContainer = root.querySelector('#ypp-pl-native-chips-container');
    if (chipsContainer && browse) {
        const nativeChips = browse.querySelector('ytd-feed-filter-chip-bar-renderer, yt-chip-cloud-renderer, yt-chip-cloud-chip-renderer');
        if (nativeChips) chipsContainer.appendChild(nativeChips);
    }
}

/**
 * Clicks a native video's three-dot menu and selects "Remove from playlist".
 * Returns a Promise<boolean> — true if the item was found and clicked.
 */
function removeNativeVideo(feature, nativeIndex) {
    return new Promise(resolve => {
        const ITEM_SEL = 'ytd-playlist-video-renderer, yt-lockup-view-model';
        const nativeVideos = document.querySelectorAll(ITEM_SEL);
        const nativeVideo  = nativeVideos[nativeIndex];
        if (!nativeVideo) return resolve(false);

        const MENU_SELECTORS = [
            'ytd-menu-renderer yt-button-shape button',
            'ytd-menu-renderer button',
            'yt-button-shape button[aria-label="Action menu"]',
            'button[aria-label="Action menu"]',
            '[aria-label="More actions"]',
            'yt-icon-button button',
            'yt-button-shape button' 
        ];
        
        let menuBtn = null;
        for (const sel of MENU_SELECTORS) {
            const btn = nativeVideo.querySelector(`ytd-menu-renderer ${sel}, .ytd-menu-renderer ${sel}, ${sel}`);
            if (btn && (btn.getAttribute('aria-label') || '').toLowerCase().includes('action')) {
                menuBtn = btn;
                break;
            } else if (btn && !menuBtn) {
                menuBtn = btn;
            }
        }
        
        if (!menuBtn) return resolve(false);

        document.body.click(); 
        setTimeout(() => {
            menuBtn.click();
            
            feature.utils.pollFor(() => {
                const popup = document.querySelector(
                    'ytd-menu-popup-renderer, tp-yt-iron-dropdown[aria-expanded="true"], .yt-core-popup'
                );
                if (popup) {
                    const items = popup.querySelectorAll(
                        'ytd-menu-service-item-renderer, ytd-menu-navigation-item-renderer, [role="menuitem"], .yt-core-attributed-string'
                    );
                    for (const item of items) {
                        const text = (item.textContent || '').toLowerCase();
                        if (text.includes('remove from') || text.includes('delete from') || text.includes('remove from watch later')) {
                            return item;
                        }
                    }
                }
                return null;
            }, 2500, 80).then(item => {
                if (item) {
                    const clickTarget = item.closest('[role="menuitem"]') || item.closest('ytd-menu-service-item-renderer') || item;
                    clickTarget.click();
                    setTimeout(() => document.body.click(), 50);
                    resolve(true);
                } else {
                    document.body.click();
                    resolve(false);
                }
            }).catch(() => {
                document.body.click();
                resolve(false);
            });
        }, 80);
    });
}

function updateStatsAfterRemoval(feature) {
    const root = feature.container;
    if (!root) return;
    
    const cards = root.querySelectorAll('.ypp-pl-card');
    
    const statsEl = root.querySelector('.ypp-pl-stats');
    if (statsEl) {
        statsEl.textContent = statsEl.textContent.replace(/\d+/, cards.length);
    }
    
    const durRows = root.querySelectorAll('.ypp-pl-duration-row');
    for (const row of durRows) {
        const label = row.querySelector('.ypp-pl-duration-speed');
        if (label && label.textContent === 'Videos') {
            const val = row.querySelector('.ypp-pl-duration-val');
            if (val) val.textContent = cards.length;
        }
    }
    
    let i = 1;
    let totalSecs = 0;
    
    cards.forEach(card => {
        const indexEl = card.querySelector('.ypp-pl-card-index');
        if (indexEl) indexEl.textContent = i;
        
        card.dataset.index = (i - 1);
        
        const durEl = card.querySelector('.ypp-pl-card-duration');
        if (durEl) {
            const cleanStr = durEl.textContent.replace(/[^0-9:]/g, '');
            const parts = cleanStr.split(':').map(n => parseInt(n, 10));
            if (parts.length === 3) {
                totalSecs += parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
                totalSecs += parts[0] * 60 + parts[1];
            } else if (parts.length === 1 && !isNaN(parts[0])) {
                totalSecs += parts[0];
            }
        }
        
        i++;
    });
    
    if (totalSecs >= 0) {
        const fmt = (s) => {
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = s % 60;
            return h > 0
                ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
                : `${m}:${String(sec).padStart(2,'0')}`;
        };
        
        const timeEl = root.querySelector('.ypp-pl-duration-time');
        if (timeEl) timeEl.textContent = fmt(totalSecs);
        
        const speedUpdates = [
            { label: '1.25×', s: Math.floor(totalSecs / 1.25) },
            { label: '1.5×',  s: Math.floor(totalSecs / 1.5)  },
            { label: '1.75×', s: Math.floor(totalSecs / 1.75) },
            { label: '2×',    s: Math.floor(totalSecs / 2)    },
        ];
        
        for (const row of durRows) {
            const labelEl = row.querySelector('.ypp-pl-duration-speed');
            if (!labelEl) continue;
            const label = labelEl.textContent;
            const update = speedUpdates.find(u => u.label === label);
            if (update) {
                const val = row.querySelector('.ypp-pl-duration-val');
                if (val) val.textContent = fmt(update.s);
            }
        }
    }
}
