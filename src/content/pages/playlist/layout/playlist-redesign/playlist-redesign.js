import '../../../../core/system/base-feature.js';
import { extractPlaylistData } from './data-extractor.js';
import { renderHTML } from './ui-builder.js';
import { wireEvents } from './event-handler.js';

/**
 * Feature: Playlist Page Redesign (Full UI Override)
 * Completely replaces the native YouTube playlist page layout with a
 * premium glassmorphic design: sidebar info panel + scrollable video list.
 * Reads data from native YouTube DOM — no API calls needed.
 */
export class PlaylistRedesign extends window.YPP.features.BaseFeature {
    static featureId = 'playlistRedesign';
    static executionPhase = 'sequential-ui';
    static priority = 11;

    constructor() {
        super('PlaylistRedesign');
        this.isActive        = false;
        this.container       = null;   // Our custom #ypp-pl root
        this.navHandler      = null;
        this._buildTimer     = null;
        this._retryTimer     = null;
        this._retryCount     = 0;
        this._initId         = 0;      // Prevent race conditions with SPA navigation
        this._currentCols    = '3';    // Cache column preference to prevent async thrashing
        this._menuCloseFn    = null;   // Track global click listener for memory safety
        this.MAX_RETRIES     = 12;
        this.RETRY_DELAY     = 800;
    }

    getConfigKey() { return 'playlistRedesign'; }

    // ─── Feature lifecycle ───────────────────────────────────────────────────

    async enable() {
        // Pre-fetch column preference once during lifecycle startup
        try {
            window.YPP.StorageManager.get('playlistCols').then((val) => {
                if (val) this._currentCols = val;
            });
        } catch (e) {
            this.utils.log('Failed to load column preference: ' + e.message, 'PLAYLIST_REDESIGN', 'warn');
        }

        if (this._isPlaylistPage()) {
            this._tryInit();
        }
    }

    onPageChange() {
        this._reset();
        if (this.isEnabled && this._isPlaylistPage()) {
            this._tryInit();
        }
    }

    disable() {
        this._reset();
    }

    // ─── Internal helpers ────────────────────────────────────────────────────

    _isPlaylistPage() {
        return location.pathname.startsWith('/playlist');
    }

    _getActiveBrowse() {
        // Find the active ytd-browse (YouTube hides cached pages via the 'hidden' attribute)
        let browses = Array.from(document.querySelectorAll('ytd-browse[page-subtype="playlist"]'));
        if (!browses.length) {
            browses = Array.from(document.querySelectorAll('ytd-browse')).filter(b => 
                b.querySelector('ytd-playlist-header-renderer, yt-playlist-header-view-model, #header')
            );
        }
        return browses.find(el => !el.hasAttribute('hidden')) || browses[0];
    }

    _reset() {
        this._initId++; // Invalidate any pending initializations
        clearTimeout(this._buildTimer);
        clearTimeout(this._retryTimer);
        this._retryCount = 0;
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('playlist-redesign-scanner');
        }
        
        if (this._menuCloseFn) {
            document.removeEventListener('click', this._menuCloseFn);
            this._menuCloseFn = null;
        }

        if (this.container) { 
            this.container.remove(); 
            this.container = null; 
        }
        
        // Show native elements again and remove body flag
        document.querySelectorAll('.ypp-pl-hidden').forEach(el => {
            el.classList.remove('ypp-pl-hidden');
        });
        document.body.classList.remove('ypp-playlist-redesign');
    }

    async _tryInit() {
        if (!this._isPlaylistPage()) return;
        
        const currentInitId = ++this._initId;
        
        // Immediately add the redesign class to hide native elements via CSS instantly
        document.body.classList.add('ypp-playlist-redesign');

        // Wait up to 10 seconds for the native playlist header to load
        const ITEM_SEL = 'ytd-playlist-video-renderer, yt-lockup-view-model';
        const isReady = await window.YPP.Utils.pollFor(() => {
            const browse = this._getActiveBrowse();
            if (!browse) return false;
            const header = browse.querySelector('ytd-playlist-header-renderer, yt-playlist-header-view-model, #header');
            return !!header;
        }, 10000);

        if (!isReady || this._initId !== currentInitId || !this._isPlaylistPage()) {
            return;
        }

        const browse = this._getActiveBrowse();
        if (!browse) return;
        const header = browse.querySelector('ytd-playlist-header-renderer, yt-playlist-header-view-model, #header');
        const videos = browse.querySelectorAll(ITEM_SEL);
        this._build(browse, header, videos);
        this._watchForChanges(browse);
    }

    // ─── MutationObserver — rebuild if native list grows ────────────────────

    _watchForChanges(browse) {
        const listContainer = browse.querySelector('#contents');
        if (!listContainer) return;

        if (window.YPP?.sharedObserver) {
            const ITEM_SEL = 'ytd-playlist-video-renderer, yt-lockup-view-model';
            const debouncedBuild = this.utils.debounce(() => {
                const activeBrowse = this._getActiveBrowse();
                if (!activeBrowse) return;
                const header = activeBrowse.querySelector('ytd-playlist-header-renderer, yt-playlist-header-view-model, #header');
                const videos = activeBrowse.querySelectorAll(ITEM_SEL);
                // Only rebuild if we still have valid data
                if (header && videos.length > 0 && this.isEnabled) {
                    this._build(activeBrowse, header, videos);
                }
            }, 600);
            window.YPP.sharedObserver.register('playlist-redesign-scanner', ITEM_SEL, debouncedBuild, false);
        }
    }

    // ─── UI Build ────────────────────────────────────────────────────────────

    _build(browse, header, videoEls) {
        const data = extractPlaylistData(header, videoEls);
        
        // Hide native playlist layout (not remove — YouTube needs it for data + navigation)
        if (header) {
            header.classList.add('ypp-pl-hidden');
            const headerParent = header.closest('ytd-playlist-header-renderer, #header');
            if (headerParent) headerParent.classList.add('ypp-pl-hidden');
        }
        
        if (videoEls && videoEls.length > 0) {
            // Hide the list container holding the native videos
            const listContainer = videoEls[0].closest('ytd-playlist-video-list-renderer, ytd-item-section-renderer, ytd-section-list-renderer, ytd-rich-grid-renderer');
            if (listContainer) listContainer.classList.add('ypp-pl-hidden');
            
            // Also hide the two-column wrapper if it exists so it doesn't occupy space
            const twoColumn = videoEls[0].closest('ytd-two-column-browse-results-renderer');
            if (twoColumn) twoColumn.classList.add('ypp-pl-hidden');
        }

        // Clean up old event listeners before removing old container
        this.cleanupEvents();

        // Remove old container
        document.getElementById('ypp-pl-root')?.remove();

        // Create root
        this.container = document.createElement('div');
        this.container.id = 'ypp-pl-root';
        this.container.innerHTML = renderHTML(data, this._currentCols);

        // Inject after masthead / inside ytd-browse
        if (browse) {
            browse.insertBefore(this.container, browse.firstChild);
        } else {
            document.body.appendChild(this.container);
        }

        wireEvents(this, browse, data);
    }
}
