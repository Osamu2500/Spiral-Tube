// 1. Core Framework Imports
import './core-init.ts';

// ─────────────────────────────────────────────────────────────────────────────
// 2. Module Groups — split by page scope
//    Core modules load eagerly; page-specific modules load on first navigation
//    to the matching route. The browser module cache ensures subsequent same-
//    type navigations pay zero cost.
// ─────────────────────────────────────────────────────────────────────────────

// CORE — always loaded (navigation, themes, global UI, performance tweaks)
const coreModules = import.meta.glob([
    '../features/navigation/**/*.js',
    '../features/performance/**/*.js',
    '../features/ui-tweaks/**/*.js',
    '../layouts/**/*.js',
    '../components/**/*.js',
], { eager: true });

// WATCH — loaded on first /watch navigation
const watchModules = import.meta.glob([
    '../pages/watch/**/*.js',
    '../features/global-player-bar/**/*.js',
    '../features/cinematic/**/*.js',
    '../features/subscription-folders/**/*.js',
    '!../features/global-player-bar/external/**/*.js',
], { eager: false });

// FEED — loaded on first home/subscriptions/search/playlist navigation
const feedModules = import.meta.glob([
    '../pages/home/**/*.js',
    '../pages/subscriptions/**/*.js',
    '../pages/search/**/*.js',
    '../pages/shared-feed/**/*.js',
    '../pages/playlist/**/*.js',
    '../features/declutter/**/*.js',
], { eager: false });

// SHORTS — loaded on first /shorts navigation
const shortsModules = import.meta.glob([
    '../pages/shorts/**/*.js',
], { eager: false });

// ─────────────────────────────────────────────────────────────────────────────
// 3. Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Track which module groups have already been loaded */
const _loadedGroups = new Set<string>();

/** Register all feature-class exports from a resolved module map */
function _registerModules(modules: Record<string, any>) {
    Object.values(modules).forEach((mod: any) => {
        Object.values(mod).forEach((exportedItem: any) => {
            if (
                typeof exportedItem === 'function' &&
                exportedItem.name !== 'BaseFeature' &&
                window.YPP?.FeatureManager
            ) {
                if (
                    exportedItem.prototype && (
                        exportedItem.prototype.run ||
                        exportedItem.prototype.update ||
                        exportedItem.prototype.enable
                    )
                ) {
                    window.YPP.FeatureManager.register(exportedItem);
                } else if (exportedItem.featureId) {
                    window.YPP.FeatureManager.register(exportedItem);
                }
            }
        });
    });
}

/** Lazily load a module group, register its features, then re-apply features */
async function _loadGroup(name: string, lazyMap: Record<string, () => Promise<any>>) {
    if (_loadedGroups.has(name)) return;
    _loadedGroups.add(name);

    performance.mark(`ypp:load-group-${name}-start`);

    const keys = Object.keys(lazyMap);
    const settled = await Promise.allSettled(keys.map(k => lazyMap[k]()));
    const modules: Record<string, any> = {};
    settled.forEach((result, i) => {
        if (result.status === 'fulfilled') {
            modules[keys[i]] = result.value;
        }
    });

    _registerModules(modules);

    performance.mark(`ypp:load-group-${name}-end`);
    performance.measure(`ypp:load-group-${name}`, `ypp:load-group-${name}-start`, `ypp:load-group-${name}-end`);

    // Re-apply features now that newly registered ones are available
    if (window.YPP?.featureManager) {
        window.YPP.featureManager.init(window.YPP.MainApp?.settings || {});
    }
}

/** Map a URL pathname to the matching lazy group name */
function _groupForPath(pathname: string): string | null {
    if (pathname.startsWith('/watch')) return 'watch';
    if (pathname.startsWith('/shorts')) return 'shorts';
    if (
        pathname === '/' ||
        pathname === '/index' ||
        pathname === '/feed/subscriptions' ||
        pathname.startsWith('/results') ||
        pathname.startsWith('/playlist') ||
        pathname.startsWith('/feed') ||
        pathname.startsWith('/@') ||
        pathname.startsWith('/channel') ||
        pathname.startsWith('/c/')
    ) return 'feed';
    return null;
}

const _groupMap: Record<string, Record<string, () => Promise<any>>> = {
    watch: watchModules as any,
    feed:  feedModules  as any,
    shorts: shortsModules as any,
};

/** Load the appropriate group for the current page, if not already loaded */
function _loadGroupForCurrentPage() {
    const group = _groupForPath(window.location.pathname);
    if (group && !_loadedGroups.has(group)) {
        _loadGroup(group, _groupMap[group]);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Register explicit core feature(s)
// ─────────────────────────────────────────────────────────────────────────────
import { KeyboardShortcuts } from '../core/events/keyboard-shortcuts.js';
if (window.YPP?.FeatureManager) {
    window.YPP.FeatureManager.register(KeyboardShortcuts);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Register all core (always-on) modules immediately
// ─────────────────────────────────────────────────────────────────────────────
_registerModules(coreModules);

// ─────────────────────────────────────────────────────────────────────────────
// 6. Load the group for the current page (cold-load: e.g. /watch opened directly)
// ─────────────────────────────────────────────────────────────────────────────
_loadGroupForCurrentPage();

// ─────────────────────────────────────────────────────────────────────────────
// 7. Listen for SPA navigations and load the matching group on demand
// ─────────────────────────────────────────────────────────────────────────────
window.addEventListener('yt-navigate-finish', _loadGroupForCurrentPage);

// ─────────────────────────────────────────────────────────────────────────────
// 8. Main App Bootstrapper
// ─────────────────────────────────────────────────────────────────────────────
import './main.ts';
