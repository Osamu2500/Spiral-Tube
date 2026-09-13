import { GraphStyles } from './styles.js';
import { buildElements } from './builder.js';
import { bindGraphEvents, highlightNode, clearHighlights } from './events.js';

export const GraphEngine = {
  cy: null,
  
  init() {
    const DATA = window.ARCHITECTURE_DATA;
    if (DATA.length === 0) {
      document.getElementById('loader').innerHTML = 'No data found. Run generator script.';
      return;
    }
    
    const elements = buildElements(DATA, window.ThemeUtils);
    
    // Initialize Cytoscape
    this.cy = window.cytoscape({
      container: document.getElementById('cy'),
      elements: elements,
      style: GraphStyles,
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 50,
        randomize: true,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      },
      zoom: 1,
      minZoom: 0.1,
      maxZoom: 2.5,
    });

    // Hide loader when layout stops
    this.cy.on('layoutstop', () => {
      document.getElementById('loader').style.display = 'none';
    });
    // Fallback if layoutstop doesn't fire for synchronous layout
    setTimeout(() => {
      document.getElementById('loader').style.display = 'none';
    }, 500);

    // Bind all hover and click events
    bindGraphEvents(this.cy, window.SidebarManager, window.DetailsPanel);
  },

  // Expose these methods in case other modules need to trigger highlights programmatically
  highlightNode(id, animateCam = false) {
    highlightNode(this.cy, id, animateCam);
  },
  
  clearHighlights() {
    clearHighlights(this.cy);
  }
};
