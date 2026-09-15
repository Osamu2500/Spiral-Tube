# YouTube State & Initial Data Interception

## Overview
This document focuses on issues related to parsing `ytInitialData`, intercepting YouTube's internal state managers, and dynamically reading video data directly from the DOM scripts instead of relying on slow API requests.

## Common Symptoms
- The extension fails to extract video metadata (like view count, upload date, or likes) on cold loads.
- The data fetched by the extension does not match what is visually rendered on the page.
- YouTube changes its `ytInitialData` object structure and breaks our parsers.

## Troubleshooting Prompts
> **Prompt to AI:**
> "The extension is failing to parse video metadata or state on initial load.
> Please audit our data interception strategy:
> 1. Check if we are safely reading `ytInitialData` or `ytInitialPlayerResponse` without crashing if keys are missing (using optional chaining).
> 2. Verify that we are not introducing security risks by executing `eval()` on inline scripts to retrieve state.
> 3. Ensure we have fallback mechanisms in place if the expected JSON structures in the DOM scripts change."
