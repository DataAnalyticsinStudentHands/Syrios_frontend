import React, { useEffect, useRef, useState } from 'react';
import useXRSupport from 'src/hooks/useXRSupport';
import { clearXRMedia, loadXRMedia, saveXRMedia } from './xrMediaStore';
import { XR_MEDIA_LIMITS } from './xrMediaLimits';
import './CoinSortXR.scss';

const describeError = (error) => {
  if (['NotAllowedError', 'SecurityError'].includes(error?.name)) {
    return 'XR permission was declined or blocked. Allow immersive experiences in your headset browser, then try again.';
  }
  if (error?.name === 'NotSupportedError') {
    return 'This headset could not start the requested XR session. Check that immersive VR is enabled in your browser.';
  }
  return error?.message || 'The XR experience could not start. Please try again.';
};

export default function CoinSortXR() {
  const support = useXRSupport();
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const sessionRef = useRef(null);
  const photoRef = useRef([]);
  const videoRef = useRef([]);
  const pendingWritesRef = useRef(new Set());
  const mediaReadyRef = useRef(false);
  const clearingRef = useRef(false);
  const aliveRef = useRef(true);
  const enteringRef = useRef(false);
  const [attempt, setAttempt] = useState(0);
  const [storageAttempt, setStorageAttempt] = useState(0);
  const [storageState, setStorageState] = useState('loading');
  const [clearing, setClearing] = useState(false);
  const [stage, setStage] = useState('loading');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [entering, setEntering] = useState(false);
  const [active, setActive] = useState(false);
  const [visibility, setVisibility] = useState('visible');

  useEffect(() => {
    let disposed = false;
    aliveRef.current = true;
    mediaReadyRef.current = false;
    setActive(false);
    setEntering(false);
    setStorageState('loading');
    const hydrate = async () => {
      try {
        // A refresh may begin while the previous scene is committing a photo.
        // Finish those durable writes before rebuilding links from IndexedDB.
        await Promise.allSettled([...pendingWritesRef.current]);
        const records = await loadXRMedia();
        if (disposed) return;
        const nextPhotos = [];
        const nextVideos = [];
        try {
          records.forEach((record) => {
            const item = { ...record, url: URL.createObjectURL(record.blob) };
            (record.kind === 'video' ? nextVideos : nextPhotos).push(item);
          });
        } catch (issue) {
          [...nextPhotos, ...nextVideos].forEach((item) => URL.revokeObjectURL(item.url));
          throw issue;
        }
        photoRef.current = nextPhotos;
        videoRef.current = nextVideos;
        setPhotos(nextPhotos);
        setVideos(nextVideos);
        mediaReadyRef.current = true;
        setStorageState('ready');
      } catch (issue) {
        if (!disposed) {
          setStorageState('error');
          setError(`Saved captures could not be loaded. ${describeError(issue)}`);
        }
      }
    };
    hydrate();
    return () => {
      disposed = true;
      aliveRef.current = false;
      mediaReadyRef.current = false;
      sessionRef.current?.end().catch(() => {});
      // These are replaceable viewing URLs. Actual Blobs remain in IndexedDB
      // through navigation, reload and React Fast Refresh until explicitly cleared.
      photoRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
      videoRef.current.forEach((video) => URL.revokeObjectURL(video.url));
      photoRef.current = [];
      videoRef.current = [];
    };
  }, [storageAttempt]);

  useEffect(() => {
    if (!support.supported || storageState !== 'ready') return undefined;
    const controller = new AbortController();
    let disposed = false;
    let engine;
    setStage('loading');
    setError('');
    setNotice('');

    const saveMedia = async (blob, video = false) => {
      if (disposed || !aliveRef.current) throw new Error('This XR experience has closed.');
      if (!mediaReadyRef.current || clearingRef.current) throw new Error('Saved captures are still being prepared. Please try again.');
      const queue = video ? videoRef : photoRef;
      if (queue.current.length >= XR_MEDIA_LIMITS[video ? 'video' : 'photo']) {
        setError(video
          ? `Video storage is full (${XR_MEDIA_LIMITS.video} clips). Your saved videos are preserved; leave XR to download them.`
          : `Photo storage is full (${XR_MEDIA_LIMITS.photo} photos). Your saved photos are preserved; leave XR to download them.`);
        return false;
      }
      try {
        const extension = video ? (blob.type?.includes('mp4') ? 'mp4' : 'webm') : 'png';
        const filename = `coinsort-xr-${video ? 'video-' : ''}${new Date().toISOString().replace(/[:.]/g, '-')}-${queue.current.length + 1}.${extension}`;
        const write = saveXRMedia({ kind: video ? 'video' : 'photo', filename, blob });
        pendingWritesRef.current.add(write);
        let record;
        try { record = await write; }
        finally { pendingWritesRef.current.delete(write); }
        if (disposed || !aliveRef.current) throw new Error('This XR experience has closed. The capture remains stored on this headset.');
        const next = { ...record, url: URL.createObjectURL(record.blob) };
        queue.current = [...queue.current, next];
        (video ? setVideos : setPhotos)(queue.current);
        return true;
      } catch (issue) {
        const failure = new Error(`The capture could not be saved on this headset. ${describeError(issue)}`);
        if (!disposed && aliveRef.current) setError(failure.message);
        throw failure;
      }
    };

    const load = async () => {
      try {
        const [sceneModule, dataModule] = await Promise.all([
          import('./createCoinSortScene'),
          import('./coinSortXRData'),
        ]);
        const result = await dataModule.fetchXRCoins({ signal: controller.signal });
        if (disposed) return;
        setNotice(result.warning || '');
        engine = await sceneModule.createCoinSortScene({
          container: containerRef.current,
          coins: result.coins,
          warning: result.warning || '',
          onError: (issue) => { if (!disposed) setError(describeError(issue)); },
          onCapture: (blob) => saveMedia(blob),
          onVideo: (blob) => saveMedia(blob, true),
          getCaptureCounts: () => ({ photos: photoRef.current.length, videos: videoRef.current.length }),
        });
        if (disposed) { engine.dispose(); return; }
        engineRef.current = engine;
        setStage('ready');
      } catch (issue) {
        if (!disposed && issue?.name !== 'AbortError') {
          setError(describeError(issue));
          setStage('error');
        }
      }
    };
    load();
    return () => {
      disposed = true;
      controller.abort();
      if (engineRef.current === engine) engineRef.current = null;
      engine?.dispose();
    };
  }, [support.supported, attempt, storageState]);

  const enterXR = async () => {
    const engine = engineRef.current;
    if (!engine || enteringRef.current || sessionRef.current || !support.supported || !mediaReadyRef.current || clearingRef.current) return;
    enteringRef.current = true;
    setEntering(true);
    setError('');
    let session;
    try {
      // Start optional sound within the same user activation as XR entry.
      try { Promise.resolve(engine.unlockAudio?.()).catch(() => {}); }
      catch { /* Sound is optional; XR entry still proceeds. */ }
      // Keep requestSession directly inside user activation; the scene is ready.
      session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
      });
      if (!aliveRef.current || engineRef.current !== engine) { await session.end(); return; }
      sessionRef.current = session;
      const onVisibility = () => {
        if (aliveRef.current) setVisibility(session.visibilityState);
      };
      const onEnd = () => {
        session.removeEventListener('visibilitychange', onVisibility);
        session.removeEventListener('end', onEnd);
        if (sessionRef.current === session) sessionRef.current = null;
        if (aliveRef.current) { setActive(false); setVisibility('visible'); }
      };
      session.addEventListener('visibilitychange', onVisibility);
      session.addEventListener('end', onEnd);
      await engine.startSession(session);
      if (aliveRef.current && sessionRef.current === session) {
        setActive(true);
        setVisibility(session.visibilityState);
      }
    } catch (issue) {
      if (session) await session.end().catch(() => {});
      if (sessionRef.current === session) sessionRef.current = null;
      if (aliveRef.current) { setActive(false); setError(describeError(issue)); }
    } finally {
      enteringRef.current = false;
      if (aliveRef.current) setEntering(false);
    }
  };

  const exitXR = async () => {
    try { await sessionRef.current?.end(); }
    catch (issue) { if (aliveRef.current) setError(describeError(issue)); }
  };

  const clearSavedCaptures = async () => {
    if (clearingRef.current || !window.confirm('Remove all saved photos and videos from this headset? Save them to your computer first. This cannot be undone.')) return;
    clearingRef.current = true;
    setClearing(true);
    try {
      await Promise.allSettled([...pendingWritesRef.current]);
      await clearXRMedia();
      if (!aliveRef.current) return;
      [...photoRef.current, ...videoRef.current].forEach((item) => URL.revokeObjectURL(item.url));
      photoRef.current = [];
      videoRef.current = [];
      setPhotos([]);
      setVideos([]);
      setError('');
    } catch (issue) {
      if (aliveRef.current) setError(`Saved captures could not be cleared. Your files were kept. ${describeError(issue)}`);
    } finally {
      clearingRef.current = false;
      if (aliveRef.current) setClearing(false);
    }
  };

  const status = support.checking && !support.supported ? 'Checking headset availability…'
    : !support.supported ? support.reason
      : storageState === 'loading' ? 'Preparing saved captures…'
        : storageState === 'error' ? '' : clearing ? 'Clearing local captures…'
          : entering ? 'Opening your immersive session…'
        : active ? (visibility === 'visible' ? '' : 'Paused while the headset view is interrupted.')
          : stage === 'loading' ? 'Preparing CoinSort XR…' : notice;

  return (
    <main className='coinsort-xr' aria-label='CoinSort XR'>
      <div ref={containerRef} className={`coinsort-xr__canvas${active ? ' coinsort-xr__canvas--active' : ''}`} aria-hidden='true' inert='' />
      <div className='coinsort-xr__entry'>
        {support.supported && (
          <button className='coinsort-xr__button'
            disabled={entering || clearing || storageState === 'loading' || (storageState === 'ready' && stage === 'loading')}
            onClick={storageState === 'error' ? () => setStorageAttempt((value) => value + 1) : stage === 'error' ? () => setAttempt((value) => value + 1) : active ? exitXR : enterXR}>
            {entering ? 'Entering XR…' : storageState === 'error' || stage === 'error' ? 'Try again' : active ? 'Leave XR' : 'Enter CoinSort XR'}
          </button>
        )}
        {status && <p className='coinsort-xr__status' role='status'>{status}</p>}
        {error && <p className='coinsort-xr__error' role='alert'>{error}</p>}
        {storageState === 'ready' && !active && !entering && (photos.length > 0 || videos.length > 0) && (
          <div className='coinsort-xr__downloads'>
            {photos.map((photo, index) => (
              <a key={photo.id || photo.filename} className='coinsort-xr__photo' href={photo.url} download={photo.filename}>
                {photos.length === 1 ? 'Save photo' : `Save photo ${index + 1}`}
              </a>
            ))}
            {videos.map((video, index) => (
              <a key={video.id || video.filename} className='coinsort-xr__photo' href={video.url} download={video.filename}>
                {videos.length === 1 ? 'Save video' : `Save video ${index + 1}`}
              </a>
            ))}
            <button className='coinsort-xr__clear' disabled={clearing} onClick={clearSavedCaptures}>Clear saved captures</button>
          </div>
        )}
      </div>
    </main>
  );
}
