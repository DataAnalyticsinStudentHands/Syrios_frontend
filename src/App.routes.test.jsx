// @vitest-environment jsdom

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';

const xrSupport = vi.hoisted(() => ({ supported: false, checking: false, reason: '' }));

vi.mock('react-slick', () => ({ default: () => null }));
vi.mock('./hooks/useXRSupport', () => ({
  default: () => xrSupport,
  useXRSupport: () => xrSupport,
}));
vi.mock('./pages/LandingPage', () => ({ default: () => <h1>Home</h1> }));
vi.mock('./pages/Stories/StoryReader', () => ({ default: () => null }));
vi.mock('./pages/Stories/HowToReadACoin', () => ({ default: () => null }));
vi.mock('./pages/Evidence/MapCoins/MapCoins', () => ({
  default: () => <h1>Staging coin map</h1>,
}));
vi.mock('./pages/Evidence/CoinSortXR/CoinSortXR', () => ({
  default: () => <h1>Staging CoinSort XR</h1>,
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
  xrSupport.supported = false;
  window.history.replaceState({}, '', '/');
});

const visitRoute = async (mode, pathname) => {
  vi.stubEnv('MODE', mode);
  vi.resetModules();
  const { AppRoutes } = await import('./App');
  render(<MemoryRouter initialEntries={[pathname]}><AppRoutes /></MemoryRouter>);
};

const visitMap = (mode) => visitRoute(mode, '/Evidence/MapCoins');

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

describe('CoinSort XR deployment access', () => {
  it.each(['production', 'development'])('rejects a direct XR URL in %s', async (mode) => {
    await visitRoute(mode, '/Evidence/CoinSortXR');

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Staging CoinSort XR' })).toBeNull();
  });

  it('makes the CoinSort XR route available on staging', async () => {
    await visitRoute('staging', '/Evidence/CoinSortXR');

    expect(await screen.findByRole('heading', { name: 'Staging CoinSort XR' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Page not found' })).toBeNull();
  });
});

describe('CoinSort XR navigation visibility', () => {
  it('opens the direct XR entry without the normal site navigation', async () => {
    vi.stubEnv('MODE', 'staging');
    vi.stubEnv('BASE_URL', '/dev/');
    xrSupport.supported = true;
    window.history.replaceState({}, '', '/dev/Evidence/CoinSortXR');
    vi.resetModules();
    const { default: App } = await import('./App');
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Staging CoinSort XR' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'HOME' })).toBeNull();
    expect(screen.queryByText('EVIDENCE')).toBeNull();
  });

  const openEvidenceMenu = async (mode, supported) => {
    vi.stubEnv('MODE', mode);
    vi.stubEnv('BASE_URL', mode === 'staging' ? '/dev/' : '/');
    xrSupport.supported = supported;
    window.history.replaceState({}, '', mode === 'staging' ? '/dev/' : '/');
    vi.resetModules();
    const { default: App } = await import('./App');
    render(<App />);
    fireEvent.click(screen.getByText('EVIDENCE'));
  };

  it('shows its staging link only when immersive VR is supported', async () => {
    await openEvidenceMenu('staging', true);

    expect(screen.getByRole('link', { name: 'CoinSort XR' }).getAttribute('href'))
      .toBe('/dev/Evidence/CoinSortXR');
  });

  it.each([
    ['staging', false],
    ['production', true],
    ['development', true],
  ])('hides the XR option in %s with support=%s', async (mode, supported) => {
    await openEvidenceMenu(mode, supported);

    expect(screen.queryByRole('link', { name: 'CoinSort XR' })).toBeNull();
  });
});
