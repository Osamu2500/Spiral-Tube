/**
 * Channel Health Feature Setup
 * Owns: Initializing the Channel Health Dashboard and injecting its launch button.
 * Targets: Subscriptions page (#ypp-subscriptions-bar).
 * Does not affect functionality outside the Channel Health feature.
 */
import '../../../../core/system/base-feature.js';
import { ChannelHealthUI } from './channel-health-ui.js';
import './channel-health.css';

export class ChannelHealth extends window.YPP.features.BaseFeature {
    static featureId = 'channelHealth';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'enableChannelHealth'; }
    constructor() { super('ChannelHealth'); }

    async enable() {
        await super.enable();
        this.utils?.log('Starting Channel Health', 'ChannelHealth');

        this.observer.register('channelHealthBtn', '#ypp-subscriptions-bar', () => {
            this.injectButton();
        });
        this.observer.start();
        
        if (window.location.pathname === '/feed/subscriptions') {
            this.injectButton();
        }
    }

    async disable() {
        await super.disable();
        this.observer.unregister('channelHealthBtn');
        document.getElementById('ypp-channel-health-btn')?.remove();
    }

    injectButton() {
        if (document.getElementById('ypp-channel-health-btn')) return;
        const container = document.getElementById('ypp-subscriptions-bar');
        if (!container) return;

        const btn = document.createElement('button');
        btn.id = 'ypp-channel-health-btn';
        btn.className = 'ypp-btn-primary';
        btn.style.cssText = 'background: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); padding: 8px 16px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-left: auto; display: flex; align-items: center; gap: 8px;';
        
        btn.innerHTML = String.raw`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> Channel Health`;
        
        btn.addEventListener('mouseover', () => {
            btn.style.background = 'rgba(99, 102, 241, 0.2)';
            btn.style.transform = 'translateY(-1px)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = 'rgba(99, 102, 241, 0.1)';
            btn.style.transform = 'translateY(0)';
        });
        
        this.addListener(btn, 'click', () => {
            ChannelHealthUI.openModal();
        });
        
        container.appendChild(btn);
    }
}
