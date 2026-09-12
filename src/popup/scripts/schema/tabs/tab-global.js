import { ICONS, P } from '../../ui/popup-icons.js';
import { generateAdvancedFilterSlot } from '../../ui/ui-templates.js';

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
        title: 'Global UI Cleanups',
        icon: ICONS.filter,
        items: [
          {
            type: 'toggle',
            id: 'hideVoiceSearch',
            label: t('hide_voice_search'),
            desc: t('remove_microphone_icon'),
            icon: ICONS.voiceSearch,
          },
          {
            type: 'toggle',
            id: 'hideUploadButton',
            label: t('hide_upload_button'),
            desc: t('remove_upload_icon'),
            icon: ICONS.uploadBtn,
          },
          {
            type: 'toggle',
            id: 'hideThumbnails',
            label: t('hide_thumbnails'),
            desc: t('blur_on_hover_to_reveal'),
            icon: ICONS.thumbnails,
          },
          {
            type: 'toggle',
            id: 'hideMetrics',
            label: t('hide_views_subs'),
            desc: t('hide_views_likes_sub_counts'),
            icon: ICONS.metrics,
          },
          {
            type: 'toggle',
            id: 'hideCountryCode',
            label: t('hide_country_code'),
            desc: t('hide_country_code_desc'),
            icon: ICONS.channelBar,
          },
          {
            type: 'toggle',
            id: 'hideMemberships',
            label: t('hide_memberships'),
            desc: t('hide_memberships_desc'),
            icon: ICONS.memberships,
          },
          {
            type: 'toggle',
            id: 'hideMembersOnly',
            label: t('hide_members_only'),
            desc: t('hide_members_only_desc'),
            icon: ICONS.memberships,
          },
          {
            type: 'toggle',
            id: 'hideUselessGuideLinks',
            label: t('hide_useless_guide_links'),
            desc: t('hide_useless_guide_links_desc'),
            icon: ICONS.home,
          },
          {
            type: 'toggle',
            id: 'cleanMixUrls',
            label: t('clean_mix_urls'),
            desc: t('prevent_mix_auto_play'),
            icon: ICONS.cleanMixUrls,
          },
          {
            type: 'toggle',
            id: 'compactHeader',
            label: 'Compact Header',
            desc: 'Reduce the height of the top navigation bar',
            badge: 'New',
            icon: ICONS.uiComponents,
          },
          {
            type: 'toggle',
            id: 'hideChannelBanners',
            label: 'Hide Channel Banners',
            desc: 'Remove large banners on channel pages',
            badge: 'New',
            icon: ICONS.channelBar,
          },
          {
            type: 'toggle',
            id: 'hideInterruptions',
            label: 'Hide Interruptions',
            desc: 'Hide "Experiencing interruptions?" popups',
            badge: 'New',
            icon: ICONS.hide,
          },
        ],
      },
      {
        title: 'Global Content Filters',
        icon: ICONS.playlists,
        items: [
          {
            type: 'toggle',
            id: 'hideLiveStreams',
            class: 'span-2',
            label: 'Hide Live Streams',
            desc: 'Remove live-streaming videos from all feeds',
            icon: P(
              'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z'
            ),
          },
          {
            type: 'toggle',
            id: 'hideUpcoming',
            class: 'span-2',
            label: 'Hide Upcoming & Premieres',
            desc: 'Remove scheduled and premiere videos from feeds',
            icon: P(
              'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z'
            ),
          },
          {
            type: 'toggle',
            id: 'feedFilter',
            class: 'span-4',
            label: 'Filter by Keywords',
            desc: 'Hide videos containing specific words (comma separated)',
            icon: ICONS.search,
            inlineSlot:
              '<div style="display:flex; width:100%; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06);"><input type="text" id="feedFilterKeywords" placeholder="e.g. spoiler, review, unboxing" style="flex:1; padding:8px 12px; border-radius:8px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:#fff; font-size:12px; outline:none;" /></div>',
          },
          {
            type: 'toggle',
            id: 'hidePlaylists',
            class: 'span-2',
            label: 'Hide Playlists',
            desc: 'Remove Playlists from feeds and search results',
            icon: ICONS.playlists,
            inlineSlot: generateAdvancedFilterSlot('hidePlaylists', 'playlists'),
          },
          {
            type: 'toggle',
            id: 'hideMixes',
            class: 'span-2',
            label: 'Hide Mixes',
            desc: 'Remove infinite YouTube Mix playlists everywhere',
            icon: ICONS.mixes,
            inlineSlot: generateAdvancedFilterSlot('hideMixes', 'mixes'),
          },
          {
            type: 'toggle',
            id: 'hidePodcasts',
            class: 'span-2',
            label: t('hide_podcasts'),
            desc: t('remove_podcast_cards'),
            icon: ICONS.podcasts,
            inlineSlot: generateAdvancedFilterSlot('hidePodcasts', 'podcasts'),
          },
          {
            type: 'toggle',
            id: 'hidePosts',
            class: 'span-2',
            label: t('hide_posts'),
            desc: t('remove_community_posts'),
            icon: ICONS.uiComponents,
            inlineSlot: generateAdvancedFilterSlot('hidePosts', 'posts'),
          },
        ],
      },
      {
        title: 'Advanced Smart Filters',
        icon: ICONS.search,
        items: [
          {
            type: 'toggle',
            id: 'hideWatched',
            class: 'span-4',
            label: t('hide_watched'),
            desc: t('auto_hide_watched_videos'),
            icon: ICONS.watched,
            inlineSlot:
              '<div style="display:flex; align-items:center; gap:12px; width:45%; max-width:250px;"><div style="display:inline-flex; background:rgba(255,255,255,0.06); border-radius:6px; overflow:hidden;"><button type="button" id="hwMode-dim" class="view-mode-btn hw-mode-btn active" data-mode="dim">Dim</button><button type="button" id="hwMode-hide" class="view-mode-btn hw-mode-btn" data-mode="hide">Hide</button></div><div class="inline-slider-wrapper"><input type="range" id="hideWatchedThreshold" min="5" max="100" step="5"><span id="hideWatchedThresholdValue">80%</span></div></div><div style="display:flex; align-items:center; flex:1; gap:8px;"><span style="opacity:0.6;">Pages:</span><div style="display:flex; align-items:center; flex:1; gap:6px;"><button type="button" class="theme-btn card-style-btn hw-page-btn active" data-page="home">Home</button><button type="button" class="theme-btn card-style-btn hw-page-btn active" data-page="channel">Channel</button><button type="button" class="theme-btn card-style-btn hw-page-btn active" data-page="subs">Subs</button><button type="button" class="theme-btn card-style-btn hw-page-btn active" data-page="search">Search</button><button type="button" class="theme-btn card-style-btn hw-page-btn active" data-page="related">Related</button></div></div><input type="hidden" id="hideWatchedMode" value="dim" />',
            slot: '',
          },
          {
            type: 'toggle',
            id: 'aggressiveShortsBlock',
            class: 'span-4',
            label: 'Shorts Remover',
            desc: 'Completely nuke all Shorts, reels, and shelves',
            icon: ICONS.promos,
            inlineSlot: generateAdvancedFilterSlot('aggressiveShortsBlock', 'shorts'),
          },
          {
            type: 'toggle',
            id: 'viewsFilterEnabled',
            class: 'span-4',
            label: t('hide_low_view_videos'),
            desc: t('filter_out_unpopular_content'),
            icon: P(
              'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'
            ),
            inlineSlot:
              '<div class="inline-slider-wrapper" style="width:30%; max-width:180px;"><span style="opacity:0.5;">Min:</span><input type="range" id="viewsHideThresholdUI" min="0" max="11" step="1"><span id="viewsHideThresholdValue">Off</span></div><div style="display:flex; align-items:center; flex:1; gap:8px;"><span style="opacity:0.6;">Pages:</span><div style="display:flex; align-items:center; flex:1; gap:6px;"><button type="button" class="theme-btn card-style-btn views-page-btn active" data-page="home">Home</button><button type="button" class="theme-btn card-style-btn views-page-btn active" data-page="channel">Channel</button><button type="button" class="theme-btn card-style-btn views-page-btn active" data-page="subs">Subs</button><button type="button" class="theme-btn card-style-btn views-page-btn active" data-page="search">Search</button><button type="button" class="theme-btn card-style-btn views-page-btn active" data-page="related">Related</button></div></div><input type="hidden" id="viewsHideThreshold" value="0" />',

          },
          {
            type: 'toggle',
            id: 'dateFilterEnabled',
            class: 'span-4',
            label: t('filter_by_upload_date'),
            desc: t('hide_videos_older_newer_than_n_days'),
            icon: ICONS.calendar,
            inlineSlot:
              '<div style="display:flex; align-items:center; gap:10px; width:40%; max-width:280px;"><div class="inline-slider-wrapper"><span style="opacity:0.5;">Max:</span><input type="range" id="dateFilterOlderThresholdUI" min="0" max="13" step="1"><span id="dateFilterOlderThresholdValue">Off</span></div><div class="inline-slider-wrapper"><span style="opacity:0.5;">Min:</span><input type="range" id="dateFilterNewerThresholdUI" min="0" max="13" step="1"><span id="dateFilterNewerThresholdValue">Off</span></div></div><div style="display:flex; align-items:center; flex:1; gap:8px;"><span style="opacity:0.6;">Pages:</span><div style="display:flex; align-items:center; flex:1; gap:6px;"><button type="button" class="theme-btn card-style-btn date-page-btn active" data-page="home">Home</button><button type="button" class="theme-btn card-style-btn date-page-btn active" data-page="channel">Channel</button><button type="button" class="theme-btn card-style-btn date-page-btn active" data-page="subs">Subs</button><button type="button" class="theme-btn card-style-btn date-page-btn active" data-page="search">Search</button><button type="button" class="theme-btn card-style-btn date-page-btn active" data-page="related">Related</button></div></div><input type="hidden" id="dateFilterOlderThreshold" value="0" /><input type="hidden" id="dateFilterNewerThreshold" value="0" />',
          },
        ],
      },
    ],
  });
