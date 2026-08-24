/**
 * Real Cinema Mode Feature (Style 11811)
 * Expands YouTube's theater mode to span 100vw across the browser window
 * and auto-hides the top masthead when scrolling down in theater view.
 */

export class RealCinemaMode extends window.YPP.features.BaseFeature {
    static featureId = 'realCinemaMode';
    static executionPhase = 'idle';
    static priority = 15;

    constructor() {
        super('RealCinemaMode');
        this.name = 'RealCinemaMode';
    }

    getConfigKey() {
        return 'realCinemaMode';
    }

    async enable() {
        await super.enable();
        this.applyCinemaMode(true);
        this.utils?.log?.('Real Cinema Mode enabled (Style 11811)', 'REAL-CINEMA');
    }

    async disable() {
        await super.disable();
        this.applyCinemaMode(false);
        this.utils?.log?.('Real Cinema Mode disabled', 'REAL-CINEMA');
    }

    async onUpdate() {
        this.applyCinemaMode(this.isEnabled);
    }

    applyCinemaMode(active) {
        const body = document.body;
        const html = document.documentElement;
        if (active) {
            if (body) body.classList.add('ypp-real-cinema-mode');
            if (html) html.classList.add('ypp-real-cinema-mode');
        } else {
            if (body) body.classList.remove('ypp-real-cinema-mode');
            if (html) html.classList.remove('ypp-real-cinema-mode');
        }
    }
}

