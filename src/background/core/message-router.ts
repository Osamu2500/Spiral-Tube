import { handleGetSettings, handlePatchSettings, handleRestoreBackup } from '../handlers/settings-handler.js';
import { handleGetTimer, startTimer, stopTimer } from '../handlers/timer-handler.js';
import { handleExtractColor } from '../handlers/color-handler.js';
import { syncUp, syncDown } from '../services/drive-sync.js';

export function setupMessageRouter() {
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    const action = request.action || request.type;

    switch (action) {
      case 'GET_SETTINGS':
        handleGetSettings(sendResponse);
        return true;

      case 'PATCH_SETTINGS':
        handlePatchSettings(request.payload, sendResponse);
        return true;

      case 'RESTORE_BACKUP':
        handleRestoreBackup(sendResponse);
        return true;

      case 'getTimer':
        handleGetTimer(sendResponse);
        return true;

      case 'startTimer':
      case 'stopTimer':
      case 'resetTimer':
        {
          let timerAction: Promise<void>;
          if (action === 'startTimer') {
            timerAction = startTimer(request.duration);
          } else if (action === 'resetTimer') {
            timerAction = stopTimer().then(() => startTimer(request.duration || 25));
          } else {
            timerAction = stopTimer();
          }

          timerAction
            .then(() => sendResponse({ success: true }))
            .catch((error) => {
              console.error(`[YPP] Error in ${action}:`, error);
              sendResponse({ success: false });
            });
          return true;
        }

      case 'SYNC_BACKUP_UP':
        syncUp().then(sendResponse);
        return true;

      case 'SYNC_BACKUP_DOWN':
        syncDown().then(sendResponse);
        return true;

      case 'EXTRACT_COLOR':
        handleExtractColor(request.url, sendResponse);
        return true;

      default:
        return false;
    }
  });
}
