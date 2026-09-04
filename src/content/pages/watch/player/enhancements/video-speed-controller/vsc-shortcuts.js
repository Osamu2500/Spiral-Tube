/**
 * Video Speed Controller: Shortcuts
 * Manages global and local keyboard shortcuts for controlling video speed,
 * scrubbing, and toggling the UI. Ensures inputs are not hijacked when typing.
 */
export class VscShortcuts {
    constructor(vsc) {
        this.vsc = vsc;
        this._localHotkeyListener = null;
    }

    getShortcuts() {
        if (!this.vsc.settings) return [];
        // Only return defaults if the user has literally NEVER touched the settings (undefined).
        // If it's an empty array `[]`, it means they explicitly deleted all shortcuts, so respect that.
        if (this.vsc.settings.vscShortcuts === undefined) {
            return [
                { action: 'showHide', key: 'V', value: 0 },
                { action: 'decrease', key: 'Z', value: 0.25 },
                { action: 'increase', key: 'X', value: 0.25 },
                { action: 'rewind', key: 'W', value: 10 },
                { action: 'advance', key: 'E', value: 10 },
                { action: 'reset', key: 'A', value: 1.0 }
            ];
        }
        return this.vsc.settings.vscShortcuts || [];
    }

    register() {
        const shortcuts = this.getShortcuts();
        if (!shortcuts || shortcuts.length === 0) return;

        const bindings = [];
        for (const sc of shortcuts) {
            if (!sc.key) continue;
            bindings.push({
                combo: sc.key,
                callback: (e) => {
                    // Prevent hijacking shortcuts when typing in search box or comments
                    const path = e.composedPath ? e.composedPath() : (e.path || [e.target]);
                    for (const node of path) {
                        if (node && node.tagName) {
                            const tag = node.tagName.toUpperCase();
                            if (tag === 'INPUT' || tag === 'TEXTAREA' || node.isContentEditable) {
                                return;
                            }
                        }
                    }
                    if (window.YPP.utils?.isInputFocused?.()) {
                        return;
                    }

                    let video = this.vsc._lastActiveVideo;
                    if (!video || !video.isConnected) {
                        video = this.vsc.findLargestVideo();
                    }
                    if (!video) return;

                    if (!this.vsc.controllers.has(video)) {
                        this.vsc.ui.attachToVideo(video);
                    }

                    const state = this.vsc.controllers.get(video);
                    if (state) state.lastInteraction = Date.now();

                    const val = parseFloat(sc.value) || 0;
                    switch (sc.action) {
                        case 'showHide':
                            const controllerEl = video.parentElement?.querySelector('ypp-vsc-controller');
                            if (controllerEl) {
                                controllerEl.style.display = controllerEl.style.display === 'none' ? 'block' : 'none';
                            }
                            break;
                        case 'decrease':
                            this.vsc.adjustSpeed(video, -val);
                            break;
                        case 'increase':
                            this.vsc.adjustSpeed(video, val);
                            break;
                        case 'rewind':
                            video.currentTime -= val;
                            break;
                        case 'advance':
                            video.currentTime += val;
                            break;
                        case 'reset':
                        case 'preferred':
                            this.vsc.setSpeed(video, val);
                            this.vsc.ui.showOSDFlash(video, val.toFixed(2) + 'x');
                            break;
                        case 'mute':
                            video.muted = !video.muted;
                            break;
                        case 'decreaseVolume':
                            video.volume = Math.max(0, video.volume - 0.1);
                            break;
                        case 'increaseVolume':
                            video.volume = Math.min(1, video.volume + 0.1);
                            break;
                        case 'pause':
                            if (video.paused) video.play();
                            else video.pause();
                            break;
                        case 'setMarker':
                            this.vsc.markers.set(video, video.currentTime);
                            break;
                        case 'jumpMarker':
                            if (this.vsc.markers.has(video)) {
                                video.currentTime = this.vsc.markers.get(video);
                            }
                            break;
                    }

                    this.vsc.ui.showController(video);
                    this.vsc.ui.hideControllerDelay(video);
                }
            });
        }
        if (window.YPP.hotkeysManager) {
            window.YPP.hotkeysManager.register('vsc', bindings);
        } else {
            // Local fallback for external sites
            if (this._localHotkeyListener) {
                this.vsc.removeListener(document, 'keydown', this._localHotkeyListener, true);
            }
            this._localHotkeyListener = (e) => {
                const path = e.composedPath ? e.composedPath() : (e.path || [e.target]);
                for (const node of path) {
                    if (node && node.tagName) {
                        const tag = node.tagName.toUpperCase();
                        if (tag === 'INPUT' || tag === 'TEXTAREA' || node.isContentEditable) {
                            return;
                        }
                    }
                }
                if (window.YPP.utils?.isInputFocused?.()) {
                    return;
                }

                const key = e.key.toUpperCase();
                const combo = (e.shiftKey ? 'SHIFT+' : '') + key;
                const binding = bindings.find(b => b.combo.toUpperCase() === combo);
                if (binding) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    binding.callback(e);
                }
            };
            this.vsc.addListener(document, 'keydown', this._localHotkeyListener, true);
        }
    }

    unregister() {
        if (window.YPP.hotkeysManager) {
            window.YPP.hotkeysManager.unregister('vsc');
        } else if (this._localHotkeyListener) {
            this.vsc.removeListener(document, 'keydown', this._localHotkeyListener, true);
            this._localHotkeyListener = null;
        }
    }
}
