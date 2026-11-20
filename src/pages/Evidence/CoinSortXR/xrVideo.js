import { createXRFrameCapture } from './xrCapture';

const FPS = 15;
export const VIDEO_DURATION_MS = 10000;
const MIME_TYPES = ['video/webm;codecs=vp8', 'video/webm;codecs=vp9', 'video/webm', 'video/mp4;codecs=avc1.42E01E', 'video/mp4'];

/**
 * Record the app scene, with no screen/camera/microphone permissions. Call
 * captureFrame with the XR animation timestamp in milliseconds. stop() flushes
 * a partial clip to onComplete; dispose() cancels unfinished work. The caller
 * owns persistence of the returned Blob. Frame rate, dimensions, and duration
 * stay bounded independently of the headset's immersive render rate.
 */
export function startXRVideo({ renderer, scene, getCamera, durationMs = VIDEO_DURATION_MS, onComplete = () => {}, onError = () => {} }) {
  if (typeof MediaRecorder !== 'function' || typeof HTMLCanvasElement.prototype.captureStream !== 'function') {
    throw new Error('This headset browser cannot record XR video. Photos are still available.');
  }
  if (typeof getCamera !== 'function') throw new Error('The XR camera is not ready for video.');
  const duration = Number.isFinite(durationMs) ? Math.max(100, Math.min(VIDEO_DURATION_MS, durationMs)) : VIDEO_DURATION_MS;
  const frames = createXRFrameCapture({ renderer, scene, width: 960, height: 540 });
  let stream;
  let recorder;
  let track;
  let timer;
  let active = false;
  let cancelled = false;
  let finished = false;
  let cleaned = false;
  let capturedFrames = 0;
  let lastFrame = null;
  let started = 0;
  const chunks = [];
  const stopTracks = () => stream?.getTracks().forEach((item) => item.stop());

  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onVisibility);
    recorder?.removeEventListener('dataavailable', onData);
    recorder?.removeEventListener('stop', finish);
    recorder?.removeEventListener('error', onRecorderError);
    stopTracks();
    frames.dispose();
  }
  function onData(event) {
    if (!cancelled && event.data?.size > 0) chunks.push(event.data);
  }
  function finish() {
    if (finished) return;
    finished = true;
    active = false;
    cleanup();
    if (cancelled) { chunks.length = 0; return; }
    if (!capturedFrames || !chunks.length) {
      chunks.length = 0;
      onError(new Error('No video frames were recorded. Try again while the XR view is active.'));
      return;
    }
    const blob = new Blob(chunks, { type: recorder.mimeType || chunks[0].type || 'video/webm' });
    chunks.length = 0;
    if (!blob.size) { onError(new Error('The XR video was empty. Please try again.')); return; }
    try { onComplete(blob); }
    catch (issue) { onError(issue); }
  }
  function fail(issue) {
    if (cancelled || finished) return;
    cancelled = true;
    active = false;
    try { if (recorder?.state !== 'inactive') recorder?.stop(); }
    catch { /* Cleanup must still run after an encoder failure. */ }
    cleanup();
    chunks.length = 0;
    onError(issue instanceof Error ? issue : new Error('The XR video encoder stopped unexpectedly.'));
  }
  function onRecorderError(event) { fail(event.error || new Error('The XR video encoder failed.')); }
  function stop() {
    if (!active || cancelled || finished) return;
    active = false;
    clearTimeout(timer);
    try {
      if (recorder.state !== 'inactive') recorder.stop();
      else finish();
    } catch (issue) { fail(issue); }
  }
  function onVisibility() {
    // Finalize before a hidden tab suspends timers and XR frames.
    if (document.visibilityState === 'hidden') stop();
  }
  function dispose() {
    if (cancelled || finished) { cleanup(); return; }
    cancelled = true;
    active = false;
    try { if (recorder?.state !== 'inactive') recorder?.stop(); }
    catch { /* Disposal intentionally discards an unfinished recording. */ }
    cleanup();
    chunks.length = 0;
  }

  try {
    try { stream = frames.canvas.captureStream(0); }
    catch { stream = frames.canvas.captureStream(FPS); }
    track = stream.getVideoTracks()[0];
    if (!track) throw new Error('This headset browser could not create a video track.');
    if (typeof track.requestFrame !== 'function') {
      stopTracks();
      stream = frames.canvas.captureStream(FPS);
      track = stream.getVideoTracks()[0];
      if (!track) throw new Error('This headset browser could not create a video track.');
    }
    const mimeType = typeof MediaRecorder.isTypeSupported === 'function'
      ? MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) : null;
    const options = { videoBitsPerSecond: 2000000, ...(mimeType ? { mimeType } : {}) };
    try { recorder = new MediaRecorder(stream, options); }
    catch { recorder = new MediaRecorder(stream); }
    recorder.addEventListener('dataavailable', onData);
    recorder.addEventListener('stop', finish);
    recorder.addEventListener('error', onRecorderError);
    recorder.start(250);
    started = performance.now();
    active = true;
    timer = setTimeout(stop, duration);
    document.addEventListener('visibilitychange', onVisibility);
  } catch (issue) { dispose(); throw issue; }

  function captureFrame(time) {
    if (!active || cancelled || finished) return false;
    if (performance.now() - started >= duration) { stop(); return false; }
    const timestamp = Number.isFinite(time) ? time : performance.now();
    if (lastFrame !== null && timestamp >= lastFrame && timestamp - lastFrame < 1000 / FPS) return false;
    try {
      frames.capture(getCamera());
      track.requestFrame?.();
      capturedFrames += 1;
      lastFrame = timestamp;
      return true;
    } catch (issue) { fail(issue); return false; }
  }
  return { captureFrame, stop, dispose, get recording() { return active && !cancelled && !finished; } };
}
