/**
 * @fileoverview
 * Polymer Data Overrider
 * Hacks directly into the JavaScript properties of YouTube's components.
 */
export class PolymerDataOverrider {
    constructor(logger) {
        this.logger = logger;
    }
    
    hackNode(node) {
        try {
            // Attempt to access Polymer data
            let data = node.__data || node.data || (node.inst && node.inst.data);
            if (!data) return;
            
            // If the data indicates a list view, overwrite it
            if (data.isList || data.layout === 'list' || data.isCompact) {
                data.isList = false;
                data.layout = 'grid';
                data.isCompact = false;
                
                // Force an update if the method exists
                if (typeof node.updateStyles === 'function') {
                    node.updateStyles();
                }
            }
            
            // Set properties that sometimes trick YouTube
            node.setAttribute('is-grid', 'true');
            node.setAttribute('grid-layout', 'true');
            node.removeAttribute('is-compact');
        } catch (e) {
            // Silently fail if Polymer structure changes
        }
    }
}
