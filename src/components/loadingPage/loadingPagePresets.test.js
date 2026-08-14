import { describe, expect, it } from 'vitest';
import {
  LOADING_PAGE_A11Y,
  LOADING_PAGE_PRESETS,
  LOADING_PAGE_VARIANTS,
  resolveLoadingPagePreset,
} from './loadingPagePresets';

const EXPECTED_TITLES = {
  home: 'Opening the collection',
  'story-reader': 'Opening this story',
  'coin-curator': 'Setting up your exhibition',
  'coin-3d': 'Preparing the 3D viewer',
  'how-to-read': 'Laying out the clues',
  'coin-pile': 'Spreading out the collection',
  'coin-time': 'Drawing the timeline',
  'coin-catalog': 'Opening the catalog',
  'coin-data': 'Preparing the data download',
};

describe('loading page presets', () => {
  it('exports exactly the variants used by page callsites', () => {
    expect(LOADING_PAGE_VARIANTS).toEqual([
      'home',
      'story-reader',
      'coin-curator',
      'coin-3d',
      'how-to-read',
      'coin-pile',
      'coin-time',
      'coin-catalog',
      'coin-data',
    ]);
    expect(Object.keys(LOADING_PAGE_PRESETS)).toEqual(['default', ...LOADING_PAGE_VARIANTS]);
  });

  it.each(LOADING_PAGE_VARIANTS)('provides complete, plain-language content and artwork for %s', (variant) => {
    const resolved = resolveLoadingPagePreset(variant);

    expect(resolved.variant).toBe(variant);
    expect(resolved.eyebrow.trim().length).toBeGreaterThan(0);
    expect(resolved.title).toBe(EXPECTED_TITLES[variant]);
    expect(resolved.message.trim().length).toBeGreaterThan(0);
    expect(resolved.artwork.length).toBeGreaterThan(0);
    expect(new Set(resolved.artwork).size).toBe(resolved.artwork.length);
    expect(resolved.message).not.toMatch(/strapi|obverse|classification/i);
  });

  it('preserves an accessible neutral default for legacy callers', () => {
    expect(resolveLoadingPagePreset()).toMatchObject({
      variant: 'default',
      eyebrow: 'SYRIOS',
      title: 'Preparing this page',
      message: 'Gathering the information and media you need.',
      phase: undefined,
      activeStage: 0,
    });
    expect(resolveLoadingPagePreset('not-a-loader')).toMatchObject({
      variant: 'default',
      title: 'Preparing this page',
    });
  });

  it('uses timeline structure as the default Coins in Time phase', () => {
    expect(resolveLoadingPagePreset('coin-time')).toMatchObject({
      variant: 'coin-time',
      phase: 'timeline',
      title: 'Drawing the timeline',
      message: 'Loading the time periods and regions.',
      stages: ['Timeline', 'Coins & events'],
      activeStage: 0,
    });
    expect(resolveLoadingPagePreset('coin-time', 'unknown')).toMatchObject({
      phase: 'timeline',
      activeStage: 0,
    });
  });

  it('announces the evidence phase while coins and events are being placed', () => {
    expect(resolveLoadingPagePreset('coin-time', 'evidence')).toMatchObject({
      variant: 'coin-time',
      phase: 'evidence',
      title: 'Placing coins and events',
      message: 'Adding coins and historical events in date order.',
      stages: ['Timeline', 'Coins & events'],
      activeStage: 1,
    });
  });

  it('keeps phase input scoped to variants that define phases', () => {
    expect(resolveLoadingPagePreset('home', 'evidence')).toMatchObject({
      variant: 'home',
      phase: undefined,
      title: 'Opening the collection',
      activeStage: 0,
    });
  });

  it('defines one polite atomic status without a busy ancestor suppressing it', () => {
    expect(LOADING_PAGE_A11Y).toEqual({
      shell: {},
      status: {
        role: 'status',
        'aria-live': 'polite',
        'aria-atomic': true,
      },
    });
  });

  it('freezes shared configuration so callers cannot mutate later loaders', () => {
    expect(Object.isFrozen(LOADING_PAGE_VARIANTS)).toBe(true);
    expect(Object.isFrozen(LOADING_PAGE_PRESETS)).toBe(true);
    expect(Object.isFrozen(LOADING_PAGE_PRESETS.home)).toBe(true);
    expect(Object.isFrozen(LOADING_PAGE_PRESETS.home.artwork)).toBe(true);
    expect(Object.isFrozen(LOADING_PAGE_PRESETS['coin-time'].phases)).toBe(true);
    expect(Object.isFrozen(LOADING_PAGE_PRESETS['coin-time'].phases.evidence)).toBe(true);
  });
});
