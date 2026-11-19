import { describe, expect, it } from 'vitest';
import {
  filterLocatedCoins,
  getCompositionEntries,
  getSafeSourceUrl,
  groupCoinsByMint,
  normalizeLocatedCoins,
} from './mapCoinData';

const relation = (attributes) => ({ data: { attributes } });

describe('map image source URLs', () => {
  it.each([
    ['https://museum.example/coin/1?view=front#image', 'https://museum.example/coin/1?view=front#image'],
    ['http://museum.example/coin/2', 'http://museum.example/coin/2'],
    ['  HTTPS://MUSEUM.EXAMPLE/coin/3  ', 'https://museum.example/coin/3'],
  ])('preserves a navigable HTTP source: %s', (value, expected) => {
    expect(getSafeSourceUrl(value)).toBe(expected);
  });

  it.each([
    'javascript:alert(document.domain)',
    'JaVaScRiPt:alert(1)',
    'java\nscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'ftp://museum.example/coin/1',
    '//museum.example/coin/1',
    '/coin/1',
    'coin/1',
    'https://',
    '',
    null,
    undefined,
    { href: 'https://museum.example/coin/1' },
  ])('rejects an unsafe or invalid source: %s', (value) => {
    expect(getSafeSourceUrl(value)).toBeNull();
  });
});

const row = ({
  id,
  mint = 'Antioch',
  latitude = 36.16,
  longitude = 36.2,
  material = 'Bronze',
  authority = 'Royal',
  power = 'Seleucid',
  fromYear = -300,
  toYear = -280,
}) => ({
  id,
  attributes: {
    coin_id: `coin-${id}`,
    obverse_type: `Obverse ${id}`,
    from_year: fromYear,
    to_year: toYear,
    reference: `Reference ${id}`,
    souce_image: `https://example.com/source-${id}`,
    right_holder: 'Museum',
    mint: relation({
      mint,
      latitude,
      longitude,
      modern_name: relation({ modern_name: 'Antakya' }),
      modern_country: relation({ modern_country: 'Turkey' }),
    }),
    material: relation({ material }),
    issuing_authority: relation({ issuing_authority: authority }),
    governing_power: relation({ governing_power: power }),
    ancient_territory: relation({ ancient_territory: 'Syria' }),
    denomination: relation({ denomination: 'Tetradrachm' }),
    language: relation({ language: 'Greek' }),
    obverse_image: relation({
      alternativeText: `Coin ${id}`,
      url: `/uploads/coin-${id}.png`,
    }),
  },
});

describe('map coin data adapter', () => {
  it('normalizes only coins with valid mint coordinates and classification data', () => {
    const rows = [
      row({ id: 1 }),
      row({ id: 2, latitude: null }),
      row({ id: 3, longitude: 240 }),
    ];
    const coins = normalizeLocatedCoins(rows);

    expect(coins).toHaveLength(1);
    expect(coins[0]).toMatchObject({
      id: 1,
      mint: 'Antioch',
      coordinates: [36.2, 36.16],
      material: 'Bronze',
      authority: 'Royal',
      power: 'Seleucid',
      period: '300–201 BCE',
      modernName: 'Antakya',
      modernCountry: 'Turkey',
    });
    expect(coins[0].imageUrl).toContain('/uploads/coin-1.png');
  });

  it('groups shared mint coordinates without losing individual records', () => {
    const coins = normalizeLocatedCoins([
      row({ id: 1 }),
      row({ id: 2, material: 'Gold' }),
      row({ id: 3, mint: 'Damascus', latitude: 33.51, longitude: 36.29 }),
    ]);
    const groups = groupCoinsByMint(coins);

    expect(groups).toHaveLength(2);
    expect(groups[0].name).toBe('Antioch');
    expect(groups[0].coins).toHaveLength(2);
  });

  it('applies timeline, chip, and paired comparison controls together', () => {
    const coins = normalizeLocatedCoins([
      row({ id: 1, material: 'Bronze', authority: 'Royal', fromYear: -300, toYear: -280 }),
      row({ id: 2, material: 'Gold', authority: 'Imperial', fromYear: 100, toYear: 120 }),
      row({ id: 3, material: 'Silver', authority: 'Royal', fromYear: -50, toYear: 10 }),
    ]);
    const filters = {
      material: [],
      authority: ['Royal'],
      power: [],
      mint: [],
      territory: [],
      denomination: [],
      language: [],
    };
    const visible = filterLocatedCoins(coins, {
      filters,
      timeRange: { start: -336, end: 50 },
      comparison: { enabled: true, dimension: 'material', a: 'Bronze', b: 'Silver' },
    });

    expect(visible.map((coin) => coin.id)).toEqual([1, 3]);
    expect(getCompositionEntries(visible, 'material')).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'Bronze', count: 1 }),
      expect.objectContaining({ label: 'Silver', count: 1 }),
    ]));
  });
});
