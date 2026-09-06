import '../../core/system/base-feature.js';

/**
 * Feed Filter Bar Feature
 * Handles the logic and state of the filter chips across YouTube feeds.
 */
export class FeedFilterBarFeature extends window.YPP.features.BaseFeature {
    static featureId = 'feedFilterBarFeature';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'enableFilterBar'; }
    constructor() { super('FeedFilterBarFeature'); }

    async enable() {
        await super.enable();
        this.activeFilters = new Set();
        this.multiSelect = this.settings.feedFilter_opt_multiselect || false;
        this.searchVisible = this.settings.feedFilter_search_visible !== false;
        this.searchQuery = '';

        this.filterSettings = {
            video: this.settings.feedFilter_video_visible !== false,
            short: this.settings.feedFilter_shorts_visible !== false,
            live: this.settings.feedFilter_live_visible !== false,
            streamed: this.settings.feedFilter_streamed_visible !== false,
            scheduled: this.settings.feedFilter_scheduled_visible !== false,
            post: this.settings.feedFilter_posts_visible !== false,
            playlist: this.settings.feedFilter_playlist_visible !== false,
            watched: this.settings.feedFilter_watched_visible !== false,
            unwatched: this.settings.feedFilter_unwatched_visible !== false,
        };

        this.setupUI();
        
        let refreshTimeout;
        this.debouncedRefresh = () => {
            if (refreshTimeout) clearTimeout(refreshTimeout);
            refreshTimeout = setTimeout(() => {
                this.refreshFilters();
            }, 50);
        };

        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.registerFilter(this);
        }
    }

    async disable() {
        await super.disable();
        const container = document.getElementById('ypp-subscriptions-bar');
        if (container) container.innerHTML = '';
        
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) {
                if (typeof pipeline.unregisterFilter === 'function') pipeline.unregisterFilter(this);
                pipeline.triggerGlobalReevaluation();
            }
        }
    }

    setupUI() {
        const checkContainer = () => {
            const container = document.getElementById('ypp-subscriptions-bar');
            if (container) {
                this.renderChips(container);
            } else {
                setTimeout(checkContainer, 100);
            }
        };
        checkContainer();
    }

    renderChips(container) {
        container.innerHTML = ''; // Clear previous

        const filters = [
            { id: 'video', label: 'Video', icon: 'M4 6h10v12H4zm12 3v6l6 3.5V5.5z' },
            { id: 'short', label: 'Shorts', icon: 'M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z' },
            { id: 'live', label: 'Live', icon: 'M9 8c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1Zm1.11 2.13.71.71C11.55 10.11 12 9.11 12 8c0-1.11-.45-2.11-1.18-2.84l-.71.71c.55.55.89 1.3.89 2.13 0 .83-.34 1.58-.89 2.13Z' },
            { id: 'streamed', label: 'Streamed', icon: 'M13 7.5c0-.552-.448-1-1-1s-1 .448-1 1v5.015l.419.299 3.5 2.5c.45.32 1.074.217 1.395-.233.32-.45.217-1.074-.233-1.395L13 11.486V7.5Z' },
            { id: 'scheduled', label: 'Scheduled', icon: 'M11.25 7v5.375l.3.225 4 3c.331.248.802.181 1.05-.15.248-.331.181-.801-.15-1.05l-3.7-2.775V7H11.25z' },
            { id: 'post', label: 'Post', icon: 'M21 5v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-5 6H8v2h8v-2zm5 1H5v2h16v-2zm4 4H5v2h16v-2zm-9-1H8v2h8v-2z' },
            { id: 'playlist', label: 'Playlist', icon: 'M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z' },
            { id: 'watched', label: 'Watched', icon: 'M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' },
            { id: 'unwatched', label: 'Unwatched', icon: 'M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.52C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6.5 12 6.5zm9.27 15.46l-1.46 1.46-3.99-3.99c-1.13.59-2.43.95-3.82.95-5 0-9.27-3.11-11-7.5.76-1.95 2.06-3.64 3.66-4.93L1.27 3.73l1.46-1.46 18.54 18.69zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z' }
        ];

        const allChip = this.createChip('all', 'All', null);
        allChip.classList.add('active');
        container.appendChild(allChip);

        filters.forEach(f => {
            if (this.filterSettings[f.id]) {
                const chip = this.createChip(f.id, f.label, f.icon);
                container.appendChild(chip);
            }
        });

        if (this.searchVisible) {
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search titles...';
            searchInput.className = 'ypp-filter-search';
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.debouncedRefresh();
            });
            container.appendChild(searchInput);
        }
    }

    createChip(id, label, iconData) {
        const chip = document.createElement('button');
        chip.className = `ypp-filter-chip filter-chip-${id}`;
        chip.dataset.id = id;
        
        let iconHtml = '';
        if (iconData) {
            iconHtml = `<svg viewBox="0 0 24 24" class="ypp-chip-icon"><path fill="currentColor" d="${iconData}"></path></svg>`;
        }
        
        chip.innerHTML = `${iconHtml}<span class="ypp-chip-label">${label}</span>`;
        
        chip.addEventListener('click', () => {
            if (id === 'all') {
                this.activeFilters.clear();
                document.querySelectorAll('.ypp-filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            } else {
                if (!this.multiSelect) {
                    this.activeFilters.clear();
                    document.querySelectorAll('.ypp-filter-chip').forEach(c => c.classList.remove('active'));
                }
                
                if (this.activeFilters.has(id)) {
                    this.activeFilters.delete(id);
                    chip.classList.remove('active');
                } else {
                    this.activeFilters.add(id);
                    chip.classList.add('active');
                    document.querySelector('.filter-chip-all').classList.remove('active');
                }

                if (this.activeFilters.size === 0) {
                    document.querySelector('.filter-chip-all').classList.add('active');
                }
            }
            this.refreshFilters();
        });
        
        return chip;
    }

    refreshFilters() {
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    evaluate(context) {
        if (!this.isEnabled) return null;
        
        // Only run if we actually have active filters or a search query
        if (this.activeFilters.size === 0 && this.searchQuery === '') return null;

        const matchesSearch = this.searchQuery === '' || (context.title && context.title.toLowerCase().includes(this.searchQuery));
        
        const categories = this.classifyContext(context);
        
        let matchesCategory = true;
        if (this.activeFilters.size > 0) {
            matchesCategory = Array.from(this.activeFilters).some(filter => categories.has(filter));
        }

        if (matchesSearch && matchesCategory) {
            return null; // Don't hide
        } else {
            return { action: 'hide', reason: 'Filtered by Bar' }; // Hide it!
        }
    }

    classifyContext(context) {
        const categories = new Set();
        
        // Use the exact same Watched threshold logic as HideWatched!
        const watchedThreshold = this.settings.hideWatchedThreshold ?? 80;
        const watchedIds = window.YPP.WatchedStore?.getAll() ?? new Set();
        let isWatched = false;
        
        if (context.videoId && watchedIds.has(context.videoId)) isWatched = true;
        if (!isWatched && context.progressPercent >= watchedThreshold) isWatched = true;

        if (isWatched) categories.add('watched');
        else categories.add('unwatched');

        if (context.isShort) {
            categories.add('short');
            return categories;
        }

        if (context.isPost) {
            categories.add('post');
            return categories;
        }

        if (context.isPlaylist) {
            categories.add('playlist');
            return categories;
        }

        if (context.isLive) {
            categories.add('live');
        } else if (context.isUpcoming) {
            categories.add('scheduled');
        }

        const node = context.card;
        let isStreamed = false;
        let isScheduled = context.isUpcoming;
        
        if (!context.isLive && !isScheduled) {
            const metadataSpan = node.querySelector('yt-content-metadata-view-model > div:last-child > span[role="text"]:last-child, #metadata-line');
            if (metadataSpan) {
                const text = metadataSpan.textContent.toLowerCase();
                if (text.includes('watching') || text.includes('live')) {
                    categories.add('live');
                } else if (text.includes('streamed')) {
                    categories.add('streamed');
                    isStreamed = true;
                } else if (text.includes('scheduled') || text.includes('premiering')) {
                    categories.add('scheduled');
                    isScheduled = true;
                }
            }
        }

        if (!context.isLive && !isStreamed && !isScheduled && !context.isShort && !context.isPost && !context.isPlaylist) {
            categories.add('video');
        }

        return categories;
    }
}
