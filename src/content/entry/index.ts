// 1. Core Framework Imports
import './core-init.ts';

// 2. Eagerly load global features (layouts, components, global features, pages)
const globalModules = import.meta.glob([
    '../features/**/*.js',
    '!../features/*/external/**/*.js',
    '../layouts/**/*.js',
    '../components/**/*.js',
    '../pages/**/*.js'
], { eager: true });

// 3. Register explicit core feature(s)
import { KeyboardShortcuts } from '../core/events/keyboard-shortcuts.js';
if (window.YPP?.FeatureManager) {
    window.YPP.FeatureManager.register(KeyboardShortcuts);
}

// 4. Auto-Register all modules
function registerModule(module: any) {
    Object.values(module).forEach((exportedItem: any) => {
        if (typeof exportedItem === 'function' && exportedItem.name !== 'BaseFeature') {
            if (window.YPP?.FeatureManager) {
                if (exportedItem.prototype && (exportedItem.prototype.run || exportedItem.prototype.update || exportedItem.prototype.enable)) {
                    window.YPP.FeatureManager.register(exportedItem);
                } else if (exportedItem.featureId) {
                    window.YPP.FeatureManager.register(exportedItem);
                }
            }
        }
    });
}
Object.values(globalModules).forEach(registerModule);

// Hook into initial load and SPA navigations to ensure features are applied
document.addEventListener('yt-navigate-start', (e: any) => {
    if (e?.detail?.url) {
        try {
            // Re-apply features on navigation if needed
            if (window.YPP?.featureManager?.instantiated) {
                // The page managers will handle the specifics, we just need to ensure
                // the feature manager runs an apply cycle.
                window.YPP.featureManager.applyFeatures();
            }
        } catch (e) {}
    }
});

// 5. Main App Bootstrapper
import './main.ts';
