const CONTEXT_MENU_ID = 'ypp-add-to-group';

export function initContextMenu() {
    if (!chrome.contextMenus) return;
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: CONTEXT_MENU_ID,
            title: "Add Channel to YPP Group",
            contexts: ["page", "link", "video"],
            documentUrlPatterns: ["*://www.youtube.com/*"]
        });
    });
}

if (chrome.contextMenus) {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === CONTEXT_MENU_ID) {
            const url = info.linkUrl || info.pageUrl || "";
            let channelIdentifier = null;
            
            try {
                const parsedUrl = new URL(url);
                const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
                
                if (pathParts[0] && pathParts[0].startsWith('@')) {
                    channelIdentifier = pathParts[0];
                } else if (pathParts[0] === 'channel' || pathParts[0] === 'c' || pathParts[0] === 'user') {
                    channelIdentifier = pathParts[1];
                }
            } catch (e) {
                console.error('[YPP] Failed to parse URL for context menu:', e);
            }

            if (tab && tab.id) {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'SHOW_GROUP_SELECTOR',
                    channelIdentifier: channelIdentifier,
                    url: url
                }).catch(e => {
                    console.error('[YPP] Failed to send context menu message:', e);
                });
            }
        }
    });
}
