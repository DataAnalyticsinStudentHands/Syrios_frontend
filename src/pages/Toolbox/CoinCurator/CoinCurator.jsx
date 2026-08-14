import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import coinCollectionsRequest from 'src/api/coin-collections';
import NoFeedBackIcon from 'src/components/constant/NoFeedBackIcon';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import {
  COIN_CURATOR_INQUIRIES,
  CURATOR_DRAFT_STORAGE_KEY,
  CURATOR_EXHIBIT_SIZE,
  buildEvidenceComparisonRows,
  calculateCuratorRubric,
  createCuratorDraft,
  displayCuratorValue,
  getCuratorInquiry,
  isEligibleCuratorCoin,
  normalizeCuratorCoins,
  orderCuratorCandidates,
  restoreCuratorDraft,
  serializeCuratorDraft,
  suggestCuratorCoins,
} from './coinCuratorData';

const STAGES = Object.freeze([
  { key: 'inquiry', label: 'Inquiry' },
  { key: 'sources', label: 'Sources' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'thesis', label: 'Thesis' },
  { key: 'review', label: 'Review' },
]);

const COPY_LIMITS = Object.freeze({
  exhibitTitle: 160,
  thesis: 1800,
  conclusion: 1800,
  limitation: 1800,
  observation: 1200,
  catalogFact: 1200,
  reasoning: 1200,
});

const CANDIDATE_BATCH_SIZE = 18;
const blankEntry = () => ({ observation: '', catalogFact: '', reasoning: '' });
const coinIdentity = (coinOrId) => String(coinOrId?.id ?? coinOrId ?? '');
const safeText = (value) => value || 'Not recorded';
const isExternalUrl = (value) => /^https?:\/\//i.test(value || '');

const hasDraftWork = (draft) => Boolean(
  draft.selectedCoinIds.length
  || draft.exhibitTitle
  || draft.thesis
  || draft.conclusion
  || draft.limitation,
);

function CoinImage({ src, alt, side }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className='coin-curator__image-fallback' role='img' aria-label={`${side} image unavailable`}>
        <span aria-hidden='true'>◌</span>
        <small>{side} unavailable</small>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || `${side} of catalog coin`}
      loading='lazy'
      onError={() => setFailed(true)}
    />
  );
}

function CoinFaces({ coin, compact = false }) {
  return (
    <div className={`coin-curator__faces${compact ? ' coin-curator__faces--compact' : ''}`}>
      <figure>
        <CoinImage src={coin.image.obverseUrl} alt={coin.image.obverseAlt} side='Obverse' />
        <figcaption>Obverse</figcaption>
      </figure>
      <figure>
        <CoinImage src={coin.image.reverseUrl} alt={coin.image.reverseAlt} side='Reverse' />
        <figcaption>Reverse</figcaption>
      </figure>
    </div>
  );
}

function StageProgress({ activeStage, selectedCount, onStageChange }) {
  const activeIndex = STAGES.findIndex(({ key }) => key === activeStage);
  const sourceSetReady = selectedCount === CURATOR_EXHIBIT_SIZE;

  return (
    <nav className='coin-curator__progress' aria-label='Exhibition builder progress'>
      <ol>
        {STAGES.map((stage, index) => {
          const available = index < 2 || sourceSetReady;
          const current = stage.key === activeStage;
          return (
            <li className={index < activeIndex ? 'is-complete' : ''} key={stage.key}>
              <button
                type='button'
                aria-current={current ? 'step' : undefined}
                disabled={!available}
                onClick={() => onStageChange(stage.key)}
              >
                <span aria-hidden='true'>{index < activeIndex ? '✓' : index + 1}</span>
                <strong>{stage.label}</strong>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function InquiryStage({ availability, restored, onChoose }) {
  return (
    <section className='coin-curator__stage coin-curator__stage--inquiry' aria-labelledby='coin-curator-stage-title'>
      <div className='coin-curator__stage-heading'>
        <span className='coin-curator__eyebrow'>Step one / frame the investigation</span>
        <h2 id='coin-curator-stage-title' tabIndex='-1'>Choose the question your exhibit will investigate</h2>
        <p>A strong exhibition begins with a question. These inquiries use fields with enough recorded evidence to support comparison without turning gaps into invented facts.</p>
      </div>

      {restored && (
        <div className='coin-curator__recovery-note' role='status'>
          <div>
            <strong>Saved work recovered</strong>
            <p>Your locally saved coin choices and writing are ready to continue.</p>
          </div>
          <button type='button' onClick={() => onChoose(restored.inquiryId, true)}>Continue saved exhibit</button>
        </div>
      )}

      <div className='coin-curator__inquiry-grid'>
        {Object.values(COIN_CURATOR_INQUIRIES).map((inquiry) => (
          <article key={inquiry.id}>
            <span>{inquiry.eyebrow}</span>
            <h3>{inquiry.label}</h3>
            <blockquote>{inquiry.question}</blockquote>
            <p>{inquiry.description}</p>
            <div className='coin-curator__inquiry-footer'>
              <small>{(availability[inquiry.id] || 0).toLocaleString()} eligible catalog records</small>
              <button
                type='button'
                disabled={(availability[inquiry.id] || 0) < CURATOR_EXHIBIT_SIZE}
                onClick={() => onChoose(inquiry.id, false)}
              >
                Build this exhibit
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className='coin-curator__method-note'>
        <strong>Collection, not census</strong>
        <p>Patterns here describe records assembled by SYRIOS. They do not, by themselves, measure how many coins ancient people produced, used, or circulated.</p>
      </aside>
    </section>
  );
}

function SelectedSource({ coin, index, isLast, onMove, onRemove }) {
  return (
    <article className='coin-curator__selected-source'>
      <div className='coin-curator__slot-number' aria-hidden='true'>{index + 1}</div>
      <CoinFaces coin={coin} compact />
      <div className='coin-curator__selected-copy'>
        <span>Exhibit object {index + 1}</span>
        <h3>{coin.displayName}</h3>
        <p>{coin.dateRange} · {safeText(coin.mint)}</p>
        <Link to={coin.catalogPath}>Open catalog record</Link>
      </div>
      <div className='coin-curator__source-actions' aria-label={`Arrange ${coin.displayName}`}>
        <button type='button' disabled={index === 0} onClick={() => onMove(index, -1)} aria-label={`Move ${coin.displayName} earlier`}>↑</button>
        <button type='button' disabled={isLast} onClick={() => onMove(index, 1)} aria-label={`Move ${coin.displayName} later`}>↓</button>
        <button type='button' className='is-remove' onClick={() => onRemove(coin.id)}>Remove</button>
      </div>
    </article>
  );
}

function CandidateCard({ coin, inquiry, selectedCount, suggested, onAdd }) {
  const primaryValue = displayCuratorValue(coin[inquiry.field]);
  const primaryLabel = inquiry.field === 'material'
    ? 'Material'
    : inquiry.field === 'issuingAuthority' ? 'Issuing authority' : 'Governing power';
  return (
    <article className={`coin-curator__candidate${suggested ? ' is-suggested' : ''}`}>
      <CoinFaces coin={coin} compact />
      <div>
        {suggested && <span className='coin-curator__suggested-label'>Suggested contrast</span>}
        <h4>{coin.displayName}</h4>
        <dl>
          <div><dt>{primaryLabel}</dt><dd>{primaryValue}</dd></div>
          <div><dt>Date</dt><dd>{coin.dateRange}</dd></div>
          <div><dt>Mint</dt><dd>{safeText(coin.mint)}</dd></div>
        </dl>
      </div>
      <button
        type='button'
        disabled={selectedCount >= CURATOR_EXHIBIT_SIZE}
        onClick={() => onAdd(coin)}
        aria-label={`Add ${coin.displayName} to exhibit`}
      >
        Add to exhibit
      </button>
    </article>
  );
}

function SourcesStage({
  inquiry,
  eligibleCoins,
  selectedCoins,
  orderedCandidates,
  suggestions,
  search,
  filter,
  filterOptions,
  visibleCount,
  onSearch,
  onFilter,
  onShowMore,
  onAdd,
  onRemove,
  onMove,
  onCompleteSuggestions,
  onContinue,
  onBack,
}) {
  const selectedCount = selectedCoins.length;
  const suggestedIds = new Set(suggestions.map(coinIdentity));

  return (
    <section className='coin-curator__stage coin-curator__stage--sources' aria-labelledby='coin-curator-stage-title'>
      <div className='coin-curator__stage-heading'>
        <span className='coin-curator__eyebrow'>Step two / assemble the source set</span>
        <h2 id='coin-curator-stage-title' tabIndex='-1'>Choose three coins that support or complicate your inquiry</h2>
        <p>{inquiry.question} The suggested order favors contrasting evidence while retaining complete images, chronology, and attribution.</p>
      </div>

      <div className='coin-curator__source-layout'>
        <aside className='coin-curator__candidate-rail' aria-labelledby='coin-curator-candidates-title'>
          <div className='coin-curator__rail-heading'>
            <div>
              <span>Catalog candidates</span>
              <h3 id='coin-curator-candidates-title'>{eligibleCoins.length.toLocaleString()} eligible coins</h3>
            </div>
            {selectedCount < CURATOR_EXHIBIT_SIZE && suggestions.length > 0 && (
              <button type='button' onClick={onCompleteSuggestions}>
                Complete with suggestions
              </button>
            )}
          </div>

          <div className='coin-curator__candidate-tools'>
            <label>
              <span>Search candidates</span>
              <input type='search' value={search} onChange={(event) => onSearch(event.target.value)} placeholder='Authority, mint, material…' />
            </label>
            <label>
              <span>Filter by {inquiry.field === 'material' ? 'material' : inquiry.field === 'issuingAuthority' ? 'issuing authority' : 'governing power'}</span>
              <select value={filter} onChange={(event) => onFilter(event.target.value)}>
                <option value='all'>All recorded values</option>
                {filterOptions.map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          <div className='coin-curator__candidate-list'>
            {orderedCandidates.slice(0, visibleCount).map((coin) => (
              <CandidateCard
                coin={coin}
                inquiry={inquiry}
                selectedCount={selectedCount}
                suggested={suggestedIds.has(coinIdentity(coin))}
                onAdd={onAdd}
                key={coin.id}
              />
            ))}
            {orderedCandidates.length === 0 && (
              <div className='coin-curator__no-results' role='status'>No eligible coins match these search controls.</div>
            )}
          </div>
          {visibleCount < orderedCandidates.length && (
            <button type='button' className='coin-curator__show-more' onClick={onShowMore}>
              Show more candidates ({orderedCandidates.length - visibleCount} remaining)
            </button>
          )}
        </aside>

        <div className='coin-curator__exhibit-tray'>
          <div className='coin-curator__tray-heading'>
            <div>
              <span>Your source set</span>
              <h3>{selectedCount} of {CURATOR_EXHIBIT_SIZE} objects selected</h3>
            </div>
            <div className='coin-curator__tray-meter' role='progressbar' aria-label='Coins selected' aria-valuemin='0' aria-valuemax={CURATOR_EXHIBIT_SIZE} aria-valuenow={selectedCount}>
              <span style={{ width: `${(selectedCount / CURATOR_EXHIBIT_SIZE) * 100}%` }} />
            </div>
          </div>

          <div className='coin-curator__selected-list' aria-live='polite'>
            {selectedCoins.map((coin, index) => (
              <SelectedSource
                coin={coin}
                index={index}
                isLast={index === selectedCoins.length - 1}
                onMove={onMove}
                onRemove={onRemove}
                key={coin.id}
              />
            ))}
            {Array.from({ length: CURATOR_EXHIBIT_SIZE - selectedCount }, (_, index) => (
              <div className='coin-curator__empty-slot' key={`empty-${index}`}>
                <span aria-hidden='true'>+</span>
                <p>Choose another source from the catalog</p>
              </div>
            ))}
          </div>

          <aside className='coin-curator__selection-guidance'>
            <strong>Curatorial question</strong>
            <p>Does each coin add new evidence, or does it merely repeat what another object already shows?</p>
          </aside>
        </div>
      </div>

      <StageActions
        backLabel='Change inquiry'
        nextLabel='Compare selected evidence'
        nextDisabled={selectedCount !== CURATOR_EXHIBIT_SIZE}
        onBack={onBack}
        onNext={onContinue}
      />
    </section>
  );
}

function ComparisonTable({ rows, coins }) {
  return (
    <div className='coin-curator__comparison-scroll' tabIndex='0' aria-label='Scrollable catalog evidence comparison'>
      <table className='coin-curator__comparison-table'>
        <caption>Catalog evidence recorded for the selected objects</caption>
        <thead>
          <tr>
            <th scope='col'>Recorded field</th>
            {coins.map((coin, index) => <th scope='col' key={coin.id}>Object {index + 1}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className={row.different ? 'is-contrast' : ''} key={row.key}>
              <th scope='row'>{row.label}{row.different && <span>Contrast</span>}</th>
              {row.values.map((entry) => (
                <td className={`is-${entry.status}`} key={`${row.key}-${entry.coinId}`}>{entry.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EvidenceEntry({ coin, index, entry, onChange }) {
  return (
    <article className='coin-curator__evidence-entry'>
      <header>
        <span>Exhibit object {index + 1}</span>
        <h3>{coin.displayName}</h3>
        <p>{coin.dateRange} · {safeText(coin.material)} · {safeText(coin.governingPower)}</p>
      </header>
      <CoinFaces coin={coin} />
      <div className='coin-curator__evidence-prompts'>
        <label className='is-observation'>
          <span><strong>Observed on the coin</strong><small>What can you see directly?</small></span>
          <textarea value={entry.observation} maxLength={COPY_LIMITS.observation} onChange={(event) => onChange(coin.id, 'observation', event.target.value)} />
          <small>{entry.observation.length}/{COPY_LIMITS.observation}</small>
        </label>
        <label className='is-catalog'>
          <span><strong>Recorded in the catalog</strong><small>Which date, material, authority, legend, or description matters?</small></span>
          <textarea value={entry.catalogFact} maxLength={COPY_LIMITS.catalogFact} onChange={(event) => onChange(coin.id, 'catalogFact', event.target.value)} />
          <small>{entry.catalogFact.length}/{COPY_LIMITS.catalogFact}</small>
        </label>
        <label className='is-interpretation'>
          <span><strong>Student interpretation</strong><small>How does this evidence support or complicate your emerging claim?</small></span>
          <textarea value={entry.reasoning} maxLength={COPY_LIMITS.reasoning} onChange={(event) => onChange(coin.id, 'reasoning', event.target.value)} />
          <small>{entry.reasoning.length}/{COPY_LIMITS.reasoning}</small>
        </label>
      </div>
      <Link to={coin.catalogPath}>Review the full catalog record</Link>
    </article>
  );
}

function EvidenceStage({ inquiry, selectedCoins, entries, rows, onEntryChange, onBack, onContinue }) {
  const completeEntries = selectedCoins.filter((coin) => {
    const entry = entries[coinIdentity(coin)] || blankEntry();
    return entry.observation.trim() && entry.catalogFact.trim() && entry.reasoning.trim();
  }).length;

  return (
    <section className='coin-curator__stage coin-curator__stage--evidence' aria-labelledby='coin-curator-stage-title'>
      <div className='coin-curator__stage-heading'>
        <span className='coin-curator__eyebrow'>Step three / distinguish evidence from interpretation</span>
        <h2 id='coin-curator-stage-title' tabIndex='-1'>Read across the source set before making your claim</h2>
        <p>{inquiry.question} Use the comparison to find a meaningful similarity, contrast, or complication.</p>
      </div>

      <ComparisonTable rows={rows} coins={selectedCoins} />

      <div className='coin-curator__evidence-key' aria-label='Evidence category key'>
        <span className='is-observation'>Observed on the coin</span>
        <span className='is-catalog'>Recorded in the catalog</span>
        <span className='is-interpretation'>Student interpretation</span>
      </div>

      <div className='coin-curator__evidence-list'>
        {selectedCoins.map((coin, index) => (
          <EvidenceEntry
            coin={coin}
            index={index}
            entry={entries[coinIdentity(coin)] || blankEntry()}
            onChange={onEntryChange}
            key={coin.id}
          />
        ))}
      </div>

      <div className='coin-curator__completion-note' role='status'>
        <strong>{completeEntries} of {CURATOR_EXHIBIT_SIZE} evidence captions structurally complete</strong>
        <p>You may continue and return later. The checklist evaluates presence and sourcing, not whether your interpretation matches a preferred conclusion.</p>
      </div>

      <StageActions backLabel='Revise source set' nextLabel='Write exhibit thesis' onBack={onBack} onNext={onContinue} />
    </section>
  );
}

function WritingField({ id, label, guidance, value, limit, rows = 4, onChange }) {
  return (
    <label className='coin-curator__writing-field' htmlFor={id}>
      <span><strong>{label}</strong><small>{guidance}</small></span>
      <textarea id={id} rows={rows} value={value} maxLength={limit} onChange={(event) => onChange(event.target.value)} />
      <small>{value.length}/{limit}</small>
    </label>
  );
}

function ThesisStage({ inquiry, draft, onFieldChange, onBack, onContinue }) {
  return (
    <section className='coin-curator__stage coin-curator__stage--thesis' aria-labelledby='coin-curator-stage-title'>
      <div className='coin-curator__stage-heading'>
        <span className='coin-curator__eyebrow'>Step four / construct the historical argument</span>
        <h2 id='coin-curator-stage-title' tabIndex='-1'>Turn three object studies into one coherent exhibition</h2>
        <p>Your prose remains yours. Coin Curator checks structure and attribution, but it does not generate or automatically approve a historical conclusion.</p>
      </div>

      <div className='coin-curator__writing-layout'>
        <div className='coin-curator__writing-form'>
          <WritingField
            id='coin-curator-title'
            label='Exhibit title'
            guidance='Use a concise title that signals the central idea.'
            value={draft.exhibitTitle}
            limit={COPY_LIMITS.exhibitTitle}
            rows={2}
            onChange={(value) => onFieldChange('exhibitTitle', value)}
          />
          <WritingField
            id='coin-curator-thesis'
            label='Exhibit thesis'
            guidance='Make a claim that compares at least two objects and responds to the inquiry.'
            value={draft.thesis}
            limit={COPY_LIMITS.thesis}
            onChange={(value) => onFieldChange('thesis', value)}
          />
          <WritingField
            id='coin-curator-conclusion'
            label='Concluding synthesis'
            guidance='Explain what becomes visible only when the three sources are read together.'
            value={draft.conclusion}
            limit={COPY_LIMITS.conclusion}
            onChange={(value) => onFieldChange('conclusion', value)}
          />
          <WritingField
            id='coin-curator-limitation'
            label='Limits and uncertainty'
            guidance='Name something the evidence cannot establish, a missing field, or a collection limitation.'
            value={draft.limitation}
            limit={COPY_LIMITS.limitation}
            onChange={(value) => onFieldChange('limitation', value)}
          />
        </div>

        <aside className='coin-curator__inquiry-brief'>
          <span>Your inquiry</span>
          <h3>{inquiry.label}</h3>
          <blockquote>{inquiry.question}</blockquote>
          <h4>A defensible exhibit should:</h4>
          <ul>
            <li>Separate visual observation from catalog metadata.</li>
            <li>Explain how evidence supports or complicates the thesis.</li>
            <li>Cite every object and retain image rights.</li>
            <li>Acknowledge what three catalog records cannot prove.</li>
          </ul>
        </aside>
      </div>

      <StageActions backLabel='Revise evidence' nextLabel='Review exhibition' onBack={onBack} onNext={onContinue} />
    </section>
  );
}

function CitationList({ coin }) {
  return (
    <div className='coin-curator__citations'>
      <h5>Sources and rights</h5>
      <ul>
        {coin.citations.map((citation) => (
          <li key={citation.key}>
            <strong>{citation.label}:</strong>{' '}
            {citation.href && isExternalUrl(citation.href) ? (
              <a href={citation.href} target='_blank' rel='noopener noreferrer'>{citation.value}</a>
            ) : citation.value}
          </li>
        ))}
        <li><strong>Rights holder:</strong> {coin.rightsHolder || 'Not recorded'}</li>
        <li><strong>SYRIOS catalog record:</strong> {coin.catalogPath}</li>
      </ul>
    </div>
  );
}

function ExhibitObject({ coin, index, entry }) {
  return (
    <article className='coin-curator__exhibit-object'>
      <header>
        <span>Object {index + 1}</span>
        <h3>{coin.displayName}</h3>
        <p>{coin.dateRange} · {safeText(coin.material)} · {safeText(coin.issuingAuthority)} · {safeText(coin.governingPower)}</p>
      </header>
      <CoinFaces coin={coin} />
      <dl className='coin-curator__exhibit-caption'>
        <div className='is-observation'><dt>Observed on the coin</dt><dd>{entry.observation || 'Not yet written'}</dd></div>
        <div className='is-catalog'><dt>Recorded in the catalog</dt><dd>{entry.catalogFact || 'Not yet written'}</dd></div>
        <div className='is-interpretation'><dt>Student interpretation</dt><dd>{entry.reasoning || 'Not yet written'}</dd></div>
      </dl>
      <CitationList coin={coin} />
    </article>
  );
}

function ReviewStage({ inquiry, draft, selectedCoins, rubric, onBack, onPrint, onRestart }) {
  return (
    <section className='coin-curator__stage coin-curator__stage--review' aria-labelledby='coin-curator-stage-title'>
      <div className='coin-curator__stage-heading coin-curator__screen-only'>
        <span className='coin-curator__eyebrow'>Step five / review and exhibit</span>
        <h2 id='coin-curator-stage-title' tabIndex='-1'>Check the evidence trail, then open the exhibition</h2>
        <p>The checklist confirms required structure and attribution. Historical interpretations remain open to discussion, revision, and instructor feedback.</p>
      </div>

      <div className='coin-curator__review-layout coin-curator__screen-only'>
        <aside className='coin-curator__rubric'>
          <div>
            <span>Structural review</span>
            <strong>{rubric.score}/{rubric.total}</strong>
          </div>
          <ul>
            {rubric.criteria.map((criterion) => (
              <li className={criterion.met ? 'is-met' : ''} key={criterion.id}>
                <span aria-hidden='true'>{criterion.met ? '✓' : '○'}</span>
                <div><strong>{criterion.label}</strong><small>{criterion.detail}</small></div>
              </li>
            ))}
          </ul>
        </aside>
        <div className='coin-curator__review-actions'>
          <h3>{rubric.score === rubric.total ? 'The exhibition structure is complete.' : 'The exhibition can still be strengthened.'}</h3>
          <p>You may print an in-progress draft or return to any earlier stage. Missing writing is labeled honestly in the preview.</p>
          <button type='button' className='coin-curator__primary-button' onClick={onPrint}>Print exhibition</button>
          <button type='button' className='coin-curator__secondary-button' onClick={onBack}>Return to writing</button>
          <button type='button' className='coin-curator__text-button' onClick={onRestart}>Start a new exhibition</button>
        </div>
      </div>

      <article className='coin-curator__exhibition' aria-labelledby='coin-curator-exhibition-title'>
        <header className='coin-curator__exhibition-header'>
          <span>SYRIOS student exhibition</span>
          <h2 id='coin-curator-exhibition-title'>{draft.exhibitTitle || inquiry.label}</h2>
          <p className='coin-curator__exhibition-inquiry'>{inquiry.question}</p>
          <div>
            <strong>Exhibit thesis</strong>
            <p>{draft.thesis || 'A thesis has not yet been written.'}</p>
          </div>
        </header>

        <div className='coin-curator__exhibition-objects'>
          {selectedCoins.map((coin, index) => (
            <ExhibitObject
              coin={coin}
              index={index}
              entry={draft.entries[coinIdentity(coin)] || blankEntry()}
              key={coin.id}
            />
          ))}
        </div>

        <section className='coin-curator__exhibition-conclusion'>
          <div><h3>Concluding synthesis</h3><p>{draft.conclusion || 'A conclusion has not yet been written.'}</p></div>
          <div><h3>Limits and uncertainty</h3><p>{draft.limitation || 'A limitation has not yet been recorded.'}</p></div>
        </section>

        <footer className='coin-curator__exhibition-footer'>
          <strong>Interpretive note</strong>
          <p>This student exhibition uses records in the SYRIOS collection. Catalog patterns are not direct measures of ancient production, circulation, survival, or use.</p>
        </footer>
      </article>
    </section>
  );
}

function StageActions({ backLabel, nextLabel, nextDisabled = false, onBack, onNext }) {
  return (
    <div className='coin-curator__stage-actions coin-curator__screen-only'>
      <button type='button' className='coin-curator__secondary-button' onClick={onBack}>{backLabel}</button>
      <button type='button' className='coin-curator__primary-button' disabled={nextDisabled} onClick={onNext}>{nextLabel}</button>
    </div>
  );
}

function LoadFailure({ kind, onRetry }) {
  const empty = kind === 'empty';
  return (
    <main id='coin-curator' className='coin-curator__status-shell'>
      <section role={empty ? 'status' : 'alert'}>
        <span className='coin-curator__eyebrow'>Coin Curator</span>
        <h1>{empty ? 'No exhibition-ready coins are available' : 'The collection could not be loaded'}</h1>
        <p>{empty
          ? 'Coin Curator needs three records with two coin faces, usable chronology, inquiry metadata, and source attribution.'
          : 'The live Strapi collection is required to build a sourced exhibition. Your saved local draft has not been changed.'}</p>
        {!empty && <button type='button' onClick={onRetry}>Try loading the collection again</button>}
        <Link to='/Toolbox'>Return to the Toolbox</Link>
      </section>
    </main>
  );
}

const findStartingStage = (draft) => {
  if (draft.selectedCoinIds.length !== CURATOR_EXHIBIT_SIZE) {
    return hasDraftWork(draft) ? 'sources' : 'inquiry';
  }
  const entriesComplete = draft.selectedCoinIds.every((id) => {
    const entry = draft.entries[id] || blankEntry();
    return entry.observation.trim() && entry.catalogFact.trim() && entry.reasoning.trim();
  });
  if (!entriesComplete) return 'evidence';
  const writingComplete = draft.exhibitTitle.trim()
    && draft.thesis.trim()
    && draft.conclusion.trim()
    && draft.limitation.trim();
  return writingComplete ? 'review' : 'thesis';
};

const CoinCurator = () => {
  const [status, setStatus] = useState('loading');
  const [coins, setCoins] = useState([]);
  const [draft, setDraft] = useState(() => createCuratorDraft());
  const [stage, setStage] = useState('inquiry');
  const [restoredDraft, setRestoredDraft] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(CANDIDATE_BATCH_SIZE);
  const [announcement, setAnnouncement] = useState('');
  const stageHeadingRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCoins() {
      setStatus('loading');
      setStorageReady(false);
      try {
        const response = await coinCollectionsRequest.coinCollection();
        const normalized = normalizeCuratorCoins(response?.data?.data || []);
        const anyCompleteInquiry = Object.keys(COIN_CURATOR_INQUIRIES).some((inquiryId) => (
          normalized.filter((coin) => isEligibleCuratorCoin(coin, inquiryId)).length >= CURATOR_EXHIBIT_SIZE
        ));
        if (cancelled) return;
        setCoins(normalized);
        if (!normalized.length || !anyCompleteInquiry) {
          setStatus('empty');
          return;
        }

        let recovered = null;
        try {
          const saved = window.localStorage.getItem(CURATOR_DRAFT_STORAGE_KEY);
          if (saved) recovered = restoreCuratorDraft(saved, normalized);
        } catch {
          recovered = null;
        }

        const nextDraft = recovered && hasDraftWork(recovered) ? recovered : createCuratorDraft();
        setDraft(nextDraft);
        setRestoredDraft(recovered && hasDraftWork(recovered) ? recovered : null);
        setStage(recovered && hasDraftWork(recovered) ? findStartingStage(recovered) : 'inquiry');
        setStatus('ready');
        setStorageReady(true);
      } catch (error) {
        console.error('Coin Curator could not load the coin collection:', error);
        if (!cancelled) setStatus('error');
      }
    }

    loadCoins();
    return () => { cancelled = true; };
  }, [loadAttempt]);

  useEffect(() => {
    if (!storageReady || status !== 'ready') return;
    try {
      window.localStorage.setItem(CURATOR_DRAFT_STORAGE_KEY, serializeCuratorDraft(draft, coins));
    } catch {
      // Storage may be unavailable in private browsing; the in-memory draft still works.
    }
  }, [coins, draft, status, storageReady]);

  useEffect(() => {
    if (status !== 'ready') return;
    const heading = document.getElementById('coin-curator-stage-title');
    stageHeadingRef.current = heading;
    heading?.focus();
  }, [stage, status]);

  useEffect(() => {
    setVisibleCount(CANDIDATE_BATCH_SIZE);
  }, [search, filter, draft.inquiryId]);

  const inquiry = getCuratorInquiry(draft.inquiryId);
  const availability = useMemo(() => Object.fromEntries(
    Object.keys(COIN_CURATOR_INQUIRIES).map((inquiryId) => [
      inquiryId,
      coins.filter((coin) => isEligibleCuratorCoin(coin, inquiryId)).length,
    ]),
  ), [coins]);
  const eligibleCoins = useMemo(
    () => coins.filter((coin) => isEligibleCuratorCoin(coin, draft.inquiryId)),
    [coins, draft.inquiryId],
  );
  const coinLookup = useMemo(() => new Map(coins.map((coin) => [coinIdentity(coin), coin])), [coins]);
  const selectedCoins = useMemo(
    () => draft.selectedCoinIds.map((id) => coinLookup.get(coinIdentity(id))).filter(Boolean),
    [coinLookup, draft.selectedCoinIds],
  );
  const suggestions = useMemo(
    () => suggestCuratorCoins(coins, draft.inquiryId, selectedCoins),
    [coins, draft.inquiryId, selectedCoins],
  );
  const filterOptions = useMemo(() => [...new Set(
    eligibleCoins.map((coin) => coin[inquiry.field]).filter(Boolean),
  )].sort((a, b) => String(a).localeCompare(String(b))), [eligibleCoins, inquiry.field]);
  const orderedCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orderCuratorCandidates(coins, draft.inquiryId, selectedCoins).filter((coin) => {
      if (filter !== 'all' && coin[inquiry.field] !== filter) return false;
      if (!query) return true;
      return [
        coin.displayName,
        coin.coinId,
        coin.material,
        coin.issuingAuthority,
        coin.governingPower,
        coin.mint,
        coin.dateRange,
      ].filter(Boolean).join(' ').toLowerCase().includes(query);
    });
  }, [coins, draft.inquiryId, filter, inquiry.field, search, selectedCoins]);
  const comparisonRows = useMemo(() => buildEvidenceComparisonRows(selectedCoins), [selectedCoins]);
  const rubric = useMemo(() => calculateCuratorRubric(draft, coins), [coins, draft]);

  const changeStage = (nextStage) => {
    if (!STAGES.some(({ key }) => key === nextStage)) return;
    if (STAGES.findIndex(({ key }) => key === nextStage) > 1 && selectedCoins.length !== CURATOR_EXHIBIT_SIZE) {
      setAnnouncement('Select exactly three eligible coins before continuing.');
      setStage('sources');
      return;
    }
    setStage(nextStage);
  };

  const chooseInquiry = (inquiryId, continueRestored = false) => {
    if (continueRestored && restoredDraft) {
      setStage(findStartingStage(draft));
      setRestoredDraft(null);
      return;
    }
    if (hasDraftWork(draft)) {
      const confirmed = window.confirm('Starting this inquiry will clear the current local exhibition draft. Continue?');
      if (!confirmed) return;
    }
    setDraft(createCuratorDraft(inquiryId));
    setRestoredDraft(null);
    setSearch('');
    setFilter('all');
    setStage('sources');
    setAnnouncement(`${getCuratorInquiry(inquiryId).label} selected.`);
  };

  const addCoin = (coin) => {
    const id = coinIdentity(coin);
    setDraft((current) => {
      if (current.selectedCoinIds.includes(id) || current.selectedCoinIds.length >= CURATOR_EXHIBIT_SIZE) return current;
      return {
        ...current,
        selectedCoinIds: [...current.selectedCoinIds, id],
        entries: { ...current.entries, [id]: current.entries[id] || blankEntry() },
      };
    });
    setAnnouncement(`${coin.displayName} added to the exhibit.`);
  };

  const removeCoin = (coinId) => {
    const id = coinIdentity(coinId);
    const name = coinLookup.get(id)?.displayName || 'Coin';
    setDraft((current) => {
      const nextEntries = { ...current.entries };
      delete nextEntries[id];
      return { ...current, selectedCoinIds: current.selectedCoinIds.filter((value) => value !== id), entries: nextEntries };
    });
    setAnnouncement(`${name} removed from the exhibit.`);
  };

  const moveCoin = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= draft.selectedCoinIds.length) return;
    setDraft((current) => {
      if (nextIndex < 0 || nextIndex >= current.selectedCoinIds.length) return current;
      const selectedCoinIds = [...current.selectedCoinIds];
      [selectedCoinIds[index], selectedCoinIds[nextIndex]] = [selectedCoinIds[nextIndex], selectedCoinIds[index]];
      return { ...current, selectedCoinIds };
    });
    setAnnouncement(`Exhibit object moved ${direction < 0 ? 'earlier' : 'later'}.`);
  };

  const completeWithSuggestions = () => {
    setDraft((current) => {
      const remaining = CURATOR_EXHIBIT_SIZE - current.selectedCoinIds.length;
      const additions = suggestions.slice(0, remaining);
      const ids = additions.map(coinIdentity);
      return {
        ...current,
        selectedCoinIds: [...current.selectedCoinIds, ...ids],
        entries: {
          ...current.entries,
          ...Object.fromEntries(ids.map((id) => [id, current.entries[id] || blankEntry()])),
        },
      };
    });
    setAnnouncement('Suggested contrasting coins added to the source set.');
  };

  const updateEntry = (coinId, field, value) => {
    const id = coinIdentity(coinId);
    setDraft((current) => ({
      ...current,
      entries: {
        ...current.entries,
        [id]: { ...(current.entries[id] || blankEntry()), [field]: value },
      },
    }));
  };

  const updateField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const restart = () => {
    if (hasDraftWork(draft) && !window.confirm('Clear this locally saved exhibition and begin again?')) return;
    try { window.localStorage.removeItem(CURATOR_DRAFT_STORAGE_KEY); } catch { /* no-op */ }
    setDraft(createCuratorDraft());
    setRestoredDraft(null);
    setSearch('');
    setFilter('all');
    setStage('inquiry');
    setAnnouncement('Local exhibition draft cleared.');
  };

  if (status === 'loading') return <div id='coin-curator' aria-busy='true'><LoadingPage /></div>;
  if (status === 'error' || status === 'empty') return <LoadFailure kind={status} onRetry={() => setLoadAttempt((value) => value + 1)} />;

  return (
    <main id='coin-curator'>
      <NoFeedBackIcon formfor='coin-curator' />
      <div className='coin-curator__live-region' aria-live='polite' aria-atomic='true'>{announcement}</div>

      <header className='coin-curator__hero coin-curator__screen-only'>
        <div>
          <span className='coin-curator__eyebrow'>Primary sources / student interpretation</span>
          <h1>Coin Curator</h1>
          <p>Build a three-object exhibition from the live SYRIOS catalog. Observe carefully, cite recorded evidence, and make a historical claim that remains honest about uncertainty.</p>
        </div>
        <aside>
          <span>Draft status</span>
          <strong>Saved in this browser</strong>
          <button type='button' onClick={restart}>Clear draft</button>
        </aside>
      </header>

      {restoredDraft && stage !== 'inquiry' && (
        <div className='coin-curator__restored-banner coin-curator__screen-only' role='status'>
          <span><strong>Saved draft restored.</strong> Your source set and writing remain stored only in this browser.</span>
          <button type='button' onClick={() => setRestoredDraft(null)}>Dismiss</button>
        </div>
      )}

      <StageProgress activeStage={stage} selectedCount={selectedCoins.length} onStageChange={changeStage} />

      <div className='coin-curator__workspace'>
        {stage === 'inquiry' && <InquiryStage availability={availability} restored={restoredDraft} onChoose={chooseInquiry} />}
        {stage === 'sources' && (
          <SourcesStage
            inquiry={inquiry}
            eligibleCoins={eligibleCoins}
            selectedCoins={selectedCoins}
            orderedCandidates={orderedCandidates}
            suggestions={suggestions}
            search={search}
            filter={filter}
            filterOptions={filterOptions}
            visibleCount={visibleCount}
            onSearch={setSearch}
            onFilter={setFilter}
            onShowMore={() => setVisibleCount((value) => value + CANDIDATE_BATCH_SIZE)}
            onAdd={addCoin}
            onRemove={removeCoin}
            onMove={moveCoin}
            onCompleteSuggestions={completeWithSuggestions}
            onBack={() => changeStage('inquiry')}
            onContinue={() => changeStage('evidence')}
          />
        )}
        {stage === 'evidence' && (
          <EvidenceStage
            inquiry={inquiry}
            selectedCoins={selectedCoins}
            entries={draft.entries}
            rows={comparisonRows}
            onEntryChange={updateEntry}
            onBack={() => changeStage('sources')}
            onContinue={() => changeStage('thesis')}
          />
        )}
        {stage === 'thesis' && (
          <ThesisStage
            inquiry={inquiry}
            draft={draft}
            onFieldChange={updateField}
            onBack={() => changeStage('evidence')}
            onContinue={() => changeStage('review')}
          />
        )}
        {stage === 'review' && (
          <ReviewStage
            inquiry={inquiry}
            draft={draft}
            selectedCoins={selectedCoins}
            rubric={rubric}
            onBack={() => changeStage('thesis')}
            onPrint={() => window.print()}
            onRestart={restart}
          />
        )}
      </div>
    </main>
  );
};

export default CoinCurator;
