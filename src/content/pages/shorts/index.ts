import { HideShorts } from './features/hide-shorts.js';
window.YPP.FeatureManager.register(HideShorts);

import { RedirectShorts } from './features/redirect-shorts.js';
window.YPP.FeatureManager.register(RedirectShorts);

import { StopShortsLooping } from './features/stop-looping.js';
window.YPP.FeatureManager.register(StopShortsLooping);

import { ShortsAutoScroll } from './features/auto-scroll.js';
window.YPP.FeatureManager.register(ShortsAutoScroll);

import { ShortsVolumeNormalizer } from './features/volume-normalizer.js';
window.YPP.FeatureManager.register(ShortsVolumeNormalizer);
