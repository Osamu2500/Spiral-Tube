/**
 * Full Video Titles
 * Prevents YouTube from truncating video titles with an ellipsis.
 */
export class FullVideoTitles extends window.YPP.features.BaseFeature {
    static featureId = 'displayFullTitle';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('FullVideoTitles');
        this.CONSTANTS = window.YPP.CONSTANTS || {};
        this.CSS_CLASS = this.CONSTANTS.CSS_CLASSES?.DISPLAY_FULL_TITLE || 'ypp-full-title';
    }

    getConfigKey() {
        return 'displayFullTitle';
    }

    async enable() {
        const mode = this.settings[this.getConfigKey()];
        
        // Remove old classes
        document.documentElement.classList.remove(this.CSS_CLASS, 'ypp-full-title-hover', 'ypp-full-title-always', 'ypp-smooth-title-scroll');
        document.body.classList.remove(this.CSS_CLASS, 'ypp-full-title-hover', 'ypp-full-title-always', 'ypp-smooth-title-scroll');

        if (mode === 'hover') {
            document.documentElement.classList.add('ypp-full-title-hover');
            document.body.classList.add('ypp-full-title-hover');
            if (this.settings.smoothTitleScroll) {
                document.documentElement.classList.add('ypp-smooth-title-scroll');
                document.body.classList.add('ypp-smooth-title-scroll');
            }
        } else if (mode === 'always') {
            document.documentElement.classList.add('ypp-full-title-always');
            document.body.classList.add('ypp-full-title-always');
        } else if (mode === true) {
            // Legacy support
            document.documentElement.classList.add(this.CSS_CLASS);
            document.body.classList.add(this.CSS_CLASS);
        }

        if (this.settings.declickbaitTitles) {
            this.enableDeclickbait();
        } else {
            this.disableDeclickbait();
        }
    }

    enableDeclickbait() {
        if (!this.observer) return;
        
        const selectors = [
            '#video-title', 
            'yt-formatted-string[id="video-title"]', 
            '.yt-lockup-metadata-view-model-wiz__title'
        ].join(',');

        this.observer.register(this.name + '_declickbait', selectors, (elements) => {
            elements.forEach(el => {
                if (this.isProcessed(el, 'declickbait')) return;
                this.formatTitle(el);
            });
        }, true, true); // true = immediate, true = lazy (viewport only)
    }

    disableDeclickbait() {
        if (this.observer) this.observer.unregister(this.name + '_declickbait');
        this.revertDeclickbait();
    }

    formatTitle(el) {
        if (!el.hasAttribute('data-ypp-original-title')) {
            el.setAttribute('data-ypp-original-title', el.textContent);
        }

        const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
        if (textNodes.length === 0 && el.textContent) {
            el.textContent = this.toSentenceCase(el.textContent);
        } else {
            textNodes.forEach(node => {
                if (node.textContent) node.textContent = this.toSentenceCase(node.textContent);
            });
        }
        
        // Ensure tooltip matches
        if (el.hasAttribute('title')) {
            el.setAttribute('title', el.textContent);
        }
    }

    revertDeclickbait() {
        document.querySelectorAll('[data-ypp-original-title]').forEach(el => {
            el.textContent = el.getAttribute('data-ypp-original-title');
            el.removeAttribute('data-ypp-original-title');
            if (el.hasAttribute('title')) {
                el.setAttribute('title', el.textContent);
            }
        });
    }

    toSentenceCase(str) {
        if (!str) return str;
        // Strip non-letters to analyze text case composition
        const letters = str.replace(/[^A-Za-z]/g, '');
        if (letters.length < 5) return str;
        
        const upperCount = (letters.match(/[A-Z]/g) || []).length;
        // If it's more than 35% uppercase, consider it clickbait and format it
        if (upperCount / letters.length < 0.35) return str; 
        
        return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    }

    async onUpdate(settings, oldSettings) {
        await this.enable();
    }

    async disable() {
        document.documentElement.classList.remove(this.CSS_CLASS, 'ypp-full-title-hover', 'ypp-full-title-always');
        document.body.classList.remove(this.CSS_CLASS, 'ypp-full-title-hover', 'ypp-full-title-always');
    }
};

window.YPP.features.FullVideoTitles = FullVideoTitles;
