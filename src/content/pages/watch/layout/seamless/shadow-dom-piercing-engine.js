/**
 * @fileoverview
 * Shadow DOM Piercing Engine
 * Recursively explores the DOM to find hidden flex containers inside ShadowRoots.
 */
export class ShadowDOMPiercingEngine {
    constructor(logger) {
        this.logger = logger;
    }
    
    pierceAndDestroy(rootNode) {
        if (!rootNode) return;
        
        // If it has a shadow root, pierce it
        if (rootNode.shadowRoot) {
            this.destroyFlexContainers(rootNode.shadowRoot);
            this.pierceAndDestroy(rootNode.shadowRoot);
        }
        
        // Walk children
        const children = rootNode.children || [];
        for (let i = 0; i < children.length; i++) {
            this.destroyFlexContainers(children[i]);
            this.pierceAndDestroy(children[i]);
        }
    }
    
    destroyFlexContainers(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        
        // Target known flex containers
        if (node.id === 'dismissible' || node.classList.contains('details')) {
            const style = window.getComputedStyle(node);
            if (style.display === 'flex' && style.flexDirection === 'row') {
                node.style.setProperty('display', 'block', 'important');
            }
        }
    }
}
