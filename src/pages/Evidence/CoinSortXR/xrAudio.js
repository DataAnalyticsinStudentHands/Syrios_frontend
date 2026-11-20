const COOLDOWNS = { coin: 0.085, tap: 0.06, correct: 0.16, incorrect: 0.2, capture: 0.16 };
const MAX_VOICES = 6;

/**
 * Optional synthesized cues, separate from input and physics. unlock() is called
 * during entry user activation; play() never starts a suspended context itself.
 * Positions/listener poses use world metres, volume is 0..1, and dispose() owns
 * all sources and the context. Unsupported or blocked audio remains a no-op.
 */
export function createCoinSortAudio({ AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext, volume = 0.25 } = {}) {
  let context;
  let master;
  let disposed = false;
  let level = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.25;
  const buffers = new Map();
  const lastPlayed = new Map();
  const voices = new Set();

  function setVolume(value) {
    if (!Number.isFinite(value)) return;
    level = Math.max(0, Math.min(1, value));
    if (master) master.gain.value = level;
  }
  function unlock() {
    if (disposed || typeof AudioContextClass !== 'function') return Promise.resolve(false);
    try {
      if (!context) {
        context = new AudioContextClass({ latencyHint: 'interactive' });
        master = context.createGain();
        master.gain.value = level;
        master.connect(context.destination);
      }
      return Promise.resolve(context.state === 'suspended' ? context.resume() : undefined)
        .then(() => !disposed && context.state === 'running').catch(() => false);
    } catch { return Promise.resolve(false); }
  }
  function bufferFor(kind) {
    if (buffers.has(kind)) return buffers.get(kind);
    const duration = kind === 'coin' ? 0.14 : kind === 'tap' ? 0.045 : 0.19;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i += 1) {
      const t = i / context.sampleRate;
      const attack = Math.min(1, t / 0.002);
      const fade = Math.min(1, (duration - t) / 0.012);
      let value;
      if (kind === 'coin') {
        value = Math.sin(t * 2 * Math.PI * 1760) * Math.exp(-38 * t)
          + 0.45 * Math.sin(t * 2 * Math.PI * 2873) * Math.exp(-52 * t)
          + 0.2 * Math.sin(t * 2 * Math.PI * 4221) * Math.exp(-70 * t);
      } else if (kind === 'incorrect') {
        value = Math.sin(2 * Math.PI * (260 * t - 140 * t * t)) * Math.exp(-18 * t);
      } else if (kind === 'correct' || kind === 'capture') {
        const high = kind === 'correct' ? 880 : 1046;
        value = Math.sin(t * 2 * Math.PI * 660) * Math.exp(-24 * t);
        if (t > 0.055) value += 0.65 * Math.sin((t - 0.055) * 2 * Math.PI * high) * Math.exp(-24 * (t - 0.055));
      } else value = Math.sin(t * 2 * Math.PI * 1050) * Math.exp(-95 * t);
      samples[i] = value * attack * fade * 0.14;
    }
    buffers.set(kind, buffer);
    return buffer;
  }
  function play(kind, { strength = 1, position } = {}) {
    if (disposed || !level || context?.state !== 'running' || !Object.hasOwn(COOLDOWNS, kind)
      || !Number.isFinite(strength) || strength < 0.08 || voices.size >= MAX_VOICES) return false;
    const now = context.currentTime;
    if (now - (lastPlayed.get(kind) ?? -Infinity) < COOLDOWNS[kind]) return false;
    let source;
    let gain;
    let panner;
    let voice;
    const cleanup = () => {
      source?.disconnect();
      gain?.disconnect();
      panner?.disconnect();
      if (voice) voices.delete(voice);
    };
    try {
      source = context.createBufferSource();
      source.buffer = bufferFor(kind);
      gain = context.createGain();
      gain.gain.value = Math.min(1, strength);
      source.connect(gain);
      if (position && [position.x, position.y, position.z].every(Number.isFinite) && context.createPanner) {
        panner = context.createPanner();
        panner.panningModel = 'equalpower';
        panner.distanceModel = 'inverse';
        panner.refDistance = 0.4;
        panner.maxDistance = 6;
        panner.rolloffFactor = 0.7;
        if (panner.positionX) {
          panner.positionX.value = position.x;
          panner.positionY.value = position.y;
          panner.positionZ.value = position.z;
        } else panner.setPosition(position.x, position.y, position.z);
        gain.connect(panner);
        panner.connect(master);
      } else gain.connect(master);
      voice = { source, cleanup };
      voices.add(voice);
      source.onended = cleanup;
      source.start(now);
      lastPlayed.set(kind, now);
      return true;
    } catch { cleanup(); return false; }
  }
  function updateListener(position, quaternion) {
    if (disposed || !context?.listener || !position || !quaternion
      || ![position.x, position.y, position.z, quaternion.x, quaternion.y, quaternion.z, quaternion.w].every(Number.isFinite)) return;
    try {
      const { x, y, z, w } = quaternion;
      const forward = [-2 * (x * z + w * y), -2 * (y * z - w * x), -(1 - 2 * (x * x + y * y))];
      const up = [2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x)];
      const listener = context.listener;
      if (listener.positionX) {
        ['X', 'Y', 'Z'].forEach((axis, i) => {
          listener[`position${axis}`].value = position[['x', 'y', 'z'][i]];
          listener[`forward${axis}`].value = forward[i];
          listener[`up${axis}`].value = up[i];
        });
      } else {
        listener.setPosition(position.x, position.y, position.z);
        listener.setOrientation(...forward, ...up);
      }
    } catch { /* Audio remains optional if a listener implementation fails. */ }
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const voice of [...voices]) {
      try { voice.source.stop(); } catch { /* Already ended. */ }
      voice.cleanup();
    }
    buffers.clear();
    lastPlayed.clear();
    try { master?.disconnect(); } catch { /* Already disconnected. */ }
    try { context?.close()?.catch(() => {}); } catch { /* Unsupported close. */ }
  }
  return { unlock, play, setVolume, updateListener, dispose };
}

/** Controller-only feedback; unsupported or rejected haptics stay silent. */
export function pulseController(source, strength = 0.18) {
  if (!source || source.hand || !Number.isFinite(strength)) return;
  const actuator = source.gamepad?.hapticActuators?.[0];
  if (typeof actuator?.pulse !== 'function') return;
  try { Promise.resolve(actuator.pulse(Math.max(0, Math.min(0.35, strength)), 24)).catch(() => {}); }
  catch { /* A haptic failure must never interrupt an action. */ }
}
