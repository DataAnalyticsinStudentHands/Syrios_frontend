import createDOMPurify from 'dompurify';

// Keep the sanitizer private so hooks/configuration elsewhere cannot relax the
// policy used by React's HTML sinks. An unsupported DOM fails closed below.
const purifier = createDOMPurify(typeof window === 'undefined' ? undefined : window);

// Preserve CMS formatting and citation controls, but exclude executable markup,
// inline CSS and id/name attributes that could interfere with the application DOM.
const CMS_HTML_OPTIONS = {
  ALLOWED_TAGS: [
    'a', 'abbr', 'b', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'caption',
    'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'div', 'dl', 'dt', 'em',
    'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i',
    'img', 'ins', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 'q', 'rp', 'rt',
    'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'table',
    'tbody', 'td', 'th', 'thead', 'time', 'tr', 'u', 'ul', 'var', 'wbr',
  ],
  ALLOWED_ATTR: [
    'abbr', 'alt', 'class', 'colspan', 'datetime', 'dir', 'height', 'href',
    'lang', 'rel', 'rowspan', 'scope', 'src', 'start', 'target', 'title',
    'type', 'width',
  ],
  ALLOWED_NAMESPACES: ['http://www.w3.org/1999/xhtml'],
  ALLOW_DATA_ATTR: false,
  RETURN_TRUSTED_TYPE: false,
};

if (purifier.isSupported) {
  purifier.addHook('uponSanitizeAttribute', (_node, attribute) => {
    if (attribute.attrName !== 'href' && attribute.attrName !== 'src') return;

    try {
      // The fixed base is only used to recognize relative URLs; no request is
      // made. HTML entities are already decoded when this hook receives them.
      const { protocol } = new URL(attribute.attrValue, 'https://syrios.invalid/');
      const allowed = attribute.attrName === 'src'
        ? ['http:', 'https:']
        : ['http:', 'https:', 'mailto:', 'tel:'];
      if (!allowed.includes(protocol)) attribute.keepAttr = false;
    } catch {
      attribute.keepAttr = false;
    }
  });

  purifier.addHook('afterSanitizeAttributes', (node) => {
    // Keep new tabs isolated from the application and disallow named targets.
    if (node.nodeName === 'A' && node.hasAttribute('target')) {
      if (node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer');
      } else {
        node.removeAttribute('target');
      }
    }
    // CMS reference tags open the story's React-controlled reference drawer.
    if (node.nodeName === 'BUTTON') node.setAttribute('type', 'button');
  });
}

// All dangerouslySetInnerHTML callers share this policy; local passthrough
// helpers would bypass sanitization even when the original content came from CMS.
export function createMarkup(value) {
  return {
    __html: purifier.isSupported
      ? purifier.sanitize(value == null ? '' : String(value), CMS_HTML_OPTIONS)
      : '',
  };
}

export default createMarkup;
