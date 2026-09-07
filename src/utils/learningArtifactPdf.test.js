import { describe, expect, it } from 'vitest';
import {
  collectPdfImageUrls,
  formatPdfGeneratedAt,
  normalizeLearningArtifactDocument,
  normalizePdfText,
  PdfLayout,
  sanitizePdfFileName,
} from './learningArtifactPdf';

describe('learning artifact PDF model', () => {
  it('preserves Greek, accented prose, and scholarly punctuation', () => {
    const text = 'Élève observes ΒΑΣΙΛΕΩΣ, “authority,” and uncertainty…';
    expect(normalizePdfText(text)).toBe(text);
    expect(normalizePdfText('Seleucid–Roman')).toBe('Seleucid-Roman');
  });

  it('creates a safe and stable PDF filename', () => {
    expect(sanitizePdfFileName('Coin Detective: Case 14.pdf')).toBe('Coin-Detective-Case-14.pdf');
    expect(sanitizePdfFileName('***', 'archive audit')).toBe('archive-audit.pdf');
  });

  it('normalizes document metadata without discarding Unicode student work', () => {
    const model = normalizeLearningArtifactDocument({
      fileName: 'méthodes',
      title: 'Méthodes et ΒΑΣΙΛΕΩΣ',
      generatedAt: '2026-08-14T12:30:00Z',
      metadata: [{ label: 'Student claim', value: 'C’est incertain.' }],
      sections: [{ title: 'Evidence', blocks: [{ type: 'paragraph', text: 'Kept verbatim' }] }],
    });

    expect(model.fileName).toBe('méthodes.pdf');
    expect(model.title).toBe('Méthodes et ΒΑΣΙΛΕΩΣ');
    expect(model.metadata[0].value).toBe('C’est incertain.');
    expect(model.generatedAt).toContain('August 14, 2026');
  });

  it('collects only renderable image URLs and handles invalid dates', () => {
    expect(collectPdfImageUrls({
      sections: [{ blocks: [{ type: 'imageRow', images: [{ url: '/obverse.jpg' }, {}, { url: '/reverse.jpg' }] }] }],
    })).toEqual(['/obverse.jpg', '/reverse.jpg']);
    expect(formatPdfGeneratedAt('not-a-date')).toBe('Date not recorded');
  });
});

class LayoutTestDocument {
  constructor() {
    this.page = 1;
    this.operations = [];
  }

  record(type, values = {}) {
    this.operations.push({ type, page: this.page, ...values });
  }

  setFont() {}

  setFontSize() {}

  setTextColor() {}

  setFillColor() {}

  setDrawColor() {}

  setLineWidth() {}

  addPage() {
    this.page += 1;
  }

  splitTextToSize(value, width) {
    const text = String(value ?? '');
    const charactersPerLine = Math.max(1, Math.floor(Number(width) * 0.75));
    const lines = [];
    for (let index = 0; index < text.length; index += charactersPerLine) {
      lines.push(text.slice(index, index + charactersPerLine));
    }
    return lines.length ? lines : [''];
  }

  text(value, x, y) {
    this.record('text', {
      value: Array.isArray(value) ? value.join('\n') : String(value),
      x,
      y,
    });
  }

  rect(x, y, width, height, style) {
    this.record('rect', { x, y, width, height, style });
  }

  roundedRect(x, y, width, height, radiusX, radiusY, style) {
    this.record('roundedRect', {
      x,
      y,
      width,
      height,
      radiusX,
      radiusY,
      style,
    });
  }

  line() {}

  link() {}
}

const createLayout = () => {
  const doc = new LayoutTestDocument();
  const artifact = normalizeLearningArtifactDocument({
    title: 'Pagination smoke test',
    sections: [],
  });
  return { doc, layout: new PdfLayout(doc, artifact, new Map()) };
};

describe('learning artifact PDF renderer pagination', () => {
  it('splits oversized key-value and checklist content before the footer', () => {
    const longText = Array.from({ length: 1800 }, (_, index) => `evidence-${index}`).join(' ');
    const keyValue = createLayout();
    keyValue.layout.keyValue([{ label: 'Extended field notes', value: longText }]);

    const metadataCards = keyValue.doc.operations.filter((operation) => operation.type === 'roundedRect');
    expect(keyValue.doc.page).toBeGreaterThan(1);
    expect(metadataCards).toHaveLength(keyValue.doc.page);
    expect(metadataCards.every((card) => card.y + card.height <= 272)).toBe(true);

    const checklist = createLayout();
    checklist.layout.checklist({
      items: [{
        checked: true,
        label: 'Evidence requirement',
        note: longText,
      }],
    });
    expect(checklist.doc.page).toBeGreaterThan(1);
    expect(checklist.doc.operations.some(
      (operation) => operation.type === 'text' && operation.value === 'CONTINUED',
    )).toBe(true);
  });

  it('splits an oversized table row and repeats its header on every continuation page', () => {
    const { doc, layout } = createLayout();
    const longEvidence = Array.from({ length: 2200 }, (_, index) => `catalog-${index}`).join(' ');
    layout.table({
      columns: [
        { key: 'record', label: 'Record', width: 1 },
        { key: 'evidence', label: 'Evidence', width: 3 },
      ],
      rows: [{ record: 'SYRIOS 1', evidence: longEvidence }],
    });

    const headerCount = doc.operations.filter(
      (operation) => operation.type === 'text' && operation.value === 'EVIDENCE',
    ).length;
    const rowBorders = doc.operations.filter(
      (operation) => operation.type === 'rect' && operation.style === 'S',
    );
    expect(doc.page).toBeGreaterThan(1);
    expect(headerCount).toBe(doc.page);
    expect(doc.operations.some(
      (operation) => operation.type === 'text' && operation.value === 'ROW CONTINUED',
    )).toBe(true);
    expect(rowBorders.every((row) => row.y + row.height <= 272)).toBe(true);
  });
});
