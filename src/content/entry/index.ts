// 1. Core Framework Imports
import './core-init.ts';

// 2. Dynamic Auto-Registration using Vite's glob import
const modules = import.meta.glob([
    '../pages/**/*.js',
    '../features/**/*.js',
    '!../features/*/external/**/*.js',
    '../layouts/**/*.js',
    '../components/**/*.js'
], { eager: true });

// 3. Register explicit core feature(s)
import { KeyboardShortcuts } from '../core/events/keyboard-shortcuts.js';
if (window.YPP?.FeatureManager) {
    window.YPP.FeatureManager.register(KeyboardShortcuts);
}

// 4. Auto-Register everything else
Object.values(modules).forEach((module: any) => {
    Object.values(module).forEach((exportedItem: any) => {
        // A feature must be a function/class.
        // We explicitly exclude BaseFeature if it somehow gets exported.
        // We also check if it's actually a subclass of BaseFeature or explicitly a valid feature.
        if (typeof exportedItem === 'function' && exportedItem.name !== 'BaseFeature') {
            if (window.YPP?.FeatureManager) {
                // To prevent registering simple helper functions that were exported, 
                // we can rely on FeatureManager's own safeRun, but checking for a class prototype helps.
                if (exportedItem.prototype && (exportedItem.prototype.run || exportedItem.prototype.update || exportedItem.prototype.enable)) {
                    window.YPP.FeatureManager.register(exportedItem);
                } else if (exportedItem.featureId) {
                    // Fallback for static config-based features if any
                    window.YPP.FeatureManager.register(exportedItem);
                }
            }
        }
    });
});

// 5. Main App Bootstrapper
import './main.ts';
