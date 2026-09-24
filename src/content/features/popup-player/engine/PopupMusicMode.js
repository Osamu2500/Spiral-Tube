export class PopupMusicMode {
    constructor(engine) {
        this.engine = engine; // Reference to the main PopupPlayer instance
        
        // DOM Elements
        this.dockRoot = null;
        this.maxPanelRoot = null;
        
        // State
        this.viewMode = 'song'; // 'song' or 'video'
        
        this.buildDock();
        this.buildMaxPanel();
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
        
        // Maximize button on the dock
        this.dockRoot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.engine._maximizeMusicMode();
        });
        
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

        const btnMaximize = document.createElement('button');
        btnMaximize.className = 'ytpop-dock-btn ytpop-dock-btn-max';
        btnMaximize.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 8 21"/><line x1="21" y1="21" x2="3" y2="3"/><polyline points="3 16 3 3 16 3"/></svg>`;
        btnMaximize.title = "Maximize Music Mode";
        btnMaximize.onclick = (e) => { e.stopPropagation(); this.engine._maximizeMusicMode(); };

        hoverOverlay.appendChild(btnMiniplayer);
        hoverOverlay.appendChild(btnMaximize);
        hoverOverlay.appendChild(btnExpand);

        this.dockRoot.appendChild(hoverOverlay);
        
        // Provide references for updating
        this.dockElements = { thumb, title };
    }

    // Builds the full-screen maximized music player panel
    buildMaxPanel() {
        this.maxPanelRoot = document.createElement('div');
        this.maxPanelRoot.className = 'ytpop-music-max-panel';
        
        const bg = document.createElement('div');
        bg.className = 'ytpop-music-max-bg';
        
        const header = document.createElement('div');
        header.className = 'ytpop-music-max-header';
        
        // Minimize Button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'ytpop-music-max-minimize';
        minimizeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><polyline points="6 9 12 15 18 9"/></svg>`;
        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            this.engine._minimizeMusicMode();
        };

        // Switch back to normal player
        const exitMusicBtn = document.createElement('button');
        exitMusicBtn.className = 'ytpop-music-max-exit';
        exitMusicBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="6" cy="6" r="1"/></svg>`;
        exitMusicBtn.onclick = (e) => {
            e.stopPropagation();
            this.engine._exitMusicMode();
        };
        
        const headerLeft = document.createElement('div');
        headerLeft.className = 'ytpop-music-max-header-left';
        headerLeft.appendChild(minimizeBtn);
        
        const headerRight = document.createElement('div');
        headerRight.className = 'ytpop-music-max-header-right';
        headerRight.appendChild(exitMusicBtn);
        
        // Switch between Song / Video modes
        const switchWrap = document.createElement('div');
        switchWrap.className = 'ytpop-music-max-switch';
        
        const songBtn = document.createElement('button');
        songBtn.className = 'ytpop-music-max-switch-btn is-active';
        songBtn.textContent = 'Song';
        
        const videoBtn = document.createElement('button');
        videoBtn.className = 'ytpop-music-max-switch-btn';
        videoBtn.textContent = 'Video';
        
        songBtn.onclick = (e) => { e.stopPropagation(); this.setMediaMode('song'); };
        videoBtn.onclick = (e) => { e.stopPropagation(); this.setMediaMode('video'); };
        
        switchWrap.appendChild(songBtn);
        switchWrap.appendChild(videoBtn);
        
        header.appendChild(headerLeft);
        header.appendChild(switchWrap);
        header.appendChild(headerRight);
        
        // Main Media Area
        const main = document.createElement('div');
        main.className = 'ytpop-music-max-main';
        
        const mediaWrap = document.createElement('div');
        mediaWrap.className = 'ytpop-music-max-media';
        
        const art = document.createElement('img');
        art.className = 'ytpop-music-max-art';
        art.alt = 'Album Art';
        
        mediaWrap.appendChild(art);
        
        const details = document.createElement('div');
        details.className = 'ytpop-music-max-details';
        
        const metadata = document.createElement('div');
        metadata.className = 'ytpop-music-max-metadata';
        
        const title = document.createElement('h2');
        title.className = 'ytpop-music-max-title';
        title.textContent = 'Loading...';
        
        const artist = document.createElement('div');
        artist.className = 'ytpop-music-max-artist';
        artist.textContent = 'Loading...';
        
        metadata.appendChild(title);
        metadata.appendChild(artist);
        details.appendChild(metadata);
        
        main.appendChild(mediaWrap);
        main.appendChild(details);
        
        this.maxPanelRoot.appendChild(bg);
        this.maxPanelRoot.appendChild(header);
        this.maxPanelRoot.appendChild(main);
        
        this.maxElements = { art, title, artist, mediaWrap, songBtn, videoBtn };
    }

    setMediaMode(mode) {
        this.viewMode = mode;
        this.maxElements.songBtn.classList.toggle('is-active', mode === 'song');
        this.maxElements.videoBtn.classList.toggle('is-active', mode === 'video');
        
        if (mode === 'song') {
            this.maxElements.art.style.display = 'block';
            this.maxElements.mediaWrap.classList.remove('ytpop-media--video');
            if (this.engine.iframe) {
                this.engine.iframe.style.display = 'none';
            }
        } else {
            this.maxElements.art.style.display = 'none';
            this.maxElements.mediaWrap.classList.add('ytpop-media--video');
            if (this.engine.iframe) {
                this.engine.iframe.style.display = 'block';
                this._syncIframePosition();
            }
        }
    }

    _syncIframePosition() {
        if (!this.engine.iframe || this.viewMode !== 'video' || !this.engine.state.isMusicMaximized) return;
        
        // Use ResizeObserver to continuously track the placeholder box
        if (!this.resizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.viewMode === 'video' && this.engine.state.isMusicMaximized) {
                    const rect = this.maxElements.mediaWrap.getBoundingClientRect();
                    const containerRect = this.engine.container.getBoundingClientRect();
                    
                    this.engine.iframe.style.position = 'absolute';
                    this.engine.iframe.style.top = (rect.top - containerRect.top) + 'px';
                    this.engine.iframe.style.left = (rect.left - containerRect.left) + 'px';
                    this.engine.iframe.style.width = rect.width + 'px';
                    this.engine.iframe.style.height = rect.height + 'px';
                    this.engine.iframe.style.zIndex = '150';
                    this.engine.iframe.style.borderRadius = '24px'; // match mediaWrap
                }
            });
            this.resizeObserver.observe(this.maxElements.mediaWrap);
        }
        
        // Trigger an immediate sync
        const rect = this.maxElements.mediaWrap.getBoundingClientRect();
        const containerRect = this.engine.container.getBoundingClientRect();
        this.engine.iframe.style.position = 'absolute';
        this.engine.iframe.style.top = (rect.top - containerRect.top) + 'px';
        this.engine.iframe.style.left = (rect.left - containerRect.left) + 'px';
        this.engine.iframe.style.width = rect.width + 'px';
        this.engine.iframe.style.height = rect.height + 'px';
        this.engine.iframe.style.zIndex = '150';
        this.engine.iframe.style.borderRadius = '24px';
    }

    updateMetadata(data) {
        if (!data) return;
        
        // Update dock
        if (data.title) this.dockElements.title.textContent = data.title;
        if (data.videoId) {
            const thumbUrl = `https://i.ytimg.com/vi/${data.videoId}/mqdefault.jpg`;
            const hqThumbUrl = `https://i.ytimg.com/vi/${data.videoId}/maxresdefault.jpg`;
            this.dockElements.thumb.src = thumbUrl;
            this.maxElements.art.src = hqThumbUrl;
            // Fallback for maxresdefault
            this.maxElements.art.onerror = () => {
                this.maxElements.art.src = thumbUrl;
            };
        }
        
        // Update max panel
        if (data.title) this.maxElements.title.textContent = data.title;
        if (data.channelName) this.maxElements.artist.textContent = data.channelName;
    }
}
