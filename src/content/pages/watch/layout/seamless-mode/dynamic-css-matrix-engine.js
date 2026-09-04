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
                ytd-watch-flexy ${target} ytd-thumbnail {
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
