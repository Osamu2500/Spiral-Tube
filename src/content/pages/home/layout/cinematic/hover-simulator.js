export class HoverSimulator {
    static simulateHover(controller, element) {
        if (!element) return Promise.reject('No element provided');

        document.querySelectorAll('.netflix-active-preview').forEach(el => {
            if (el !== element) {
                el._isNetflixHeroPreview = false;
            }
        });
        element._isNetflixHeroPreview = true;
        element.classList.add('netflix-active-preview');

        if (!element._hoverLock) {
            const blockLeave = (e) => {
                if (element._isNetflixHeroPreview) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            };
            element.addEventListener('mouseleave', blockLeave, true);
            element.addEventListener('mouseout', blockLeave, true);
            const thumb = element.querySelector('#thumbnail, ytd-thumbnail, a#thumbnail');
            if (thumb) {
                thumb.addEventListener('mouseleave', blockLeave, true);
                thumb.addEventListener('mouseout', blockLeave, true);
            }
            element._hoverLock = true;
        }

        const MAX_RETRIES = 3;
        const RETRY_DELAY = 250;

        const attemptHover = (retryCount = 0) => {
            return new Promise(resolve => {
                const thumbnailContainer = element.querySelector('#thumbnail');

                if (!thumbnailContainer && retryCount < MAX_RETRIES) {
                    setTimeout(() => {
                        resolve(attemptHover(retryCount + 1));
                    }, RETRY_DELAY);
                    return;
                }

                if (!thumbnailContainer) {
                    resolve();
                    return;
                }

                setTimeout(() => {
                    const targets = [
                        element,
                        element.querySelector('ytd-thumbnail'),
                        element.querySelector('#thumbnail'),
                        element.querySelector('a#thumbnail'),
                        element.querySelector('.yt-lockup-view-model-wiz__content-image'),
                        element.querySelector('yt-image')
                    ].filter(Boolean);

                    const eventTypes = [
                        'pointerover',
                        'pointerenter',
                        'pointermove',
                        'mouseover',
                        'mouseenter',
                        'mousemove'
                    ];

                    eventTypes.forEach(eventType => {
                        targets.forEach(target => {
                            const rect = target.getBoundingClientRect();
                            const clientX = rect.width > 0 ? rect.left + rect.width / 2 : 200;
                            const clientY = rect.height > 0 ? rect.top + rect.height / 2 : 450;
                            try {
                                target.dispatchEvent(
                                    new PointerEvent(eventType, {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window,
                                        pointerId: 1,
                                        pointerType: 'mouse',
                                        isPrimary: true,
                                        clientX,
                                        clientY
                                    })
                                );
                            } catch (e) {}
                            try {
                                target.dispatchEvent(
                                    new MouseEvent(eventType, {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window,
                                        clientX,
                                        clientY
                                    })
                                );
                            } catch (e) {}
                        });
                    });

                    setTimeout(() => {
                        if (controller && !controller.state.isMuted && typeof controller.syncMuteState === 'function') {
                            controller.syncMuteState();
                        }
                        if (controller && typeof controller.updateMuteButtonVisibility === 'function') {
                            controller.updateMuteButtonVisibility();
                        }
                        resolve();
                    }, 1000);
                }, 100);
            });
        };

        return attemptHover();
    }

    static startActiveHoverSimulation(controller, element, observerManager) {
        if (controller.state.activeHoverInterval) {
            clearInterval(controller.state.activeHoverInterval);
            controller.state.activeHoverInterval = null;
        }
        if (!element) return;

        element.classList.add('netflix-active-preview');
        element._isNetflixHeroPreview = true;

        this.simulateHover(controller, element);

        controller.state.activeHoverInterval = observerManager.addInterval(setInterval(() => {
            if (!element || !element.classList.contains('netflix-active-preview')) {
                if (controller.state.activeHoverInterval) {
                    clearInterval(controller.state.activeHoverInterval);
                    controller.state.activeHoverInterval = null;
                }
                return;
            }
            const hasPreview = document.querySelector('ytd-video-preview[active][playing]:not([hidden])');
            const targets = [
                element,
                element.querySelector('ytd-thumbnail'),
                element.querySelector('#thumbnail'),
                element.querySelector('a#thumbnail'),
                element.querySelector('.yt-lockup-view-model-wiz__content-image'),
                element.querySelector('yt-image')
            ].filter(Boolean);

            const events = hasPreview
                ? ['pointermove', 'mousemove']
                : ['pointerover', 'pointerenter', 'pointermove', 'mouseover', 'mouseenter', 'mousemove'];

            events.forEach(eventType => {
                targets.forEach(target => {
                    const rect = target.getBoundingClientRect();
                    const clientX = rect.width > 0 ? rect.left + rect.width / 2 : 200;
                    const clientY = rect.height > 0 ? rect.top + rect.height / 2 : 450;
                    try {
                        target.dispatchEvent(
                            new PointerEvent(eventType, {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                pointerId: 1,
                                pointerType: 'mouse',
                                isPrimary: true,
                                clientX,
                                clientY
                            })
                        );
                    } catch (e) {}
                    try {
                        target.dispatchEvent(
                            new MouseEvent(eventType, {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                clientX,
                                clientY
                            })
                        );
                    } catch (e) {}
                });
            });
        }, 1000));
    }
}
