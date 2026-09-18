import { ResumeDataManager } from '../../../content/features/resume/resume-data.js';

const STORAGE_PREFIX = 'ypp_resume_';

export async function initResumeDashboard() {
    const container = document.getElementById('resume-dashboard-container');
    if (!container) return;

    const folderListEl = document.getElementById('resume-folder-list');
    const newFolderBtn = document.getElementById('resume-new-folder-btn');
    const videoListEl = document.getElementById('resume-video-list');
    const emptyStateEl = document.getElementById('resume-empty-state');
    const searchInput = document.getElementById('resume-search');
    const sortSelect = document.getElementById('resume-sort');
    const badge = document.getElementById('navResumeBadge');

    let state = {
        videos: [],
        categories: [],
        activeCategory: 'all',
        searchQuery: '',
        sortType: 'recent'
    };

    async function loadData() {
        state.videos = await ResumeDataManager.getAllVideos();
        state.categories = await ResumeDataManager.getCategories();
        
        // Update badge
        if (badge) {
            badge.textContent = state.videos.length;
            badge.style.display = state.videos.length > 0 ? 'inline-block' : 'none';
        }
    }

    function renderFolders() {
        folderListEl.innerHTML = '';
        
        // System folders
        folderListEl.appendChild(createFolderBtn('all', 'All videos', state.videos.length, !state.activeCategory || state.activeCategory === 'all'));

        // Custom folders
        for (const cat of state.categories) {
            const count = state.videos.filter(v => v.categoryId === cat.id).length;
            folderListEl.appendChild(createFolderBtn(cat.id, cat.name, count, state.activeCategory === cat.id, cat.color, true));
        }
    }

    function createFolderBtn(id, name, count, isActive, color = null, isCustom = false) {
        const btn = document.createElement('button');
        btn.className = `resume-folder-btn ${isActive ? 'active' : ''}`;
        
        const dot = document.createElement('div');
        dot.className = 'resume-folder-dot';
        dot.style.background = color || 'rgba(255,255,255,0.2)';
        
        const label = document.createElement('span');
        label.textContent = name;
        label.style.whiteSpace = 'nowrap';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';
        label.style.flex = '1';
        
        const countEl = document.createElement('span');
        countEl.className = 'resume-folder-count' + (isCustom ? ' has-actions' : '');
        countEl.textContent = count;
        
        btn.appendChild(dot);
        btn.appendChild(label);
        btn.appendChild(countEl);
        
        btn.onclick = () => {
            state.activeCategory = id;
            renderFolders();
            renderVideos();
        };

        if (isCustom) {
            // Actions container
            const actions = document.createElement('div');
            actions.className = 'resume-folder-actions';
            
            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'resume-folder-action-btn edit';
            editBtn.title = "Rename folder";
            editBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
            editBtn.onclick = async (e) => {
                e.stopPropagation();
                const newName = prompt("Rename folder:", name);
                if (newName && newName.trim() && newName.trim() !== name) {
                    const cat = state.categories.find(c => c.id === id);
                    if (cat) {
                        cat.name = newName.trim();
                        await saveCategories();
                        renderFolders();
                        renderVideos(); // re-render to update dropdowns in video items
                    }
                }
            };
            
            // Delete button
            const delBtn = document.createElement('button');
            delBtn.className = 'resume-folder-action-btn delete';
            delBtn.title = "Delete folder";
            delBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
            delBtn.onclick = async (e) => {
                e.stopPropagation();
                if (confirm(`Delete folder "${name}"? Videos will be moved to Inbox.`)) {
                    state.categories = state.categories.filter(c => c.id !== id);
                    await saveCategories();
                    // update videos that had this category
                    for (const v of state.videos) {
                        if (v.categoryId === id) {
                            v.categoryId = null;
                            await updateVideoCategory(v.key, null);
                        }
                    }
                    if (state.activeCategory === id) state.activeCategory = 'all';
                    renderFolders();
                    renderVideos();
                }
            };

            actions.appendChild(editBtn);
            actions.appendChild(delBtn);
            btn.appendChild(actions);

            // Drag and Drop
            btn.draggable = true;
            btn.dataset.catId = id;
            
            btn.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', id);
                btn.classList.add('dragging');
            });
            
            btn.addEventListener('dragend', () => {
                btn.classList.remove('dragging');
                document.querySelectorAll('.resume-folder-btn').forEach(b => {
                    b.classList.remove('drag-over-top', 'drag-over-bottom');
                });
            });
            
            btn.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingItem = document.querySelector('.resume-folder-btn.dragging');
                if (!draggingItem || draggingItem === btn) return;
                
                const bounding = btn.getBoundingClientRect();
                const offset = bounding.y + (bounding.height / 2);
                if (e.clientY - offset > 0) {
                    btn.classList.add('drag-over-bottom');
                    btn.classList.remove('drag-over-top');
                } else {
                    btn.classList.add('drag-over-top');
                    btn.classList.remove('drag-over-bottom');
                }
            });
            
            btn.addEventListener('dragleave', () => {
                btn.classList.remove('drag-over-top', 'drag-over-bottom');
            });
            
            btn.addEventListener('drop', async (e) => {
                e.preventDefault();
                btn.classList.remove('drag-over-top', 'drag-over-bottom');
                const draggedId = e.dataTransfer.getData('text/plain');
                if (!draggedId || draggedId === id) return;
                
                const draggedIdx = state.categories.findIndex(c => c.id === draggedId);
                const targetIdx = state.categories.findIndex(c => c.id === id);
                if (draggedIdx === -1 || targetIdx === -1) return;
                
                const bounding = btn.getBoundingClientRect();
                const offset = bounding.y + (bounding.height / 2);
                const insertAfter = (e.clientY - offset > 0);
                
                // Reorder array
                const [movedItem] = state.categories.splice(draggedIdx, 1);
                const newTargetIdx = state.categories.findIndex(c => c.id === id); // recalculate after splice
                state.categories.splice(insertAfter ? newTargetIdx + 1 : newTargetIdx, 0, movedItem);
                
                await saveCategories();
                renderFolders();
            });
        }
        
        return btn;
    }

    function renderVideos() {
        videoListEl.innerHTML = '';
        
        let filtered = state.videos;
        
        // Filter by category
        if (state.activeCategory === 'inbox') {
            filtered = filtered.filter(v => !v.categoryId);
        } else if (state.activeCategory !== 'all') {
            filtered = filtered.filter(v => v.categoryId === state.activeCategory);
        }
        
        // Filter by search
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            filtered = filtered.filter(v => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q));
        }
        
        // Sort
        filtered.sort((a, b) => {
            if (state.sortType === 'recent') return b.savedAt - a.savedAt;
            if (state.sortType === 'added') return a.savedAt - b.savedAt;
            if (state.sortType === 'title') return a.title.localeCompare(b.title);
            return 0;
        });
        
        if (filtered.length === 0) {
            emptyStateEl.style.display = 'flex';
        } else {
            emptyStateEl.style.display = 'none';
            for (const v of filtered) {
                videoListEl.appendChild(createVideoItem(v));
            }
        }
    }

    function createVideoItem(v) {
        const a = document.createElement('a');
        a.className = 'resume-video-item';
        a.href = `https://www.youtube.com/watch?v=${v.id}&t=${Math.floor(v.time)}s`;
        a.target = '_blank';
        
        const progress = v.duration > 0 ? Math.min(100, Math.round((v.time / v.duration) * 100)) : 0;
        
        const currentFolder = v.categoryId ? (state.categories.find(c => c.id === v.categoryId)?.name || 'Inbox') : 'Inbox';

        a.innerHTML = `
            <div class="resume-video-thumb-container">
                <img src="${v.thumbnail}" alt="">
                <div class="resume-progress-bar">
                    <div class="resume-progress-fill" style="width:${progress}%"></div>
                </div>
            </div>
            <div class="resume-video-info">
                <div class="resume-video-title" id="title-${v.id}">${v.title}</div>
                <div class="resume-video-channel">${v.channel}</div>
                <div class="resume-video-meta">${progress}% watched</div>
            </div>
            <div class="resume-video-actions">
                <div class="custom-move-dropdown-wrapper">
                    <button class="custom-move-btn" title="Move to folder">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span>${currentFolder}</span>
                    </button>
                    <div class="custom-move-popover">
                        <div class="custom-move-option" data-value="inbox">
                            <span class="custom-move-dot" style="background:rgba(255,255,255,0.2)"></span> Inbox
                        </div>
                        ${state.categories.map(c => `
                            <div class="custom-move-option" data-value="${c.id}">
                                <span class="custom-move-dot" style="background:${c.color}"></span> ${c.name}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="resume-delete-btn" title="Remove">✕</div>
            </div>
        `;
        
        // Custom Dropdown Logic
        const wrapper = a.querySelector('.custom-move-dropdown-wrapper');
        const moveBtn = a.querySelector('.custom-move-btn');
        const popover = a.querySelector('.custom-move-popover');
        
        moveBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // close any other open dropdowns
            document.querySelectorAll('.custom-move-dropdown-wrapper.open').forEach(w => {
                if (w !== wrapper) w.classList.remove('open');
            });
            
            wrapper.classList.toggle('open');
        };
        
        popover.querySelectorAll('.custom-move-option').forEach(opt => {
            opt.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const val = opt.getAttribute('data-value');
                const newCat = val === 'inbox' ? null : val;
                v.categoryId = newCat;
                wrapper.classList.remove('open');
                
                await updateVideoCategory(v.key, newCat);
                renderFolders();
                renderVideos();
            };
        });
        
        const delBtn = a.querySelector('.resume-delete-btn');
        delBtn.onclick = (e) => {
            e.preventDefault();
            if (chrome && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.remove(v.key);
            } else {
                if (window.YPP && window.YPP.StorageManager) {
                    window.YPP.StorageManager.remove(v.key);
                }
            }
            state.videos = state.videos.filter(x => x.key !== v.key);
            if (badge) {
                badge.textContent = state.videos.length;
                badge.style.display = state.videos.length > 0 ? 'inline-block' : 'none';
            }
            renderFolders();
            renderVideos();
        };
        
        // oEmbed Fallback for missing titles
        if (v.title === 'YouTube Video' || !v.title) {
            fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.id}&format=json`)
                .then(res => res.json())
                .then(data => {
                    if (data.title) {
                        const titleEl = a.querySelector(`#title-${v.id}`);
                        if (titleEl) titleEl.textContent = data.title;
                        
                        // Also update storage so we don't have to fetch again
                        v.title = data.title;
                        if (data.author_name && !v.channel) v.channel = data.author_name;
                        
                        if (chrome && chrome.storage && chrome.storage.sync) {
                            chrome.storage.sync.get([v.key], (result) => {
                                try {
                                    const parsed = JSON.parse(result[v.key]);
                                    parsed.title = v.title;
                                    parsed.channel = v.channel;
                                    chrome.storage.sync.set({ [v.key]: JSON.stringify(parsed) });
                                } catch (e) {}
                            });
                        }
                    }
                })
                .catch(() => {}); // ignore errors
        }
        
        return a;
    }

    async function saveCategories() {
        await ResumeDataManager.saveCategories(state.categories);
    }

    async function updateVideoCategory(key, categoryId) {
        await ResumeDataManager.updateVideoCategory(key, categoryId);
    }

    // Event Listeners
    newFolderBtn.onclick = async () => {
        const name = prompt("Enter folder name:");
        if (name && name.trim()) {
            // generate random pastel color
            const hue = Math.floor(Math.random() * 360);
            const color = `hsl(${hue}, 70%, 65%)`;
            state.categories.push({ id: 'cat_' + Date.now(), name: name.trim(), color });
            await saveCategories();
            renderFolders();
            renderVideos();
        }
    };
    
    searchInput.oninput = (e) => {
        state.searchQuery = e.target.value;
        renderVideos();
    };
    
    sortSelect.onchange = (e) => {
        state.sortType = e.target.value;
        renderVideos();
    };

    // Listen for cross-context storage changes
    if (chrome && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes) => {
            let needsRefresh = false;
            for (const key of Object.keys(changes)) {
                if (key.startsWith(STORAGE_PREFIX) || key === 'ypp_resume_categories') {
                    needsRefresh = true;
                    break;
                }
            }
            if (needsRefresh) {
                loadData().then(() => {
                    renderFolders();
                    renderVideos();
                });
            }
        });
    }

    // Global click to close custom dropdowns
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-move-dropdown-wrapper.open').forEach(w => w.classList.remove('open'));
    });

    // Initial render
    await loadData();
    renderFolders();
    renderVideos();
}
