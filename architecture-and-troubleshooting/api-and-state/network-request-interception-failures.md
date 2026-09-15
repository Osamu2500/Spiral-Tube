# Network Request Interception Failures

## Overview
This document covers issues related to intercepting YouTube's XHR/Fetch requests (e.g., `yti` endpoints), handling declarativeNetRequest rules, and dealing with CORS or chunked responses.

## Common Symptoms
- Network requests fail to be intercepted or modified.
- Unexpected CORS errors in the console.
- Missing data payload when trying to read YouTube API responses.

## Troubleshooting Prompts
> **Prompt to AI:**
> "The extension is failing to properly intercept or read YouTube's network requests. Please audit our network interception strategy:
> 1. Check if we are using the correct `declarativeNetRequest` rules and if they have proper permissions in `manifest.json`.
> 2. Ensure that any fetch/XHR overrides are not breaking YouTube's chunked response formats.
> 3. Verify that CORS headers are being handled correctly for any external requests made."
