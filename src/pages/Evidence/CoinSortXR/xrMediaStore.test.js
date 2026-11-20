import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { createHash } from 'node:crypto';
import { clearXRMedia, loadXRMedia, saveXRMedia } from './xrMediaStore';
import { XR_MEDIA_LIMITS } from './xrMediaLimits';

const png = () => new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4])], { type: 'image/png' });
const webm = () => new Blob([new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 1, 2, 3, 4])], { type: 'video/webm;codecs=vp9' });
const mp4 = () => new Blob([new Uint8Array([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 1, 2, 3, 4])], { type: 'video/mp4' });
const photo = (index = 1) => ({ kind: 'photo', filename: `coinsort-xr-photo-${index}.png`, blob: png() });
const video = (index = 1) => ({ kind: 'video', filename: `coinsort-xr-video-${index}.webm`, blob: webm() });
const sha256 = async (blob) => createHash('sha256').update(new Uint8Array(await blob.arrayBuffer())).digest('hex');

beforeEach(() => {
  vi.stubGlobal('indexedDB', new IDBFactory());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('durable XR capture storage', () => {
  it('shares the increased sixteen-photo and six-video limits as immutable configuration', () => {
    expect(XR_MEDIA_LIMITS).toEqual({ photo: 16, video: 6 });
    expect(Object.isFrozen(XR_MEDIA_LIMITS)).toBe(true);
  });

  it('starts empty and stores the actual Blob with stable metadata', async () => {
    expect(await loadXRMedia()).toEqual([]);
    const capture = photo();
    const saved = await saveXRMedia(capture);
    expect(saved).toMatchObject({ kind: 'photo', filename: capture.filename, blob: capture.blob });
    expect(typeof saved.id).toBe('string');
    expect(saved.id).not.toBe('');
    expect(Number.isFinite(saved.createdAt)).toBe(true);
    const records = await loadXRMedia();
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe(saved.id);
    expect(records[0].blob).toBeInstanceOf(Blob);
    expect(await sha256(records[0].blob)).toBe(await sha256(capture.blob));
  });

  it('retains capture bytes after object-URL revocation and module reinitialization', async () => {
    const capture = photo();
    const oldUrl = URL.createObjectURL(capture.blob);
    const expectedHash = await sha256(capture.blob);
    const saved = await saveXRMedia(capture);
    URL.revokeObjectURL(oldUrl);
    vi.resetModules();
    const reinitialized = await import('./xrMediaStore');
    const records = await reinitialized.loadXRMedia();
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe(saved.id);
    expect(await sha256(records[0].blob)).toBe(expectedHash);
    const restoredUrl = URL.createObjectURL(records[0].blob);
    try {
      const response = await fetch(restoredUrl);
      expect(response.ok).toBe(true);
      expect(await sha256(await response.blob())).toBe(expectedHash);
    } finally { URL.revokeObjectURL(restoredUrl); }
  });

  it('atomically limits concurrent photo saves without replacing older captures', async () => {
    const results = await Promise.allSettled(Array.from({ length: XR_MEDIA_LIMITS.photo + 4 }, (_, index) => saveXRMedia(photo(index))));
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(XR_MEDIA_LIMITS.photo);
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(4);
    const accepted = results.filter((result) => result.status === 'fulfilled').map((result) => result.value.id);
    const records = await loadXRMedia();
    expect(records).toHaveLength(XR_MEDIA_LIMITS.photo);
    expect(new Set(records.map((record) => record.id))).toEqual(new Set(accepted));
    expect(results.find((result) => result.status === 'rejected').reason.message).toContain(`limit is ${XR_MEDIA_LIMITS.photo}`);
  });

  it('keeps photo and video quotas separate and accepts WebM and MP4', async () => {
    await Promise.all(Array.from({ length: XR_MEDIA_LIMITS.photo }, (_, index) => saveXRMedia(photo(index))));
    const results = await Promise.allSettled([
      saveXRMedia(video(1)), saveXRMedia(video(2)),
      saveXRMedia({ kind: 'video', filename: 'coinsort-xr-video-3.mp4', blob: mp4() }),
      ...Array.from({ length: XR_MEDIA_LIMITS.video - 2 }, (_, index) => saveXRMedia(video(index + 4))),
    ]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(XR_MEDIA_LIMITS.video);
    expect(results.find((result) => result.status === 'rejected').reason.message).toContain(`limit is ${XR_MEDIA_LIMITS.video}`);
    const records = await loadXRMedia();
    expect(records.filter((record) => record.kind === 'photo')).toHaveLength(XR_MEDIA_LIMITS.photo);
    expect(records.filter((record) => record.kind === 'video')).toHaveLength(XR_MEDIA_LIMITS.video);
    expect(records.some((record) => record.filename.endsWith('.mp4'))).toBe(true);
  });

  it('preserves an existing seven-photo/three-video collection byte-for-byte while accepting the increased capacity', async () => {
    const existing = await Promise.all([
      ...Array.from({ length: 7 }, (_, index) => saveXRMedia(photo(index))),
      ...Array.from({ length: 3 }, (_, index) => saveXRMedia(video(index))),
    ]);
    const originalHashes = new Map(await Promise.all(existing.map(async (record) => [record.id, await sha256(record.blob)])));
    await Promise.all([
      ...Array.from({ length: XR_MEDIA_LIMITS.photo - 7 }, (_, index) => saveXRMedia(photo(index + 7))),
      ...Array.from({ length: XR_MEDIA_LIMITS.video - 3 }, (_, index) => saveXRMedia(video(index + 3))),
    ]);

    const records = await loadXRMedia();
    expect(records.filter((record) => record.kind === 'photo')).toHaveLength(XR_MEDIA_LIMITS.photo);
    expect(records.filter((record) => record.kind === 'video')).toHaveLength(XR_MEDIA_LIMITS.video);
    for (const original of existing) {
      const restored = records.find((record) => record.id === original.id);
      expect(restored.filename).toBe(original.filename);
      expect(await sha256(restored.blob)).toBe(originalHashes.get(original.id));
    }
    await expect(saveXRMedia(photo(99))).rejects.toThrow(`limit is ${XR_MEDIA_LIMITS.photo}`);
    await expect(saveXRMedia(video(99))).rejects.toThrow(`limit is ${XR_MEDIA_LIMITS.video}`);
  });

  it('clears captures only through the explicit clear operation', async () => {
    await saveXRMedia(photo());
    await saveXRMedia(video());
    await clearXRMedia();
    expect(await loadXRMedia()).toEqual([]);
    expect((await saveXRMedia(photo(2))).filename).toContain('photo-2');
  });

  it('reports missing browser storage instead of accepting an ephemeral capture', async () => {
    vi.stubGlobal('indexedDB', undefined);
    await expect(saveXRMedia(photo())).rejects.toThrow('storage is unavailable');
    await expect(loadXRMedia()).rejects.toThrow('storage is unavailable');
  });

  it('can retry after a synchronous storage-open failure', async () => {
    const factory = new IDBFactory();
    const open = vi.fn().mockImplementationOnce(() => { throw new DOMException('Blocked', 'SecurityError'); })
      .mockImplementation((...args) => factory.open(...args));
    vi.stubGlobal('indexedDB', { open });
    await expect(loadXRMedia()).rejects.toThrow('could not be opened');
    expect(await loadXRMedia()).toEqual([]);
  });

  it('rejects a full-disk write while retaining already committed captures', async () => {
    const existing = await saveXRMedia(photo());
    vi.spyOn(IDBObjectStore.prototype, 'add').mockImplementationOnce(() => {
      throw new DOMException('Quota exhausted', 'QuotaExceededError');
    });
    await expect(saveXRMedia(photo(2))).rejects.toThrow('Device storage is full');
    expect((await loadXRMedia()).map((record) => record.id)).toEqual([existing.id]);
  });

  it('does not report success when a transaction aborts after its insert request succeeded', async () => {
    const add = IDBObjectStore.prototype.add;
    vi.spyOn(IDBObjectStore.prototype, 'add').mockImplementationOnce(function (...args) {
      const request = add.apply(this, args);
      request.addEventListener('success', () => this.transaction.abort());
      return request;
    });
    await expect(saveXRMedia(photo())).rejects.toThrow('could not be saved');
    expect(await loadXRMedia()).toEqual([]);
  });

  it('preserves captures if an explicit clear transaction fails', async () => {
    const existing = await saveXRMedia(photo());
    const clear = IDBObjectStore.prototype.clear;
    vi.spyOn(IDBObjectStore.prototype, 'clear').mockImplementationOnce(function (...args) {
      const request = clear.apply(this, args);
      request.addEventListener('success', () => this.transaction.abort());
      return request;
    });
    await expect(clearXRMedia()).rejects.toThrow('could not be cleared');
    expect((await loadXRMedia()).map((record) => record.id)).toEqual([existing.id]);
  });

  it('does not overwrite an existing capture if a generated ID collides', async () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'same-id' });
    const existing = await saveXRMedia(photo());
    await expect(saveXRMedia(photo(2))).rejects.toThrow('could not be saved');
    expect((await loadXRMedia()).map((record) => record.filename)).toEqual([existing.filename]);
  });

  it.each([
    ['unsupported kind', { ...photo(), kind: 'audio' }],
    ['empty Blob', { ...photo(), blob: new Blob([], { type: 'image/png' }) }],
    ['plain object', { ...photo(), blob: { type: 'image/png', size: 12 } }],
    ['photo/video mismatch', { ...photo(), blob: webm() }],
    ['video/photo mismatch', { ...video(), blob: png() }],
    ['unsafe filename', { ...photo(), filename: '../capture.png' }],
    ['wrong extension', { ...photo(), filename: 'capture.webm' }],
    ['incorrect file header', { ...photo(), blob: new Blob(['not a PNG'], { type: 'image/png' }) }],
  ])('rejects invalid captures before persisting: %s', async (label, capture) => {
    await expect(saveXRMedia(capture)).rejects.toThrow();
    expect(await loadXRMedia()).toEqual([]);
  });
});
