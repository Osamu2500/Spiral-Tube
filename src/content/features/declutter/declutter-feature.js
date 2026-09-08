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
    await super.enable();
    await initPrefs();
    bootHiderEngine();
  }

  async disable() {
    await super.disable();
    // In a fully integrated version, we would remove listeners here.
    // For now, the legacy settings 'extensionEnabled' handles this.
  }
}
