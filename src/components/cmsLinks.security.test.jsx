// @vitest-environment jsdom

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CoinInfo from './coin/CoinInfo';
import Footer from './footer/Footer';
import { ImageComponent } from './StoryComponents/ComponentFunction';
import FlipFrame from './StoryComponents/StoryFrames/FlipFrame';
import FadeFrame from './StoryComponents/StoryFrames/FadeFrame';
import { WhiteBGDesign } from './constant/WhiteBGDesign';
import LandingPage from 'src/pages/LandingPage';
import landingRequest from 'src/api/landing';

vi.mock('react-modern-drawer', () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock('react-player', () => ({ default: () => null }));
vi.mock('src/api/landing', () => ({ default: { landingdFind: vi.fn() } }));

afterEach(cleanup);

const media = { data: { attributes: { url: '/uploads/coin.png' } } };
const coinFor = (source_image) => ({
  coin_id: 'catalog-coin', source_image, obverse_file: media, reverse_file: media,
});
const relationFor = (source) => ({ data: { attributes: coinFor(source) } });
const commonZone = { background: { data: null }, head: { updown_switch: false } };

const sourceViews = [
  ['coin popup', (source) => <CoinInfo show coinMetaData={coinFor(source)} onClose={() => {}} />],
  ['story coin image', (source) => <ImageComponent image={{ image: { data: null }, coin: relationFor(source), image_size: 50 }} />],
  ['story additional image link', (source) => <ImageComponent image={{ image: media, additional_link: source, image_size: 50 }} />],
  ['story flip images', (source) => <FlipFrame index={0} zone={{
    ...commonZone, flip_coin_left: { coin: relationFor(source) }, flip_coin_right: { coin: relationFor(source) },
  }} />],
  ['story fade images', (source) => <FadeFrame index={0} zone={{
    ...commonZone,
    fades: [{ topic: 'Comparison', coin_left: relationFor(source), coin_right: relationFor(source) }],
  }} />],
  ['credit drawer source', (source) => <Footer references={[]} imageReference={[{ right_holder: 'Museum', source_image: source }]} />],
];

describe.each(sourceViews)('CMS source link in %s', (_name, view) => {
  it.each([
    'javascript:alert(1)', 'java\nscript:alert(1)',
    'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)',
  ])('does not render an actionable unsafe URL: %s', (source) => {
    const { container } = render(view(source));
    const links = container.querySelectorAll('a');

    expect(links.length).toBeGreaterThan(0);
    expect([...links].every((link) => !link.hasAttribute('href'))).toBe(true);
  });

  it('retains a valid museum source, including its query and fragment', () => {
    const source = 'https://museum.example/coin?view=front#image';
    const { container } = render(view(source));
    const links = container.querySelectorAll('a');

    expect(links.length).toBeGreaterThan(0);
    expect([...links].every((link) => link.getAttribute('href') === source)).toBe(true);
  });
});

describe('CMS navigation links', () => {
  it('keeps relative story links actionable', () => {
    const { container } = render(<ImageComponent image={{
      image: media, additional_link: '../Stories?id=2#reference', image_size: 50,
    }} />);

    expect(container.querySelector('a').getAttribute('href')).toBe('../Stories?id=2#reference');
  });

  it('keeps the staging basename for valid card destinations', () => {
    const { container } = render(
      <MemoryRouter basename='/dev' initialEntries={['/dev/']}>
        <WhiteBGDesign link='/StoryReader?id=2#reference' />
      </MemoryRouter>,
    );

    expect(container.querySelector('a').getAttribute('href')).toBe('/dev/StoryReader?id=2#reference');
  });

  it('makes unsafe CMS cards inert', () => {
    const { container } = render(
      <MemoryRouter><WhiteBGDesign link='javascript:alert(1)' /></MemoryRouter>,
    );

    expect(container.querySelector('a').getAttribute('href')).toBe('/');
  });

  it('rejects unsafe homepage destinations while preserving valid staging routes', async () => {
    landingRequest.landingdFind.mockResolvedValueOnce({ data: { data: {
      image_icons: [
        { id: 1, title: 'Unsafe destination', url_path: 'javascript:alert(1)' },
        { id: 2, title: 'Valid destination', url_path: '/StoryReader?id=2#reference' },
      ],
    } } });
    const { findByText } = render(
      <MemoryRouter basename='/dev' initialEntries={['/dev/']}><LandingPage /></MemoryRouter>,
    );

    expect((await findByText('Unsafe destination')).closest('a').getAttribute('href')).toBe('/dev');
    expect((await findByText('Valid destination')).closest('a').getAttribute('href')).toBe('/dev/StoryReader?id=2#reference');
  });
});
