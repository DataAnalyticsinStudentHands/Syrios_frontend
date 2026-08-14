import { normalizeDetectiveCoin } from '../CoinDetective/coinDetectiveData';

export const ARCHIVE_SAMPLE_SIZE = 24;
export const ARCHIVE_AUDIT_SIZE = 6;
export const ARCHIVE_DRAFT_VERSION = 2;
export const ARCHIVE_DRAFT_STORAGE_KEY = 'syrios:archive-lab:draft:v1';
export const DEFAULT_ARCHIVE_SEED = 'syrios-archive-lab-v1';

const freezeInquiry = (inquiry) => Object.freeze({
  ...inquiry,
  focusFields: Object.freeze([...inquiry.focusFields]),
  requiredFields: Object.freeze([...inquiry.requiredFields]),
});

export const ARCHIVE_INQUIRIES = Object.freeze({
  'authority-research': freezeInquiry({
    id: 'authority-research',
    eyebrow: 'Research usability',
    label: 'Which records support authority research?',
    question: 'Which sampled records are usable for research on political authority, and what makes the others less usable?',
    method: 'Audit issuing authority, governing power, and date coverage without removing incomplete records from the sample.',
    focusFields: ['authority', 'power', 'dateRange'],
    requiredFields: ['authority', 'power', 'dateRange'],
    challengeField: 'power',
  }),
  'language-denomination': freezeInquiry({
    id: 'language-denomination',
    eyebrow: 'Raising the threshold',
    label: 'What changes when two fields are required?',
    question: 'What changes when research requires both language and denomination to be recorded?',
    method: 'Compare the whole sample with the subset usable for language-and-denomination research; missing fields remain visible and in the denominator.',
    focusFields: ['language', 'denomination', 'authority'],
    requiredFields: ['language', 'denomination'],
    challengeField: 'language',
  }),
  'publication-evidence': freezeInquiry({
    id: 'publication-evidence',
    eyebrow: 'Publication evidence',
    label: 'Which records support a sourced visual study?',
    question: 'What changes when research requires images, dates, citations, and source attribution?',
    method: 'Audit image coverage, valid dates, catalog references, provenance, and rights information while retaining records that fail the threshold.',
    focusFields: ['imageCoverage', 'dateRange', 'reference', 'provenance', 'rightsHolder'],
    requiredFields: ['imageCoverage', 'dateRange', 'reference', 'provenance', 'rightsHolder'],
    challengeField: 'imageCoverage',
  }),
});

export const ARCHIVE_VALUE_STATUSES = Object.freeze([
  'Recorded',
  'Uncertain',
  'Missing',
  'Not applicable',
]);

export const ARCHIVE_EVIDENCE_CLASSES = Object.freeze([
  'Supports',
  'Complicates',
  'Counters',
  'Not relevant',
]);

export const ARCHIVE_FIELDS = Object.freeze([
  { key: 'dateRange', label: 'Cataloged date' },
  { key: 'material', label: 'Material' },
  { key: 'authority', label: 'Issuing authority' },
  { key: 'power', label: 'Governing power' },
  { key: 'mint', label: 'Mint' },
  { key: 'territory', label: 'Ancient territory' },
  { key: 'denomination', label: 'Denomination' },
  { key: 'language', label: 'Language' },
  { key: 'obverseType', label: 'Obverse description' },
  { key: 'reverseType', label: 'Reverse description' },
  { key: 'reference', label: 'Catalog reference' },
  { key: 'imageCoverage', label: 'Image coverage' },
  { key: 'provenance', label: 'Source / provenance' },
  { key: 'rightsHolder', label: 'Rights holder' },
]);

const DEFAULT_INQUIRY_ID = 'authority-research';
const MISSING_VALUES = new Set(['', 'unknown', 'not recorded', 'date not recorded', 'missing', 'no data', 'undetermined']);
const NOT_APPLICABLE_VALUES = new Set(['n/a', 'na', 'not applicable']);

const cleanText = (value) => (value == null ? '' : String(value).replace(/\s+/g, ' ').trim());
const identity = (recordOrId) => String(recordOrId?.id ?? recordOrId ?? '');

export const getArchiveInquiry = (inquiryId) => (
  ARCHIVE_INQUIRIES[inquiryId] || ARCHIVE_INQUIRIES[DEFAULT_INQUIRY_ID]
);

export const reconcileArchiveCitationIds = (citationIds = [], auditRecordsOrIds = []) => {
  const auditIds = new Set(auditRecordsOrIds.map(identity).filter(Boolean));
  return [...new Set(citationIds.map(identity).filter(Boolean))]
    .filter((id) => auditIds.has(id))
    .slice(0, 3);
};

export const classifyArchiveValue = (value, fieldKey = '') => {
  const cleaned = cleanText(value);
  const normalized = cleaned.toLowerCase();
  if (NOT_APPLICABLE_VALUES.has(normalized)) return 'Not applicable';
  if ((normalized === 'none' || normalized === 'no legend') && /legend/i.test(fieldKey)) return 'Not applicable';
  if (normalized === 'none' || normalized === 'no legend') return 'Missing';
  if (MISSING_VALUES.has(normalized)) return 'Missing';
  if (/uncertain|probably|possibly/i.test(normalized) || normalized.endsWith('?') || /(^|\s)\?(\s|$)/.test(normalized)) {
    return 'Uncertain';
  }
  return 'Recorded';
};

export const displayArchiveValue = (value, fieldKey = '') => {
  const status = classifyArchiveValue(value, fieldKey);
  if (status === 'Missing') return 'Not recorded';
  if (status === 'Not applicable') return 'Not applicable';
  return cleanText(value);
};

const getRawAttributes = (row) => row?.attributes || row || {};

export const normalizeArchiveCoin = (row) => {
  if (!row) return null;
  const looksNormalized = row.id != null && Object.prototype.hasOwnProperty.call(row, 'coinId');
  const base = looksNormalized ? row : normalizeDetectiveCoin(row);
  if (!base) return null;
  const attributes = getRawAttributes(row);
  const stableTypeUri = cleanText(
    base.stableTypeUri
    || attributes.stable_type_uri
    || attributes.stableTypeUri
    || attributes.stable_id
    || attributes.stableId,
  );
  const reference = cleanText(base.reference || attributes.reference || attributes.ref1);
  const sourceImage = cleanText(
    base.sourceImage
    || attributes.source_image
    || attributes.souce_image,
  );
  const rightsHolder = cleanText(base.rightsHolder || base.rightHolder || attributes.right_holder || attributes.rightsHolder);
  const hasValidDate = Number.isFinite(base.fromYear)
    && Number.isFinite(base.toYear)
    && base.fromYear !== 0
    && base.toYear !== 0
    && base.fromYear <= base.toYear;

  return {
    ...base,
    reference,
    sourceImage,
    rightsHolder,
    stableTypeUri,
    catalogPath: `/Coin/${base.id}`,
    hasValidDate,
    exactCitation: reference
      ? `${base.coinId || `Record ${base.id}`} — ${reference}`
      : `${base.coinId || 'Catalog coin'} — SYRIOS catalog record ${base.id}`,
  };
};

export const normalizeArchiveCoins = (rows = []) => rows
  .map(normalizeArchiveCoin)
  .filter(Boolean)
  .sort((a, b) => identity(a).localeCompare(identity(b), undefined, { numeric: true }));

export const getArchiveFieldValue = (record, fieldKey) => {
  if (!record) return '';
  if (fieldKey === 'dateRange') return record.hasValidDate ? record.dateRange : '';
  if (fieldKey === 'imageCoverage') {
    if (record.obverseImage && record.reverseImage) return 'Obverse and reverse images';
    if (record.obverseImage) return 'Obverse image only';
    if (record.reverseImage) return 'Reverse image only';
    return '';
  }
  if (fieldKey === 'provenance') return record.stableTypeUri || record.sourceImage || record.reference || '';
  return record[fieldKey] ?? '';
};

export const getArchiveRecordCompleteness = (record, fields = ARCHIVE_FIELDS) => {
  const counts = Object.fromEntries(ARCHIVE_VALUE_STATUSES.map((status) => [status, 0]));
  fields.forEach(({ key }) => {
    counts[classifyArchiveValue(getArchiveFieldValue(record, key), key)] += 1;
  });
  const denominator = fields.length - counts['Not applicable'];
  return {
    counts,
    denominator,
    total: fields.length,
    recorded: counts.Recorded,
    percent: denominator ? Math.round((counts.Recorded / denominator) * 100) : 0,
  };
};

export const buildCompletenessMatrix = (records = [], fields = ARCHIVE_FIELDS) => fields.map((field) => {
  const counts = Object.fromEntries(ARCHIVE_VALUE_STATUSES.map((status) => [status, 0]));
  records.forEach((record) => {
    counts[classifyArchiveValue(getArchiveFieldValue(record, field.key), field.key)] += 1;
  });
  const denominator = records.length - counts['Not applicable'];
  return {
    ...field,
    counts,
    total: records.length,
    denominator,
    percent: denominator ? Math.round((counts.Recorded / denominator) * 100) : 0,
  };
});

export const getArchiveInquiryUsability = (record, inquiryId = DEFAULT_INQUIRY_ID) => {
  const inquiry = getArchiveInquiry(inquiryId);
  const fields = inquiry.requiredFields.map((key) => {
    const status = classifyArchiveValue(getArchiveFieldValue(record, key), key);
    return {
      key,
      label: ARCHIVE_FIELDS.find((field) => field.key === key)?.label || key,
      status,
      usable: status === 'Recorded',
    };
  });
  const recorded = fields.filter((field) => field.usable).length;
  return {
    inquiryId: inquiry.id,
    usable: recorded === fields.length,
    recorded,
    required: fields.length,
    fields,
    unavailableFields: fields.filter((field) => !field.usable),
  };
};

export const summarizeArchiveInquiryUsability = (records = [], inquiryId = DEFAULT_INQUIRY_ID) => {
  const inquiry = getArchiveInquiry(inquiryId);
  const results = records.map((record) => ({
    record,
    ...getArchiveInquiryUsability(record, inquiry.id),
  }));
  const usableCount = results.filter((result) => result.usable).length;
  return {
    inquiryId: inquiry.id,
    requiredFields: inquiry.requiredFields.map((key) => ({
      key,
      label: ARCHIVE_FIELDS.find((field) => field.key === key)?.label || key,
    })),
    usableCount,
    notUsableCount: results.length - usableCount,
    total: results.length,
    percent: results.length ? Math.round((usableCount / results.length) * 100) : 0,
    results,
  };
};

const stableHash = (value) => {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const deterministicOrder = (records, seed) => [...records].sort((a, b) => (
  stableHash(`${seed}|${identity(a)}`) - stableHash(`${seed}|${identity(b)}`)
  || identity(a).localeCompare(identity(b), undefined, { numeric: true })
));

export const buildArchiveSample = (
  records = [],
  inquiryId = DEFAULT_INQUIRY_ID,
  options = {},
) => {
  const inquiry = getArchiveInquiry(inquiryId);
  const seed = cleanText(options.seed) || DEFAULT_ARCHIVE_SEED;
  const requestedSize = Number.isInteger(options.sampleSize) && options.sampleSize > 0
    ? options.sampleSize
    : ARCHIVE_SAMPLE_SIZE;
  const uniqueRecords = [...new Map(records.filter(Boolean).map((record) => [identity(record), record])).values()];
  const lookup = new Map(uniqueRecords.map((record) => [identity(record), record]));
  const stored = [...new Set((Array.isArray(options.sampleIds) ? options.sampleIds : []).map(identity))]
    .map((id) => lookup.get(id))
    .filter(Boolean)
    .slice(0, requestedSize);
  const storedIds = new Set(stored.map(identity));
  const fill = deterministicOrder(
    uniqueRecords.filter((record) => !storedIds.has(identity(record))),
    `${seed}|${inquiry.id}`,
  );
  const sample = [...stored, ...fill].slice(0, requestedSize);

  return {
    records: sample,
    metadata: {
      inquiryId: inquiry.id,
      seed,
      populationSize: uniqueRecords.length,
      requestedSize,
      sampleSize: sample.length,
      sampleIds: sample.map(identity),
      sampledAt: cleanText(options.sampledAt),
      filterLabel: 'Entire fetched catalog; no completeness exclusions',
      filterRule: 'Records remain eligible when focus fields, images, or citations are incomplete.',
      orderingRule: 'Saved record IDs stay frozen in order; missing IDs are filled by a stable FNV-1a hash of seed, inquiry, and catalog record ID.',
    },
  };
};

const focusSignature = (record, inquiry) => inquiry.focusFields
  .map((field) => displayArchiveValue(getArchiveFieldValue(record, field), field))
  .join('|');

export const selectDeepAuditRecords = (
  sampleRecords = [],
  inquiryId = DEFAULT_INQUIRY_ID,
  options = {},
) => {
  const inquiry = getArchiveInquiry(inquiryId);
  const seed = cleanText(options.seed) || DEFAULT_ARCHIVE_SEED;
  const auditSize = Number.isInteger(options.auditSize) && options.auditSize > 0
    ? options.auditSize
    : ARCHIVE_AUDIT_SIZE;
  const ranked = deterministicOrder(sampleRecords, `${seed}|${inquiry.id}|audit`);
  const sampleLookup = new Map(sampleRecords.map((record) => [identity(record), record]));
  const selected = [...new Set((Array.isArray(options.auditIds) ? options.auditIds : []).map(identity))]
    .map((id) => sampleLookup.get(id))
    .filter(Boolean)
    .slice(0, auditSize);
  const seenSignatures = new Set();
  const incomplete = [...ranked].sort((a, b) => (
    getArchiveRecordCompleteness(a).percent - getArchiveRecordCompleteness(b).percent
    || ranked.indexOf(a) - ranked.indexOf(b)
  ))[0];

  selected.forEach((record) => seenSignatures.add(focusSignature(record, inquiry)));
  if (
    incomplete
    && selected.length < auditSize
    && !selected.some((record) => identity(record) === identity(incomplete))
  ) {
    selected.push(incomplete);
    seenSignatures.add(focusSignature(incomplete, inquiry));
  }

  ranked.forEach((record) => {
    if (selected.length >= auditSize || selected.some((item) => identity(item) === identity(record))) return;
    const signature = focusSignature(record, inquiry);
    if (!seenSignatures.has(signature)) {
      selected.push(record);
      seenSignatures.add(signature);
    }
  });

  ranked.forEach((record) => {
    if (selected.length < auditSize && !selected.some((item) => identity(item) === identity(record))) {
      selected.push(record);
    }
  });

  return selected.slice(0, auditSize);
};

const blankEvidence = () => ({ classification: '', note: '' });

export const createArchiveDraft = (
  inquiryId = DEFAULT_INQUIRY_ID,
  seed = DEFAULT_ARCHIVE_SEED,
  sampledAt = new Date().toISOString(),
) => ({
  version: ARCHIVE_DRAFT_VERSION,
  inquiryId: getArchiveInquiry(inquiryId).id,
  seed: cleanText(seed) || DEFAULT_ARCHIVE_SEED,
  sampledAt: cleanText(sampledAt) || new Date().toISOString(),
  sampleIds: [],
  auditIds: [],
  provisionalClaim: '',
  evidence: {},
  memo: {
    question: '',
    method: '',
    finding: '',
    citationIds: [],
    counterexample: '',
    limitation: '',
    additionalSource: '',
    revisedClaim: '',
  },
});

const safeText = (value, limit = 6000) => (typeof value === 'string' ? value.slice(0, limit) : '');

export const sanitizeArchiveDraft = (input, availableRecords = []) => {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const base = createArchiveDraft(source.inquiryId, source.seed, source.sampledAt);
  const allowed = new Set(availableRecords.map(identity));
  const restrict = availableRecords.length > 0;
  const sourceEvidence = source.evidence && typeof source.evidence === 'object' && !Array.isArray(source.evidence)
    ? source.evidence
    : {};
  const evidence = {};
  const sampleIds = [...new Set(
    (Array.isArray(source.sampleIds) ? source.sampleIds : [])
      .map(identity)
      .filter(Boolean)
      .filter((id) => !restrict || allowed.has(id)),
  )].slice(0, ARCHIVE_SAMPLE_SIZE);
  const sampleSet = new Set(sampleIds);
  const auditIds = [...new Set(
    (Array.isArray(source.auditIds) ? source.auditIds : [])
      .map(identity)
      .filter(Boolean)
      .filter((id) => (!restrict || allowed.has(id)) && (!sampleIds.length || sampleSet.has(id))),
  )].slice(0, ARCHIVE_AUDIT_SIZE);

  Object.entries(sourceEvidence).forEach(([id, entry]) => {
    if (!id || (restrict && !allowed.has(String(id))) || !entry || typeof entry !== 'object') return;
    const classification = ARCHIVE_EVIDENCE_CLASSES.includes(entry.classification)
      ? entry.classification
      : '';
    evidence[String(id)] = { classification, note: safeText(entry.note) };
  });

  const memoSource = source.memo && typeof source.memo === 'object' && !Array.isArray(source.memo)
    ? source.memo
    : {};
  const normalizedCitationIds = [...new Set(
    (Array.isArray(memoSource.citationIds) ? memoSource.citationIds : [])
      .map(identity)
      .filter(Boolean)
      .filter((id) => !restrict || allowed.has(id)),
  )].slice(0, 3);
  // Version 1 drafts allowed any sample record to remain selected as a citation.
  // Once stored audit IDs exist, migration narrows citations to that visible set;
  // the UI performs the same reconciliation after replacement audit IDs resolve.
  const citationIds = auditIds.length
    ? reconcileArchiveCitationIds(normalizedCitationIds, auditIds)
    : normalizedCitationIds;

  return {
    ...base,
    sampleIds,
    auditIds,
    provisionalClaim: safeText(source.provisionalClaim),
    evidence,
    memo: {
      question: safeText(memoSource.question),
      method: safeText(memoSource.method),
      finding: safeText(memoSource.finding),
      citationIds,
      counterexample: safeText(memoSource.counterexample),
      limitation: safeText(memoSource.limitation),
      additionalSource: safeText(memoSource.additionalSource),
      revisedClaim: safeText(memoSource.revisedClaim),
    },
  };
};

export const serializeArchiveDraft = (draft, availableRecords = []) => JSON.stringify(
  sanitizeArchiveDraft(draft, availableRecords),
);

export const restoreArchiveDraft = (serialized, availableRecords = []) => {
  try {
    const parsed = typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
    return sanitizeArchiveDraft(parsed, availableRecords);
  } catch {
    return createArchiveDraft();
  }
};

const classificationFor = (draft, record) => draft?.evidence?.[identity(record)]?.classification || '';

const dominantFocusValue = (records, field) => {
  const counts = new Map();
  records.forEach((record) => {
    const value = getArchiveFieldValue(record, field);
    if (classifyArchiveValue(value, field) === 'Recorded') counts.set(value, (counts.get(value) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0]?.[0] || '';
};

export const buildArchiveChallenges = (
  sampleRecords = [],
  auditRecords = [],
  draft = createArchiveDraft(),
  inquiryId = draft.inquiryId,
) => {
  const inquiry = getArchiveInquiry(inquiryId);
  const focusField = inquiry.challengeField;
  const dominant = dominantFocusValue(sampleRecords, focusField);
  const counterexample = auditRecords.find((record) => classificationFor(draft, record) === 'Counters')
    || auditRecords.find((record) => (
      classifyArchiveValue(getArchiveFieldValue(record, focusField), focusField) === 'Recorded'
      && dominant
      && getArchiveFieldValue(record, focusField) !== dominant
    ))
    || auditRecords[0];
  const used = new Set(counterexample ? [identity(counterexample)] : []);
  const rankedIncomplete = [...sampleRecords].sort((a, b) => (
    getArchiveRecordCompleteness(a).percent - getArchiveRecordCompleteness(b).percent
    || identity(a).localeCompare(identity(b), undefined, { numeric: true })
  ));
  const incomplete = rankedIncomplete.find((record) => !used.has(identity(record)))
    || rankedIncomplete[0]
    || null;
  if (incomplete) used.add(identity(incomplete));
  const valueCounts = new Map();
  sampleRecords.forEach((record) => {
    const value = getArchiveFieldValue(record, focusField);
    if (classifyArchiveValue(value, focusField) === 'Recorded') valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  });
  const rankedOutside = [...sampleRecords]
    .filter((record) => {
      const value = getArchiveFieldValue(record, focusField);
      return classifyArchiveValue(value, focusField) === 'Recorded' && value !== dominant;
    })
    .sort((a, b) => (
      (valueCounts.get(getArchiveFieldValue(a, focusField)) || 0)
      - (valueCounts.get(getArchiveFieldValue(b, focusField)) || 0)
      || identity(a).localeCompare(identity(b), undefined, { numeric: true })
    ));
  const outsidePattern = rankedOutside.find((record) => !used.has(identity(record)))
    || rankedOutside[0]
    || null;
  const focusLabel = ARCHIVE_FIELDS.find((field) => field.key === focusField)?.label.toLowerCase() || focusField;
  const outsidePrompt = !dominant
    ? `No recorded ${focusLabel} values are available in this sample, so an outside-pattern comparison cannot be made.`
    : outsidePattern
      ? `This record differs from the most common recorded ${focusLabel}. How should the pattern be qualified?`
      : `No recorded ${focusLabel} value differs from the sample's most common recorded value, so an outside-pattern comparison cannot be made.`;

  return [
    {
      id: 'counterexample',
      label: 'Counterexample check',
      prompt: 'Does this record weaken, narrow, or overturn your provisional claim?',
      record: counterexample || null,
    },
    {
      id: 'incomplete',
      label: 'Incomplete-record check',
      prompt: 'What cannot be concluded when catalog fields are absent or uncertain?',
      record: incomplete,
    },
    {
      id: 'outside-pattern',
      label: 'Outside-pattern check',
      prompt: outsidePrompt,
      record: outsidePattern,
    },
  ];
};

const textLength = (value) => (typeof value === 'string' ? value.trim().length : 0);
const canonicalClaim = (value) => cleanText(value).toLowerCase().replace(/[^a-z0-9\s]/g, '');
const rubricDimension = (id, label, score, detail) => ({
  id,
  label,
  score,
  met: score === 2,
  detail,
});

export const calculateArchiveRubric = (draftInput, auditRecords = [], sampleRecords = []) => {
  const draft = sanitizeArchiveDraft(draftInput, sampleRecords);
  const classified = auditRecords.filter((record) => ARCHIVE_EVIDENCE_CLASSES.includes(classificationFor(draft, record)));
  const annotated = auditRecords.filter((record) => textLength(draft.evidence?.[identity(record)]?.note) >= 20);
  const classifications = new Set(classified.map((record) => classificationFor(draft, record)));
  const memo = draft.memo;
  const resolvedCitationIds = reconcileArchiveCitationIds(memo.citationIds, auditRecords);
  const questionScore = textLength(memo.question) >= 35 && memo.question.includes('?')
    ? 2
    : textLength(memo.question) >= 15 ? 1 : 0;
  const methodScore = textLength(memo.method) >= 80
    && /sample|24/i.test(memo.method)
    && /seed/i.test(memo.method)
    && /audit|six|6/i.test(memo.method)
    ? 2
    : textLength(memo.method) >= 30 ? 1 : 0;
  const evidenceScore = auditRecords.length === ARCHIVE_AUDIT_SIZE
    && classified.length === ARCHIVE_AUDIT_SIZE
    && annotated.length === ARCHIVE_AUDIT_SIZE
    && resolvedCitationIds.length === 3
    && textLength(draft.provisionalClaim) >= 20
    && textLength(memo.finding) >= 50
    ? 2
    : classified.length >= 3
      && annotated.length >= 3
      && resolvedCitationIds.length >= 1
      && textLength(draft.provisionalClaim) >= 10
      && textLength(memo.finding) >= 25
      ? 1
      : 0;
  const hasTension = classifications.has('Complicates') || classifications.has('Counters');
  const counterScore = classifications.has('Supports')
    && hasTension
    && textLength(memo.counterexample) >= 50
    ? 2
    : hasTension || textLength(memo.counterexample) >= 20 ? 1 : 0;
  const limitsScore = textLength(memo.limitation) >= 40 && textLength(memo.additionalSource) >= 40
    ? 2
    : textLength(memo.limitation) >= 20 || textLength(memo.additionalSource) >= 20 ? 1 : 0;
  const claimsDiffer = Boolean(
    canonicalClaim(draft.provisionalClaim)
    && canonicalClaim(memo.revisedClaim)
    && canonicalClaim(draft.provisionalClaim) !== canonicalClaim(memo.revisedClaim)
  );
  const revisionScore = claimsDiffer
    && textLength(draft.provisionalClaim) >= 20
    && textLength(memo.revisedClaim) >= 60
    ? 2
    : claimsDiffer && textLength(draft.provisionalClaim) >= 10 && textLength(memo.revisedClaim) >= 25 ? 1 : 0;
  const criteria = [
    rubricDimension('question', 'Question', questionScore, 'States a focused historical question.'),
    rubricDimension('method', 'Method and reproducibility', methodScore, 'Records the sample, seed, and six-record audit method.'),
    rubricDimension('evidence', 'Evidence and three citations', evidenceScore, 'Classifies and annotates six records, then cites three.'),
    rubricDimension('counterevidence', 'Counterevidence', counterScore, 'Uses both support and tension to qualify the finding.'),
    rubricDimension('limitations', 'Limitation and next source', limitsScore, 'Names a catalog limitation and an independent source to consult.'),
    rubricDimension('revision', 'Substantive revision', revisionScore, 'Revises the provisional claim in substance, not punctuation alone.'),
  ];
  return {
    score: criteria.reduce((sum, criterion) => sum + criterion.score, 0),
    total: 12,
    criteria,
  };
};

const valueOr = (value, fallback = 'Not recorded') => cleanText(value) || fallback;
const isWebUrl = (value) => /^https?:\/\//i.test(cleanText(value));
const absoluteCatalogUrl = (catalogPath, siteOrigin = '') => {
  const path = cleanText(catalogPath);
  if (!path) return 'Not available';
  if (isWebUrl(path)) return path;
  const origin = cleanText(siteOrigin).replace(/\/$/, '');
  return origin ? `${origin}${path.startsWith('/') ? '' : '/'}${path}` : path;
};
const generatedAtValue = (generatedAt) => {
  const date = generatedAt instanceof Date ? generatedAt : new Date(generatedAt || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const archiveRecordImages = (record) => [
  record.obverseImage && {
    url: record.obverseImage.url,
    alt: record.obverseImage.alt || `Obverse of ${record.coinId}`,
    caption: `${record.coinId} - obverse`,
    sourceUrl: isWebUrl(record.sourceImage) ? record.sourceImage : undefined,
  },
  record.reverseImage && {
    url: record.reverseImage.url,
    alt: record.reverseImage.alt || `Reverse of ${record.coinId}`,
    caption: `${record.coinId} - reverse`,
    sourceUrl: isWebUrl(record.sourceImage) ? record.sourceImage : undefined,
  },
].filter(Boolean);

const archiveAttributionItems = (record, siteOrigin) => [
  { label: 'Catalog record', value: absoluteCatalogUrl(record.catalogPath, siteOrigin) },
  { label: 'Catalog reference', value: valueOr(record.reference) },
  { label: 'Stable type record', value: valueOr(record.stableTypeUri) },
  { label: 'Image source', value: valueOr(record.sourceImage) },
  { label: 'Rights holder', value: valueOr(record.rightsHolder) },
];

/**
 * Maps the frozen Archive Lab sample and student-authored memo into the shared
 * PDF model. The adapter carries record identities, gaps, sources, and rights
 * into the download so the research process remains reproducible off-screen.
 */
export const buildArchivePdfDocument = ({
  draft,
  inquiry,
  sample,
  auditRecords,
  challenges,
  rubric,
  siteOrigin = '',
  generatedAt = new Date(),
}) => {
  const recordLookup = new Map(sample.records.map((record) => [identity(record), record]));
  const citationIds = reconcileArchiveCitationIds(draft.memo.citationIds, auditRecords);
  const citations = citationIds.map((id) => recordLookup.get(id)).filter(Boolean);
  const inquiryUsability = summarizeArchiveInquiryUsability(sample.records, inquiry.id);
  const requiredFieldsLabel = inquiryUsability.requiredFields.map((field) => field.label).join(' + ');
  const completenessRows = buildCompletenessMatrix(sample.records).map((row) => ({
    field: row.label,
    recorded: String(row.counts.Recorded),
    uncertain: String(row.counts.Uncertain),
    missing: String(row.counts.Missing),
    notApplicable: String(row.counts['Not applicable']),
    applicable: `${row.counts.Recorded}/${row.denominator}`,
  }));
  const evidenceRows = auditRecords.map((record) => {
    const usability = getArchiveInquiryUsability(record, inquiry.id);
    return {
      record: record.coinId || `Record ${record.id}`,
      classification: classificationFor(draft, record) || 'Not classified',
      usable: usability.usable ? 'Yes' : `No (${usability.recorded}/${usability.required})`,
      completeness: `${getArchiveRecordCompleteness(record).recorded}/${getArchiveRecordCompleteness(record).denominator}`,
      reference: valueOr(record.reference),
    };
  });
  const usabilityRows = inquiryUsability.results.map((result) => ({
    record: result.record.coinId || `Record ${result.record.id}`,
    usable: result.usable ? 'Usable' : 'Not usable',
    required: `${result.recorded}/${result.required}`,
    unavailable: result.unavailableFields.length
      ? result.unavailableFields.map((field) => `${field.label} (${field.status})`).join(', ')
      : 'None',
  }));
  const challengeRows = challenges.map((challenge) => ({
    challenge: challenge.label,
    record: challenge.record?.exactCitation || 'No comparison record',
    question: challenge.prompt,
  }));
  const auditSections = auditRecords.map((record, index) => {
    const images = archiveRecordImages(record);
    return {
      title: `Deep audit ${index + 1}: ${record.coinId || `Record ${record.id}`}`,
      intro: `${displayArchiveValue(getArchiveFieldValue(record, 'dateRange'), 'dateRange')} | ${displayArchiveValue(record.material, 'material')}`,
      blocks: [
        ...(images.length ? [{ type: 'imageRow', images }] : []),
        {
          type: 'keyValue',
          items: [
            { label: 'Classification', value: classificationFor(draft, record) || 'Not classified' },
            { label: 'Image coverage', value: displayArchiveValue(getArchiveFieldValue(record, 'imageCoverage'), 'imageCoverage') },
            ...archiveAttributionItems(record, siteOrigin),
          ],
        },
        {
          type: 'callout',
          title: 'Student evidence note',
          text: draft.evidence?.[identity(record)]?.note || 'No evidence note entered.',
        },
      ],
    };
  });

  return {
    fileName: `syrios-archive-lab-${inquiry.id}.pdf`,
    eyebrow: 'SYRIOS Archive Lab / HIST 2303',
    title: 'Archive audit and methods memo',
    subtitle: inquiry.label,
    generatedAt: generatedAtValue(generatedAt),
    metadata: [
      { label: 'Inquiry', value: inquiry.question },
      { label: 'Sample', value: `${sample.metadata.sampleSize} of ${sample.metadata.populationSize} fetched records` },
      { label: 'Seed', value: sample.metadata.seed },
      { label: 'Sample frozen', value: valueOr(draft.sampledAt || sample.metadata.sampledAt) },
      { label: 'Inquiry-usable records', value: `${inquiryUsability.usableCount}/${inquiryUsability.total} (${inquiryUsability.percent}%)` },
      { label: 'Structural rubric', value: `${rubric.score}/${rubric.total}` },
    ],
    sections: [
      {
        title: 'Question, method, and reproducibility record',
        blocks: [
          { type: 'callout', title: 'Inquiry question', text: draft.memo.question || 'Not yet written' },
          { type: 'callout', title: 'Method', text: draft.memo.method || 'Not yet written' },
          { type: 'callout', title: 'Provisional claim', text: draft.provisionalClaim || 'Not yet written' },
          {
            type: 'keyValue',
            items: [
              { label: 'Sample record IDs', value: sample.records.map(identity).join(', ') },
              { label: 'Deep-audit record IDs', value: auditRecords.map(identity).join(', ') },
              { label: 'Required-field intersection', value: requiredFieldsLabel },
              {
                label: 'Inquiry-usable sample IDs',
                value: inquiryUsability.results.filter((result) => result.usable).map((result) => identity(result.record)).join(', ') || 'None',
              },
            ],
          },
          {
            type: 'callout',
            title: 'Sampling record',
            text: `${sample.metadata.filterLabel}. ${sample.metadata.filterRule} ${sample.metadata.orderingRule}`,
          },
        ],
      },
      {
        title: 'Inquiry usability intersection',
        intro: `${inquiryUsability.usableCount} of ${inquiryUsability.total} sampled records have every required field recorded: ${requiredFieldsLabel}. Uncertain, missing, and not-applicable values do not meet this inquiry threshold.`,
        blocks: [{
          type: 'table',
          columns: [
            { key: 'record', label: 'Record', width: 0.2 },
            { key: 'usable', label: 'Inquiry usable', width: 0.17 },
            { key: 'required', label: 'Required fields', width: 0.16 },
            { key: 'unavailable', label: 'Unavailable requirements', width: 0.47 },
          ],
          rows: usabilityRows,
        }],
      },
      {
        title: 'Completeness matrix',
        intro: 'Counts retain missing, uncertain, and not-applicable values. The final column uses the applicable denominator.',
        blocks: [{
          type: 'table',
          columns: [
            { key: 'field', label: 'Catalog field', width: 0.3 },
            { key: 'recorded', label: 'Recorded', width: 0.14 },
            { key: 'uncertain', label: 'Uncertain', width: 0.14 },
            { key: 'missing', label: 'Missing', width: 0.12 },
            { key: 'notApplicable', label: 'N/A', width: 0.12 },
            { key: 'applicable', label: 'Recorded / applicable', width: 0.18 },
          ],
          rows: completenessRows,
        }],
      },
      {
        title: 'Deep-audit summary',
        blocks: [{
          type: 'table',
          columns: [
            { key: 'record', label: 'Record', width: 0.24 },
            { key: 'classification', label: 'Classification', width: 0.2 },
            { key: 'usable', label: 'Inquiry usable', width: 0.16 },
            { key: 'completeness', label: 'Recorded / applicable', width: 0.18 },
            { key: 'reference', label: 'Reference', width: 0.22 },
          ],
          rows: evidenceRows,
        }],
      },
      ...auditSections,
      {
        title: 'Challenge checks',
        blocks: [{
          type: 'table',
          columns: [
            { key: 'challenge', label: 'Challenge', width: 0.22 },
            { key: 'record', label: 'Record', width: 0.34 },
            { key: 'question', label: 'Question', width: 0.44 },
          ],
          rows: challengeRows,
        }],
      },
      {
        title: 'Methods memo',
        blocks: [
          { type: 'callout', title: 'Finding', text: draft.memo.finding || 'Not yet written' },
          { type: 'callout', title: 'Counterexample', text: draft.memo.counterexample || 'Not yet written' },
          { type: 'callout', title: 'Limitation', text: draft.memo.limitation || 'Not yet written' },
          { type: 'callout', title: 'Additional source', text: draft.memo.additionalSource || 'Not yet written' },
          { type: 'callout', title: 'Revised claim', text: draft.memo.revisedClaim || 'Not yet written' },
        ],
      },
      {
        title: 'Structural review',
        intro: 'The rubric measures research structure, not whether an interpretation matches a preferred conclusion.',
        blocks: [{
          type: 'checklist',
          items: rubric.criteria.map((criterion) => ({
            label: criterion.label,
            checked: criterion.score === 2,
            note: `${criterion.score}/2 - ${criterion.detail}`,
          })),
        }],
      },
      {
        title: 'Three exact catalog citations',
        blocks: [{
          type: 'checklist',
          items: citations.map((record) => ({
            label: record.exactCitation,
            checked: true,
            note: [
              absoluteCatalogUrl(record.catalogPath, siteOrigin),
              `Reference: ${valueOr(record.reference)}`,
              `Stable record: ${valueOr(record.stableTypeUri)}`,
              `Image source: ${valueOr(record.sourceImage)}`,
              `Rights: ${valueOr(record.rightsHolder)}`,
            ].join(' | '),
          })),
        }],
      },
    ],
    footerNote: 'This exercise describes a frozen, deterministic sample of the SYRIOS catalog. It does not estimate ancient production, survival, circulation, or use.',
  };
};
