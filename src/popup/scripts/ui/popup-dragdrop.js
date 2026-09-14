export function initSidebarDragAndDrop(doc) {
    const navContainer = doc.querySelector('.nav-items');
    if (!navContainer || navContainer._yppDragDropInit) return;
    navContainer._yppDragDropInit = true;

    const navItems = Array.from(navContainer.querySelectorAll('.nav-item'));
    
    // Load saved order
    chrome.storage.local.get('sidebar_order', (data) => {
        if (data.sidebar_order && Array.isArray(data.sidebar_order)) {
            const currentTabs = navItems.map(item => item.getAttribute('data-tab'));
            // Ensure all saved tabs still exist and all current tabs are accounted for
            const orderedItems = [];
            data.sidebar_order.forEach(tab => {
                const item = navItems.find(n => n.getAttribute('data-tab') === tab);
                if (item) orderedItems.push(item);
            });
            navItems.forEach(item => {
                if (!orderedItems.includes(item)) orderedItems.push(item);
            });

            orderedItems.forEach(item => navContainer.appendChild(item));
        }
    });

    let draggedItem = null;

    navContainer.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.nav-item');
        if (!item) return;
        draggedItem = item;
        setTimeout(() => item.classList.add('dragging'), 0);
        e.dataTransfer.effectAllowed = 'move';
    });

    navContainer.addEventListener('dragend', (e) => {
        const item = e.target.closest('.nav-item');
        if (!item) return;
        item.classList.remove('dragging');
        draggedItem = null;
        saveOrder();
    });

    navContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(navContainer, e.clientY);
        if (draggedItem) {
            if (afterElement == null) {
                navContainer.appendChild(draggedItem);
            } else {
                navContainer.insertBefore(draggedItem, afterElement);
            }
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.nav-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveOrder() {
        const currentItems = Array.from(navContainer.querySelectorAll('.nav-item'));
        const order = currentItems.map(item => item.getAttribute('data-tab'));
        chrome.storage.local.set({ sidebar_order: order });
    }

    // Make nav items draggable
    navItems.forEach(item => {
        item.setAttribute('draggable', 'true');
    });
}
