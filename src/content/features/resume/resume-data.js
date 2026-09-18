/**
 * @fileoverview
 * Centralized data management for the Resume feature.
 * Provides unified access to saved video progress, bookmarks, and categories.
 * Fixes previous storage key mismatch bugs between UI and background tracking.
 */

const STORAGE_PREFIX = 'ypp_resume_';
const CATEGORY_KEY = 'ypp_resume_categories';
const BOOKMARK_KEY_PREFIX = 'ypp_bookmark_';

export class ResumeDataManager {
    
    static async _getRawStorage() {
        return new Promise((resolve) => {
            if (chrome && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.get(null, resolve);
            } else if (window.YPP && window.YPP.StorageManager) {
                // Mock or fallback via YPP
                resolve(window.localStorage);
            } else {
                resolve(window.localStorage);
            }
        });
    }

    static async getAllVideos() {
        const data = await this._getRawStorage();
        const videos = [];
        for (const key of Object.keys(data)) {
            if (key.startsWith(STORAGE_PREFIX) && key !== CATEGORY_KEY) {
                try {
                    const val = typeof data[key] === 'string' ? JSON.parse(data[key]) : data[key];
                    if (val && val.time) {
                        videos.push({
                            id: key.replace(STORAGE_PREFIX, ''),
                            key: key,
                            time: parseFloat(val.time),
                            duration: parseFloat(val.duration) || 0,
                            savedAt: val.savedAt || 0,
                            title: val.title || 'YouTube Video',
                            channel: val.channel || '',
                            thumbnail: val.thumbnail || `https://i.ytimg.com/vi/${key.replace(STORAGE_PREFIX, '')}/mqdefault.jpg`,
                            categoryId: val.categoryId || null
                        });
                    }
                } catch(e) {}
            }
        }
        return videos;
    }

    static async getCategories() {
        const data = await this._getRawStorage();
        if (data[CATEGORY_KEY]) {
            try {
                return typeof data[CATEGORY_KEY] === 'string' ? JSON.parse(data[CATEGORY_KEY]) : data[CATEGORY_KEY];
            } catch (e) {}
        }
        return [];
    }

    static async saveCategories(categories) {
        if (chrome && chrome.storage && chrome.storage.sync) {
            return new Promise(resolve => {
                chrome.storage.sync.set({ [CATEGORY_KEY]: categories }, resolve);
            });
        } else if (window.YPP && window.YPP.StorageManager) {
            window.YPP.StorageManager.set(CATEGORY_KEY, JSON.stringify(categories));
        } else {
            window.localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
        }
    }

    static async updateVideoCategory(videoKey, categoryId) {
        const data = await this._getRawStorage();
        if (data[videoKey]) {
            try {
                const val = typeof data[videoKey] === 'string' ? JSON.parse(data[videoKey]) : data[videoKey];
                val.categoryId = categoryId;
                if (chrome && chrome.storage && chrome.storage.sync) {
                    return new Promise(resolve => chrome.storage.sync.set({ [videoKey]: val }, resolve));
                } else if (window.YPP && window.YPP.StorageManager) {
                    window.YPP.StorageManager.set(videoKey, JSON.stringify(val));
                } else {
                    window.localStorage.setItem(videoKey, JSON.stringify(val));
                }
            } catch (e) {}
        }
    }

    static async removeVideo(videoKey) {
        if (chrome && chrome.storage && chrome.storage.sync) {
            return new Promise(resolve => chrome.storage.sync.remove(videoKey, resolve));
        } else if (window.YPP && window.YPP.StorageManager) {
            window.YPP.StorageManager.remove(videoKey);
        } else {
            window.localStorage.removeItem(videoKey);
        }
    }

    static async removeBookmark(bookmarkKey) {
        return this.removeVideo(bookmarkKey); // Same logic
    }

    static async getAllBookmarks() {
        const data = await this._getRawStorage();
        const bookmarks = [];
        for (const key of Object.keys(data)) {
            if (key.startsWith(BOOKMARK_KEY_PREFIX)) {
                try {
                    const parsed = typeof data[key] === 'string' ? JSON.parse(data[key]) : data[key];
                    if (parsed) {
                        bookmarks.push({
                            key: key,
                            time: parsed.time,
                            date: parsed.date,
                            videoId: key.replace(BOOKMARK_KEY_PREFIX, '').split('_')[0]
                        });
                    }
                } catch(e) {}
            }
        }
        return bookmarks;
    }
}
