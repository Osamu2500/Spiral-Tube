const CONTEXT_MENU_ID = 'ypp-add-to-group';
const CONTEXT_MENU_POPUP_ID = 'ypp-preview-popup';

export function initContextMenu() {
    if (!chrome.contextMenus) return;
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: CONTEXT_MENU_ID,
            title: "Add Channel to YPP Group",
            contexts: ["page", "link", "video"],
            documentUrlPatterns: ["*://www.youtube.com/*"]
        });
        
        chrome.contextMenus.create({
            id: CONTEXT_MENU_POPUP_ID,
            title: "Open in Popup Player",
            contexts: ["page", "link", "video", "selection", "image"],
            documentUrlPatterns: ["*://*.youtube.com/*", "*://youtube.com/*", "*://youtu.be/*"]
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
        } else if (info.menuItemId === CONTEXT_MENU_POPUP_ID) {
            const url = info.linkUrl || info.srcUrl || info.selectionText || info.pageUrl || "";
            if (tab && tab.id && url) {
                // Determine video ID if possible, then send message to content script
                chrome.tabs.sendMessage(tab.id, {
                    action: 'openPopup',
                    sourceUrl: url
                }).catch(e => {
                    console.error('[YPP] Failed to send popup preview message:', e);
                });
            }
        }
    });
}

