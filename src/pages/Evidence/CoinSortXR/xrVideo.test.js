// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startXRVideo, VIDEO_DURATION_MS } from './xrVideo';

const mocks = vi.hoisted(() => ({ createFrames: vi.fn() }));
vi.mock('./xrCapture', () => ({ createXRFrameCapture: mocks.createFrames }));

class FakeRecorder extends EventTarget {
  static instances = [];
  static autoFinish = true;
  static empty = false;
  static isTypeSupported = vi.fn((type) => type === 'video/webm;codecs=vp8');
  constructor(stream, options = {}) {
    super();
    this.stream = stream;
    this.options = options;
    this.mimeType = options.mimeType || 'video/webm';
    this.state = 'inactive';
    this.stop = vi.fn(() => {
      this.state = 'inactive';
      if (FakeRecorder.autoFinish) this.flush();
    });
    FakeRecorder.instances.push(this);
  }
  start(timeslice) { this.timeslice = timeslice; this.state = 'recording'; }
  flush() {
    const data = new Event('dataavailable');
    data.data = new Blob(FakeRecorder.empty ? [] : ['encoded clip'], { type: this.mimeType });
    this.dispatchEvent(data);
    this.dispatchEvent(new Event('stop'));
  }
}

const originalCaptureStream = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'captureStream');
let frames;
let streams;
let manualFrames;
let now;
let clip;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  now = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  FakeRecorder.instances = [];
  FakeRecorder.autoFinish = true;
  FakeRecorder.empty = false;
  FakeRecorder.isTypeSupported.mockClear();
  vi.stubGlobal('MediaRecorder', FakeRecorder);
  streams = [];
  manualFrames = true;
  Object.defineProperty(HTMLCanvasElement.prototype, 'captureStream', {
    configurable: true,
    value: vi.fn((fps) => {
      const track = { stop: vi.fn(), ...(manualFrames ? { requestFrame: vi.fn() } : {}) };
      const stream = { fps, getTracks: () => [track], getVideoTracks: () => [track] };
      streams.push(stream);
      return stream;
    }),
  });
  frames = { canvas: document.createElement('canvas'), capture: vi.fn(), dispose: vi.fn() };
  mocks.createFrames.mockReset().mockReturnValue(frames);
  clip = null;
});

afterEach(() => {
  clip?.dispose();
  if (originalCaptureStream) Object.defineProperty(HTMLCanvasElement.prototype, 'captureStream', originalCaptureStream);
  else delete HTMLCanvasElement.prototype.captureStream;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const record = (options = {}) => {
  const onComplete = vi.fn();
  const onError = vi.fn();
  const camera = { name: 'viewer camera' };
  clip = startXRVideo({ renderer: {}, scene: {}, getCamera: () => camera, onComplete, onError, ...options });
  return { onComplete, onError, camera, recorder: FakeRecorder.instances[0] };
};

describe('short XR scene videos', () => {
  it('records silent VP8 with reusable 960×540 targets and throttles to fifteen frames per second', () => {
    const { camera, recorder } = record();
    expect(clip.recording).toBe(true);
    expect(mocks.createFrames).toHaveBeenCalledWith(expect.objectContaining({ width: 960, height: 540 }));
    expect(recorder.options.mimeType).toBe('video/webm;codecs=vp8');
    expect(recorder.timeslice).toBe(250);
    expect(streams[0].fps).toBe(0);
    expect(clip.captureFrame(0)).toBe(true);
    expect(clip.captureFrame(30)).toBe(false);
    expect(clip.captureFrame(66)).toBe(false);
    expect(clip.captureFrame(67)).toBe(true);
    expect(clip.captureFrame(100)).toBe(false);
    expect(clip.captureFrame(134)).toBe(true);
    expect(frames.capture).toHaveBeenCalledTimes(3);
    expect(frames.capture).toHaveBeenLastCalledWith(camera);
    expect(streams[0].getVideoTracks()[0].requestFrame).toHaveBeenCalledTimes(3);
  });

  it('continues past five seconds and finalizes at ten seconds with all capture resources stopped', () => {
    const { onComplete, onError, recorder } = record();
    clip.captureFrame(0);
    expect(VIDEO_DURATION_MS).toBe(10000);
    vi.advanceTimersByTime(5000);
    expect(clip.recording).toBe(true);
    expect(onComplete).not.toHaveBeenCalled();
    expect(recorder.stop).not.toHaveBeenCalled();
    vi.advanceTimersByTime(4999);
    expect(clip.recording).toBe(true);
    vi.advanceTimersByTime(1);

    expect(clip.recording).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
    const blob = onComplete.mock.calls[0][0];
    expect(blob.type).toBe('video/webm;codecs=vp8');
    expect(blob.size).toBeGreaterThan(0);
    expect(onError).not.toHaveBeenCalled();
    expect(recorder.stop).toHaveBeenCalledTimes(1);
    expect(streams[0].getVideoTracks()[0].stop).toHaveBeenCalledTimes(1);
    expect(frames.dispose).toHaveBeenCalledTimes(1);
    expect(clip.captureFrame(10100)).toBe(false);
  });

  it('allows early stop and waits for the encoder to flush the partial clip', () => {
    FakeRecorder.autoFinish = false;
    const { onComplete, recorder } = record();
    clip.captureFrame(0);
    vi.advanceTimersByTime(3500);
    clip.stop();
    expect(clip.recording).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
    recorder.flush();

    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(12000);
    expect(recorder.stop).toHaveBeenCalledTimes(1);
    expect(frames.dispose).toHaveBeenCalledTimes(1);
  });

  it('discards a recording on disposal and ignores late encoder events', () => {
    FakeRecorder.autoFinish = false;
    const { onComplete, onError, recorder } = record();
    clip.captureFrame(0);
    clip.dispose();
    recorder.flush();
    vi.advanceTimersByTime(12000);

    expect(clip.recording).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(recorder.stop).toHaveBeenCalledTimes(1);
    expect(frames.dispose).toHaveBeenCalledTimes(1);
    expect(streams[0].getVideoTracks()[0].stop).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])('reports an empty or frame-free recording instead of claiming success (empty=%s)', (empty) => {
    FakeRecorder.empty = empty;
    const { onComplete, onError } = record();
    if (empty) clip.captureFrame(0);
    clip.stop();

    expect(onComplete).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('No video frames') }));
    expect(frames.dispose).toHaveBeenCalledTimes(1);
  });

  it('cleans up after a render or encoder error without delivering a successful clip', () => {
    const { onComplete, onError } = record();
    frames.capture.mockImplementationOnce(() => { throw new Error('Capture target failed'); });
    expect(clip.captureFrame(0)).toBe(false);

    expect(clip.recording).toBe(false);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Capture target failed' }));
    expect(onComplete).not.toHaveBeenCalled();
    expect(frames.dispose).toHaveBeenCalledTimes(1);
  });

  it('handles MediaRecorder errors and frees the underlying stream', () => {
    const { onComplete, onError, recorder } = record();
    clip.captureFrame(0);
    const event = new Event('error');
    event.error = new Error('Encoder failed');
    recorder.dispatchEvent(event);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
    expect(clip.recording).toBe(false);
    expect(frames.dispose).toHaveBeenCalledTimes(1);
  });

  it('uses a fifteen-FPS canvas stream when manual frame requests are unavailable', () => {
    manualFrames = false;
    const { onComplete } = record();
    expect(streams.map((stream) => stream.fps)).toEqual([0, 15]);
    expect(streams[0].getTracks()[0].stop).toHaveBeenCalledTimes(1);
    clip.captureFrame(0);
    clip.stop();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(streams[1].getTracks()[0].stop).toHaveBeenCalledTimes(1);
  });

  it('stops before capturing a frame after the wall-clock duration has elapsed', () => {
    const { onComplete } = record();
    clip.captureFrame(0);
    now = 10100;
    expect(clip.captureFrame(10100)).toBe(false);
    expect(frames.capture).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it.each([undefined, NaN, 60000])('keeps the ten-second maximum for duration=%s', (durationMs) => {
    const { onComplete } = record({ durationMs });
    clip.captureFrame(0);
    vi.advanceTimersByTime(9999);
    expect(clip.recording).toBe(true);
    vi.advanceTimersByTime(1);
    expect(clip.recording).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('still permits an explicitly shorter bounded recording', () => {
    const { onComplete } = record({ durationMs: 2000 });
    clip.captureFrame(0);
    vi.advanceTimersByTime(1999);
    expect(clip.recording).toBe(true);
    vi.advanceTimersByTime(1);
    expect(clip.recording).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('fails clearly without allocating GPU resources when recording is unsupported', () => {
    vi.stubGlobal('MediaRecorder', undefined);
    expect(() => record()).toThrow('cannot record XR video');
    expect(mocks.createFrames).not.toHaveBeenCalled();
  });
});
