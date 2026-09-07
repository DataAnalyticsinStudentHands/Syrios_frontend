/**
 * CoinSort.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the CoinSort experience using coin-collections as the unified source of truth.
 *
 * Refactor Summary:
 * 1. Unified Coin Data Model
 *    - Uses coin-collections as the single source for both pile rendering and grid detail rendering
 *    - Eliminates the need for CoinGrid to refetch legacy `/api/coins`
 *
 * 2. Expanded Coin Adapter
 *    - Adapts BOTH raw Strapi coin-collections rows and normalized coin-collections records
 *      into a CoinSort/CoinInfo-compatible shape
 *    - Includes sorting/filtering fields, thumbnail rendering fields, and detail popup fields
 *
 * 3. Centralized API Usage
 *    - Uses `coinCollectionsRequest.fetchAllForCoinSort()`
 *    - Uses `coinSortRequest.coinSortFind()` for tooltips/config
 *    - Uses shared `apiClient` for governing powers
 *
 * 4. Preserved UX
 *    - Existing sorting, filtering, pile behavior, and dropdown UX remain unchanged
 *
 * 5. Response Compatibility Fix
 *    - Supports raw collection rows from `coin-collections.js`
 *    - Prevents all coins from being filtered out when collection endpoints remain unnormalized
 *
 * Notes:
 * - CoinGrid now receives `coins` directly instead of refetching by ID
 * - Adapted coins intentionally preserve a legacy-compatible `attributes` shape
 * - `fetchAllForCoinSort()` currently returns raw Strapi rows by design
 *
 * Future Improvements:
 * - Normalize CoinInfo to consume a flatter coin model directly
 * - Extract adapter helpers into a shared utility module if reused elsewhere
 * - Normalize collection endpoints after downstream callers are fully migrated
 */

import React, { useRef, useEffect, useMemo, useState } from 'react';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import NoFeedBackIcon from 'src/components/constant/NoFeedBackIcon';
import { CoinGrid } from './CoinSortCoinGrid';
import CoinSortDropDown from './CoinSortDropDown';

import {
  DefaultCoinPileGraphingStategy,
  GaussianDeviationOnValue,
  SimplyMappedCoin,
  CoinPileLocations,
} from './CoinUtils';

import coinCollectionsRequest from 'src/api/coin-collections';
import coinSortRequest from 'src/api/coin-sort';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

// ─────────────────────────────────────────────────────────────
// Constants / Enumerations
// ─────────────────────────────────────────────────────────────
const sort_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const then_by_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const filter_selections = ['None', 'Including', 'Excluding'];
const filter_selections_query_relation = [null, true, false];
const with_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const of_kind_no_selections = ['None'];

const degToRad = (deg) => (deg * Math.PI) / 180;

const of_kind_from_date_selections = [
  'None',
  'before - 500 B.C.E',
  '500 B.C.E - 401 B.C.E',
  '400 B.C.E - 301 B.C.E',
  '300 B.C.E - 201 B.C.E',
  '200 B.C.E - 101 B.C.E',
  '100 B.C.E - 1 B.C.E',
  '1 C.E - 99 C.E',
  '100 C.E - 199 C.E',
  '200 C.E - 299 C.E',
  '300 C.E - 399 C.E',
  '400 C.E - present',
];

const of_kind_from_date_query_relation = [
  { gte: -2147483648, lte: 2147483647 },
  { gte: -2147483648, lte: -500 },
  { gte: -500, lte: -401 },
  { gte: -400, lte: -301 },
  { gte: -300, lte: -201 },
  { gte: -200, lte: -101 },
  { gte: -100, lte: -1 },
  { gte: 1, lte: 99 },
  { gte: 100, lte: 199 },
  { gte: 200, lte: 299 },
  { gte: 300, lte: 399 },
  { gte: 400, lte: 2147483647 },
];

const of_kind_material_selections = ['None', 'Gold', 'Silver', 'Bronze', 'Orichalcum', 'Uncertain'];
const of_kind_issuing_authority_selections = ['None', 'Royal', 'Imperial', 'Provincial', 'Civic', 'Uncertain'];

const of_kind_size_selections = [
  'None',
  '1mm - 10mm',
  '10mm - 15mm',
  '15mm - 20mm',
  '20mm - 25mm',
  '25mm - 30mm',
  '30mm - 35mm',
  '35mm - 40mm',
  '40mm - 50mm',
  'Uncertain',
];

const of_kind_size_query_relation = [
  { gte: -2147483648, lte: 2147483647 },
  { gte: 1, lte: 10 },
  { gte: 10, lte: 15 },
  { gte: 15, lte: 20 },
  { gte: 20, lte: 25 },
  { gte: 25, lte: 30 },
  { gte: 30, lte: 35 },
  { gte: 35, lte: 40 },
  { gte: 40, lte: 50 },
  { gte: null, lte: null },
];

// ─────────────────────────────────────────────────────────────
// Adapter helpers
// ─────────────────────────────────────────────────────────────
const normalizeCoinRow = (coin) => {
  if (!coin) return null;

  if (coin?.attributes && typeof coin.attributes === 'object') {
    return {
      id: coin.id,
      ...coin.attributes,
    };
  }

  return coin;
};

const safeRelData = (rel) => rel?.data ?? null;

const safeRelAttr = (rel, key) => {
  const data = safeRelData(rel);
  if (!data) return null;

  if (Array.isArray(data)) return null;

  const attrs = data?.attributes ?? data;
  return attrs?.[key] ?? null;
};

const safeNestedRelAttr = (parentRel, childKey, grandchildKey) => {
  const parent = safeRelData(parentRel);
  if (!parent || Array.isArray(parent)) return null;

  const parentAttrs = parent?.attributes ?? parent;
  const childRel = parentAttrs?.[childKey];
  return safeRelAttr(childRel, grandchildKey);
};

const safeText = (value) => value ?? '';

const safeMediaData = (media) => media?.data ?? null;
const safeMediaAttrs = (media) => {
  const data = safeMediaData(media);
  if (!data || Array.isArray(data)) return null;
  return data?.attributes ?? data;
};
const safeMediaUrl = (media) => safeMediaAttrs(media)?.url ?? null;
const safeMediaFormats = (media) => safeMediaAttrs(media)?.formats ?? null;

const safeMediaThumbUrl = (media) => {
  const formats = safeMediaFormats(media);
  const url = formats?.thumbnail?.url || formats?.small?.url || safeMediaUrl(media);
  return url ? `${STRAPI_URL}${url}` : null;
};

const buildLegacyMedia = (media) => {
  const attrs = safeMediaAttrs(media);
  if (!attrs) {
    return { data: null };
  }

  return {
    data: {
      attributes: {
        ...attrs,
      },
    },
  };
};

// Adapt raw or normalized coin-collections records into a legacy-compatible shape
// that works with CoinSort positioning AND CoinGrid/CoinInfo.
const adaptCoinCollectionForCoinSort = (inputCoin) => {
  const coin = normalizeCoinRow(inputCoin);
  if (!coin) return null;

  return {
    id: coin.id,
    attributes: {
      // sorting/filtering helpers
      from_date: coin.from_year ?? null,
      to_date: coin.to_year ?? null,
      diameter: coin.diameter ?? null,
      material: safeRelAttr(coin.material, 'material') ?? safeRelAttr(coin.material, 'name') ?? null,
      issuing_authority:
        safeRelAttr(coin.issuing_authority, 'issuing_authority') ??
        safeRelAttr(coin.issuing_authority, 'name') ??
        null,
      governing_power:
        safeRelAttr(coin.governing_power, 'governing_power') ??
        safeRelAttr(coin.governing_power, 'name') ??
        null,

      // detail popup text fields
      coin_id: coin.coin_id ?? '',
      from_year: coin.from_year ?? null,
      to_year: coin.to_year ?? null,
      date_range: coin.date_range ?? '',
      obverse_type: safeText(coin.obverse_type),
      obverse_legend: safeText(coin.obverse_legend),
      reverse_type: safeText(coin.reverse_type),
      reverse_legend: safeText(coin.reverse_legend),
      mint: safeRelAttr(coin.mint, 'mint') ?? '',
      mint_modern_name: safeNestedRelAttr(coin.mint, 'modern_name', 'modern_name') ?? '',
      modern_country: safeNestedRelAttr(coin.mint, 'modern_country', 'modern_country') ?? '',
      ancient_territory: safeRelAttr(coin.ancient_territory, 'ancient_territory') ?? '',
      issuing_authority_display: safeRelAttr(coin.issuing_authority, 'issuing_authority') ?? '',
      language: safeRelAttr(coin.language, 'language') ?? '',
      denomination:
        safeRelAttr(coin.denomination, 'denomination') ??
        safeRelAttr(coin.denomination, 'name') ??
        '',
      source_image: safeText(coin.source_image),
      right_holder: safeText(coin.right_holder),
      reference: safeText(coin.reference),

      // legacy relation objects needed by CoinInfo
      obverse_file: buildLegacyMedia(coin.obverse_image),
      reverse_file: buildLegacyMedia(coin.reverse_image),
      governing_power: coin.governing_power ?? { data: null },

      // convenience fields for pile rendering
      obverse_thumb_src: safeMediaThumbUrl(coin.obverse_image),
    },
  };
};

const hasThumb = (coin) => {
  return Boolean(
    coin?.attributes?.obverse_thumb_src ||
      coin?.attributes?.obverse_file?.data?.attributes?.formats?.thumbnail?.url ||
      coin?.attributes?.obverse_file?.data?.attributes?.url
  );
};

// ─────────────────────────────────────────────────────────────
// Coin renderer (pile)
// ─────────────────────────────────────────────────────────────
const Coin = ({ id, x, y, display, dimensions, coinMetaData, selectedCoinId, setDraggedCoinId }) => {
  const diameter = coinMetaData?.attributes?.diameter ?? 10;
  const thumbnail_scale = 1.5;
  const MIN_RENDER_SIZE = 32;
  const MAX_RENDER_SIZE = 90;
  const MIN_DIAM = 8;
  const MAX_DIAM = 45;

  const clamped = Math.min(Math.max(diameter, MIN_DIAM), MAX_DIAM);
  const normalized = (clamped - MIN_DIAM) / (MAX_DIAM - MIN_DIAM);
  const width = (MIN_RENDER_SIZE + normalized * (MAX_RENDER_SIZE - MIN_RENDER_SIZE)) * thumbnail_scale;

  let px = (x ?? 0) * (dimensions?.width ?? 0);
  let py = (y ?? 0) * (dimensions?.height ?? 0);

  if (px + width > (dimensions?.width ?? 0)) px = (dimensions?.width ?? 0) - width;
  if (py + width > (dimensions?.height ?? 0)) py = (dimensions?.height ?? 0) - width;
  if (px < 0) px = 0;
  if (py < 0) py = 0;

  if (!display) {
    px = -10000;
    py = -10000;
  }

  const src =
    coinMetaData?.attributes?.obverse_thumb_src ||
    (coinMetaData?.attributes?.obverse_file?.data?.attributes?.formats?.thumbnail?.url
      ? `${STRAPI_URL}${coinMetaData.attributes.obverse_file.data.attributes.formats.thumbnail.url}`
      : coinMetaData?.attributes?.obverse_file?.data?.attributes?.url
        ? `${STRAPI_URL}${coinMetaData.attributes.obverse_file.data.attributes.url}`
        : null);

  if (!src) return null;

  const selectCoin = () => setDraggedCoinId(id);
  const coinName = coinMetaData?.attributes?.name || `Coin ${id}`;

  return (
    <div
      className={`coin-sort-pile-coin ${String(selectedCoinId) === String(id) ? 'is-selected' : ''}`}
      style={{ top: `${py}px`, left: `${px}px` }}
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Select ${coinName} for the study area`}
      aria-pressed={String(selectedCoinId) === String(id)}
      onClick={selectCoin}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectCoin();
        }
      }}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(id));
        e.dataTransfer.effectAllowed = 'copy';
        selectCoin();
      }}
    >
      <img
        id={`coin-sort-${id}`}
        className="coin-sort-pile-coin-image"
        src={src}
        alt={coinMetaData?.attributes?.obverse_file?.data?.attributes?.alternativeText || coinName}
        width={width}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Positioning / sorting / filtering
// ─────────────────────────────────────────────────────────────
function ComputeCoinPos(coins, sort_selection, then_by_selection, filter_selection, with_selection, of_kind_selection, governingPowers) {
  if (!Array.isArray(coins)) return null;

  let coins_pos = new Map(
    coins.map((coin, index) => [
      coin.id,
      {
        index,
        ...DefaultCoinPileGraphingStategy(coin),
        display: true,
      },
    ])
  );

  if (sort_selection !== sort_selections[0]) {
    const tmp_coins = coins.map((coin, index) => SimplyMappedCoin(coin, index));

    let key;
    let query_selection;
    let is_match_type = true;

    switch (sort_selection) {
      case sort_selections[1]:
        key = 'from_date';
        query_selection = of_kind_from_date_query_relation;
        is_match_type = false;
        break;
      case sort_selections[2]:
        key = 'material';
        query_selection = of_kind_material_selections;
        is_match_type = true;
        break;
      case sort_selections[3]:
        key = 'issuing_authority';
        query_selection = of_kind_issuing_authority_selections;
        is_match_type = true;
        break;
      case sort_selections[4]:
        key = 'governing_power';
        query_selection = governingPowers ?? ['None'];
        is_match_type = true;
        break;
      case sort_selections[5]:
        key = 'size';
        query_selection = of_kind_size_query_relation;
        is_match_type = false;
        break;
      default:
        console.error('No sort selection option', sort_selection);
        query_selection = [];
        break;
    }

    let coin_piles = [];
    for (let index = 0; index < query_selection.length; index++) {
      const query = query_selection[index];
      if (index === 0) continue;

      const coin_pile = [];
      for (let i = 0; i < tmp_coins.length; i++) {
        const v = tmp_coins[i]?.[key];

        if (is_match_type) {
          if (typeof v === 'string' && v.toLowerCase().includes(String(query).toLowerCase())) {
            coin_pile.push(tmp_coins[i]);
          }
        } else if (typeof v === 'number' && v >= query.gte && v <= query.lte) {
          coin_pile.push(tmp_coins[i]);
        }
      }
      coin_piles.push(coin_pile);
    }

    coin_piles = coin_piles.filter((arr) => arr.length !== 0);
    let pile_locations = CoinPileLocations(coin_piles.length);

    if (then_by_selection !== then_by_selections[0]) {
      key = undefined;
      query_selection = undefined;
      is_match_type = true;

      switch (then_by_selection) {
        case then_by_selections[1]:
          key = 'from_date';
          query_selection = of_kind_from_date_query_relation;
          is_match_type = false;
          break;
        case then_by_selections[2]:
          key = 'material';
          query_selection = of_kind_material_selections;
          is_match_type = true;
          break;
        case then_by_selections[3]:
          key = 'issuing_authority';
          query_selection = of_kind_issuing_authority_selections;
          is_match_type = true;
          break;
        case then_by_selections[4]:
          key = 'governing_power';
          query_selection = governingPowers ?? ['None'];
          is_match_type = true;
          break;
        case then_by_selections[5]:
          key = 'size';
          query_selection = of_kind_size_query_relation;
          is_match_type = false;
          break;
        default:
          console.error('No sort selection option', then_by_selection);
          query_selection = [];
      }

      const new_pile_locations = [];
      const new_coin_piles = [];

      for (let i = 0; i < pile_locations.length; i++) {
        const sort_by_coin_pile = coin_piles[i];
        const then_by_new_coin_piles = [];

        for (let j = 0; j < query_selection.length; j++) {
          if (j === 0) continue;
          const query = query_selection[j];

          const new_coin_pile = [];
          for (let k = 0; k < sort_by_coin_pile.length; k++) {
            const coin = sort_by_coin_pile[k];
            const v = coin?.[key];

            if (is_match_type) {
              if (typeof v === 'string' && v.toLowerCase().includes(String(query).toLowerCase())) {
                new_coin_pile.push(coin);
              }
            } else if (typeof v === 'number' && v >= query.gte && v <= query.lte) {
              new_coin_pile.push(coin);
            }
          }
          then_by_new_coin_piles.push(new_coin_pile);
        }

        const distance_from_center = 0.04;
        const center = pile_locations[i];
        const degrees_between_pile = 360 / Math.max(1, then_by_new_coin_piles.length);

        for (let j = 0; j < then_by_new_coin_piles.length; j++) {
          new_pile_locations.push({
            x: distance_from_center * Math.cos(degToRad(degrees_between_pile * j)) + center.x,
            y: distance_from_center * Math.sin(degToRad(degrees_between_pile * j)) + center.y,
          });
        }

        new_coin_piles.push(then_by_new_coin_piles);
      }

      coin_piles = new_coin_piles.flat();
      pile_locations = new_pile_locations.flat();
    }

    let new_coin_pos = new Map();
    const coin_deviation_in_pile = then_by_selection === then_by_selections[0] ? 0.15 : 0.075;

    for (let i = 0; i < pile_locations.length; i++) {
      const more_mapped_coins = coin_piles[i].map((coin) => [
        coin.id,
        {
          index: coin.props_index,
          x: GaussianDeviationOnValue(pile_locations[i].x, coin_deviation_in_pile),
          y: GaussianDeviationOnValue(pile_locations[i].y, coin_deviation_in_pile),
          display: true,
        },
      ]);

      new_coin_pos = new Map([...new_coin_pos, ...more_mapped_coins]);
    }

    coins_pos = new_coin_pos;
  }

  if (filter_selection !== filter_selections[0] && with_selection !== with_selections[0]) {
    const filter_include = filter_selections_query_relation[filter_selections.findIndex((str) => str === filter_selection)];

    let coin_key;
    let query = undefined;

    switch (with_selection) {
      case with_selections[1]:
        coin_key = 'from_date';
        query = of_kind_from_date_query_relation[of_kind_from_date_selections.findIndex((e) => e === of_kind_selection)];
        break;
      case with_selections[2]:
        coin_key = 'material';
        break;
      case with_selections[3]:
        coin_key = 'issuing_authority';
        break;
      case with_selections[4]:
        coin_key = 'governing_power';
        break;
      case with_selections[5]:
        coin_key = 'size';
        query = of_kind_size_query_relation[of_kind_size_selections.findIndex((e) => e === of_kind_selection)];
        break;
      default:
        console.error('No sort selection option', with_selection);
        coin_key = undefined;
    }

    const new_coins_pos =
      coins_pos == null
        ? null
        : new Map(
            Array.from(coins_pos).map((coin_pos) => {
              const coin = SimplyMappedCoin(coins[coin_pos[1].index], coin_pos[1].index);
              let does_include = filter_include;

              try {
                if (query == null) {
                  does_include =
                    coin?.[coin_key]?.toLowerCase?.()?.includes?.(String(of_kind_selection).toLowerCase()) ?? filter_include;
                } else {
                  does_include = coin?.[coin_key] >= query.gte && coin?.[coin_key] <= query.lte;
                }
              } catch (err) {}

              if ((filter_include && !does_include) || (!filter_include && does_include)) {
                coin_pos[1].display = false;
              } else {
                coin_pos[1].display = true;
              }

              return coin_pos;
            })
          );

    coins_pos = new_coins_pos;
  }

  return coins_pos;
}

// ─────────────────────────────────────────────────────────────
// CoinPile component
// ─────────────────────────────────────────────────────────────
const CoinPile = (props) => {
  const coin_wrapper_ref = useRef(null);
  const [coins_pos, set_coins_pos] = useState(undefined);
  const [dimensions, set_dimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    set_coins_pos(
      ComputeCoinPos(
        props.coins,
        props.sortSelection,
        props.thenBySelection,
        props.filterSelection,
        props.withSelection,
        props.ofKindSelection,
        props.governingPowers
      )
    );
  }, [
    props.coins,
    props.sortSelection,
    props.thenBySelection,
    props.filterSelection,
    props.withSelection,
    props.ofKindSelection,
    props.governingPowers,
  ]);

  useEffect(() => {
    const el = coin_wrapper_ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      set_dimensions({ width: Math.round(rect.width), height: Math.round(rect.height) });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="coin-sort-pile-wrapper" ref={coin_wrapper_ref}>
      <div className="coin-sort-pile">
        {props.coins?.map((coin) => (
          <Coin
            id={coin.id}
            key={coin.id}
            coinMetaData={coin}
            dimensions={dimensions}
            display={coins_pos?.get(coin.id)?.display ?? true}
            x={coins_pos?.get(coin.id)?.x}
            y={coins_pos?.get(coin.id)?.y}
            selectedCoinId={props.selectedCoinId}
            setDraggedCoinId={props.setDraggedCoinId}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
const CoinSort = () => {
  const [is_loading, set_is_loading] = useState(true);
  const [coins, set_coins] = useState([]);
  const [scale_all] = useState(false);
  const [rotate_all] = useState(false);
  const ShowScaleAndRotate = () => {};

  const [dragged_coin_id, set_dragged_coin_id] = useState(undefined);
  const SetDraggedCoinId = (coin_id) => set_dragged_coin_id(coin_id);

  const [sort_selection, set_sort_selection] = useState(sort_selections[0]);
  const [then_by_selection, set_then_by_selection] = useState(then_by_selections[0]);
  const [filter_selection, set_filter_selection] = useState(filter_selections[0]);
  const [with_selection, set_with_selection] = useState(with_selections[0]);
  const [of_kind_selection, set_of_kind_selection] = useState(of_kind_no_selections[0]);
  const [of_kind_selections, set_of_kind_selections] = useState(of_kind_no_selections);

  const [governingPowers, setGoverningPowers] = useState(['None']);
  const [coinSortData, setCoinSortData] = useState({});

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [governingRes, collectionsRes, sortRes] = await Promise.all([
          coinCollectionsRequest.fetchGoverningPowers(),
          coinCollectionsRequest.fetchAllForCoinSort(),
          coinSortRequest.coinSortFind(),
        ]);

        if (!mounted) return;

        const governingArr =
          governingRes?.data?.data
            ?.map(({ attributes }) => attributes?.governing_power)
            .filter(Boolean) ?? [];

        const rows = Array.isArray(collectionsRes?.data?.data) ? collectionsRes.data.data : [];
        const adaptedCoins = rows.map(adaptCoinCollectionForCoinSort).filter(Boolean).filter(hasThumb);

        setGoverningPowers(['None', ...governingArr]);
        set_coins(adaptedCoins);
        setCoinSortData(sortRes?.data?.data?.attributes ?? sortRes?.data?.data ?? {});
      } catch (error) {
        console.error('Failed to load CoinSort data:', error);
        if (mounted) {
          setGoverningPowers(['None']);
          set_coins([]);
          setCoinSortData({});
        }
      } finally {
        if (mounted) set_is_loading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const coinLookup = useMemo(() => {
    return new Map((coins || []).map((coin) => [String(coin.id), coin]));
  }, [coins]);

  useEffect(() => {
    set_of_kind_selections(() => {
      switch (with_selection) {
        case 'None':
          set_of_kind_selection(of_kind_no_selections[0]);
          return of_kind_no_selections;
        case 'Minting Date':
          set_of_kind_selection(of_kind_from_date_selections[0]);
          return of_kind_from_date_selections;
        case 'Material':
          set_of_kind_selection(of_kind_material_selections[0]);
          return of_kind_material_selections;
        case 'Issuing Authority':
          set_of_kind_selection(of_kind_issuing_authority_selections[0]);
          return of_kind_issuing_authority_selections;
        case 'Governing Power':
          set_of_kind_selection(governingPowers[0] ?? 'None');
          return governingPowers;
        case 'Size':
          set_of_kind_selection(of_kind_size_selections[0]);
          return of_kind_size_selections;
        default:
          set_of_kind_selection(of_kind_no_selections[0]);
          return of_kind_no_selections;
      }
    });
  }, [with_selection, governingPowers]);

  const [show_sort_clear_button, set_show_sort_clear_button] = useState(false);
  useEffect(() => {
    set_show_sort_clear_button(sort_selection !== sort_selections[0] || then_by_selection !== then_by_selections[0]);
  }, [sort_selection, then_by_selection]);

  const [show_filter_clear_button, set_show_filter_clear_button] = useState(false);
  useEffect(() => {
    set_show_filter_clear_button(
      filter_selection !== filter_selections[0] ||
        with_selection !== with_selections[0] ||
        of_kind_selection !== of_kind_selections[0]
    );
  }, [filter_selection, with_selection, of_kind_selection, of_kind_selections]);

  if (is_loading) return <LoadingPage />;

  return (
    <>
      <NoFeedBackIcon formfor="coinpile" />
      <div id="coin-pile-page">
        <center>
          <h1>Coins in a Pile</h1>
          <h3 className="mb-5 pb-5">Explore the SYRIOS Collection</h3>
        </center>

        <div className="coin-sort-instructions">
          <ol>
            <li className="story-text mb-5">
              <span className="coin-sort-instruction--desktop">
                Drag coins from the pile on the edges into the center study area.
              </span>
              <span className="coin-sort-instruction--mobile">
                Tap a coin to select it, then tap Add selected coin in the study area.
              </span>
            </li>
            <li className="story-text mb-5">Click on a coin to see complete details.</li>
            <li className="story-text mb-5">
              Use the tools, below, to arrange, sort, and filter the coins to identify the patterns and discover the hidden
              stories that connect them to each other and to us.
            </li>
          </ol>
        </div>

        <div id="coin-sort-wrapper">
          <div className="navbar-spacer" />

          <CoinPile
            coins={coins}
            selectedCoinId={dragged_coin_id}
            setDraggedCoinId={SetDraggedCoinId}
            sortSelection={sort_selection}
            thenBySelection={then_by_selection}
            filterSelection={filter_selection}
            withSelection={with_selection}
            ofKindSelection={of_kind_selection}
            governingPowers={governingPowers}
          />

          <div id="coin-sort-options-wrapper">
            <div id="coin-sort-options">
              <CoinSortDropDown
                title="Sort:"
                selections={sort_selections}
                state={sort_selection}
                setState={set_sort_selection}
                toolTips={coinSortData?.sort_tool_tips}
                showClear={show_sort_clear_button}
                clearTitle="Clear Sort"
                clear={() => {
                  set_sort_selection(sort_selections[0]);
                  set_then_by_selection(then_by_selections[0]);
                  set_show_sort_clear_button(false);
                }}
              />

              <CoinSortDropDown
                title="Then by:"
                selections={then_by_selections}
                state={then_by_selection}
                setState={set_then_by_selection}
              />

              <div className="coin-sort-menu-vr">
                <div className="coin-sort-menu-vr-content" />
              </div>

              <CoinSortDropDown
                title="Filter:"
                selections={filter_selections}
                state={filter_selection}
                setState={set_filter_selection}
                toolTips={coinSortData?.filter_tool_tips}
                showClear={show_filter_clear_button}
                clearTitle="Clear Filter"
                clear={() => {
                  set_filter_selection(filter_selections[0]);
                  set_with_selection(with_selections[0]);
                  set_of_kind_selection(of_kind_selections[0]);
                  set_show_filter_clear_button(false);
                }}
              />

              <CoinSortDropDown
                title="With:"
                selections={with_selections}
                state={with_selection}
                setState={set_with_selection}
              />

              <CoinSortDropDown
                title="Of Kind:"
                selections={of_kind_selections}
                state={of_kind_selection}
                setState={set_of_kind_selection}
              />
            </div>
          </div>

          <CoinGrid
            coinToAdd={dragged_coin_id}
            rotateAll={rotate_all}
            scaleAll={scale_all}
            showScaleAndRotate={ShowScaleAndRotate}
            coinLookup={coinLookup}
          />

          <div style={{ zIndex: -100, position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0 }} />
        </div>
      </div>
    </>
  );
};

export default CoinSort;