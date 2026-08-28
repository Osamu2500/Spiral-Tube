import { FILTERS as BASE_FILTERS } from '../video-filters-presets.js';
import { VideoFiltersUI } from '../video-filters-ui.js';

export class PresetsTabUI {
    static build(ctx, video, btn) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;min-height:0;';

        // ── Favorites (localStorage)
        const FAV_KEY  = 'ypp-fav-filters';
        const loadFavs = () => { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; } };
        let currentFavs = loadFavs();
        const saveFavs = (arr) => {
            try {
                localStorage.setItem(FAV_KEY, JSON.stringify(arr));
            } catch(e) {
                window.YPP?.Utils?.log?.('Failed to save favorite filters', 'VIDEO-FILTERS', 'warn', e);
            }
        };
        const toggleFav = (idx) => {
            const pos = currentFavs.indexOf(idx);
            pos === -1 ? currentFavs.push(idx) : currentFavs.splice(pos, 1);
            saveFavs(currentFavs);
        };

        // ── Search bar
        const searchWrap = document.createElement('div');
        searchWrap.className = 'ypp-vcp-search-wrap';
        Object.assign(searchWrap.style, { margin: '12px 14px', marginBottom: '6px' });
        searchWrap.innerHTML = `
            <span class="ypp-vcp-search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></span>
            <input type="text" class="ypp-vcp-search-input" placeholder="Search presets (e.g. Night Vision)...">
        `;
        const searchInput = searchWrap.querySelector('input');
        wrap.appendChild(searchWrap);

        const listContainer = document.createElement('div');
        wrap.appendChild(listContainer);

        const starFilled  = `<svg width="11" height="11" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
        const starOutline = `<svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zm-10 6.93l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.81 4.38.38-3.32 2.88 1 4.28L12 16.17z"/></svg>`;

        let FILTERS = [...BASE_FILTERS]; // Will be populated with custom presets later

        // ── Build a single filter card
        const buildCard = (filter, index) => {
            const card = document.createElement('div');
            const isActive = ctx.currentFilterIndex === index;
            const isFav    = currentFavs.includes(index);
            card.className = `ypp-filter-card ${isActive ? 'active' : ''}`;
            card.title = filter.name;
            card.style.animationDelay = `${Math.min((index % 20) * 40, 600)}ms`;
            
            const cssFilter = filter.css === 'none' ? 'grayscale(0%)' : filter.css;
            const previewBg = filter.preview ? filter.preview : 'linear-gradient(135deg, #ff4b4b, #4b6fff, #4bff8b)';
            
            const isCustom = filter.category === 'My Presets';
            const trashIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;
            
            card.innerHTML = `
                <div class="ypp-filter-lut-preview" style="background:${previewBg}; filter:${cssFilter}"></div>
                <span style="font-size:8.5px;font-weight:600;color:${isActive ? '#fff' : 'rgba(255,255,255,0.9)'};text-shadow:-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000, 0 1px 3px rgba(0,0,0,0.9);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;letter-spacing:0.2px;">${filter.name}</span>
                ${isActive ? '<div class="ypp-card-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div>' : ''}
                ${isCustom ? `<button class="ypp-trash-btn" title="Delete Preset">${trashIcon}</button>` : ''}
                <button class="ypp-star-btn" title="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}" data-fav="${isFav}">${isFav ? starFilled : starOutline}</button>
            `;
            const starBtn = card.querySelector('.ypp-star-btn');
            starBtn.onclick = (e) => {
                e.stopPropagation();
                toggleFav(index);
                renderFilteredList(searchInput.value);
            };
            const trashBtn = card.querySelector('.ypp-trash-btn');
            if (trashBtn) {
                trashBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete custom preset "${filter.name}"?`)) {
                        chrome.storage.local.get('ypp_custom_presets', (data) => {
                            let custom = data.ypp_custom_presets || [];
                            custom = custom.filter(cp => cp.name !== filter.name);
                            chrome.storage.local.set({ ypp_custom_presets: custom }, () => {
                                renderFilteredList(searchInput.value);
                            });
                        });
                    }
                };
            }

            card.onclick = (e) => {
                if (e.target.closest('.ypp-star-btn') || e.target.closest('.ypp-trash-btn')) return;
                e.stopPropagation();
                ctx._previewFilterIndex = undefined;
                ctx.currentFilterIndex = index;
                const f = FILTERS[index];
                if (f.adjustments) {
                    Object.assign(ctx.filterAdjustments, f.adjustments);
                    if (f.intensity !== undefined) ctx.filterIntensity = f.intensity;
                } else {
                    Object.assign(ctx.filterAdjustments, { brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, sepia: 0, grayscale: 0, invert: 0, blur: 0, opacity: 100, dehaze: 0, clarity: 0, grain: 0, sharpness: 0, temperature: 0, vibrance: 100, highlights: 0, shadows: 0, vignette: 0, exposure: 0, tint: 0, fade: 0, noiseReduction: 0 });
                    ctx.filterIntensity = 100;
                }
                ctx._applyComputedFilter(video);
                VideoFiltersUI.saveFilterSettings(ctx);
                if (btn) { index > 0 ? btn.classList.add('active') : btn.classList.remove('active'); }
                ctx._showToast(video, `✨ ${filter.name}`);
                const pill = ctx._filterPanel?.querySelector('#ypp-active-filter-name');
                if (pill) pill.textContent = filter.name;
                listContainer.querySelectorAll('.ypp-filter-card').forEach(c => {
                    c.classList.remove('active');
                    const sp = c.querySelector('span'); if (sp) sp.style.color = 'rgba(255,255,255,0.8)';
                    const chk = c.querySelector('.ypp-card-check'); if (chk) chk.remove();
                });
                card.classList.add('active');
                const sp = card.querySelector('span'); if (sp) sp.style.color = '#fff';
                if (!card.querySelector('.ypp-card-check')) {
                    starBtn.insertAdjacentHTML('beforebegin', '<div class="ypp-card-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div>');
                }
            };
            card.onmouseenter = () => {
                if (ctx.currentFilterIndex === index) return;
                ctx._previewFilterIndex = ctx.currentFilterIndex;
                ctx.currentFilterIndex = index;
                ctx._applyComputedFilter(video);
            };
            card.onmouseleave = () => {
                if (ctx._previewFilterIndex === undefined) return;
                ctx.currentFilterIndex = ctx._previewFilterIndex;
                ctx._previewFilterIndex = undefined;
                ctx._applyComputedFilter(video);
            };
            return card;
        };

        // ── Build a <details> category block
        const buildCategory = (cat, items, open = false) => {
            const details = document.createElement('details');
            details.className = 'ypp-filter-cat-details';
            if (open) details.open = true;
            const summary = document.createElement('summary');
            summary.innerHTML = cat === '⭐ Favorites'
                ? `<span style="display:flex;align-items:center;gap:8px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>${cat}</span>`
                : cat;
            details.appendChild(summary);
            const grid = document.createElement('div');
            grid.className = 'ypp-filter-card-grid';
            items.forEach(({ filter, index }) => grid.appendChild(buildCard(filter, index)));
            details.appendChild(grid);
            return details;
        };

        // ── Main render
        const renderFilteredList = (query = '') => {
            listContainer.innerHTML = '';
            const q = query.toLowerCase();
            let localFilters = [...BASE_FILTERS];
            
            if (chrome?.storage?.local) {
                chrome.storage.local.get('ypp_custom_presets', (data) => {
                    let customPresets = data.ypp_custom_presets || [];
                    customPresets.forEach(cp => {
                        if (!localFilters.some(bf => bf.name === cp.name && bf.category === cp.category)) {
                            localFilters.push(cp);
                        }
                    });
                    
                    FILTERS = localFilters; // Expose for buildCard
                    
                    if (!query && currentFavs.length > 0) {
                        const favItems = currentFavs.filter(i => FILTERS[i]).map(i => ({ filter: FILTERS[i], index: i }));
                        if (favItems.length) listContainer.appendChild(buildCategory('⭐ Favorites', favItems, true));
                    }

                    const groups = {};
                    FILTERS.forEach((filter, index) => {
                        if (q && !filter.name.toLowerCase().includes(q) && !filter.category.toLowerCase().includes(q)) return;
                        const cat = filter.category || 'Other';
                        if (!groups[cat]) groups[cat] = [];
                        groups[cat].push({ filter, index });
                    });
                    
                    Object.keys(groups).forEach(cat => {
                        listContainer.appendChild(buildCategory(cat, groups[cat], !!query));
                    });

                    if (query && Object.keys(groups).length === 0) {
                        const empty = document.createElement('div');
                        empty.style.cssText = 'padding:40px 20px;text-align:center;color:rgba(255,255,255,0.3);font-size:13px;font-style:italic;';
                        empty.textContent = 'No filters matching your search...';
                        listContainer.appendChild(empty);
                    }
                });
            }
        };

        searchInput.oninput = (e) => renderFilteredList(e.target.value);
        renderFilteredList();

        return wrap;
    }
}
