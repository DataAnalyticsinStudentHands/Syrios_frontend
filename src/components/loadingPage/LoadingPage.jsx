import React, { useId } from 'react';
import {
  LOADING_PAGE_A11Y,
  resolveLoadingPagePreset,
} from './loadingPagePresets';

function LoadingArtwork({ artwork, variant }) {
  return (
    <div
      className={'loading-page__art loading-page__art--' + variant}
      aria-hidden='true'
    >
      {artwork.map((part) => (
        <span
          className={'loading-page__art-part loading-page__art-part--' + part}
          key={part}
        />
      ))}
    </div>
  );
}

function LoadingStages({ activeStage, stages }) {
  if (stages.length < 2) return null;

  return (
    <div className='loading-page__stages' aria-hidden='true'>
      {stages.map((stage, index) => (
        <React.Fragment key={stage}>
          {index > 0 && (
            <i className={'loading-page__stage-line' + (index <= activeStage ? ' is-complete' : '')}>
              <span />
            </i>
          )}
          <span className={index === activeStage ? 'is-active' : index < activeStage ? 'is-complete' : ''}>
            {stage}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

const LoadingPage = ({
  className = '',
  eyebrow,
  message,
  phase,
  title,
  variant,
}) => {
  const preset = resolveLoadingPagePreset(variant, phase);
  const headingId = useId();
  const messageId = useId();
  const rootClassName = [
    'loading-page',
    'loading-page--' + preset.variant,
    className,
  ].filter(Boolean).join(' ');

  return (
    <main
      {...LOADING_PAGE_A11Y.shell}
      className={rootClassName}
      aria-labelledby={headingId}
      aria-describedby={messageId}
      data-loading-phase={preset.phase}
      data-loading-variant={preset.variant}
    >
      <section className='loading-page__panel' {...LOADING_PAGE_A11Y.status}>
        <LoadingArtwork artwork={preset.artwork} variant={preset.variant} />
        <p className='loading-page__eyebrow'>{eyebrow ?? preset.eyebrow}</p>
        <h1 id={headingId}>{title ?? preset.title}</h1>
        <p className='loading-page__message' id={messageId}>{message ?? preset.message}</p>
        <LoadingStages activeStage={preset.activeStage} stages={preset.stages} />
      </section>
    </main>
  );
};

export default LoadingPage;
