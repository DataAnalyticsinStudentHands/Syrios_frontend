// @vitest-environment jsdom

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';

vi.mock('react-slick', () => ({ default: () => null }));
vi.mock('./pages/Stories/StoryReader', () => ({ default: () => null }));
vi.mock('./pages/Stories/HowToReadACoin', () => ({ default: () => null }));
vi.mock('./pages/Evidence/MapCoins/MapCoins', () => ({
  default: () => <h1>Staging coin map</h1>,
}));
vi.mock('./components/error/404', () => ({
  default: () => <h1>Page not found</h1>,
}));
vi.mock('./components/footerv2/Footer2Wrapper', () => ({
  default: () => <Outlet />,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const visitMap = async (mode) => {
  vi.stubEnv('MODE', mode);
  vi.resetModules();
  const { AppRoutes } = await import('./App');
  render(<MemoryRouter initialEntries={['/Evidence/MapCoins']}><AppRoutes /></MemoryRouter>);
};

describe('map deployment access', () => {
  it.each(['production', 'development'])('resolves a direct map URL to 404 in %s', async (mode) => {
    await visitMap(mode);

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Staging coin map' })).toBeNull();
  });

  it('keeps the map reachable from its direct URL on staging', async () => {
    await visitMap('staging');

    expect(await screen.findByRole('heading', { name: 'Staging coin map' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Page not found' })).toBeNull();
  });
});
