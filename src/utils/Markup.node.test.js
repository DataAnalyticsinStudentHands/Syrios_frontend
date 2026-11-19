// @vitest-environment node

import { expect, it } from 'vitest';
import { createMarkup } from './Markup';

it('fails closed when a supported DOM is unavailable', () => {
  expect(createMarkup('<img src=x onerror=alert(1)>')).toEqual({ __html: '' });
});
