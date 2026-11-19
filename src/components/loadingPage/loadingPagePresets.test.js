import { describe, expect, it } from 'vitest';
import {
  LOADING_PAGE_PRESETS,
  LOADING_PAGE_VARIANTS,
  resolveLoadingPagePreset,
} from './loadingPagePresets';

describe('page loading content', () => {
  it.each(LOADING_PAGE_VARIANTS)('provides readable content and decorative artwork for %s', (variant) => {
    const preset = resolveLoadingPagePreset(variant);

    expect(preset.variant).toBe(variant);
    for (const text of [preset.eyebrow, preset.title, preset.message]) {
      expect(text.trim().length).toBeGreaterThan(0);
      expect(text).not.toMatch(/\b(?:strapi|axios|API|CMS)\b|\d+\s*%/i);
    }
    expect(preset.artwork.length).toBeGreaterThan(0);
    expect(new Set(preset.artwork).size).toBe(preset.artwork.length);
  });

  it.each([
    ['about', 'coin-curator', 'About SYRIOS'],
    ['evidence', 'home', 'Explore the evidence'],
    ['stories', 'story-reader', 'Stories'],
    ['toolbox', 'coin-curator', 'Toolbox'],
    ['research', 'coin-catalog', 'Research'],
    ['coin-detail', 'how-to-read', 'Coin record'],
    ['coin-results', 'coin-curator', 'Coin catalog'],
    ['map', 'home', 'Coins on a Map'],
  ])('keeps %s content distinct while reusing %s artwork', (variant, artworkVariant, eyebrow) => {
    const preset = resolveLoadingPagePreset(variant);

    expect(preset).toMatchObject({ variant, artworkVariant, eyebrow });
    expect(preset.artwork).toEqual(LOADING_PAGE_PRESETS[artworkVariant].artwork);
  });

  it('uses the dedicated video and glossary illustration parts', () => {
    expect(resolveLoadingPagePreset('video')).toMatchObject({
      artworkVariant: 'video',
      artwork: ['screen', 'play', 'reel'],
    });
    expect(resolveLoadingPagePreset('glossary')).toMatchObject({
      artworkVariant: 'glossary',
      artwork: ['book', 'index-one', 'index-two', 'index-three'],
    });
  });

  it.each([undefined, null, {}, 'unknown', '__proto__', 'constructor', 'toString'])('uses a neutral default for an unrecognized variant: %s', (variant) => {
    expect(resolveLoadingPagePreset(variant)).toMatchObject({
      variant: 'default',
      artworkVariant: 'default',
      title: 'Preparing this page',
      stages: [],
      phase: undefined,
    });
  });

  it('describes the actual Timeline dependency followed by coins and events', () => {
    expect(resolveLoadingPagePreset('coin-time')).toMatchObject({
      phase: 'timeline',
      title: 'Drawing the timeline',
      message: 'Loading the time periods and regions.',
      stages: ['Timeline', 'Coins & events'],
      activeStage: 0,
    });
    expect(resolveLoadingPagePreset('coin-time', 'evidence')).toMatchObject({
      phase: 'evidence',
      title: 'Placing coins and events',
      message: 'Adding coins and historical events in date order.',
      activeStage: 1,
    });
  });

  it.each(['unknown', '__proto__', 'constructor', null])('falls back to the Timeline phase for invalid phase input: %s', (phase) => {
    expect(resolveLoadingPagePreset('coin-time', phase)).toMatchObject({
      phase: 'timeline', activeStage: 0,
    });
  });

  it.each(LOADING_PAGE_VARIANTS.filter((variant) => variant !== 'coin-time'))('does not invent loading stages for %s', (variant) => {
    expect(resolveLoadingPagePreset(variant, 'evidence')).toMatchObject({
      variant,
      phase: undefined,
      stages: [],
      activeStage: 0,
    });
  });
});
