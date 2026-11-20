import { Matrix4, Quaternion, Vector3 } from 'three';

const UP = new Vector3(0, 1, 0);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const jointPosition = (hand, name) => {
  const joint = hand?.joints?.[name];
  if (!joint?.visible || typeof joint.getWorldPosition !== 'function') return null;
  const position = joint.getWorldPosition(new Vector3());
  return [position.x, position.y, position.z].every(Number.isFinite) ? position : null;
};

/**
 * Recognize a loose cupped palm from tracked joints, not a pinch or closed fist.
 * The returned world frame has +Y out of the palm and +Z towards the fingers.
 * It describes a physical collision surface; it never selects or attaches coins.
 */
export function getHandCupPose(hand, handedness = hand?.userData?.handedness) {
  if (!hand?.visible) return null;
  const wrist = jointPosition(hand, 'wrist');
  const indexBase = jointPosition(hand, 'index-finger-phalanx-proximal');
  const pinkyBase = jointPosition(hand, 'pinky-finger-phalanx-proximal');
  const middleBase = jointPosition(hand, 'middle-finger-phalanx-proximal');
  const indexTip = jointPosition(hand, 'index-finger-tip');
  const thumbTip = jointPosition(hand, 'thumb-tip');
  if (!wrist || !indexBase || !pinkyBase || !middleBase || !indexTip || !thumbTip) return null;
  const forward = middleBase.clone().sub(wrist);
  const palmLength = forward.length();
  const across = indexBase.clone().sub(pinkyBase);
  const knuckleWidth = across.length();
  if (palmLength < 0.035 || palmLength > 0.15 || knuckleWidth < 0.025 || knuckleWidth > 0.14) return null;
  // A stable palm-size-relative exclusion keeps index/thumb examination pinches
  // independent from the handful gesture.
  if (indexTip.distanceTo(thumbTip) < palmLength * 0.3) return null;
  forward.normalize();
  const normal = across.cross(forward).normalize();
  if (normal.lengthSq() < 0.8) return null;
  if (handedness === 'left') normal.negate();
  else if (handedness !== 'right' && !hand.joints.wrist.getWorldQuaternion) return null;

  // WebXR joint frames explicitly define -Y as out of the palm. Use this to
  // disambiguate mirrored hands rather than making both palms face one way.
  // https://immersive-web.github.io/webxr-hand-input/#xrjointspace-interface
  if (typeof hand.joints.wrist.getWorldQuaternion === 'function') {
    const orientation = hand.joints.wrist.getWorldQuaternion(new Quaternion());
    const wristNormal = new Vector3(0, -1, 0).applyQuaternion(orientation);
    const agreement = normal.dot(wristNormal);
    if (Number.isFinite(agreement) && agreement < -0.4) normal.negate();
  }
  // Keep the bowl through a near-vertical pour, and drop it once fully inverted.
  if (normal.dot(UP) < Math.cos(100 * Math.PI / 180)) return null;
  forward.addScaledVector(normal, -forward.dot(normal)).normalize();
  const right = normal.clone().cross(forward).normalize();
  const curls = [];
  const heights = [];
  const reaches = [];
  for (const finger of ['middle', 'ring', 'pinky']) {
    const base = jointPosition(hand, `${finger}-finger-phalanx-proximal`);
    const distal = jointPosition(hand, `${finger}-finger-phalanx-distal`);
    const tip = jointPosition(hand, `${finger}-finger-tip`);
    if (!base || !distal || !tip) return null;
    const lastBone = tip.clone().sub(distal);
    if (lastBone.length() < 0.004 || lastBone.length() > 0.055) return null;
    lastBone.normalize();
    const fromBase = tip.clone().sub(base);
    const height = fromBase.dot(normal) / palmLength;
    const reach = fromBase.dot(forward) / palmLength;
    // Both fingertip turn-in and elevation are needed: a flat extended finger
    // or an ordinary downward point does not create a collision bowl.
    const turnIn = clamp((0.85 - lastBone.dot(forward)) / 1.7, 0, 1);
    const elevation = clamp(height / 0.5, 0, 1);
    curls.push(turnIn * 0.6 + elevation * 0.4);
    heights.push(height);
    reaches.push(reach);
  }
  const curl = curls.reduce((sum, value) => sum + value, 0) / curls.length;
  const height = heights.reduce((sum, value) => sum + value, 0) / heights.length;
  const reach = reaches.reduce((sum, value) => sum + value, 0) / reaches.length;
  if (curls.filter((value) => value >= 0.3).length < 2 || curl < 0.32
    || height < 0.075 || height > 1.05 || reach < -0.25) return null;

  const knuckleCentre = indexBase.clone().add(pinkyBase).multiplyScalar(0.5);
  const position = wrist.clone().lerp(knuckleCentre, 0.58).addScaledVector(normal, 0.007);
  const quaternion = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(right, normal, forward));
  return {
    position,
    quaternion,
    width: clamp(knuckleWidth * 1.4, 0.07, 0.15),
    depth: clamp(palmLength * 1.5, 0.085, 0.17),
    curl: clamp(curl, 0, 1),
  };
}
