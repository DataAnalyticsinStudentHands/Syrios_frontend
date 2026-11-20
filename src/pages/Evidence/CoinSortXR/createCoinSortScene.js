import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { TABLE_HEIGHT, SORT_KEYS, formatCoinDetail, getTrayGroups, getSortVerdict } from './sceneMath';
import { createCoinGeometry, extractCoinProfile } from './coinGeometry';
import { createCoinPhysics } from './coinPhysics';
import { createHandVisual, createPinchState, estimateReleaseVelocity, updatePinchState } from './xrHands';
import { captureXRPhoto } from './xrCapture';
import { createButtonTouchState, updateButtonTouch } from './xrButtonTouch';
import { startXRVideo, VIDEO_DURATION_MS } from './xrVideo';
import { createCoinSortAudio, pulseController } from './xrAudio';
import { XR_MEDIA_LIMITS } from './xrMediaLimits';
import { createControllerVisual, createMediaButtonState, pollMediaButtons } from './xrControllers';
import { getHandCupPose } from './xrCupping';

const SORT_NAMES = { material: 'Material', mint: 'Mint', issuingAuthority: 'Authority' };
const MAX_COINS = 96;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const TABLE_BOUNDS = { minX: -0.6, maxX: 0.6, minZ: -0.77, maxZ: -0.15 };
const TRAY_LAYOUT = [
  { x: 0.22, z: -0.32, width: 0.21, depth: 0.22 },
  { x: 0.46, z: -0.32, width: 0.21, depth: 0.22 },
  { x: 0.22, z: -0.59, width: 0.21, depth: 0.22 },
  { x: 0.46, z: -0.59, width: 0.21, depth: 0.22 },
];

/**
 * An isolated, stationary WebXR workbench. Coins are manipulable 3D objects;
 * catalog photographs supply both faces and deform the cylinder's outline.
 * Thickness is approximate unless a catalog thickness is available; photographs
 * do not supply measured relief or surface depth.
 * Hand joints come from WebXR itself: no camera recognition service is involved.
 *
 * Lifecycle: prepare once, start a user-authorized XR session, then dispose on
 * route teardown. No scene is rendered to the ordinary browser workspace.
 * `onCapture` / `onVideo` must resolve only after the Blob is durably retained:
 * false means a full capture queue; rejection means storage failed. The live
 * `getCaptureCounts` getter includes captures restored before this scene exists.
 * Catalog IDs remain unchanged; instanceId distinguishes duplicated pile coins.
 */
export async function createCoinSortScene({
  container, coins = [], onSelect = () => {}, onProgress = () => {},
  onError = () => {}, onSortChange = () => {}, onCapture = () => {}, onVideo = () => {}, warning = '',
  getCaptureCounts = null,
}) {
  let disposed = false;
  let activeSession = null;
  let sortBy = 'material';
  let selected = null;
  let lastTime = 0;
  let lastProgress = -1;
  let modelVerticesInScene = 0;
  let resizeObserver = null;
  let physics = null;
  let elapsed = 0;
  let lastFeedback = warning || 'Reach into the pile, then pinch a coin.';
  let pendingCapture = false;
  let captureInFlight = false;
  let pendingVideoToggle = false;
  let video = null;
  let videoToken = null;
  let videoStartedAt = 0;
  let lastVideoCountdown = -1;
  let needsRecenter = false;
  let photoSaves = 0;
  let videoSaves = 0;
  let soundVolume = 0.25;
  let infoVisible = true;
  const audio = createCoinSortAudio();
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const listeners = [];
  const coinObjects = [];
  const inputs = [];
  const trays = [];
  const buttons = [];
  const imageCache = new Map();
  const modelCache = new Map();
  const raycaster = new THREE.Raycaster();
  const scratchPosition = new THREE.Vector3();
  const scratchMatrix = new THREE.Matrix4();
  const imageLoader = new THREE.ImageLoader().setCrossOrigin('anonymous');
  const gltfLoader = new GLTFLoader().setCrossOrigin('anonymous');
  const scene = new THREE.Scene();
  // Rapier and coin poses use this rig's local metres. XR joints/cameras use
  // world metres: convert at input boundaries so moving the bench never moves
  // the physics world or alters the user's tracked camera position.
  const tableRig = new THREE.Group();
  scene.add(tableRig);
  scene.background = new THREE.Color('#142128');
  scene.fog = new THREE.Fog('#142128', 3.2, 10);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.02, 20);
  const xrOrigin = new THREE.Group();
  xrOrigin.add(camera);
  scene.add(xrOrigin);
  const previewPosition = new THREE.Vector3(0, 1.45, 0.45);
  const previewTarget = new THREE.Vector3(0, 0.78, -0.45);
  camera.position.copy(previewPosition);
  camera.lookAt(previewTarget);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  try {
  physics = await createCoinPhysics({ tableHeight: TABLE_HEIGHT, bounds: TABLE_BOUNDS, trays: TRAY_LAYOUT });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local-floor');
  renderer.xr.setFramebufferScaleFactor(0.85);
  renderer.domElement.setAttribute('aria-label', 'CoinSort XR three-dimensional coin workbench');
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  function geometry(value) { geometries.add(value); return value; }
  function material(value) { materials.add(value); return value; }
  function texture(value) { textures.add(value); return value; }
  function listen(target, type, handler) {
    target.addEventListener(type, handler);
    listeners.push(() => target.removeEventListener(type, handler));
  }
  function box(width, height, depth, color, x, y, z, metalness = 0, corner = 0) {
    const object = new THREE.Mesh(
      geometry(corner ? new RoundedBoxGeometry(width, height, depth, 2, Math.min(corner, width / 2, height / 2, depth / 2)) : new THREE.BoxGeometry(width, height, depth)),
      material(new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness })),
    );
    object.position.set(x, y, z);
    tableRig.add(object);
    return object;
  }
  function canvasSurface(width, height, worldWidth, worldHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('CoinSort XR needs canvas drawing support.');
    const map = texture(new THREE.CanvasTexture(canvas));
    map.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
      geometry(new THREE.PlaneGeometry(worldWidth, worldHeight)),
      material(new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide, toneMapped: false })),
    );
    return { canvas, context, map, mesh };
  }
  function textLine(context, text, x, y, maxWidth, size = 32, color = '#f5eddb') {
    context.font = `${size >= 36 ? '600' : '400'} ${size}px system-ui, sans-serif`;
    context.fillStyle = color;
    let value = String(text ?? '');
    while (value.length > 1 && context.measureText(value).width > maxWidth) value = value.slice(0, -2);
    if (value !== String(text ?? '')) value += '…';
    context.fillText(value, x, y);
  }
  function fillSurface(surface, color = '#142935') {
    surface.context.fillStyle = color;
    surface.context.fillRect(0, 0, surface.canvas.width, surface.canvas.height);
  }

  function patternedTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = type === 'wood' ? '#584032' : '#213c3c';
    ctx.fillRect(0, 0, 256, 256);
    if (type === 'wood') {
      for (let row = 0; row < 160; row += 1) {
        const tone = Math.sin(row * 17.13) * 0.04 + 0.05;
        ctx.fillStyle = `rgba(20,12,8,${tone})`;
        ctx.fillRect(0, row * 1.6, 256, row % 7 === 0 ? 2 : 1);
      }
    } else {
      for (let y = 0; y < 256; y += 4) for (let x = 0; x < 256; x += 4) {
        ctx.fillStyle = `rgba(184,207,195,${0.025 + (Math.sin(x * 13 + y * 7) + 1) * 0.018})`;
        ctx.fillRect(x, y, 1, 2);
      }
    }
    const map = texture(new THREE.CanvasTexture(canvas));
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(type === 'wood' ? 2 : 5, type === 'wood' ? 1 : 3);
    return map;
  }
  const woodTexture = patternedTexture('wood');
  const feltTexture = patternedTexture('felt');
  function captures() {
    const values = getCaptureCounts?.() || { photos: photoSaves, videos: videoSaves };
    return { photos: Math.max(0, Math.floor(Number(values.photos) || 0)), videos: Math.max(0, Math.floor(Number(values.videos) || 0)) };
  }
  const known = (value) => value && !/^(unknown|not recorded|uncertain)$/i.test(String(value));
  function friendlyTitle(coin) {
    const title = String(coin.title || '');
    if (title && !/_/.test(title) && !/^[a-z\d]+(?:-[a-z\d]+){2,}$/.test(title)) return title;
    return [known(coin.mint) ? coin.mint : null, known(coin.material) ? coin.material : null].filter(Boolean).join(' · ') || 'Coin from the collection';
  }

  scene.add(new THREE.HemisphereLight('#e2e9ec', '#3b3028', 1.8));
  const keyLight = new THREE.DirectionalLight('#fff0dc', 3.0);
  keyLight.position.set(-1.2, 3, 1);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight('#c7dce5', 1.3);
  fillLight.position.set(2, 1.8, -2);
  scene.add(fillLight);
  scene.attach(box(12, 0.04, 12, '#1c292d', 0, -0.03, -1));
  scene.attach(box(5.8, 3.8, 0.08, '#253237', 0, 1.8, -3.1));
  const bench = box(1.22, 0.075, 0.66, '#b6a28c', 0, TABLE_HEIGHT - 0.043, -0.46, 0, 0.018);
  bench.material.map = woodTexture;
  const felt = box(1.2, 0.008, 0.62, '#8b9c92', 0, TABLE_HEIGHT - 0.004, -0.46, 0, 0.003);
  felt.material.map = feltTexture;
  felt.material.roughness = 1;
  for (const x of [-0.5, 0.5]) {
    for (const z of [-0.22, -0.7]) box(0.045, TABLE_HEIGHT - 0.07, 0.045, '#26343b', x, (TABLE_HEIGHT - 0.07) / 2, z, 0.3);
  }
  const studyMat = box(0.62, 0.0001, 0.54, '#718780', -0.25, TABLE_HEIGHT + 0.00005, -0.46);
  studyMat.material.map = feltTexture;
  studyMat.material.roughness = 1;
  box(0.0015, 0.002, 0.58, '#8e7957', 0.08, TABLE_HEIGHT + 0.005, -0.46, 0.35);
  // A single instanced contact-shading pass grounds the coins without shadow
  // maps, extra physics, or a separate draw call for every coin on the headset.
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 64;
  const shadowContext = shadowCanvas.getContext('2d');
  if (shadowContext) {
    const gradient = shadowContext.createRadialGradient?.(32, 32, 2, 32, 32, 32);
    gradient?.addColorStop(0, 'rgba(3,9,9,0.24)');
    gradient?.addColorStop(0.55, 'rgba(3,9,9,0.12)');
    gradient?.addColorStop(1, 'rgba(3,9,9,0)');
    shadowContext.fillStyle = gradient || 'rgba(3,9,9,0.12)';
    shadowContext.fillRect(0, 0, 64, 64);
  }
  const contactShadows = new THREE.InstancedMesh(
    geometry(new THREE.PlaneGeometry(1, 1)),
    material(new THREE.MeshBasicMaterial({ map: texture(new THREE.CanvasTexture(shadowCanvas)), transparent: true, depthWrite: false, toneMapped: false })),
    Math.min(coins.length, MAX_COINS),
  );
  contactShadows.renderOrder = -1;
  contactShadows.frustumCulled = false;
  tableRig.add(contactShadows);
  const shadowMatrix = new THREE.Matrix4();
  const shadowRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  const shadowPosition = new THREE.Vector3();
  const shadowScale = new THREE.Vector3();

  const board = canvasSurface(1536, 576, 0.98, 0.3675);
  board.mesh.position.set(0, TABLE_HEIGHT + 0.4, -0.87);
  board.mesh.rotation.x = -0.18;
  tableRig.add(board.mesh);
  const boardFrame = box(1.006, 0.3935, 0.012, '#5f5648', 0, TABLE_HEIGHT + 0.4, -0.879, 0.32, 0.005);
  boardFrame.rotation.x = board.mesh.rotation.x;

  const statusLabel = canvasSurface(1024, 128, 1.08, 0.135);
  statusLabel.mesh.rotation.x = -Math.PI / 2;
  statusLabel.mesh.position.set(0, TABLE_HEIGHT + 0.007, -0.735);
  tableRig.add(statusLabel.mesh);

  function drawBoard(coin) {
    fillSurface(board, '#10272d');
    const ctx = board.context;
    textLine(ctx, 'SYRIOS  /  COINSORT XR', 54, 53, 1410, 27, '#c4aa7c');
    if (coin) {
      textLine(ctx, friendlyTitle(coin), 54, 121, 1410, 48);
      formatCoinDetail(coin).forEach((line, index) => {
        textLine(ctx, line, 54 + (index >= 3 ? 750 : 0), 192 + (index % 3) * 58, 700, 34);
      });
      const photoShape = coinObjects.find((object) => object.userData.coin === coin)?.userData.photoShapeSource;
      const depthLabel = Number.isFinite(coin.thicknessMm) && coin.thicknessMm > 0 ? 'catalog thickness' : 'approximate depth';
      const scaleLabel = Number.isFinite(coin.diameterMm) && coin.diameterMm > 0
        ? coin.diameterMm > 200 ? 'limited study scale' : '2× study scale'
        : 'default study size';
      const source = coin.isDemo
        ? 'DEMO OBJECT · practice coin, not a catalog artifact'
        : photoShape === 'outline' ? `Photo-derived outline · ${depthLabel} · ${scaleLabel}`
          : `Circular outline approximation · ${depthLabel} · ${scaleLabel}`;
      textLine(ctx, source, 54, 410, 1410, 27, '#c4aa7c');
      textLine(ctx, 'Turn your wrist to see both faces. Set the coin in a tray to sort.', 54, 486, 1410, 30);
    } else {
      textLine(ctx, 'Coins, in your hands.', 54, 124, 1410, 52);
      textLine(ctx, 'Pinch one coin. Cup your hand to scoop several.', 54, 207, 1410, 37);
      textLine(ctx, 'Lift to examine. Open or tilt your hand to pour.', 54, 274, 1410, 37);
      textLine(ctx, `Controllers: trigger / grip to hold · A photo · B ${VIDEO_DURATION_MS / 1000}s video`, 54, 352, 1410, 32);
      textLine(ctx, 'Tap a control. Height and Recenter fit the bench to you.', 54, 426, 1410, 32, '#c4aa7c');
      textLine(ctx, warning || 'A quiet place to look closely. Sound starts at a gentle volume.', 54, 511, 1410, 28, warning ? '#e4c895' : '#bfcbc9');
    }
    board.map.needsUpdate = true;
  }

  function makeButton(label, width, x, callback, z = -0.16) {
    const surface = canvasSurface(640, 128, width, 0.074);
    surface.mesh.position.set(x, TABLE_HEIGHT + 0.065, z);
    surface.mesh.rotation.x = -Math.PI / 3;
    surface.mesh.userData.action = (source) => {
      audio.play('tap', { strength: 0.55 });
      pulseController(source, 0.12);
      callback();
    };
    surface.mesh.userData.buttonLabel = label;
    surface.label = label;
    surface.kind = label === 'Photo' ? 'photo' : label === 'Video' ? 'video' : null;
    surface.width = width;
    surface.backplate = new THREE.Mesh(
      geometry(new RoundedBoxGeometry(width + 0.006, 0.08, 0.012, 2, 0.004)),
      material(new THREE.MeshStandardMaterial({ color: '#625743', metalness: 0.38, roughness: 0.52 })),
    );
    surface.backplate.quaternion.copy(surface.mesh.quaternion);
    surface.backplate.position.copy(surface.mesh.position).add(new THREE.Vector3(0, 0, -0.007).applyQuaternion(surface.mesh.quaternion));
    tableRig.add(surface.backplate);
    buttons.push(surface);
    tableRig.add(surface.mesh);
    return surface;
  }
  function drawButton(button, label = button.label) {
    button.label = label;
    const savedFlash = elapsed < (button.savedUntil || 0);
    fillSurface(button, button.touchPressed || savedFlash ? '#35695d' : button.touchHover ? '#314e55' : '#1a353b');
    const ctx = button.context;
    ctx.strokeStyle = button.touchPressed || savedFlash ? '#9ad8be' : '#b49b6c';
    ctx.lineWidth = 4;
    ctx.strokeRect(3, 3, 634, 122);
    ctx.fillStyle = button.touchPressed ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.06)';
    ctx.fillRect(8, 8, 624, 7);
    ctx.fillStyle = button.touchPressed ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.18)';
    ctx.fillRect(8, 112, 624, 8);
    ctx.textAlign = 'center';
    const counts = captures();
    const secondary = button.kind === 'photo' ? captureInFlight ? 'Saving…' : `A  ·  ${counts.photos}/${XR_MEDIA_LIMITS.photo} saved`
      : button.kind === 'video' ? video?.recording ? `${Math.max(0, lastVideoCountdown)}s left  ·  B stop` : `B  ·  ${counts.videos}/${XR_MEDIA_LIMITS.video} saved` : null;
    // Keep counts above the label so the nearer control row cannot hide them.
    if (secondary) textLine(ctx, secondary, 320, 33, 598, 25, '#c5d1c9');
    textLine(ctx, label, 320, secondary ? 94 : 82, 598, secondary ? 44 : 46);
    ctx.textAlign = 'left';
    button.backplate.material.color.set(button.touchPressed ? '#3a5147' : button.touchHover ? '#8a7857' : '#625743');
    button.map.needsUpdate = true;
  }
  const sortButton = makeButton('Sort: Material', 0.27, -0.43, () => {
    setSortBy(SORT_KEYS[(SORT_KEYS.indexOf(sortBy) + 1) % SORT_KEYS.length]);
  });
  makeButton('Reset', 0.16, -0.18, () => reset());
  const photoButton = makeButton('Photo', 0.15, 0.01, () => { pendingCapture = true; });
  const videoButton = makeButton('Video', 0.15, 0.01, () => { pendingVideoToggle = true; }, -0.08);
  const soundButton = makeButton('Sound: Quiet', 0.27, -0.43, () => {
    soundVolume = soundVolume === 0.25 ? 0.5 : soundVolume === 0.5 ? 0 : 0.25;
    audio.setVolume(soundVolume);
    drawButton(soundButton, `Sound: ${soundVolume === 0 ? 'Off' : soundVolume === 0.25 ? 'Quiet' : 'Full'}`);
  }, -0.08);
  const infoButton = makeButton('Info: On', 0.16, -0.18, () => {
    infoVisible = !infoVisible;
    board.mesh.visible = infoVisible;
    boardFrame.visible = infoVisible;
    drawButton(infoButton, `Info: ${infoVisible ? 'On' : 'Off'}`);
  }, -0.08);
  makeButton('Height', 0.15, 0.19, () => {
    suspendInput();
    tableRig.position.y = tableRig.position.y >= 0.16 ? -0.08 : tableRig.position.y + 0.08;
    tableRig.updateMatrixWorld(true);
  });
  makeButton('Recenter', 0.16, 0.38, () => recenter());
  makeButton('Exit XR', 0.16, 0.54, () => {
    activeSession?.end().catch((error) => { if (!disposed) onError(error); });
  });
  buttons.forEach((button) => drawButton(button));

  function demoFace(coin, reverse) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const mat = String(coin.material || '').toLowerCase();
    const metal = mat.includes('gold') ? '#c6a051' : mat.includes('silver') ? '#b7bfc2' : '#987342';
    ctx.fillStyle = metal;
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#322d25';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(128, 128, 96, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#322d25';
    ctx.textAlign = 'center';
    ctx.font = 'bold 25px system-ui';
    ctx.fillText(coin.isDemo ? 'DEMO' : 'NO PHOTO', 128, 73);
    ctx.font = coin.isDemo ? 'bold 68px Georgia' : 'bold 40px system-ui';
    ctx.fillText(coin.isDemo ? (reverse ? 'S' : 'Σ') : 'STUDY', 128, 151);
    ctx.font = '18px system-ui';
    ctx.fillText(reverse ? 'REVERSE' : 'OBVERSE', 128, 195);
    const map = texture(new THREE.CanvasTexture(canvas));
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }
  function loadPhotoFace(url) {
    if (!url) return Promise.resolve(null);
    if (imageCache.has(url)) return imageCache.get(url);
    const request = imageLoader.loadAsync(url).then((image) => {
      if (disposed) return null;
      const sourceWidth = image.naturalWidth || image.width;
      const sourceHeight = image.naturalHeight || image.height;
      if (!sourceWidth || !sourceHeight) return null;
      // Bound image analysis and GPU texture memory independently of the upload.
      const scale = Math.min(1, 384 / Math.max(sourceWidth, sourceHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(sourceWidth * scale));
      canvas.height = Math.max(1, Math.round(sourceHeight * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return null;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let profile = null;
      let photoCanvas = canvas;
      try {
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        profile = extractCoinProfile(pixels);
        if (profile) {
          // Remove only the detected exterior backdrop. Interior highlights and
          // inscriptions remain opaque because the silhouette fills its holes.
          for (let index = 0; index < profile.mask.length; index += 1) {
            if (!profile.mask[index]) pixels.data[index * 4 + 3] = 0;
          }
          context.putImageData(pixels, 0, 0);
          const { minX, minY, maxX, maxY } = profile.bounds;
          const cropped = document.createElement('canvas');
          cropped.width = maxX - minX + 1;
          cropped.height = maxY - minY + 1;
          const croppedContext = cropped.getContext('2d');
          if (croppedContext) {
            croppedContext.drawImage(canvas, minX, minY, cropped.width, cropped.height,
              0, 0, cropped.width, cropped.height);
            photoCanvas = cropped;
          } else profile = null;
        }
      } catch (error) {
        // Canvas readback may be unavailable. A safe, ordinary photo cylinder
        // remains usable; no background threshold is guessed in that case.
        if (error?.name === 'SecurityError') return null;
        profile = null;
      }
      if (disposed) return null;
      const map = texture(new THREE.CanvasTexture(photoCanvas));
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      // The full pixel mask is needed only during cropping. Keep the compact
      // perimeter in the cache rather than 48 pairs of analysis-sized masks.
      const compactProfile = profile ? {
        width: profile.width, height: profile.height, bounds: profile.bounds,
        center: profile.center, points: profile.points, source: profile.source,
      } : null;
      return { map, profile: compactProfile };
    }).catch(() => null);
    imageCache.set(url, request);
    return request;
  }
  function registerModel(root) {
    root.traverse((object) => {
      if (!object.isMesh) return;
      if (object.geometry) geometry(object.geometry);
      const modelMaterials = Array.isArray(object.material) ? object.material : [object.material];
      modelMaterials.forEach((mat) => {
        if (!mat) return;
        material(mat);
        Object.values(mat).forEach((value) => { if (value?.isTexture) texture(value); });
      });
    });
  }
  function loadModel(url) {
    if (!modelCache.has(url)) {
      const request = gltfLoader.loadAsync(url).then((gltf) => {
        const root = gltf.scene;
        registerModel(root);
        if (disposed) {
          // Late requests cannot attach to an already unmounted scene.
          disposeResources();
          throw new Error('CoinSort scene was closed.');
        }
        let vertices = 0;
        root.traverse((object) => { vertices += object.geometry?.attributes?.position?.count || 0; });
        if (vertices > 30000) throw new Error('Coin model exceeds the prototype complexity limit.');
        root.userData.xrVertexCount = vertices;
        return root;
      });
      modelCache.set(url, request);
    }
    return modelCache.get(url);
  }

  const sourceCoins = coins.slice(0, MAX_COINS);
  sourceCoins.forEach((coin, index) => {
    const recordedDiameter = Number.isFinite(coin.diameterMm) && coin.diameterMm > 0 ? coin.diameterMm : 24;
    // Uniform 2× study scale preserves catalog proportions. Only extraordinary
    // sizes beyond 200 mm receive the explicitly labeled ergonomic limit.
    const diameter = Math.min(recordedDiameter, 200) / 500;
    const thickness = Number.isFinite(coin.thicknessMm) && coin.thicknessMm > 0
      ? coin.thicknessMm * diameter / recordedDiameter
      : diameter * 0.105;
    const root = new THREE.Group();
    const mat = String(coin.material || '').toLowerCase();
    const color = mat.includes('gold') ? '#b8964f' : mat.includes('silver') ? '#a6b0b6' : '#997346';
    const isPlaceholder = !coin.obverseUrl && !coin.reverseUrl;
    const frontMap = isPlaceholder ? demoFace(coin, false) : null;
    const backMap = isPlaceholder ? demoFace(coin, true) : null;
    const faceMaterial = (map) => material(new THREE.MeshStandardMaterial({
      color: map ? '#ffffff' : color, map, roughness: map ? 0.8 : 0.58, metalness: map ? 0.1 : 0.48,
      alphaTest: 0.1,
    }));
    const disc = new THREE.Mesh(
      geometry(createCoinGeometry({ diameter, thickness })),
      [
        material(new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.6 })),
        faceMaterial(frontMap), faceMaterial(backMap),
      ],
    );
    root.add(disc);
    const localIndex = index % 16;
    const angle = index * GOLDEN_ANGLE;
    const layer = Math.floor(index / 16);
    const home = new THREE.Vector3(-0.43 + (localIndex % 4) * 0.075,
      TABLE_HEIGHT + thickness / 2 + 0.025 + layer * 0.015,
      -0.61 + Math.floor(localIndex / 4) * 0.08);
    root.position.copy(home);
    root.rotation.set((index % 3 - 1) * 0.065, angle, (index % 5 - 2) * 0.035);
    root.userData = {
      coin, radius: diameter / 2, thickness, home, homeQuaternion: root.quaternion.clone(),
      instanceId: coin.instanceId || `${coin.id}:${index}`,
      heldBy: null, trayIndex: -1, photoShapeSource: 'circle', stableFor: 0, lastTray: -1, verdict: null,
    };
    tableRig.add(root);
    coinObjects.push(root);
    physics.addCoin(root.userData.instanceId, { radius: diameter / 2, thickness, position: home, quaternion: root.quaternion });
    const faces = { front: null, back: null };
    function applyPhotoFace(face, result) {
      if (disposed || !result || disc.parent !== root) return;
      faces[face] = result;
      const faceMat = disc.material[face === 'front' ? 1 : 2];
      faceMat.map = result.map;
      faceMat.color.set('#ffffff');
      faceMat.roughness = 0.8;
      faceMat.metalness = 0.1;
      faceMat.needsUpdate = true;
      const oldGeometry = disc.geometry;
      // Swap the mesh, never the held root: a late image cannot move a coin out
      // of someone's hand or change its orientation while they examine it.
      disc.geometry = geometry(createCoinGeometry({
        diameter, thickness, frontProfile: faces.front?.profile || null, backProfile: faces.back?.profile || null,
      }));
      geometries.delete(oldGeometry);
      oldGeometry.dispose();
      const bounds = disc.geometry.boundingSphere;
      if (bounds) root.userData.radius = Math.max(diameter / 2, bounds.radius + bounds.center.length());
      root.userData.photoShapeSource = faces.front?.profile || faces.back?.profile ? 'outline' : 'circle';
      if (selected === coin) drawBoard(coin);
    }
    if (coin.obverseUrl) loadPhotoFace(coin.obverseUrl).then((result) => applyPhotoFace('front', result)).catch(() => {});
    if (coin.reverseUrl) loadPhotoFace(coin.reverseUrl).then((result) => applyPhotoFace('back', result)).catch(() => {});
    if (coin.modelUrl) {
      loadModel(coin.modelUrl).then((source) => {
        if (disposed) return;
        const vertexCount = source.userData.xrVertexCount || 0;
        if (modelVerticesInScene + vertexCount > 300000) return;
        modelVerticesInScene += vertexCount;
        const model = new THREE.Group();
        model.add(source.clone(true));
        const bounds = new THREE.Box3().setFromObject(model);
        const dimensions = bounds.getSize(new THREE.Vector3());
        // A coin's thinnest dimension is its normal. Align it with the study disc.
        if (dimensions.x <= dimensions.y && dimensions.x <= dimensions.z) model.rotation.z = Math.PI / 2;
        else if (dimensions.z <= dimensions.x && dimensions.z <= dimensions.y) model.rotation.x = Math.PI / 2;
        model.updateMatrixWorld(true);
        bounds.setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const scale = diameter / Math.max(size.x, size.z, 0.000001);
        const center = bounds.getCenter(new THREE.Vector3());
        model.scale.setScalar(scale);
        model.position.copy(center).multiplyScalar(-scale);
        root.remove(disc);
        root.add(model);
      }).catch(() => {
        // Keep the already usable photo disc when a source model cannot load.
      });
    }
  });

  function drawTrayLabel(tray, count = 0) {
    tray.count = count;
    const label = tray.labelSurface;
    fillSurface(label, elapsed < tray.flashUntil && tray.flashVerdict !== 'unscored' ? tray.flashVerdict === 'correct' ? '#285d48' : '#743b3b' : '#142d33');
    const ctx = label.context;
    textLine(ctx, tray.group.label, 24, 72, 590, 56);
    textLine(ctx, `${count} coin${count === 1 ? '' : 's'}`, 24, 134, 590, 40, '#c4aa7c');
    label.map.needsUpdate = true;
  }
  function buildTrays() {
    const groups = getTrayGroups(sourceCoins, sortBy);
    while (trays.length < 4) {
      const index = trays.length;
      const { x, z, width, depth } = TRAY_LAYOUT[index];
      const trayGroup = new THREE.Group();
      tableRig.add(trayGroup);
      const base = box(width, 0.012, depth, '#71877a', x, TABLE_HEIGHT + 0.006, z, 0, 0.004);
      base.material.map = feltTexture;
      base.material.roughness = 1;
      trayGroup.attach(base);
      for (const edge of [
        [-width / 2, 0, 0.006, depth], [width / 2, 0, 0.006, depth],
        [0, -depth / 2, width, 0.006], [0, depth / 2, width, 0.006],
      ]) {
        const rim = box(edge[2], 0.025, edge[3], '#8d7955', x + edge[0], TABLE_HEIGHT + 0.0245, z + edge[1], 0.3, 0.002);
        trayGroup.attach(rim);
      }
      const labelSurface = canvasSurface(640, 180, width - 0.01, 0.065);
      labelSurface.mesh.rotation.x = -Math.PI / 3;
      labelSurface.mesh.position.set(x, TABLE_HEIGHT + 0.073, z - depth / 2 - 0.005);
      trayGroup.add(labelSurface.mesh);
      trays.push({ mesh: trayGroup, x, z, width, depth, base, group: { label: '', values: [] }, labelSurface, flashUntil: 0, flashVerdict: null });
    }
    trays.forEach((tray, index) => {
      tray.mesh.visible = index < groups.length;
      physics.setTrayEnabled?.(index, tray.mesh.visible);
      tray.group = groups[index] || { label: '', values: [] };
      if (tray.mesh.visible) drawTrayLabel(tray);
    });
  }
  function trayAt(position) {
    return trays.findIndex((tray) => tray.group.values.length > 0 && Math.abs(position.x - tray.x) < tray.width / 2 - 0.008 && Math.abs(position.z - tray.z) < tray.depth / 2 - 0.008);
  }
  function publishProgress(force = false) {
    let sorted = 0;
    let correct = 0;
    let incorrect = 0;
    let unscored = 0;
    const counts = trays.map(() => 0);
    coinObjects.forEach((object) => {
      if (object.userData.trayIndex < 0 || object.userData.heldBy || object.userData.stableFor < 0.25) return;
      sorted += 1;
      counts[object.userData.trayIndex] += 1;
      if (object.userData.verdict === 'correct') correct += 1;
      else if (object.userData.verdict === 'incorrect') incorrect += 1;
      else unscored += 1;
    });
    const signature = `${correct}:${incorrect}:${unscored}:${counts.join(',')}:${lastFeedback}`;
    if (!force && signature === lastProgress) return;
    lastProgress = signature;
    trays.forEach((tray, index) => { if (tray.mesh.visible) drawTrayLabel(tray, counts[index]); });
    fillSurface(statusLabel, '#112c30');
    textLine(statusLabel.context, `${correct} correct  ·  ${incorrect} to revisit  ·  ${coinObjects.length - sorted} left${unscored ? `  ·  ${unscored} unscored` : ''}`, 20, 45, 980, 34, '#d8be8c');
    textLine(statusLabel.context, lastFeedback, 20, 99, 980, 30);
    statusLabel.map.needsUpdate = true;
    onProgress({ sorted, total: coinObjects.length, correct, incorrect, unscored, remaining: coinObjects.length - sorted });
  }
  function choose(object) {
    selected = object.userData.coin;
    drawBoard(selected);
    onSelect(selected);
  }

  function makeInput(index) {
    const controller = renderer.xr.getController(index);
    const grip = renderer.xr.getControllerGrip(index);
    const hand = renderer.xr.getHand(index);
    const anchor = new THREE.Group();
    const input = {
      controller, grip, hand, anchor, source: null, held: null, pressed: new Set(),
      pinch: createPinchState(), tracked: false, lastAction: -Infinity, history: [], index,
      buttonTouches: new Map(), touchOwner: null, lastButtonActivationAt: -Infinity,
      mediaButtons: createMediaButtonState(), cupped: false,
    };
    const line = new THREE.Line(
      geometry(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)])),
      material(new THREE.LineBasicMaterial({ color: '#dfc58c', transparent: true, opacity: 0.65 })),
    );
    line.scale.z = 1.1;
    controller.add(line);
    input.ray = line;
    xrOrigin.add(controller, grip, hand);
    scene.add(anchor);
    input.controllerVisual = createControllerVisual({ grip, onError: (error) => {
      if (disposed) return;
      lastFeedback = 'Controller model unavailable. Tracking and buttons are still active.';
      publishProgress(true);
      onError(error);
    } });
    input.handVisual = createHandVisual({ hand, scene, onError: (error) => {
      if (disposed) return;
      lastFeedback = 'Detailed hand mesh unavailable. Connected hand shapes are active.';
      publishProgress(true);
      onError(error);
    } });
    input.hoverRing = new THREE.Mesh(
      geometry(new THREE.TorusGeometry(1, 0.045, 6, 48)),
      material(new THREE.MeshBasicMaterial({ color: '#9be5dd', transparent: true, opacity: 0.8, depthWrite: false })),
    );
    input.hoverRing.visible = false;
    scene.add(input.hoverRing);
    listen(controller, 'connected', ({ data }) => {
      input.source = data;
      clearInputButtonTouches(input);
      input.mediaButtons = createMediaButtonState();
      hand.userData.handedness = data?.handedness;
    });
    listen(controller, 'disconnected', () => {
      release(input, true);
      physics.removeHand(`input-${index}`);
      physics.removeCup(`input-${index}`);
      input.source = null;
      clearInputButtonTouches(input);
      input.pressed.clear();
      input.pinch = createPinchState();
      input.mediaButtons = createMediaButtonState();
      input.cupped = false;
      input.handVisual.update(false);
      input.controllerVisual.update(false);
      input.hoverRing.visible = false;
    });
    for (const eventType of ['select', 'squeeze']) {
      listen(controller, `${eventType}start`, () => {
        if (input.source?.hand || !isInteractive()) return;
        input.pressed.add(eventType);
        if (input.pressed.size === 1) begin(input);
      });
      listen(controller, `${eventType}end`, () => {
        if (input.source?.hand) return;
        input.pressed.delete(eventType);
        if (!input.pressed.size) release(input);
      });
    }
    inputs.push(input);
  }
  makeInput(0);
  makeInput(1);

  function isInteractive() {
    return !disposed && activeSession && activeSession.visibilityState === 'visible';
  }
  function clearInputButtonTouches(input) {
    input.buttonTouches.clear();
    input.touchOwner = null;
  }
  function updateButtonTouches() {
    const feedback = new Map(buttons.map((button) => [button, { pressed: false, hovered: false }]));
    for (const input of inputs) {
      const tip = input.hand.joints['index-finger-tip'];
      const enabled = !!(isInteractive() && input.source?.hand && input.tracked
        && input.hand.visible && tip?.visible && !input.held && !input.cupped);
      if (!enabled) { clearInputButtonTouches(input); continue; }
      const worldPoint = tip.getWorldPosition(new THREE.Vector3());
      const radius = THREE.MathUtils.clamp(tip.jointRadius || 0.008, 0.005, 0.012);
      if (input.touchOwner) {
        const ownerPoint = input.touchOwner.mesh.worldToLocal(worldPoint.clone());
        if (ownerPoint.z > radius + 0.016 || Math.abs(ownerPoint.x) > input.touchOwner.width / 2 + radius + 0.012
          || Math.abs(ownerPoint.y) > 0.037 + radius + 0.012) input.touchOwner = null;
      }
      let activated = false;
      for (const button of buttons) {
        let state = input.buttonTouches.get(button);
        if (!state) { state = createButtonTouchState(); input.buttonTouches.set(button, state); }
        const point = button.mesh.worldToLocal(worldPoint.clone());
        const result = updateButtonTouch(state, { point, halfWidth: button.width / 2, halfHeight: 0.037, radius, time: elapsed });
        const visual = feedback.get(button);
        visual.pressed ||= result.pressed;
        visual.hovered ||= result.hovered;
        if (!result.activated || activated || (input.touchOwner && input.touchOwner !== button)
          || elapsed - input.lastButtonActivationAt < 0.12 || elapsed - (button.lastFingerActivationAt ?? -Infinity) < 0.12) continue;
        // One surface owns the poke until the finger withdraws. Passing through
        // a button cannot activate another button behind it on the same stroke.
        input.touchOwner = button;
        input.lastButtonActivationAt = elapsed;
        input.lastAction = performance.now();
        button.lastFingerActivationAt = elapsed;
        button.tapFlashUntil = elapsed + 0.16;
        activated = true;
        button.mesh.userData.action(input.source);
      }
    }
    buttons.forEach((button) => {
      const state = feedback.get(button);
      const pressed = state.pressed || elapsed < (button.tapFlashUntil || 0);
      const token = `${pressed}:${state.hovered}:${elapsed < (button.savedUntil || 0)}`;
      if (button.touchAppearance === token) return;
      button.touchAppearance = token;
      button.touchPressed = pressed;
      button.touchHover = state.hovered;
      drawButton(button);
    });
  }
  function updateInputPose(input, time) {
    const { source, hand, grip, controller } = input;
    const hasHand = !!source?.hand;
    input.controllerVisual.update(!!source && !hasHand && grip.visible && isInteractive());
    input.ray.visible = !!source && !hasHand && controller.visible && !input.held;
    input.tracked = false;
    input.handVisual.update(hasHand && hand.visible && isInteractive());
    if (hasHand) {
      const indexTip = hand.joints['index-finger-tip'];
      const thumbTip = hand.joints['thumb-tip'];
      const wrist = hand.joints.wrist;
      const valid = hand.visible && indexTip?.visible && thumbTip?.visible && wrist?.visible;
      if (!valid) { input.handVisual.update(false); return; }
      indexTip.getWorldPosition(scratchPosition);
      thumbTip.getWorldPosition(input.anchor.position);
      const pinchDistance = scratchPosition.distanceTo(input.anchor.position);
      input.anchor.position.add(scratchPosition).multiplyScalar(0.5);
      wrist.getWorldQuaternion(input.anchor.quaternion);
      input.anchor.updateMatrixWorld(true);
      input.tracked = true;
      const middle = hand.joints['middle-finger-phalanx-proximal'];
      const handScale = middle?.visible ? middle.getWorldPosition(scratchPosition).distanceTo(wrist.getWorldPosition(new THREE.Vector3())) : 0.085;
      const gesture = updatePinchState(input.pinch, pinchDistance, handScale, time);
      if (isInteractive() && gesture === 'grab') begin(input);
      else if (gesture === 'release') release(input);
    } else {
      const pose = grip.visible ? grip : controller;
      if (!source || !pose.visible) return;
      pose.getWorldPosition(input.anchor.position);
      pose.getWorldQuaternion(input.anchor.quaternion);
      input.anchor.updateMatrixWorld(true);
      input.tracked = true;
    }
    if (input.held) {
      physics.removeHand(`input-${input.index}`);
      physics.removeCup(`input-${input.index}`);
      input.cupped = false;
      recordHeldPose(input, time);
    } else if (hasHand && input.pinch.closeSince !== null && nearestCoin(input)) {
      // Acquisition is intentionally stable over several frames. Do not push
      // the highlighted coin away with the very fingertips trying to pinch it.
      physics.removeHand(`input-${input.index}`);
      physics.removeCup(`input-${input.index}`);
      input.cupped = false;
    } else if (input.tracked && isInteractive()) {
      const cup = hasHand ? getHandCupPose(hand, source.handedness) : null;
      if (cup) {
        const position = tableRig.worldToLocal(cup.position.clone());
        const quaternion = tableRig.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(cup.quaternion);
        physics.updateCup(`input-${input.index}`, { ...cup, position, quaternion });
        physics.removeHand(`input-${input.index}`);
        input.cupped = true;
      } else {
      physics.removeCup(`input-${input.index}`);
      input.cupped = false;
      const colliders = [];
      if (hasHand) {
        for (const name of ['thumb-tip', 'index-finger-tip', 'middle-finger-tip', 'ring-finger-tip', 'pinky-finger-tip']) {
          const joint = hand.joints[name];
          if (!joint?.visible) continue;
          const position = tableRig.worldToLocal(joint.getWorldPosition(new THREE.Vector3()));
          colliders.push({ position, radius: THREE.MathUtils.clamp(joint.jointRadius || 0.008, 0.006, 0.012) });
        }
        const wrist = hand.joints.wrist;
        const middle = hand.joints['middle-finger-phalanx-proximal'];
        if (wrist?.visible) {
          const palm = wrist.getWorldPosition(new THREE.Vector3());
          if (middle?.visible) palm.lerp(middle.getWorldPosition(new THREE.Vector3()), 0.52);
          colliders.push({ position: tableRig.worldToLocal(palm), radius: 0.025 });
        }
      } else colliders.push({ position: tableRig.worldToLocal(input.anchor.position.clone()), radius: 0.023 });
      physics.updateHand(`input-${input.index}`, colliders);
      }
    }
    const media = pollMediaButtons(input.mediaButtons, source, isInteractive());
    if (media.photo) { pendingCapture = true; audio.play('tap', { strength: 0.55 }); pulseController(source, 0.12); }
    if (media.video) { pendingVideoToggle = true; audio.play('tap', { strength: 0.55 }); pulseController(source, 0.12); }
    updateHover(input);
  }
  function rayHits(input) {
    if (!input.controller.visible) return [];
    input.controller.updateWorldMatrix(true, false);
    scratchMatrix.identity().extractRotation(input.controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(input.controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(scratchMatrix);
    raycaster.near = 0;
    raycaster.far = 2.8;
    return raycaster.intersectObjects([...buttons.map((button) => button.mesh), ...coinObjects.filter((coin) => !coin.userData.heldBy)], true);
  }
  function rootCoin(object) {
    let current = object;
    while (current && !current.userData.coin) current = current.parent;
    return current?.userData.coin ? current : null;
  }
  function begin(input) {
    if (!isInteractive() || input.held || !input.tracked) return;
    // Direct grasp gets priority over the target ray when reaching into the pile.
    let nearest = nearestCoin(input);
    let distant = false;
    if (!nearest) {
      const nearButton = buttons.find((button) => {
        const point = button.mesh.worldToLocal(input.anchor.position.clone());
        return Math.abs(point.x) < button.width / 2 + 0.015 && Math.abs(point.y) < 0.052 && Math.abs(point.z) < 0.04;
      });
      if (nearButton && performance.now() - input.lastAction > 500) {
        input.lastAction = performance.now();
        input.lastButtonActivationAt = elapsed;
        nearButton.mesh.userData.action(input.source);
        return;
      }
      const hit = rayHits(input)[0];
      if (hit?.object.userData.action) {
        const now = performance.now();
        if (now - input.lastAction > 500) {
          input.lastAction = now;
          input.lastButtonActivationAt = elapsed;
          hit.object.userData.action(input.source);
        }
        return;
      }
      nearest = hit && !input.source?.hand ? rootCoin(hit.object) : null;
      distant = !!nearest;
    }
    if (!nearest || nearest.userData.heldBy) return;
    physics.grab(nearest.userData.instanceId);
    physics.removeHand(`input-${input.index}`);
    physics.removeCup(`input-${input.index}`);
    input.cupped = false;
    nearest.updateWorldMatrix(true, false);
    input.graspOffset = input.anchor.matrixWorld.clone().invert().multiply(nearest.matrixWorld);
    if (distant) {
      input.graspOffset.compose(new THREE.Vector3(0, 0.025, -0.12),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), new THREE.Vector3(1, 1, 1));
    }
    nearest.userData.heldBy = input;
    nearest.userData.trayIndex = -1;
    nearest.userData.stableFor = 0;
    nearest.userData.lastTray = -1;
    nearest.userData.verdict = null;
    input.held = nearest;
    input.history = [];
    recordHeldPose(input, elapsed);
    choose(nearest);
    publishProgress(true);
  }
  function release(input, quiet = false) {
    const object = input.held;
    if (!object) return;
    recordHeldPose(input, elapsed);
    input.held = null;
    tableRig.attach(object);
    object.userData.heldBy = null;
    object.userData.stableFor = 0;
    object.userData.trayIndex = -1;
    const velocity = quiet ? { linearVelocity: { x: 0, y: 0, z: 0 }, angularVelocity: { x: 0, y: 0, z: 0 } } : estimateReleaseVelocity(input.history);
    physics.release(object.userData.instanceId, velocity);
    input.history = [];
    publishProgress(true);
  }
  function nearestCoin(input) {
    let nearest = null;
    let score = Infinity;
    coinObjects.forEach((object) => {
      if (object.userData.heldBy) return;
      const point = object.worldToLocal(input.anchor.position.clone());
      const radialGap = Math.max(0, Math.hypot(point.x, point.z) - object.userData.radius);
      const faceGap = Math.max(0, Math.abs(point.y) - object.userData.thickness / 2);
      const distance = Math.hypot(radialGap, faceGap);
      if (distance < 0.028 && distance < score) {
        nearest = object;
        score = distance;
      }
    });
    return nearest;
  }
  function updateHover(input) {
    const object = input.tracked && !input.held ? nearestCoin(input) : null;
    input.hoverRing.visible = !!object && isInteractive();
    if (!object) return;
    object.getWorldPosition(input.hoverRing.position);
    object.getWorldQuaternion(input.hoverRing.quaternion);
    input.hoverRing.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));
    input.hoverRing.scale.setScalar(object.userData.radius * 1.08);
  }
  function recordHeldPose(input, time) {
    const object = input.held;
    if (!object) return;
    // The grasp offset stays immutable. This is an intended kinematic target;
    // syncPhysics still renders the capped body pose, including while held, so
    // a fast wrist movement cannot cause a visible jump when the coin is freed.
    const target = input.anchor.matrixWorld.clone().multiply(input.graspOffset);
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    target.decompose(position, quaternion, new THREE.Vector3());
    tableRig.worldToLocal(position);
    quaternion.premultiply(tableRig.getWorldQuaternion(new THREE.Quaternion()).invert());
    physics.moveHeld(object.userData.instanceId, position, quaternion);
    const last = input.history.at(-1);
    if (last?.time === time) input.history.pop();
    input.history.push({ time, position, quaternion });
    while (input.history.length > 12 || input.history[0]?.time < time - 0.15) input.history.shift();
  }
  function syncPhysics(dt) {
    physics.step(dt);
    coinObjects.forEach((object, index) => {
      const data = object.userData;
      const pose = physics.getPose(data.instanceId);
      if (!pose) return;
      object.position.copy(pose.position);
      object.quaternion.copy(pose.quaternion);
      const floorHeight = TABLE_HEIGHT + (trayAt(object.position) >= 0 ? 0.012 : 0.0001);
      const normalY = 1 - 2 * (object.quaternion.x ** 2 + object.quaternion.z ** 2);
      const extentY = Math.abs(normalY) * data.thickness / 2 + Math.sqrt(Math.max(0, 1 - normalY ** 2)) * data.radius;
      const gap = Math.max(0, object.position.y - extentY - floorHeight);
      const onBench = object.position.x >= TABLE_BOUNDS.minX && object.position.x <= TABLE_BOUNDS.maxX
        && object.position.z >= TABLE_BOUNDS.minZ && object.position.z <= TABLE_BOUNDS.maxZ;
      const shadowSize = onBench && gap < 0.035 ? data.radius * 2.35 : 0;
      shadowPosition.set(object.position.x, floorHeight + 0.00025, object.position.z);
      shadowScale.set(shadowSize, shadowSize, shadowSize);
      shadowMatrix.compose(shadowPosition, shadowRotation, shadowScale);
      contactShadows.setMatrixAt(index, shadowMatrix);
      const previousVertical = data.previousVerticalVelocity || 0;
      data.previousVerticalVelocity = pose.linearVelocity.y;
      if (!data.heldBy && previousVertical < -0.15 && pose.linearVelocity.y > previousVertical * 0.35
        && object.position.y < TABLE_HEIGHT + 0.24) {
        audio.play('coin', { strength: Math.min(0.75, Math.abs(previousVertical) * 0.55), position: object.getWorldPosition(new THREE.Vector3()) });
      }
      if (data.heldBy) return;
      const speed = Math.hypot(pose.linearVelocity.x, pose.linearVelocity.y, pose.linearVelocity.z);
      const spin = Math.hypot(pose.angularVelocity.x, pose.angularVelocity.y, pose.angularVelocity.z);
      const trayIndex = trayAt(object.position);
      const mightRest = trayIndex >= 0 && object.position.y < TABLE_HEIGHT + 0.15 && (pose.sleeping || (speed < 0.05 && spin < 0.8));
      const resting = mightRest && !physics.isCupSupported(data.instanceId);
      data.awayFor = resting ? 0 : (data.awayFor || 0) + dt;
      if (data.awayFor > 0.15) data.lastTray = -1;
      data.stableFor = resting ? data.stableFor + dt : 0;
      data.trayIndex = data.stableFor >= 0.25 ? trayIndex : -1;
      if (data.trayIndex >= 0) {
        const verdict = getSortVerdict(data.coin, sortBy, trays[trayIndex].group);
        data.verdict = verdict;
        if (data.lastTray !== trayIndex) {
          data.lastTray = trayIndex;
          const tray = trays[trayIndex];
          tray.flashVerdict = verdict;
          tray.flashUntil = elapsed + 1.1;
          lastFeedback = verdict === 'correct' ? `Correct · ${tray.group.label}`
            : verdict === 'incorrect' ? `Try the ${data.coin[sortBy]} tray`
              : `${SORT_NAMES[sortBy]} not recorded · not scored`;
          if (verdict === 'correct' || verdict === 'incorrect') audio.play(verdict, { strength: 0.7, position: object.getWorldPosition(new THREE.Vector3()) });
        }
      }
    });
    contactShadows.instanceMatrix.needsUpdate = true;
    trays.forEach((tray) => {
      const flashing = elapsed < tray.flashUntil;
      const color = flashing && tray.flashVerdict !== 'unscored' ? tray.flashVerdict === 'correct' ? '#89b997' : '#bc8980' : '#71877a';
      tray.base.material.color.set(color);
      if (tray.flashWasActive !== flashing) {
        tray.flashWasActive = flashing;
        if (tray.mesh.visible) drawTrayLabel(tray, tray.count || 0);
      }
    });
    publishProgress();
  }
  function recenter() {
    suspendInput();
    const viewer = renderer.xr.isPresenting ? renderer.xr.getCamera() : camera;
    const position = viewer.getWorldPosition(new THREE.Vector3());
    const facing = new THREE.Vector3(0, 0, -1).applyQuaternion(viewer.getWorldQuaternion(new THREE.Quaternion()));
    tableRig.position.x = position.x;
    tableRig.position.z = position.z;
    tableRig.rotation.y = Math.atan2(-facing.x, -facing.z);
    tableRig.updateMatrixWorld(true);
  }
  function toggleVideo() {
    if (video?.recording) {
      lastFeedback = 'Finishing video…';
      video.stop();
      publishProgress(true);
      return;
    }
    if (video) return;
    try {
      // Encoder finalization and IndexedDB writes can outlive the recording.
      // A completion may save its Blob but cannot overwrite a newer clip's UI.
      const token = {};
      videoToken = token;
      videoStartedAt = elapsed;
      lastVideoCountdown = Math.ceil(VIDEO_DURATION_MS / 1000);
      video = startXRVideo({
        renderer, scene, getCamera: () => renderer.xr.getCamera(), durationMs: VIDEO_DURATION_MS,
        onComplete: async (blob) => {
          if (videoToken !== token) return;
          const completed = video;
          video = null;
          completed?.dispose();
          if (disposed) return;
          lastFeedback = 'Saving video…';
          drawButton(videoButton, 'Video');
          publishProgress(true);
          try {
            const accepted = await onVideo(blob);
            if (disposed) return;
            if (accepted !== false) videoSaves += 1;
            if (videoToken !== token) { drawButton(videoButton); return; }
            const counts = captures();
            lastFeedback = accepted === false ? 'Video limit reached. Exit XR to export your clips.' : `Video saved on this headset · ${counts.videos}/${XR_MEDIA_LIMITS.video}`;
            if (accepted !== false) { videoButton.savedUntil = elapsed + 0.9; audio.play('capture', { strength: 0.7 }); }
          } catch (error) {
            if (disposed || videoToken !== token) return;
            lastFeedback = 'Video could not be saved. Try again.';
            onError(error);
          }
          drawButton(videoButton, 'Video');
          publishProgress(true);
        },
        onError: (error) => {
          if (videoToken !== token) return;
          video?.dispose();
          video = null;
          if (disposed) return;
          lastFeedback = 'Video could not be recorded. Photo is still available.';
          drawButton(videoButton, 'Video');
          publishProgress(true);
          onError(error);
        },
      });
      if (!video?.recording) {
        video?.dispose(); video = null;
        throw new Error('Video recording could not start. Photo is still available.');
      }
      lastFeedback = `Recording… ${VIDEO_DURATION_MS / 1000} seconds. Press right B again to stop early.`;
      drawButton(videoButton, 'Stop clip');
      publishProgress(true);
    } catch (error) {
      video = null;
      lastFeedback = error?.message || 'Video recording is unavailable. Photo is still available.';
      publishProgress(true);
      onError(error);
    }
  }
  function suspendInput() {
    inputs.forEach((input) => {
      clearInputButtonTouches(input);
      release(input, true);
      physics.removeHand(`input-${input.index}`);
      physics.removeCup(`input-${input.index}`);
      input.pressed.clear();
      input.pinch = createPinchState();
      input.mediaButtons = createMediaButtonState();
      input.cupped = false;
      input.tracked = false;
      input.handVisual.update(false);
      input.controllerVisual.update(false);
      input.hoverRing.visible = false;
    });
  }
  function reset() {
    if (disposed) return;
    inputs.forEach((input) => {
      clearInputButtonTouches(input);
      if (input.held) tableRig.attach(input.held);
      input.held = null;
      input.pressed.clear();
      input.pinch = createPinchState();
      input.history = [];
      physics.removeHand(`input-${input.index}`);
      physics.removeCup(`input-${input.index}`);
      input.mediaButtons = createMediaButtonState();
      input.cupped = false;
    });
    coinObjects.forEach((object) => {
      object.position.copy(object.userData.home);
      object.quaternion.copy(object.userData.homeQuaternion);
      object.userData.heldBy = null;
      object.userData.trayIndex = -1;
      object.userData.stableFor = 0;
      object.userData.lastTray = -1;
      object.userData.verdict = null;
      object.userData.previousVerticalVelocity = 0;
      physics.resetCoin(object.userData.instanceId, object.position, object.quaternion);
    });
    selected = null;
    lastFeedback = warning || 'Pile reset. Open your hand, then pinch to pick up a coin.';
    drawBoard(null);
    onSelect(null);
    publishProgress(true);
  }
  function setSortBy(key) {
    if (disposed || !SORT_KEYS.includes(key) || key === sortBy) return;
    sortBy = key;
    buildTrays();
    drawButton(sortButton, `Sort: ${SORT_NAMES[sortBy]}`);
    reset();
    onSortChange(key);
  }

  function resize() {
    if (disposed || renderer.xr.isPresenting) return;
    const width = Math.max(1, container.clientWidth || 960);
    const height = Math.max(1, container.clientHeight || 600);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(container);
  listen(window, 'resize', resize);
  listen(renderer.domElement, 'webglcontextlost', (event) => {
    event.preventDefault();
    if (!disposed) {
      suspendInput();
      onError(new Error('The 3D graphics context was lost. Exit XR and reload the experience.'));
      activeSession?.end().catch(() => {});
    }
  });
  function onSessionEnded() {
    if (video?.recording) video.stop();
    pendingVideoToggle = false;
    pendingCapture = false;
    if (activeSession) {
      activeSession.removeEventListener('end', onSessionEnded);
      activeSession.removeEventListener('visibilitychange', onSessionVisibility);
    }
    activeSession = null;
    suspendInput();
    lastTime = 0;
    xrOrigin.position.y = 0;
    camera.position.copy(previewPosition);
    camera.lookAt(previewTarget);
    resize();
  }
  function onSessionVisibility() {
    lastTime = 0;
    if (activeSession?.visibilityState !== 'visible') {
      if (video?.recording) video.stop();
      pendingCapture = false;
      pendingVideoToggle = false;
      suspendInput();
    }
  }
  async function startSession(session) {
    if (disposed) throw new Error('This CoinSort XR scene has closed.');
    if (activeSession) throw new Error('An XR session is already active.');
    audio.unlock();
    activeSession = session;
    session.addEventListener('end', onSessionEnded);
    session.addEventListener('visibilitychange', onSessionVisibility);
    try {
      // local-floor is optional. A local-only device receives a stationary
      // seated-height origin, shared by its camera and both input sources.
      let floorSpace = true;
      try {
        await session.requestReferenceSpace('local-floor');
      } catch {
        floorSpace = false;
      }
      if (disposed || activeSession !== session) throw new Error('This XR session has closed.');
      renderer.xr.setReferenceSpaceType(floorSpace ? 'local-floor' : 'local');
      xrOrigin.position.y = floorSpace ? 0 : 1.6;
      await renderer.xr.setSession(session);
      if (disposed) throw new Error('This CoinSort XR scene has closed.');
      lastTime = 0;
      needsRecenter = true;
    } catch (error) {
      session.removeEventListener('end', onSessionEnded);
      session.removeEventListener('visibilitychange', onSessionVisibility);
      activeSession = null;
      xrOrigin.position.y = 0;
      await session.end().catch(() => {});
      throw error;
    }
  }
  listen(renderer.xr, 'sessionend', () => {
    if (disposed) return;
    xrOrigin.position.y = 0;
    camera.position.copy(previewPosition);
    camera.lookAt(previewTarget);
    resize();
  });
  function disposeResources() {
    geometries.forEach((value) => value.dispose());
    materials.forEach((value) => value.dispose());
    textures.forEach((value) => {
      value.dispose();
      if (typeof ImageBitmap !== 'undefined' && value.image instanceof ImageBitmap) value.image.close();
    });
    geometries.clear();
    materials.clear();
    textures.clear();
  }
  function dispose() {
    if (disposed) return;
    // Mark synchronously before ending XR: image/model loads, PNG encoding,
    // recorder events, and storage commits may all resolve after this call.
    disposed = true;
    video?.dispose();
    video = null;
    videoToken = null;
    pendingCapture = false;
    pendingVideoToggle = false;
    renderer.setAnimationLoop(null);
    resizeObserver?.disconnect();
    listeners.forEach((remove) => remove());
    if (activeSession) {
      const session = activeSession;
      session.removeEventListener('end', onSessionEnded);
      session.removeEventListener('visibilitychange', onSessionVisibility);
      activeSession = null;
      session.end().catch(() => {});
    }
    disposeResources();
    audio.dispose();
    contactShadows.dispose();
    inputs.forEach((input) => { input.handVisual.dispose(); input.controllerVisual.dispose(); });
    physics.dispose();
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    imageCache.clear();
    modelCache.clear();
  }
  buildTrays();
  drawBoard(null);
  publishProgress(true);
  resize();
  renderer.setAnimationLoop((time) => {
    if (disposed) return;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.035) : 0;
    lastTime = time;
    elapsed = time / 1000;
    if (activeSession) {
      if (isInteractive()) {
        scene.updateMatrixWorld(true);
        inputs.forEach((input) => {
          updateInputPose(input, elapsed);
          if (!input.tracked) {
            clearInputButtonTouches(input);
            if (input.held) release(input, true);
            physics.removeHand(`input-${input.index}`);
            physics.removeCup(`input-${input.index}`);
            input.cupped = false;
            pollMediaButtons(input.mediaButtons, input.source, false);
            input.pinch = createPinchState();
            input.pressed.clear();
            input.hoverRing.visible = false;
          }
        });
        // Resolve held/cupped ownership before fingertip UI. A hand carrying a
        // coin or a handful must not also press a control with those fingers.
        updateButtonTouches();
        syncPhysics(dt);
      }
    } else {
      syncPhysics(dt);
    }
    if (renderer.xr.isPresenting && activeSession) {
      renderer.render(scene, camera);
      const audioCamera = renderer.xr.getCamera();
      audio.updateListener(audioCamera.getWorldPosition(new THREE.Vector3()), audioCamera.getWorldQuaternion(new THREE.Quaternion()));
      if (needsRecenter) { needsRecenter = false; recenter(); }
      if (pendingVideoToggle) { pendingVideoToggle = false; toggleVideo(); }
      if (video?.recording) {
        video.captureFrame(time);
        if (video?.recording) {
          const remaining = Math.max(0, Math.ceil(VIDEO_DURATION_MS / 1000 - (elapsed - videoStartedAt)));
          if (remaining !== lastVideoCountdown) {
            lastVideoCountdown = remaining;
            lastFeedback = `Recording… ${remaining} seconds. Press right B again to stop early.`;
            drawButton(videoButton);
            publishProgress(true);
          }
        }
      }
      if (pendingCapture && !captureInFlight) {
        pendingCapture = false;
        captureInFlight = true;
        const captureRequest = captureXRPhoto({ renderer, scene, camera: renderer.xr.getCamera() });
        lastFeedback = 'Saving photo…';
        drawButton(photoButton);
        publishProgress(true);
        captureRequest.then(async (blob) => {
          if (disposed) return;
          const accepted = await onCapture(blob);
          if (disposed) return;
          if (accepted !== false) photoSaves += 1;
          const counts = captures();
          lastFeedback = accepted === false ? 'Photo limit reached. Exit XR to export your photos.' : `Photo saved on this headset · ${counts.photos}/${XR_MEDIA_LIMITS.photo}`;
          if (accepted !== false) { photoButton.savedUntil = elapsed + 0.9; audio.play('capture', { strength: 0.7 }); }
          publishProgress(true);
        }).catch((error) => {
          if (disposed) return;
          lastFeedback = 'Photo could not be saved. Try again.';
          publishProgress(true);
          onError(error);
        }).finally(() => { captureInFlight = false; if (!disposed) drawButton(photoButton); });
      }
    }
  });
  return { renderer, startSession, reset, setSortBy, dispose, unlockAudio: () => audio.unlock() };
  } catch (error) {
    // Constructor errors occur before the caller has a disposer. Clean up here
    // as well, including textures/models that may finish loading later.
    disposed = true;
    renderer.setAnimationLoop(null);
    resizeObserver?.disconnect();
    listeners.forEach((remove) => remove());
    inputs.forEach((input) => { input.handVisual.dispose(); input.controllerVisual.dispose(); });
    video?.dispose();
    physics?.dispose();
    audio.dispose();
    geometries.forEach((value) => value.dispose());
    materials.forEach((value) => value.dispose());
    textures.forEach((value) => value.dispose());
    geometries.clear();
    materials.clear();
    textures.clear();
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    throw error;
  }
}

export default createCoinSortScene;
