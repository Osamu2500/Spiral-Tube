import '../../core/system/base-feature.js';
import { bootHiderEngine } from './core/bootstrapper.js';
import { initPrefs } from './core/state-manager.js';

export class DeclutterFeature extends window.YPP.features.BaseFeature {
  static featureId = 'declutterEngine';
  static executionPhase = 'idle';

  constructor(name) {
    super(name || 'Declutter Engine');
  }

  async enable() {
    console.error("[DECLUTTER DEBUG] enable() called!");
    await super.enable();
    console.error("[DECLUTTER DEBUG] super.enable() finished");
    
    // FeatureManager can boot features before the body exists on cold loads.
    // We MUST wait for the body before injecting CSS classes.
    if (!document.body) {
      await new Promise(resolve => {
        const observer = new MutationObserver(() => {
          if (document.body) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(document.documentElement, { childList: true });
      });
    }

    console.error("[DECLUTTER DEBUG] document.body exists, calling initPrefs()");
    await initPrefs();
    console.error("[DECLUTTER DEBUG] initPrefs() finished, calling bootHiderEngine()");
    bootHiderEngine();
    console.error("[DECLUTTER DEBUG] bootHiderEngine() finished");
    
    // Trigger on first load
    this.onPageChange(window.location.pathname);
  }

  onPageChange(url) {
    // Rely on bootstrapper's exported startHiding
    if (window.declutterStartHiding) {
      window.declutterStartHiding(url);
    }
  }

  async disable() {
    await super.disable();
    // In a fully integrated version, we would remove listeners here.
    // For now, the legacy settings 'extensionEnabled' handles this.
  }
}
