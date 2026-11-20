export const TABLE_HEIGHT = 0.68;
export const TABLE_BOUNDS = { minX: -0.6, maxX: 0.6, minZ: -0.77, maxZ: -0.15 };
export const SORT_KEYS = ['material', 'mint', 'issuingAuthority'];

export function clampDropPosition(position, radius = 0.03) {
  return {
    x: Math.min(TABLE_BOUNDS.maxX - radius, Math.max(TABLE_BOUNDS.minX + radius, position.x)),
    z: Math.min(TABLE_BOUNDS.maxZ - radius, Math.max(TABLE_BOUNDS.minZ + radius, position.z)),
  };
}

export function getSortValue(coin, key) {
  const value = SORT_KEYS.includes(key) ? coin?.[key] : null;
  return typeof value === 'string' && value.trim() ? value.trim() : 'Unknown';
}

export function getSortVerdict(coin, key, trayGroup) {
  const value = getSortValue(coin, key);
  if (!SORT_KEYS.includes(key) || /^(unknown|not recorded|unrecorded|n\/a)$/i.test(value)
    || !Array.isArray(trayGroup?.values) || !trayGroup.values.length) return 'unscored';
  return trayGroup.values.some((entry) => typeof entry === 'string' && entry.trim() === value)
    ? 'correct' : 'incorrect';
}

// Keep the trays reachable. Uncommon categories share one explicitly labeled tray.
export function getTrayGroups(coins, key) {
  const counts = new Map();
  coins.forEach((coin) => {
    const label = getSortValue(coin, key);
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  const labels = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name]) => name);
  const shown = labels.length > 4 ? labels.slice(0, 3) : labels;
  const groups = shown.map((label) => ({ label, values: [label] }));
  if (labels.length > 4) groups.push({ label: 'Other', values: labels.slice(3) });
  return groups;
}

export function formatCoinDetail(coin) {
  return [
    ['Material', coin.material],
    ['Mint', coin.mint],
    ['Authority', coin.issuingAuthority],
    ['Date', coin.dateLabel],
    ['Diameter', Number.isFinite(coin.diameterMm) && coin.diameterMm > 0 ? `${coin.diameterMm} mm` : 'Not recorded'],
    ['Thickness', Number.isFinite(coin.thicknessMm) && coin.thicknessMm > 0 ? `${coin.thicknessMm} mm` : 'Not recorded'],
  ].map(([label, value]) => `${label}: ${value || 'Unknown'}`);
}
