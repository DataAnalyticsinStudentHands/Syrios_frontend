// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { createCoinPopup } from './MapCoins';

vi.mock('mapbox-gl', () => ({ default: {} }));

const coin = (id, sourceImage) => ({ id, title: `Coin ${id}`, sourceImage });
const popup = (coins) => createCoinPopup({ name: 'Antioch', coins });

describe('map popup source links', () => {
  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '/relative-source',
    'https://',
  ])('does not expose an actionable link for %s', (sourceImage) => {
    const content = popup([coin(1, sourceImage)]);
    const source = content.querySelector('a[target="_blank"]');

    expect(source.hidden).toBe(true);
    expect(source.hasAttribute('href')).toBe(false);
    expect(content.querySelector('a').getAttribute('href')).toBe('/Coin/1');
  });

  it('removes the previous safe URL when navigating to a coin with an unsafe source', () => {
    const content = popup([
      coin(1, 'https://museum.example/coin/1'),
      coin(2, 'javascript:alert(1)'),
    ]);
    const source = content.querySelector('a[target="_blank"]');

    expect(source.hidden).toBe(false);
    expect(source.href).toBe('https://museum.example/coin/1');
    expect(source.relList.contains('noopener')).toBe(true);
    expect(source.relList.contains('noreferrer')).toBe(true);

    content.querySelector('[aria-label="Next coin"]').click();

    expect(source.hidden).toBe(true);
    expect(source.hasAttribute('href')).toBe(false);

    content.querySelector('[aria-label="Previous coin"]').click();

    expect(source.hidden).toBe(false);
    expect(source.href).toBe('https://museum.example/coin/1');
  });
});
