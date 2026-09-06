/**
 * Channel Health Row Builder
 * Owns: The logic for generating HTML DOM elements for individual channel rows.
 * Separates UI rendering from the scanning/fetching logic.
 */
import { ChannelHealthDB } from './channel-health-db.js';
import { ChannelHealthActions } from './channel-health-actions.js';

export class ChannelHealthRowBuilder {
    /**
     * Builds the DOM row for a channel.
     * @param {Object} c - The channel object.
     * @param {Array} safeList - Array of safe-listed channel IDs.
     * @param {HTMLElement} resultsEl - The container element to dispatch events on.
     * @returns {HTMLElement} The constructed row element.
     */
    static buildRow(c, safeList, resultsEl) {
        const now = Date.now();
        const colorMap = { active: '#2ed573', warning: '#ffb340', dead: '#ff4e45', error: '#94a3b8' };
        const color = colorMap[c.status] || '#94a3b8';

        const row = document.createElement('div');
        row.id = 'ypp-row-' + c.id;
        row.className = 'ypp-channel-health-row';
        row.dataset.status          = c.status || 'none';
        row.dataset.name            = c.name;
        row.dataset.uploadTime      = c.lastUpload != null ? c.lastUpload : Infinity;
        row.dataset.videoStatus     = c.videoInfo?.status || 'none';
        row.dataset.shortStatus     = c.shortInfo?.status || 'none';
        row.dataset.postStatus      = 'unknown';
        row.dataset.videoUploadTime = c.videoInfo ? (now - c.videoInfo.pubTime) : Infinity;
        row.dataset.shortUploadTime = c.shortInfo ? (now - c.shortInfo.pubTime) : Infinity;
        row.style.borderLeft = '4px solid ' + color;
        row.style.setProperty('--ypp-status-color', color);

        const img = document.createElement('img');
        img.src = c.icon || '';
        img.className = 'ypp-health-row-avatar';
        img.onerror = function() { this.style.display = 'none'; };
        row.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'flex:1;min-width:0;';

        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = 'color:#f1f5f9;font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.2px;';
        nameDiv.textContent = c.name;
        infoDiv.appendChild(nameDiv);

        const PILL_ICONS = {
            video: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>`,
            short: `<svg width="9" height="12" viewBox="0 0 18 24" fill="currentColor" style="flex-shrink:0"><rect x="0" y="0" width="18" height="24" rx="4"/><path d="M6.5 8.5l6 3.5-6 3.5V8.5z" fill="rgba(0,0,0,0.45)"/></svg>`
        };

        const createPill = (type, info) => {
            if (!info || !info.text) return null;
            const pill = document.createElement('div');
            pill.className = `ypp-cpill ypp-cpill-${info.status}`;
            pill.dataset.type = type;
            pill.innerHTML = `${PILL_ICONS[type]}<span>${info.text}</span>`;
            return pill;
        };

        const pillsDiv = document.createElement('div');
        pillsDiv.className = 'ypp-content-pills';
        const vPill = createPill('video', c.videoInfo);
        const sPill = createPill('short', c.shortInfo);
        if (vPill) pillsDiv.appendChild(vPill);
        if (sPill) pillsDiv.appendChild(sPill);
        infoDiv.appendChild(pillsDiv);

        row.appendChild(infoDiv);

        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'display:flex;align-items:center;gap:12px;flex-shrink:0;';

        const visitLink = document.createElement('a');
        visitLink.href = '/channel/' + c.id;
        visitLink.target = '_blank';
        visitLink.className = 'ypp-health-btn-visit';
        visitLink.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Visit`;
        actionsDiv.appendChild(visitLink);

        const label = document.createElement('label');
        label.className = 'ypp-custom-checkbox-label';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'ypp-unsub-checkbox';
        cb.value = c.id;
        cb.dataset.params = c.unsubParams || '';
        const isSafe = safeList.includes(c.id);
        if (isSafe) cb.disabled = true;

        const checkmark = document.createElement('span');
        checkmark.className = 'ypp-custom-checkmark';
        if (isSafe) checkmark.style.opacity = '0.3';

        label.appendChild(cb);
        label.appendChild(checkmark);
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Select';
        label.appendChild(textSpan);
        actionsDiv.appendChild(label);

        const shieldBtn = document.createElement('button');
        shieldBtn.className = `ypp-health-shield-btn ${isSafe ? 'active' : ''}`;
        shieldBtn.title = isSafe ? "Remove from Safe List" : "Add to Safe List";
        shieldBtn.innerHTML = isSafe ?
            `<svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>` :
            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
        shieldBtn.addEventListener('click', async () => {
            const nowSafe = await ChannelHealthDB.toggleSafeList(c.id);
            if (nowSafe !== null) {
                shieldBtn.classList.toggle('active', nowSafe);
                shieldBtn.innerHTML = nowSafe ?
                    `<svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>` :
                    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
                shieldBtn.title = nowSafe ? "Remove from Safe List" : "Add to Safe List";
                cb.disabled = nowSafe;
                checkmark.style.opacity = nowSafe ? '0.3' : '1';
                if (nowSafe) cb.checked = false;
                if (resultsEl) resultsEl.dispatchEvent(new Event('change'));
            }
        });
        actionsDiv.appendChild(shieldBtn);

        const indivBtn = document.createElement('button');
        indivBtn.className = 'ypp-indiv-unsub-btn';
        indivBtn.textContent = 'Unsubscribe';
        indivBtn.addEventListener('click', () => ChannelHealthActions.individualUnsubscribe(c.id, c.unsubParams, c.name, row, indivBtn));
        actionsDiv.appendChild(indivBtn);

        row.appendChild(actionsDiv);
        return row;
    }
}
