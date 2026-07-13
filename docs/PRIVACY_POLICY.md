# Spiral Tube — Privacy Policy

**Last updated:** July 2026  
**Extension:** Spiral Tube (Chrome Web Store)  
**Developer:** Osamu2500

---

## 1. What Data We Collect

Spiral Tube **does not collect, transmit, or sell any personal data** to third-party servers.

All data the extension stores is kept **locally on your device** using Chrome's built-in storage APIs (`chrome.storage.local` and `chrome.storage.sync`). This includes:

- Your extension settings and feature preferences
- Video bookmarks you create
- Watch history analytics (stored locally only)
- Subscription group folders you organize
- Custom themes and color preferences

## 2. Optional Google Drive Backup

If you choose to use the **"Backup to Google Drive"** feature:

- The extension requests read/write access to your Google Drive **AppData folder only** — a private, hidden folder that no other app or person can access.
- The backup contains only your extension settings (the same data listed above).
- **We never read, store, or transmit your backup data to any external server.** The data goes directly from your browser to your Google Drive account via Google's official API.
- You can revoke access at any time at [myaccount.google.com/permissions](https://myaccount.google.com/permissions).

## 3. Third-Party APIs

Spiral Tube makes requests to these external services **only when the corresponding features are enabled**:

| Service | Purpose | Data Sent |
|---------|---------|-----------|
| [SponsorBlock API](https://sponsor.ajay.app) | Skip sponsored segments | Hashed video ID only |
| [Return YouTube Dislike API](https://returnyoutubedislikeapi.com) | Show dislike counts | Video ID only |

Neither API receives your identity, browsing history, or any personally identifiable information.

## 4. Permissions Justification

| Permission | Why It's Needed |
|-----------|-----------------|
| `storage` | Save your settings and bookmarks locally |
| `tabs` | Broadcast setting changes to open YouTube tabs when you update preferences |
| `alarms` | Power the Focus Study Timer feature |
| `notifications` | Alert you when a study session ends |
| `contextMenus` | Right-click → "Add channel to group" shortcut |
| `identity` | Optional Google Drive backup (only active if you click Backup) |

## 5. No Tracking, No Analytics

- We do **not** use Google Analytics, Mixpanel, or any analytics SDK.
- We do **not** track which features you use.
- We do **not** send any telemetry to our servers (we don't have any servers).

## 6. Children's Privacy

This extension is not directed at children under 13. It does not collect any information from any users.

## 7. Changes to This Policy

If this policy changes materially, the extension version will be updated and a changelog will be published on our [GitHub repository](https://github.com/Osamu2500/youtube-premium-extension).

## 8. Contact

For questions or concerns:  
GitHub: [github.com/Osamu2500/youtube-premium-extension/issues](https://github.com/Osamu2500/youtube-premium-extension/issues)
