import '../../../core/system/base-page-manager.js';
/**
 * @fileoverview
 * Watch Page Manager for Spiral Tube
 * 
 * Target: /watch and /shorts routes.
 * Purpose: Manages the lifecycle, DOM updates, layout modes (Zen, Cinema, etc.), 
 * and Player Bar UI injection for the YouTube watch page.
 * 
 * This file acts as the coordinator for all watch-related features and styles.
 * It is completely isolated to the watch page and does not affect other routes.
 */

class WatchPageManager extends window.YPP.BasePageManager {
  constructor(utils, settings) {
    super(utils, settings);
    this.matchPatterns = [/^\/watch/, /^\/shorts/];

    this.state = {
      sidebar: 'default', // 'default', 'compact', 'hidden'
      viewMode: 'default', // 'default', 'cinema', 'minimal', 'zen', 'focus', 'study'
      enableCustomSidebar: true,
    };

    this.ROOT_SELECTORS = [
      'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer',
      'ytd-watch-next-secondary-results-renderer yt-lockup-view-model',
      'ytd-watch-next-secondary-results-renderer ytd-lockup-view-model',
      'ytd-watch-next-secondary-results-renderer ytd-rich-item-renderer',
    ];

    this.injectedButtons = false;
    this._videoElement = null;
    this._featuresInitialized = false;
    this.eventListeners = [];

    // Initialize Player Bar UI
    this.playerBarUI = new window.YPP.features.PlayerBarUI(this);
  }

  /**
   * Override activate() to distinguish between a full page entry (e.g. home→watch)
   * and a same-type SPA navigation (e.g. watch→watch / video switch).
   * 
   * On video switch: skip the heavy re-initialization (pollFor, _initPlayer, etc.)
   * and only do a lightweight player bar check + settings re-apply.
   */
  activate(url) {
    const isAlreadyOnWatch = this.isActive && window.location.pathname.startsWith('/watch');
    if (isAlreadyOnWatch) {
      // Lightweight video-switch path — update URL reference and re-apply settings only
      this.currentUrl = url;
      this._onVideoSwitch();
      return;
    }
    // Full activation path — delegate to base class which calls onActivate() + applySettings()
    super.activate(url);
  }

  /**
   * Lightweight handler for watch→watch SPA navigation (video switch).
   * Only re-checks player bar injection without re-running heavy setup.
   */
  _onVideoSwitch() {
    this.utils.log('Watch Page: Video switch detected', 'WATCH_MANAGER', 'debug');
    // Only reset player-specific processed stamps, not ALL ypp-processed elements
    document.querySelectorAll(
      '.ytp-chrome-bottom[data-ypp-processed], .ytp-right-controls[data-ypp-processed], ytd-reel-video-renderer[data-ypp-processed]'
    ).forEach(el => el.removeAttribute('data-ypp-processed'));

    if (this.playerBarUI) {
      this.playerBarUI.injectedButtons = false;
      this.playerBarUI.attemptInjection();
    }
    // Re-apply DOM state (e.g. sidebar size, view mode) in case YouTube wiped body classes
    if (this._domApplied) {
      this._applyDOM();
    }
  }

  async onActivate() {
    this.utils.log('Watch Page Active (full init)', 'WATCH_MANAGER', 'info');
    // Clear player-specific processed stamps only — not ALL ypp-processed elements
    document.querySelectorAll(
      '.ytp-chrome-bottom[data-ypp-processed], .ytp-right-controls[data-ypp-processed], ytd-reel-video-renderer[data-ypp-processed]'
    ).forEach(el => el.removeAttribute('data-ypp-processed'));
    // Wait until featureManager has finished instantiating features so that
    // feature instances (Equaliser, VideoFilters, BookmarksManager etc.)
    // exist when injectControls() tries to build buttons for the player bar.
    // Without this, getFeature() returns null and buttons are silently skipped.
    try {
      await this.utils.pollFor(() => window.YPP?.featureManager?.instantiated, 3000, 50);
    } catch (e) { /* continue anyway — pollFor rejects on timeout */ }
    if (this.playerBarUI) this.playerBarUI.enable();
    // NOTE: _applyDOM() is NOT called here directly.
    // The base class activate() calls applySettings() immediately after onActivate(),
    // which calls setState() → _applyDOM(). Calling it here too would cause a double DOM apply.
    this._initFeatures(); // async — will call applySettings again once features load
    this._initPlayer(); // async — waits for video element
    if (this.filterBar) window.YPP.ui.manager.mount('watchPageTop', this.filterBar, 'prepend');
  }

  async _initFeatures() {
    if (this._featuresInitialized || this._featuresInitializing) return;
    this._featuresInitializing = true;
    // Use pollFor instead of setTimeout — reliable across fast and slow machines
    try {
      await this.utils.pollFor(() => window.YPP?.features?.PlayerControls, 5000, 100);
      if (window.YPP?.features?.PlayerControls) {
        this.controlsHelper = new window.YPP.features.PlayerControls(this);
      } else {
        this.utils.log(
          'PlayerControls feature unavailable — core player features may not load',
          'WATCH_MANAGER',
          'error'
        );
      }
      this.features = {
        zenMode: window.YPP.features.ZenMode ? new window.YPP.features.ZenMode() : null,
        studyMode: window.YPP.features.StudyMode ? new window.YPP.features.StudyMode() : null,
        focusMode: window.YPP.features.FocusMode ? new window.YPP.features.FocusMode() : null,
        seamlessMode: window.YPP.features.SeamlessMode ? new window.YPP.features.SeamlessMode() : null,
        ambientMode: window.YPP.features.AmbientMode ? new window.YPP.features.AmbientMode() : null,
        realCinemaMode: window.YPP.features.RealCinemaMode ? new window.YPP.features.RealCinemaMode() : null,
      };
      this._featuresInitialized = true;
      this._featuresInitializing = false;
      // Re-apply settings now that mode features are loaded and can be enabled/disabled
      if (this.isActive) this.applySettings(this.settings);
    } catch (e) {
      this.utils.log('Feature init timed out', 'WATCH_MANAGER', 'warn');
      this._featuresInitializing = false;
    }
  }

  onDeactivate() {
    this._cleanupDOM();
    this._cleanupPlayer();
    this._domApplied = false; // Reset so next activation always re-applies DOM
    this._monitoringStarted = false; // Reset so _startMonitoring re-registers on next activation

    if (this.features) {
      Object.values(this.features).forEach((feature) => {
        if (feature?.disable) feature.disable();
      });
    }
  }

  updateSettings(newSettings) {
    super.updateSettings(newSettings);
    if (this.isActive && this.playerBarUI) {
      this.playerBarUI.updateCustomStyles();
      this.playerBarUI.injectedButtons = false;
      // forceRebuild=true: settings changed, so always rebuild the button container
      // even if buttons are still present in the DOM from a previous injection
      this.playerBarUI.attemptInjection(true);
    }
  }

  applySettings(settings) {
    this.settings = { ...this.settings, ...settings };
    if (!this.isActive) return;

    if (this.playerBarUI) {
      this.playerBarUI.updateCustomStyles();
      this.playerBarUI.injectedButtons = false;
      // forceRebuild=true: always rebuild on settings apply so changed visibility
      // settings (front/back/hidden) take effect without requiring a page refresh
      this.playerBarUI.attemptInjection(true);
    }

    let newSidebar = 'default';
    let newMode = 'default';

    if (this.settings.sidebarLayout) {
      newSidebar = this.settings.sidebarLayout;
    }

    // Evaluate view modes (priority order)
    // NOTE: key is 'enableFocusMode' not 'focusMode' — must match default-settings.js
    if (this.settings.studyMode) newMode = 'study';
    else if (this.settings.enableFocusMode) newMode = 'focus';
    else if (this.settings.zenMode) newMode = 'zen';
    else if (this.settings.realCinemaMode) newMode = 'realcinema';
    else if (this.settings.cinemaMode) newMode = 'cinema';
    else if (this.settings.minimalMode) newMode = 'minimal';
    else if (this.settings.seamlessMode) newMode = 'seamless';

    this.setState({
      sidebar: newSidebar,
      viewMode: newMode,
    });

    // Handle specific mode feature JS logic using BaseFeature's update() to ensure correct lifecycle
    if (this.features) {
      const modeSettings = { ...this.settings };
      // Force mutual exclusivity for layout modes, but keep ambientMode independent
      modeSettings.zenMode = (newMode === 'zen');
      modeSettings.studyMode = (newMode === 'study');
      modeSettings.enableFocusMode = (newMode === 'focus');
      modeSettings.seamlessMode = (newMode === 'seamless');
      modeSettings.realCinemaMode = (newMode === 'realcinema');
      // ambientMode remains as it was in this.settings

      Object.values(this.features).forEach(feature => {
        if (feature && typeof feature.update === 'function') {
          feature.update(modeSettings);
        }
      });
    }
  }
  setState(newState) {
    let changed = false;
    for (const [key, value] of Object.entries(newState)) {
      if (this.state[key] !== value) {
        this.state[key] = value;
        changed = true;
      }
    }

    // Also check if enableCustomSidebar changed
    if (this.state.enableCustomSidebar !== this.settings.enableCustomSidebar) {
      this.state.enableCustomSidebar = this.settings.enableCustomSidebar;
      changed = true;
    }

    // Always apply on first call after activation, or when state changed
    if (this.isActive && (changed || !this._domApplied)) {
      this._domApplied = true;
      this._applyDOM();
    }
  }

  _applyDOM() {
    if (window !== window.top) return; // Do not apply heavy layout classes in iframes (e.g. Popup Player)
    const body = document.body;

    // 1. Reset all managed classes & Inline Styles
    const classesToRemove = [
                                                                  'ypp-cinema-mode',
      'ypp-minimal-mode',
      'ypp-zen-mode',
      'ypp-focus-mode',
      'ypp-study-mode',
      'ypp-seamless-mode',
      'ypp-theater-mode-override',
      'ypp-real-cinema-mode'
    ];
    body.classList.remove(...classesToRemove);

    // 2. Apply Sidebar
    const isCustomSidebarEnabled = String(this.settings.enableCustomSidebar) === 'true';

    if (this.state.viewMode === 'seamless') {
      // Seamless mode handles its own layout, so strip any custom sidebar size
      body.removeAttribute("data-ypp-sidebar-size");
    } else {
      if (isCustomSidebarEnabled) {
        // Custom sidebar is ON — apply chosen layout
        if (this.state.sidebar === 'dense') {
          body.setAttribute("data-ypp-sidebar-size", "dense");
        } else if (this.state.sidebar === 'macro') {
          body.setAttribute("data-ypp-sidebar-size", "macro");
        } else if (this.state.sidebar === 'mini') {
          body.setAttribute("data-ypp-sidebar-size", "mini");
        } else if (this.state.sidebar === 'compact' || this.state.sidebar === 'default') {
          body.setAttribute("data-ypp-sidebar-size", "compact");
        } else if (this.state.sidebar === 'regular') {
          body.setAttribute("data-ypp-sidebar-size", "regular");
        } else if (this.state.sidebar === 'spacious') {
          body.setAttribute("data-ypp-sidebar-size", "spacious");
        } else if (this.state.sidebar === 'huge') {
          body.setAttribute("data-ypp-sidebar-size", "huge");
        } else if (this.state.sidebar === 'expanded') {
          body.setAttribute("data-ypp-sidebar-size", "expanded");
        } else if (this.state.sidebar === 'grid') {
          body.setAttribute("data-ypp-sidebar-size", "grid");
        }
      } else {
        // If custom sidebar is off, remove the attribute to revert to YouTube default
        body.removeAttribute("data-ypp-sidebar-size");
      }

      if (this.state.sidebar === 'hidden' || ['zen', 'focus'].includes(this.state.viewMode)) {
        body.setAttribute("data-ypp-sidebar-size", "hidden"); // Force hide sidebar in extreme modes
      }
    }

    // Force YouTube player to recalculate layout without blocking the main thread
    if (window.requestIdleCallback) {
      requestIdleCallback(() => window.dispatchEvent(new Event('resize')), { timeout: 300 });
    } else {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }

    // 3. Apply View Mode
    if (this.state.viewMode !== 'default') {
      body.classList.add(`ypp-${this.state.viewMode}-mode`);
    }

    // Emit event for isolated features (like ZenMode canvas or StudyMode timer) to start/stop
    window.dispatchEvent(
      new CustomEvent('ypp-watch-mode-changed', {
        detail: { mode: this.state.viewMode },
      })
    );

    // Cinema Mode - Auto scroll to top of player
    if (this.state.viewMode === 'cinema') {
      const player =
        document.querySelector('#player-container-outer') || document.querySelector('ytd-player');
      if (player) {
        setTimeout(() => {
          player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }

  _cleanupDOM() {
    const classesToRemove = [
      'ypp-cinema-mode',
      'ypp-minimal-mode',
      'ypp-zen-mode',
      'ypp-focus-mode',
      'ypp-study-mode',
      'ypp-seamless-mode',
      'ypp-theater-mode-override',
      'ypp-real-cinema-mode'
    ];
    document.body.classList.remove(...classesToRemove);
    document.body.removeAttribute("data-ypp-sidebar-size");
    if (window.requestIdleCallback) {
      requestIdleCallback(() => window.dispatchEvent(new Event('resize')), { timeout: 300 });
    } else {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }
  }

  // ==========================================
  // PLAYER BAR INTEGRATION
  // ==========================================

  async _initPlayer() {
    const Utils = this.utils;
    if (!Utils) return;

    try {
      const elements = await Utils.pollFor(
        () => {
          const isShorts = window.location.pathname.startsWith('/shorts');
          if (isShorts) {
            const video = document.querySelector('ytd-reel-video-renderer[is-active] video');
            const controls = document.querySelector(
              'ytd-reel-video-renderer[is-active] .overlay.ytd-reel-video-renderer'
            );
            if (video && controls) return { video, controls, isShorts };
          } else {
            const video = document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]);
            // Target .ytp-chrome-bottom as it is universally present in all YouTube UI versions
            const controls = document.querySelector(window.YPP.CONSTANTS.SELECTORS.PLAYER_BAR);
            if (video && controls) return { video, controls, isShorts };
          }
          return null;
        },
        10000,
        50 // Increased to 50ms to save CPU cycles during the heavy video load phase while still feeling instant
      );

      if (elements) {
        const { video, controls, isShorts } = elements;
        this._videoElement = video;

        // Need to ensure features are initialized before injecting controls!
        await this._initFeatures();
        if (this.playerBarUI) this.playerBarUI.enable();

        this.playerBarUI.injectControls(video, controls, isShorts);
        this._startMonitoring();
        // PlayerBarUI._scheduleRetry() handles exponential-backoff re-injection;
        // no scattered setTimeout chains needed here.
      }
    } catch (error) {
      Utils.log('Player initialization timed out or failed', 'WATCH_MANAGER', 'debug');
    }
  }

  _startMonitoring() {
    // Hard guard: if already started, never register listeners twice.
    // _initPlayer can be called multiple times (onActivate + _initFeatures),
    // so a simple boolean flag checked first prevents double-registration.
    if (this._monitoringStarted) return;
    this._monitoringStarted = true;

    if (!window.YPP?.sharedObserver) return;

    window.YPP.sharedObserver.register(
      'player_shorts',
      'ytd-reel-video-renderer[is-active]:not([data-ypp-processed])',
      (elements) => {
        if (!this.isActive) return;
        const activeShort = elements[0];
        document.querySelectorAll('.ypp-player-controls').forEach((e) => e.remove());
        const video = activeShort.querySelector('video');
        const controls = activeShort.querySelector('.overlay.ytd-reel-video-renderer');
        if (video && controls) {
          this.playerBarUI.injectControls(video, controls, true);
          activeShort.setAttribute('data-ypp-processed', 'true');
        }
      },
      true
    );

    // Target .ytp-chrome-bottom and .ytp-right-controls for maximum stability across UI A/B tests and cold load replacements
    window.YPP.sharedObserver.register(
      'player_watch',
      '.ytp-chrome-bottom:not([data-ypp-processed]), .ytp-right-controls:not([data-ypp-processed])',
      (elements) => {
        if (!this.isActive || window.location.pathname.startsWith('/shorts')) return;
        const target = elements[0];
        const controls = target.closest('.ytp-chrome-bottom') || target;
        const video = document.querySelector('video');
        if (video && controls) {
          this.playerBarUI.injectControls(video, controls, false);
          controls.setAttribute('data-ypp-processed', 'true');
          if (target !== controls) target.setAttribute('data-ypp-processed', 'true');
        }
      },
      true
    );

    // Listen for SPA navigation and player state changes.
    // Only reset player-specific processed stamps on yt-page-type-changed.
    // Scoping to player elements prevents the global DOM sweep that caused the 10-15s freeze.
    let debounceTimer;
    const resetProcessed = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Only clear player bar stamps — not ALL ypp-processed elements site-wide
        document.querySelectorAll(
          '.ytp-chrome-bottom[data-ypp-processed], .ytp-right-controls[data-ypp-processed], ytd-reel-video-renderer[data-ypp-processed]'
        ).forEach((el) => {
          el.removeAttribute('data-ypp-processed');
        });
        if (this.playerBarUI) {
          this.playerBarUI.updateCustomStyles();
          this.playerBarUI.injectedButtons = false;
          this.playerBarUI.attemptInjection();
        }
      }, 200);
    };
    ['yt-page-type-changed'].forEach(evt => {
      this.addListener(window, evt, resetProcessed);
    });
  }

  injectControls(video, controls, isShorts) {
    this.playerBarUI.injectControls(video, controls, isShorts);
  }

  // Methods moved to PlayerBarUI

  _cleanupPlayer() {
    if (this.playerBarUI) this.playerBarUI.disable();
    this._cleanupEvents();

    if (window.YPP?.sharedObserver) {
      window.YPP.sharedObserver.unregister('player_shorts');
      window.YPP.sharedObserver.unregister('player_watch');
    }
    document
      .querySelectorAll(
        '.ytp-right-controls[data-ypp-processed], .ytp-chrome-bottom[data-ypp-processed], ytd-reel-video-renderer[data-ypp-processed]'
      )
      .forEach((el) => el.removeAttribute('data-ypp-processed'));

    this._videoElement = null;

    const styleNode = document.getElementById('ypp-custom-player-bar-styles');
    if (styleNode) styleNode.remove();

    const visNode = document.getElementById('ypp-custom-player-bar-style-vis');
    if (visNode) visNode.remove();
  }

  addListener(target, event, handler, options = false) {
    if (!target || !target.addEventListener) return;
    target.addEventListener(event, handler, options);
    if (!this.eventListeners) this.eventListeners = [];
    this.eventListeners.push({ target, event, handler, options });
  }

  _cleanupEvents() {
    if (!this.eventListeners) return;
    this.eventListeners.forEach(({ target, event, handler, options }) => {
      try {
        if (target.removeEventListener) target.removeEventListener(event, handler, options);
      } catch (e) {}
    });
    this.eventListeners = [];
  }
}

window.YPP = window.YPP || {};
window.YPP.managers = window.YPP.managers || {};
window.YPP.managers.WatchPageManager = WatchPageManager;
