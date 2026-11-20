import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

// The bundled official Touch Plus/Touch V3 xr-standard profiles specify these
// face-button indices. Index 0 is trigger and 1 is squeeze; neither takes media.
export const RIGHT_A_BUTTON = 4;
export const RIGHT_B_BUTTON = 5;

export function createMediaButtonState() {
  return { source: null, aArmed: false, bArmed: false, aPressed: false, bPressed: false };
}

export function pollMediaButtons(state, source, visible = true) {
  const result = { photo: false, video: false };
  if (state.source !== source || !visible) Object.assign(state, createMediaButtonState(), { source });
  if (!visible || !source || source.hand || source.handedness !== 'right' || source.gamepad?.mapping !== 'xr-standard') return result;
  for (const [name, index, action] of [['a', RIGHT_A_BUTTON, 'photo'], ['b', RIGHT_B_BUTTON, 'video']]) {
    const button = source.gamepad.buttons?.[index];
    if (!button) { state[`${name}Armed`] = false; continue; }
    const pressed = button.pressed === true || button.value >= 0.8;
    if (!pressed) state[`${name}Armed`] = true;
    if (pressed && !state[`${name}Pressed`] && state[`${name}Armed`]) result[action] = true;
    state[`${name}Pressed`] = pressed;
  }
  return result;
}

/** Animated standard controller assets, served entirely from this deployment. */
export function createControllerVisual({ grip, onError = () => {} }) {
  let disposed = false;
  let loaded = false;
  let source = null;
  let warned = false;
  let warningTimer;
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const proxy = new THREE.Group();
  const track = (object) => object.traverse((node) => {
    if (node.geometry) geometries.add(node.geometry);
    (Array.isArray(node.material) ? node.material : [node.material]).filter(Boolean).forEach((mat) => {
      materials.add(mat);
      Object.values(mat).forEach((value) => { if (value?.isTexture) textures.add(value); });
    });
  });
  const free = () => {
    geometries.forEach((item) => item.dispose());
    materials.forEach((item) => item.dispose());
    textures.forEach((item) => { item.dispose(); item.image?.close?.(); });
    geometries.clear(); materials.clear(); textures.clear();
  };
  const basePath = `${import.meta.env.BASE_URL || '/'}xr/controllers`;
  const loader = new GLTFLoader();
  const warn = () => {
    if (!disposed && source && !source.hand && !loaded && !warned) {
      warned = true;
      onError(new Error('The standard controller model could not load. Controller tracking and buttons remain available.'));
    }
  };
  const safeLoader = {
    setPath() { return this; },
    load(url, onLoad) {
      // The factory normally has a CDN default. Its profile root and all model
      // URLs are restricted to the local profile bundle here.
      const origin = typeof location === 'object' ? location.origin : 'https://syrios.invalid';
      const absolute = new URL(url, origin);
      if (absolute.origin !== origin || !absolute.pathname.startsWith(`${basePath}/`)) { warn(); return; }
      loader.load(url, (asset) => {
        track(asset.scene);
        if (disposed) { free(); return; }
        try { onLoad(asset); } catch { warn(); }
      }, undefined, warn);
    },
  };
  const factory = new XRControllerModelFactory(safeLoader, (object) => {
    track(object);
    if (disposed) { free(); return; }
    loaded = true;
    clearTimeout(warningTimer);
  }).setPath(basePath);
  const model = factory.createControllerModel(proxy);
  grip.add(model);
  const marker = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.012, 0, 0), new THREE.Vector3(0.012, 0, 0),
      new THREE.Vector3(0, -0.012, 0), new THREE.Vector3(0, 0.012, 0),
    ]), new THREE.LineBasicMaterial({ color: '#c4dfe5', transparent: true, opacity: 0.45 }),
  );
  grip.add(marker);
  geometries.add(marker.geometry); materials.add(marker.material);
  const connect = ({ data }) => {
    if (disposed) return;
    proxy.dispatchEvent({ type: 'disconnected' });
    source = data;
    loaded = false;
    warned = false;
    clearTimeout(warningTimer);
    if (!data || data.hand || !data.gamepad || data.targetRayMode !== 'tracked-pointer') return;
    const profiles = data.profiles?.includes('meta-quest-touch-plus-v2')
      ? ['meta-quest-touch-plus-v2', 'meta-quest-touch-plus', 'oculus-touch-v3']
      : data.profiles?.includes('meta-quest-touch-plus') ? ['meta-quest-touch-plus', 'oculus-touch-v3'] : ['oculus-touch-v3'];
    proxy.dispatchEvent({ type: 'connected', data: {
      handedness: data.handedness, targetRayMode: 'tracked-pointer', gamepad: data.gamepad, profiles,
    } });
    warningTimer = setTimeout(warn, 3000);
  };
  const disconnect = () => {
    source = null;
    loaded = false;
    clearTimeout(warningTimer);
    proxy.dispatchEvent({ type: 'disconnected' });
    model.visible = false; marker.visible = false;
  };
  grip.addEventListener('connected', connect);
  grip.addEventListener('disconnected', disconnect);
  return {
    update(enabled) {
      model.visible = !!enabled && loaded && !source?.hand;
      marker.visible = !!enabled && !loaded && !source?.hand;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      disconnect();
      grip.removeEventListener('connected', connect);
      grip.removeEventListener('disconnected', disconnect);
      model.removeFromParent(); marker.removeFromParent();
      free();
    },
  };
}
