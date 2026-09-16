# YouTube Theme Synchronization

## Overview
This guide provides details on syncing custom UI elements with YouTube's native Light/Dark/Device theme changes without flashing incorrect colors or causing layout thrashing.

## Common Symptoms
- Custom buttons or injected elements have incorrect colors when toggling YouTube themes.
- A "flash" of the wrong theme appears on page load before snapping to the correct colors.
- Custom CSS variables override or clash with YouTube's native variables.

## Troubleshooting Prompts
> **Prompt to AI:**
> "The custom UI elements injected by the extension are not syncing properly with YouTube's current theme (Dark/Light mode).
> Please check the following:
> 1. Ensure we are correctly listening to the `html` element's `dark` attribute or YouTube's specific theme change events.
> 2. Verify that our CSS relies on YouTube's native CSS variables (e.g., `--yt-spec-text-primary`) rather than hardcoded colors.
> 3. Check for any flash of unstyled content (FOUC) and ensure theme initialization happens as early as possible."
