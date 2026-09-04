/**
 * Theme Effects Manager - Extracted from ThemeManager
 * Handles dynamic decorative HTML injections for specific UI themes (e.g. Frutiger Aero bubbles).
 */

export class ThemeEffectsManager {
    /**
     * Apply or remove theme effects based on the active UI style
     * 
     * @param {string} uiStyleKey - Active UI style (e.g. 'frutiger-aero')
     * @param {boolean} enableEffects - Whether effects are enabled in settings
     */
    apply(uiStyleKey, enableEffects) {
        if (uiStyleKey === 'frutiger-aero' && enableEffects) {
            this._injectFrutigerBubbles();
        } else {
            this._removeFrutigerBubbles();
        }
    }

    /**
     * Clean up all injected effects
     */
    cleanup() {
        this._removeFrutigerBubbles();
    }

    /**
     * Inject HTML bubbles for Frutiger Aero theme
     * @private
     */
    _injectFrutigerBubbles() {
        const id = 'ypp-frutiger-bubbles';
        if (document.getElementById(id)) return;

        const container = document.createElement('div');
        container.id = id;
        container.className = 'frutiger-bubbles-container';
        // Ensure it always stays behind the main content (especially videos)
        container.style.zIndex = '0';

        // Add 50 bubbles with randomized properties
        for (let i = 0; i < 50; i++) {
            const span = document.createElement('span');
            span.className = 'fa-bubble';
            
            const size = Math.random() * 60 + 10; // 10px to 70px
            const left = Math.random() * 100; // 0% to 100vw
            const delay = Math.random() * 20; // 0s to 20s
            const durationY = Math.random() * 10 + 10; // 10s to 20s
            const durationX = Math.random() * 5 + 3; // 3s to 8s
            
            span.style.width = `${size}px`;
            span.style.height = `${size}px`;
            span.style.left = `${left}vw`;
            span.style.bottom = `-${size + 20}px`; // Start below the screen
            span.style.animationDuration = `${durationY}s, ${durationX}s`;
            span.style.animationDelay = `${delay}s, ${delay}s`;
            
            container.appendChild(span);
        }

        // Insert at the beginning of body to ensure it stays behind UI elements
        if (document.body) {
            document.body.insertBefore(container, document.body.firstChild);
        }
    }

    /**
     * Remove HTML bubbles
     * @private
     */
    _removeFrutigerBubbles() {
        const container = document.getElementById('ypp-frutiger-bubbles');
        if (container) container.remove();
    }
}
