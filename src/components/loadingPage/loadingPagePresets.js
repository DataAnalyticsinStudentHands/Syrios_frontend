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
    message: 'Gathering the information and media you need.',
    artwork: ['coin', 'orbit'],
  }),
  home: freezePreset({
    eyebrow: 'Welcome to SYRIOS',
    title: 'Opening the collection',
    message: 'Gathering the welcome video, featured activities, and site introduction.',
    artwork: ['map', 'route', 'marker', 'compass'],
  }),
  'story-reader': freezePreset({
    eyebrow: 'Interactive story',
    title: 'Opening this story',
    message: "Gathering the story's pages, images, and source notes.",
    artwork: ['book-left', 'book-right', 'page', 'chapter'],
  }),
  'coin-curator': freezePreset({
    eyebrow: 'Coin Curator',
    title: 'Setting up your exhibition',
    message: 'Gathering coin images and facts, then checking for a saved exhibit in this browser.',
    artwork: ['card-one', 'card-two', 'card-three'],
  }),
  'coin-3d': freezePreset({
    eyebrow: 'Coins in 3D',
    title: 'Preparing the 3D viewer',
    message: 'Loading the introduction. The interactive coin model will appear next.',
    artwork: ['coin', 'meridian', 'latitude', 'orbit'],
  }),
  'how-to-read': freezePreset({
    eyebrow: 'How to Read a Coin',
    title: 'Laying out the clues',
    message: "Gathering the lesson's coin images, labels, and source notes.",
    artwork: ['coin', 'clue-one', 'clue-two', 'clue-three'],
  }),
  'coin-pile': freezePreset({
    eyebrow: 'Coins in a Pile',
    title: 'Spreading out the collection',
    message: 'Gathering coin images and the choices you can use to sort and filter them.',
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
    message: 'Loading featured coins, collection notes, and the catalog guide.',
    artwork: ['drawer', 'card'],
  }),
  'coin-data': freezePreset({
    eyebrow: 'Coins as Data',
    title: 'Preparing the data download',
    message: 'Gathering the dataset description and download details.',
    artwork: ['coin', 'grid', 'arrow', 'cell-one', 'cell-two', 'cell-three'],
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
    phase: phaseKey,
    eyebrow: preset.eyebrow,
    title: phasePreset?.title || preset.title,
    message: phasePreset?.message || preset.message,
    artwork: preset.artwork,
    stages: preset.stages,
    activeStage: phasePreset?.activeStage ?? 0,
  };
}
