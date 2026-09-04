/**
 * @fileoverview
 * Heuristics logic for the Auto Like Feature.
 * Includes Title Sentiment, Return YouTube Dislike (RYD) checking, 
 * and SponsorBlock synergy to determine if a video should be skipped.
 */

/**
 * Evaluates the current video against heuristics rules.
 * @param {string} videoId 
 * @param {Object} sponsorCache { id: string, value: number }
 * @param {Function} logFn 
 * @returns {boolean} True if the video passes heuristics (is okay to like)
 */
export function passesHeuristics(videoId, sponsorCache, logFn) {
    // 1. SponsorBlock Synergy (prevent like if >30% sponsored)
    let sponsoredPercent = 0;
    
    if (sponsorCache.id === videoId) {
        sponsoredPercent = sponsorCache.value;
    } else {
        // Scoped to the progress bar to avoid full document search
        const progressContainer = document.querySelector('.ytp-progress-bar-container') || document;
        progressContainer.querySelectorAll('.sponsorBlockSegment').forEach(segment => {
            const width = parseFloat(segment.style.width || '0');
            if (!isNaN(width)) sponsoredPercent += width;
        });
        sponsorCache.id = videoId;
        sponsorCache.value = sponsoredPercent;
    }
    
    if (sponsoredPercent > 30) {
        logFn?.(`Video is ${sponsoredPercent.toFixed(1)}% sponsored. Skipping like.`, 'AutoLike', 'info');
        return false;
    }
    
    // 2. Transcript/Title Sentiment
    const negativeKeywords = ['clickbait', 'scam', 'terrible', 'awful', 'waste of time', 'fake', 'hate', 'apology'];
    const title = document.querySelector('h1.ytd-watch-metadata')?.textContent?.toLowerCase() || '';
    
    let sentimentScore = 0;
    for (const word of negativeKeywords) {
        if (title.includes(word)) sentimentScore++;
    }
    
    if (sentimentScore > 1) {
        logFn?.(`Negative sentiment detected in title. Skipping like.`, 'AutoLike', 'info');
        return false;
    }
    
    // 3. Return YouTube Dislike (RYD) Integration
    const rydBar = document.querySelector('#ryd-bar');
    if (rydBar && rydBar.style.width) {
        const likePercentage = parseFloat(rydBar.style.width);
        if (!isNaN(likePercentage) && likePercentage < 50) {
            logFn?.(`Video is heavily disliked (${(100 - likePercentage).toFixed(1)}%). Skipping like.`, 'AutoLike', 'warn');
            return false;
        }
    }
    
    return true;
}
