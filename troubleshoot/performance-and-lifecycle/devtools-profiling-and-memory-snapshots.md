# DevTools Profiling & Memory Snapshots

## Overview
This document covers advanced debugging techniques using Chrome DevTools to trace memory leaks and performance bottlenecks within the extension's execution context.

## Common Symptoms
- Browser crashes or shows "Aw, Snap!" after leaving a YouTube tab open for hours.
- CPU usage remains high even when the video is paused.
- The heap size grows linearly over time in the Performance monitor.

## Troubleshooting Prompts
> **Prompt to AI:**
> "The extension seems to be causing a memory leak or CPU spike over long sessions.
> Please review the architecture with the following in mind:
> 1. Check if event listeners or observers are being orphaned when DOM elements are removed.
> 2. Look out for large data structures or caching mechanisms that are never garbage collected.
> 3. Provide a step-by-step guide on how I should use Chrome DevTools Memory Snapshots to isolate objects retained by the extension context."
