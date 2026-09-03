import { setupUtilsMock } from './utils-mock.js';
import { setupIframeBridge, runIframeLogic } from './iframe-bridge.js';

(async () => {
    if (window.location.hostname.includes('youtube.com')) return;

    setupUtilsMock();

    await import('../ui/global-bar-ui.js');
    await import('../core/global-player-bar.js');
    
    try {
        await import('../../../pages/watch/player/media-effects/volume-booster/volume-booster.js');
        await import('../../../pages/watch/player/media-effects/volume-booster/volume-booster-ui.js');
        await import('../../../pages/watch/player/media-effects/video-filters/video-filters-presets.js');
        await import('../../../pages/watch/player/media-effects/video-filters/video-filters-overlay.js');
        await import('../../../pages/watch/player/media-effects/video-filters/video-filters-ui.js');
        await import('../../../pages/watch/player/media-effects/video-filters/video-filters.js');
        await import('../../../pages/watch/player/enhancements/video-speed-controller/video-speed-controller.js');
        // Will be updated to point to the correct domain memory path later
        await import('../domain/domain-memory.js');
        await import('../domain/domain-memory-ui.js');
        
        const volCss = (await import('../../../pages/watch/player/media-effects/volume-booster/volume-booster.css?inline')).default;
        const filterCss = (await import('../../../pages/watch/player/media-effects/video-filters/video-filters.css?inline')).default;
        const vscCss = (await import('../../../pages/watch/player/enhancements/video-speed-controller/video-speed-controller.css?inline')).default;
        if (window.YPP.Utils.addStyle) {
            window.YPP.Utils.addStyle(volCss, 'ypp-volume-booster-css');
            window.YPP.Utils.addStyle(filterCss, 'ypp-video-filters-css');
            window.YPP.Utils.addStyle(vscCss, 'ypp-video-speed-controller-css');
        }
    } catch (e) {
        window.YPP.Utils.log('Failed to load one or more optional features', 'Core', 'error');
    }

    let settings = {};
    let blocklist = [];
    try {
        const { DEFAULT_SETTINGS } = await import('../../../../shared/config/default-settings.js');
        settings = { ...DEFAULT_SETTINGS };
        const data = await chrome.storage.local.get(['settings', 'globalPlayerBarBlocklist']);
        Object.assign(settings, data.settings || {});
        blocklist = data.globalPlayerBarBlocklist || [];
    } catch (_) {}

    const instances = {};
    window.YPP.featureManager = {
        getFeature: (name) => instances[name]
    };

    if (window.YPP.features.VolumeBooster) {
        instances['volumeBoost'] = new window.YPP.features.VolumeBooster();
        instances['volumeBoost'].update(settings);
        if (settings.enableVolumeBoost) instances['volumeBoost'].enable();
    }
    if (window.YPP.features.VideoFilters) {
        instances['videoFilters'] = new window.YPP.features.VideoFilters();
        instances['videoFilters'].update(settings);
        if (settings.enableCinemaFilters) instances['videoFilters'].enable();
    }
    if (window.YPP.features.VideoSpeedController) {
        instances['videoSpeedController'] = new window.YPP.features.VideoSpeedController();
        instances['videoSpeedController'].update(settings);
        if (settings.enableCustomSpeed !== false) instances['videoSpeedController'].enable();
    }
    const isInsideIframe = window !== window.top;

    if (window.YPP.features.DomainMemory) {
        instances['domainMemory'] = new window.YPP.features.DomainMemory();
        instances['domainMemory'].init(instances, settings);
        if (isInsideIframe) instances['domainMemory']._readOnlyMode = true;
        await instances['domainMemory'].enable();
    }

    if (isInsideIframe) {
        runIframeLogic(instances);
        return; 
    }

    if (settings.enableGlobalPlayerBar === false) return;

    const hostname = window.location.hostname.replace(/^www\./, '');
    if (blocklist.includes(hostname)) return;

    const bar = new window.YPP.features.GlobalPlayerBar();
    if (bar.update) bar.update(settings);
    bar.isEnabled = false;
    
    if (settings.enableGlobalPlayerBar !== false) {
        await bar.enable();
        bar.isEnabled = true;
    }

    if (instances['domainMemory']) {
        const video = document.querySelector('video');
        if (video) instances['domainMemory'].restoreProfile(video, true);
    }

    setupIframeBridge(bar, instances);

    try {
        chrome.storage.onChanged.addListener(async (changes) => {
            let shouldBeEnabled = settings.enableGlobalPlayerBar !== false;
            let needsUpdate = false;

            if (changes.settings) {
                const newSettings = changes.settings.newValue || {};
                settings = { ...settings, ...newSettings };
                shouldBeEnabled = settings.enableGlobalPlayerBar !== false;
                needsUpdate = true;

                if (bar.update) bar.update(newSettings);

                if (instances['volumeBoost']) instances['volumeBoost'].update(newSettings);
                if (instances['videoFilters']) instances['videoFilters'].update(newSettings);
                if (instances['videoSpeedController']) instances['videoSpeedController'].update(newSettings);
            }

            if (changes.globalPlayerBarBlocklist) {
                blocklist = changes.globalPlayerBarBlocklist.newValue || [];
                needsUpdate = true;
            }

            if (!needsUpdate) return;

            const hostname = window.location.hostname.replace(/^www\./, '');
            if (blocklist.includes(hostname)) {
                shouldBeEnabled = false;
            }

            if (shouldBeEnabled && !bar.isEnabled) {
                await bar.enable();
                bar.isEnabled = true;
            } else if (!shouldBeEnabled && bar.isEnabled) {
                await bar.disable();
                bar.isEnabled = false;
            }
        });
    } catch (_) {}
})();
