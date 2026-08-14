import { describe, expect, it } from 'vitest';
import {
  COIN_CURATOR_INQUIRIES,
  buildEvidenceComparisonRows,
  calculateCuratorRubric,
  classifyCuratorValue,
  createCuratorDraft,
  dateRangesOverlap,
  isEligibleCuratorCoin,
  normalizeCuratorCoin,
  normalizeCuratorCoins,
  orderCuratorCandidates,
  restoreCuratorDraft,
  sanitizeCuratorDraft,
  serializeCuratorDraft,
  suggestCuratorCoins,
} from './coinCuratorData';

const relation = (attributes) => ({ data: { attributes } });
const media = (name) => relation({
  alternativeText: `${name} image`,
  url: `/uploads/${name}.png`,
  formats: { small: { url: `/uploads/small-${name}.png` } },
});

const row = ({
  id,
  material = 'Bronze',
  authority = 'Royal',
  power = 'Seleucid',
  fromYear = -300,
  toYear = -280,
  obverseType = `Portrait ${id}`,
  reverseType = `Standing figure ${id}`,
  obverseLegend = 'BASILEOS',
  reverseLegend = 'ANTIOXEON',
  obverseImage = true,
  reverseImage = true,
  reference = `Reference ${id}`,
  sourceImage = `https://example.com/source/${id}`,
  stableTypeUri = `https://example.com/type/${id}`,
  rightsHolder = 'Example museum',
  mint = 'Antioch',
} = {}) => ({
  id,
  attributes: {
    coin_id: `curator_coin_${id}`,
    from_year: fromYear,
    to_year: toYear,
    diameter: 24,
    obverse_type: obverseType,
    obverse_legend: obverseLegend,
    reverse_type: reverseType,
    reverse_legend: reverseLegend,
    material: material ? relation({ material }) : { data: null },
    issuing_authority: authority ? relation({ issuing_authority: authority }) : { data: null },
    governing_power: power ? relation({ governing_power: power }) : { data: null },
    denomination: relation({ denomination: 'Tetradrachm' }),
    language: relation({ language: 'Greek' }),
    ancient_territory: relation({ ancient_territory: 'Syria' }),
    mint: relation({
      mint,
      latitude: 36.2,
      longitude: 36.15,
      modern_name: relation({ modern_name: 'Antakya' }),
      modern_country: relation({ modern_country: 'Turkey' }),
    }),
    type_categories: { data: [{ id: 1, attributes: { type_category: 'Ruler' } }] },
    obverse_image: obverseImage ? media(`obverse-${id}`) : { data: null },
    reverse_image: reverseImage ? media(`reverse-${id}`) : { data: null },
    reference,
    souce_image: sourceImage,
    stable_id: stableTypeUri,
    right_holder: rightsHolder,
  },
});

const variedRows = () => [
  row({ id: 1, material: 'Bronze', authority: 'Royal', power: 'Seleucid', fromYear: -300, toYear: -280 }),
  row({ id: 2, material: 'Silver', authority: 'Imperial', power: 'Roman Principate', fromYear: 100, toYear: 120 }),
  row({ id: 3, material: 'Gold', authority: 'Provincial', power: 'Late Roman', fromYear: 300, toYear: 320 }),
  row({ id: 4, material: 'Bronze', authority: 'Civic', power: 'Roman Republic', fromYear: -90, toYear: -70 }),
  row({ id: 5, material: 'Silver', authority: 'Royal', power: 'Seleucid', fromYear: -220, toYear: -200, rightsHolder: '' }),
];

describe('CoinCurator data normalization and eligibility', () => {
  it('normalizes raw and already-normalized Strapi rows with citation aliases', () => {
    const raw = row({ id: 1, reference: '', stableTypeUri: '', rightsHolder: '' });
    const normalized = { id: raw.id, ...raw.attributes };
    const rawCoin = normalizeCuratorCoin(raw);
    const normalizedCoin = normalizeCuratorCoin(normalized);

    [rawCoin, normalizedCoin].forEach((coin) => {
      expect(coin).toMatchObject({
        id: 1,
        recordId: 1,
        catalogPath: '/Coin/1',
        material: 'Bronze',
        issuingAuthority: 'Royal',
        governingPower: 'Seleucid',
        dateRange: '300 BCE-280 BCE',
        sourceImage: 'https://example.com/source/1',
        rightsHolder: '',
        hasCitation: true,
        curatorReady: true,
      });
      expect(coin.image.obverseUrl).toContain('/uploads/small-obverse-1.png');
      expect(coin.image.reverseUrl).toContain('/uploads/small-reverse-1.png');
      expect(coin.citations.map((citation) => citation.key)).toEqual(['sourceImage']);
    });
  });

  it('exposes three frozen inquiry definitions and applies field-specific eligibility', () => {
    expect(Object.keys(COIN_CURATOR_INQUIRIES)).toEqual([
      'power-transition',
      'issuing-authority',
      'material-politics',
    ]);
    expect(Object.isFrozen(COIN_CURATOR_INQUIRIES)).toBe(true);
    Object.values(COIN_CURATOR_INQUIRIES).forEach((definition) => {
      expect(Object.isFrozen(definition)).toBe(true);
      expect(Object.isFrozen(definition.evidenceFields)).toBe(true);
    });

    const coin = normalizeCuratorCoin(row({ id: 10, material: 'Uncertain' }));
    expect(isEligibleCuratorCoin(coin, 'power-transition')).toBe(true);
    expect(isEligibleCuratorCoin(coin, 'issuing-authority')).toBe(true);
    expect(isEligibleCuratorCoin(coin, 'material-politics')).toBe(false);
  });

  it('rejects year zero, incomplete faces, meaningless descriptions, and missing sources', () => {
    const cases = [
      row({ id: 20, fromYear: 0, toYear: 0 }),
      row({ id: 21, reverseImage: false }),
      row({ id: 22, obverseType: 'NA', obverseLegend: 'None' }),
      row({ id: 23, reverseType: '', reverseLegend: 'Unknown' }),
      row({ id: 24, reference: '', sourceImage: '', stableTypeUri: '' }),
      row({ id: 25, fromYear: 100, toYear: 90 }),
    ];
    const coins = normalizeCuratorCoins(cases);

    coins.forEach((coin) => {
      expect(isEligibleCuratorCoin(coin, 'power-transition')).toBe(false);
    });
    expect(classifyCuratorValue('Uncertain')).toBe('uncertain');
    expect(classifyCuratorValue('None')).toBe('explicit-none');
    expect(classifyCuratorValue('N/A')).toBe('missing');
  });
});

describe('CoinCurator deterministic suggestions and evidence', () => {
  it('orders candidates deterministically regardless of source ordering', () => {
    const coins = normalizeCuratorCoins(variedRows());
    const first = orderCuratorCandidates(coins, 'power-transition').map((coin) => coin.id);
    const second = orderCuratorCandidates([...coins].reverse(), 'power-transition').map((coin) => coin.id);

    expect(first).toEqual(second);
  });

  it.each(Object.keys(COIN_CURATOR_INQUIRIES))(
    'suggests three unique, eligible records for %s',
    (inquiryId) => {
      const coins = normalizeCuratorCoins(variedRows());
      const suggestionsA = suggestCuratorCoins(coins, inquiryId);
      const suggestionsB = suggestCuratorCoins(coins, inquiryId);

      expect(suggestionsA.map((coin) => coin.id)).toEqual(suggestionsB.map((coin) => coin.id));
      expect(suggestionsA).toHaveLength(3);
      expect(new Set(suggestionsA.map((coin) => coin.id)).size).toBe(3);
      suggestionsA.forEach((coin) => expect(isEligibleCuratorCoin(coin, inquiryId)).toBe(true));
    },
  );

  it('never repeats a selected coin and fills only the remaining exhibit slots', () => {
    const coins = normalizeCuratorCoins(variedRows());
    const selected = [coins[0]];
    const suggestions = suggestCuratorCoins(coins, 'material-politics', selected);

    expect(suggestions).toHaveLength(2);
    expect(suggestions.map((coin) => coin.id)).not.toContain(coins[0].id);
    expect(new Set([...selected, ...suggestions].map((coin) => coin.id)).size).toBe(3);
  });

  it('uses inclusive full date ranges for overlap and evidence comparison', () => {
    const a = normalizeCuratorCoin(row({ id: 31, fromYear: -300, toYear: -280 }));
    const overlapping = normalizeCuratorCoin(row({ id: 32, fromYear: -280, toYear: -260 }));
    const separate = normalizeCuratorCoin(row({ id: 33, fromYear: -200, toYear: -180 }));

    expect(dateRangesOverlap(a, overlapping)).toBe(true);
    expect(dateRangesOverlap(a, separate)).toBe(false);

    const dateRow = buildEvidenceComparisonRows([a, separate])
      .find((evidence) => evidence.key === 'dateRange');
    expect(dateRow.label).toBe('Full cataloged date range');
    expect(dateRow.values.map(({ value }) => value)).toEqual(['300 BCE-280 BCE', '200 BCE-180 BCE']);
    expect(dateRow.different).toBe(true);
  });

  it('classifies a missing chronology as missing evidence rather than a recorded date', () => {
    const undated = normalizeCuratorCoin(row({ id: 34, fromYear: 0, toYear: 0 }));
    const dateRow = buildEvidenceComparisonRows([undated])
      .find((evidence) => evidence.key === 'dateRange');

    expect(dateRow.values[0]).toMatchObject({ value: 'Not recorded', status: 'missing' });
    expect(dateRow.complete).toBe(false);
  });

});

describe('CoinCurator local drafts and structural rubric', () => {
  it('creates, sanitizes, serializes, and restores a bounded local draft', () => {
    const coins = normalizeCuratorCoins(variedRows());
    const unsafe = {
      version: 999,
      inquiryId: 'not-real',
      selectedCoinIds: [1, '1', 2, 999, 3, 4],
      exhibitTitle: '  A student exhibit  ',
      thesis: '  A thesis  ',
      conclusion: 42,
      limitation: '  Collection evidence is incomplete.  ',
      entries: {
        1: { observation: '  Visible portrait  ', catalogFact: 'Bronze', reasoning: 'Supports the claim' },
        2: { observation: 'Second observation', catalogFact: 'Silver', reasoning: 'A contrast' },
        3: { observation: 'Orphaned after limit', catalogFact: 'Gold', reasoning: 'Third' },
        999: { observation: 'Unavailable', catalogFact: 'No', reasoning: 'No' },
      },
    };
    const sanitized = sanitizeCuratorDraft(unsafe, coins);

    expect(sanitized).toMatchObject({
      version: 1,
      inquiryId: 'power-transition',
      selectedCoinIds: ['1', '2', '3'],
      exhibitTitle: 'A student exhibit',
      thesis: 'A thesis',
      conclusion: '',
      limitation: 'Collection evidence is incomplete.',
    });
    expect(Object.keys(sanitized.entries)).toEqual(['1', '2', '3']);
    expect(sanitized.entries['1'].observation).toBe('Visible portrait');

    const serialized = serializeCuratorDraft(sanitized, coins);
    expect(restoreCuratorDraft(serialized, coins)).toEqual(sanitized);
    expect(restoreCuratorDraft('{bad json', coins)).toEqual(createCuratorDraft());
  });

  it('awards rubric credit only for required structure, not historical wording', () => {
    const coins = normalizeCuratorCoins(variedRows()).slice(0, 3);
    const draft = {
      ...createCuratorDraft('material-politics'),
      selectedCoinIds: coins.map((coin) => String(coin.id)),
      thesis: 'Any nonempty student-authored thesis is structurally complete.',
      conclusion: 'Any nonempty conclusion is structurally complete.',
      limitation: 'The collection is not a census of ancient production.',
      entries: Object.fromEntries(coins.map((coin) => [String(coin.id), {
        observation: 'Student observation',
        catalogFact: 'Student-selected catalog fact',
        reasoning: 'Student reasoning',
      }])),
    };
    const rubric = calculateCuratorRubric(draft, coins);

    expect(rubric).toMatchObject({ score: 8, total: 8 });
    expect(rubric.criteria).toHaveLength(8);
    expect(rubric.criteria.every((criterion) => criterion.met)).toBe(true);
  });

  it('checks caption, attribution, and reflection requirements independently', () => {
    const coins = normalizeCuratorCoins(variedRows()).slice(0, 3);
    coins[2] = { ...coins[2], hasCitation: false };

    const draft = {
      ...createCuratorDraft(),
      selectedCoinIds: coins.map((coin) => String(coin.id)),
      thesis: 'A thesis',
      conclusion: 'A conclusion',
      limitation: '',
      entries: Object.fromEntries(coins.map((coin, index) => [String(coin.id), {
        observation: 'Observation',
        catalogFact: index === 1 ? '' : 'Fact',
        reasoning: 'Reasoning',
      }])),
    };
    const rubric = calculateCuratorRubric(draft, coins);
    const byId = Object.fromEntries(rubric.criteria.map((criterion) => [criterion.id, criterion.met]));

    expect(byId['three-coins']).toBe(true);
    expect(byId['catalog-facts']).toBe(false);
    expect(byId.sources).toBe(false);
    expect(byId.limitation).toBe(false);
  });

  it('drops stale records that are ineligible for the saved inquiry', () => {
    const coins = normalizeCuratorCoins([
      ...variedRows(),
      row({ id: 99, material: 'Uncertain' }),
    ]);
    const draft = createCuratorDraft('material-politics');
    draft.selectedCoinIds = ['1', '2', '99'];
    draft.entries = Object.fromEntries(draft.selectedCoinIds.map((id) => [id, {
      observation: 'Observation', catalogFact: 'Fact', reasoning: 'Reasoning',
    }]));

    expect(sanitizeCuratorDraft(draft, coins).selectedCoinIds).toEqual(['1', '2']);
  });
});
