const missingText = (value, fallback = 'Not recorded') => {
  if (value == null || String(value).trim() === '') return fallback;
  return String(value).trim();
};
const safeSourceUrl = (value) => (/^https?:\/\//i.test(value || '') ? value : undefined);

const absoluteCatalogUrl = (catalogPath, siteOrigin) => {
  const path = missingText(catalogPath, '');
  if (!path) return 'Not available';
  if (/^https?:\/\//i.test(path)) return path;
  const origin = missingText(siteOrigin, '').replace(/\/$/, '');
  return origin ? `${origin}${path.startsWith('/') ? '' : '/'}${path}` : path;
};

const pdfFileName = (value) => {
  const stem = missingText(value, 'coin-curator-exhibition')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 72);
  return `${stem || 'coin-curator-exhibition'}.pdf`;
};

const generatedAtValue = (generatedAt) => {
  const date = generatedAt instanceof Date ? generatedAt : new Date(generatedAt || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const coinMetadata = (coin, siteOrigin) => [
  { label: 'Catalog ID', value: missingText(coin.coinId || coin.recordId || coin.id) },
  { label: 'Date', value: missingText(coin.dateRange) },
  { label: 'Material', value: missingText(coin.material) },
  { label: 'Issuing authority', value: missingText(coin.issuingAuthority) },
  { label: 'Governing power', value: missingText(coin.governingPower) },
  { label: 'Mint', value: missingText(coin.mint) },
  { label: 'Ancient territory', value: missingText(coin.territory) },
  { label: 'Denomination', value: missingText(coin.denomination) },
  { label: 'Language', value: missingText(coin.language) },
  { label: 'Diameter', value: coin.diameter ? `${coin.diameter} mm` : 'Not recorded' },
  { label: 'SYRIOS catalog record', value: absoluteCatalogUrl(coin.catalogPath, siteOrigin) },
  { label: 'Catalog reference', value: missingText(coin.reference) },
  { label: 'Stable type record', value: missingText(coin.stableTypeUri) },
  { label: 'Image source', value: missingText(coin.sourceImage) },
  { label: 'Rights holder', value: missingText(coin.rightsHolder) },
];

const coinImages = (coin) => [
  coin.image?.obverseUrl && {
    url: coin.image.obverseUrl,
    alt: coin.image.obverseAlt || `Obverse of ${coin.displayName}`,
    caption: 'Obverse',
    sourceUrl: safeSourceUrl(coin.sourceImage),
  },
  coin.image?.reverseUrl && {
    url: coin.image.reverseUrl,
    alt: coin.image.reverseAlt || `Reverse of ${coin.displayName}`,
    caption: 'Reverse',
    sourceUrl: safeSourceUrl(coin.sourceImage),
  },
].filter(Boolean);

const evidenceEntry = (draft, coin) => draft.entries?.[String(coin.id)]
  || draft.entries?.[String(coin.recordId)]
  || {};

const comparisonSection = (comparisonRows, selectedCoins) => ({
  title: 'Catalog evidence comparison',
  intro: 'These values reproduce the catalog comparison used while constructing the exhibit.',
  blocks: [{
    type: 'table',
    columns: [
      { key: 'field', label: 'Recorded field', width: 0.28 },
      ...selectedCoins.map((_, index) => ({
        key: `object${index + 1}`,
        label: `Object ${index + 1}`,
        width: 0.24,
      })),
    ],
    rows: comparisonRows.map((row) => ({
      field: row.label,
      ...Object.fromEntries(row.values.map((entry, index) => [
        `object${index + 1}`,
        missingText(entry.value),
      ])),
    })),
  }],
});

const objectSection = (coin, index, draft, siteOrigin) => {
  const entry = evidenceEntry(draft, coin);
  const images = coinImages(coin);

  return {
    title: `Object ${index + 1}: ${missingText(coin.displayName, 'Catalog coin')}`,
    intro: [coin.dateRange, coin.material, coin.issuingAuthority, coin.governingPower]
      .filter(Boolean)
      .join(' | '),
    blocks: [
      ...(images.length ? [{ type: 'imageRow', images }] : []),
      { type: 'keyValue', items: coinMetadata(coin, siteOrigin) },
      {
        type: 'callout',
        title: 'Observed on the coin',
        text: missingText(entry.observation, 'Not yet written'),
      },
      {
        type: 'callout',
        title: 'Recorded in the catalog',
        text: missingText(entry.catalogFact, 'Not yet written'),
      },
      {
        type: 'callout',
        title: 'Student interpretation',
        text: missingText(entry.reasoning, 'Not yet written'),
      },
    ],
  };
};

/**
 * Converts a live Coin Curator draft into the shared, feature-neutral PDF model.
 * Keeping this mapping pure makes the exported evidence trail testable without
 * scraping the rendered page or changing any student-authored prose.
 */
export const buildCoinCuratorPdfDocument = ({
  draft,
  inquiry,
  selectedCoins = [],
  comparisonRows = [],
  rubric,
  siteOrigin = '',
  generatedAt = new Date(),
}) => {
  const title = missingText(draft?.exhibitTitle, inquiry?.label || 'Coin Curator exhibition');
  const safeRubric = rubric || { score: 0, total: 0, criteria: [] };

  return {
    fileName: pdfFileName(`${title}-coin-curator`),
    eyebrow: 'SYRIOS Coin Curator / Student Exhibition',
    title,
    subtitle: missingText(inquiry?.question, 'Inquiry not recorded'),
    generatedAt: generatedAtValue(generatedAt),
    metadata: [
      { label: 'Learning activity', value: 'Coin Curator' },
      { label: 'Inquiry', value: missingText(inquiry?.label) },
      { label: 'Inquiry key', value: missingText(inquiry?.id) },
      { label: 'Objects selected', value: String(selectedCoins.length) },
      { label: 'Structural review', value: `${safeRubric.score}/${safeRubric.total}` },
    ],
    sections: [
      {
        title: 'Inquiry and historical claim',
        intro: 'The prose below is student-authored and is reproduced without automated historical grading.',
        blocks: [
          { type: 'callout', title: 'Inquiry', text: missingText(inquiry?.question) },
          { type: 'callout', title: 'Exhibit thesis', text: missingText(draft?.thesis, 'Not yet written') },
        ],
      },
      ...(comparisonRows.length && selectedCoins.length
        ? [comparisonSection(comparisonRows, selectedCoins)]
        : []),
      ...selectedCoins.map((coin, index) => objectSection(coin, index, draft || {}, siteOrigin)),
      {
        title: 'Synthesis and limits',
        blocks: [
          {
            type: 'callout',
            title: 'Concluding synthesis',
            text: missingText(draft?.conclusion, 'Not yet written'),
          },
          {
            type: 'callout',
            title: 'Limits and uncertainty',
            text: missingText(draft?.limitation, 'Not yet written'),
          },
        ],
      },
      {
        title: 'Structural review',
        intro: 'This checklist evaluates completion and attribution, not whether an interpretation matches a preferred conclusion.',
        blocks: [{
          type: 'checklist',
          items: (safeRubric.criteria || []).map((criterion) => ({
            label: criterion.label,
            checked: Boolean(criterion.met),
            note: missingText(criterion.detail, ''),
          })),
        }],
      },
    ],
    footerNote: 'This student exhibition uses records in the SYRIOS collection. Catalog patterns are not direct measures of ancient production, circulation, survival, or use.',
  };
};

export default buildCoinCuratorPdfDocument;
