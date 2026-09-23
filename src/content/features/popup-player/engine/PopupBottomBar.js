export const PopupBottomBar = {
    create(engine, videoId) {
        const container = document.createElement('div');
        container.className = 'ytpop-bottom-bar';
        container.style.cssText = [
            'display:flex',
            'flex-direction:column',
            'gap:8px',
            'padding:12px 14px 14px',
            'flex-shrink:0',
            'background:transparent', // Glassmorphic base
            'color:#fff',
            'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif',
        ].join(';');

        // ── Title & Channel ──
        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;width:100%;';
        
        const titleEl = document.createElement('div');
        titleEl.className = 'ytpop-video-title';
        titleEl.style.cssText = 'font-size:14px;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:rgba(255,255,255,0.95);';

        const channelEl = document.createElement('div');
        channelEl.className = 'ytpop-video-channel';
        channelEl.style.cssText = 'font-size:12px;font-weight:500;color:rgba(255,255,255,0.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;';

        headerRow.appendChild(titleEl);
        headerRow.appendChild(channelEl);

        // ── Pills Row ──
        const pillsRow = document.createElement('div');
        pillsRow.style.cssText = 'display:flex;gap:8px;align-items:center;justify-content:center;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;';
        
        // Helper to create pill
        const createPill = (className, htmlContent) => {
            const btn = document.createElement('button');
            btn.className = `ytpop-meta-pill ${className}`;
            btn.style.cssText = [
                'display:flex',
                'align-items:center',
                'gap:6px',
                'padding:6px 12px',
                'background:rgba(255,255,255,0.06)',
                'border:1px solid rgba(255,255,255,0.1)',
                'border-radius:20px',
                'color:rgba(255,255,255,0.85)',
                'font-size:12px',
                'font-weight:500',
                'cursor:default',
                'flex-shrink:0',
                'transition:background 0.15s ease'
            ].join(';');
            btn.innerHTML = htmlContent;
            return btn;
        };

        const makeClickable = (btn, onClick) => {
            btn.style.cursor = 'pointer';
            btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,0.12)');
            btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(255,255,255,0.06)');
            btn.addEventListener('click', onClick);
        };

        const viewsPill = createPill('ytpop-stat-views', `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> <span>...</span>`);
        const datePill = createPill('ytpop-stat-date', `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> <span>...</span>`);
        const likesPill = createPill('ytpop-stat-likes', `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> <span>...</span>`);
        
        const descPill = createPill('ytpop-btn-desc', `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> <span>Description</span>`);
        const commentsPill = createPill('ytpop-btn-comments', `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> <span>Comments</span>`);

        let _descExpanded = false;
        const descBox = document.createElement('div');
        descBox.style.cssText = 'display:none;font-size:11px;color:rgba(255,255,255,0.7);line-height:1.6;margin-top:4px;padding:12px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.05);max-height:120px;overflow-y:auto;white-space:pre-wrap;scrollbar-width:thin;';

        makeClickable(descPill, () => {
            _descExpanded = !_descExpanded;
            descBox.style.display = _descExpanded ? 'block' : 'none';
            descPill.style.background = _descExpanded ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)';
        });

        makeClickable(commentsPill, () => {
            engine.destroy();
            window.location.href = `/watch?v=${videoId}`;
        });

        pillsRow.appendChild(viewsPill);
        pillsRow.appendChild(datePill);
        pillsRow.appendChild(likesPill);
        pillsRow.appendChild(descPill);
        pillsRow.appendChild(commentsPill);

        container.appendChild(headerRow);
        container.appendChild(pillsRow);
        container.appendChild(descBox);

        // Export these elements to the engine so PopupMetadata can populate them
        engine.bottomBar = container;
        engine._bottomEls = {
            titleEl, channelEl, viewsPill, datePill, likesPill, descBox, descPill
        };

        return container;
    }
};
