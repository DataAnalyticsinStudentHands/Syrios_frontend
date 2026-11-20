import { describe, expect, it } from 'vitest';
import { clampDropPosition, formatCoinDetail, getTrayGroups, getSortValue, getSortVerdict } from './sceneMath';

describe('XR workbench geometry', () => {
  it('keeps a released coin entirely on the tabletop', () => {
    const nearCorner = clampDropPosition({ x: 4, z: 2 }, 0.04);
    expect(nearCorner.x).toBeCloseTo(0.56);
    expect(nearCorner.z).toBeCloseTo(-0.19);
    const farCorner = clampDropPosition({ x: -3, z: -8 }, 0.04);
    expect(farCorner.x).toBeCloseTo(-0.56);
    expect(farCorner.z).toBeCloseTo(-0.73);
  });

  it('preserves valid release positions', () => {
    expect(clampDropPosition({ x: 0.3, y: 1.2, z: -0.7 })).toEqual({ x: 0.3, z: -0.7 });
  });
});

describe('classification feedback', () => {
  it('recognizes both an exact category and the explicitly listed Other categories', () => {
    expect(getSortVerdict({ material: 'Silver' }, 'material', { values: ['Silver'] })).toBe('correct');
    expect(getSortVerdict({ mint: 'Antioch' }, 'mint', { label: 'Other', values: ['Tyre', 'Antioch'] })).toBe('correct');
    expect(getSortVerdict({ material: 'Silver' }, 'material', { values: ['Bronze'] })).toBe('incorrect');
  });

  it.each(['', 'Unknown', 'Not recorded', 'Unrecorded', 'N/A'])('leaves missing classification %s unscored', (material) => {
    expect(getSortVerdict({ material }, 'material', { values: [material] })).toBe('unscored');
  });

  it('keeps recorded Uncertain categories distinct from missing metadata', () => {
    expect(getSortVerdict({ material: 'Uncertain' }, 'material', { values: ['Uncertain'] })).toBe('correct');
  });

  it('rejects unavailable trays and invalid grouping keys instead of claiming a match', () => {
    expect(getSortVerdict({ material: 'Gold' }, 'material', null)).toBe('unscored');
    expect(getSortVerdict({ material: 'Gold' }, 'bad-key', { values: ['Gold'] })).toBe('unscored');
    expect(getSortValue({ material: { name: 'Gold' } }, 'material')).toBe('Unknown');
    expect(getSortValue({ mint: ' Antioch ' }, 'mint')).toBe('Antioch');
  });
});

describe('XR sorting trays', () => {
  it('keeps every category represented when there are more than four', () => {
    const coins = ['A', 'B', 'C', 'D', 'E', 'F', 'A', 'B', 'A'].map((mint) => ({ mint }));
    const groups = getTrayGroups(coins, 'mint');
    expect(groups).toHaveLength(4);
    expect(groups[0]).toEqual({ label: 'A', values: ['A'] });
    expect(groups[3]).toEqual({ label: 'Other', values: ['D', 'E', 'F'] });
    expect(groups.flatMap((group) => group.values).sort()).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });

  it('uses a tray for missing metadata and never confuses it with a known category', () => {
    expect(getTrayGroups([{ material: 'Silver' }, {}], 'material')).toEqual([
      { label: 'Silver', values: ['Silver'] },
      { label: 'Unknown', values: ['Unknown'] },
    ]);
    expect(getTrayGroups([], 'material')).toEqual([]);
  });
});

describe('XR coin examination details', () => {
  it.each([null, undefined, 0, -1, NaN])('does not invent an archaeological diameter for %s', (diameterMm) => {
    expect(formatCoinDetail({ diameterMm })).toContain('Diameter: Not recorded');
  });

  it('shows catalog dimensions rather than enlarged interaction dimensions', () => {
    expect(formatCoinDetail({ material: 'Silver', diameterMm: 18.5 })).toContain('Diameter: 18.5 mm');
    expect(formatCoinDetail({ thicknessMm: 2.5 })).toContain('Thickness: 2.5 mm');
    expect(formatCoinDetail({ thicknessMm: null })).toContain('Thickness: Not recorded');
    expect(formatCoinDetail({})).toContain('Mint: Unknown');
  });
});
