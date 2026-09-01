/**
 * @fileoverview
 * DOM Transaction Manager
 * Handles robust movement of DOM nodes, ensuring we can always revert changes
 * even if YouTube's Single Page Application (SPA) attempts to destroy them.
 */
export class DOMTransactionManager {
    constructor(logger) {
        this.logger = logger;
        this.history = new Map();
    }

    createPlaceholder(identifier) {
        const placeholder = document.createElement("div");
        placeholder.id = "seamless-tx-placeholder-" + identifier;
        placeholder.style.display = "none";
        placeholder.style.width = "0px";
        placeholder.style.height = "0px";
        placeholder.dataset.seamlessPlaceholder = "true";
        placeholder.dataset.txId = identifier;
        return placeholder;
    }

    moveNode(txId, node, newParent) {
        if (!node || !newParent) {
            this.logger.warn("Transaction " + txId + " failed: Missing node or parent");
            return false;
        }
        if (node.parentElement === newParent) return true;

        try {
            const placeholder = this.createPlaceholder(txId);
            const originalParent = node.parentElement;
            const originalNextSibling = node.nextSibling;

            this.history.set(txId, {
                node: new WeakRef(node),
                originalParent: originalParent ? new WeakRef(originalParent) : null,
                originalNextSibling: originalNextSibling ? new WeakRef(originalNextSibling) : null,
                placeholder: new WeakRef(placeholder),
                newParent: new WeakRef(newParent),
                timestamp: Date.now()
            });

            if (originalParent) originalParent.insertBefore(placeholder, node);
            newParent.appendChild(node);
            this.logger.info("Transaction " + txId + " completed successfully.");
            return true;
        } catch (error) {
            this.logger.error("Transaction " + txId + " threw a fatal error during move", error);
            return false;
        }
    }

    rollback(txId) {
        const tx = this.history.get(txId);
        if (!tx) return false;

        try {
            const node = tx.node.deref();
            const originalParent = tx.originalParent ? tx.originalParent.deref() : null;
            const originalNextSibling = tx.originalNextSibling ? tx.originalNextSibling.deref() : null;
            const placeholder = tx.placeholder.deref();

            if (!node) {
                this.history.delete(txId);
                return true;
            }

            if (placeholder && placeholder.parentElement) {
                placeholder.parentElement.insertBefore(node, placeholder);
                placeholder.remove();
            } else if (originalParent) {
                originalParent.insertBefore(node, originalNextSibling);
            }

            this.history.delete(txId);
            return true;
        } catch (error) {
            this.logger.error("Failed to rollback transaction " + txId, error);
            return false;
        }
    }

    rollbackAll() {
        const keys = Array.from(this.history.keys());
        keys.reverse().forEach(txId => this.rollback(txId));
    }
}
