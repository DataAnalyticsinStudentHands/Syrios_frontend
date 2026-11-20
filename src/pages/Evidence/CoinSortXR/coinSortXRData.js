import coinCollectionsRequest from 'src/api/coin-collections';

export const MAX_XR_SOURCE_COINS = 48;
export const MAX_XR_COINS = MAX_XR_SOURCE_COINS * 2;
const LOAD_TIMEOUT_MS = 12000;

const entity = (value) => {
  const unwrapped = value?.data ?? value;
  if (!unwrapped || typeof unwrapped !== 'object' || Array.isArray(unwrapped)) return {};
  return unwrapped.attributes ?? unwrapped;
};

const text = (value, fallback = '') => (
  typeof value === 'string' && value.trim() ? value.trim().slice(0, 240) : fallback
);

const relationText = (value, field, fallback) => (
  text(value) || text(entity(value)[field]) || text(entity(value).name, fallback)
);

const recordedMeasurement = (value) => {
  if (typeof value !== 'number' && !(typeof value === 'string' && value.trim())) return null;
  const measurement = Number(value);
  return Number.isFinite(measurement) && measurement > 0 ? measurement : null;
};

// Separate the CMS media root from the application asset root: /uploads belongs
// to Strapi, whereas xr/models belongs to the /dev/ application when staging.
const safeAssetUrl = (value, source) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const input = value.trim();
  if (/[\u0000-\u001f\u007f\\]/.test(input) || input.startsWith('//')) return null;

  if (/^[a-z][a-z\d+.-]*:/i.test(input)) {
    try {
      const url = new URL(input);
      return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
        ? url.href : null;
    } catch { return null; }
  }

  if (input.startsWith('#') || input.startsWith('?')) return null;
  const appBase = import.meta.env.BASE_URL || '/';
  const configuredBase = source === 'app'
    ? appBase
    : import.meta.env.VITE_STRAPI_URL
      || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '')
      || '/';
  try {
    const base = new URL(`${configuredBase.replace(/\/$/, '')}/`, 'https://xr.invalid');
    const relative = source === 'app' && input.startsWith(appBase)
      ? input.slice(appBase.length) : input.replace(/^\/+/, '');
    const url = new URL(relative, base);
    if (!url.pathname.startsWith(base.pathname)) return null;
    if (url.origin === 'https://xr.invalid') return `${url.pathname}${url.search}${url.hash}`;
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};

const photoUrl = (media) => {
  const image = entity(media);
  return safeAssetUrl(image.formats?.small?.url, 'cms')
    || safeAssetUrl(image.formats?.thumbnail?.url, 'cms')
    || safeAssetUrl(image.url, 'cms');
};

const yearLabel = (value) => {
  if (value == null || value === '' || typeof value === 'boolean') return null;
  const year = Number(value);
  if (!Number.isFinite(year) || !Number.isInteger(year) || year === 0) return null;
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
};

const dateLabel = (coin) => {
  const recorded = text(coin.date_range);
  if (recorded) return recorded;
  const from = yearLabel(coin.from_year);
  const to = yearLabel(coin.to_year);
  return from && to && from !== to ? `${from}–${to}` : from || to || 'Date not recorded';
};

const modelUrl = (models, coin, id) => {
  for (const key of [text(coin.coin_id), id]) {
    if (!key || !Object.hasOwn(models, key)) continue;
    const url = safeAssetUrl(models[key], 'app');
    // Self-contained GLB files avoid fetching an unbounded graph of external
    // resources from an arbitrary glTF document.
    if (url && /\.glb$/i.test(new URL(url, 'https://xr.invalid').pathname)) return url;
  }
  return null;
};

/** Adapt raw Strapi v4, flattened v5, or normalized catalog rows. */
export const adaptXRCoins = (rows, modelManifest = {}) => {
  if (!Array.isArray(rows)) return [];
  const models = modelManifest?.models && typeof modelManifest.models === 'object'
    && !Array.isArray(modelManifest.models) ? modelManifest.models : {};
  const seen = new Set();
  const coins = [];
  for (const row of rows) {
    const coin = entity(row);
    const identity = row?.id ?? coin.id ?? row?.documentId ?? coin.documentId ?? text(coin.coin_id);
    if (typeof identity !== 'string' && typeof identity !== 'number') continue;
    const id = String(identity).trim();
    if (!id || seen.has(id) || coin.appear_catalog_pile === false) continue;
    seen.add(id);
    coins.push({
      id,
      title: text(coin.coin_id) || text(coin.name) || `Catalog coin ${id}`,
      material: relationText(coin.material, 'material', 'Not recorded'),
      mint: relationText(coin.mint, 'mint', 'Not recorded'),
      issuingAuthority: relationText(coin.issuing_authority, 'issuing_authority', 'Not recorded'),
      governingPower: relationText(coin.governing_power, 'governing_power', 'Not recorded'),
      dateLabel: dateLabel(coin),
      diameterMm: recordedMeasurement(coin.diameter),
      thicknessMm: recordedMeasurement(coin.thickness) ?? recordedMeasurement(coin.thickness_mm),
      obverseUrl: photoUrl(coin.obverse_image),
      reverseUrl: photoUrl(coin.reverse_image),
      modelUrl: modelUrl(models, coin, id),
      isDemo: false,
    });
    if (coins.length === MAX_XR_SOURCE_COINS) break;
  }
  return coins;
};

export const DEMO_XR_COINS = Object.freeze(Array.from({ length: 24 }, (_, index) => Object.freeze({
  id: `demo-${index + 1}`,
  title: `Sample token ${String(index + 1).padStart(2, '0')}`,
  material: ['Bronze', 'Silver', 'Gold'][index % 3],
  mint: `Sample mint ${['A', 'B', 'C'][Math.floor(index / 3) % 3]}`,
  issuingAuthority: `Sample authority ${['A', 'B', 'C'][Math.floor(index / 2) % 3]}`,
  governingPower: 'Demonstration only',
  dateLabel: 'Synthetic test token · no historical date',
  diameterMm: 20 + (index % 5) * 3,
  thicknessMm: null,
  obverseUrl: null,
  reverseUrl: null,
  modelUrl: null,
  isDemo: true,
})));

// Two physical instances per source record doubles the original pile without
// inventing catalog identities. All metadata and face images remain shared.
export const expandXRPile = (coins) => (
  Array.isArray(coins) ? coins.slice(0, MAX_XR_SOURCE_COINS).flatMap((coin) => [
    { ...coin, instanceId: `${coin.id}:copy:1` },
    { ...coin, instanceId: `${coin.id}:copy:2` },
  ]) : []
);

const abortError = () => new DOMException('Coin loading was cancelled.', 'AbortError');

const boundedRequest = (promise, signal, timeout = LOAD_TIMEOUT_MS) => new Promise((resolve, reject) => {
  let settled = false;
  let timer;
  const finish = (handler, value) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
    handler(value);
  };
  const cancel = () => finish(reject, abortError());
  timer = setTimeout(() => finish(reject, new Error('Coin loading timed out.')), timeout);
  signal?.addEventListener('abort', cancel, { once: true });
  // Attach both handlers even on an already-aborted signal, so a late API
  // rejection never becomes an unhandled promise rejection.
  promise.then((value) => finish(resolve, value), (error) => finish(reject, error));
  if (signal?.aborted) cancel();
});

const fetchModelManifest = async (signal) => {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(cancel, 2500);
  try {
    if (signal?.aborted) return {};
    const response = await fetch(`${import.meta.env.BASE_URL || '/'}xr/coin-models.json`, {
      signal: controller.signal,
      credentials: 'same-origin',
    });
    if (!response.ok) return {};
    return await response.json();
  } catch { return {}; }
  finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
};

/** Keep the XR prototype usable offline, with an explicit synthetic-data label. */
export const fetchXRCoins = async ({ signal } = {}) => {
  if (signal?.aborted) throw abortError();
  try {
    const [response, manifest] = await Promise.all([
      boundedRequest(coinCollectionsRequest.fetchAllForCoinSort(), signal),
      fetchModelManifest(signal),
    ]);
    if (signal?.aborted) throw abortError();
    const coins = adaptXRCoins(response?.data?.data ?? response?.data, manifest);
    if (coins.length) return { coins: expandXRPile(coins), source: 'catalog', warning: null };
    return {
      coins: expandXRPile(DEMO_XR_COINS),
      source: 'demo',
      warning: 'No catalog coins were available. Showing 48 synthetic sample tokens for interaction testing.',
    };
  } catch (error) {
    if (signal?.aborted || error?.name === 'AbortError') throw abortError();
    return {
      coins: expandXRPile(DEMO_XR_COINS),
      source: 'demo',
      warning: 'The coin catalog could not be loaded. Showing 48 synthetic sample tokens for interaction testing.',
    };
  }
};
