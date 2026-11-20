#!/usr/bin/env node
/**
 * Export CoinSort XR's saved Blobs through an existing local Quest DevTools
 * connection. This script never navigates/reloads the page or modifies IndexedDB.
 * Requires Node 24; no additional dependencies or active web server are needed.
 *
 * @example node scripts/export-quest-xr-media.mjs --help
 * @example node scripts/export-quest-xr-media.mjs --port 58161 --output ./output/captures
 */
import { mkdir, mkdtemp, open, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const DEFAULT_URL = 'http://localhost:5173/dev/Evidence/CoinSortXR';
const QUIET_WINDOW_MS = 12000;
const MAX_WAIT_MS = 120000;
const REQUEST_TIMEOUT_MS = 30000;
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const log = (value) => console.log(JSON.stringify(value));

function optionsFrom(args) {
  if (args.includes('--help') || args.includes('-h')) return null;
  const values = { port: '58161', output: path.join('output', 'coinsort-xr-captures'), url: DEFAULT_URL };
  const seen = new Set();
  for (let index = 0; index < args.length; index += 1) {
    const match = /^(--port|--output|--url)(?:=(.*))?$/.exec(args[index]);
    if (!match) throw new Error(`Unknown argument ${args[index]}. Use --help.`);
    const key = match[1].slice(2);
    if (seen.has(key)) throw new Error(`Use --${key} only once.`);
    const value = match[2] ?? args[++index];
    if (!value || value.startsWith('--')) throw new Error(`--${key} requires a value.`);
    values[key] = value;
    seen.add(key);
  }
  if (!/^\d+$/.test(values.port) || Number(values.port) < 1 || Number(values.port) > 65535) {
    throw new Error('--port must be an integer from 1 to 65535. The connection is always local.');
  }
  let expectedUrl;
  try { expectedUrl = new URL(values.url); } catch { throw new Error('--url must be an absolute HTTP(S) page URL.'); }
  if (!['http:', 'https:'].includes(expectedUrl.protocol) || expectedUrl.username || expectedUrl.password) {
    throw new Error('--url must be an HTTP(S) page URL without credentials.');
  }
  return { port: Number(values.port), output: path.resolve(values.output), expectedUrl: expectedUrl.href };
}

function printHelp() {
  console.log(`Export all saved CoinSort XR photos and videos without changing headset originals.

Usage: node scripts/export-quest-xr-media.mjs [options]

  --port <number>   Existing local Quest DevTools forwarding port (default: 58161).
  --output <path>   Output parent directory, relative to the current directory
                    (default: output/coinsort-xr-captures).
  --url <url>       Exact URL of an already-open CoinSort XR tab
                    (default: ${DEFAULT_URL}).
  --help, -h       Show this help without connecting to a device.

Requires Node 24 and an existing local DevTools/ADB forwarding connection.
Finish taking captures first. The exporter waits for 12 seconds without new
committed captures, allowing a finishing 10-second clip to reach storage. The
overall export window is bounded to 120 seconds plus an in-flight command.
Each run creates a unique UTC-named folder. Files are never overwritten.
Source SHA-256, media signatures, and reread disk SHA-256 must all match.
The first matching debugger tab is used; tabs in the same browser profile and
origin share capture storage. Its ID is included in the log and manifest.
The manifest is marked complete only after a final stable source read.
No page navigation, reload, store write, deletion, or capture clearing occurs.`);
}

/** Runs in the selected page; every invocation rechecks the exact destination. */
async function readHeadset(argument) {
  if (location.href !== argument.expectedUrl) throw new Error('The selected tab changed URL. Export stopped.');
  const databaseName = 'syrios-coinsort-xr-captures';
  if (typeof indexedDB.databases === 'function') {
    const databases = await indexedDB.databases();
    if (!databases.some((entry) => entry.name === databaseName)) throw new Error('No existing capture database was found.');
  }
  const database = await new Promise((resolve, reject) => {
    let finished = false;
    const fail = (error) => { if (!finished) { finished = true; reject(error); } };
    const request = indexedDB.open(databaseName);
    request.onupgradeneeded = () => {
      // Aborting rolls back a missing database instead of creating its schema.
      request.transaction.abort();
      fail(new Error('No existing capture database was found.'));
    };
    request.onerror = () => fail(request.error || new Error('Capture database unavailable.'));
    request.onblocked = () => fail(new Error('Capture database is blocked.'));
    request.onsuccess = () => {
      if (finished) { request.result.close(); return; }
      finished = true;
      resolve(request.result);
    };
  });
  let result;
  try {
    if (!database.objectStoreNames.contains('captures')) throw new Error('The capture store does not exist.');
    result = await new Promise((resolve, reject) => {
      const transaction = database.transaction('captures', 'readonly');
      const store = transaction.objectStore('captures');
      const request = argument.id !== undefined ? store.get(argument.id) : store.getAll();
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error || request.error || new Error('Capture read failed.'));
      transaction.onerror = () => {}; // Transaction abort is the final failure.
    });
  } finally { database.close(); }
  const describe = (record) => {
    if (!record || !['photo', 'video'].includes(record.kind) || !(record.blob instanceof Blob)
      || !record.blob.size || typeof record.id !== 'string' || !record.id || !Number.isFinite(record.createdAt)
      || typeof record.filename !== 'string') throw new Error('A stored capture has invalid metadata.');
    return { id: record.id, kind: record.kind, filename: record.filename, mime: record.blob.type,
      bytes: record.blob.size, createdAt: record.createdAt };
  };
  if (argument.id === undefined) return result.sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)).map(describe);
  const metadata = describe(result);
  const bytes = await result.blob.arrayBuffer();
  const sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
    (byte) => byte.toString(16).padStart(2, '0')).join('');
  if (argument.digestOnly) return { ...metadata, sha256 };
  const encoded = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Capture encoding failed.'));
    reader.onabort = () => reject(new Error('Capture encoding was interrupted.'));
    reader.readAsDataURL(result.blob);
  });
  return { ...metadata, sha256, base64: encoded.slice(encoded.indexOf(',') + 1) };
}

async function connect(port, expectedUrl) {
  const endpoint = `http://127.0.0.1:${port}`;
  let targets;
  try {
    const response = await fetch(`${endpoint}/json/list`, { signal: AbortSignal.timeout(7000), redirect: 'error' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    targets = await response.json();
  } catch (error) { throw new Error(`Local Quest DevTools is unavailable on port ${port}: ${error.message}`); }
  if (!Array.isArray(targets)) throw new Error('Local DevTools returned an invalid tab list.');
  const matches = targets.filter((item) => item.type === 'page' && item.url === expectedUrl);
  if (!matches.length) throw new Error(`No already-open tab matches ${expectedUrl}. No page was changed.`);
  // Re-entering through Quest Home can open duplicate tabs. The origin/profile
  // owns IndexedDB, so exporting does not require closing any live XR tab.
  const target = matches[0];
  const address = new URL(target.webSocketDebuggerUrl);
  if (!['ws:', 'wss:'].includes(address.protocol) || address.username || address.password
    || !['localhost', '127.0.0.1', '[::1]'].includes(address.hostname)
    || !address.pathname.startsWith('/devtools/page/')) throw new Error('DevTools returned a non-local or unexpected debugger URL.');
  // Keep both discovery and CDP traffic on the explicitly selected local port.
  address.hostname = '127.0.0.1';
  address.port = String(port);
  const socket = new WebSocket(address.href);
  const pending = new Map();
  let sequence = 0;
  const rejectPending = (error) => {
    for (const request of pending.values()) { clearTimeout(request.timer); request.reject(error); }
    pending.clear();
  };
  socket.addEventListener('message', ({ data }) => {
    let reply;
    try { reply = JSON.parse(String(data)); }
    catch { rejectPending(new Error('DevTools returned an unreadable reply.')); socket.close(); return; }
    const request = pending.get(reply.id);
    if (!request) return;
    pending.delete(reply.id);
    clearTimeout(request.timer);
    reply.error ? request.reject(new Error(reply.error.message)) : request.resolve(reply.result);
  });
  socket.addEventListener('close', () => rejectPending(new Error('Quest connection closed. Headset media was left unchanged.')));
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Quest connection timed out.')), 7000);
      socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      socket.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Quest connection unavailable.')); }, { once: true });
      socket.addEventListener('close', () => { clearTimeout(timer); reject(new Error('Quest connection closed before opening.')); }, { once: true });
    });
  } catch (error) { socket.close(); throw error; }
  function call(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error('Quest command timed out. Headset media was left unchanged.')); }, REQUEST_TIMEOUT_MS);
      pending.set(id, { resolve, reject, timer });
      try { socket.send(JSON.stringify({ id, method, params })); }
      catch (error) { clearTimeout(timer); pending.delete(id); reject(error); }
    });
  }
  return {
    targetId: target.id,
    matchingTabs: matches.length,
    close: () => socket.close(),
    async read(argument = {}) {
      const response = await call('Runtime.evaluate', {
        expression: `(${readHeadset.toString()})(${JSON.stringify({ ...argument, expectedUrl })})`,
        returnByValue: true, awaitPromise: true,
      });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
      if (response.result?.value === undefined) throw new Error('The capture read returned no data.');
      return response.result.value;
    },
  };
}

function validate(capture, bytes) {
  if (!Number.isSafeInteger(capture.bytes) || capture.bytes <= 0 || bytes.length !== capture.bytes
    || !/^[a-f0-9]{64}$/.test(capture.sha256) || hash(bytes) !== capture.sha256) throw new Error('Capture SHA-256 transfer verification failed.');
  const type = capture.mime.split(';')[0].trim().toLowerCase();
  if (capture.kind === 'photo' && type === 'image/png' && bytes.length >= 33
    && bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
    && bytes.readUInt32BE(8) === 13 && bytes.subarray(12, 16).toString() === 'IHDR'
    && bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(20) > 0) {
    return { extension: '.png', width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (capture.kind === 'video' && type === 'video/webm' && bytes.length >= 12
    && bytes.subarray(0, 4).equals(Buffer.from('1a45dfa3', 'hex'))) return { extension: '.webm' };
  if (capture.kind === 'video' && type === 'video/mp4' && bytes.length >= 12
    && bytes.subarray(4, 8).toString() === 'ftyp') return { extension: '.mp4' };
  throw new Error(`Capture signature is invalid: ${capture.filename}`);
}

const metadata = ({ id, kind, filename, mime, bytes, createdAt }) => ({ id, kind, filename, mime, bytes, createdAt });
const fingerprint = (records) => JSON.stringify(records.map(metadata));
function localFilename(capture, extension, usedNames) {
  const original = capture.filename;
  if (!original || original.length > 200 || path.basename(original) !== original
    || /[<>:"/\\|?*\x00-\x1f]/.test(original) || /[. ]$/.test(original)
    || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(original)
    || !original.toLowerCase().endsWith(extension)) throw new Error('A capture has an unsafe or mismatched filename.');
  let filename = original;
  let counter = 0;
  while (usedNames.has(filename.toLowerCase())) {
    const suffix = hash(capture.id).slice(0, 12);
    filename = `${original.slice(0, -extension.length)}_${suffix}${counter++ ? `_${counter}` : ''}${extension}`;
  }
  return filename;
}

async function main(options) {
  const deadline = Date.now() + MAX_WAIT_MS;
  const manifest = { source: 'Quest CoinSort XR durable capture store', expectedUrl: options.expectedUrl,
    files: [], complete: false, headsetOriginalsPreserved: true, pageReloaded: false,
    quietWindowMs: QUIET_WINDOW_MS, startedAt: new Date().toISOString() };
  let connection;
  let folder;
  let manifestHandle;
  const checkWindow = () => {
    if (Date.now() > deadline) throw new Error('Captures did not stabilize within 120 seconds. Verified files are kept; run another export.');
  };
  async function saveManifest() {
    const bytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
    // The handle was created exclusively in this run's unique directory. Only
    // our own progress manifest is rewritten; media files always use `wx`.
    let offset = 0;
    while (offset < bytes.length) {
      const { bytesWritten } = await manifestHandle.write(bytes, offset, bytes.length - offset, offset);
      if (!bytesWritten) throw new Error('The export manifest could not be written completely.');
      offset += bytesWritten;
    }
    await manifestHandle.truncate(bytes.length);
    await manifestHandle.sync();
  }
  try {
    connection = await connect(options.port, options.expectedUrl);
    manifest.sourceTargetId = connection.targetId;
    let records = await connection.read();
    if (!Array.isArray(records)) throw new Error('The capture list is invalid.');
    log({ phase: 'found', sourceTargetId: connection.targetId, matchingTabs: connection.matchingTabs,
      photos: records.filter((item) => item.kind === 'photo').length,
      videos: records.filter((item) => item.kind === 'video').length });
    await mkdir(options.output, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    folder = await mkdtemp(path.join(options.output, `${stamp}_`));
    manifestHandle = await open(path.join(folder, 'capture-manifest.json'), 'wx');
    await saveManifest();
    const exported = new Map();
    const usedNames = new Set();
    let stableSince = Date.now();
    let previous = fingerprint(records);
    while (true) {
      checkWindow();
      for (const record of records.filter((item) => !exported.has(item.id))) {
        checkWindow();
        const capture = await connection.read({ id: record.id });
        if (JSON.stringify(metadata(capture)) !== JSON.stringify(metadata(record))) throw new Error('A capture changed while it was being read.');
        const bytes = Buffer.from(capture.base64, 'base64');
        const { extension, ...dimensions } = validate(capture, bytes);
        const filename = localFilename(capture, extension, usedNames);
        const output = path.resolve(folder, filename);
        if (path.dirname(output) !== folder) throw new Error('Unsafe output path.');
        await writeFile(output, bytes, { flag: 'wx' });
        const saved = await readFile(output);
        validate(capture, saved);
        usedNames.add(filename.toLowerCase());
        const { base64, ...description } = capture;
        const entry = { ...description, localFilename: filename, ...dimensions, verified: true };
        exported.set(capture.id, entry);
        manifest.files.push(entry);
        await saveManifest();
        log({ phase: 'saved-and-verified', filename, kind: capture.kind, bytes: saved.length });
        stableSince = Date.now();
      }
      checkWindow();
      const current = await connection.read();
      const currentFingerprint = fingerprint(current);
      if (currentFingerprint !== previous) { stableSince = Date.now(); previous = currentFingerprint; }
      for (const [id, entry] of exported) {
        const source = current.find((item) => item.id === id);
        if (!source || JSON.stringify(metadata(source)) !== JSON.stringify(metadata(entry))) {
          throw new Error('Saved captures changed or were removed during export. Verified local copies were kept.');
        }
      }
      records = current;
      if (records.some((item) => !exported.has(item.id))) continue;
      if (Date.now() - stableSince < QUIET_WINDOW_MS) { await pause(1000); continue; }
      if (!records.length) throw new Error('No saved captures appeared during the 12-second waiting window.');
      // Verify the source Blobs again, then take the final metadata snapshot.
      // A finishing clip appearing during verification restarts the quiet wait.
      for (const entry of exported.values()) {
        checkWindow();
        const source = await connection.read({ id: entry.id, digestOnly: true });
        if (source.sha256 !== entry.sha256 || JSON.stringify(metadata(source)) !== JSON.stringify(metadata(entry))) {
          throw new Error('A source capture changed before final verification.');
        }
        validate(entry, await readFile(path.join(folder, entry.localFilename)));
      }
      checkWindow();
      const ending = await connection.read();
      if (fingerprint(ending) !== fingerprint(records)) { records = ending; previous = fingerprint(ending); stableSince = Date.now(); continue; }
      manifest.complete = true;
      manifest.finishedAt = new Date().toISOString();
      manifest.photos = manifest.files.filter((item) => item.kind === 'photo').length;
      manifest.videos = manifest.files.filter((item) => item.kind === 'video').length;
      await saveManifest();
      log({ phase: 'complete', folder, photos: manifest.photos, videos: manifest.videos,
        totalBytes: manifest.files.reduce((total, item) => total + item.bytes, 0), headsetOriginalsPreserved: true });
      break;
    }
  } catch (error) {
    manifest.complete = false;
    manifest.error = error.message;
    if (manifestHandle) await saveManifest().catch(() => {});
    console.error(JSON.stringify({ error: error.message, savedFolder: folder, verifiedFiles: manifest.files.length,
      headsetOriginalsPreserved: true }));
    process.exitCode = 1;
  } finally {
    await manifestHandle?.close().catch(() => {});
    connection?.close();
  }
}

try {
  const options = optionsFrom(process.argv.slice(2));
  if (!options) printHelp();
  else await main(options);
} catch (error) {
  console.error(`Export failed: ${error.message}`);
  process.exitCode = 1;
}
