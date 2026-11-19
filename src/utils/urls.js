const parseWebUrl = (value, base) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const trimmed = value.trim();
  // URL parsers normalize embedded tabs/newlines; reject those before checking
  // the scheme so obfuscated input cannot acquire a different meaning later.
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return null;

  try {
    const url = new URL(trimmed, base);
    return ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
};

// Museum/source references must be absolute HTTP(S) URLs. Returning null makes
// an unsafe React href inert instead of relying on React's warning for scripts.
export const getSafeWebUrl = (value) => parseWebUrl(value)?.href ?? null;

// CMS navigation cards and optional story links may also use relative routes,
// query strings or fragments. Preserve those for the router's staging basename.
export const getSafeNavigationUrl = (value) => {
  // This base only validates relative input; it must never become its destination.
  const url = parseWebUrl(value, 'https://syrios.invalid/');
  if (!url) return null;
  const trimmed = value.trim();
  return /^(?:[a-z][a-z\d+.-]*:|[\\/]{2})/i.test(trimmed)
    ? url.href
    : trimmed;
};
