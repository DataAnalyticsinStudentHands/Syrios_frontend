import { normalizeDetectiveCoin } from '../CoinDetective/coinDetectiveData';

export const CURATOR_DRAFT_VERSION = 1;
export const CURATOR_DRAFT_STORAGE_KEY = 'syrios:coin-curator:draft:v1';
export const CURATOR_EXHIBIT_SIZE = 3;

const inquiry = (definition) => Object.freeze({
  ...definition,
  evidenceFields: Object.freeze([...definition.evidenceFields]),
});

export const COIN_CURATOR_INQUIRIES = Object.freeze({
  'power-transition': inquiry({
    id: 'power-transition',
    label: 'Seleucid to Roman',
    eyebrow: 'Continuity and change',
    field: 'governingPower',
    question: 'What changes, and what persists, as governing powers change?',
    description: 'Build an exhibit around governing power and chronology without treating the catalog as a census of ancient coinage.',
    evidenceFields: ['dateRange', 'governingPower', 'issuingAuthority', 'material', 'obverseType', 'reverseType'],
  }),
  'issuing-authority': inquiry({
    id: 'issuing-authority',
    label: 'Who Issues Money?',
    eyebrow: 'Institutions and authority',
    field: 'issuingAuthority',
    question: 'How do royal, civic, provincial, and imperial issues frame authority differently?',
    description: 'Compare the cataloged issuing institution with the broader governing power recorded for each coin.',
    evidenceFields: ['dateRange', 'issuingAuthority', 'governingPower', 'material', 'obverseType', 'reverseType'],
  }),
  'material-politics': inquiry({
    id: 'material-politics',
    label: 'Gold, Silver, and Bronze',
    eyebrow: 'Material and political choices',
    field: 'material',
    question: 'What can material help us ask about political authority, and what can it not prove by itself?',
    description: 'Compare material alongside date and authority while acknowledging that collection frequencies are not ancient production totals.',
    evidenceFields: ['material', 'dateRange', 'issuingAuthority', 'governingPower', 'denomination', 'diameter'],
  }),
});

const DEFAULT_INQUIRY_ID = 'power-transition';
const MISSING_VALUES = new Set(['', 'na', 'n/a', 'unknown', 'not applicable', 'not recorded', 'date not recorded']);

const cleanText = (value) => {
  if (value == null) return '';
  return String(value).replace(/\s+/g, ' ').trim();
};

export const classifyCuratorValue = (value) => {
  const cleaned = cleanText(value);
  const normalized = cleaned.toLowerCase();
  if (MISSING_VALUES.has(normalized)) return 'missing';
  if (normalized === 'uncertain') return 'uncertain';
  if (normalized === 'none') return 'explicit-none';
  return 'recorded';
};

export const isMeaningfulCuratorValue = (value) => classifyCuratorValue(value) === 'recorded';

export const displayCuratorValue = (value) => {
  const status = classifyCuratorValue(value);
  if (status === 'missing') return 'Not recorded';
  if (status === 'explicit-none') return 'None recorded';
  return cleanText(value);
};

const getEntity = (value) => value?.attributes || value || {};

const isDetectiveCoin = (value) => Boolean(
  value
  && value.id != null
  && Object.prototype.hasOwnProperty.call(value, 'obverseImage')
  && Object.prototype.hasOwnProperty.call(value, 'authority'),
);

const normalizeStableUri = (attributes, row) => cleanText(
  attributes.stable_id
  || attributes.stable_type_uri
  || attributes.stableTypeUri
  || attributes.stableId
  || row?.stable_id
  || row?.stable_type_uri
  || row?.stableTypeUri
  || row?.stableId,
);

const buildCitations = ({ reference, sourceImage, stableTypeUri }) => [
  reference && { key: 'reference', label: 'Catalog reference', value: reference, href: '' },
  stableTypeUri && { key: 'stableTypeUri', label: 'Stable type record', value: stableTypeUri, href: stableTypeUri },
  sourceImage && { key: 'sourceImage', label: 'Image source', value: sourceImage, href: sourceImage },
].filter(Boolean);

const validChronology = (fromYear, toYear) => (
  Number.isFinite(fromYear)
  && Number.isFinite(toYear)
  && fromYear !== 0
  && toYear !== 0
  && fromYear <= toYear
);

const meaningfulFaceDescription = (type, legend) => (
  isMeaningfulCuratorValue(type) || isMeaningfulCuratorValue(legend)
);

export const normalizeCuratorCoin = (row) => {
  if (!row) return null;
  const base = isDetectiveCoin(row) ? row : normalizeDetectiveCoin(row);
  if (!base) return null;

  const attributes = getEntity(row);
  const stableTypeUri = normalizeStableUri(attributes, row);
  const sourceImage = cleanText(
    base.sourceImage
    || attributes.source_image
    || attributes.souce_image
    || row.source_image
    || row.souce_image,
  );
  const reference = cleanText(base.reference || attributes.reference || attributes.ref1);
  const rightsHolder = cleanText(
    base.rightHolder
    || row.rightsHolder
    || attributes.right_holder
    || attributes.rightsHolder,
  );
  const issuingAuthority = cleanText(base.authority || row.issuingAuthority);
  const governingPower = cleanText(base.power || row.governingPower);
  const hasValidChronology = validChronology(base.fromYear, base.toYear);
  const citations = buildCitations({ reference, sourceImage, stableTypeUri });

  const coin = {
    ...base,
    recordId: base.id,
    catalogPath: `/Coin/${base.id}`,
    image: {
      obverseUrl: base.obverseImage?.url || '',
      obverseAlt: base.obverseImage?.alt || '',
      reverseUrl: base.reverseImage?.url || '',
      reverseAlt: base.reverseImage?.alt || '',
    },
    issuingAuthority,
    governingPower,
    rightsHolder,
    stableTypeUri,
    sourceImage,
    reference,
    citations,
    hasCitation: citations.length > 0,
    hasValidChronology,
    hasMeaningfulObverse: meaningfulFaceDescription(base.obverseType, base.obverseLegend),
    hasMeaningfulReverse: meaningfulFaceDescription(base.reverseType, base.reverseLegend),
  };

  coin.curatorReady = Boolean(
    coin.obverseImage
    && coin.reverseImage
    && coin.hasMeaningfulObverse
    && coin.hasMeaningfulReverse
    && coin.hasValidChronology
    && coin.hasCitation
  );

  return coin;
};

export const normalizeCuratorCoins = (rows = []) => rows
  .map(normalizeCuratorCoin)
  .filter(Boolean)
  .sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));

export const getCuratorInquiry = (inquiryId) => (
  COIN_CURATOR_INQUIRIES[inquiryId] || COIN_CURATOR_INQUIRIES[DEFAULT_INQUIRY_ID]
);

export const isEligibleCuratorCoin = (coin, inquiryId = DEFAULT_INQUIRY_ID) => {
  const definition = getCuratorInquiry(inquiryId);
  return Boolean(coin?.curatorReady && isMeaningfulCuratorValue(coin[definition.field]));
};

const stableHash = (value) => {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const coinIdentity = (coinOrId) => String(coinOrId?.id ?? coinOrId ?? '');

const curatorQualityScore = (coin) => (
  Number(Boolean(coin.rightsHolder)) * 10
  + Number(Boolean(coin.reference)) * 4
  + Number(Boolean(coin.stableTypeUri)) * 4
  + Number(Boolean(coin.sourceImage)) * 4
  + Number(isMeaningfulCuratorValue(coin.obverseLegend)) * 2
  + Number(isMeaningfulCuratorValue(coin.reverseLegend)) * 2
  + Math.min(coin.typeCategories?.length || 0, 3)
);

export const dateRangesOverlap = (coinA, coinB) => {
  if (!coinA?.hasValidChronology || !coinB?.hasValidChronology) return false;
  return coinA.fromYear <= coinB.toYear && coinB.fromYear <= coinA.toYear;
};

const DIVERSITY_FIELDS = ['material', 'issuingAuthority', 'governingPower', 'period', 'mint'];

export const scoreCuratorSuggestion = (
  candidate,
  selectedCoins = [],
  inquiryId = DEFAULT_INQUIRY_ID,
) => {
  if (!isEligibleCuratorCoin(candidate, inquiryId)) return Number.NEGATIVE_INFINITY;
  const definition = getCuratorInquiry(inquiryId);
  let score = curatorQualityScore(candidate);

  selectedCoins.forEach((selected) => {
    if (!selected || coinIdentity(selected) === coinIdentity(candidate)) {
      score -= 1000;
      return;
    }

    score += candidate[definition.field] !== selected[definition.field] ? 40 : -18;
    DIVERSITY_FIELDS.forEach((field) => {
      if (
        field !== definition.field
        && isMeaningfulCuratorValue(candidate[field])
        && isMeaningfulCuratorValue(selected[field])
        && candidate[field] !== selected[field]
      ) score += 3;
    });
    score += dateRangesOverlap(candidate, selected) ? 1 : 8;
  });

  return score;
};

const resolveSelectedCoins = (coins, selectedCoinsOrIds = []) => {
  const lookup = new Map(coins.map((coin) => [coinIdentity(coin), coin]));
  return selectedCoinsOrIds
    .map((value) => (typeof value === 'object' ? value : lookup.get(coinIdentity(value))))
    .filter(Boolean)
    .filter((coin, index, values) => values.findIndex((item) => coinIdentity(item) === coinIdentity(coin)) === index);
};

export const orderCuratorCandidates = (
  coins,
  inquiryId = DEFAULT_INQUIRY_ID,
  selectedCoinsOrIds = [],
) => {
  const selected = resolveSelectedCoins(coins, selectedCoinsOrIds);
  const selectedIds = new Set(selected.map(coinIdentity));

  return coins
    .filter((coin) => !selectedIds.has(coinIdentity(coin)) && isEligibleCuratorCoin(coin, inquiryId))
    .map((coin) => ({
      coin,
      score: scoreCuratorSuggestion(coin, selected, inquiryId),
      tieBreak: stableHash(`${inquiryId}|${coinIdentity(coin)}`),
    }))
    .sort((a, b) => b.score - a.score || a.tieBreak - b.tieBreak || coinIdentity(a.coin).localeCompare(coinIdentity(b.coin), undefined, { numeric: true }))
    .map(({ coin }) => coin);
};

export const suggestCuratorCoins = (
  coins,
  inquiryId = DEFAULT_INQUIRY_ID,
  selectedCoinsOrIds = [],
  exhibitSize = CURATOR_EXHIBIT_SIZE,
) => {
  const selected = resolveSelectedCoins(coins, selectedCoinsOrIds)
    .filter((coin) => isEligibleCuratorCoin(coin, inquiryId))
    .slice(0, exhibitSize);
  const suggestions = [];

  while (selected.length + suggestions.length < exhibitSize) {
    const ranked = orderCuratorCandidates(coins, inquiryId, [...selected, ...suggestions]);
    if (ranked.length === 0) break;
    suggestions.push(ranked[0]);
  }

  return suggestions;
};

const EVIDENCE_FIELDS = Object.freeze([
  { key: 'dateRange', label: 'Full cataloged date range' },
  { key: 'material', label: 'Material' },
  { key: 'issuingAuthority', label: 'Issuing authority' },
  { key: 'governingPower', label: 'Governing power' },
  { key: 'mint', label: 'Mint' },
  { key: 'territory', label: 'Ancient territory' },
  { key: 'denomination', label: 'Denomination' },
  { key: 'language', label: 'Language' },
  { key: 'obverseType', label: 'Obverse description' },
  { key: 'reverseType', label: 'Reverse description' },
]);

export const buildEvidenceComparisonRows = (coins = []) => EVIDENCE_FIELDS.map((field) => {
  const values = coins.map((coin) => ({
    coinId: coinIdentity(coin),
    value: displayCuratorValue(coin?.[field.key]),
    status: classifyCuratorValue(coin?.[field.key]),
  }));
  const recordedValues = values
    .filter(({ status }) => status === 'recorded')
    .map(({ value }) => value);
  return {
    ...field,
    values,
    complete: values.length > 0 && values.every(({ status }) => status === 'recorded'),
    different: new Set(recordedValues).size > 1,
  };
});

const blankEntry = () => ({ observation: '', catalogFact: '', reasoning: '' });

export const createCuratorDraft = (inquiryId = DEFAULT_INQUIRY_ID) => ({
  version: CURATOR_DRAFT_VERSION,
  inquiryId: getCuratorInquiry(inquiryId).id,
  selectedCoinIds: [],
  exhibitTitle: '',
  thesis: '',
  conclusion: '',
  limitation: '',
  entries: {},
});

const draftText = (value, maxLength = 5000) => (
  typeof value === 'string' ? value.slice(0, maxLength).trim() : ''
);

const availableIdSet = (availableCoinsOrIds, inquiryId) => {
  if (!Array.isArray(availableCoinsOrIds)) return null;
  return new Set(availableCoinsOrIds
    .filter((value) => (
      !value || typeof value !== 'object' || isEligibleCuratorCoin(value, inquiryId)
    ))
    .map(coinIdentity)
    .filter(Boolean));
};

export const sanitizeCuratorDraft = (input, availableCoinsOrIds) => {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const inquiryId = getCuratorInquiry(source.inquiryId || source.inquiryKey).id;
  const allowed = availableIdSet(availableCoinsOrIds, inquiryId);
  const selectedCoinIds = [...new Set(
    (Array.isArray(source.selectedCoinIds) ? source.selectedCoinIds : [])
      .map(coinIdentity)
      .filter(Boolean)
      .filter((id) => !allowed || allowed.has(id)),
  )].slice(0, CURATOR_EXHIBIT_SIZE);
  const sourceEntries = source.entries && typeof source.entries === 'object' && !Array.isArray(source.entries)
    ? source.entries
    : source.captions || {};
  const entries = Object.fromEntries(selectedCoinIds.map((id) => {
    const entry = sourceEntries[id] && typeof sourceEntries[id] === 'object' ? sourceEntries[id] : blankEntry();
    return [id, {
      observation: draftText(entry.observation),
      catalogFact: draftText(entry.catalogFact),
      reasoning: draftText(entry.reasoning),
    }];
  }));

  return {
    version: CURATOR_DRAFT_VERSION,
    inquiryId,
    selectedCoinIds,
    exhibitTitle: draftText(source.exhibitTitle ?? source.title, 300),
    thesis: draftText(source.thesis),
    conclusion: draftText(source.conclusion),
    limitation: draftText(source.limitation ?? source.uncertaintyReflection),
    entries,
  };
};

export const serializeCuratorDraft = (draft, availableCoinsOrIds) => (
  JSON.stringify(sanitizeCuratorDraft(draft, availableCoinsOrIds))
);

export const restoreCuratorDraft = (serialized, availableCoinsOrIds) => {
  try {
    const value = typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
    return sanitizeCuratorDraft(value, availableCoinsOrIds);
  } catch {
    return createCuratorDraft();
  }
};

const hasStudentText = (value) => typeof value === 'string' && value.trim().length > 0;

export const calculateCuratorRubric = (draftInput, coins = []) => {
  const draft = sanitizeCuratorDraft(draftInput, coins.length > 0 ? coins : undefined);
  const selected = resolveSelectedCoins(coins, draft.selectedCoinIds);
  const exactlyThree = draft.selectedCoinIds.length === CURATOR_EXHIBIT_SIZE;
  const completeEntries = (field) => exactlyThree && draft.selectedCoinIds.every((id) => hasStudentText(draft.entries[id]?.[field]));
  const sourcesAttributed = exactlyThree
    && selected.length === CURATOR_EXHIBIT_SIZE
    && selected.every((coin) => coin.hasCitation);

  const criteria = [
    { id: 'three-coins', label: 'Exactly three coins selected', met: exactlyThree, detail: `${draft.selectedCoinIds.length} of ${CURATOR_EXHIBIT_SIZE} selected` },
    { id: 'thesis', label: 'Exhibit thesis provided', met: hasStudentText(draft.thesis), detail: 'Structure only; historical interpretation is not automatically graded.' },
    { id: 'observations', label: 'Observation caption for every coin', met: completeEntries('observation'), detail: 'Describe visible evidence without relying on hidden catalog facts.' },
    { id: 'catalog-facts', label: 'Catalog-fact caption for every coin', met: completeEntries('catalogFact'), detail: 'Identify the recorded metadata used as evidence.' },
    { id: 'reasoning', label: 'Reasoning caption for every coin', met: completeEntries('reasoning'), detail: 'Explain how the evidence relates to the thesis.' },
    { id: 'conclusion', label: 'Concluding synthesis provided', met: hasStudentText(draft.conclusion), detail: 'Structure only; prose is not scored for a preferred historical claim.' },
    { id: 'sources', label: 'Every selected coin has source attribution', met: sourcesAttributed, detail: 'References, source links, or stable type records are accepted.' },
    { id: 'limitation', label: 'Uncertainty or collection limitation reflected upon', met: hasStudentText(draft.limitation), detail: 'Acknowledge missing, uncertain, or collection-skewed evidence.' },
  ];

  return {
    score: criteria.filter((criterion) => criterion.met).length,
    total: criteria.length,
    criteria,
  };
};
