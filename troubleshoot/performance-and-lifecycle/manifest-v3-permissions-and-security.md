# Manifest V3 Permissions and Security

## Overview
This document covers issues related to CSP (Content Security Policy) violations, optional permissions flow, and host permission edge cases on YouTube within the constraints of Manifest V3.

## Common Symptoms
- CSP violation errors in the console preventing script execution or inline styles.
- Features failing due to missing host permissions or optional permissions not being granted.
- Issues with injecting remote code or dynamic scripts.

## Troubleshooting Prompts
> **Prompt to AI:**
> "The extension is encountering security or permission errors in Manifest V3.
> Please review the security and permission handling:
> 1. Audit the `manifest.json` for any missing host permissions or incorrectly configured optional permissions.
> 2. Check for CSP violations in the Popup. Manifest V3 strictly forbids `unsafe-inline`. Ensure `popup.html` has absolutely no inline `<script>` tags, and that files like `popup-main.js` aren't using inline-style event handlers like `window.addEventListener('error', ...)`. Move all logic to dedicated, externally linked `.js` files.
> 3. Verify the flow for requesting optional permissions provides a good user experience and handles rejections gracefully."
