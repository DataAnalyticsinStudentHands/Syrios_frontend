import { describe, expect, it, vi } from 'vitest';
import { createCoinSortAudio, pulseController } from './xrAudio';

function audioHarness({ resumeFailure = false, sourceFailure = false } = {}) {
  const nodes = [];
  const sources = [];
  let context;
  const node = (extra = {}) => {
    const value = { connect: vi.fn(), disconnect: vi.fn(), ...extra };
    nodes.push(value);
    return value;
  };
  const param = () => ({ value: 0 });
  class FakeContext {
    constructor() {
      context = this;
      this.state = 'suspended';
      this.currentTime = 0;
      this.sampleRate = 1000;
      this.destination = {};
      this.listener = Object.fromEntries(['position', 'forward', 'up'].flatMap((prefix) =>
        ['X', 'Y', 'Z'].map((axis) => [`${prefix}${axis}`, param()])));
      this.resume = vi.fn(async () => {
        if (resumeFailure) throw new Error('Audio blocked');
        this.state = 'running';
      });
      this.close = vi.fn(async () => { this.state = 'closed'; });
    }
    createGain() { return node({ gain: param() }); }
    createBuffer(channels, length) { return { getChannelData: () => new Float32Array(length) }; }
    createBufferSource() {
      const source = node({ start: vi.fn(() => { if (sourceFailure) throw new Error('Source unavailable'); }), stop: vi.fn() });
      sources.push(source);
      return source;
    }
    createPanner() { return node({ positionX: param(), positionY: param(), positionZ: param() }); }
  }
  return { FakeContext, nodes, sources, get context() { return context; } };
}

describe('optional CoinSort XR audio', () => {
  it('stays harmless when audio is unavailable', async () => {
    const audio = createCoinSortAudio({ AudioContextClass: null });
    expect(await audio.unlock()).toBe(false);
    expect(audio.play('tap')).toBe(false);
    expect(() => { audio.updateListener({}, {}); audio.setVolume(0); audio.dispose(); }).not.toThrow();
  });

  it('creates and resumes audio only when unlocked, and isolates permission failures', async () => {
    const harness = audioHarness({ resumeFailure: true });
    const audio = createCoinSortAudio({ AudioContextClass: harness.FakeContext });
    expect(harness.context).toBeUndefined();
    expect(audio.play('tap')).toBe(false);
    expect(await audio.unlock()).toBe(false);
    expect(audio.play('correct')).toBe(false);
    audio.dispose();
    expect(harness.context.close).toHaveBeenCalledOnce();
  });

  it('limits rapid pile noises and concurrent voices, then reuses capacity after a cue ends', async () => {
    const harness = audioHarness();
    const audio = createCoinSortAudio({ AudioContextClass: harness.FakeContext });
    await audio.unlock();
    expect(audio.play('coin', { strength: 0.01 })).toBe(false);
    expect(audio.play('coin')).toBe(true);
    expect(audio.play('coin')).toBe(false);
    for (let i = 1; i < 6; i += 1) {
      harness.context.currentTime += 0.1;
      expect(audio.play('coin')).toBe(true);
    }
    harness.context.currentTime += 0.1;
    expect(audio.play('tap')).toBe(false);
    expect(harness.sources).toHaveLength(6);
    harness.sources[0].onended();
    expect(audio.play('tap')).toBe(true);
    audio.dispose();
  });

  it('applies volume and mute without touching any input or capture state', async () => {
    const harness = audioHarness();
    const audio = createCoinSortAudio({ AudioContextClass: harness.FakeContext });
    await audio.unlock();
    expect(harness.nodes[0].gain.value).toBe(0.25);
    audio.setVolume(0);
    expect(audio.play('capture')).toBe(false);
    audio.setVolume(0.5);
    expect(audio.play('capture')).toBe(true);
    expect(harness.nodes[0].gain.value).toBe(0.5);
    audio.setVolume(10);
    expect(harness.nodes[0].gain.value).toBe(1);
    audio.dispose();
  });

  it('places a cue in world space and follows the headset orientation', async () => {
    const harness = audioHarness();
    const audio = createCoinSortAudio({ AudioContextClass: harness.FakeContext });
    await audio.unlock();
    const half = Math.SQRT1_2;
    audio.updateListener({ x: 1, y: 1.6, z: 3 }, { x: 0, y: half, z: 0, w: half });
    expect(harness.context.listener.positionY.value).toBe(1.6);
    expect(harness.context.listener.forwardX.value).toBeCloseTo(-1);
    expect(harness.context.listener.forwardZ.value).toBeCloseTo(0);
    expect(audio.play('tap', { position: { x: 2, y: 0.7, z: -1 } })).toBe(true);
    const panner = harness.nodes.find((item) => item.positionX);
    expect([panner.positionX.value, panner.positionY.value, panner.positionZ.value]).toEqual([2, 0.7, -1]);
    audio.dispose();
  });

  it('cleans active voices on exit and safely ignores future sounds', async () => {
    const harness = audioHarness();
    const audio = createCoinSortAudio({ AudioContextClass: harness.FakeContext });
    await audio.unlock();
    audio.play('tap');
    audio.play('coin');
    audio.dispose();
    audio.dispose();
    expect(harness.sources.every((source) => source.stop.mock.calls.length === 1)).toBe(true);
    expect(harness.context.close).toHaveBeenCalledOnce();
    expect(audio.play('tap')).toBe(false);
    expect(await audio.unlock()).toBe(false);
  });

  it('isolates a failed audio source from the scene', async () => {
    const harness = audioHarness({ sourceFailure: true });
    const audio = createCoinSortAudio({ AudioContextClass: harness.FakeContext });
    await audio.unlock();
    expect(audio.play('tap')).toBe(false);
    expect(harness.sources[0].disconnect).toHaveBeenCalledOnce();
    audio.dispose();
  });
});

describe('optional controller haptics', () => {
  it('supports controllers, bounds the pulse and ignores tracked hands', async () => {
    const pulse = vi.fn().mockResolvedValue(true);
    const gamepad = { hapticActuators: [{ pulse }] };
    pulseController({ gamepad }, 2);
    expect(pulse).toHaveBeenCalledWith(0.35, 24);
    pulseController({ gamepad, hand: new Map() });
    expect(pulse).toHaveBeenCalledOnce();
    await Promise.resolve();
  });

  it('absorbs rejected or missing actuators', async () => {
    const pulse = vi.fn().mockRejectedValue(new Error('Unavailable'));
    expect(() => { pulseController({ gamepad: { hapticActuators: [{ pulse }] } }); pulseController({}); }).not.toThrow();
    await Promise.resolve();
  });
});
