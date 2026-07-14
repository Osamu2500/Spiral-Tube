// ─── Selectors (single source of truth — no magic strings) ────────────────────
const SELECTORS = {
  CARD_ROOTS: [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-playlist-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-reel-item-renderer',
    'ytd-playlist-panel-video-renderer',
    'yt-lockup-view-model',
    'ytd-lockup-view-model',
  ],
  // Used for the parent-nesting filter (prevents double-checkboxes)
  CARD_PARENTS:
    'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, yt-lockup-view-model',
  THUMBNAIL_CONTAINER: 'ytd-thumbnail, #thumbnail, yt-image',
  VIDEO_TITLE: '#video-title, h3 a, .title, .yt-core-attributed-string',
  MENU_BTN:
    'ytd-menu-renderer button, button[aria-label*="More actions"], button[aria-label*="Action menu"]',
  MENU_ITEMS: '[role="menuitem"], yt-list-item-view-model-wiz, yt-list-item-view-model',
  MENU_LABEL: '.yt-list-item-view-model-wiz__label',
  POPUP: 'tp-yt-iron-dropdown, yt-sheet-view-model, ytd-popup-container',
  YT_APP: 'ytd-app',
};

const CSS = {
  FEATURE_ENABLED: 'ypp-ms-feature-enabled',
  SELECTION_ACTIVE: 'ypp-ms-active',
  CARD_OVERLAY: 'ypp-ms-card-overlay',
  CHECKBOX: 'ypp-ms-checkbox',
  CHECKBOX_CHECKED: 'ypp-ms-checked',
  CARD_SELECTED: 'ypp-ms-selected',
  ACTION_BAR: 'ypp-ms-bar',
};

const DATA = {
  STAMP: 'yppMultiSelect',
};

const ICONS = {
  OPEN: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  PLAYLIST: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>`,
  WATCH_LATER: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  NOT_INTERESTED: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  WATCHED: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
};

// ─── Feature Class ─────────────────────────────────────────────────────────────
export class MultiSelect extends window.YPP.features.BaseFeature {
  static featureId = 'multiSelect';
  static executionPhase = 'idle';
  static priority = 10;

  constructor() {
    super('MultiSelect');
    /** @type {Map<string, {title: string, href: string, element: HTMLElement}>} */
    this._selected = new Map();
    this._isActing = false; // true while an async menu action is in progress
    this._selectionModeActive = false; // Is the mode currently on? (e.g. via keyboard shortcut)
    this._actionBar = null;

    // Bound handlers (created once, stable reference for add/remove)
    this._onPageChangeBound = null;
    this._scheduleScan = null;
    this._pollInterval = null;
    // Tracks all active per-card hydration timers so disable() can cancel them all
    this._hydrationTimers = new Set();
  }

  getConfigKey() {
    return 'multiSelect';
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  async enable() {
    await super.enable();
    document.body.classList.add(CSS.FEATURE_ENABLED);

    // ── Page navigation: reset mode on SPA route change ──
    const rawBound = () => this.onPageChange();
    this._onPageChangeBound = window.YPP.Utils?.debounce
      ? window.YPP.Utils.debounce(rawBound, 200)
      : rawBound;
    window.YPP.events?.on('app:pageChange', this._onPageChangeBound);

    // ── yt-page-data-updated: fires on every infinite-scroll chunk load ──
    // Debounced full scan — same pattern as HideWatched._scheduleProcess()
    this._scheduleScan = window.YPP.Utils?.debounce
      ? window.YPP.Utils.debounce(() => this._attachCheckboxes(), 150)
      : () => this._attachCheckboxes();
    this.addListener(document, 'yt-page-data-updated', () => this._scheduleScan());

    // ── yt-navigate-finish: SPA navigation completed ──
    // NOTE: onPageChange (triggered by app:pageChange) already does removeAllCheckboxes +
    // attachCheckboxes on nav. This listener just ensures a fresh scan if app:pageChange
    // hasn't fired yet (race condition on very fast navigations).
    this.addListener(document, 'yt-navigate-finish', () => {
      this._attachCheckboxes();
    });

    // ── sharedObserver: fires synchronously (via rAF) when new cards enter DOM ──
    // Mirror HideWatched exactly: no timeout, process each node directly.
    window.YPP.sharedObserver?.register(
      'multi-select',
      SELECTORS.CARD_ROOTS.join(', '),
      (nodes) => {
        if (!this.isEnabled) return;
        nodes.forEach(card => this._processCard(card));
      }
    );

    window.YPP.hotkeysManager?.register('multi-select', [
      { combo: 'Ctrl+Q', callback: () => this._toggleSelectionMode() },
    ]);

    // Initial scan for cards already on screen
    this._attachCheckboxes();

    // Polling fallback at 1.5s — catches anything the events missed
    this._pollInterval = setInterval(() => this._attachCheckboxes(), 1500);
  }

  async disable() {
    await super.disable(); // cleanupEvents() — removes all addListener registrations

    // Tear down DOM injections so re-enable starts clean
    this._removeAllCheckboxes();

    // Reset mode silently (no toast/clearAll side-effects during disable)
    this._selectionModeActive = false;
    document.body.classList.remove(CSS.SELECTION_ACTIVE);
    this._selected.clear();

    this._destroyActionBar();

    document.body.classList.remove(CSS.FEATURE_ENABLED);

    window.YPP.events?.off('app:pageChange', this._onPageChangeBound);
    clearInterval(this._pollInterval);
    this._pollInterval = null;
    this._onPageChangeBound = null;
    this._scheduleScan = null;
    // Cancel all pending per-card hydration polls
    this._hydrationTimers.forEach(t => clearInterval(t));
    this._hydrationTimers.clear();
    window.YPP.hotkeysManager?.unregister('multi-select');
    window.YPP.sharedObserver?.unregister('multi-select');
  }

  /** Called on SPA page navigation (also used by sharedObserver callback) */
  onPageChange() {
    // Reset selection mode entirely on navigation — stale DOM refs are invalid
    // and the user expects a clean slate on the new page.
    if (this._selectionModeActive) {
      this._selectionModeActive = false;
      document.body.classList.remove(CSS.SELECTION_ACTIVE);
    }
    if (this._selected.size > 0) {
      this._selected.clear();
      this._updateActionBar();
    }
    
    // Clear all injected checkboxes and DOM stamps before re-attaching, 
    // because YouTube recycles video elements and changing src breaks our videoId cache
    this._removeAllCheckboxes();
    
    // Attach checkboxes to newly rendered cards
    this._attachCheckboxes();
  }

  // ─── Selection Mode ──────────────────────────────────────────────────────────

  /**
   * Ctrl+Q handler: toggles persistent selection mode ON/OFF.
   * ON : all checkboxes stay visible; clicking any card selects it.
   * OFF: clears selections and returns to hover-only display.
   */
  _toggleSelectionMode() {
    if (this._selectionModeActive) {
      this._exitSelectionMode();
    } else {
      this._enterSelectionMode();
    }
  }

  _enterSelectionMode() {
    this._selectionModeActive = true;
    document.body.classList.add(CSS.SELECTION_ACTIVE);
    this._attachCheckboxes(); // ensure new cards have checkboxes
    this._showToast('Multi-select ON — click cards to select');
  }

  _exitSelectionMode() {
    this._selectionModeActive = false;
    document.body.classList.remove(CSS.SELECTION_ACTIVE);
    this._clearAll();
    this._showToast('Multi-select OFF');
  }

  // ─── Card Processing ─────────────────────────────────────────────────────────

  /**
   * Returns valid top-level video card elements.
   * When `nodes` is provided (from observer), use them directly — they are already
   * the newly added top-level cards. The parent-nesting filter only applies during
   * full-document scans to avoid double-injecting nested cards.
   * @param {Element[]|null} nodes
   */
  _getVideoCards() {
    const selector = SELECTORS.CARD_ROOTS.join(', ');
    return Array.from(document.querySelectorAll(selector)).filter((el) => {
      // Exclude cards nested inside another card (prevents double checkboxes on e.g. playlists)
      return !el.parentElement?.closest(SELECTORS.CARD_PARENTS);
    });
  }

  /** @param {HTMLElement} card */
  _getVideoData(card) {
    // Strategy 1: data-attributes (fastest, works on hydrated Polymer elements)
    let videoId = card.dataset.videoId || card.dataset.ytVideoId || card.getAttribute('video-id');

    // Strategy 2: ytd-thumbnail has a video-id attribute set by YouTube
    if (!videoId) {
      const thumb = card.querySelector('ytd-thumbnail[video-id]');
      if (thumb) videoId = thumb.getAttribute('video-id');
    }
    // Strategy 3: modern lockup-view-model cards
    if (!videoId) {
      const lockup = card.tagName.toLowerCase().includes('lockup-view-model')
        ? card
        : card.querySelector('yt-lockup-view-model, ytd-lockup-view-model');
      if (lockup && lockup.getAttribute('video-id')) videoId = lockup.getAttribute('video-id');
    }

    // Strategy 4: Parse the thumbnail anchor href
    const anchor = card.querySelector(
      'a#thumbnail, a[href^="/watch"], a[href^="/shorts"], a.ytd-thumbnail, a[href*="/watch?v="], a[href*="/shorts/"]'
    );
    const href = anchor?.getAttribute('href') || '';
    if (!videoId && href) {
      const match = href.match(/[?&]v=([^&]+)|\/shorts\/([^/?]+)/);
      videoId = match?.[1] || match?.[2];
    }

    const title = card.querySelector(SELECTORS.VIDEO_TITLE)?.textContent?.trim() || '';
    return { videoId, href, title };
  }

  /**
   * When a card is added to the DOM but Polymer hasn't hydrated its href yet,
   * poll every 100ms until the videoId appears (max 3s), then inject.
   * Using setInterval instead of MutationObserver count avoids false exits
   * when Polymer fires many mutations before the href is set.
   * @param {HTMLElement} card
   */
  _watchCardForHydration(card) {
    if (card.dataset.yppMsWatching) return; // Already watching this card
    card.dataset.yppMsWatching = '1';

    let elapsed = 0;
    const maxWait = 3000;
    const interval = 100;

    const timer = setInterval(() => {
      elapsed += interval;
      if (!this.isEnabled || !card.isConnected || elapsed > maxWait) {
        clearInterval(timer);
        this._hydrationTimers.delete(timer);
        delete card.dataset.yppMsWatching;
        return;
      }
      const { videoId, href, title } = this._getVideoData(card);
      if (videoId) {
        clearInterval(timer);
        this._hydrationTimers.delete(timer);
        delete card.dataset.yppMsWatching;
        delete card.dataset[DATA.STAMP];
        try {
          card.dataset[DATA.STAMP] = '1';
          this._injectCheckboxAndOverlay(card, videoId, href, title);
        } catch (e) {
          console.error('[MultiSelect] Error injecting on hydration:', e);
        }
      }
    }, interval);
    this._hydrationTimers.add(timer);
  }

  /**
   * Core single-card processing logic — shared by both _processCard (observer path)
   * and _attachCheckboxes (full-scan path). Handles recycled elements, unhydrated
   * cards, and idempotent re-injection.
   * @param {HTMLElement} card
   */
  _processOneCard(card) {
    if (!card || !card.isConnected) return;

    if (card.dataset[DATA.STAMP]) {
      const existingCb = card.querySelector(`.${CSS.CHECKBOX}`);
      const existingOverlay = card.querySelector(`.${CSS.CARD_OVERLAY}`);
      const { videoId: currentId } = this._getVideoData(card);
      if (!currentId) { this._watchCardForHydration(card); return; }
      // Both injected elements present and still matching — nothing to do
      if (existingCb && existingOverlay && existingCb.dataset.videoId === currentId) return;
      // Recycled or partially wiped by Polymer — strip and re-inject
      card.querySelectorAll(`.${CSS.CHECKBOX}, .${CSS.CARD_OVERLAY}`).forEach(e => e.remove());
      card.classList.remove(CSS.CARD_SELECTED);
      delete card.dataset[DATA.STAMP];
    }

    const { videoId, href, title } = this._getVideoData(card);
    if (!videoId) { this._watchCardForHydration(card); return; }

    card.dataset[DATA.STAMP] = '1';
    this._injectCheckboxAndOverlay(card, videoId, href, title);
  }

  /**
   * Process a single card — called directly by sharedObserver for each new card.
   * @param {HTMLElement} card
   */
  _processCard(card) {
    if (!card || !card.isConnected) return;
    // Nested card check (e.g. ytd-compact-video inside a playlist)
    if (card.parentElement?.closest(SELECTORS.CARD_PARENTS)) return;
    try {
      this._processOneCard(card);
    } catch (err) {
      console.error('[MultiSelect] _processCard error:', err);
    }
  }

  _attachCheckboxes() {
    this._getVideoCards().forEach((el) => {
      try {
        this._processOneCard(/** @type {HTMLElement} */ (el));
      } catch (err) {
        console.error('[MultiSelect] Error attaching to card:', err);
      }
    });
  }

  /**
   * Injects the checkbox + invisible overlay into a card and wires up click handlers.
   * @param {HTMLElement} card
   * @param {string} videoId
   * @param {string} href
   * @param {string} title
   */
  _injectCheckboxAndOverlay(card, videoId, href, title) {
    const cb = this._createCheckboxElement(videoId);
    const overlay = this._createOverlayElement();

    // Overlay sits at card level (z-index: 90)
    card.appendChild(overlay);

    // Checkbox sits inside thumbnail (z-index: 100, above overlay)
    const thumb = card.querySelector(SELECTORS.THUMBNAIL_CONTAINER);
    if (thumb) {
      thumb.style.position = 'relative'; // create stacking context above overlay
      thumb.appendChild(cb);
    } else {
      card.appendChild(cb);
    }

    this._bindCardClickHandlers(card, cb, overlay, videoId, href, title);
  }

  /** @returns {HTMLElement} */
  _createCheckboxElement(videoId) {
    const cb = document.createElement('div');
    cb.className = CSS.CHECKBOX;
    cb.dataset.videoId = videoId;
    cb.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14"
          fill="none" stroke="currentColor" stroke-width="3"
          class="ypp-ms-check-icon">
        <polyline points="20 6 9 17 4 12"/>
      </svg>`;
    return cb;
  }

  /** @returns {HTMLElement} */
  _createOverlayElement() {
    const overlay = document.createElement('div');
    overlay.className = CSS.CARD_OVERLAY;
    return overlay;
  }

  /**
   * Wires up all click listeners for a card.
   * Rule: each source (checkbox, overlay, card body) fires _toggleSelect exactly once.
   */
  _bindCardClickHandlers(card, checkbox, overlay, videoId, href, title) {
    const onSelect = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this._toggleSelect(card, videoId, href, title);
    };

    // PRIMARY: Listen on the thumbnail container (parent of checkbox) in capture phase.
    // This catches clicks even when the checkbox has visual opacity:0 / transform issues.
    // We detect checkbox hits by checking if click is within the checkbox bounds.
    const thumb = checkbox.parentElement;
    if (thumb) {
      this.addListener(thumb, 'click', (e) => {
        // Only intercept clicks that directly hit the checkbox element
        if (e.target === checkbox || checkbox.contains(e.target)) {
          onSelect(e);
        }
      }, { capture: true });
    }

    // FALLBACK: Also listen directly on checkbox
    this.addListener(checkbox, 'click', onSelect, { capture: true });

    // Overlay: only active when mode is ON (CSS display:none otherwise)
    this.addListener(overlay, 'click', onSelect, { capture: true });

    // Card capture-phase: blocks YouTube navigation when mode is active.
    // Only handles clicks that miss both checkbox and overlay (e.g., title/meta area).
    this.addListener(
      card,
      'click',
      (e) => {
        // Back off entirely during async menu operations
        if (!this._selectionModeActive || this._isActing) return;

        // Let ⋮ menu button and its ancestors through so menus can open
        if (
          e.target.closest(
            'ytd-menu-renderer, [aria-label*="More actions"], [aria-label*="Action menu"]'
          )
        )
          return;

        const hitCheckbox = e.target.closest(`.${CSS.CHECKBOX}`);
        const hitOverlay = e.target.closest(`.${CSS.CARD_OVERLAY}`);
        if (!hitCheckbox && !hitOverlay) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this._toggleSelect(card, videoId, href, title);
        }
      },
      { capture: true }
    );
  }

  /**
   * Removes all injected checkboxes and overlays and clears all stamps.
   * Called during disable() so re-enable starts from a clean slate.
   */
  _removeAllCheckboxes() {
    // data-yppMultiSelect → data-ypp-multi-select in the DOM attribute name
    const attrSelector = `[data-ypp-multi-select]`;
    document.querySelectorAll(attrSelector).forEach((card) => {
      card.querySelectorAll(`.${CSS.CHECKBOX}, .${CSS.CARD_OVERLAY}`).forEach((el) => el.remove());
      card.classList.remove(CSS.CARD_SELECTED);
      // dataset key is camelCase; remove both variants to be safe
      delete card.dataset.yppMultiSelect;
    });
  }

  // ─── Selection State ─────────────────────────────────────────────────────────

  /**
   * @param {HTMLElement} card
   * @param {string} videoId
   * @param {string} href
   * @param {string} title
   */
  _toggleSelect(card, videoId, href, title) {
    if (this._selected.has(videoId)) {
      this._deselect(card, videoId);
    } else {
      this._select(card, videoId, href, title);
    }
    this._updateActionBar();
  }

  _select(card, videoId, href, title) {
    // Store videoId in the value so actions can use it directly without re-parsing href
    this._selected.set(videoId, { videoId, title, href, element: card });
    card.classList.add(CSS.CARD_SELECTED);
    card.querySelector(`.${CSS.CHECKBOX}`)?.classList.add(CSS.CHECKBOX_CHECKED);
    // Activate selection mode body class whenever something is selected
    document.body.classList.add(CSS.SELECTION_ACTIVE);
  }

  _deselect(card, videoId) {
    this._selected.delete(videoId);
    card.classList.remove(CSS.CARD_SELECTED);
    card.querySelector(`.${CSS.CHECKBOX}`)?.classList.remove(CSS.CHECKBOX_CHECKED);
    // Remove selection mode if nothing left selected and not in persistent mode
    if (this._selected.size === 0 && !this._selectionModeActive) {
      document.body.classList.remove(CSS.SELECTION_ACTIVE);
    }
  }

  _clearAll() {
    this._selected.forEach(({ element }) => {
      const card = /** @type {HTMLElement} */ (element);
      card.classList.remove(CSS.CARD_SELECTED);
      card.querySelector(`.${CSS.CHECKBOX}`)?.classList.remove(CSS.CHECKBOX_CHECKED);
    });
    this._selected.clear();
    // Keep ypp-ms-active if still in persistent selection mode
    if (!this._selectionModeActive) {
      document.body.classList.remove(CSS.SELECTION_ACTIVE);
    }
    this._updateActionBar();
  }

  // ─── Action Bar ───────────────────────────────────────────────────────────────

  _updateActionBar() {
    const count = this._selected.size;

    if (count === 0) {
      this._destroyActionBar();
      return;
    }

    if (!this._actionBar) {
      this._createActionBar();
    }

    this._refreshActionBarCounts(count);
  }

  _destroyActionBar() {
    this._actionBar?.remove();
    this._actionBar = null;
  }

  _createActionBar() {
    this._actionBar = document.createElement('div');
    this._actionBar.className = CSS.ACTION_BAR;
    this._actionBar.innerHTML = this._buildActionBarHTML();
    document.body.appendChild(this._actionBar);
    this._wireActionBarButtons();
  }

  _buildActionBarHTML() {
    return `
      <div class="ypp-ms-bar-info">
        <span class="ypp-ms-count" id="ypp-ms-count-val">0</span>
        <span class="ypp-ms-label" id="ypp-ms-count-label">videos selected</span>
      </div>
      <div class="ypp-ms-bar-actions">
        <button class="ypp-ms-btn" data-variant="info"    id="ypp-ms-queue">
          <span class="ypp-ms-dot"></span>Queue
        </button>
        <button class="ypp-ms-btn" data-variant="purple"  id="ypp-ms-playlist">
          <span class="ypp-ms-dot"></span>Playlist
        </button>
        <button class="ypp-ms-btn" data-variant="warning" id="ypp-ms-wl">
          <span class="ypp-ms-dot"></span>Watch Later
        </button>
        <button class="ypp-ms-btn" data-variant="error"   id="ypp-ms-not-interested">
          <span class="ypp-ms-dot"></span>Not Interested
        </button>
        <button class="ypp-ms-btn" data-variant="success" id="ypp-ms-watched">
          <span class="ypp-ms-dot"></span>Mark Watched
        </button>
        <button class="ypp-ms-btn ypp-ms-btn-clear" data-variant="ghost" id="ypp-ms-clear">
          <span class="ypp-ms-dot"></span>Clear All
        </button>
      </div>`;
  }


  _wireActionBarButtons() {
    // Use direct addEventListener (not addListener) since the bar owns these elements —
    // they are removed when the bar is removed, so no memory leak risk.
    const bar = this._actionBar;
    bar.querySelector('#ypp-ms-queue')?.addEventListener('click', () => this._addToQueue());
    bar.querySelector('#ypp-ms-wl')?.addEventListener('click', () => this._addToWatchLater());
    bar
      .querySelector('#ypp-ms-playlist')
      ?.addEventListener('click', () => this._showPlaylistPicker());
    bar
      .querySelector('#ypp-ms-not-interested')
      ?.addEventListener('click', () => this._markNotInterested());
    bar
      .querySelector('#ypp-ms-watched')
      ?.addEventListener('click', () => this._markSelectedWatched());
    bar.querySelector('#ypp-ms-clear')?.addEventListener('click', () => this._clearAll());
  }

  _refreshActionBarCounts(count) {
    const countEl = this._actionBar.querySelector('#ypp-ms-count-val');
    const labelEl = this._actionBar.querySelector('#ypp-ms-count-label');
    if (countEl) countEl.textContent = String(count);
    if (labelEl) labelEl.textContent = `video${count !== 1 ? 's' : ''} selected`;
  }


  // ─── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Generic action runner: iterates videos, fires actionFn for each, shows live
   * progress toasts, and calls _clearAll when done.
   *
   * @param {string}   label     - Human label, e.g. 'queue'
   * @param {Function} actionFn  - async (video, index, total) => boolean (success?)
   */
  async _withProgress(label, actionFn) {
    if (this._isActing) return; // prevent re-entrance from rapid button clicks
    const videos = [...this._selected.values()];
    if (!videos.length) return;

    this._isActing = true;
    this._setBarBusy(true);

    let succeeded = 0;
    let failed = 0;

    try {
      for (let i = 0; i < videos.length; i++) {
        if (!this.isEnabled) break; // abort if feature was disabled mid-action

        // Live "X / Y" progress in the bar count display
        this._setBarStatus(`${i + 1} / ${videos.length}`);

        const ok = await actionFn(videos[i], i, videos.length);
        if (ok) succeeded++;
        else failed++;
      }
    } finally {
      this._isActing = false;
      this._setBarBusy(false);
    }

    if (failed === 0) {
      this._showToast(`✓ ${succeeded} video${succeeded !== 1 ? 's' : ''} added to ${label}`);
    } else {
      this._showToast(
        `✓ ${succeeded} added to ${label}${failed > 0 ? ` · ⚠ ${failed} failed` : ''}`
      );
    }
    if (succeeded > 0) {
      this._clearAll();
    }
  }

  /**
   * Puts the action bar into a "busy" visual state (buttons dimmed + spinner on count).
   * @param {boolean} busy
   */
  _setBarBusy(busy) {
    if (!this._actionBar) return;
    const btns = this._actionBar.querySelectorAll('.ypp-ms-btn');
    btns.forEach((b) => {
      b.classList.toggle('ypp-ms-btn-busy', busy);
    });
  }

  /**
   * Temporarily override the count display with a status string (e.g. "3 / 10").
   * @param {string} text
   */
  _setBarStatus(text) {
    const countEl = this._actionBar?.querySelector('#ypp-ms-count-val');
    const labelEl = this._actionBar?.querySelector('#ypp-ms-count-label');
    if (countEl) countEl.textContent = text;
    if (labelEl) labelEl.textContent = '';
  }

  // ─── Add to Queue ─────────────────────────────────────────────────────────────

  async _invokeMenuActionWithRetry(video, labelMatch, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const ok = await this._invokeMenuAction(video.element, labelMatch);
      if (ok) return true;
      if (attempt < retries) await this._delay(200); // short pause before retry
    }
    // Visual indicator for videos that failed
    try { video.element.style.opacity = '0.4'; } catch (_) {}
    return false;
  }

  async _addToQueue() {
    await this._withProgress('queue', async (video) => {
      return this._invokeMenuActionWithRetry(video, ['add to queue', 'queue']);
    });
  }

  // ─── Watch Later ─────────────────────────────────────────────────────────────

  async _addToWatchLater() {
    await this._withProgress('Watch Later', async (video) => {
      return this._invokeMenuActionWithRetry(video, 'watch later');
    });
  }

  // ─── Save to Playlist ────────────────────────────────────────────────────────

  async _showPlaylistPicker() {
    if (this._isActing) return;
    const videos = [...this._selected.values()];
    if (!videos.length) return;

    this._isActing = true;
    this._setBarBusy(true);

    try {
      await this._runPlaylistFlow(videos);
    } finally {
      this._isActing = false;
      this._setBarBusy(false);
    }
  }

  /**
   * Core playlist flow:
   * 1. Open the native "Save to playlist" dialog for the FIRST video.
   * 2. Wait (up to 30s) for the user to pick playlist(s) and close the dialog.
   * 3. Remember which playlists were checked.
   * 4. Apply the same selection to all remaining videos programmatically.
   *
   * @param {Array} videos
   */
  async _runPlaylistFlow(videos) {
    const MATCH_RULES = [
      { text: 'save to playlist' },
      { text: 'save', exclude: 'watch later' },
    ];

    // ── Step 1: open dialog for first video ──────────────────────────────────
    const opened = await this._invokeMenuAction(videos[0].element, MATCH_RULES);
    if (!opened) {
      this._showToast('⚠ Could not open playlist picker — try clicking ⋮ manually');
      this._clearAll();
      return;
    }

    // ── Step 2: wait for the native playlist dialog to appear ─────────────────
    const dialog = await this._waitForPlaylistDialog(3000);
    if (!dialog) {
      this._showToast('⚠ Playlist dialog did not appear');
      this._clearAll();
      return;
    }

    if (videos.length === 1) {
      // Only one video — just let the user interact with the native dialog normally
      this._clearAll();
      return;
    }

    // ── Step 3: wait for user to pick & close (max 30s) ──────────────────────
    this._showToast('Pick your playlist(s), then close the dialog…');
    this._setBarStatus('waiting…');

    // Reminder at 15s so the user doesn't wonder what's happening
    const reminderTimer = setTimeout(() => {
      if (this._isActing) this._showToast('Still waiting for playlist dialog to close…');
    }, 15_000);

    const chosenPlaylists = await this._waitForPlaylistDialogClose(dialog, 30_000);
    clearTimeout(reminderTimer);

    if (!chosenPlaylists || chosenPlaylists.size === 0) {
      this._showToast('No playlists selected — cancelled');
      this._clearAll();
      return;
    }

    // ── Step 4: apply same playlist selection to remaining videos ─────────────
    let succeeded = 1; // first video counts as done
    let failed = 0;

    for (let i = 1; i < videos.length; i++) {
      if (!this.isEnabled) break;

      this._setBarStatus(`${i + 1} / ${videos.length}`);

      const ok = await this._applyPlaylistsToVideo(videos[i].element, MATCH_RULES, chosenPlaylists);
      if (ok) succeeded++;
      else {
        failed++;
        try { videos[i].element.style.opacity = '0.4'; } catch (_) {}
      }
    }

    const msg = failed === 0
      ? `✓ Saved ${succeeded} video${succeeded !== 1 ? 's' : ''} to playlist`
      : `✓ ${succeeded} saved · ⚠ ${failed} failed`;
    this._showToast(msg);
    if (succeeded > 0) {
      this._clearAll();
    }
  }

  /**
   * Poll for the ytd-add-to-playlist-renderer dialog to appear.
   * @param {number} timeout
   * @returns {Promise<Element|null>}
   */
  _waitForPlaylistDialog(timeout) {
    return new Promise((resolve) => {
      const SELECTOR = 'ytd-add-to-playlist-renderer';
      const existing = document.querySelector(SELECTOR);
      if (existing && this._isElementVisible(existing)) {
        return resolve(existing);
      }

      const start = Date.now();
      const tick = setInterval(() => {
        const el = document.querySelector(SELECTOR);
        if (el && this._isElementVisible(el)) {
          clearInterval(tick);
          resolve(el);
        } else if (Date.now() - start > timeout) {
          clearInterval(tick);
          resolve(null);
        }
      }, 60);
    });
  }

  /**
   * Wait for the playlist dialog to be closed by the user.
   * Observes aria-hidden and DOM removal. Returns the Set of chosen playlist names.
   * @param {Element} dialogContent - The ytd-add-to-playlist-renderer element
   * @param {number}  timeout       - Max wait in ms
   * @returns {Promise<Set<string>>}
   */
  _waitForPlaylistDialogClose(dialogContent, timeout) {
    return new Promise((resolve) => {
      /** @returns {Set<string>} currently checked playlist names */
      const getChecked = () => {
        const result = new Set();
        dialogContent
          .querySelectorAll('ytd-playlist-add-to-option-renderer')
          .forEach((opt) => {
            const cb = opt.querySelector('tp-yt-paper-checkbox');
            const checked =
              cb?.hasAttribute('checked') ||
              cb?.getAttribute('aria-checked') === 'true' ||
              cb?.checked;
            if (checked) {
              const label = opt.querySelector('#label')?.textContent?.trim();
              if (label) result.add(label);
            }
          });
        return result;
      };

      /** @returns {boolean} true if the dialog is no longer visible */
      const isClosed = () => {
        if (!document.body.contains(dialogContent)) return true;
        // Walk up to find the host dialog/iron-dropdown
        let el = dialogContent.parentElement;
        while (el && el !== document.body) {
          if (
            el.getAttribute('aria-hidden') === 'true' ||
            el.style.display === 'none' ||
            el.style.visibility === 'hidden'
          )
            return true;
          el = el.parentElement;
        }
        return false;
      };

      let lastChecked = getChecked();
      const done = (result) => {
        observer.disconnect();
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        resolve(result);
      };

      const observer = new MutationObserver(() => {
        lastChecked = getChecked(); // keep snapshot up to date
        if (isClosed()) done(lastChecked);
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'style'],
      });

      // Fallback interval for edge cases where MutationObserver might miss something
      const intervalId = setInterval(() => {
        lastChecked = getChecked();
        if (isClosed()) done(lastChecked);
      }, 250);

      const timeoutId = setTimeout(() => done(lastChecked), timeout);
    });
  }

  /**
   * Open the ⋮ menu for a video, open the playlist dialog, apply the
   * previously chosen playlists, then close the dialog.
   * @param {HTMLElement}  cardElement
   * @param {Array}        matchRules
   * @param {Set<string>}  targetPlaylists
   * @returns {Promise<boolean>}
   */
  async _applyPlaylistsToVideo(cardElement, matchRules, targetPlaylists) {
    const opened = await this._invokeMenuAction(cardElement, matchRules);
    if (!opened) return false;

    await this._delay(300); // let dialog animate in

    const dialog = document.querySelector('ytd-add-to-playlist-renderer');
    if (!dialog) return false;

    // Check / uncheck to match target state
    const options = Array.from(
      dialog.querySelectorAll('ytd-playlist-add-to-option-renderer')
    );
    for (const option of options) {
      const label = option.querySelector('#label')?.textContent?.trim();
      if (!label) continue;

      const cb = option.querySelector('tp-yt-paper-checkbox');
      const isChecked =
        cb?.hasAttribute('checked') ||
        cb?.getAttribute('aria-checked') === 'true' ||
        cb?.checked;

      const shouldBeChecked = targetPlaylists.has(label);

      if (shouldBeChecked && !isChecked) {
        this._simulateMouseClick(cb || option);
        await this._delay(80);
      } else if (!shouldBeChecked && isChecked) {
        // Uncheck if it was pre-checked (e.g. Watch Later auto-added)
        this._simulateMouseClick(cb || option);
        await this._delay(80);
      }
    }

    await this._delay(100);

    // Close dialog — try multiple strategies for cross-version compat
    this._closePlaylistDialog(dialog);
    await this._delay(300);
    return true;
  }

  /**
   * Robustly close a playlist dialog using multiple strategies.
   * @param {Element} dialogContent
   */
  _closePlaylistDialog(dialogContent) {
    // Strategy 1: dedicated close button (various known IDs/classes)
    const closeSelectors = [
      '#close-button button',
      '#close-button',
      'button[aria-label*="close" i]',
      'button[aria-label*="Cancel" i]',
      '.close-button',
    ];
    for (const sel of closeSelectors) {
      const btn = dialogContent.closest('tp-yt-paper-dialog, ytd-popup-container')?.querySelector(sel)
        || dialogContent.querySelector(sel);
      if (btn) {
        this._simulateMouseClick(btn);
        return;
      }
    }
    // Strategy 2: Escape key (most reliable cross-version)
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true, cancelable: true })
    );
  }

  // ─── Not Interested ──────────────────────────────────────────────────────────

  async _markNotInterested() {
    await this._withProgress('Not Interested', async (video) => {
      const ok = await this._invokeMenuAction(
        video.element,
        ['not interested', "don't recommend"],
        () => {
          try {
            video.element.style.opacity = '0.4';
            video.element.style.pointerEvents = 'none';
          } catch (_) {}
        }
      );
      await this._delay(300);
      return ok;
    });
  }

  // ─── Mark Watched ────────────────────────────────────────────────────────────

  async _markSelectedWatched() {
    if (this._isActing) return;
    const videos = [...this._selected.values()];
    if (!videos.length) return;

    this._isActing = true;
    this._setBarBusy(true);

    this._showToast(
      `Syncing ${videos.length} video${videos.length !== 1 ? 's' : ''} to Watch History…`
    );

    let count = 0;
    const BATCH_SIZE = 3;

    try {
      for (let i = 0; i < videos.length; i += BATCH_SIZE) {
        const batch = videos.slice(i, i + BATCH_SIZE);
        this._setBarStatus(`${Math.min(i + BATCH_SIZE, videos.length)} / ${videos.length}`);

        const syncPromises = batch.map(({ videoId, element }) => {
          if (!videoId) return Promise.resolve(false);

          window.YPP.WatchedStore?.add(videoId);
          try { element.style.opacity = '0.45'; } catch (_) {}
          count++;
          return this._syncWatchHistory(videoId);
        });

        await Promise.all(syncPromises);
      }
    } finally {
      this._isActing = false;
      this._setBarBusy(false);
    }

    this._showToast(`✓ ${count} video${count !== 1 ? 's' : ''} added to Watch History`);
    if (count > 0) {
      this._clearAll();
    }
  }

  async _syncWatchHistory(videoId) {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('allow', 'autoplay; encrypted-media');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1`;
      // Must be visible (non-zero size) for YouTube's IntersectionObserver to allow playback
      iframe.style.cssText =
        'position:fixed;bottom:0;right:0;width:300px;height:200px;opacity:0.01;pointer-events:none;z-index:-9999;';

      let duration = 0;
      let hasSeeked = false;
      let isResolved = false;

      const onMessage = (e) => {
        if (e.origin !== 'https://www.youtube.com' || e.source !== iframe.contentWindow) return;
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'infoDelivery' && data.info) {
            if (data.info.duration) duration = data.info.duration;
            if (data.info.playerState === 1 && duration > 0 && !hasSeeked) {
              hasSeeked = true;
              // Wait 1.5s of real playback before seeking — avoids bot detection
              setTimeout(() => {
                try {
                  iframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'seekTo', args: [Math.max(0, duration - 2), true] }),
                    '*'
                  );
                } catch (_) {}
              }, 1500);
            }
            if (data.info.playerState === 0) cleanup();
          } else if (data.event === 'initialDelivery' && data.info?.duration) {
            duration = data.info.duration;
          }
        } catch (_) {}
      };

      const cleanup = () => {
        if (isResolved) return;
        isResolved = true;
        window.removeEventListener('message', onMessage);
        iframe.parentNode?.removeChild(iframe);
        resolve(true);
      };

      window.addEventListener('message', onMessage);
      document.body.appendChild(iframe);
      setTimeout(cleanup, 10_000); // failsafe
    });
  }

  // ─── YouTube Menu Helpers ────────────────────────────────────────────────────

  /**
   * Opens the ⋮ menu on a card and clicks the first item whose text matches.
   * @param {HTMLElement} cardElement
   * @param {string | string[] | {text:string, exclude?:string}[]} labelMatch
   * @param {Function} [onSuccess] - callback fired immediately after clicking the item
   * @returns {Promise<boolean>}
   */
  async _invokeMenuAction(cardElement, labelMatch, onSuccess) {
    const menuBtn = cardElement.querySelector(SELECTORS.MENU_BTN);
    if (!menuBtn) return false;

    try {
      this._simulateMouseClick(menuBtn);

      const popup = await this._waitForNearestDropdown(menuBtn, 3000);
      if (!popup) return false;

      const item = this._findMenuItemByText(popup, labelMatch);
      if (!item) return false;

      const clickTarget = item.querySelector(SELECTORS.MENU_LABEL) || item;
      this._simulateMouseClick(clickTarget);
      onSuccess?.();
      await this._delay(250); // let popup dismiss before next action
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * @param {Element} popup
   * @param {string | string[] | {text: string, exclude?: string}[]} match
   * @returns {Element | null}
   */
  _findMenuItemByText(popup, match) {
    const terms = Array.isArray(match) ? match : [match];
    const items = Array.from(popup.querySelectorAll(SELECTORS.MENU_ITEMS));
    return (
      items.find((item) => {
        const txt = (item.innerText || item.textContent || '').trim().toLowerCase();
        return terms.some((term) => {
          if (typeof term === 'string') return txt.includes(term.toLowerCase());
          if (term.exclude && txt.includes(term.exclude.toLowerCase())) return false;
          return txt.includes(term.text.toLowerCase());
        });
      }) || null
    );
  }

  _simulateMouseClick(el) {
    if (!el) return;
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((name) => {
      el.dispatchEvent(new MouseEvent(name, { bubbles: true, cancelable: true, view: window }));
    });
  }

  _waitForNearestDropdown(menuBtn, timeout = 2500) {
    return new Promise((resolve) => {
      const start = Date.now();
      const handle = setInterval(() => {
        const popup = this._findNearestOpenPopup(menuBtn);
        if (popup) {
          clearInterval(handle);
          resolve(popup);
        } else if (Date.now() - start > timeout) {
          clearInterval(handle);
          resolve(null);
        }
      }, 60);
    });
  }

  _findNearestOpenPopup(anchorEl) {
    const { left: ax, top: ay, width: aw, height: ah } = anchorEl.getBoundingClientRect();
    const cx = ax + aw / 2;
    const cy = ay + ah / 2;

    const visiblePopups = Array.from(document.querySelectorAll(SELECTORS.POPUP)).filter((d) => {
      const r = d.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (!visiblePopups.length) return null;

    return visiblePopups.reduce((best, d) => {
      const r = d.getBoundingClientRect();
      const dist = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
      const br = best.getBoundingClientRect();
      const bestDist = Math.hypot(br.left + br.width / 2 - cx, br.top + br.height / 2 - cy);
      return dist < bestDist ? d : best;
    });
  }

  // ─── Utilities ────────────────────────────────────────────────────────────────

  /** @returns {boolean} true if el is rendered with non-zero dimensions */
  _isElementVisible(el) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  /** @param {string} message */
  _showToast(message) {
    if (window.YPP.Utils?.createToast) {
      window.YPP.Utils.createToast(message);
    } else {
      window.YPP.Utils?.log?.(message, 'MULTI-SELECT', 'info');
    }
  }

  /**
   * @param {number} ms
   * @returns {Promise<void>}
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

window.YPP.features.MultiSelect = MultiSelect;
