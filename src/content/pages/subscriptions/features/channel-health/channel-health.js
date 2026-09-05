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
        btn.style.cssText = 'background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.1); padding: 8px 18px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-left: auto; display: flex; align-items: center; gap: 8px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.1);';
        
        btn.innerHTML = String.raw`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> Channel Health`;
        
        btn.addEventListener('mouseover', () => {
            btn.style.background = 'rgba(255,255,255,0.1)';
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            btn.style.borderColor = 'rgba(255,255,255,0.2)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            btn.style.borderColor = 'rgba(255,255,255,0.1)';
        });
        
        this.addListener(btn, 'click', () => {
            ChannelHealthUI.openModal();
        });
        
        container.appendChild(btn);
    }
}
