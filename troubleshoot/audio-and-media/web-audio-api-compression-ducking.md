# Web Audio API: Distortion Clipping & Compressor Ducking

## 🛑 The Problem
When using the Web Audio API to apply heavy audio effects (e.g., distortion via `WaveShaperNode`, high-gain resonant peaking filters, or extreme pitch shifting), the overall volume of the video drops significantly, and the audio sounds heavily compressed or "pumps" unnaturally.

## 🔍 Root Cause
Audio nodes like `WaveShaperNode` (especially with aggressive distortion curves) or filters with a high `Q` and `gain` value can push the audio signal's amplitude well above the standard `-1.0` to `1.0` range (0 dBFS). 

If the extension uses a global `DynamicsCompressorNode` (or if it routes to YouTube's native audio pipeline which might have internal limiters), this extremely "hot" signal slams into the compressor threshold. The compressor reacts by aggressively ducking the volume to protect against clipping, which pulls down the entire track's volume, making it sound quieter despite the heavy effect.

## 🛠️ The Solution
When designing audio effects that artificially boost gain, you **must** apply local attenuation (makeup reduction gain) at the end of that specific effect's node chain *before* routing it back to the main output.

### Anti-Pattern (What not to do):
```javascript
// This will cause massive volume ducking
const ws = ctx.createWaveShaper(); 
ws.curve = makeDistortionCurve(50); // Massive volume boost

fxInput.connect(ws);
ws.connect(mainCompressorOutput); // BAD: Signal is too hot
```

### Correct Pattern:
```javascript
// Apply calibrated attenuation
const ws = ctx.createWaveShaper(); 
ws.curve = makeDistortionCurve(50);

const attenuationGain = ctx.createGain();
attenuationGain.gain.value = 0.35; // Reduce volume by 65% to match dry signal

fxInput.connect(ws);
ws.connect(attenuationGain);
attenuationGain.connect(mainCompressorOutput); // GOOD: Signal is leveled
```

## 🧠 Key Takeaways
- **Test with heavy inputs:** Always test distortion and resonant filters with loud source audio to ensure the compressor isn't getting triggered unnecessarily.
- **Calibrate every effect:** Build a matrix of output gains for every single effect and tune them by ear so they match the perceived loudness of the dry, bypassed audio.
