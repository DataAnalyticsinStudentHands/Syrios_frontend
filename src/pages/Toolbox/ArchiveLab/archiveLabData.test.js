import { describe, expect, it } from 'vitest';
import {
  ARCHIVE_AUDIT_SIZE,
  ARCHIVE_DRAFT_VERSION,
  ARCHIVE_FIELDS,
  ARCHIVE_SAMPLE_SIZE,
  buildArchiveChallenges,
  buildArchivePdfDocument,
  buildArchiveSample,
  buildCompletenessMatrix,
  calculateArchiveRubric,
  classifyArchiveValue,
  createArchiveDraft,
  getArchiveFieldValue,
  getArchiveInquiry,
  getArchiveInquiryUsability,
  getArchiveRecordCompleteness,
  normalizeArchiveCoin,
  reconcileArchiveCitationIds,
  restoreArchiveDraft,
  sanitizeArchiveDraft,
  selectDeepAuditRecords,
  serializeArchiveDraft,
  summarizeArchiveInquiryUsability,
} from './archiveLabData';

const makeRecord = (id, overrides = {}) => ({
  id,
  coinId: `coin-${id}`,
  title: `Coin ${id}`,
  fromYear: -300 + id,
  toYear: -299 + id,
  dateRange: `${300 - id} BCE-${299 - id} BCE`,
  hasValidDate: true,
  material: ['Bronze', 'Silver', 'Gold'][id % 3],
  authority: ['Royal', 'Civic', 'Imperial'][id % 3],
  power: ['Seleucid', 'Roman'][id % 2],
  mint: ['Antioch', 'Damascus', 'Sidon'][id % 3],
  territory: ['Syria', 'Phoenicia'][id % 2],
  denomination: 'Tetradrachm',
  language: 'Greek',
  obverseType: 'Portrait right',
  reverseType: 'Standing figure',
  reference: `R-${id}`,
  sourceImage: `https://images.example/${id}`,
  rightsHolder: 'Teaching collection',
  stableTypeUri: `https://types.example/${id}`,
  obverseImage: { url: `/o-${id}.jpg`, alt: `Obverse ${id}` },
  reverseImage: { url: `/r-${id}.jpg`, alt: `Reverse ${id}` },
  catalogPath: `/Coin/${id}`,
  exactCitation: `coin-${id} - R-${id}`,
  ...overrides,
});

const records = Array.from({ length: 40 }, (_, index) => makeRecord(index + 1));

describe('archive value states', () => {
  it.each([
    ['Bronze', '', 'Recorded'],
    ['uncertain', 'authority', 'Uncertain'],
    ['portrait [uncertain]', 'obverseType', 'Uncertain'],
    ['uncertain attribution', 'authority', 'Uncertain'],
    ['Antioch?', 'mint', 'Uncertain'],
    ['probably Greek', 'language', 'Uncertain'],
    ['possibly bronze', 'material', 'Uncertain'],
    ['', 'material', 'Missing'],
    ['unknown', 'material', 'Missing'],
    ['Date not recorded', 'dateRange', 'Missing'],
    ['n/a', 'language', 'Not applicable'],
  ])('classifies %s for %s as %s', (value, field, expected) => {
    expect(classifyArchiveValue(value, field)).toBe(expected);
  });

  it('treats none as not applicable only for a legend field', () => {
    expect(classifyArchiveValue('none', 'obverseLegend')).toBe('Not applicable');
    expect(classifyArchiveValue('no legend', 'reverseLegend')).toBe('Not applicable');
    expect(classifyArchiveValue('none', 'reference')).toBe('Missing');
    expect(classifyArchiveValue(null, 'reference')).toBe('Missing');
  });
});

describe('normalization and completeness', () => {
  it('accepts an already normalized detective record and retains source metadata', () => {
    const normalized = normalizeArchiveCoin(makeRecord(7));
    expect(normalized.catalogPath).toBe('/Coin/7');
    expect(normalized.exactCitation).toContain('R-7');
    expect(normalized.stableTypeUri).toBe('https://types.example/7');
    expect(normalized.rightsHolder).toBe('Teaching collection');
  });

  it('marks year zero chronology unavailable without inventing a date', () => {
    const normalized = normalizeArchiveCoin(makeRecord(3, { fromYear: 0, toYear: 12 }));
    expect(normalized.hasValidDate).toBe(false);
    expect(getArchiveFieldValue(normalized, 'dateRange')).toBe('');
  });

  it('uses the computed chronology state instead of displaying a partial invalid date', () => {
    const normalized = normalizeArchiveCoin(makeRecord(4, {
      fromYear: -120,
      toYear: null,
      dateRange: '120 BCE',
    }));
    expect(normalized.hasValidDate).toBe(false);
    expect(getArchiveFieldValue(normalized, 'dateRange')).toBe('');
  });

  it('derives image coverage, provenance, and rights fields', () => {
    const record = makeRecord(2);
    expect(getArchiveFieldValue(record, 'imageCoverage')).toBe('Obverse and reverse images');
    expect(getArchiveFieldValue(record, 'provenance')).toBe('https://types.example/2');
    expect(getArchiveFieldValue(record, 'rightsHolder')).toBe('Teaching collection');
  });

  it('reports counts and an applicable denominator', () => {
    const matrix = buildCompletenessMatrix([
      makeRecord(1, { language: 'Greek' }),
      makeRecord(2, { language: '' }),
      makeRecord(3, { language: 'n/a' }),
      makeRecord(4, { language: 'uncertain' }),
    ]);
    const language = matrix.find((row) => row.key === 'language');
    expect(language.counts).toEqual({ Recorded: 1, Uncertain: 1, Missing: 1, 'Not applicable': 1 });
    expect(language.total).toBe(4);
    expect(language.denominator).toBe(3);
    expect(language.percent).toBe(33);
  });

  it('includes visual and source fields in the completeness matrix', () => {
    const keys = buildCompletenessMatrix([makeRecord(1)]).map((row) => row.key);
    expect(keys).toEqual(expect.arrayContaining(['imageCoverage', 'provenance', 'rightsHolder']));
  });

  it('calculates per-record completeness over all declared fields', () => {
    const result = getArchiveRecordCompleteness(makeRecord(1, { language: '', denomination: 'n/a' }));
    expect(result.total).toBe(ARCHIVE_FIELDS.length);
    expect(result.denominator).toBe(ARCHIVE_FIELDS.length - 1);
    expect(result.counts.Missing).toBe(1);
  });
});

describe('inquiry-specific usability intersections', () => {
  it('requires authority, governing power, and date for authority research', () => {
    const complete = getArchiveInquiryUsability(makeRecord(1), 'authority-research');
    const missingPower = getArchiveInquiryUsability(makeRecord(2, { power: '' }), 'authority-research');
    expect(complete).toMatchObject({ usable: true, recorded: 3, required: 3 });
    expect(missingPower).toMatchObject({ usable: false, recorded: 2, required: 3 });
    expect(missingPower.unavailableFields[0].key).toBe('power');
  });

  it('uses the language-and-denomination intersection without requiring contextual authority', () => {
    const usable = getArchiveInquiryUsability(makeRecord(1, { authority: '' }), 'language-denomination');
    const uncertain = getArchiveInquiryUsability(makeRecord(2, { language: 'probably Greek' }), 'language-denomination');
    expect(usable).toMatchObject({ usable: true, recorded: 2, required: 2 });
    expect(uncertain).toMatchObject({ usable: false, recorded: 1, required: 2 });
  });

  it('requires all five sourced-visual fields and summarizes the sample intersection', () => {
    const complete = makeRecord(1);
    const missingRights = makeRecord(2, { rightsHolder: '' });
    const result = getArchiveInquiryUsability(missingRights, 'publication-evidence');
    const summary = summarizeArchiveInquiryUsability([complete, missingRights], 'publication-evidence');
    expect(result).toMatchObject({ usable: false, recorded: 4, required: 5 });
    expect(summary).toMatchObject({ usableCount: 1, notUsableCount: 1, total: 2, percent: 50 });
    expect(summary.requiredFields.map((field) => field.key)).toEqual([
      'imageCoverage', 'dateRange', 'reference', 'provenance', 'rightsHolder',
    ]);
  });
});

describe('reproducible sampling', () => {
  it('returns the requested 24-record sample and transparent metadata', () => {
    const sample = buildArchiveSample(records, 'authority-research');
    expect(sample.records).toHaveLength(ARCHIVE_SAMPLE_SIZE);
    expect(sample.metadata.populationSize).toBe(40);
    expect(sample.metadata.filterRule).toMatch(/remain eligible/i);
    expect(sample.metadata.orderingRule).toMatch(/hash/i);
  });

  it('is deterministic for the same seed and inquiry', () => {
    const first = buildArchiveSample(records, 'authority-research', { seed: 'same' });
    const second = buildArchiveSample([...records].reverse(), 'authority-research', { seed: 'same' });
    expect(first.records.map((record) => record.id)).toEqual(second.records.map((record) => record.id));
  });

  it('changes deterministically when the seed changes', () => {
    const first = buildArchiveSample(records, 'authority-research', { seed: 'alpha' });
    const second = buildArchiveSample(records, 'authority-research', { seed: 'beta' });
    expect(first.records.map((record) => record.id)).not.toEqual(second.records.map((record) => record.id));
  });

  it('keeps incomplete records in the sampling frame', () => {
    const small = [makeRecord(1), makeRecord(2, { material: '', mint: '', reference: '' })];
    expect(buildArchiveSample(small, 'language-denomination').records.map((record) => record.id).sort()).toEqual([1, 2]);
  });

  it('deduplicates records by stable catalog ID', () => {
    const sample = buildArchiveSample([makeRecord(1), makeRecord(1), makeRecord(2)], 'publication-evidence');
    expect(sample.records).toHaveLength(2);
  });

  it('honors frozen sample IDs in exact order and fills missing IDs', () => {
    const sample = buildArchiveSample(records, 'authority-research', {
      seed: 'stored',
      sampleIds: ['7', '2', '999'],
      sampledAt: '2026-08-14T12:00:00.000Z',
    });
    expect(sample.records.slice(0, 2).map((record) => String(record.id))).toEqual(['7', '2']);
    expect(sample.records).toHaveLength(24);
    expect(sample.metadata.sampleIds).toEqual(sample.records.map((record) => String(record.id)));
    expect(sample.metadata.sampledAt).toBe('2026-08-14T12:00:00.000Z');
  });

  it('does not let catalog growth replace frozen records', () => {
    const initial = buildArchiveSample(records, 'authority-research', { seed: 'growth' });
    const grown = buildArchiveSample([...records, makeRecord(50)], 'authority-research', {
      seed: 'growth',
      sampleIds: initial.metadata.sampleIds,
    });
    expect(grown.records.map((record) => String(record.id))).toEqual(initial.metadata.sampleIds);
  });

  it('selects six deep-audit records reproducibly', () => {
    const sample = buildArchiveSample(records, 'authority-research', { seed: 'audit' });
    const first = selectDeepAuditRecords(sample.records, 'authority-research', { seed: 'audit' });
    const second = selectDeepAuditRecords(sample.records, 'authority-research', { seed: 'audit' });
    expect(first).toHaveLength(ARCHIVE_AUDIT_SIZE);
    expect(first.map((record) => record.id)).toEqual(second.map((record) => record.id));
  });

  it('honors stored audit IDs and fills to six', () => {
    const sample = buildArchiveSample(records, 'authority-research', { seed: 'stored-audit' });
    const stored = [sample.records[5], sample.records[2]];
    const audit = selectDeepAuditRecords(sample.records, 'authority-research', {
      seed: 'stored-audit',
      auditIds: stored.map((record) => String(record.id)),
    });
    expect(audit.slice(0, 2).map((record) => String(record.id))).toEqual(stored.map((record) => String(record.id)));
    expect(audit).toHaveLength(6);
  });

  it('prioritizes the least complete record when no audit is frozen', () => {
    const sample = records.slice(0, 24).map((record, index) => (
      index === 9 ? { ...record, material: '', mint: '', language: '', reference: '' } : record
    ));
    const audit = selectDeepAuditRecords(sample, 'language-denomination');
    expect(audit.some((record) => record.id === 10)).toBe(true);
  });
});

describe('safe draft persistence', () => {
  it('restores valid student work and removes unavailable IDs', () => {
    const restored = restoreArchiveDraft(JSON.stringify({
      inquiryId: 'language-denomination',
      sampledAt: '2026-08-14T12:00:00.000Z',
      sampleIds: [1, 2, 999],
      auditIds: [1, 999],
      provisionalClaim: 'A claim',
      evidence: {
        1: { classification: 'Supports', note: 'Visible pattern' },
        999: { classification: 'Counters', note: 'Removed' },
      },
      memo: { citationIds: [1, 2, 999, 2], limitation: 'A limitation' },
    }), records.slice(0, 3));
    expect(restored.inquiryId).toBe('language-denomination');
    expect(restored.sampleIds).toEqual(['1', '2']);
    expect(restored.auditIds).toEqual(['1']);
    expect(restored.evidence['1'].classification).toBe('Supports');
    expect(restored.evidence['999']).toBeUndefined();
    expect(restored.memo.citationIds).toEqual(['1']);
  });

  it('migrates stale drafts and reconciles citations to the resolved audit set', () => {
    const restored = restoreArchiveDraft({
      version: 1,
      sampleIds: [1, 2, 3, 4],
      auditIds: [1, 2, 999],
      memo: { citationIds: [1, 3, 999] },
    }, records.slice(0, 4));
    expect(restored.version).toBe(ARCHIVE_DRAFT_VERSION);
    expect(restored.auditIds).toEqual(['1', '2']);
    expect(restored.memo.citationIds).toEqual(['1']);
    expect(reconcileArchiveCitationIds(['1', '2', '999'], [makeRecord(2), makeRecord(4)])).toEqual(['2']);
  });

  it('does not erase saved IDs before the catalog loads', () => {
    const restored = sanitizeArchiveDraft({ sampleIds: [1, 2], auditIds: [1] }, []);
    expect(restored.sampleIds).toEqual(['1', '2']);
    expect(restored.auditIds).toEqual(['1']);
  });

  it('rejects unknown evidence classifications', () => {
    const draft = sanitizeArchiveDraft({ evidence: { 1: { classification: 'Proves', note: 'x' } } }, records);
    expect(draft.evidence['1'].classification).toBe('');
  });

  it('falls back safely when stored JSON is malformed', () => {
    const restored = restoreArchiveDraft('{bad json', records);
    expect(restored.inquiryId).toBe('authority-research');
    expect(restored.sampleIds).toEqual([]);
    expect(restored.auditIds).toEqual([]);
  });

  it('round-trips IDs, timestamp, and student prose', () => {
    const draft = createArchiveDraft('publication-evidence', 'seed-2', '2026-08-14T12:00:00.000Z');
    draft.sampleIds = records.slice(0, 24).map((record) => String(record.id));
    draft.auditIds = records.slice(0, 6).map((record) => String(record.id));
    draft.provisionalClaim = 'Working claim';
    const restored = restoreArchiveDraft(serializeArchiveDraft(draft, records), records);
    expect(restored.provisionalClaim).toBe('Working claim');
    expect(restored.sampleIds).toEqual(draft.sampleIds);
    expect(restored.auditIds).toEqual(draft.auditIds);
    expect(restored.sampledAt).toBe('2026-08-14T12:00:00.000Z');
  });
});

describe('challenges and rubric', () => {
  const sample = buildArchiveSample(records, 'authority-research');
  const audit = selectDeepAuditRecords(sample.records, 'authority-research');

  it('surfaces three distinct challenge types and records when the sample allows it', () => {
    const challenges = buildArchiveChallenges(sample.records, audit, createArchiveDraft(), 'authority-research');
    expect(challenges.map((challenge) => challenge.id)).toEqual(['counterexample', 'incomplete', 'outside-pattern']);
    expect(challenges.every((challenge) => challenge.record)).toBe(true);
    expect(new Set(challenges.map((challenge) => challenge.record.id)).size).toBe(3);
  });

  it('uses a student-classified counter as the counterexample', () => {
    const draft = createArchiveDraft();
    draft.evidence[String(audit[3].id)] = { classification: 'Counters', note: 'Exception' };
    expect(buildArchiveChallenges(sample.records, audit, draft)[0].record.id).toBe(audit[3].id);
  });

  it('emits an explicit no-comparison challenge when the focus field is entirely missing', () => {
    const allMissing = records.slice(0, 8).map((record) => ({ ...record, power: '' }));
    const missingAudit = allMissing.slice(0, ARCHIVE_AUDIT_SIZE);
    const outside = buildArchiveChallenges(allMissing, missingAudit, createArchiveDraft(), 'authority-research')
      .find((challenge) => challenge.id === 'outside-pattern');
    expect(outside.record).toBeNull();
    expect(outside.prompt).toMatch(/no recorded governing power values.*comparison cannot be made/i);
  });

  it('returns six transparent 0-2 dimensions totaling twelve points', () => {
    const rubric = calculateArchiveRubric(createArchiveDraft(), audit, sample.records);
    expect(rubric.total).toBe(12);
    expect(rubric.criteria).toHaveLength(6);
    expect(rubric.criteria.every((item) => [0, 1, 2].includes(item.score))).toBe(true);
    expect(rubric.criteria.some((item) => /correct|accuracy/i.test(item.label))).toBe(false);
  });

  it('awards all structural points for a complete revision-ready memo', () => {
    const draft = createArchiveDraft();
    draft.provisionalClaim = 'The preliminary sample suggests a relationship between authority and cataloged coin evidence.';
    audit.forEach((record, index) => {
      draft.evidence[String(record.id)] = {
        classification: index === 0 ? 'Supports' : index === 1 ? 'Counters' : 'Complicates',
        note: `This evidence note identifies a specific catalog field for audited record ${index + 1}.`,
      };
    });
    draft.memo = {
      question: 'Which sampled records are usable for research on political authority?',
      method: 'I used the reproducible 24-record sample, recorded its seed, then completed a six-record deep audit without excluding incomplete records.',
      finding: 'Across the audited records, recorded authority fields support a limited pattern while catalog gaps constrain direct comparison.',
      citationIds: audit.slice(0, 3).map((record) => String(record.id)),
      counterexample: 'One audited record counters the broad pattern because its recorded governing power differs from the dominant group.',
      limitation: 'The sample represents this catalog and cannot estimate ancient production or survival.',
      additionalSource: 'A dated inscription or excavation context would independently test the catalog attribution.',
      revisedClaim: 'Within this deterministic catalog sample, recorded authority fields suggest a limited pattern, but incomplete records and the counterexample require a narrower conclusion.',
    };
    expect(calculateArchiveRubric(draft, audit, sample.records).score).toBe(12);
  });

  it('does not award revision credit for punctuation and case changes alone', () => {
    const draft = createArchiveDraft();
    draft.provisionalClaim = 'Authority changed in this sample.';
    draft.memo.revisedClaim = 'AUTHORITY CHANGED IN THIS SAMPLE!!!';
    const criterion = calculateArchiveRubric(draft, audit, sample.records).criteria.find((item) => item.id === 'revision');
    expect(criterion.score).toBe(0);
  });
});

describe('PDF document adapter', () => {
  it('exports the sample, matrix, images, rubric, links, sources, and rights', () => {
    const sample = buildArchiveSample(records, 'authority-research', {
      seed: 'pdf',
      sampledAt: '2026-08-14T12:00:00.000Z',
    });
    const audit = selectDeepAuditRecords(sample.records, 'authority-research');
    const draft = createArchiveDraft('authority-research', 'pdf', '2026-08-14T12:00:00.000Z');
    draft.sampleIds = sample.records.map((record) => String(record.id));
    draft.auditIds = audit.map((record) => String(record.id));
    draft.memo.citationIds = audit.slice(0, 3).map((record) => String(record.id));
    const rubric = calculateArchiveRubric(draft, audit, sample.records);
    const document = buildArchivePdfDocument({
      draft,
      inquiry: getArchiveInquiry(draft.inquiryId),
      sample,
      auditRecords: audit,
      challenges: buildArchiveChallenges(sample.records, audit, draft),
      rubric,
      siteOrigin: 'https://syrios.example',
      generatedAt: '2026-08-14T13:00:00.000Z',
    });

    expect(document.fileName).toMatch(/archive-lab/);
    expect(document.generatedAt).toBe('2026-08-14T13:00:00.000Z');
    const matrix = document.sections.find((section) => section.title === 'Completeness matrix').blocks[0];
    expect(matrix.columns[0]).toEqual({ key: 'field', label: 'Catalog field', width: 0.3 });
    expect(matrix.rows).toHaveLength(ARCHIVE_FIELDS.length);
    const usability = document.sections.find((section) => section.title === 'Inquiry usability intersection');
    expect(usability.blocks[0].rows).toHaveLength(ARCHIVE_SAMPLE_SIZE);
    expect(document.metadata.find((item) => item.label === 'Inquiry-usable records').value).toMatch(/\/24/);
    const auditSection = document.sections.find((section) => section.title.startsWith('Deep audit 1:'));
    expect(auditSection.blocks.some((block) => block.type === 'imageRow')).toBe(true);
    expect(auditSection.blocks.find((block) => block.type === 'keyValue').items).toEqual(expect.arrayContaining([
      { label: 'Catalog record', value: expect.stringMatching(/^https:\/\/syrios\.example\/Coin\//) },
      { label: 'Rights holder', value: 'Teaching collection' },
    ]));
    const rubricSection = document.sections.find((section) => section.title === 'Structural review');
    expect(rubricSection.blocks[0].items).toHaveLength(6);
    const citations = document.sections.find((section) => section.title === 'Three exact catalog citations').blocks[0].items;
    expect(citations).toHaveLength(3);
    expect(citations[0].note).toMatch(/Image source: https:\/\/images\.example/);
    const reproducibility = document.sections[0].blocks.find((block) => block.type === 'keyValue');
    expect(reproducibility.items.find((item) => item.label === 'Sample record IDs').value).toContain(',');
    expect(document.footerNote).toMatch(/does not estimate ancient production/i);
  });
});
