import { PlaylistRedesign } from './layout/playlist-redesign/playlist-redesign.js';
window.YPP.FeatureManager.register(PlaylistRedesign);

import { PlaylistDuration } from './features/duration-calculator.js';
window.YPP.FeatureManager.register(PlaylistDuration);

import { ReversePlaylist } from './features/reverse-playlist.js';
window.YPP.FeatureManager.register(ReversePlaylist);
