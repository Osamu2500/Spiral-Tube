# Extension UI Blueprint — Complete String Map

> **Canonical reference** for every translatable string in the extension popup.  
> Every key here maps directly to an entry in `src/shared/i18n.js`.  
> Use this when adding new features, new languages, or auditing coverage.

---

## 🧭 Navigation Sidebar
| Key | English |
|-----|---------|
| `nav_dash` | Dash |
| `nav_home` | Home |
| `nav_shorts` | Shorts |
| `nav_player` | Player |
| `nav_search` | Search |
| `nav_subs` | Subs |
| `nav_history` | History |
| `nav_bookmarks` | Bookmarks |
| `nav_focus` | Focus |
| `nav_looks` | Looks |
| `nav_pro` | Pro |
| `nav_config` | Config |
| `title_dashboard` | Dashboard |
| `search_placeholder` | Search settings... |

---

## Tab Labels (nav icons / tooltips)
| Key | English |
|-----|---------|
| `tab_home` | Home |
| `tab_shorts` | Shorts |
| `tab_player` | Player |
| `tab_search` | Search |
| `tab_filters` | Filters |
| `tab_subs` | Subs |
| `tab_history` | History |
| `tab_marks` | Bookmarks |
| `tab_design` | Design |
| `tab_pro` | Pro |
| `tab_hotkeys` | Hotkeys |
| `tab_global` | Config |

---

## 🏠 Tab: Home (`tab_home`)

### Section: Feed Layout (`section_feed_layout`)
| Key | English |
|-----|---------|
| `displayFullTitle` | Show Full Titles |
| `displayFullTitle_desc` | Always expand video titles |
| `useSquareCorners` | Square Corners |
| `useSquareCorners_desc` | Remove rounded card borders |
| `auto_scale_grid` | Auto-Scale Grid |
| `adapt_to_zoom_window_size` | Adapt to zoom/window size |
| `grid_columns` | Grid Columns |
| `0_auto_scale` | 0 = auto-scale |

### Section: Video Management (`video_management`)
| Key | English |
|-----|---------|
| `multi_select_videos` | Multi-Select Videos |
| `hold_shift_click_to_select_multiple_videos` | Hold Shift + click to select multiple videos |
| `clean_mix_urls` | Clean Mix URLs |
| `prevent_mix_auto_play` | Prevent Mix Auto-Play |

---

## ⚡ Tab: Shorts (`tab_shorts`)

### Section: Visibility & Routing (`visibility_routing`)
| Key | English |
|-----|---------|
| `redirect_shorts` | Redirect Shorts |
| `play_in_normal_ui` | Play in normal UI |

### Section: Global Filters (`global_filters_shorts`)
| Key | English |
|-----|---------|
| `stop_looping` | Stop Looping |
| `no_auto_replay_on_shorts` | No auto-replay on Shorts |
| `duration_filter` | Duration Filter |
| `hide_short_videos` | Hide short videos |
| `min_duration` | Min Duration |

---

## 🎬 Tab: Player (`tab_player`)

### Section: Playback Automation (`playback_automation`)
| Key | English |
|-----|---------|
| `auto_cinema` | Auto Cinema |
| `expand_player_on_load` | Expand player on load |
| `video_resumer` | Video Resumer |
| `save_playback_position` | Save playback position |
| `auto_pause` | Auto Pause |
| `pause_when_backgrounded` | Pause when backgrounded |
| `auto_like` | Auto Like |
| `automatically_like_video` | Automatically like video |
| `delay_duration` | Delay Duration |
| `smart_download` | Smart Download |
| `redirect_download_button_to_ssvid` | Redirect download button to ssvid |
| `auto_quality` | Auto-Quality |
| `force_specific_resolution` | Force specific resolution |
| `max_4k` | Max/4K |
| `1440p` | 1440p |
| `1080p` | 1080p |
| `720p` | 720p |
| `off` | Off |

### Section: Audio & Interactions (`audio_interactions`)
| Key | English |
|-----|---------|
| `volume_booster` | Volume Booster |
| `increase_past_100` | Increase past 100% |
| `audio_compressor` | Audio Compressor |
| `compress_loud_sounds` | Compress loud sounds |
| `wheel_controls` | Wheel Controls |
| `shift_alt_scroll_to_control` | Shift/Alt+Scroll to control |

### Section: Player UI Components (`player_ui_components`)
| Key | English |
|-----|---------|
| `classic_progress_bar` | Classic Progress Bar |
| `solid_red_no_pink_gradient` | Solid red, no pink gradient |
| `video_controls_ui` | Video Controls UI |
| `custom_floating_panel` | Custom floating panel |
| `filters` | Filters |
| `visual_effects_panel` | Visual effects panel |
| `loop_button` | Loop Button |
| `add_loop_toggle` | Add loop toggle |
| `snapshot_button` | Snapshot Button |
| `save_frame_as_image` | Save frame as image |
| `time_remaining` | Time Remaining |
| `next_to_duration` | Next to duration |
| `bookmarks` | Bookmarks |
| `capture_clips_text` | Capture clips & text |
| `custom_sidebar` | Custom Sidebar |
| `master_toggle_for_sidebar_layout` | Master toggle for sidebar layout |
| `sidebar_layout` | Sidebar Layout |
| `video_cards_size` | Video cards size |
| `split_scrolling` | Split Scrolling |
| `scroll_sidebar_independently` | Scroll sidebar independently |
| `action_button_style` | Action Button Style |
| `redesign_for_like_share_buttons` | Redesign for Like/Share buttons |
| `premium_pill` | Premium Pill |
| `minimal_icons` | Minimal Icons |
| `default_youtube` | Default YouTube |

### Section: Custom Player Bar Placements (`custom_player_bar_placements`)
| Key | English |
|-----|---------|
| `extension_feature` | Extension Feature |
| `youtube_feature` | YouTube Feature |
| `front` | Front |
| `back` | Back |
| `hidden` | Hidden |
| `bookmark_button` | Bookmark Button |
| `pip_button` | PiP Button |
| `cinema_filters` | Cinema Filters |
| `native_play_pause` | Native Play/Pause |
| `native_next` | Native Next |
| `native_mute_volume` | Native Mute/Volume |
| `native_cast_tv` | Native Cast/TV |
| `native_autoplay` | Native Autoplay |
| `native_cc_subtitles` | Native CC/Subtitles |
| `native_settings` | Native Settings |
| `native_miniplayer` | Native Miniplayer |
| `native_theater_mode` | Native Theater Mode |
| `native_fullscreen` | Native Fullscreen |

---

## ⏩ Tab: Speed (`speed`)

### Section: Speed Controls (`speed_controls`)
| Key | English |
|-----|---------|
| `enable_controller` | Enable Controller |
| `master_toggle` | Master toggle |
| `10x_speed_booster` | 10x Speed Booster |
| `unlock_native_speed_up_to_10x` | Unlock native speed up to 10x |
| `force_saved_speed` | Force Saved Speed |
| `prevent_players_from_overriding` | Prevent players from overriding |

### Section: Controller Behavior (`controller_behavior`)
| Key | English |
|-----|---------|
| `audio_support` | Audio Support |
| `control_audio_tags` | Control audio tags |
| `remember_speed` | Remember Speed |
| `restore_speed_across_videos` | Restore speed across videos |
| `hide_by_default` | Hide by Default |
| `only_show_when_changing_speed` | Only show when changing speed |

### Section: Shortcuts (`shortcuts`)
*(Custom slot — VSC shortcut manager, no translatable strings)*

---

## 🎭 Tab: Modes (`modes`)

### Section: Home Page (`home_page`)
| Key | English |
|-----|---------|
| `cinematic_home` | Cinematic Home |
| `cinematic_styling_for_homepage` | Cinematic styling for homepage |

### Section: Player Page (`player_page`)
| Key | English |
|-----|---------|
| `zen_mode` | Zen Mode |
| `dim_everything_but_video` | Dim everything but video |
| `cinema_mode` | Cinema Mode |
| `theater_like_fullscreen_viewing` | Theater-like fullscreen viewing |
| `ambient_theater` | Ambient Theater |
| `giant_canvas_ambilight_effect` | Giant canvas ambilight effect |
| `study_mode` | Study Mode |
| `focus_mode_1_25_playback_speed` | Focus mode + 1.25x playback speed |
| `focus_mode` | Focus Mode |
| `hide_all_distractions_on_page` | Hide all distractions on page |
| `minimalist_chrome` | Minimalist Chrome |
| `strip_non_essential_page_chrome` | Strip non-essential page chrome |
| `audio_only_mode` | Audio-Only Mode |
| `listen_only_hide_the_video` | Listen only — hide the video |

---

## 🔍 Tab: Search (`tab_search`)

### Section: Layout & Filters (`layout_filters`)
| Key | English |
|-----|---------|
| `clean_search` | Clean Search |
| `remove_junk_ads` | Remove junk/ads |
| `auto_video_filter` | Auto Video Filter |
| `default_to_videos_tab` | Default to videos tab |
| `list_view_size` | List View Size |
| `linear_search_thumbnail_size` | Linear search thumbnail size |
| `grid_view` | Grid View |
| `card_layout_for_search` | Card layout for search |

---

## 🚫 Tab: Declutter / Filters (`tab_filters`)

### Section: Home Page (`home_page`)
| Key | English |
|-----|---------|
| `hide_homepage_feed` | Hide Homepage Feed |
| `blank_homepage` | Blank homepage |
| `hide_topics_bar` | Hide Topics Bar |
| `remove_category_chips` | Remove category chips |
| `hide_trending_explore` | Hide Trending/Explore |
| `hide_views_subs` | Hide Views & Subs |
| `hide_views_likes_sub_counts` | Hide views, likes, sub counts |
| `hide_thumbnails` | Hide Thumbnails |
| `blur_on_hover_to_reveal` | Blur (hover to reveal) |
| `hide_watched` | Hide Watched |
| `auto_hide_watched_videos` | Auto-hide watched videos |
| `hide_mixes` | Hide Mixes |
| `remove_infinite_mixes` | Remove infinite mixes |
| `hide_playlists` | Hide Playlists |
| `remove_playlist_cards` | Remove playlist cards |
| `hide_podcasts` | Hide Podcasts |
| `remove_podcast_cards` | Remove podcast cards |
| `hide_posts` | Hide Posts |
| `remove_community_posts` | Remove community posts |
| `hide_promos` | Hide Promos |
| `remove_shelves_games` | Remove shelves & games |

### Section: Advanced Filters (`advanced_filters`)
| Key | English |
|-----|---------|
| `filter_mode` | Filter Mode |
| `how_to_treat_filtered_content_globally` | How to treat filtered content globally |
| `hide_completely` | Hide completely |
| `dim_hover_to_reveal` | Dim (Hover to reveal) |
| `enable_channel_whitelist` | Enable Channel Whitelist |
| `exempt_channels_from_being_hidden` | Exempt channels from being hidden |
| `enable_channel_blacklist` | Enable Channel Blacklist |
| `always_hide_specific_channels` | Always hide specific channels |
| `hide_low_view_videos` | Hide Low View Videos |
| `filter_out_unpopular_content` | Filter out unpopular content |
| `filter_by_upload_date` | Filter by Upload Date |
| `hide_videos_older_newer_than_n_days` | Hide videos older/newer than N days |

### Section: Player Page (`player_page`)
| Key | English |
|-----|---------|
| `hide_comments` | Hide Comments |
| `hide_related_feed` | Hide Related Feed |
| `hide_sidebar_videos` | Hide sidebar videos |
| `hide_live_chat` | Hide Live Chat |
| `hide_end_screens` | Hide End Screens |
| `hide_video_cards` | Hide Video Cards |
| `hide_annotations` | Hide Annotations |
| `hide_merch_offers` | Hide Merch/Offers |
| `hide_donations` | Hide Donations |
| `comment_spam_filter` | Comment Spam Filter |
| `hide_suspected_bots` | Hide suspected bots |
| `spam_action` | Spam Action |
| `what_to_do_with_spam` | What to do with spam |

### Section: Search Page (`search_page`)
| Key | English |
|-----|---------|
| `hide_shelf_sections` | Hide Shelf Sections |
| `remove_for_you` | Remove "For You" |
| `hide_channel_cards` | Hide Channel Cards |
| `show_videos_only` | Show videos only |
| `hide_voice_search` | Hide Voice Search |
| `remove_microphone_icon` | Remove microphone icon |
| `hide_music` | Hide Music |
| `remove_music_videos` | Remove music videos |

### Section: Shorts (`shorts`)
| Key | English |
|-----|---------|
| `hide_shorts` | Hide Shorts |
| `remove_from_home_feed` | Remove from Home feed |
| `hide_search_shorts` | Hide Search Shorts |
| `remove_from_search_results` | Remove from search results |
| `nuke_shorts` | Nuke Shorts |
| `remove_everywhere` | Remove everywhere |

---

## 📺 Tab: Subscriptions (`tab_subs`)

### Section: Filter Bar Layout (`filter_bar_layout`)
| Key | English |
|-----|---------|
| `enable_filter_bar` | Enable Filter Bar |
| `show_duration_date_filters` | Show duration/date filters |
| `multi_select_chips` | Multi-select Chips |
| `select_multiple_filters_at_once` | Select multiple filters at once |
| `show_search_bar` | Show Search Bar |
| `search_feed_by_title` | Search feed by title |

### Section: Filter Chips — Content (`filter_chips_content`)
| Key | English |
|-----|---------|
| `video` | Video |
| `shorts` | Shorts |
| `live` | Live |
| `streamed` | Streamed |
| `scheduled` | Scheduled |
| `posts` | Posts |
| `playlist` | Playlist |

### Section: Filter Chips — Status (`filter_chips_status`)
| Key | English |
|-----|---------|
| `unwatched` | Unwatched |
| `watched` | Watched |
| `notification_on` | Notification On |
| `notification_off` | Notification Off |

### Section: Layout & Tools (`layout_tools`)
| Key | English |
|-----|---------|
| `channel_health` | Channel Health |
| `scan_for_dead_channels` | Scan for dead channels |
| `feed_grid_columns` | Feed Grid Columns |
| `grid_layout_size_for_subs` | Grid layout size for subs |

---

## 🕰️ Tab: History (`tab_history`)

### Section: Watch Time (`watch_time`)
| Key | English |
|-----|---------|
| `watch_time_alert` | Watch Time Alert |
| `notify_when_limit_reached` | Notify when limit reached |
| `daily_limit` | Daily Limit |
| `intentional_delay` | Intentional Delay |
| `add_a_pause_before_videos_start` | Add a pause before videos start |
| `delay_duration` | Delay Duration |

### Section: Tracking & Resume (`tracking_resume`)
| Key | English |
|-----|---------|
| `smart_history_tracker` | Smart History Tracker |
| `track_individual_video_progress_watch_time` | Track individual video progress & watch time |
| `auto_resume_videos` | Auto Resume Videos |
| `automatically_resume_from_last_watched_timestamp` | Automatically resume from last watched timestamp |
| `resume_badges` | Resume Badges |
| `show_resume_progress_on_thumbnails` | Show resume progress on thumbnails |
| `continue_watching` | Continue Watching |
| `resume_from_history` | Resume from history |

### Section: History Interface (`history_interface`)
| Key | English |
|-----|---------|
| `duration_calc` | Duration Calc |
| `show_total_length` | Show total length |
| `reverse_playlist` | Reverse Playlist |
| `toggle_direction` | Toggle direction |
| `history_redesign` | History Redesign |
| `new_history_layout` | New history layout |

---

## 🎨 Tab: Appearance (`tab_design`)

### Section: Theme Engine (`theme_engine`)

#### Theme Category Labels
| Key | English |
|-----|---------|
| `system_basics` | System & Basics |
| `core_colors` | Core Colors |
| `dark_moody` | Dark & Moody |
| `sci_fi_cyber` | Sci-Fi & Cyber |
| `retro_aesthetics` | Retro & Aesthetics |
| `custom_themes` | Custom Themes |

#### Theme Names & Meta
| Key | English |
|-----|---------|
| `system_auto` | System Auto |
| `follows_os` | Follows OS |
| `native_dark` | Native Dark |
| `native_light` | Native Light |
| `toggle_to_switch` | Toggle to switch |
| `youtube_dark` | YouTube Dark |
| `default` | Default |
| `midnight` | Midnight |
| `oled_black` | OLED Black |
| `minimalism` | Minimalism |
| `clean` | Clean |
| `material_you` | Material You |
| `google_m3` | Google M3 |
| `ocean_blue` | Ocean Blue |
| `deep_blue` | Deep Blue |
| `forest` | Forest |
| `green` | Green |
| `cherry` | Cherry |
| `pink` | Pink |
| `coffee` | Coffee |
| `latte` | Latte |
| `blood_moon` | Blood Moon |
| `crimson` | Crimson |
| `dracula` | Dracula |
| `high_contrast` | High Contrast |
| `nord` | Nord |
| `frost` | Frost |
| `discord_dark` | Discord Dark |
| `chat` | Chat |
| `hacker_green` | Hacker Green |
| `terminal` | Terminal |
| `abyss` | Abyss |
| `deep_sea` | Deep Sea |
| `ember` | Ember |
| `hot_coals` | Hot Coals |
| `sunset_glow` | Sunset Glow |
| `warm` | Warm |
| `deep_space` | Deep Space |
| `nebula` | Nebula |
| `purple_space` | Purple Space |
| `terminalism` | Terminalism |
| `hacker` | Hacker |
| `cyberpunk` | Cyberpunk |
| `neon` | Neon |
| `outrun_synth` | Outrun Synth |
| `80s_retro` | 80s Retro |
| `hologram` | Hologram |
| `sci_fi_cyan` | Sci-Fi Cyan |
| `maximalism` | Maximalism |
| `loud` | Loud |
| `aurora` | Aurora |
| `lights` | Lights |
| `retro_os` | Retro OS |
| `windows_95` | Windows 95 |
| `vintage` | Vintage |
| `classic` | Classic |
| `blue_sky` | Blue Sky |
| `airy_clouds` | Airy Clouds |
| `technozen` | Technozen |
| `eco_tech` | Eco Tech |
| `frutiger_aero` | Frutiger Aero |
| `web_2_0` | Web 2.0 |
| `claymorphism` | Claymorphism |
| `puffy_3d` | Puffy 3D |
| `brutalism` | Brutalism |
| `raw_ui` | Raw UI |
| `glassmorphism` | Glassmorphism |
| `frosted` | Frosted |
| `custom_theme` | Custom Theme |
| `custom` | Custom |

#### Custom Theme Dialogs
| Key | English |
|-----|---------|
| `delete_this_custom_theme` | Delete this custom theme? |
| `no_custom_themes_to_export` | No custom themes to export. |
| `themes_imported_successfully` | Themes imported successfully! |
| `invalid_theme_file` | Invalid theme file. |

### Section: Other Appearance Controls
| Key | English |
|-----|---------|
| `premium_theme` | Premium Theme |
| `accent_color` | Accent Color |
| `custom_theme_builder` | Custom Theme Builder |
| `youtube_page_theme` | YouTube Page Theme |
| `popup_ui_design` | Popup UI Design |
| `video_card_styles` | Video Card Styles |
| `top_bar_nav_buttons` | Top Bar Nav Buttons |
| `custom_cursor` | Custom Cursor |
| `select_a_unique_cursor_pack` | Select a unique cursor pack |
| `primary_color` | Primary Color |
| `dual_gradient_accent` | Dual Gradient Accent |
| `enable_animations` | Enable Animations |
| `theme_effects` | Theme Effects |
| `reduced_motion` | Reduced Motion |
| `hide_scrollbar` | Hide Scrollbar |
| `custom_scrollbar` | Custom Scrollbar |
| `grayscale_thumbs` | Grayscale Thumbs |
| `blue_light_filter` | Blue Light Filter |
| `dim_screen` | Dim Screen |
| `player_bar_position` | Player Bar Position |
| `glass_player_ui` | Glass Player UI |
| `sidebar_comments` | Sidebar Comments |
| `premium_logo` | Premium Logo |

---

## 🔬 Tab: Pro / Advanced (`tab_pro`)

### Section: Global Player Bar (`global_player_bar`)
| Key | English |
|-----|---------|
| `enable_on_external_sites` | Enable on external sites |
| `where_should_it_appear_on_external_sites` | Where should it appear on external sites? |

### Section: Custom CSS (`custom_css_userstyles`)
| Key | English |
|-----|---------|
| `enable_custom_css` | Enable Custom CSS |
| `import_or_write_your_own_styles` | Import or write your own styles |

### Section: Stats & Overlays (`stats_overlays`)
| Key | English |
|-----|---------|
| `stats_overlay` | Stats Overlay |
| `view_tech_details` | View tech details |

### Section: API Integrations (`api_integrations`)
| Key | English |
|-----|---------|
| `return_youtube_dislike` | Return YouTube Dislike |
| `restore_dislike_count_via_ryd_api` | Restore dislike count via RYD API |
| `ad_skipper` | Ad Skipper |
| `skip_video_ads_automatically` | Skip video ads automatically |
| `sponsorblock` | SponsorBlock |
| `skip_sponsored_segments` | Skip sponsored segments |

---

## ⌨️ Tab: Hotkeys (`tab_hotkeys`)

### Section: Watch Page Hotkeys (`watch_page_hotkeys`)
| Key | English |
|-----|---------|
| `enable_hotkeys` | Enable Hotkeys |

---

## ⚙️ Tab: Global Config (`tab_global`)

### Section: Language & Region (`lang_support_title`)
| Key | English |
|-----|---------|
| `lang_select_label` | Language |
| `lang_support_desc` | Choose the extension's language |
| `english` | 🇺🇸 English |
| `espa_ol` | 🇪🇸 Español |
| `fran_ais` | 🇫🇷 Français |
| `deutsch` | 🇩🇪 Deutsch |
| `str_1` | 🇯🇵 日本語 |

### Section: Data Management (`data_management`)
| Key | English |
|-----|---------|
| `cloud_backup` | Cloud Backup |
| `last_sync_never` | Last sync: Never |
| `backup` | Backup |
| `restore` | Restore |
| `reset_to_defaults` | Reset to Defaults |

---

## 📅 Date Filter Dropdown Options
| Key | English |
|-----|---------|
| `1_day` | 1 day |
| `2_days` | 2 days |
| `3_days` | 3 days |
| `1_week` | 1 week |
| `2_weeks` | 2 weeks |
| `3_weeks` | 3 weeks |
| `1_month` | 1 month |
| `3_months` | 3 months |
| `6_months` | 6 months |
| `1_year` | 1 year |
| `2_years` | 2 years |
| `5_years` | 5 years |
| `10_years` | 10 years |

## 👁️ View Count Filter Dropdown Options
| Key | English |
|-----|---------|
| `1_000` | 1,000 |
| `5_000` | 5,000 |
| `10k` | 10k |
| `50k` | 50k |
| `100k` | 100k |
| `500k` | 500k |
| `1m` | 1M |
| `5m` | 5M |
| `10m` | 10M |

---

## 📌 Sidebar / Misc Labels
| Key | English |
|-----|---------|
| `subs` | Subs |
| `history` | History |
| `later` | Later |
| `playlists` | Playlists |
| `account_menu` | Account Menu |
| `watch_log` | WATCH LOG |
| `manage_groups` | Manage Groups |
| `export` | Export |
| `import` | Import |
| `calendar` | 📅 Calendar |
| `your_bookmarks` | Your Bookmarks |
| `captured_highlights_across_all_videos` | Captured highlights across all videos |
| `backup_restore_and_reset_your_extension_data` | Backup, restore, and reset your extension data |
| `toggle_specific_feature_layouts` | Toggle specific feature layouts |

---

## 🛠️ How to Add a New Language

1. Open `src/shared/i18n.js`
2. Add a new entry to `SUPPORTED_LANGUAGES`:
   ```js
   { value: 'pt', label: '🇧🇷 Português' }
   ```
3. Copy the entire `'en'` dictionary block, rename it to `'pt'`, and translate all values.
4. Optionally create `_locales/pt/messages.json` for the nav labels (Chrome native i18n).
5. Reload the extension — the new language will appear in the dropdown immediately.

> **Tip:** Use this blueprint as your checklist. Each key listed here must have a corresponding entry in your new language block.
