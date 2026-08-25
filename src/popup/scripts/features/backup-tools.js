// popup-extras.js — History Widget, Backup Tools, and Bookmarks Manager
// All code is wrapped in exported functions. No side-effects at module level.
import { FILTERS } from '../../../content/pages/watch/player/media-effects/video-filters/video-filters-presets.js';

// =========================================================================
// HISTORY WIDGET
// =========================================================================

const escapeHTML = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

let currentCalDate = new Date();
let selectedCalDateString = null;


export function initBackupTools() {
    // --- Local folder export/import ---
    const exportBtn = document.getElementById('exportFoldersBtn');
    const importBtn = document.getElementById('importFoldersBtn');
    const fileInput = document.getElementById('importFoldersFile');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            chrome.storage.local.get(['ypp_subscription_folders', 'ypp_folder_config'], (result) => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
                const a = document.createElement('a');
                a.setAttribute('href', dataStr);
                a.setAttribute('download', 'ypp_folders_backup_' + new Date().toISOString().split('T')[0] + '.json');
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
        });
    }

    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (event) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (importedData.ypp_subscription_folders) {
                        chrome.storage.local.set({
                            'ypp_subscription_folders': importedData.ypp_subscription_folders,
                            'ypp_folder_config': importedData.ypp_folder_config || {}
                        }, () => {
                            alert('Folders imported successfully! Please refresh YouTube.');
                        });
                    } else {
                        alert('Invalid backup file format.');
                    }
                } catch (err) {
                    alert('Error reading file.');
                }
            };
            if (event.target.files[0]) {
                fileReader.readAsText(event.target.files[0]);
            }
        });
    }

    // --- Cloud backup (Google Drive) ---
    const btnBackupUp = document.getElementById('btnBackupUp');
    const btnBackupDown = document.getElementById('btnBackupDown');
    const lastSyncTimeLabel = document.getElementById('lastSyncTimeLabel');

    const updateLastSyncLabel = (timeStr) => {
        if (!lastSyncTimeLabel) return;
        if (!timeStr) {
            lastSyncTimeLabel.textContent = 'Last sync: Never';
            return;
        }
        const date = new Date(timeStr);
        const formatted = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastSyncTimeLabel.textContent = `Last sync: ${formatted}`;
    };

    chrome.storage.local.get('ypp_last_sync_time', (data) => {
        updateLastSyncLabel(data.ypp_last_sync_time || null);
    });

    if (btnBackupUp) {
        btnBackupUp.addEventListener('click', () => {
            const originalHTML = btnBackupUp.innerHTML;
            btnBackupUp.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"></path></svg> Backing up...';
            btnBackupUp.style.pointerEvents = 'none';

            chrome.runtime.sendMessage({ action: 'SYNC_BACKUP_UP' }, (response) => {
                btnBackupUp.style.pointerEvents = 'auto';
                if (response && response.success) {
                    btnBackupUp.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Success!';
                    updateLastSyncLabel(response.timestamp);
                    setTimeout(() => { btnBackupUp.innerHTML = originalHTML; }, 2000);
                } else {
                    btnBackupUp.innerHTML = 'Error!';
                    setTimeout(() => { btnBackupUp.innerHTML = originalHTML; }, 2000);
                    alert('Backup failed. Please ensure you are signed into Chrome.');
                }
            });
        });
    }

    if (btnBackupDown) {
        btnBackupDown.addEventListener('click', () => {
            if (!confirm('This will OVERWRITE your current local data with the Google Drive backup. Proceed?')) return;

            const originalHTML = btnBackupDown.innerHTML;
            btnBackupDown.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"></path></svg> Restoring...';
            btnBackupDown.style.pointerEvents = 'none';

            chrome.runtime.sendMessage({ action: 'SYNC_BACKUP_DOWN' }, (response) => {
                btnBackupDown.style.pointerEvents = 'auto';
                if (response && response.success) {
                    btnBackupDown.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Restored!';
                    if (response.timestamp) updateLastSyncLabel(response.timestamp);
                    setTimeout(() => { btnBackupDown.innerHTML = originalHTML; }, 2000);
                } else {
                    btnBackupDown.innerHTML = 'Error!';
                    setTimeout(() => { btnBackupDown.innerHTML = originalHTML; }, 2000);
                    alert('Restore failed. No backup found or authentication error.');
                }
            });
        });
    }
}

// =========================================================================
// BOOKMARKS MANAGER
// =========================================================================

