// @vitest-environment jsdom

import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import glossaryRequest from 'src/api/glossary';
import Glossary from './Glossary';
import GlossaryTerm from './GlossaryTerm';

vi.mock('src/api/glossary', () => ({ default: { glossaryFind: vi.fn(), glossaryFindByTerm: vi.fn() } }));

const deferred = () => {
  let resolve;
  const promise = new Promise((yes) => { resolve = yes; });
  return { promise, resolve };
};

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe('nested glossary loading', () => {
  it('replaces the inline list loader with fetched term links', async () => {
    const request = deferred();
    glossaryRequest.glossaryFind.mockReturnValueOnce(request.promise);
    const router = createMemoryRouter([{ path: '/:group', element: <Glossary /> }], { initialEntries: ['/all'] });
    const { container } = render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Gathering the glossary terms' })).toBeTruthy();
    expect(container.querySelector('.loading-page--compact')).toBeTruthy();
    await act(async () => { request.resolve({ data: { data: [{ id: 1, term: 'Antioch' }] } }); });

    expect(await screen.findByRole('link', { name: 'Antioch' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Gathering the glossary terms' })).toBeNull();
  });

  it('keeps the new entry loading when an older navigation request finishes first', async () => {
    const oldEntry = deferred();
    const newEntry = deferred();
    glossaryRequest.glossaryFindByTerm.mockReturnValueOnce(oldEntry.promise).mockReturnValueOnce(newEntry.promise);
    const router = createMemoryRouter([{ path: '/term/:term', element: <GlossaryTerm /> }], { initialEntries: ['/term/Alpha'] });
    render(<RouterProvider router={router} />);
    await act(async () => { await router.navigate('/term/Beta'); });
    await act(async () => { oldEntry.resolve({ data: { data: [{ term: 'Alpha' }] } }); });

    expect(screen.getByRole('heading', { name: 'Opening the glossary entry' })).toBeTruthy();
    expect(screen.queryByText('Alpha')).toBeNull();
    await act(async () => { newEntry.resolve({ data: { data: [{ term: 'Beta', definition: '<p>Current entry</p>' }] } }); });

    expect(await screen.findByText('Beta')).toBeTruthy();
    expect(screen.getByText('Current entry')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Opening the glossary entry' })).toBeNull();
  });
});
