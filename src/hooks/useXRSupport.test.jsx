// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import useXRSupport from './useXRSupport';

const originalXR = Object.getOwnPropertyDescriptor(navigator, 'xr');

const setXR = (value) => Object.defineProperty(navigator, 'xr', {
  configurable: true,
  value,
});

const makeXR = (support = vi.fn().mockResolvedValue(true)) => {
  const xr = new EventTarget();
  xr.isSessionSupported = support;
  xr.requestSession = vi.fn();
  setXR(xr);
  return xr;
};

const deferred = () => {
  let resolve;
  const promise = new Promise((resolvePromise) => { resolve = resolvePromise; });
  return { promise, resolve };
};

beforeEach(() => {
  vi.stubGlobal('isSecureContext', true);
});

afterEach(() => {
  cleanup();
  if (originalXR) Object.defineProperty(navigator, 'xr', originalXR);
  else delete navigator.xr;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('WebXR capability detection', () => {
  it('skips device probing while disabled and responds to enabling or disabling access', async () => {
    const xr = makeXR();
    const { result, rerender } = renderHook(({ enabled }) => useXRSupport(enabled), {
      initialProps: { enabled: false },
    });

    expect(result.current.supported).toBe(false);
    expect(result.current.checking).toBe(false);
    act(() => xr.dispatchEvent(new Event('devicechange')));
    expect(xr.isSessionSupported).not.toHaveBeenCalled();

    rerender({ enabled: true });
    await waitFor(() => expect(result.current.supported).toBe(true));
    rerender({ enabled: false });
    expect(result.current.supported).toBe(false);
    expect(result.current.checking).toBe(false);
    expect(xr.requestSession).not.toHaveBeenCalled();
  });

  it('keeps unsupported browsers unavailable without requesting a session', async () => {
    setXR(undefined);
    const { result } = renderHook(() => useXRSupport());

    await waitFor(() => expect(result.current.checking).toBe(false));
    expect(result.current.supported).toBe(false);
    expect(result.current.reason).toBeTruthy();
  });

  it('requires a secure context before consulting the XR device', async () => {
    vi.stubGlobal('isSecureContext', false);
    const xr = makeXR();
    const { result } = renderHook(() => useXRSupport());

    await waitFor(() => expect(result.current.checking).toBe(false));
    expect(result.current.supported).toBe(false);
    expect(xr.isSessionSupported).not.toHaveBeenCalled();
    expect(xr.requestSession).not.toHaveBeenCalled();
  });

  it('checks immersive VR support without opening an immersive session', async () => {
    const xr = makeXR();
    const { result } = renderHook(() => useXRSupport());

    await waitFor(() => expect(result.current.supported).toBe(true));
    expect(result.current.checking).toBe(false);
    expect(xr.isSessionSupported).toHaveBeenCalledWith('immersive-vr');
    expect(xr.requestSession).not.toHaveBeenCalled();
  });

  it('hides XR access when immersive VR is unavailable', async () => {
    const xr = makeXR(vi.fn().mockResolvedValue(false));
    const { result } = renderHook(() => useXRSupport());

    await waitFor(() => expect(result.current.checking).toBe(false));
    expect(result.current.supported).toBe(false);
    expect(result.current.reason).toBeTruthy();
    expect(xr.requestSession).not.toHaveBeenCalled();
  });

  it('handles permission or policy rejection without an unhandled failure', async () => {
    makeXR(vi.fn().mockRejectedValue(new DOMException('XR denied', 'SecurityError')));
    const { result } = renderHook(() => useXRSupport());

    await waitFor(() => expect(result.current.checking).toBe(false));
    expect(result.current.supported).toBe(false);
    expect(result.current.reason).toBeTruthy();
  });

  it('rechecks access when devices change and removes its listener on unmount', async () => {
    const xr = makeXR(vi.fn().mockResolvedValueOnce(false).mockResolvedValue(true));
    const removeListener = vi.spyOn(xr, 'removeEventListener');
    const { result, unmount } = renderHook(() => useXRSupport());

    await waitFor(() => expect(result.current.checking).toBe(false));
    expect(result.current.supported).toBe(false);
    act(() => xr.dispatchEvent(new Event('devicechange')));
    await waitFor(() => expect(result.current.supported).toBe(true));

    unmount();
    expect(removeListener).toHaveBeenCalledWith('devicechange', expect.any(Function));
    expect(xr.requestSession).not.toHaveBeenCalled();
  });

  it('ignores an older capability result after a newer device check', async () => {
    const oldCheck = deferred();
    const newCheck = deferred();
    const xr = makeXR(vi.fn()
      .mockReturnValueOnce(oldCheck.promise)
      .mockReturnValueOnce(newCheck.promise));
    const { result } = renderHook(() => useXRSupport());

    act(() => xr.dispatchEvent(new Event('devicechange')));
    await act(async () => newCheck.resolve(true));
    expect(result.current.supported).toBe(true);

    await act(async () => oldCheck.resolve(false));
    expect(result.current.supported).toBe(true);
    expect(result.current.checking).toBe(false);
  });

  it('allows an outstanding capability check to settle after unmount', async () => {
    const check = deferred();
    makeXR(vi.fn().mockReturnValue(check.promise));
    const { unmount } = renderHook(() => useXRSupport());

    unmount();
    await act(async () => check.resolve(true));
  });
});
