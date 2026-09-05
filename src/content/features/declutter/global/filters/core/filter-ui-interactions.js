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

class FilterUIManager {
    static removeBadgeAnimated(badge) {
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

    static getOrCreateBadgeButtonRow(badge) {
        let row = badge.querySelector('.ypp-badge-buttons');
        if (!row) {
            row = document.createElement('div');
            row.className = 'ypp-badge-buttons';
            badge.appendChild(row);
        }
        return row;
    }

    static createWhitelistButton(channelPath) {
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
                const wl = window.YPP.features.ChannelWhitelist;
                if (wl) {
                    let current = wl._settings.channelWhitelist || '';
                    current += '\n' + channelPath;
                    window.YPP.utils.settings.set('channelWhitelist', current);
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

    static createUnblacklistButton(channelPath) {
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

    static renderButtons(badgeNode, reason, channelPathRaw) {
        if (!badgeNode || !badgeNode.isConnected) return;
        const channelPath = Array.isArray(channelPathRaw) ? channelPathRaw[0] : channelPathRaw;

        if (reason === 'Blacklisted channel' || reason === 'blacklist') {
            if (channelPath) {
                this.getOrCreateBadgeButtonRow(badgeNode).appendChild(this.createUnblacklistButton(channelPath));
            }
            return;
        }

        if (channelPath) {
            this.getOrCreateBadgeButtonRow(badgeNode).appendChild(this.createWhitelistButton(channelPath));
        }
    }
}

class HoverPillManager {
    static instance = new HoverPillManager();
    
    constructor() {
        this.el = null;
        this.container = null;
        this.anchor = null;
        this.btn = null;
        this.pending = false;
        
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        this.watchdog = null;
        this.frame = null;
        
        this.scrolling = false;
        this.scrollIdleTimer = null;
        
        this.TOP_OFFSET = 14;
        this.SCROLL_IDLE_MS = 100;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this._blockHoverPreview = this.blockHoverPreview.bind(this);
        document.addEventListener('mouseover', this._blockHoverPreview, true);
        document.addEventListener('mouseenter', this._blockHoverPreview, true);
        
        this._handleHoverOver = this.handleHoverOver.bind(this);
        this._handleHoverOut = this.handleHoverOut.bind(this);
        this._trackMouse = this.trackMouse.bind(this);
        this._onScroll = this.onScroll.bind(this);
        this._schedulePosition = this.schedulePosition.bind(this);
        
        document.addEventListener('mouseover', this._handleHoverOver, true);
        document.addEventListener('mouseout', this._handleHoverOut, true);
        document.addEventListener('mousemove', this._trackMouse, true);
        document.addEventListener('scroll', this._onScroll, true);
        window.addEventListener('resize', this._schedulePosition);
    }
    
    blockHoverPreview(e) {
        if (!e.target || !e.target.closest) return;
        if (e.target.closest('[data-ypp-dimmed]')) {
            e.stopPropagation();
        }
    }
    
    trackMouse(e) {
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }
    
    getViewportTop() {
        const bar = document.querySelector('ytd-masthead, ytm-mobile-topbar-renderer');
        if (!bar) return 0;
        const rect = bar.getBoundingClientRect();
        if (rect.top > 0 || rect.bottom <= 0) return 0;
        return rect.bottom;
    }
    
    setHidden(hidden) {
        if (!this.el) return;
        if (hidden) {
            this.el.style.opacity = '0';
            this.el.style.visibility = 'hidden';
            this.el.style.transition = 'none';
        } else {
            this.el.style.opacity = '';
            this.el.style.visibility = '';
            this.el.style.transition = '';
        }
    }
    
    position() {
        if (!this.el || !this.anchor) return;
        if (!this.anchor.isConnected) {
            this.removeButton();
            return;
        }
        const rect = this.anchor.getBoundingClientRect();
        const top = rect.top + this.TOP_OFFSET;
    
        if (top < this.getViewportTop() || top > window.innerHeight) {
            this.setHidden(true);
            return;
        }
    
        this.setHidden(false);
        this.el.style.left = rect.left + rect.width / 2 + 'px';
        this.el.style.top = top + 'px';
        this.el.style.maxWidth = Math.max(24, rect.width - 12) + 'px';
    }
    
    schedulePosition() {
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => {
            this.frame = null;
            this.position();
        });
    }
    
    onScroll() {
        this.scrolling = true;
        if (this.scrollIdleTimer) clearTimeout(this.scrollIdleTimer);
        this.scrollIdleTimer = setTimeout(() => this.onScrollIdle(), this.SCROLL_IDLE_MS);
        if (!this.el) return;
        if (this.pending) {
            this.setHidden(true);
            return;
        }
        this.clearButton();
    }
    
    onScrollIdle() {
        this.scrollIdleTimer = null;
        this.scrolling = false;
        if (this.pending) {
            this.position();
            return;
        }
        if (this.el) return;
    
        const stack = document.elementsFromPoint(this.lastMouseX, this.lastMouseY);
        for (const element of stack) {
            this.handleHoverOver({ target: element });
            if (this.el) return;
        }
    }
    
    startWatchdog() {
        if (this.watchdog) return;
        this.watchdog = setInterval(() => {
            this.position();
            if (!this.container || this.pending) return;
            const rect = this.container.getBoundingClientRect();
            const stillInside =
                this.lastMouseX >= rect.left &&
                this.lastMouseX <= rect.right &&
                this.lastMouseY >= rect.top &&
                this.lastMouseY <= rect.bottom;
            if (!stillInside) this.clearButton();
        }, 400);
    }
    
    stopWatchdog() {
        if (this.watchdog) {
            clearInterval(this.watchdog);
            this.watchdog = null;
        }
    }
    
    clearButton() {
        this.stopWatchdog();
        if (this.el) {
            this.el.remove();
        }
        this.el = null;
        this.container = null;
        this.anchor = null;
        this.btn = null;
    }
    
    removeButton() {
        this.pending = false;
        this.clearButton();
    }
    
    createHoverButton(channelPath) {
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
            this.pending = false;
            renderIdle();
            return;
          }
          
          this.pending = true;
          btn.innerHTML = `<span class="ypp-whitelist-label">Undo</span>${buildUndoCountdownMarkup(3)}`;
          btn.classList.add('ypp-blacklist-btn-pending');
      
          cancelCountdown = startUndoCountdown(btn, () => {
            cancelCountdown = null;
            
            const bl = window.YPP.features.ChannelBlacklist;
            if (bl) {
                let current = bl._settings.channelBlacklist || '';
                current += '\n' + channelPath;
                window.YPP.utils.settings.set('channelBlacklist', current);
                if (!bl._settings.channelBlacklistEnabled) {
                    window.YPP.utils.settings.set('channelBlacklistEnabled', true);
                }
            }
            this.pending = false;
            this.clearButton();
          });
        });
      
        return btn;
    }
    
    showHoverButton(container, channelPath, quick = false) {
        if (this.pending) return;
        if (this.container === container && this.el) return;
        this.clearButton();
    
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
    
        const btn = this.createHoverButton(channelPath);
        wrapper.appendChild(btn);
        document.body.appendChild(wrapper);
    
        this.el = wrapper;
        this.container = container;
        this.anchor = anchor;
        this.btn = btn;
        this.position();
        this.startWatchdog();
    }
    
    handleHoverOver(e) {
        if (this.scrolling) return;
        
        if (this.pending) {
            if (this.container && !this.container.isConnected) {
                this.pending = false;
                this.clearButton();
            } else {
                return;
            }
        }
        
        const blFeature = window.YPP?.features?.ChannelBlacklist || window.YPP?.featureManager?.getFeature?.('channelBlacklist');
        if (!blFeature?.isEnabled) return;
        const hideControls = window.YPP?.featureManager?.getSettings?.()?.hideOnPageControls;
        if (hideControls) return;
        if (!e.target || !e.target.closest) return;
    
        const container = e.target.closest('ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-lockup-view-model');
        if (!container) return;
        if (container.dataset.yppDimmed || container.classList.contains('ypp-hidden') || container.dataset.yppBlocked) return;
    
        if (this.container === container && this.el) return;
    
        const parsers = window.YPP.Utils?.youtubeParsers;
        const channelPathRaw = parsers ? parsers.extractChannelFromContainer(container) : null;
        if (!channelPathRaw) return;
        
        const channelPath = Array.isArray(channelPathRaw) ? channelPathRaw[0] : channelPathRaw;
    
        this.showHoverButton(container, channelPath, !!e.isFromScrollIdle);
    }
    
    handleHoverOut(e) {
        if (this.pending || !this.container) return;
        if (!e.target || !this.container.contains(e.target)) return;
    
        const related = e.relatedTarget;
        if (related && this.container.contains(related)) return;
    
        const rect = this.container.getBoundingClientRect();
        if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        ) {
            return;
        }
        this.clearButton();
    }
}

// Ensure HoverPillManager binds its events globally on module execution
HoverPillManager.instance;

// --- Expose for backwards compatibility where necessary ---
export function renderButtons(badgeNode, reason, channelPathRaw) {
    return FilterUIManager.renderButtons(badgeNode, reason, channelPathRaw);
}
export function removeBadgeAnimated(badge) {
    return FilterUIManager.removeBadgeAnimated(badge);
}

window.YPP = window.YPP || {};
window.YPP.utils = window.YPP.utils || {};
window.YPP.utils.filterUI = { renderButtons, removeBadgeAnimated };
