export class ObserverManager {
    constructor() {
        this.observers = new Set();
        this.intervals = new Set();
        this.timeouts = new Set();
    }

    addObserver(observer) {
        this.observers.add(observer);
        return observer;
    }

    addInterval(intervalId) {
        this.intervals.add(intervalId);
        return intervalId;
    }

    addTimeout(timeoutId) {
        this.timeouts.add(timeoutId);
        return timeoutId;
    }

    clearInterval(intervalId) {
        clearInterval(intervalId);
        this.intervals.delete(intervalId);
    }

    clearTimeout(timeoutId) {
        clearTimeout(timeoutId);
        this.timeouts.delete(timeoutId);
    }

    cleanupAll() {
        this.observers.forEach(obs => obs.disconnect());
        this.observers.clear();

        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();

        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();
    }
}
