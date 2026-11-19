import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const indexHtml = '<!doctype html><html><body><div id="root">SYRIOS fixture</div></body></html>';
const javascript = 'window.syriosFixture = "original asset bytes";\n';
const css = 'body { color: #183848; }\n';
const fixtures = [];

const startServer = async (app, cwd) => {
  const child = spawn(process.execPath, [path.resolve(projectRoot, app.script), ...app.args], {
    cwd,
    env: { ...process.env, HOST: '127.0.0.1', PORT: '0', NO_COLOR: '1', FORCE_COLOR: '0' },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const stop = async () => {
    if (child.exitCode !== null || child.signalCode !== null) return;
    const exited = new Promise((resolve) => child.once('exit', resolve));
    child.kill();
    await exited;
  };
  let output = '';
  try {
    const baseUrl = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Static server did not start: ${output}`)), 10000);
      const fail = (error) => {
        clearTimeout(timeout);
        reject(error);
      };
      child.once('error', fail);
      child.once('exit', (code) => fail(new Error(`Static server exited (${code}): ${output}`)));
      child.stderr.on('data', (chunk) => { output += chunk; });
      child.stdout.on('data', (chunk) => {
        output += chunk;
        const address = output.match(/- Local:\s+http:\/\/(?:localhost|127\.0\.0\.1):(\d+)/);
        if (address) {
          clearTimeout(timeout);
          resolve(`http://127.0.0.1:${address[1]}`);
        }
      });
    });
    return { baseUrl, stop };
  } catch (error) {
    await stop();
    throw error;
  }
};

afterAll(async () => {
  for (const directory of fixtures) {
    // Only remove the isolated directories created by this test under tmpdir.
    if (path.dirname(directory) !== path.resolve(tmpdir()) || !path.basename(directory).startsWith('syrios-static-')) {
      throw new Error(`Unexpected fixture cleanup path: ${directory}`);
    }
    await rm(directory, { recursive: true, force: true });
  }
});

describe.each([
  ['production', require('../ecosystem.prod.config.js').apps[0]],
  ['staging', require('../ecosystem.dev.config.js').apps[0]],
])('%s static deployment', (environment, app) => {
  let server;

  beforeAll(async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'syrios-static-'));
    fixtures.push(directory);
    await mkdir(path.join(directory, 'build', 'assets'), { recursive: true });
    await writeFile(path.join(directory, 'build', 'index.html'), indexHtml);
    await writeFile(path.join(directory, 'build', 'assets', 'app-test.js'), javascript);
    await writeFile(path.join(directory, 'build', 'assets', 'app-test.css'), css);
    server = await startServer(app, directory);
  }, 15000);

  afterAll(async () => {
    await server?.stop();
  });

  it.each(['/', '/Stories', '/Evidence/Timeline', '/StoryReader?id=1', '/Coins/pattern=antioch', '/Toolbox/Glossary/term/bronze'])('serves the application for a direct URL: %s', async (pathname) => {
    // The existing reverse proxy strips staging's /dev/ prefix before PM2.
    const response = await fetch(`${server.baseUrl}${pathname}`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/^text\/html/);
    expect(await response.text()).toBe(indexHtml);
  });

  it.each([
    ['/assets/app-test.js', javascript, /(?:application|text)\/javascript/],
    ['/assets/app-test.css', css, /^text\/css/],
  ])('preserves actual asset bytes and MIME type: %s', async (pathname, contents, mimeType) => {
    const response = await fetch(`${server.baseUrl}${pathname}`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(mimeType);
    expect(await response.text()).toBe(contents);
  });

  it.each(['/assets/missing.js', '/assets/missing.css', '/assets/unknown', '/assets/', '/assets', '/missing.png'])('returns 404 rather than app HTML or a directory listing: %s', async (pathname) => {
    const response = await fetch(`${server.baseUrl}${pathname}`);

    expect(response.status).toBe(404);
    expect(await response.text()).not.toContain('SYRIOS fixture');
  });

  if (environment === 'staging') {
    it('requires revalidation for staging assets', async () => {
      const response = await fetch(`${server.baseUrl}/assets/app-test.js`);

      expect(response.headers.get('cache-control')).toBe('public,max-age=0,must-revalidate');
    });
  }
});
