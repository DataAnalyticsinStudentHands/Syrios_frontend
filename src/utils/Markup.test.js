// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { createMarkup } from './Markup';

const fragmentFor = (html) => {
  const template = document.createElement('template');
  template.innerHTML = createMarkup(html).__html;
  return template.content;
};

describe('CMS HTML sanitization', () => {
  it('preserves rich text, bibliography classes, tables, images and reference controls', () => {
    const fragment = fragmentFor(`
      <div class="csl-entry"><p lang="el">Ἀντιόχεια <em>coin</em> <strong>catalog</strong>
        <sup>2</sup><br><a href="https://example.org/source" title="Source">Citation</a></p></div>
      <table><thead><tr><th scope="col">Date</th></tr></thead><tbody><tr><td colspan="2">100 BCE</td></tr></tbody></table>
      <img src="/uploads/coin.jpg" alt="Obverse" width="120" height="120" class="coin-image">
      <button class="reference-tag" type="submit" aria-label="Open reference">1</button>
    `);

    expect(fragment.querySelector('.csl-entry em').textContent).toBe('coin');
    expect(fragment.querySelector('p').getAttribute('lang')).toBe('el');
    expect(fragment.querySelector('a').getAttribute('href')).toBe('https://example.org/source');
    expect(fragment.querySelector('th').getAttribute('scope')).toBe('col');
    expect(fragment.querySelector('td').getAttribute('colspan')).toBe('2');
    expect(fragment.querySelector('img').getAttribute('src')).toBe('/uploads/coin.jpg');
    expect(fragment.querySelector('img').getAttribute('alt')).toBe('Obverse');
    expect(fragment.querySelector('button.reference-tag').getAttribute('type')).toBe('button');
    expect(fragment.querySelector('button').getAttribute('aria-label')).toBe('Open reference');
  });

  it('removes executable elements, event handlers, CSS and clobbering attributes', () => {
    const fragment = fragmentFor(`
      <script>alert(1)</script><style>body{display:none}</style>
      <iframe srcdoc="<script>alert(1)</script>"></iframe><object data="evil"></object>
      <form action="https://example.org"><input name="password"></form>
      <img src="/coin.jpg" onerror="alert(1)" ONLOAD="alert(2)" style="position:fixed" id="location" name="cookie" data-action="evil">
      <p onclick="alert(1)">Visible text</p>
    `);

    expect(fragment.querySelector('script, style, iframe, object, form, input')).toBeNull();
    const image = fragment.querySelector('img');
    expect(image.getAttributeNames()).toEqual(['src']);
    expect(fragment.querySelector('p').outerHTML).toBe('<p>Visible text</p>');
  });

  it('rejects SVG, MathML and namespace mutation payloads', () => {
    const fragment = fragmentFor(`
      <p>Safe beginning</p>
      <svg><a xlink:href="javascript:alert(1)"><text>bad</text></a></svg>
      <math><mtext><table><mglyph><style><!--</style><img title="--><img src=1 onerror=alert(1)>"></math>
    `);

    expect(fragment.querySelector('svg, math, style, script, foreignObject')).toBeNull();
    for (const element of fragment.querySelectorAll('*')) {
      expect(element.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
      expect(element.getAttributeNames().some((name) => /^on/i.test(name))).toBe(false);
    }
    expect(fragment.textContent).toContain('Safe beginning');
  });

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'java&#x09;script:alert(1)',
    'java&#10;script:alert(1)',
    'javascript&#58;alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,<script>alert(1)</script>',
    'data:image/svg+xml,<svg onload=alert(1)>',
    'blob:https://example.org/image',
    'ftp://example.org/image',
  ])('removes unsafe URLs from links and images: %s', (url) => {
    const fragment = fragmentFor(`<a href="${url}">Source</a><img src="${url}">`);

    expect(fragment.querySelector('a').hasAttribute('href')).toBe(false);
    expect(fragment.querySelector('img').hasAttribute('src')).toBe(false);
  });

  it.each([
    'https://example.org/source', 'http://example.org/source', '/Stories',
    '../uploads/coin.jpg', 'uploads/coin.jpg', '#reference-1', '?id=2',
    'mailto:editor@example.org', 'tel:+15555550100',
  ])('retains safe links: %s', (url) => {
    expect(fragmentFor(`<a href="${url}">Source</a>`).querySelector('a').getAttribute('href')).toBe(url);
  });

  it('allows HTTP(S) images but removes data images and non-image link schemes from src', () => {
    const fragment = fragmentFor(`
      <img src="https://example.org/coin.jpg"><img src="data:image/png;base64,aGVsbG8=">
      <img src="mailto:editor@example.org"><img src="tel:+15555550100">
    `);
    const images = [...fragment.querySelectorAll('img')];

    expect(images[0].getAttribute('src')).toBe('https://example.org/coin.jpg');
    expect(images.slice(1).every((image) => !image.hasAttribute('src'))).toBe(true);
  });

  it('protects new-tab links from opener access and removes named targets', () => {
    const fragment = fragmentFor(`
      <a href="/source" target="_blank" rel="opener">New tab</a>
      <a href="/source" target="admin-window">Named tab</a>
    `);
    const [newTab, namedTab] = fragment.querySelectorAll('a');

    expect(newTab.getAttribute('target')).toBe('_blank');
    expect(newTab.getAttribute('rel')).toBe('noopener noreferrer');
    expect(namedTab.hasAttribute('target')).toBe(false);
  });

  it('handles absent values and keeps plain text escaped', () => {
    expect(createMarkup(null)).toEqual({ __html: '' });
    expect(createMarkup(undefined)).toEqual({ __html: '' });
    expect(createMarkup(0)).toEqual({ __html: '0' });
    expect(fragmentFor('Coin &amp; &lt;script&gt;').textContent).toBe('Coin & <script>');
  });
});
