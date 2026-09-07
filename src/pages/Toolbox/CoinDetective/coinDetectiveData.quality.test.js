import { describe, expect, it } from 'vitest';
import {
  buildQuestionDeck,
  formatDetectiveDateRange,
  normalizeDetectiveCoin,
  normalizeDetectiveCoins,
} from './coinDetectiveData';

const relation = (attributes) => ({ data: { attributes } });
const media = (url) => relation({ url });

const makeRow = ({ id, material, authority, power, fromYear, diameter = 20 }) => ({
  id,
  attributes: {
    coin_id: `quality_${id}`,
    from_year: fromYear,
    to_year: fromYear,
    diameter,
    obverse_type: 'Portrait',
    reverse_type: 'Standing figure',
    obverse_image: media(`/uploads/obverse-${id}.png`),
    reverse_image: media(`/uploads/reverse-${id}.png`),
    material: relation({ material }),
    issuing_authority: relation({ issuing_authority: authority }),
    governing_power: relation({ governing_power: power }),
    mint: relation({ mint: 'Antioch', latitude: 36.2, longitude: 36.15 }),
  },
});

describe('CoinDetective catalog-quality rules', () => {
  it('treats historical year zero and nonpositive diameters as missing', () => {
    const coin = normalizeDetectiveCoin(makeRow({
      id: 1,
      material: 'Bronze',
      authority: 'Royal',
      power: 'Seleucid',
      fromYear: 0,
      diameter: 0,
    }));

    expect(coin.fromYear).toBeNull();
    expect(coin.toYear).toBeNull();
    expect(coin.period).toBe('');
    expect(coin.dateRange).toBe('Date not recorded');
    expect(coin.diameter).toBeNull();
    expect(formatDetectiveDateRange(0, 0)).toBe('Date not recorded');
  });

  it('displays catalog uncertainty but does not use it as an answer or distractor', () => {
    const coins = normalizeDetectiveCoins([
      makeRow({ id: 1, material: 'Uncertain', authority: 'Royal', power: 'Seleucid', fromYear: -200 }),
      makeRow({ id: 2, material: 'Bronze', authority: 'Imperial', power: 'Roman Principate', fromYear: 100 }),
      makeRow({ id: 3, material: 'Silver', authority: 'Civic', power: 'Roman Republic', fromYear: -50 }),
      makeRow({ id: 4, material: 'Gold', authority: 'Provincial', power: 'Late Roman', fromYear: 300 }),
    ]);
    const uncertainCoin = coins.find((coin) => coin.id === 1);
    const regularCoin = coins.find((coin) => coin.id === 2);

    expect(uncertainCoin.material).toBe('Uncertain');
    expect(buildQuestionDeck(uncertainCoin, coins, 'guided').some((question) => question.key === 'material')).toBe(false);
    expect(buildQuestionDeck(regularCoin, coins, 'guided').flatMap((question) => question.options)).not.toContain('Uncertain');
  });
});
