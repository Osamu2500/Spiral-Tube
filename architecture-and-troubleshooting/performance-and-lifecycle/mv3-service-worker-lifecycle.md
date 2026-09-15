# Issue: Manifest V3 Service Worker Lifecycle & Inactivity Terminations

## Overview
Unlike older Manifest V2 extensions where background scripts could run infinitely, Chrome's Manifest V3 aggressively terminates Service Workers. If a Service Worker sits idle for 5 minutes, or a single operation takes longer than 30 seconds, Chrome forcefully kills it.

**Symptoms:**
- Features relying on background fetches or timers suddenly stop working after browsing for a few minutes.
- "Extension context invalidated" errors appear in the console.
- WebSockets or long-lived message ports spontaneously close, breaking communication.

## Root Cause Analysis

1. **The 5-Minute Inactivity Kill:**
   If no events (like clicks, messages, or alarms) wake up the Service Worker for 5 minutes, Chrome puts it to sleep to save RAM. Any state stored in global variables (e.g., `let cachedData = [];`) is permanently lost.

2. **The 30-Second Execution Limit:**
   If the Service Worker processes a single event (like a massive API fetch or parsing a massive JSON object) and doesn't finish within 30 seconds, Chrome forcefully terminates the worker, throwing a fatal error.

3. **Silent Port Disconnections:**
   Long-lived connections created via `chrome.runtime.connect` will automatically disconnect if the Service Worker goes to sleep, firing the `onDisconnect` event, which many extensions fail to handle gracefully.

## Process / Solution

### 1. Stateless Architecture
Never rely on global variables in a Manifest V3 Service Worker to store data long-term. Always pull state from `chrome.storage.local` at the beginning of an operation, and save it back when done.
```javascript
// BAD: State is lost when Service Worker dies
let userSession = null; 

// GOOD: Stateless retrieval
async function getUserSession() {
    const data = await chrome.storage.local.get('session');
    return data.session;
}
```

### 2. The Alarm Wake-Up Hack (Keep-Alive)
If you strictly require the Service Worker to stay awake (e.g., to maintain a WebSocket connection), you must create a `chrome.alarms` timer that fires every 20-30 seconds. The alarm firing counts as an "activity event" and resets Chrome's 5-minute death timer.
```javascript
chrome.alarms.create('keepAlive', { periodInMinutes: 0.4 }); // Fire every ~24 seconds
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        // Do nothing, just waking up the worker!
    }
});
```
*(Note: Chrome may still throttle this eventually, so use sparingly).*

### 3. Graceful Port Reconnection
If using `chrome.runtime.connect`, the Content Script must listen for the `port.onDisconnect` event and actively attempt to reconnect.
```javascript
let port;
function connectToBackground() {
    port = chrome.runtime.connect({ name: 'youtube-comms' });
    port.onDisconnect.addListener(() => {
        console.warn('Background worker died. Reconnecting in 2s...');
        setTimeout(connectToBackground, 2000);
    });
}
```

---

## AI Prompt Template for Future Regressions
*If background tasks, alarms, or messaging ports mysteriously fail after a few minutes of browsing, copy and paste this prompt to the AI:*

> **Prompt to AI:**
> "The extension's background processes, message ports, or API fetches are spontaneously dying or returning 'Extension context invalidated' errors after a few minutes of inactivity. This points to a Manifest V3 Service Worker lifecycle issue.
> 
> Please audit the Service Worker (`background.js` or `service_worker.js`) architecture:
> 1. Look for global variables storing state. Are we losing data when Chrome kills the worker? Ensure all state is persisted via `chrome.storage.local` or IndexedDB.
> 2. If we are using long-lived message ports (`chrome.runtime.connect`), verify that the Content Script has an `onDisconnect` listener that automatically attempts to reconnect when the Service Worker sleeps.
> 3. If a specific background operation is timing out after 30 seconds, ensure the logic is broken into smaller chunks or offloaded to the Content Script if possible."
