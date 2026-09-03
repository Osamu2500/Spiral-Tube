import { ICONS, P } from '../../ui/popup-icons.js';

export const getHotkeyTab = (t) => ({
    id: 'hotkey',
    label: t('tab_hotkeys'),
    icon: P(
      'M2 4h20v16H2z M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10'
    ),
    sections: [
      {
        title: t('watch_page_hotkeys'),
        icon: ICONS.secHotkeysWatch,
        items: [
          {
            type: 'toggle',
            id: 'keyboardShortcuts',
            class: 'span-4',
            label: t('enable_hotkeys'),
            icon: P(
              'M2 4h20v16H2z M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10'
            ),
          },
          {
            type: 'custom',
            id: 'advanced_shortcuts_manager',
            slot: 'advanced_shortcuts_manager',
            class: 'span-4',
          },
        ],
      },
    ],
  });
