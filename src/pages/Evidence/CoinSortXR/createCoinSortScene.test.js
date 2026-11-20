// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { createCoinSortScene } from './createCoinSortScene';
import { captureXRPhoto } from './xrCapture';
import { startXRVideo } from './xrVideo';
import { createCoinPhysics } from './coinPhysics';
import { getHandCupPose } from './xrCupping';
import { XR_MEDIA_LIMITS } from './xrMediaLimits';

vi.mock('./xrCapture', () => ({ captureXRPhoto: vi.fn(async () => new Blob(['photo'], { type: 'image/png' })) }));
vi.mock('./xrCupping', () => ({ getHandCupPose: vi.fn(() => null) }));
vi.mock('./coinPhysics', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, createCoinPhysics: vi.fn(actual.createCoinPhysics) };
});
vi.mock('./xrVideo', () => ({ VIDEO_DURATION_MS: 10000, startXRVideo: vi.fn(({ onComplete }) => {
  let active = true;
  return {
    get recording() { return active; }, captureFrame: vi.fn(),
    stop: vi.fn(() => { active = false; onComplete(new Blob(['clip'], { type: 'video/webm' })); }),
    dispose: vi.fn(() => { active = false; }),
  };
}) }));

// Keep Three's real transforms, scene graph, raycasting and geometry. Only the
// GPU boundary is replaced, allowing actual grab/drop behavior to be exercised.
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    WebGLRenderer: class {
      constructor() {
        this.domElement = document.createElement('canvas');
        this.capabilities = { getMaxAnisotropy: () => 4 };
        this.dispose = vi.fn();
        this.forceContextLoss = vi.fn();
        this.controllers = [new actual.Group(), new actual.Group()];
        this.grips = [new actual.Group(), new actual.Group()];
        this.hands = [new actual.Group(), new actual.Group()];
        this.hands.forEach((hand) => { hand.joints = {}; });
        this.viewer = new actual.PerspectiveCamera();
        this.viewer.position.set(0, 1.6, 0);
        this.viewer.updateMatrixWorld(true);
        this.xr = Object.assign(new actual.EventDispatcher(), {
          isPresenting: false,
          setReferenceSpaceType: (type) => { this.referenceSpaceType = type; },
          setFramebufferScaleFactor: () => {},
          getController: (index) => this.controllers[index],
          getControllerGrip: (index) => this.grips[index],
          getHand: (index) => this.hands[index],
          getCamera: () => this.viewer,
          setSession: async (session) => {
            this.xr.isPresenting = true;
            session.addEventListener('end', () => {
              this.xr.isPresenting = false;
              this.xr.dispatchEvent({ type: 'sessionend' });
            });
          },
        });
      }
      setPixelRatio() {}
      setSize() {}
      setAnimationLoop(callback) { this.frame = callback; }
      render(scene) { this.scene = scene; }
    },
  };
});

const makeSession = (floor = true) => {
  const session = new EventTarget();
  session.visibilityState = 'visible';
  session.requestReferenceSpace = vi.fn(async () => {
    if (!floor) throw new Error('local-floor not supported');
    return {};
  });
  session.end = vi.fn(async () => { session.dispatchEvent(new Event('end')); });
  return session;
};

const sampleCoins = [
  { id: 'sample-1', title: 'Sample token', material: 'Silver', diameterMm: 24, isDemo: true },
];
let engine;
let container;
let contextSpy;
let canvasContext;
let frameTime;

beforeEach(() => {
  frameTime = 0;
  vi.mocked(captureXRPhoto).mockClear();
  vi.mocked(startXRVideo).mockClear();
  vi.mocked(createCoinPhysics).mockClear();
  vi.mocked(getHandCupPose).mockReturnValue(null);
  container = document.createElement('div');
  document.body.appendChild(container);
  canvasContext = {
    fillRect() {}, strokeRect() {}, fillText() {}, beginPath() {}, arc() {}, stroke() {},
    drawImage() {}, putImageData() {},
    measureText: (text) => ({ width: String(text).length * 14 }),
  };
  contextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(canvasContext);
});

afterEach(() => {
  engine?.dispose();
  engine = null;
  container.remove();
  contextSpy.mockRestore();
  vi.restoreAllMocks();
});

const makeEngine = async (callbacks = {}) => {
  engine = await createCoinSortScene({ container, coins: sampleCoins, ...callbacks });
  return engine;
};
const tick = (count = 1) => {
  for (let index = 0; index < count; index += 1) {
    frameTime += 16;
    engine.renderer.frame(frameTime);
  }
};
const getCoins = () => {
  const result = [];
  engine.renderer.scene.traverse((object) => { if (object.userData.coin) result.push(object); });
  return result;
};
const clickWorldButton = (label) => {
  let target;
  engine.renderer.scene.traverse((object) => { if (object.userData.buttonLabel === label) target = object; });
  expect(target).toBeTruthy();
  target.userData.action();
};
const getWorldButton = (label) => {
  let target;
  engine.renderer.scene.traverse((object) => { if (object.userData.buttonLabel === label) target = object; });
  expect(target).toBeTruthy();
  return target;
};
const connectPointingHand = () => {
  const hand = engine.renderer.hands[0];
  for (const name of ['wrist', 'index-finger-tip', 'thumb-tip']) {
    const joint = new THREE.Group();
    joint.visible = true;
    joint.jointRadius = 0.008;
    hand.joints[name] = joint;
    hand.add(joint);
  }
  const setTip = (position, gap = 0.09) => {
    for (const [name, offset] of [
      ['index-finger-tip', new THREE.Vector3()],
      ['thumb-tip', new THREE.Vector3(gap, 0, 0)],
      ['wrist', new THREE.Vector3(0.02, -0.05, 0.025)],
    ]) hand.joints[name].position.copy(hand.worldToLocal(position.clone().add(offset)));
  };
  setTip(new THREE.Vector3(0, 1.1, 0.2));
  engine.renderer.controllers[0].dispatchEvent({ type: 'connected', data: { hand: new Map(), handedness: 'right' } });
  tick();
  return { hand, setTip };
};
const fingerAtButton = (finger, button, frontDistance, frames = 8, gap = 0.09) => {
  finger.setTip(button.localToWorld(new THREE.Vector3(0, 0, frontDistance)), gap);
  tick(frames);
};
const connectController = () => {
  tick(90);
  const controller = engine.renderer.controllers[0];
  const grip = engine.renderer.grips[0];
  grip.position.copy(getCoins()[0].getWorldPosition(new THREE.Vector3())).add(new THREE.Vector3(0, 0.012, 0));
  controller.dispatchEvent({ type: 'connected', data: { handedness: 'right' } });
  tick();
  return { controller, grip };
};

describe('CoinSort XR interaction lifecycle', () => {
  it('grabs, turns and drops a controller-held coin into a tray', async () => {
    const onSelect = vi.fn();
    const onProgress = vi.fn();
    await makeEngine({ onSelect, onProgress });
    await engine.startSession(makeSession());
    const { controller, grip } = connectController();
    controller.dispatchEvent({ type: 'selectstart' });
    expect(onSelect).toHaveBeenLastCalledWith(sampleCoins[0]);

    grip.position.set(0.22, 0.83, -0.32);
    grip.rotation.z = 0.4;
    tick(90);
    controller.dispatchEvent({ type: 'selectend' });
    tick(200);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ sorted: 1, correct: 1, incorrect: 0, total: 1 }));

    engine.reset();
    expect(onSelect).toHaveBeenLastCalledWith(null);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ sorted: 0, total: 1 }));
  });

  it('keeps a coin held until both trigger and grip are released', async () => {
    const onProgress = vi.fn();
    await makeEngine({ onProgress });
    await engine.startSession(makeSession());
    const { controller, grip } = connectController();
    controller.dispatchEvent({ type: 'selectstart' });
    controller.dispatchEvent({ type: 'squeezestart' });
    grip.position.set(0.22, 0.83, -0.32);
    tick(90);
    controller.dispatchEvent({ type: 'selectend' });
    tick(100, 32);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ sorted: 0, total: 1 }));
    controller.dispatchEvent({ type: 'squeezeend' });
    tick(200);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ sorted: 1, total: 1 }));
  });

  it('recognizes a hand-joint pinch and releases on tracking loss', async () => {
    const onSelect = vi.fn();
    await makeEngine({ onSelect });
    await engine.startSession(makeSession());
    tick(90);
    const center = getCoins()[0].position.clone().add(new THREE.Vector3(0, 0.012, 0));
    const controller = engine.renderer.controllers[0];
    const hand = engine.renderer.hands[0];
    for (const [name, x] of [['index-finger-tip', 0.03], ['thumb-tip', -0.03], ['wrist', 0]]) {
      const joint = new THREE.Group();
      joint.position.copy(center).add(new THREE.Vector3(x, 0, 0));
      joint.visible = true;
      hand.joints[name] = joint;
      hand.add(joint);
    }
    controller.dispatchEvent({ type: 'connected', data: { hand: new Map() } });
    tick();
    hand.joints['index-finger-tip'].position.x = center.x + 0.005;
    hand.joints['thumb-tip'].position.x = center.x - 0.005;
    tick(5);
    expect(onSelect).toHaveBeenLastCalledWith(sampleCoins[0]);
    hand.joints['thumb-tip'].visible = false;
    tick(1, 16);
    // A lost hand cannot keep an invisible coin hostage: reset is also safe.
    engine.reset();
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('does not reset arrangements when the page echoes the current sort key', async () => {
    const onSelect = vi.fn();
    const onSortChange = vi.fn();
    await makeEngine({ onSelect, onSortChange });
    engine.setSortBy('material');
    expect(onSelect).not.toHaveBeenCalled();
    engine.setSortBy('mint');
    expect(onSortChange).toHaveBeenCalledExactlyOnceWith('mint');
    expect(onSelect).toHaveBeenCalledTimes(1);
    engine.setSortBy('mint');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('supports local reference space with a shared seated-height origin', async () => {
    await makeEngine();
    await engine.startSession(makeSession(false));
    expect(engine.renderer.referenceSpaceType).toBe('local');
    expect(engine.renderer.grips[0].parent.position.y).toBe(1.6);
  });

  it('ignores hidden-session input and removes the renderer on disposal', async () => {
    const onSelect = vi.fn();
    await makeEngine({ onSelect });
    const session = makeSession();
    await engine.startSession(session);
    const { controller } = connectController();
    session.visibilityState = 'hidden';
    session.dispatchEvent(new Event('visibilitychange'));
    controller.dispatchEvent({ type: 'selectstart' });
    expect(onSelect).not.toHaveBeenCalled();
    const renderer = engine.renderer;
    engine.dispose();
    expect(container.querySelector('canvas')).toBeNull();
    expect(renderer.frame).toBeNull();
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    engine.dispose();
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    expect(session.end).toHaveBeenCalledTimes(1);
  });

  it('deforms photo coins asynchronously without moving a held coin and caches shared face images', async () => {
    const size = 64;
    const data = new Uint8ClampedArray(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = x - 31.5;
        const dy = y - 31.5;
        const radius = 20 + Math.cos(Math.atan2(dy, dx) * 3) * 2;
        const coinPixel = Math.hypot(dx, dy) < radius;
        data.set(coinPixel ? [125, 90, 35, 255] : [255, 255, 255, 255], (y * size + x) * 4);
      }
    }
    canvasContext.getImageData = () => ({ width: size, height: size, data });
    let resolveImage;
    const loader = vi.spyOn(THREE.ImageLoader.prototype, 'loadAsync').mockImplementation(() => new Promise((resolve) => {
      resolveImage = resolve;
    }));
    await makeEngine({ coins: [{ ...sampleCoins[0], isDemo: false, obverseUrl: '/photo.png', reverseUrl: '/photo.png' }] });
    await engine.startSession(makeSession());
    const { controller } = connectController();
    const root = getCoins()[0];
    const disc = root.children[0];
    const originalGeometry = disc.geometry;
    const oldGeometryDisposer = vi.spyOn(originalGeometry, 'dispose');
    controller.dispatchEvent({ type: 'selectstart' });
    const position = root.position.clone();
    const orientation = root.quaternion.clone();
    resolveImage({ width: size, height: size });
    await vi.waitFor(() => expect(root.userData.photoShapeSource).toBe('outline'));
    expect(root.position.equals(position)).toBe(true);
    expect(root.quaternion.equals(orientation)).toBe(true);
    expect(disc.geometry).not.toBe(originalGeometry);
    expect(oldGeometryDisposer).toHaveBeenCalledOnce();
    expect(disc.material[1].map).toBe(disc.material[2].map);
    expect(disc.material[1].map.image.width).toBeLessThan(size);
    expect(loader).toHaveBeenCalledOnce();
  });

  it('does not attach a photograph or create texture resources after the scene closes', async () => {
    let resolveImage;
    vi.spyOn(THREE.ImageLoader.prototype, 'loadAsync').mockImplementation(() => new Promise((resolve) => {
      resolveImage = resolve;
    }));
    const drawImage = vi.spyOn(canvasContext, 'drawImage');
    await makeEngine({ coins: [{ ...sampleCoins[0], obverseUrl: '/late-photo.png' }] });
    engine.dispose();
    resolveImage({ width: 64, height: 64 });
    await Promise.resolve();
    await Promise.resolve();
    expect(drawImage).not.toHaveBeenCalled();
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('preserves measured coin proportions at the shared 2× study scale', async () => {
    await makeEngine({ coins: [
      { ...sampleCoins[0], id: 'small', diameterMm: 18, thicknessMm: 2 },
      { ...sampleCoins[0], id: 'large', diameterMm: 80, thicknessMm: 5 },
    ] });
    await engine.startSession(makeSession());
    tick();
    const roots = getCoins();
    const sizes = roots.map((root) => root.children[0].geometry.boundingBox.getSize(new THREE.Vector3()));
    expect(sizes[0].x).toBeCloseTo(0.036);
    expect(sizes[1].x).toBeCloseTo(0.16);
    expect(sizes[0].y).toBeCloseTo(0.004);
    expect(sizes[1].y).toBeCloseTo(0.01);
  });

  it('allows direct grabbing near the edge of a large coin', async () => {
    const onSelect = vi.fn();
    const coin = { ...sampleCoins[0], diameterMm: 80 };
    await makeEngine({ coins: [coin], onSelect });
    await engine.startSession(makeSession());
    tick();
    const root = getCoins()[0];
    const grip = engine.renderer.grips[0];
    grip.position.copy(root.position).add(new THREE.Vector3(0.09, 0, 0));
    const controller = engine.renderer.controllers[0];
    controller.dispatchEvent({ type: 'connected', data: { handedness: 'right' } });
    tick(1, 16);
    controller.dispatchEvent({ type: 'squeezestart' });
    expect(onSelect).toHaveBeenLastCalledWith(coin);
  });

  it('renders only during an immersive session', async () => {
    await makeEngine();
    tick(10);
    expect(engine.renderer.scene).toBeUndefined();
    const session = makeSession();
    await engine.startSession(session);
    tick();
    expect(engine.renderer.scene).toBeTruthy();
    await session.end();
    const render = vi.spyOn(engine.renderer, 'render');
    tick(10);
    expect(render).not.toHaveBeenCalled();
  });

  it('reports an incorrect placement and corrects the score after moving that coin', async () => {
    const onProgress = vi.fn();
    await makeEngine({ onProgress, coins: [sampleCoins[0], { ...sampleCoins[0], id: 'gold', material: 'Gold' }] });
    await engine.startSession(makeSession());
    const { controller, grip } = connectController();
    controller.dispatchEvent({ type: 'selectstart' });
    grip.position.set(0.22, 0.83, -0.32); // Gold is the first alphabetical tray.
    tick(90);
    controller.dispatchEvent({ type: 'selectend' });
    tick(200);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ incorrect: 1, correct: 0 }));
    const silver = getCoins().find((object) => object.userData.coin.material === 'Silver');
    grip.position.copy(silver.getWorldPosition(new THREE.Vector3())).add(new THREE.Vector3(0, 0.012, 0));
    tick();
    controller.dispatchEvent({ type: 'selectstart' });
    grip.position.set(0.46, 0.83, -0.32);
    tick(90);
    controller.dispatchEvent({ type: 'selectend' });
    tick(200);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ incorrect: 0, correct: 1 }));
  });

  it('keeps held visual motion aligned with the capped physical body and releases without a jump', async () => {
    await makeEngine();
    await engine.startSession(makeSession());
    const { controller, grip } = connectController();
    const root = getCoins()[0];
    controller.dispatchEvent({ type: 'selectstart' });
    const previous = root.position.clone();
    grip.position.add(new THREE.Vector3(0.8, 0.4, 0));
    tick();
    expect(root.position.distanceTo(previous)).toBeLessThan(0.07);
    const beforeRelease = root.position.clone();
    controller.dispatchEvent({ type: 'selectend' });
    expect(root.position.distanceTo(beforeRelease)).toBeLessThan(0.00001);
  });

  it('keeps coin and physics coordinates consistent on a recentered, rotated desk', async () => {
    const onSelect = vi.fn();
    const onProgress = vi.fn();
    await makeEngine({ onSelect, onProgress });
    engine.renderer.viewer.position.set(1, 1.6, 2);
    engine.renderer.viewer.rotation.y = Math.PI / 4;
    engine.renderer.viewer.updateMatrixWorld(true);
    await engine.startSession(makeSession());
    const { controller, grip } = connectController();
    const root = getCoins()[0];
    const rig = root.parent;
    expect(rig.position.x).toBeCloseTo(1);
    expect(rig.position.z).toBeCloseTo(2);
    controller.dispatchEvent({ type: 'selectstart' });
    expect(onSelect).toHaveBeenLastCalledWith(sampleCoins[0]);
    grip.position.copy(rig.localToWorld(new THREE.Vector3(0.22, 0.83, -0.32)));
    tick(90);
    controller.dispatchEvent({ type: 'selectend' });
    tick(200);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ correct: 1 }));
  });

  it('captures through the viewer camera and reports a full headset photo queue', async () => {
    const onCapture = vi.fn(() => false);
    const fillText = vi.spyOn(canvasContext, 'fillText');
    await makeEngine({ onCapture });
    await engine.startSession(makeSession());
    tick();
    clickWorldButton('Photo');
    tick();
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledOnce());
    expect(captureXRPhoto).toHaveBeenCalledWith(expect.objectContaining({ camera: engine.renderer.viewer }));
    expect(fillText.mock.calls.some(([text]) => text.includes('Photo limit reached'))).toBe(true);
    expect(fillText.mock.calls.some(([text]) => /photo saved on this headset/i.test(text))).toBe(false);
  });

  it('shows a friendly catalog heading while preserving the original selected record', async () => {
    const fillText = vi.spyOn(canvasContext, 'fillText');
    const onSelect = vi.fn();
    const coin = {
      ...sampleCoins[0], id: 'catalog-friendly', isDemo: false,
      title: 'antioch_royal_0179_obv_scan_033a', mint: 'Antioch', dateLabel: '200 BCE–180 BCE',
    };
    await makeEngine({ coins: [coin], onSelect });
    await engine.startSession(makeSession());
    const { controller } = connectController();
    fillText.mockClear();
    controller.dispatchEvent({ type: 'selectstart' });
    expect(onSelect).toHaveBeenLastCalledWith(coin);
    expect(coin.title).toBe('antioch_royal_0179_obv_scan_033a');
    expect(fillText.mock.calls.some(([text]) => text === 'Antioch · Silver')).toBe(true);
  });

  it('hides and restores the info card without clearing selection or releasing a held coin', async () => {
    const onSelect = vi.fn();
    await makeEngine({ onSelect });
    await engine.startSession(makeSession());
    const { controller } = connectController();
    controller.dispatchEvent({ type: 'selectstart' });
    const coin = getCoins()[0];
    const holder = coin.userData.heldBy;
    const position = coin.position.clone();
    const visibleBefore = new Set();
    engine.renderer.scene.traverse((object) => { if (object.visible) visibleBefore.add(object); });
    onSelect.mockClear();
    clickWorldButton('Info: On');
    const hidden = [...visibleBefore].filter((object) => !object.visible);
    expect(hidden).toHaveLength(2); // The card and its frame disappear together.
    expect(hidden.every((object) => object.isMesh)).toBe(true);
    expect(coin.userData.heldBy).toBe(holder);
    expect(coin.position.equals(position)).toBe(true);
    expect(onSelect).not.toHaveBeenCalled();
    clickWorldButton('Info: On');
    expect(hidden.every((object) => object.visible)).toBe(true);
    expect(coin.userData.heldBy).toBe(holder);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('waits for durable photo acceptance before reporting saved and displays the restored headset count', async () => {
    const counts = { photos: 3, videos: 1 };
    let finishSave;
    const onCapture = vi.fn(() => new Promise((resolve) => { finishSave = resolve; }));
    const fillText = vi.spyOn(canvasContext, 'fillText');
    await makeEngine({ onCapture, getCaptureCounts: () => counts });
    await engine.startSession(makeSession()); tick();
    clickWorldButton('Photo'); tick();
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledOnce());
    expect(fillText.mock.calls.some(([text]) => /saving photo/i.test(text))).toBe(true);
    expect(fillText.mock.calls.some(([text]) => /photo saved on this headset/i.test(text))).toBe(false);
    counts.photos = 4;
    finishSave(true);
    await vi.waitFor(() => expect(fillText.mock.calls.some(([text]) => /photo saved on this headset/i.test(text) && text.includes(`4/${XR_MEDIA_LIMITS.photo}`))).toBe(true));
  });

  it('waits for durable video acceptance before reporting saved with its restored headset count', async () => {
    const counts = { photos: 3, videos: 1 };
    let finishSave;
    const onVideo = vi.fn(() => new Promise((resolve) => { finishSave = resolve; }));
    const fillText = vi.spyOn(canvasContext, 'fillText');
    await makeEngine({ onVideo, getCaptureCounts: () => counts });
    await engine.startSession(makeSession()); tick();
    clickWorldButton('Video'); tick();
    clickWorldButton('Video'); tick();
    await vi.waitFor(() => expect(onVideo).toHaveBeenCalledOnce());
    expect(fillText.mock.calls.some(([text]) => /saving video/i.test(text))).toBe(true);
    expect(fillText.mock.calls.some(([text]) => /video saved on this headset/i.test(text))).toBe(false);
    counts.videos = 2;
    finishSave(true);
    await vi.waitFor(() => expect(fillText.mock.calls.some(([text]) => /video saved on this headset/i.test(text) && text.includes(`2/${XR_MEDIA_LIMITS.video}`))).toBe(true));
  });

  it('reports a rejected persistence write without claiming that the photo was saved', async () => {
    const failure = new Error('Device storage is full.');
    const onCapture = vi.fn(async () => { throw failure; });
    const onError = vi.fn();
    const fillText = vi.spyOn(canvasContext, 'fillText');
    await makeEngine({ onCapture, onError });
    await engine.startSession(makeSession()); tick();
    clickWorldButton('Photo'); tick();
    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(failure));
    expect(fillText.mock.calls.some(([text]) => /photo saved on this headset/i.test(text))).toBe(false);
  });

  it('discards an asynchronously encoded photo after leaving the scene', async () => {
    let resolvePhoto;
    vi.mocked(captureXRPhoto).mockImplementationOnce(() => new Promise((resolve) => { resolvePhoto = resolve; }));
    const onCapture = vi.fn();
    await makeEngine({ onCapture });
    await engine.startSession(makeSession());
    tick();
    clickWorldButton('Photo');
    tick();
    engine.dispose();
    resolvePhoto(new Blob(['late']));
    await Promise.resolve();
    await Promise.resolve();
    expect(onCapture).not.toHaveBeenCalled();
  });

  it('uses right A for one photo per press and right B to start/stop a short clip', async () => {
    const onCapture = vi.fn(); const onVideo = vi.fn();
    await makeEngine({ onCapture, onVideo });
    await engine.startSession(makeSession());
    tick(); // Initial viewer recenter deliberately rearms all input.
    const source = { handedness: 'right', targetRayMode: 'tracked-pointer', gamepad: {
      mapping: 'xr-standard', buttons: Array.from({ length: 6 }, () => ({ pressed: false, value: 0 })),
    } };
    engine.renderer.controllers[0].dispatchEvent({ type: 'connected', data: source });
    tick();
    source.gamepad.buttons[4].pressed = true;
    tick();
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledOnce());
    tick(10);
    expect(captureXRPhoto).toHaveBeenCalledOnce();
    source.gamepad.buttons[4].pressed = false;
    source.gamepad.buttons[5].pressed = true;
    tick();
    expect(startXRVideo).toHaveBeenCalledOnce();
    expect(startXRVideo).toHaveBeenCalledWith(expect.objectContaining({ durationMs: 10000 }));
    tick(10);
    expect(onVideo).not.toHaveBeenCalled();
    source.gamepad.buttons[5].pressed = false; tick();
    source.gamepad.buttons[5].pressed = true; tick();
    await vi.waitFor(() => expect(onVideo).toHaveBeenCalledOnce());
  });

  it('finalizes recording on XR visibility loss and cancels unfinished recording on scene disposal', async () => {
    const onVideo = vi.fn();
    await makeEngine({ onVideo });
    const session = makeSession();
    await engine.startSession(session); tick();
    clickWorldButton('Video'); tick();
    const first = vi.mocked(startXRVideo).mock.results.at(-1).value;
    session.visibilityState = 'visible-blurred';
    session.dispatchEvent(new Event('visibilitychange'));
    expect(first.stop).toHaveBeenCalledOnce();
    await vi.waitFor(() => expect(onVideo).toHaveBeenCalledOnce());
    session.visibilityState = 'visible'; session.dispatchEvent(new Event('visibilitychange')); tick();
    clickWorldButton('Video'); tick();
    const second = vi.mocked(startXRVideo).mock.results.at(-1).value;
    engine.dispose();
    expect(second.dispose).toHaveBeenCalled();
    expect(second.stop).not.toHaveBeenCalled();
    expect(onVideo).toHaveBeenCalledOnce();
  });

  it('converts cupped-hand world poses into desk coordinates without attaching the coins', async () => {
    await makeEngine();
    const physics = await vi.mocked(createCoinPhysics).mock.results.at(-1).value;
    const updateCup = vi.spyOn(physics, 'updateCup');
    const removeCup = vi.spyOn(physics, 'removeCup');
    engine.renderer.viewer.position.set(1, 1.6, 2);
    engine.renderer.viewer.rotation.y = Math.PI / 3;
    engine.renderer.viewer.updateMatrixWorld(true);
    await engine.startSession(makeSession()); tick();
    const rig = getCoins()[0].parent;
    const position = rig.localToWorld(new THREE.Vector3(-0.2, 0.76, -0.4));
    const quaternion = rig.getWorldQuaternion(new THREE.Quaternion());
    vi.mocked(getHandCupPose).mockReturnValue({ position, quaternion, width: 0.1, depth: 0.12, curl: 0.7 });
    const hand = engine.renderer.hands[0];
    for (const [name, offset] of [['wrist', 0], ['index-finger-tip', 0.03], ['thumb-tip', -0.03]]) {
      const joint = new THREE.Group(); joint.position.copy(position).add(new THREE.Vector3(offset, 0, 0));
      hand.joints[name] = joint; hand.add(joint);
    }
    engine.renderer.controllers[0].dispatchEvent({ type: 'connected', data: { hand: new Map(), handedness: 'right' } });
    tick();
    expect(updateCup).toHaveBeenCalledWith('input-0', expect.objectContaining({ width: 0.1, depth: 0.12 }));
    const local = updateCup.mock.calls.at(-1)[1];
    expect(local.position.distanceTo(new THREE.Vector3(-0.2, 0.76, -0.4))).toBeLessThan(0.00001);
    expect(local.quaternion.angleTo(new THREE.Quaternion())).toBeLessThan(0.00001);
    expect(getCoins().every((coin) => !coin.userData.heldBy)).toBe(true);
    vi.mocked(getHandCupPose).mockReturnValue(null); tick();
    expect(removeCup).toHaveBeenCalledWith('input-0');
  });

  it('scores a tray deposit only after the coin leaves physical palm support', async () => {
    const onProgress = vi.fn();
    await makeEngine({ onProgress });
    const physics = await vi.mocked(createCoinPhysics).mock.results.at(-1).value;
    const support = vi.spyOn(physics, 'isCupSupported').mockReturnValue(true);
    await engine.startSession(makeSession());
    const { controller, grip } = connectController();
    controller.dispatchEvent({ type: 'selectstart' });
    grip.position.set(0.22, 0.83, -0.32); tick(90);
    controller.dispatchEvent({ type: 'selectend' }); tick(200);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ sorted: 0, correct: 0 }));
    expect(support).toHaveBeenCalled();
    support.mockReturnValue(false); tick(30);
    expect(onProgress).toHaveBeenLastCalledWith(expect.objectContaining({ sorted: 1, correct: 1 }));
  });

  it('does not let an older encoded clip overwrite a newer recording state', async () => {
    let finishQueue;
    const onVideo = vi.fn(() => new Promise((resolve) => { finishQueue = resolve; }));
    const fillText = vi.spyOn(canvasContext, 'fillText');
    await makeEngine({ onVideo });
    await engine.startSession(makeSession()); tick();
    clickWorldButton('Video'); tick();
    clickWorldButton('Video'); tick();
    expect(onVideo).toHaveBeenCalledOnce();
    clickWorldButton('Video'); tick();
    const current = vi.mocked(startXRVideo).mock.results.at(-1).value;
    expect(current.recording).toBe(true);
    const textCalls = fillText.mock.calls.length;
    finishQueue(true);
    await Promise.resolve(); await Promise.resolve();
    expect(current.recording).toBe(true);
    expect(fillText.mock.calls.slice(textCalls).some(([text]) => text.includes('Video ready'))).toBe(false);
  });

  it('takes one photo for an ordinary fingertip tap and rearms only after withdrawing', async () => {
    const onCapture = vi.fn();
    await makeEngine({ onCapture });
    await engine.startSession(makeSession()); tick();
    const finger = connectPointingHand();
    const button = getWorldButton('Photo');
    fingerAtButton(finger, button, 0.08);
    fingerAtButton(finger, button, 0.003);
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledOnce());
    tick(40);
    expect(captureXRPhoto).toHaveBeenCalledOnce();
    fingerAtButton(finger, button, 0.08, 40);
    fingerAtButton(finger, button, 0.003);
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledTimes(2));
    expect(getCoins()[0].userData.heldBy).toBeNull();
  });

  it.each([
    ['Reset', 'reset'],
    ['Sort: Material', 'sort'],
  ])('activates %s with a tracked index finger and no pinch', async (label, action) => {
    const onSelect = vi.fn(); const onSortChange = vi.fn();
    await makeEngine({ onSelect, onSortChange });
    await engine.startSession(makeSession()); tick();
    const finger = connectPointingHand();
    const button = getWorldButton(label);
    fingerAtButton(finger, button, 0.08);
    fingerAtButton(finger, button, 0.003, 30);
    if (action === 'reset') expect(onSelect).toHaveBeenCalledExactlyOnceWith(null);
    else expect(onSortChange).toHaveBeenCalledExactlyOnceWith('mint');
    expect(getCoins()[0].userData.heldBy).toBeNull();
  });

  it('taps the actual tilted button surface after the desk has moved, rotated, and changed height', async () => {
    const onCapture = vi.fn();
    await makeEngine({ onCapture });
    engine.renderer.viewer.position.set(1.2, 1.6, -0.8);
    engine.renderer.viewer.rotation.y = Math.PI / 3;
    engine.renderer.viewer.updateMatrixWorld(true);
    await engine.startSession(makeSession()); tick();
    clickWorldButton('Height'); tick();
    const finger = connectPointingHand();
    const button = getWorldButton('Photo');
    expect(button.getWorldQuaternion(new THREE.Quaternion()).angleTo(new THREE.Quaternion())).toBeGreaterThan(0.5);
    fingerAtButton(finger, button, 0.08);
    fingerAtButton(finger, button, 0.003);
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledOnce());
  });

  it('does not create a phantom tap when fingertip tracking or XR visibility resumes in contact', async () => {
    const onCapture = vi.fn();
    await makeEngine({ onCapture });
    const session = makeSession();
    await engine.startSession(session); tick();
    const finger = connectPointingHand();
    const button = getWorldButton('Photo');
    fingerAtButton(finger, button, 0.08);
    fingerAtButton(finger, button, 0.003);
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledOnce());
    finger.hand.joints['index-finger-tip'].visible = false; tick(5);
    finger.hand.joints['index-finger-tip'].visible = true; tick(30);
    expect(captureXRPhoto).toHaveBeenCalledOnce();
    session.visibilityState = 'visible-blurred'; session.dispatchEvent(new Event('visibilitychange')); tick();
    session.visibilityState = 'visible'; session.dispatchEvent(new Event('visibilitychange')); tick(30);
    expect(captureXRPhoto).toHaveBeenCalledOnce();
    fingerAtButton(finger, button, 0.08, 40);
    fingerAtButton(finger, button, 0.003);
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledTimes(2));
  });

  it('does not press a button with the fingertips of the hand holding a coin', async () => {
    const onCapture = vi.fn(); const onSelect = vi.fn();
    await makeEngine({ onCapture, onSelect });
    await engine.startSession(makeSession()); tick(90);
    const finger = connectPointingHand();
    const coin = getCoins()[0];
    const grasp = coin.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.013, 0));
    finger.setTip(grasp); tick(5);
    finger.setTip(grasp, 0.01); tick(8);
    expect(onSelect).toHaveBeenLastCalledWith(sampleCoins[0]);
    expect(coin.userData.heldBy).toBeTruthy();
    const button = getWorldButton('Photo');
    fingerAtButton(finger, button, 0.08, 30, 0.01);
    fingerAtButton(finger, button, 0.003, 30, 0.01);
    expect(captureXRPhoto).not.toHaveBeenCalled();
    expect(coin.userData.heldBy).toBeTruthy();
  });

  it('does not dispatch twice when a button poke and a near-button pinch overlap', async () => {
    const onCapture = vi.fn();
    await makeEngine({ onCapture });
    await engine.startSession(makeSession()); tick();
    const finger = connectPointingHand();
    const button = getWorldButton('Photo');
    fingerAtButton(finger, button, 0.08);
    fingerAtButton(finger, button, 0.003, 30, 0.01);
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalledOnce());
    tick(40);
    expect(captureXRPhoto).toHaveBeenCalledOnce();
  });

  it('starts and stops Video with separate fingertip taps while holding contact fires only once', async () => {
    const onVideo = vi.fn();
    await makeEngine({ onVideo });
    await engine.startSession(makeSession()); tick();
    const finger = connectPointingHand();
    const button = getWorldButton('Video');
    fingerAtButton(finger, button, 0.08);
    fingerAtButton(finger, button, 0.003, 30);
    expect(startXRVideo).toHaveBeenCalledOnce();
    const recording = vi.mocked(startXRVideo).mock.results.at(-1).value;
    expect(recording.recording).toBe(true);
    expect(recording.stop).not.toHaveBeenCalled();
    fingerAtButton(finger, button, 0.08, 40);
    fingerAtButton(finger, button, 0.003);
    await vi.waitFor(() => expect(onVideo).toHaveBeenCalledOnce());
    expect(startXRVideo).toHaveBeenCalledOnce();
    expect(recording.stop).toHaveBeenCalledOnce();
  });
});
