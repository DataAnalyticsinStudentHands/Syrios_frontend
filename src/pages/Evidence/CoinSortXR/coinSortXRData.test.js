import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import coinCollectionsRequest from 'src/api/coin-collections';
import { adaptXRCoins, DEMO_XR_COINS, expandXRPile, fetchXRCoins, MAX_XR_COINS, MAX_XR_SOURCE_COINS } from './coinSortXRData';

vi.mock('src/api/coin-collections', () => ({
  default: { fetchAllForCoinSort: vi.fn() },
}));

const relation = (attributes) => ({ data: { attributes } });
const row = (id = 1, overrides = {}) => ({
  id,
  attributes: {
    coin_id: `catalog-${id}`,
    material: relation({ material: 'Silver' }),
    mint: relation({ mint: 'Catalog mint' }),
    issuing_authority: relation({ issuing_authority: 'Royal' }),
    governing_power: relation({ governing_power: 'Catalog power' }),
    from_year: -200,
    to_year: -180,
    diameter: '27.5',
    obverse_image: relation({ url: '/uploads/front.jpg' }),
    reverse_image: relation({ url: '/uploads/back.jpg' }),
    ...overrides,
  },
});

beforeEach(() => {
  vi.stubEnv('BASE_URL', '/dev/');
  vi.stubEnv('VITE_STRAPI_URL', 'https://catalog.example');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ models: {} }) }));
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('XR catalog adaptation', () => {
  it('preserves metadata and resolves media from raw Strapi v4 rows', () => {
    expect(adaptXRCoins([row()])[0]).toEqual({
      id: '1', title: 'catalog-1', material: 'Silver', mint: 'Catalog mint',
      issuingAuthority: 'Royal', governingPower: 'Catalog power', dateLabel: '200 BCE–180 BCE',
      diameterMm: 27.5, thicknessMm: null, obverseUrl: 'https://catalog.example/uploads/front.jpg',
      reverseUrl: 'https://catalog.example/uploads/back.jpg', modelUrl: null, isDemo: false,
    });
  });

  it('also accepts flattened Strapi v5 and normalized relation values', () => {
    const flat = {
      documentId: 'flat-coin', coin_id: 'FLAT', material: { name: 'Gold' },
      mint: 'A recorded mint', issuing_authority: { issuing_authority: 'Civic' },
      governing_power: { data: { governing_power: 'Recorded power' } },
      obverse_image: { url: 'https://images.example/front.jpg' },
    };
    expect(adaptXRCoins([flat])[0]).toMatchObject({
      id: 'flat-coin', title: 'FLAT', material: 'Gold', mint: 'A recorded mint',
      issuingAuthority: 'Civic', governingPower: 'Recorded power',
      dateLabel: 'Date not recorded', diameterMm: null,
      obverseUrl: 'https://images.example/front.jpg', reverseUrl: null,
    });
  });

  it('handles missing values without inventing dates, rulers, or materials', () => {
    expect(adaptXRCoins([{ id: 0 }])[0]).toMatchObject({
      id: '0', title: 'Catalog coin 0', material: 'Not recorded', mint: 'Not recorded',
      dateLabel: 'Date not recorded', diameterMm: null,
    });
  });

  it.each([
    [0, 0, 'Date not recorded'], [null, null, 'Date not recorded'],
    ['', '', 'Date not recorded'], [-1, 1, '1 BCE–1 CE'],
    [-50, -50, '50 BCE'], [null, 100, '100 CE'], [false, true, 'Date not recorded'],
  ])('formats the recorded date bounds %s and %s', (from_year, to_year, expected) => {
    expect(adaptXRCoins([row(1, { from_year, to_year })])[0].dateLabel).toBe(expected);
  });

  it('keeps a catalog date label when one exists', () => {
    expect(adaptXRCoins([row(1, { date_range: 'Circa 200 BCE' })])[0].dateLabel).toBe('Circa 200 BCE');
  });

  it('bounds the pile, deduplicates identities, and honors an explicit hidden record', () => {
    const rows = [null, {}, row(1), row(1), row(2, { appear_catalog_pile: false }),
      ...Array.from({ length: 100 }, (_, index) => row(index + 3))];
    const coins = adaptXRCoins(rows);
    expect(coins).toHaveLength(MAX_XR_SOURCE_COINS);
    expect(new Set(coins.map((coin) => coin.id)).size).toBe(MAX_XR_SOURCE_COINS);
    expect(coins.some((coin) => coin.id === '2')).toBe(false);
    expect(adaptXRCoins({ data: rows })).toEqual([]);
  });

  it.each([
    'javascript:alert(1)', 'data:image/svg+xml,<svg/>', 'file:///C:/secret',
    'java\nscript:alert(1)', '//unexpected.example/image.jpg', '../escape.jpg',
    'https://user:password@images.example/front.jpg',
  ])('rejects unsafe media paths: %s', (url) => {
    vi.stubEnv('VITE_STRAPI_URL', 'https://catalog.example/cms');
    expect(adaptXRCoins([row(1, { obverse_image: { url } })])[0].obverseUrl).toBeNull();
  });

  it('prefers an optimized image while retaining safe external image URLs', () => {
    const media = { url: 'https://images.example/full.jpg', formats: { small: { url: '/uploads/small.jpg' } } };
    expect(adaptXRCoins([row(1, { obverse_image: media })])[0].obverseUrl)
      .toBe('https://catalog.example/uploads/small.jpg');
  });

  it('maps original models by catalog ID first and prefixes local paths with staging base', () => {
    const manifest = { models: { 'catalog-1': 'xr/models/original.glb', 1: 'xr/models/alternative.glb' } };
    expect(adaptXRCoins([row()], manifest)[0].modelUrl).toBe('/dev/xr/models/original.glb');
    expect(adaptXRCoins([row()], { models: { 1: '/xr/models/original.glb' } })[0].modelUrl)
      .toBe('/dev/xr/models/original.glb');
    expect(adaptXRCoins([row()], { models: { 1: '/dev/xr/models/original.glb' } })[0].modelUrl)
      .toBe('/dev/xr/models/original.glb');
  });

  it('accepts external GLB URLs, but rejects active schemes, traversal, and non-GLB models', () => {
    expect(adaptXRCoins([row()], { models: { 1: 'https://models.example/coin.glb?v=2' } })[0].modelUrl)
      .toBe('https://models.example/coin.glb?v=2');
    for (const url of ['javascript:alert(1)', '../coin.glb', 'xr/coin.gltf', '//models.example/coin.glb']) {
      expect(adaptXRCoins([row()], { models: { 1: url } })[0].modelUrl).toBeNull();
    }
    expect(adaptXRCoins([row()], null)[0].modelUrl).toBeNull();
  });

  it('preserves actual catalog diameters independently of ergonomic display scale', () => {
    expect(adaptXRCoins([row(1, { diameter: 5 }), row(2, { diameter: '80' })])
      .map((coin) => coin.diameterMm)).toEqual([5, 80]);
  });

  it.each([undefined, null, '', ' ', -10, 0, Infinity, 'invalid', true, false, [], {}])(
    'keeps absent or invalid catalog diameter unknown: %s', (diameter) => {
      expect(adaptXRCoins([row(1, { diameter })])[0].diameterMm).toBeNull();
    },
  );

  it('preserves a large positive catalog diameter', () => {
    expect(adaptXRCoins([row(1, { diameter: 200 })])[0].diameterMm).toBe(200);
  });

  it.each([
    [2.3, undefined, 2.3], ['1.75', 3, 1.75], [undefined, '2.1', 2.1],
    [0, 1.2, 1.2], [-1, 1.1, 1.1], [null, null, null], [undefined, undefined, null],
    ['invalid', 0, null], [Infinity, -1, null], [true, false, null], [[], {}, null],
  ])('preserves recorded thickness %s with fallback %s', (thickness, thickness_mm, expected) => {
    expect(adaptXRCoins([row(1, { thickness, thickness_mm })])[0].thicknessMm).toBe(expected);
  });
});

describe('XR loading and synthetic fallback', () => {
  it('doubles physical instances while retaining the original catalog identity and photographs', () => {
    const source = adaptXRCoins(Array.from({ length: 60 }, (_, index) => row(index + 1)));
    const pile = expandXRPile(source);
    expect(pile).toHaveLength(MAX_XR_COINS);
    expect(new Set(pile.map((coin) => coin.instanceId)).size).toBe(MAX_XR_COINS);
    expect(new Set(pile.map((coin) => coin.id)).size).toBe(MAX_XR_SOURCE_COINS);
    expect(pile[0].id).toBe(pile[1].id);
    expect(pile[0].obverseUrl).toBe(source[0].obverseUrl);
    expect(source[0].instanceId).toBeUndefined();
    expect(expandXRPile(DEMO_XR_COINS)).toHaveLength(48);
    expect(expandXRPile(null)).toEqual([]);
  });
  it('provides distinct sample tokens with explicit synthetic labels', () => {
    expect(DEMO_XR_COINS).toHaveLength(24);
    expect(new Set(DEMO_XR_COINS.map((coin) => coin.id)).size).toBe(24);
    expect(DEMO_XR_COINS.every((coin) => coin.isDemo && coin.title.startsWith('Sample token'))).toBe(true);
    expect(DEMO_XR_COINS.every((coin) => coin.dateLabel.includes('Synthetic'))).toBe(true);
  });

  it('loads existing catalog coins and optional source models', async () => {
    coinCollectionsRequest.fetchAllForCoinSort.mockResolvedValue({ data: { data: [row()] } });
    fetch.mockResolvedValue({ ok: true, json: async () => ({ models: { 1: 'xr/models/coin.glb' } }) });
    const result = await fetchXRCoins();
    expect(result.source).toBe('catalog');
    expect(result.warning).toBeNull();
    expect(result.coins[0].modelUrl).toBe('/dev/xr/models/coin.glb');
    expect(fetch).toHaveBeenCalledWith('/dev/xr/coin-models.json', expect.objectContaining({ credentials: 'same-origin' }));
  });

  it('still uses catalog data when an optional model manifest cannot be loaded', async () => {
    coinCollectionsRequest.fetchAllForCoinSort.mockResolvedValue({ data: { data: [row()] } });
    fetch.mockRejectedValue(new Error('No optional manifest'));
    expect((await fetchXRCoins()).source).toBe('catalog');
  });

  it.each([[], null, { unexpected: true }])('labels empty or malformed catalog fallback: %s', async (data) => {
    coinCollectionsRequest.fetchAllForCoinSort.mockResolvedValue({ data: { data } });
    const result = await fetchXRCoins();
    expect(result.source).toBe('demo');
    expect(result.warning).toContain('synthetic sample tokens');
  });

  it('labels a network failure as demonstration data', async () => {
    coinCollectionsRequest.fetchAllForCoinSort.mockRejectedValue(new Error('Network failed'));
    expect(await fetchXRCoins()).toMatchObject({ source: 'demo', warning: expect.stringContaining('could not be loaded') });
  });

  it('bounds a stalled catalog request', async () => {
    vi.useFakeTimers();
    coinCollectionsRequest.fetchAllForCoinSort.mockReturnValue(new Promise(() => {}));
    const pending = fetchXRCoins();
    await vi.advanceTimersByTimeAsync(12000);
    expect((await pending).source).toBe('demo');
  });

  it('propagates cancellation rather than replacing it with synthetic data', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(fetchXRCoins({ signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' });
    expect(coinCollectionsRequest.fetchAllForCoinSort).not.toHaveBeenCalled();
  });

  it('cancels a pending load without an unhandled later rejection', async () => {
    const controller = new AbortController();
    let rejectCatalog;
    coinCollectionsRequest.fetchAllForCoinSort.mockReturnValue(new Promise((resolve, reject) => { rejectCatalog = reject; }));
    const pending = fetchXRCoins({ signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    rejectCatalog(new Error('Late request rejection'));
    await Promise.resolve();
  });
});
