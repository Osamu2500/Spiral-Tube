/**
 * @fileoverview
 * Shadow DOM Piercing Engine
 * Recursively explores the DOM to find hidden flex containers inside ShadowRoots.
 */
export class ShadowDOMPiercingEngine {
    constructor(utils) {
        this.utils = utils;
    }
    
    pierceAndDestroy(rootNode) {
        if (!rootNode || typeof rootNode !== 'object') return;
        
        try {
            // If it has a shadow root, pierce it safely
            if (rootNode.shadowRoot) {
                this.destroyFlexContainers(rootNode.shadowRoot);
                this.pierceAndDestroy(rootNode.shadowRoot);
            }
            
            // Walk children safely
            const children = rootNode.children;
            if (children && children.length > 0) {
                for (let i = 0; i < children.length; i++) {
                    this.destroyFlexContainers(children[i]);
                    this.pierceAndDestroy(children[i]);
                }
            }
        } catch (error) {
            this.utils.log(`ShadowDOMPiercingEngine: Failed to pierce node - ${error.message}`, 'seamlessMode', 'debug');
        }
    }
    
    destroyFlexContainers(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
        
        try {
            // Target known flex containers that disrupt grid layouts
            if (node.id === 'dismissible' || node.classList.contains('details')) {
                const style = window.getComputedStyle(node);
                if (style.display === 'flex' && style.flexDirection === 'row') {
                    node.style.setProperty('display', 'block', 'important');
                }
            }
        } catch (error) {
            this.utils.log(`ShadowDOMPiercingEngine: Failed to destroy flex container - ${error.message}`, 'seamlessMode', 'debug');
        }
    }
}
