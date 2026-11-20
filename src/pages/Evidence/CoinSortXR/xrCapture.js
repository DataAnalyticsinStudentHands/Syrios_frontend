import { Color, HalfFloatType, LinearSRGBColorSpace, PerspectiveCamera, RGBAFormat, SRGBColorSpace, UnsignedByteType, Vector3, Vector4, WebGLRenderTarget } from 'three';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const dimension = (value, fallback) => Math.max(1, Math.min(4096, Math.floor(Number(value) || fallback)));

function photoCamera(camera, width, height) {
  const eye = camera.isArrayCamera ? camera.cameras[0] || camera : camera;
  if (!camera.isArrayCamera) camera.updateWorldMatrix(true, false);
  const projectionY = eye.projectionMatrix?.elements[5];
  const fov = Number.isFinite(projectionY) && projectionY > 0
    ? 2 * Math.atan(1 / projectionY) * 180 / Math.PI : 60;
  const result = new PerspectiveCamera(fov, width / height, eye.near || 0.02, eye.far || 20);
  // XR eye matrices already contain the user's origin; do not recompute them.
  eye.matrixWorld.decompose(result.position, result.quaternion, new Vector3());
  if (camera.isArrayCamera && camera.cameras.length > 1) {
    result.position.set(0, 0, 0);
    camera.cameras.forEach((view) => result.position.add(new Vector3().setFromMatrixPosition(view.matrixWorld)));
    result.position.multiplyScalar(1 / camera.cameras.length);
  }
  result.layers.mask = camera.layers.mask;
  result.updateMatrixWorld(true);
  return result;
}

/** Reusable, app-scene-only mono capture. Owns two targets and one 2D canvas. */
export function createXRFrameCapture({ renderer, scene, width = 1600, height = 1000 }) {
  if (!renderer || !scene) throw new Error('The XR scene is not ready for capture.');
  const captureWidth = dimension(width, 1600);
  const captureHeight = Math.min(dimension(height, 1000), Math.floor(8000000 / captureWidth));
  const canvas = document.createElement('canvas');
  canvas.width = captureWidth;
  canvas.height = captureHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser could not prepare XR capture.');
  const image = context.createImageData(captureWidth, captureHeight);
  const pixels = new Uint8Array(captureWidth * captureHeight * 4);
  let linearTarget;
  let outputTarget;
  let outputPass;
  let disposed = false;

  function dispose() {
    if (disposed) return;
    disposed = true;
    outputPass?.dispose();
    linearTarget?.dispose();
    outputTarget?.dispose();
  }
  try {
    linearTarget = new WebGLRenderTarget(captureWidth, captureHeight, { format: RGBAFormat, type: HalfFloatType, depthBuffer: true });
    linearTarget.texture.colorSpace = LinearSRGBColorSpace;
    outputTarget = new WebGLRenderTarget(captureWidth, captureHeight, { format: RGBAFormat, type: UnsignedByteType, depthBuffer: false });
    outputPass = new OutputPass();
  } catch (issue) { dispose(); throw issue; }

  function capture(camera) {
    if (disposed) throw new Error('This XR capture has closed.');
    if (!camera) throw new Error('The XR camera is not ready for capture.');
    const saved = {
      xrEnabled: renderer.xr.enabled,
      target: renderer.getRenderTarget(),
      cubeFace: renderer.getActiveCubeFace?.() || 0,
      mipLevel: renderer.getActiveMipmapLevel?.() || 0,
      viewport: renderer.getViewport(new Vector4()),
      scissor: renderer.getScissor(new Vector4()),
      scissorTest: renderer.getScissorTest(),
      autoClear: renderer.autoClear,
      autoClearColor: renderer.autoClearColor,
      autoClearDepth: renderer.autoClearDepth,
      autoClearStencil: renderer.autoClearStencil,
      clearColor: renderer.getClearColor(new Color()),
      clearAlpha: renderer.getClearAlpha(),
      outputColorSpace: renderer.outputColorSpace,
      toneMapping: renderer.toneMapping,
      toneMappingExposure: renderer.toneMappingExposure,
    };
    try {
      renderer.xr.enabled = false;
      renderer.autoClear = true;
      renderer.autoClearColor = true;
      renderer.autoClearDepth = true;
      renderer.autoClearStencil = true;
      renderer.outputColorSpace = SRGBColorSpace;
      renderer.setRenderTarget(linearTarget);
      renderer.setViewport(0, 0, captureWidth, captureHeight);
      renderer.setScissor(0, 0, captureWidth, captureHeight);
      renderer.setScissorTest(false);
      renderer.render(scene, photoCamera(camera, captureWidth, captureHeight));
      outputPass.render(renderer, outputTarget, linearTarget);
      renderer.readRenderTargetPixels(outputTarget, 0, 0, captureWidth, captureHeight, pixels);
    } finally {
      try {
        renderer.autoClear = saved.autoClear;
        renderer.autoClearColor = saved.autoClearColor;
        renderer.autoClearDepth = saved.autoClearDepth;
        renderer.autoClearStencil = saved.autoClearStencil;
        renderer.outputColorSpace = saved.outputColorSpace;
        renderer.toneMapping = saved.toneMapping;
        renderer.toneMappingExposure = saved.toneMappingExposure;
        renderer.setClearColor(saved.clearColor, saved.clearAlpha);
        renderer.setViewport(saved.viewport);
        renderer.setScissor(saved.scissor);
        renderer.setScissorTest(saved.scissorTest);
        renderer.setRenderTarget(saved.target, saved.cubeFace, saved.mipLevel);
      } finally { renderer.xr.enabled = saved.xrEnabled; }
    }
    const rowBytes = captureWidth * 4;
    for (let y = 0; y < captureHeight; y += 1) {
      const offset = (captureHeight - 1 - y) * rowBytes;
      image.data.set(pixels.subarray(offset, offset + rowBytes), y * rowBytes);
    }
    context.putImageData(image, 0, 0);
    return canvas;
  }
  return { canvas, capture, dispose };
}

/** Capture the app scene, excluding headset system menus and overlays. */
export async function captureXRPhoto({ renderer, scene, camera, width = 1600, height = 1000 }) {
  if (!camera) throw new Error('The XR scene is not ready for a photo.');
  const frame = createXRFrameCapture({ renderer, scene, width, height });
  try { frame.capture(camera); }
  finally { frame.dispose(); }
  // Renderer state and GPU targets are restored/released before encoding yields.
  return await new Promise((resolve, reject) => {
    frame.canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('The XR photo could not be saved.')), 'image/png');
  });
}
