/**
 * StorageService — a clean, typed abstraction over chrome.storage.local
 * 
 * Usage:
 *   import { storage } from './storage.js';
 *   const prefs = await storage.get<SyncPreferences>('ypp_sync_prefs');
 *   await storage.set('ypp_sync_prefs', { settings: true, ... });
 */

type StorageChangeCallback<T> = (newValue: T | undefined, oldValue: T | undefined) => void;

const observers = new Map<string, Set<StorageChangeCallback<any>>>();

// Listen to chrome storage changes once and fan out to observers
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const [key, { newValue, oldValue }] of Object.entries(changes)) {
        const subs = observers.get(key);
        if (subs) {
            subs.forEach(cb => cb(newValue, oldValue));
        }
    }
});

export const storage = {
    /**
     * Get a single key from chrome.storage.local.
     * Returns undefined if the key does not exist.
     */
    async get<T>(key: string): Promise<T | undefined> {
        const result = await chrome.storage.local.get(key);
        return result[key] as T | undefined;
    },

    /**
     * Get multiple keys from chrome.storage.local.
     */
    async getMany<T extends Record<string, any>>(keys: string[]): Promise<Partial<T>> {
        const result = await chrome.storage.local.get(keys);
        return result as Partial<T>;
    },

    /**
     * Get all keys from chrome.storage.local.
     */
    async getAll(): Promise<Record<string, any>> {
        return chrome.storage.local.get(null);
    },

    /**
     * Set a single key.
     */
    async set<T>(key: string, value: T): Promise<void> {
        return chrome.storage.local.set({ [key]: value });
    },

    /**
     * Set multiple keys at once.
     */
    async setMany(items: Record<string, any>): Promise<void> {
        return chrome.storage.local.set(items);
    },

    /**
     * Remove a key.
     */
    async remove(key: string | string[]): Promise<void> {
        return chrome.storage.local.remove(key);
    },

    /**
     * Clear all storage. Use with caution.
     */
    async clear(): Promise<void> {
        return chrome.storage.local.clear();
    },

    /**
     * Observe changes to a specific key.
     * Returns an unsubscribe function.
     */
    observe<T>(key: string, callback: StorageChangeCallback<T>): () => void {
        if (!observers.has(key)) {
            observers.set(key, new Set());
        }
        observers.get(key)!.add(callback);
        return () => {
            observers.get(key)?.delete(callback);
        };
    },

    /**
     * Get the byte size of a value stored in chrome.storage.local.
     * Useful for showing backup sizes in UI.
     */
    async getBytesInUse(key?: string | string[]): Promise<number> {
        return new Promise((resolve) => {
            const arg = key ?? null;
            (chrome.storage.local as any).getBytesInUse(arg, resolve);
        });
    }
};
