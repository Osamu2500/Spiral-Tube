window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};

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
  THUMBNAIL_ANCHOR: 'a#thumbnail, a.ytd-thumbnail, a[href*="/watch?v="], a[href*="/shorts/"]',
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
window.YPP.features.MultiSelect = class MultiSelect extends window.YPP.features.BaseFeature {
  constructor() {
    super('MultiSelect');
    /** @type {Map<string, {title: string, href: string, element: HTMLElement}>} */
    this._selected = new Map();
    this._selectionModeActive = false;
    this._isActing = false; // true while an async menu action is in progress
    this._actionBar = null;
    // Bound + debounced page-change handler (created once, stable reference for on/off)
    this._onPageChangeBound = null;
  }

  getConfigKey() {
    return 'multiSelect';
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  async enable() {
    await super.enable();
    document.body.classList.add(CSS.FEATURE_ENABLED);

    // Create a stable debounced reference for page-change events
    const rawBound = () => this.onPageChange();
    this._onPageChangeBound = window.YPP.Utils?.debounce
      ? window.YPP.Utils.debounce(rawBound, 200)
      : rawBound;

    window.YPP.events?.on('app:pageChange', this._onPageChangeBound);

    window.YPP.hotkeysManager?.register('multi-select', [
      { combo: 'Ctrl+Q', callback: () => this._toggleSelectionMode() },
    ]);

    window.YPP.sharedObserver?.register(
      'multi-select',
      SELECTORS.CARD_ROOTS.slice(0, 5).join(', '),
      () => this._onPageChangeBound?.()
    );

    this._attachCheckboxes();
  }

  async disable() {
    await super.disable(); // runs cleanupEvents() — removes all addListener registrations

    // Tear down DOM injections so re-enable starts clean
    this._removeAllCheckboxes();

    // Reset mode silently (no toast/clearAll side-effects during disable)
    this._selectionModeActive = false;
    document.body.classList.remove(CSS.SELECTION_ACTIVE);
    this._selected.clear();

    this._destroyActionBar();

    document.body.classList.remove(CSS.FEATURE_ENABLED);

    window.YPP.events?.off('app:pageChange', this._onPageChangeBound);
    this._onPageChangeBound = null;
    window.YPP.hotkeysManager?.unregister('multi-select');
    window.YPP.sharedObserver?.unregister('multi-select');
  }

  /** Called on SPA page navigation (also used by sharedObserver callback) */
  onPageChange() {
    // Stale element references after SPA nav — clear visual state but keep mode active
    if (this._selected.size > 0) {
      // Don't iterate stale DOM refs, just clear the map and reset the action bar
      this._selected.clear();
      this._updateActionBar();
    }
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

  _getVideoCards() {
    const selector = SELECTORS.CARD_ROOTS.join(', ');
    return Array.from(document.querySelectorAll(selector)).filter((el) => {
      // Exclude cards that are nested inside another card (prevents double checkboxes)
      return !el.parentElement?.closest(SELECTORS.CARD_PARENTS);
    });
  }

  /** @param {HTMLElement} card */
  _getVideoData(card) {
    const anchor = card.querySelector(SELECTORS.THUMBNAIL_ANCHOR);
    const href = anchor?.href || '';
    const match = href.match(/[?&]v=([^&]+)|\/shorts\/([^/?]+)/);
    const videoId = match?.[1] || match?.[2];
    const title = card.querySelector(SELECTORS.VIDEO_TITLE)?.textContent?.trim() || '';
    return { videoId, href, title };
  }

  _attachCheckboxes() {
    this._getVideoCards().forEach((el) => {
      const card = /** @type {HTMLElement} */ (el);
      if (card.dataset[DATA.STAMP]) return; // already processed
      card.dataset[DATA.STAMP] = '1';

      const { videoId, href, title } = this._getVideoData(card);
      if (!videoId) return;

      this._injectCheckboxAndOverlay(card, videoId, href, title);
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

    // Checkbox: always clickable (hover CSS shows it)
    this.addListener(checkbox, 'click', onSelect);

    // Overlay: only active when mode is ON (CSS display:none otherwise)
    this.addListener(overlay, 'click', onSelect);

    // Card capture-phase: blocks YouTube navigation when mode is active.
    // Only handles clicks that miss both checkbox and overlay (e.g., title/meta area).
    // IMPORTANT: Must NOT intercept ⋮ menu button clicks (needed by action bar handlers
    //            that call _simulateMouseClick on the menu btn while mode is active).
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
    this._selected.set(videoId, { title, href, element: card });
    card.classList.add(CSS.CARD_SELECTED);
    card.querySelector(`.${CSS.CHECKBOX}`)?.classList.add(CSS.CHECKBOX_CHECKED);
  }

  _deselect(card, videoId) {
    this._selected.delete(videoId);
    card.classList.remove(CSS.CARD_SELECTED);
    card.querySelector(`.${CSS.CHECKBOX}`)?.classList.remove(CSS.CHECKBOX_CHECKED);
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
        <button class="ypp-ms-btn" id="ypp-ms-queue">${ICONS.OPEN} Open First</button>
        <button class="ypp-ms-btn" id="ypp-ms-playlist">${ICONS.PLAYLIST} Save to Playlist</button>
        <button class="ypp-ms-btn" id="ypp-ms-wl">${ICONS.WATCH_LATER} Watch Later</button>
        <button class="ypp-ms-btn" id="ypp-ms-not-interested">${ICONS.NOT_INTERESTED} Not Interested</button>
        <button class="ypp-ms-btn" id="ypp-ms-watched">${ICONS.WATCHED} Mark Watched</button>
        <button class="ypp-ms-btn ypp-ms-btn-clear" id="ypp-ms-clear">✕ Clear</button>
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

  _addToQueue() {
    const videos = [...this._selected.values()];
    if (!videos.length) return;

    const first = videos[0];
    const ytApp = document.querySelector(SELECTORS.YT_APP);
    if (ytApp && typeof ytApp.fire === 'function') {
      ytApp.fire('yt-navigate', { url: first.href });
    } else {
      window.location.href = first.href;
    }

    const extra =
      videos.length > 1 ? ` Use YouTube's queue (⋮) to add the other ${videos.length - 1}.` : '';
    this._showToast(`Navigated to first video.${extra}`);
    this._clearAll();
  }

  async _addToWatchLater() {
    const videos = [...this._selected.values()];
    this._showToast(
      `Adding ${videos.length} video${videos.length !== 1 ? 's' : ''} to Watch Later…`
    );
    let successCount = 0;
    for (const { element } of videos) {
      const done = await this._invokeMenuAction(element, 'watch later');
      if (done) successCount++;
      // Small gap so the previous popup fully dismisses before opening the next
      await this._delay(350);
    }
    this._showToast(`${successCount} video${successCount !== 1 ? 's' : ''} added to Watch Later`);
    this._clearAll();
  }

  async _showPlaylistPicker() {
    const first = [...this._selected.values()][0];
    if (!first) return;
    // Opens YouTube's native "Save to playlist" dialog for the first selected video.
    // The user can then pick any playlist from the dialog.
    const done = await this._invokeMenuAction(first.element, [
      'save to playlist',
      'save to',
      'save',
    ]);
    if (!done) {
      this._showToast('Could not open playlist picker — try clicking ⋮ manually');
    }
  }

  async _markNotInterested() {
    const videos = [...this._selected.values()];
    this._showToast(
      `Marking ${videos.length} video${videos.length !== 1 ? 's' : ''} as Not Interested…`
    );
    let count = 0;
    for (const { element } of videos) {
      const done = await this._invokeMenuAction(
        element,
        ['not interested', "don't recommend"],
        () => {
          try {
            element.style.opacity = '0.4';
            element.style.pointerEvents = 'none';
          } catch (_) {}
        }
      );
      if (done) count++;
      await this._delay(350);
    }
    this._showToast(`${count} video${count !== 1 ? 's' : ''} marked Not Interested`);
    this._clearAll();
  }

  async _markSelectedWatched() {
    const videos = [...this._selected.values()];

    // Primary: use the MarkWatched feature's internal API (fast, no UI)
    const markWatched =
      window.YPP.featureManager?.getFeature?.('MarkWatched') ||
      window.YPP.featureManager?.features?.['MarkWatched'];

    if (markWatched) {
      let count = 0;
      for (const { href, element } of videos) {
        const match = href.match(/[?&]v=([^&]+)|\/shorts\/([^/?]+)/);
        const videoId = match?.[1] || match?.[2];
        if (videoId) {
          markWatched.markAsWatched(videoId);
          // Visual feedback: dim the card
          try {
            element.style.opacity = '0.45';
          } catch (_) {}
          count++;
        }
      }
      this._showToast(`${count} video${count !== 1 ? 's' : ''} marked as watched`);
      this._clearAll();
      return;
    }

    // Fallback: use the ⋮ menu "Mark as watched" item
    this._showToast(`Marking ${videos.length} video${videos.length !== 1 ? 's' : ''} as watched…`);
    let count = 0;
    for (const { element } of videos) {
      const done = await this._invokeMenuAction(
        element,
        ['mark as watched', 'mark watched'],
        () => {
          try {
            element.style.opacity = '0.45';
          } catch (_) {}
        }
      );
      if (done) count++;
      await this._delay(350);
    }
    this._showToast(`${count} video${count !== 1 ? 's' : ''} marked as watched`);
    this._clearAll();
  }

  // ─── YouTube Menu Helpers ────────────────────────────────────────────────────

  /**
   * Opens the ⋮ menu on a card and clicks the first item whose text matches.
   * Sets _isActing = true for the duration so the card capture listener backs off.
   * @param {HTMLElement} cardElement
   * @param {string | string[]} labelMatch - text(s) to match (case-insensitive, partial)
   * @param {Function} [onSuccess] - optional callback after clicking the item
   * @returns {Promise<boolean>} true if the item was found and clicked
   */
  async _invokeMenuAction(cardElement, labelMatch, onSuccess) {
    const menuBtn = cardElement.querySelector(SELECTORS.MENU_BTN);
    if (!menuBtn) return false;

    // Suspend capture listener so our simulated menu click isn't intercepted
    this._isActing = true;
    try {
      this._simulateMouseClick(menuBtn);

      const popup = await this._waitForNearestDropdown(menuBtn, 3000);
      if (!popup) return false;

      const item = this._findMenuItemByText(popup, labelMatch);
      if (!item) return false;

      const clickTarget = item.querySelector(SELECTORS.MENU_LABEL) || item;
      this._simulateMouseClick(clickTarget);
      onSuccess?.();
      return true;
    } finally {
      // Always restore — even if an error occurs
      this._isActing = false;
    }
  }

  /**
   * @param {Element} popup
   * @param {string | string[]} match
   * @returns {Element | null}
   */
  _findMenuItemByText(popup, match) {
    const terms = Array.isArray(match) ? match : [match];
    const items = Array.from(popup.querySelectorAll(SELECTORS.MENU_ITEMS));
    return (
      items.find((item) => {
        const txt = (item.innerText || item.textContent || '').trim().toLowerCase();
        return terms.some((term) => txt.includes(term) || txt === term);
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
    const cx = ax + aw / 2,
      cy = ay + ah / 2;

    const visiblePopups = Array.from(document.querySelectorAll(SELECTORS.POPUP)).filter((d) => {
      const r = d.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

    if (!visiblePopups.length) return null;

    return visiblePopups.reduce((best, d) => {
      const r = d.getBoundingClientRect();
      const dist = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
      const bestDist = (() => {
        const br = best.getBoundingClientRect();
        return Math.hypot(br.left + br.width / 2 - cx, br.top + br.height / 2 - cy);
      })();
      return dist < bestDist ? d : best;
    });
  }

  // ─── Utilities ────────────────────────────────────────────────────────────────

  /** @param {string} message */
  _showToast(message) {
    if (window.YPP.Utils?.showToast) {
      window.YPP.Utils.showToast(message);
    } else {
      window.YPP.Utils?.log?.(message, 'MULTI-SELECT', 'info');
    }
  }

  /**
   * Wait for ms milliseconds. Used to space sequential menu interactions so
   * the previous popup fully dismisses before the next one is opened.
   * @param {number} ms
   * @returns {Promise<void>}
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
