/**
 * Channel Health Actions
 * Owns: The logic for individual and bulk unsubscribe actions within the Channel Health modal.
 * Does not affect functionality outside the Channel Health feature.
 */
import { CustomDialog } from './custom-dialog.js';
import { ChannelHealthAPI } from './channel-health-api.js';
import { ChannelHealthDB } from './channel-health-db.js';

export class ChannelHealthActions {
    static async individualUnsubscribe(channelId, params, channelName, rowEl, btnEl) {
        const confirmed = await CustomDialog.confirm(
            'Unsubscribe',
            `Unsubscribe from ${channelName}?`,
            'Unsubscribe',
            true
        );
        if (!confirmed) return;

        const originalText = btnEl.textContent;
        btnEl.textContent = 'Unsubscribing...';
        btnEl.disabled = true;

        const resetBtn = (text, color) => {
            btnEl.textContent = text;
            btnEl.disabled = false;
            if (color) {
                btnEl.style.color = color;
                btnEl.style.borderColor = color;
            }
        };

        try {
            const config = await ChannelHealthAPI.getYoutubeConfig();

            if (!config.apiKey || !config.context) {
                resetBtn(originalText, null);
                await CustomDialog.alert('Auth Error', 'Could not get YouTube credentials. Please refresh and try again.');
                return;
            }

            let succeeded = await ChannelHealthAPI._tryApiUnsubscribe({ id: channelId, params, name: channelName }, config);
            if (!succeeded) succeeded = await ChannelHealthAPI._tryFreshApiUnsubscribe(channelId, config);
            if (!succeeded) succeeded = await ChannelHealthAPI._tryNativeDomUnsubscribe(channelId);
            if (!succeeded) succeeded = await ChannelHealthAPI._tryIframeUnsubscribe(channelId);

            if (succeeded) {
                rowEl.style.transition = 'opacity 0.4s ease';
                rowEl.style.opacity = '0.35';
                btnEl.textContent = '✓ Unsubscribed';
                btnEl.style.color = 'rgba(255, 255, 255, 0.8)';
                btnEl.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                btnEl.disabled = true;
                
                const icon = rowEl.querySelector('img')?.src || '';
                ChannelHealthDB.addUnsubChannel({ id: channelId, name: channelName, icon, unsubTime: Date.now() }).catch(() => {});

                const cb = rowEl.querySelector('.ypp-unsub-checkbox');
                if (cb) { cb.disabled = true; cb.checked = false; }
                
                setTimeout(() => {
                    rowEl.style.maxHeight = rowEl.offsetHeight + 'px';
                    rowEl.style.overflow = 'hidden';
                    rowEl.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, margin 0.4s ease';
                    requestAnimationFrame(() => {
                        rowEl.style.maxHeight = '0';
                        rowEl.style.opacity = '0';
                        rowEl.style.marginBottom = '0';
                    });
                    setTimeout(() => rowEl.remove(), 450);
                }, 1200);
            } else {
                resetBtn(originalText, 'rgba(255, 255, 255, 0.8)');
                setTimeout(() => resetBtn(originalText, null), 3000);
                await CustomDialog.alert(
                    'Unsubscribe Failed',
                    `Could not unsubscribe from ${channelName}.\n\nYouTube may have blocked the request. Try visiting the channel page directly.`
                );
            }
        } catch (e) {
            window.YPP.Utils?.log('individualUnsubscribe error', 'CHANNEL-HEALTH', 'error', e);
            resetBtn(originalText, null);
        }
    }

    static async bulkUnsubscribe(overlay) {
        const checkboxes = overlay.querySelectorAll('.ypp-unsub-checkbox:checked');
        if (checkboxes.length === 0) return;

        if (!(await CustomDialog.confirm('Bulk Unsubscribe', `Are you sure you want to permanently unsubscribe from ${checkboxes.length} channels?`, 'Unsubscribe', true))) return;

        const btn = overlay.querySelector('#ypp-health-unsub-btn');
        btn.textContent = 'Unsubscribing...';
        btn.disabled = true;

        const channels = Array.from(checkboxes).map(cb => ({
            id: cb.value,
            params: cb.dataset.params,
            onSuccess: () => {
                const row = cb.closest('.ypp-channel-health-row');
                row.style.opacity = '0.3';
                cb.disabled = true;
                cb.checked = false;
                
                const unsubBtn = row.querySelector('.ypp-indiv-unsub-btn');
                if (unsubBtn) {
                    unsubBtn.disabled = true;
                    unsubBtn.textContent = 'Unsubscribed';
                }
                
                const name = row.dataset.name || 'Unknown';
                const icon = row.querySelector('.ypp-health-row-avatar')?.src || '';
                ChannelHealthDB.addUnsubChannel({ id: cb.value, name, icon, unsubTime: Date.now() }).catch(() => {});
            }
        }));

        try {
            const successCount = await ChannelHealthAPI.doUnsubscribe(channels);

            btn.textContent = `Unsubscribed ${successCount}`;
            setTimeout(() => {
                btn.style.display = 'none';
            }, 2000);
        } catch (e) {
            window.YPP.Utils?.log('bulkUnsubscribe error', 'CHANNEL-HEALTH', 'error', e);
            btn.textContent = 'Unsubscribe Error';
            btn.disabled = false;
        }
    }
}
