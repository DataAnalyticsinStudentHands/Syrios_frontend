import { jsPDF } from 'jspdf';
import dejavuBoldUrl from 'dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf?url';
import dejavuRegularUrl from 'dejavu-fonts-ttf/ttf/DejaVuSans.ttf?url';

const PAGE = Object.freeze({
  width: 210,
  height: 297,
  marginX: 17,
  top: 18,
  bottom: 25,
});

const COLORS = Object.freeze({
  ink: [18, 45, 61],
  muted: [83, 96, 103],
  accent: [166, 104, 24],
  accentSoft: [247, 239, 224],
  rule: [211, 203, 187],
  paper: [252, 250, 246],
  white: [255, 255, 255],
  success: [49, 105, 79],
});

const asText = (value, fallback = '') => {
  if (value == null || value === '') return fallback;
  if (Array.isArray(value)) return value.map((item) => asText(item)).filter(Boolean).join(', ');
  return String(value);
};
const isSafeHttpUrl = (value) => /^https?:\/\//i.test(asText(value).trim());
const IMAGE_TIMEOUT_MS = 12000;
const FONT_TIMEOUT_MS = 15000;
const IMAGE_DECODE_TIMEOUT_MS = 12000;
const IMAGE_PRELOAD_CONCURRENCY = 3;
const MAX_IMAGE_BLOB_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 64 * 1024 * 1024;

const withAbortableTimeout = async (operation, timeoutMs, timeoutMessage) => {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let didTimeout = false;
  let timeout;
  const deadline = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      didTimeout = true;
      controller?.abort();
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([
      Promise.resolve().then(() => operation(controller?.signal)),
      deadline,
    ]);
  } catch (error) {
    if (didTimeout || error?.name === 'AbortError') throw new Error(timeoutMessage);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const withTimeout = async (operation, timeoutMs, timeoutMessage, onLateResult) => {
  let didTimeout = false;
  let timeout;
  const work = Promise.resolve().then(operation);
  const deadline = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      didTimeout = true;
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([work, deadline]);
  } finally {
    clearTimeout(timeout);
    if (didTimeout && onLateResult) work.then(onLateResult, () => {});
  }
};

// The embedded DejaVu font preserves student prose and ancient Greek legends. Only
// dash variants are normalized because PDF line wrapping treats them inconsistently.
export const normalizePdfText = (value, fallback = '') => asText(value, fallback)
  .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-')
  .replace(/[ \t]+/g, ' ').trim();

export const sanitizePdfFileName = (value, fallback = 'syrios-learning-artifact') => {
  const withoutExtension = normalizePdfText(value || fallback)
    .replace(/\.pdf$/i, '')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')
    .slice(0, 120);
  const safeBase = withoutExtension || normalizePdfText(fallback).replace(/\s+/g, '-') || 'syrios-learning-artifact';
  return `${safeBase}.pdf`;
};

export const formatPdfGeneratedAt = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date not recorded';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const collectPdfImageUrls = (document = {}) => (document.sections || [])
  .flatMap((section) => section.blocks || [])
  .filter((block) => block.type === 'imageRow')
  .flatMap((block) => block.images || [])
  .map((image) => image?.url)
  .filter(Boolean);

const cleanPairs = (items = []) => items
  .filter(Boolean)
  .map((item) => ({
    label: normalizePdfText(item.label, 'Field'),
    value: normalizePdfText(item.value, 'Not recorded'),
  }));

export const normalizeLearningArtifactDocument = (document = {}) => ({
  fileName: sanitizePdfFileName(document.fileName),
  eyebrow: normalizePdfText(document.eyebrow, 'SYRIOS learning artifact'),
  title: normalizePdfText(document.title, 'SYRIOS Learning Artifact'),
  subtitle: normalizePdfText(document.subtitle),
  generatedAt: formatPdfGeneratedAt(document.generatedAt),
  metadata: cleanPairs(document.metadata),
  sections: (document.sections || []).filter(Boolean).map((section) => ({
    title: normalizePdfText(section.title, 'Section'),
    intro: normalizePdfText(section.intro),
    blocks: (section.blocks || []).filter(Boolean),
  })),
  footerNote: normalizePdfText(
    document.footerNote,
    'Generated from the SYRIOS teaching collection. Catalog patterns do not represent ancient production or circulation totals.',
  ),
});

const readImageBlob = async (url) => {
  if (!url || typeof fetch !== 'function') throw new Error('Image loading is unavailable');
  return withAbortableTimeout(async (signal) => {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      signal,
    });
    if (!response.ok) throw new Error(`Image request failed (${response.status})`);
    const contentType = response.headers?.get?.('content-type') || '';
    if (contentType && !/^image\//i.test(contentType)) {
      throw new Error('Image request returned a non-image file');
    }
    const contentLength = Number(response.headers?.get?.('content-length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BLOB_BYTES) {
      throw new Error('Image file is too large for PDF export');
    }
    const blob = await response.blob();
    if (blob.type && !/^image\//i.test(blob.type)) {
      throw new Error('Image request returned a non-image file');
    }
    if (blob.size > MAX_IMAGE_BLOB_BYTES) {
      throw new Error('Image file is too large for PDF export');
    }
    return blob;
  }, IMAGE_TIMEOUT_MS, 'Image request timed out');
};

const decodeBlob = async (blob) => {
  if (typeof createImageBitmap === 'function') {
    return withTimeout(
      () => createImageBitmap(blob),
      IMAGE_DECODE_TIMEOUT_MS,
      'Image decoding timed out',
      (bitmap) => bitmap?.close?.(),
    );
  }
  return new Promise((resolve, reject) => {
    if (
      typeof Image !== 'function'
      || typeof URL === 'undefined'
      || typeof URL.createObjectURL !== 'function'
    ) {
      reject(new Error('Image decoding is unavailable'));
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      URL.revokeObjectURL(objectUrl);
      callback(value);
    };
    const timeout = setTimeout(() => {
      finish(reject, new Error('Image decoding timed out'));
      image.src = '';
    }, IMAGE_DECODE_TIMEOUT_MS);
    image.onload = () => {
      finish(resolve, image);
    };
    image.onerror = () => {
      finish(reject, new Error('Image could not be decoded'));
    };
    image.src = objectUrl;
  });
};

const imageToJpeg = async (url) => {
  const bitmap = await decodeBlob(await readImageBlob(url));
  const naturalWidth = bitmap.width || bitmap.naturalWidth;
  const naturalHeight = bitmap.height || bitmap.naturalHeight;
  if (!naturalWidth || !naturalHeight) throw new Error('Image has no dimensions');
  if (naturalWidth * naturalHeight > MAX_IMAGE_PIXELS) {
    bitmap.close?.();
    throw new Error('Image dimensions are too large for PDF export');
  }

  // Downsampling bounds memory use for high-resolution museum photography while
  // preserving enough detail for a sharp coin image in the downloaded document.
  const longestSide = Math.min(1400, Math.max(naturalWidth, naturalHeight));
  const scale = Math.min(1, longestSide / Math.max(naturalWidth, naturalHeight));
  const width = Math.max(1, Math.round(naturalWidth * scale));
  const height = Math.max(1, Math.round(naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  if (typeof bitmap.close === 'function') bitmap.close();
  return { dataUrl: canvas.toDataURL('image/jpeg', 0.88), width, height };
};

const preloadImages = async (document, onProgress) => {
  const images = (document.sections || [])
    .flatMap((section) => section.blocks || [])
    .filter((block) => block.type === 'imageRow')
    .flatMap((block) => block.images || []);
  const urls = [...new Set(images.map((image) => image?.url).filter(Boolean))];
  const results = new Map();
  let completed = 0;
  onProgress?.({ phase: 'images', completed, total: urls.length });

  // Each URL is fetched once even when a teaching artifact cites the same face twice.
  // A small worker pool prevents a large class artifact from decoding every museum
  // image at once and exhausting the browser's memory.
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(IMAGE_PRELOAD_CONCURRENCY, urls.length) },
    async () => {
      while (nextIndex < urls.length) {
        const url = urls[nextIndex];
        nextIndex += 1;
        try {
          results.set(url, { status: 'loaded', ...(await imageToJpeg(url)) });
        } catch (error) {
          results.set(url, { status: 'omitted', reason: error?.message || 'Image unavailable' });
        } finally {
          completed += 1;
          onProgress?.({ phase: 'images', completed, total: urls.length });
        }
      }
    }
  );
  await Promise.all(workers);
  return results;
};

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
};

const fetchFont = async (url) => {
  if (typeof fetch !== 'function') throw new Error('PDF font loading is unavailable');
  return withAbortableTimeout(async (signal) => {
    const response = await fetch(url, { credentials: 'same-origin', signal });
    if (!response.ok) throw new Error(`PDF font could not be loaded (${response.status})`);
    return arrayBufferToBase64(await response.arrayBuffer());
  }, FONT_TIMEOUT_MS, 'PDF font request timed out');
};

const installUnicodeFonts = async (doc) => {
  // Font files are emitted as separate Vite assets and fetched only when the user
  // requests a PDF, avoiding a large cost during ordinary teaching-tool use.
  const [regular, bold] = await Promise.all([
    fetchFont(dejavuRegularUrl),
    fetchFont(dejavuBoldUrl),
  ]);
  doc.addFileToVFS('DejaVuSans.ttf', regular);
  doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal', 'Identity-H');
  doc.addFileToVFS('DejaVuSans-Bold.ttf', bold);
  doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold', 'Identity-H');
};

export class PdfLayout {
  constructor(doc, artifact, imageResults) {
    this.doc = doc;
    this.artifact = artifact;
    this.imageResults = imageResults;
    this.contentWidth = PAGE.width - PAGE.marginX * 2;
    this.y = PAGE.top;
    this.pageCount = 1;
    this.omittedImageCount = 0;
  }

  setFont(size = 10, style = 'normal', color = COLORS.ink) {
    this.doc.setFont('DejaVuSans', style === 'bold' ? 'bold' : 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
  }

  addPage() {
    this.doc.addPage();
    this.pageCount += 1;
    this.y = PAGE.top;
    this.setFont(7.5, 'bold', COLORS.accent);
    const headerLines = this.doc
      .splitTextToSize(normalizePdfText(this.artifact.title).toUpperCase(), this.contentWidth)
      .slice(0, 2);
    this.doc.text(headerLines, PAGE.marginX, this.y);
    this.doc.setDrawColor(...COLORS.rule);
    const ruleY = this.y + Math.max(1, headerLines.length) * 3.3 + 1.5;
    this.doc.line(PAGE.marginX, ruleY, PAGE.width - PAGE.marginX, ruleY);
    this.y = ruleY + 6;
  }

  ensureSpace(height, continuation = false) {
    if (this.y + height <= PAGE.height - PAGE.bottom) return false;
    this.addPage();
    if (continuation) {
      this.setFont(8, 'italic', COLORS.muted);
      this.doc.text('Continued', PAGE.marginX, this.y);
      this.y += 5;
    }
    return true;
  }

  split(text, width = this.contentWidth, size = 10) {
    this.setFont(size);
    return this.doc.splitTextToSize(normalizePdfText(text, 'Not recorded'), width);
  }

  paragraph(text, options = {}) {
    const size = options.size || 9.5;
    const lineHeight = options.lineHeight || 4.8;
    const width = options.width || this.contentWidth;
    const x = options.x || PAGE.marginX;
    const lines = this.split(text, width, size);
    this.setFont(size, options.style || 'normal', options.color || COLORS.ink);
    lines.forEach((line) => {
      if (this.ensureSpace(lineHeight + 1, true)) {
        this.setFont(size, options.style || 'normal', options.color || COLORS.ink);
      }
      this.doc.text(line, x, this.y);
      this.y += lineHeight;
    });
    this.y += options.after ?? 2.5;
  }

  cover() {
    this.doc.setFillColor(...COLORS.paper);
    this.doc.rect(0, 0, PAGE.width, PAGE.height, 'F');
    this.doc.setFillColor(...COLORS.accent);
    this.doc.rect(0, 0, 7, PAGE.height, 'F');
    this.y = 26;
    this.setFont(8, 'bold', COLORS.accent);
    this.doc.text(this.artifact.eyebrow.toUpperCase(), PAGE.marginX, this.y);
    this.y += 10;
    this.setFont(25, 'normal', COLORS.ink);
    const titleLines = this.doc.splitTextToSize(this.artifact.title, this.contentWidth);
    this.doc.text(titleLines, PAGE.marginX, this.y);
    this.y += titleLines.length * 10 + 2;
    if (this.artifact.subtitle) this.paragraph(this.artifact.subtitle, { size: 11, color: COLORS.muted, lineHeight: 5.6, after: 5 });
    this.doc.setDrawColor(...COLORS.accent);
    this.doc.setLineWidth(0.5);
    this.doc.line(PAGE.marginX, this.y, PAGE.width - PAGE.marginX, this.y);
    this.y += 8;
    this.keyValue([
      ...this.artifact.metadata,
      { label: 'Generated', value: this.artifact.generatedAt },
    ], true);
  }

  sectionTitle(title, intro) {
    this.ensureSpace(intro ? 27 : 17);
    this.y += 5;
    this.setFont(7.5, 'bold', COLORS.accent);
    this.doc.text('EVIDENCE SECTION', PAGE.marginX, this.y);
    this.y += 7;
    this.setFont(17, 'normal', COLORS.ink);
    const lines = this.doc.splitTextToSize(normalizePdfText(title), this.contentWidth);
    this.doc.text(lines, PAGE.marginX, this.y);
    this.y += lines.length * 7.2 + 2;
    if (intro) this.paragraph(intro, { size: 9, color: COLORS.muted, after: 3 });
  }

  keyValue(items, compact = false) {
    const pairs = cleanPairs(items);
    pairs.forEach((item) => {
      const labelWidth = 43;
      const valueLines = [...this.split(item.value, this.contentWidth - labelWidth - 5, compact ? 9 : 9.5)];
      this.setFont(7.5, 'bold', COLORS.accent);
      const labelLines = [...this.doc.splitTextToSize(item.label.toUpperCase(), labelWidth - 6)];
      const isUrl = isSafeHttpUrl(item.value);
      let continuation = false;

      // Metadata may contain full student prose or long source URLs. Split both
      // columns into bounded cards so neither can extend beneath the page footer.
      while (labelLines.length || valueLines.length) {
        let available = PAGE.height - PAGE.bottom - this.y;
        if (available < 9) {
          this.addPage();
          available = PAGE.height - PAGE.bottom - this.y;
        }
        const labelCapacity = Math.max(1, Math.floor((available - 4) / 3.5));
        const valueCapacity = Math.max(1, Math.floor((available - 4) / 4.5));
        const currentLabelLines = labelLines.splice(0, labelCapacity);
        const currentValueLines = valueLines.splice(0, valueCapacity);
        if (continuation && !currentLabelLines.length) currentLabelLines.push('CONTINUED');
        const rowHeight = Math.max(
          9,
          currentLabelLines.length * 3.5 + 4,
          currentValueLines.length * 4.5 + 4,
        );

        this.doc.setFillColor(...COLORS.white);
        this.doc.setDrawColor(...COLORS.rule);
        this.doc.roundedRect(PAGE.marginX, this.y, this.contentWidth, rowHeight - 1, 1.5, 1.5, 'FD');
        this.setFont(7.5, 'bold', COLORS.accent);
        this.doc.text(currentLabelLines, PAGE.marginX + 3, this.y + 5.5);
        this.setFont(compact ? 9 : 9.5, 'normal', isUrl ? COLORS.accent : COLORS.ink);
        this.doc.text(currentValueLines, PAGE.marginX + labelWidth, this.y + 5.5);
        if (isUrl && currentValueLines.length) {
          this.doc.link(PAGE.marginX + labelWidth, this.y + 1, this.contentWidth - labelWidth, rowHeight - 2, { url: item.value });
        }
        this.y += rowHeight;
        if (labelLines.length || valueLines.length) {
          this.addPage();
          continuation = true;
        }
      }
    });
    this.y += 2;
  }

  callout(block) {
    const title = normalizePdfText(block.title);
    const remaining = [...this.split(block.text, this.contentWidth - 10, 9.5)];
    const lineHeight = 4.8;
    let continuation = false;

    // Student prose can exceed a page. Bounded continuation cards ensure no
    // observation, claim, or methods note is silently clipped below the footer.
    while (remaining.length) {
      const heading = title ? `${title}${continuation ? ' (continued)' : ''}` : '';
      const chromeHeight = heading ? 12 : 8;
      let available = PAGE.height - PAGE.bottom - this.y;
      if (available < chromeHeight + lineHeight) {
        this.addPage();
        available = PAGE.height - PAGE.bottom - this.y;
      }
      const lineCapacity = Math.max(1, Math.floor((available - chromeHeight) / lineHeight));
      const lines = remaining.splice(0, lineCapacity);
      const height = lines.length * lineHeight + chromeHeight;
      this.doc.setFillColor(...COLORS.accentSoft);
      this.doc.setDrawColor(...COLORS.accent);
      this.doc.roundedRect(PAGE.marginX, this.y, this.contentWidth, height, 2, 2, 'FD');
      let textY = this.y + 6;
      if (heading) {
        this.setFont(8, 'bold', COLORS.accent);
        this.doc.text(heading.toUpperCase(), PAGE.marginX + 5, textY);
        textY += 5;
      }
      this.setFont(9.5, 'normal', COLORS.ink);
      this.doc.text(lines, PAGE.marginX + 5, textY);
      this.y += height + 4;
      if (remaining.length) {
        this.addPage();
        continuation = true;
      }
    }
  }

  table(block) {
    const columns = (block.columns || []).filter(Boolean);
    if (!columns.length) return;
    const declaredWidth = columns.reduce((sum, column) => sum + (Number(column.width) || 1), 0);
    const widths = columns.map((column) => this.contentWidth * ((Number(column.width) || 1) / declaredWidth));
    const headerLines = columns.map((column, index) => {
      this.setFont(7, 'bold', COLORS.white);
      return this.doc.splitTextToSize(
        normalizePdfText(column.label, column.key).toUpperCase(),
        widths[index] - 4,
      );
    });
    const headerHeight = Math.max(9, ...headerLines.map((lines) => lines.length * 3.2 + 3.5));
    const drawHeader = () => {
      this.doc.setFillColor(...COLORS.ink);
      this.doc.rect(PAGE.marginX, this.y, this.contentWidth, headerHeight, 'F');
      let x = PAGE.marginX;
      columns.forEach((column, index) => {
        this.setFont(7, 'bold', COLORS.white);
        this.doc.text(headerLines[index], x + 2, this.y + 5.2, { maxWidth: widths[index] - 4 });
        x += widths[index];
      });
      this.y += headerHeight;
    };
    const startTablePage = (forceNewPage = false, continuation = false) => {
      if (forceNewPage || this.y + headerHeight + 9 > PAGE.height - PAGE.bottom) this.addPage();
      drawHeader();
      if (continuation) {
        this.doc.setFillColor(...COLORS.accentSoft);
        this.doc.rect(PAGE.marginX, this.y, this.contentWidth, 5, 'F');
        this.setFont(6.5, 'bold', COLORS.accent);
        this.doc.text('ROW CONTINUED', PAGE.marginX + 2, this.y + 3.5);
        this.y += 5;
      }
    };
    startTablePage();

    (block.rows || []).forEach((row, rowIndex) => {
      const remainingLines = columns.map((column, index) => [
        ...this.split(row?.[column.key], widths[index] - 4, 8),
      ]);
      const unsplitHeight = Math.max(9, ...remainingLines.map((lines) => lines.length * 3.8 + 4));
      const available = PAGE.height - PAGE.bottom - this.y;
      const freshRowCapacity = PAGE.height - PAGE.bottom - (PAGE.top + 15) - headerHeight;
      if (
        unsplitHeight > available
        && (unsplitHeight <= freshRowCapacity || available < 25)
      ) startTablePage(true);

      let continuation = false;
      while (remainingLines.some((lines) => lines.length)) {
        let available = PAGE.height - PAGE.bottom - this.y;
        if (available < 9) {
          startTablePage(true, continuation);
          available = PAGE.height - PAGE.bottom - this.y;
        }
        const lineCapacity = Math.max(1, Math.floor((available - 4) / 3.8));
        const cellChunks = remainingLines.map((lines) => lines.splice(0, lineCapacity));
        const rowHeight = Math.max(9, ...cellChunks.map((lines) => lines.length * 3.8 + 4));
        if (rowIndex % 2 === 0) {
          this.doc.setFillColor(...COLORS.paper);
          this.doc.rect(PAGE.marginX, this.y, this.contentWidth, rowHeight, 'F');
        }
        this.doc.setDrawColor(...COLORS.rule);
        this.doc.rect(PAGE.marginX, this.y, this.contentWidth, rowHeight, 'S');
        let x = PAGE.marginX;
        cellChunks.forEach((lines, index) => {
          this.setFont(8, index === 0 ? 'bold' : 'normal', COLORS.ink);
          this.doc.text(lines, x + 2, this.y + 5, { maxWidth: widths[index] - 4 });
          x += widths[index];
        });
        this.y += rowHeight;
        if (remainingLines.some((lines) => lines.length)) {
          continuation = true;
          startTablePage(true, true);
        }
      }
    });
    this.y += 4;
  }

  checklist(block) {
    (block.items || []).forEach((item) => {
      const label = normalizePdfText(item.label, 'Requirement');
      const note = normalizePdfText(item.note);
      const remaining = [...this.split(note ? `${label}: ${note}` : label, this.contentWidth - 12, 9)];
      let continuation = false;

      while (remaining.length) {
        const chromeHeight = continuation ? 4 : 0;
        let available = PAGE.height - PAGE.bottom - this.y;
        if (available < chromeHeight + 9) {
          this.addPage();
          available = PAGE.height - PAGE.bottom - this.y;
        }
        const lineCapacity = Math.max(1, Math.floor((available - chromeHeight - 4) / 4.3));
        const lines = remaining.splice(0, lineCapacity);
        const height = Math.max(9, chromeHeight + lines.length * 4.3 + 4);
        this.doc.setDrawColor(...(item.checked ? COLORS.success : COLORS.rule));
        this.doc.setFillColor(...(item.checked ? COLORS.success : COLORS.white));
        this.doc.rect(PAGE.marginX + 1, this.y + 2, 5, 5, item.checked ? 'FD' : 'S');
        if (item.checked) {
          this.setFont(8, 'bold', COLORS.white);
          this.doc.text('x', PAGE.marginX + 2.5, this.y + 6);
        }
        if (continuation) {
          this.setFont(6.5, 'bold', COLORS.accent);
          this.doc.text('CONTINUED', PAGE.marginX + 10, this.y + 3.5);
        }
        this.setFont(9, item.checked ? 'bold' : 'normal', COLORS.ink);
        this.doc.text(lines, PAGE.marginX + 10, this.y + 5.7 + chromeHeight);
        this.y += height;
        if (remaining.length) {
          this.addPage();
          continuation = true;
        }
      }
    });
    this.y += 3;
  }

  imageRow(block) {
    const images = (block.images || []).filter(Boolean);
    const gap = 6;
    const cardWidth = (this.contentWidth - gap) / 2;
    const imageHeight = 42;
    for (let start = 0; start < images.length; start += 2) {
      const pair = images.slice(start, start + 2);
      const captions = pair.map((image) => this.split(image.caption || image.alt || 'Catalog image', cardWidth - 6, 7.5).slice(0, 3));
      const cardHeight = imageHeight + Math.max(...captions.map((lines) => lines.length), 1) * 3.5 + 9;
      this.ensureSpace(cardHeight);
      pair.forEach((image, index) => {
        const x = PAGE.marginX + index * (cardWidth + gap);
        this.doc.setFillColor(...COLORS.white);
        this.doc.setDrawColor(...COLORS.rule);
        this.doc.roundedRect(x, this.y, cardWidth, cardHeight - 2, 2, 2, 'FD');
        const loaded = image.url ? this.imageResults.get(image.url) : null;
        if (loaded?.status === 'loaded') {
          const maxWidth = cardWidth - 8;
          const maxHeight = imageHeight - 7;
          const scale = Math.min(maxWidth / loaded.width, maxHeight / loaded.height);
          const width = loaded.width * scale;
          const height = loaded.height * scale;
          this.doc.addImage(loaded.dataUrl, 'JPEG', x + (cardWidth - width) / 2, this.y + 4, width, height, undefined, 'FAST');
        } else {
          this.omittedImageCount += 1;
          this.doc.setFillColor(...COLORS.accentSoft);
          this.doc.roundedRect(x + 4, this.y + 4, cardWidth - 8, imageHeight - 7, 1.5, 1.5, 'F');
          this.setFont(8, 'bold', COLORS.accent);
          this.doc.text('IMAGE UNAVAILABLE IN PDF', x + cardWidth / 2, this.y + 21, { align: 'center' });
          this.setFont(7.5, 'normal', COLORS.muted);
          this.doc.text('Source details remain below.', x + cardWidth / 2, this.y + 26, { align: 'center' });
        }
        this.setFont(7.5, 'normal', COLORS.ink);
        this.doc.text(captions[index], x + 3, this.y + imageHeight + 2);
        if (isSafeHttpUrl(image.sourceUrl)) {
          const source = normalizePdfText(image.sourceUrl);
          this.setFont(6.5, 'normal', COLORS.accent);
          this.doc.textWithLink('Open image source', x + 3, this.y + cardHeight - 5, { url: source });
        }
      });
      this.y += cardHeight + 4;
    }
  }

  renderBlock(block) {
    switch (block?.type) {
      case 'paragraph':
        this.paragraph(block.text);
        break;
      case 'callout':
        this.callout(block);
        break;
      case 'keyValue':
        this.keyValue(block.items);
        break;
      case 'table':
        this.table(block);
        break;
      case 'checklist':
        this.checklist(block);
        break;
      case 'imageRow':
        this.imageRow(block);
        break;
      default:
        if (block?.text) this.paragraph(block.text);
    }
  }

  addFooters() {
    const pageTotal = this.doc.getNumberOfPages();
    for (let page = 1; page <= pageTotal; page += 1) {
      this.doc.setPage(page);
      this.doc.setDrawColor(...COLORS.rule);
      this.doc.line(PAGE.marginX, PAGE.height - 18, PAGE.width - PAGE.marginX, PAGE.height - 18);
      this.setFont(6.5, 'normal', COLORS.muted);
      const footer = this.doc.splitTextToSize(this.artifact.footerNote, this.contentWidth - 23);
      this.doc.text(footer, PAGE.marginX, PAGE.height - 13.5, { lineHeightFactor: 1.15 });
      this.setFont(7, 'bold', COLORS.accent);
      this.doc.text(`${page} / ${pageTotal}`, PAGE.width - PAGE.marginX, PAGE.height - 13.5, { align: 'right' });
    }
  }
}

/**
 * Generates and downloads a real PDF from a feature-neutral document model.
 * Image failures are deliberately non-fatal: the exported scholarship remains
 * usable, and the PDF visibly records where a remote image could not be embedded.
 */
export const downloadLearningArtifactPdf = async (documentModel, options = {}) => {
  const artifact = normalizeLearningArtifactDocument(documentModel);
  const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
  onProgress?.({ phase: 'preparing', completed: 0, total: 1 });
  const imageResults = await preloadImages(documentModel || {}, onProgress);
  onProgress?.({ phase: 'layout', completed: 0, total: artifact.sections.length });

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
  });
  await installUnicodeFonts(doc);
  doc.setProperties({
    title: artifact.title,
    subject: artifact.subtitle || 'SYRIOS learning artifact',
    author: 'SYRIOS',
    creator: 'SYRIOS browser PDF exporter',
  });

  const layout = new PdfLayout(doc, artifact, imageResults);
  layout.cover();
  artifact.sections.forEach((section, index) => {
    layout.sectionTitle(section.title, section.intro);
    section.blocks.forEach((block) => layout.renderBlock(block));
    onProgress?.({ phase: 'layout', completed: index + 1, total: artifact.sections.length });
  });
  layout.addFooters();

  // `save` creates a browser download directly; no popup or print dialog is required.
  doc.save(artifact.fileName);
  onProgress?.({ phase: 'complete', completed: 1, total: 1 });
  return {
    fileName: artifact.fileName,
    pageCount: doc.getNumberOfPages(),
    omittedImageCount: layout.omittedImageCount,
  };
};

export default downloadLearningArtifactPdf;
