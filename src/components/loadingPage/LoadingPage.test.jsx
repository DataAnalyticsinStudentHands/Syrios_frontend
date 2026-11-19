// @vitest-environment jsdom

import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import LoadingPage from './LoadingPage';

afterEach(cleanup);

describe('loading presentation', () => {
  it('announces its purpose and keeps decorative animation out of the status name', () => {
    const { container } = render(<LoadingPage variant='video' title='Opening the film archive' />);

    expect(screen.getByRole('main', { name: 'Opening the film archive' })).toBeTruthy();
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
    expect(container.querySelector('.loading-page__art--video').getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('embeds inside existing page content without another main or top-level heading', () => {
    render(<main><h1>Glossary</h1><LoadingPage variant='glossary' compact title='Finding this term' /></main>);

    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: 'Finding this term' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Finding this term' })).toBeTruthy();
  });

  it('updates the visible timeline stage only when its real phase changes', () => {
    const view = render(<LoadingPage variant='coin-time' phase='timeline' />);
    expect(view.container.querySelector('.loading-page__stages > .is-active').textContent).toBe('Timeline');

    view.rerender(<LoadingPage variant='coin-time' phase='evidence' />);
    expect(view.container.querySelector('.loading-page__stages > .is-active').textContent).toBe('Coins & events');
    expect(view.container.querySelector('.loading-page__stages > .is-complete').textContent).toBe('Timeline');
  });
});
