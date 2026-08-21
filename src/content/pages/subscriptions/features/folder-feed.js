/**
 * Folder Feed
 * Owns: Intercepting the subscription feed, fetching RSS feeds for channels,
 * parsing XML, and rendering a custom video grid.
 */

export class FolderFeed {
    static featureId = 'folderFeed';
    static executionPhase = 'idle'; // Run after folderStorage
    static priority = 100;

    constructor() {
        this.containerId = 'ypp-folder-feed-container';
        this.activeFolder = '__no_folder__';
        this.isFetching = false;
        this.currentVideos = [];
        this.feedSort = 'latest'; // 'latest', 'oldest'
        
        // Listen for filter changes
        window.YPP.EventBus.subscribe('subscriptions:filter-changed', (state) => {
            this.handleFilterChange(state);
        });
    }

    async init() {
        // Wait for native grid to be ready to insert our container
        await window.YPP.Utils.waitForElement('ytd-browse[page-subtype="subscriptions"] #contents.ytd-section-list-renderer');
        this.injectFeedContainer();
    }

    injectFeedContainer() {
        if (document.getElementById(this.containerId)) return;
        
        const nativeContents = document.querySelector('ytd-browse[page-subtype="subscriptions"] #contents.ytd-section-list-renderer');
        if (!nativeContents) return;

        const container = document.createElement('div');
        container.id = this.containerId;
        container.style.display = 'none';
        container.style.width = '100%';
        container.style.marginTop = '24px';
        
        // Match YouTube's grid structure (using rich-grid container styling)
        container.innerHTML = String.raw`
            <div id="ypp-feed-loading" style="display:none; text-align:center; padding: 40px; color: var(--yt-spec-text-secondary);">
                <div class="ytp-spinner" style="display:inline-block; width:32px; height:32px; margin-bottom:16px;">
                    <svg height="100%" viewBox="0 0 32 32" width="100%"><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" stroke="currentColor" stroke-opacity="0.2"></circle><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" stroke="currentColor" stroke-dasharray="80" stroke-dashoffset="60"></circle></svg>
                </div>
                <div>Loading folder videos...</div>
            </div>
            <div id="ypp-feed-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px 16px;"></div>
        `;
        
        nativeContents.parentNode.insertBefore(container, nativeContents);
    }

    async handleFilterChange(state) {
        this.activeFolder = state.folder || '__no_folder__';
        this.feedSort = state.sort || 'latest';
        
        const nativeContents = document.querySelector('ytd-browse[page-subtype="subscriptions"] #contents.ytd-section-list-renderer');
        const customContainer = document.getElementById(this.containerId);
        
        if (!nativeContents || !customContainer) return;

        if (this.activeFolder === '__no_folder__') {
            // Revert to native feed
            nativeContents.style.display = '';
            customContainer.style.display = 'none';
        } else {
            // Show custom feed
            nativeContents.style.display = 'none';
            customContainer.style.display = 'block';
            
            await this.loadFolderFeed(this.activeFolder);
        }
    }

    async loadFolderFeed(folderName) {
        if (this.isFetching) return;
        this.isFetching = true;
        
        const loadingEl = document.getElementById('ypp-feed-loading');
        const gridEl = document.getElementById('ypp-feed-grid');
        
        loadingEl.style.display = 'block';
        gridEl.innerHTML = '';
        
        try {
            const folderStorage = window.YPP.features.FolderStorage;
            if (!folderStorage) throw new Error("FolderStorage not found");
            
            const channelNames = folderStorage.folders[folderName] || [];
            
            // Resolve IDs
            const channelIds = channelNames.map(name => folderStorage.channelIdMap[name]).filter(id => id);
            
            if (channelIds.length === 0) {
                loadingEl.style.display = 'none';
                gridEl.innerHTML = '<div style="color:var(--yt-spec-text-secondary); padding:40px; text-align:center; grid-column: 1 / -1;">No channels found or missing Channel IDs. Ensure channels are mapped.</div>';
                this.isFetching = false;
                return;
            }

            // Fetch RSS for all channels in parallel
            const fetchPromises = channelIds.map(id => this.fetchChannelRSS(id));
            const results = await Promise.allSettled(fetchPromises);
            
            let allVideos = [];
            results.forEach(res => {
                if (res.status === 'fulfilled' && res.value) {
                    allVideos = allVideos.concat(res.value);
                }
            });

            // Sort videos
            allVideos.sort((a, b) => {
                const dateA = new Date(a.published).getTime();
                const dateB = new Date(b.published).getTime();
                return this.feedSort === 'latest' ? dateB - dateA : dateA - dateB;
            });

            this.currentVideos = allVideos;
            
            loadingEl.style.display = 'none';
            this.renderGrid(this.currentVideos, gridEl);
            
        } catch (e) {
            console.error('[FolderFeed] Error loading feed:', e);
            loadingEl.style.display = 'none';
            gridEl.innerHTML = '<div style="color:#ff4e4e; padding:40px; text-align:center; grid-column: 1 / -1;">Failed to load videos.</div>';
        } finally {
            this.isFetching = false;
        }
    }

    async fetchChannelRSS(channelId) {
        try {
            const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
            if (!res.ok) return [];
            const text = await res.text();
            
            // Minimal regex parsing is significantly faster than DOMParser for large XMLs in Chrome extensions
            const videos = [];
            const entries = text.split('<entry>');
            
            // First chunk is header, skip it
            for (let i = 1; i < entries.length; i++) {
                const entry = entries[i];
                
                const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
                const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/);
                const authorMatch = entry.match(/<name>([\s\S]*?)<\/name>/);
                const pubMatch = entry.match(/<published>([^<]+)<\/published>/);
                const thumbMatch = entry.match(/<media:thumbnail url="([^"]+)"/);
                
                if (idMatch && titleMatch) {
                    videos.push({
                        id: idMatch[1],
                        title: titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
                        author: authorMatch ? authorMatch[1] : 'Unknown',
                        channelId: channelId,
                        published: pubMatch ? pubMatch[1] : new Date().toISOString(),
                        thumbnail: thumbMatch ? thumbMatch[1] : `https://i.ytimg.com/vi/${idMatch[1]}/hqdefault.jpg`
                    });
                }
            }
            return videos;
        } catch (e) {
            console.error(`Failed to fetch RSS for ${channelId}`, e);
            return [];
        }
    }

    renderGrid(videos, gridEl) {
        if (videos.length === 0) {
            gridEl.innerHTML = '<div style="color:var(--yt-spec-text-secondary); padding:40px; text-align:center; grid-column: 1 / -1;">No videos found for this folder.</div>';
            return;
        }

        const fragment = document.createDocumentFragment();
        
        videos.forEach(v => {
            const card = document.createElement('div');
            // Basic layout mimicking ytd-rich-item-renderer
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.width = '100%';
            
            const timeAgo = this.timeSince(new Date(v.published));

            card.innerHTML = String.raw`
                <div style="position:relative; width:100%; padding-top:56.25%; border-radius:12px; overflow:hidden; background:#222; margin-bottom:12px;">
                    <a href="/watch?v=${v.id}" style="position:absolute; top:0; left:0; width:100%; height:100%;">
                        <img src="${v.thumbnail}" style="width:100%; height:100%; object-fit:cover;" />
                    </a>
                </div>
                <div style="display:flex; gap:12px; padding-right:24px;">
                    <div style="display:flex; flex-direction:column;">
                        <a href="/watch?v=${v.id}" style="color:var(--yt-spec-text-primary); font-size:16px; font-weight:500; line-height:2.2rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-decoration:none; margin-bottom:4px;">
                            ${v.title}
                        </a>
                        <div style="color:var(--yt-spec-text-secondary); font-size:14px; line-height:2rem; display:flex; flex-direction:column;">
                            <a href="/channel/${v.channelId}" style="color:var(--yt-spec-text-secondary); text-decoration:none;">${v.author}</a>
                            <span>${timeAgo}</span>
                        </div>
                    </div>
                </div>
            `;
            fragment.appendChild(card);
        });

        gridEl.appendChild(fragment);
    }
    
    timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }
}

window.YPP.features.FolderFeed = FolderFeed;
