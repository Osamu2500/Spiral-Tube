/**
 * sanitize.js — Spiral Tube Security Utility
 *
 * Provides safe helpers for inserting content into the DOM.
 * Use these instead of raw innerHTML when the content comes from
 * storage, YouTube DOM, or any external source.
 *
 * MV3 CSP blocks CDN-loaded sanitizers, so this is a self-contained
 * DOMParser-based sanitizer. It is intentionally conservative.
 */

'use strict';

/**
 * Escapes a string so it is safe to insert as plain text inside HTML.
 * Equivalent to setting .textContent — use this when you don't need HTML at all.
 * @param {*} value — any value; non-strings are coerced.
 * @returns {string} HTML-entity-escaped string.
 */
export function escapeHTML(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Sanitizes an HTML string, removing dangerous elements and attributes.
 *
 * Strips:
 *   - <script>, <style>, <iframe>, <object>, <embed>, <link>, <meta>, <base> tags
 *   - All `on*` event handler attributes (onclick, onerror, etc.)
 *   - `href`, `src`, and `action` attributes containing `javascript:`, `data:`, or `vbscript:`
 *   - `srcdoc` attributes (iframe injection vector)
 *
 * Allows: safe structural/presentational HTML (div, span, svg, path, etc.)
 *
 * @param {string} html — the HTML string to sanitize.
 * @returns {string} sanitized HTML string.
 */
export function sanitizeHTML(html) {
    if (!html || typeof html !== 'string') return '';

    // Hard cap: reject inputs over 100KB (storage values should never be this large)
    if (html.length > 100_000) return '';

    let doc;
    try {
        doc = new DOMParser().parseFromString(html, 'text/html');
    } catch (e) {
        return escapeHTML(html);
    }

    // Tags that are always removed (including their children)
    const BLOCKED_TAGS = new Set([
        'script', 'style', 'iframe', 'frame', 'frameset',
        'object', 'embed', 'applet', 'link', 'meta', 'base',
        'form', 'input', 'button', 'select', 'textarea'
    ]);

    // URL attributes that can carry javascript:/data: payloads
    const URL_ATTRS = new Set(['href', 'src', 'action', 'formaction', 'xlink:href', 'srcdoc']);

    // Regex to detect dangerous URL schemes
    const DANGEROUS_URL = /^\s*(javascript|data|vbscript)\s*:/i;

    function clean(node) {
        // Remove blocked tags entirely (walk backwards to avoid index shifting)
        const toRemove = [];
        for (const child of node.querySelectorAll('*')) {
            if (BLOCKED_TAGS.has(child.tagName.toLowerCase())) {
                toRemove.push(child);
                continue;
            }

            // Remove all on* event handler attributes
            const attrsToRemove = [];
            for (const attr of child.attributes) {
                const name = attr.name.toLowerCase();
                if (name.startsWith('on')) {
                    attrsToRemove.push(attr.name);
                    continue;
                }
                if (URL_ATTRS.has(name) && DANGEROUS_URL.test(attr.value)) {
                    attrsToRemove.push(attr.name);
                }
            }
            attrsToRemove.forEach(a => child.removeAttribute(a));
        }
        toRemove.forEach(el => el.remove());
    }

    clean(doc.body);

    return doc.body.innerHTML;
}

/**
 * Sets the innerHTML of an element safely.
 * Sanitizes the provided HTML string before insertion.
 *
 * @param {Element} element — the DOM element to update.
 * @param {string} html — the HTML string to sanitize and insert.
 */
export function setInnerHTML(element, html) {
    if (!element) return;
    element.innerHTML = sanitizeHTML(html);
}

/**
 * Sets the text content of an element safely.
 * Always safe — never interprets HTML.
 *
 * @param {Element} element — the DOM element to update.
 * @param {*} text — the text value to set.
 */
export function setTextContent(element, text) {
    if (!element) return;
    element.textContent = (text === null || text === undefined) ? '' : String(text);
}
