import { ResumeDataManager } from '../resume-data.js';

export class BookmarkModalUI {
    constructor(utils) {
        this.utils = utils;
    }

    async toggle(videoId, videoElement, onBookmarksUpdated) {
        let modal = document.getElementById('ypp-bookmark-modal');
        if (modal) {
            modal.remove();
            return;
        }

        modal = document.createElement('div');
        modal.id = 'ypp-bookmark-modal';
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 400px; max-height: 80vh; background: #212121; color: white;
            border-radius: 12px; z-index: 10000; display: flex; flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8); font-family: Roboto, Arial, sans-serif;
            border: 1px solid #3d3d3d;
        `;

        modal.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid #3d3d3d; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 18px;">🔖 My Bookmarks</h2>
                <button id="ypp-bm-close" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
            <div id="ypp-bm-list" style="padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px;">
                <div style="color: #aaa; text-align: center;">Loading bookmarks...</div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#ypp-bm-close').addEventListener('click', () => modal.remove());

        const allBookmarks = await ResumeDataManager.getAllBookmarks();
        
        const listEl = modal.querySelector('#ypp-bm-list');
        listEl.innerHTML = '';

        if (allBookmarks.length === 0) {
            listEl.innerHTML = `<div style="color: #aaa; text-align: center;">No bookmarks found. Press Ctrl+B while watching to save a moment.</div>`;
            return;
        }

        for (const item of allBookmarks) {
            const el = document.createElement('div');
            el.style.cssText = `
                display: flex; align-items: center; justify-content: space-between;
                background: #303030; padding: 12px; border-radius: 8px;
            `;
            
            const mins = Math.floor(item.time / 60);
            const secs = Math.floor(item.time % 60).toString().padStart(2, '0');
            const url = `/watch?v=${item.videoId}&t=${Math.floor(item.time)}s`;

            el.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <img src="https://i.ytimg.com/vi/${item.videoId}/default.jpg" style="width: 60px; border-radius: 4px;" />
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 14px; font-weight: 500;">Timestamp: ${mins}:${secs}</span>
                        <a href="${url}" style="font-size: 12px; color: #3ea6ff; text-decoration: none; margin-top: 4px;" class="ypp-bm-jump">Jump to Video</a>
                    </div>
                </div>
                <button class="ypp-bm-delete" style="background: #ff4e45; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
            `;

            el.querySelector('.ypp-bm-jump').addEventListener('click', (e) => {
                if (videoId === item.videoId && videoElement) {
                    e.preventDefault();
                    videoElement.currentTime = item.time;
                    modal.remove();
                }
            });

            el.querySelector('.ypp-bm-delete').addEventListener('click', async () => {
                await ResumeDataManager.removeBookmark(item.key);
                el.remove();
                if (onBookmarksUpdated) onBookmarksUpdated();
            });

            listEl.appendChild(el);
        }
    }
}
