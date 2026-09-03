import { CONSTANTS } from '../../config/constants/index.js';

export const getVideoContainerSelectors = () => {
        const pathname = window.location.pathname;
        const isChannelPage = !!pathname && (pathname.startsWith('/@') || pathname.startsWith('/channel/'));

        if (pathname === '/watch') {
            return 'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer';
        }
        if (isChannelPage) {
            return 'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer';
        }
        return 'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer, ytm-rich-item-renderer';
    };

export const findOutermostMatch = (element, selectors) => {
        let item = element;
        let match = null;
        while (item) {
            if (item.matches && item.matches(selectors)) {
                match = item;
            }
            item = item.parentElement;
        }
        return match;
    };

export const batch = (() => {
        let reads = [];
        let writes = [];
        let scheduled = false;

        function flush() {
            const r = reads;
            const w = writes;
            reads = [];
            writes = [];
            scheduled = false;

            try {
                for (let i = 0; i < r.length; i++) r[i]();
                for (let i = 0; i < w.length; i++) w[i]();
            } catch (e) {
                window.YPP.Utils?.log('Batch execution error: ' + e.message, 'UTILS', 'error');
            }
        }

        return {
            read(task) {
                reads.push(task);
                if (!scheduled) {
                    scheduled = true;
                    requestAnimationFrame(flush);
                }
            },
            write(task) {
                writes.push(task);
                if (!scheduled) {
                    scheduled = true;
                    requestAnimationFrame(flush);
                }
            }
        };
    })();

export const safeQuerySelector = (selector, parent = document) => {
        if (!selector || typeof selector !== 'string') return null;
        try {
            return parent.querySelector(selector);
        } catch (e) {
            window.YPP.Utils?.log(`Invalid selector: ${selector}`, 'UTILS', 'warn');
            return null;
        }
    };

export const safeQuerySelectorAll = (selector, parent = document) => {
        if (!selector || typeof selector !== 'string') return [];
        try {
            return parent.querySelectorAll(selector);
        } catch (e) {
            window.YPP.Utils?.log(`Invalid selector: ${selector}`, 'UTILS', 'warn');
            return [];
        }
    };

export const waitForElement = (selector, timeout = CONSTANTS.TIMINGS?.ELEMENT_WAIT_DEFAULT || 10000, signal = null) => {
        // Input validation
        if (!selector || typeof selector !== 'string') {
            window.YPP.Utils?.log('Invalid selector provided to waitForElement', 'UTILS', 'warn');
            return Promise.resolve(null);
        }
        
        // Validate timeout
        if (typeof timeout !== 'number' || timeout <= 0 || !isFinite(timeout)) {
            window.YPP.Utils?.log(`Invalid timeout (${timeout}), using default 10000ms`, 'UTILS', 'warn');
            timeout = 10000;
        }

        if (signal?.aborted) return Promise.resolve(null);

        // Try distinct lookup first
        try {
            const existing = document.querySelector(selector);
            if (existing) return Promise.resolve(existing);
        } catch (e) {
            window.YPP.Utils?.log(`Invalid CSS selector: ${selector}`, 'UTILS', 'error');
            return Promise.resolve(null);
        }

        return new Promise((resolve) => {
            let resolved = false;
            let timeoutId = null;
            const startUrl = location.href; // Capture URL for early abort
            
            // Generate unique ID for the shared observer registry
            const observerId = 'wait-' + Math.random().toString(36).substr(2, 9);
            let fallbackObserver = null;

            const cleanup = () => {
                if (window.YPP?.sharedObserver) {
                    window.YPP.sharedObserver.unregister(observerId);
                }
                if (fallbackObserver) {
                    fallbackObserver.disconnect();
                    fallbackObserver = null;
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                if (signal) {
                    signal.removeEventListener('abort', handleAbort);
                }
            };

            const handleAbort = () => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    resolve(null);
                }
            };

            if (signal) {
                signal.addEventListener('abort', handleAbort);
            }

            const checkMatches = (matches) => {
                if (resolved) return;

                // Abort if the user navigates away before element is found
                if (location.href !== startUrl) {
                    resolved = true;
                    cleanup();
                    resolve(null);
                    return;
                }

                // If elements are passed from sharedObserver, use the first one
                if (matches && matches.length > 0) {
                    resolved = true;
                    cleanup();
                    resolve(matches[0]);
                    return;
                }
                
                // Fallback check just in case
                try {
                    const el = document.querySelector(selector);
                    if (el) {
                        resolved = true;
                        cleanup();
                        resolve(el);
                    }
                } catch (e) {}
            };

            // Use the centralized coalescing observer if available (massive performance gain)
            if (window.YPP?.sharedObserver) {
                window.YPP.sharedObserver.register(observerId, selector, checkMatches, true);
            } else {
                // Fallback for very early initialization before sharedObserver is ready
                let rafId = null;
                const scheduleCheck = () => {
                    if (rafId) return;
                    rafId = requestAnimationFrame(() => {
                        rafId = null;
                        checkMatches();
                    });
                };
                fallbackObserver = new MutationObserver(scheduleCheck);
                fallbackObserver.observe(document.documentElement, { childList: true, subtree: true });
                checkMatches();
            }

            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        cleanup();
                        resolve(null);
                    }
                }, timeout);
            }
        });
    };

export const waitForElements = (selectors, timeout = 10000) => {
        const results = new Map();
        let remaining = selectors.length;

        if (remaining === 0) {
            return Promise.resolve(results);
        }

        return new Promise((resolve) => {
            const startUrl = location.href;
            const observerId = 'waits-' + Math.random().toString(36).substr(2, 9);
            let fallbackObserver = null;
            let rafId = null;

            const cleanup = () => {
                if (window.YPP?.sharedObserver) {
                    window.YPP.sharedObserver.unregister(observerId);
                }
                if (fallbackObserver) {
                    fallbackObserver.disconnect();
                    fallbackObserver = null;
                }
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            };

            const checkElements = () => {
                // Abort if the user navigates away before elements are found
                if (location.href !== startUrl) {
                    cleanup();
                    resolve(results); // Return what we found so far
                    return;
                }
                selectors.forEach(sel => {
                    if (!results.has(sel)) {
                        try {
                            const el = document.querySelector(sel);
                            if (el) {
                                results.set(sel, el);
                                remaining--;
                            }
                        } catch (e) {}
                    }
                });

                if (remaining === 0) {
                    cleanup();
                    resolve(results);
                }
            };

            // Use the centralized coalescing observer if available
            if (window.YPP?.sharedObserver) {
                // Register for any of the selectors. The DOMObserver will batch evaluate.
                window.YPP.sharedObserver.register(observerId, selectors.join(','), checkElements, true);
            } else {
                // Coalesce rapid mutations into one check per animation frame
                const scheduleCheck = () => {
                    if (rafId) return;
                    rafId = requestAnimationFrame(() => {
                        rafId = null;
                        checkElements();
                    });
                };

                fallbackObserver = new MutationObserver(scheduleCheck);
                fallbackObserver.observe(document.documentElement, { childList: true, subtree: true });
                checkElements();
            }

            setTimeout(() => {
                cleanup();
                resolve(results);
            }, timeout);
        });
    };

export const pollFor = (conditionFn, timeout = 10000, intervalMs = 250, signal = null) => {
        return new Promise((resolve) => {
            if (signal?.aborted) return resolve(null);

            // Initial check
            try {
                const initialResult = conditionFn();
                if (initialResult) return resolve(initialResult);
            } catch (error) {
                // IMPORTANT FIX: Do NOT resolve(null) here. A null reference error is expected 
                // if the DOM is still rendering. Proceed to the polling loop.
                window.YPP.Utils?.log('Initial pollFor missed (expected), proceeding to wait loop...', 'UTILS', 'debug');
            }

            const startTime = Date.now();
            const startUrl = location.href; // Capture URL for early abort
            let intervalId = null;
            let resolved = false;

            const cleanup = () => {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                if (signal) {
                    signal.removeEventListener('abort', handleAbort);
                }
            };

            const handleAbort = () => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    resolve(null);
                }
            };

            if (signal) {
                signal.addEventListener('abort', handleAbort);
            }

            const check = () => {
                if (resolved) return;
                
                const now = Date.now();

                // Check for timeout
                if (now - startTime >= timeout) {
                    resolved = true;
                    cleanup();
                    return resolve(null); // Timeout reached cleanly
                }

                try {
                    // Abort if the user navigates away early
                    if (location.href !== startUrl) {
                        resolved = true;
                        cleanup();
                        return resolve(null);
                    }

                    const result = conditionFn();
                    if (result) {
                        resolved = true;
                        cleanup();
                        return resolve(result); // Success
                    } 
                } catch (error) {
                    // IMPORTANT FIX: Swallow transient errors (like null references during DOM load) 
                    // and allow the loop to try again on the next interval until timeout.
                    window.YPP.Utils?.log('Transient error in pollFor, retrying...', 'UTILS', 'debug');
                }
            };

            intervalId = setInterval(check, intervalMs);
        });
    };

export const createElement = (tag, attrs = {}, children = []) => {
        if (!tag || typeof tag !== 'string') {
            console.error('[YPP:Utils] createElement: invalid tag name');
            return null;
        }

        try {
            const el = document.createElement(tag);

            // Handle attributes
            if (attrs && typeof attrs === 'object') {
                Object.entries(attrs).forEach(([key, value]) => {
                    if (key === 'className') {
                        el.className = value;
                    } else if (key === 'style' && typeof value === 'object') {
                        Object.assign(el.style, value);
                    } else if (key.startsWith('on') && typeof value === 'function') {
                        el.addEventListener(key.substring(2).toLowerCase(), value);
                    } else if (key === 'dataset' && typeof value === 'object') {
                        Object.entries(value).forEach(([dataKey, dataValue]) => {
                            el.dataset[dataKey] = dataValue;
                        });
                    } else {
                        el.setAttribute(key, value);
                    }
                });
            }

            // Handle children
            const childArray = Array.isArray(children) ? children : [children];
            childArray.forEach(child => {
                if (!child) return;
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else if (child instanceof Element) {
                    el.appendChild(child);
                }
            });

            return el;
        } catch (error) {
            console.error('[YPP:Utils] createElement error:', error);
            return null;
        }
    };

export const createSVG = (viewBox, pathData, className = '') => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', viewBox);
        if (className) svg.setAttribute('class', className);
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'currentColor');
        
        svg.appendChild(path);
        return svg;
    };

