export function makeDraggable(barElement) {
    barElement.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input, .ypp-gpb-time-capsule, .ypp-gpb-vol-wrap')) return;
        e.preventDefault();
        
        // Cancel transition during drag for 1:1 movement
        barElement.style.transition = 'none';
        const rect = barElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // Create iframe shield to prevent iframes from swallowing mouse events
        let shield = document.createElement('div');
        shield.style.cssText = 'position: fixed; inset: 0; z-index: 2147483646; cursor: grabbing;';
        document.body.appendChild(shield);

        const onMouseMove = (moveEvent) => {
            barElement.style.left = (moveEvent.clientX - offsetX) + 'px';
            barElement.style.top = (moveEvent.clientY - offsetY) + 'px';
            barElement.style.right = 'auto';
            barElement.style.bottom = 'auto';
            barElement.style.transform = 'none';
        };

        const onMouseUp = () => {
            barElement.style.transition = ''; // Restore CSS transitions
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (shield) {
                shield.remove();
                shield = null;
            }
            
            // Save custom position to localStorage (site-specific)
            try {
                localStorage.setItem('ypp_gpb_custom_pos', JSON.stringify({
                    left: barElement.style.left,
                    top: barElement.style.top
                }));
            } catch(e){}
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}
