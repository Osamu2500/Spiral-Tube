export const debug = {
    /** @type {boolean} Whether debug logging is currently enabled */
    enabled: false
};

setTimeout(() => {
    if (window.YPP?.StorageManager) {
        window.YPP.StorageManager.get('ypp-debug').then(val => {
            if (val !== null) debug.enabled = val === 'true';
        });
    }
}, 50);
