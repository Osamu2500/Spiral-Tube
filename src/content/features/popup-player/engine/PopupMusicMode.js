export class PopupMusicMode {
    constructor(engine) {
        this.engine = engine; // Reference to the main PopupPlayer instance
        
        // DOM Elements
        this.dockRoot = null;
        
        this.buildDock();
    }
    
    // Builds the small mini-dock (e.g., bottom left)
    buildDock() {
        this.dockRoot = document.createElement('div');
        this.dockRoot.className = 'ytpop-music-dock';
        this.dockRoot.style.display = 'none'; // Hidden by default

        const controls = document.createElement('div');
        controls.className = 'ytpop-music-dock-controls';
        
        const thumb = document.createElement('img');
        thumb.className = 'ytpop-music-dock-thumb';
        thumb.alt = 'Thumbnail';
        
        const body = document.createElement('div');
        body.className = 'ytpop-music-dock-body';
        
        const title = document.createElement('div');
        title.className = 'ytpop-music-dock-title';
        title.textContent = 'Loading...';
        
        // Removed maximize click listener from dockRoot
        
        body.appendChild(title);
        controls.appendChild(thumb);
        controls.appendChild(body);
        this.dockRoot.appendChild(controls);
        
        // Hover Overlay for Music Dock
        const hoverOverlay = document.createElement('div');
        hoverOverlay.className = 'ytpop-music-dock-hover-overlay';

        const btnMiniplayer = document.createElement('button');
        btnMiniplayer.className = 'ytpop-dock-btn ytpop-dock-btn-mini';
        btnMiniplayer.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="11" y="11" width="8" height="8" rx="1"/></svg>`;
        btnMiniplayer.title = "Back to Miniplayer";
        btnMiniplayer.onclick = (e) => { e.stopPropagation(); this.engine._enterMiniplayer(); };

        const btnExpand = document.createElement('button');
        btnExpand.className = 'ytpop-dock-btn ytpop-dock-btn-expand';
        btnExpand.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
        btnExpand.title = "Expand to Full Player";
        btnExpand.onclick = (e) => { e.stopPropagation(); this.engine._exitMusicMode(); };

        hoverOverlay.appendChild(btnMiniplayer);
        hoverOverlay.appendChild(btnExpand);

        this.dockRoot.appendChild(hoverOverlay);
        
        // Provide references for updating
        this.dockElements = { thumb, title };
    }

    updateMetadata(data) {
        if (!data) return;
        
        // Update dock
        if (data.title) this.dockElements.title.textContent = data.title;
        if (data.videoId) {
            const thumbUrl = `https://i.ytimg.com/vi/${data.videoId}/mqdefault.jpg`;
            this.dockElements.thumb.src = thumbUrl;
        }
    }
}
