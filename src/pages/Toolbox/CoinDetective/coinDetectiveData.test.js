import { describe, expect, it } from 'vitest';
import {
  buildQuestionDeck,
  findComparisonCoin,
  formatDetectiveDateRange,
  getComparisonRows,
  getEligibleDetectiveCoins,
  normalizeDetectiveCoin,
  normalizeDetectiveCoins,
  scoreDetectiveAnswers,
} from './coinDetectiveData';

const relation = (attributes) => ({ data: { attributes } });
const media = (name, alternativeText = '') => relation({
  alternativeText,
  url: `/uploads/${name}.png`,
  formats: { small: { url: `/uploads/small_${name}.png` } },
});

const row = ({
  id,
  material = 'Bronze',
  authority = 'Royal',
  power = 'Seleucid',
  mint = 'Antioch',
  territory = 'Syria',
  language = 'Greek',
  denomination = 'Tetradrachm',
  fromYear = -300,
  toYear = -280,
  withObverse = true,
  withReverse = true,
} = {}) => ({
  id,
  attributes: {
    coin_id: `case_coin_${id}`,
    from_year: fromYear,
    to_year: toYear,
    diameter: 24,
    obverse_type: `Portrait ${id}`,
    obverse_legend: 'BASILEOS',
    reverse_type: `Standing figure ${id}`,
    reverse_legend: 'ANTIOXEON',
    material: material ? relation({ material }) : { data: null },
    issuing_authority: authority ? relation({ issuing_authority: authority }) : { data: null },
    governing_power: power ? relation({ governing_power: power }) : { data: null },
    ancient_territory: territory ? relation({ ancient_territory: territory }) : { data: null },
    language: language ? relation({ language }) : { data: null },
    denomination: denomination ? relation({ denomination }) : { data: null },
    mint: mint ? relation({
      mint,
      latitude: 36.2,
      longitude: 36.15,
      modern_name: relation({ modern_name: 'Antakya' }),
      modern_country: relation({ modern_country: 'Turkey' }),
    }) : { data: null },
    type_categories: { data: [{ id: 1, attributes: { type_category: 'Ruler' } }] },
    obverse_image: withObverse ? media(`obverse-${id}`, `Obverse ${id}`) : { data: null },
    reverse_image: withReverse ? media(`reverse-${id}`, `Reverse ${id}`) : { data: null },
    reference: `Reference ${id}`,
    source_image: `https://example.com/source/${id}`,
    right_holder: 'Example museum',
  },
});

const variedRows = () => [
  row({ id: 1 }),
  row({ id: 2, material: 'Silver', authority: 'Imperial', power: 'Roman Principate', mint: 'Damascus', territory: 'Coele Syria', language: 'Latin', denomination: 'Denarius', fromYear: 100, toYear: 120 }),
  row({ id: 3, material: 'Gold', authority: 'Civic', power: 'Roman Republic', mint: 'Sidon', territory: 'Phoenicia', language: 'Phoenician', denomination: 'Stater', fromYear: -90, toYear: -70 }),
  row({ id: 4, material: 'Orichalcum', authority: 'Provincial', power: 'Late Roman', mint: 'Zeugma', territory: 'Commagene', language: 'Aramaic', denomination: 'As', fromYear: 310, toYear: 330 }),
  row({ id: 5, material: 'Silver', authority: 'Royal', power: 'Ptolemaic', mint: 'Ake-Ptolemais', territory: 'Phoenicia', language: 'Greek', denomination: 'Drachm', fromYear: -220, toYear: -200 }),
];

describe('CoinDetective data', () => {
  it('normalizes raw Strapi records into a complete investigation model', () => {
    const coin = normalizeDetectiveCoin(row({ id: 1 }));

    expect(coin).toMatchObject({
      id: 1,
      material: 'Bronze',
      authority: 'Royal',
      power: 'Seleucid',
      mint: 'Antioch',
      modernName: 'Antakya',
      modernCountry: 'Turkey',
      coordinates: [36.15, 36.2],
      dateRange: '300 BCE-280 BCE',
      period: '300-201 BCE',
      typeCategories: ['Ruler'],
      reference: 'Reference 1',
      rightHolder: 'Example museum',
      hasImage: true,
    });
    expect(coin.obverseImage.url).toContain('/uploads/small_obverse-1.png');
    expect(coin.reverseImage.url).toContain('/uploads/small_reverse-1.png');
  });

  it('supports normalized rows, relation fallbacks, and an obverse-only record', () => {
    const raw = row({ id: 9, withReverse: false });
    const normalized = { id: raw.id, ...raw.attributes };
    const coin = normalizeDetectiveCoin(normalized);

    expect(coin.id).toBe(9);
    expect(coin.obverseImage).not.toBeNull();
    expect(coin.reverseImage).toBeNull();
    expect(coin.hasImage).toBe(true);
  });

  it('formats BCE and CE ranges without inventing missing dates', () => {
    expect(formatDetectiveDateRange(-20, 10)).toBe('20 BCE-10 CE');
    expect(formatDetectiveDateRange(100, 100)).toBe('100 CE');
    expect(formatDetectiveDateRange(null, null)).toBe('Date not recorded');
  });

  it('builds deterministic questions with unique options and one catalog answer', () => {
    const coins = normalizeDetectiveCoins(variedRows());
    const first = buildQuestionDeck(coins[0], coins, 'guided');
    const second = buildQuestionDeck(coins[0], coins, 'guided');

    expect(first).toEqual(second);
    expect(first).toHaveLength(4);
    first.forEach((question) => {
      expect(new Set(question.options).size).toBe(question.options.length);
      expect(question.options.filter((option) => option === question.answer)).toHaveLength(1);
    });
  });

  it('never asks about missing metadata and excludes incomplete challenge records', () => {
    const rows = variedRows();
    rows.push(row({ id: 6, language: '', denomination: '', power: '', territory: '' }));
    rows.push(row({ id: 7, withObverse: false, withReverse: false }));
    rows.push(row({ id: 8, mint: '' }));
    const coins = normalizeDetectiveCoins(rows);
    const incomplete = coins.find((coin) => coin.id === 6);
    const deck = buildQuestionDeck(incomplete, coins, 'context');

    expect(deck.some((question) => ['language', 'denomination', 'power', 'territory'].includes(question.key))).toBe(false);
    expect(getEligibleDetectiveCoins(coins, 'context').map((coin) => coin.id)).not.toContain(6);
    expect(getEligibleDetectiveCoins(coins, 'guided').map((coin) => coin.id)).not.toContain(7);
    expect(getEligibleDetectiveCoins(coins, 'guided').map((coin) => coin.id)).not.toContain(8);
  });

  it('scores catalog matches and chooses a useful contrasting record', () => {
    const coins = normalizeDetectiveCoins(variedRows());
    const questions = buildQuestionDeck(coins[0], coins, 'guided');
    const answers = Object.fromEntries(questions.map((question, index) => [
      question.key,
      index === 0 ? question.answer : 'Different answer',
    ]));
    const comparison = findComparisonCoin(coins[0], coins);
    const rows = getComparisonRows(coins[0], comparison);

    expect(scoreDetectiveAnswers(questions, answers)).toEqual({ correct: 1, total: 4 });
    expect(comparison.id).not.toBe(coins[0].id);
    expect(rows.some((comparisonRow) => comparisonRow.different)).toBe(true);
  });
});
