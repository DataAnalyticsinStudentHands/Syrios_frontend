import { joinUrl } from 'src/utils/Media';

export const COIN_DETECTIVE_MODES = Object.freeze({
  guided: {
    key: 'guided',
    label: 'Guided reading',
    eyebrow: 'Begin with the evidence',
    description: 'Inspect one coin and test four foundational catalog attributions.',
    questionCount: 4,
    fields: ['material', 'authority', 'period', 'power'],
  },
  context: {
    key: 'context',
    label: 'Historical context',
    eyebrow: 'Connect coin and world',
    description: 'Focus on political setting and chronology before revealing the cataloged place.',
    questionCount: 4,
    fields: ['power', 'period', 'authority', 'material'],
  },
  comparison: {
    key: 'comparison',
    label: 'Comparative case',
    eyebrow: 'Look for change',
    description: 'Attribute a coin, then compare it with a contrasting record from the collection.',
    questionCount: 4,
    fields: ['material', 'authority', 'power', 'period'],
  },
});

export const DETECTIVE_PERIODS = Object.freeze([
  { label: '400-301 BCE', min: -400, max: -301 },
  { label: '300-201 BCE', min: -300, max: -201 },
  { label: '200-101 BCE', min: -200, max: -101 },
  { label: '100 BCE-99 CE', min: -100, max: 99 },
  { label: '100-199 CE', min: 100, max: 199 },
  { label: '200-299 CE', min: 200, max: 299 },
  { label: '300-399 CE', min: 300, max: 399 },
  { label: '400 CE and later', min: 400, max: Number.POSITIVE_INFINITY },
]);

export const QUESTION_FIELDS = Object.freeze({
  material: {
    key: 'material',
    label: 'Material',
    prompt: 'Which material does the catalog identify for this coin?',
    hint: 'Surface color can suggest a material, but lighting and conservation can be misleading. Treat the image as evidence, not proof.',
  },
  authority: {
    key: 'authority',
    label: 'Issuing authority',
    prompt: 'Which issuing authority is recorded for this coin?',
    hint: 'Issuing authority describes the kind of institution responsible for the issue, such as royal, civic, provincial, or imperial.',
  },
  power: {
    key: 'power',
    label: 'Governing power',
    prompt: 'Which broader governing power is associated with this coin?',
    hint: 'A governing power is the political regime or state in control. It is related to, but not the same as, the issuing authority.',
  },
  period: {
    key: 'period',
    label: 'Broad period',
    prompt: 'Into which broad date period does the cataloged range fall?',
    hint: 'Portrait style, lettering, and political titles may offer chronological clues. The answer uses the midpoint of the cataloged date range.',
  },
  mint: {
    key: 'mint',
    label: 'Mint',
    prompt: "At which mint does the catalog place this coin's production?",
    hint: 'A mint is a place of production. It should not be confused with the place where a coin was found or later circulated.',
  },
  territory: {
    key: 'territory',
    label: 'Ancient territory',
    prompt: 'Which ancient territory is associated with the cataloged mint?',
    hint: 'Ancient territories and modern national borders describe different geographic systems.',
  },
  language: {
    key: 'language',
    label: 'Language',
    prompt: 'Which language is recorded for the coin legend?',
    hint: 'Look at the shapes and direction of the visible lettering, while remembering that worn inscriptions can be difficult to read from an image.',
  },
  denomination: {
    key: 'denomination',
    label: 'Denomination',
    prompt: 'Which denomination is recorded for this coin?',
    hint: 'Denomination depends on more than visible size. Weight standards, material, date, and issuing system all matter.',
  },
});

const getEntity = (value) => value?.attributes || value || {};

const unwrapRelation = (relation) => {
  if (relation == null) return null;
  if (typeof relation === 'string' || typeof relation === 'number') return relation;
  const data = Object.prototype.hasOwnProperty.call(relation, 'data') ? relation.data : relation;
  if (data == null || Array.isArray(data)) return null;
  return getEntity(data);
};

const relationValue = (relation, keys) => {
  if (typeof relation === 'string' || typeof relation === 'number') return String(relation).trim();
  const entity = unwrapRelation(relation);
  if (!entity || typeof entity !== 'object') return '';
  const keyList = Array.isArray(keys) ? keys : [keys];
  for (const key of keyList) {
    const value = entity[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return '';
};

const relationValues = (relation, keys) => {
  const data = relation?.data ?? relation;
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => {
      const entity = getEntity(item);
      const keyList = Array.isArray(keys) ? keys : [keys];
      return keyList.map((key) => entity?.[key]).find((value) => value != null && String(value).trim());
    })
    .filter(Boolean)
    .map((value) => String(value).trim());
};

const finiteNumber = (value) => {
  if (value == null || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const historicalYear = (value) => {
  const numeric = finiteNumber(value);
  return numeric === 0 ? null : numeric;
};

const cleanText = (value) => {
  if (value == null) return '';
  return String(value).replace(/\s+/g, ' ').trim();
};

const NON_QUESTION_VALUES = new Set(['na', 'n/a', 'none', 'unknown', 'not applicable', 'not recorded', 'uncertain']);

const meaningfulQuestionValue = (value) => {
  const cleaned = cleanText(value);
  return cleaned && !NON_QUESTION_VALUES.has(cleaned.toLowerCase()) ? cleaned : '';
};

const humanizeId = (value) => cleanText(value).replace(/[_-]+/g, ' ');

const mediaAttributes = (media) => {
  const data = media?.data ?? media;
  if (!data || Array.isArray(data)) return null;
  return getEntity(data);
};

const normalizeMedia = (media, fallbackAlt) => {
  const attributes = mediaAttributes(media);
  if (!attributes) return null;
  const path = attributes?.formats?.large?.url
    || attributes?.formats?.medium?.url
    || attributes?.formats?.small?.url
    || attributes?.url;
  if (!path) return null;
  return {
    url: joinUrl(path),
    alt: cleanText(attributes.alternativeText || attributes.caption || fallbackAlt),
  };
};

export const formatDetectiveYear = (year) => {
  const numeric = historicalYear(year);
  if (numeric == null) return '';
  if (numeric < 0) return `${Math.abs(numeric)} BCE`;
  return `${numeric} CE`;
};

export const formatDetectiveDateRange = (fromYear, toYear) => {
  const from = formatDetectiveYear(fromYear);
  const to = formatDetectiveYear(toYear);
  if (from && to && from !== to) return `${from}-${to}`;
  return from || to || 'Date not recorded';
};

export const getDetectivePeriod = (fromYear, toYear) => {
  const from = historicalYear(fromYear);
  const to = historicalYear(toYear);
  const midpoint = from != null && to != null ? (from + to) / 2 : from ?? to;
  if (midpoint == null) return '';
  return DETECTIVE_PERIODS.find((period) => midpoint >= period.min && midpoint <= period.max)?.label || '';
};

export const normalizeDetectiveCoin = (row) => {
  if (!row) return null;
  const attributes = getEntity(row);
  const id = row.id ?? attributes.id;
  if (id == null) return null;

  const mintEntity = unwrapRelation(attributes.mint) || {};
  const mint = relationValue(attributes.mint, ['mint', 'name']);
  const modernName = relationValue(mintEntity.modern_name, ['modern_name', 'name']);
  const modernCountry = relationValue(mintEntity.modern_country, ['modern_country', 'name']);
  const latitude = finiteNumber(mintEntity.latitude);
  const longitude = finiteNumber(mintEntity.longitude);
  const coordinates = latitude != null
    && longitude != null
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180
    ? [longitude, latitude]
    : null;

  const coinId = cleanText(attributes.coin_id) || `coin-${id}`;
  const obverseType = cleanText(attributes.obverse_type);
  const reverseType = cleanText(attributes.reverse_type);
  const obverseImage = normalizeMedia(attributes.obverse_image || attributes.obverse_file, `Obverse of ${humanizeId(coinId)}`);
  const reverseImage = normalizeMedia(attributes.reverse_image || attributes.reverse_file, `Reverse of ${humanizeId(coinId)}`);
  const fromYear = historicalYear(attributes.from_year ?? attributes.from_date);
  const toYear = historicalYear(attributes.to_year ?? attributes.to_date);
  const rawDiameter = finiteNumber(attributes.diameter);

  const coin = {
    id,
    coinId,
    title: obverseType || reverseType || humanizeId(coinId) || 'Catalog coin',
    fromYear,
    toYear,
    dateRange: formatDetectiveDateRange(fromYear, toYear),
    period: getDetectivePeriod(fromYear, toYear),
    diameter: rawDiameter != null && rawDiameter > 0 ? rawDiameter : null,
    material: relationValue(attributes.material, ['material', 'name']),
    authority: relationValue(attributes.issuing_authority, ['issuing_authority', 'name']),
    power: relationValue(attributes.governing_power, ['governing_power', 'name']),
    denomination: relationValue(attributes.denomination, ['denomination', 'name']),
    language: relationValue(attributes.language, ['language', 'name']),
    territory: relationValue(attributes.ancient_territory, ['ancient_territory', 'name']),
    mint,
    modernName,
    modernCountry,
    coordinates,
    obverseType,
    obverseLegend: cleanText(attributes.obverse_legend),
    reverseType,
    reverseLegend: cleanText(attributes.reverse_legend),
    typeCategories: relationValues(attributes.type_categories || attributes.type_category, ['type_category', 'name']),
    obverseImage,
    reverseImage,
    reference: cleanText(attributes.reference || attributes.ref1),
    sourceImage: cleanText(attributes.source_image || attributes.souce_image),
    rightHolder: cleanText(attributes.right_holder),
  };

  coin.hasImage = Boolean(coin.obverseImage || coin.reverseImage);
  coin.inspectionReady = Boolean(
    coin.obverseImage
    && coin.reverseImage
    && (coin.obverseType || coin.obverseLegend)
    && (coin.reverseType || coin.reverseLegend)
  );
  coin.displayName = [coin.authority, coin.mint, coin.material].filter(Boolean).join(' / ') || coin.title;
  return coin;
};

export const normalizeDetectiveCoins = (rows = []) => rows
  .map(normalizeDetectiveCoin)
  .filter(Boolean)
  .sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));

const stableHash = (value) => {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const deterministicShuffle = (values, seed) => [...values]
  .map((value) => ({ value, rank: stableHash(`${seed}|${value}`) }))
  .sort((a, b) => a.rank - b.rank || String(a.value).localeCompare(String(b.value)))
  .map(({ value }) => value);

const uniqueValues = (coins, field) => [...new Set(
  coins.map((coin) => meaningfulQuestionValue(coin?.[field])).filter(Boolean),
)];

export const buildQuestionDeck = (coin, coins, modeKey = 'guided') => {
  if (!coin) return [];
  const mode = COIN_DETECTIVE_MODES[modeKey] || COIN_DETECTIVE_MODES.guided;

  return mode.fields.flatMap((field) => {
    const definition = QUESTION_FIELDS[field];
    const answer = meaningfulQuestionValue(coin[field]);
    if (!definition || !answer) return [];

    const distractors = deterministicShuffle(
      uniqueValues(coins, field).filter((value) => value !== answer),
      `${coin.id}|${field}|distractors`,
    ).slice(0, 3);
    if (distractors.length === 0) return [];

    const options = deterministicShuffle(
      [answer, ...distractors],
      `${coin.id}|${field}|options`,
    );

    return [{ ...definition, answer, options }];
  }).slice(0, mode.questionCount);
};

export const getEligibleDetectiveCoins = (coins, modeKey = 'guided') => {
  const mode = COIN_DETECTIVE_MODES[modeKey] || COIN_DETECTIVE_MODES.guided;
  return coins.filter((coin) => (
    coin.inspectionReady
    && coin.mint
    && coin.coordinates
    && buildQuestionDeck(coin, coins, modeKey).length === mode.questionCount
  ));
};

export const scoreDetectiveAnswers = (questions, answers = {}) => {
  const correct = questions.filter((question) => answers[question.key] === question.answer).length;
  return { correct, total: questions.length };
};

const COMPARISON_FIELDS = ['material', 'authority', 'power', 'period', 'mint', 'territory', 'language', 'denomination'];

export const findComparisonCoin = (coin, coins) => {
  if (!coin) return null;
  const candidates = coins
    .filter((candidate) => candidate.id !== coin.id && candidate.inspectionReady)
    .map((candidate) => {
      const differences = COMPARISON_FIELDS.reduce((total, field) => {
        if (!coin[field] || !candidate[field]) return total;
        return total + (coin[field] === candidate[field] ? 0 : 1);
      }, 0);
      const sameMint = Number(Boolean(coin.mint && candidate.mint && coin.mint === candidate.mint));
      const samePeriod = Number(Boolean(coin.period && candidate.period && coin.period === candidate.period));
      const samePower = Number(Boolean(coin.power && candidate.power && coin.power === candidate.power));
      return {
        candidate,
        score: differences * 4 + sameMint * 8 + samePeriod * 3 + samePower * 2,
      };
    })
    .sort((a, b) => b.score - a.score || String(a.candidate.id).localeCompare(String(b.candidate.id), undefined, { numeric: true }));

  return candidates[0]?.candidate || null;
};

export const getComparisonRows = (coinA, coinB) => {
  if (!coinA || !coinB) return [];
  return COMPARISON_FIELDS
    .filter((field) => coinA[field] || coinB[field])
    .map((field) => ({
      key: field,
      label: QUESTION_FIELDS[field]?.label || field,
      a: coinA[field] || 'Not recorded',
      b: coinB[field] || 'Not recorded',
      different: Boolean(coinA[field] && coinB[field] && coinA[field] !== coinB[field]),
    }));
};
