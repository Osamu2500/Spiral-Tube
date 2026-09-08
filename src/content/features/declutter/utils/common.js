import { DEV_MODE, TIMING } from './constants.js';

export function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle;
  let lastFn;
  let lastTime;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= limit) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(limit - (Date.now() - lastTime), 0));
    }
  };
}

export function isYouTube() {
  return (
    window.location.hostname === 'www.youtube.com' ||
    window.location.hostname === 'm.youtube.com'
  );
}

export const logger = {
  log: (...args) => {
    if (DEV_MODE) console.log(...args);
  },
  warn: (...args) => {
    if (DEV_MODE) console.warn(...args);
  },
  error: (...args) => {
    if (DEV_MODE) console.error(...args);
  },
  info: (...args) => {
    if (DEV_MODE) console.info(...args);
  },
};

export function pollUntil(predicate, { timeout = 3000, interval = TIMING.ELEMENT_POLL_INTERVAL } = {}) {
  let timer = null;

  const cancel = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const promise = new Promise(resolve => {
    if (predicate()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    timer = setInterval(() => {
      if (predicate()) {
        cancel();
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        cancel();
        resolve(false);
      }
    }, interval);
  });

  return { promise, cancel };
}

export function safeStorageSet(area, data) {
  try {
    if (window.YPP?.utils?.settings) {
        Object.entries(data).forEach(([k, v]) => window.YPP.utils.settings.set(k, v));
        return;
    }
    chrome.storage[area].set(data, () => {
      if (chrome.runtime.lastError) {
        logger.warn('Storage set failed:', chrome.runtime.lastError.message);
      }
    });
  } catch (e) {
    logger.warn('Storage unavailable:', e);
  }
}

