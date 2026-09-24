import { CONSTANTS } from '../../config/constants/index.js';

export const log = (msg, type = 'MAIN', level = 'info', ...args) => {
        const prefix = `%c[YPP:${type}]`;
        const styles = {
            info: 'color: #3ea6ff; font-weight: bold;',
            warn: 'color: #ff9800; font-weight: bold;',
            error: 'color: #f44336; font-weight: bold;',
            debug: 'color: #9e9e9e; font-weight: bold;'
        };
        const style = styles[level] || styles.info;
        const consoleMethod = console[level] || console.log;
        
        // Filter debug logs unless debug mode is active
        if (level === 'debug' && !window.YPP?.debug?.enabled) return;

        consoleMethod(prefix, style, msg, ...args);
    };
export const startPerf = (label) => {
        if (!label) return;
        performance.mark(`ypp-start-${label}`);
    };

export const endPerf = (label, context = 'PERF') => {
        if (!label) return;
        const startMark = `ypp-start-${label}`;
        const endMark = `ypp-end-${label}`;
        
        try {
            performance.mark(endMark);
            const measure = performance.measure(label, startMark, endMark);
            
            // Only log if it took significant time (> 10ms)
            if (measure.duration > 10) {
                window.YPP.Utils.log(`${label} took ${measure.duration.toFixed(2)}ms`, context, 'debug');
            }
            
            // Cleanup
            performance.clearMarks(startMark);
            performance.clearMarks(endMark);
            performance.clearMeasures(label);
        } catch (e) {
            // Ignore performance measurement errors
        }
    };

export const isWatchPage = () => window.location.pathname === '/watch';

export const isSearchPage = () => window.location.pathname === '/results';

export const isHome = () => {
        const path = window.location.pathname;
        return path === '/' || path === '/index';
    };

export const isShortsPage = () => window.location.pathname.startsWith('/shorts/');

export const isChannelPage = () => {
        const path = window.location.pathname;
        return path.startsWith('/@') || path.startsWith('/channel/') || path.startsWith('/c/') || path.startsWith('/user/');
    };

export const debounce = (func, wait = CONSTANTS.TIMINGS?.DEBOUNCE_DEFAULT || 50) => {
        // Validate function
        if (typeof func !== 'function') {
            window.YPP.Utils?.log('debounce requires a function as first argument', 'UTILS', 'error');
            return () => {}; // Return noop
        }
        
        // Validate wait time
        if (typeof wait !== 'number' || wait < 0 || !isFinite(wait)) {
            window.YPP.Utils?.log(`Invalid wait time for debounce (${wait}), using default`, 'UTILS', 'warn');
            wait = CONSTANTS.TIMINGS?.DEBOUNCE_DEFAULT || 50;
        }
        
        let timeoutId = null;
        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        };
    };

export const throttle = (func, limit = 100) => {
        // Validate function
        if (typeof func !== 'function') {
            window.YPP.Utils?.log('throttle requires a function as first argument', 'UTILS', 'error');
            return () => {}; // Return noop
        }
        
        // Validate limit
        if (typeof limit !== 'number' || limit < 0 || !isFinite(limit)) {
            window.YPP.Utils?.log(`Invalid limit for throttle (${limit}), using default 100ms`, 'UTILS', 'warn');
            limit = 100;
        }
        
        let lastFunc = null;
        let lastRan = 0;
        
        return function (...args) {
            const now = Date.now();
            
            if (!lastRan || now - lastRan >= limit) {
                // Execute immediately if we haven't run recently
                func.apply(this, args);
                lastRan = now;
            } else {
                // Schedule a trailing execution
                if (lastFunc) clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    func.apply(this, args);
                    lastRan = Date.now();
                }, limit - (now - lastRan));
            }
        };
    };

export const isValidNumber = (value, min = null, max = null) => {
        let num = Number(value);
        if (isNaN(num)) return false;
        
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        return true;
    };

export const isValidColor = (value) => {
        if (!value || typeof value !== 'string') return false;
        return CSS.supports('color', value);
    };

export const sanitizeHtml = (str) => {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

export const clamp = (value, min, max) => {
        // Validate inputs are numbers
        if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
            window.YPP.Utils?.log('Invalid inputs to clamp function', 'UTILS', 'warn');
            return (typeof min === 'number' && !isNaN(min) && isFinite(min)) ? min : 0;
        }
        
        // Handle NaN and Infinity
        if (isNaN(min) || !isFinite(min)) min = 0;
        if (isNaN(max) || !isFinite(max)) max = 100;
        if (isNaN(value) || !isFinite(value)) {
           return min;
        }
        
        // Ensure min <= max
        if (min > max) {
            [min, max] = [max, min]; // Swap if needed
        }
        
        return Math.min(Math.max(value, min), max);
    };

export const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        await Utils.timeout(delay);
        return window.YPP.Utils.retry(fn, retries - 1, delay * 2); // Exponential backoff
    }
};

export const parallel = async (tasks, concurrency = 5) => {
    const results = [];
    const executing = new Set();

    for (const task of tasks) {
        const promise = Promise.resolve().then(() => task());
        results.push(promise);
        executing.add(promise);
        promise.finally(() => executing.delete(promise));

        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }

    return Promise.all(results);
};

export const safeExecute = async (fn, context = 'UNKNOWN') => {
    try {
        return await fn();
    } catch (error) {
        window.YPP.Utils?.log(`safeExecute error in [${context}]: ${error.message}`, 'UTILS', 'error');
        console.error(`[YPP:${context}]`, error);
        return null;
    }
};
