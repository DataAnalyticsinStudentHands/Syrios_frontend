// Artwork identifies the page; its animation is decorative, not measured
// progress. Only caller-supplied Timeline phases describe real loading work.
// Other pages have no timed stages or invented completion percentages.
const freezePreset = (preset) => Object.freeze({
  ...preset,
  artwork: Object.freeze([...(preset.artwork || [])]),
  stages: Object.freeze([...(preset.stages || [])]),
  phases: preset.phases
    ? Object.freeze(Object.fromEntries(
      Object.entries(preset.phases).map(([key, value]) => [key, Object.freeze({ ...value })]),
    ))
    : undefined,
});

export const LOADING_PAGE_VARIANTS = Object.freeze([
  'home',
  'story-reader',
  'coin-curator',
  'coin-3d',
  'how-to-read',
  'coin-pile',
  'coin-time',
  'coin-catalog',
  'coin-data',
  'about',
  'evidence',
  'stories',
  'toolbox',
  'video',
  'research',
  'glossary',
  'coin-detail',
  'coin-results',
  'map',
]);

export const LOADING_PAGE_A11Y = Object.freeze({
  shell: Object.freeze({}),
  status: Object.freeze({
    role: 'status',
    'aria-live': 'polite',
    'aria-atomic': true,
  }),
});

export const LOADING_PAGE_PRESETS = Object.freeze({
  default: freezePreset({
    eyebrow: 'SYRIOS',
    title: 'Preparing this page',
    message: 'Loading the page content.',
    artwork: ['coin', 'orbit'],
  }),
  home: freezePreset({
    eyebrow: 'Welcome to SYRIOS',
    title: 'Opening the collection',
    message: 'Loading the introduction and featured activities.',
    artwork: ['map', 'route', 'marker', 'compass'],
  }),
  'story-reader': freezePreset({
    eyebrow: 'Interactive story',
    title: 'Opening this story',
    message: 'Loading the story and its source notes.',
    artwork: ['book-left', 'book-right', 'page', 'chapter'],
  }),
  'coin-curator': freezePreset({
    eyebrow: 'Coin Curator',
    title: 'Setting up your exhibition',
    message: 'Loading coins and exhibit details.',
    artwork: ['card-one', 'card-two', 'card-three'],
  }),
  'coin-3d': freezePreset({
    eyebrow: 'Coins in 3D',
    title: 'Preparing the 3D viewer',
    message: 'Loading the introduction to the interactive coin viewer.',
    artwork: ['coin', 'meridian', 'latitude', 'orbit'],
  }),
  'how-to-read': freezePreset({
    eyebrow: 'How to Read a Coin',
    title: 'Laying out the clues',
    message: 'Loading the lesson and its source notes.',
    artwork: ['coin', 'clue-one', 'clue-two', 'clue-three'],
  }),
  'coin-pile': freezePreset({
    eyebrow: 'Coins in a Pile',
    title: 'Spreading out the collection',
    message: 'Loading coins and sorting choices.',
    artwork: ['coin-one', 'coin-two', 'coin-three', 'coin-four', 'coin-five'],
  }),
  'coin-time': freezePreset({
    eyebrow: 'Coins in Time',
    title: 'Drawing the timeline',
    message: 'Loading the time periods and regions.',
    artwork: ['axis', 'tick-one', 'tick-two', 'tick-three', 'coin-one', 'coin-two', 'event'],
    stages: ['Timeline', 'Coins & events'],
    defaultPhase: 'timeline',
    phases: {
      timeline: {
        title: 'Drawing the timeline',
        message: 'Loading the time periods and regions.',
        activeStage: 0,
      },
      evidence: {
        title: 'Placing coins and events',
        message: 'Adding coins and historical events in date order.',
        activeStage: 1,
      },
    },
  }),
  'coin-catalog': freezePreset({
    eyebrow: 'Coins in a Catalog',
    title: 'Opening the catalog',
    message: 'Loading featured coins and the catalog guide.',
    artwork: ['drawer', 'card'],
  }),
  'coin-data': freezePreset({
    eyebrow: 'Coins as Data',
    title: 'Preparing the data download',
    message: 'Loading the dataset description and download details.',
    artwork: ['coin', 'grid', 'arrow', 'cell-one', 'cell-two', 'cell-three'],
  }),
  about: freezePreset({
    eyebrow: 'About SYRIOS',
    title: 'Opening About SYRIOS',
    message: 'Loading the project, people, and partners.',
    artworkVariant: 'coin-curator',
    artwork: ['card-one', 'card-two', 'card-three'],
  }),
  evidence: freezePreset({
    eyebrow: 'Explore the evidence',
    title: 'Opening the collection',
    message: 'Loading ways to explore ancient coins.',
    artworkVariant: 'home',
    artwork: ['map', 'route', 'marker', 'compass'],
  }),
  stories: freezePreset({
    eyebrow: 'Stories',
    title: 'Opening the story collection',
    message: 'Loading stories from the ancient world.',
    artworkVariant: 'story-reader',
    artwork: ['book-left', 'book-right', 'page', 'chapter'],
  }),
  toolbox: freezePreset({
    eyebrow: 'Toolbox',
    title: 'Opening the toolbox',
    message: 'Loading tools for exploring ancient coins.',
    artworkVariant: 'coin-curator',
    artwork: ['card-one', 'card-two', 'card-three'],
  }),
  video: freezePreset({
    eyebrow: 'Video library',
    title: 'Opening the video library',
    message: 'Loading video titles and descriptions.',
    artwork: ['screen', 'play', 'reel'],
  }),
  research: freezePreset({
    eyebrow: 'Research',
    title: 'Gathering the sources',
    message: 'Loading the bibliography and research notes.',
    artworkVariant: 'coin-catalog',
    artwork: ['drawer', 'card'],
  }),
  glossary: freezePreset({
    eyebrow: 'Glossary',
    title: 'Opening the glossary',
    message: 'Loading glossary content.',
    artwork: ['book', 'index-one', 'index-two', 'index-three'],
  }),
  'coin-detail': freezePreset({
    eyebrow: 'Coin record',
    title: 'Opening this coin',
    message: 'Loading the coin record and source details.',
    artworkVariant: 'how-to-read',
    artwork: ['coin', 'clue-one', 'clue-two', 'clue-three'],
  }),
  'coin-results': freezePreset({
    eyebrow: 'Coin catalog',
    title: 'Loading the coin results',
    message: 'Loading coin records for your search.',
    artworkVariant: 'coin-curator',
    artwork: ['card-one', 'card-two', 'card-three'],
  }),
  map: freezePreset({
    eyebrow: 'Coins on a Map',
    title: 'Preparing the map',
    message: 'Loading coins and their locations.',
    artworkVariant: 'home',
    artwork: ['map', 'route', 'marker', 'compass'],
  }),
});

const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export function resolveLoadingPagePreset(variant, phase) {
  const variantKey = typeof variant === 'string' && owns(LOADING_PAGE_PRESETS, variant)
    ? variant
    : 'default';
  const preset = LOADING_PAGE_PRESETS[variantKey];

  let phaseKey;
  let phasePreset;

  if (preset.phases) {
    phaseKey = typeof phase === 'string' && owns(preset.phases, phase)
      ? phase
      : preset.defaultPhase;
    phasePreset = preset.phases[phaseKey];
  }

  return {
    variant: variantKey,
    artworkVariant: preset.artworkVariant || variantKey,
    phase: phaseKey,
    eyebrow: preset.eyebrow,
    title: phasePreset?.title || preset.title,
    message: phasePreset?.message || preset.message,
    artwork: preset.artwork,
    stages: preset.stages,
    activeStage: phasePreset?.activeStage ?? 0,
  };
}
