export const GraphStyles = [
  // Basic File Node
  {
    selector: '.file-node',
    style: {
      'label': 'data(label)',
      'background-color': 'data(color)',
      'background-opacity': 0.9,
      'shape': 'data(shape)',
      'color': '#f8fafc',
      'font-size': '10px',
      'font-family': '"Inter", sans-serif',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 6,
      'text-outline-color': '#09090b',
      'text-outline-width': 2,
      'width': 24,
      'height': 24,
      'border-width': 1,
      'border-color': '#ffffff',
      'border-opacity': 0.3,
      'transition-property': 'background-color, border-width',
      'transition-duration': 0.2
    }
  },
  // Edges
  {
    selector: '.dependency-edge',
    style: {
      'width': 1.5,
      'line-color': '#ffffff',
      'target-arrow-color': '#ffffff',
      'opacity': 0.15,
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'arrow-scale': 1.2
    }
  },
  // Interaction States: Dimming
  {
    selector: 'node.dim, edge.dim',
    style: {
      'opacity': 0.05
    }
  },
  // Interaction States: Focus Node
  {
    selector: '.file-node.highlight',
    style: {
      'border-color': '#fff',
      'border-width': 3,
      'underlay-color': 'data(color)',
      'underlay-padding': 10,
      'underlay-opacity': 0.6,
      'underlay-shape': 'ellipse',
      'opacity': 1
    }
  },
  // Interaction States: Focus Edges
  {
    selector: 'edge.highlight-in',
    style: {
      'line-color': '#60A5FA', // Blue incoming
      'target-arrow-color': '#60A5FA',
      'width': 2.5,
      'opacity': 0.9,
      'z-index': 10
    }
  },
  {
    selector: 'edge.highlight-out',
    style: {
      'line-color': '#F472B6', // Pink outgoing
      'target-arrow-color': '#F472B6',
      'width': 2.5,
      'opacity': 0.9,
      'line-style': 'dashed',
      'line-dash-pattern': [6, 4],
      'z-index': 10
    }
  }
];
