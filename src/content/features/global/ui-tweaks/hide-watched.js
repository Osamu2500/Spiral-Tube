/**
 * HideWatched — v2 (Rewritten)
 * -----------------------------
 * Hides or dims video cards that have been watched using a layered
 * detection strategy:
 *
 *   1. Manual list  — IDs marked by the MarkWatched feature (persisted in storage)
 *   2. YouTube's native progress bar (style.width on the inner #progress element)
 *   3. YouTube's "WATCHED" / "VIEWED" badge
 *
 * Key improvements over v1:
 *  - Detects the OUTERMOST card container to correctly collapse CSS Grid cells
 *  - Skips currently-playing cards (now-playing badge guard)
 *  - Simpler, faster progress bar detection (direct style.width read on inner bar)
 *  - "Currently playing" guard prevents collapsing the card you're watching
 *  - onUpdate now fully resets stale state before re-scanning
 *  - _shouldRunOnCurrentPage is self-contained and readable
 *  - _unhideAll correctly clears data-ypp-watched + inline styles
 */
export class HideWatched extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hideWatched';
    static executionPhase = 'idle';
    static priority = 9;

    // Compiled Regular Expressions for performance
    static WATCH_URL_REGEX = /[?&]v=([^&]+)/;
    static SHORTS_URL_REGEX = /\/shorts\/([A-Za-z0-9_-]{11})/;

    // All card container selectors — ordered broadest to most specific.
    // Mirrors the reference extension's getVideoContainerSelectors() logic.
    static CARD_SELECTORS_GLOBAL =
        'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ' +
        'ytd-grid-video-renderer, ytd-reel-item-renderer, ' +
        'yt-lockup-view-model, ytd-lockup-view-model, ' +
        'ytm-video-with-context-renderer, ytm-compact-video-renderer, ytm-rich-item-renderer';

    // On the watch page include compact renderers in the sidebar
    static CARD_SELECTORS_WATCH =
        'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ' +
        'yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer';

    // Channel pages include grid
    static CARD_SELECTORS_CHANNEL =
        'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ' +
        'ytd-grid-video-renderer, yt-lockup-view-model, ' +
        'ytm-video-with-context-renderer, ytm-compact-video-renderer';

    // Progress bar selectors for the observer — targets the inner fill bar
    static PROGRESS_BAR_SELECTORS =
        'ytd-thumbnail-overlay-resume-playback-renderer #progress, ' +
        '#progress.ytd-thumbnail-overlay-resume-playback-renderer, ' +
        '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment, ' +
        '.thumbnail-overlay-resume-playback-progress, ' +
        'yt-progress-bar-view-model, ' +
        '.yt-progress-bar-view-model-progress';

    // Now-playing badge selector — skip currently playing cards
    static NOW_PLAYING_SELECTOR =
        'ytd-thumbnail-overlay-now-playing-renderer[now-playing-badge], ' +
        '.ytd-thumbnail-overlay-now-playing-renderer[now-playing]';

    constructor() {
        super('HideWatched');
        this._debounceTimer = null;
        this._boundSchedule = this._scheduleProcess.bind(this);
        this._boundProcessProgress = this._processProgressBatch.bind(this);
    }

    // =========================================================================
    // Config
    // =========================================================================

    getConfigKey() { return 'hideWatched'; }

    /** Returns the correct card selector set for the current page */
    _getCardSelectors() {
        const path = window.location.pathname;
        if (path === '/watch') return HideWatched.CARD_SELECTORS_WATCH;
        if (path.startsWith('/@') || path.startsWith('/channel/') || path.startsWith('/user/') || path.startsWith('/c/')) {
            return HideWatched.CARD_SELECTORS_CHANNEL;
        }
        return HideWatched.CARD_SELECTORS_GLOBAL;
    }

    /** Per-page toggle check — reads from this.settings (updated via featureManager.init) */
    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        const s = this.settings || {};

        if (path === '/' || path === '/index') return s.hideWatchedHome !== false;

        if (path.startsWith('/@') || path.startsWith('/channel/') ||
            path.startsWith('/user/') || path.startsWith('/c/')) {
            return s.hideWatchedChannel !== false;
        }

        if (path.startsWith('/feed/subscriptions')) return s.hideWatchedSubs !== false;
        if (path.startsWith('/results'))            return s.hideWatchedSearch !== false;
        if (path.startsWith('/watch'))              return s.hideWatchedRelated !== false;

        return false;
    }

    // =========================================================================
    // Lifecycle
    // =========================================================================

    async enable() {
        await super.enable();

        this._updateBodyClass();

        if (this._shouldRunOnCurrentPage()) {
            this._processCards();
        }

        // SPA navigation — re-run or unhide on page change
        this.onBusEvent('app:pageChange', () => {
            if (!this._shouldRunOnCurrentPage()) {
                this._unhideAll();
            } else {
                // Clear stale processing stamps so recycled DOM is re-evaluated
                this._clearProcessingStamps();
                this._processCards();
            }
        });

        // yt-navigate-finish fires on soft navigations — clear stamps and re-scan
        this.addListener(document, 'yt-navigate-finish', () => {
            this._clearProcessingStamps();
            this._scheduleProcess();
        });

        // Infinite scroll / virtual DOM recycling
        this.addListener(document, 'yt-page-data-updated', this._boundSchedule);

        // WatchedStore: instant mark/unmark on manual actions
        this._unsubscribeStore = window.YPP.WatchedStore?.onChange?.((change) => {
            if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
            if (change.type === 'add')    this._markCardWatched(change.id);
            else if (change.type === 'remove') this._unmarkCardWatched(change.id);
        });

        // React to user manually marking from the MarkWatched feature
        this.onBusEvent('watched:updated', () => {
            if (this._shouldRunOnCurrentPage()) this._processCards();
        });

        if (window.YPP?.sharedObserver) {
            // Catch newly added cards (infinite scroll) immediately
            window.YPP.sharedObserver.register(
                'hide-watched-cards',
                HideWatched.CARD_SELECTORS_GLOBAL,
                (nodes) => {
                    if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
                    const watchedIds = this._getWatchedIds();
                    const threshold  = this.settings?.hideWatchedThreshold ?? 80;
                    nodes.forEach(card => this._evaluateCard(card, watchedIds, threshold));
                },
                true,   // subtree
                false   // don't fire on existing
            );

            // Catch progress bars appearing (lazy render)
            window.YPP.sharedObserver.register(
                'hide-watched-progress',
                HideWatched.PROGRESS_BAR_SELECTORS,
                this._boundProcessProgress,
                false,
                false
            );
        }
    }

    async disable() {
        await super.disable(); // cleanupEvents + cleanupBusListeners

        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
            this._debounceTimer = null;
        }

        if (this._unsubscribeStore) {
            this._unsubscribeStore();
            this._unsubscribeStore = null;
        }

        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('hide-watched-cards');
            window.YPP.sharedObserver.unregister('hide-watched-progress');
        }

        document.body.classList.remove('ypp-watched-mode-hide', 'ypp-watched-mode-dim');
        this._unhideAll();
        this._clearProcessingStamps();
    }

    async onUpdate(newSettings, oldSettings) {
        this._updateBodyClass();

        // Check if only hideWatchedMode changed (and threshold/page toggles stayed the same)
        const onlyModeChanged = oldSettings &&
            oldSettings.hideWatchedMode !== this.settings?.hideWatchedMode &&
            oldSettings.hideWatchedThreshold === this.settings?.hideWatchedThreshold &&
            ['Home', 'Channel', 'Subs', 'Search', 'Related'].every(
                p => oldSettings['hideWatched' + p] === this.settings?.['hideWatched' + p]
            );

        if (onlyModeChanged) {
            // Instant CSS switch: changing body class ypp-watched-mode-dim ↔ ypp-watched-mode-hide
            // instantly hides or dims all cards with data-ypp-watched="1" without DOM re-scanning.
            return;
        }

        // Full reset — clears mode switch artifacts and page toggle changes
        this._unhideAll();
        this._clearProcessingStamps();
        if (!this._shouldRunOnCurrentPage()) return;
        this._processCards();
    }

    // =========================================================================
    // Mode toggling
    // =========================================================================

    _updateBodyClass() {
        const mode = this.settings?.hideWatchedMode || 'dim';
        if (mode === 'hide') {
            document.body.classList.add('ypp-watched-mode-hide');
            document.body.classList.remove('ypp-watched-mode-dim');
        } else {
            document.body.classList.add('ypp-watched-mode-dim');
            document.body.classList.remove('ypp-watched-mode-hide');
        }
    }

    _unhideAll() {
        document.querySelectorAll('[data-ypp-watched]').forEach(el => {
            el.removeAttribute('data-ypp-watched');
            el.classList.remove('ypp-is-watched');
            el.style.removeProperty('display');
        });
        document.querySelectorAll('[data-ypp-watched-processed]').forEach(el => {
            el.removeAttribute('data-ypp-watched-processed');
        });
    }

    _clearProcessingStamps() {
        document.querySelectorAll('[data-ypp-watched-processed]').forEach(el => {
            el.removeAttribute('data-ypp-watched-processed');
        });
    }

    // =========================================================================
    // Scheduling (debounce)
    // =========================================================================

    _scheduleProcess() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this._debounceTimer = null;
            this._processCards();
        }, 150);
    }

    // =========================================================================
    // Detection helpers
    // =========================================================================

    _getWatchedIds() {
        return window.YPP.WatchedStore?.getAll() ?? new Set();
    }

    _getVideoId(card) {
        // Strategy 1: data attributes (fastest — O(1))
        const attrId = card.dataset.videoId || card.dataset.ytVideoId || card.getAttribute('video-id');
        if (attrId) return attrId;

        // Strategy 2: ytd-thumbnail[video-id]
        const thumb = card.querySelector('ytd-thumbnail[video-id]');
        if (thumb) {
            const id = thumb.getAttribute('video-id');
            if (id) return id;
        }

        // Strategy 3: Modern lockup cards
        const lockupSel = 'yt-lockup-view-model, ytd-lockup-view-model';
        const lockup = card.matches(lockupSel) ? card : card.querySelector(lockupSel);
        if (lockup) {
            const id = lockup.getAttribute('video-id');
            if (id) return id;
        }

        // Strategy 4: Anchor href parse (fallback)
        const anchor = card.querySelector('a#thumbnail') ||
                       card.querySelector('a[href^="/watch"], a[href^="/shorts"]');
        if (anchor) {
            const href = anchor.getAttribute('href') || '';
            const m = href.match(HideWatched.WATCH_URL_REGEX);
            if (m) return m[1];
            const s = href.match(HideWatched.SHORTS_URL_REGEX);
            if (s) return s[1];
        }

        return null;
    }

    /**
     * Returns watch progress as a percentage (0-100) or null if not found.
     * Mirrors the reference extension's approach: reads style.width directly
     * from the inner progress fill element.
     */
    _getWatchProgress(card) {
        // Broad selector matching all inner progress bar fill elements across YouTube layouts
        const progressBars = card.querySelectorAll(
            '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment, ' +
            '.yt-progress-bar-view-model-progress, ' +
            'ytd-thumbnail-overlay-resume-playback-renderer #progress, ' +
            'ytd-thumbnail-overlay-resume-playback-renderer [id="progress"], ' +
            'ytm-thumbnail-overlay-resume-playback-renderer .thumbnail-overlay-resume-playback-progress, ' +
            'yt-progress-bar-view-model #progress, ' +
            '#progress.ytd-thumbnail-overlay-resume-playback-renderer'
        );

        for (const bar of progressBars) {
            if (bar.hasAttribute('hidden') || bar.closest('[hidden]')) continue;

            // 1. Explicit style width (fastest & most common)
            let pct = parseFloat(bar.style.width);
            if (!isNaN(pct) && pct > 0) return pct;

            // 2. ARIA valuenow
            const aria = parseFloat(bar.getAttribute('aria-valuenow') || '');
            if (!isNaN(aria) && aria > 0) return aria;

            // 3. Rendered box geometry vs parent width (catches CSS variable / class styling)
            const rect = bar.getBoundingClientRect();
            const parent = bar.parentElement;
            if (rect.width > 0 && parent && parent.clientWidth > 0) {
                pct = Math.round((rect.width / parent.clientWidth) * 100);
                if (pct > 0 && pct <= 100) return pct;
            }
        }

        // If a resume playback container is present and visible, treat as 100% watched
        const resumeRenderers = card.querySelectorAll(
            'ytd-thumbnail-overlay-resume-playback-renderer, ' +
            'yt-progress-bar-view-model, ' +
            '.thumbnail-overlay-resume-playback-progress'
        );
        for (const renderer of resumeRenderers) {
            if (!renderer.hasAttribute('hidden') && !renderer.closest('[hidden]')) {
                return 100;
            }
        }

        return null;
    }

    /** True if a now-playing badge is present — skip currently playing cards */
    _isNowPlaying(card) {
        return !!card.querySelector(HideWatched.NOW_PLAYING_SELECTOR);
    }

    _hasWatchedBadge(card) {
        const badges = card.querySelectorAll(
            'ytd-badge-supported-renderer, ' +
            'ytd-thumbnail-overlay-bottom-panel-renderer, ' +
            'ytd-thumbnail-overlay-playback-status-renderer'
        );
        for (const badge of badges) {
            if (window.getComputedStyle(badge).display === 'none') continue;
            const text = badge.textContent.trim().toUpperCase();
            if (text === 'WATCHED' || text === 'VIEWED' || text === 'PLAYED') return true;
        }
        return false;
    }

    /**
     * Core decision: is this card watched?
     * Priority: manual list → progress bar → badge
     */
    _isWatched(card, videoId, watchedIds, threshold) {
        // Skip cards actively playing — never hide what you're watching
        if (this._isNowPlaying(card)) return false;

        // 1. Manual mark list
        if (videoId && watchedIds.has(videoId)) return true;

        // 2. Native progress bar
        const progress = this._getWatchProgress(card);
        if (progress !== null && progress >= threshold) return true;

        // 3. WATCHED badge
        if (this._hasWatchedBadge(card)) return true;

        return false;
    }

    // =========================================================================
    // Outermost container resolution
    // =========================================================================

    /**
     * Walk up from the matched card to find the topmost element that still
     * matches a card selector. Hiding the outermost container ensures that
     * CSS Grid collapses the entire cell, not just the inner renderer.
     */
    _getOutermostCard(card) {
        const selectors = this._getCardSelectors();
        let match = card;
        let el = card.parentElement;
        while (el && el !== document.body) {
            if (el.matches && el.matches(selectors)) match = el;
            el = el.parentElement;
        }
        return match;
    }

    // =========================================================================
    // Restore helpers
    // =========================================================================

    _unhideAll() {
        document.querySelectorAll('[data-ypp-watched]').forEach(card => {
            card.removeAttribute('data-ypp-watched');
            card.classList.remove('ypp-is-watched');
            card.style.removeProperty('display');
        });
    }

    _clearProcessingStamps() {
        document.querySelectorAll('[data-ypp-watched-processed]').forEach(card => {
            delete card.dataset.yppWatchedProcessed;
        });
    }

    // =========================================================================
    // Processing loops
    // =========================================================================

    _processProgressBatch(progressBars) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        const watchedIds = this._getWatchedIds();
        const threshold  = this.settings?.hideWatchedThreshold ?? 80;

        progressBars.forEach(bar => {
            const card = bar.closest(this._getCardSelectors());
            if (card) this._evaluateCard(card, watchedIds, threshold);
        });
    }

    _processCards(elements = null) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;

        const watchedIds = this._getWatchedIds();
        const threshold  = this.settings?.hideWatchedThreshold ?? 80;
        const cards = elements || document.querySelectorAll(this._getCardSelectors());

        cards.forEach(card => this._evaluateCard(card, watchedIds, threshold));
    }

    _evaluateCard(card, watchedIds, threshold) {
        try {
            if (card.hasAttribute('hidden') || card.style.display === 'none') return;

            const videoId = this._getVideoId(card);
            const watched = this._isWatched(card, videoId, watchedIds, threshold);

            // Always stamp and hide the outermost container
            const target = this._getOutermostCard(card);
            if (!target) return;

            const alreadyMarked = target.hasAttribute('data-ypp-watched');

            if (watched && !alreadyMarked) {
                target.setAttribute('data-ypp-watched', '1');
                target.classList.add('ypp-is-watched');
            } else if (!watched && alreadyMarked) {
                target.removeAttribute('data-ypp-watched');
                target.classList.remove('ypp-is-watched');
                target.style.removeProperty('display');
            }
        } catch (err) {
            this.utils?.log(`[HideWatched] Card eval error: ${err.message}`, 'HIDE_WATCHED', 'debug');
        }
    }

    // =========================================================================
    // Instant mark/unmark from WatchedStore callbacks
    // =========================================================================

    _markCardWatched(videoId) {
        if (!videoId) return;
        const selectors = 'ytd-thumbnail[video-id], [video-id], [data-video-id]';
        document.querySelectorAll(
            `ytd-thumbnail[video-id="${videoId}"], [video-id="${videoId}"], [data-video-id="${videoId}"]`
        ).forEach(el => {
            let card = el.closest(this._getCardSelectors());
            if (!card) return;
            card = this._getOutermostCard(card);
            card.setAttribute('data-ypp-watched', '1');
            card.classList.add('ypp-is-watched');
        });
    }

    _unmarkCardWatched(videoId) {
        if (!videoId) return;
        document.querySelectorAll(
            `ytd-thumbnail[video-id="${videoId}"], [video-id="${videoId}"], [data-video-id="${videoId}"]`
        ).forEach(el => {
            let card = el.closest(this._getCardSelectors());
            if (!card) return;
            card = this._getOutermostCard(card);
            card.removeAttribute('data-ypp-watched');
            card.classList.remove('ypp-is-watched');
            card.style.removeProperty('display');
        });
    }
}

window.YPP.features.HideWatched = HideWatched;
