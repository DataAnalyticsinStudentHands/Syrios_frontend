import { describe, expect, it } from 'vitest';
import { getSafeNavigationUrl, getSafeWebUrl } from './urls';

const unsafe = [
  'javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'java\nscript:alert(1)',
  '\u0000javascript:alert(1)', '\tjavascript:alert(1)',
  'data:text/html,<script>alert(1)</script>', 'data:image/svg+xml,<svg onload=alert(1)>',
  'vbscript:msgbox(1)', 'blob:https://museum.example/image', 'ftp://museum.example/image',
  'https://', '', null, undefined, { href: 'https://museum.example/' },
];

describe('untrusted CMS URLs', () => {
  it.each(unsafe)('rejects an unsafe source and navigation value: %s', (value) => {
    expect(getSafeWebUrl(value)).toBeNull();
    expect(getSafeNavigationUrl(value)).toBeNull();
  });

  it.each([
    ['  HTTPS://MUSEUM.EXAMPLE/coin/1?view=front#image  ', 'https://museum.example/coin/1?view=front#image'],
    ['http://museum.example/coin/2', 'http://museum.example/coin/2'],
  ])('keeps a valid external source: %s', (value, expected) => {
    expect(getSafeWebUrl(value)).toBe(expected);
    expect(getSafeNavigationUrl(value)).toBe(expected);
  });

  it.each(['/Evidence/MapCoins', '../Stories', 'Stories?id=2#source', '?id=2', '#source'])
    ('permits relative destinations only for navigation: %s', (value) => {
      expect(getSafeWebUrl(value)).toBeNull();
      expect(getSafeNavigationUrl(value)).toBe(value);
    });

  it('normalizes protocol-relative navigation without treating it as an absolute source', () => {
    expect(getSafeWebUrl('//museum.example/coin/1')).toBeNull();
    expect(getSafeNavigationUrl('//museum.example/coin/1')).toBe('https://museum.example/coin/1');
  });
});
