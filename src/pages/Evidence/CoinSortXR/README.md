# CoinSort XR test experience

This experience belongs to the staging build at `/dev/Evidence/CoinSortXR`.
Use Meta Quest Browser over HTTPS (or a suitable secure localhost development
connection). The menu appears only when immersive WebXR is supported. Test real
hand tracking, controller input, headset removal, and repeated entry/exit on a
physical headset before releasing it beyond staging. Its browser page contains
one entry button; the workbench, controls, and feedback appear inside XR.

## Coin assets

Catalog metadata and photographs use the existing
`coinCollectionsRequest.fetchAllForCoinSort()` endpoint. Up to 48 unique records
produce 96 physical coins: two instances per record double the original pile.
`instanceId` identifies each physical object; `id` continues to identify its
catalog record. Each coin is a three-dimensional mesh shaped from the outline in its
catalog photographs, with the obverse and reverse mapped onto its two faces.
Transparent backgrounds or uniform backgrounds are removed before extracting
the outline. Image processing is bounded to a small canvas and cached per image.
Images without a reliable outline, or without readable CORS pixel access, use a
circular outline. This reconstructs the silhouette, not scanned surface relief.
Recorded thickness is used when available; otherwise depth is approximate.
Recorded diameter values remain unchanged in the metadata; an absent or invalid
diameter stays unknown. Any comfortable display sizing in the scene is separate
from the catalog measurement.
Recorded `thickness` or `thickness_mm` is passed through as `thicknessMm` when
positive and numeric. If neither is recorded, thickness remains unknown; any
depth supplied by the visual reconstruction is an approximation.

The photographed coins work without external model files. Optional original
scans can override the generated meshes: add self-contained, web-optimized
**GLB** paths to `public/xr/coin-models.json`:

```json
{
  "models": {
    "YOUR_CATALOG_COIN_ID": "xr/models/your-coin.glb",
    "123": "https://your-asset-host.example/coin.glb"
  }
}
```

Keys match the catalog `coin_id`, or alternatively the Strapi record ID. Put a
local model at `public/xr/models/your-coin.glb`. Relative model paths resolve
under the application's base (`/dev/` on staging); catalog image paths resolve
against `VITE_STRAPI_URL`. External hosts must allow CORS for both models and
photographs. A failed model load falls back to the photo-derived mesh.

If the catalog is unavailable or empty, the experience explicitly switches to
48 synthetic sample tokens from 24 sample records. Their mint, authority, and dates carry sample labels
and make no historical claims. No progress is written back to the catalog.

## Local testing

Run `npm run dev -- --mode staging` and open the printed `/dev/` URL. The route
is `/dev/Evidence/CoinSortXR`. Ordinary development and production modes do not
register this route. Production builds also omit the XR scene code.

Run `npm test` for the automated suite and `npm run build:staging` for the
staging build. A physical Quest must visit an HTTPS staging origin; a plain
HTTP LAN address does not provide the secure context needed for WebXR.

Inside XR, open your hand and then pinch near a highlighted coin. Controller
trigger and grip also work. Grabs require a stable pinch, tolerate small gesture
noise, and reset after tracking loss. Open hands can push the pile. To scoop a
handful, face your palms upward and gently curl your fingers. Slide beneath
loose coins, lift, then tip your palms or open your fingers to spill them.
The coins remain individual dynamic bodies resting on physical palm/finger
collision surfaces; they are not attached as a group. Tracking loss removes
those surfaces and releases the handful. Released
coins keep their orientation and measured release motion, then collide, slide,
rotate, and settle through Rapier rigid-body physics. Coins that fall out of
reach return to the pile.

The workbench is closer and shallower than the first version. Use the in-world
Height and Recenter controls to fit your seated or standing reach. Tray labels,
reset, photo, video, and exit are also available inside XR.
The study bench uses walnut, dark felt, restrained brass, a smaller angled
information card, and larger tray labels. Lightweight contact shading grounds
the pile without adding dynamic shadow maps. Button depth and press feedback
are visual; the established button touch planes and gesture thresholds remain
the same. Short sorting messages use category names rather than catalog slugs.
Info toggles the information card without releasing a held coin or resetting
the pile. Height cycles the existing desk offsets; Recenter fits its horizontal
position and orientation to the viewer. These desk settings and sorting progress
last for the current scene rather than being saved to the catalog.
Tap a button's face with either index fingertip to activate it, then withdraw
before tapping again. Buttons highlight on approach and flash when pressed.
Finger taps use the actual tilted surface and follow the desk when it moves.
The hand holding a coin or cupping a handful does not press buttons accidentally;
use your other hand for the controls.

Settled tray placements are compared with the catalog's selected material,
mint, or issuing authority. Green feedback indicates a matching tray; red
feedback identifies a mismatch and names the expected category. The Other tray
accepts its explicitly grouped categories. Missing metadata remains unscored.
Changing the grouping resets the pile. Your work is session-local.

## Hands, controllers, and capture

Full tracked hand meshes come from the standard WebXR input-profile assets,
hosted under `public/xr/hands/` with their license. A connected hand shape is the
fallback if a detailed mesh cannot load; joint dots are not the default visual.
Controllers use the locally hosted standard Touch Plus/Touch profiles under
`public/xr/controllers/`, including animated triggers and buttons.

Press **A on the right controller** to take a photo. Press **B** to record a
ten-second clip; press B again to stop early. Release a face button before
pressing it again. Holding it does not trigger repeated captures. Left X/Y,
trigger, and grip retain their other functions. Photo and Video buttons inside
XR provide the same capture actions while using hands.

Photos capture the application scene from your viewpoint.
Capture renders a separate mono target and encodes a PNG; it does not try to
read the headset compositor's framebuffer or capture system menus. Exit XR to
use the Save photo and Save video links. Up to sixteen photos and six videos
are stored separately in this headset browser's IndexedDB for this site. The
actual file must commit to storage before capture reports success. Page reloads
and live development refreshes rebuild download links from those stored files.
After copying them to your computer, use Clear saved captures to free capacity;
this explicit action asks before removing the headset's copies. Videos are
silent app-scene clips at 960×540 and 15 FPS,
using a browser-supported codec (preferably WebM/VP8). Leaving XR finalizes a
partial clip; closing the page cancels unfinished work while preserving already
committed files. Recording uses a
reusable capture canvas and does not request camera, microphone, or OS screen
capture access. These A/B actions do not change Meta's system screenshot controls.

The in-world capture shelf shows stored counts, recording countdown, and saved
confirmation. Success is reported only after the durable write completes.
Existing captures are preserved when capacity increases; nothing is cleared
automatically. PC transfers during USB testing use the verified export workflow
and retain the headset originals.

Quiet synthesized coin, button, sorting, and saved-capture cues use Web Audio.
The Sound control cycles Quiet, Full, and Off. Cues are rate limited and have a
small voice budget; audio failures never interrupt an interaction. Supported
controllers receive a short, gentle haptic cue on a button action. Hand models,
pinch and cupping thresholds, rigid-body physics, and fingertip activation rules
remain the interaction baseline for physical Quest regression checks.

## Code map and ownership

| Module | Responsibility |
| --- | --- |
| `CoinSortXR.jsx` | Entry permission, XR session ownership, storage hydration, durable save callbacks, and download links. |
| `createCoinSortScene.js` | Workbench composition, tracked input orchestration, sorting feedback, and GPU/resource cleanup. |
| `coinSortXRData.js` | Existing catalog adapter, recorded dimensions, asset URLs, optional original models, and labeled demo fallback. |
| `coinGeometry.js` | Conservative photo silhouette extraction and face-textured coin geometry. |
| `coinPhysics.js` | Rapier world, rigid coins, hand/cup collision surfaces, fixed-step simulation, and out-of-reach recovery. |
| `xrHands.js`, `xrCupping.js` | Hand visuals, stable pinch/release state, and cupped-palm pose estimation. |
| `xrControllers.js` | Local controller profiles and release-armed right A/B capture actions. |
| `xrButtonTouch.js` | Fingertip crossing, withdrawal, and tracking-jump rejection for each button. |
| `sceneMath.js` | Pure category grouping, recorded-detail formatting, and sorting verdicts. |
| `xrCapture.js`, `xrVideo.js` | Separate app-scene render targets, PNG encoding, and bounded silent video recording. |
| `xrMediaStore.js`, `xrMediaLimits.js` | IndexedDB transactions and shared capture capacities. |
| `xrAudio.js` | Optional synthesized cues, voice/rate limits, spatial audio, and controller pulses. |

The React page creates one engine, starts immersive mode only from an explicit
entry action, and disposes the engine on unmount or retry. The engine owns its
renderer, physics world, event listeners, textures, geometries, hand/controller
visuals, audio context, and temporary recording resources. Async model and media
callbacks must check ownership before updating a closed or replaced scene.

### Interaction invariants

- Physics positions use table-local **metres**. Catalog dimensions remain in
  **millimetres**; study scale is applied when constructing visual/physical coins.
  WebXR hand poses arrive in world space and must be converted through the desk
  transform, including after Height or Recenter.
- Every duplicate has a distinct `instanceId` for bodies and ownership. Catalog
  IDs continue to identify source records and must not be used as unique body IDs.
- Rapier remains authoritative for held and released coin poses. A handful is
  supported by transient collision surfaces, with each coin still independent.
- Keep one pinch state per input and one touch state per fingertip/button pair.
  Tracking loss, session interruption, and desk movement clear stale input state.
  A pressed control requires withdrawal before another activation.
- Cosmetic button frames and press shading must not move the touch plane.
  Sound and controller haptics are optional and must never prevent an action.
- Capture callbacks report success only after the Blob's write transaction
  commits. Temporary object URLs are replaceable views, not the saved media.
  Cleanup may revoke those URLs; it must not clear IndexedDB.

## Quest USB workflow

From the repository root, start the staging server on a fixed local port:

```sh
npm run dev -- --mode staging --host 127.0.0.1 --port 5173 --strictPort
```

With Android platform-tools available, connect the Quest and authorize debugging.
Use the serial shown as `device` by `adb devices -l`:

```sh
adb devices -l
adb -s QUEST_SERIAL reverse tcp:5173 tcp:5173
```

Open `http://localhost:5173/dev/Evidence/CoinSortXR` in Quest Browser and select
**Enter CoinSort XR**. USB reverse lets the headset use its secure localhost
context while Vite runs on the computer. Re-establish reverse forwarding after
a USB reconnection or headset reboot. Ordinary HTTP LAN addresses do not provide
the equivalent secure context.

### Copy photos and videos to the computer

Save links in the headset browser download to the headset. For a verified PC copy,
finish the current clip, keep the CoinSort XR tab open, and forward its browser
debugging socket:

```sh
adb -s QUEST_SERIAL forward tcp:58161 localabstract:chrome_devtools_remote
npm run xr:export -- --output ./output/coinsort-xr-captures
```

The Node 24 exporter reads existing records through the local USB debugging
connection. It never reloads the page, clears a record, or consumes a capture
slot. It copies original PNG/WebM/MP4 bytes into a new directory, compares the
headset and saved-file SHA-256 checksums, and writes `capture-manifest.json`.
The manifest is marked complete only after all discovered records are verified.
The default `output` directory is ignored by Git. Use `npm run xr:export -- --help` for a
different debugging port, exact page URL, or destination.

IndexedDB belongs to the browser profile and exact origin: scheme, host, and
port. Opening the app at another origin will show that origin's separate media
store. Clearing browser site data or removing saved captures removes that
headset copy. Export important captures before doing either. Leaving XR finalizes
a clip; navigating away or closing the page during an unfinished recording
discards that unfinished clip while preserving committed captures.

## Validation before a PR

```sh
npm test
npm run build
npm run build:staging -- --outDir build-staging
```

Production must omit the CoinSort XR route, navigation entry, and engine chunks.
Staging must include them and show the menu option only when immersive VR is
supported. Capability detection does not establish whether a headset is being
worn. Vite still copies the licensed `public/xr` static assets to both builds;
those assets do not enable an experience by themselves.

On a physical Quest, check single-coin pinch/rotation/release, hand scooping and
spilling, pushing the full pile, controller/hand switching, fingertip controls,
seated Height/Recenter, correct/incorrect/unscored trays, and repeated entry/exit.
Also test interruption/tracking recovery, Info and Sound controls, A/Photo,
B/Video automatic ten-second stop and early stop, capture persistence after
reload, and PC export checksums. Automated tests exercise the state and physics
boundaries; physical tracking, reach, audio balance, and frame pacing still need
headset checks.

Standard hand/controller models are vendored with their source version and MIT
notices in `public/xr/hands` and `public/xr/controllers`. Keep those notices when
updating assets. This feature needs no new backend schema or private credentials.
