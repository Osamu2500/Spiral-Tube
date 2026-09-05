/**
 * Channel Health History
 * Owns: The Unsubscribed History view UI and logic.
 * Does not affect functionality outside the Channel Health feature.
 */
import { ChannelHealthDB } from './channel-health-db.js';

export class ChannelHealthHistory {
    static async show(overlay) {
        if (overlay.querySelector('.ypp-unsub-history-container')) return;
        
        // Hide settings panel if open
        const settingsPanel = overlay.querySelector('#ypp-health-settings-panel');
        if (settingsPanel) settingsPanel.style.display = 'none';

        // Clean up old entries first
        await ChannelHealthDB.purgeOldUnsubs();
        const unsubs = await ChannelHealthDB.getUnsubChannels();
        
        // Hide main body
        const mainBody = overlay.querySelector('.ypp-organizer-body');
        mainBody.style.display = 'none';

        // Hide scan buttons in header, show back button
        const scanContainer = overlay.querySelector('#ypp-health-scan-btn').parentElement;
        const oldDisplay = scanContainer.style.display;
        scanContainer.style.display = 'none';
        
        const historyBtn = overlay.querySelector('#ypp-health-unsub-history-btn');
        
        // Fix: historyBtn is inside settingsPanel, which we just hid. 
        // We do NOT need to hide historyBtn explicitly because its parent is hidden. 
        // If we do hide it, we must remember to un-hide it later, but keeping it simple is better.
        // We will just leave historyBtn alone. It's already invisible because settingsPanel is 'none'.

        // Create Back Button
        const headerBtnContainer = scanContainer.parentElement;
        const backBtn = document.createElement('button');
        backBtn.className = 'ypp-health-btn-secondary';
        backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to Dashboard';
        headerBtnContainer.insertBefore(backBtn, headerBtnContainer.firstChild);

        // Create History Container
        const historyContainer = document.createElement('div');
        historyContainer.className = 'ypp-unsub-history-container ypp-scroll-list';
        historyContainer.style.cssText = 'flex: 1; display: flex; flex-direction: column; padding: 32px; overflow-y: auto; background: transparent;';

        const title = document.createElement('h2');
        title.style.cssText = 'color: #fff; font-size: 20px; font-weight: 600; margin-bottom: 24px; margin-top: 0;';
        title.textContent = `Unsubscribed Channels (Last 30 Days) - ${unsubs.length}`;
        historyContainer.appendChild(title);

        const listContainer = document.createElement('div');
        listContainer.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; width: 100%;';
        historyContainer.appendChild(listContainer);

        if (unsubs.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; color: #666; margin-top: 60px; font-size: 16px; font-weight: 500; grid-column: 1 / -1;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; display:block; margin-left:auto; margin-right:auto;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    No unsubscribed channels in the last 30 days.
                </div>
            `;
        } else {
            // Sort by unsubTime descending
            unsubs.sort((a, b) => b.unsubTime - a.unsubTime);

            unsubs.forEach(ch => {
                const row = document.createElement('div');
                row.className = 'ypp-history-card';
                
                const daysAgo = Math.floor((Date.now() - ch.unsubTime) / (1000 * 60 * 60 * 24));
                const timeText = daysAgo === 0 ? 'Today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;

                row.innerHTML = `
                    <img src="${ch.icon || ''}" alt="" class="ypp-history-card-avatar">
                    <div class="ypp-history-card-info">
                        <div class="ypp-history-card-name" title="${ch.name}">${ch.name}</div>
                        <div class="ypp-history-card-time">Unsubscribed ${timeText}</div>
                    </div>
                    <div style="margin-top: auto; width: 100%; padding-top: 8px;">
                        <a href="https://www.youtube.com/channel/${ch.id}" target="_blank" class="ypp-health-btn-visit" style="display: block; width: 100%; text-align: center; box-sizing: border-box;">
                            Visit Channel
                        </a>
                    </div>
                `;
                listContainer.appendChild(row);
            });
        }

        overlay.querySelector('.ypp-health-modal-content').appendChild(historyContainer);

        // Back button logic
        backBtn.addEventListener('click', () => {
            historyContainer.remove();
            backBtn.remove();
            mainBody.style.display = 'flex';
            scanContainer.style.display = oldDisplay;
        });
    }
}
