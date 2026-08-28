/**
 * Custom Dialog
 * Owns: Styled alert, confirm, and prompt modals that match the extension's UI.
 * Targets: Dynamic DOM overlay insertion.
 * Does not affect functionality outside the scope of displaying a dialog.
 */
export class CustomDialog {
    static featureId = 'customDialog';
    static executionPhase = 'idle';
    static priority = 999;

    // ── Private helpers ────────────────────────────────────────────────────

    /**
     * Creates and appends the semi-transparent overlay backdrop to the body.
     * @returns {HTMLDivElement}
     */
    static _createOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = [
            'position:fixed;top:0;left:0;width:100%;height:100%',
            'background:rgba(0,0,0,0.6);backdrop-filter:blur(8px)',
            'z-index:999999;display:flex;align-items:center;justify-content:center',
            'opacity:0;transition:opacity 0.2s',
        ].join(';');
        overlay.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; display: flex !important; justify-content: center !important; align-items: center !important; background: transparent !important; pointer-events: auto !important;'; document.documentElement.appendChild(overlay);
        return overlay;
    }

    /**
     * Wraps `innerHtml` in the shared dialog card shell and injects it into
     * `overlay`, then triggers the entry animation.
     * @param {HTMLElement} overlay
     * @param {string}      innerHtml  Already-escaped HTML for the card body
     * @returns {HTMLElement} The card element (overlay.children[0])
     */
    static _buildCard(overlay, innerHtml) {
        overlay.innerHTML = `
            <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;width:100%;max-width:360px;box-shadow:0 16px 48px rgba(0,0,0,0.5);transform:scale(0.95);transition:transform 0.2s;display:flex;flex-direction:column;gap:16px;">
                ${innerHtml}
            </div>
        `;
        const card = overlay.children[0];
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
        return card;
    }

    /**
     * Animates the dialog out and removes the overlay from the DOM.
     * @param {HTMLElement} overlay
     * @param {Function}    resolve  Promise resolver
     * @param {*}           value    Value to resolve the promise with
     */
    static _closeOverlay(overlay, resolve, value) {
        overlay.style.opacity = '0';
        overlay.children[0].style.transform = 'scale(0.95)';
        setTimeout(() => overlay.remove(), 200);
        resolve(value);
    }

    // ── Public API ─────────────────────────────────────────────────────────

    /**
     * Shows a simple alert dialog with an OK button.
     * @param {string} title
     * @param {string} message
     * @returns {Promise<void>}
     */
    static alert(title, message) {
        return new Promise(resolve => {
            const overlay = this._createOverlay();
            this._buildCard(overlay, `
                <div style="font-size:18px;font-weight:600;color:#fff;">${_escHtml(title)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;">${_escHtml(message)}</div>
                <div style="display:flex;justify-content:flex-end;">
                    <button id="ypp-alert-ok" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">OK</button>
                </div>
            `);
            overlay.querySelector('#ypp-alert-ok').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, undefined)
            );
        });
    }

    /**
     * Shows a confirm dialog with Cancel / Confirm buttons.
     * @param {string}  title
     * @param {string}  message
     * @param {string}  [confirmText='Confirm']
     * @param {boolean} [danger=false]  When true the confirm button is styled red
     * @returns {Promise<boolean>}  true = confirmed, false = cancelled
     */
    static confirm(title, message, confirmText = 'Confirm', danger = false) {
        return new Promise(resolve => {
            const overlay = this._createOverlay();
            const btnColor = danger ? 'rgba(255,78,69,0.4)' : 'rgba(255,255,255,0.15)';
            this._buildCard(overlay, `
                <div style="font-size:18px;font-weight:600;color:#fff;">${_escHtml(title)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;">${_escHtml(message)}</div>
                <div style="display:flex;justify-content:flex-end;gap:12px;">
                    <button id="ypp-confirm-cancel" style="background:rgba(255,255,255,0.05);color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Cancel</button>
                    <button id="ypp-confirm-ok" style="background:${btnColor};color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">${_escHtml(confirmText)}</button>
                </div>
            `);
            overlay.querySelector('#ypp-confirm-cancel').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, false)
            );
            overlay.querySelector('#ypp-confirm-ok').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, true)
            );
        });
    }

    /**
     * Shows a text-input prompt dialog.
     * @param {string} title
     * @param {string} message
     * @param {string} [placeholder='']
     * @param {string} [defaultValue='']
     * @returns {Promise<string|null>}  The input value, or null if cancelled
     */
    static prompt(title, message, placeholder = '', defaultValue = '') {
        return new Promise(resolve => {
            const overlay = this._createOverlay();
            // Escape values going into HTML attributes to prevent injection
            const safePlaceholder = _escHtml(placeholder);
            this._buildCard(overlay, `
                <div style="font-size:18px;font-weight:600;color:#fff;">${_escHtml(title)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;margin-bottom:-4px;">${_escHtml(message)}</div>
                <input type="text" id="ypp-prompt-input" placeholder="${safePlaceholder}" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:12px;border-radius:8px;font-size:14px;outline:none;width:100%;box-sizing:border-box;">
                <div style="display:flex;justify-content:flex-end;gap:12px;">
                    <button id="ypp-prompt-cancel" style="background:rgba(255,255,255,0.05);color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Cancel</button>
                    <button id="ypp-prompt-ok" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Submit</button>
                </div>
            `);

            // Set defaultValue via DOM property (safe — avoids attribute injection)
            const input = overlay.querySelector('#ypp-prompt-input');
            input.value = defaultValue;
            input.focus();
            input.select();

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter')  this._closeOverlay(overlay, resolve, input.value);
                if (e.key === 'Escape') this._closeOverlay(overlay, resolve, null);
            });
            overlay.querySelector('#ypp-prompt-cancel').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, null)
            );
            overlay.querySelector('#ypp-prompt-ok').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, input.value)
            );
        });
    }
};

/** Escapes a string for safe insertion into innerHTML. */
function _escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
