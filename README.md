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

Configure the required environment variables in `.env`. See `.env.example` for the available variables.

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

The staging environment should use:

```text
VITE_PRODUCTION=development
```

The `build` directory is served by PM2 on the web server.

## Production

Create the production build with:

```bash
npm run build
```

This creates the static site in the `build` directory with `/` as the application base path.

The production environment should use:

```text
VITE_PRODUCTION=production
```

The `build` directory is served by PM2 on the web server.
    
### Environment variables

The frontend uses Vite environment variables. The required variables are:

```text
VITE_STRAPI_URL=
VITE_PRODUCTION=
VITE_MAPBOX_ACCESS_TOKEN=
VITE_ZOTERO_GROUP_ID=
```

Use `.env.example` as the template. Environment-specific `.env` files containing actual configuration values should not be committed to the repository.
