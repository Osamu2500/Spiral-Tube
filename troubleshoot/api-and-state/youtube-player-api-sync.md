# Issue: YouTube HTML5 Player API Desyncs

## Overview
When extension features interact with the video player (e.g., Volume Booster, Auto-Pause, Video Speed Controller, Auto-Quality), their internal states sometimes fall out of sync with YouTube's actual playback state.

**Symptoms:**
- The Volume Booster UI says it's at 200%, but the audio is normal.
- Auto-Pause pauses the video, but YouTube instantly resumes it.
- Video speed changes randomly when clicking a new video.

## Root Cause Analysis

1. **YouTube's Internal State Engine:**
   YouTube manages playback via a deeply nested Javascript API (`document.getElementById('movie_player')`), not just the standard `<video>` tag properties. If the extension forcibly changes `video.volume = 0.5`, YouTube's internal engine might overwrite it a millisecond later with its own cached volume state.

2. **Web Audio API Contexts (Volume Booster):**
   When utilizing `AudioContext` and `createMediaElementSource` to boost volume, the browser strictly enforces that an `AudioContext` can only be created *once* per `<video>` element, and only after a user gesture. Attempting to recreate the Audio Graph on SPA navigations will throw a `MediaElementAudioSourceNode` creation error, silencing the video entirely.

3. **Event Propagation Wars:**
   If the extension listens to `play` or `pause` events on the video element but doesn't halt YouTube's own internal event listeners, the two systems can end up in an infinite toggle loop.

## Process / Solution

### 1. Hooking the Native Player API
Whenever possible, interact with YouTube's specific player API rather than the raw `<video>` element.
```javascript
const player = document.getElementById('movie_player');
if (player && typeof player.setPlaybackRate === 'function') {
    player.setPlaybackRate(1.5); // Correct: Updates YouTube's internal state
} else {
    videoElement.playbackRate = 1.5; // Brittle: Might be overwritten
}
```

### 2. AudioGraph Singleton Pattern
For Audio features, ensure the `MediaElementSource` is only instantiated *once* for the lifecycle of the tab, regardless of how many times the user switches videos via SPA navigation.
```javascript
if (!this._audioContext) {
    this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Only connect source ONCE per video element lifecycle
    this._source = this._audioContext.createMediaElementSource(videoElement);
}
// On video switch, just adjust the gain node, DO NOT recreate the context!
this._gainNode.gain.value = newBoostValue;
```

### 3. Debouncing State Changes
When applying volume, quality, or speed changes on a new video load, wrap the application logic in a debounced `setTimeout` or `requestAnimationFrame`. This allows YouTube's native initialization scripts to finish running before the extension overrides them.

---

## AI Prompt Template for Future Regressions
*If video playback features (audio, speed, quality, auto-pause) act erratically or fail on video switch, copy and paste this prompt to the AI:*

> **Prompt to AI:**
> "Features interacting with the video player (e.g. Volume, Speed, Auto-Pause) are falling out of sync with the actual video state, or failing when navigating to a new video via SPA switch.
> 
> Please audit the media interaction logic:
> 1. Check if the feature is interacting with the raw `<video>` element properties directly. Suggest upgrading to `document.getElementById('movie_player').setX()` methods where applicable.
> 2. For Audio features, verify that `AudioContext` and `createMediaElementSource` are using a Singleton pattern. Are we accidentally trying to recreate the Audio Graph on `onVideoChange`, causing a MediaElementSource error?
> 3. Look at `onVideoChange()` logic in the feature. Are we applying the state updates (like playback rate or quality) too early? Ensure a reasonable debounce/delay is used so YouTube's native scripts don't immediately overwrite our changes."
