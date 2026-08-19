/**
 * popup-animations.js — Spiral Tube Animation System v1.0
 *
 * Provides:
 *  - showToast(msg, type, duration)      — premium toast notifications
 *  - addRipple(btn)                       — click ripple on buttons
 *  - shakeElement(el)                     — shake on error/duplicate
 *  - animateRowEnter(el)                 — new row slide-in
 *  - animateRowExit(el, callback)        — delete row slide-out
 *  - animateCountUp(el, from, to, unit)  — animated number counter
 *  - burstParticles(el, count)           — toggle-on particle burst
 *  - initOverlayPanel(overlayEl)         — blur-in overlay instead of display:none
 *  - showOverlay(el) / hideOverlay(el)
 *  - staggerReveal(items, baseDelay)     — staggered list items reveal
 *  - initRippleButtons(doc)              — wire ripples to all action-btns
 *  - initShakeOnDuplicateKey(keyInput)   — hook into key input for shaking
 *  - initAnimatedDeleteRows(doc)         — wire delete buttons with exit anim
 */

/* ═══════════════════════════════════════════════════════
   TOAST NOTIFICATION
═══════════════════════════════════════════════════════ */

let _toastContainer = null;

function _getToastContainer(doc) {
    if (!_toastContainer || !doc.body.contains(_toastContainer)) {
        _toastContainer = doc.createElement('div');
        _toastContainer.className = 'ypp-toast-container';
        doc.body.appendChild(_toastContainer);
    }
    return _toastContainer;
}

const TOAST_ICONS = {
    success: `<svg class="ypp-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    warning: `<svg class="ypp-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    error:   `<svg class="ypp-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg class="ypp-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

export function showToast(message, type = 'success', duration = 2800, doc = document) {
    const container = _getToastContainer(doc);

    const toast = doc.createElement('div');
    toast.className = `ypp-toast ypp-toast-${type}`;

    const iconHtml = TOAST_ICONS[type] || TOAST_ICONS.info;
    const progressBar = doc.createElement('div');
    progressBar.className = 'ypp-toast-progress';
    progressBar.style.width = '100%';

    toast.innerHTML = `${iconHtml}<span style="flex:1; line-height:1.35;">${message}</span>`;
    toast.appendChild(progressBar);
    container.appendChild(toast);

    // Animate progress bar
    const startTime = performance.now();
    const tickProgress = (now) => {
        const elapsed = now - startTime;
        const remaining = Math.max(0, 1 - elapsed / duration);
        progressBar.style.width = (remaining * 100) + '%';
        if (remaining > 0 && !toast._dismissing) requestAnimationFrame(tickProgress);
    };
    requestAnimationFrame(tickProgress);

    // Auto-dismiss
    const dismiss = () => {
        if (toast._dismissing) return;
        toast._dismissing = true;
        toast.classList.add('ypp-toast-dismissing');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
        setTimeout(() => toast.remove(), 400); // failsafe
    };

    const dismissTimer = setTimeout(dismiss, duration);
    toast.addEventListener('click', () => {
        clearTimeout(dismissTimer);
        dismiss();
    });
}

/* ═══════════════════════════════════════════════════════
   BUTTON RIPPLE
═══════════════════════════════════════════════════════ */
export function addRipple(event, btn) {
    btn.classList.add('ypp-ripple-host');

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.className = 'ypp-ripple';
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

export function initRippleButtons(doc = document) {
    // Use event delegation on body for all current & future buttons
    doc.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.action-btn, .theme-btn, .card-style-btn, .view-mode-btn, .gpb-btn, .preset-btn, .segment-btn, .range-btn, .vsc-rm-btn');
        if (btn) addRipple(e, btn);
    });
}

/* ═══════════════════════════════════════════════════════
   SHAKE ON ERROR
═══════════════════════════════════════════════════════ */
export function shakeElement(el) {
    if (!el) return;
    el.classList.remove('ypp-shake');
    // Reflow to restart animation
    void el.offsetWidth;
    el.classList.add('ypp-shake');
    el.addEventListener('animationend', () => el.classList.remove('ypp-shake'), { once: true });
}

/* ═══════════════════════════════════════════════════════
   ROW ENTER / EXIT ANIMATIONS
═══════════════════════════════════════════════════════ */
export function animateRowEnter(el) {
    if (!el) return;
    el.classList.add('ypp-row-enter');
    el.addEventListener('animationend', () => el.classList.remove('ypp-row-enter'), { once: true });
}

export function animateRowExit(el, callback) {
    if (!el) return;
    el.classList.add('ypp-row-exit');
    el.addEventListener('animationend', () => {
        el.remove();
        if (typeof callback === 'function') callback();
    }, { once: true });
    // Failsafe in case animationend doesn't fire
    setTimeout(() => {
        if (el.parentNode) {
            el.remove();
            if (typeof callback === 'function') callback();
        }
    }, 450);
}

/* ═══════════════════════════════════════════════════════
   ANIMATED NUMBER COUNTER
═══════════════════════════════════════════════════════ */
export function animateCountUp(el, from, to, duration = 1200, unit = '', formatter = null) {
    if (!el) return;
    const startTime = performance.now();
    const diff = to - from;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(from + diff * easeOut(progress));

        if (formatter) {
            el.textContent = formatter(value);
        } else {
            el.textContent = value + unit;
        }

        el.classList.add('ypp-counting');
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.classList.remove('ypp-counting');
        }
    };
    requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════════════════
   PARTICLE BURST ON TOGGLE-ON
═══════════════════════════════════════════════════════ */
export function burstParticles(anchorEl, count = 8) {
    if (!anchorEl) return;
    anchorEl.classList.add('ypp-particle-host');

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'ypp-burst-particle';

        const angle = (360 / count) * i;
        const rad = (angle * Math.PI) / 180;
        const distance = 18 + Math.random() * 12;
        const tx = Math.cos(rad) * distance;
        const ty = Math.sin(rad) * distance;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.animationDelay = `${Math.random() * 60}ms`;

        anchorEl.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }
}

/* ═══════════════════════════════════════════════════════
   BLUR-IN OVERLAY SYSTEM
   Replaces display:none toggles with opacity transitions
═══════════════════════════════════════════════════════ */
export function initOverlayPanel(overlayEl) {
    if (!overlayEl) return;
    // Remove display:none from inline styles if present, use CSS class instead
    overlayEl.classList.add('ypp-overlay-panel');
    overlayEl.style.removeProperty('display');

    // Reset existing inline show logic — set it to hidden state
    overlayEl.style.pointerEvents = 'none';
    overlayEl.style.opacity = '0';
    overlayEl.style.display = 'flex';
}

export function showOverlay(overlayEl) {
    if (!overlayEl) return;
    overlayEl.style.display = 'flex';
    // Reflow before transition
    void overlayEl.offsetWidth;
    overlayEl.classList.add('ypp-overlay-visible');
    overlayEl.style.pointerEvents = 'auto';
}

export function hideOverlay(overlayEl) {
    if (!overlayEl) return;
    overlayEl.classList.remove('ypp-overlay-visible');
    overlayEl.style.pointerEvents = 'none';
}

/* ═══════════════════════════════════════════════════════
   STAGGER REVEAL — for lists (recap/resume items)
═══════════════════════════════════════════════════════ */
export function staggerReveal(items, baseDelay = 0, stepDelay = 60) {
    if (!items || !items.length) return;
    items.forEach((item, i) => {
        item.classList.add('ypp-stagger-enter');
        item.style.animationDelay = `${baseDelay + i * stepDelay}ms`;
    });
}

/* ═══════════════════════════════════════════════════════
   MASTER INIT — wire everything up
═══════════════════════════════════════════════════════ */
export function initAllAnimations(doc = document) {
    // 1. Ripple on all buttons
    initRippleButtons(doc);

    // 2. Toggle checkbox particle burst + checkmark draw
    doc.body.addEventListener('change', (e) => {
        if (e.target.type !== 'checkbox') return;

        if (e.target.checked) {
            // Particle burst from the toggle slider
            const slider = e.target.nextElementSibling;
            if (slider && slider.classList.contains('slider')) {
                burstParticles(slider, 7);
            }
        }
    });

    // 3. Shake on duplicate key warning — patched via MutationObserver watching red color
    // (The actual shake trigger is exported and called from popup-main.js)

    // 4. Log confirm
    console.debug('[YPP Animations] Initialized ✓');
}
