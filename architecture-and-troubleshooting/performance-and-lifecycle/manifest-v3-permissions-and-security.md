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
> 2. Check for CSP violations. Ensure we are not using inline scripts (`eval()`, etc.) and that any injected CSS is handled via `chrome.scripting.insertCSS` or safe DOM manipulation.
> 3. Verify the flow for requesting optional permissions provides a good user experience and handles rejections gracefully."
