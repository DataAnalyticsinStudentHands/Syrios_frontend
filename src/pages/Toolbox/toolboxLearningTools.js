export const TOOLBOX_LEARNING_TOOLS = Object.freeze([
  Object.freeze({
    id: 'coin-detective',
    step: '01',
    path: '/Toolbox/CoinDetective',
    title: 'Coin Detective',
    phase: 'Look · Hypothesize · Verify',
    description: 'Inspect both faces before the labels appear, form an attribution, then compare your reasoning with the live catalog and its sources.',
    cta: 'Open a case',
    glyph: '\uE813',
    highlights: Object.freeze(['Guided close reading', 'Case-file PDF']),
  }),
  Object.freeze({
    id: 'coin-curator',
    step: '02',
    path: '/Toolbox/CoinCurator',
    title: 'Coin Curator',
    phase: 'Select · Interpret · Exhibit',
    description: 'Choose three catalog objects, separate observation from interpretation, and build a sourced historical exhibition that acknowledges uncertainty.',
    cta: 'Curate an exhibition',
    glyph: '\uE82A',
    highlights: Object.freeze(['Three-object exhibit', 'Exhibition PDF']),
  }),
  Object.freeze({
    id: 'archive-lab',
    step: '03',
    path: '/Toolbox/ArchiveLab',
    title: 'Archive Lab',
    phase: 'Sample · Audit · Revise',
    description: 'Draw a reproducible catalog sample, audit missing and uncertain fields, challenge a provisional claim, and write a methods memo.',
    cta: 'Enter Archive Lab',
    glyph: '\uE826',
    highlights: Object.freeze(['Source criticism', 'Methods PDF']),
  }),
]);

export default TOOLBOX_LEARNING_TOOLS;
