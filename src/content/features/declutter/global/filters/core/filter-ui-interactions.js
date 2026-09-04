// Advanced UI interactions for YouTube filtering
// Provides Dim badges, Hover Pills, and Undo buttons.

const UNDO_WINDOW_MS = 3000;
const UNDO_COUNTDOWN_RADIUS = 8;
const UNDO_COUNTDOWN_CIRCUMFERENCE = 2 * Math.PI * UNDO_COUNTDOWN_RADIUS;

function buildUndoCountdownMarkup(seconds) {
  return `<svg class="yt-hider-undo-countdown" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="${UNDO_COUNTDOWN_RADIUS}" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"></circle>
    <circle class="yt-hider-undo-countdown-ring" cx="10" cy="10" r="${UNDO_COUNTDOWN_RADIUS}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="${UNDO_COUNTDOWN_CIRCUMFERENCE}" transform="rotate(-90 10 10)"></circle>
    <text class="yt-hider-undo-countdown-number" x="10" y="10" text-anchor="middle" dominant-baseline="central">${seconds}</text>
  </svg>`;
}

function startUndoCountdown(btn, onComplete) {
  const ring = btn.querySelector('.yt-hider-undo-countdown-ring');
  if (ring) {
    ring.style.setProperty('--yt-hider-countdown-circumference', UNDO_COUNTDOWN_CIRCUMFERENCE);
    ring.style.animation = `yt-hider-undo-countdown ${UNDO_WINDOW_MS}ms linear forwards`;
  }
  const deadline = Date.now() + UNDO_WINDOW_MS;
  const timer = setInterval(() => {
    const remainingMs = deadline - Date.now();
    const numberEl = btn.querySelector('.yt-hider-undo-countdown-number');
    if (numberEl) numberEl.textContent = Math.max(0, Math.ceil(remainingMs / 1000));
    if (remainingMs <= 0) {
      clearInterval(timer);
      onComplete();
    }
  }, 250);
  return () => clearInterval(timer);
}

function removeBadgeAnimated(badge) {
    if (!badge || !badge.isConnected) return;
    badge.classList.add('ypp-badge-leaving');
    const onAnimationEnd = e => {
      if (e.target !== badge) return;
      badge.removeEventListener('animationend', onAnimationEnd);
      badge.remove();
    };
    badge.addEventListener('animationend', onAnimationEnd);
    setTimeout(() => badge.remove(), 200);
}

function getOrCreateBadgeButtonRow(badge) {
    let row = badge.querySelector('.ypp-badge-buttons');
    if (!row) {
        row = document.createElement('div');
        row.className = 'ypp-badge-buttons';
        badge.appendChild(row);
    }
    return row;
}

function createWhitelistButton(channelPath) {
    const btn = document.createElement('button');
    btn.className = 'ypp-whitelist-btn';
    
    let cancelCountdown = null;
    let pendingContainer = null;
  
    const renderIdle = () => {
      btn.classList.remove('ypp-whitelist-btn-pending');
      btn.innerHTML = `<span class="ypp-whitelist-label">Whitelist</span>`;
    };
    renderIdle();
  
    const cancelPending = () => {
      if (cancelCountdown) {
        cancelCountdown();
        cancelCountdown = null;
      }
      if (pendingContainer) {
        delete pendingContainer.dataset.yppPendingAction;
        pendingContainer = null;
      }
    };
  
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
  
      if (btn.classList.contains('ypp-whitelist-btn-pending')) {
        cancelPending();
        renderIdle();
        return;
      }
      
      pendingContainer = btn.closest('[data-ypp-dimmed]');
      if (pendingContainer) pendingContainer.dataset.yppPendingAction = '1';
  
      btn.innerHTML = `<span class="ypp-whitelist-label">Undo</span>${buildUndoCountdownMarkup(3)}`;
      btn.classList.add('ypp-whitelist-btn-pending');
  
      cancelCountdown = startUndoCountdown(btn, () => {
        cancelCountdown = null;
        if (pendingContainer) {
            delete pendingContainer.dataset.yppPendingAction;
            // Actually whitelist the channel
            const wl = window.YPP.features.ChannelWhitelist;
            if (wl) {
                let current = wl._settings.channelWhitelist || '';
                current += '\n' + channelPath;
                window.YPP.utils.settings.set('channelWhitelist', current);
                // Also enable it if it's off
                if (!wl._settings.channelWhitelistEnabled) {
                    window.YPP.utils.settings.set('channelWhitelistEnabled', true);
                }
            }
            window.YPP.features.BaseFilterFeature.clearDimmedElement(pendingContainer);
            pendingContainer = null;
        }
      });
    });
  
    return btn;
}

function createUnblacklistButton(channelPath) {
    const btn = document.createElement('button');
    btn.className = 'ypp-blacklist-btn';
    btn.innerHTML = `<span class="ypp-whitelist-label">Unblacklist</span>`;
  
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const bl = window.YPP.features.ChannelBlacklist;
      if (bl) {
          let current = bl._settings.channelBlacklist || '';
          current = current.split('\n').filter(c => c.trim().toLowerCase() !== channelPath).join('\n');
          window.YPP.utils.settings.set('channelBlacklist', current);
      }
      const container = btn.closest('[data-ypp-dimmed]');
      if (container) {
          window.YPP.features.BaseFilterFeature.clearDimmedElement(container);
      }
    });
  
    return btn;
}

export function createDimBadge(reason, channelPath) {
    const badge = document.createElement('div');
    badge.className = 'ypp-dim-badge';
    badge.innerHTML = reason ? `<span class="ypp-badge-reason">${reason}</span>` : '';
  
    if (reason === 'Blacklisted channel' || reason === 'blacklist') {
      badge.dataset.yppBadgeKind = 'blacklist';
      if (channelPath) {
          getOrCreateBadgeButtonRow(badge).appendChild(createUnblacklistButton(channelPath));
      }
      return badge;
    }
  
    if (channelPath) {
      getOrCreateBadgeButtonRow(badge).appendChild(createWhitelistButton(channelPath));
    }
    return badge;
}

export function applyDimMode(element, reason, channelPathRaw) {
    if (element.dataset.yppDimmed) return;
    
    // For collaboration videos, use the primary channel for the badge UI
    const channelPath = Array.isArray(channelPathRaw) ? channelPathRaw[0] : channelPathRaw;

    const badgeTarget = element.querySelector('#dismissible') || 
                        element.querySelector('ytd-thumbnail') || 
                        element.querySelector('ytm-thumbnail-cover-view-model') || 
                        element;
    
    element.dataset.yppDimmed = '1';
    badgeTarget.dataset.yppBadgeTarget = '1';
    badgeTarget.appendChild(createDimBadge(reason, channelPath));
}

// Attach hover preview blocker so that dimmed cards don't trigger YouTube's hover preview
// Uses capture phase on BOTH mouseover and mouseenter to stop propagation before YouTube sees it.
const _blockHoverPreview = (e) => {
    if (!e.target || !e.target.closest) return;
    if (e.target.closest('[data-ypp-dimmed]')) {
        e.stopPropagation();
    }
};
document.addEventListener('mouseover', _blockHoverPreview, true);
document.addEventListener('mouseenter', _blockHoverPreview, true);

// --- Hover Pill ---
let hoverPillEl = null;
let hoverPillContainer = null;
let hoverPillAnchor = null;
let hoverPillBtn = null;
let hoverPillPending = false;
let lastMouseClientX = 0;
let lastMouseClientY = 0;
let hoverPillWatchdog = null;
let hoverPillFrame = null;
let hoverPillScrolling = false;
let hoverPillScrollIdleTimer = null;

const HOVER_PILL_TOP_OFFSET = 14;
const HOVER_PILL_SCROLL_IDLE_MS = 100;

function trackMouseForHoverPillWatchdog(e) {
  lastMouseClientX = e.clientX;
  lastMouseClientY = e.clientY;
}

function getHoverPillViewportTop() {
  const bar = document.querySelector('ytd-masthead, ytm-mobile-topbar-renderer');
  if (!bar) return 0;
  const rect = bar.getBoundingClientRect();
  if (rect.top > 0 || rect.bottom <= 0) return 0;
  return rect.bottom;
}

function setHoverPillHidden(hidden) {
  if (!hoverPillEl) return;
  if (hidden) {
      hoverPillEl.style.opacity = '0';
      hoverPillEl.style.visibility = 'hidden';
      hoverPillEl.style.transition = 'none';
  } else {
      hoverPillEl.style.opacity = '';
      hoverPillEl.style.visibility = '';
      hoverPillEl.style.transition = '';
  }
}

function positionHoverPill() {
  if (!hoverPillEl || !hoverPillAnchor) return;
  if (!hoverPillAnchor.isConnected) {
    removeBlacklistHoverButton();
    return;
  }
  const rect = hoverPillAnchor.getBoundingClientRect();
  const top = rect.top + HOVER_PILL_TOP_OFFSET;

  if (top < getHoverPillViewportTop() || top > window.innerHeight) {
    setHoverPillHidden(true);
    return;
  }

  setHoverPillHidden(false);
  hoverPillEl.style.left = rect.left + rect.width / 2 + 'px';
  hoverPillEl.style.top = top + 'px';
  hoverPillEl.style.maxWidth = Math.max(24, rect.width - 12) + 'px';
}

function schedulePositionHoverPill() {
  if (hoverPillFrame) return;
  hoverPillFrame = requestAnimationFrame(() => {
    hoverPillFrame = null;
    positionHoverPill();
  });
}

function onHoverPillScroll() {
  hoverPillScrolling = true;
  if (hoverPillScrollIdleTimer) clearTimeout(hoverPillScrollIdleTimer);
  hoverPillScrollIdleTimer = setTimeout(onHoverPillScrollIdle, HOVER_PILL_SCROLL_IDLE_MS);
  if (!hoverPillEl) return;
  if (hoverPillPending) {
    setHoverPillHidden(true);
    return;
  }
  clearBlacklistHoverButton();
}

function onHoverPillScrollIdle() {
  hoverPillScrollIdleTimer = null;
  hoverPillScrolling = false;
  if (hoverPillPending) {
    positionHoverPill();
    return;
  }
  if (hoverPillEl) return;

  const stack = document.elementsFromPoint(lastMouseClientX, lastMouseClientY);
  for (const el of stack) {
    handleBlacklistHoverOver({ target: el });
    if (hoverPillEl) return;
  }
}

function startHoverPillWatchdog() {
  if (hoverPillWatchdog) return;
  hoverPillWatchdog = setInterval(() => {
    positionHoverPill();
    if (!hoverPillContainer || hoverPillPending) return;
    const rect = hoverPillContainer.getBoundingClientRect();
    const stillInside =
      lastMouseClientX >= rect.left &&
      lastMouseClientX <= rect.right &&
      lastMouseClientY >= rect.top &&
      lastMouseClientY <= rect.bottom;
    if (!stillInside) clearBlacklistHoverButton();
  }, 400);
}

function stopHoverPillWatchdog() {
  if (hoverPillWatchdog) {
    clearInterval(hoverPillWatchdog);
    hoverPillWatchdog = null;
  }
}

function clearBlacklistHoverButton() {
  stopHoverPillWatchdog();
  if (hoverPillEl) {
      // Instantly remove to avoid scroll stutter/leftover pill
      hoverPillEl.remove();
  }
  hoverPillEl = null;
  hoverPillContainer = null;
  hoverPillAnchor = null;
  hoverPillBtn = null;
}

function removeBlacklistHoverButton() {
  hoverPillPending = false;
  clearBlacklistHoverButton();
}

function createHoverBlacklistButton(channelPath) {
    const btn = document.createElement('button');
    btn.className = 'ypp-blacklist-btn ypp-blacklist-btn--solid';
    
    let cancelCountdown = null;
  
    const renderIdle = () => {
      btn.classList.remove('ypp-blacklist-btn-pending');
      btn.innerHTML = `<span class="ypp-whitelist-label">Blacklist</span>`;
    };
    renderIdle();
  
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
  
      if (btn.classList.contains('ypp-blacklist-btn-pending')) {
        if (cancelCountdown) {
            cancelCountdown();
            cancelCountdown = null;
        }
        hoverPillPending = false;
        renderIdle();
        return;
      }
      
      hoverPillPending = true;
      btn.innerHTML = `<span class="ypp-whitelist-label">Undo</span>${buildUndoCountdownMarkup(3)}`;
      btn.classList.add('ypp-blacklist-btn-pending');
  
      cancelCountdown = startUndoCountdown(btn, () => {
        cancelCountdown = null;
        
        // Actually blacklist the channel
        const bl = window.YPP.features.ChannelBlacklist;
        if (bl) {
            let current = bl._settings.channelBlacklist || '';
            current += '\n' + channelPath;
            window.YPP.utils.settings.set('channelBlacklist', current);
            // Also enable it if it's off
            if (!bl._settings.channelBlacklistEnabled) {
                window.YPP.utils.settings.set('channelBlacklistEnabled', true);
            }
        }
        hoverPillPending = false;
        clearBlacklistHoverButton();
      });
    });
  
    return btn;
}

function showBlacklistHoverButton(container, channelPath, quick = false) {
  if (hoverPillPending) return;
  if (hoverPillContainer === container && hoverPillEl) return;
  clearBlacklistHoverButton();

  const anchor = container.querySelector('ytd-thumbnail') || 
                 container.querySelector('yt-thumbnail-view-model') || 
                 container.querySelector('ytm-thumbnail-cover-view-model') || 
                 container;

  const wrapper = document.createElement('div');
  wrapper.className = 'ypp-blacklist-hover-wrapper';
  wrapper.style.position = 'fixed';
  wrapper.style.transform = 'translateX(-50%)';
  wrapper.style.zIndex = '2000';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.width = 'max-content';
  
  if (quick) {
      wrapper.style.animation = 'ypp-badge-in-quick 90ms ease-out';
  } else {
      wrapper.style.animation = 'ypp-badge-in 180ms ease-out';
  }

  const btn = createHoverBlacklistButton(channelPath);
  wrapper.appendChild(btn);
  document.body.appendChild(wrapper);

  hoverPillEl = wrapper;
  hoverPillContainer = container;
  hoverPillAnchor = anchor;
  hoverPillBtn = btn;
  positionHoverPill();
  startHoverPillWatchdog();
}

function handleBlacklistHoverOver(e) {
  if (hoverPillScrolling) return;
  
  if (hoverPillPending) {
    if (hoverPillContainer && !hoverPillContainer.isConnected) {
      hoverPillPending = false;
      clearBlacklistHoverButton();
    } else {
      return;
    }
  }
  
  // Check via the feature instance (window.YPP.settings doesn't exist as a global)
  const blFeature = window.YPP?.features?.ChannelBlacklist || window.YPP?.featureManager?.getFeature?.('channelBlacklist');
  if (!blFeature?.isEnabled) return;
  // Respect the "hide on-page controls" setting
  const hideControls = window.YPP?.featureManager?.getSettings?.()?.hideOnPageControls;
  if (hideControls) return;
  if (!e.target || !e.target.closest) return;

  const container = e.target.closest('ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-lockup-view-model');
  if (!container) return;
  // Don't show pill on cards already filtered (hidden or dimmed)
  if (container.dataset.yppDimmed || container.classList.contains('ypp-hidden') || container.dataset.yppBlocked) return;

  if (hoverPillContainer === container && hoverPillEl) return;

  const parsers = window.YPP.Utils?.youtubeParsers;
  const channelPathRaw = parsers ? parsers.extractChannelFromContainer(container) : null;
  if (!channelPathRaw) return;
  
  const channelPath = Array.isArray(channelPathRaw) ? channelPathRaw[0] : channelPathRaw;

  // pass quick=true if we're rendering it right after scroll (no animation or fast animation)
  showBlacklistHoverButton(container, channelPath, !!e.isFromScrollIdle);
}

function handleBlacklistHoverOut(e) {
  if (hoverPillPending || !hoverPillContainer) return;
  if (!e.target || !hoverPillContainer.contains(e.target)) return;

  const related = e.relatedTarget;
  if (related && hoverPillContainer.contains(related)) return;

  const rect = hoverPillContainer.getBoundingClientRect();
  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    return;
  }
  clearBlacklistHoverButton();
}

let blacklistHoverListenerAttached = false;
if (!blacklistHoverListenerAttached) {
  blacklistHoverListenerAttached = true;
  document.addEventListener('mouseover', handleBlacklistHoverOver, true);
  document.addEventListener('mouseout', handleBlacklistHoverOut, true);
  document.addEventListener('mousemove', trackMouseForHoverPillWatchdog, true);
  document.addEventListener('scroll', onHoverPillScroll, true);
  window.addEventListener('resize', schedulePositionHoverPill);
}

window.YPP.utils = window.YPP.utils || {};
window.YPP.utils.filterUI = { applyDimMode, createDimBadge, removeBadgeAnimated };
