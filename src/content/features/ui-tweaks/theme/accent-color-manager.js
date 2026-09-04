/**
 * Accent Color Manager - Extracted from ThemeManager
 * Handles calculating and applying CSS variables for primary and dual accent colors.
 */

export class AccentColorManager {
    constructor(constants) {
        this._CONSTANTS = constants || window.YPP?.CONSTANTS || {};
    }

    /**
     * Resolve hex color, checking against predefined premium colors
     */
    _resolveColor(hex) {
        if (!hex) return null;
        if (this._CONSTANTS.PREMIUM_COLORS && this._CONSTANTS.PREMIUM_COLORS[hex]) {
            return this._CONSTANTS.PREMIUM_COLORS[hex];
        }
        return hex;
    }

    /**
     * Apply accent color CSS variables to the document root
     * 
     * @param {Object} settings - Current YPP settings
     * @param {Element} root - document.documentElement
     */
    apply(settings, root) {
        if (!settings || !settings.accentColor) {
            this.cleanup(root);
            return;
        }

        const hex = this._resolveColor(settings.accentColor);
        
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
        
        if (settings.enableDualAccent && settings.secondaryAccentColor) {
            const sec = this._resolveColor(settings.secondaryAccentColor);
            gradientStr = `linear-gradient(135deg, ${hex} 0%, ${sec} 100%)`;
            root.style.setProperty('--ypp-accent-secondary', sec);
            document.body.classList.add('ypp-dual-accent-enabled');
        } else {
            root.style.removeProperty('--ypp-accent-secondary');
            document.body.classList.remove('ypp-dual-accent-enabled');
        }
        
        root.style.setProperty('--ypp-accent-gradient', gradientStr);
    }

    /**
     * Clean up injected variables
     */
    cleanup(root) {
        root.style.removeProperty('--ypp-accent-primary');
        root.style.removeProperty('--ypp-accent-color');
        root.style.removeProperty('--ypp-accent-glow');
        root.style.removeProperty('--ypp-accent-hover');
        root.style.removeProperty('--ypp-accent-gradient');
        root.style.removeProperty('--ypp-accent-secondary');
        
        if (document.body) {
            document.body.classList.remove('ypp-dual-accent-enabled');
        }
    }
}
