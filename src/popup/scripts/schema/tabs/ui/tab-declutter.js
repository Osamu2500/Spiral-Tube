import { ICONS, P } from '../../../ui/popup-icons.js';


export const getDeclutterTab = (t) => ({
    id: 'declutter',
    label: t('tab_filters'),
    icon: ICONS.filter,
    sections: [
      {
        title: t('home_page'),
        icon: ICONS.secFiltersHome,
        color: '#10b981',
        items: [
          {
            type: 'toggle',
            id: 'hideFeed',
            label: t('hide_homepage_feed'),
            desc: t('blank_homepage'),
            icon: ICONS.home,
          },
          {
            type: 'toggle',
            id: 'hidePromoShelves',
            label: t('hide_promos_explore'),
            desc: t('remove_shelves_games_explore'),
            icon: ICONS.promos,
          },
          {
            type: 'toggle',
            id: 'hideHomeTopics',
            label: t('hide_topics_bar'),
            desc: t('remove_category_chips'),
            icon: ICONS.cinematic,
          },
          {
            type: 'toggle',
            id: 'hidePosts',
            label: t('hide_posts'),
            desc: t('remove_community_posts'),
            icon: ICONS.uiComponents,
          },
        ],
      },
      {
        title: 'Global Content Filters',
        icon: ICONS.playlists,
        color: '#f97316',
        items: [
          {
            type: 'toggle',
            id: 'hideLiveStreams',
            label: 'Hide Live Streams',
            desc: 'Remove live-streaming videos from all feeds',
            icon: P(
              'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z'
            ),
          },
          {
            type: 'toggle',
            id: 'hideUpcoming',
            label: 'Hide Upcoming & Premieres',
            desc: 'Remove scheduled and premiere videos from feeds',
            icon: P(
              'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z'
            ),
          },
          {
            type: 'toggle',
            id: 'hidePlaylists',
            label: 'Hide Playlists',
            desc: 'Remove Playlists from feeds and search results',
            icon: ICONS.playlists,
          },
          {
            type: 'toggle',
            id: 'hideMixes',
            label: 'Hide Mixes',
            desc: 'Remove infinite YouTube Mix playlists everywhere',
            icon: ICONS.mixes,
          },
          {
            type: 'toggle',
            id: 'hidePodcasts',
            label: t('hide_podcasts'),
            desc: t('remove_podcast_cards'),
            icon: ICONS.podcasts,
          },

          {
            type: 'toggle',
            id: 'aggressiveShortsBlock',
            label: 'Hide Shorts',
            desc: 'Completely nuke all Shorts, reels, and shelves',
            icon: ICONS.promos,
          },
        ],
      },
      {
        title: 'Smart Filters',
        icon: ICONS.search,
        color: '#f59e0b',
        items: [
          {
            type: 'toggle',
            id: 'hideWatched',
            class: 'span-4 force-inline-slot',
            label: t('hide_watched'),
            desc: t('auto_hide_watched_videos'),
            icon: ICONS.watched,
            inlineSlot:
              '<div style="display:flex; align-items:center; justify-content:flex-end; width:100%;"><div class="inline-slider-wrapper"><input type="range" id="hideWatchedThreshold" min="5" max="100" step="5"><span id="hideWatchedThresholdValue">80%</span></div></div>',
            slot: '',
          },

          {
            type: 'toggle',
            id: 'viewsFilterEnabled',
            class: 'span-4 force-inline-slot',
            label: t('hide_low_view_videos'),
            desc: t('filter_out_unpopular_content'),
            icon: P(
              'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'
            ),
            inlineSlot:
              '<div style="display:flex; align-items:center; justify-content:flex-end; width:100%; gap:10px;"><div class="inline-slider-wrapper" style="max-width:160px;"><span style="opacity:0.5;">Min:</span><input type="range" id="viewsHideThresholdUI" min="0" max="11" step="1"><span id="viewsHideThresholdValue">Off</span></div><div class="inline-slider-wrapper" style="max-width:160px;"><span style="opacity:0.5;">Max:</span><input type="range" id="viewsHideMaxThresholdUI" min="0" max="11" step="1"><span id="viewsHideMaxThresholdValue">Off</span></div></div>',
          },
          {
            type: 'toggle',
            id: 'dateFilterEnabled',
            class: 'span-4 force-inline-slot',
            label: t('filter_by_upload_date'),
            desc: t('hide_videos_older_newer_than_n_days'),
            icon: ICONS.calendar,
            inlineSlot:
              '<div style="display:flex; align-items:center; justify-content:flex-end; width:100%; gap:10px;"><div class="inline-slider-wrapper"><span style="opacity:0.5;">Max:</span><input type="range" id="dateFilterOlderThresholdUI" min="0" max="13" step="1"><span id="dateFilterOlderThresholdValue">Off</span></div><div class="inline-slider-wrapper"><span style="opacity:0.5;">Min:</span><input type="range" id="dateFilterNewerThresholdUI" min="0" max="13" step="1"><span id="dateFilterNewerThresholdValue">Off</span></div></div>',
          },
        ],
      },
      {
        title: 'Global UI Cleanups',
        icon: ICONS.filter,
        color: '#ef4444',
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
            id: 'hideSidebar',
            label: 'Hide Left Sidebar',
            desc: 'Hide the navigation guide on the left side',
            icon: ICONS.sidebar,
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
        title: t('player_page'),
        icon: ICONS.secFiltersPlayer,
        color: '#3b82f6',
        items: [
          {
            type: 'toggle',
            id: 'hideTopBarOnPlayer',
            label: 'Auto-hide Topbar',
            desc: 'Hide top navigation bar, shows when cursor is near top',
            icon: ICONS.sidebar,
          },
          {
            type: 'toggle',
            id: 'hideAiLogo',
            label: t('hide_ai_logo'),
            desc: t('hide_ai_logo_desc'),
            icon: ICONS.aiBadge,
          },
          {
            type: 'toggle',
            id: 'hidePlayerTopics',
            label: t('hide_topics_bar'),
            desc: t('remove_category_chips'),
            icon: ICONS.cinematic,
          },
          {
            type: 'toggle',
            id: 'hideVideoTitle',
            label: t('hide_video_title'),
            desc: t('hide_video_title_desc'),
            icon: ICONS.titleHidden,
          },
          {
            type: 'toggle',
            id: 'hideChannelBar',
            label: t('hide_channel_bar'),
            desc: t('hide_channel_bar_desc'),
            icon: ICONS.channelBar,
          },
          {
            type: 'toggle',
            id: 'hideVideoDescription',
            label: t('hide_video_description'),
            desc: t('hide_video_description_desc'),
            icon: ICONS.descHidden,
          },
          {
            type: 'toggle',
            id: 'hideActionButtons',
            label: t('hide_action_buttons'),
            desc: t('hide_action_buttons_desc'),
            icon: ICONS.like,
          },
          {
            type: 'toggle',
            id: 'hideComments',
            label: t('hide_comments'),
            icon: ICONS.uiComponents,
          },
          {
            type: 'toggle',
            id: 'hideRelated',
            label: 'Hide Related & Cards',
            desc: t('hide_sidebar_videos'),
            icon: P('M3 3h18v18H3zM14 8h6M14 12h6M14 16h6'),
          },
          {
            type: 'toggle',
            id: 'hideLiveChat',
            label: t('hide_live_chat'),
            icon: ICONS.uiComponents,
          },
          {
            type: 'toggle',
            id: 'hideEndScreens',
            label: t('hide_end_screens'),
            icon: P('M3 3h18v18H3zM3 9h18M9 21V9'),
          },

          {
            type: 'toggle',
            id: 'hideAnnotations',
            label: t('hide_annotations'),
            icon: ICONS.uiComponents,
          },
          { type: 'toggle', id: 'hideMerch', label: t('hide_merch_offers'), icon: ICONS.merch },
          {
            type: 'toggle',
            id: 'hideFundraiser',
            label: t('hide_donations'),
            icon: ICONS.fundraiser,
          },

          {
            type: 'toggle',
            id: 'hideThanksDonate',
            label: t('hide_thanks_donate'),
            desc: t('hide_thanks_donate_desc'),
            icon: ICONS.fundraiser,
          },
          {
            type: 'toggle',
            id: 'hidePlayerBranding',
            label: t('hide_player_branding'),
            desc: t('hide_player_branding_desc'),
            icon: ICONS.channelBar,
          },
          {
            type: 'toggle',
            id: 'hidePaidPromotion',
            label: t('hide_paid_promotion'),
            desc: t('hide_paid_promotion_desc'),
            icon: ICONS.promos,
          },
        ],
      },
      {
        title: t('search_page'),
        icon: P('M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35'),
        color: '#06b6d4',
        items: [
          {
            type: 'toggle',
            id: 'hideSearchTopics',
            label: t('hide_topics_bar'),
            desc: t('remove_category_chips'),
            icon: ICONS.cinematic,
          },
          {
            type: 'toggle',
            id: 'hideSearchShelves',
            label: t('hide_shelf_sections'),
            desc: t('remove_for_you'),
            icon: ICONS.shelves,
          },
          {
            type: 'toggle',
            id: 'hideChannelCards',
            label: t('hide_channel_cards'),
            desc: t('show_videos_only'),
            icon: ICONS.channelBar,
          },

          {
            type: 'toggle',
            id: 'hideSearchMusic',
            label: t('hide_music'),
            desc: t('remove_music_videos'),
            icon: ICONS.audioOnly,
          },
          {
            type: 'toggle',
            id: 'filterSearchResults',
            label: 'Filter Search Noise',
            desc: 'Hide horizontal card lists and exploratory results in search',
            badge: 'New',
            icon: ICONS.filter,
          },
        ],
      },
    ],
  });
