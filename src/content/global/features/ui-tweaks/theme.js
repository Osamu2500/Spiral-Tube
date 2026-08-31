/**
 * Theme Manager - Handles visual theming and content visibility features
 * Uses centralized constants for configuration
 */
import '../../../core/system/base-feature.js';



/**
 * Theme Manager
 * @class ThemeManager
 */
export class ThemeManager extends window.YPP.features.BaseFeature {
    static featureId = 'themeManager';
    static executionPhase = 'idle';
    static priority = 999;

    /**
     * Initialize Theme Manager
     * @constructor
     */
    constructor() {
        super('ThemeManager');
        this._initConstants();
        this._initState();
    }

    /**
     * ThemeManager is always active — it manages its own internal on/off
     * state via _toggleTheme(). Returning null here prevents BaseFeature
     * from ever calling disable() due to premiumTheme being accidentally
     * toggled off in user settings.
     */
    getConfigKey() {
        return null;
    }

    /**
     * Initialize constants from centralized config
     * @private
     */
    _initConstants() {
        this._CONSTANTS = window.YPP.CONSTANTS || {};
        this._SELECTORS = this._CONSTANTS.SELECTORS || {};
        this._CSS_CLASSES = this._CONSTANTS.CSS_CLASSES || {};
        this._GRID = this._CONSTANTS.GRID || {};
        this._TIMINGS = this._CONSTANTS.TIMINGS || {};
        this._Utils = window.YPP.Utils || {};
    }

    _initState() {
        this._isActive = false;
        this._settings = null;
        this._startObservers();
    }
    
    /**
     * Start observing for the body tag to be created and enforce root attributes
     * @private
     */
    _startObservers() {
        if (this._rootObserver) return;
        this._rootObserver = new MutationObserver((mutations) => {
            let attributesWiped = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === 'BODY' || node === document.body) {
                            // Re-run theme manager when body is created/replaced
                            this.onUpdate();
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    // Check if our critical class was removed
                    if (mutation.attributeName === 'class' && this._isActive) {
                        if (!document.documentElement.classList.contains(this._CSS_CLASSES.THEME_ENABLED)) {
                            attributesWiped = true;
                        }
                    }
                    // Check if our custom data attributes were removed
                    if (mutation.attributeName.startsWith('data-ypp-') && this._isActive) {
                        if (!document.documentElement.hasAttribute(mutation.attributeName)) {
                            attributesWiped = true;
                        }
                    }
                }
            }
            
            if (attributesWiped && !this._isRestoringAttributes) {
                this._Utils.log('YouTube wiped theme attributes. Restoring...', 'THEME', 'debug');
                this._isRestoringAttributes = true;
                
                // Re-apply theme state
                try {
                    if (this._settings) {
                        this._toggleTheme(true);
                        this._applyUiStyle(this._settings.youtubePageTheme);
                        if (this._currentThemeKey) {
                            document.documentElement.setAttribute('data-ypp-theme', this._currentThemeKey);
                        }
                    }
                } catch(e) {}
                
                // Allow the browser to process mutations before listening again
                setTimeout(() => {
                    this._isRestoringAttributes = false;
                }, 50);
            }
        });
        
        // Ensure document.documentElement exists before observing
        if (document.documentElement) {
            this._rootObserver.observe(document.documentElement, { 
                childList: true,
                attributes: true,
                attributeFilter: ['class', 'data-ypp-theme', 'data-ypp-ui-design', 'data-ypp-ui-style']
            });
        }
    }

    /**
     * Enable theme features
     */
    enable() {
        this._run(this.settings);
    }

    /**
     * Disable all theme features
     */
    disable() {
        try {
            this._toggleTheme(false);
            this._cleanupClasses();
            this._cleanupCustomVariables();

            if (this._themeObserver) {
                this._themeObserver.disconnect();
                this._themeObserver = null;
            }

            this._isActive = false;
        } catch (error) {
            this._Utils.log?.(`Error disabling theme: ${error.message}`, 'THEME', 'error');
        }
    }

    /**
     * Update theme with new settings
     */
    onUpdate() {
        this._run(this.settings);
    }

    // =========================================================================
    // PRIVATE METHODS
    // =========================================================================

    /**
     * Run theme application
     * @private
     * @param {Object} settings
     */
    _run(settings) {
        this._settings = settings || {};
        this._isActive = true;

        try {
            // Apply colour theme (e.g. forest.css, midnight.css)
            this._toggleTheme(true);

            // Apply UI style overlay (e.g. nature.css, ocean.css from ui-styles/)
            this._applyUiStyle(this._settings.youtubePageTheme);

            // Apply global customizations (Typography, density, accent color, etc)
            this._applyCustomizationSettings();

        } catch (error) {
            this._Utils.log?.(`Error running theme: ${error.message}`, 'THEME', 'error');
        }
    }

    /**
     * Toggle the theme based on settings.
     * Handles premium theme, true black (legacy), and new multi-themes.
     * @param {boolean} enable - Whether premium theme is enabled
     */
    _toggleTheme(enable) {
        const root = document.documentElement;
        const body = document.body;
        
        // Toggle base premium class
        root.classList.toggle(this._CSS_CLASSES.THEME_ENABLED, enable);
        
        // Always add ypp-theme-effects when premium theme is enabled so the gradient backgrounds always show.
        root.classList.toggle('ypp-theme-effects', enable);
        
        // Use a separate class to disable the animations if the user turns off "Theme Effects"
        const enableEffects = this._settings.enableThemeEffects !== false;
        root.classList.toggle('ypp-no-theme-animations', !enableEffects && enable);
        
        if (body) body.classList.toggle(this._CSS_CLASSES.THEME_ENABLED, enable);

        this._Utils.log(`Toggling theme: ${enable ? 'ON' : 'OFF'}`, 'THEME');

        if (enable) {
            // Determine active theme
            let activeThemeKey = this._settings.activeTheme || 'default';
            const ytTheme = this._settings.youtubePageTheme;

            // Auto-match color theme to UI Design if not explicitly overridden by the user
            if (!this._settings.activeTheme || this._settings.activeTheme === 'default') {
                if (ytTheme && ytTheme !== 'default') {
                    // Map UI styles to their corresponding color themes (most are 1:1)
                    const themeMap = {
                        'liquid-glass': 'glassmorphism'
                    };
                    activeThemeKey = themeMap[ytTheme] || ytTheme;
                }
            }

            // Legacy support: if trueBlack is on and theme is default, use midnight
            if (this._settings.trueBlack === true && activeThemeKey === 'default') {
                this._Utils.log('Legacy True Black enabled -> Forcing Midnight theme', 'THEME');
                activeThemeKey = 'midnight';
            }

            // Handle System Theme
            if (activeThemeKey === 'system') {
                this._handleSystemTheme();
                return; // _handleSystemTheme will call _injectThemeFile
            } else {
                // If not system, stop listening for system changes
                this._stopSystemListener();
            }
            
            this._applyTheme(activeThemeKey);

        } else {
            this._stopSystemListener();
            this._removeThemeFile();
            this._currentThemeKey = null;
        }
    }

    /**
     * Handle System Theme logic
     * @private
     */
    _handleSystemTheme() {
        if (!this._systemMediaQuery) {
            this._systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this._systemListener = (e) => {
                const newTheme = e.matches ? 'midnight' : 'ocean'; // Default mapping: Dark -> Midnight, Light -> Ocean (or default)
                // Actually, let's map: Dark -> Midnight (OLED), Light -> Default (Premium)
                // Or better: Let user decide? For now, hardcode sensible defaults.
                // YouTube is mostly dark. 'default' is the Premium Dark.
                // Let's use 'default' for Dark and maybe 'ocean' for light? 
                // Wait, YouTube doesn't really have a light theme in this extension context properly supported yet?
                // The extension is "Premium Plus", mostly dark mode oriented.
                // Let's assume System Dark = Midnight, System Light = Default (Premium/Dark-ish) or disable?
                // For safety: System defaults to 'default' (Premium)
                
                this._Utils.log(`System theme changed: ${e.matches ? 'Dark' : 'Light'}`, 'THEME');
                this._applyTheme(e.matches ? 'midnight' : 'default'); 
            };
            
            this.addListener(this._systemMediaQuery, 'change', this._systemListener);
        }

        // Apply initial
        const isDark = this._systemMediaQuery.matches;
        this._applyTheme(isDark ? 'midnight' : 'default');
    }

    /**
     * Stop listening for system theme changes
     * @private
     */
    _stopSystemListener() {
        if (this._systemMediaQuery && this._systemListener) {
            // Handled by BaseFeature cleanupEvents when feature is disabled,
            // but we explicitly remove if toggling themes manually.
            this._systemMediaQuery.removeEventListener('change', this._systemListener);
            this._systemMediaQuery = null;
            this._systemListener = null;
        }
    }

    /**
     * Apply the YouTube UI style overlay from ui-styles/ directory
     * @private
     * @param {string} uiStyleKey  e.g. 'nature', 'liquid-glass', 'ocean'
     */
    _applyUiStyle(uiStyleKey) {
        // If no UI style or 'default', clean up attributes
        if (!uiStyleKey || uiStyleKey === 'default') {
            document.documentElement.removeAttribute('data-ypp-ui-design');
            document.documentElement.removeAttribute('data-ypp-ui-style'); // legacy attribute cleanup
            document.documentElement.removeAttribute('data-ypp-has-bg-image'); // Force clear background
            
            // Clean global styling classes
            document.body.classList.remove('ypp-ui-square-corners');
            document.body.classList.remove('ypp-ui-extra-rounded');
            document.body.classList.remove('ypp-dual-accent-enabled');
            
            this._removeFrutigerBubbles();
            return;
        }

        // Ensure design system bundles are present
        this._injectDesignSystemBundles();

        document.documentElement.setAttribute('data-ypp-ui-design', uiStyleKey);
        document.documentElement.setAttribute('data-ypp-ui-style', uiStyleKey); // legacy compat — some CSS still uses this attribute
        
        // Handle Frutiger Aero specific bubbles (respect Theme Effects toggle)
        const enableEffects = this._settings.enableThemeEffects !== false;
        if (uiStyleKey === 'frutiger-aero' && enableEffects) {
            this._injectFrutigerBubbles();
        } else {
            this._removeFrutigerBubbles();
        }
        
        this._Utils.log(`Injecting UI Style: ${uiStyleKey}`, 'THEME');
    }
    
    /**
     * Inject HTML bubbles for Frutiger Aero theme
     * @private
     */
    _injectFrutigerBubbles() {
        const id = 'ypp-frutiger-bubbles';
        if (document.getElementById(id)) return;

        const container = document.createElement('div');
        container.id = id;
        container.className = 'frutiger-bubbles-container';
        // Ensure it always stays behind the main content (especially videos)
        container.style.zIndex = '0';

        // Add 50 bubbles with randomized properties
        for (let i = 0; i < 50; i++) {
            const span = document.createElement('span');
            span.className = 'fa-bubble';
            
            const size = Math.random() * 60 + 10; // 10px to 70px
            const left = Math.random() * 100; // 0% to 100vw
            const delay = Math.random() * 20; // 0s to 20s
            const durationY = Math.random() * 10 + 10; // 10s to 20s
            const durationX = Math.random() * 5 + 3; // 3s to 8s
            
            span.style.width = `${size}px`;
            span.style.height = `${size}px`;
            span.style.left = `${left}vw`;
            span.style.bottom = `-${size + 20}px`; // Start below the screen
            span.style.animationDuration = `${durationY}s, ${durationX}s`;
            span.style.animationDelay = `${delay}s, ${delay}s`;
            
            container.appendChild(span);
        }

        // Insert at the beginning of body to ensure it stays behind UI elements
        document.body.insertBefore(container, document.body.firstChild);
    }

    /**
     * Remove HTML bubbles
     * @private
     */
    _removeFrutigerBubbles() {
        const container = document.getElementById('ypp-frutiger-bubbles');
        if (container) container.remove();
    }

    /**
     * Apply a specific theme key
     * @private
     * @param {string} themeKey 
     */
    _applyTheme(themeKey) {
        // Optimization: Only inject if theme changed or not yet injected
        if (themeKey !== this._currentThemeKey || !document.getElementById('ypp-active-theme-css')) {
            this._Utils.log(`Theme changed (${this._currentThemeKey} -> ${themeKey}), injecting...`, 'THEME');
            
            if (themeKey.startsWith('custom_')) {
                this._injectCustomTheme(themeKey);
            } else {
                this._injectThemeFile(themeKey);
            }
            
            document.documentElement.setAttribute('data-ypp-theme', themeKey);
            this._currentThemeKey = themeKey;

            // For the system theme, we sync with the user's explicit light/dark choice
            if (themeKey === 'system') {
                const isDark = (this._settings.nativeThemeMode !== 'light');
                this._enforceYouTubeTheme(isDark);
                this._Utils.log(`Theme is '${themeKey}', enforcing YouTube native mode: ${isDark ? 'dark' : 'light'}.`, 'THEME');
            } else {
                if (this._currentThemeKey !== 'system') {
                    this._enforceYouTubeTheme(true);
                }
            }
        } else {
             this._Utils.log(`Theme '${themeKey}' already active, skipping injection.`, 'THEME', 'debug');
        }
    }

    /**
     * Enforce YouTube's dark or light attribute on HTML
     * @private
     */
    _enforceYouTubeTheme(forceDark) {
        if (forceDark) {
            document.documentElement.setAttribute('dark', 'true');
        } else {
            document.documentElement.removeAttribute('dark');
        }
        
        // Setup observer to keep it enforced if YouTube tries to change it
        if (!this._themeObserver) {
            this._themeObserver = new MutationObserver((mutations) => {
                if (!this._currentThemeKey || this._currentThemeKey === 'system') return;
                
                const isDark = document.documentElement.hasAttribute('dark');
                if (!isDark) {
                    document.documentElement.setAttribute('dark', 'true');
                }
            });
            this._themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dark'] });
        }
    }

    /**
     * Force reload the current theme (used by Force Apply button)
     */
    forceReload() {
        if (this._currentThemeKey) {
            this._Utils.log('Force reloading theme...', 'THEME');
            if (this._currentThemeKey.startsWith('custom_')) {
                this._injectCustomTheme(this._currentThemeKey);
            } else {
                this._injectThemeFile(this._currentThemeKey, true);
            }
        } else {
             // If no theme active, maybe try to enable based on settings?
             this._run(this._settings);
        }
    }

    /**
     * Inject custom theme CSS variables
     * @param {string} themeKey 
     */
    _injectCustomTheme(themeKey) {
        const customThemes = this._settings.customThemes || {};
        const theme = customThemes[themeKey];
        
        if (!theme) {
            this._Utils.log(`Custom theme ${themeKey} not found, falling back to default.`, 'THEME', 'warn');
            this._injectThemeFile('default');
            return;
        }

        const id = 'ypp-active-theme-css';
        let style = document.getElementById(id);
        
        // If the element exists but is a <link> (from previous built-in theme), replace it
        if (style && style.tagName.toLowerCase() !== 'style') {
            style.remove();
            style = null;
        }

        if (!style) {
            style = document.createElement('style');
            style.id = id;
            style.className = 'ypp-theme-style';
            (document.head || document.documentElement).appendChild(style);
        }

        const cssVars = Object.entries(theme.variables || {})
            .map(([k, v]) => `${k}: ${v} !important;`)
            .join('\n');

        let textFixBlock = '';
        if (theme.variables && theme.variables['--ypp-text-primary']) {
            textFixBlock = `
/* --- TEXT READABILITY FIX --- */
html[data-ypp-theme="${themeKey}"] body,
html[data-ypp-theme="${themeKey}"] yt-formatted-string,
html[data-ypp-theme="${themeKey}"] span,
html[data-ypp-theme="${themeKey}"] div,
html[data-ypp-theme="${themeKey}"] a,
html[data-ypp-theme="${themeKey}"] h1,
html[data-ypp-theme="${themeKey}"] h2,
html[data-ypp-theme="${themeKey}"] h3,
html[data-ypp-theme="${themeKey}"] #video-title,
html[data-ypp-theme="${themeKey}"] .title,
html[data-ypp-theme="${themeKey}"] ytd-guide-entry-renderer *,
html[data-ypp-theme="${themeKey}"] ytd-mini-guide-entry-renderer * {
  color: var(--ypp-text-primary) !important;
  text-shadow: none !important;
}
html[data-ypp-theme="${themeKey}"] svg {
  fill: var(--ypp-text-primary) !important;
}
html[data-ypp-theme="${themeKey}"] ytd-rich-grid-media #metadata-line span,
html[data-ypp-theme="${themeKey}"] ytd-compact-video-renderer #metadata-line span,
html[data-ypp-theme="${themeKey}"] ytd-video-renderer #metadata-line span,
html[data-ypp-theme="${themeKey}"] #metadata-line span,
html[data-ypp-theme="${themeKey}"] .inline-metadata-item,
html[data-ypp-theme="${themeKey}"] #byline-container yt-formatted-string,
html[data-ypp-theme="${themeKey}"] #byline-container span,
html[data-ypp-theme="${themeKey}"] #byline-container a,
html[data-ypp-theme="${themeKey}"] #description-text {
  color: var(--ypp-text-secondary, var(--ypp-text-primary)) !important;
}
html[data-ypp-theme="${themeKey}"] ytd-button-renderer yt-formatted-string,
html[data-ypp-theme="${themeKey}"] yt-button-shape *,
html[data-ypp-theme="${themeKey}"] ytd-subscribe-button-renderer *,
html[data-ypp-theme="${themeKey}"] ytd-badge-supported-renderer * {
  color: inherit !important;
}
`;
        }

        style.textContent = `:root.ypp-spiral-tube-theme, :root.yt-spiral-tube-theme, html[data-ypp-theme="${themeKey}"] {\n${cssVars}\n}\n${textFixBlock}`;
        this._Utils.log(`Injecting Custom Theme: ${themeKey}`, 'THEME');
    }

    /**
     * Inject Design System Bundles exactly once
     * @private
     * @param {boolean} [force=false] - Force cache bust
     */
    _injectDesignSystemBundles(force = false) {
        const bundles = [
            { id: 'ypp-themes-bundle-css', file: 'themes-bundle.css' },
            { id: 'ypp-ui-styles-bundle-css', file: 'ui-styles-bundle.css' },
            { id: 'ypp-card-styles-bundle-css', file: 'card-styles-bundle.css' }
        ];

        for (const bundle of bundles) {
            let link = document.getElementById(bundle.id);
            const cssUrl = chrome.runtime.getURL(`dist/${bundle.file}`);
            const fullUrl = force ? `${cssUrl}?t=${Date.now()}` : cssUrl;

            if (!link) {
                link = document.createElement('link');
                link.id = bundle.id;
                link.rel = 'stylesheet';
                link.className = 'ypp-theme-link';
                (document.head || document.documentElement).appendChild(link);
            }

            if (link.href !== fullUrl || force) {
                link.href = fullUrl;
            }
        }
    }

    /**
     * Inject specific theme CSS file
     * @param {string} themeKey 
     * @param {boolean} [force=false] - Force cache bust
     */
    _injectThemeFile(themeKey, force = false) {
        // Ensure design system bundles are present
        this._injectDesignSystemBundles(force);
        this._Utils.log(`Applied Theme Attribute: ${themeKey} (Force: ${force})`, 'THEME');
    }

    /**
     * Remove the injected theme file
     */
    _removeThemeFile() {
        document.documentElement.removeAttribute('data-ypp-theme');
    }

    // =========================================================================
    // VISIBILITY SETTINGS REMOVED: Now centrally managed by GlobalLayoutManager
    // =========================================================================

    /**
     * Apply extensive UI customization settings (Typography, layout density, colors)
     * @private
     */
    _applyCustomizationSettings() {
        if (!this._settings) return;
        const root = document.documentElement;

        // Font Scale
        if (this._settings.fontScale !== undefined) {
            root.style.setProperty('--ypp-font-scale', (this._settings.fontScale / 100).toFixed(2));
        }

        // ── Background Image (dirty-flag guard) ─────────────────────────────
        // Only rebuild the 100+ line CSS block when the inputs actually change.
        const bgSig = [
            this._settings.customBackgroundImage || '',
            this._settings.customBackgroundImageIntensity ?? 0.6,
            this._settings.customBackgroundImageBlur ?? 0,
            this._settings.customBackgroundImageBrightness ?? 1.0,
            this._settings.customBackgroundImageSaturation ?? 1.0,
            !!this._settings.customBackgroundImageExtractColors,
            this._settings.accentColor || ''
        ].join('|');

        if (bgSig !== this._lastBgSig) {
            this._lastBgSig = bgSig;
            this._applyBgImageSettings(root);
        }

        // ── UI Shapes ────────────────────────────────────────────────────────
        if (this._settings.useSquareCorners) {
            document.body.classList.add('ypp-ui-square-corners');
            document.body.classList.remove('ypp-ui-extra-rounded');
        } else if (this._settings.extraRoundedUI) {
            document.body.classList.add('ypp-ui-extra-rounded');
            document.body.classList.remove('ypp-ui-square-corners');
        } else {
            document.body.classList.remove('ypp-ui-square-corners');
            document.body.classList.remove('ypp-ui-extra-rounded');
        }

        // ── Accent Color ─────────────────────────────────────────────────────
        if (this._settings.accentColor) {
            let hex = this._settings.accentColor;
            
            // Check if it's one of the 56 predefined premium colors from tempo
            if (this._CONSTANTS.PREMIUM_COLORS && this._CONSTANTS.PREMIUM_COLORS[hex]) {
                hex = this._CONSTANTS.PREMIUM_COLORS[hex];
            }
            
            root.style.setProperty('--ypp-accent-primary', hex);
            root.style.setProperty('--ypp-accent-color', hex);  // alias for backwards compat
            root.style.setProperty('--ypp-accent-glow', hex + '66');
            root.style.setProperty('--ypp-accent-hover', hex + 'cc');
            
            // Apply to YouTube native spec variables for seamless extraction
            root.style.setProperty('--yt-spec-static-brand-red', hex);
            root.style.setProperty('--yt-spec-icon-active-other', hex);
            root.style.setProperty('--yt-spec-brand-icon-active', hex);
            root.style.setProperty('--yt-spec-call-to-action', hex);
            
            let gradientStr = `linear-gradient(135deg, ${hex} 0%, ${hex}cc 100%)`;
            if (this._settings.enableDualAccent && this._settings.secondaryAccentColor) {
                let sec = this._settings.secondaryAccentColor;
                if (this._CONSTANTS.PREMIUM_COLORS && this._CONSTANTS.PREMIUM_COLORS[sec]) {
                    sec = this._CONSTANTS.PREMIUM_COLORS[sec];
                }
                gradientStr = `linear-gradient(135deg, ${hex} 0%, ${sec} 100%)`;
                root.style.setProperty('--ypp-accent-secondary', sec);
                document.body.classList.add('ypp-dual-accent-enabled');
            } else {
                root.style.removeProperty('--ypp-accent-secondary');
                document.body.classList.remove('ypp-dual-accent-enabled');
            }
            root.style.setProperty('--ypp-accent-gradient', gradientStr);
        }

        // ── Avatar Squircles (write once — this CSS is static) ───────────────
        if (!this._lastAvatarStyleWritten) {
            this._lastAvatarStyleWritten = true;
            const globalOverrides = `
            /* Avatar Squircles */
            #avatar-link yt-img-shadow, 
            #avatar-link yt-img-shadow img,
            .ytSpecAvatarShapeHost, 
            .ytSpecAvatarShapeHost img,
            .ytLockupMetadataViewModelAvatar,
            .ytLockupMetadataViewModelAvatar img {
                border-radius: 12px !important;
            }

            /* Fix multi-channel avatars overlapping in normal styles */
            ytd-video-meta-block #avatar-container,
            .yt-avatar-stack,
            .ytLockupMetadataViewModelAvatarContainer,
            .yt-avatar-stack-view-model,
            .yt-channel-avatar-stack {
                display: flex !important;
                flex-direction: row !important;
                gap: 4px !important;
                align-items: center !important;
            }
            
            #avatar-link, .ytSpecAvatarShapeHost, .ytLockupMetadataViewModelAvatar {
                margin-left: 0 !important;
                margin-right: 0 !important;
            }
        `;

            const globalStyleId = 'ypp-global-avatar-overrides';
            let globalStyleEl = document.getElementById(globalStyleId);
            if (!globalStyleEl) {
                globalStyleEl = document.createElement('style');
                globalStyleEl.id = globalStyleId;
                (document.head || document.documentElement).appendChild(globalStyleEl);
            }
            globalStyleEl.textContent = globalOverrides;
        }

        // ── Card Style ───────────────────────────────────────────────────────
        let finalCardStyle = this._settings.cardStyle || 'default';

        if (!finalCardStyle || finalCardStyle === 'none') {
            root.removeAttribute('data-ypp-card-style');
        } else {
            root.setAttribute('data-ypp-card-style', finalCardStyle);
        }
        this._applyCardStyle(finalCardStyle);
    }

    /**
     * Apply background-image CSS overrides. Called only when bg-image-related
     * settings have changed (dirty-flag guarded in _applyCustomizationSettings).
     * @private
     * @param {Element} root - document.documentElement
     */
    _applyBgImageSettings(root) {
        const bgContainerId = 'ypp-custom-bg-image-container';
        let bgContainer = document.getElementById(bgContainerId);
        
        const bgStyleId = 'ypp-custom-bg-image-style';
        let bgStyleEl = document.getElementById(bgStyleId);
        
        if (this._settings.customBackgroundImage) {
            const intensity = this._settings.customBackgroundImageIntensity ?? 0.6;
            const blur = this._settings.customBackgroundImageBlur ?? 0;
            const brightness = this._settings.customBackgroundImageBrightness ?? 1.0;
            const saturation = this._settings.customBackgroundImageSaturation ?? 1.0;
            
            // Only apply if not 'default' UI theme
            if (this._settings.youtubePageTheme === 'default') {
                if (bgContainer) bgContainer.remove();
                if (bgStyleEl) bgStyleEl.remove();
                root.removeAttribute('data-ypp-has-bg-image');
                return;
            }
            
            // Mark html element so core-styles.css and UI style bundles can suppress their bg colors
            root.setAttribute('data-ypp-has-bg-image', 'true');
            
            if (!bgContainer) {
                bgContainer = document.createElement('div');
                bgContainer.id = bgContainerId;
                // Insert as first child of body so it stays behind all UI elements
                if (document.body) {
                    document.body.insertBefore(bgContainer, document.body.firstChild);
                } else {
                    document.documentElement.appendChild(bgContainer);
                }
            }
            
            bgContainer.style.cssText = `
                position: fixed;
                top: -10vh;
                left: -10vw;
                width: 120vw;
                height: 120vh;
                background-image: url("${this._settings.customBackgroundImage}");
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                z-index: -9999;
                opacity: ${intensity};
                filter: blur(${blur}px) brightness(${brightness}) saturate(${saturation});
                pointer-events: none;
                transition: opacity 0.3s ease, filter 0.3s ease;
            `;
            
            let bgStyles = `
                /* ============================================================
                   Custom Background Image Active — suppress ALL theme bg colors
                   and pseudo-element gradients/patterns from ui-style bundles
                   ============================================================ */

                /* Strip background from html, body, and all major layout containers */
                html[data-ypp-has-bg-image][data-ypp-has-bg-image],
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design],
                html[data-ypp-has-bg-image][data-ypp-has-bg-image]:root,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image]:root[dark],
                html[data-ypp-has-bg-image][data-ypp-has-bg-image]:root[dark="true"],
                html[data-ypp-has-bg-image][data-ypp-has-bg-image].yt-spiral-tube-theme,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image].yt-spiral-tube-theme:root {
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                }

                /* Suppress ::before/::after pseudo-element overlays from UI style themes
                   (these are used by frutiger-aero, cyberpunk, nature, aurora etc. for their
                   gradient/particle background effects — the image must win) */
                html[data-ypp-has-bg-image][data-ypp-has-bg-image]::before,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image]::after,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design]::before,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design]::after,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] body::before,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] body::after,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] body::before,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] body::after,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-app::before,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-app::after,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] ytd-app::before,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] ytd-app::after {
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                    opacity: 0 !important;
                    display: none !important;
                }

                /* Strip body */
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] body,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] body,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] body[dir],
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] body.dir {
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                }
                
                /* Ensure YouTube content sits on top of our custom bg container */
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-app,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] ytd-app {
                    position: relative;
                    z-index: 1;
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                }
                
                /* Hide native YouTube background block and make core layout transparent */
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] #background,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] #background,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] #background.ytd-app,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-page-manager,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] ytd-page-manager,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-browse,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-search,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-watch-flexy,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-two-column-browse-results-renderer,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] ytd-rich-grid-renderer,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] yt-page-background,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image] #ypp-cinematic-app,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] #contentContainer,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] tp-yt-app-header-layout,
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design] #columns {
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                }
                
                html[data-ypp-has-bg-image] #background {
                    display: none !important;
                }
                
                /* Keep masthead and guide readable with a dark overlay (except for frutiger-aero which has its own gradients) */
                html[data-ypp-has-bg-image][data-ypp-ui-design]:not([data-ypp-ui-design="frutiger-aero"]) #masthead-container.ytd-app,
                html[data-ypp-has-bg-image][data-ypp-ui-design]:not([data-ypp-ui-design="frutiger-aero"]) ytd-masthead #container.ytd-masthead,
                html[data-ypp-has-bg-image][data-ypp-ui-design]:not([data-ypp-ui-design="frutiger-aero"]) ytd-mini-guide-renderer,
                html[data-ypp-has-bg-image][data-ypp-ui-design]:not([data-ypp-ui-design="frutiger-aero"]) ytd-guide-renderer,
                html[data-ypp-has-bg-image][data-ypp-ui-design]:not([data-ypp-ui-design="frutiger-aero"]) #guide-wrapper.ytd-app,
                html[data-ypp-has-bg-image][data-ypp-ui-design]:not([data-ypp-ui-design="frutiger-aero"]) app-drawer#guide-inner-content {
                    background: rgba(0, 0, 0, 0.5) !important;
                    background-color: rgba(0, 0, 0, 0.5) !important;
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                }

                /* Frutiger Aero bubble container — keep it visible since it's decorative HTML not CSS */
                html[data-ypp-has-bg-image] #ypp-frutiger-bubbles {
                    opacity: 0.3;
                }
            `;
            // Helper to convert hex to rgba
            const hexToRgba = (hex, alpha) => {
                const r = parseInt(hex.slice(1, 3), 16) || 0;
                const g = parseInt(hex.slice(3, 5), 16) || 0;
                const b = parseInt(hex.slice(5, 7), 16) || 0;
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };

            // Force Extracted Colors if enabled
            if (this._settings.customBackgroundImageExtractColors) {
                if (this._settings.extractedPalette && this._settings.extractedPalette.length === 4) {
                    const [c1, c2, c3, c4] = this._settings.extractedPalette;
                    bgStyles += `
                        html[data-ypp-has-bg-image] {
                            --ypp-accent: ${c1} !important;
                            --yt-spec-call-to-action: ${c1} !important;
                            --ypp-accent-primary: ${c1} !important;
                            --ypp-bg-surface: ${hexToRgba(c2, 0.7)} !important;
                            --ypp-text-primary: ${c3} !important;
                            --yt-spec-text-primary: ${c3} !important;
                            --ypp-bg-base: ${hexToRgba(c4, 0.8)} !important;
                            --yt-spec-brand-background-solid: ${hexToRgba(c4, 0.8)} !important;
                            --yt-spec-general-background-a: ${hexToRgba(c4, 0.8)} !important;
                            --yt-spec-menu-background: ${hexToRgba(c2, 0.9)} !important;
                        }
                    `;
                } else if (this._settings.accentColor) {
                    bgStyles += `
                        html[data-ypp-has-bg-image] {
                            --ypp-accent: ${this._settings.accentColor} !important;
                            --yt-spec-call-to-action: ${this._settings.accentColor} !important;
                        }
                    `;
                }
                
                const acc = (this._settings.extractedPalette && this._settings.extractedPalette[0]) || this._settings.accentColor;
                if (acc) {
                    bgStyles += `
                        html[data-ypp-has-bg-image] .ypp-slider,
                        html[data-ypp-has-bg-image] .ypp-gpb-vol-slider,
                        html[data-ypp-has-bg-image] input[type="range"] {
                            accent-color: ${acc} !important;
                        }
                        html[data-ypp-has-bg-image] .ytp-swatch-background-color {
                            background-color: ${acc} !important;
                        }
                    `;
                }
            }
            if (!bgStyleEl) {
                bgStyleEl = document.createElement('style');
                bgStyleEl.id = bgStyleId;
                (document.head || document.documentElement).appendChild(bgStyleEl);
            }
            bgStyleEl.textContent = bgStyles;
            this._Utils.log('Custom background image applied — bg-image override active', 'THEME');
        } else {
            // Remove bg image mode — restore normal theme background rendering
            root.removeAttribute('data-ypp-has-bg-image');
            if (bgStyleEl) bgStyleEl.remove();
            if (bgContainer) bgContainer.remove();
            this._Utils.log('Custom background image cleared — bg-image override removed', 'THEME');
        }
    }

    /**
     * Helper to get correct card style URL based on architecture
     * @private
     */
    _getCardStyleUrl(cardStyleKey) {
        return chrome.runtime.getURL(`dist/card-styles/${cardStyleKey}.css`);
    }

    /**
     * Apply the YouTube Card style overlay from card-styles/ directory
     * @private
     * @param {string} cardStyleKey  e.g. 'glass', 'flat', 'cyberpunk'
     */
    _applyCardStyle(cardStyleKey) {
        const idVars = 'ypp-card-style-css';
        let linkVars = document.getElementById(idVars);

        if (!cardStyleKey || cardStyleKey === 'none') {
            if (linkVars) linkVars.remove();
            document.documentElement.removeAttribute('data-ypp-card-style');
            return;
        }

        // We DO NOT load an external vars URL if it's 'default', because default is included in the bundle.
        // But we DO need to keep the attribute and inject search-card-compat.css!
        if (cardStyleKey !== 'default') {
            if (linkVars && linkVars.getAttribute('data-card-style') === cardStyleKey) {
                // already loaded
            } else {
                const varsUrl = this._getCardStyleUrl(cardStyleKey);
                if (!linkVars) {
                    linkVars = document.createElement('link');
                    linkVars.id = idVars;
                    linkVars.rel = 'stylesheet';
                    linkVars.className = 'ypp-ui-style-link';
                    (document.head || document.documentElement).appendChild(linkVars);
                }
                linkVars.setAttribute('data-card-style', cardStyleKey);
                linkVars.href = varsUrl;
            }
        } else {
            // For 'default', we remove the external file link if it exists, as the CSS is bundled
            if (linkVars) {
                linkVars.remove();
            }
        }

        // search-card-compat.css is now bundled via index.css — no dynamic injection needed.

        this._Utils.log(`Injecting Card Style: ${cardStyleKey}`, 'THEME');
    }


    /**
     * Cleanup CSS classes

     * @private
     */
    _cleanupClasses() {
        // Collect all potential classes managed by visibility toggles
        const classes = [
            this._CSS_CLASSES.THEME_ENABLED,
            'ypp-theme-effects'
        ].filter(Boolean); // Filter out any undefined constants

        // Clean both documentElement and body just in case
        document.documentElement.classList.remove(...classes);
        document.body.classList.remove(...classes);
    }

    /**
     * Cleanup inline CSS variables injected by customization settings
     * @private
     */
    _cleanupCustomVariables() {
        const root = document.documentElement;
        
        // Remove styling variables
        root.style.removeProperty('--ypp-font-scale');
        root.style.removeProperty('--ypp-accent-primary');
        root.style.removeProperty('--ypp-accent-color');  // alias
        root.style.removeProperty('--ypp-accent-glow');
        root.style.removeProperty('--ypp-accent-hover');
        root.style.removeProperty('--ypp-accent-gradient');
        
        // Remove styling data attributes
        root.removeAttribute('data-ypp-card-style');

        // Remove avatar overrides
        const globalStyleEl = document.getElementById('ypp-global-avatar-overrides');
        if (globalStyleEl) {
            globalStyleEl.remove();
        }
    }



    // =========================================================================
    // WATCHED VIDEOS
    // =========================================================================
    // NOTE: Watched video detection and hiding is fully owned by HideWatched
    // (features/core/global/hide-watched.js). Theme.js only toggles the body
    // class 'ypp-hide-watched' so the CSS selector activates — the actual
    // card-level [data-ypp-watched] attribute is set by HideWatched.

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    /**
     * Check if theme is active
     * @returns {boolean}
     */
    isActive() {
        return this._isActive;
    }

    /**
     * Get current settings
     * @returns {Object}
     */
    getSettings() {
        return { ...this._settings };
    }

    /**
     * Toggle a setting dynamically
     * @param {string} key - Setting key
     * @param {boolean} value - New value
     */
    setSetting(key, value) {
        if (this._settings) {
            // Create a copy to handle frozen objects
            this._settings = { ...this._settings, [key]: value };
            this._run(this._settings);
        }
    }
};

window.YPP.features.ThemeManager = ThemeManager;
