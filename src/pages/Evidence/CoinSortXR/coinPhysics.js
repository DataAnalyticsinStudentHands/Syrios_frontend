import RAPIER from '@dimforge/rapier3d-compat';

export const COIN_PHYSICS_STEP = 1 / 90;
const MAX_SUBSTEPS = 4;
const ZERO = Object.freeze({ x: 0, y: 0, z: 0 });
const IDENTITY = Object.freeze({ x: 0, y: 0, z: 0, w: 1 });
const ENVIRONMENT = 1;
const COIN = 2;
const HAND = 4;
const HELD = 8;
const CUP = 16;
const groups = (membership, filter) => ((membership << 16) | filter) >>> 0;
const COIN_GROUPS = groups(COIN, ENVIRONMENT | COIN | HAND | HELD | CUP);
const HELD_GROUPS = groups(HELD, ENVIRONMENT | COIN);
const RELEASE_GROUPS = groups(COIN, ENVIRONMENT | COIN | HELD | CUP);
let initialization;

const initializeRapier = () => {
  if (!initialization) initialization = RAPIER.init().catch((cause) => {
    initialization = null;
    throw new Error('The coin physics engine could not be initialized.', { cause });
  });
  return initialization;
};

const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const vector = (value, fallback = ZERO) => ({
  x: finite(value?.x, fallback.x), y: finite(value?.y, fallback.y), z: finite(value?.z, fallback.z),
});
const quaternion = (value) => {
  const q = { ...vector(value), w: finite(value?.w, 1) };
  const length = Math.hypot(q.x, q.y, q.z, q.w);
  return length > 1e-8 ? { x: q.x / length, y: q.y / length, z: q.z / length, w: q.w / length } : { ...IDENTITY };
};
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const cappedVelocity = (value, maximum) => {
  const result = vector(value);
  const scale = Math.min(1, maximum / (Math.hypot(result.x, result.y, result.z) || 1));
  return { x: result.x * scale, y: result.y * scale, z: result.z * scale };
};
const towards = (from, to, maximum) => {
  const delta = cappedVelocity({ x: to.x - from.x, y: to.y - from.y, z: to.z - from.z }, maximum);
  return { x: from.x + delta.x, y: from.y + delta.y, z: from.z + delta.z };
};
const rotateTowards = (from, to, maximumAngle) => {
  const dot = from.x * to.x + from.y * to.y + from.z * to.z + from.w * to.w;
  const sign = dot < 0 ? -1 : 1;
  const angle = 2 * Math.acos(Math.min(1, Math.abs(dot)));
  const amount = angle > maximumAngle ? maximumAngle / angle : 1;
  return quaternion({
    x: from.x + (to.x * sign - from.x) * amount,
    y: from.y + (to.y * sign - from.y) * amount,
    z: from.z + (to.z * sign - from.z) * amount,
    w: from.w + (to.w * sign - from.w) * amount,
  });
};

/** Real rigid-body simulation in table-local metres; no DOM or Three.js objects. */
export async function createCoinPhysics({ tableHeight = 0.68, bounds, trays = [] } = {}) {
  await initializeRapier();
  const top = finite(tableHeight, 0.68);
  const table = {
    minX: finite(bounds?.minX, -0.6), maxX: finite(bounds?.maxX, 0.6),
    minZ: finite(bounds?.minZ, -0.77), maxZ: finite(bounds?.maxZ, -0.15),
  };
  if (table.maxX <= table.minX || table.maxZ <= table.minZ) throw new Error('Invalid coin table bounds.');
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = COIN_PHYSICS_STEP;
  world.integrationParameters.lengthUnit = 0.1;
  world.integrationParameters.normalizedAllowedLinearError = 0.0005;
  world.integrationParameters.normalizedPredictionDistance = 0.01;
  world.integrationParameters.numSolverIterations = 8;
  world.integrationParameters.numInternalPgsIterations = 1;
  world.integrationParameters.maxCcdSubsteps = 2;
  const coins = new Map();
  const hands = new Map();
  const cups = new Map();
  const cupColliderHandles = new Set();
  const coinColliderRecords = new Map();
  const cupSupportCache = new Map();
  const trayFloors = [];
  let accumulator = 0;
  let disposed = false;

  const fixedBox = (x, y, z, halfWidth, halfHeight, halfDepth) => world.createCollider(
    RAPIER.ColliderDesc.cuboid(halfWidth, halfHeight, halfDepth)
      .setTranslation(x, y, z).setFriction(0.72).setRestitution(0.025)
      .setCollisionGroups(groups(ENVIRONMENT, COIN | HELD)),
  );
  fixedBox((table.minX + table.maxX) / 2, top - 0.035, (table.minZ + table.maxZ) / 2,
    (table.maxX - table.minX) / 2, 0.035, (table.maxZ - table.minZ) / 2);
  for (const tray of trays) {
    if (![tray.x, tray.z, tray.width, tray.depth].every(Number.isFinite) || tray.width <= 0 || tray.depth <= 0) continue;
    const floor = { ...tray, floorY: top + 0.012, enabled: tray.enabled !== false, colliders: [] };
    trayFloors.push(floor);
    floor.colliders.push(fixedBox(tray.x, top + 0.006, tray.z, tray.width / 2, 0.006, tray.depth / 2));
    const rim = 0.005;
    const wallY = floor.floorY + 0.0125;
    floor.colliders.push(fixedBox(tray.x - tray.width / 2 + rim / 2, wallY, tray.z, rim / 2, 0.0125, tray.depth / 2));
    floor.colliders.push(fixedBox(tray.x + tray.width / 2 - rim / 2, wallY, tray.z, rim / 2, 0.0125, tray.depth / 2));
    floor.colliders.push(fixedBox(tray.x, wallY, tray.z - tray.depth / 2 + rim / 2, tray.width / 2, 0.0125, rim / 2));
    floor.colliders.push(fixedBox(tray.x, wallY, tray.z + tray.depth / 2 - rim / 2, tray.width / 2, 0.0125, rim / 2));
    if (!floor.enabled) floor.colliders.forEach((collider) => collider.setEnabled(false));
  }

  // Vertical extent of a freely rotated cylinder, rather than forcing it flat.
  const extentY = (coin, rotation) => {
    const upY = clamp(1 - 2 * (rotation.x ** 2 + rotation.z ** 2), -1, 1);
    return Math.abs(upY) * coin.thickness / 2 + Math.sqrt(Math.max(0, 1 - upY * upY)) * coin.radius;
  };
  const aboveSurface = (coin, position, rotation) => {
    const target = vector(position, coin.home || { x: 0, y: top + 0.1, z: (table.minZ + table.maxZ) / 2 });
    let surfaceY = top;
    for (const tray of trayFloors) {
      if (!tray.enabled) continue;
      if (Math.abs(target.x - tray.x) < tray.width / 2 + coin.radius
        && Math.abs(target.z - tray.z) < tray.depth / 2 + coin.radius) surfaceY = Math.max(surfaceY, tray.floorY);
    }
    // Only protect the solid table footprint; a hand can still lift coins toward
    // the viewer, and loose coins can naturally fall off its edge.
    if (target.x > table.minX - coin.radius && target.x < table.maxX + coin.radius
      && target.z > table.minZ - coin.radius && target.z < table.maxZ + coin.radius) {
      target.y = Math.max(target.y, surfaceY + extentY(coin, rotation) + 0.0002);
    }
    return target;
  };

  const resetBody = (coin, position, rotation) => {
    const normalized = quaternion(rotation);
    coin.held = false;
    coin.handGrace = 0;
    coin.targetPosition = null;
    coin.targetRotation = null;
    coin.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    coin.collider.setCollisionGroups(COIN_GROUPS);
    coin.body.setTranslation(aboveSurface(coin, position, normalized), true);
    coin.body.setRotation(normalized, true);
    coin.body.setLinvel(ZERO, true);
    coin.body.setAngvel(ZERO, true);
    coin.body.resetForces(true);
    coin.body.resetTorques(true);
  };

  const cupColliders = (cup, width, depth, curl) => {
    const colliders = [];
    const roundedBox = (hx, hy, hz, bevel, x, y, z) => {
      const collider = world.createCollider(RAPIER.ColliderDesc.roundCuboid(hx - bevel, hy - bevel, hz - bevel, bevel)
        .setTranslation(x, y, z).setFriction(0.85).setRestitution(0)
        .setContactSkin(0.00005).setCollisionGroups(groups(CUP, cup.grace > 0 ? 0 : COIN)), cup.body);
      colliders.push(collider);
      cupColliderHandles.add(collider.handle);
      return collider;
    };
    // Local +Y is the palm surface and +Z points towards the fingers. Coins
    // remain dynamic on the palm; the open -Z wrist side provides a pour lip.
    roundedBox(width * 0.48, 0.004, depth * 0.45, 0.002, 0, -0.004, 0);
    const height = 0.006 + curl * 0.04;
    const walls = [
      roundedBox(0.003, height / 2, depth * 0.4, 0.001, -width * 0.475, height / 2, depth * 0.05),
      roundedBox(0.003, height / 2, depth * 0.4, 0.001, width * 0.475, height / 2, depth * 0.05),
      roundedBox(width * 0.235, height / 2, 0.003, 0.001, -width * 0.235, height / 2, depth * 0.44),
      roundedBox(width * 0.235, height / 2, 0.003, 0.001, width * 0.235, height / 2, depth * 0.44),
    ];
    walls.forEach((collider) => collider.setEnabled(curl >= 0.2));
    return colliders;
  };

  const actuallyTouching = (first, second) => {
    let touching = false;
    world.contactPair(first, second, (manifold) => {
      // Geometric contacts remain available when a supported coin sleeps;
      // solver contacts can be absent for an inactive island. Rapier's contact
      // prediction/rounded-shape margin can leave a small positive distance
      // while the pair is actively transferring a supporting impulse.
      for (let index = 0; index < manifold.numContacts(); index += 1) {
        if (manifold.contactImpulse(index) > 1e-8 || manifold.contactDist(index) <= 0.00015) {
          touching = true;
          break;
        }
      }
    });
    return touching;
  };

  const api = {
    setTrayEnabled(index, enabled) {
      const tray = !disposed && trayFloors[index];
      if (!tray) return false;
      const next = Boolean(enabled);
      if (tray.enabled === next) return true;
      tray.enabled = next;
      tray.colliders.forEach((collider) => collider.setEnabled(next));
      // A sleeping coin formerly supported by the base must be allowed to fall
      // onto the visible workbench after that tray is hidden.
      for (const coin of coins.values()) if (!coin.held) coin.body.wakeUp();
      return true;
    },

    addCoin(id, { radius = 0.025, thickness = 0.003, position, quaternion: rotation } = {}) {
      if (disposed) throw new Error('Coin physics is disposed.');
      if (coins.has(id)) {
        coinColliderRecords.delete(coins.get(id).collider.handle);
        world.removeRigidBody(coins.get(id).body);
      }
      cupSupportCache.clear();
      const coin = {
        radius: clamp(finite(radius, 0.025), 0.004, 0.15),
        thickness: clamp(finite(thickness, 0.003), 0.0008, 0.1),
        held: false, handGrace: 0, recoveryCount: 0,
      };
      coin.homeRotation = quaternion(rotation);
      coin.home = aboveSurface(coin, position, coin.homeRotation);
      coin.body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(coin.home.x, coin.home.y, coin.home.z).setRotation(coin.homeRotation)
        .setCanSleep(true).setCcdEnabled(true).setSoftCcdPrediction(coin.thickness)
        .setLinearDamping(0.3).setAngularDamping(0.5));
      // A microscopic edge bevel gives Rapier stable face contacts when a
      // reset/held coin is exactly axial. A sharp cylinder can otherwise lose
      // its cap contact after a zero-tilt reset in the current engine version.
      // Subtract the bevel from the core to preserve the requested dimensions.
      const bevel = 0.00005;
      coin.collider = world.createCollider(RAPIER.ColliderDesc.roundCylinder(coin.thickness / 2 - bevel, coin.radius - bevel, bevel)
        .setDensity(6500).setFriction(0.6).setRestitution(0.04)
        .setContactSkin(0.00005).setCollisionGroups(COIN_GROUPS), coin.body);
      coins.set(id, coin);
      coinColliderRecords.set(coin.collider.handle, coin);
      return api.getPose(id);
    },

    isCupSupported(id) {
      const coin = !disposed && coins.get(id);
      if (!coin || coin.held || !cupColliderHandles.size) return false;
      if (cupSupportCache.has(coin)) return cupSupportCache.get(coin);
      // Follow actual touching loose-coin contacts too, so an upper coin in a
      // handful is not scored as deposited merely because it misses the palm.
      // Cache the whole connected component until the next engine step.
      const component = [coin];
      const seen = new Set([coin]);
      let supported = false;
      for (let index = 0; index < component.length; index += 1) {
        const current = component[index];
        world.contactPairsWith(current.collider, (otherCollider) => {
          const other = coinColliderRecords.get(otherCollider.handle);
          if (!cupColliderHandles.has(otherCollider.handle) && (!other || other.held || seen.has(other))) return;
          if (!actuallyTouching(current.collider, otherCollider)) return;
          if (cupColliderHandles.has(otherCollider.handle)) supported = true;
          else { seen.add(other); component.push(other); }
        });
      }
      component.forEach((member) => cupSupportCache.set(member, supported));
      return supported;
    },

    getPose(id) {
      const coin = !disposed && coins.get(id);
      if (!coin) return null;
      return {
        position: { ...coin.body.translation() }, quaternion: { ...coin.body.rotation() },
        linearVelocity: { ...coin.body.linvel() }, angularVelocity: { ...coin.body.angvel() },
        sleeping: coin.body.isSleeping(), recoveryCount: coin.recoveryCount,
      };
    },

    grab(id) {
      const coin = !disposed && coins.get(id);
      if (!coin || coin.held) return false;
      coin.held = true;
      cupSupportCache.clear();
      coin.targetPosition = { ...coin.body.translation() };
      coin.targetRotation = { ...coin.body.rotation() };
      coin.body.setLinvel(ZERO, true);
      coin.body.setAngvel(ZERO, true);
      coin.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
      coin.collider.setCollisionGroups(HELD_GROUPS);
      return true;
    },

    moveHeld(id, position, rotation) {
      const coin = !disposed && coins.get(id);
      if (!coin?.held) return false;
      coin.targetRotation = quaternion(rotation);
      coin.targetPosition = aboveSurface(coin, position, coin.targetRotation);
      return true;
    },

    release(id, { linearVelocity = ZERO, angularVelocity = ZERO } = {}) {
      const coin = !disposed && coins.get(id);
      if (!coin?.held) return false;
      coin.held = false;
      cupSupportCache.clear();
      coin.handGrace = 0.12;
      const rotation = coin.body.rotation();
      coin.body.setTranslation(aboveSurface(coin, coin.body.translation(), rotation), true);
      coin.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
      coin.collider.setCollisionGroups(RELEASE_GROUPS);
      coin.body.setLinvel(cappedVelocity(linearVelocity, 1.5), true);
      coin.body.setAngvel(cappedVelocity(angularVelocity, 8), true);
      return true;
    },

    updateHand(inputId, samples = []) {
      if (disposed) return;
      if (cups.has(inputId)) return;
      const valid = samples.filter((sample) => sample?.position
        && [sample.position.x, sample.position.y, sample.position.z].every(Number.isFinite)).slice(0, 6);
      if (!valid.length) return api.removeHand(inputId);
      let hand = hands.get(inputId);
      if (!hand) { hand = { age: 0, points: [] }; hands.set(inputId, hand); }
      hand.age = 0;
      while (hand.points.length > valid.length) world.removeRigidBody(hand.points.pop().body);
      valid.forEach((sample, index) => {
        const target = vector(sample.position);
        let point = hand.points[index];
        if (point && distance(point.body.translation(), target) > 0.22) {
          world.removeRigidBody(point.body);
          hand.points[index] = null;
          point = null;
        }
        if (!point) {
          const radius = clamp(finite(sample.radius, 0.012), 0.005, 0.04);
          const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased()
            .setTranslation(target.x, target.y, target.z).setCcdEnabled(true));
          const collider = world.createCollider(RAPIER.ColliderDesc.ball(radius).setFriction(0.4)
            .setRestitution(0).setCollisionGroups(groups(HAND, 0)), body);
          point = { body, collider, grace: 2 * COIN_PHYSICS_STEP };
          hand.points[index] = point;
        }
        point.target = target;
      });
    },

    removeHand(inputId) {
      const hand = !disposed && hands.get(inputId);
      if (!hand) return;
      hand.points.forEach((point) => world.removeRigidBody(point.body));
      hands.delete(inputId);
    },

    updateCup(inputId, pose) {
      if (disposed) return false;
      if (!pose?.position || ![pose.position.x, pose.position.y, pose.position.z].every(Number.isFinite)) {
        api.removeCup(inputId);
        return false;
      }
      api.removeHand(inputId);
      const target = vector(pose.position);
      const rotation = quaternion(pose.quaternion);
      const width = clamp(finite(pose.width, 0.1), 0.06, 0.2);
      const depth = clamp(finite(pose.depth, 0.12), 0.07, 0.22);
      const curl = clamp(finite(pose.curl, 0), 0, 1);
      let cup = cups.get(inputId);
      if (cup && distance(cup.body.translation(), target) > 0.24) {
        // Tracking reacquisition must not sweep an invisible bowl across coins.
        api.removeCup(inputId);
        cup = null;
      }
      if (!cup) {
        const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased()
          .setTranslation(target.x, target.y, target.z).setRotation(rotation).setCcdEnabled(true));
        cup = { body, age: 0, grace: 2 * COIN_PHYSICS_STEP, width, depth, curl };
        cup.colliders = cupColliders(cup, width, depth, curl);
        cups.set(inputId, cup);
        cupSupportCache.clear();
      } else if (Math.abs(width - cup.width) > 0.008 || Math.abs(depth - cup.depth) > 0.008
        || Math.abs(curl - cup.curl) > 0.1 || (curl >= 0.2) !== (cup.curl >= 0.2)) {
        cup.colliders.forEach((collider) => {
          cupColliderHandles.delete(collider.handle);
          world.removeCollider(collider, true);
        });
        cup.colliders = cupColliders(cup, width, depth, curl);
        cupSupportCache.clear();
        cup.width = width;
        cup.depth = depth;
        cup.curl = curl;
      }
      cup.age = 0;
      cup.targetPosition = target;
      cup.targetRotation = rotation;
      return true;
    },

    removeCup(inputId) {
      const cup = !disposed && cups.get(inputId);
      if (!cup) return false;
      cup.colliders.forEach((collider) => cupColliderHandles.delete(collider.handle));
      world.removeRigidBody(cup.body);
      cups.delete(inputId);
      cupSupportCache.clear();
      for (const coin of coins.values()) if (!coin.held) coin.body.wakeUp();
      return true;
    },

    step(dt) {
      if (disposed || !Number.isFinite(dt) || dt <= 0) return;
      accumulator = Math.min(accumulator + dt, COIN_PHYSICS_STEP * MAX_SUBSTEPS);
      for (let count = 0; count < MAX_SUBSTEPS && accumulator + 1e-10 >= COIN_PHYSICS_STEP; count += 1) {
        for (const [id, cup] of cups) {
          cup.age += COIN_PHYSICS_STEP;
          if (cup.age > 0.18) { api.removeCup(id); continue; }
          cup.grace -= COIN_PHYSICS_STEP;
          if (cup.grace <= 0) cup.colliders.forEach((collider) => collider.setCollisionGroups(groups(CUP, COIN)));
          cup.body.setNextKinematicTranslation(towards(cup.body.translation(), cup.targetPosition, COIN_PHYSICS_STEP));
          cup.body.setNextKinematicRotation(rotateTowards(cup.body.rotation(), cup.targetRotation, 6 * COIN_PHYSICS_STEP));
        }
        for (const [id, hand] of hands) {
          hand.age += COIN_PHYSICS_STEP;
          if (hand.age > 0.18) { api.removeHand(id); continue; }
          hand.points.forEach((point) => {
            point.grace -= COIN_PHYSICS_STEP;
            if (point.grace <= 0) point.collider.setCollisionGroups(groups(HAND, COIN));
            point.body.setNextKinematicTranslation(towards(point.body.translation(), point.target, 1.4 * COIN_PHYSICS_STEP));
          });
        }
        for (const coin of coins.values()) {
          if (coin.held) {
            const nextRotation = rotateTowards(coin.body.rotation(), coin.targetRotation, 10 * COIN_PHYSICS_STEP);
            const nextPosition = aboveSurface(coin,
              towards(coin.body.translation(), coin.targetPosition, 2 * COIN_PHYSICS_STEP), nextRotation);
            coin.body.setNextKinematicTranslation(nextPosition);
            coin.body.setNextKinematicRotation(nextRotation);
          } else if (coin.handGrace > 0) {
            coin.handGrace -= COIN_PHYSICS_STEP;
            if (coin.handGrace <= 0) coin.collider.setCollisionGroups(COIN_GROUPS);
          }
        }
        world.step();
        cupSupportCache.clear();
        for (const coin of coins.values()) {
          if (coin.held) continue;
          const position = coin.body.translation();
          if (![position.x, position.y, position.z].every(Number.isFinite)
            || position.y < top - 0.3 || position.y > top + 3
            || position.x < table.minX - 0.4 || position.x > table.maxX + 0.4
            || position.z < table.minZ - 0.4 || position.z > table.maxZ + 0.4) {
            const home = { ...coin.home, y: Math.max(coin.home.y, top + 0.15) };
            resetBody(coin, home, coin.homeRotation);
            coin.recoveryCount += 1;
          }
        }
        accumulator -= COIN_PHYSICS_STEP;
      }
    },

    resetCoin(id, position, rotation = IDENTITY) {
      const coin = !disposed && coins.get(id);
      if (!coin) return false;
      resetBody(coin, position, rotation);
      cupSupportCache.clear();
      return true;
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      coins.clear();
      hands.clear();
      cups.clear();
      cupColliderHandles.clear();
      coinColliderRecords.clear();
      cupSupportCache.clear();
      world.free();
    },
  };
  return api;
}
