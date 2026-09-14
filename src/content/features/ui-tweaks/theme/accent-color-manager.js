/**
 * Accent Color Manager - Extracted from ThemeManager
 * Handles calculating and applying CSS variables for primary and dual accent colors,
 * smart text contrast, and advanced gradients.
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
     * Calculate YIQ luminance to determine optimal contrasting text color
     * @param {string} hexcolor - hex color like #FFFFFF
     * @returns {string} - '#0F0F0F' for dark text, '#FFFFFF' for light text
     */
    _getContrastYIQ(hexcolor) {
        if (!hexcolor) return '#FFFFFF';
        hexcolor = hexcolor.replace("#", "");
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(c => c + c).join('');
        }
        if (hexcolor.length !== 6) return '#FFFFFF';
        
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? '#0F0F0F' : '#FFFFFF';
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
        const textColor = this._getContrastYIQ(hex);
        
        root.style.setProperty('--ypp-accent-primary', hex);
        root.style.setProperty('--ypp-accent-color', hex);  // alias for backwards compat
        root.style.setProperty('--ypp-accent-text-color', textColor);
        root.style.setProperty('--ypp-accent-glow', hex + '66');
        root.style.setProperty('--ypp-accent-hover', hex + 'cc');
        
        // Apply to YouTube native spec variables for seamless extraction
        root.style.setProperty('--yt-spec-static-brand-red', hex);
        root.style.setProperty('--yt-spec-icon-active-other', hex);
        root.style.setProperty('--yt-spec-brand-icon-active', hex);
        root.style.setProperty('--yt-spec-call-to-action', hex);
        
        const angle = settings.gradientAngle || '135deg';
        let gradientStr = `linear-gradient(${angle}, ${hex} 0%, ${hex}cc 100%)`;
        
        if (settings.enableDualAccent && settings.secondaryAccentColor) {
            const sec = this._resolveColor(settings.secondaryAccentColor);
            gradientStr = `linear-gradient(${angle}, ${hex} 0%, ${sec} 100%)`;
            root.style.setProperty('--ypp-accent-secondary', sec);
            if (document.body) document.body.classList.add('ypp-dual-accent-enabled');
        } else {
            root.style.removeProperty('--ypp-accent-secondary');
            if (document.body) document.body.classList.remove('ypp-dual-accent-enabled');
        }
        
        root.style.setProperty('--ypp-accent-gradient', gradientStr);

        if (settings.enableFlowAnimation) {
            if (document.body) document.body.classList.add('ypp-flowing-gradient-enabled');
        } else {
            if (document.body) document.body.classList.remove('ypp-flowing-gradient-enabled');
        }
    }

    /**
     * Clean up injected variables
     */
    cleanup(root) {
        root.style.removeProperty('--ypp-accent-primary');
        root.style.removeProperty('--ypp-accent-color');
        root.style.removeProperty('--ypp-accent-text-color');
        root.style.removeProperty('--ypp-accent-glow');
        root.style.removeProperty('--ypp-accent-hover');
        root.style.removeProperty('--ypp-accent-gradient');
        root.style.removeProperty('--ypp-accent-secondary');
        
        if (document.body) {
            document.body.classList.remove('ypp-dual-accent-enabled');
            document.body.classList.remove('ypp-flowing-gradient-enabled');
        }
    }
}
