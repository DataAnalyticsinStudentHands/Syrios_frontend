// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CoinSortXR from './CoinSortXR';
import { XR_MEDIA_LIMITS } from './xrMediaLimits';

const mocks = vi.hoisted(() => ({
  support: { supported: true, checking: false, reason: '' },
  fetchCoins: vi.fn(),
  createScene: vi.fn(),
  loadMedia: vi.fn(),
  saveMedia: vi.fn(),
  clearMedia: vi.fn(),
}));

vi.mock('src/hooks/useXRSupport', () => ({ default: () => mocks.support }));
vi.mock('./coinSortXRData', () => ({ fetchXRCoins: mocks.fetchCoins }));
vi.mock('./createCoinSortScene', () => ({ createCoinSortScene: mocks.createScene }));
vi.mock('./xrMediaStore', () => ({ loadXRMedia: mocks.loadMedia, saveXRMedia: mocks.saveMedia, clearXRMedia: mocks.clearMedia }));

const originalXR = Object.getOwnPropertyDescriptor(navigator, 'xr');
const originalCreateObjectURL = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
const originalRevokeObjectURL = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
const coins = [{ id: 'sample-1', title: 'Sample coin', material: 'Bronze', isDemo: true }];

class TestSession extends EventTarget {
  visibilityState = 'visible';
  end = vi.fn(async () => { this.dispatchEvent(new Event('end')); });
}

const deferred = () => {
  let resolve;
  const promise = new Promise((resolvePromise) => { resolve = resolvePromise; });
  return { promise, resolve };
};

let engine;
let requestSession;

const renderPage = () => render(
  <MemoryRouter initialEntries={['/Evidence/CoinSortXR']}><CoinSortXR /></MemoryRouter>,
);

const waitUntilReady = async () => {
  const button = await screen.findByRole('button', { name: 'Enter CoinSort XR' });
  await waitFor(() => expect(button.disabled).toBe(false));
  return button;
};

beforeEach(() => {
  let id = 0;
  mocks.loadMedia.mockReset().mockResolvedValue([]);
  mocks.saveMedia.mockReset().mockImplementation(async (record) => ({ ...record, id: `capture-${++id}`, createdAt: id }));
  mocks.clearMedia.mockReset().mockResolvedValue(undefined);
  mocks.support.supported = true;
  mocks.support.checking = false;
  mocks.support.reason = '';
  mocks.fetchCoins.mockReset().mockResolvedValue({ coins, source: 'demo', warning: '' });
  engine = {
    startSession: vi.fn().mockResolvedValue(undefined),
    setSortBy: vi.fn(),
    reset: vi.fn(),
    dispose: vi.fn(),
    unlockAudio: vi.fn().mockResolvedValue(undefined),
  };
  mocks.createScene.mockReset().mockResolvedValue(engine);
  requestSession = vi.fn().mockResolvedValue(new TestSession());
  Object.defineProperty(navigator, 'xr', { configurable: true, value: { requestSession } });
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn().mockReturnValue('blob:xr-photo') });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
});

afterEach(async () => {
  await act(async () => cleanup());
  if (originalXR) Object.defineProperty(navigator, 'xr', originalXR);
  else delete navigator.xr;
  if (originalCreateObjectURL) Object.defineProperty(URL, 'createObjectURL', originalCreateObjectURL);
  else delete URL.createObjectURL;
  if (originalRevokeObjectURL) Object.defineProperty(URL, 'revokeObjectURL', originalRevokeObjectURL);
  else delete URL.revokeObjectURL;
  vi.restoreAllMocks();
});

describe('CoinSort XR session lifecycle', () => {
  it('does not load coin data or WebGL for an unsupported direct visit', async () => {
    mocks.support.supported = false;
    mocks.support.reason = 'Open this page in your headset browser.';
    renderPage();

    expect(screen.getByRole('status').textContent).toBe('Open this page in your headset browser.');
    expect(screen.queryByRole('button', { name: 'Enter CoinSort XR' })).toBeNull();
    expect(mocks.fetchCoins).not.toHaveBeenCalled();
    expect(mocks.createScene).not.toHaveBeenCalled();
    expect(requestSession).not.toHaveBeenCalled();
  });

  it('prepares the table first and requests immersive VR only after the user enters', async () => {
    const session = new TestSession();
    requestSession.mockResolvedValue(session);
    renderPage();
    const button = await waitUntilReady();

    expect(mocks.createScene).toHaveBeenCalledWith(expect.objectContaining({ coins }));
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByRole('img')).toBeNull();
    expect(requestSession).not.toHaveBeenCalled();
    expect(engine.unlockAudio).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(engine.unlockAudio).toHaveBeenCalledTimes(1);
    expect(engine.unlockAudio.mock.invocationCallOrder[0]).toBeLessThan(requestSession.mock.invocationCallOrder[0]);
    expect(requestSession).toHaveBeenCalledWith('immersive-vr', expect.objectContaining({
      optionalFeatures: expect.arrayContaining(['hand-tracking']),
    }));
    await screen.findByRole('button', { name: 'Leave XR' });
    expect(engine.startSession).toHaveBeenCalledWith(session);
  });

  it('explains denied access and allows another attempt without rebuilding the scene', async () => {
    requestSession.mockRejectedValueOnce(new DOMException('Denied', 'NotAllowedError'));
    renderPage();
    fireEvent.click(await waitUntilReady());

    expect((await screen.findByRole('alert')).textContent).toMatch(/permission.*declined or blocked/i);
    fireEvent.click(await waitUntilReady());
    await screen.findByRole('button', { name: 'Leave XR' });

    expect(requestSession).toHaveBeenCalledTimes(2);
    expect(mocks.createScene).toHaveBeenCalledTimes(1);
    expect(engine.startSession).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('still enters XR when optional audio unlocking is unavailable', async () => {
    engine.unlockAudio.mockRejectedValueOnce(new Error('Audio unavailable'));
    renderPage();
    fireEvent.click(await waitUntilReady());
    await screen.findByRole('button', { name: 'Leave XR' });
    expect(requestSession).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('ends a pending session that arrives after the user leaves the page', async () => {
    const pending = deferred();
    const session = new TestSession();
    requestSession.mockReturnValue(pending.promise);
    const { unmount } = renderPage();
    fireEvent.click(await waitUntilReady());

    unmount();
    await act(async () => pending.resolve(session));

    expect(session.end).toHaveBeenCalledTimes(1);
    expect(engine.startSession).not.toHaveBeenCalled();
    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });

  it('closes an acquired session and offers retry when renderer startup fails', async () => {
    const session = new TestSession();
    requestSession.mockResolvedValue(session);
    engine.startSession.mockRejectedValueOnce(new Error('The graphics context could not enter XR.'));
    renderPage();
    fireEvent.click(await waitUntilReady());

    expect((await screen.findByRole('alert')).textContent).toContain('graphics context');
    expect(session.end).toHaveBeenCalledTimes(1);
    expect((await waitUntilReady()).disabled).toBe(false);
    expect(screen.queryByRole('button', { name: 'Leave XR' })).toBeNull();
  });

  it('handles headset visibility changes and returns to the entry state when the session ends', async () => {
    const session = new TestSession();
    requestSession.mockResolvedValue(session);
    renderPage();
    fireEvent.click(await waitUntilReady());
    await screen.findByRole('button', { name: 'Leave XR' });

    act(() => {
      session.visibilityState = 'hidden';
      session.dispatchEvent(new Event('visibilitychange'));
    });
    expect(screen.getByText('Paused while the headset view is interrupted.')).toBeTruthy();
    await act(async () => session.end());

    expect((await waitUntilReady()).disabled).toBe(false);
    expect(screen.queryByRole('button', { name: 'Leave XR' })).toBeNull();
    expect(mocks.createScene).toHaveBeenCalledTimes(1);
  });

  it('aborts outstanding loading and disposes a scene that finishes after unmount', async () => {
    const pendingScene = deferred();
    mocks.createScene.mockReturnValue(pendingScene.promise);
    const { unmount } = renderPage();
    await waitFor(() => expect(mocks.createScene).toHaveBeenCalledTimes(1));
    const signal = mocks.fetchCoins.mock.calls[0][0].signal;

    unmount();
    expect(signal.aborted).toBe(true);
    await act(async () => pendingScene.resolve(engine));

    expect(engine.dispose).toHaveBeenCalledTimes(1);
    expect(requestSession).not.toHaveBeenCalled();
  });

  it('ends an active session, aborts the load signal, and disposes WebGL when unmounted', async () => {
    const session = new TestSession();
    requestSession.mockResolvedValue(session);
    const { unmount } = renderPage();
    fireEvent.click(await waitUntilReady());
    await screen.findByRole('button', { name: 'Leave XR' });
    const signal = mocks.fetchCoins.mock.calls[0][0].signal;

    unmount();

    expect(session.end).toHaveBeenCalledTimes(1);
    expect(engine.dispose).toHaveBeenCalledTimes(1);
    expect(signal.aborted).toBe(true);
  });

  it('queues a scene photo for an explicit download after leaving XR', async () => {
    const session = new TestSession();
    requestSession.mockResolvedValue(session);
    const { unmount } = renderPage();
    fireEvent.click(await waitUntilReady());
    await screen.findByRole('button', { name: 'Leave XR' });
    const onCapture = mocks.createScene.mock.calls[0][0].onCapture;
    const blob = new Blob(['png'], { type: 'image/png' });

    await act(async () => { await onCapture(blob); });
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(screen.queryByRole('link', { name: 'Save photo' })).toBeNull();
    await act(async () => session.end());

    const download = screen.getByRole('link', { name: 'Save photo' });
    expect(download.getAttribute('href')).toBe('blob:xr-photo');
    expect(download.getAttribute('download')).toMatch(/^coinsort-xr-.*\.png$/);
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:xr-photo');
  });

  it('preserves multiple photos until unmount and ignores a capture arriving afterward', async () => {
    URL.createObjectURL.mockReturnValueOnce('blob:first').mockReturnValueOnce('blob:second');
    const { unmount } = renderPage();
    await waitUntilReady();
    const onCapture = mocks.createScene.mock.calls[0][0].onCapture;
    await act(async () => { await onCapture(new Blob(['first'])); });
    await act(async () => { await onCapture(new Blob(['second'])); });

    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Save photo 1' }).getAttribute('href')).toBe('blob:first');
    expect(screen.getByRole('link', { name: 'Save photo 2' }).getAttribute('href')).toBe('blob:second');
    unmount();
    await expect(onCapture(new Blob(['late']))).rejects.toThrow('closed');
    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:first');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:second');
  });

  it('retains photos up to the shared limit and rejects another capture without replacing one', async () => {
    const session = new TestSession();
    requestSession.mockResolvedValue(session);
    URL.createObjectURL.mockImplementation((blob) => `blob:photo-${blob.size}`);
    renderPage();
    fireEvent.click(await waitUntilReady());
    await screen.findByRole('button', { name: 'Leave XR' });
    const onCapture = mocks.createScene.mock.calls[0][0].onCapture;

    for (let index = 1; index <= XR_MEDIA_LIMITS.photo; index += 1) {
      await act(async () => expect(await onCapture(new Blob(['x'.repeat(index)]))).toBe(true));
    }
    await act(async () => expect(await onCapture(new Blob(['over limit']))).toBe(false));
    expect(URL.createObjectURL).toHaveBeenCalledTimes(XR_MEDIA_LIMITS.photo);
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    expect(screen.queryByRole('link', { name: /Save photo/ })).toBeNull();
    expect(screen.getByRole('alert').textContent).toContain(`Photo storage is full (${XR_MEDIA_LIMITS.photo} photos)`);
    expect(screen.getByRole('alert').textContent).toContain('saved photos are preserved');
    await act(async () => session.end());

    expect(screen.getAllByRole('link', { name: /Save photo/ })).toHaveLength(XR_MEDIA_LIMITS.photo);
    expect(screen.getByRole('link', { name: 'Save photo 1' }).getAttribute('href')).toBe('blob:photo-1');
    expect(screen.getByRole('link', { name: `Save photo ${XR_MEDIA_LIMITS.photo}` }).getAttribute('href')).toBe(`blob:photo-${XR_MEDIA_LIMITS.photo}`);
  });

  it('preserves videos separately from photos and exposes typed downloads only after XR ends', async () => {
    const session = new TestSession();
    requestSession.mockResolvedValue(session);
    URL.createObjectURL.mockReturnValueOnce('blob:photo').mockReturnValueOnce('blob:webm').mockReturnValueOnce('blob:mp4');
    const { unmount } = renderPage();
    fireEvent.click(await waitUntilReady());
    await screen.findByRole('button', { name: 'Leave XR' });
    const { onCapture, onVideo } = mocks.createScene.mock.calls[0][0];

    await act(async () => {
      expect(await onCapture(new Blob(['photo'], { type: 'image/png' }))).toBe(true);
      expect(await onVideo(new Blob(['clip'], { type: 'video/webm;codecs=vp8' }))).toBe(true);
      expect(await onVideo(new Blob(['clip2'], { type: 'video/mp4' }))).toBe(true);
    });
    expect(screen.queryByRole('link', { name: /Save (photo|video)/ })).toBeNull();
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    await act(async () => session.end());

    expect(screen.getByRole('link', { name: 'Save photo' }).getAttribute('href')).toBe('blob:photo');
    expect(screen.getByRole('link', { name: 'Save video 1' }).getAttribute('download')).toMatch(/\.webm$/);
    expect(screen.getByRole('link', { name: 'Save video 2' }).getAttribute('download')).toMatch(/\.mp4$/);
    unmount();
    expect(URL.revokeObjectURL.mock.calls.map(([url]) => url)).toEqual(['blob:photo', 'blob:webm', 'blob:mp4']);
  });

  it('caps videos at the shared limit without replacing a saved clip or consuming photo capacity', async () => {
    URL.createObjectURL.mockImplementation((blob) => `blob:media-${blob.size}`);
    const { unmount } = renderPage();
    await waitUntilReady();
    const { onCapture, onVideo } = mocks.createScene.mock.calls[0][0];
    await act(async () => {
      for (let index = 1; index <= XR_MEDIA_LIMITS.video; index += 1) expect(await onVideo(new Blob(['x'.repeat(index)], { type: 'video/webm' }))).toBe(true);
      expect(await onVideo(new Blob(['over limit'], { type: 'video/webm' }))).toBe(false);
      expect(await onCapture(new Blob(['photo'], { type: 'image/png' }))).toBe(true);
    });

    expect(screen.getAllByRole('link', { name: /Save video/ })).toHaveLength(XR_MEDIA_LIMITS.video);
    expect(screen.getByRole('link', { name: 'Save photo' })).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain(`Video storage is full (${XR_MEDIA_LIMITS.video} clips)`);
    expect(screen.getByRole('alert').textContent).toContain('saved videos are preserved');
    expect(URL.createObjectURL).toHaveBeenCalledTimes(XR_MEDIA_LIMITS.video + 1);
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    unmount();
    await expect(onVideo(new Blob(['late']))).rejects.toThrow('closed');
    expect(URL.createObjectURL).toHaveBeenCalledTimes(XR_MEDIA_LIMITS.video + 1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(XR_MEDIA_LIMITS.video + 1);
  });
});

describe('durable XR captures', () => {
  it('supplies hydrated capture counts and updates them only after successful saves', async () => {
    mocks.loadMedia.mockResolvedValue([
      ...Array.from({ length: 7 }, (_, index) => ({ id: `existing-photo-${index}`, kind: 'photo', filename: `photo-${index}.png`, blob: new Blob(['png']), createdAt: index })),
      ...Array.from({ length: 3 }, (_, index) => ({ id: `existing-video-${index}`, kind: 'video', filename: `video-${index}.webm`, blob: new Blob(['webm']), createdAt: index + 7 })),
    ]);
    renderPage();
    await waitUntilReady();
    const { getCaptureCounts, onCapture, onVideo } = mocks.createScene.mock.calls[0][0];
    expect(getCaptureCounts()).toEqual({ photos: 7, videos: 3 });

    await act(async () => expect(await onCapture(new Blob(['new photo']))).toBe(true));
    expect(getCaptureCounts()).toEqual({ photos: 8, videos: 3 });
    await act(async () => expect(await onVideo(new Blob(['new video'], { type: 'video/webm' }))).toBe(true));
    expect(getCaptureCounts()).toEqual({ photos: 8, videos: 4 });
    expect(mocks.clearMedia).not.toHaveBeenCalled();
  });

  it('waits for storage hydration before preparing or entering XR', async () => {
    const pending = deferred();
    mocks.loadMedia.mockReturnValue(pending.promise);
    renderPage();

    expect(screen.getByRole('button', { name: 'Enter CoinSort XR' }).disabled).toBe(true);
    expect(mocks.createScene).not.toHaveBeenCalled();
    expect(requestSession).not.toHaveBeenCalled();
    await act(async () => pending.resolve([]));
    await waitUntilReady();
    expect(mocks.createScene).toHaveBeenCalledTimes(1);
  });

  it('acknowledges a capture only after its Blob is durably committed', async () => {
    const pending = deferred();
    mocks.saveMedia.mockReturnValue(pending.promise);
    renderPage();
    await waitUntilReady();
    const onCapture = mocks.createScene.mock.calls[0][0].onCapture;
    const blob = new Blob(['png'], { type: 'image/png' });
    let accepted;
    await act(async () => { accepted = onCapture(blob); });

    expect(mocks.saveMedia).toHaveBeenCalledWith(expect.objectContaining({ kind: 'photo', blob }));
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(screen.queryByRole('link', { name: 'Save photo' })).toBeNull();
    const saved = { ...mocks.saveMedia.mock.calls[0][0], id: 'durable-1', createdAt: 1 };
    await act(async () => { pending.resolve(saved); expect(await accepted).toBe(true); });
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(screen.getByRole('link', { name: 'Save photo' })).toBeTruthy();
  });

  it.each(['onCapture', 'onVideo'])('rejects %s storage failures rather than reporting a saved file or queue limit', async (callback) => {
    mocks.saveMedia.mockRejectedValue(new DOMException('Storage quota exceeded', 'QuotaExceededError'));
    renderPage();
    await waitUntilReady();
    const capture = mocks.createScene.mock.calls[0][0][callback];

    await act(async () => {
      await expect(capture(new Blob(['capture']))).rejects.toThrow('Storage quota exceeded');
    });
    expect(screen.getByRole('alert').textContent).toContain('could not be saved on this headset');
    expect(screen.getByRole('alert').textContent).not.toContain('limit reached');
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(screen.queryByRole('link', { name: /Save (photo|video)/ })).toBeNull();
  });

  it('recreates fresh viewing URLs from stored Blobs after unmount and remount', async () => {
    const blob = new Blob(['original pixels'], { type: 'image/png' });
    const record = { id: 'saved-1', kind: 'photo', filename: 'saved-photo.png', blob, createdAt: 1 };
    mocks.loadMedia.mockResolvedValue([record]);
    URL.createObjectURL.mockReturnValueOnce('blob:old-view').mockReturnValueOnce('blob:fresh-view');
    const first = renderPage();
    await waitUntilReady();
    expect(screen.getByRole('link', { name: 'Save photo' }).getAttribute('href')).toBe('blob:old-view');

    first.unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:old-view');
    expect(mocks.clearMedia).not.toHaveBeenCalled();
    renderPage();
    await waitUntilReady();

    expect(mocks.loadMedia).toHaveBeenCalledTimes(2);
    expect(URL.createObjectURL.mock.calls.map(([value]) => value)).toEqual([blob, blob]);
    expect(screen.getByRole('link', { name: 'Save photo' }).getAttribute('href')).toBe('blob:fresh-view');
    expect(mocks.clearMedia).not.toHaveBeenCalled();
  });

  it('retains the saved-photo limit across remounts instead of resetting capacity', async () => {
    mocks.loadMedia.mockResolvedValue(Array.from({ length: XR_MEDIA_LIMITS.photo }, (_, index) => ({
      id: `saved-${index}`, kind: 'photo', filename: `saved-${index}.png`, blob: new Blob(['png']), createdAt: index,
    })));
    renderPage();
    await waitUntilReady();
    const onCapture = mocks.createScene.mock.calls[0][0].onCapture;
    await act(async () => expect(await onCapture(new Blob(['over limit']))).toBe(false));

    expect(mocks.saveMedia).not.toHaveBeenCalled();
    expect(screen.getAllByRole('link', { name: /Save photo/ })).toHaveLength(XR_MEDIA_LIMITS.photo);
  });

  it('keeps files when clearing is cancelled or fails, and removes them only after a confirmed commit', async () => {
    mocks.loadMedia.mockResolvedValue([{ id: 'saved-1', kind: 'photo', filename: 'saved.png', blob: new Blob(['png']), createdAt: 1 }]);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPage();
    await waitUntilReady();
    fireEvent.click(screen.getByRole('button', { name: 'Clear saved captures' }));

    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('This cannot be undone'));
    expect(mocks.clearMedia).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Save photo' })).toBeTruthy();
    confirm.mockReturnValue(true);
    mocks.clearMedia.mockRejectedValueOnce(new Error('Disk failure'));
    fireEvent.click(screen.getByRole('button', { name: 'Clear saved captures' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Your files were kept');
    expect(screen.getByRole('link', { name: 'Save photo' })).toBeTruthy();
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    mocks.clearMedia.mockResolvedValueOnce(undefined);
    fireEvent.click(screen.getByRole('button', { name: 'Clear saved captures' }));
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Save photo' })).toBeNull());
    expect(mocks.clearMedia).toHaveBeenCalledTimes(2);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:xr-photo');
  });

  it('offers storage retry without enabling XR when saved captures could not be loaded', async () => {
    mocks.loadMedia.mockRejectedValueOnce(new Error('Storage unavailable')).mockResolvedValueOnce([]);
    renderPage();
    expect((await screen.findByRole('alert')).textContent).toContain('Saved captures could not be loaded');
    expect(mocks.createScene).not.toHaveBeenCalled();
    expect(requestSession).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitUntilReady();
    expect(mocks.createScene).toHaveBeenCalledTimes(1);
  });
});
