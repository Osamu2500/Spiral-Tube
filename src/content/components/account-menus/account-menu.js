import '../../core/system/base-feature.js';
/**
 * AccountMenu — replaces YouTube's native account dropdown with an
 * orbital-style panel: active account centered, other accounts as
 * clickable satellite disks around it (or 4 sleek Quick-Action satellites
 * for single-account users).
 *
 * Architecture:
 *  1. MutationObserver detects when the native menu appears in DOM.
 *  2. We IMMEDIATELY hide the native menu children to prevent flash.
 *  3. A polling loop waits until YouTube has hydrated account data.
 *  4. _doInject() appends our panel and wires events.
 *  5. Data extraction is delegated to AccountMenuData.
 *  6. UI generation is delegated to AccountMenuUI.
 */
import './account-menu-data.js';
import './account-menu-ui.js';

export class AccountMenu extends window.YPP.features.BaseFeature {
    static featureId = 'accountMenu';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('AccountMenu');
        /** @type {ReturnType<typeof setTimeout>|null} */
        this._pollTimer = null;
        /** @type {ReturnType<typeof setTimeout>|null} */
        this._avatarPollTimer = null;

        /** @type {boolean} */
        this._injected = false;
        /** @type {Element|null} — the currently observed menu */
        this._currentMenu = null;
    }

    getConfigKey() { return 'enableAccountMenu'; }

    // ─── Lifecycle ─────────────────────────────────────────────────────────────

    async enable() {
        await super.enable();
        try {
            if (window.YPP?.Utils?.addStyle) {
                window.YPP.Utils.addStyle(`
                    .ypp-native-cloaked {
                        position: fixed !important;
                        top: -9999px !important;
                        left: -9999px !important;
                        width: 1px !important;
                        height: 1px !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                        pointer-events: none !important;
                        z-index: -9999 !important;
                        overflow: hidden !important;
                    }
                `, 'ypp-account-menu-cloaking-style');
            }

            // Track which topbar button was clicked to definitively separate Account from Notifications!
            this.addListener(document, 'click', e => {
                // Walk up from the click target to find either the avatar button
                // or a notification button. We check multiple selectors because
                // YouTube renders the avatar button differently across versions.
                const btn = e.target.closest(
                    '#avatar-btn, ' +
                    'button#avatar-btn, ' +
                    'yt-img-shadow#avatar-img, ' +
                    '#masthead #avatar-btn, ' +
                    'ytd-topbar-menu-button-renderer #avatar-btn, ' +
                    'yt-notification-topbar-button-renderer, ' +
                    'ytd-topbar-menu-button-renderer, ' +
                    '#notification-button, ' +
                    '[aria-label*="notification" i], [aria-label*="bell" i]'
                );

                // Also check if the click happened anywhere inside the masthead
                // avatar area — even if the button id isn't #avatar-btn
                const mastheadAvatarArea = e.target.closest(
                    '#masthead ytd-topbar-menu-button-renderer:last-of-type, ' +
                    '#masthead #buttons > ytd-topbar-menu-button-renderer:last-child'
                );

                if (btn || mastheadAvatarArea) {
                    const el = btn || mastheadAvatarArea;
                    const tag  = (el.tagName  || '').toUpperCase();
                    const id   = (el.id       || '').toLowerCase();
                    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
                    const isNotif = tag.includes('NOTIFICATION') ||
                                   id.includes('notification') ||
                                   aria.includes('notification') ||
                                   aria.includes('bell');
                    window.YPP.lastMenuClick = isNotif ? 'NOTIFICATION' :
                                               (id === 'avatar-btn' || mastheadAvatarArea) ? 'avatar-btn' :
                                               id === 'avatar-btn' ? 'avatar-btn' :
                                               tag;

                    if (!isNotif && window.YPP.lastMenuClick) {
                        setTimeout(() => this._onMutation(), 50);
                        setTimeout(() => this._onMutation(), 150);
                        setTimeout(() => this._onMutation(), 350);
                        setTimeout(() => this._onMutation(), 600);
                        setTimeout(() => this._onMutation(), 1000);
                    }
                }
            }, { capture: true });

            // Use sharedObserver (architecture rule: never new MutationObserver)
            if (window.YPP?.sharedObserver) {
                window.YPP.sharedObserver.register(
                    'account-menu-dropdown',
                    'tp-yt-iron-dropdown, ytd-multi-page-menu-renderer, ytd-popup-container',
                    () => { if (!this._injected) this._onMutation(); }
                );
            }
        } catch (e) {
            this.utils?.log('Error enabling AccountMenu', 'ACCOUNT', 'error', e);
        }
    }

    async disable() {
        await super.disable(); // cleanupEvents() called here — removes all busListeners
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('account-menu-dropdown');
        }
        this._cleanup();
    }

    // ─── Mutation handling ─────────────────────────────────────────────────────

    _onMutation() {
        const menu = this._findMenu();
        if (!menu) return;

        // Immediately cloak so the user never sees the native menu flash
        this._cloakNativeChildren(menu);

        if (this._injected) {
            const existingPanel = document.querySelector('.ypp-account-menu');
            if (existingPanel && existingPanel.isConnected) {
                if (menu.lastElementChild !== existingPanel) {
                    menu.appendChild(existingPanel);
                }
                return;
            }
            // Menu was re-rendered or reopened after closing; allow re-injection
            this._injected = false;
        }
        if (this._pollTimer) return; // already polling

        this._startPolling(menu);
    }

    /**
     * Find the account menu element. We look for the multi-page menu that
     * contains the active account header, which is the most reliable signal.
     * We intentionally do NOT require ytd-account-item-renderer here because
     * single-account users don't have those.
     *
     * @returns {Element|null}
     */
    _findMenu() {
        // Strategy 1: slot="menu" inside a visible iron-dropdown
        const dropdowns = document.querySelectorAll('tp-yt-iron-dropdown');
        for (const dd of dropdowns) {
            if (dd.hasAttribute('aria-hidden') && dd.getAttribute('aria-hidden') === 'true') continue;
            const menu = dd.querySelector('ytd-multi-page-menu-renderer');
            if (menu && this._isAccountMenu(menu)) return menu;
        }

        // Strategy 2: slot attribute on the renderer
        const slotted = document.querySelector('ytd-multi-page-menu-renderer[slot="menu"]');
        if (slotted && this._isAccountMenu(slotted)) return slotted;

        // Strategy 3: any visible multi-page-menu with account header
        const allMenus = document.querySelectorAll('ytd-multi-page-menu-renderer');
        for (const m of allMenus) {
            if (this._isAccountMenu(m)) return m;
        }

        // Strategy 4: check any active dropdown inside ytd-popup-container
        const popupContainer = document.querySelector('ytd-popup-container');
        if (popupContainer) {
            const menus = popupContainer.querySelectorAll('ytd-multi-page-menu-renderer, [role="menu"]');
            for (const m of menus) {
                if (this._isAccountMenu(m)) return m;
            }
        }

        return null;
    }

    _isAccountMenu(menu) {
        const last = window.YPP.lastMenuClick;

        // If the user definitively clicked the Notification button, abort.
        if (last === 'NOTIFICATION') {
            window.YPP.lastMenuClick = null;
            return false;
        }

        // If the user definitively clicked the Avatar button, accept it!
        if (last === 'avatar-btn') {
            window.YPP.lastMenuClick = null;
            return true;
        }

        // Fallback check (for keyboard navigation or untracked clicks)
        const isMatch = !!(
            menu.querySelector('ytd-active-account-header-renderer') ||
            menu.querySelector('ytd-account-item-renderer') ||
            menu.querySelector('ytd-account-item') ||
            menu.querySelector('ytd-account-section-list-renderer') ||
            menu.querySelector('ytd-account-item-section-renderer') ||
            menu.querySelector('a[href*="studio.youtube.com"]') ||
            menu.querySelector('a[href*="logout"]') ||
            menu.querySelector('a[href*="myaccount.google.com"]')
        );
        if (isMatch) {
            window.YPP.lastMenuClick = null;
        }
        return isMatch;
    }

    // ─── Cloaking — done BEFORE inject to prevent flash ───────────────────────

    /**
     * Hides ALL native children so their opaque black backgrounds never show.
     * Uses visibility:hidden + overflow:hidden + clip so nothing bleeds through,
     * while still allowing IntersectionObserver to fire for lazy image loading.
     *
     * Also sets up a MutationObserver on the menu so that when YouTube injects
     * the Switch-Account sub-page dynamically, those new children are cloaked
     * immediately before they paint.
     *
     * @param {Element} menu
     */
    _cloakNativeChildren(menu) {
        menu.dataset.yppCloaked = '1';

        // Clamp the menu itself so nothing can overflow/bleed out
        menu.style.setProperty('overflow', 'hidden', 'important');

        const cloakEl = (child) => {
            if (child.classList && child.classList.contains('ypp-account-menu')) return;
            child.classList.add('ypp-native-cloaked');
        };

        Array.from(menu.children).forEach(cloakEl);

        // Watch for dynamically added children (e.g. Switch Account sub-page)
        if (!menu._yppCloakObserver) {
            const obs = new MutationObserver(mutations => {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        if (node.nodeType === 1) cloakEl(node);
                    }
                }
            });
            obs.observe(menu, { childList: true });
            menu._yppCloakObserver = obs;
        }
    }

    // ─── Polling ──────────────────────────────────────────────────────────────

    /**
     * Polls until we have enough account data to render, then injects.
     * Never auto-clicks "Switch account" to avoid deadlocking single-account users.
     *
     * @param {Element} menu
     */
    _startPolling(menu) {
        if (this._pollTimer) return;
        this._pollTimer = true;

        this.pollFor(
            () => {
                if (!menu.isConnected) return true; // abort
                this._cloakNativeChildren(menu);
                const data = window.YPP.features.AccountMenuData.extractData(menu);
                
                // Immediately inject as long as we extracted at least one account!
                if (data && data.accounts && data.accounts.length > 0) {
                    this._pollTimer = null;
                    this._doInject(menu, data);
                    return true; // done
                }
                return false; // keep polling
            },
            4000, // 4s timeout
            40    // 40ms interval
        ).catch(() => {
            this._pollTimer = null; // timed out, reset
            // SAFETY FALLBACK: Even if polling timed out, inject anyway so the menu is never blank or cloaked!
            if (menu.isConnected && !this._injected) {
                const fallbackData = window.YPP.features.AccountMenuData.extractData(menu);
                if (fallbackData) {
                    this._doInject(menu, fallbackData);
                }
            }
        });
    }

    _clearPollTimer() {
        if (this._pollTimer === true) {
            this._pollTimer = null;
        }
    }

    _clearAvatarPollTimer() {
        clearTimeout(this._avatarPollTimer);
        this._avatarPollTimer = null;
    }

    // ─── Injection ─────────────────────────────────────────────────────────────

    _doInject(menu, data) {
        if (this._injected) return;
        this._injected = true;
        this._currentMenu = menu;

        menu.dataset.yppRedesigned = '1';

        // Remove any leftover panel from a previous session
        menu.querySelector('.ypp-account-menu')?.remove();

        const panel = document.createElement('div');
        panel.className = 'ypp-account-menu';
        panel.style.cssText = 'opacity:0;transform:translateY(-8px);transition:opacity 0.25s ease,transform 0.25s cubic-bezier(0.34,1.56,0.64,1);';
        panel.innerHTML = window.YPP.features.AccountMenuUI.buildMenuHTML(data);
        menu.appendChild(panel);

        this._wireEvents(panel, menu);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(0)';
            });
        });

        // Schedule progressive avatar upgrades
        this._scheduleAvatarRefresh(panel, menu);
    }

    // ─── Avatar refresh ────────────────────────────────────────────────────────

    /**
     * Progressively upgrades letter-avatars to real photos once YouTube's
     * IntersectionObserver has loaded the actual img.src values.
     *
     * @param {Element} panel  — our injected panel
     * @param {Element} menu   — the native menu element
     */
    _scheduleAvatarRefresh(panel, menu) {
        const DELAYS = [250, 700, 1400, 2500];
        let attempt = 0;

        const upgradeDisk = (container, acc, size, ring) => {
            if (!container) return;
            // Only replace letter avatars — if an img is already there, skip
            const existing = container.querySelector('.ypp-disk-wrap .ypp-disk-img');
            if (existing && existing.getAttribute('src') === acc.avatar) return;

            const letterEl = container.querySelector('.ypp-letter-avatar');
            if (!letterEl) return;

            const temp = document.createElement('div');
            temp.innerHTML = window.YPP.features.AccountMenuUI.diskHTML(acc, size, ring);
            const newDisk = temp.firstElementChild;
            if (!newDisk) return;
            letterEl.replaceWith(newDisk);

            const imgNode = newDisk.querySelector('.ypp-disk-img');
            if (imgNode) {
                this.addListener(imgNode, 'error', () => {
                    const t = document.createElement('div');
                    t.innerHTML = window.YPP.features.AccountMenuUI.letterAvatar(acc.name, size, ring);
                    newDisk.replaceWith(t.firstElementChild);
                });
            }
        };

        const refresh = () => {
            if (!panel.isConnected) return;

            // Re-extract fresh data from the native menu
            const freshData = window.YPP.features.AccountMenuData.extractData(menu);

            freshData.accounts.forEach(acc => {
                if (!acc.avatar) return;

                if (acc.isActive) {
                    const orbitalWrap = panel.querySelector('.ypp-orbital-wrap');
                    if (orbitalWrap) {
                        const centerDiv = orbitalWrap.querySelector('div:not(.ypp-satellite)');
                        if (centerDiv) upgradeDisk(centerDiv, acc, 68, true);
                    }
                } else {
                    const satTitle = acc.name;
                    const sat = panel.querySelector(`.ypp-satellite[title="${CSS.escape(satTitle)}"]`);
                    if (sat) upgradeDisk(sat, acc, 40, false);
                }
            });

            attempt++;
            if (attempt < DELAYS.length) {
                const delay = attempt === 0
                    ? DELAYS[0]
                    : DELAYS[attempt] - DELAYS[attempt - 1];
                this._avatarPollTimer = setTimeout(refresh, delay);
            }
        };

        this._avatarPollTimer = window.setTimeout(refresh, DELAYS[0]);
    }

    // ─── Event wiring ──────────────────────────────────────────────────────────

    _wireEvents(panel, menu) {
        const viewChannel = panel.querySelector('#ypp-view-channel');
        if (viewChannel) this.addListener(viewChannel, 'click', () => this._closeMenu());

        // Helper to trigger native Switch Account action
        const triggerSwitchAccount = () => {
            const switchBtn = Array.from(menu.querySelectorAll('ytd-compact-link-renderer, ytd-menu-navigation-item-renderer'))
                .find(el => {
                    const text = (el.textContent || '').toLowerCase();
                    const icon = el.querySelector('yt-icon')?.getAttribute('icon') || '';
                    return text.includes('switch') || text.includes('cambiar') || icon.includes('switch_account') || icon.includes('switch-account');
                });
            if (switchBtn) {
                const target = switchBtn.querySelector('a#endpoint, tp-yt-paper-item') || switchBtn;
                target.click();
            }
        };

        // Header Switch Button
        const switchAccountBtn = panel.querySelector('#ypp-switch-account-btn');
        if (switchAccountBtn) {
            this.addListener(switchAccountBtn, 'click', triggerSwitchAccount);
        }

        // Quick-Action Satellites (for single-account users)
        panel.querySelectorAll('.ypp-quick-sat').forEach(sat => {
            this.addListener(sat, 'click', () => {
                const action = sat.dataset.quickAction;
                if (action === 'switch') {
                    triggerSwitchAccount();
                } else if (action === 'studio') {
                    window.open('https://studio.youtube.com', '_blank');
                    this._closeMenu();
                } else if (action === 'google') {
                    window.open('https://myaccount.google.com', '_blank');
                    this._closeMenu();
                } else if (action === 'settings') {
                    this._closeMenu();
                    window.location.href = '/account';
                }
            });
        });

        // --- Interactive Appearance (Theme Picker Drawer) ---
        const appearanceBtn = panel.querySelector('#ypp-appearance');
        const appearanceDrawer = panel.querySelector('#ypp-drawer-appearance');
        if (appearanceBtn && appearanceDrawer) {
            this.addListener(appearanceBtn, 'click', () => {
                const isVisible = appearanceDrawer.style.display !== 'none';
                appearanceDrawer.style.display = isVisible ? 'none' : 'block';
                appearanceBtn.classList.toggle('active', !isVisible);
            });

            appearanceDrawer.querySelectorAll('.ypp-theme-opt').forEach(opt => {
                this.addListener(opt, 'click', (e) => {
                    e.stopPropagation();
                    const theme = opt.dataset.theme;
                    appearanceDrawer.querySelectorAll('.ypp-theme-opt').forEach(b => b.style.borderColor = 'rgba(255,255,255,0.1)');
                    opt.style.borderColor = '#ff4e45';
                    const badge = appearanceBtn.querySelector('.ypp-item-badge');
                    if (badge) {
                        badge.textContent = theme === 'dark' ? 'Dark theme' : theme === 'light' ? 'Light theme' : 'Device theme';
                    }
                    if (theme === 'dark') {
                        document.documentElement.setAttribute('dark', 'true');
                    } else if (theme === 'light') {
                        document.documentElement.removeAttribute('dark');
                    }
                    const nativeThemeBtn = document.querySelector('ytd-toggle-theme-compact-link-renderer button, [aria-label*="Appearance"]');
                    if (nativeThemeBtn) {
                        try { nativeThemeBtn.click(); } catch (_) {}
                    }
                });
            });
        }

        // --- Interactive Settings Button ---
        const settingsBtn = panel.querySelector('#ypp-settings');
        if (settingsBtn) this.addListener(settingsBtn, 'click', () => {
            this._closeMenu();
            window.location.href = '/account';
        });

        // --- Interactive Language Drawer ---
        const langBtn = panel.querySelector('#ypp-language');
        const langDrawer = panel.querySelector('#ypp-drawer-language');
        const langSearch = panel.querySelector('#ypp-lang-search');
        if (langBtn && langDrawer) {
            this.addListener(langBtn, 'click', () => {
                const isVisible = langDrawer.style.display !== 'none';
                langDrawer.style.display = isVisible ? 'none' : 'block';
            });
            if (langSearch) {
                this.addListener(langSearch, 'input', () => {
                    const q = langSearch.value.toLowerCase().trim();
                    langDrawer.querySelectorAll('.ypp-lang-opt').forEach(b => {
                        const match = b.textContent.toLowerCase().includes(q);
                        b.style.display = match ? 'block' : 'none';
                    });
                });
            }
            langDrawer.querySelectorAll('.ypp-lang-opt').forEach(opt => {
                this.addListener(opt, 'click', (e) => {
                    e.stopPropagation();
                    const badge = langBtn.querySelector('.ypp-item-badge');
                    if (badge) badge.textContent = opt.dataset.lang;
                    langDrawer.style.display = 'none';
                });
            });
        }

        // --- Interactive Location Drawer ---
        const locBtn = panel.querySelector('#ypp-location');
        const locDrawer = panel.querySelector('#ypp-drawer-location');
        const locSearch = panel.querySelector('#ypp-loc-search');
        if (locBtn && locDrawer) {
            this.addListener(locBtn, 'click', () => {
                const isVisible = locDrawer.style.display !== 'none';
                locDrawer.style.display = isVisible ? 'none' : 'block';
            });
            if (locSearch) {
                this.addListener(locSearch, 'input', () => {
                    const q = locSearch.value.toLowerCase().trim();
                    locDrawer.querySelectorAll('.ypp-loc-opt').forEach(b => {
                        const match = b.textContent.toLowerCase().includes(q);
                        b.style.display = match ? 'block' : 'none';
                    });
                });
            }
            locDrawer.querySelectorAll('.ypp-loc-opt').forEach(opt => {
                this.addListener(opt, 'click', (e) => {
                    e.stopPropagation();
                    const badge = locBtn.querySelector('.ypp-item-badge');
                    if (badge) badge.textContent = opt.dataset.loc;
                    locDrawer.style.display = 'none';
                });
            });
        }

        // --- Interactive Restricted Mode Toggle ---
        const restBtn = panel.querySelector('#ypp-restricted');
        const restDrawer = panel.querySelector('#ypp-drawer-restricted');
        const restToggleBtn = panel.querySelector('#ypp-toggle-restricted-btn');
        if (restBtn && restDrawer && restToggleBtn) {
            this.addListener(restBtn, 'click', () => {
                const isVisible = restDrawer.style.display !== 'none';
                restDrawer.style.display = isVisible ? 'none' : 'flex';
            });
            this.addListener(restToggleBtn, 'click', (e) => {
                e.stopPropagation();
                const isOn = restToggleBtn.textContent.trim() === 'ON';
                const nextState = !isOn;
                restToggleBtn.textContent = nextState ? 'ON' : 'OFF';
                restToggleBtn.style.background = nextState ? '#ff4e45' : 'rgba(255,255,255,0.1)';
                const badge = restBtn.querySelector('.ypp-item-badge');
                if (badge) badge.textContent = nextState ? 'On' : 'Off';
            });
        }

        // --- Keyboard Shortcuts ---
        const keyboardBtn = panel.querySelector('#ypp-keyboard');
        if (keyboardBtn) this.addListener(keyboardBtn, 'click', () => {
            this._closeMenu();
            setTimeout(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: '?', shiftKey: true, bubbles: true }));
            }, 150);
        });

        const helpBtn = panel.querySelector('#ypp-help');
        if (helpBtn) this.addListener(helpBtn, 'click', () => {
            this._closeMenu();
            window.open('https://support.google.com/youtube/', '_blank');
        });

        // Helper to click native sub-menu items by matching text or aria-labels
        const clickNativeItem = (keywords) => {
            this._closeMenu();
            setTimeout(() => {
                const items = Array.from(document.querySelectorAll(
                    'ytd-compact-link-renderer, ytd-menu-navigation-item-renderer, ytd-toggle-theme-compact-link-renderer'
                ));
                const target = items.find(el => {
                    const text = (el.textContent || '').toLowerCase();
                    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
                    return keywords.some(k => text.includes(k) || aria.includes(k));
                });
                if (target) target.click();
            }, 150);
        };

        const feedbackBtn = panel.querySelector('#ypp-feedback');
        if (feedbackBtn) this.addListener(feedbackBtn, 'click', () => clickNativeItem(['feedback', 'comentarios', 'commentaires']));

        const moreToggle = panel.querySelector('#ypp-more-toggle');
        const moreItems  = panel.querySelector('#ypp-more-items');
        const chevron    = panel.querySelector('.ypp-chevron');
        if (moreToggle && moreItems) {
            this.addListener(moreToggle, 'click', () => {
                const open = moreItems.classList.toggle('open');
                moreToggle.setAttribute('aria-expanded', String(open));
                if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : '';
            });
        }

        const confirmDialog = panel.querySelector('#ypp-signout-confirm');
        const signoutBtn = panel.querySelector('#ypp-signout');
        if (signoutBtn) this.addListener(signoutBtn, 'click', () => {
            if (confirmDialog) confirmDialog.style.display = 'flex';
        });
        
        const confirmCancel = panel.querySelector('#ypp-confirm-cancel');
        if (confirmCancel) this.addListener(confirmCancel, 'click', () => {
            if (confirmDialog) confirmDialog.style.display = 'none';
        });
        
        const confirmOk = panel.querySelector('#ypp-confirm-ok');
        if (confirmOk) this.addListener(confirmOk, 'click', () => {
            const nativeSignOut =
                document.querySelector('a[href*="logout"]') ||
                document.querySelector('a[href*="signout"]');
            if (nativeSignOut) {
                nativeSignOut.click();
            } else {
                window.location.href = 'https://www.youtube.com/logout';
            }
        });

        // Image error fallback
        panel.querySelectorAll('.ypp-disk-img').forEach(img => {
            this.addListener(img, 'error', () => {
                const wrap = img.closest('.ypp-disk-wrap');
                if (!wrap) return;
                const name = wrap.dataset.fallbackName || '';
                const size = parseInt(wrap.dataset.size, 10) || 40;
                const ring = wrap.dataset.ring === '1';
                const temp = document.createElement('div');
                temp.innerHTML = window.YPP.features.AccountMenuUI.letterAvatar(name, size, ring);
                wrap.replaceWith(temp.firstElementChild);
            });
        });

        // Satellite click → switch account (for multi-account users)
        panel.querySelectorAll('.ypp-satellite:not(.ypp-quick-sat)').forEach(sat => {
            const activate = () => {
                const idx = parseInt(sat.dataset.accountIndex, 10);
                if (!isNaN(idx)) {
                    const items = document.querySelectorAll('ytd-account-item-renderer, ytd-account-item');
                    if (items[idx]) items[idx].click();
                }
            };
            this.addListener(sat, 'click', activate);
            this.addListener(sat, 'keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate();
                }
            });
        });
    }

    _closeMenu() {
        const backdrop = document.querySelector('tp-yt-iron-overlay-backdrop');
        if (backdrop) { backdrop.click(); return; }
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    }

    // ─── Cleanup ───────────────────────────────────────────────────────────────

    /**
     * Standard BaseFeature lifecycle hook called on SPA navigation.
     */
    onPageChange(url) {
        this._cleanup();
    }

    _cleanup() {
        if (typeof this.cleanupEvents === 'function') this.cleanupEvents();
        this._clearPollTimer();
        this._clearAvatarPollTimer();
        this._injected = false;
        this._currentMenu = null;

        const uncloakEl = (el) => {
            el.classList.remove('ypp-native-cloaked');
        };

        document.querySelectorAll('[data-ypp-redesigned]').forEach(el => {
            // Disconnect the cloak observer
            if (el._yppCloakObserver) {
                el._yppCloakObserver.disconnect();
                delete el._yppCloakObserver;
            }
            el.style.removeProperty('overflow');
            Array.from(el.children).forEach(child => {
                if (!child.classList.contains('ypp-account-menu')) uncloakEl(child);
            });
            delete el.dataset.yppRedesigned;
            delete el.dataset.yppCloaked;
            el.querySelector('.ypp-account-menu')?.remove();
        });

        document.querySelectorAll('[data-ypp-cloaked]').forEach(el => {
            if (el._yppCloakObserver) {
                el._yppCloakObserver.disconnect();
                delete el._yppCloakObserver;
            }
            el.style.removeProperty('overflow');
            Array.from(el.children).forEach(child => uncloakEl(child));
            delete el.dataset.yppCloaked;
        });
    }
};

window.YPP.features.AccountMenu = AccountMenu;
