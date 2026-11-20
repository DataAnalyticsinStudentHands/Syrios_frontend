// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACESFilmicToneMapping, ArrayCamera, Color, PerspectiveCamera, Scene, SRGBColorSpace, Vector4, WebGLRenderTarget } from 'three';
import { captureXRPhoto, createXRFrameCapture } from './xrCapture';

let renderer;
let state;
let pixelsOnCanvas;
let encodingCallback;

beforeEach(() => {
  state = {
    target: { name: 'XR swapchain' },
    viewport: new Vector4(20, 30, 1400, 900),
    scissor: new Vector4(10, 20, 1000, 700),
    scissorTest: true,
    clearColor: new Color('#142935'),
    clearAlpha: 0.6,
  };
  renderer = {
    xr: { enabled: true },
    autoClear: false,
    autoClearColor: false,
    autoClearDepth: true,
    autoClearStencil: false,
    outputColorSpace: SRGBColorSpace,
    toneMapping: ACESFilmicToneMapping,
    toneMappingExposure: 1.2,
    getRenderTarget: () => state.target,
    getActiveCubeFace: () => 2,
    getActiveMipmapLevel: () => 1,
    getViewport: (target) => target.copy(state.viewport),
    getScissor: (target) => target.copy(state.scissor),
    getScissorTest: () => state.scissorTest,
    getClearColor: (target) => target.copy(state.clearColor),
    getClearAlpha: () => state.clearAlpha,
    setRenderTarget: vi.fn((target) => { state.target = target; }),
    setViewport: vi.fn((...args) => { args.length === 1 ? state.viewport.copy(args[0]) : state.viewport.set(...args); }),
    setScissor: vi.fn((...args) => { args.length === 1 ? state.scissor.copy(args[0]) : state.scissor.set(...args); }),
    setScissorTest: vi.fn((value) => { state.scissorTest = value; }),
    setClearColor: vi.fn((color, alpha) => { state.clearColor.copy(color); state.clearAlpha = alpha; }),
    render: vi.fn(() => { expect(renderer.xr.enabled).toBe(false); }),
    readRenderTargetPixels: vi.fn((target, x, y, width, height, bytes) => {
      // GPU origin is bottom left. Pixel values encode the original row.
      for (let row = 0; row < height; row += 1) {
        for (let column = 0; column < width; column += 1) bytes.set([row * 70, column * 30, 15, 255], (row * width + column) * 4);
      }
    }),
  };
  pixelsOnCanvas = null;
  encodingCallback = null;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4), width, height }),
    putImageData: (image) => { pixelsOnCanvas = image; },
  });
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
    callback(new Blob(['encoded png'], { type: 'image/png' }));
  });
});

afterEach(() => vi.restoreAllMocks());

const assertRestored = (previousTarget) => {
  expect(renderer.xr.enabled).toBe(true);
  expect(state.target).toBe(previousTarget);
  expect(state.viewport.toArray()).toEqual([20, 30, 1400, 900]);
  expect(state.scissor.toArray()).toEqual([10, 20, 1000, 700]);
  expect(state.scissorTest).toBe(true);
  expect(state.clearAlpha).toBe(0.6);
  expect(renderer.autoClear).toBe(false);
  expect(renderer.autoClearColor).toBe(false);
  expect(renderer.autoClearDepth).toBe(true);
  expect(renderer.autoClearStencil).toBe(false);
  expect(renderer.outputColorSpace).toBe(SRGBColorSpace);
  expect(renderer.toneMapping).toBe(ACESFilmicToneMapping);
  expect(renderer.toneMappingExposure).toBe(1.2);
  expect(renderer.setRenderTarget).toHaveBeenLastCalledWith(previousTarget, 2, 1);
};

describe('XR scene photo capture', () => {
  it('reuses its frame targets and pixel canvas until explicitly disposed', () => {
    const dispose = vi.spyOn(WebGLRenderTarget.prototype, 'dispose');
    const frame = createXRFrameCapture({ renderer, scene: new Scene(), width: 2, height: 2 });
    const camera = new PerspectiveCamera();
    frame.capture(camera);
    const firstTarget = renderer.readRenderTargetPixels.mock.calls[0][0];
    frame.capture(camera);

    expect(renderer.readRenderTargetPixels.mock.calls[1][0]).toBe(firstTarget);
    expect(dispose).not.toHaveBeenCalled();
    frame.dispose();
    frame.dispose();
    expect(dispose).toHaveBeenCalledTimes(2);
    expect(() => frame.capture(camera)).toThrow('closed');
  });
  it('reads a separate mono target, flips GPU rows, encodes PNG and frees both targets', async () => {
    const previousTarget = state.target;
    const dispose = vi.spyOn(WebGLRenderTarget.prototype, 'dispose');
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1, 0.02, 30);
    const blob = await captureXRPhoto({ renderer, scene, camera, width: 2, height: 2 });

    expect(blob.type).toBe('image/png');
    const target = renderer.readRenderTargetPixels.mock.calls[0][0];
    expect(target).toBeInstanceOf(WebGLRenderTarget);
    expect(target).not.toBe(previousTarget);
    expect(renderer.render.mock.calls[0][0]).toBe(scene);
    expect(renderer.render.mock.calls[0][1].isArrayCamera).not.toBe(true);
    expect(Array.from(pixelsOnCanvas.data.slice(0, 8))).toEqual([70, 0, 15, 255, 70, 30, 15, 255]);
    expect(Array.from(pixelsOnCanvas.data.slice(8))).toEqual([0, 0, 15, 255, 0, 30, 15, 255]);
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
    expect(dispose).toHaveBeenCalledTimes(2);
    assertRestored(previousTarget);
  });

  it('uses the midpoint and world orientation of the tracked eyes without mutating them', async () => {
    const left = new PerspectiveCamera(70, 1, 0.02, 30);
    const right = left.clone();
    left.position.set(-0.032, 1.7, -0.4);
    right.position.set(0.032, 1.7, -0.4);
    left.rotation.y = right.rotation.y = 0.4;
    left.updateMatrixWorld(true);
    right.updateMatrixWorld(true);
    const before = left.matrixWorld.clone();
    const camera = new ArrayCamera([left, right]);
    camera.layers.mask = 7;
    await captureXRPhoto({ renderer, scene: new Scene(), camera, width: 3, height: 2 });

    const captured = renderer.render.mock.calls[0][1];
    expect(captured.position.toArray()).toEqual([0, 1.7, -0.4]);
    expect(captured.quaternion.angleTo(left.quaternion)).toBeCloseTo(0);
    expect(captured.aspect).toBe(1.5);
    expect(captured.fov).toBeCloseTo(70);
    expect(captured.layers.mask).toBe(7);
    expect(left.matrixWorld.equals(before)).toBe(true);
  });

  it('restores the XR renderer before asynchronous PNG encoding completes', async () => {
    const previousTarget = state.target;
    HTMLCanvasElement.prototype.toBlob.mockImplementation((callback) => { encodingCallback = callback; });
    const pending = captureXRPhoto({ renderer, scene: new Scene(), camera: new PerspectiveCamera(), width: 2, height: 2 });

    assertRestored(previousTarget);
    expect(encodingCallback).toBeTypeOf('function');
    encodingCallback(new Blob(['png'], { type: 'image/png' }));
    await expect(pending).resolves.toBeInstanceOf(Blob);
  });

  it.each(['render', 'readRenderTargetPixels'])('restores live XR state and disposes targets after %s fails', async (method) => {
    const previousTarget = state.target;
    const dispose = vi.spyOn(WebGLRenderTarget.prototype, 'dispose');
    renderer[method].mockImplementationOnce(() => { throw new Error('GPU capture failed'); });

    await expect(captureXRPhoto({ renderer, scene: new Scene(), camera: new PerspectiveCamera(), width: 2, height: 2 }))
      .rejects.toThrow('GPU capture failed');
    assertRestored(previousTarget);
    expect(dispose).toHaveBeenCalledTimes(2);
  });

  it('reports encoding failure after GPU state has already been restored', async () => {
    const previousTarget = state.target;
    HTMLCanvasElement.prototype.toBlob.mockImplementation((callback) => callback(null));
    await expect(captureXRPhoto({ renderer, scene: new Scene(), camera: new PerspectiveCamera(), width: 2, height: 2 }))
      .rejects.toThrow('could not be saved');
    assertRestored(previousTarget);
  });
});
