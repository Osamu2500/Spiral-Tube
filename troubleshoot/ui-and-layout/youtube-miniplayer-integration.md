# YouTube Miniplayer Integration

## Overview
This document covers quirks and issues related to YouTube's persistent Miniplayer (the picture-in-picture mode within the browser tab).

## Common Symptoms
- Custom buttons injected into the player persist or break when the user minimizes the video to the bottom right corner.
- Extension features (like volume or playback speed) fail to apply to the miniplayer.
- The UI gets duplicated when returning from the miniplayer back to the main watch page.

## Troubleshooting Prompts
> **Prompt to AI:**
> "The extension's features are breaking or duplicating when the user interacts with YouTube's native miniplayer.
> Please analyze the UI injection logic:
> 1. Ensure we have proper detection for the miniplayer state (e.g., checking for the `miniplayer-active` class or equivalent attribute).
> 2. Verify that injected controls are either hidden gracefully or repositioned correctly when the miniplayer is active.
> 3. Check for race conditions when transitioning between the main watch page layout and the miniplayer layout."
