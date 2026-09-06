export class DropdownFilterFeature {
    constructor() {
        this.injectedFilters = new Map();
    }

    injectFilter(containerNode, filterType) {
        // Prevent duplicate injection
        if (this.injectedFilters.has(containerNode)) {
            return;
        }

        // Find the appropriate parent to inject into based on filter type
        let targetParent = containerNode;
        let insertBeforeNode = containerNode.firstChild;
        let itemsContainer = containerNode; // Where the actual list items are

        if (filterType === 'playlist') {
            targetParent = containerNode.querySelector('#header') || containerNode;
            itemsContainer = containerNode.querySelector('#playlists');
        } else if (filterType === 'notification') {
            targetParent = containerNode.closest('ytd-multi-page-menu-renderer, tp-yt-paper-dialog') || containerNode.parentElement;
            insertBeforeNode = targetParent.querySelector('div#container') || targetParent.firstChild;
        } else if (filterType === 'sidebar') {
            targetParent = containerNode.parentElement;
            insertBeforeNode = containerNode;
        }

        if (!itemsContainer || !targetParent) return;

        // Create the filter bar UI
        const filterContainer = document.createElement('div');
        filterContainer.className = `ypp-dropdown-filter-container ypp-filter-${filterType}`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'ypp-dropdown-filter-input';
        input.placeholder = 'Filter...';
        
        const clearBtn = document.createElement('button');
        clearBtn.className = 'ypp-dropdown-filter-clear';
        clearBtn.innerHTML = '×';
        clearBtn.style.display = 'none';

        filterContainer.appendChild(input);
        filterContainer.appendChild(clearBtn);

        // Inject the filter bar
        targetParent.insertBefore(filterContainer, insertBeforeNode);
        this.injectedFilters.set(containerNode, filterContainer);

        // Prevent dropdown from closing when interacting with the filter
        filterContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            input.focus();
        });

        // Filtering logic
        const filterItems = () => {
            const query = input.value.toLowerCase().trim();
            clearBtn.style.display = query.length > 0 ? 'block' : 'none';
            
            // Define selectors for items based on filter type
            let itemSelector = '';
            if (filterType === 'playlist') itemSelector = 'ytd-playlist-add-to-option-renderer';
            else if (filterType === 'notification') itemSelector = 'ytd-notification-renderer';
            else if (filterType === 'sidebar') itemSelector = 'ytd-guide-entry-renderer';

            const items = itemsContainer.querySelectorAll(itemSelector);
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (query === '' || text.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Specifically for sidebar, we might need to automatically click 'show more' if filtering
            if (filterType === 'sidebar' && query !== '') {
                const expander = itemsContainer.querySelector('ytd-guide-entry-renderer#expander-item');
                if (expander && expander.offsetParent !== null) { // if visible
                    expander.click();
                }
            }
        };

        input.addEventListener('input', filterItems);
        
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            input.value = '';
            filterItems();
            input.focus();
        });
    }

    removeAllFilters() {
        this.injectedFilters.forEach((filterContainer) => {
            filterContainer.remove();
        });
        this.injectedFilters.clear();
        
        // Reset all inline displays
        document.querySelectorAll('ytd-playlist-add-to-option-renderer, ytd-notification-renderer, ytd-guide-entry-renderer').forEach(el => {
            el.style.display = '';
        });
    }
}
