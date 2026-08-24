import { SELECTORS } from './constants.js';

/**
 * Extracts data from the native YouTube playlist DOM elements.
 * @param {HTMLElement} header 
 * @param {NodeList|Array} videoEls 
 * @returns {Object} Extracted playlist data
 */
export function extractPlaylistData(header, videoEls) {
    // ── Playlist meta ──
    const title = header.querySelector(SELECTORS.TITLE)?.textContent?.trim() || 'Playlist';

    const ownerEl = header.querySelector(SELECTORS.OWNER);
    const owner     = ownerEl?.textContent?.trim() || '';
    const ownerHref = ownerEl?.href || '';

    const bylineEl = header.querySelector('ytd-playlist-byline-renderer, .metadata-stats, .metadata-wrapper');
    let stats = '';
    if (bylineEl) {
        const textNodes = Array.from(bylineEl.querySelectorAll('yt-formatted-string, span'))
            .map(n => n.textContent.trim())
            .filter(text => text && text.length > 0 && text !== '•' && !text.includes('Save'));
        stats = Array.from(new Set(textNodes)).join(' • ');
    }
    if (!stats) {
        const statsEls = Array.from(header.querySelectorAll(SELECTORS.STATS));
        for (const el of statsEls) {
            const text = el.textContent.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ');
            if (text.includes('video') || text.includes('view') || text.includes('Updated')) {
                stats = text;
                break;
            }
        }
    }

    // Playlist thumbnail — try immersive banner first, then first video thumb
    let coverUrl = '';
    const bannerImg = header.querySelector(SELECTORS.BANNER_IMG);
    if (bannerImg?.src && !bannerImg.src.includes('data:')) {
        coverUrl = bannerImg.src;
    }

    // ── Videos ──
    const videos = [];
    videoEls.forEach((videoElement, idx) => {
        // Title
        const videoTitle = videoElement.querySelector(SELECTORS.VIDEO_TITLE)?.textContent?.trim() || `Video ${idx + 1}`;

        // Watch URL
        const videoUrl  = videoElement.querySelector(SELECTORS.VIDEO_URL)?.href || '';

        // Channel
        const videoChannel  = videoElement.querySelector(SELECTORS.VIDEO_CHANNEL)?.textContent?.trim() || '';

        // Duration — search deeply for the timestamp
        let videoDuration = '';
        const timeOverlay = videoElement.querySelector('ytd-thumbnail-overlay-time-status-renderer, badge-shape, span.ytd-thumbnail-overlay-time-status-renderer, .yt-lockup-view-model-wiz__badge, yt-formatted-string[class*="time"]');
        if (timeOverlay) {
            const text = (timeOverlay.innerText || timeOverlay.textContent || '').trim();
            const m = text.match(/(\d{1,3}:\d{2}(?::\d{2})?)/);
            if (m) {
                videoDuration = m[1];
            } else {
                const ariaRaw = timeOverlay.getAttribute('aria-label') || '';
                const m2 = ariaRaw.match(/(\d{1,3}:\d{2}(?::\d{2})?)/);
                if (m2) videoDuration = m2[1];
            }
        }

        // Thumbnail
        let videoThumb = '';
        const thumbImg = videoElement.querySelector(SELECTORS.THUMB_IMG);
        if (thumbImg?.src && !thumbImg.src.includes('data:')) {
            videoThumb = thumbImg.src;
        }
        // Fallback: build from video ID
        if (!videoThumb && videoUrl) {
            const vidMatch = videoUrl.match(/[?&]v=([^&]+)/);
            if (vidMatch) {
                videoThumb = `https://i.ytimg.com/vi/${vidMatch[1]}/mqdefault.jpg`;
            }
        }

        // Index number
        const videoIndex = videoElement.querySelector(SELECTORS.INDEX)?.textContent?.trim() || String(idx + 1);

        // Watched progress — try multiple selectors for old and new YouTube DOM
        let progressPct = 0;
        const progressSelectors = [
            'ytd-thumbnail-overlay-resume-playback-renderer #progress',
            'ytd-thumbnail-overlay-resume-playback-renderer',
            '[overlay-style="DEFAULT"] #progress',
            '#progress[style*="width"]'
        ];
        for (const psel of progressSelectors) {
            const prog = videoElement.querySelector(psel);
            if (prog) {
                const w = parseInt(prog.style.width, 10);
                if (!isNaN(w) && w > 0) { progressPct = w; break; }
                // If element exists but no style width, it's still partially watched
                if (prog.tagName === 'YTD-THUMBNAIL-OVERLAY-RESUME-PLAYBACK-RENDERER') {
                    progressPct = 50; // Unknown amount, treat as watched
                    break;
                }
            }
        }

        videos.push({ title: videoTitle, href: videoUrl, channel: videoChannel,
                      duration: videoDuration, thumb: videoThumb,
                      index: videoIndex, progress: progressPct });
    });

    // ── Duration totals ──
    let totalSecs = 0;
    videos.forEach(v => {
        if (v.duration && v.duration.includes(':')) {
            const clean = v.duration.replace(/[^0-9:]/g, '');
            const parts = clean.split(':').map(Number);
            if (parts.length === 3) totalSecs += parts[0]*3600 + parts[1]*60 + parts[2];
            else if (parts.length === 2) totalSecs += parts[0]*60 + parts[1];
        }
    });

    // Fallback: If banner image is missing or lazy-loading, use the first video's thumbnail
    if (!coverUrl && videos.length > 0 && videos[0].thumb) {
        coverUrl = videos[0].thumb.replace(/hqdefault|mqdefault|default/, 'maxresdefault');
    }

    return { title, owner, ownerHref, stats, coverUrl, videos, totalSecs };
}
