export const ThemeUtils = {
  // Generate distinct vibrant colors for categories
  stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 75%, 65%)`; // Vibrant neon pastel
  },
  
  getShape(ext) {
    if (ext === '.css') return 'round-rectangle';
    if (ext === '.html') return 'diamond';
    return 'ellipse';
  }
};
