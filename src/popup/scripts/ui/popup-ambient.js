export function initAmbientBackground(doc) {
    const orbs = doc.querySelectorAll('.ambient-orb');
    if (!orbs.length) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Store original positions from CSS if needed, but we can just use dynamic positioning
    doc.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function render() {
        const xOffset = (mouseX / window.innerWidth - 0.5) * 40;
        const yOffset = (mouseY / window.innerHeight - 0.5) * 40;
        
        orbs.forEach((orb, index) => {
            const factor = (index + 1) * 0.8;
            orb.style.transform = `translate(${xOffset * factor}px, ${yOffset * factor}px)`;
        });

        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
}
