import { resolveChannelIdentity, extractChannelFromContainer, channelHandleFromPathname } from '../../utils/channel-utils.js';
import { prefs } from '../../core/state-manager.js';
import { renderButtons, removeBadgeAnimated } from '../../ui/filter-ui-interactions.js';

const BLACKLIST_REASON = 'Blacklisted channel';

function channelListIncludes(channelPath, listStr) {
  if (!channelPath || !listStr) return false;
  const list = listStr.split('\\n').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (Array.isArray(channelPath)) {
    return channelPath.some(c => list.includes(c));
  }
  return list.includes(channelPath);
}

function isChannelListed(channel) {
  return channelListIncludes(channel, prefs.channelWhitelist);
}

export function isChannelExempt(channel) {
  return isChannelListed(channel) && !!prefs.channelWhitelistEnabled;
}

export function isChannelOnBlacklist(channel) {
  return channelListIncludes(channel, prefs.channelBlacklist);
}

export function isChannelBlacklisted(channel) {
  return isChannelOnBlacklist(channel) && !!prefs.channelBlacklistEnabled;
}

export function resolveChannelForElement(element) {
  return (
    extractChannelFromContainer(element) ||
    channelHandleFromPathname(window.location.pathname)
  );
}

export function channelIsPresent(ch) {
  return Array.isArray(ch) ? ch.length > 0 : !!ch;
}

export function applyFilter(element, reason, filterMode = 'hide') {
  if (!element) return;
  const ch = resolveChannelForElement(element);
  if (isChannelExempt(ch)) {
    if (!element.dataset.ytHiderPendingAction) {
      clearDimmedElement(element);
    }
    if (element.dataset.ytHiderHidden) {
      element.style.display = '';
      delete element.dataset.ytHiderHidden;
    }
    return;
  }
  if (filterMode === 'dim') {
    const badgeTarget = () =>
      element.querySelector('ytd-thumbnail') ||
      element.querySelector('yt-thumbnail-view-model') ||
      element.querySelector('ytm-thumbnail-cover-view-model') ||
      element;

    if (element.dataset.ytHiderDimmed) {
      const existingBadge = element.querySelector('.ypp-dim-badge, .yt-hider-badge');
      if (!existingBadge) {
        const target = badgeTarget();
        target.dataset.ytHiderBadgeTarget = '1';
        target.appendChild(createDimBadge(reason, ch));
        return;
      }
      if (existingBadge.dataset.ytHiderBadgeKind === 'blacklist') return;
      if (
        channelIsPresent(ch) &&
        !prefs.hideInterfaceElements &&
        !existingBadge.querySelector('.ypp-whitelist-btn, .yt-hider-whitelist-btn')
      ) {
        renderButtons(existingBadge, reason, ch);
      }
      return;
    }
    element.dataset.ytHiderDimmed = '1';
    const target = badgeTarget();
    target.dataset.ytHiderBadgeTarget = '1';
    target.appendChild(createDimBadge(reason, ch));
  } else {
    if (element.dataset.ytHiderHidden || element.dataset.ytHiderDimmed) return;
    element.dataset.ytHiderHidden = '1';
    element.style.display = 'none';
  }
}

export function createDimBadge(reason, channel) {
  const badge = document.createElement('div');
  badge.className = 'yt-hider-badge ypp-dim-badge';
  badge.innerHTML = reason ? `<span class="yt-hider-badge-reason">${reason}</span>` : '';

  if (reason === BLACKLIST_REASON) {
    badge.dataset.ytHiderBadgeKind = 'blacklist';
  }

  if (!prefs.hideInterfaceElements) {
     renderButtons(badge, reason, channel);
  }
  return badge;
}

export function clearDimmedElement(element) {
  if (!element || !element.dataset.ytHiderDimmed) return;
  delete element.dataset.ytHiderDimmed;
  
  element.querySelectorAll('.yt-hider-badge, .ypp-dim-badge').forEach(removeBadgeAnimated);
  element.querySelectorAll('[data-yt-hider-badge-target]').forEach(t => delete t.dataset.ytHiderBadgeTarget);
}

export function resetAppliedFilters(force) {
  document.querySelectorAll('[data-yt-hider-hidden]').forEach(el => {
    if (!force && el.dataset.ytHiderPendingAction) return;
    el.style.display = '';
    delete el.dataset.ytHiderHidden;
  });
  document.querySelectorAll('[data-yt-hider-dimmed]').forEach(el => {
    if (!force && el.dataset.ytHiderPendingAction) return;
    clearDimmedElement(el);
    delete el.dataset.ytHiderPendingAction;
  });
  document.querySelectorAll('.yt-hider-badge, .ypp-dim-badge').forEach(el => {
    if (!force && el.closest('[data-yt-hider-pending-action]')) return;
    el.remove();
  });
  document.querySelectorAll('[data-yt-hider-badge-target]').forEach(el => {
    if (!force && el.closest('[data-yt-hider-pending-action]')) return;
    delete el.dataset.ytHiderBadgeTarget;
  });
}

export function forceHide(element) {
  if (!element) return;
  if (element.dataset.ytHiderHidden) return;
  element.dataset.ytHiderHidden = '1';
  element.style.display = 'none';
}

window.YPP = window.YPP || {};
window.YPP.utils = window.YPP.utils || {};
window.YPP.utils.filterPrimitives = { applyFilter, resetAppliedFilters, clearDimmedElement, forceHide };
