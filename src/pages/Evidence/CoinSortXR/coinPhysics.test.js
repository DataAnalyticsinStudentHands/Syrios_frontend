import { afterEach, describe, expect, it } from 'vitest';
import { COIN_PHYSICS_STEP, createCoinPhysics } from './coinPhysics';

const TOP = 0.68;
const worlds = [];
const create = async (options = {}) => {
  const physics = await createCoinPhysics({
    tableHeight: TOP, bounds: { minX: -0.6, maxX: 0.6, minZ: -0.6, maxZ: 0.6 }, ...options,
  });
  worlds.push(physics);
  return physics;
};
const add = (physics, id = 'coin', overrides = {}) => physics.addCoin(id, {
  radius: 0.025, thickness: 0.004, position: { x: 0, y: TOP + 0.15, z: 0 },
  quaternion: { x: 0, y: 0, z: 0, w: 1 }, ...overrides,
});
const simulate = (physics, seconds) => {
  for (let index = 0; index < Math.ceil(seconds / COIN_PHYSICS_STEP); index += 1) physics.step(COIN_PHYSICS_STEP);
};

afterEach(() => { worlds.splice(0).forEach((physics) => physics.dispose()); });

describe('real coin rigid-body simulation', () => {
  it('falls under gravity, rests on the solid table, and sleeps', async () => {
    const physics = await create();
    add(physics);
    simulate(physics, 4);
    const pose = physics.getPose('coin');
    expect(pose.position.y).toBeGreaterThanOrEqual(TOP + 0.0015);
    expect(pose.position.y).toBeLessThan(TOP + 0.003);
    expect(Math.hypot(...Object.values(pose.linearVelocity))).toBeLessThan(0.005);
    expect(pose.sleeping).toBe(true);
  });

  it('supports physical stacks of 96 coins without falling through the table', async () => {
    const physics = await create();
    for (let index = 0; index < 96; index += 1) {
      const local = index % 48;
      add(physics, String(index), {
        radius: 0.017,
        position: { x: (local % 8 - 3.5) * 0.04, y: TOP + 0.04 + Math.floor(index / 48) * 0.012, z: (Math.floor(local / 8) - 2.5) * 0.04 },
      });
    }
    simulate(physics, 5);
    const poses = Array.from({ length: 96 }, (_, index) => physics.getPose(String(index)));
    expect(poses.every((pose) => Object.values(pose.position).every(Number.isFinite))).toBe(true);
    expect(poses.every((pose) => pose.position.y >= TOP + 0.001 && pose.position.y < TOP + 0.03)).toBe(true);
    expect(poses.filter((pose) => pose.sleeping).length).toBeGreaterThan(80);
    expect(poses.every((pose) => pose.recoveryCount === 0)).toBe(true);
    // Upper coins retain distinct physical support instead of occupying the
    // same table plane as the lower layer.
    expect(Math.max(...poses.map((pose) => pose.position.y)) - Math.min(...poses.map((pose) => pose.position.y))).toBeGreaterThan(0.003);
  });

  it('settles a dense, mixed-size 96-coin pile on the compact scene workbench', async () => {
    const physics = await create({
      bounds: { minX: -0.6, maxX: 0.6, minZ: -0.77, maxZ: -0.15 },
      trays: [
        { x: 0.22, z: -0.32, width: 0.21, depth: 0.22 },
        { x: 0.46, z: -0.32, width: 0.21, depth: 0.22 },
        { x: 0.22, z: -0.59, width: 0.21, depth: 0.22 },
        { x: 0.46, z: -0.59, width: 0.21, depth: 0.22 },
      ],
    });
    for (let index = 0; index < 96; index += 1) {
      // Same 16-cell/six-layer home pattern and XYZ tilt as the scene,
      // deliberately mixing diameters that initially overlap their neighbours.
      const localIndex = index % 16;
      const radius = 0.017 + (index % 9) * 0.003;
      const thickness = 0.0025 + (index % 7) * 0.0007;
      const xAngle = (index % 3 - 1) * 0.065;
      const yAngle = index * Math.PI * (3 - Math.sqrt(5));
      const zAngle = (index % 5 - 2) * 0.035;
      const sx = Math.sin(xAngle / 2), cx = Math.cos(xAngle / 2);
      const sy = Math.sin(yAngle / 2), cy = Math.cos(yAngle / 2);
      const sz = Math.sin(zAngle / 2), cz = Math.cos(zAngle / 2);
      add(physics, String(index), {
        radius, thickness,
        position: {
          x: -0.43 + (localIndex % 4) * 0.075,
          y: TOP + thickness / 2 + 0.025 + Math.floor(index / 16) * 0.015,
          z: -0.61 + Math.floor(localIndex / 4) * 0.08,
        },
        quaternion: {
          x: sx * cy * cz + cx * sy * sz, y: cx * sy * cz - sx * cy * sz,
          z: cx * cy * sz + sx * sy * cz, w: cx * cy * cz - sx * sy * sz,
        },
      });
    }
    simulate(physics, 8);
    const poses = Array.from({ length: 96 }, (_, index) => physics.getPose(String(index)));
    const speeds = poses.map((pose) => Math.hypot(...Object.values(pose.linearVelocity)));
    const resting = poses.filter((pose, index) => pose.position.y >= TOP - 0.001
      && pose.position.y < TOP + 0.12 && speeds[index] < 0.025);
    expect(poses.every((pose) => [...Object.values(pose.position), ...Object.values(pose.quaternion)].every(Number.isFinite))).toBe(true);
    expect(resting.length).toBeGreaterThanOrEqual(90);
    expect(Math.max(...speeds)).toBeLessThan(0.08);
    expect(poses.reduce((total, pose) => total + pose.recoveryCount, 0)).toBeLessThanOrEqual(2);
    expect(poses.every((pose) => pose.position.y >= TOP - 0.001)).toBe(true);
    expect(poses.filter((pose) => pose.sleeping).length).toBeGreaterThanOrEqual(80);
  });

  it('receives a lateral shove from a tracked hand sphere', async () => {
    const physics = await create();
    add(physics);
    simulate(physics, 2);
    const before = physics.getPose('coin').position.x;
    for (let index = 0; index < 90; index += 1) {
      physics.updateHand('left', [{ position: { x: -0.09 + index * 0.0018, y: TOP + 0.006, z: 0 }, radius: 0.017 }]);
      physics.step(COIN_PHYSICS_STEP);
    }
    physics.removeHand('left');
    expect(physics.getPose('coin').position.x).toBeGreaterThan(before + 0.025);
    expect(physics.getPose('coin').recoveryCount).toBe(0);
  });

  it('holds a freely rotated coin kinematically and caps release speed', async () => {
    const physics = await create();
    add(physics);
    expect(physics.grab('coin')).toBe(true);
    expect(physics.grab('coin')).toBe(false);
    const target = { x: 0.1, y: TOP + 0.22, z: 0.08 };
    const rotation = { x: Math.sin(Math.PI / 8), y: 0, z: 0, w: Math.cos(Math.PI / 8) };
    physics.moveHeld('coin', target, rotation);
    simulate(physics, 0.4);
    expect(physics.getPose('coin').position).toEqual(expect.objectContaining({
      x: expect.closeTo(target.x, 4), y: expect.closeTo(target.y, 4), z: expect.closeTo(target.z, 4),
    }));
    expect(physics.getPose('coin').quaternion.x).toBeCloseTo(rotation.x, 4);
    expect(physics.release('coin', { linearVelocity: { x: 100, y: 100, z: 100 }, angularVelocity: { x: 100, y: 100, z: 100 } })).toBe(true);
    const released = physics.getPose('coin');
    expect(Math.hypot(...Object.values(released.linearVelocity))).toBeLessThanOrEqual(1.500001);
    expect(Math.hypot(...Object.values(released.angularVelocity))).toBeLessThanOrEqual(8.000001);
    expect(physics.release('coin')).toBe(false);
  });

  it('protects held coins from hand colliders and table interpenetration', async () => {
    const physics = await create();
    add(physics);
    physics.grab('coin');
    physics.moveHeld('coin', { x: 0, y: TOP - 0.2, z: 0 }, { x: 0, y: 0, z: Math.SQRT1_2, w: Math.SQRT1_2 });
    for (let index = 0; index < 90; index += 1) {
      physics.updateHand('left', [{ position: { x: -0.08 + index * 0.0015, y: TOP + 0.02, z: 0 }, radius: 0.025 }]);
      physics.step(COIN_PHYSICS_STEP);
    }
    const pose = physics.getPose('coin');
    expect(pose.position.x).toBeCloseTo(0, 4);
    expect(pose.position.y).toBeGreaterThanOrEqual(TOP + 0.0249);
    expect(Math.abs(pose.quaternion.z)).toBeCloseTo(Math.SQRT1_2, 3);
  });

  it('rests inside the raised tray floor and is contained by its rims', async () => {
    const physics = await create({ trays: [{ x: 0, z: 0, width: 0.21, depth: 0.22 }] });
    add(physics);
    physics.grab('coin');
    physics.release('coin', { linearVelocity: { x: 0.35, y: 0, z: 0 } });
    simulate(physics, 4);
    const pose = physics.getPose('coin');
    expect(pose.position.y).toBeGreaterThan(TOP + 0.0135);
    expect(pose.position.y).toBeLessThan(TOP + 0.016);
    expect(Math.abs(pose.position.x)).toBeLessThan(0.105);
  });

  it('removes hidden tray support and rims without leaving sleeping coins suspended', async () => {
    const physics = await create({ trays: [{ x: 0, z: 0, width: 0.21, depth: 0.22 }] });
    add(physics);
    simulate(physics, 3);
    expect(physics.getPose('coin').sleeping).toBe(true);
    expect(physics.getPose('coin').position.y).toBeGreaterThan(TOP + 0.0135);
    expect(physics.setTrayEnabled(0, false)).toBe(true);
    simulate(physics, 3);
    expect(physics.getPose('coin').position.y).toBeLessThan(TOP + 0.003);
    expect(physics.getPose('coin').position.y).toBeGreaterThan(TOP + 0.0015);
    // Release-level table protection must ignore the disabled raised base too.
    physics.grab('coin');
    physics.moveHeld('coin', { x: 0, y: TOP - 0.1, z: 0 }, { x: 0, y: 0, z: 0, w: 1 });
    simulate(physics, 0.1);
    physics.release('coin', { linearVelocity: { x: 1.5, y: 0, z: 0 } });
    simulate(physics, 0.6);
    expect(physics.getPose('coin').position.x).toBeGreaterThan(0.12);
    expect(physics.getPose('coin').position.y).toBeLessThan(TOP + 0.003);
    expect(physics.setTrayEnabled(9, false)).toBe(false);
    physics.setTrayEnabled(0, true);
    physics.resetCoin('coin', { x: 0, y: TOP + 0.1, z: 0 });
    simulate(physics, 3);
    expect(physics.getPose('coin').position.y).toBeGreaterThan(TOP + 0.0135);
  });

  it('resets velocity, preserves requested rotation, and recovers fallen outliers', async () => {
    const physics = await create();
    add(physics);
    physics.grab('coin');
    physics.release('coin', { linearVelocity: { x: 1, y: 1, z: 1 } });
    const rotation = { x: 0, y: Math.SQRT1_2, z: 0, w: Math.SQRT1_2 };
    physics.resetCoin('coin', { x: 0.1, y: TOP + 0.03, z: 0.1 }, rotation);
    expect(physics.getPose('coin').linearVelocity).toEqual({ x: 0, y: 0, z: 0 });
    expect(physics.getPose('coin').quaternion.y).toBeCloseTo(rotation.y, 5);
    physics.resetCoin('coin', { x: 4, y: TOP - 1, z: 0 }, rotation);
    physics.step(COIN_PHYSICS_STEP);
    const recovered = physics.getPose('coin');
    expect(recovered.recoveryCount).toBe(1);
    expect(recovered.position.x).toBeCloseTo(0, 4);
    expect(recovered.position.y).toBeGreaterThan(TOP);
  });

  it('bounds catch-up work after a long frame and ignores invalid delta values', async () => {
    const physics = await create();
    add(physics, 'coin', { position: { x: 0, y: TOP + 0.5, z: 0 } });
    physics.step(NaN);
    physics.step(-1);
    physics.step(0);
    physics.step(20);
    expect(physics.getPose('coin').position.y).toBeGreaterThan(TOP + 0.47);
  });

  const cupFrame = (physics, pose, seconds) => {
    for (let index = 0; index < Math.ceil(seconds / COIN_PHYSICS_STEP); index += 1) {
      physics.updateCup('palm', pose);
      physics.step(COIN_PHYSICS_STEP);
    }
  };
  const loadedCup = async () => {
    const physics = await create();
    const pose = {
      position: { x: 0, y: TOP + 0.04, z: 0 }, quaternion: { x: 0, y: 0, z: 0, w: 1 },
      width: 0.18, depth: 0.18, curl: 0.7,
    };
    physics.updateCup('palm', pose);
    for (let index = 0; index < 6; index += 1) {
      add(physics, `loose-${index}`, {
        radius: 0.014, thickness: 0.004,
        position: { x: index % 2 === 0 ? -0.023 : 0.023, y: TOP + 0.065, z: (Math.floor(index / 2) - 1) * 0.035 },
      });
    }
    cupFrame(physics, pose, 0.7);
    for (let index = 1; index <= 90; index += 1) {
      physics.updateCup('palm', { ...pose, position: { ...pose.position, y: TOP + 0.04 + index / 90 * 0.2 } });
      physics.step(COIN_PHYSICS_STEP);
    }
    pose.position.y = TOP + 0.24;
    cupFrame(physics, pose, 0.3);
    return { physics, pose };
  };
  const cupCoinPoses = (physics) => Array.from({ length: 6 }, (_, index) => physics.getPose(`loose-${index}`));

  it('lifts several individually dynamic coins on a cupped palm and pours them out by tilting', async () => {
    const { physics, pose } = await loadedCup();
    const lifted = cupCoinPoses(physics);
    expect(lifted.filter((coin) => coin.position.y > TOP + 0.2).length).toBe(6);
    expect(Array.from({ length: 6 }, (_, index) => physics.isCupSupported(`loose-${index}`))).toEqual(Array(6).fill(true));
    // Pour towards the open wrist edge; no grab(), attachment, or per-coin
    // repositioning occurs anywhere in this fixture.
    for (let index = 1; index <= 90; index += 1) {
      const halfAngle = -70 * Math.PI / 180 / 2 * index / 90;
      pose.quaternion = { x: Math.sin(halfAngle), y: 0, z: 0, w: Math.cos(halfAngle) };
      physics.updateCup('palm', pose);
      physics.step(COIN_PHYSICS_STEP);
    }
    cupFrame(physics, pose, 2);
    const spilled = cupCoinPoses(physics);
    expect(spilled.filter((coin) => coin.position.y < TOP + 0.05).length).toBe(6);
    expect(Array.from({ length: 6 }, (_, index) => physics.isCupSupported(`loose-${index}`))).toEqual(Array(6).fill(false));
    expect(spilled.every((coin) => coin.recoveryCount === 0)).toBe(true);
    expect(spilled.every((coin) => Object.values(coin.position).every(Number.isFinite))).toBe(true);
    expect(Math.max(...spilled.map((coin) => Math.hypot(...Object.values(coin.linearVelocity))))).toBeLessThan(0.1);
  });

  it.each(['open-hand removal', 'tracking timeout'])('lets loose coins fall when the physical cup disappears: %s', async (reason) => {
    const { physics } = await loadedCup();
    expect(cupCoinPoses(physics).every((coin) => coin.position.y > TOP + 0.2)).toBe(true);
    if (reason === 'open-hand removal') expect(physics.removeCup('palm')).toBe(true);
    // With no fresh pose, tracking timeout removes the physical bowl as well.
    simulate(physics, 2);
    expect(physics.removeCup('palm')).toBe(false);
    expect(Array.from({ length: 6 }, (_, index) => physics.isCupSupported(`loose-${index}`))).toEqual(Array(6).fill(false));
    const fallen = cupCoinPoses(physics);
    expect(fallen.every((coin) => coin.position.y < TOP + 0.01 && coin.position.y >= TOP + 0.0015)).toBe(true);
    expect(fallen.every((coin) => coin.recoveryCount === 0)).toBe(true);
    expect(fallen.every((coin) => Object.values(coin.linearVelocity).every(Number.isFinite))).toBe(true);
  });

  it('recognizes indirect support through a loose coin stack and clears rebuilt cup handles', async () => {
    const { physics, pose } = await loadedCup();
    const lower = physics.getPose('loose-0').position;
    add(physics, 'upper-coin', {
      radius: 0.006, thickness: 0.003,
      position: { x: lower.x, y: lower.y + 0.015, z: lower.z },
    });
    cupFrame(physics, pose, 1);
    expect(physics.getPose('upper-coin').position.y).toBeGreaterThan(physics.getPose('loose-0').position.y + 0.002);
    expect(physics.isCupSupported('upper-coin')).toBe(true);
    pose.width = 0.16; // Rebuild the proxy colliders while keeping the same palm.
    cupFrame(physics, pose, 0.4);
    expect(physics.isCupSupported('upper-coin')).toBe(true);
    physics.removeCup('palm');
    expect(physics.isCupSupported('upper-coin')).toBe(false);
    expect(physics.isCupSupported('missing')).toBe(false);
  });

  it('removes inactive hands and permits idempotent disposal with no stale WASM reads', async () => {
    const physics = await create();
    add(physics);
    physics.updateHand('left', [{ position: { x: 0, y: TOP + 0.1, z: 0 }, radius: 0.012 }]);
    simulate(physics, 0.3);
    physics.removeHand('left');
    physics.updateHand('left', []);
    expect(physics.getPose('missing')).toBeNull();
    physics.dispose();
    expect(() => physics.dispose()).not.toThrow();
    expect(physics.getPose('coin')).toBeNull();
    expect(() => physics.step(1)).not.toThrow();
    expect(() => physics.addCoin('new')).toThrow('disposed');
  });
});
