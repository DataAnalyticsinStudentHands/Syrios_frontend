import { getAltText, getFullMediaUrl } from 'src/utils/Media';

export const MAP_DATE_RANGE = Object.freeze({ min: -336, max: 408 });

export const FILTER_DIMENSIONS = Object.freeze([
  { key: 'material', label: 'Material' },
  { key: 'authority', label: 'Issuing authority' },
  { key: 'power', label: 'Governing power' },
  { key: 'mint', label: 'Mint' },
  { key: 'territory', label: 'Ancient territory' },
  { key: 'denomination', label: 'Denomination' },
  { key: 'language', label: 'Language' },
]);

export const COMPOSITION_DIMENSIONS = Object.freeze([
  { key: 'material', label: 'Material' },
  { key: 'authority', label: 'Issuing authority' },
  { key: 'power', label: 'Governing power' },
  { key: 'period', label: 'Time period' },
]);

export const PERIODS = Object.freeze([
  { label: '400–301 BCE', min: -400, max: -301 },
  { label: '300–201 BCE', min: -300, max: -201 },
  { label: '200–101 BCE', min: -200, max: -101 },
  { label: '100 BCE–99 CE', min: -100, max: 99 },
  { label: '100–199 CE', min: 100, max: 199 },
  { label: '200–299 CE', min: 200, max: 299 },
  { label: '300–399 CE', min: 300, max: 399 },
  { label: '400 CE and later', min: 400, max: Number.POSITIVE_INFINITY },
]);

export const COLOR_PALETTE = Object.freeze([
  '#a86818',
  '#183848',
  '#7899a8',
  '#a85828',
  '#487848',
  '#d8a048',
  '#684878',
  '#486678',
  '#987818',
]);

const KNOWN_COLORS = Object.freeze({
  Bronze: '#a86818',
  Silver: '#7899a8',
  Gold: '#d8a048',
  Royal: '#684878',
  Imperial: '#a85828',
  Provincial: '#183848',
  Civic: '#487848',
  Uncertain: '#737271',
  Seleucid: '#684878',
  'Roman Principate': '#a85828',
  'Late Roman': '#d8a048',
  'Roman Republic': '#183848',
  Palmyrene: '#487848',
  'Alexander the Great': '#7899a8',
});

const relationAttributes = (relation) => relation?.data?.attributes || {};

const relationValue = (relation, key) => relationAttributes(relation)?.[key] || '';

const finiteYear = (value) => {
  if (value == null || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

export const humanizeCoinId = (value) => {
  if (!value) return 'Catalog coin';
  return value.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
};

export const formatYear = (year) => {
  const numericYear = finiteYear(year);
  if (numericYear == null || numericYear === 0) return null;
  return numericYear < 0 ? `${Math.abs(numericYear)} BCE` : `${numericYear} CE`;
};

export const formatDateRange = (fromYear, toYear) => {
  const from = formatYear(fromYear);
  const to = formatYear(toYear);
  if (from && to && from !== to) return `${from}–${to}`;
  return from || to || 'Date not recorded';
};

export const formatTimelineYear = (year) => {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return '1 BCE / 1 CE';
  return `${year} CE`;
};

export const getPeriodLabel = (fromYear, toYear) => {
  const from = finiteYear(fromYear);
  const to = finiteYear(toYear);
  const midpoint = from != null && to != null ? (from + to) / 2 : from ?? to;
  if (midpoint == null) return 'Date not recorded';
  return PERIODS.find((period) => midpoint >= period.min && midpoint <= period.max)?.label
    || 'Date not recorded';
};

export const getCategoryColor = (value, fallbackIndex = 0) => {
  if (KNOWN_COLORS[value]) return KNOWN_COLORS[value];
  const text = String(value || 'Unknown');
  const hash = [...text].reduce((total, character) => total + character.charCodeAt(0), 0);
  return COLOR_PALETTE[(hash + fallbackIndex) % COLOR_PALETTE.length];
};

export const normalizeLocatedCoins = (rows = []) => rows.flatMap((row) => {
  const attributes = row?.attributes || {};
  const mintRelation = relationAttributes(attributes.mint);

  if (mintRelation.latitude == null || mintRelation.longitude == null) return [];
  const latitude = Number(mintRelation.latitude);
  const longitude = Number(mintRelation.longitude);
  if (
    !Number.isFinite(latitude)
    || !Number.isFinite(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) return [];

  const fromYear = finiteYear(attributes.from_year);
  const toYear = finiteYear(attributes.to_year);
  const obverseImage = attributes.obverse_image;
  const mint = mintRelation.mint || 'Unknown mint';

  return [{
    id: row.id,
    coinId: attributes.coin_id,
    title: attributes.obverse_type || humanizeCoinId(attributes.coin_id),
    fromYear,
    toYear,
    dateRange: formatDateRange(fromYear, toYear),
    period: getPeriodLabel(fromYear, toYear),
    imageUrl: getFullMediaUrl(obverseImage),
    imageAlt: getAltText(obverseImage, `Obverse of ${humanizeCoinId(attributes.coin_id)}`),
    mint,
    modernName: relationValue(mintRelation.modern_name, 'modern_name'),
    modernCountry: relationValue(mintRelation.modern_country, 'modern_country'),
    coordinates: [longitude, latitude],
    material: relationValue(attributes.material, 'material'),
    authority: relationValue(attributes.issuing_authority, 'issuing_authority'),
    power: relationValue(attributes.governing_power, 'governing_power'),
    territory: relationValue(attributes.ancient_territory, 'ancient_territory'),
    denomination: relationValue(attributes.denomination, 'denomination'),
    language: relationValue(attributes.language, 'language'),
    reference: attributes.reference || '',
    sourceImage: attributes.source_image || attributes.souce_image || '',
    rightHolder: attributes.right_holder || '',
  }];
});

export const groupCoinsByMint = (coins = []) => {
  const groups = new Map();
  coins.forEach((coin) => {
    const key = `${coin.mint}|${coin.coordinates[1]}|${coin.coordinates[0]}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: coin.mint,
        coordinates: coin.coordinates,
        modernName: coin.modernName,
        modernCountry: coin.modernCountry,
        coins: [],
      });
    }
    groups.get(key).coins.push(coin);
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      coins: group.coins.sort((a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl))),
    }))
    .sort((a, b) => b.coins.length - a.coins.length || a.name.localeCompare(b.name));
};

export const getFilterOptions = (coins = [], dimension) => [...new Set(
  coins.map((coin) => coin[dimension]).filter(Boolean),
)].sort((a, b) => a.localeCompare(b));

export const getDimensionOptions = (coins = [], dimension) => {
  if (dimension === 'period') return PERIODS.map((period) => period.label);
  return getFilterOptions(coins, dimension);
};

export const getCompositionEntries = (coins = [], dimension) => {
  const counts = new Map();
  coins.forEach((coin) => {
    const value = coin[dimension] || 'Not recorded';
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, count], index) => ({ label, count, color: getCategoryColor(label, index) }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
};

export const filterLocatedCoins = (
  coins,
  { filters, timeRange, comparison },
) => coins.filter((coin) => {
  const coinStart = coin.fromYear ?? coin.toYear ?? MAP_DATE_RANGE.min;
  const coinEnd = coin.toYear ?? coin.fromYear ?? MAP_DATE_RANGE.max;
  if (coinStart > timeRange.end || coinEnd < timeRange.start) return false;

  const passesChips = Object.entries(filters).every(([dimension, selected]) => (
    selected.length === 0 || selected.includes(coin[dimension])
  ));
  if (!passesChips) return false;

  if (comparison.enabled && comparison.a && comparison.b) {
    const value = coin[comparison.dimension];
    return value === comparison.a || value === comparison.b;
  }

  return true;
});
