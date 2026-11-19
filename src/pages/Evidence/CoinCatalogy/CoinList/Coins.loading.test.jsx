// @vitest-environment jsdom

import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CoinContextProvider } from 'src/context/coinContext';
import coinCollections from 'src/api/coin-collections';
import SearchBar from '../component/SearchBar';
import Coins from './Coins';

vi.mock('src/api/coin-collections', () => ({ default: { coinCollection: vi.fn() } }));
vi.mock('./CoinPaginate', () => ({
  default: ({ coins }) => <ul>{coins.map((coin) => <li key={coin.id}>{coin.attributes.obverse_type}</li>)}</ul>,
}));

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const row = { id: 1, attributes: { obverse_type: 'Portrait coin', from_year: -100, to_year: 100 } };
const renderCatalog = (overview = false) => render(
  <MemoryRouter>
    <CoinContextProvider>{overview && <SearchBar />}<Coins /></CoinContextProvider>
  </MemoryRouter>,
);

beforeEach(() => {
  sessionStorage.clear();
  coinCollections.coinCollection.mockReset();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('coin catalog loading states', () => {
  it('shows pending feedback until real results arrive instead of a false zero count', async () => {
    const request = deferred();
    coinCollections.coinCollection.mockReturnValueOnce(request.promise);
    renderCatalog();

    expect(screen.getByRole('heading', { name: 'Gathering the coin catalog' })).toBeTruthy();
    expect(screen.queryByText('Similar in catalog: 0')).toBeNull();
    await act(async () => { request.resolve({ data: { data: [row] } }); });

    expect(await screen.findByText('Portrait coin')).toBeTruthy();
    expect(screen.getByText('Similar in catalog: 1')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Gathering the coin catalog' })).toBeNull();
  });

  it('stops on failure, offers retry, and distinguishes a completed empty catalog', async () => {
    const first = deferred();
    const second = deferred();
    coinCollections.coinCollection.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    renderCatalog();
    await act(async () => { first.reject(new Error('offline')); });

    expect(await screen.findByRole('alert')).toHaveProperty('textContent', expect.stringContaining('We could not load the coin catalog.'));
    expect(screen.queryByRole('heading', { name: 'Gathering the coin catalog' })).toBeNull();
    expect(coinCollections.coinCollection).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByRole('heading', { name: 'Gathering the coin catalog' })).toBeTruthy();
    await act(async () => { second.resolve({ data: { data: [] } }); });

    expect(await screen.findByText('The coin catalog is currently empty.')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Gathering the coin catalog' })).toBeNull();
    expect(coinCollections.coinCollection).toHaveBeenCalledTimes(2);
  });

  it('renders cached rows immediately without a redundant request or zero-count flash', () => {
    sessionStorage.setItem('coins', JSON.stringify([row]));
    renderCatalog();

    expect(screen.getByText('Portrait coin')).toBeTruthy();
    expect(screen.getByText('Similar in catalog: 1')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Gathering the coin catalog' })).toBeNull();
    expect(coinCollections.coinCollection).not.toHaveBeenCalled();
  });

  it('shares one pending request between overview filters and catalog results', async () => {
    const request = deferred();
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    coinCollections.coinCollection.mockReturnValueOnce(request.promise);
    renderCatalog(true);
    await waitFor(() => expect(coinCollections.coinCollection).toHaveBeenCalledTimes(1));
    await act(async () => { request.resolve({ data: { data: [row] } }); });

    expect(await screen.findByText('Portrait coin')).toBeTruthy();
    expect(coinCollections.coinCollection).toHaveBeenCalledTimes(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('treats a malformed response as a load failure rather than an empty collection', async () => {
    coinCollections.coinCollection.mockResolvedValueOnce({ data: {} });
    renderCatalog();

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.queryByText('The coin catalog is currently empty.')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Gathering the coin catalog' })).toBeNull();
  });
});
