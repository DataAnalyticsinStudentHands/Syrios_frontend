import { describe, expect, it } from 'vitest';
import { Quaternion, Vector3 } from 'three';
import { createPinchState, estimateReleaseVelocity, updatePinchState } from './xrHands';

describe('stable XR pinching', () => {
  it('requires an observed open hand then a stable pinch, with separate release hysteresis', () => {
    const state = createPinchState();
    expect(updatePinchState(state, 0.01, 0.08, 0)).toBeNull();
    expect(updatePinchState(state, 0.05, 0.08, 0.1)).toBeNull();
    expect(updatePinchState(state, 0.01, 0.08, 0.2)).toBeNull();
    expect(updatePinchState(state, 0.01, 0.08, 0.25)).toBe('grab');
    expect(updatePinchState(state, 0.022, 0.08, 0.26)).toBeNull();
    expect(updatePinchState(state, 0.05, 0.08, 0.3)).toBeNull();
    expect(updatePinchState(state, 0.05, 0.08, 0.35)).toBe('release');
  });

  it('rejects a one-frame accidental pinch', () => {
    const state = createPinchState();
    updatePinchState(state, 0.06, 0.08, 0);
    updatePinchState(state, 0.01, 0.08, 0.02);
    expect(updatePinchState(state, 0.06, 0.08, 0.04)).toBeNull();
    expect(state.closed).toBe(false);
  });
});

describe('physical release estimates', () => {
  it('calculates time-based motion and caps implausible tracking spikes', () => {
    const history = [
      { time: 1, position: new Vector3(), quaternion: new Quaternion() },
      { time: 1.05, position: new Vector3(0.05, 0, 0), quaternion: new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.1) },
    ];
    expect(estimateReleaseVelocity(history).linearVelocity.x).toBeCloseTo(1);
    expect(estimateReleaseVelocity(history).angularVelocity.y).toBeCloseTo(2);
    history[1].position.x = 50;
    expect(estimateReleaseVelocity(history).linearVelocity.x).toBeCloseTo(1.8);
  });

  it('does not throw coins from stale tracking history', () => {
    expect(estimateReleaseVelocity([]).linearVelocity).toEqual({ x: 0, y: 0, z: 0 });
  });
});
