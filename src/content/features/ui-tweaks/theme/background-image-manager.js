/**
 * Background Image Manager - Extracted from ThemeManager
 * Handles the heavy CSS string generation and injection for custom backgrounds
 */

export class BackgroundImageManager {
    constructor(utils) {
        this._Utils = utils || window.YPP?.Utils || { log: () => {} };
        this._lastBgSig = null;
    }

    /**
     * Helper to convert hex to rgba
     */
    _hexToRgba(hex, alpha) {
        if (!hex) return `rgba(0, 0, 0, ${alpha})`;
        const r = parseInt(hex.slice(1, 3), 16) || 0;
        const g = parseInt(hex.slice(3, 5), 16) || 0;
        const b = parseInt(hex.slice(5, 7), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * Apply background-image CSS overrides based on settings.
     * Dirty-flag guarded internally to avoid regenerating CSS needlessly.
     * 
     * @param {Object} settings - Current YPP settings
     * @param {Element} root - document.documentElement
     */
    apply(settings, root) {
        if (!settings) return;

        // Signature for dirty checking
        const bgSig = [
            settings.customBackgroundImage || '',
            settings.customBackgroundImageIntensity ?? 0.6,
            settings.customBackgroundImageBlur ?? 0,
            settings.customBackgroundImageBrightness ?? 1.0,
            settings.customBackgroundImageSaturation ?? 1.0,
            !!settings.customBackgroundImageExtractColors,
            settings.accentColor || ''
        ].join('|');

        if (bgSig === this._lastBgSig) {
            return; // No changes
        }
        this._lastBgSig = bgSig;

        const bgContainerId = 'ypp-custom-bg-image-container';
        let bgContainer = document.getElementById(bgContainerId);
        
        const bgStyleId = 'ypp-custom-bg-image-style';
        let bgStyleEl = document.getElementById(bgStyleId);
        
        if (settings.customBackgroundImage) {
            const intensity = settings.customBackgroundImageIntensity ?? 0.6;
            const blur = settings.customBackgroundImageBlur ?? 0;
            const brightness = settings.customBackgroundImageBrightness ?? 1.0;
            const saturation = settings.customBackgroundImageSaturation ?? 1.0;
            
            // Only apply if not 'default' UI theme
            if (settings.youtubePageTheme === 'default') {
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
                background-image: url("${settings.customBackgroundImage}");
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
                html[data-ypp-has-bg-image][data-ypp-has-bg-image][data-ypp-ui-design]:not([data-ypp-ui-design="frutiger-aero"]) #guide-wrapper.ytd-app,
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

            // Force Extracted Colors if enabled
            if (settings.customBackgroundImageExtractColors) {
                if (settings.extractedPalette && settings.extractedPalette.length === 4) {
                    const [c1, c2, c3, c4] = settings.extractedPalette;
                    bgStyles += `
                        html[data-ypp-has-bg-image] {
                            --ypp-accent: ${c1} !important;
                            --yt-spec-call-to-action: ${c1} !important;
                            --ypp-accent-primary: ${c1} !important;
                            --ypp-bg-surface: ${this._hexToRgba(c2, 0.7)} !important;
                            --ypp-text-primary: ${c3} !important;
                            --yt-spec-text-primary: ${c3} !important;
                            --ypp-bg-base: ${this._hexToRgba(c4, 0.8)} !important;
                            --yt-spec-brand-background-solid: ${this._hexToRgba(c4, 0.8)} !important;
                            --yt-spec-general-background-a: ${this._hexToRgba(c4, 0.8)} !important;
                            --yt-spec-menu-background: ${this._hexToRgba(c2, 0.9)} !important;
                        }
                    `;
                } else if (settings.accentColor) {
                    bgStyles += `
                        html[data-ypp-has-bg-image] {
                            --ypp-accent: ${settings.accentColor} !important;
                            --yt-spec-call-to-action: ${settings.accentColor} !important;
                        }
                    `;
                }
                
                const acc = (settings.extractedPalette && settings.extractedPalette[0]) || settings.accentColor;
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
}
