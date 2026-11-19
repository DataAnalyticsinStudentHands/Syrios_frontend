import { mkdtemp, rm, rmdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { build, resolveConfig } from 'vite';
import {
  assertPublicEnvironment,
  PUBLIC_ENVIRONMENT_NAMES,
  publicEnvironmentGuard,
} from './publicEnvironment.mjs';

const fixtures = [];
const privateValue = 'private-value-must-never-appear-in-errors-or-bundles';

afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(fixtures.splice(0).map(async (fixture) => {
    await Promise.all(['.env', 'entry.js'].map((filename) =>
      rm(path.join(fixture, filename), { force: true })
    ));
    await rmdir(fixture);
  }));
});

const fixtureWithEnvironment = async (environmentText) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), 'syrios-public-env-'));
  fixtures.push(fixture);
  await writeFile(path.join(fixture, '.env'), environmentText);
  return fixture;
};

describe('public frontend environment', () => {
  it('accepts the supported public settings and Vite built-in values', () => {
    const environment = Object.fromEntries(PUBLIC_ENVIRONMENT_NAMES.map((name) =>
      [name, name === 'VITE_MAPBOX_TOKEN' ? 'pk.public-map-token' : 'public-setting']
    ));

    expect(() => assertPublicEnvironment({
      ...environment, MODE: 'production', BASE_URL: '/', PROD: true, DEV: false,
    })).not.toThrow();
  });

  it.each([
    'VITE_ZOTERO_API_KEY',
    'VITE_API_TOKEN',
    'VITE_DATABASE_PASSWORD',
    'VITE_STRAPI_URL_PRIVATE_KEY',
    'VITE_USER_NODE_ENV_SECRET',
  ])('rejects %s without printing its value', (name) => {
    let error;
    try {
      assertPublicEnvironment({ [name]: privateValue });
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain(name);
    expect(error.message).not.toContain(privateValue);
  });

  it('permits empty placeholders and ignores server-only environment names', () => {
    expect(() => assertPublicEnvironment({
      VITE_ZOTERO_API_KEY: '', SERVER_SECRET: privateValue,
    })).not.toThrow();
  });

  it('rejects a secret Mapbox token without printing it', () => {
    expect(() => assertPublicEnvironment({ VITE_MAPBOX_TOKEN: 'sk.private-map-token' }))
      .toThrow('VITE_MAPBOX_TOKEN must be a public pk. token.');
  });

  it.each(['serve', 'build'])('blocks %s configuration before private environment values reach modules', async (command) => {
    const fixture = await fixtureWithEnvironment(`VITE_ZOTERO_API_KEY=${privateValue}\n`);
    const config = resolveConfig({
      configFile: false,
      root: fixture,
      plugins: [publicEnvironmentGuard()],
      logLevel: 'silent',
    }, command);

    await expect(config).rejects.toThrow('VITE_ZOTERO_API_KEY');
    await expect(config).rejects.not.toThrow(privateValue);
  });

  it('allows dev and build configuration with public environment files', async () => {
    // Vitest copies the project's env into the worker process; let this fixture
    // supply its own values instead of using the higher-priority process env.
    vi.stubEnv('VITE_STRAPI_URL', undefined);
    vi.stubEnv('VITE_MAPBOX_TOKEN', undefined);
    const fixture = await fixtureWithEnvironment(
      'VITE_STRAPI_URL=https://example.org\nVITE_MAPBOX_TOKEN=pk.public-map-token\n'
    );

    for (const command of ['serve', 'build']) {
      const config = await resolveConfig({
        configFile: false,
        root: fixture,
        plugins: [publicEnvironmentGuard()],
        logLevel: 'silent',
      }, command);
      expect(config.env.VITE_STRAPI_URL).toBe('https://example.org');
      expect(config.env.VITE_MAPBOX_TOKEN).toBe('pk.public-map-token');
    }
  });

  it.each(['serve', 'build'])('accepts Vite\'s internal NODE_ENV mirror for %s', async (command) => {
    vi.stubEnv('NODE_ENV', undefined);
    vi.stubEnv('VITE_USER_NODE_ENV', undefined);
    const fixture = await fixtureWithEnvironment('NODE_ENV=development\n');

    const config = await resolveConfig({
      configFile: false,
      root: fixture,
      mode: command === 'build' ? 'production' : 'development',
      plugins: [publicEnvironmentGuard()],
      logLevel: 'silent',
    }, command);

    expect(config.env.VITE_USER_NODE_ENV).toBe('development');
  });

  it('prevents a build that would otherwise expose the whole Vite environment', async () => {
    const fixture = await fixtureWithEnvironment(`VITE_API_TOKEN=${privateValue}\n`);
    const entry = path.join(fixture, 'entry.js');
    await writeFile(entry, 'export const environment = import.meta.env;\n');

    const result = build({
      configFile: false,
      root: fixture,
      publicDir: false,
      plugins: [publicEnvironmentGuard()],
      logLevel: 'silent',
      build: { write: false, lib: { entry, formats: ['es'] } },
    });

    await expect(result).rejects.toThrow('VITE_API_TOKEN');
    await expect(result).rejects.not.toThrow(privateValue);
  });
});
