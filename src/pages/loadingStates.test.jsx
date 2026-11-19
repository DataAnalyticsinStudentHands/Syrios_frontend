// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import About from './AboutUs/AboutUs';
import Timeline from './Toolbox/Timeline/Timeline';
import CoinInfoPage from './Evidence/CoinCatalogy/coin-info/CoinInfoPage';
import StoryReader from './Stories/StoryReader';

const requests = vi.hoisted(() => ({
  about: vi.fn(),
  timelineBackground: vi.fn(),
  timelineInfo: vi.fn(),
  coin: vi.fn(),
  story: vi.fn(),
  bibliography: vi.fn(),
}));

vi.mock('src/api/about-us', () => ({ default: { aboutUsFind: requests.about } }));
vi.mock('src/api/timeline', () => ({ default: { background: requests.timelineBackground, info: requests.timelineInfo } }));
vi.mock('src/api/coin-collections', () => ({ default: { fetchOne: requests.coin } }));
vi.mock('src/api/story', () => ({ default: { storyFindOne: requests.story } }));
vi.mock('src/api/zotero', () => ({ default: { getOneItemBib: requests.bibliography } }));
vi.mock('src/components/loadingPage/LoadingPage', () => ({
  default: ({ variant, phase }) => <div role='status' data-variant={variant} data-phase={phase}>Loading content</div>,
}));
vi.mock('src/components/coin/CoinInfo', () => ({ default: () => null }));
vi.mock('./Toolbox/Timeline/event/Event', () => ({ default: () => null }));
vi.mock('src/components/constant/NoFeedBackIcon', () => ({ default: () => null }));
vi.mock('./Evidence/CoinCatalogy/coin-info/CoinAnimations', () => ({ default: () => null }));
vi.mock('src/components/footer/Footer', () => ({
  default: ({ references = [] }) => <aside aria-label='Story references'>{references.map((reference) => <p key={reference}>{reference}</p>)}</aside>,
}));
vi.mock('./Stories/StoryComponents', () => ({
  default: (frame) => <section key={frame.id}>Story frame {frame.id}</section>,
}));
vi.mock('src/components/StoryScroller/StoryScroller', async () => {
  const { default: React } = await import('react');
  const StoryScroller = ({ render }) => render({ state: {}, fullpageApi: null });
  StoryScroller.Wrapper = React.Fragment;
  return { default: StoryScroller };
});

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
};

function NextPage({ to }) {
  const navigate = useNavigate();
  return <button type='button' onClick={() => navigate(to)}>Next record</button>;
}

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('page loading transitions', () => {
  it('replaces the About Us loader with a recoverable error when the request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    requests.about.mockRejectedValue(new Error('Network unavailable'));
    render(<About />);

    expect(screen.getByRole('status').dataset.variant).toBe('about');
    expect((await screen.findByRole('alert')).textContent).toContain('Please refresh the page to try again');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('keeps the timeline loading through the evidence request after its background is ready', async () => {
    const background = deferred();
    const evidence = deferred();
    requests.timelineBackground.mockReturnValue(background.promise);
    requests.timelineInfo.mockReturnValue(evidence.promise);
    render(<Timeline />);

    expect(screen.getByRole('status').dataset.phase).toBe('timeline');
    await act(async () => background.resolve({ data: { data: [
      { attributes: { y_date: -100 } },
      { attributes: { y_date: 100 } },
    ] } }));

    expect(requests.timelineInfo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status').dataset.phase).toBe('evidence');
    expect(screen.queryByRole('region', { name: 'Interactive coin timeline' })).toBeNull();

    await act(async () => evidence.resolve({ data: { data: { text: '', subtext: '', zone: [] } } }));

    expect(screen.getByRole('region', { name: 'Interactive coin timeline' })).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('shows the coin loader again when navigating between coin records', async () => {
    const secondCoin = deferred();
    requests.coin.mockResolvedValueOnce({ data: { data: { id: 1, obverse_type: 'First coin' } } });
    requests.coin.mockReturnValueOnce(secondCoin.promise);
    render(
      <MemoryRouter initialEntries={['/Coin/1']}>
        <NextPage to='/Coin/2' />
        <Routes><Route path='/Coin/:id' element={<CoinInfoPage />} /></Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'First coin' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next record' }));

    expect(requests.coin).toHaveBeenLastCalledWith('2');
    expect(screen.getByRole('status').dataset.variant).toBe('coin-detail');
    expect(screen.queryByRole('heading', { name: 'First coin' })).toBeNull();

    await act(async () => secondCoin.resolve({ data: { data: { id: 2, obverse_type: 'Second coin' } } }));

    expect(screen.getByRole('heading', { name: 'Second coin' })).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('shows the story loader again when navigating between story IDs', async () => {
    const secondStory = deferred();
    requests.story.mockResolvedValueOnce({ data: { data: { id: 1, name: 'First story', zone: [{ id: 'first' }] } } });
    requests.story.mockReturnValueOnce(secondStory.promise);
    render(
      <MemoryRouter initialEntries={['/StoryReader?id=1']}>
        <NextPage to='/StoryReader?id=2' />
        <Routes><Route path='/StoryReader' element={<StoryReader />} /></Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Story frame first')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next record' }));

    expect(requests.story).toHaveBeenLastCalledWith('2');
    expect(screen.getByRole('status').dataset.variant).toBe('story-reader');
    expect(screen.queryByText('Story frame first')).toBeNull();

    await act(async () => secondStory.resolve({ data: { data: { id: 2, name: 'Second story', zone: [{ id: 'second' }] } } }));

    expect(screen.getByText('Story frame second')).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it.each(['succeeds', 'fails'])('keeps the current citations when an older story bibliography %s late', async (outcome) => {
    const oldBibliography = deferred();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    requests.story.mockResolvedValueOnce({ data: { data: {
      id: 1, name: 'First story', zone: [{ id: 'first' }], references: { data: [{ item_key: 'OLD' }] },
    } } });
    requests.story.mockResolvedValueOnce({ data: { data: {
      id: 2, name: 'Second story', zone: [{ id: 'second' }], references: { data: [{ item_key: 'CURRENT' }] },
    } } });
    requests.bibliography.mockImplementation((key) => key === 'OLD'
      ? oldBibliography.promise
      : Promise.resolve({ data: 'Current story citation' }));
    render(
      <MemoryRouter initialEntries={['/StoryReader?id=1']}>
        <NextPage to='/StoryReader?id=2' />
        <Routes><Route path='/StoryReader' element={<StoryReader />} /></Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(requests.bibliography).toHaveBeenCalledWith('OLD'));
    fireEvent.click(screen.getByRole('button', { name: 'Next record' }));
    expect(await screen.findByText('Story frame second')).toBeTruthy();
    expect(screen.getByText('Current story citation')).toBeTruthy();

    await act(async () => {
      if (outcome === 'succeeds') oldBibliography.resolve({ data: 'Old story citation' });
      else oldBibliography.reject(new Error('Old bibliography unavailable'));
    });

    expect(screen.getByText('Current story citation')).toBeTruthy();
    expect(screen.queryByText('Old story citation')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });
});
