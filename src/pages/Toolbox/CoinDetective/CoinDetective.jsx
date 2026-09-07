import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import coinCollectionsRequest from 'src/api/coin-collections';
import NoFeedBackIcon from 'src/components/constant/NoFeedBackIcon';
import {
  COIN_DETECTIVE_MODES,
  buildQuestionDeck,
  findComparisonCoin,
  getComparisonRows,
  getEligibleDetectiveCoins,
  normalizeDetectiveCoins,
  scoreDetectiveAnswers,
} from './coinDetectiveData';

const MODE_OPTIONS = Object.values(COIN_DETECTIVE_MODES);
const STAGES = [
  { key: 'inspect', label: 'Inspect' },
  { key: 'attribute', label: 'Attribute' },
  { key: 'reveal', label: 'Reveal' },
];

const CATALOG_FIELDS = [
  { key: 'dateRange', label: 'Cataloged date' },
  { key: 'material', label: 'Material' },
  { key: 'authority', label: 'Issuing authority' },
  { key: 'power', label: 'Governing power' },
  { key: 'denomination', label: 'Denomination' },
  { key: 'language', label: 'Language' },
  { key: 'mint', label: 'Mint' },
  { key: 'territory', label: 'Ancient territory' },
];

const safeValue = (value) => value || 'Not recorded';

const isWebUrl = (value) => /^https?:\/\//i.test(value || '');

function DetectiveLoading() {
  return (
    <main id='coin-detective' aria-busy='true'>
      <section className='coin-detective__loading' role='status' aria-live='polite'>
        <div className='coin-detective__loading-art' aria-hidden='true'>
          <span className='coin-detective__loading-coin' />
          <span className='coin-detective__loading-lens' />
        </div>
        <span className='coin-detective__eyebrow'>Collection evidence lab</span>
        <h1>Preparing your case file</h1>
        <p>Loading coin faces, dates, classifications, places, and source information from Strapi.</p>
      </section>
    </main>
  );
}

function StageProgress({ stage }) {
  const activeIndex = STAGES.findIndex((item) => item.key === stage);
  return (
    <nav className='coin-detective__progress' aria-label='Investigation progress'>
      <ol>
        {STAGES.map((item, index) => (
          <li
            key={item.key}
            className={index === activeIndex ? 'is-current' : index < activeIndex ? 'is-complete' : ''}
            aria-current={index === activeIndex ? 'step' : undefined}
          >
            <span>{index + 1}</span>
            {item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CoinViewer({ coin, revealed = false, compact = false }) {
  const initialSide = coin?.obverseImage ? 'obverse' : 'reverse';
  const [side, setSide] = useState(initialSide);
  const [zoomed, setZoomed] = useState(false);
  const image = side === 'obverse' ? coin?.obverseImage : coin?.reverseImage;

  useEffect(() => {
    setSide(coin?.obverseImage ? 'obverse' : 'reverse');
    setZoomed(false);
  }, [coin?.id, coin?.obverseImage, coin?.reverseImage]);

  if (!coin) return null;

  return (
    <section className={`coin-detective__viewer${compact ? ' coin-detective__viewer--compact' : ''}`} aria-label='Coin face viewer'>
      <div className='coin-detective__viewer-heading'>
        <div>
          <span>{revealed ? 'Catalog record' : 'Case coin'}</span>
          <strong>{revealed ? coin.displayName : 'Identity concealed'}</strong>
        </div>
        {!compact && (
          <button
            type='button'
            className='coin-detective__text-button'
            onClick={() => setZoomed((value) => !value)}
            aria-pressed={zoomed}
          >
            {zoomed ? 'Reset view' : 'Examine closely'}
          </button>
        )}
      </div>

      <div className={`coin-detective__image-stage${zoomed ? ' is-zoomed' : ''}`}>
        {image ? (
          <img
            src={image.url}
            alt={revealed ? image.alt : `${side === 'obverse' ? 'Obverse' : 'Reverse'} of the concealed case coin`}
          />
        ) : (
          <span className='coin-detective__image-missing'>Image not recorded</span>
        )}
        <span className='coin-detective__face-label'>{side}</span>
      </div>

      <div className='coin-detective__face-switcher' role='group' aria-label='Choose coin face'>
        <button
          type='button'
          onClick={() => {
            setSide('obverse');
            setZoomed(false);
          }}
          className={side === 'obverse' ? 'is-active' : ''}
          aria-pressed={side === 'obverse'}
          disabled={!coin.obverseImage}
        >
          Obverse
        </button>
        <button
          type='button'
          onClick={() => {
            setSide('reverse');
            setZoomed(false);
          }}
          className={side === 'reverse' ? 'is-active' : ''}
          aria-pressed={side === 'reverse'}
          disabled={!coin.reverseImage}
        >
          Reverse
        </button>
      </div>
    </section>
  );
}

function WelcomePanel({ selectedMode, onSelectMode, onStart, availability, totalCoins }) {
  return (
    <section className='coin-detective__welcome' aria-labelledby='coin-detective-welcome-title'>
      <div className='coin-detective__welcome-copy'>
        <span className='coin-detective__eyebrow'>Collection evidence lab</span>
        <h1 id='coin-detective-welcome-title'>Coin Detective</h1>
        <p className='coin-detective__lede'>
          Look closely, form a hypothesis, and then test it against the catalog. The goal is not to guess from appearance alone; it is to learn how numismatic evidence is described, connected, and questioned.
        </p>
        <div className='coin-detective__principle'>
          <strong>Observation is not attribution.</strong>
          <span>A photograph can suggest an answer. A catalog record supplies documented context.</span>
        </div>
      </div>

      <div className='coin-detective__mode-panel'>
        <div className='coin-detective__section-heading'>
          <span>Choose an investigation</span>
          <p>Every question is generated only from fields recorded for that coin.</p>
        </div>
        <div className='coin-detective__mode-grid' aria-label='Investigation type'>
          {MODE_OPTIONS.map((mode) => {
            const count = availability[mode.key]?.length || 0;
            const selected = selectedMode === mode.key;
            return (
              <button
                type='button'
                aria-pressed={selected}
                className={`coin-detective__mode${selected ? ' is-selected' : ''}`}
                key={mode.key}
                onClick={() => onSelectMode(mode.key)}
                disabled={count === 0}
              >
                <span>{mode.eyebrow}</span>
                <strong>{mode.label}</strong>
                <p>{mode.description}</p>
                <small>{count.toLocaleString()} case-ready coins</small>
              </button>
            );
          })}
        </div>
        <button
          type='button'
          className='coin-detective__primary-button coin-detective__start-button'
          onClick={() => onStart(selectedMode)}
          disabled={!availability[selectedMode]?.length}
        >
          Open a surprise case
        </button>
        <p className='coin-detective__data-note'>
          {totalCoins.toLocaleString()} catalog records reviewed. Incomplete and uncertain fields remain visible in the reveal, but are not silently turned into ordinary quiz answers.
        </p>
      </div>

      <div className='coin-detective__how-it-works' aria-label='How the investigation works'>
        <article>
          <span>01</span>
          <strong>Inspect</strong>
          <p>Study both faces and record what you notice before labels appear.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Attribute</strong>
          <p>Choose catalog classifications using visual clues and contextual knowledge.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Reveal</strong>
          <p>Compare your reasoning with the record, its sources, its time, and its place.</p>
        </article>
      </div>
    </section>
  );
}

function InspectStage({ coin, notes, onNotesChange, onContinue, headingRef }) {
  return (
    <section className='coin-detective__stage' aria-labelledby='coin-detective-inspect-title'>
      <CoinViewer coin={coin} />
      <div className='coin-detective__workspace'>
        <span className='coin-detective__eyebrow'>Step one / close observation</span>
        <h2 id='coin-detective-inspect-title' ref={headingRef} tabIndex='-1'>What can you see before the labels appear?</h2>
        <p>Move between both faces. Separate what is visibly present from what you think it might mean.</p>

        <div className='coin-detective__prompt-list'>
          <article>
            <span aria-hidden='true'>I</span>
            <div>
              <strong>Figures and portraits</strong>
              <p>Who or what is shown? Notice direction, clothing, attributes, and posture.</p>
            </div>
          </article>
          <article>
            <span aria-hidden='true'>II</span>
            <div>
              <strong>Objects and symbols</strong>
              <p>Look for animals, weapons, plants, architecture, and small control marks.</p>
            </div>
          </article>
          <article>
            <span aria-hidden='true'>III</span>
            <div>
              <strong>Letters and inscriptions</strong>
              <p>Record visible shapes without assuming a translation.</p>
            </div>
          </article>
        </div>

        <label className='coin-detective__notes'>
          <span>Your field notes <small>optional</small></span>
          <textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            maxLength='1200'
            placeholder='I notice...'
          />
          <small>{notes.length}/1200. Notes stay in this browser and are not submitted.</small>
        </label>

        <div className='coin-detective__stage-actions'>
          <button type='button' className='coin-detective__primary-button' onClick={onContinue}>
            Build an attribution
          </button>
        </div>
      </div>
    </section>
  );
}

function AttributeStage({
  coin,
  questions,
  questionIndex,
  answers,
  showHint,
  onToggleHint,
  onAnswer,
  onPrevious,
  onNext,
  headingRef,
}) {
  const question = questions[questionIndex];
  const selectedAnswer = answers[question.key] || '';
  const isLast = questionIndex === questions.length - 1;
  const progress = ((questionIndex + 1) / questions.length) * 100;

  return (
    <section className='coin-detective__stage coin-detective__stage--attribute' aria-labelledby='coin-detective-question-title'>
      <CoinViewer coin={coin} />
      <div className='coin-detective__workspace'>
        <div className='coin-detective__question-meta'>
          <span className='coin-detective__eyebrow'>Step two / working attribution</span>
          <span>{questionIndex + 1} of {questions.length}</span>
        </div>
        <div className='coin-detective__question-progress' role='progressbar' aria-label='Attribution questions' aria-valuemin='0' aria-valuemax='100' aria-valuenow={Math.round(progress)}>
          <span style={{ width: `${progress}%` }} />
        </div>

        <fieldset className='coin-detective__question'>
          <legend id='coin-detective-question-title' ref={headingRef} tabIndex='-1'>{question.prompt}</legend>
          <p className='coin-detective__question-note'>Choose the hypothesis you think best matches the evidence. Results remain concealed until the final reveal.</p>
          <div className='coin-detective__choices'>
            {question.options.map((option) => (
              <label className={selectedAnswer === option ? 'is-selected' : ''} key={option}>
                <input
                  type='radio'
                  name={`coin-detective-${question.key}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => onAnswer(question.key, option)}
                />
                <span aria-hidden='true' />
                <strong>{option}</strong>
              </label>
            ))}
          </div>
        </fieldset>

        <div className='coin-detective__hint'>
          <button type='button' className='coin-detective__text-button' onClick={onToggleHint} aria-expanded={showHint}>
            {showHint ? 'Hide thinking prompt' : 'Need a thinking prompt?'}
          </button>
          {showHint && <p>{question.hint}</p>}
        </div>

        <div className='coin-detective__stage-actions coin-detective__stage-actions--split'>
          <button type='button' className='coin-detective__secondary-button' onClick={onPrevious}>
            {questionIndex === 0 ? 'Back to notes' : 'Previous question'}
          </button>
          <button type='button' className='coin-detective__primary-button' onClick={onNext} disabled={!selectedAnswer}>
            {isLast ? 'Reveal catalog evidence' : 'Next question'}
          </button>
        </div>
      </div>
    </section>
  );
}

function ContextCard({ eyebrow, title, children, linkTo, linkLabel }) {
  return (
    <article className='coin-detective__context-card'>
      <span>{eyebrow}</span>
      <strong>{title}</strong>
      <div>{children}</div>
      <Link to={linkTo}>{linkLabel} <span aria-hidden='true'>-&gt;</span></Link>
    </article>
  );
}

function ComparisonPanel({ coin, comparison }) {
  const rows = getComparisonRows(coin, comparison);
  if (!comparison) return null;

  return (
    <section className='coin-detective__comparison' aria-labelledby='coin-detective-comparison-title'>
      <div className='coin-detective__section-heading'>
        <span>Comparative case</span>
        <h3 id='coin-detective-comparison-title'>What changes when context changes?</h3>
        <p>The comparison favors shared context, especially the same mint, while looking for meaningful differences in classification and chronology.</p>
      </div>

      <div className='coin-detective__comparison-coins'>
        <CoinViewer coin={coin} revealed compact />
        <span className='coin-detective__versus' aria-hidden='true'>versus</span>
        <CoinViewer coin={comparison} revealed compact />
      </div>

      <div className='coin-detective__comparison-table' role='table' aria-label='Coin comparison'>
        <div className='coin-detective__comparison-row coin-detective__comparison-row--header' role='row'>
          <span role='columnheader'>Field</span>
          <span role='columnheader'>Case coin</span>
          <span role='columnheader'>Comparison</span>
        </div>
        {rows.map((row) => (
          <div className={`coin-detective__comparison-row${row.different ? ' is-different' : ''}`} role='row' key={row.key}>
            <strong role='rowheader'>{row.label}</strong>
            <span role='cell'>{row.a}</span>
            <span role='cell'>{row.b}</span>
          </div>
        ))}
      </div>

      <div className='coin-detective__comparison-links'>
        <Link to={`/Coin/${coin.id}`}>Open first record</Link>
        <Link to={`/Coin/${comparison.id}`}>Open comparison record</Link>
      </div>
    </section>
  );
}

function RevealStage({
  coin,
  comparison,
  mode,
  questions,
  answers,
  notes,
  onNewCase,
  onChooseMode,
  onStartComparison,
  headingRef,
}) {
  const score = scoreDetectiveAnswers(questions, answers);
  const matchPercent = score.total ? Math.round((score.correct / score.total) * 100) : 0;
  const modernPlace = [coin.modernName, coin.modernCountry].filter(Boolean).join(', ');

  return (
    <div className='coin-detective__reveal'>
      <section className='coin-detective__reveal-hero' aria-labelledby='coin-detective-reveal-title'>
        <CoinViewer coin={coin} revealed />
        <div className='coin-detective__workspace'>
          <span className='coin-detective__eyebrow'>Step three / catalog reveal</span>
          <h2 id='coin-detective-reveal-title' ref={headingRef} tabIndex='-1'>{coin.displayName}</h2>
          <p className='coin-detective__catalog-id'>{coin.coinId} / record {coin.id}</p>
          <div className='coin-detective__score'>
            <div>
              <strong>{score.correct} of {score.total}</strong>
              <span>hypotheses matched the catalog</span>
            </div>
            <div className='coin-detective__score-ring' style={{ '--score': `${matchPercent * 3.6}deg` }} aria-label={`${matchPercent}% catalog match`}>
              <span>{matchPercent}%</span>
            </div>
          </div>
          <p className='coin-detective__score-note'>A mismatch is useful evidence: revisit which clues were visible and which facts required external documentation.</p>
          <div className='coin-detective__reveal-actions'>
            <Link className='coin-detective__primary-button' to={`/Coin/${coin.id}`}>Open full catalog record</Link>
            <button type='button' className='coin-detective__secondary-button' onClick={() => window.print()}>Print case summary</button>
          </div>
        </div>
      </section>

      <section className='coin-detective__evidence' aria-labelledby='coin-detective-evidence-title'>
        <div className='coin-detective__section-heading'>
          <span>Hypothesis check</span>
          <h3 id='coin-detective-evidence-title'>Your choices beside the record</h3>
        </div>
        <div className='coin-detective__evidence-grid'>
          {questions.map((question) => {
            const matches = answers[question.key] === question.answer;
            return (
              <article className={matches ? 'is-match' : 'is-rethink'} key={question.key}>
                <span>{matches ? 'Catalog match' : 'Revisit the evidence'}</span>
                <strong>{question.label}</strong>
                <dl>
                  <div>
                    <dt>Your hypothesis</dt>
                    <dd>{answers[question.key] || 'No answer'}</dd>
                  </div>
                  <div>
                    <dt>Catalog record</dt>
                    <dd>{question.answer}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>

      <section className='coin-detective__catalog-evidence' aria-labelledby='coin-detective-catalog-title'>
        <div className='coin-detective__section-heading'>
          <span>Complete evidence card</span>
          <h3 id='coin-detective-catalog-title'>What the collection records</h3>
          <p>“Not recorded” and “Uncertain” are retained as meaningful limits of the available data.</p>
        </div>

        <div className='coin-detective__catalog-layout'>
          <dl className='coin-detective__metadata'>
            {CATALOG_FIELDS.map((field) => (
              <div key={field.key}>
                <dt>{field.label}</dt>
                <dd>{safeValue(coin[field.key])}</dd>
              </div>
            ))}
            <div>
              <dt>Diameter</dt>
              <dd>{coin.diameter ? `${coin.diameter} mm` : 'Not recorded'}</dd>
            </div>
          </dl>

          <div className='coin-detective__descriptions'>
            <article>
              <span>Obverse</span>
              <strong>{safeValue(coin.obverseType)}</strong>
              <p>{coin.obverseLegend ? `Legend: ${coin.obverseLegend}` : 'Legend not recorded'}</p>
            </article>
            <article>
              <span>Reverse</span>
              <strong>{safeValue(coin.reverseType)}</strong>
              <p>{coin.reverseLegend ? `Legend: ${coin.reverseLegend}` : 'Legend not recorded'}</p>
            </article>
            {coin.typeCategories.length > 0 && (
              <p className='coin-detective__tags'>
                {coin.typeCategories.map((category) => <span key={category}>{category}</span>)}
              </p>
            )}
          </div>
        </div>
      </section>

      {notes && (
        <section className='coin-detective__field-notes' aria-labelledby='coin-detective-notes-title'>
          <span>Before the reveal, you wrote</span>
          <blockquote id='coin-detective-notes-title'>{notes}</blockquote>
        </section>
      )}

      <section className='coin-detective__context' aria-labelledby='coin-detective-context-title'>
        <div className='coin-detective__section-heading'>
          <span>Place the evidence</span>
          <h3 id='coin-detective-context-title'>Connect this object to a wider history</h3>
        </div>
        <div className='coin-detective__context-grid'>
          <ContextCard eyebrow='Time' title={coin.dateRange} linkTo='/Evidence/Timeline' linkLabel='Open Coins in Time'>
            <p>Broad period: {safeValue(coin.period)}. Compare the issue with events and other coins across the chronology.</p>
          </ContextCard>
          <ContextCard eyebrow='Place of production' title={safeValue(coin.mint)} linkTo='/Evidence/MapCoins' linkLabel='Open Coins on a Map'>
            <p>{modernPlace || 'Modern place not recorded'}{coin.territory ? ` / ancient territory: ${coin.territory}` : ''}.</p>
          </ContextCard>
          <ContextCard eyebrow='Vocabulary' title={coin.typeCategories.join(', ') || safeValue(coin.language)} linkTo='/Toolbox/Glossary/all' linkLabel='Open the Glossary'>
            <p>Use collection terminology to distinguish what is depicted, what is inscribed, and who issued the coin.</p>
          </ContextCard>
        </div>
      </section>

      <section className='coin-detective__sources' aria-labelledby='coin-detective-sources-title'>
        <div>
          <span>Source literacy</span>
          <h3 id='coin-detective-sources-title'>Follow the record beyond this page</h3>
        </div>
        <dl>
          <div>
            <dt>Reference</dt>
            <dd>{safeValue(coin.reference)}</dd>
          </div>
          <div>
            <dt>Rights holder</dt>
            <dd>{safeValue(coin.rightHolder)}</dd>
          </div>
          <div>
            <dt>Image source</dt>
            <dd>
              {isWebUrl(coin.sourceImage)
                ? <a href={coin.sourceImage} target='_blank' rel='noreferrer'>Visit external source</a>
                : safeValue(coin.sourceImage)}
            </dd>
          </div>
        </dl>
      </section>

      {mode === 'comparison' ? (
        <ComparisonPanel coin={coin} comparison={comparison} />
      ) : (
        <section className='coin-detective__comparison-invite'>
          <div>
            <span>Ready to compare?</span>
            <h3>Hold one context steady and look for change.</h3>
            <p>Comparative cases pair this record with another cataloged coin and highlight both continuity and difference.</p>
          </div>
          <button type='button' className='coin-detective__secondary-button' onClick={onStartComparison}>Start a comparative case</button>
        </section>
      )}

      <section className='coin-detective__finish-actions' aria-label='Investigation actions'>
        <button type='button' className='coin-detective__primary-button' onClick={onNewCase}>Open another {COIN_DETECTIVE_MODES[mode].label.toLowerCase()}</button>
        <button type='button' className='coin-detective__secondary-button' onClick={onChooseMode}>Choose a different investigation</button>
      </section>
    </div>
  );
}

function CoinDetective() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [coins, setCoins] = useState([]);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [selectedMode, setSelectedMode] = useState('guided');
  const [mode, setMode] = useState('guided');
  const [stage, setStage] = useState('welcome');
  const [activeCoin, setActiveCoin] = useState(null);
  const [comparisonCoin, setComparisonCoin] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [showHint, setShowHint] = useState(false);
  const stageHeadingRef = useRef(null);
  const linkedCaseHandledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCollection() {
      setStatus('loading');
      try {
        const response = await coinCollectionsRequest.coinCollection();
        const normalized = normalizeDetectiveCoins(response?.data?.data || []);
        if (cancelled) return;
        setCoins(normalized);
        setStatus(normalized.length ? 'ready' : 'empty');
      } catch (error) {
        console.error('Coin Detective could not load the coin collection:', error);
        if (!cancelled) setStatus('error');
      }
    }

    loadCollection();
    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  const availability = useMemo(() => Object.fromEntries(
    MODE_OPTIONS.map((option) => [option.key, getEligibleDetectiveCoins(coins, option.key)]),
  ), [coins]);

  useEffect(() => {
    if (stage !== 'welcome') stageHeadingRef.current?.focus();
  }, [stage, questionIndex]);

  const beginChallenge = useCallback((nextMode, excludeId = null, requestedId = null) => {
    const eligible = availability[nextMode] || [];
    const requested = requestedId != null
      ? eligible.find((coin) => String(coin.id) === String(requestedId))
      : null;
    const choices = eligible.filter((coin) => String(coin.id) !== String(excludeId));
    const pool = choices.length ? choices : eligible;
    if (!pool.length) return;
    const chosen = requested || pool[Math.floor(Math.random() * pool.length)];
    const deck = buildQuestionDeck(chosen, coins, nextMode);

    setMode(nextMode);
    setSelectedMode(nextMode);
    setActiveCoin(chosen);
    setComparisonCoin(findComparisonCoin(chosen, coins));
    setQuestions(deck);
    setAnswers({});
    setQuestionIndex(0);
    setNotes('');
    setShowHint(false);
    setStage('inspect');
    setSearchParams(
      { mode: nextMode, case: String(chosen.id) },
      { replace: true },
    );
  }, [availability, coins, setSearchParams]);

  useEffect(() => {
    if (status !== 'ready' || linkedCaseHandledRef.current) return;
    linkedCaseHandledRef.current = true;
    const linkedMode = searchParams.get('mode');
    const linkedCase = searchParams.get('case');
    const caseExists = COIN_DETECTIVE_MODES[linkedMode]
      && availability[linkedMode]?.some((coin) => String(coin.id) === String(linkedCase));
    if (caseExists) beginChallenge(linkedMode, null, linkedCase);
  }, [availability, beginChallenge, searchParams, status]);

  const returnToWelcome = () => {
    setStage('welcome');
    setActiveCoin(null);
    setComparisonCoin(null);
    setQuestions([]);
    setAnswers({});
    setQuestionIndex(0);
    setNotes('');
    setSearchParams({}, { replace: true });
  };

  if (status === 'loading') return <DetectiveLoading />;

  if (status === 'error' || status === 'empty') {
    return (
      <main id='coin-detective'>
        <section className='coin-detective__error' role='alert'>
          <span className='coin-detective__eyebrow'>Collection evidence lab</span>
          <h1>{status === 'empty' ? 'No case-ready records were returned' : 'The case files could not be loaded'}</h1>
          <p>Coin Detective needs the current Strapi coin collection before it can generate evidence-based questions.</p>
          <button type='button' className='coin-detective__primary-button' onClick={() => setLoadAttempt((value) => value + 1)}>Try loading again</button>
        </section>
      </main>
    );
  }

  return (
    <main id='coin-detective'>
      <NoFeedBackIcon formfor='coin-detective' color='#a86818' />
      <div className='coin-detective__shell'>
        {stage === 'welcome' ? (
          <WelcomePanel
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
            onStart={beginChallenge}
            availability={availability}
            totalCoins={coins.length}
          />
        ) : (
          <>
            <header className='coin-detective__case-header'>
              <Link to='/Toolbox' className='coin-detective__back-link'>Toolbox</Link>
              <div>
                <span>Coin Detective</span>
                <strong>{COIN_DETECTIVE_MODES[mode].label}</strong>
              </div>
              <button type='button' className='coin-detective__text-button' onClick={returnToWelcome}>Close case</button>
            </header>
            <StageProgress stage={stage} />

            {stage === 'inspect' && (
              <InspectStage
                coin={activeCoin}
                notes={notes}
                onNotesChange={setNotes}
                onContinue={() => setStage('attribute')}
                headingRef={stageHeadingRef}
              />
            )}

            {stage === 'attribute' && questions[questionIndex] && (
              <AttributeStage
                coin={activeCoin}
                questions={questions}
                questionIndex={questionIndex}
                answers={answers}
                showHint={showHint}
                onToggleHint={() => setShowHint((value) => !value)}
                onAnswer={(key, value) => setAnswers((current) => ({ ...current, [key]: value }))}
                onPrevious={() => {
                  setShowHint(false);
                  if (questionIndex === 0) setStage('inspect');
                  else setQuestionIndex((value) => value - 1);
                }}
                onNext={() => {
                  setShowHint(false);
                  if (questionIndex === questions.length - 1) setStage('reveal');
                  else setQuestionIndex((value) => value + 1);
                }}
                headingRef={stageHeadingRef}
              />
            )}

            {stage === 'reveal' && (
              <RevealStage
                coin={activeCoin}
                comparison={comparisonCoin}
                mode={mode}
                questions={questions}
                answers={answers}
                notes={notes}
                onNewCase={() => beginChallenge(mode, activeCoin?.id)}
                onChooseMode={returnToWelcome}
                onStartComparison={() => beginChallenge('comparison', activeCoin?.id)}
                headingRef={stageHeadingRef}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default CoinDetective;
