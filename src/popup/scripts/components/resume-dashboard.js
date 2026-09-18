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
        return new Promise((resolve) => {
            // We use sync storage
            if (chrome && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.get(null, (data) => {
                    parseData(data);
                    resolve();
                });
            } else {
                parseData(window.localStorage);
                resolve();
            }
        });
    }

    function parseData(data) {
        state.videos = [];
        state.categories = [];

        for (const key of Object.keys(data)) {
            if (key === 'ypp_resume_categories') {
                try {
                    state.categories = typeof data[key] === 'string' ? JSON.parse(data[key]) : data[key];
                } catch(e) {}
            } else if (key.startsWith(STORAGE_PREFIX)) {
                try {
                    const val = typeof data[key] === 'string' ? JSON.parse(data[key]) : data[key];
                    if (val && val.time) {
                        state.videos.push({
                            id: key.replace(STORAGE_PREFIX, ''),
                            key: key,
                            time: val.time,
                            duration: val.duration || 0,
                            savedAt: val.savedAt || 0,
                            title: val.title || 'YouTube Video',
                            channel: val.channel || '',
                            thumbnail: val.thumbnail || `https://i.ytimg.com/vi/${key.replace(STORAGE_PREFIX, '')}/mqdefault.jpg`,
                            categoryId: val.categoryId || null
                        });
                    }
                } catch(e) {}
            }
        }
        
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
        folderListEl.appendChild(createFolderBtn('inbox', 'Inbox', state.videos.filter(v => !v.categoryId).length, state.activeCategory === 'inbox'));

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
        countEl.className = 'resume-folder-count';
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
            // Right click to delete
            btn.oncontextmenu = async (e) => {
                e.preventDefault();
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
            btn.title = "Right click to delete folder";
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
        const payload = JSON.stringify(state.categories);
        if (chrome && chrome.storage && chrome.storage.sync) {
            return new Promise(r => chrome.storage.sync.set({ 'ypp_resume_categories': payload }, r));
        } else {
            window.localStorage.setItem('ypp_resume_categories', payload);
        }
    }

    async function updateVideoCategory(key, categoryId) {
        return new Promise(resolve => {
            if (chrome && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.get([key], (data) => {
                    if (data[key]) {
                        try {
                            const val = typeof data[key] === 'string' ? JSON.parse(data[key]) : data[key];
                            val.categoryId = categoryId;
                            chrome.storage.sync.set({ [key]: JSON.stringify(val) }, resolve);
                        } catch(e) { resolve(); }
                    } else resolve();
                });
            } else {
                try {
                    const raw = window.localStorage.getItem(key);
                    if (raw) {
                        const val = JSON.parse(raw);
                        val.categoryId = categoryId;
                        window.localStorage.setItem(key, JSON.stringify(val));
                    }
                } catch(e) {}
                resolve();
            }
        });
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
