import { signIn, signOut, checkAuthStatus } from '../../../shared/utils/auth/google-auth.js';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const SPIN_SVG  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.8s linear infinite;flex-shrink:0"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
const CHECK_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>`;
const ERR_SVG   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

// ─── Custom Modal (replaces browser confirm/alert) ───────────────────────────

/**
 * Show a glassmorphic confirmation modal instead of browser confirm().
 * @param {string} title
 * @param {string} body   HTML allowed
 * @param {{ label: string, danger?: boolean }[]} buttons
 * @returns {Promise<number>} Resolves with the index of the clicked button (or -1 on dismiss)
 */
function showModal(title, body, buttons = [{ label: 'OK' }]) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'ypp-modal-overlay';
    overlay.innerHTML = `
      <div class="ypp-modal">
        <div class="ypp-modal-header">
          <h3 class="ypp-modal-title">${title}</h3>
        </div>
        <div class="ypp-modal-body">${body}</div>
        <div class="ypp-modal-footer">
          ${buttons.map((b, i) =>
            `<button class="ypp-modal-btn${b.danger ? ' danger' : ''}" data-idx="${i}">${b.label}</button>`
          ).join('')}
        </div>
      </div>`;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));

    const close = (idx) => {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
      resolve(idx);
    };

    overlay.querySelectorAll('.ypp-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => close(parseInt(btn.dataset.idx, 10)));
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(-1);
    });
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Promisified chrome.runtime.sendMessage */
function sendMsg(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: chrome.runtime.lastError.message });
      } else {
        resolve(response || { success: false });
      }
    });
  });
}

/** Format an ISO string or timestamp into a human-readable relative time */
function formatSyncTime(ts) {
  if (!ts) return 'Never';
  const date  = new Date(ts);
  const now   = new Date();
  const diffMs = now - date;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1)  return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24)   return `${diffH}h ago`;
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Flash a button with a state, then restore original HTML */
function flashBtn(btn, html, duration = 2200) {
  return new Promise((res) => {
    btn.innerHTML = html;
    setTimeout(() => res(), duration);
  });
}

/** Update the Last Sync label */
function updateSyncLabel(ts) {
  const label = document.getElementById('lastSyncTimeLabel');
  if (label) label.textContent = `Last sync: ${formatSyncTime(ts)}`;
  // Persist timestamp
  if (ts) chrome.storage.local.set({ ypp_last_sync_time: new Date(ts).toISOString() });
}

// ─── AccountMenu Class ───────────────────────────────────────────────────────

export class AccountMenu {
  constructor() {
    this.btnSignIn    = document.getElementById('btn-sync-signin');
    this.btnSignOut   = document.getElementById('btn-sync-signout');
    this.btnSyncNow   = document.getElementById('btn-sync-now');
    this.btnRestore   = document.getElementById('btnBackupDown');
    this.btnReset     = document.getElementById('resetBtn');

    this.signedOutCard = document.getElementById('sync-signed-out-card');
    this.signedInCard  = document.getElementById('sync-signed-in-card');

    this.avatarEl = document.getElementById('sync-user-avatar');
    this.nameEl   = document.getElementById('sync-user-name');
    this.emailEl  = document.getElementById('sync-user-email');

    this.btnSyncSettingsToggle = document.getElementById('btnSyncSettingsToggle');
    this.syncSettingsPopover   = document.getElementById('sync-settings-popover');
    this.btnSyncSettingsClose  = document.getElementById('btnSyncSettingsClose');
    this.syncCheckboxes        = {
      settings: document.getElementById('syncOptSettings'),
      subs: document.getElementById('syncOptSubs'),
      design: document.getElementById('syncOptDesign'),
      bookmarks: document.getElementById('syncOptBookmarks'),
      history: document.getElementById('syncOptHistory'),
      auto: document.getElementById('syncOptAuto')
    };

    if (this.btnSignIn) this.init();
  }

  async init() {
    this.btnSignIn?.addEventListener('click',  () => this.handleSignIn());
    this.btnSignOut?.addEventListener('click', () => this.handleSignOut());
    this.btnSyncNow?.addEventListener('click', () => this.handleSyncNow());
    this.btnRestore?.addEventListener('click', () => this.handleRestore());
    this.btnReset?.addEventListener('click',   () => this.handleReset());

    // Sync Preferences Logic
    this.initSyncPreferences();

    // Load persisted last-sync time
    chrome.storage.local.get('ypp_last_sync_time', (data) => {
      updateSyncLabel(data.ypp_last_sync_time || null);
    });

    // Listen for background sync completions
    document.addEventListener('cloud-sync-completed', (e) => {
      updateSyncLabel(e.detail?.timestamp);
    });

    await this.updateUI();
  }

  // ── Sync Preferences ─────────────────────────────────────────────────────────

  initSyncPreferences() {
    if (!this.btnSyncSettingsToggle || !this.syncSettingsPopover) return;

    // Move modal to body to escape clipping containers (overflow: hidden, transforms, etc.)
    document.body.appendChild(this.syncSettingsPopover);

    // Load saved preferences
    chrome.storage.local.get('ypp_sync_prefs', (data) => {
      const prefs = data.ypp_sync_prefs || { settings: true, subs: true, design: true, bookmarks: true, history: true, autoSync: false };
      if (this.syncCheckboxes.settings) this.syncCheckboxes.settings.checked = prefs.settings;
      if (this.syncCheckboxes.subs) this.syncCheckboxes.subs.checked = prefs.subs;
      if (this.syncCheckboxes.design) this.syncCheckboxes.design.checked = prefs.design;
      if (this.syncCheckboxes.bookmarks) this.syncCheckboxes.bookmarks.checked = prefs.bookmarks;
      if (this.syncCheckboxes.history) this.syncCheckboxes.history.checked = prefs.history !== false; // default true
      if (this.syncCheckboxes.auto) this.syncCheckboxes.auto.checked = prefs.autoSync === true;
    });

    // Toggle popover
    this.btnSyncSettingsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = this.syncSettingsPopover.style.display === 'none';
      this.syncSettingsPopover.style.display = isHidden ? 'block' : 'none';
    });

    // Close button
    if (this.btnSyncSettingsClose) {
      this.btnSyncSettingsClose.addEventListener('click', () => {
        this.syncSettingsPopover.style.display = 'none';
      });
    }

    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.syncSettingsPopover.contains(e.target) && !this.btnSyncSettingsToggle.contains(e.target)) {
        this.syncSettingsPopover.style.display = 'none';
      }
    });

    // Save preferences on change
    Object.values(this.syncCheckboxes).forEach(cb => {
      if (!cb) return;
      cb.addEventListener('change', () => {
        const newPrefs = {
          settings: this.syncCheckboxes.settings?.checked ?? true,
          subs: this.syncCheckboxes.subs?.checked ?? true,
          design: this.syncCheckboxes.design?.checked ?? true,
          bookmarks: this.syncCheckboxes.bookmarks?.checked ?? true,
          history: this.syncCheckboxes.history?.checked ?? true,
          autoSync: this.syncCheckboxes.auto?.checked ?? false
        };
        chrome.storage.local.set({ ypp_sync_prefs: newPrefs });
        // Notify background to update alarm
        chrome.runtime.sendMessage({ action: 'UPDATE_AUTO_SYNC', enabled: newPrefs.autoSync });
      });
    });
  }

  // ── UI State ───────────────────────────────────────────────────────────────

  async updateUI() {
    const { isAuthenticated, userInfo } = await checkAuthStatus();

    if (isAuthenticated && userInfo) {
      this.signedOutCard?.style.setProperty('display', 'none');
      this.signedInCard?.style.setProperty('display', 'block');

      if (this.avatarEl) {
        this.avatarEl.src = userInfo.picture || '';
        this.avatarEl.style.display = userInfo.picture ? 'block' : 'none';
      }
      if (this.nameEl)  this.nameEl.textContent  = userInfo.name  || 'Google User';
      if (this.emailEl) this.emailEl.textContent  = userInfo.email || '';

    } else {
      this.signedOutCard?.style.setProperty('display', 'flex');
      this.signedInCard?.style.setProperty('display',  'none');
    }
  }

  // ── Sign In ────────────────────────────────────────────────────────────────

  async handleSignIn() {
    if (!this.btnSignIn) return;
    
    const textSpan = this.btnSignIn.querySelector('.google-btn-text');
    const origText = textSpan ? textSpan.innerHTML : this.btnSignIn.innerHTML;
    
    if (textSpan) {
      textSpan.innerHTML = 'Signing in…';
    } else {
      this.btnSignIn.innerHTML = 'Signing in…';
    }
    
    this.btnSignIn.style.opacity = '0.8';
    this.btnSignIn.style.pointerEvents = 'none';

    try {
      await signIn(true);
      await this.updateUI();
    // After sign-in: pull existing backup from Drive, then show backup info
    const response = await sendMsg({ action: 'SYNC_BACKUP_DOWN' });
    if (response?.success) {
      updateSyncLabel(response.timestamp || Date.now());
    }
    this.refreshBackupInfo();
  } catch (e) {
      window.YPP?.Utils?.log('Sign in failed: ' + e.message, 'AUTH', 'error');
    } finally {
      if (textSpan) {
        textSpan.innerHTML = origText;
      } else {
        this.btnSignIn.innerHTML = origText;
      }
      this.btnSignIn.style.opacity = '1';
      this.btnSignIn.style.pointerEvents = 'auto';
    }
  }

  // ── Sign Out ───────────────────────────────────────────────────────────────

  async handleSignOut() {
    if (!this.btnSignOut) return;
    const orig = this.btnSignOut.innerHTML;
    this.btnSignOut.style.pointerEvents = 'none';
    this.btnSignOut.innerHTML = SPIN_SVG;

    try {
      await signOut();
    } catch (e) {
      window.YPP?.Utils?.log('Sign out error: ' + e.message, 'AUTH', 'warn');
    } finally {
      await this.updateUI();
      this.btnSignOut.innerHTML = orig;
      this.btnSignOut.style.pointerEvents = 'auto';
    }
  }

  // ── Backup & Sync ──────────────────────────────────────────────────────────

  async handleSyncNow() {
    if (!this.btnSyncNow) return;
    const orig = this.btnSyncNow.innerHTML;
    this.btnSyncNow.classList.add('syncing');
    this.btnSyncNow.style.pointerEvents = 'none';
    this.btnSyncNow.innerHTML = `${SPIN_SVG} Backing up…`;

    try {
      const response = await sendMsg({ action: 'SYNC_BACKUP_UP' });

      if (response?.success) {
        updateSyncLabel(response.timestamp || Date.now());
        this.btnSyncNow.classList.remove('syncing');
        await flashBtn(this.btnSyncNow, `${CHECK_SVG} Saved to Drive!`);
      } else {
        this.btnSyncNow.classList.remove('syncing');
        await flashBtn(this.btnSyncNow, `${ERR_SVG} Backup failed`);
        window.YPP?.Utils?.log('Backup failed: ' + (response?.error || 'Unknown'), 'SYNC', 'error');
      }
    } catch (e) {
      this.btnSyncNow.classList.remove('syncing');
      await flashBtn(this.btnSyncNow, `${ERR_SVG} Error`);
      window.YPP?.Utils?.log('Sync error: ' + e.message, 'SYNC', 'error');
    } finally {
      this.btnSyncNow.classList.remove('syncing');
      this.btnSyncNow.innerHTML = orig;
      this.btnSyncNow.style.pointerEvents = 'auto';
    }
  }

  // ── Restore from Drive ─────────────────────────────────────────────────────

  async handleRestore() {
    if (!this.btnRestore) return;

    const choice = await showModal(
      'Restore from Google Drive',
      'This will <strong>overwrite your current local settings and data</strong> with the latest cloud backup.<br><br>Your current settings will be replaced. Continue?',
      [{ label: 'Cancel' }, { label: 'Restore', danger: false }]
    );
    if (choice !== 1) return;

    const orig = this.btnRestore.innerHTML;
    this.btnRestore.style.pointerEvents = 'none';
    this.btnRestore.innerHTML = `${SPIN_SVG} Restoring…`;

    try {
      const response = await sendMsg({ action: 'SYNC_BACKUP_DOWN' });

      if (response?.success) {
        updateSyncLabel(response.timestamp || Date.now());
        await flashBtn(this.btnRestore, `${CHECK_SVG} Restored!`);
        // Reload popup to apply restored settings
        setTimeout(() => window.location.reload(), 800);
      } else {
        const errMsg = response?.error || 'No backup found or not signed in';
        await flashBtn(this.btnRestore, `${ERR_SVG} Failed`);
        await showModal('Restore Failed', errMsg, [{ label: 'OK' }]);
      }
    } catch (e) {
      await flashBtn(this.btnRestore, `${ERR_SVG} Error`);
      window.YPP?.Utils?.log('Restore error: ' + e.message, 'SYNC', 'error');
    } finally {
      this.btnRestore.innerHTML = orig;
      this.btnRestore.style.pointerEvents = 'auto';
    }
  }

  // ── Factory Reset ──────────────────────────────────────────────────────────

  async handleReset() {
    if (!this.btnReset) return;

    const choice1 = await showModal(
      '⚠️ Factory Reset',
      'This will <strong>permanently erase ALL</strong> your Spiral Tube settings, history, bookmarks, and your Google Drive backup.<br><br><span style="color:#ff6b6b">This CANNOT be undone.</span> Are you absolutely sure?',
      [{ label: 'Cancel' }, { label: 'Yes, delete everything', danger: true }]
    );
    if (choice1 !== 1) return;

    const choice2 = await showModal(
      'Last confirmation',
      'Are you <strong>100% sure</strong> you want to erase everything?',
      [{ label: 'Cancel' }, { label: 'Permanently Delete', danger: true }]
    );
    if (choice2 !== 1) return;

    const orig = this.btnReset.innerHTML;
    this.btnReset.style.pointerEvents = 'none';
    this.btnReset.innerHTML = `${SPIN_SVG} Resetting…`;

    try {
      const response = await sendMsg({ action: 'SYNC_RESET' });

      if (response?.success) {
        await flashBtn(this.btnReset, `${CHECK_SVG} Done!`, 1000);
        chrome.runtime.reload();
      } else {
        await flashBtn(this.btnReset, `${ERR_SVG} Failed`);
        this.btnReset.innerHTML = orig;
        this.btnReset.style.pointerEvents = 'auto';
      }
    } catch (e) {
      await flashBtn(this.btnReset, `${ERR_SVG} Error`);
      this.btnReset.innerHTML = orig;
      this.btnReset.style.pointerEvents = 'auto';
      window.YPP?.Utils?.log('Reset error: ' + e.message, 'SYNC', 'error');
    }
  }

  // ── Backup Info ─────────────────────────────────────────────────

  /** Fetches backup metadata from Drive and renders it in the UI. */
  async refreshBackupInfo() {
    const infoEl = document.getElementById('drive-backup-info');
    if (!infoEl) return;
    infoEl.textContent = 'Fetching cloud backup info…';
    infoEl.style.opacity = '0.5';

    const info = await sendMsg({ action: 'GET_BACKUP_INFO' });
    if (!info) {
      infoEl.textContent = 'No cloud backup found.';
      infoEl.style.opacity = '0.5';
      return;
    }

    const date = new Date(info.timestamp);
    const relTime = formatSyncTime(date.getTime());
    const sizeKb = info.sizeBytes ? `${(info.sizeBytes / 1024).toFixed(1)} KB` : '';
    const vStr = info.version && info.version !== 'unknown' ? `v${info.version}` : '';

    infoEl.innerHTML = [
      `<span class="bkp-time">${relTime}</span>`,
      vStr ? `<span class="bkp-ver">${vStr}</span>` : '',
      sizeKb ? `<span class="bkp-size">${sizeKb}</span>` : ''
    ].filter(Boolean).join('<span class="bkp-dot">·</span>');
    infoEl.style.opacity = '1';
  }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

export function initAccountMenu() {
  new AccountMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccountMenu);
} else {
  initAccountMenu();
}
