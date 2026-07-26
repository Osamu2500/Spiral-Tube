/**
 * Save Supreme UI Feature (Style 25092)
 * Enhances YouTube's "Save to playlist" popup menu with a cleaner grid/list view,
 * better thumbnail presentation, and improved subtitle contrast.
 */

export class SaveSupremeUI extends window.YPP.features.BaseFeature {
    static featureId = 'saveSupremeUI';
    static executionPhase = 'idle';
    static priority = 19;

    constructor() {
        super('SaveSupremeUI');
        this.name = 'SaveSupremeUI';
    }

    getConfigKey() {
        return 'saveSupremeUI';
    }

    async enable() {
        await super.enable();
        this.applySaveSupreme(true);
        this.utils?.log?.('Save Supreme UI enabled (Style 25092)', 'SAVE-SUPREME-UI');
    }

    async disable() {
        await super.disable();
        this.applySaveSupreme(false);
        this.utils?.log?.('Save Supreme UI disabled', 'SAVE-SUPREME-UI');
    }

    async onUpdate() {
        this.applySaveSupreme(this.isEnabled);
    }

    applySaveSupreme(active) {
        const body = document.body;
        if (active) {
            if (body) body.classList.add('ypp-save-supreme-ui');
        } else {
            if (body) body.classList.remove('ypp-save-supreme-ui');
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.SaveSupremeUI = SaveSupremeUI;
