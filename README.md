# SYRIOS Frontend 

This is the client-side interface for the Syrios project. It is built with React, Vite, and react-router-dom. It uses a lightweight [Strapi](https://strapi.io/) content management system as backend.

The backend repository is:
[https://github.com/DataAnalyticsinStudentHands/Syrios_backend](https://github.com/DataAnalyticsinStudentHands/Syrios_backend)

A live demo of the production version is the [Syrios website](https://syrios.uh.edu/)

## Requirements

- Node.js 24
- npm

If using nvm, select the project's Node.js version with:

```bash
nvm use
```

## For Developers
Install dependencies:

```bash
npm ci
```

Copy `.env.example` to `.env` and set the public Strapi origin and Zotero group ID. The example comments explain the optional settings and their defaults.

Start the local Vite development server:

```bash
npm run dev
```
Local development runs at the site root and does not use the `/dev/` staging path.

## Staging

The staging site is deployed under `/dev/`.

Create the staging build with:

```bash
npm run build:staging
```

This creates the static site in the `build` directory with `/dev/` configured as the application base path.

The build script selects Vite's `staging` mode, which also enables the staging-only Coins on a Map route. Supply a public `VITE_MAPBOX_TOKEN` to the build process to render that map. Set `VITE_APP_ENV=development` only if the story list should request development stories.

The `build` directory is served by PM2 on the web server.

PM2 runs the production dependency `sirv-cli`, which serves application routes
with the SPA entry page and returns 404 for missing assets. The staging reverse
proxy must continue stripping `/dev/` before forwarding requests to port 5000.
Restart the corresponding PM2 application after each rebuild or deployment so
the server refreshes its asset list. A host receiving prebuilt assets can install
runtime dependencies with `npm ci --omit=dev`; building locally requires the full
development installation.

### CoinSort XR

CoinSort XR is a staging-only Meta Quest/WebXR test experience at `/dev/Evidence/CoinSortXR`. For local headset testing, start Vite in staging mode:

```bash
npm run dev -- --mode staging
```

Its Evidence menu option appears only in a secure browser that reports support for immersive VR; this checks headset availability rather than physical headset wear. Entering XR requires a button press. The route and menu are unavailable in production and ordinary development mode. Vite still copies the static models and licenses in `public/xr/` into build output; those files do not enable the experience.

See [CoinSort XR setup, controls, capture storage, and testing](src/pages/Evidence/CoinSortXR/README.md) for the feature documentation.

## Production

Create the production build with:

```bash
npm run build
```

This creates the static site in the `build` directory with `/` as the application base path.

Use `VITE_APP_ENV=production` or leave it unset for the normal story listing. This flag is independent of Vite's build mode and application base path.

The `build` directory is served by PM2 on the web server.
    
### Environment variables

The frontend reads public configuration when Vite starts or builds. Set these values in `.env` or in the environment of the process running the build:

```text
VITE_STRAPI_URL=
VITE_ZOTERO_GROUP_ID=
```

`VITE_STRAPI_URL` is the public CMS origin without `/api`; both API requests and media URLs use it. `VITE_ZOTERO_GROUP_ID` identifies the publicly readable bibliography library. The Mapbox token is optional unless the staging map is needed. See the commented `.env.example` for request timeouts, retry defaults, and optional local/legacy API settings.

Vite loads `.env`, `.env.local`, `.env.<mode>`, and `.env.<mode>.local`. Mode-specific files override the generic files; existing process environment values take precedence. `npm run build` selects production mode, and `npm run build:staging` selects staging mode. `VITE_APP_ENV=development` only adds `env=development` to the story-list request; other values or an unset variable use the normal listing. It does not enforce access permissions. The legacy `VITE_PRODUCTION` variable is unused and does not select the deployment mode.

For builds in CI or a container, provide these settings to the build step. Setting them only when PM2 or a static-server container starts does not rewrite the compiled JavaScript. Rebuild and redeploy after configuration changes; restart the local Vite server after editing its environment files. Environment files containing actual configuration values should not be committed.

Every `VITE_` value referenced by the frontend is included in browser assets and can be read by visitors. Keep private API keys and other credentials in backend configuration.

Development and builds reject populated `VITE_` variables outside the public-setting allowlist in `scripts/publicEnvironment.mjs`. Remove obsolete credential variables from local and deployment environments. Review new public settings before adding them to that list. `VITE_MAPBOX_TOKEN` must be a public token beginning with `pk.`.

No new private credentials are required. Remove obsolete `VITE_ZOTERO_API_KEY` and `VITE_API_TOKEN` entries from every `.env` variant and build/container environment; the browser clients no longer use them and the guard rejects populated values.

The research bibliography reads a public Zotero group without authentication. Set `VITE_ZOTERO_GROUP_ID` to a group with a publicly readable library; no Zotero API key is needed. Optional `VITE_ZOTERO_API_URL` and `VITE_ZOTERO_API_VERSION` settings default to `https://api.zotero.org` and `3`. If a private bibliography is required later, access it through a backend endpoint that keeps a narrowly scoped credential on the server.

Revoke any Zotero API key exposed by an older frontend in [Zotero API key settings](https://www.zotero.org/settings/keys). Removing it from source or environment files does not revoke the credential. Rebuild and redeploy production and staging, remove superseded assets from hosting (including legacy `dist` output), and invalidate CDN caches. The public bibliography does not need a replacement key.

The read-only `npm run test:api:live` script loads `.env` through dotenv or uses existing process environment values; it does not automatically load Vite's mode-specific files.
