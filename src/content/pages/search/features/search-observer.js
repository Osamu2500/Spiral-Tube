/**
 * Search Observer
 * Owns: MutationObserver, monitor interval, debounce, processAll / processNode.
 * Stateless w.r.t. settings — caller syncs via sync() before use.
 * Does not affect unrelated files/functionality outside its scope.
 */

import { SearchUtils } from './search-utils.js';

export class SearchObserver {
    static featureId = 'searchObserver';
    static executionPhase = 'idle';
    static priority = 999;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor() {
        this._processedNodes  = new WeakSet();

        /** Injected by SearchRedesign via sync() */
        this._settings  = {};
        this._isEnabled = () => false;
        this._classes   = {};
        this._isObserving = false;
        
        // Listen for asynchronously added badges
        this._handleBadgeAnimation = this._handleBadgeAnimation.bind(this);
        document.addEventListener('animationstart', this._handleBadgeAnimation);
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Sync latest settings / state from the orchestrator before each use.
     * @param {Object}   settings    - Current user settings
     * @param {Function} isEnabledFn - Returns true when the feature is active
     * @param {Object}   classes     - SearchRedesign.CLASSES reference
     */
    sync(settings, isEnabledFn, classes) {
        this._settings  = settings  || {};
        this._isEnabled = isEnabledFn;
        this._classes   = classes   || {};
    }

    /** Reset the processed-node cache (call on fresh navigation). */
    resetProcessedNodes() {
        this._processedNodes = new WeakSet();
    }

    start() {
        if (this._isObserving) return;
        this._isObserving = true;

        if (window.YPP?.sharedObserver) {
            // Debounce: batches rapid mutations (20 items loading at once) into a
            // single _processMatches call rather than firing 20 separate times.
            const debouncedProcess = window.YPP.Utils?.debounce
                ? window.YPP.Utils.debounce((matches) => this._processMatches(matches), 30)
                : (matches) => this._processMatches(matches);

            window.YPP.sharedObserver.register(
                'search-results-scanner',
                'ytd-item-section-renderer, yt-collection-shelf-view-model, ytd-video-renderer, ytd-playlist-renderer, ytd-radio-renderer, ytd-channel-renderer',
                debouncedProcess
            );
            this.processAll();
        }
    }

    /** Stop observing and clear all timers. */
    stop() {
        this._isObserving = false;
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('search-results-scanner');
        }
    }

    // -------------------------------------------------------------------------
    // Observer internals
    // -------------------------------------------------------------------------

    _handleBadgeAnimation(e) {
        if (e.animationName === 'yppBadgeAdded' && this._isEnabled()) {
            const badge = e.target;
            if (!this._isMovableBadge(badge)) return;

            const renderer = badge.closest('ytd-video-renderer, ytd-compact-video-renderer, ytd-playlist-renderer, ytd-radio-renderer');
            if (renderer) {
                const channelInfo = renderer.querySelector('#channel-info');
                if (channelInfo && badge.parentElement !== channelInfo) {
                    window.YPP.Utils.batch.write(() => {
                        channelInfo.appendChild(badge);
                    });
                }
            }
        }
    }

    _isMovableBadge(badge) {
        return !badge.closest('ytd-channel-name') && 
               !badge.closest('ytd-thumbnail') && 
               !badge.closest('.ytLockupViewModelContentImage') && 
               !badge.closest('a#thumbnail');
    }

    _processMatches(matches) {
        if (!this._isEnabled()) return;
        
        const sectionsToProcess = new Set();
        
        for (let i = 0; i < matches.length; i++) {
            const node = matches[i];
            if (node.tagName === 'YTD-ITEM-SECTION-RENDERER' || node.tagName === 'YT-COLLECTION-SHELF-VIEW-MODEL') {
                sectionsToProcess.add(node);
            } else if (node.closest) {
                const section = node.closest('ytd-item-section-renderer, yt-collection-shelf-view-model');
                if (section) sectionsToProcess.add(section);
            }
        }
        
        sectionsToProcess.forEach(section => {
            try {
                if (document.body.contains(section)) {
                    this._processSection(section);
                }
            } catch (error) {
                this._logError('_processSection error', error);
            }
        });
    }

    // -------------------------------------------------------------------------
    // Node processing
    // -------------------------------------------------------------------------

    /** Two-pass processing: hide noise sections, then wire up grids. */
    processAll() {
        if (!this._isEnabled()) return;

        try {
            const itemSections = document.querySelectorAll('ytd-item-section-renderer, yt-collection-shelf-view-model');
            for (let i = 0; i < itemSections.length; i++) {
                this._processSection(itemSections[i]);
            }
        } catch (error) {
            this._logError('processAll error', error);
        }
    }

    _processSection(section) {
        let contents = section.querySelector('#contents');
        if (!contents) {
            if (section.tagName === 'YT-COLLECTION-SHELF-VIEW-MODEL') {
                contents = section; // Fallback to the section itself for newer layouts
            } else {
                return;
            }
        }

        const children = Array.from(contents.children);
        if (children.length === 0) return;

        // Use fastdom pattern to strictly separate DOM reads and writes.
        // Interleaving them (e.g. read `querySelector` then write `classList.add`)
        // inside a loop causes synchronous Layout Thrashing and extreme lag.
        window.YPP.Utils.batch.read(() => {
            const stats = this._analyzeSectionChildren(children);
            const operations = [];

            const CLASSES = this._classes;
            const isGridContainer = contents.classList.contains(CLASSES.GRID_CONTAINER);

            // Phase 1: DOM Reads (Gather all necessary state)
            for (let i = 0; i < children.length; i++) {
                const node = children[i];
                if (node.nodeType !== Node.ELEMENT_NODE) continue;
                if (this._processedNodes.has(node)) continue;

                const tag = node.tagName.toLowerCase();
                const isFlattenable = SearchUtils.isFlattenableShelf(node);
                const isShorts = SearchUtils.isShorts(node);

                let flattenData = null;
                if (isFlattenable) {
                    const { SELECTORS } = SearchUtils;
                    const vertical = node.querySelector(SELECTORS.VERTICAL_ITEMS);
                    const horizontal = node.querySelector(SELECTORS.HORIZONTAL_SCROLL)
                                    || node.querySelector(SELECTORS.HORIZONTAL_ITEMS);
                    const generic = node.querySelector(SELECTORS.GENERIC_ITEMS)
                                    || node.querySelector(SELECTORS.GENERIC_SCROLL)
                                    || node.querySelector(SELECTORS.CONTENTS);
                    const shelfContainer = vertical || horizontal || generic;
                    let cards = [];
                    let cardsCleanData = [];
                    if (shelfContainer) {
                        cards = Array.from(shelfContainer.querySelectorAll(SELECTORS.RENDERERS));
                        cardsCleanData = cards.map(c => {
                            const thumb = c.querySelector(SELECTORS.THUMBNAIL);
                            return {
                                dismissible: c.querySelector(SELECTORS.DISMISSIBLE),
                                thumb: thumb,
                                innerThumb: thumb ? thumb.querySelector(SELECTORS.INNER_THUMB) : null,
                                textWrapper: c.querySelector(SELECTORS.TEXT_WRAPPER),
                                actionMenu: c.querySelector(SELECTORS.ACTION_MENU)
                            };
                        });
                    }
                    flattenData = { shelfContainer, cards, cardsCleanData };
                }

                let cleanData = null;
                if (stats.hasVideos || isGridContainer) {
                    if (
                        tag === 'ytd-video-renderer'         ||
                        tag === 'ytd-compact-video-renderer' ||  // music/song cards
                        tag === 'ytd-radio-renderer'         ||
                        tag === 'ytd-playlist-renderer'      ||
                        tag === 'ytd-channel-renderer'       ||
                        tag === 'yt-lockup-view-model'       ||
                        tag === 'ytd-lockup-view-model'
                    ) {
                        const { SELECTORS } = SearchUtils;
                        const thumb = node.querySelector(SELECTORS.THUMBNAIL);
                        const textWrapper = node.querySelector(SELECTORS.TEXT_WRAPPER);
                        // Aggressively find all badges anywhere in the card, except inside channel-name or thumbnail
                        const extraBadges = Array.from(node.querySelectorAll(SELECTORS.BADGES)).filter(badge => this._isMovableBadge(badge));
                            
                        cleanData = {
                            dismissible: node.querySelector(SELECTORS.DISMISSIBLE),
                            thumb: thumb,
                            innerThumb: thumb ? thumb.querySelector(SELECTORS.INNER_THUMB) : null,
                            textWrapper: textWrapper,
                            actionMenu: node.querySelector(SELECTORS.ACTION_MENU),
                            extraBadges: extraBadges,
                            channelInfo: node.querySelector(SELECTORS.CHANNEL_INFO)
                        };
                    }
                }

                operations.push({ node, tag, isFlattenable, isShorts, flattenData, cleanData });
            }

            // Phase 2: DOM Writes (Apply all mutations in one frame)
            window.YPP.Utils.batch.write(() => {
                const { NOISE_TAGS } = SearchUtils;

                this._handleNoiseSection(section, stats, children.length);

                if (stats.hasVideos && !isGridContainer) {
                    contents.classList.add(CLASSES.GRID_CONTAINER);
                }

                for (let op of operations) {
                    this._processedNodes.add(op.node);

                    if (op.isShorts) {
                        if (this._settings.hideSearchShorts) {
                            op.node.style.setProperty('display', 'none', 'important');
                            continue;
                        }
                    }

                    if (NOISE_TAGS.has(op.tag)) {
                        if (this._settings.hideSearchShelves) {
                            op.node.style.setProperty('display', 'none', 'important');
                            op.node.classList.add('ypp-hidden-shelf');
                            continue;
                        }
                        if (op.isFlattenable && op.flattenData) {
                            op.node.dataset.yppFlattened = 'true';
                            op.node.classList.add('ypp-flattened-container');
                            if (op.flattenData.shelfContainer) {
                                op.flattenData.shelfContainer.classList.add('ypp-flattened-grid');
                            }
                            for (let j = 0; j < op.flattenData.cards.length; j++) {
                                const card = op.flattenData.cards[j];
                                card.classList.add(CLASSES.GRID_ITEM);
                                this._cleanInlineStyles(card, op.flattenData.cardsCleanData[j]);
                            }
                            continue;
                        }
                        continue;
                    }

                    if (stats.hasVideos || isGridContainer) {
                        if (
                            op.tag === 'ytd-video-renderer'         ||
                            op.tag === 'ytd-compact-video-renderer' ||  // music/song results
                            op.tag === 'ytd-radio-renderer'         ||
                            op.tag === 'ytd-playlist-renderer'      ||
                            op.tag === 'ytd-channel-renderer'       ||
                            op.tag === 'yt-lockup-view-model'       ||
                            op.tag === 'ytd-lockup-view-model'
                        ) {
                            op.node.classList.add(CLASSES.GRID_ITEM, 'ypp-card-container');
                            this._cleanInlineStyles(op.node, op.cleanData);

                            // Move all badges (4K, Subtitles, etc.) into #channel-info so they flow next to the channel name
                            if (op.cleanData && op.cleanData.extraBadges && op.cleanData.channelInfo) {
                                for (let i = 0; i < op.cleanData.extraBadges.length; i++) {
                                    const badge = op.cleanData.extraBadges[i];
                                    if (badge.parentElement !== op.cleanData.channelInfo) {
                                        op.cleanData.channelInfo.appendChild(badge);
                                    }
                                }
                            }
                        } else if (
                            op.tag === 'ytd-ad-slot-renderer' ||
                            op.tag === 'ytd-promoted-sparkles-web-renderer'
                        ) {
                            op.node.style.setProperty('display', 'none', 'important');
                        } else if (!op.node.classList.contains('ypp-flattened-container')) {
                            op.node.classList.add(CLASSES.FULL_WIDTH);
                        }
                    }
                }
            });
        });
    }

    _analyzeSectionChildren(children) {
        let hasVideos = false;
        let allNoise = true;
        let hasTransients = false;
        
        let hasStandardVideos = false;
        let hasShorts = false;
        let hasMixes = false;
        let hasPlaylists = false;
        let hasChannels = false;
        let hasShelves = false;
        
        const { NOISE_TAGS, VIDEO_TAGS } = SearchUtils;

        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            const tag = node.tagName.toLowerCase();

            if (tag === 'ytd-continuation-item-renderer') {
                hasTransients = true;
                continue;
            }
            if (VIDEO_TAGS.has(tag)) {
                hasVideos = true;
                allNoise = false;
                
                // Detailed classification
                if (tag === 'ytd-channel-renderer') {
                    hasChannels = true;
                } else if (tag === 'ytd-radio-renderer' || node.querySelector("a[href*='start_radio']") || node.querySelector("a[href*='list=RD']")) {
                    hasMixes = true;
                } else if (tag === 'ytd-playlist-renderer' || node.querySelector("a[href*='list=PL']")) {
                    hasPlaylists = true;
                } else if (SearchUtils.isShorts(node)) {
                    hasShorts = true;
                } else {
                    hasStandardVideos = true;
                }
            } else if (!NOISE_TAGS.has(tag)) {
                allNoise = false;
                hasStandardVideos = true; // Unknown elements treated as standard to avoid accidental hiding
            } else {
                // Noise tags
                if (tag === 'ytd-reel-shelf-renderer' || SearchUtils.isShorts(node)) {
                    hasShorts = true;
                } else {
                    hasShelves = true;
                }
            }
        }
        return { hasVideos, allNoise, hasTransients, hasStandardVideos, hasShorts, hasMixes, hasPlaylists, hasChannels, hasShelves };
    }

    _handleNoiseSection(section, stats, childCount) {
        // Clear previous smart tags
        section.classList.remove('ypp-noise-section', 'ypp-shorts-section', 'ypp-channel-section', 'ypp-mix-section', 'ypp-playlist-section', 'ypp-shelf-section');
        
        if (childCount === 0 || stats.hasTransients) return false;

        // Legacy support
        if (stats.allNoise) {
            section.classList.add('ypp-noise-section');
        }

        // Apply smart tags IF there are no standard videos in this section
        if (!stats.hasStandardVideos) {
            if (stats.hasShorts) section.classList.add('ypp-shorts-section');
            if (stats.hasChannels) section.classList.add('ypp-channel-section');
            if (stats.hasMixes) section.classList.add('ypp-mix-section');
            if (stats.hasPlaylists) section.classList.add('ypp-playlist-section');
            if (stats.hasShelves) section.classList.add('ypp-shelf-section');
        }
        
        return true;
    }

    // -------------------------------------------------------------------------
    // Inline style cleanup
    // -------------------------------------------------------------------------

    _cleanInlineStyles(node, data) {
        if (node.style.width)    node.style.width    = '';
        if (node.style.maxWidth) node.style.maxWidth = '';
        if (node.style.minWidth) node.style.minWidth = '';
        if (node.style.height)   node.style.height   = '';
        if (node.style.margin)   node.style.margin   = '';

        if (!data) return;

        if (data.dismissible) {
            data.dismissible.style.display       = '';
            data.dismissible.style.flexDirection = '';
            data.dismissible.style.width         = '';
            data.dismissible.style.height        = '';
        }

        if (data.thumb) {
            data.thumb.style.width       = '';
            data.thumb.style.minWidth    = '';
            data.thumb.style.maxWidth    = '';
            data.thumb.style.height      = '';
            data.thumb.style.margin      = '';
            data.thumb.style.marginRight = '';
            data.thumb.style.flexBasis   = '';
            data.thumb.style.flexShrink  = '';

            if (data.innerThumb) {
                data.innerThumb.style.width    = '';
                data.innerThumb.style.height   = '';
                data.innerThumb.style.maxWidth = '';
            }
        }

        if (data.textWrapper) {
            data.textWrapper.style.marginLeft  = '';
            data.textWrapper.style.marginRight = '';
            data.textWrapper.style.marginTop   = '';
            data.textWrapper.style.width       = '';
            data.textWrapper.style.maxWidth    = '';
        }

        if (data.actionMenu) {
            data.actionMenu.style.width    = '';
            data.actionMenu.style.height   = '';
            data.actionMenu.style.position = '';
        }
    }

    // -------------------------------------------------------------------------
    // Utility
    // -------------------------------------------------------------------------

    _logError(msg, error) {
        if (window.YPP?.Utils?.log) {
            window.YPP.Utils.log(msg, 'SEARCH', 'warn', error);
        } else {
            console.warn(`[SearchObserver] ${msg}`, error);
        }
    }
}

window.YPP.features.SearchObserver = SearchObserver;
