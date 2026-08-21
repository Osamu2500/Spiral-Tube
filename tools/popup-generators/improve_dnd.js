const fs = require('fs');
let uiJs = fs.readFileSync('src/popup/popup-ui.js', 'utf8');

const newDnd = `initDragAndDrop(doc) {
    let draggedSection = null;

    // Load saved order
    chrome.storage.local.get(['sectionOrder'], (data) => {
        const orderMap = data.sectionOrder || {};
        const tabs = doc.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            if (orderMap[tab.id]) {
                const savedOrder = orderMap[tab.id];
                const sections = Array.from(tab.querySelectorAll('.settings-section'));
                sections.sort((a, b) => {
                    const titleA = a.querySelector('.section-title')?.textContent.trim() || '';
                    const titleB = b.querySelector('.section-title')?.textContent.trim() || '';
                    let idxA = savedOrder.indexOf(titleA);
                    let idxB = savedOrder.indexOf(titleB);
                    if (idxA === -1) idxA = 999;
                    if (idxB === -1) idxB = 999;
                    return idxA - idxB;
                });
                sections.forEach(sec => tab.appendChild(sec));
            }
        });
    });

    const sections = doc.querySelectorAll('.settings-section');
    sections.forEach(section => {
        const handle = section.querySelector('.drag-handle');
        if (!handle) return;
        
        handle.style.cursor = 'grab';
        handle.style.opacity = '0.5';
        handle.addEventListener('mouseenter', () => handle.style.opacity = '1');
        handle.addEventListener('mouseleave', () => handle.style.opacity = '0.5');
        
        handle.addEventListener('mousedown', () => {
            handle.style.cursor = 'grabbing';
            section.setAttribute('draggable', 'true');
        });
        handle.addEventListener('mouseup', () => {
            handle.style.cursor = 'grab';
            section.removeAttribute('draggable');
        });
        section.addEventListener('mouseleave', () => section.removeAttribute('draggable'));

        section.addEventListener('dragstart', (e) => {
            draggedSection = section;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', '');
            
            setTimeout(() => {
                section.style.opacity = '0.4';
                section.style.transform = 'scale(0.98)';
                section.style.boxShadow = 'none';
            }, 0);
        });

        section.addEventListener('dragend', () => {
            if (draggedSection) {
                draggedSection.style.opacity = '1';
                draggedSection.style.transform = 'none';
                draggedSection.style.boxShadow = '';
            }
            draggedSection = null;
            section.removeAttribute('draggable');
            if (handle) handle.style.cursor = 'grab';
            
            // Save order
            const orderMap = {};
            doc.querySelectorAll('.tab-content').forEach(tab => {
                const secs = Array.from(tab.querySelectorAll('.settings-section'));
                const order = secs.map(s => s.querySelector('.section-title')?.textContent.trim() || '').filter(Boolean);
                if (order.length) orderMap[tab.id] = order;
            });
            chrome.storage.local.set({ sectionOrder: orderMap });
        });

        section.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedSection || draggedSection === section) return;
            const bounding = section.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            
            if (e.clientY - offset > 0) {
                section.style.boxShadow = '0 2px 0 0 var(--accent-primary)';
            } else {
                section.style.boxShadow = '0 -2px 0 0 var(--accent-primary)';
            }
        });

        section.addEventListener('dragleave', (e) => {
            section.style.boxShadow = '';
        });

        section.addEventListener('drop', (e) => {
            e.preventDefault();
            section.style.boxShadow = '';
            if (!draggedSection || draggedSection === section) return;
            
            const bounding = section.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            
            if (e.clientY - offset > 0) {
                section.after(draggedSection);
            } else {
                section.before(draggedSection);
            }
        });
    });
}`;

let startIdx = uiJs.indexOf('initDragAndDrop(doc) {');
let endIdx = uiJs.lastIndexOf('}');
if (startIdx !== -1 && endIdx !== -1) {
    uiJs = uiJs.substring(0, startIdx) + newDnd + '\n' + uiJs.substring(endIdx);
    fs.writeFileSync('src/popup/popup-ui.js', uiJs);
    console.log("Successfully replaced initDragAndDrop using substring!");
} else {
    console.log("Failed to find boundaries.");
}
