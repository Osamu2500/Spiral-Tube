import { ICONS, P } from '../ui/popup-icons.js';

export const getGlobalTab = (t) => ({
    id: 'global',
    label: t('tab_global'),
    icon: P(
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'
    ),
    custom: false,
    sections: [
      {
        title: t('lang_support_title'),
        icon: ICONS.secGlobalLang,
        items: [
          {
            type: 'select',
            id: 'extensionLanguage',
            class: 'span-4',
            label: t('lang_select_label'),
            desc: t('lang_support_desc'),
            icon: P(
              'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'
            ),
            options: [
              { value: 'en', label: t('english') },
              { value: 'es', label: t('espa_ol') },
              { value: 'fr', label: t('fran_ais') },
              { value: 'de', label: t('deutsch') },
              { value: 'ja', label: t('str_1') },
            ],
          },
        ],
      },
      {
        title: t('api_integrations'),
        subtitle: 'Third-party service connections',
        icon: ICONS.settingsSync,
        items: [
          {
            type: 'toggle',
            id: 'adSkipper',
            label: t('ad_skipper'),
            desc: t('skip_video_ads_automatically'),
            icon: P('M5 4l10 8-10 8V4z M19 5v14'),
          },
        ],
      },
    ],
  });
