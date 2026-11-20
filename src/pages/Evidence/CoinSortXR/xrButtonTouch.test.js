import { describe, expect, it } from 'vitest';
import { createButtonTouchState, resetButtonTouch, updateButtonTouch } from './xrButtonTouch';

const tracker = (dimensions = {}) => {
  const state = createButtonTouchState();
  let time = 0;
  return {
    state,
    poke(point, options = {}) {
      time += options.dt ?? 1 / 90;
      return updateButtonTouch(state, { halfWidth: 0.1, halfHeight: 0.037, point, time, ...dimensions, ...options });
    },
  };
};
const tip = (z, x = 0, y = 0) => ({ x, y, z });

describe('physical XR button pokes', () => {
  it('arms on a released finger and activates once on front contact', () => {
    const touch = tracker();
    expect(touch.poke(tip(0.04)).activated).toBe(false);
    expect(touch.poke(tip(0.009))).toEqual({ pressed: true, activated: true, hovered: true });
  });

  it('does not repeat while resting or jittering around the touch plane', () => {
    const touch = tracker();
    touch.poke(tip(0.04));
    expect(touch.poke(tip(0.009)).activated).toBe(true);
    for (const z of [0.008, 0.012, 0.006, 0.011, 0.009, 0.014, 0.005]) {
      expect(touch.poke(tip(z)).activated).toBe(false);
    }
  });

  it('requires withdrawal before a second normal tap', () => {
    const touch = tracker();
    touch.poke(tip(0.04));
    touch.poke(tip(0.009));
    touch.poke(tip(0.018));
    expect(touch.poke(tip(0.009)).activated).toBe(false);
    expect(touch.poke(tip(0.035)).pressed).toBe(false);
    expect(touch.poke(tip(0.009)).activated).toBe(true);
  });

  it('does not activate on first-frame intersection or movement from behind', () => {
    const touch = tracker();
    for (const z of [-0.02, -0.005, 0.005, 0.012, 0.009]) {
      expect(touch.poke(tip(z)).activated).toBe(false);
    }
    touch.poke(tip(0.04));
    expect(touch.poke(tip(0.009)).activated).toBe(true);
  });

  it('does not activate when tracking starts with a finger already touching', () => {
    const touch = tracker();
    expect(touch.poke(tip(0.005)).activated).toBe(false);
    expect(touch.poke(tip(0.002)).activated).toBe(false);
    expect(touch.poke(tip(0.008)).activated).toBe(false);
  });

  it('catches a short fast poke crossing the whole button plane', () => {
    const touch = tracker();
    touch.poke(tip(0.06));
    expect(touch.poke(tip(-0.04))).toEqual({ pressed: false, activated: true, hovered: false });
    expect(touch.poke(tip(-0.02)).activated).toBe(false);
    expect(touch.poke(tip(0.009)).activated).toBe(false);
  });

  it('checks the actual swept intersection rather than only the endpoint', () => {
    const touch = tracker();
    touch.poke(tip(0.04, 0.13));
    // The segment crosses the touch plane while still outside the button.
    expect(touch.poke(tip(-0.01, 0.09)).activated).toBe(false);
    expect(touch.poke(tip(-0.01, 0)).activated).toBe(false);
  });

  it('catches a swept face contact even when the fingertip ends beyond a side edge', () => {
    const touch = tracker();
    touch.poke(tip(0.04));
    expect(touch.poke(tip(-0.01, 0.105))).toEqual({ pressed: false, activated: true, hovered: false });
  });

  it('rejects a lateral brush from behind after an off-edge approach', () => {
    const touch = tracker();
    touch.poke(tip(0.04, 0.11));
    touch.poke(tip(-0.005, 0.11));
    expect(touch.poke(tip(-0.005, 0)).activated).toBe(false);
    expect(touch.poke(tip(0.008, 0)).activated).toBe(false);
  });

  it('can rearm by leaving the face and returning with a front approach', () => {
    const touch = tracker();
    touch.poke(tip(0.04));
    touch.poke(tip(0.009));
    touch.poke(tip(0.02, 0.11));
    expect(touch.poke(tip(0.009)).activated).toBe(true);
  });

  it('keeps adjacent button hit areas disjoint without a radius expansion', () => {
    const first = tracker({ halfWidth: 0.075 });
    const second = tracker({ halfWidth: 0.075 });
    first.poke(tip(0.04, 0.085));
    second.poke(tip(0.04, -0.085));
    expect(first.poke(tip(0.009, 0.085)).activated).toBe(false);
    expect(second.poke(tip(0.009, -0.085)).activated).toBe(false);
  });

  it('uses the actual narrow button height for off-edge rejection', () => {
    const touch = tracker();
    touch.poke(tip(0.04, 0, 0.038));
    expect(touch.poke(tip(0.009, 0, 0.038)).activated).toBe(false);
  });

  it.each([
    ['a tracking gap', tip(0.04), tip(0.009), { dt: 0.2 }],
    ['a teleport', tip(0.16), tip(-0.01), {}],
    ['a repeated timestamp', tip(0.04), tip(0.009), { dt: 0 }],
  ])('does not sweep across %s', (label, from, to, options) => {
    const touch = tracker();
    touch.poke(from);
    expect(touch.poke(to, options).activated).toBe(false);
    expect(touch.poke(tip(0.005)).activated).toBe(false);
  });

  it.each(['disabled', 'tracking lost'])('requires a new release observation after %s', (reason) => {
    const touch = tracker();
    touch.poke(tip(0.04));
    expect(touch.poke(reason === 'disabled' ? tip(0.009) : null, { enabled: reason !== 'disabled' }))
      .toEqual({ pressed: false, activated: false, hovered: false });
    expect(touch.poke(tip(0.005)).activated).toBe(false);
    touch.poke(tip(0.04));
    expect(touch.poke(tip(0.009)).activated).toBe(true);
  });

  it('can explicitly reset history after a button moves', () => {
    const touch = tracker();
    touch.poke(tip(0.04));
    resetButtonTouch(touch.state);
    expect(touch.poke(tip(0.005)).activated).toBe(false);
    expect(touch.state.armed).toBe(false);
  });

  it('rejects malformed tracking data without retaining an armed gesture', () => {
    const touch = tracker();
    touch.poke(tip(0.04));
    expect(touch.poke({ x: NaN, y: 0, z: 0 })).toEqual({ pressed: false, activated: false, hovered: false });
    expect(touch.poke(tip(0.009)).activated).toBe(false);
  });
});
