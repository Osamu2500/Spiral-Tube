import '../../core/system/base-feature.js';
import { ResumeDataManager } from './resume-data.js';

export class ResumeBadges extends window.YPP.features.BaseFeature {
    static featureId = 'resumeBadges';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('ResumeBadges');
        this.videoDataMap = new Map();
    }

    getConfigKey() {
        return 'resumeBadges';
    }

    async enable() {
        await super.enable();
        
        // Refresh video data from centralized storage
        await this.refreshVideoData();
        
        // Listen for thumbnails being added to the DOM to attach badges
        this.startThumbnailObserver();
        
        // Initial scan for elements already in DOM
        this.processThumbnails();
    }

    async disable() {
        await super.disable();
        document.querySelectorAll('.yt-pro-pbar-wrap, .yt-pro-resume-badge').forEach(el => el.remove());
        document.querySelectorAll('[data-ypp-resume-processed]').forEach(el => el.removeAttribute('data-ypp-resume-processed'));
    }

    async refreshVideoData() {
        const videos = await ResumeDataManager.getAllVideos();
        this.videoDataMap.clear();
        for (const v of videos) {
            this.videoDataMap.set(v.id, v);
        }
    }

    startThumbnailObserver() {
        this.onBusEvent('dom:thumbnailsAdded', (payload) => {
            const thumbs = [];
            for (let i = 0; i < payload.nodes.length; i++) {
                const el = payload.nodes[i].el;
                const thumb = (el.tagName === 'YTD-THUMBNAIL') ? el : (el.querySelector ? el.querySelector('ytd-thumbnail') : null);
                if (thumb && !thumb.hasAttribute('data-ypp-resume-processed')) {
                    thumbs.push(thumb);
                }
            }
            if (thumbs.length > 0) {
                this.processThumbnailsElements(thumbs);
            }
        });
    }

    processThumbnails() {
        const thumbnails = document.querySelectorAll('ytd-thumbnail:not([data-ypp-resume-processed="true"])');
        this.processThumbnailsElements(thumbnails);
    }

    processThumbnailsElements(thumbnails) {
        thumbnails.forEach(thumb => {
            if (thumb.hasAttribute('data-ypp-resume-processed')) return;
            
            const anchor = thumb.querySelector('a#thumbnail');
            if (!anchor) return;
            
            const href = anchor.getAttribute('href');
            if (!href) return;
            
            const match = href.match(/[?&]v=([^&#]+)/);
            if (!match) return;
            
            const videoId = match[1];
            thumb.setAttribute('data-ypp-resume-processed', 'true');
            
            const data = this.videoDataMap.get(videoId);
            if (!data || !data.time || !data.duration || (data.time / data.duration > 0.95)) return;
            
            // Add progress bar
            const percent = (data.time / data.duration) * 100;
            const wrap = document.createElement('div');
            wrap.className = 'yt-pro-pbar-wrap';
            wrap.innerHTML = `<div class="yt-pro-pbar" style="width: ${percent}%;"></div>`;
            
            // Add time badge
            const timeBadge = document.createElement('div');
            timeBadge.className = 'yt-pro-resume-badge';
            timeBadge.innerHTML = `<span>&#9654;</span> ${this.formatTime(data.time)}`;
            
            const overlays = thumb.querySelector('#overlays');
            if (overlays) {
                overlays.appendChild(wrap);
                overlays.appendChild(timeBadge);
            }
        });
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const s = Math.floor(seconds);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        const pad = n => n < 10 ? '0' + n : '' + n;
        return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
    }
};

window.YPP.features.ResumeBadges = ResumeBadges;
