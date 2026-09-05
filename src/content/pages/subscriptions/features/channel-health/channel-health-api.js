/**
 * Channel Health API
 * Owns: YouTube API communication, config extraction, RSS fetching, and fallback mechanisms for unsubscribing.
 * Targets: YouTube endpoints, `/feeds/videos.xml`, and internal InnerTube API.
 * Does not affect functionality outside the Channel Health feature.
 */

import { CustomDialog } from './custom-dialog.js';

export class ChannelHealthAPI {
    static _extractYtInitialData(text) {
        const markers = ['var ytInitialData = ', 'let ytInitialData = ', 'window["ytInitialData"] = ', 'window.ytInitialData = '];
        for (const marker of markers) {
            const startIdx = text.indexOf(marker);
            if (startIdx !== -1) {
                const jsonStart = startIdx + marker.length;
                const endIdx = text.indexOf('</script>', jsonStart);
                if (endIdx !== -1) {
                    let jsonText = text.slice(jsonStart, endIdx).trim();
                    if (jsonText.endsWith(';')) jsonText = jsonText.slice(0, -1);
                    try {
                        return JSON.parse(jsonText);
                    } catch(e) {
                        console.error('ChannelHealthAPI: Failed to parse ytInitialData', e);
                    }
                }
            }
        }
        return null;
    }

    /**
     * Reads YouTube's internal `ytcfg` object from the page context by injecting
     * a short-lived <script> tag that posts the config values back via postMessage.
     */
    static _ytConfigPromise = null;

    static getYoutubeConfig() {
        if (this._ytConfigPromise) return this._ytConfigPromise;
        
        this._ytConfigPromise = new Promise(resolve => {
            const reqId = Math.random().toString(36).slice(2);
            let resolved = false;

            const listener = (e) => {
                if (e.data && e.data.type === 'YPP_YTCFG_RESPONSE' && e.data.reqId === reqId) {
                    window.removeEventListener('message', listener);
                    if (!resolved) {
                        resolved = true;
                        resolve(e.data.config);
                    }
                }
            };
            window.addEventListener('message', listener);

            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    window.removeEventListener('message', listener);
                    window.YPP.Utils?.log('getYoutubeConfig timed out. Returning empty config.', 'CHANNEL-HEALTH', 'warn');
                    // Reset promise so next call tries again if it failed
                    this._ytConfigPromise = null;
                    resolve({}); 
                }
            }, 1500);
            window.postMessage({ type: 'YPP_YTCFG_REQUEST', reqId: reqId }, '*');
        });
        return this._ytConfigPromise;
    }

    static async fetchSubscriptions(onProgress) {
        const ytConfig = await this.getYoutubeConfig();
        const channels = [];
        const seenIds = new Set();

        const extractChannelsFromData = (data) => {
            let token = null;
            const walkNode = (obj) => {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj)) { obj.forEach(walkNode); return; }

                if (obj.channelRenderer) {
                    const r = obj.channelRenderer;
                    if (!seenIds.has(r.channelId)) {
                        seenIds.add(r.channelId);
                        let unsubParams = '';
                        const walkForUnsub = (o) => {
                            if (!o || typeof o !== 'object') return;
                            if (o.unsubscribeEndpoint?.params) { unsubParams = o.unsubscribeEndpoint.params; return; }
                            Object.values(o).forEach(walkForUnsub);
                        };
                        walkForUnsub(r.subscribeButton || r);
                        channels.push({
                            id: r.channelId,
                            name: r.title?.simpleText || 'Unknown',
                            icon: r.thumbnail?.thumbnails?.pop()?.url || '',
                            unsubParams
                        });
                    }
                    return;
                }
                if (obj.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token) {
                    token = obj.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
                    return;
                }
                Object.values(obj).forEach(walkNode);
            };
            walkNode(data);
            return token;
        };

        let nextToken = null;
        
        try {
            const res = await fetch('/feed/channels');
            const text = await res.text();
            const data = this._extractYtInitialData(text);
            if (data) {
                nextToken = extractChannelsFromData(data);
            }

            while (nextToken && ytConfig && ytConfig.apiKey) {
                if (onProgress) onProgress(channels.length);
                const contRes = await fetch(`/youtubei/v1/browse?key=${ytConfig.apiKey}`, {
                    method: 'POST',
                    headers: await this._getApiHeaders(ytConfig),
                    credentials: 'include',
                    body: JSON.stringify({
                        context: ytConfig.context,
                        continuation: nextToken
                    })
                });
                if (!contRes.ok) break;
                const contData = await contRes.json();
                nextToken = extractChannelsFromData(contData);
            }
        } catch (err) {
            window.YPP.Utils?.log('Failed to fetch subscriptions', 'CHANNEL-HEALTH', 'warn', err);
        }

        return channels;
    }

    static async _getApiHeaders(config) {
        const origin = window.location.origin;
        const time = Math.floor(Date.now() / 1000);

        const sha1 = async (str) => {
            const buf = new TextEncoder().encode(str);
            const hash = await crypto.subtle.digest('SHA-1', buf);
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        };

        const readCookie = (name) => {
            const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
            return m ? m[1] : null;
        };

        const sapisid    = readCookie('SAPISID');
        const sapisid1p  = readCookie('__Secure-1PAPISID');
        const sapisid3p  = readCookie('__Secure-3PAPISID');

        const parts = [];
        if (sapisid)   parts.push(`SAPISIDHASH ${time}_${await sha1(`${time} ${sapisid} ${origin}`)}`);
        if (sapisid1p) parts.push(`SAPISID1PHASH ${time}_${await sha1(`${time} ${sapisid1p} ${origin}`)}`);
        if (sapisid3p) parts.push(`SAPISID3PHASH ${time}_${await sha1(`${time} ${sapisid3p} ${origin}`)}`);

        const headers = {
            'Content-Type': 'application/json',
            'X-YouTube-Client-Name': '1',
            'X-YouTube-Client-Version': config.clientVersion || '2.20240101.01.00',
            'X-Origin': origin,
            'X-Goog-Visitor-Id': config.visitorData || '',
        };

        if (config.sessionIndex != null) headers['X-Goog-AuthUser'] = String(config.sessionIndex);
        if (config.pageId) headers['X-Goog-PageId'] = String(config.pageId);
        if (parts.length) headers['Authorization'] = parts.join(' ');

        return headers;
    }

    static async _tryApiUnsubscribe(channelData, config) {
        const headers = await this._getApiHeaders(config);

        const makeRequest = async (withParams) => {
            const payload = { context: config.context, channelIds: [channelData.id] };
            if (withParams && channelData.params) payload.params = channelData.params;
            const res = await fetch(`/youtubei/v1/subscription/unsubscribe?key=${config.apiKey}`, {
                method: 'POST', headers, credentials: 'include',
                body: JSON.stringify(payload)
            });
            const data = await res.json().catch(() => ({}));
            return { ok: res.ok && !data.error, status: res.status, data };
        };

        try {
            let res = await makeRequest(true);
            if (res.ok) return true;

            if (!res.ok && channelData.params) {
                res = await makeRequest(false);
                if (res.ok) return true;
            }

            window.YPP.Utils?.log(`API unsubscribe failed for ${channelData.id}: HTTP ${res.status}`, 'CHANNEL-HEALTH', 'warn', res.data);
        } catch (e) {
            window.YPP.Utils?.log('API unsubscribe exception', 'CHANNEL-HEALTH', 'error', e);
        }
        return false;
    }

    static async _tryNativeDomUnsubscribe(channelId) {
        try {
            const candidates = document.querySelectorAll(
                `ytd-subscribe-button-renderer[channel-id="${channelId}"], ` +
                `[channel-id="${channelId}"] ytd-subscribe-button-renderer`
            );

            const SUB_BTN_SELECTORS = [
                'yt-button-shape button',
                '.yt-spec-button-shape-next',
                'tp-yt-paper-button',
                'button'
            ];

            for (const renderer of candidates) {
                let btn = null;
                for (const sel of SUB_BTN_SELECTORS) {
                    btn = renderer.querySelector(sel);
                    if (btn) break;
                }
                if (!btn) continue;
                
                const text = (btn.textContent || btn.getAttribute('aria-label') || '').toLowerCase().trim();
                const innerSpan = btn.querySelector('.yt-core-attributed-string');
                const innerText = innerSpan ? innerSpan.textContent.toLowerCase().trim() : '';

                if (text === 'subscribed' || text === 'unsubscribe' || text.includes('subscribed') || 
                    innerText === 'subscribed' || innerText === 'unsubscribe' || innerText.includes('subscribed')) {
                    
                    btn.click();
                    await new Promise(r => setTimeout(r, 800));
                    
                    const CONFIRM_SELECTORS = [
                        'yt-confirm-dialog-renderer #confirm-button button',
                        'yt-confirm-dialog-renderer yt-button-shape button',
                        'yt-confirm-dialog-renderer [dialog-confirm] button',
                        'yt-confirm-dialog-renderer button',
                        'tp-yt-paper-dialog .buttons tp-yt-paper-button:last-of-type',
                        '[aria-label="Unsubscribe"]',
                        'yt-button-shape button[aria-label="Unsubscribe"]'
                    ];
                    
                    for (const sel of CONFIRM_SELECTORS) {
                        const confirmBtn = document.querySelector(sel);
                        if (confirmBtn) {
                            confirmBtn.click();
                            window.YPP.Utils?.log(`Native DOM unsubscribe succeeded for ${channelId}`, 'CHANNEL-HEALTH', 'debug');
                            return true;
                        }
                    }
                }
            }
        } catch (e) {
            window.YPP.Utils?.log('Native DOM unsubscribe failed', 'CHANNEL-HEALTH', 'warn', e);
        }
        return false;
    }

    static async _tryFreshApiUnsubscribe(channelId, config) {
        const urlsToTry = [
            `/channel/${channelId}`,
            `/@${channelId}` 
        ];
        
        for (const url of urlsToTry) {
            try {
                const res = await fetch(url);
                if (!res.ok) continue;
                const text = await res.text();
                const data = this._extractYtInitialData(text);
                if (data) {
                    let freshParams = null;
                    const walk = (o) => {
                        if (freshParams) return;
                        if (!o || typeof o !== 'object') return;
                        if (o.unsubscribeEndpoint?.params) {
                            freshParams = o.unsubscribeEndpoint.params;
                            return;
                        }
                        Object.values(o).forEach(walk);
                    };
                    walk(data);
                        
                    if (freshParams) {
                        return await this._tryApiUnsubscribe({ id: channelId, params: freshParams }, config);
                    }
                }
            } catch(e) {
                window.YPP.Utils?.log(`Fresh API unsub error for ${url}`, 'CHANNEL-HEALTH', 'warn', e);
            }
        }
        return false;
    }

    static _getTabUrl(channelId, tab) {
        if (channelId.startsWith('UC')) return `https://www.youtube.com/channel/${channelId}/${tab}`;
        if (channelId.startsWith('@'))  return `https://www.youtube.com/${channelId}/${tab}`;
        return `https://www.youtube.com/${channelId}/${tab}`; // Fallback for legacy custom URLs
    }

    static async fetchLatestVideo(channelId) {
        try {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), 10000);
            const url = this._getTabUrl(channelId, 'videos');
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) { clearTimeout(tid); return null; }
            const html = await res.text();
            clearTimeout(tid);
            const data = this._extractYtInitialData(html);
            if (!data) return 'Error';

            const strData = JSON.stringify(data);
            if (!strData.includes('"videoId"')) return 'No Videos';

            const rxPub  = /"publishedTimeText"\s*:\s*\{"simpleText"\s*:\s*"([^"]+)"/g;
            const rxDate = /"dateText"\s*:\s*\{"simpleText"\s*:\s*"([^"]+)"/g;
            const rxContent = /"text"\s*:\s*\{"content"\s*:\s*"([^"]+\s+ago)"/gi;
            
            let m;
            while ((m = rxPub.exec(strData))  !== null) return m[1];
            while ((m = rxDate.exec(strData)) !== null) return m[1];
            while ((m = rxContent.exec(strData)) !== null) return m[1];

            // Fallback: extract the videoId and fetch its watch page to get the exact date
            try {
                const videoIdMatch = strData.match(/"videoId":"([^"]+)"/);
                if (videoIdMatch) {
                    const videoId = videoIdMatch[1];
                    const watchController = new AbortController();
                    const watchTid = setTimeout(() => watchController.abort(), 10000);
                    const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, { signal: watchController.signal });
                    if (!watchRes.ok) { clearTimeout(watchTid); }
                    else {
                        const watchHtml = await watchRes.text();
                        clearTimeout(watchTid);
                        const dateTextMatch = watchHtml.match(/"dateText":\{"simpleText":"([^"]+)"\}/);
                        const publishMatch = watchHtml.match(/"publishDate":"([^"]+)"/);
                        const uploadMatch = watchHtml.match(/"uploadDate":"([^"]+)"/);
                        
                        let dateStr = null;
                        if (dateTextMatch) dateStr = dateTextMatch[1];
                        else if (publishMatch) dateStr = publishMatch[1];
                        else if (uploadMatch) dateStr = uploadMatch[1];
                        
                        if (dateStr) {
                            dateStr = dateStr.replace(/^(Premiered|Streamed live on)\s+/i, '');
                            return dateStr;
                        }
                    }
                }
            } catch (innerErr) {
                window.YPP.Utils?.log('fetchLatestVideo watch page fallback error', 'CHANNEL-HEALTH', 'warn', innerErr);
            }

            return 'Has Videos'; // Ultimate Fallback
        } catch (e) {
            return 'Error';
        }
    }

    static async scanShorts(channelId) {
        try {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), 10000);
            const url = this._getTabUrl(channelId, 'shorts');
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) { clearTimeout(tid); return null; }
            const html = await res.text();
            clearTimeout(tid);
            const data = this._extractYtInitialData(html);
            if (!data) return 'Error';

            const strData = JSON.stringify(data);
            const videoIdMatch = strData.match(/"videoId":"([^"]+)"/);
            if (!videoIdMatch) return 'No Shorts';

            const videoId = videoIdMatch[1];
            
            // Fetch the watch page for the latest short to get its date
            try {
                const shortController = new AbortController();
                const shortTid = setTimeout(() => shortController.abort(), 10000);
                const shortRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, { signal: shortController.signal });
                if (!shortRes.ok) { clearTimeout(shortTid); return 'Has Shorts'; }
                const shortHtml = await shortRes.text();
                clearTimeout(shortTid);
                
                const dateTextMatch = shortHtml.match(/"dateText":\{"simpleText":"([^"]+)"\}/);
                const publishMatch = shortHtml.match(/"publishDate":"([^"]+)"/);
                const uploadMatch = shortHtml.match(/"uploadDate":"([^"]+)"/);
                
                let dateStr = null;
                if (dateTextMatch) dateStr = dateTextMatch[1];
                else if (publishMatch) dateStr = publishMatch[1];
                else if (uploadMatch) dateStr = uploadMatch[1];
                
                if (dateStr) {
                    dateStr = dateStr.replace(/^(Premiered|Streamed live on)\s+/i, '');
                    return dateStr;
                }
            } catch (innerErr) {
                window.YPP.Utils?.log('scanShorts watch page error', 'CHANNEL-HEALTH', 'warn', innerErr);
            }

            return 'Has Shorts';
        } catch (e) {
            return 'Error';
        }
    }



    static parseRelativeTime(text) {
        if (!text) return null;
        const m = text.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
        if (m) {
            const n    = parseInt(m[1], 10);
            const unit = m[2].toLowerCase();
            const unitMs = { second: 1000, minute: 60000, hour: 3600000, day: 86400000, week: 604800000, month: 2592000000, year: 31536000000 };
            return n * (unitMs[unit] || 0);
        }
        
        // Fallback for absolute dates (e.g. "23 Jul 2026")
        const absTime = Date.parse(text);
        if (!isNaN(absTime)) {
            return Date.now() - absTime;
        }

        return null;
    }

    static _iframeActive = false;

    static async _tryIframeUnsubscribe(channelId) {
        while (this._iframeActive) { await new Promise(r => setTimeout(r, 500)); }
        this._iframeActive = true;
        
        return new Promise(resolve => {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width:300px;height:300px;opacity:0.01;position:fixed;bottom:0;right:0;pointer-events:none;z-index:9999;border:0;';
            iframe.src = `/channel/${channelId}`;
            
            let resolved = false;
            let timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    iframe.remove();
                    this._iframeActive = false;
                    resolve(false);
                }
            }, 12000);

            iframe.onload = async () => {
                try {
                    const idoc = iframe.contentDocument || iframe.contentWindow.document;
                    let btn = null;
                    
                    for (let i = 0; i < 30; i++) {
                        const renderer = idoc.querySelector('ytd-subscribe-button-renderer');
                        if (renderer) {
                            btn = renderer.querySelector('button');
                            if (btn && btn.offsetParent !== null) break;
                        }
                        await new Promise(r => setTimeout(r, 200));
                    }
                    
                    if (btn) {
                        const text = (btn.textContent || btn.getAttribute('aria-label') || '').toLowerCase();
                        if (text.includes('subscribed') || text.includes('unsubscribe')) {
                            btn.click();
                            await new Promise(r => setTimeout(r, 500));
                            
                            for (let i = 0; i < 15; i++) {
                                const confirmBtn = idoc.querySelector('yt-confirm-dialog-renderer #confirm-button button, yt-button-shape[id="confirm-button"] button');
                                if (confirmBtn) {
                                    confirmBtn.click();
                                    await new Promise(r => setTimeout(r, 500));
                                    if (!resolved) {
                                        resolved = true;
                                        clearTimeout(timeout);
                                        iframe.remove();
                                        this._iframeActive = false;
                                        resolve(true);
                                    }
                                    return;
                                }
                                await new Promise(r => setTimeout(r, 200));
                            }
                        }
                    }
                } catch(e) {}
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    iframe.remove();
                    this._iframeActive = false;
                    resolve(false);
                }
            };
            document.body.appendChild(iframe);
        });
    }

    static async doUnsubscribe(channels) {
        const config = await this.getYoutubeConfig();

        if (!config.apiKey || !config.context) {
            await CustomDialog.alert(
                'Auth Error',
                'Could not retrieve YouTube session credentials.\nPlease refresh the page and try again.'
            );
            return 0;
        }

        let successCount = 0;
        const failedChannels = [];
        let isFirst = true;

        for (const c of channels) {
            if (!isFirst) {
                // Random delay between 600ms and 1500ms to avoid spam triggers
                const delay = Math.floor(Math.random() * 900) + 600;
                await new Promise(r => setTimeout(r, delay));
            }
            isFirst = false;

            let succeeded = await this._tryApiUnsubscribe(c, config);

            if (!succeeded) {
                window.YPP.Utils?.log(`API failed for ${c.name || c.id}, trying Fresh API...`, 'CHANNEL-HEALTH', 'warn');
                succeeded = await this._tryFreshApiUnsubscribe(c.id, config);
            }

            if (!succeeded) {
                window.YPP.Utils?.log(`Fresh API failed for ${c.name || c.id}, trying native DOM...`, 'CHANNEL-HEALTH', 'warn');
                succeeded = await this._tryNativeDomUnsubscribe(c.id);
            }

            if (!succeeded) {
                window.YPP.Utils?.log(`Native DOM failed for ${c.name || c.id}, trying iframe simulator...`, 'CHANNEL-HEALTH', 'warn');
                succeeded = await this._tryIframeUnsubscribe(c.id);
            }

            if (succeeded) {
                successCount++;
                if (c.onSuccess) c.onSuccess();
            } else {
                failedChannels.push(c.name || c.id);
            }
        }

        if (failedChannels.length > 0) {
            const preview = failedChannels.slice(0, 5).join(', ');
            const extra = failedChannels.length > 5 ? ` and ${failedChannels.length - 5} more` : '';
            await CustomDialog.alert(
                `${failedChannels.length} Unsubscribe(s) Failed`,
                `Could not unsubscribe from:\n${preview}${extra}.\n\nYouTube may have rate-limited the request. Try again in a moment or visit those channel pages directly.`
            );
        }

        return successCount;
    }
}
