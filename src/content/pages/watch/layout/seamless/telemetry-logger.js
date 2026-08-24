/**
 * @fileoverview
 * Telemetry Logger for Seamless Mode
 * Used to track the exact millisecond performance of DOM operations.
 */
export class TelemetryLogger {
    constructor(prefix) {
        this.prefix = prefix;
        this.enabled = false; // Toggle for debugging
    }

    info(message, data = {}) {
        if (!this.enabled) return;
        console.log(`[${this.prefix}] [INFO] [${new Date().toISOString()}] ${message}`, data);
    }

    warn(message, error = null) {
        if (!this.enabled) return;
        console.warn(`[${this.prefix}] [WARN] [${new Date().toISOString()}] ${message}`, error);
    }

    error(message, error) {
        if (!this.enabled) return;
        console.error(`[${this.prefix}] [ERROR] [${new Date().toISOString()}] ${message}`, error);
    }

    measure(name, fn) {
        if (!this.enabled) return fn();
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.debug(`[${this.prefix}] [PERF] ${name} took ${(end - start).toFixed(4)}ms`);
        return result;
    }
}
