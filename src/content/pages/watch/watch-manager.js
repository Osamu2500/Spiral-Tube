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

  async onActivate() {
    this.utils.log('Watch Page Active', 'WATCH_MANAGER', 'info');
    // Clear any stale data-ypp-processed stamps from a previous session/navigation
    // so the shared observer and injection retry loops can re-fire cleanly.
    document.querySelectorAll('[data-ypp-processed="true"]').forEach(el => el.removeAttribute('data-ypp-processed'));
    // Wait until featureManager has finished instantiating features so that
    // feature instances (VolumeBooster, VideoFilters, BookmarksManager etc.)
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
        this.settingsMenuHelper = new window.YPP.features.PlayerSettingsMenu(this);
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
        seamlessMode: window.YPP.features.SeamlessMode
          ? new window.YPP.features.SeamlessMode()
          : null,
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

    if (this.features) {
      Object.values(this.features).forEach((feature) => {
        if (feature?.disable) feature.disable();
      });
    }
  }

  updateSettings(newSettings) {
    super.updateSettings(newSettings);
    if (this.isActive && this.playerBarUI) {
      // Clear processed stamps so the DOM observer can re-fire if YouTube re-renders the player bar
      document
        .querySelectorAll('[data-ypp-processed="true"]')
        .forEach((el) => el.removeAttribute('data-ypp-processed'));
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
    else if (this.settings.cinemaMode) newMode = 'cinema';
    else if (this.settings.minimalMode) newMode = 'minimal';
    else if (this.settings.seamlessMode) newMode = 'seamless';

    this.setState({
      sidebar: newSidebar,
      viewMode: newMode,
    });

    // Handle specific mode feature JS logic
    if (this.features) {
      if (newMode === 'zen') this.features.zenMode?.enable();
      else this.features.zenMode?.disable();

      if (newMode === 'study') this.features.studyMode?.enable();
      else this.features.studyMode?.disable();

      if (newMode === 'focus') this.features.focusMode?.enable();
      else this.features.focusMode?.disable();

      if (newMode === 'seamless') this.features.seamlessMode?.enable();
      else this.features.seamlessMode?.disable();
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
    const body = document.body;

    // 1. Reset all managed classes & Inline Styles
    const classesToRemove = [
      'ypp-sidebar-dense',
      'ypp-sidebar-compact',
      'ypp-sidebar-regular',
      'ypp-sidebar-spacious',
      'ypp-sidebar-expanded',
      'ypp-sidebar-grid',
      'ypp-sidebar-hidden',
      'ypp-cinema-mode',
      'ypp-minimal-mode',
      'ypp-zen-mode',
      'ypp-focus-mode',
      'ypp-study-mode',
      'ypp-seamless-mode',
    ];
    body.classList.remove(...classesToRemove);

    // 2. Apply Sidebar
    if (this.settings.enableCustomSidebar) {
      // Custom sidebar is ON — apply chosen layout
      if (this.state.sidebar === 'dense') {
        body.classList.add('ypp-sidebar-dense');
      } else if (this.state.sidebar === 'compact' || this.state.sidebar === 'default') {
        body.classList.add('ypp-sidebar-compact');
      } else if (this.state.sidebar === 'regular') {
        body.classList.add('ypp-sidebar-regular');
      } else if (this.state.sidebar === 'spacious') {
        body.classList.add('ypp-sidebar-spacious');
      } else if (this.state.sidebar === 'expanded') {
        body.classList.add('ypp-sidebar-expanded');
      } else if (this.state.sidebar === 'grid') {
        body.classList.add('ypp-sidebar-grid');
      }
    }

    if (this.state.sidebar === 'hidden' || ['zen', 'focus'].includes(this.state.viewMode)) {
      body.classList.add('ypp-sidebar-hidden'); // Force hide sidebar in extreme modes
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
      // Note: 'ypp-sidebar-spacious' is the current name — 'compact' was the old name
      'ypp-sidebar-dense',
      'ypp-sidebar-compact',
      'ypp-sidebar-regular',
      'ypp-sidebar-spacious',
      'ypp-sidebar-expanded',
      'ypp-sidebar-grid',
      'ypp-sidebar-hidden',
      'ypp-cinema-mode',
      'ypp-minimal-mode',
      'ypp-zen-mode',
      'ypp-focus-mode',
      'ypp-study-mode',
      'ypp-theater-mode-override',
    ];
    document.body.classList.remove(...classesToRemove);
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
        100
      ); // Reduced from 500ms → 100ms for faster button injection

      if (elements) {
        const { video, controls, isShorts } = elements;
        this._videoElement = video;

        // Need to ensure features are initialized before injecting controls!
        await this._initFeatures();
        if (this.playerBarUI) this.playerBarUI.enable();

        this.playerBarUI.injectControls(video, controls, isShorts);
        this._startMonitoring();

        // YouTube renders the player in multiple phases on cold load.
        // The first render may be a skeleton that gets replaced by the full player.
        // Re-inject at staggered intervals to guarantee persistence.
        const retryInjection = () => {
          if (!this.isActive) return;
          // Clear processed stamps so the DOM observer can also re-fire
          document
            .querySelectorAll('[data-ypp-processed="true"]')
            .forEach((el) => el.removeAttribute('data-ypp-processed'));
          if (this.playerBarUI) {
            this.playerBarUI.updateCustomStyles();
            this.playerBarUI.injectedButtons = false;
            this.playerBarUI.attemptInjection();
          }
        };
        setTimeout(retryInjection, 800);
        setTimeout(retryInjection, 2000);
        setTimeout(retryInjection, 4000);
        setTimeout(retryInjection, 6000);
      }
    } catch (error) {
      Utils.log('Player initialization timed out or failed', 'WATCH_MANAGER', 'debug');
    }
  }

  _startMonitoring() {
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

    // Listen for SPA navigation and player state changes to clear the processed stamps so buttons are re-injected
    if (!this._hasNavListener) {
      const resetProcessed = () => {
        document.querySelectorAll('[data-ypp-processed="true"]').forEach((el) => {
          el.removeAttribute('data-ypp-processed');
        });
        if (this.playerBarUI) {
          this.playerBarUI.updateCustomStyles();
          this.playerBarUI.injectedButtons = false;
          this.playerBarUI.attemptInjection();
        }
      };
      ['yt-navigate-finish', 'yt-page-data-updated', 'yt-player-updated', 'yt-player-state-change', 'yt-page-type-changed'].forEach(evt => {
        window.addEventListener(evt, resetProcessed);
        document.addEventListener(evt, resetProcessed);
      });
      this._hasNavListener = true;
    }
  }

  injectControls(video, controls, isShorts) {
    this.playerBarUI.injectControls(video, controls, isShorts);
  }

  // Methods moved to PlayerBarUI

  _cleanupPlayer() {
    if (this.playerBarUI) this.playerBarUI.cleanup();
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
    if (this.settingsMenuHelper) {
      this.settingsMenuHelper.cleanupSettingsObserver();
    }

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
