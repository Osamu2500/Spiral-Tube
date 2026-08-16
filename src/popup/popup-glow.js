function initGlowButtons() {
  const buttons = document.querySelectorAll('.action-btn, .theme-btn, .card-style-btn, .nav-item, .feature-card, .setting-card, .toggle-card, .preset-card, .mode-card');
  
  buttons.forEach(btn => {
    btn.classList.add('glow');
    
    // Add SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('glow-container');
    
    const rectBlur = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectBlur.setAttribute('pathLength', '100');
    rectBlur.setAttribute('stroke-linecap', 'round');
    rectBlur.classList.add('glow-blur');
    
    const rectLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectLine.setAttribute('pathLength', '100');
    rectLine.setAttribute('stroke-linecap', 'round');
    rectLine.classList.add('glow-line');
    
    svg.appendChild(rectBlur);
    svg.appendChild(rectLine);
    btn.appendChild(svg);
    
    // Set rx dynamically based on computed styles once rendered
    requestAnimationFrame(() => {
      const computedStyle = window.getComputedStyle(btn);
      let rx = computedStyle.borderRadius;
      if (rx === '0px' || !rx) {
        // fallback based on class
        if (btn.classList.contains('nav-item')) rx = '18px';
        else if (btn.classList.contains('theme-btn')) rx = '10px';
        else if (btn.classList.contains('action-btn')) rx = '10px';
        else if (btn.classList.contains('card-style-btn')) rx = '14px';
        else rx = '1.25rem';
      }
      rectBlur.setAttribute('rx', rx);
      rectLine.setAttribute('rx', rx);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
    // wait a bit for styles to settle and dynamic elements to be inserted if any
    setTimeout(initGlowButtons, 100);
});
