import { describe, expect, it } from 'vitest';
import { buildCoinCuratorPdfDocument } from './coinCuratorPdf';

const inquiry = {
  id: 'power-transition',
  label: 'Seleucid to Roman',
  question: 'What changes, and what persists, as governing powers change?',
};

const coin = (id, overrides = {}) => ({
  id,
  recordId: id,
  coinId: `curator_coin_${id}`,
  catalogPath: `/Coin/${id}`,
  displayName: `Authority ${id} / Antioch / Silver`,
  dateRange: '100 BCE-80 BCE',
  material: 'Silver',
  issuingAuthority: `Authority ${id}`,
  governingPower: 'Seleucid',
  mint: 'Antioch',
  territory: 'Syria',
  denomination: 'Tetradrachm',
  language: 'Greek',
  diameter: 24,
  reference: `Reference ${id}`,
  stableTypeUri: `https://example.org/type/${id}`,
  sourceImage: `https://example.org/source/${id}`,
  rightsHolder: 'Example museum',
  image: {
    obverseUrl: `https://example.org/images/${id}-obverse.jpg`,
    obverseAlt: `Obverse ${id}`,
    reverseUrl: `https://example.org/images/${id}-reverse.jpg`,
    reverseAlt: `Reverse ${id}`,
  },
  ...overrides,
});

const coins = [coin(1), coin(2, { material: 'Bronze' }), coin(3, { governingPower: 'Roman' })];
const draft = {
  exhibitTitle: 'Emperors & Cities: A Student Exhibit',
  thesis: 'The three coins frame political authority through changing institutions.',
  conclusion: 'Read together, the objects show both continuity and political change.',
  limitation: 'Three catalog records cannot establish ancient production totals.',
  entries: Object.fromEntries(coins.map((item) => [String(item.id), {
    observation: `Visible portrait on object ${item.id}`,
    catalogFact: `Cataloged fact for object ${item.id}`,
    reasoning: `Student interpretation for object ${item.id}`,
  }])),
};
const comparisonRows = [{
  label: 'Material',
  values: coins.map((item) => ({ coinId: String(item.id), value: item.material, status: 'recorded' })),
}];
const rubric = {
  score: 1,
  total: 2,
  criteria: [
    { id: 'thesis', label: 'Exhibit thesis provided', met: true, detail: 'Structure only.' },
    { id: 'sources', label: 'Every coin is attributed', met: false, detail: 'One source needs review.' },
  ],
};

const buildDocument = (overrides = {}) => buildCoinCuratorPdfDocument({
  draft,
  inquiry,
  selectedCoins: coins,
  comparisonRows,
  rubric,
  siteOrigin: 'https://syrios.uh.edu/',
  generatedAt: new Date('2026-08-14T15:30:00.000Z'),
  ...overrides,
});

describe('Coin Curator PDF document adapter', () => {
  it('retains the inquiry and every student-authored part of the exhibit', () => {
    const document = buildDocument();
    const serialized = JSON.stringify(document);

    expect(document).toMatchObject({
      fileName: 'emperors-cities-a-student-exhibit-coin-curator.pdf',
      eyebrow: 'SYRIOS Coin Curator / Student Exhibition',
      title: draft.exhibitTitle,
      subtitle: inquiry.question,
      generatedAt: '2026-08-14T15:30:00.000Z',
    });
    [draft.thesis, draft.conclusion, draft.limitation].forEach((text) => {
      expect(serialized).toContain(text);
    });
    coins.forEach((item) => {
      expect(serialized).toContain(draft.entries[String(item.id)].observation);
      expect(serialized).toContain(draft.entries[String(item.id)].catalogFact);
      expect(serialized).toContain(draft.entries[String(item.id)].reasoning);
    });
  });

  it('exports both coin faces, complete attribution, and absolute catalog links', () => {
    const document = buildDocument();
    const objectSection = document.sections.find((section) => section.title.startsWith('Object 1:'));
    const imageBlock = objectSection.blocks.find((block) => block.type === 'imageRow');
    const metadata = Object.fromEntries(
      objectSection.blocks.find((block) => block.type === 'keyValue').items
        .map((item) => [item.label, item.value]),
    );

    expect(imageBlock.images).toEqual([
      expect.objectContaining({
        url: coins[0].image.obverseUrl,
        caption: 'Obverse',
        sourceUrl: coins[0].sourceImage,
      }),
      expect.objectContaining({
        url: coins[0].image.reverseUrl,
        caption: 'Reverse',
        sourceUrl: coins[0].sourceImage,
      }),
    ]);
    expect(metadata).toMatchObject({
      'SYRIOS catalog record': 'https://syrios.uh.edu/Coin/1',
      'Catalog reference': 'Reference 1',
      'Stable type record': 'https://example.org/type/1',
      'Image source': 'https://example.org/source/1',
      'Rights holder': 'Example museum',
    });
  });

  it('includes the comparison table, rubric results, and collection limitation', () => {
    const document = buildDocument();
    const comparison = document.sections.find((section) => section.title === 'Catalog evidence comparison');
    const review = document.sections.find((section) => section.title === 'Structural review');

    expect(comparison.blocks[0]).toMatchObject({
      type: 'table',
      rows: [{ field: 'Material', object1: 'Silver', object2: 'Bronze', object3: 'Silver' }],
    });
    expect(review.blocks[0]).toEqual({
      type: 'checklist',
      items: [
        { label: 'Exhibit thesis provided', checked: true, note: 'Structure only.' },
        { label: 'Every coin is attributed', checked: false, note: 'One source needs review.' },
      ],
    });
    expect(document.metadata).toContainEqual({ label: 'Structural review', value: '1/2' });
    expect(document.footerNote).toContain('Catalog patterns are not direct measures');
  });

  it('labels incomplete writing honestly rather than inventing content', () => {
    const document = buildDocument({
      draft: { exhibitTitle: '', thesis: '', conclusion: '', limitation: '', entries: {} },
      comparisonRows: [],
      selectedCoins: [coins[0]],
    });
    const serialized = JSON.stringify(document);

    expect(document.title).toBe(inquiry.label);
    expect(serialized).toContain('Not yet written');
    expect(document.sections.some((section) => section.title === 'Catalog evidence comparison')).toBe(false);
  });
});
