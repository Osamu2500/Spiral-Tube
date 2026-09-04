/**
 * @fileoverview
 * Channel Bar Controller
 * Responsible for maintaining the alignment of the Avatar, Channel Name,
 * Join Button, Subscribe Button, and Bell Icon on a single horizontal line.
 */
export class ChannelBarController {
    constructor(logger) {
        this.logger = logger;
        this.enabled = false;
        this.styleElement = null;
    }

    enable() {
        if (this.enabled) return;
        this.enabled = true;
        if (!this.styleElement) {
            this.styleElement = document.createElement("style");
            this.styleElement.id = "seamless-channel-bar-enforcer";
            this.styleElement.textContent = `
                ytd-watch-metadata #owner {
                    display: flex !important;
                    flex-direction: row !important;
                    flex-wrap: wrap !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    gap: 4px !important;
                    width: 100% !important;
                }
                ytd-watch-metadata ytd-video-owner-renderer {
                    flex: 1 1 auto !important;
                    min-width: 150px !important;
                    margin-right: 4px !important;
                }
                ytd-watch-metadata #subscribe-button {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    justify-content: flex-end !important;
                    flex-wrap: nowrap !important;
                    flex: 0 1 auto !important;
                    gap: 4px !important;
                }
                ytd-watch-metadata ytd-subscribe-button-renderer {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    flex-wrap: nowrap !important;
                    gap: 4px !important;
                }
                ytd-watch-metadata #sponsor-button {
                    margin: 0 !important;
                    flex-shrink: 1 !important;
                }
                ytd-watch-metadata #sponsor-button button, 
                ytd-watch-metadata #sponsor-button tp-yt-paper-button {
                    padding: 0 8px !important;
                }
                ytd-watch-metadata ytd-subscribe-button-renderer tp-yt-paper-button, 
                ytd-watch-metadata ytd-subscribe-button-renderer button {
                    margin: 0 !important;
                    flex-shrink: 1 !important;
                    padding: 0 8px !important;
                }
                ytd-watch-metadata ytd-subscription-notification-toggle-button-renderer {
                    margin: 0 !important;
                    flex-shrink: 0 !important;
                }
                ytd-watch-metadata ytd-subscription-notification-toggle-button-renderer button,
                ytd-watch-metadata ytd-subscription-notification-toggle-button-renderer yt-icon-button {
                    padding: 4px !important;
                }
            `;
            document.head.appendChild(this.styleElement);
        }
        this.logger.info("ChannelBarController Enabled");
    }

    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        if (this.styleElement) {
            this.styleElement.remove();
            this.styleElement = null;
        }
        this.logger.info("ChannelBarController Disabled");
    }
}
