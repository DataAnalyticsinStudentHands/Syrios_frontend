import { describe, expect, it } from 'vitest';
import { Group, Object3D, Vector3 } from 'three';
import { getHandCupPose } from './xrCupping';

const makeHand = (handedness = 'right', gesture = 'cup') => {
  const hand = new Group();
  hand.joints = {};
  hand.userData.handedness = handedness;
  const mirror = handedness === 'left' ? -1 : 1;
  const joint = (name, x, y, z) => {
    const object = new Object3D();
    object.position.set(x * mirror, y, z);
    object.rotation.x = Math.PI; // Native WebXR -Y is palm-out, -Z finger-forward.
    hand.joints[name] = object;
    hand.add(object);
    return object;
  };
  joint('wrist', 0, 0, 0);
  joint('index-finger-phalanx-proximal', -0.03, 0, 0.065);
  joint('index-finger-tip', -0.03, 0.025, 0.105);
  joint('thumb-tip', -0.065, 0.012, 0.055);
  for (const [name, x, z] of [['middle', 0, 0.075], ['ring', 0.018, 0.07], ['pinky', 0.035, 0.06]]) {
    joint(`${name}-finger-phalanx-proximal`, x, 0, z);
    if (gesture === 'flat') {
      joint(`${name}-finger-phalanx-distal`, x, 0, z + 0.055);
      joint(`${name}-finger-tip`, x, 0, z + 0.08);
    } else if (gesture === 'fist') {
      joint(`${name}-finger-phalanx-distal`, x, 0.035, z + 0.015);
      joint(`${name}-finger-tip`, x, 0.015, z - 0.035);
    } else {
      joint(`${name}-finger-phalanx-distal`, x, 0.023, z + 0.042);
      joint(`${name}-finger-tip`, x, 0.035, z + 0.016);
    }
  }
  hand.updateMatrixWorld(true);
  return hand;
};

describe('tracked palm cupping recognition', () => {
  it.each(['left', 'right'])('recognizes a loose %s cup with its normal out of the palm', (handedness) => {
    const pose = getHandCupPose(makeHand(handedness), handedness);
    expect(pose).not.toBeNull();
    expect(new Vector3(0, 1, 0).applyQuaternion(pose.quaternion).y).toBeCloseTo(1, 5);
    expect(new Vector3(0, 0, 1).applyQuaternion(pose.quaternion).z).toBeCloseTo(1, 5);
    expect(pose.width).toBeGreaterThan(0.07);
    expect(pose.depth).toBeGreaterThan(0.085);
    expect(pose.curl).toBeGreaterThan(0.32);
  });

  it('mirrors palm position without mirroring its upward normal', () => {
    const left = getHandCupPose(makeHand('left'));
    const right = getHandCupPose(makeHand('right'));
    expect(left.position.x).toBeCloseTo(-right.position.x, 5);
    expect(left.position.y).toBeCloseTo(right.position.y, 5);
    expect(left.quaternion.angleTo(right.quaternion)).toBeCloseTo(0, 5);
  });

  it('keeps a near-vertical pouring cup and removes an inverted one', () => {
    const hand = makeHand();
    hand.rotation.z = 95 * Math.PI / 180;
    hand.updateMatrixWorld(true);
    const pouring = getHandCupPose(hand);
    expect(pouring).not.toBeNull();
    expect(new Vector3(0, 1, 0).applyQuaternion(pouring.quaternion).y).toBeLessThan(0);
    hand.rotation.z = 110 * Math.PI / 180;
    hand.updateMatrixWorld(true);
    expect(getHandCupPose(hand)).toBeNull();
  });

  it.each(['left', 'right'])('does not mistake a flat %s palm or closed fist for a cup', (side) => {
    expect(getHandCupPose(makeHand(side, 'flat'))).toBeNull();
    expect(getHandCupPose(makeHand(side, 'fist'))).toBeNull();
  });

  it('keeps an index/thumb examination pinch separate from a handful', () => {
    const hand = makeHand();
    hand.joints['thumb-tip'].position.copy(hand.joints['index-finger-tip'].position).add(new Vector3(0.003, 0, 0));
    hand.updateMatrixWorld(true);
    expect(getHandCupPose(hand)).toBeNull();
  });

  it('requires a tracked visible palm and finger chain', () => {
    const hand = makeHand();
    hand.joints['ring-finger-phalanx-distal'].visible = false;
    expect(getHandCupPose(hand)).toBeNull();
    hand.joints['ring-finger-phalanx-distal'].visible = true;
    hand.visible = false;
    expect(getHandCupPose(hand)).toBeNull();
    expect(getHandCupPose(null)).toBeNull();
  });

  it('rejects malformed or implausibly scaled joint poses', () => {
    const hand = makeHand();
    hand.joints['middle-finger-phalanx-proximal'].position.z = 0.001;
    hand.updateMatrixWorld(true);
    expect(getHandCupPose(hand)).toBeNull();
  });
});
