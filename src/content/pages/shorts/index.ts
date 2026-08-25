import { HideShorts } from './features/visibility/hide-shorts.js';
window.YPP.FeatureManager.register(HideShorts);

import { RedirectShorts } from './features/visibility/redirect-shorts.js';
window.YPP.FeatureManager.register(RedirectShorts);

import { StopShortsLooping } from './features/playback/stop-looping.js';
window.YPP.FeatureManager.register(StopShortsLooping);

import { ShortsAutoScroll } from './features/playback/auto-scroll.js';
window.YPP.FeatureManager.register(ShortsAutoScroll);

import { ShortsVolumeNormalizer } from './features/playback/volume-normalizer.js';
window.YPP.FeatureManager.register(ShortsVolumeNormalizer);
