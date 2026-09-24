/**
 * PopupMusicMode.js
 *
 * Scope: Popup Player Music Mode UI
 * Description: Constructs the specialized Music Mode dock and handles its metadata updates.
 * 
 * NOTE: strictly scoped to the Popup Player feature. It does not affect any
 * unrelated files or core functionality outside its scope.
 */
export class PopupMusicMode {
    constructor(engine) {
        this.engine = engine; // Reference to the main PopupPlayer instance
        
        // DOM Elements
        this.dockRoot = null;
        
        this.buildDock();
    }
    
    buildDock() {
        this.dockRoot = document.createElement('div');
        this.dockRoot.className = 'ytpop-music-dock';
        this.dockRoot.style.display = 'none'; // Hidden by default

        // Left: Thumbnail
        const thumbWrap = document.createElement('div');
        thumbWrap.className = 'ytpop-music-dock-thumb-wrap';
        
        const thumb = document.createElement('img');
        thumb.className = 'ytpop-music-dock-thumb';
        thumb.alt = 'Thumbnail';
        
        thumbWrap.appendChild(thumb);
        
        // Right: Info & Controls
        const body = document.createElement('div');
        body.className = 'ytpop-music-dock-body';
        
        const title = document.createElement('div');
        title.className = 'ytpop-music-dock-title';
        title.textContent = 'Loading...';
        
        const controls = document.createElement('div');
        controls.className = 'ytpop-music-dock-controls';
        
        // Playback Buttons
        const createCtrlBtn = (icon, titleText, onClick) => {
            const btn = document.createElement('button');
            btn.className = 'ytpop-dock-ctrl-btn';
            btn.title = titleText;
            btn.innerHTML = icon;
            btn.onclick = (e) => { e.stopPropagation(); onClick(); };
            return btn;
        };

        const btnPrev = createCtrlBtn(
            `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>`,
            "Previous",
            () => this.engine._sendToIframe({ command: 'prevVideo' })
        );
        
        const btnPlayPause = createCtrlBtn(
            `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`, // We can't know play state easily, but a play/pause icon works.
            "Play/Pause",
            () => this.engine._sendToIframe({ command: 'togglePlay' })
        );
        
        const btnNext = createCtrlBtn(
            `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>`,
            "Next",
            () => this.engine._sendToIframe({ command: 'nextVideo' })
        );
        
        // Separator
        const separator = document.createElement('div');
        separator.className = 'ytpop-dock-separator';
        
        // State Buttons
        const btnMiniplayer = createCtrlBtn(
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="11" y="11" width="8" height="8" rx="1"/></svg>`,
            "Switch to Miniplayer",
            () => this.engine._enterMiniplayer()
        );

        const btnExpand = createCtrlBtn(
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
            "Expand to Full Player",
            () => this.engine._exitMusicMode()
        );
        
        controls.appendChild(btnPrev);
        controls.appendChild(btnPlayPause);
        controls.appendChild(btnNext);
        controls.appendChild(separator);
        controls.appendChild(btnMiniplayer);
        controls.appendChild(btnExpand);

        body.appendChild(title);
        body.appendChild(controls);
        
        this.dockRoot.appendChild(thumbWrap);
        this.dockRoot.appendChild(body);
        
        // Provide references for updating
        this.dockElements = { thumb, title, btnPlayPause };
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
