import { CONSTANTS } from '../../config/constants/index.js';

export const addStyle = (css, id) => {
        if (!css || typeof css !== 'string') return;
        
        // Generate a fast hash ID if none is provided to avoid duplicating nameless styles
        let styleId = id;
        if (!styleId) {
            // Fast hash: use string length and sampled characters to avoid O(N) iteration on massive CSS strings
            const len = css.length;
            const sample1 = css.charCodeAt(0) || 0;
            const sample2 = css.charCodeAt(Math.floor(len / 2)) || 0;
            const sample3 = css.charCodeAt(len - 1) || 0;
            styleId = `ypp-style-${len}-${sample1}-${sample2}-${sample3}`;
        }
        
        // 1. Check by ID first (O(1) fastest look up)
        if (document.getElementById(styleId)) return;

        try {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        } catch (error) {
            console.error('[YPP:Utils] Error adding style:', error);
        }
    };

export const removeStyle = (id) => {
        if (!id) return;
        const style = document.getElementById(id);
        if (style) style.remove();
    };

export const injectCSS = (path, id) => {
        if (!path) return;
        const fullUrl = chrome.runtime.getURL(path);
        // Check if already injected
        if (document.querySelector(`link[href="${fullUrl}"]`)) return;
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fullUrl;
        if (id) link.id = id;
        document.head.appendChild(link);
    };

export const addCssVariable = (name, value) => {
        if (!name || !value) return;
        document.documentElement.style.setProperty(`--${name}`, value);
    };

export const removeCssVariable = (name) => {
        if (!name) return;
        document.documentElement.style.removeProperty(`--${name}`);
    };

export const createToast = (() => {
        const MAX_VISIBLE = 2;
        const STAGGER_PX  = 60;      // vertical offset per toast
        const queue = [];            // pending messages
        const active = [];           // currently shown toast elements

        function _place() {
            // Reposition all active toasts so they stack cleanly
            active.forEach((el, i) => {
                el.style.bottom = `${24 + i * STAGGER_PX}px`;
            });
        }

        function _show(msg, type, duration) {
            const displayTime = duration || CONSTANTS.TIMINGS?.TOAST_DISPLAY || 3000;
            const fadeTime    = CONSTANTS.TIMINGS?.TOAST_FADE || 300;

            try {
                const toast = document.createElement('div');
                toast.className = `ypp-toast ypp-toast-${type}`;
                toast.textContent = msg;
                // Start off-screen, placed by _place()
                toast.style.bottom = '24px';
                document.body.appendChild(toast);

                active.push(toast);
                _place();

                // Trigger entrance
                void toast.offsetWidth;
                requestAnimationFrame(() => toast.classList.add('show'));

                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        toast.remove();
                        const idx = active.indexOf(toast);
                        if (idx !== -1) active.splice(idx, 1);
                        _place();
                        // Drain queue
                        if (queue.length > 0) {
                            const next = queue.shift();
                            _show(next.msg, next.type, next.duration);
                        }
                    }, fadeTime);
                }, displayTime);
            } catch (error) {
                console.error('[YPP:Utils] Error creating toast:', error);
            }
        }

        return (msg, type = 'info', duration) => {
            if (!msg || typeof msg !== 'string') return;
            if (active.length < MAX_VISIBLE) {
                _show(msg, type, duration);
            } else {
                // Enqueue — FIFO, cap queue at 4 to prevent storm
                if (queue.length < 4) queue.push({ msg, type, duration });
            }
        };
    })();

export const addPlayerButton = (className, title, svgContent, onClick) => {
        const btn = document.createElement('button');
        btn.className = `ytp-button ${className || ''}`;
        btn.title = title || '';
        
        // Safely handle SVG content
        if (typeof svgContent === 'string') {
            // Use DOMParser for safe SVG parsing (browsers automatically sanitize)
            try {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                
                // Check for parse errors
                const parseError = svgDoc.querySelector('parsererror');
                if (parseError) {
                    console.warn('[YPP] Invalid SVG in addPlayerButton');
                    btn.textContent = '?';
                } else {
                    const svgElement = svgDoc.documentElement;
                    btn.appendChild(svgElement);
                }
            } catch (error) {
                console.error('[YPP] Error parsing SVG:', error);
                btn.textContent = '?';
            }
        } else if (svgContent instanceof Element) {
            btn.appendChild(svgContent);
        }
        
        if (typeof onClick === 'function') {
            btn.onclick = onClick;
        }
        
        return btn;
    };

export const getVideo = () => {
        return document.querySelector(CONSTANTS.SELECTORS?.VIDEO || 'video');
    };

export const getPlayer = () => {
        return document.querySelector(CONSTANTS.SELECTORS?.PLAYER || '.html5-video-player') ||
               document.querySelector(CONSTANTS.SELECTORS?.WATCH_FLEXY || 'ytd-watch-flexy');
    };

export const VideoSizeTracker = {
    _observer: null,
    _videoEl: null,
    _playerNode: null,
    _isActive: false,
    _rafId: null,
    
    init() {
        if (this._isActive) return;
        if (this.startTracking) this.startTracking();
    }
};

export const getPopupPortal = () => {
    let dlg = document.getElementById('ypp-popup-portal');
    if (dlg) return dlg;
    dlg = document.createElement('div');
    dlg.id = 'ypp-popup-portal';
    document.body.appendChild(dlg);
    return dlg;
};

export const getBrowserZoomFactor = () => {
    let zoom = 1;
    try {
        const zX = window.outerWidth / window.innerWidth;
        const zY = window.outerHeight / window.innerHeight;
        if (zX > 0.3 && zX < 3.5) {
            if (Math.abs(zX - zY) < 0.25) {
                zoom = zX;
            } else {
                zoom = Math.min(zX, zY);
            }
        }
        zoom = Math.round(zoom * 100) / 100;
    } catch(e) {}
    return zoom || 1;
};

export const makePopupZoomInvariant = (panel) => {
    if (!panel) return;
    const applyZoom = () => {
        if (!panel.isConnected) return;
        const zoom = window.YPP.Utils.getBrowserZoomFactor ? window.YPP.Utils.getBrowserZoomFactor() : 1;
        const invZoom = 1 / (zoom || 1);
        panel.style.zoom = invZoom;
        panel.style.setProperty('--ypp-auto-scale', '1');
        panel.style.setProperty('--ypp-page-zoom', zoom);
        panel.style.setProperty('--ypp-inv-zoom', invZoom);
    };
    applyZoom();
    const onResize = () => applyZoom();
    window.addEventListener('resize', onResize, { passive: true });
    const observer = new MutationObserver(() => {
        if (!panel.isConnected) {
            window.removeEventListener('resize', onResize);
            observer.disconnect();
        }
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true });
};

export const positionPopupBesideVideo = (panel, triggerBtn, video, panelW) => {
    Object.assign(panel.style, {
        position: 'fixed',
        top: '56px',
        right: '24px',
        left: 'auto',
        bottom: 'auto',
        height: 'calc(100vh - 72px)',
        maxHeight: 'calc(100vh - 72px)',
        zIndex: '2147483646'
    });
};

