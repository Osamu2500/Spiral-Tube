import { ICONS, P } from '../../ui/popup-icons.js';

export const getFloatingPlayerTab = (t) => ({
    id: 'floating-player',
    label: 'Floating Player', // no i18n key needed for now
    icon: ICONS.player,
    sections: [
      {
        title: 'Quick Access',
        icon: ICONS.player,
        color: '#3b82f6',
        items: [
          {
            type: 'toggle',
            id: 'quickAccessVisibilityEditor',
            label: 'Show Quick Access',
            desc: 'Show floating player quick access button',
            icon: ICONS.visible,
          },
          {
            type: 'toggle',
            id: 'quickAccessPopupMode',
            label: 'Popup Mode',
            desc: 'Enable popup mode',
            icon: ICONS.window,
          },
          {
            type: 'toggle',
            id: 'quickAccessPlayerOnly',
            label: 'Player Only Mode',
            desc: 'Show only the video player',
            icon: ICONS.player,
          },
          {
            type: 'toggle',
            id: 'quickAccessRedirectShorts',
            label: 'Redirect Shorts',
            desc: 'Open Shorts in Floating Player',
            icon: ICONS.shorts,
          },
          {
            type: 'toggle',
            id: 'quickAccessVolumeBoost',
            label: 'Volume Boost',
            desc: 'Enable volume boost control',
            icon: ICONS.volume,
          },
        ],
      },
      {
        title: 'Context Menu',
        icon: ICONS.menu,
        color: '#10b981',
        items: [
          {
            type: 'toggle',
            id: 'contextMenuVisibilityEditor',
            label: 'Show Context Menu',
            desc: 'Show "Preview in Floating Player" in context menu',
            icon: ICONS.menu,
          },
          {
            type: 'toggle',
            id: 'contextMenuMiniplayer',
            label: 'Miniplayer Option',
            desc: 'Show miniplayer in context menu',
            icon: ICONS.minimize,
          },
          {
            type: 'toggle',
            id: 'contextMenuPictureInPicture',
            label: 'PiP Option',
            desc: 'Show Picture-in-Picture in context menu',
            icon: ICONS.pip,
          },
          {
            type: 'toggle',
            id: 'contextMenuWindowMode',
            label: 'Window Mode Option',
            desc: 'Show window mode in context menu',
            icon: ICONS.window,
          },
        ]
      },
      {
        title: 'Toolbar',
        icon: ICONS.toolbar,
        color: '#8b5cf6',
        items: [
          {
            type: 'toggle',
            id: 'toolbarVisibilityEditor',
            label: 'Show Toolbar',
            desc: 'Show floating player toolbar',
            icon: ICONS.visible,
          },
          {
            type: 'toggle',
            id: 'toolbarMiniplayer',
            label: 'Miniplayer Button',
            desc: 'Show miniplayer button',
            icon: ICONS.minimize,
          },
          {
            type: 'toggle',
            id: 'toolbarPictureInPicture',
            label: 'PiP Button',
            desc: 'Show Picture-in-Picture button',
            icon: ICONS.pip,
          },
          {
            type: 'toggle',
            id: 'toolbarWindowMode',
            label: 'Window Mode Button',
            desc: 'Show window mode button',
            icon: ICONS.window,
          }
        ]
      }
    ],
  });
