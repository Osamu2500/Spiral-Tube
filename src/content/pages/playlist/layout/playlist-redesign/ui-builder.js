function _esc(str) {
    return (str || '')
        .replace(/&/g,  '&amp;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#39;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;');
}

export function renderHTML(data, currentCols) {
    const { coverUrl } = data;
    
    const bgHTML = coverUrl
        ? `<div class="ypp-pl-ambient-bg" style="background-image: url('${_esc(coverUrl)}')"></div>
           <div class="ypp-pl-ambient-overlay"></div>`
        : '';

    return `
    ${bgHTML}
    <div class="ypp-pl-layout">
      ${_renderSidebar(data)}
      ${_renderMain(data, currentCols)}
    </div>`;
}

function _renderSidebar(data) {
    const { title, owner, ownerHref, stats, coverUrl, videos, totalSecs } = data;
    
    const coverHTML = coverUrl
        ? `<img src="${_esc(coverUrl)}" alt="${_esc(title)}" class="ypp-pl-cover-img" loading="lazy">`
        : `<div class="ypp-pl-cover-placeholder">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
               <path d="M9 18V5l12-2v13"/>
               <circle cx="6" cy="18" r="3"/>
               <circle cx="18" cy="16" r="3"/>
             </svg>
           </div>`;

    const ownerHTML = owner
        ? `<a class="ypp-pl-owner" href="${_esc(ownerHref)}">${_esc(owner)}</a>`
        : '';

    const durCard = _renderDurationCard(totalSecs, videos.length);
    
    return `
      <!-- ── Sidebar ── -->
      <aside class="ypp-pl-sidebar">
        <div class="ypp-pl-cover-wrap">
          ${coverHTML}
          <div class="ypp-pl-cover-shimmer"></div>
        </div>

        <div class="ypp-pl-meta">
          <h1 class="ypp-pl-title">${_esc(title)}</h1>
          ${ownerHTML}
          <p class="ypp-pl-stats">${_esc(stats)}</p>
        </div>

        <div class="ypp-pl-actions-main">
          <button class="ypp-pl-btn-play" id="ypp-pl-play">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>
            Play all
          </button>
          <button class="ypp-pl-btn-shuffle" id="ypp-pl-shuffle">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M18.15,13.65L21.5,17l-3.35,3.35l-0.7-0.71L19.58,17.5H16.4l-2.07-2.07l0.7-0.71l1.71,1.72h2.84l-2.14-2.14L18.15,13.65z M8.34,9.17L6.62,7.45H3.5v1h2.7l1.42,1.43L8.34,9.17z M19.58,6.5H16.4l-9.78,9.77H3.5v1h3.54l9.78-9.77h2.76l-2.14,2.14l0.71,0.71L21.5,7l-3.35-3.35l-0.71,0.71L19.58,6.5z"/>
            </svg>
            Shuffle
          </button>
        </div>

        <div class="ypp-pl-tools-grid">
          <button class="ypp-pl-btn-tool" id="ypp-pl-save" title="Save playlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span>Save</span>
          </button>
          <button class="ypp-pl-btn-tool" id="ypp-pl-share" title="Share">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span>Share</span>
          </button>
          <button class="ypp-pl-btn-tool ypp-pl-btn-danger" id="ypp-pl-remove-watched" title="Remove Watched Videos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M9 6V4h6v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            <span>Clean</span>
          </button>
          <div id="ypp-pl-native-sort-container" class="ypp-pl-native-inject" style="grid-column: span 1;"></div>
          <button class="ypp-pl-btn-tool" id="ypp-pl-menu" title="More Actions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            <span>More</span>
          </button>
        </div>

        ${durCard}
      </aside>`;
}

function _renderMain(data, currentCols) {
    const { videos } = data;
    const videoCards = videos.map((v, i) => _renderVideoCard(v, i)).join('');
    // Ensure currentCols is treated as a number for strict equality
    const cols = parseInt(currentCols, 10);

    return `
      <!-- ── Video Grid ── -->
      <main class="ypp-pl-main">
        <!-- toolbar: count + column switcher + filter -->
        <div class="ypp-pl-toolbar">
          <span class="ypp-pl-count-label" id="ypp-pl-count">
            ${videos.length} VIDEO${videos.length !== 1 ? 'S' : ''}
          </span>
          
          <div id="ypp-pl-native-chips-container" class="ypp-pl-native-inject"></div>

          <div class="ypp-pl-col-switcher">
            <button class="ypp-col-btn ${cols === 1 ? 'active' : ''}" data-cols="1" title="List view">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <button class="ypp-col-btn ${cols === 3 ? 'active' : ''}" data-cols="3" title="3 Column grid">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="5" height="7"/>
                <rect x="9.5" y="3" width="5" height="7"/>
                <rect x="17" y="3" width="5" height="7"/>
                <rect x="2" y="14" width="5" height="7"/>
                <rect x="9.5" y="14" width="5" height="7"/>
                <rect x="17" y="14" width="5" height="7"/>
              </svg>
            </button>
            <button class="ypp-col-btn ${cols === 4 ? 'active' : ''}" data-cols="4" title="4 Column grid">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="3.5" height="7"/>
                <rect x="7.5" y="3" width="3.5" height="7"/>
                <rect x="13" y="3" width="3.5" height="7"/>
                <rect x="18.5" y="3" width="3.5" height="7"/>
                <rect x="2" y="14" width="3.5" height="7"/>
                <rect x="7.5" y="14" width="3.5" height="7"/>
                <rect x="13" y="14" width="3.5" height="7"/>
                <rect x="18.5" y="14" width="3.5" height="7"/>
              </svg>
            </button>
            <button class="ypp-col-btn ${cols === 5 ? 'active' : ''}" data-cols="5" title="5 Column grid">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="3" height="7"/>
                <rect x="5.5" y="3" width="3" height="7"/>
                <rect x="10" y="3" width="3" height="7"/>
                <rect x="14.5" y="3" width="3" height="7"/>
                <rect x="19" y="3" width="3" height="7"/>
                <rect x="1" y="14" width="3" height="7"/>
                <rect x="5.5" y="14" width="3" height="7"/>
                <rect x="10" y="14" width="3" height="7"/>
                <rect x="14.5" y="14" width="3" height="7"/>
                <rect x="19" y="14" width="3" height="7"/>
              </svg>
            </button>
          </div>

          <div class="ypp-pl-filter-wrap">
            <input class="ypp-pl-filter" placeholder="Filter videos…" id="ypp-pl-filter" autocomplete="off">
          </div>
        </div>

        <div class="ypp-pl-grid ypp-pl-cols-${cols}" id="ypp-pl-grid">
          ${videoCards}
        </div>
      </main>`;
}

// ── Duration card (sidebar) ────────────────────────────────────────────
function _renderDurationCard(totalSecs, videoCount) {
    if (!totalSecs) return '';
    const fmt = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return h > 0
            ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
            : `${m}:${String(sec).padStart(2,'0')}`;
    };
    const speeds = [
        { label: '1.25×', s: Math.floor(totalSecs / 1.25) },
        { label: '1.5×',  s: Math.floor(totalSecs / 1.5)  },
        { label: '1.75×', s: Math.floor(totalSecs / 1.75) },
        { label: '2×',    s: Math.floor(totalSecs / 2)    },
    ];
    return `
    <div class="ypp-pl-duration-card">
      <div class="ypp-pl-duration-label">TOTAL DURATION</div>
      <div class="ypp-pl-duration-time">${fmt(totalSecs)}</div>
      <div class="ypp-pl-duration-grid">
        ${speeds.map(sp => `
          <div class="ypp-pl-duration-row">
            <span class="ypp-pl-duration-speed">${sp.label}</span>
            <span class="ypp-pl-duration-val">${fmt(sp.s)}</span>
          </div>`).join('')}
        <div class="ypp-pl-duration-row">
          <span class="ypp-pl-duration-speed">Videos</span>
          <span class="ypp-pl-duration-val">${videoCount}</span>
        </div>
      </div>
    </div>`;
}

// ── Grid card ─────────────────────────────────────────────────────────
function _renderVideoCard(v, i) {
    const thumbHTML = v.thumb
        ? `<img src="${_esc(v.thumb)}" alt="" loading="lazy">`
        : `<div class="ypp-pl-card-thumb-placeholder">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
               <polygon points="23 7 16 12 23 17 23 7"/>
               <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
             </svg>
           </div>`;

    const durBadge = v.duration
        ? `<div class="ypp-pl-card-duration">${_esc(v.duration)}</div>`
        : '';

    const progressBar = v.progress > 0
        ? `<div class="ypp-pl-card-progress"><div style="width:${v.progress}%"></div></div>`
        : '';

    return `
    <a class="ypp-pl-card" href="${_esc(v.href)}"
       data-title="${_esc(v.title.toLowerCase())}" data-index="${i}" data-progress="${v.progress}">
      <div class="ypp-pl-card-reorder" title="Reorder (Coming soon)">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21,10H3V8h18V10z M21,14H3v2h18V14z"/></svg>
      </div>
      <div class="ypp-pl-card-thumb">
        <div class="ypp-pl-card-index">${_esc(v.index)}</div>
        ${thumbHTML}
        ${durBadge}
        ${progressBar}
      </div>
      <div class="ypp-pl-card-info">
        <div class="ypp-pl-card-title-row">
            <span class="ypp-pl-card-title" title="${_esc(v.title)}">${_esc(v.title)}</span>
            <button class="ypp-pl-card-menu" title="More options" data-href="${_esc(v.href)}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="19" r="1.5"/>
                </svg>
            </button>
        </div>
        <span class="ypp-pl-card-chan">${_esc(v.channel)}</span>
      </div>
    </a>`;
}
