import { XR_MEDIA_LIMITS } from './xrMediaLimits';

const DATABASE_NAME = 'syrios-coinsort-xr-captures';
const STORE_NAME = 'captures';
let databasePromise;
let databaseFactory;

const persistenceError = (message, cause) => {
  const detail = cause?.name === 'QuotaExceededError' ? ' Device storage is full.' : '';
  return new Error(`${message}${detail}`, cause ? { cause } : undefined);
};

function openDatabase() {
  const factory = globalThis.indexedDB;
  if (!factory?.open) return Promise.reject(persistenceError('Capture storage is unavailable in this browser.'));
  if (databasePromise && databaseFactory === factory) return databasePromise;
  databaseFactory = factory;
  databasePromise = new Promise((resolve, reject) => {
    let finished = false;
    let request;
    const fail = (cause, message = 'Capture storage could not be opened.') => {
      if (finished) return;
      finished = true;
      databasePromise = undefined;
      reject(persistenceError(message, cause));
    };
    try { request = factory.open(DATABASE_NAME, 1); }
    catch (error) { fail(error); return; }
    request.onupgradeneeded = () => {
      const database = request.result;
      const store = database.objectStoreNames.contains(STORE_NAME)
        ? request.transaction.objectStore(STORE_NAME)
        : database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      if (!store.indexNames.contains('kind')) store.createIndex('kind', 'kind', { unique: false });
    };
    request.onerror = () => fail(request.error);
    request.onblocked = () => fail(null, 'Capture storage is blocked by another open page. Close that page and try again.');
    request.onsuccess = () => {
      const database = request.result;
      if (finished) { database.close(); return; }
      finished = true;
      database.onversionchange = () => {
        database.close();
        databasePromise = undefined;
      };
      database.onclose = () => { databasePromise = undefined; };
      resolve(database);
    };
  });
  const attempt = databasePromise;
  // A synchronous indexedDB.open() failure can occur before the assignment of
  // databasePromise finishes. Clear that rejected attempt for a later retry.
  attempt.catch(() => { if (databasePromise === attempt) databasePromise = undefined; });
  return attempt;
}

const blobType = (blob) => typeof blob?.type === 'string' ? blob.type.split(';')[0].trim().toLowerCase() : '';

function validateMetadata({ kind, filename, blob } = {}) {
  if (!Object.hasOwn(XR_MEDIA_LIMITS, kind)) throw new Error('A capture must be a photo or video.');
  if (!(blob instanceof Blob) || blob.size <= 0) throw new Error('A capture must contain a nonempty Blob.');
  const type = blobType(blob);
  if ((kind === 'photo' && type !== 'image/png')
    || (kind === 'video' && !['video/webm', 'video/mp4'].includes(type))) {
    throw new Error('Photos must be PNG images and videos must be WebM or MP4.');
  }
  if (typeof filename !== 'string' || !filename.trim() || filename.length > 200
    || /[<>:"/\\|?*\u0000-\u001f]/.test(filename)) throw new Error('The capture filename is invalid.');
  const extension = type === 'image/png' ? '.png' : type === 'video/webm' ? '.webm' : '.mp4';
  if (!filename.toLowerCase().endsWith(extension)) throw new Error('The capture filename does not match its media type.');
}

async function validateCapture(capture) {
  validateMetadata(capture);
  const header = new Uint8Array(await capture.blob.slice(0, 12).arrayBuffer());
  const type = blobType(capture.blob);
  const matches = type === 'image/png'
    ? [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => header[index] === byte)
    : type === 'video/webm'
      ? [0x1a, 0x45, 0xdf, 0xa3].every((byte, index) => header[index] === byte)
      : [0x66, 0x74, 0x79, 0x70].every((byte, index) => header[index + 4] === byte);
  if (!matches) throw new Error('The capture file header does not match its media type.');
}

function recordId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch { /* Use the collision-safe insert with a random fallback below. */ }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

/** Return saved Blobs themselves; object URLs are recreated by the current UI. */
export async function loadXRMedia() {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    let transaction;
    try { transaction = database.transaction(STORE_NAME, 'readonly'); }
    catch (error) { reject(persistenceError('Saved captures could not be read.', error)); return; }
    const request = transaction.objectStore(STORE_NAME).getAll();
    transaction.oncomplete = () => {
      try {
        const records = request.result;
        for (const record of records) {
          validateMetadata(record);
          if (typeof record.id !== 'string' || !record.id || !Number.isFinite(record.createdAt)) {
            throw new Error('A saved capture has invalid metadata.');
          }
        }
        resolve(records.sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)));
      } catch (error) { reject(persistenceError('Saved captures could not be read.', error)); }
    };
    transaction.onabort = () => reject(persistenceError('Saved captures could not be read.', transaction.error || request.error));
    transaction.onerror = () => { /* Abort is the terminal failure notification. */ };
  });
}

/** A capture is accepted only after its single atomic write commits to IndexedDB. */
export async function saveXRMedia(capture) {
  await validateCapture(capture);
  const database = await openDatabase();
  const record = {
    id: recordId(), kind: capture.kind, filename: capture.filename.trim(), blob: capture.blob, createdAt: Date.now(),
  };
  return new Promise((resolve, reject) => {
    let transaction;
    let failure;
    try { transaction = database.transaction(STORE_NAME, 'readwrite'); }
    catch (error) { reject(persistenceError('The capture could not be saved.', error)); return; }
    transaction.oncomplete = () => resolve(record);
    transaction.onabort = () => reject(failure || persistenceError('The capture could not be saved.', transaction.error));
    transaction.onerror = () => { /* Never resolve a request before commit. */ };
    const store = transaction.objectStore(STORE_NAME);
    const count = store.index('kind').count(record.kind);
    count.onsuccess = () => {
      if (count.result >= XR_MEDIA_LIMITS[record.kind]) {
        failure = new Error(`The saved ${record.kind} limit is ${XR_MEDIA_LIMITS[record.kind]}. Clear saved captures before taking more.`);
        transaction.abort();
        return;
      }
      // add() refuses an ID collision instead of silently replacing a previous
      // capture. Count and insertion share this serialized write transaction.
      try { store.add(record); }
      catch (error) {
        failure = persistenceError('The capture could not be saved.', error);
        transaction.abort();
      }
    };
  });
}

/** Delete saved media only when explicitly requested by the user. */
export async function clearXRMedia() {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    let transaction;
    try { transaction = database.transaction(STORE_NAME, 'readwrite'); }
    catch (error) { reject(persistenceError('Saved captures could not be cleared.', error)); return; }
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(persistenceError('Saved captures could not be cleared.', transaction.error));
    transaction.onerror = () => { /* Abort reports the final outcome. */ };
    transaction.objectStore(STORE_NAME).clear();
  });
}
