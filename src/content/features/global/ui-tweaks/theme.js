/**
 * Theme Manager - Handles visual theming and content visibility features
 * Uses centralized constants for configuration
 */



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

    getConfigKey() {
        return 'premiumTheme';
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

    /**
     * Initialize internal state
     * @private
     */
    _initState() {
        this._isActive = false;
        this._settings = null;
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
            this._toggleTheme(this._settings.premiumTheme);

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
        const id = 'ypp-ui-style-css';
        let link = document.getElementById(id);

        // If no UI style or 'default', remove any previously injected style
        if (!uiStyleKey || uiStyleKey === 'default') {
            if (link) link.remove();
            document.documentElement.removeAttribute('data-ypp-ui-style');
            this._removeFrutigerBubbles();
            return;
        }

        // Skip if the same UI style is already injected
        if (link && link.getAttribute('data-ui-style') === uiStyleKey) {
            return;
        }

        const cssUrl = chrome.runtime.getURL(`src/content/themes/ui-styles/${uiStyleKey}.css`);

        if (!link) {
            link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.className = 'ypp-ui-style-link';
            document.head.appendChild(link);
        }

        link.setAttribute('data-ui-style', uiStyleKey);
        link.href = cssUrl;
        document.documentElement.setAttribute('data-ypp-ui-style', uiStyleKey);
        
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

        // Add 50 bubbles
        for (let i = 0; i < 50; i++) {
            const span = document.createElement('span');
            span.className = 'fa-bubble';
            container.appendChild(span);
        }

        document.body.appendChild(container);
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
                // Treat ALL other themes (including 'default' YouTube Dark) as Dark themes to ensure YouTube's native UI elements 
                // inherit dark backgrounds rather than blinding white ones.
                const isLightTheme = false;
                this._enforceYouTubeTheme(!isLightTheme);
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
                if (!this._currentThemeKey || this._currentThemeKey === 'system' || this._currentThemeKey === 'default') return;
                
                const shouldBeDark = true; // Always force 'dark' for all custom themes
                const isDark = document.documentElement.hasAttribute('dark');
                
                if (shouldBeDark && !isDark) {
                    document.documentElement.setAttribute('dark', 'true');
                } else if (!shouldBeDark && isDark) {
                    document.documentElement.removeAttribute('dark');
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
            document.head.appendChild(style);
        }

        const cssVars = Object.entries(theme.variables || {})
            .map(([k, v]) => `${k}: ${v} !important;`)
            .join('\n');

        style.textContent = `:root.ypp-spiral-tube-theme, :root.yt-spiral-tube-theme, html[data-ypp-theme="${themeKey}"] {\n${cssVars}\n}`;
        this._Utils.log(`Injecting Custom Theme: ${themeKey}`, 'THEME');
    }

    /**
     * Inject specific theme CSS file
     * @param {string} themeKey 
     * @param {boolean} [force=false] - Force cache bust
     */
    _injectThemeFile(themeKey, force = false) {
        const id = 'ypp-active-theme-css';
        let link = document.getElementById(id);
        
        // If the element exists but is a <style> (from previous custom theme), replace it
        if (link && link.tagName.toLowerCase() !== 'link') {
            link.remove();
            link = null;
        }

        const cssUrl = chrome.runtime.getURL(`src/content/themes/${themeKey}.css`);
        const fullUrl = force ? `${cssUrl}?t=${Date.now()}` : cssUrl;

        if (!link) {
            link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.className = 'ypp-theme-link';
            document.head.appendChild(link);
        }

        // Always update to ensure we force a repaint/reload if requested
        link.href = fullUrl;

        // VERIFICATION LOG
        this._Utils.log(`Injecting Theme: ${themeKey} (Force: ${force})`, 'THEME');
    }

    /**
     * Remove the injected theme file
     */
    _removeThemeFile() {
        const id = 'ypp-active-theme-css';
        const link = document.getElementById(id);
        if (link) link.remove();
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


        // Accent Color
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
            root.style.setProperty('--ypp-accent-gradient', `linear-gradient(135deg, ${hex} 0%, ${hex}cc 100%)`);
        }

        // Global Avatar Squircles & Multi-Avatar Support
        let globalOverrides = `
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
            document.head.appendChild(globalStyleEl);
        }
        globalStyleEl.textContent = globalOverrides;


        // Card Style Enforcement by UI Theme
        let finalCardStyle = this._settings.cardStyle || 'glass';
        
        const ytTheme = this._settings.youtubePageTheme;

        if (ytTheme && ytTheme !== 'default' && finalCardStyle === 'glass') {
             if (ytTheme === 'cyberpunk') finalCardStyle = 'cyberpunk';
             else if (ytTheme === 'nature') finalCardStyle = 'nature';
             else if (ytTheme === 'vintage') finalCardStyle = 'vintage';
             else if (ytTheme === 'liquid-glass') finalCardStyle = 'glass';
             else if (ytTheme === 'neumorphic') finalCardStyle = 'neumorphic';
             else if (ytTheme === 'ocean') finalCardStyle = 'ocean';
             else if (ytTheme === 'blue-sky') finalCardStyle = 'blue-sky';
             else if (ytTheme === 'retro') finalCardStyle = 'retro';
             else if (ytTheme === 'technozen') finalCardStyle = 'technozen';
             else if (ytTheme === 'frutiger-aero') finalCardStyle = 'frutiger-aero';
             else if (ytTheme === 'terminalism') finalCardStyle = 'terminalism';
             else if (ytTheme === 'claymorphism') finalCardStyle = 'claymorphism';
             else if (ytTheme === 'brutalism') finalCardStyle = 'brutalism';
             else if (ytTheme === 'minimalism') finalCardStyle = 'minimalism';
             else if (ytTheme === 'maximalism') finalCardStyle = 'maximalism';
             else if (ytTheme === 'glassmorphism') finalCardStyle = 'glassmorphism';
             else if (ytTheme === 'aurora') finalCardStyle = 'aurora';
             else if (ytTheme === 'material') finalCardStyle = 'material';
        }

        root.setAttribute('data-ypp-card-style', finalCardStyle);
        this._applyCardStyle(finalCardStyle);
    }

    /**
     * Apply the YouTube Card style overlay from card-styles/ directory
     * @private
     * @param {string} cardStyleKey  e.g. 'glass', 'flat', 'cyberpunk'
     */
    _applyCardStyle(cardStyleKey) {
        const idVars = 'ypp-card-style-css';
        let linkVars = document.getElementById(idVars);

        // Also manage the search compatibility stylesheet
        const searchCompatId = 'ypp-search-card-compat-css';

        if (!cardStyleKey || cardStyleKey === 'default') {
            if (linkVars) linkVars.remove();
            // Remove search compat too when no card style is active
            const searchCompatLink = document.getElementById(searchCompatId);
            if (searchCompatLink) searchCompatLink.remove();
            return;
        }

        if (linkVars && linkVars.getAttribute('data-card-style') === cardStyleKey) {
            return;
        }

        const varsUrl = chrome.runtime.getURL(`src/content/card-styles/${cardStyleKey}.css`);

        if (!linkVars) {
            linkVars = document.createElement('link');
            linkVars.id = idVars;
            linkVars.rel = 'stylesheet';
            linkVars.className = 'ypp-ui-style-link';
            document.head.appendChild(linkVars);
        }

        linkVars.setAttribute('data-card-style', cardStyleKey);
        linkVars.href = varsUrl;

        // Inject the shared search compatibility layer (always after card style CSS
        // so its rules have a higher source order for equal-specificity ties)
        let searchCompatLink = document.getElementById(searchCompatId);
        if (!searchCompatLink) {
            searchCompatLink = document.createElement('link');
            searchCompatLink.id = searchCompatId;
            searchCompatLink.rel = 'stylesheet';
            searchCompatLink.className = 'ypp-ui-style-link';
            document.head.appendChild(searchCompatLink);
        }
        searchCompatLink.href = chrome.runtime.getURL('src/content/card-styles/search-card-compat.css');

        this._Utils.log(`Injecting Card Style: ${cardStyleKey} + search-card-compat`, 'THEME');
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
