import '../../../../core/system/base-feature.js';
/**
 * @fileoverview
 * InlineChannelButtons
 * 
 * Target: /watch route and channel pages.
 * Purpose: Injects "Whitelist" and "Blacklist" pill buttons next to the Subscribe button.
 * Mirrors the reference extension's channel-whitelist-button.js / channel-blacklist-button.js approach.
 * 
 * Placement: immediately after ytd-subscribe-button-renderer
 * Trigger: page:changed event + sharedObserver for subscribe button
 */
export class InlineChannelButtons extends window.YPP.features.BaseFeature {
    static featureId = 'inlineChannelButtons';
    static executionPhase = 'idle';
    static priority = 50;

    static INJECT_ID = 'ypp-inline-channel-btns';
    static SUBSCRIBE_SELECTOR = 'ytd-subscribe-button-renderer, yt-button-shape[subscribe-button-renderer]';
    static CHANNEL_OWNER_SELECTOR = '#channel-header ytd-subscribe-button-renderer, ytd-channel-sub-menu ytd-subscribe-button-renderer, #subscribe-button ytd-subscribe-button-renderer';

    constructor() {
        super('InlineChannelButtons');
        this._boundInject = this._tryInject.bind(this);
        this._injectDebounce = null;
    }

    getConfigKey() { return 'channelBlacklistEnabled'; } // only show if blacklist is used

    async enable() {
        await super.enable();

        // Initial inject
        this._scheduleInject();

        // Re-inject on SPA navigation
        this.onBusEvent('app:pageChange', () => {
            this._cleanup();
            this._scheduleInject();
        });

        // Also watch for subscribe button being added dynamically
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.register(
                'inline-channel-btns-observer',
                InlineChannelButtons.SUBSCRIBE_SELECTOR,
                () => this._scheduleInject(),
                true,
                false
            );
        }
    }

    async disable() {
        await super.disable();
        this._cleanup();
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('inline-channel-btns-observer');
        }
        clearTimeout(this._injectDebounce);
    }

    _scheduleInject() {
        clearTimeout(this._injectDebounce);
        this._injectDebounce = setTimeout(() => this._tryInject(), 600);
    }

    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        return path === '/watch' ||
               path.startsWith('/@') ||
               path.startsWith('/channel/') ||
               path.startsWith('/user/') ||
               path.startsWith('/c/');
    }

    _getChannelPath() {
        const path = window.location.pathname;
        // On watch page, parse from channel link
        if (path === '/watch') {
            const channelLink = document.querySelector(
                '#owner a.yt-simple-endpoint, ytd-channel-name a.yt-simple-endpoint, ' +
                '#channel-name a.yt-simple-endpoint, #top-row ytd-channel-name a'
            );
            if (channelLink) {
                const href = channelLink.getAttribute('href') || '';
                // Normalise to /@ form
                const m = href.match(/\/([@a-zA-Z0-9_.-]+)/);
                return m ? m[0].toLowerCase() : null;
            }
            return null;
        }
        // On channel pages use the current path directly
        return path.toLowerCase().replace(/\/$/, '');
    }

    _getChannelName() {
        const el = document.querySelector(
            '#channel-name .ytd-channel-name yt-formatted-string, ' +
            '#channel-header #channel-title, ' +
            '#channel-name #text, ' +
            'ytd-channel-name #text-container yt-formatted-string'
        );
        return el ? el.textContent.trim() : null;
    }

    _cleanup() {
        document.getElementById(InlineChannelButtons.INJECT_ID)?.remove();
    }

    _tryInject() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        if (document.getElementById(InlineChannelButtons.INJECT_ID)) return;

        const settings = this.settings || {};
        const hideControls = settings.hideOnPageControls;
        if (hideControls) return;

        // Find subscribe button as anchor point
        const subscribeBtn = document.querySelector(InlineChannelButtons.SUBSCRIBE_SELECTOR);
        if (!subscribeBtn) return;

        const channelPath = this._getChannelPath();
        if (!channelPath) return;

        const container = this._buildButtonContainer(channelPath, settings);
        container.id = InlineChannelButtons.INJECT_ID;

        // Insert after subscribe button
        subscribeBtn.insertAdjacentElement('afterend', container);
        this._updateButtonStates(container, channelPath, settings);
    }

    _buildButtonContainer(channelPath, settings) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin-left:8px;';

        // Whitelist button
        if (settings.channelWhitelistEnabled !== false) {
            const wlBtn = document.createElement('button');
            wlBtn.className = 'ypp-inline-btn ypp-inline-whitelist-btn';
            wlBtn.dataset.channel = channelPath;
            wlBtn.title = `Add this channel to your whitelist — their videos won't be filtered (Shorts are always filtered).`;
            wlBtn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                this._toggleWhitelist(channelPath);
                setTimeout(() => this._updateButtonStates(wrap, channelPath, this.settings || {}), 100);
            });
            wrap.appendChild(wlBtn);
        }

        // Blacklist button
        if (settings.channelBlacklistEnabled !== false) {
            const blBtn = document.createElement('button');
            blBtn.className = 'ypp-inline-btn ypp-inline-blacklist-btn';
            blBtn.dataset.channel = channelPath;
            blBtn.title = `Add this channel to your blacklist — their videos will always be hidden everywhere.`;
            blBtn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                this._toggleBlacklist(channelPath);
                setTimeout(() => this._updateButtonStates(wrap, channelPath, this.settings || {}), 100);
            });
            wrap.appendChild(blBtn);
        }

        return wrap;
    }

    _updateButtonStates(container, channelPath, settings) {
        const wlChannels = this._parseChannelList(settings.channelWhitelist || '');
        const blChannels = this._parseChannelList(settings.channelBlacklist || '');
        const isWhitelisted = wlChannels.has(channelPath);
        const isBlacklisted = blChannels.has(channelPath);

        const wlBtn = container.querySelector('.ypp-inline-whitelist-btn');
        if (wlBtn) {
            wlBtn.textContent = isWhitelisted ? '✓ Whitelisted' : 'Whitelist';
            wlBtn.classList.toggle('ypp-inline-btn--active', isWhitelisted);
        }

        const blBtn = container.querySelector('.ypp-inline-blacklist-btn');
        if (blBtn) {
            blBtn.textContent = isBlacklisted ? '✗ Blacklisted' : 'Blacklist';
            blBtn.classList.toggle('ypp-inline-btn--danger', isBlacklisted);
        }
    }

    _parseChannelList(text) {
        const set = new Set();
        if (typeof text !== 'string') return set;
        text.split('\n').forEach(c => {
            const t = c.trim().toLowerCase();
            if (!t) return;
            if (t.startsWith('@')) set.add('/' + t);
            else if (t.startsWith('youtube.com/')) set.add('/' + t.split('youtube.com/')[1]);
            else set.add('/@' + t);
        });
        return set;
    }

    _toggleWhitelist(channelPath) {
        const settings = this.settings || {};
        const wlChannels = this._parseChannelList(settings.channelWhitelist || '');
        const blChannels = this._parseChannelList(settings.channelBlacklist || '');

        if (wlChannels.has(channelPath)) {
            // Remove from whitelist
            const newList = (settings.channelWhitelist || '').split('\n')
                .filter(c => c.trim().toLowerCase() !== channelPath && c.trim().toLowerCase() !== channelPath.replace(/^\//, ''))
                .join('\n');
            window.YPP.utils?.settings?.set('channelWhitelist', newList);
        } else {
            // Remove from blacklist first (can't be on both)
            if (blChannels.has(channelPath)) {
                const newBl = (settings.channelBlacklist || '').split('\n')
                    .filter(c => c.trim().toLowerCase() !== channelPath)
                    .join('\n');
                window.YPP.utils?.settings?.set('channelBlacklist', newBl);
            }
            // Add to whitelist
            const newList = ((settings.channelWhitelist || '') + '\n' + channelPath).trim();
            window.YPP.utils?.settings?.set('channelWhitelist', newList);
            if (!settings.channelWhitelistEnabled) {
                window.YPP.utils?.settings?.set('channelWhitelistEnabled', true);
            }
        }
    }

    _toggleBlacklist(channelPath) {
        const settings = this.settings || {};
        const blChannels = this._parseChannelList(settings.channelBlacklist || '');
        const wlChannels = this._parseChannelList(settings.channelWhitelist || '');

        if (blChannels.has(channelPath)) {
            // Remove from blacklist
            const newList = (settings.channelBlacklist || '').split('\n')
                .filter(c => c.trim().toLowerCase() !== channelPath)
                .join('\n');
            window.YPP.utils?.settings?.set('channelBlacklist', newList);
        } else {
            // Remove from whitelist first
            if (wlChannels.has(channelPath)) {
                const newWl = (settings.channelWhitelist || '').split('\n')
                    .filter(c => c.trim().toLowerCase() !== channelPath)
                    .join('\n');
                window.YPP.utils?.settings?.set('channelWhitelist', newWl);
            }
            // Add to blacklist
            const newList = ((settings.channelBlacklist || '') + '\n' + channelPath).trim();
            window.YPP.utils?.settings?.set('channelBlacklist', newList);
            if (!settings.channelBlacklistEnabled) {
                window.YPP.utils?.settings?.set('channelBlacklistEnabled', true);
            }
        }
    }
}
