import { describe, expect, it } from 'vitest';
import { buildCoinDetectivePdfDocument } from './coinDetectivePdf';

const coin = {
  id: 17,
  coinId: 'antioch_17',
  displayName: 'Royal / Antioch / Silver',
  dateRange: '180 BCE-160 BCE',
  diameter: 27,
  material: 'Silver',
  authority: 'Royal',
  power: 'Seleucid',
  denomination: 'Tetradrachm',
  language: 'Greek',
  mint: 'Antioch',
  territory: 'Syria',
  modernName: 'Antakya',
  modernCountry: 'Turkey',
  obverseType: 'Diademed head',
  obverseLegend: 'ΒΑΣΙΛΕΩΣ',
  reverseType: 'Zeus seated',
  reverseLegend: 'ΑΝΤΙΟΧΟΥ',
  obverseImage: { url: 'https://images.example/obverse.jpg', alt: 'Obverse' },
  reverseImage: { url: 'https://images.example/reverse.jpg', alt: 'Reverse' },
  reference: 'SC 123',
  sourceImage: 'https://museum.example/object/17',
  rightHolder: 'Example Museum',
};

describe('Coin Detective PDF document', () => {
  it('preserves the current student work, evidence, images, and citation trail', () => {
    const question = { key: 'material', label: 'Material', answer: 'Silver' };
    const model = buildCoinDetectivePdfDocument({
      coin,
      mode: 'guided',
      questions: [question],
      answers: { material: 'Bronze' },
      notes: 'The portrait’s diadem may indicate royal authority.',
      siteOrigin: 'https://syrios.uh.edu',
      generatedAt: '2026-08-14T12:30:00Z',
    });

    const blocks = model.sections.flatMap((section) => section.blocks);
    const allPairs = blocks.filter((block) => block.type === 'keyValue').flatMap((block) => block.items);
    const hypothesisTable = blocks.find((block) => block.type === 'table');
    const imageRow = blocks.find((block) => block.type === 'imageRow');

    expect(model.fileName).toBe('SYRIOS-Coin-Detective-antioch_17.pdf');
    expect(model.metadata).toContainEqual({ label: 'Hypothesis check', value: '0 of 1 matched the catalog' });
    expect(model.sections[0].blocks[0].text).toContain('portrait’s diadem');
    expect(hypothesisTable.rows[0]).toMatchObject({ hypothesis: 'Bronze', catalog: 'Silver', result: 'Revisit evidence' });
    expect(imageRow.images.map((image) => image.url)).toEqual([
      'https://images.example/obverse.jpg',
      'https://images.example/reverse.jpg',
    ]);
    expect(allPairs).toContainEqual({ label: 'Catalog reference', value: 'SC 123' });
    expect(allPairs).toContainEqual({ label: 'Image source', value: 'https://museum.example/object/17' });
    expect(allPairs).toContainEqual({ label: 'Rights holder', value: 'Example Museum' });
    expect(allPairs).toContainEqual({ label: 'Catalog record', value: 'https://syrios.uh.edu/Coin/17' });
  });
});
