export const PopupPhysics = {
    _attachPhysics() {
        // Top bar: drag
        this.topBar.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button, .ytpop-dropdown-menu, .ytpop-custom-dropdown')) return;
            e.preventDefault();
            this.state.isDragging = true;
            this.dragOffset.x = e.clientX - this.state.x;
            this.dragOffset.y = e.clientY - this.state.y;
            this.iframe.style.pointerEvents = 'none';
        });

        // Top bar: double-click to maximize/restore
        this.topBar.addEventListener('dblclick', (e) => {
            if (e.target.closest('button, .ytpop-dropdown-menu, .ytpop-custom-dropdown')) return;
            e.preventDefault();
            this._toggleMaximize();
        });

        if (this.physicsController) this.physicsController.abort();
        this.physicsController = new AbortController();
        const signal = this.physicsController.signal;

        document.addEventListener('pointermove',   this._boundPointerMove, { signal });
        document.addEventListener('pointerup',     this._boundPointerUp, { signal });
        document.addEventListener('pointercancel', this._boundPointerUp, { signal });
    },

    _startResize(e, dir) {
        e.preventDefault();
        e.stopPropagation();
        this.state.isResizing = true;
        this.state.resizeDir  = dir;
        this.resizeStart = {
            w: this.state.width,  h: this.state.height,
            startX: this.state.x, startY: this.state.y,
            mouseX: e.clientX,    mouseY: e.clientY,
        };
        this.iframe.style.pointerEvents = 'none';
    },

    _onPointerMove(e) {
        if (this.state.isDragging) {
            let x = e.clientX - this.dragOffset.x;
            let y = e.clientY - this.dragOffset.y;

            // Clamp to viewport
            x = Math.max(0, Math.min(x, window.innerWidth  - this.state.width));
            y = Math.max(0, Math.min(y, window.innerHeight - this.state.height));

            this.state.x = x;
            this.state.y = y;
            this.state.hasBeenMoved = true;
            this._applyTransform();

        } else if (this.state.isResizing) {
            const dx  = e.clientX - this.resizeStart.mouseX;
            const dy  = e.clientY - this.resizeStart.mouseY;
            const dir = this.state.resizeDir;
            const MIN_W = 300;
            const MIN_H = 169;

            let newW = this.resizeStart.w;
            let newH = this.resizeStart.h;
            let newX = this.resizeStart.startX;
            let newY = this.resizeStart.startY;

            if (dir.includes('e')) newW += dx;
            if (dir.includes('s')) newH += dy;
            if (dir.includes('w')) { newW -= dx; if (newW >= MIN_W) newX += dx; }
            if (dir.includes('n')) { newH -= dy; if (newH >= MIN_H) newY += dy; }

            // Corner: lock to ratio
            if (dir.length === 2) {
                const chromeHeight = (this.topBar ? this.topBar.offsetHeight : 40) + (this.bottomBar ? this.bottomBar.offsetHeight : 55);
                const ratioVal = this.state.ratio ? this._parseRatio(this.state.ratio) : (16/9);
                newH = (newW / ratioVal) + chromeHeight;
                if (dir.includes('n')) {
                    newY = this.resizeStart.startY + (this.resizeStart.h - newH);
                }
            }

            if (newW >= MIN_W) { this.state.width = newW; this.state.x = newX; }
            if (newH >= MIN_H) { this.state.height = newH; this.state.y = newY; }

            this.container.style.width  = `${this.state.width}px`;
            this.container.style.height = `${this.state.height}px`;
            this._applyTransform();
        }
    },

    _onPointerUp() {
        if (this.state.isDragging || this.state.isResizing) {
            const wasResizing = this.state.isResizing;
            this.state.isDragging = false;
            this.state.isResizing = false;
            if (this.iframe) this.iframe.style.pointerEvents = 'auto';
            this._saveState();
            // Tell the bridge to reflow the YouTube player inside the iframe
            if (wasResizing) this._sendToIframe({ command: 'reflow' });
        }
    },

    _applyTransform() {
        requestAnimationFrame(() => {
            if (this.container) {
                this.container.style.transform = `translate(${this.state.x}px,${this.state.y}px)`;
            }
        });
    }
};
