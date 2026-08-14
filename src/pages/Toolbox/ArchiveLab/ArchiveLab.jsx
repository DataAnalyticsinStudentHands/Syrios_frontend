import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import coinCollectionsRequest from 'src/api/coin-collections';
import NoFeedBackIcon from 'src/components/constant/NoFeedBackIcon';
import {
  ARCHIVE_AUDIT_SIZE,
  ARCHIVE_DRAFT_STORAGE_KEY,
  ARCHIVE_EVIDENCE_CLASSES,
  ARCHIVE_FIELDS,
  ARCHIVE_INQUIRIES,
  ARCHIVE_VALUE_STATUSES,
  buildArchiveChallenges,
  buildArchivePdfDocument,
  buildArchiveSample,
  buildCompletenessMatrix,
  calculateArchiveRubric,
  classifyArchiveValue,
  createArchiveDraft,
  displayArchiveValue,
  getArchiveFieldValue,
  getArchiveInquiry,
  getArchiveInquiryUsability,
  getArchiveRecordCompleteness,
  normalizeArchiveCoins,
  reconcileArchiveCitationIds,
  restoreArchiveDraft,
  selectDeepAuditRecords,
  serializeArchiveDraft,
  summarizeArchiveInquiryUsability,
} from './archiveLabData';

const STAGES = Object.freeze([
  { id: 'inquiry', label: 'Inquiry' },
  { id: 'sample', label: 'Sample' },
  { id: 'audit', label: 'Deep audit' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'memo', label: 'Methods memo' },
]);

const STATUS_DESCRIPTIONS = {
  Recorded: 'A value is present in the catalog.',
  Uncertain: 'The catalog explicitly marks the value as uncertain.',
  Missing: 'No usable value is recorded.',
  'Not applicable': 'The field is explicitly not applicable to this record.',
};

const FIELD_LOOKUP = new Map(ARCHIVE_FIELDS.map((field) => [field.key, field]));
const isWebUrl = (value) => /^https?:\/\//i.test(value || '');
const recordId = (recordOrId) => String(recordOrId?.id ?? recordOrId ?? '');

const hasDraftWork = (draft) => Boolean(
  draft.provisionalClaim.trim()
  || Object.values(draft.evidence).some((entry) => entry.classification || entry.note.trim())
  || Object.values(draft.memo).some((value) => (
    Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim()
  )),
);

function ArchiveLoading() {
  return (
    <main id='archive-lab' aria-busy='true'>
      <section className='archive-lab__state archive-lab__state--loading' role='status' aria-live='polite'>
        <div className='archive-lab__loading-files' aria-hidden='true'>
          <span />
          <span />
          <span />
        </div>
        <p className='archive-lab__eyebrow'>Catalog methods studio</p>
        <h1>Preparing the archive table</h1>
        <p>Loading records, images, dates, classifications, and source information from Strapi.</p>
      </section>
    </main>
  );
}

function ArchiveState({ kind, onRetry }) {
  const empty = kind === 'empty';
  return (
    <main id='archive-lab'>
      <section className='archive-lab__state' role='alert'>
        <p className='archive-lab__eyebrow'>Catalog methods studio</p>
        <h1>{empty ? 'No catalog records were returned' : 'The archive table could not be prepared'}</h1>
        <p>
          {empty
            ? 'Archive Lab keeps incomplete records visible, but it still needs at least one catalog record to build a sample.'
            : 'The current Strapi collection could not be loaded. Your locally saved memo has not been removed.'}
        </p>
        <button type='button' className='archive-lab__button archive-lab__button--primary' onClick={onRetry}>Try again</button>
      </section>
    </main>
  );
}

function StageProgress({ stage, canOpen, onOpen }) {
  const activeIndex = STAGES.findIndex((item) => item.id === stage);
  return (
    <nav className='archive-lab__progress' aria-label='Archive Lab progress'>
      <ol>
        {STAGES.map((item, index) => {
          const enabled = canOpen(item.id);
          return (
            <li key={item.id} className={index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-current' : ''}>
              <button
                type='button'
                onClick={() => onOpen(item.id)}
                disabled={!enabled}
                aria-current={index === activeIndex ? 'step' : undefined}
                aria-label={`${item.label}, step ${index + 1} of ${STAGES.length}`}
              >
                <span>{index + 1}</span>
                <strong>{item.label}</strong>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StatusBadge({ value, fieldKey = '', status: explicitStatus = '' }) {
  const status = explicitStatus || classifyArchiveValue(value, fieldKey);
  return <span className={`archive-lab__status archive-lab__status--${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>;
}

function CoinFaces({ record, compact = false }) {
  const faces = [
    { label: 'Obverse', image: record?.obverseImage },
    { label: 'Reverse', image: record?.reverseImage },
  ];
  return (
    <div className={`archive-lab__faces${compact ? ' archive-lab__faces--compact' : ''}`} aria-label={`Coin faces for ${record?.coinId || 'catalog record'}`}>
      {faces.map(({ label, image }) => (
        <figure key={label}>
          {image?.url ? <img src={image.url} alt={image.alt || `${label} of ${record.coinId}`} loading='lazy' /> : <span className='archive-lab__missing-image'>Image missing</span>}
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function RecordCitation({ record }) {
  return (
    <div className='archive-lab__citation'>
      <strong>{record.exactCitation}</strong>
      <span>
        <Link to={record.catalogPath}>Open catalog record</Link>
        {isWebUrl(record.stableTypeUri) && <a href={record.stableTypeUri} target='_blank' rel='noreferrer'>Stable type record</a>}
        {isWebUrl(record.sourceImage) && <a href={record.sourceImage} target='_blank' rel='noreferrer'>Image source</a>}
      </span>
      <small>Rights holder: {record.rightsHolder || 'Not recorded'}</small>
    </div>
  );
}

function InquiryStage({ draft, onInquiryChange, onSeedChange, onContinue, headingRef }) {
  return (
    <section className='archive-lab__stage archive-lab__inquiry-stage' aria-labelledby='archive-inquiry-heading'>
      <header className='archive-lab__stage-heading'>
        <p className='archive-lab__eyebrow'>1 · Frame the investigation</p>
        <h2 id='archive-inquiry-heading' ref={headingRef} tabIndex='-1'>Choose a question, not an answer</h2>
        <p>Each inquiry uses the same transparent sampling rule. It changes which fields you examine—not which incomplete records you are allowed to see.</p>
      </header>

      <div className='archive-lab__inquiry-grid'>
        {Object.values(ARCHIVE_INQUIRIES).map((inquiry) => (
          <label key={inquiry.id} className={`archive-lab__inquiry-card${draft.inquiryId === inquiry.id ? ' is-selected' : ''}`}>
            <input type='radio' name='archive-inquiry' value={inquiry.id} checked={draft.inquiryId === inquiry.id} onChange={() => onInquiryChange(inquiry.id)} />
            <span className='archive-lab__eyebrow'>{inquiry.eyebrow}</span>
            <strong>{inquiry.label}</strong>
            <p>{inquiry.question}</p>
            <small>{inquiry.method}</small>
          </label>
        ))}
      </div>

      <div className='archive-lab__seed-panel'>
        <div>
          <span className='archive-lab__eyebrow'>Reproducibility key</span>
          <h3>Keep the sample traceable</h3>
          <p>The same inquiry and seed always select the same records from the same fetched catalog.</p>
        </div>
        <label>
          Sample seed
          <input value={draft.seed} onChange={(event) => onSeedChange(event.target.value)} maxLength={80} spellCheck='false' />
        </label>
      </div>

      <div className='archive-lab__stage-actions archive-lab__stage-actions--end'>
        <button type='button' className='archive-lab__button archive-lab__button--primary' onClick={onContinue}>Build the 24-record sample</button>
      </div>
    </section>
  );
}

function CompletenessMatrix({ rows }) {
  return (
    <div className='archive-lab__table-wrap'>
      <table className='archive-lab__matrix'>
        <caption>Completeness by field. Percentages use the applicable denominator; not-applicable values remain separately visible.</caption>
        <thead>
          <tr>
            <th scope='col'>Catalog field</th>
            {ARCHIVE_VALUE_STATUSES.map((status) => <th scope='col' key={status}>{status}</th>)}
            <th scope='col'>Recorded / applicable</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope='row'>{row.label}</th>
              {ARCHIVE_VALUE_STATUSES.map((status) => <td key={status}>{row.counts[status]}</td>)}
              <td><strong>{row.counts.Recorded}/{row.denominator}</strong><span>{row.percent}%</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SampleStage({ sample, matrix, inquiry, usability, onBack, onContinue, headingRef }) {
  return (
    <section className='archive-lab__stage' aria-labelledby='archive-sample-heading'>
      <header className='archive-lab__stage-heading'>
        <p className='archive-lab__eyebrow'>2 · Inspect the sampling frame</p>
        <h2 id='archive-sample-heading' ref={headingRef} tabIndex='-1'>A reproducible sample with its gaps intact</h2>
        <p>These are catalog observations. Counts describe this sample only; they do not estimate ancient minting, survival, circulation, or importance.</p>
      </header>

      <dl className='archive-lab__sample-meta'>
        <div><dt>Sample</dt><dd>{sample.metadata.sampleSize} / {sample.metadata.populationSize}</dd></div>
        <div><dt>Seed</dt><dd>{sample.metadata.seed}</dd></div>
        <div><dt>Filter</dt><dd>{sample.metadata.filterLabel}</dd></div>
        <div><dt>Order</dt><dd>Stable ID hash</dd></div>
      </dl>

      <div className='archive-lab__guardrail' role='note'>
        <strong>Integrity guardrail</strong>
        <p>{sample.metadata.filterRule} {sample.metadata.orderingRule}</p>
      </div>

      <section className='archive-lab__usability-summary' aria-labelledby='usability-heading'>
        <div>
          <span className='archive-lab__eyebrow'>Required-field intersection</span>
          <h3 id='usability-heading'>Which records can answer this inquiry?</h3>
          <p>Each usable record has every required field recorded. Uncertain, missing, and not-applicable values remain visible but do not meet this threshold.</p>
        </div>
        <strong><span>{usability.usableCount}</span> of {usability.total}<small> inquiry-usable records</small></strong>
        <ul aria-label='Required catalog fields'>
          {usability.requiredFields.map((field) => <li key={field.key}>{field.label}</li>)}
        </ul>
        <p>{inquiry.question}</p>
      </section>

      <section className='archive-lab__subsection' aria-labelledby='status-key-heading'>
        <div className='archive-lab__subheading'>
          <div><span className='archive-lab__eyebrow'>Field-state key</span><h3 id='status-key-heading'>Absence is evidence about the catalog</h3></div>
        </div>
        <ul className='archive-lab__status-key'>
          {ARCHIVE_VALUE_STATUSES.map((status) => <li key={status}><StatusBadge status={status} /><span>{STATUS_DESCRIPTIONS[status]}</span></li>)}
        </ul>
      </section>

      <section className='archive-lab__subsection' aria-labelledby='matrix-heading'>
        <div className='archive-lab__subheading'><div><span className='archive-lab__eyebrow'>Completeness matrix</span><h3 id='matrix-heading'>What this sample can support</h3></div></div>
        <CompletenessMatrix rows={matrix} />
      </section>

      <section className='archive-lab__subsection' aria-labelledby='ledger-heading'>
        <div className='archive-lab__subheading'><div><span className='archive-lab__eyebrow'>Sample ledger</span><h3 id='ledger-heading'>All 24 selected records</h3></div><span>{sample.records.length} records</span></div>
        <div className='archive-lab__ledger'>
          {sample.records.map((record, index) => {
            const completeness = getArchiveRecordCompleteness(record);
            const inquiryUsability = getArchiveInquiryUsability(record, inquiry.id);
            return (
              <article key={record.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{record.coinId}</strong>
                  <small>{displayArchiveValue(getArchiveFieldValue(record, 'dateRange'), 'dateRange')} · {displayArchiveValue(record.material, 'material')}</small>
                  <em className={`archive-lab__usability-marker${inquiryUsability.usable ? ' is-usable' : ''}`}>
                    {inquiryUsability.usable ? 'Inquiry usable' : `${inquiryUsability.recorded}/${inquiryUsability.required} required fields`}
                  </em>
                </div>
                <div className='archive-lab__meter' aria-label={`${completeness.percent}% of applicable fields recorded`}><i style={{ width: `${completeness.percent}%` }} /></div>
                <b>{completeness.percent}%</b>
              </article>
            );
          })}
        </div>
      </section>

      <div className='archive-lab__stage-actions'>
        <button type='button' className='archive-lab__button archive-lab__button--secondary' onClick={onBack}>Change inquiry</button>
        <button type='button' className='archive-lab__button archive-lab__button--primary' onClick={onContinue}>Open six-record deep audit</button>
      </div>
    </section>
  );
}

function AuditRecord({ record, inquiry, entry, onChange, index }) {
  const fields = [...new Set([
    ...inquiry.focusFields,
    'obverseType',
    'reverseType',
    'imageCoverage',
    'reference',
    'provenance',
    'rightsHolder',
  ])];
  const completeness = getArchiveRecordCompleteness(record);
  return (
    <article className='archive-lab__audit-card' aria-labelledby={`audit-record-${record.id}`}>
      <header>
        <span className='archive-lab__audit-number'>{String(index + 1).padStart(2, '0')}</span>
        <div><span className='archive-lab__eyebrow'>Deep-audit record</span><h3 id={`audit-record-${record.id}`}>{record.coinId}</h3><p>{record.exactCitation}</p></div>
        <span className='archive-lab__completeness'>{completeness.recorded} of {completeness.denominator} recorded</span>
      </header>
      <div className='archive-lab__audit-body'>
        <CoinFaces record={record} />
        <dl className='archive-lab__record-fields'>
          {fields.map((fieldKey) => {
            const value = getArchiveFieldValue(record, fieldKey);
            return <div key={fieldKey}><dt>{FIELD_LOOKUP.get(fieldKey)?.label || fieldKey}</dt><dd>{displayArchiveValue(value, fieldKey)} <StatusBadge value={value} fieldKey={fieldKey} /></dd></div>;
          })}
        </dl>
      </div>
      <fieldset className='archive-lab__classification'>
        <legend>How does this record relate to your provisional claim?</legend>
        <div>
          {ARCHIVE_EVIDENCE_CLASSES.map((classification) => (
            <label key={classification} className={entry.classification === classification ? 'is-selected' : ''}>
              <input type='radio' name={`classification-${record.id}`} value={classification} checked={entry.classification === classification} onChange={() => onChange('classification', classification)} />
              {classification}
            </label>
          ))}
        </div>
      </fieldset>
      <label className='archive-lab__field'>
        Evidence note
        <textarea value={entry.note} onChange={(event) => onChange('note', event.target.value)} rows={3} placeholder='Name the exact catalog field or visible feature, then explain why it matters.' />
      </label>
      <RecordCitation record={record} />
    </article>
  );
}

function AuditStage({ draft, inquiry, auditRecords, onClaimChange, onEvidenceChange, onBack, onContinue, headingRef }) {
  const completed = auditRecords.filter((record) => draft.evidence[recordId(record)]?.classification).length;
  return (
    <section className='archive-lab__stage' aria-labelledby='archive-audit-heading'>
      <header className='archive-lab__stage-heading'>
        <p className='archive-lab__eyebrow'>3 · Test a provisional claim</p>
        <h2 id='archive-audit-heading' ref={headingRef} tabIndex='-1'>Read six records deeply</h2>
        <p>Classification records your relationship to the evidence. It does not grade the historical interpretation as simply right or wrong.</p>
      </header>
      <label className='archive-lab__claim-field'>
        <span><strong>Your provisional claim</strong><small>Revise it later after testing challenges.</small></span>
        <textarea value={draft.provisionalClaim} onChange={(event) => onClaimChange(event.target.value)} rows={3} placeholder={`Make a cautious claim in response to: ${inquiry.question}`} />
      </label>
      <div className='archive-lab__audit-counter' aria-live='polite'><strong>{completed}/{ARCHIVE_AUDIT_SIZE}</strong> records classified</div>
      <div className='archive-lab__audit-list'>
        {auditRecords.map((record, index) => (
          <AuditRecord
            key={record.id}
            record={record}
            inquiry={inquiry}
            index={index}
            entry={draft.evidence[recordId(record)] || { classification: '', note: '' }}
            onChange={(field, value) => onEvidenceChange(recordId(record), field, value)}
          />
        ))}
      </div>
      <div className='archive-lab__stage-actions'>
        <button type='button' className='archive-lab__button archive-lab__button--secondary' onClick={onBack}>Review sample</button>
        <button type='button' className='archive-lab__button archive-lab__button--primary' onClick={onContinue}>Challenge the pattern</button>
      </div>
    </section>
  );
}

function ChallengeStage({ challenges, draft, onBack, onContinue, headingRef }) {
  return (
    <section className='archive-lab__stage' aria-labelledby='archive-challenge-heading'>
      <header className='archive-lab__stage-heading'>
        <p className='archive-lab__eyebrow'>4 · Look for disconfirming evidence</p>
        <h2 id='archive-challenge-heading' ref={headingRef} tabIndex='-1'>Make the claim survive contact with the archive</h2>
        <p>A useful historical claim can become narrower without becoming weaker. Use these records to decide what the first version missed.</p>
      </header>
      <div className='archive-lab__provisional-claim'>
        <span>Provisional claim</span>
        <blockquote>{draft.provisionalClaim || 'No provisional claim has been written yet.'}</blockquote>
      </div>
      <div className='archive-lab__challenge-grid'>
        {challenges.map((challenge) => (
          <article key={challenge.id}>
            <span className='archive-lab__eyebrow'>{challenge.label}</span>
            {challenge.record ? (
              <>
                <h3>{challenge.record.coinId}</h3>
                <CoinFaces record={challenge.record} compact />
                <p>{challenge.prompt}</p>
                <dl>
                  <div><dt>Material</dt><dd>{displayArchiveValue(challenge.record.material)}</dd></div>
                  <div><dt>Authority</dt><dd>{displayArchiveValue(challenge.record.authority)}</dd></div>
                  <div><dt>Mint</dt><dd>{displayArchiveValue(challenge.record.mint)}</dd></div>
                </dl>
                <RecordCitation record={challenge.record} />
              </>
            ) : <p>{challenge.prompt}</p>}
          </article>
        ))}
      </div>
      <div className='archive-lab__guardrail' role='note'>
        <strong>Before revising</strong>
        <p>Missing data cannot be silently converted into a negative finding. A rare sample value is not automatically rare in antiquity. A counterexample may narrow a pattern without erasing it.</p>
      </div>
      <div className='archive-lab__stage-actions'>
        <button type='button' className='archive-lab__button archive-lab__button--secondary' onClick={onBack}>Return to audit</button>
        <button type='button' className='archive-lab__button archive-lab__button--primary' onClick={onContinue}>Write the methods memo</button>
      </div>
    </section>
  );
}

const MEMO_FIELDS = [
  { key: 'question', label: 'Inquiry question', prompt: 'State the historical question this sample helps you investigate.' },
  { key: 'method', label: 'Method', prompt: 'Describe the sample size, seed, filter rule, and six-record audit.' },
  { key: 'finding', label: 'Finding', prompt: 'Summarize the pattern supported by the audited evidence.' },
  { key: 'counterexample', label: 'Counterexample', prompt: 'Identify the record that most strongly complicates or counters the pattern.' },
  { key: 'limitation', label: 'Limitation', prompt: 'Name what missing data, catalog scope, or sampling prevents you from concluding.' },
  { key: 'additionalSource', label: 'Additional source needed', prompt: 'Name another source type that could test this catalog-based claim.' },
  { key: 'revisedClaim', label: 'Revised claim', prompt: 'Rewrite the claim so it accounts for the challenge evidence.' },
];

function MemoStage({ draft, inquiry, sample, auditRecords, challenges, rubric, onMemoChange, onCitationToggle, onBack, headingRef }) {
  const [pdfState, setPdfState] = useState({ status: 'idle', message: '' });

  const downloadPdf = async () => {
    setPdfState({ status: 'working', message: 'Preparing methods memo…' });
    try {
      // Keep the large PDF engine out of the initial lesson bundle; it loads only
      // after a student explicitly requests a durable copy of their work.
      const { downloadLearningArtifactPdf } = await import('src/utils/learningArtifactPdf');
      const siteOrigin = `${window.location.origin}${import.meta.env.DEV ? '/dev' : ''}`;
      const document = buildArchivePdfDocument({
        draft,
        inquiry,
        sample,
        auditRecords,
        challenges,
        rubric,
        siteOrigin,
        generatedAt: new Date(),
      });
      const result = await downloadLearningArtifactPdf(document, {
        onProgress: ({ phase, completed, total }) => setPdfState({
          status: 'working',
          message: phase === 'images' && total ? `Preparing source images ${completed}/${total}…` : 'Laying out methods memo…',
        }),
      });
      setPdfState({ status: 'done', message: `Downloaded ${result.pageCount} page${result.pageCount === 1 ? '' : 's'}.` });
    } catch (error) {
      console.error('Archive Lab PDF export failed:', error);
      setPdfState({ status: 'error', message: 'The PDF could not be created. Your saved draft is unchanged.' });
    }
  };

  return (
    <section className='archive-lab__stage' aria-labelledby='archive-memo-heading'>
      <header className='archive-lab__stage-heading'>
        <p className='archive-lab__eyebrow'>5 · Document the revision</p>
        <h2 id='archive-memo-heading' ref={headingRef} tabIndex='-1'>Build a revision-ready methods memo</h2>
        <p>The checklist assesses whether the research structure is present. It does not decide which historical interpretation students must reach.</p>
      </header>
      <div className='archive-lab__memo-layout'>
        <div className='archive-lab__memo-form'>
          {MEMO_FIELDS.map((field) => (
            <label className='archive-lab__field' key={field.key}>
              {field.label}
              <textarea rows={field.key === 'method' || field.key === 'revisedClaim' ? 5 : 3} value={draft.memo[field.key]} onChange={(event) => onMemoChange(field.key, event.target.value)} placeholder={field.prompt} />
            </label>
          ))}
          <fieldset className='archive-lab__citation-picker'>
            <legend>Choose exactly three catalog citations</legend>
            <p>Select the records that most directly support the memo. The downloaded artifact preserves their exact catalog references and links.</p>
            {auditRecords.map((record) => {
              const checked = draft.memo.citationIds.includes(recordId(record));
              const disabled = !checked && draft.memo.citationIds.length >= 3;
              return (
                <label key={record.id} className={checked ? 'is-selected' : ''}>
                  <input type='checkbox' checked={checked} disabled={disabled} onChange={() => onCitationToggle(recordId(record))} />
                  <span><strong>{record.coinId}</strong><small>{record.exactCitation}</small></span>
                </label>
              );
            })}
          </fieldset>
        </div>
        <aside className='archive-lab__rubric'>
          <div className='archive-lab__rubric-score'><span>{rubric.score}</span><small>of {rubric.total}</small></div>
          <div><span className='archive-lab__eyebrow'>Structural review</span><h3>Methods memo checklist</h3><p>Completion checks structure, not a preferred conclusion.</p></div>
          <ul>
            {rubric.criteria.map((criterion) => <li key={criterion.id} className={criterion.met ? 'is-met' : ''}><span aria-hidden='true'>{criterion.score}/2</span>{criterion.label}</li>)}
          </ul>
          <button type='button' className='archive-lab__button archive-lab__button--primary' onClick={downloadPdf} disabled={pdfState.status === 'working'}>
            {pdfState.status === 'working' ? 'Preparing PDF…' : 'Download methods memo PDF'}
          </button>
          <p className={`archive-lab__pdf-status archive-lab__pdf-status--${pdfState.status}`} aria-live='polite'>{pdfState.message}</p>
        </aside>
      </div>
      <div className='archive-lab__stage-actions'>
        <button type='button' className='archive-lab__button archive-lab__button--secondary' onClick={onBack}>Review challenges</button>
        <Link className='archive-lab__button archive-lab__button--secondary' to='/Toolbox'>Return to Toolbox</Link>
      </div>
    </section>
  );
}

function ArchiveLab() {
  const [status, setStatus] = useState('loading');
  const [records, setRecords] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [stage, setStage] = useState('inquiry');
  const [draft, setDraft] = useState(() => createArchiveDraft());
  const [recovered, setRecovered] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const headingRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    coinCollectionsRequest.coinCollection()
      .then((response) => {
        if (cancelled) return;
        const rows = response?.data?.data || response?.data || [];
        const normalized = normalizeArchiveCoins(Array.isArray(rows) ? rows : []);
        setRecords(normalized);
        setStatus(normalized.length ? 'ready' : 'empty');
      })
      .catch((error) => {
        console.error('Archive Lab could not load the coin collection:', error);
        if (!cancelled) setStatus('error');
      });
    return () => { cancelled = true; };
  }, [attempt]);

  useEffect(() => {
    if (status !== 'ready' || hydrated) return;
    const stored = window.localStorage.getItem(ARCHIVE_DRAFT_STORAGE_KEY);
    if (stored) {
      const restored = restoreArchiveDraft(stored, records);
      setDraft(restored);
      setRecovered(hasDraftWork(restored));
    }
    setHydrated(true);
  }, [hydrated, records, status]);

  useEffect(() => {
    if (status !== 'ready' || !hydrated) return undefined;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(ARCHIVE_DRAFT_STORAGE_KEY, serializeArchiveDraft(draft, records));
      setSaveStatus('Draft saved locally');
    }, 250);
    return () => window.clearTimeout(timer);
  }, [draft, hydrated, records, status]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stage]);

  const inquiry = getArchiveInquiry(draft.inquiryId);
  const sample = useMemo(() => buildArchiveSample(records, draft.inquiryId, {
    seed: draft.seed,
    sampleIds: draft.sampleIds,
    sampledAt: draft.sampledAt,
  }), [records, draft.inquiryId, draft.sampleIds, draft.sampledAt, draft.seed]);
  const auditRecords = useMemo(() => selectDeepAuditRecords(sample.records, draft.inquiryId, {
    seed: draft.seed,
    auditIds: draft.auditIds,
  }), [draft.auditIds, draft.inquiryId, draft.seed, sample.records]);
  const matrix = useMemo(() => buildCompletenessMatrix(sample.records), [sample.records]);
  const usability = useMemo(
    () => summarizeArchiveInquiryUsability(sample.records, draft.inquiryId),
    [draft.inquiryId, sample.records],
  );
  const challenges = useMemo(() => buildArchiveChallenges(sample.records, auditRecords, draft, draft.inquiryId), [sample.records, auditRecords, draft]);
  const rubric = useMemo(() => calculateArchiveRubric(draft, auditRecords, sample.records), [draft, auditRecords, sample.records]);

  useEffect(() => {
    if (status !== 'ready' || !hydrated) return;
    const sampleIds = sample.records.map(recordId);
    const auditIds = auditRecords.map(recordId);
    const citationIds = reconcileArchiveCitationIds(draft.memo.citationIds, auditIds);
    if (
      draft.sampleIds.join('|') === sampleIds.join('|')
      && draft.auditIds.join('|') === auditIds.join('|')
      && draft.memo.citationIds.join('|') === citationIds.join('|')
    ) return;
    setDraft((current) => {
      if (current.inquiryId !== sample.metadata.inquiryId || current.seed !== sample.metadata.seed) return current;
      const resolvedCitationIds = reconcileArchiveCitationIds(current.memo.citationIds, auditIds);
      return {
        ...current,
        sampleIds,
        auditIds,
        memo: { ...current.memo, citationIds: resolvedCitationIds },
      };
    });
  }, [
    auditRecords,
    draft.auditIds,
    draft.memo.citationIds,
    draft.sampleIds,
    hydrated,
    sample.metadata.inquiryId,
    sample.metadata.seed,
    sample.records,
    status,
  ]);

  const updateDraft = (updater) => {
    setSaveStatus('Saving…');
    setDraft((current) => (typeof updater === 'function' ? updater(current) : updater));
  };

  const changeInquiry = (inquiryId) => {
    if (inquiryId === draft.inquiryId) return;
    if (hasDraftWork(draft) && !window.confirm('Changing the inquiry clears the current evidence classifications and memo. Continue?')) return;
    updateDraft(createArchiveDraft(inquiryId, draft.seed));
  };

  const changeSeed = (seed) => {
    if (seed === draft.seed) return;
    if (hasDraftWork(draft) && !window.confirm('Changing the sample seed clears the current evidence classifications and memo. Continue?')) return;
    updateDraft(createArchiveDraft(draft.inquiryId, seed));
  };

  const clearDraft = () => {
    if (!window.confirm('Clear the locally saved Archive Lab draft? This cannot be undone.')) return;
    window.localStorage.removeItem(ARCHIVE_DRAFT_STORAGE_KEY);
    setDraft(createArchiveDraft());
    setStage('inquiry');
    setRecovered(false);
    setSaveStatus('Draft cleared');
  };

  const canOpen = (nextStage) => {
    const index = STAGES.findIndex((item) => item.id === nextStage);
    if (index <= 1) return true;
    return sample.records.length > 0 && auditRecords.length > 0;
  };

  if (status === 'loading') return <ArchiveLoading />;
  if (status === 'error' || status === 'empty') return <ArchiveState kind={status} onRetry={() => setAttempt((value) => value + 1)} />;

  return (
    <main id='archive-lab'>
      <NoFeedBackIcon formfor='archive-lab' color='#9b5f22' />
      <div className='archive-lab__shell'>
        <header className='archive-lab__hero'>
          <div>
            <Link to='/Toolbox' className='archive-lab__back'>Toolbox</Link>
            <p className='archive-lab__eyebrow'>Collection evidence · sampling · revision</p>
            <h1>Archive Lab</h1>
            <p>Build a historical claim, audit the catalog evidence, seek out what does not fit, and leave with a reproducible methods memo.</p>
          </div>
          <aside>
            <span>Research integrity</span>
            <strong>Catalog patterns are not ancient totals.</strong>
            <p>Every missing, uncertain, and not-applicable value stays visible.</p>
          </aside>
        </header>

        <div className='archive-lab__utility-bar'>
          <span aria-live='polite'>{saveStatus || 'Drafts save only in this browser'}</span>
          <button type='button' onClick={clearDraft}>Clear draft</button>
        </div>

        {recovered && (
          <div className='archive-lab__recovery' role='status'>
            <div><strong>Your local draft was recovered.</strong><span>Continue from any available step or begin again with “Clear draft.”</span></div>
            <button type='button' onClick={() => setRecovered(false)} aria-label='Dismiss recovered draft message'>Dismiss</button>
          </div>
        )}

        <StageProgress stage={stage} canOpen={canOpen} onOpen={setStage} />

        {stage === 'inquiry' && <InquiryStage draft={draft} headingRef={headingRef} onInquiryChange={changeInquiry} onSeedChange={changeSeed} onContinue={() => setStage('sample')} />}
        {stage === 'sample' && <SampleStage sample={sample} matrix={matrix} inquiry={inquiry} usability={usability} headingRef={headingRef} onBack={() => setStage('inquiry')} onContinue={() => setStage('audit')} />}
        {stage === 'audit' && (
          <AuditStage
            draft={draft}
            inquiry={inquiry}
            auditRecords={auditRecords}
            headingRef={headingRef}
            onClaimChange={(provisionalClaim) => updateDraft((current) => ({ ...current, provisionalClaim }))}
            onEvidenceChange={(id, field, value) => updateDraft((current) => ({
              ...current,
              evidence: { ...current.evidence, [id]: { classification: '', note: '', ...current.evidence[id], [field]: value } },
            }))}
            onBack={() => setStage('sample')}
            onContinue={() => setStage('challenge')}
          />
        )}
        {stage === 'challenge' && <ChallengeStage challenges={challenges} draft={draft} headingRef={headingRef} onBack={() => setStage('audit')} onContinue={() => setStage('memo')} />}
        {stage === 'memo' && (
          <MemoStage
            draft={draft}
            inquiry={inquiry}
            sample={sample}
            auditRecords={auditRecords}
            challenges={challenges}
            rubric={rubric}
            headingRef={headingRef}
            onMemoChange={(field, value) => updateDraft((current) => ({ ...current, memo: { ...current.memo, [field]: value } }))}
            onCitationToggle={(id) => updateDraft((current) => {
              const exists = current.memo.citationIds.includes(id);
              const citationIds = exists ? current.memo.citationIds.filter((value) => value !== id) : [...current.memo.citationIds, id].slice(0, 3);
              return { ...current, memo: { ...current.memo, citationIds } };
            })}
            onBack={() => setStage('challenge')}
          />
        )}
      </div>
    </main>
  );
}

export default ArchiveLab;
