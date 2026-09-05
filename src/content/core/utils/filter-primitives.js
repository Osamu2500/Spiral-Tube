window.YPP = window.YPP || {};
window.YPP.utils = window.YPP.utils || {};

class FilterPrimitives {
    /**
     * Resolves the channel, checks whitelist, and applies the action (hide or dim).
     * @param {Element} element The element to hide or dim
     * @param {string} action 'hide' or 'dim'
     * @param {string} reason The reason string
     * @param {string} [channelPath] Optional pre-extracted channel path, otherwise we try to extract it
     */
    static applyFilter(element, action, reason, channelPath = null) {
        if (!element || !element.isConnected) return;
        if (element.dataset.yppUndoOverride === 'true') return;
        
        // 1. Resolve owning channel if not provided
        if (!channelPath && window.YPP.Utils?.youtubeParsers?.extractChannelFromContainer) {
            const channelResult = window.YPP.Utils.youtubeParsers.extractChannelFromContainer(element);
            if (Array.isArray(channelResult)) channelPath = channelResult[0];
            else channelPath = channelResult;
        }

        // 2. Whitelist Exemption Check (Must happen INSIDE this function)
        const whitelist = window.YPP.FeatureManager?.getFeature('channelWhitelist');
        if (whitelist?.isEnabled && channelPath) {
            const raw = whitelist._settings?.channelWhitelist || '';
            const list = Array.isArray(raw) 
                ? raw 
                : raw.split(/[\n,]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
            const normalized = channelPath.toLowerCase();
            const isExempt = list.some(entry => normalized === entry || normalized.endsWith('/' + entry.replace(/^\/@?/, '')));
            
            const blacklist = window.YPP.FeatureManager?.getFeature('channelBlacklist');
            let isBlacklisted = false;
            if (blacklist?.isEnabled) {
                const bList = Array.from(blacklist._channels || []);
                isBlacklisted = bList.some(entry => normalized === entry || normalized.endsWith('/' + entry.replace(/^\/@?/, '')));
            }

            if (isExempt && !isBlacklisted) {
                FilterPrimitives._clearState(element);
                return;
            }
        }

        // 3. Apply mode (idempotent)
        if (action === 'hide') {
            if (!element.dataset.yppHidden) {
                FilterPrimitives._clearDim(element);
                element.dataset.yppHidden = '1';
                if (reason) element.dataset.yppHiddenReason = reason;
                element.style.setProperty('display', 'none', 'important');
                
                // Keep dual-write for now during migration
                element.classList.add('ypp-hidden', 'ypp-hidden-by-pipeline');
                
                try { window.YPP.events?.emit('filter:warning:record', { hidden: 1, total: 1 }); } catch (_) {}
            }
        } else if (action === 'dim') {
            if (!element.dataset.yppDimmed) {
                // Ensure hidden is cleared if we are dimming instead
                if (element.dataset.yppHidden) {
                    delete element.dataset.yppHidden;
                    delete element.dataset.yppHiddenReason;
                    element.style.removeProperty('display');
                    element.classList.remove('ypp-hidden', 'ypp-hidden-by-pipeline');
                }

                element.dataset.yppDimmed = '1';
                
                // 1. Locate badge target
                const badgeTarget = element.querySelector('#dismissible') || 
                                    element.querySelector('ytd-thumbnail') || 
                                    element.querySelector('ytm-thumbnail-cover-view-model') || 
                                    element;
                                    
                // 2. Create the badge natively
                badgeTarget.dataset.yppBadgeTarget = '1';
                const badge = document.createElement('div');
                badge.className = 'ypp-dim-badge';
                if (reason) badge.innerHTML = `<span class="ypp-badge-reason">${reason}</span>`;
                
                // Attach channel context if available
                if (channelPath) badge.dataset.yppChannelPath = channelPath;
                if (reason === 'Blacklisted channel' || reason === 'blacklist') {
                    badge.dataset.yppBadgeKind = 'blacklist';
                }
                
                // Clicking the badge undoes the filter temporarily
                badge.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    element.dataset.yppUndoOverride = 'true';
                    FilterPrimitives._clearState(element);
                });
                
                badgeTarget.appendChild(badge);
                
                // 3. Delegate complex interactive UI (Whitelist/Undo timers) to the UI module
                if (window.YPP.utils?.filterUI?.renderButtons) {
                    window.YPP.utils.filterUI.renderButtons(badge, reason, channelPath);
                }
                
                try { window.YPP.events?.emit('filter:warning:record', { hidden: 1, total: 1 }); } catch (_) {}
            } else {
                // If already dimmed, ensure buttons are attached (e.g. if badge was rendered before buttons were ready)
                if (window.YPP.utils?.filterUI?.renderButtons) {
                    const existingBadge = element.querySelector('.ypp-dim-badge');
                    if (existingBadge && !existingBadge.querySelector('.ypp-badge-buttons')) {
                        window.YPP.utils.filterUI.renderButtons(existingBadge, reason, channelPath);
                    }
                }
            }
        }
    }

    /**
     * Unconditional hide for UI chrome (no whitelist check, no channel extraction).
     */
    static forceHide(element, reason = '') {
        if (!element || !element.isConnected) return;
        if (!element.dataset.yppHidden) {
            FilterPrimitives._clearDim(element);
            element.dataset.yppHidden = '1';
            if (reason) element.dataset.yppHiddenReason = reason;
            element.style.setProperty('display', 'none', 'important');
            
            // Dual write for backward compatibility during migration
            element.classList.add('ypp-hidden', 'ypp-hidden-by-pipeline');
        }
    }

    /**
     * Cleans up all applied filters across the DOM.
     * @param {boolean} force If true, forces cleanup even for elements mid-undo.
     */
    static resetAppliedFilters(force = false) {
        // Query hidden
        document.querySelectorAll('[data-ypp-hidden]').forEach(el => {
            if (!force && el.dataset.yppPendingAction) return; // Skip if mid-undo
            delete el.dataset.yppHidden;
            delete el.dataset.yppHiddenReason;
            delete el.dataset.yppHiddenBy;
            el.style.removeProperty('display');
            el.classList.remove('ypp-hidden', 'ypp-hidden-by-pipeline');
        });

        // Query dimmed
        document.querySelectorAll('[data-ypp-dimmed]').forEach(el => {
            if (!force && el.dataset.yppPendingAction) return;
            FilterPrimitives._clearDim(el);
        });

        // Clean orphaned badge targets
        document.querySelectorAll('[data-ypp-badge-target]').forEach(el => {
            delete el.dataset.yppBadgeTarget;
        });
    }

    static _clearState(el) {
        delete el.dataset.yppHidden;
        delete el.dataset.yppHiddenReason;
        delete el.dataset.yppHiddenBy;
        el.style.removeProperty('display');
        el.classList.remove('ypp-hidden', 'ypp-hidden-by-pipeline');
        FilterPrimitives._clearDim(el);
    }

    static _clearDim(el) {
        if (el.dataset.yppDimmed) {
            delete el.dataset.yppDimmed;
            if (window.YPP.utils?.filterUI?.removeBadgeAnimated) {
                el.querySelectorAll('.ypp-dim-badge').forEach(window.YPP.utils.filterUI.removeBadgeAnimated);
            } else {
                el.querySelectorAll('.ypp-dim-badge').forEach(b => b.remove());
            }
        }
        delete el.dataset.yppDimBy;
        el.querySelectorAll('[data-ypp-badge-target]').forEach(t => delete t.dataset.yppBadgeTarget);
        if (el.dataset.yppBadgeTarget) delete el.dataset.yppBadgeTarget;
    }
}

window.YPP.utils.filterPrimitives = FilterPrimitives;
