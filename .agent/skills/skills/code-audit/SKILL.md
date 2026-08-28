---
name: code-audit
description: "Authorized source-code security review: scan for dangerous patterns, hardcoded values, missing validations, and XSS vectors. Fix and verify."
risk: safe
source: "https://github.com/zhaoxuya520/reverse-skill"
source_repo: "zhaoxuya520/reverse-skill"
source_type: community
date_added: "2026-08-25"
license: "MIT"
---

# Source Code Security Audit

## When to Use

- Reviewing a codebase for security defects
- Verifying that a vulnerability fix actually removes the flawed pattern
- Pre-release security sweep of a Chrome extension

## Workflow

### 1. Scope & Threat Model

```text
□ Trust boundaries: user input, DOM content, message listeners, external URLs
□ High-value assets: permissions, storage access, content script injection points
```

### 2. Manual Pattern Scan

Check for:
- **XSS**: `innerHTML`, `outerHTML`, `document.write` with unsanitized content
- **Eval**: `eval()`, `Function()`, `setTimeout(string)` — banned in MV3 CSP
- **Hardcoded values**: API keys, passwords, secrets in source
- **Missing validation**: message listeners without sender validation
- **Permission leaks**: overly broad `host_permissions` in manifest
- **Storage exposure**: sensitive data stored unencrypted in `chrome.storage`

### 3. Chrome Extension Specific Checks

```text
□ manifest.json: minimal permissions principle
□ content_scripts: no eval, no innerHTML with user data
□ background: validates message senders before acting
□ web_accessible_resources: minimal exposure
□ CSP: no 'unsafe-eval', no 'unsafe-inline'
□ External connections: only to expected hosts
```

### 4. Output

```text
Finding: location + data flow + severity + fix recommendation
Severity: Critical / High / Medium / Low / Info
```

## Common Fixes

| Issue | Bad | Good |
|---|---|---|
| XSS | `el.innerHTML = userInput` | `el.textContent = userInput` |
| Eval | `eval(code)` | Refactor to avoid dynamic execution |
| Hardcoded key | `const API_KEY = 'abc123'` | Use `chrome.storage` or build-time env |
| Open message | `chrome.runtime.onMessage.addListener(fn)` | Validate `sender.id === chrome.runtime.id` |
