// Treat every VITE_ setting as public, including variables not currently used.
// Only reviewed frontend settings belong here; private API credentials do not.
export const PUBLIC_ENVIRONMENT_NAMES = Object.freeze([
  'VITE_API_RETRY_COUNT',
  'VITE_API_RETRY_DELAY_MS',
  'VITE_API_TIMEOUT_MS',
  'VITE_API_URL',
  'VITE_API_URL_LOCAL',
  'VITE_APP_ENV',
  'VITE_ENABLE_LOCAL_API',
  'VITE_ENABLE_LOCAL_STRAPI',
  'VITE_LOCAL_STRAPI_URL',
  'VITE_MAPBOX_TOKEN',
  'VITE_PRODUCTION',
  'VITE_STRAPI_URL',
  'VITE_ZOTERO_API_URL',
  'VITE_ZOTERO_API_VERSION',
  'VITE_ZOTERO_GROUP_ID',
]);

// Vite creates this exact internal key when NODE_ENV is supplied by an .env file.
// Permit that build-mode mirror without allowing other unreviewed VITE_ names.
const publicNames = new Set([...PUBLIC_ENVIRONMENT_NAMES, 'VITE_USER_NODE_ENV']);
const isPopulated = (value) => value !== undefined && value !== null && value !== '';

export function assertPublicEnvironment(environment) {
  const unapprovedNames = Object.keys(environment)
    .filter((name) => name.startsWith('VITE_')
      && isPopulated(environment[name])
      && !publicNames.has(name))
    .sort();

  if (unapprovedNames.length) {
    // Never include values: this error may be printed in developer or CI logs.
    throw new Error(
      `Unapproved public environment variables: ${unapprovedNames.join(', ')}. `
      + 'Remove private credentials from the frontend environment; review new public settings before adding them to the allowlist.'
    );
  }

  const mapboxToken = environment.VITE_MAPBOX_TOKEN;
  // Mapbox pk. tokens are intended for browsers; sk. credentials stay server-side.
  if (isPopulated(mapboxToken)
    && (typeof mapboxToken !== 'string' || !mapboxToken.startsWith('pk.'))) {
    throw new Error('VITE_MAPBOX_TOKEN must be a public pk. token.');
  }
}

export function publicEnvironmentGuard() {
  return {
    name: 'syrios-public-environment',
    // Vite has resolved mode-specific files and process environment precedence
    // here, but has not served or built any browser modules yet.
    configResolved(config) {
      assertPublicEnvironment(config.env);
    },
  };
}
