/**
 * @fileoverview
 * Polymer Data Overrider
 * Hacks directly into the JavaScript properties of YouTube's components.
 */
export class PolymerDataOverrider {
    constructor(utils) {
        this.utils = utils;
    }
    
    hackNode(node) {
        if (!node || typeof node !== 'object') return;
        
        try {
            // Attempt to access Polymer data safely
            let data = node.__data || node.data || node.inst?.data;
            if (!data) return;
            
            // If the data indicates a list view, overwrite it to force grid mode
            if (data.isList || data.layout === 'list' || data.isCompact) {
                data.isList = false;
                data.layout = 'grid';
                data.isCompact = false;
                
                // Force an update if the method exists on the component
                if (typeof node.updateStyles === 'function') {
                    node.updateStyles();
                }
            }
            
            // Set properties that sometimes trick YouTube's CSS into switching modes
            node.setAttribute('is-grid', 'true');
            node.setAttribute('grid-layout', 'true');
            node.removeAttribute('is-compact');
        } catch (error) {
            // Silently fail if Polymer structure changes to prevent breaking the page
            this.utils.log(`PolymerDataOverrider: Silently failed to hack node - ${error.message}`, 'seamlessMode', 'debug');
        }
    }
}
