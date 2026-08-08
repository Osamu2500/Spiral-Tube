// Attach to features namespace


export class PlaylistDuration extends (
  window.YPP.features.BaseFeature
) {
    static featureId = 'playlistDuration';
    static executionPhase = 'idle';
    static priority = 999;

  constructor() {
    super('PlaylistDuration');
    this.debounceTimer = null;
    this.card = null;
    this._boundCalculate = this.calculateDuration.bind(this);
  }

  getConfigKey() {
    return 'playlistDuration';
  }

  async _getYoutubeConfig() {
    return new Promise((resolve) => {
      const reqId = Math.random().toString(36).slice(2);
      let resolved = false;
      const listener = (e) => {
        // Security: only accept responses from the YouTube origin.
        // A malicious cross-origin page could otherwise inject a fake config
        // with a crafted apiKey or session context.
        if (e.origin !== 'https://www.youtube.com') return;

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
          resolve({});
        }
      }, 1000);
      if (!document.getElementById('ypp-ytcfg-bridge')) {
        const script = document.createElement('script');
        script.id = 'ypp-ytcfg-bridge';
        script.src = chrome.runtime.getURL('src/inject/ytcfg-bridge.js');
        document.documentElement.appendChild(script);
      }
      setTimeout(() => {
        // Target YouTube origin specifically — matches what ytcfg-bridge.js expects
        window.postMessage({ type: 'YPP_YTCFG_REQUEST', reqId: reqId }, 'https://www.youtube.com');
      }, 50);
    });
  }

  async enable() {
    await super.enable();

    this._debouncedCalculate = this.utils.debounce(this._boundCalculate, 200);

    // Watch for SPA navigation to trigger or clear the calculator
    this.onBusEvent('app:pageChange', () => {
      if (location.pathname.includes('/playlist')) {
        // Short delay to let DOM clear out old playlist header
        setTimeout(() => this.calculateDuration(), 100);
      } else {
        if (this.card) {
          this.card.remove();
          this.card = null;
        }
      }
    });

    this.observer.start();
    this.observer.register(
      'playlist-duration',
      'ytd-playlist-video-renderer, yt-lockup-view-model, #ypp-pl-root',
      () => {
        if (location.pathname.includes('/playlist')) {
          this._debouncedCalculate();
        }
      },
      false
    );

    // Run immediately if we start on a playlist page
    if (location.pathname.includes('/playlist')) {
      this.calculateDuration();
    }
  }

  async disable() {
    await super.disable();
    if (this.observer) {
      this.observer.unregister('playlist-duration');
      this.observer.stop();
    }
    if (this.card) {
      this.card.remove();
      this.card = null;
    }
  }

  async calculateDuration() {
    if (this.isCalculating) return;
    this.isCalculating = true;

    try {
      let totalSeconds = 0;
      let videoCount = 0;
      let totalPlaylistVideos = 0;

      const scripts = Array.from(document.querySelectorAll('script'));
      const ytInitialDataScript = scripts.find(
        (s) =>
          s.textContent.includes('var ytInitialData =') ||
          s.textContent.includes('window["ytInitialData"] =') ||
          s.textContent.includes('window.ytInitialData =')
      );

      if (!ytInitialDataScript) {
        return this.fallbackCalculate();
      }

      let initialData;
      const text = ytInitialDataScript.textContent;
      const markers = [
        'var ytInitialData = ',
        'window["ytInitialData"] = ',
        'window.ytInitialData = ',
      ];
      for (const marker of markers) {
        const startIdx = text.indexOf(marker);
        if (startIdx !== -1) {
          const jsonStart = startIdx + marker.length;
          let jsonText = text.slice(jsonStart);
          const endIdx = jsonText.lastIndexOf(';');
          if (endIdx !== -1 && endIdx > jsonText.length - 15) {
            jsonText = jsonText.slice(0, endIdx);
          }
          try {
            initialData = JSON.parse(jsonText.trim());
            break;
          } catch (e) {
            const lastBrace = jsonText.lastIndexOf('}');
            if (lastBrace !== -1) {
              try {
                initialData = JSON.parse(jsonText.slice(0, lastBrace + 1));
                break;
              } catch (e2) {}
            }
          }
        }
      }

      if (!initialData) return this.fallbackCalculate();

      // Fallback DOM selector for total videos
      let domTotalVideos = 0;
      const statsSelectors = [
        '.metadata-stats',
        'ytd-playlist-byline-renderer',
        'yt-content-metadata-view-model-wiz__metadata-row span',
        'yt-formatted-string[id="stats"]',
      ];
      for (const sel of statsSelectors) {
        const statsEl = document.querySelector(sel);
        if (statsEl) {
          const m = statsEl.textContent.match(/([\d,]+)\s+videos?/i);
          if (m) {
            domTotalVideos = parseInt(m[1].replace(/,/g, ''), 10);
            break;
          }
        }
      }

      let continuationToken = null;
      const walk = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (obj.playlistVideoRenderer) {
          const renderer = obj.playlistVideoRenderer;
          if (renderer.lengthSeconds) {
            totalSeconds += parseInt(renderer.lengthSeconds, 10);
            videoCount++;
          }
        }
        if (obj.numVideosText?.runs?.[0]?.text) {
          const p = parseInt(obj.numVideosText.runs[0].text.replace(/[^0-9]/g, ''), 10);
          if (p > totalPlaylistVideos) totalPlaylistVideos = p;
        }
        if (obj.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token) {
          continuationToken =
            obj.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
        }
        Object.values(obj).forEach(walk);
      };
      walk(initialData);

      if (domTotalVideos > totalPlaylistVideos) totalPlaylistVideos = domTotalVideos;
      if (totalPlaylistVideos === 0) totalPlaylistVideos = videoCount;
      this.renderCard(
        totalSeconds,
        videoCount,
        totalPlaylistVideos - videoCount,
        totalPlaylistVideos
      );

      // Fetch continuations recursively in background
      const ytConfig = await this._getYoutubeConfig();
      if (ytConfig && ytConfig.apiKey && continuationToken) {
        while (continuationToken && videoCount < totalPlaylistVideos) {
          try {
            const response = await fetch(
              `https://www.youtube.com/youtubei/v1/browse?key=${ytConfig.apiKey}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-YouTube-Client-Name': '1',
                  'X-YouTube-Client-Version': ytConfig.clientVersion || '2.20240101.01.00',
                },
                body: JSON.stringify({
                  context: ytConfig.context || {
                    client: {
                      clientName: 'WEB',
                      clientVersion: ytConfig.clientVersion || '2.20240101.01.00',
                    },
                  },
                  continuation: continuationToken,
                }),
              }
            );

            if (!response.ok) break;

            const data = await response.json();
            continuationToken = null; // Reset for next iteration

            const walkCont = (obj) => {
              if (!obj || typeof obj !== 'object') return;
              if (obj.playlistVideoRenderer) {
                const renderer = obj.playlistVideoRenderer;
                if (renderer.lengthSeconds) {
                  totalSeconds += parseInt(renderer.lengthSeconds, 10);
                  videoCount++;
                }
              }
              if (obj.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token) {
                continuationToken =
                  obj.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
              }
              Object.values(obj).forEach(walkCont);
            };
            walkCont(data);

            this.renderCard(
              totalSeconds,
              videoCount,
              totalPlaylistVideos - videoCount,
              totalPlaylistVideos
            );

            // Give CPU time to breathe
            await new Promise((r) => setTimeout(r, 250));
          } catch (fetchErr) {
            break;
          }
        }
      }

      this.renderCard(
        totalSeconds,
        videoCount,
        totalPlaylistVideos - videoCount,
        totalPlaylistVideos
      );
    } catch (error) {
      this.fallbackCalculate();
    } finally {
      this.isCalculating = false;
    }
  }

  fallbackCalculate() {
    // Support both old (ytd-playlist-video-renderer) and new (yt-lockup-view-model) YouTube DOM
    const ITEM_SEL = 'ytd-playlist-video-renderer, yt-lockup-view-model';
    const TIME_SELECTORS = [
      'ytd-thumbnail-overlay-time-status-renderer',
      'badge-shape[class*="time-status"]',
      '.yt-lockup-view-model-wiz__badge .badge-shape',
      'yt-formatted-string[class*="time"]',
    ];
    const allItems = document.querySelectorAll(ITEM_SEL);

    let totalSeconds = 0;
    let validCount = 0;

    allItems.forEach((item) => {
      for (const sel of TIME_SELECTORS) {
        const el = item.querySelector(sel);
        if (!el) continue;
        const timeText = (el.getAttribute('aria-label') || el.textContent || '').trim();
        if (timeText && timeText.includes(':')) {
          const cleanTime = timeText.replace(/[^0-9:]/g, '');
          const s = this.parseTime(cleanTime);
          if (s > 0) {
            totalSeconds += s;
            validCount++;
            break;
          }
        }
      }
    });

    let totalPlaylistVideos = allItems.length;
    const statsSelectors = [
      '.metadata-stats',
      'ytd-playlist-byline-renderer',
      'yt-content-metadata-view-model-wiz__metadata-row span',
      'yt-formatted-string[id="stats"]',
    ];
    for (const sel of statsSelectors) {
      const statsEl = document.querySelector(sel);
      if (statsEl) {
        const match = statsEl.textContent.match(/([\d,]+)\s+videos?/i);
        if (match) {
          totalPlaylistVideos = parseInt(match[1].replace(/,/g, ''), 10);
          break;
        }
      }
    }

    const notCounted = allItems.length - validCount;

    if (allItems.length > 0) {
      this.renderCard(totalSeconds, validCount, notCounted, totalPlaylistVideos);
    }
  }

  parseTime(timeStr) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 4) {
      // D:HH:MM:SS
      return parts[0] * 86400 + parts[1] * 3600 + parts[2] * 60 + parts[3];
    }
    return 0;
  }

  formatTimeText(seconds) {
    if (seconds === 0) return '0s';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    let result = [];
    if (d > 0)
      result.push(`<span class="ypp-time-val">${d}</span><span class="ypp-time-lbl">d</span>`);
    if (h > 0)
      result.push(`<span class="ypp-time-val">${h}</span><span class="ypp-time-lbl">h</span>`);
    if (m > 0 || h > 0)
      result.push(`<span class="ypp-time-val">${m}</span><span class="ypp-time-lbl">m</span>`);
    result.push(`<span class="ypp-time-val">${s}</span><span class="ypp-time-lbl">s</span>`);

    return result.join(' ');
  }

  renderCard(totalSeconds, videoCount, notCounted, totalPlaylistVideos) {
    const sidebar = document.querySelector('#ypp-pl-root .ypp-pl-sidebar');

    // Try multiple header selectors for old and new YouTube DOM
    const container =
      sidebar ||
      document.querySelector('ytd-playlist-header-renderer') ||
      document.querySelector('yt-playlist-header-view-model') ||
      document.querySelector('ytd-browse[page-subtype="playlist"] #header');
    if (!container) return;

    if (!this.card) {
      this.card = document.createElement('div');
      this.card.id = 'ypp-playlist-card';

      // Add a subtle glow behind the card
      const glow = document.createElement('div');
      glow.style.cssText = `
                position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
                background: radial-gradient(circle at top right, rgba(62, 166, 255, 0.15), transparent 60%);
                pointer-events: none; z-index: 0;
            `;
      this.card.appendChild(glow);

      // Container for inner HTML to sit above glow
      this.contentDiv = document.createElement('div');
      this.contentDiv.style.cssText = 'position: relative; z-index: 1;';
      this.card.appendChild(this.contentDiv);

      // Insert styling for the time labels and liquid glass card
      const style = document.createElement('style');
      style.textContent = `
                #ypp-playlist-card {
                  margin-top: 24px;
                  background: var(--sf, linear-gradient(145deg, rgba(20, 20, 24, 0.8), rgba(15, 15, 18, 0.9)));
                  border: none;
                  border-radius: 34px;
                  padding: 24px;
                  font-family: var(--ypp-font-family, 'Inter', 'Roboto', sans-serif);
                  color: var(--yt-spec-text-primary, #fff);
                  width: 100%;
                  box-sizing: border-box;
                  backdrop-filter: blur(var(--blur, 24px)) saturate(1.2);
                  -webkit-backdrop-filter: blur(var(--blur, 24px)) saturate(1.2);
                  box-shadow: var(--shadow-base, 0 16px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1));
                  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow var(--bounce, 0.3s ease);
                  position: relative;
                  overflow: hidden;
                }
                #ypp-playlist-card:hover {
                  box-shadow: var(--shadow-hover, 0 16px 40px rgba(0, 0, 0, 0.5));
                }
                .ypp-time-val { font-weight: 700; color: var(--yt-spec-text-primary, #fff); }
                .ypp-time-lbl { font-weight: 500; color: var(--yt-spec-text-secondary, #aaa); margin-left: 2px; margin-right: 6px; font-size: 0.85em; }
                .ypp-speed-box { background: rgba(255,255,255,0.06); padding: 10px 12px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; border: 1px solid rgba(255,255,255,0.03); transition: background 0.2s; }
                .ypp-speed-box:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.1); }
                .ypp-speed-lbl { font-size: 11px; color: var(--yt-spec-text-secondary, #aaa); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                .ypp-speed-val { font-size: 14px; }
            `;
      this.card.appendChild(style);
    }

    // Ensure the card is attached to the correct location (re-attach if redesign loaded later)
    if (sidebar) {
      if (this.card.parentElement !== sidebar) {
        sidebar.appendChild(this.card);
      }
      // Hide the playlist redesign's built-in mini duration card so we don't have duplicates
      const miniCard = sidebar.querySelector('.ypp-pl-duration-card');
      if (miniCard && miniCard !== this.card) {
        miniCard.style.display = 'none';
      }
    } else {
      const stats =
        container.querySelector('ytd-playlist-byline-renderer') ||
        container.querySelector('.metadata-action-bar');
      if (stats && stats.parentNode) {
        if (this.card.parentElement !== stats.parentNode) {
          stats.parentNode.insertBefore(this.card, stats.nextSibling);
        }
      } else {
        const metadataWrapper =
          container.querySelector('.metadata-wrapper') ||
          container.querySelector('.immersive-header-content') ||
          container;
        if (this.card.parentElement !== metadataWrapper) {
          metadataWrapper.appendChild(this.card);
        }
      }
    }

    const time1x = this.formatTimeText(totalSeconds);
    const time125x = this.formatTimeText(Math.floor(totalSeconds / 1.25));
    const time15x = this.formatTimeText(Math.floor(totalSeconds / 1.5));
    const time2x = this.formatTimeText(Math.floor(totalSeconds / 2.0));

    let loadWarning = '';
    if (videoCount < totalPlaylistVideos) {
      loadWarning = `
                <div style="margin-top: 16px; padding: 10px 14px; background: rgba(255, 171, 0, 0.1); border: 1px solid rgba(255, 171, 0, 0.3); border-radius: 10px; font-size: 12px; color: #ffab00; display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <span><strong>Partial calculation:</strong> Scroll down to load all videos. Calculated ${videoCount} of ${totalPlaylistVideos} videos.</span>
                </div>
            `;
    }

    // Note: videoCount, notCounted, totalPlaylistVideos are all integers — safe for innerHTML
    this.contentDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                <div>
                    <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--ypp-accent-color, #3ea6ff); text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 6px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Total Duration
                    </div>
                    <div style="font-size: 26px; line-height: 1.2;">${time1x}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 13px; font-weight: 600; color: #fff; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                        ${videoCount} videos
                    </div>
                    ${notCounted > 0 ? `<div style="font-size: 11px; color: #ff4e45; margin-top: 6px; font-weight: 500;">${notCounted} unplayable</div>` : ''}
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                <div class="ypp-speed-box">
                    <span class="ypp-speed-lbl">At 1.25x Speed</span>
                    <span class="ypp-speed-val">${time125x}</span>
                </div>
                <div class="ypp-speed-box">
                    <span class="ypp-speed-lbl">At 1.50x Speed</span>
                    <span class="ypp-speed-val">${time15x}</span>
                </div>
                <div class="ypp-speed-box">
                    <span class="ypp-speed-lbl">At 2.00x Speed</span>
                    <span class="ypp-speed-val">${time2x}</span>
                </div>
            </div>
            
            ${loadWarning}
        `;
  }
};

window.YPP.features.PlaylistDuration = PlaylistDuration;
