/**
 * @file ui-templates.js
 * @description Centralized UI template generators for the popup schema. 
 * Prevents massive inline HTML strings in the schema definitions.
 * Only intended for use within popup schema scripts.
 */

/**
 * Generates the HTML for an advanced filter slot, which includes 
 * the Dim/Hide toggle and the page-specific toggle buttons.
 * 
 * @param {string} featureId The camelCase ID of the feature (e.g., 'hidePlaylists')
 * @param {string} pageBtnPrefix The prefix for the page buttons (e.g., 'playlists' -> 'playlists-page-btn')
 * @returns {string} The HTML string
 */
export function generateAdvancedFilterSlot(featureId, pageBtnPrefix) {
    return `<div style="display:flex; align-items:center; width:100%;">
  <div style="display:inline-flex; background:rgba(0,0,0,0.3); border-radius:10px; padding:3px; border: 1px solid rgba(255,255,255,0.05); margin-right:12px;">
    <button type="button" class="feature-mode-btn active" data-feature="${featureId}" data-mode="dim">Dim</button>
    <button type="button" class="feature-mode-btn" data-feature="${featureId}" data-mode="hide">Hide</button>
  </div>
  <input type="hidden" id="${featureId}Mode" value="hide" />
  <div style="display:flex; gap:4px; flex:1;">
    <button type="button" class="theme-btn card-style-btn ${pageBtnPrefix}-page-btn active" data-page="home" style="flex:1;">Home</button>
    <button type="button" class="theme-btn card-style-btn ${pageBtnPrefix}-page-btn active" data-page="channel" style="flex:1;">Ch</button>
    <button type="button" class="theme-btn card-style-btn ${pageBtnPrefix}-page-btn active" data-page="subs" style="flex:1;">Subs</button>
    <button type="button" class="theme-btn card-style-btn ${pageBtnPrefix}-page-btn active" data-page="search" style="flex:1;">Srch</button>
    <button type="button" class="theme-btn card-style-btn ${pageBtnPrefix}-page-btn active" data-page="related" style="flex:1;">Rel</button>
  </div>
</div>`;
}
