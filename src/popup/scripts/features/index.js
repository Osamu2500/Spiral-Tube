// popup-extras.js - Orchestrator for features

import { initHistoryWidget } from '../features/history-widget.js';
import { initBackupTools } from '../features/backup-tools.js';
import { initBookmarksManager } from '../features/bookmarks-manager.js';
import { renderPlayerBarOrganizer } from '../features/player-bar-organizer.js';
import { renderDomainMemoryManager } from '../features/domain-memory.js';
import { renderGlobalPlayerBarBlocklist } from '../features/global-blocklist.js';

export {
    initHistoryWidget,
    initBackupTools,
    initBookmarksManager,
    renderPlayerBarOrganizer,
    renderDomainMemoryManager,
    renderGlobalPlayerBarBlocklist
};
