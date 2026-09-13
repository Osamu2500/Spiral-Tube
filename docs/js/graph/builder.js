export function buildElements(data, themeUtils) {
  const elements = [];
  
  // 1. Build Nodes
  data.forEach(f => {
    const weight = (f.depends ? f.depends.length : 0) + (f.dependedBy ? f.dependedBy.length : 0);
    const ext = f.path.substring(f.path.lastIndexOf('.'));
    
    elements.push({
      data: { 
        id: f.path, 
        label: f.path.split('/').pop(),
        color: themeUtils ? themeUtils.stringToColor(f.category) : '#60A5FA',
        shape: themeUtils ? themeUtils.getShape(ext) : 'ellipse',
        weight: weight
      },
      classes: 'file-node'
    });
  });
  
  // 2. Build Edges
  const dataPaths = new Set(data.map(f => f.path));
  data.forEach(f => {
    if (f.depends) {
      f.depends.forEach(dep => {
        if (dataPaths.has(dep)) {
          elements.push({
            data: {
              id: `${f.path}->${dep}`,
              source: f.path,
              target: dep
            },
            classes: 'dependency-edge'
          });
        }
      });
    }
  });
  
  return elements;
}
