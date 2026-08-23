import './home-manager.js';

import { HomeOrganizer } from './features/home-organizer.js';
window.YPP.FeatureManager.register(HomeOrganizer);

import { CinematicMode } from './layout/cinematic-mode.js';
window.YPP.FeatureManager.register(CinematicMode);
