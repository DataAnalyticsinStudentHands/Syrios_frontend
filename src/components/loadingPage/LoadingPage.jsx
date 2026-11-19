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
  compact = false,
  eyebrow,
  message,
  phase,
  title,
  variant,
}) => {
  const preset = resolveLoadingPagePreset(variant, phase);
  const headingId = useId();
  const messageId = useId();
  // Embedded results share their page's landmark and heading hierarchy.
  const Shell = compact ? 'section' : 'main';
  const Heading = compact ? 'h2' : 'h1';
  const rootClassName = [
    'loading-page',
    'loading-page--' + preset.variant,
    compact && 'loading-page--compact',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Shell
      {...LOADING_PAGE_A11Y.shell}
      className={rootClassName}
      aria-labelledby={headingId}
      aria-describedby={messageId}
      data-loading-phase={preset.phase}
      data-loading-variant={preset.variant}
    >
      <section className='loading-page__panel' {...LOADING_PAGE_A11Y.status}>
        <LoadingArtwork artwork={preset.artwork} variant={preset.artworkVariant ?? preset.variant} />
        <p className='loading-page__eyebrow'>{eyebrow ?? preset.eyebrow}</p>
        <Heading id={headingId}>{title ?? preset.title}</Heading>
        <p className='loading-page__message' id={messageId}>{message ?? preset.message}</p>
        <LoadingStages activeStage={preset.activeStage} stages={preset.stages} />
        {/* Indeterminate activity only: elapsed time is not download progress. */}
        <div className='loading-page__activity' aria-hidden='true'><span /><span /><span /></div>
      </section>
    </Shell>
  );
};

export default LoadingPage;
