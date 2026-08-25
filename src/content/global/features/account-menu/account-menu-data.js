/**
 * Handles extraction of account data and avatar URLs from YouTube's native DOM.
 */
export class AccountMenuData {
    static featureId = 'accountMenuData';
    static executionPhase = 'idle';
    static priority = 999;

    /**
     * Reads avatar URL from a YouTube custom element using three strategies
     * in order of reliability:
     *  1. yt-img-shadow[src] HTML attribute — Polymer reflects src to an HTML
     *     attribute that IS accessible from an extension isolated world.
     *  2. inner <img>.src — populated by yt-img-shadow's IntersectionObserver
     *     once the element enters the viewport.
     *  3. Polymer .data / .__data JS property — last resort, blocked in MV3
     *     isolated worlds but caught silently; useful in page-world contexts.
     *
     * @param {Element} el
     * @param {{ isActive?: boolean }} options
     * @returns {string} URL or empty string
     */
    static getAvatarUrl(el, { isActive = false } = {}) {
        // ── Strategy 0: Page-world injected data (Polymer bypass) ────────────
        const pageWorldAvatar = el.getAttribute('data-ypp-avatar');
        if (pageWorldAvatar && !pageWorldAvatar.startsWith('data:') && pageWorldAvatar !== window.location.href) {
            return pageWorldAvatar;
        }

        // ── Strategy 1: yt-img-shadow[src] or yt-image[src] HTML attribute ───
        const ytImg = el.querySelector('yt-img-shadow, yt-image');
        const ytAttr = ytImg?.getAttribute('src');
        if (ytAttr && !ytAttr.startsWith('data:') && ytAttr !== window.location.href) {
            return ytAttr;
        }

        // ── Strategy 2: inner <img> src attribute/property ───────────────────
        const img = el.querySelector('img#img, yt-img-shadow img, yt-image img, img');
        const imgSrc = img?.getAttribute('src') || img?.src || '';
        if (imgSrc && !imgSrc.startsWith('data:') && imgSrc !== window.location.href) {
            return imgSrc;
        }

        // ── Strategy 3: Polymer .data property (page-world JS) ───────────────
        try {
            const d = el.data || el.__data;
            if (d) {
                const thumbs =
                    d.accountPhoto?.thumbnails ||
                    d.thumbnail?.thumbnails ||
                    d.photo?.thumbnails ||
                    d.thumbnails;
                if (Array.isArray(thumbs) && thumbs.length) {
                    const best = thumbs[thumbs.length - 1];
                    if (best?.url && !best.url.startsWith('data:')) return best.url;
                }
                if (d.accountPhoto?.url) return d.accountPhoto.url;
                if (d.thumbnail?.url)    return d.thumbnail.url;
            }
        } catch (_) { /* isolated-world property access denied */ }

        // ── Strategy 4 (active account only): header avatar button ───────────
        if (isActive) {
            const headerImg = document.querySelector(
                '#masthead #avatar-btn img,' +
                '#avatar-btn yt-img-shadow img,' +
                '#masthead ytd-topbar-menu-button-renderer img,' +
                '#masthead ytd-topbar-menu-button-renderer .yt-core-image'
            );
            const hSrc = headerImg?.getAttribute('src') || headerImg?.src || '';
            if (hSrc && !hSrc.startsWith('data:') && hSrc !== window.location.href) {
                return hSrc;
            }
        }

        return '';
    }

    /**
     * Extracts account data from the native YouTube menu DOM.
     * Returns { accounts, channelHref, currentTheme, currentLanguage, currentLocation, isRestricted, hasSwitchAccountBtn }
     * where accounts[0] is always the active account (if found).
     *
     * @param {Element} menu
     * @returns {Object}
     */
    static extractData(menu) {
        // ── Inject Page-World Script to bypass MV3 isolated world and grab Polymer data directly ──
        try {
            if (!document.getElementById('ypp-avatar-extractor')) {
                const script = document.createElement('script');
                script.id = 'ypp-avatar-extractor';
                script.src = chrome.runtime.getURL('src/inject/avatar-extractor.js');
                document.documentElement.appendChild(script);
            }
        } catch (_) {}

        const accounts = [];
        let activeName = '';

        // ── Active account (header section) ──────────────────────────────────
        const activeHeader = menu.querySelector(
            'ytd-active-account-header-renderer, ' +
            'ytd-simple-menu-header-renderer, ' +
            '#header-section, ' +
            '#header, ' +
            '[id*="account-header" i]'
        ) || menu.querySelector('#account-name')?.closest('div, ytd-active-account-header-renderer, ytd-simple-menu-header-renderer, ytd-account-section-list-renderer');

        if (activeHeader) {
            activeName = activeHeader.querySelector(
                '#account-name yt-formatted-string,' +
                '#account-name span,' +
                '#account-name,' +
                '#channel-title yt-formatted-string,' +
                '#channel-title,' +
                '#name'
            )?.textContent?.trim() || '';

            if (!activeName) {
                const nameEl = activeHeader.querySelector('yt-formatted-string, span, a');
                if (nameEl && !nameEl.textContent.includes('@')) {
                    activeName = nameEl.textContent.trim();
                }
            }

            const handle = activeHeader.querySelector(
                '#channel-handle, #account-email, #email'
            )?.textContent?.trim() || '';

            accounts.push({
                name: activeName || 'YouTube Account',
                handle,
                avatar: this.getAvatarUrl(activeHeader, { isActive: true }),
                isActive: true,
            });
        }

        // ── Channel link ──────────────────────────────────────────────────────
        const channelHref =
            menu.querySelector('#manage-account')?.href ||
            menu.querySelector('a[href*="/channel"]')?.href ||
            '/';

        // ── Switchable accounts ───────────────────────────────────────────────
        menu.querySelectorAll('ytd-account-item-renderer, ytd-account-item').forEach((item, nativeIndex) => {
            const nameEl = item.querySelector(
                '#account-name yt-formatted-string,' +
                '#account-name span,' +
                '#account-name,' +
                '#channel-title yt-formatted-string,' +
                '#channel-title,' +
                '#name'
            );
            const name = nameEl?.textContent?.trim() || '';
            if (!name) return;

            const handle = item.querySelector(
                '#account-email, #channel-handle'
            )?.textContent?.trim() || '';

            const isChecked = !!item.querySelector(
                'yt-icon[icon="checked"], [aria-checked="true"]'
            );
            const isActive = isChecked || (!!activeName && name === activeName);
            const avatar = this.getAvatarUrl(item, { isActive });

            const existing = accounts.find(a => a.name === name);
            if (existing) {
                existing.nativeIndex = nativeIndex;
                if (avatar && !existing.avatar) existing.avatar = avatar;
            } else {
                accounts.push({ name, handle, avatar, isActive, nativeIndex });
            }
        });

        // ── BULLETPROOF FALLBACK: Never return 0 accounts if this is the Account Menu! ──
        if (accounts.length === 0) {
            const mastheadAvatar = document.querySelector(
                '#masthead #avatar-btn img,' +
                '#avatar-btn yt-img-shadow img,' +
                '#masthead ytd-topbar-menu-button-renderer img,' +
                '#masthead ytd-topbar-menu-button-renderer .yt-core-image'
            );
            const fallbackAvatar = mastheadAvatar?.src || mastheadAvatar?.getAttribute('src') || '';
            const fallbackName =
                menu.querySelector('#account-name')?.textContent?.trim() ||
                document.querySelector('#masthead #account-name')?.textContent?.trim() ||
                'YouTube Account';
            const fallbackHandle =
                menu.querySelector('#channel-handle, #account-email, #email')?.textContent?.trim() || '';

            accounts.push({
                name: fallbackName,
                handle: fallbackHandle,
                avatar: fallbackAvatar,
                isActive: true,
            });
        }

        // ── Extract Preferences / Sub-menu secondary statuses ────────────────
        const getSecondaryText = (keywords) => {
            const items = Array.from(menu.querySelectorAll(
                'ytd-compact-link-renderer, ytd-menu-navigation-item-renderer, ytd-toggle-theme-compact-link-renderer'
            ));
            const target = items.find(el => {
                const text = (el.textContent || '').toLowerCase();
                const aria = (el.getAttribute('aria-label') || '').toLowerCase();
                return keywords.some(k => text.includes(k) || aria.includes(k));
            });
            if (!target) return '';
            const sec = target.querySelector('#secondary-text, .secondary-text, [class*="secondary-text"]');
            return sec ? sec.textContent.trim() : '';
        };

        const isDarkDom = document.documentElement.hasAttribute('dark') ||
                          document.documentElement.getAttribute('dark') === 'true';
        const themeLabel = getSecondaryText(['appearance', 'aspecto', 'apparence', 'design', 'wygląd']) ||
                           (isDarkDom ? 'Dark theme' : 'Light theme');

        const langLabel = getSecondaryText(['language', 'idioma', 'langue', 'sprache', 'język']) ||
                          (document.documentElement.lang || 'English').toUpperCase();

        const locLabel = getSecondaryText(['location', 'ubicación', 'lieu', 'standort', 'lokalizacja']) ||
                         (document.querySelector('#country-code')?.textContent?.trim() || 'Global');

        const restrictedLabel = getSecondaryText(['restricted', 'restringido', 'restreint', 'eingeschränkt']) || 'Off';
        const isRestricted = restrictedLabel.toLowerCase().includes('on') ||
                             restrictedLabel.toLowerCase().includes('activado') ||
                             restrictedLabel.toLowerCase().includes('activé');

        // Check if there is a native Switch Account button in this menu
        const hasSwitchAccountBtn = Array.from(menu.querySelectorAll('ytd-compact-link-renderer, ytd-menu-navigation-item-renderer'))
            .some(el => {
                const text = (el.textContent || '').toLowerCase();
                const icon = el.querySelector('yt-icon')?.getAttribute('icon') || '';
                return text.includes('switch') || text.includes('cambiar') || icon.includes('switch_account') || icon.includes('switch-account');
            });

        return {
            accounts,
            channelHref,
            currentTheme: themeLabel,
            currentLanguage: langLabel,
            currentLocation: locLabel,
            isRestricted,
            hasSwitchAccountBtn
        };
    }
};

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.AccountMenuData = AccountMenuData;
