# Issue: CSS Layout Thrashing & UI Conflicts

## Overview
When injecting custom elements (like new buttons, sidebars, or toolbars) into YouTube, the injected UI often appears misaligned, jumps around after loading, duplicates itself, or breaks YouTube's native layout. 

## Root Cause Analysis

1. **Fighting Native Flexbox/Grid:**
   YouTube extensively uses CSS Flexbox and Grid. If the extension injects a generic `<div>` with `display: inline-block` into a container that expects strict Flexbox children, the layout will break or misalign vertically.

2. **Aggressive DOM Sweeps & Re-injections:**
   If the extension uses a `data-ypp-processed` tag to prevent injecting a button twice, but another script *removes* that tag globally on a page transition (e.g., `document.querySelectorAll('[data-processed]').forEach(el => el.removeAttribute())`), the injection loop will see the element as "unprocessed" and inject a *second* copy of the button.

3. **Specificity Wars (`!important` abuse):**
   When the extension tries to force a style using `!important`, YouTube might update its DOM with higher specificity selectors (e.g., `#owner.ytd-watch-metadata`), causing the custom style to break abruptly when navigating.

## Process / Solution

### 1. Match the Target's Layout Context
Always inspect the parent container in Chrome DevTools *before* injecting. 
If the parent uses `display: flex; align-items: center;`, ensure the injected element relies on those rules rather than trying to force alignment using raw `margin-top` or `absolute` positioning.
```css
/* Good: Integrating with YouTube's flex layout cleanly */
.ypp-injected-button {
    display: flex;
    align-items: center;
    justify-content: center;
    /* Let the parent flex gap handle spacing */
}
```

### 2. Idempotent DOM Injection
Never clear `data-ypp-processed` tags globally. Scope them strictly to the specific container being re-initialized. 
When attempting to inject UI, always verify if the unique custom element *already exists in the DOM* as a secondary safety net.
```javascript
function injectButton(container) {
    if (container.hasAttribute('data-ypp-button-injected')) return;
    if (container.querySelector('.ypp-custom-button')) return; // Double check

    const btn = document.createElement('button');
    btn.className = 'ypp-custom-button';
    container.appendChild(btn);
    container.setAttribute('data-ypp-button-injected', 'true');
}
```

### 3. Dynamic Styling via CSS Custom Variables
Avoid hardcoding sizes that YouTube might change natively (like player heights or header widths). Hook into YouTube's native CSS variables if possible, or use standard relative units.

---

## AI Prompt Template for Future Regressions
*If injected buttons duplicate, jump, or misalign vertically/horizontally, copy and paste this prompt to the AI:*

> **Prompt to AI:**
> "Custom injected UI elements in the extension (e.g., buttons in the player bar, owner container, or sidebar) are misaligned, jumping during page load, or injecting multiple times. 
> 
> Please perform the following checks:
> 1. Audit the injection logic. Are we globally stripping `data-ypp-processed` attributes somewhere, causing the `MutationObserver` to re-inject a second copy of the button? 
> 2. Check the `attemptInjection` method. Does it verify if `.querySelector('.ypp-custom-button')` already exists before appending?
> 3. Inspect the CSS styling applied to the parent container and injected element. Ensure we are not using brittle absolute positioning or `margin-top` hacks to align items, and are instead matching YouTube's native `align-items: center` flex properties."
