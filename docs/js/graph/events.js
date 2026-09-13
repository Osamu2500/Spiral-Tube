export function bindGraphEvents(cy, sidebarManager, detailsPanel) {
  // Hover effects
  cy.on('mouseover', 'node.file-node', (e) => {
    const node = e.target;
    document.getElementById('cy').style.cursor = 'pointer';
    
    // Don't override if a node is actively locked/clicked
    if (cy.elements().hasClass('locked')) return; 
    
    highlightNode(cy, node.id(), false);
  });
  
  cy.on('mouseout', 'node.file-node', (e) => {
    document.getElementById('cy').style.cursor = 'default';
    if (cy.elements().hasClass('locked')) return;
    clearHighlights(cy);
  });

  // Click effects
  cy.on('tap', 'node.file-node', (e) => {
    const id = e.target.id();
    clearHighlights(cy);
    cy.elements().addClass('locked');
    highlightNode(cy, id, true);
    if (sidebarManager) sidebarManager.setActive(id);
    if (detailsPanel) detailsPanel.open(id);
  });

  // Click background to clear
  cy.on('tap', (e) => {
    if (e.target === cy) {
      cy.elements().removeClass('locked');
      clearHighlights(cy);
      if (sidebarManager) sidebarManager.clearActive();
      if (detailsPanel) detailsPanel.close();
    }
  });
}

export function highlightNode(cy, id, animateCam = false) {
  if (!cy) return;
  const node = cy.getElementById(id);
  if (node.length === 0) return;
  
  const inEdges = node.incomers('edge');
  const outEdges = node.outgoers('edge');
  const neighbors = node.neighborhood('node');
  
  // Dim everything
  cy.elements().removeClass('highlight dim highlight-in highlight-out').addClass('dim');
  
  // Bring back hovered node and neighbors
  node.removeClass('dim').addClass('highlight');
  neighbors.removeClass('dim');
  
  // Highlight edges
  inEdges.removeClass('dim').addClass('highlight-in');
  outEdges.removeClass('dim').addClass('highlight-out');
  
  if (animateCam) {
    cy.animate({
      fit: { 
        eles: cy.collection().add(node).add(neighbors), 
        padding: 80 
      },
      duration: 500,
      easing: 'ease-out-cubic'
    });
  }
}

export function clearHighlights(cy) {
  if (!cy) return;
  cy.elements().removeClass('highlight dim highlight-in highlight-out locked');
}
