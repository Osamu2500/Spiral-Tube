# Popup State Binding & Custom HTML Tabs

## Symptom
Settings in custom HTML tabs (like the `Designs` tab) are not saving or loading from Chrome Storage, while settings in schema-generated tabs (like `Modes` or `Shorts`) work perfectly. 

## Root Cause
The popup extension uses two ways to render UI:
1. **Schema-Generated Tabs:** Driven by JS arrays in `src/popup/scripts/schema/tabs/`. The renderer automatically builds the DOM and handles state binding.
2. **Custom HTML Tabs:** Flagged with `custom: true` in their schema definition (e.g., `tab-appearance.js`). The JS renderer skips them, and their layout is exclusively defined inside `popup.html`.

Because the renderer skips them, developers sometimes assume they must manually write event listeners and `chrome.storage` hooks for new inputs added to custom tabs.

## The Fix
You do **not** need manual event listeners for simple settings in custom HTML tabs! 
The central state manager (`popup-state.js`) works globally by querying the DOM for inputs:
`document.querySelectorAll('input[id]:not(#featureSearch), select[id], textarea[id]')`

**To instantly bind a new setting in a custom HTML tab:**
1. Define the setting key in `shared/config/settings-schema.js` and `shared/config/default-settings.js`.
2. Ensure the `<input>` or `<select>` element in `popup.html` has an `id` attribute that **exactly matches** the setting key defined in the schema.
3. `popup-state.js` will automatically pick it up, hydrate it on load, and save its value on change.

## AI Prompt Template
```text
I am adding a new feature toggle to a custom HTML tab (like the Designs tab) inside `popup.html`. I need this setting to save and load correctly.
Please add the new setting key to `settings-schema.js` and `default-settings.js`. Then, ensure the `<input>` element I am adding to `popup.html` has its `id` attribute set to perfectly match the setting key so that `popup-state.js` automatically binds it. Do not write manual event listeners for storage sync unless it requires custom debounce logic.
```
