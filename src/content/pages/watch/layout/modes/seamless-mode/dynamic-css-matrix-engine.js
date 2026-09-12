/**
 * @fileoverview
 * Dynamic CSS Matrix Engine
 * Generates an indestructible wall of CSS rules that Polymer cannot wipe out.
 */
export class DynamicCSSMatrixEngine {
    constructor(logger) {
        this.logger = logger;
        this.styleElement = null;
        this.cssRules = [];
        this.targets = [
            'ytd-compact-video-renderer',
            'ytd-rich-item-renderer',
            'ytd-compact-playlist-renderer',
            'ytd-compact-radio-renderer',
            'ytd-compact-movie-renderer'
        ];
    }
    
    inject(cols) {
        if (!this.styleElement) {
            this.styleElement = document.createElement('style');
            this.styleElement.id = 'seamless-massive-grid-enforcer';
            document.head.appendChild(this.styleElement);
        }
        
        let css = '';
        const widthCalc = `calc((100% / ${cols}) - 16px)`;
        
        // Loop over targets
        this.targets.forEach(target => {
            // Container overrides
            css += `
                ytd-watch-flexy ${target} {
                    display: inline-block !important;
                    width: ${widthCalc} !important;
                    min-width: ${widthCalc} !important;
                    max-width: ${widthCalc} !important;
                    margin: 8px !important;
                    padding: 0 !important;
                    vertical-align: top !important;
                    float: none !important;
                    clear: none !important;
                    box-sizing: border-box !important;
                    transform: none !important;
                    transition: none !important;
                    flex: none !important;
                    position: relative !important;
                }
            `;
            
            // Flex row destruction on inner dismissible
            css += `
                ytd-watch-flexy ${target} #dismissible {
                    display: block !important;
                    width: 100% !important;
                    height: auto !important;
                    flex-direction: column !important;
                    flex-wrap: nowrap !important;
                    align-items: stretch !important;
                    justify-content: flex-start !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-sizing: border-box !important;
                    position: relative !important;
                    contain: none !important;
                    overflow: visible !important;
                }
            `;
            
            // Thumbnail overrides
            css += `
                ytd-watch-flexy ${target} ytd-thumbnail,
                ytd-watch-flexy ${target} .ytThumbnailViewModelHost,
                ytd-watch-flexy ${target} .yt-lockup-view-model__image-column {
                    display: block !important;
                    width: 100% !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    height: auto !important;
                    aspect-ratio: 16/9 !important;
                    margin-right: 0 !important;
                    margin-bottom: 8px !important;
                    padding: 0 !important;
                    position: relative !important;
                    flex: none !important;
                    float: none !important;
                    border-radius: var(--ypp-thumbnail-radius, 12px) !important;
                    overflow: hidden !important;
                }
                ytd-watch-flexy ${target} ytd-thumbnail img,
                ytd-watch-flexy ${target} img.ytCoreImageHost {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    border-radius: var(--ypp-thumbnail-radius, 12px) !important;
                }
            `;
            
            // Title and Details overrides
            css += `
                ytd-watch-flexy ${target} .details {
                    display: block !important;
                    width: 100% !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    position: relative !important;
                    flex: none !important;
                    float: none !important;
                }
                
                ytd-watch-flexy ${target} .details a,
                ytd-watch-flexy ${target} .details span {
                    white-space: normal !important;
                }
                
                /* Stacked Badges */
                ytd-watch-flexy ${target} .ytContentMetadataViewModelMetadataRow:has(.ytBadgeViewModelHost) {
                    position: absolute !important;
                    bottom: calc(100% + 13px) !important;
                    left: 5px !important;
                    z-index: 5 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 2px !important;
                    align-items: flex-start !important;
                    pointer-events: none !important;
                    background: transparent !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                ytd-watch-flexy ${target} .ytBadgeViewModelHost {
                    position: static !important;
                    pointer-events: none !important;
                    background-color: var(--ypp-accent-red, #f00) !important;
                    padding: 2px 4px !important;
                    border-radius: var(--ypp-radius-sm, 4px) !important;
                    display: inline-block !important;
                    width: auto !important;
                    max-width: max-content !important;
                    opacity: 1 !important;
                    transition: opacity 0.2s ease-in-out !important;
                    color: #fff !important;
                    font-size: 11px !important;
                    line-height: 11px !important;
                }
                ytd-watch-flexy ${target} .ytBadgeViewModelHost * {
                    color: #fff !important;
                    font-size: 11px !important;
                    line-height: 11px !important;
                    font-family: 'Roboto', Arial, sans-serif !important;
                }
                ytd-watch-flexy ${target}:hover .ytBadgeViewModelHost {
                    opacity: 0 !important;
                    visibility: hidden !important;
                }
            `;
        });
        
        this.styleElement.textContent = css;
        this.logger.info(`Injected ${this.targets.length} massive CSS rule blocks.`);
    }
    
    remove() {
        if (this.styleElement) {
            this.styleElement.remove();
            this.styleElement = null;
        }
    }
}
