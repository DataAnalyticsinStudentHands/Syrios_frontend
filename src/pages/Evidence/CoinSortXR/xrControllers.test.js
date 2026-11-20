import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createControllerVisual, createMediaButtonState, pollMediaButtons, RIGHT_A_BUTTON, RIGHT_B_BUTTON } from './xrControllers';

const visuals = [];
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (url) => ({ ok: true, json: async () => url.endsWith('profilesList.json')
    ? { 'meta-quest-touch-plus': { path: 'meta-quest-touch-plus/profile.json' }, 'oculus-touch-v3': { path: 'oculus-touch-v3/profile.json' } }
    : { profileId: 'test-touch', layouts: { left: { assetPath: 'left.glb', components: {} }, right: { assetPath: 'right.glb', components: {} } } },
  })));
});
afterEach(() => { visuals.splice(0).forEach((visual) => visual.dispose()); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const controller = (handedness = 'right') => ({
  handedness, targetRayMode: 'tracked-pointer', profiles: ['meta-quest-touch-plus'],
  gamepad: { mapping: 'xr-standard', buttons: Array.from({ length: 6 }, () => ({ pressed: false, value: 0 })) },
});

describe('right Quest face-button media controls', () => {
  it('maps A and B to independent press edges and never repeats held buttons', () => {
    const source = controller(); const state = createMediaButtonState();
    expect([RIGHT_A_BUTTON, RIGHT_B_BUTTON]).toEqual([4, 5]);
    pollMediaButtons(state, source);
    source.gamepad.buttons[4].pressed = true;
    expect(pollMediaButtons(state, source)).toEqual({ photo: true, video: false });
    expect(pollMediaButtons(state, source)).toEqual({ photo: false, video: false });
    source.gamepad.buttons[5].pressed = true;
    expect(pollMediaButtons(state, source)).toEqual({ photo: false, video: true });
  });

  it('requires release after connection and after session visibility resumes', () => {
    const source = controller(); const state = createMediaButtonState();
    source.gamepad.buttons[4].pressed = true;
    expect(pollMediaButtons(state, source).photo).toBe(false);
    source.gamepad.buttons[4].pressed = false; pollMediaButtons(state, source);
    source.gamepad.buttons[4].pressed = true;
    expect(pollMediaButtons(state, source).photo).toBe(true);
    pollMediaButtons(state, source, false);
    expect(pollMediaButtons(state, source).photo).toBe(false);
    source.gamepad.buttons[4].pressed = false; pollMediaButtons(state, source);
    source.gamepad.buttons[4].pressed = true;
    expect(pollMediaButtons(state, source).photo).toBe(true);
  });

  it('ignores left X/Y, hand sources, trigger/grip and nonstandard mappings', () => {
    for (const source of [controller('left'), { ...controller(), hand: {} }, { ...controller(), gamepad: { mapping: '', buttons: [] } }]) {
      const state = createMediaButtonState(); pollMediaButtons(state, source);
      if (source.gamepad.buttons[4]) source.gamepad.buttons[4].pressed = true;
      expect(pollMediaButtons(state, source)).toEqual({ photo: false, video: false });
    }
    const source = controller(); const state = createMediaButtonState(); pollMediaButtons(state, source);
    source.gamepad.buttons[0].pressed = true; source.gamepad.buttons[1].pressed = true;
    expect(pollMediaButtons(state, source)).toEqual({ photo: false, video: false });
  });

  it('does not inherit an armed button when the right input source changes', () => {
    const state = createMediaButtonState(); pollMediaButtons(state, controller());
    const next = controller(); next.gamepad.buttons[5].pressed = true;
    expect(pollMediaButtons(state, next).video).toBe(false);
  });
});

describe('standard locally hosted controller visuals', () => {
  it('loads a Touch Plus model locally and hides controller meshes in hand mode', async () => {
    let complete;
    const load = vi.spyOn(GLTFLoader.prototype, 'load').mockImplementation((url, onLoad) => { complete = onLoad; });
    const grip = new Group();
    const visual = createControllerVisual({ grip }); visuals.push(visual);
    grip.dispatchEvent({ type: 'connected', data: controller() });
    await vi.waitFor(() => expect(load).toHaveBeenCalledOnce());
    expect(load.mock.calls[0][0]).toBe('/xr/controllers/meta-quest-touch-plus/right.glb');
    const asset = new Group(); asset.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial()));
    complete({ scene: asset });
    visual.update(true);
    expect(grip.children.find((child) => 'motionController' in child).visible).toBe(true);
    grip.dispatchEvent({ type: 'disconnected' });
    grip.dispatchEvent({ type: 'connected', data: { ...controller(), hand: {} } });
    visual.update(true);
    expect(grip.children.every((child) => !child.visible)).toBe(true);
  });

  it('disposes late model assets without attaching them after scene teardown', async () => {
    let complete;
    vi.spyOn(GLTFLoader.prototype, 'load').mockImplementation((url, onLoad) => { complete = onLoad; });
    const grip = new Group();
    const visual = createControllerVisual({ grip }); visuals.push(visual);
    grip.dispatchEvent({ type: 'connected', data: controller() });
    await vi.waitFor(() => expect(complete).toBeTypeOf('function'));
    visual.dispose();
    const shape = new BoxGeometry(); const dispose = vi.spyOn(shape, 'dispose');
    const asset = new Group(); asset.add(new Mesh(shape, new MeshBasicMaterial()));
    complete({ scene: asset });
    expect(grip.children).toHaveLength(0);
    expect(dispose).toHaveBeenCalledOnce();
  });

  it('reports a failed model without invoking the factory throwing error callback', async () => {
    let fail;
    vi.spyOn(GLTFLoader.prototype, 'load').mockImplementation((url, onLoad, progress, onError) => { fail = onError; });
    const grip = new Group(); const onError = vi.fn();
    const visual = createControllerVisual({ grip, onError }); visuals.push(visual);
    grip.dispatchEvent({ type: 'connected', data: controller() });
    await vi.waitFor(() => expect(fail).toBeTypeOf('function'));
    expect(() => fail()).not.toThrow();
    expect(onError).toHaveBeenCalledOnce();
    visual.update(true);
    expect(grip.children.find((child) => child.isLineSegments).visible).toBe(true);
    expect(grip.children.filter((child) => child.isMesh)).toHaveLength(0);
  });
});
