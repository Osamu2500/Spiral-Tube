export const PopupMetadata = {
    async _fetchMetadata(videoId) {
        try {
            const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
            const text = await res.text();
            
            const match = text.match(/ytInitialData\s*=\s*({.*?});<\/script>/s);
            if (!match) return;
            
            const data = JSON.parse(match[1]);
            const contents = data.contents?.twoColumnWatchNextResults?.results?.results?.contents || [];
            
            const videoDetails = contents.find(c => c.videoPrimaryInfoRenderer)?.videoPrimaryInfoRenderer;
            const secondaryInfo = contents.find(c => c.videoSecondaryInfoRenderer)?.videoSecondaryInfoRenderer;

            if (videoDetails && this._bottomEls) {
                const { titleEl, channelEl, viewsPill, datePill, likesPill, descBox, descPill } = this._bottomEls;

                const title = videoDetails.title?.runs?.[0]?.text || 'Unknown Title';
                if (titleEl) titleEl.textContent = title;
                
                // Formatter for compact numbers
                const formatNum = (numStr) => {
                    if (!numStr) return '';
                    const num = parseInt(numStr.replace(/[^0-9]/g, ''), 10);
                    if (isNaN(num)) return numStr;
                    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
                    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
                    return num.toString();
                };

                if (viewsPill) {
                    const vt = videoDetails.viewCount?.videoViewCountRenderer?.viewCount?.simpleText || '';
                    viewsPill.querySelector('span').textContent = vt ? formatNum(vt) : '---';
                }
                
                if (datePill) {
                    datePill.querySelector('span').textContent = videoDetails.dateText?.simpleText || '---';
                }
                
                const likeCount = videoDetails.videoActions?.menuRenderer?.topLevelButtons
                    ?.find(b => b.segmentedLikeDislikeButtonViewModel)?.segmentedLikeDislikeButtonViewModel
                    ?.likeButtonViewModel?.likeButtonViewModel?.toggleButtonViewModel?.toggleButtonViewModel
                    ?.defaultButtonViewModel?.buttonViewModel?.title;
                    
                if (likesPill) {
                    likesPill.querySelector('span').textContent = likeCount ? formatNum(likeCount) : '---';
                }

                if (channelEl && secondaryInfo) {
                    channelEl.textContent = secondaryInfo.owner?.videoOwnerRenderer?.title?.runs?.[0]?.text || '';
                }

                // Description
                const descRuns = secondaryInfo?.description?.runs;
                if (descRuns && descBox && descPill) {
                    const descText = descRuns.map(r => r.text).join('');
                    if (descText.trim()) {
                        descBox.textContent = descText;
                        descPill.style.display = 'flex';
                    } else {
                        descPill.style.display = 'none';
                    }
                }
            }
        } catch (err) {
            console.error('Spiral Popup: Failed to fetch metadata', err);
        }
    },

    _startMetadataScraper() {
        if (this.scrapeInterval) clearInterval(this.scrapeInterval);
        this.scrapeInterval = setInterval(() => {
            if (!this.overlay || !this.topBar) { clearInterval(this.scrapeInterval); return; }
            const node = document.querySelector(
                'h1.ytd-watch-metadata yt-formatted-string, h1.title yt-formatted-string'
            );
            if (node) {
                const titleEl = this.topBar.querySelector('.ytpop-title');
                if (titleEl && titleEl.textContent !== node.textContent) {
                    titleEl.textContent = node.textContent;
                }
            }
        }, 1500);
    }
};
