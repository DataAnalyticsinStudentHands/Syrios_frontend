/**
 * Timeline.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the "Coins in Time" interactive timeline, including:
 * - background SVG bands
 * - interactive event markers
 * - interactive coin markers
 * - coin and event popup detail views
 *
 * Refactor Summary:
 * 1. Safe Async Loading
 *    - Replaced chained `axios.then()` flow with async/await
 *    - Adds try/catch/finally and mounted guards
 *
 * 2. Removed Global Mutable State
 *    - Replaced module-level `coins` / `events` variables with component state
 *
 * 3. Response Compatibility
 *    - Supports normalized/safe singleton handling for timeline-info text
 *    - Uses updated `LoadTimelineInfo()` output shape for popup metadata
 *
 * 4. Improved React Behavior
 *    - Adds proper dependency array to `useEffect`
 *    - Prevents repeated network requests on every render
 *
 * 5. Preserved Existing Behavior
 *    - Layout, SVG rendering, popup behavior, and background construction remain unchanged
 *
 * Notes:
 * - `timelines` background response still uses the existing shape expected by `SetupTimelineBackground`
 * - `timeline-info` still preserves nested relations/media for coins/events
 *
 * Future Improvements:
 * - Replace default popup objects with lighter fallbacks
 * - Remove polling dependency between background/info builds entirely
 */

import React, { useState, useEffect } from 'react';
import timelineRequest from 'src/api/timeline';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import CoinInfo from 'src/components/coin/CoinInfo';
import EventInfo from 'src/pages/Toolbox/Timeline/event/Event';

import { SetupTimelineBackground } from './TimeLineBackground';
import { LoadTimelineInfo } from './TimeLineInfo';
import timelinekey from './res/timelinekey.png';
import NoFeedBackIcon from 'src/components/constant/NoFeedBackIcon';
import PageTitleComponent from 'src/components/constant/pageTitleText';
const default_coin_data = {
  reverse_type: 'Tyche holding sceptre and cornucopia',
  mint: 'Antioch',
  to_date: -150,
  material: 'Silver',
  denomination: 'Tetradrachm',
  obverse_legend: 'None',
  reverse_legend: 'ΒΑΣΙΛΕΩΣ ΔΗΜΗΤΡΙΟΥ',
  obverse_type: 'Demetrius I',
  issuing_authority: 'Royal',
  diameter: 29,
  createdAt: '2022-05-09T19:17:41.794Z',
  updatedAt: '2022-05-09T19:48:01.929Z',
  coin_id: 'antioch_silver_demetrius1_tyche',
  modern_country: 'Syria',
  ancient_territory: 'Syria',
  mint_nomisma_uri: 'http://nomisma.org/id/antiocheia_syria',
  mint_modern_name: 'Antakya',
  longitude: 36.2,
  latitude: 36.16,
  date_range: 'c. 162 BCE-150 BCE',
  from_date: -162,
  governing_power: {
    data: {
      id: 3,
      attributes: {
        governing_power: 'Seleucid',
        color: '#d8b8f8',
      },
    },
  },
  nomisma_obverse_uri: 'http://nomisma.org/id/demetrius_i_soter',
  nomisma_reverse_uri: 'http://nomisma.org/id/tyche',
  language: 'Greek',
  source_image: 'http://numismatics.org/collection/1950.84.7?lang=en',
  stable_id: null,
  wikidata: null,
  right_holder: 'American Numsimatic Society - 1950.84.7',
  ref1: 'Seleucid Coins 1.1, no. 1633-4',
  ref2: null,
  has_image: true,
  obverse_file: {
    data: {
      id: 816,
      attributes: {
        name: '7b9d83483f17c053bdd9226b607154e1.png',
        alternativeText: '7b9d83483f17c053bdd9226b607154e1.png',
        caption: '7b9d83483f17c053bdd9226b607154e1.png',
        width: 600,
        height: 601,
        formats: {
          small: {
            ext: '.png',
            url: '/uploads/small_7b9d83483f17c053bdd9226b607154e1_452122071f.png',
            hash: 'small_7b9d83483f17c053bdd9226b607154e1_452122071f',
            mime: 'image/png',
            name: 'small_7b9d83483f17c053bdd9226b607154e1.png',
            path: null,
            size: 489.31,
            width: 499,
            height: 500,
          },
          thumbnail: {
            ext: '.png',
            url: '/uploads/thumbnail_7b9d83483f17c053bdd9226b607154e1_452122071f.png',
            hash: 'thumbnail_7b9d83483f17c053bdd9226b607154e1_452122071f',
            mime: 'image/png',
            name: 'thumbnail_7b9d83483f17c053bdd9226b607154e1.png',
            path: null,
            size: 53.76,
            width: 156,
            height: 156,
          },
        },
        hash: '7b9d83483f17c053bdd9226b607154e1_452122071f',
        ext: '.png',
        mime: 'image/png',
        size: 214.82,
        url: '/uploads/7b9d83483f17c053bdd9226b607154e1_452122071f.png',
        previewUrl: null,
        provider: 'local',
        provider_metadata: null,
        createdAt: '2022-04-14T13:47:45.853Z',
        updatedAt: '2022-04-14T13:47:45.853Z',
      },
    },
  },
  reverse_file: {
    data: {
      id: 1510,
      attributes: {
        name: 'eecaa68a86a7d889cba45f21ba821a9a.png',
        alternativeText: 'eecaa68a86a7d889cba45f21ba821a9a.png',
        caption: 'eecaa68a86a7d889cba45f21ba821a9a.png',
        width: 600,
        height: 596,
        formats: {
          small: {
            ext: '.png',
            url: '/uploads/small_eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c.png',
            hash: 'small_eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c',
            mime: 'image/png',
            name: 'small_eecaa68a86a7d889cba45f21ba821a9a.png',
            path: null,
            size: 526.33,
            width: 500,
            height: 497,
          },
          thumbnail: {
            ext: '.png',
            url: '/uploads/thumbnail_eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c.png',
            hash: 'thumbnail_eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c',
            mime: 'image/png',
            name: 'thumbnail_eecaa68a86a7d889cba45f21ba821a9a.png',
            path: null,
            size: 58.31,
            width: 157,
            height: 156,
          },
        },
        hash: 'eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c',
        ext: '.png',
        mime: 'image/png',
        size: 235.95,
        url: '/uploads/eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c.png',
        previewUrl: null,
        provider: 'local',
        provider_metadata: null,
        createdAt: '2022-04-14T13:57:53.247Z',
        updatedAt: '2022-04-14T13:57:53.247Z',
      },
    },
  },
  type_category: [
    { id: 1, type_category: 'Ruler' },
    { id: 3, type_category: 'God' },
    { id: 2, type_category: 'Object' },
  ],
};

const default_event_data = {
  title: 'Alexander the Great Dies',
  tags: 'Greek, Political',
  text: '<p>In 323 BCE, Alexander the Great died from an illness while in the city of Babylon.&nbsp;</p>\n<p><em>[Alexander\'s soldiers] longed to see him...most from grief and longing for their King pressed in to see Alexander. They say that he was already speechless as the army filed past; yet he greeted one and all, raising his head, though with difficulty, and signing to them with his eyes... Alexander shortly afterwards breathed his last... Some have recorded that his friends asked him to whom he left his kingdom; and replied, "to the best."</em> -Arrian, <em>Anabsis of Alexander</em> 7.26&nbsp;</p>',
  TypeCategory: null,
  color: '#987818',
  createdAt: '2022-04-18T17:11:02.281Z',
  updatedAt: '2022-04-18T17:11:02.281Z',
};

const Timeline = () => {
  const [timeline_background_is_loading, set_timeline_background_is_loading] = useState(true);
  const [timeline_info_is_loading, set_timeline_info_is_loading] = useState(true);

  const [view_box_min_height, set_view_box_min_height] = useState(0);
  const [view_box_total_height, set_view_box_total_height] = useState(0);

  const [timeline_background, set_timeline_background] = useState(undefined);
  const [timeline_events_and_coins, set_timeline_events_and_coins] = useState(undefined);
  const [timeLineText, setTimelineText] = useState({ text: '', subtext: '' });

  const [coins, setCoins] = useState([]);
  const [events, setEvents] = useState([]);

  const y_offset = 5;

  const [show_coin_info, set_show_coin_info] = useState(false);
  const [coin_meta_data, set_coin_meta_data] = useState(default_coin_data);

  const [show_event_info, set_show_event_info] = useState(false);
  const [event_meta_data, set_event_meta_data] = useState(default_event_data);

  const CoinInfoPopupCloseHandler = (e) => {
    set_show_coin_info(e);
  };

  const EventInfoPopupCloseHandler = (e) => {
    set_show_event_info(e);
  };

  const update_coin_info = (img_dom_obj) => {
    const id = parseInt(img_dom_obj.target.id, 10);
    const match = coins.find((e) => e.id === id);

    if (match) {
      set_coin_meta_data(match);
      set_show_coin_info(true);
    }
  };

  const update_event_info = (event_dom_obj) => {
    const id = parseInt(event_dom_obj.target.id, 10);
    const match = events.find((e) => e.id === id);

    if (match) {
      set_event_meta_data(match);
      set_show_event_info(true);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function fetchTimeline() {
      try {
        const backgroundRes = await timelineRequest.background();

        if (!mounted) return;

        const backgroundSetup = SetupTimelineBackground({
          res: backgroundRes,
          y_offset,
        });

        set_view_box_total_height(backgroundSetup.view_box_total_height);
        set_view_box_min_height(backgroundSetup.view_box_min_height);
        set_timeline_background(backgroundSetup.jsx_arr);
        set_timeline_background_is_loading(false);

        const infoRes = await timelineRequest.info();

        if (!mounted) return;

        const infoData = infoRes?.data?.data?.attributes || infoRes?.data?.data || {};

        setTimelineText({
          text: infoData?.text || '',
          subtext: infoData?.subtext || '',
        });

        const tmp = LoadTimelineInfo({
          res: infoRes,
          y_offset,
          view_box_min_height: backgroundSetup.view_box_min_height,
          update_coin_info,
          update_event_info,
        });

        set_timeline_events_and_coins(tmp.jsx_arr);
        setCoins(tmp.coin_info_arr);
        setEvents(tmp.event_info_arr);
        set_timeline_info_is_loading(false);
      } catch (error) {
        console.error('Failed to load timeline:', error);
        if (mounted) {
          set_timeline_background([]);
          set_timeline_events_and_coins([]);
          setCoins([]);
          setEvents([]);
          setTimelineText({ text: '', subtext: '' });
          set_timeline_background_is_loading(false);
          set_timeline_info_is_loading(false);
        }
      }
    }

    fetchTimeline();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const params = window.location.href;
    const contentID = params.split('#')[1];
    if (contentID) {
      const element = document.getElementById(contentID);
      if (element) {
        element.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      }
    }
  }, []);

  if (timeline_info_is_loading && timeline_background_is_loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <NoFeedBackIcon formfor="timeline" color="#487848" />
      <div id="Timeline-page">
        <PageTitleComponent
          title="Coins in Time"
          text={timeLineText.text}
          subtext={timeLineText.subtext}
          addContanter="true"
        />

        <div>
          <img src={timelinekey} alt="" style={{ width: '70%', marginLeft: '15%' }} />
        </div>

        <p className="timeline-mobile-hint">
          Swipe horizontally to explore the full chronology. Tap a coin or event for details.
        </p>

        <div
          className="timeline-explorer"
          tabIndex="0"
          role="region"
          aria-label="Interactive coin timeline"
        >
          <div className="sticky-sections">
            <div id="time-west">WEST</div>
            <div id="time-antioch">ANTIOCH</div>
            <div id="time-east">EAST</div>
          </div>

          <svg
            height="100%"
            width="100%"
            viewBox={`0 0 100 ${view_box_total_height}`}
            style={{ position: 'relative' }}
          >
            {timeline_background}
            {timeline_events_and_coins}
          </svg>
        </div>

        <CoinInfo
          onClose={CoinInfoPopupCloseHandler}
          show={show_coin_info}
          coinMetaData={coin_meta_data}
        />

        <EventInfo
          onClose={EventInfoPopupCloseHandler}
          show={show_event_info}
          eventMetaData={event_meta_data}
        />
      </div>
    </>
  );
};

export default Timeline;