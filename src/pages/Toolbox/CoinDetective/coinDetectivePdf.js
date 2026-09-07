import {
  COIN_DETECTIVE_MODES,
  getComparisonRows,
  scoreDetectiveAnswers,
} from './coinDetectiveData';

const valueOr = (value, fallback = 'Not recorded') => {
  if (value == null || String(value).trim() === '') return fallback;
  return String(value).trim();
};

const absoluteCatalogUrl = (coinId, siteOrigin = '') => {
  const path = `/Coin/${coinId}`;
  const origin = String(siteOrigin || '').replace(/\/$/, '');
  return origin ? `${origin}${path}` : path;
};

const coinMetadata = (coin, siteOrigin) => [
  { label: 'Catalog identifier', value: valueOr(coin.coinId) },
  { label: 'SYRIOS record', value: absoluteCatalogUrl(coin.id, siteOrigin) },
  { label: 'Cataloged date', value: valueOr(coin.dateRange) },
  { label: 'Material', value: valueOr(coin.material) },
  { label: 'Issuing authority', value: valueOr(coin.authority) },
  { label: 'Governing power', value: valueOr(coin.power) },
  { label: 'Denomination', value: valueOr(coin.denomination) },
  { label: 'Language', value: valueOr(coin.language) },
  { label: 'Mint', value: valueOr(coin.mint) },
  { label: 'Ancient territory', value: valueOr(coin.territory) },
  { label: 'Modern place', value: valueOr([coin.modernName, coin.modernCountry].filter(Boolean).join(', ')) },
  { label: 'Diameter', value: coin.diameter ? `${coin.diameter} mm` : 'Not recorded' },
];

const coinImages = (coin) => [
  coin.obverseImage && {
    url: coin.obverseImage.url,
    alt: coin.obverseImage.alt || `Obverse of ${coin.displayName}`,
    caption: `Obverse - ${valueOr(coin.obverseType)}`,
    sourceUrl: /^https?:\/\//i.test(coin.sourceImage || '') ? coin.sourceImage : undefined,
  },
  coin.reverseImage && {
    url: coin.reverseImage.url,
    alt: coin.reverseImage.alt || `Reverse of ${coin.displayName}`,
    caption: `Reverse - ${valueOr(coin.reverseType)}`,
    sourceUrl: /^https?:\/\//i.test(coin.sourceImage || '') ? coin.sourceImage : undefined,
  },
].filter(Boolean);

const sourceSection = (coin, siteOrigin) => ({
  title: 'Catalog citation and image rights',
  intro: 'These source details travel with the student work so the downloaded case remains traceable to the collection record.',
  blocks: [{
    type: 'keyValue',
    items: [
      { label: 'Catalog record', value: absoluteCatalogUrl(coin.id, siteOrigin) },
      { label: 'Catalog reference', value: valueOr(coin.reference) },
      { label: 'Image source', value: valueOr(coin.sourceImage) },
      { label: 'Rights holder', value: valueOr(coin.rightHolder) },
    ],
  }],
});

const catalogSection = (coin, siteOrigin, title = 'Catalog evidence') => ({
  title,
  intro: 'Missing and uncertain fields are reproduced as catalog limits rather than converted into ordinary evidence.',
  blocks: [
    ...(coinImages(coin).length ? [{ type: 'imageRow', images: coinImages(coin) }] : []),
    { type: 'keyValue', items: coinMetadata(coin, siteOrigin) },
    {
      type: 'callout',
      title: 'Obverse description and legend',
      text: `${valueOr(coin.obverseType)} Legend: ${valueOr(coin.obverseLegend, 'Not recorded')}`,
    },
    {
      type: 'callout',
      title: 'Reverse description and legend',
      text: `${valueOr(coin.reverseType)} Legend: ${valueOr(coin.reverseLegend, 'Not recorded')}`,
    },
  ],
});

/**
 * Maps the live investigation state into the shared PDF document model. Keeping
 * this adapter pure lets tests verify that student notes, hypotheses, catalog
 * answers, citations, and rights statements all reach the download unchanged.
 */
export const buildCoinDetectivePdfDocument = ({
  coin,
  comparison = null,
  mode = 'guided',
  questions = [],
  answers = {},
  notes = '',
  siteOrigin = '',
  generatedAt = new Date(),
}) => {
  if (!coin) throw new Error('A case coin is required to export Coin Detective work.');
  const score = scoreDetectiveAnswers(questions, answers);
  const modeLabel = COIN_DETECTIVE_MODES[mode]?.label || 'Guided investigation';
  const hypothesisRows = questions.map((question) => ({
    field: valueOr(question.label, question.key),
    hypothesis: valueOr(answers[question.key], 'No answer'),
    catalog: valueOr(question.answer),
    result: answers[question.key] === question.answer ? 'Catalog match' : 'Revisit evidence',
  }));
  const comparisonRows = comparison ? getComparisonRows(coin, comparison) : [];

  return {
    fileName: `SYRIOS-Coin-Detective-${valueOr(coin.coinId, coin.id)}.pdf`,
    eyebrow: 'SYRIOS Coin Detective / Case File',
    title: valueOr(coin.displayName, 'Coin Detective Case'),
    subtitle: `${modeLabel} - observe first, then test the attribution against the catalog.`,
    generatedAt,
    metadata: [
      { label: 'Learning activity', value: 'Coin Detective' },
      { label: 'Investigation', value: modeLabel },
      { label: 'Catalog ID', value: valueOr(coin.coinId) },
      { label: 'Hypothesis check', value: `${score.correct} of ${score.total} matched the catalog` },
    ],
    sections: [
      {
        title: 'Observation and working attribution',
        intro: 'This section preserves the student work recorded before the complete catalog identity was revealed.',
        blocks: [
          {
            type: 'callout',
            title: 'Field notes before reveal',
            text: valueOr(notes, 'No field notes were recorded for this case.'),
          },
          ...(hypothesisRows.length ? [{
            type: 'table',
            columns: [
              { key: 'field', label: 'Field', width: 0.2 },
              { key: 'hypothesis', label: 'Student hypothesis', width: 0.27 },
              { key: 'catalog', label: 'Catalog record', width: 0.28 },
              { key: 'result', label: 'Comparison', width: 0.25 },
            ],
            rows: hypothesisRows,
          }] : [{ type: 'paragraph', text: 'No attribution questions were recorded for this case.' }]),
        ],
      },
      catalogSection(coin, siteOrigin),
      sourceSection(coin, siteOrigin),
      ...(mode === 'comparison' && comparison ? [
        {
          title: 'Comparative case',
          intro: 'The comparison keeps selected contexts visible while identifying documented continuity and difference.',
          blocks: [
            ...(coinImages(comparison).length ? [{ type: 'imageRow', images: coinImages(comparison) }] : []),
            { type: 'keyValue', items: coinMetadata(comparison, siteOrigin) },
            {
              type: 'table',
              columns: [
                { key: 'field', label: 'Recorded field', width: 0.28 },
                { key: 'caseCoin', label: 'Case coin', width: 0.36 },
                { key: 'comparisonCoin', label: 'Comparison coin', width: 0.36 },
              ],
              rows: comparisonRows.map((row) => ({
                field: row.label,
                caseCoin: row.a,
                comparisonCoin: row.b,
              })),
            },
            {
              type: 'keyValue',
              items: [
                { label: 'Comparison reference', value: valueOr(comparison.reference) },
                { label: 'Comparison image source', value: valueOr(comparison.sourceImage) },
                { label: 'Comparison rights holder', value: valueOr(comparison.rightHolder) },
              ],
            },
          ],
        },
      ] : []),
    ],
    footerNote: 'This case file reflects records in the SYRIOS catalog. Catalog classifications and frequencies are not direct measures of ancient production, circulation, survival, or use.',
  };
};

export default buildCoinDetectivePdfDocument;
