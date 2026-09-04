/**
 * Watch Page Player — Overflow Menu Manager
 * Purpose: Manages the "More Actions" gear/overflow menu for custom player bar buttons.
 * Scope: Handles the rendering and toggling of the overflow panel inside the YouTube player.
 * Impact: Does not affect native YouTube menus, localized to custom features.
 */
export class PlayerBarOverflow {
    constructor(controlsHelper) {
        this.controlsHelper = controlsHelper;
        this.container = null;
        this.toggle = null;
        this._resizeObserver = null;
        this._handleDocumentClick = null;
        this.createOverflowMenu();
    }

    createOverflowMenu() {
        this.container = document.createElement('div');
        this.container.className = 'ypp-overflow-menu';
        
        this.container.style.cssText = `
            display: flex;
            flex-direction: column;
            position: fixed;
            background: rgba(18, 18, 18, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 8px 0;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            z-index: 9999999;
            min-width: 180px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            pointer-events: none;
        `;
        
        const overflowPanel = document.createElement('div');
        overflowPanel.className = 'ypp-overflow-panel';
        overflowPanel.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;
        this.container.appendChild(overflowPanel);
        this.panel = overflowPanel;
        this.hasItems = false;
        
        return this.container;
    }

    appendToOverflow(label, svgHtml, onClickAction) {
        const menuItem = document.createElement('div');
        menuItem.className = 'ypp-overflow-item';
        menuItem.setAttribute('role', 'menuitem');
        menuItem.setAttribute('tabindex', '0');
        
        menuItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 16px;
            cursor: pointer;
            color: #fff;
            font-size: 13px;
            font-family: "YouTube Noto", Roboto, Arial, sans-serif;
            transition: background 0.15s ease;
        `;
        
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'transparent';
        });
        
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex-shrink: 0;';
        iconDiv.innerHTML = svgHtml; 
        
        const svgs = iconDiv.querySelectorAll('svg');
        svgs.forEach(svg => {
            svg.style.width = '24px';
            svg.style.height = '24px';
            svg.setAttribute('fill', '#fff');
        });
        
        const labelDiv = document.createElement('div');
        labelDiv.style.flex = '1';
        labelDiv.textContent = label;
        
        menuItem.appendChild(iconDiv);
        menuItem.appendChild(labelDiv);
        let toastTimeout1, toastTimeout2;
        
        menuItem.addEventListener('click', (e) => {
            onClickAction();
            
            if (!menuItem._originalSvg) menuItem._originalSvg = iconDiv.innerHTML;
            
            if (toastTimeout1) clearTimeout(toastTimeout1);
            if (toastTimeout2) clearTimeout(toastTimeout2);
            
            iconDiv.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="#4CAF50"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;
            iconDiv.style.transform = 'scale(1.2)';
            iconDiv.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            toastTimeout1 = setTimeout(() => {
                iconDiv.style.transform = 'scale(1)';
            }, 150);

            toastTimeout2 = setTimeout(() => {
                iconDiv.innerHTML = menuItem._originalSvg;
                const restoredSvgs = iconDiv.querySelectorAll('svg');
                restoredSvgs.forEach(svg => {
                    svg.style.width = '24px';
                    svg.style.height = '24px';
                    svg.setAttribute('fill', '#fff');
                });
                this.hideMenu();
            }, 400); 
        });
        
        this.panel.appendChild(menuItem);
        this.hasItems = true;
    }
    
    hideMenu() {
        if (this.container) {
            this.container.style.opacity = '0';
            this.container.style.transform = 'translateY(10px)';
            this.container.style.pointerEvents = 'none';
        }
    }

    createToggleButton(targetContainer) {
        if (!this.hasItems) return null;
        
        const gearSvg = `<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;
        this.toggle = this.controlsHelper.createButton(gearSvg, 'More Extension Actions', (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            const isOpening = this.container.style.opacity === '0' || this.container.style.opacity === '';
            
            if (isOpening) {
                const rect = this.toggle.getBoundingClientRect();
                this.container.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
                this.container.style.right = (window.innerWidth - rect.right - 20) + 'px';
                this.container.style.opacity = '1';
                this.container.style.transform = 'translateY(0)';
                this.container.style.pointerEvents = 'auto';
            } else {
                this.hideMenu();
            }
        });
        
        targetContainer.appendChild(this.toggle);
        document.body.appendChild(this.container);
        
        this.setupListeners();
        return this.toggle;
    }
    
    setupListeners() {
        if (!this._handleDocumentClick) {
            this._handleDocumentClick = (e) => {
                if (this.container && this.toggle) {
                    if (!this.container.contains(e.target) && !this.toggle.contains(e.target)) {
                        this.hideMenu();
                    }
                }
            };
        }
        document.removeEventListener('click', this._handleDocumentClick);
        document.addEventListener('click', this._handleDocumentClick);
        
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
        this._resizeObserver = new ResizeObserver(() => {
            if (this.container && this.container.style.opacity === '1') {
                const rect = this.toggle.getBoundingClientRect();
                this.container.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
                this.container.style.right = (window.innerWidth - rect.right - 20) + 'px';
            }
        });
        this._resizeObserver.observe(document.body);
    }

    destroy() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._handleDocumentClick) {
            document.removeEventListener('click', this._handleDocumentClick);
            this._handleDocumentClick = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        if (this.toggle) {
            this.toggle.remove();
            this.toggle = null;
        }
    }
}
