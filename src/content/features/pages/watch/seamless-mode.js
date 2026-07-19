export class SeamlessMode extends window.YPP.features.BaseFeature {
    static featureId = 'seamlessMode';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'seamlessMode'; }
    constructor() {
        super('seamlessMode');
        this.CONSTANTS = window.YPP.CONSTANTS || {};
        this.Utils = window.YPP.Utils || {};
        
        this.isEnabled = false;
        this.domSwapped = false;
        this.pollInterval = null;
        
        this._bindMethods();
    }

    _bindMethods() {
        this._swapNodes = this._swapNodes.bind(this);
        this._restoreNodes = this._restoreNodes.bind(this);
    }

    enable() {
        this.isEnabled = true;
        this._startPolling();
    }

    disable() {
        this.isEnabled = false;
        this._stopPolling();
        this._restoreNodes();
        super.disable();
    }

    onPageChange() {
        const isWatchPage = location.pathname === '/watch';
        if (isWatchPage && this.isEnabled) {
            this._startPolling();
        } else {
            this._stopPolling();
            this._restoreNodes();
        }
    }

    _startPolling() {
        this._stopPolling(); // Clear existing
        this.pollInterval = setInterval(() => {
            if (this.isEnabled) this._swapNodes();
        }, 1000);
        this._swapNodes(); // Try immediately
    }

    _stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    _swapNodes() {
        // If it's already swapped correctly, do nothing
        if (this.domSwapped) return;

        const primaryInner = document.querySelector('#primary-inner');
        const secondaryInner = document.querySelector('#secondary-inner');
        
        if (!primaryInner || !secondaryInner) return;

        const below = document.querySelector('#below');
        const related = document.querySelector('#related');

        if (!below || !related) return;

        // Ensure we are moving them to the correct targets
        if (below.parentElement === secondaryInner && related.parentElement === primaryInner) {
            this.domSwapped = true;
            return;
        }

        try {
            // Move #below to #secondary-inner (Right Sidebar)
            secondaryInner.appendChild(below);

            // Move #related to #primary-inner (Under Video)
            primaryInner.appendChild(related);

            this.domSwapped = true;
        } catch (e) {
            this.Utils.log('Error swapping nodes in Seamless Mode', 'SEAMLESS_MODE', 'warn');
        }
    }

    _restoreNodes() {
        if (!this.domSwapped) return;

        const primaryInner = document.querySelector('#primary-inner');
        const secondaryInner = document.querySelector('#secondary-inner');
        const below = document.querySelector('#below');
        const related = document.querySelector('#related');

        if (primaryInner && below && below.parentElement !== primaryInner) {
            primaryInner.appendChild(below);
        }

        if (secondaryInner && related && related.parentElement !== secondaryInner) {
            secondaryInner.appendChild(related);
        }

        this.domSwapped = false;
    }
}

window.YPP.features.SeamlessMode = SeamlessMode;
