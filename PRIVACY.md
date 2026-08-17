# Privacy Policy for Spiral Tube

**Effective Date:** August 17, 2026

Spiral Tube ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle your data when you use the Spiral Tube Chrome Extension.

## 1. Information We Do Not Collect

Spiral Tube is designed to operate locally on your device. 
*   **No Personal Data:** We do not collect, transmit, distribute, or sell any of your personally identifiable information (PII), such as your name, email address, or browsing history.
*   **No Analytics:** We do not use Google Analytics or any other third-party telemetry/tracking tools to monitor your usage of the extension.

## 2. Information Stored Locally

All settings, configurations, and preferences (such as your chosen themes, volume equalizer settings, and enabled features) are stored locally on your device or synced across your devices using Google Chrome's built-in `chrome.storage.sync` and `chrome.storage.local` APIs. We do not have access to this data.

## 3. Third-Party Services and APIs

To provide specific functionalities, Spiral Tube interacts directly with third-party APIs from your browser:
*   **YouTube:** The extension modifies the YouTube interface locally. It does not scrape or transmit your account details or watch history to us.
*   **SponsorBlock API:** If the SponsorBlock feature is enabled, the extension queries the public SponsorBlock database (`https://sponsor.ajay.app`) to retrieve ad-skip segments. This requires sending video IDs to their servers in accordance with their privacy policy.
*   **Return YouTube Dislike API:** If enabled, the extension queries `https://returnyoutubedislikeapi.com` using video IDs to fetch dislike counts.

Your IP address and the specific video IDs you are watching may be visible to these third-party services when those features are active. We encourage you to review their respective privacy policies.

## 4. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. If we make significant changes, we will update the "Effective Date" at the top of this document.

## 5. Contact Us

If you have any questions or concerns about this Privacy Policy, please open an issue in the project's GitHub repository.
