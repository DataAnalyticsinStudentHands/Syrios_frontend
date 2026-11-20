import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

export function createPinchState() {
  return { armed: false, closed: false, closeSince: null, openSince: null };
}

// An open hand must be observed before acquisition. Closed hands returning from
// tracking loss cannot unexpectedly seize a coin. Distances scale with the hand.
export function updatePinchState(state, distance, handScale, time) {
  const close = THREE.MathUtils.clamp(handScale * 0.23, 0.013, 0.025);
  const open = close * 1.65;
  if (!state.armed) {
    if (distance > open) state.armed = true;
    return null;
  }
  if (!state.closed) {
    state.openSince = null;
    if (distance < close) {
      state.closeSince ??= time;
      if (time - state.closeSince >= 0.04) {
        state.closed = true;
        state.closeSince = null;
        return 'grab';
      }
    } else state.closeSince = null;
  } else {
    state.closeSince = null;
    if (distance > open) {
      state.openSince ??= time;
      if (time - state.openSince >= 0.045) {
        state.closed = false;
        state.openSince = null;
        return 'release';
      }
    } else state.openSince = null;
  }
  return null;
}

export function estimateReleaseVelocity(history) {
  const zero = () => ({ linearVelocity: { x: 0, y: 0, z: 0 }, angularVelocity: { x: 0, y: 0, z: 0 } });
  if (history.length < 2) return zero();
  const last = history.at(-1);
  const first = history.find((sample) => sample.time >= last.time - 0.11) || history[0];
  const dt = last.time - first.time;
  if (dt < 0.008 || dt > 0.25) return zero();
  const linear = new THREE.Vector3().subVectors(last.position, first.position).divideScalar(dt).clampLength(0, 1.8);
  const delta = last.quaternion.clone().multiply(first.quaternion.clone().invert()).normalize();
  if (delta.w < 0) delta.set(-delta.x, -delta.y, -delta.z, -delta.w);
  const sine = Math.sqrt(Math.max(0, 1 - delta.w * delta.w));
  const angular = sine > 0.0001
    ? new THREE.Vector3(delta.x, delta.y, delta.z).multiplyScalar(2 * Math.acos(THREE.MathUtils.clamp(delta.w, -1, 1)) / (sine * dt)).clampLength(0, 8)
    : new THREE.Vector3();
  if (![...linear, ...angular].every(Number.isFinite)) return zero();
  return { linearVelocity: { x: linear.x, y: linear.y, z: linear.z }, angularVelocity: { x: angular.x, y: angular.y, z: angular.z } };
}

const FINGERS = [
  ['wrist', 'thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip'],
  ...['index', 'middle', 'ring', 'pinky'].map((name) => ['wrist', `${name}-finger-metacarpal`, `${name}-finger-phalanx-proximal`, `${name}-finger-phalanx-intermediate`, `${name}-finger-phalanx-distal`, `${name}-finger-tip`]),
];

export function createHandVisual({ hand, scene, onError = () => {} }) {
  let disposed = false;
  let loaded = false;
  let warned = false;
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const track = (object) => object.traverse((node) => {
    if (node.geometry) geometries.add(node.geometry);
    (Array.isArray(node.material) ? node.material : [node.material]).filter(Boolean).forEach((mat) => {
      materials.add(mat);
      Object.values(mat).forEach((value) => { if (value?.isTexture) textures.add(value); });
    });
  });
  const free = () => {
    geometries.forEach((value) => value.dispose());
    materials.forEach((value) => value.dispose());
    textures.forEach((value) => value.dispose());
    geometries.clear(); materials.clear(); textures.clear();
  };
  const basePath = `${import.meta.env.BASE_URL || '/'}xr/hands/`;
  const loader = new GLTFLoader().setPath(basePath);
  const safeLoader = {
    load(file, onLoad) {
      loader.load(file, (asset) => {
        track(asset.scene);
        if (disposed) { free(); return; }
        try { onLoad(asset); } catch (error) {
          if (!warned) { warned = true; onError(error); }
        }
      }, undefined, () => {
        if (!disposed && !warned) {
          warned = true;
          onError(new Error('The detailed hand mesh could not load. Connected hand shapes are available instead.'));
        }
      });
    },
  };
  const factory = new XRHandModelFactory(safeLoader, (object) => {
    if (disposed) return;
    loaded = true;
    track(object);
    object.traverse((mesh) => {
      if (!mesh.isMesh || mesh.userData.xrHandOutline) return;
      const skin = new THREE.MeshStandardMaterial({ color: '#f2f5f6', transparent: true, opacity: 0.78, roughness: 0.35, depthWrite: false });
      materials.add(skin);
      mesh.material = skin;
      if (mesh.isSkinnedMesh) {
        const rim = new THREE.MeshBasicMaterial({ color: '#a4dce3', side: THREE.BackSide, transparent: true, opacity: 0.32, depthWrite: false });
        materials.add(rim);
        const outline = new THREE.SkinnedMesh(mesh.geometry, rim);
        outline.userData.xrHandOutline = true;
        outline.bind(mesh.skeleton, mesh.bindMatrix);
        outline.scale.copy(mesh.scale).multiplyScalar(1.018);
        outline.frustumCulled = false;
        mesh.parent.add(outline);
      }
    });
  }).setPath(basePath);
  const model = factory.createHandModel(hand, 'mesh');
  hand.add(model);
  const fallback = new THREE.Group();
  scene.add(fallback);
  const skin = new THREE.MeshStandardMaterial({ color: '#edf3f4', transparent: true, opacity: 0.75, roughness: 0.4 });
  const capsule = new THREE.CapsuleGeometry(0.5, 1, 3, 8);
  const palmGeometry = new THREE.SphereGeometry(1, 12, 8);
  geometries.add(capsule); geometries.add(palmGeometry); materials.add(skin);
  const links = FINGERS.flatMap((finger) => finger.slice(1).map((end, index) => {
    const mesh = new THREE.Mesh(capsule, skin);
    fallback.add(mesh);
    return { mesh, start: finger[index], end };
  }));
  const palm = new THREE.Mesh(palmGeometry, skin);
  fallback.add(palm);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const onDisconnect = () => { loaded = false; fallback.visible = false; };
  hand.addEventListener('disconnected', onDisconnect);
  return {
    update(enabled) {
      model.visible = enabled && loaded;
      fallback.visible = enabled && !loaded;
      if (!fallback.visible) return;
      links.forEach(({ mesh, start, end }) => {
        const first = hand.joints[start]; const second = hand.joints[end];
        mesh.visible = !!(first?.visible && second?.visible);
        if (!mesh.visible) return;
        first.getWorldPosition(a); second.getWorldPosition(b);
        const length = a.distanceTo(b);
        const radius = THREE.MathUtils.clamp(second.jointRadius || 0.007, 0.004, 0.012);
        mesh.position.copy(a).add(b).multiplyScalar(0.5);
        direction.subVectors(b, a).normalize();
        mesh.quaternion.setFromUnitVectors(up, direction);
        mesh.scale.set(radius * 2, (length + radius * 2) / 2, radius * 2);
      });
      const wrist = hand.joints.wrist; const middle = hand.joints['middle-finger-phalanx-proximal'];
      palm.visible = !!(wrist?.visible && middle?.visible);
      if (palm.visible) {
        wrist.getWorldPosition(a); middle.getWorldPosition(b);
        palm.position.copy(a).lerp(b, 0.48);
        wrist.getWorldQuaternion(palm.quaternion);
        palm.scale.set(0.034, 0.015, Math.max(0.035, a.distanceTo(b) * 0.48));
      }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      hand.removeEventListener('disconnected', onDisconnect);
      model.removeFromParent(); fallback.removeFromParent();
      free();
    },
  };
}
