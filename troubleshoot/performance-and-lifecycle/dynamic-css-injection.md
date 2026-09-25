# Dynamic CSS Injection & Performance

## Symptom
The browser slows down significantly or freezes when the extension applies dynamic styles (like Custom Themes or Seamless Mode grids). Checking the DOM reveals hundreds or thousands of `<style>` tags appended to `<head>`, causing catastrophic style recalculations on every frame.

## Root Cause
When features require highly dynamic CSS (e.g., generating CSS grids based on slider values, or generating RGB variables from color pickers), developers often write logic that creates a new `<style>` element and appends it to `document.head` every time a setting changes or a window resize occurs.
Because Chrome has to re-evaluate the entire CSSOM tree every time a `<style>` tag is added, doing this inside a `MutationObserver`, `resize` event, or rapid slider `input` event immediately crashes the browser's performance.

## The Fix: Idempotent & Reused Style Tags
Dynamic CSS must NEVER be blindly appended. It must be injected idempotently using a single, reusable `<style>` tag.

1. **Singleton Style Tag:** Assign a specific, unique `id` to the style tag for that feature (e.g., `<style id="spiral-tube-dynamic-theme">`).
2. **Check Before Injecting:** Before creating a new tag, use `document.getElementById()` to see if it already exists.
3. **Update `textContent`:** If the tag exists, simply update its `.textContent` property with the new CSS string instead of creating a new element.
4. **Debouncing:** If the CSS is generated from a high-frequency event (like dragging a slider), wrap the injection function in a `requestAnimationFrame` or a debounce function to limit updates to 60fps or lower.

**Example Pattern:**
```javascript
function injectDynamicCSS(cssString, id) {
    let styleEl = document.getElementById(id);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = id;
        document.head.appendChild(styleEl);
    }
    // Only update if it actually changed to prevent unnecessary repaints
    if (styleEl.textContent !== cssString) {
        styleEl.textContent = cssString;
    }
}
```

## AI Prompt Template
```text
The extension is causing massive layout thrashing and creating duplicate `<style>` tags in the DOM. Please review the dynamic CSS injection logic for this feature. Ensure we are using a singleton `<style>` tag by checking for a specific ID, updating the `.textContent` rather than appending new tags, and debouncing the injection if it's tied to high-frequency events.
```
