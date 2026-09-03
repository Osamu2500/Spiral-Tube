export function setupUtilsMock() {
    window.YPP = window.YPP || {};
    window.YPP.features = window.YPP.features || {};

    window.YPP.CONSTANTS = window.YPP.CONSTANTS || {
        SELECTORS: {
            VIDEO: ['video']
        }
    };

    window.YPP.Utils = window.YPP.Utils || {
        log: (msg, ctx = 'GPB', level = 'info') => {
            if (level === 'debug') return;
            const styles = {
                info:  'color:#3ea6ff;font-weight:bold;',
                warn:  'color:#ff9800;font-weight:bold;',
                error: 'color:#f44336;font-weight:bold;',
            };
            (console[level] || console.log)(
                `%c[YPP:${ctx}]`, styles[level] || styles.info, msg
            );
        },
        removeStyle: (id) => {
            if (!id) return;
            [document.getElementById(id), document.querySelector(`link#${id}`)]
                .forEach(el => el?.remove());
        },
        positionPopupBesideVideo: (panel, triggerBtn, video, panelW) => {
            const GAP = 10, MARGIN = 8;
            const W = window.innerWidth, H = window.innerHeight;
            const btnRect = triggerBtn.getBoundingClientRect();
            const vRect   = video?.getBoundingClientRect?.() || null;
            const hasVideo = vRect && vRect.width > 20 && vRect.height > 20;

            let effectiveW = panelW;
            if (hasVideo) {
                const spaceLeft  = vRect.left - MARGIN;
                const spaceRight = W - vRect.right - MARGIN;
                const maxHoriz   = Math.max(spaceLeft, spaceRight, W * 0.45);
                effectiveW = Math.min(panelW, Math.max(280, maxHoriz - GAP));
            } else {
                effectiveW = Math.min(panelW, W * 0.45);
            }
            panel.style.width = effectiveW + 'px';

            const estH     = Math.min(panel.scrollHeight > 40 ? panel.scrollHeight : 380, H * 0.85);
            const clampTop  = t => Math.max(MARGIN, Math.min(t, H - estH - MARGIN));
            const clampLeft = l => Math.max(MARGIN, Math.min(l, W - effectiveW - MARGIN));

            let left, top;

            if (hasVideo) {
                const spaceAbove = vRect.top - MARGIN;
                const spaceBelow = H - vRect.bottom - MARGIN;
                const spaceLeft  = vRect.left - MARGIN;
                const spaceRight = W - vRect.right - MARGIN;

                const btnCentreX = btnRect.left + btnRect.width / 2;
                const idealLeft  = clampLeft(btnCentreX - effectiveW / 2);

                if (spaceAbove >= Math.min(estH, 260)) {
                    top  = vRect.top - GAP - estH;
                    left = idealLeft;
                } else if (spaceBelow >= Math.min(estH, 260)) {
                    top  = vRect.bottom + GAP;
                    left = idealLeft;
                } else if (spaceLeft >= effectiveW + MARGIN) {
                    left = vRect.left - GAP - effectiveW;
                    top  = clampTop(btnRect.top + btnRect.height / 2 - estH / 2);
                } else if (spaceRight >= effectiveW + MARGIN) {
                    left = vRect.right + GAP;
                    top  = clampTop(btnRect.top + btnRect.height / 2 - estH / 2);
                } else {
                    left = btnRect.left - GAP - effectiveW;
                    top  = clampTop(btnRect.top + btnRect.height / 2 - estH / 2);
                }
            } else {
                left = btnRect.left - GAP - effectiveW;
                top  = clampTop(btnRect.top + btnRect.height / 2 - estH / 2);
            }

            panel.style.left = clampLeft(left) + 'px';
            panel.style.top  = clampTop(top)   + 'px';
        },
        addStyle: (css, id) => {
            if (id && document.getElementById(id)) return;
            const style = document.createElement('style');
            if (id) style.id = id;
            style.textContent = css;
            document.head.appendChild(style);
        },
        getPopupPortal: () => {
            let dlg = document.getElementById('ypp-popup-portal');
            if (dlg) return dlg;
            dlg = document.createElement('div');
            dlg.id = 'ypp-popup-portal';
            dlg.style.cssText =
                'display:block!important;position:fixed!important;inset:0!important;width:100%!important;height:100%!important;' +
                'max-width:100%!important;max-height:100%!important;' +
                'border:0!important;outline:0!important;padding:0!important;margin:0!important;' +
                'background:transparent!important;overflow:visible!important;' +
                'pointer-events:none!important;z-index:2147483647!important;' +
                'transform:none!important;filter:none!important;perspective:none!important;';
            
            if ('popover' in dlg) {
                dlg.popover = "manual";
            }
            
            document.documentElement.appendChild(dlg);
            
            if ('popover' in dlg) {
                try { dlg.showPopover(); } catch(e) {}
            }
            return dlg;
        },
    };

    window.YPP.features.BaseFeature = class BaseFeature {
        constructor(name) {
            this.name      = name || this.constructor.name;
            this.isEnabled = false;
            this.settings  = {};
            this.utils     = window.YPP.Utils;
            this.eventListeners = [];
            this.abortController = new AbortController();
        }
        async enable()  {}
        async disable() {
            this.eventListeners.forEach(({target, type, listener, options}) => {
                target.removeEventListener(type, listener, options);
            });
            this.eventListeners = [];
        }
        update(settings) {
            this.settings = { ...this.settings, ...settings };
            if (this.onUpdate) this.onUpdate();
        }
        getConfigKey() {
            if (!this.name) return null;
            return this.name.charAt(0).toLowerCase() + this.name.slice(1);
        }
        addListener(target, type, listener, options) {
            target.addEventListener(type, listener, options);
            this.eventListeners.push({ target, type, listener, options });
        }
        removeListener(target, type, listener, options) {
            target.removeEventListener(type, listener, options);
            this.eventListeners = this.eventListeners.filter(e => 
                e.target !== target || e.type !== type || e.listener !== listener
            );
        }
        pollFor(conditionFn, timeout = 10000, intervalMs = 250) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const check = () => {
                    if (this.abortController?.signal?.aborted) return reject(new Error('Aborted'));
                    try {
                        const result = conditionFn();
                        if (result) return resolve(result);
                    } catch (e) {}
                    if (Date.now() - startTime >= timeout) return reject(new Error('Timeout'));
                    setTimeout(check, intervalMs);
                };
                check();
            });
        }
    };

    window.YPP.features.FilterPresets = window.YPP.features.FilterPresets || { PRESETS: [] };
}
