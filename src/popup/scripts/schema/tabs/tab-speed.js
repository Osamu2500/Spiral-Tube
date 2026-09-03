import { ICONS, P } from '../../ui/popup-icons.js';

export const getSpeedTab = (t) => ({
    id: 'speed',
    label: t('speed'),
    icon: ICONS.speed,
    sections: [
      {
        title: t('speed_controls'),
        icon: ICONS.speed,
        items: [
          {
            type: 'toggle',
            id: 'enableCustomSpeed',
            label: t('enable_controller'),
            desc: t('master_toggle'),
            icon: ICONS.speed,
          },
          {
            type: 'toggle',
            id: 'vscForceSpeed',
            label: t('force_saved_speed'),
            desc: t('prevent_players_from_overriding'),
            icon: ICONS.forceSpeed,
          },
        ],
      },
      {
        title: t('controller_behavior'),
        icon: ICONS.resume,
        items: [
          {
            type: 'toggle',
            id: 'vscAudioSupport',
            label: t('audio_support'),
            desc: t('control_audio_tags'),
            icon: ICONS.audioTag,
          },
          {
            type: 'toggle',
            id: 'vscRememberSpeed',
            label: t('remember_speed'),
            desc: t('restore_speed_across_videos'),
            icon: ICONS.remember,
          },
          {
            type: 'toggle',
            id: 'vscHideByDefault',
            label: t('hide_by_default'),
            desc: t('only_show_when_changing_speed'),
            icon: ICONS.hide,
          },
        ],
      },
      {
        title: t('shortcuts'),
        icon: ICONS.keyboard,
        items: [{ type: 'custom', id: 'vsc_shortcuts_manager', class: 'span-4' }],
      },
    ],
  });
