import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { createCoinGeometry, extractCoinProfile } from './coinGeometry';

const image = ({ width = 96, height = 96, background = [0, 0, 0, 0], inside, color = () => [137, 99, 54, 255] } = {}) => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      data.set(inside?.(x, y) ? color(x, y) : background, (y * width + x) * 4);
    }
  }
  return { data, width, height };
};

const ellipse = (x, y) => ((x - 47.5) / 31) ** 2 + ((y - 47.5) / 23) ** 2 <= 1;
const irregular = (x, y) => {
  const dx = x - 47.5;
  const dy = y - 47.5;
  const angle = Math.atan2(dy, dx);
  return Math.hypot(dx, dy) <= 26 * (1 + 0.16 * Math.cos(angle * 3) + 0.05 * Math.sin(angle * 5));
};

describe('photographic coin outline extraction', () => {
  it('extracts a transparent ellipse using source pixel coordinates and inclusive bounds', () => {
    const source = image({ inside: ellipse });
    const before = source.data.slice();
    const profile = extractCoinProfile(source);

    expect(profile.source).toBe('alpha');
    expect(profile.points).toHaveLength(64);
    expect(profile.mask).toBeInstanceOf(Uint8Array);
    expect(profile.mask).toHaveLength(96 * 96);
    expect(profile.mask[48 * 96 + 48]).toBe(1);
    expect(profile.mask[0]).toBe(0);
    expect(profile.center.x).toBeCloseTo(47.5);
    expect(profile.center.y).toBeCloseTo(47.5);
    expect(profile.bounds.maxX - profile.bounds.minX).toBeGreaterThan(profile.bounds.maxY - profile.bounds.minY);
    expect(source.data).toEqual(before);
  });

  it.each([{ background: [255, 255, 255, 255] }, { background: [0, 0, 0, 255] }])('extracts an opaque coin against uniform background $background', ({ background }) => {
    const profile = extractCoinProfile(image({ background, inside: ellipse }));

    expect(profile.source).toBe('background');
    expect(profile.mask[48 * 96 + 48]).toBe(1);
    expect(profile.mask[0]).toBe(0);
    expect(profile.bounds.minX).toBeGreaterThan(0);
    expect(profile.bounds.maxX).toBeLessThan(95);
  });

  it('keeps enclosed pale details in the solid face rather than cutting holes', () => {
    const profile = extractCoinProfile(image({
      background: [255, 255, 255, 255],
      inside: ellipse,
      color: (x, y) => Math.hypot(x - 47.5, y - 47.5) < 8
        ? [255, 255, 255, 255] : [137, 99, 54, 255],
    }));

    expect(profile).not.toBeNull();
    expect(profile.mask[48 * 96 + 48]).toBe(1);
    expect(profile.points).toHaveLength(64);
  });

  it('retains irregular rim contours and discards disconnected background specks', () => {
    const profile = extractCoinProfile(image({
      inside: (x, y) => irregular(x, y) || (x >= 5 && x <= 7 && y >= 5 && y <= 7),
    }));
    const radii = profile.points.map((point) => Math.hypot(point.x - profile.center.x, point.y - profile.center.y));

    expect(Math.max(...radii) - Math.min(...radii)).toBeGreaterThan(4);
    expect(profile.mask[6 * 96 + 6]).toBe(0);
    expect(profile.bounds.minX).toBeGreaterThan(7);
  });

  it('ignores thousands of disconnected scan specks using bounded component storage', () => {
    const profile = extractCoinProfile(image({
      width: 256,
      height: 256,
      inside: (x, y) => {
        const distance = Math.hypot(x - 127.5, y - 127.5);
        return distance < 60 || (distance > 90 && x > 16 && x < 240 && y > 16 && y < 240 && x % 3 === 0 && y % 3 === 0);
      },
    }));

    expect(profile).not.toBeNull();
    expect(profile.mask[128 * 256 + 128]).toBe(1);
    expect(profile.mask[21 * 256 + 21]).toBe(0);
    expect(profile.bounds.minX).toBeGreaterThan(60);
    expect(profile.bounds.maxX).toBeLessThan(195);
  });

  it('preserves physical pixel aspect ratio for non-square source images', () => {
    const profile = extractCoinProfile(image({
      width: 144,
      height: 96,
      inside: (x, y) => Math.hypot(x - 71.5, y - 47.5) < 29,
    }));
    const geometry = createCoinGeometry({ diameter: 0.06, thickness: 0.004, frontProfile: profile });
    const box = geometry.boundingBox;

    expect(box.max.x - box.min.x).toBeCloseTo(box.max.z - box.min.z, 5);
    geometry.dispose();
  });

  it('rejects blank, uniform, cropped, off-center, and complex-background images', () => {
    const invalid = [
      image(),
      image({ background: [255, 255, 255, 255] }),
      image({ inside: () => true }),
      image({ inside: (x, y) => Math.hypot(x - 47.5, y - 47.5) <= 50 }),
      image({ inside: (x, y) => Math.hypot(x - 19, y - 47.5) <= 15 }),
    ];
    const complex = image({ inside: ellipse, background: [255, 255, 255, 255] });
    for (let y = 0; y < 96; y += 1) {
      for (let x = 0; x < 96; x += 1) {
        if (!ellipse(x, y)) complex.data.set([x * 2, y * 2, 90, 255], (y * 96 + x) * 4);
      }
    }
    invalid.push(complex);

    invalid.forEach((source) => expect(extractCoinProfile(source)).toBeNull());
    expect(extractCoinProfile({ width: 96, height: 96, data: new Uint8ClampedArray(4) })).toBeNull();
    expect(extractCoinProfile(null)).toBeNull();
  });
});

describe('solid coin geometry', () => {
  it('deforms the cylinder to the actual ellipse while preserving diameter and thickness', () => {
    const profile = extractCoinProfile(image({ inside: ellipse }));
    const geometry = createCoinGeometry({ diameter: 0.08, thickness: 0.006, frontProfile: profile });
    const box = geometry.boundingBox;

    expect(box.max.x - box.min.x).toBeCloseTo(0.08, 7);
    expect(box.max.z - box.min.z).toBeLessThan(0.065);
    expect(box.max.y - box.min.y).toBeCloseTo(0.006, 7);
    expect(geometry.groups.map((group) => group.materialIndex)).toEqual([0, 1, 2]);
    expect(geometry.groups.reduce((total, group) => total + group.count, 0)).toBe(geometry.getAttribute('position').count);
    geometry.dispose();
  });

  it('creates the observed irregular perimeter without fabricated relief', () => {
    const profile = extractCoinProfile(image({ inside: irregular }));
    const geometry = createCoinGeometry({ diameter: 0.07, thickness: 0.005, frontProfile: profile });
    const position = geometry.getAttribute('position');
    const rimRadii = [];
    const heights = new Set();
    for (let index = 0; index < geometry.groups[0].count; index += 1) {
      rimRadii.push(Math.hypot(position.getX(index), position.getZ(index)));
      heights.add(position.getY(index));
    }

    expect(Math.max(...rimRadii) - Math.min(...rimRadii)).toBeGreaterThan(0.004);
    expect(heights.size).toBe(2);
    const box = geometry.boundingBox;
    expect(Math.max(box.max.x - box.min.x, box.max.z - box.min.z)).toBeCloseTo(0.07, 7);
    geometry.dispose();
  });

  it('winds both faces and the solid edge outward', () => {
    const geometry = createCoinGeometry({ diameter: 0.07, thickness: 0.005 });
    const position = geometry.getAttribute('position');
    const normal = geometry.getAttribute('normal');
    for (const group of geometry.groups) {
      for (let index = group.start; index < group.start + group.count; index += 1) {
        if (group.materialIndex === 0) {
          expect(normal.getX(index) * position.getX(index) + normal.getZ(index) * position.getZ(index)).toBeGreaterThan(0);
          expect(normal.getY(index)).toBeCloseTo(0);
        } else {
          expect(normal.getY(index)).toBeCloseTo(group.materialIndex === 1 ? 1 : -1);
        }
      }
    }
    // Winding itself must match normals, rather than only assigning a normal.
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();
    for (const group of geometry.groups.slice(1)) {
      a.fromBufferAttribute(position, group.start);
      b.fromBufferAttribute(position, group.start + 1);
      c.fromBufferAttribute(position, group.start + 2);
      expect(b.sub(a).cross(c.sub(a)).y * (group.materialIndex === 1 ? 1 : -1)).toBeGreaterThan(0);
    }
    geometry.dispose();
  });

  it('maps each cropped face independently and keeps reverse images readable from the back', () => {
    const profile = extractCoinProfile(image({ inside: ellipse }));
    const geometry = createCoinGeometry({ diameter: 0.08, thickness: 0.006, frontProfile: profile, backProfile: profile });
    const position = geometry.getAttribute('position');
    const uv = geometry.getAttribute('uv');
    for (const group of geometry.groups.slice(1)) {
      let rightmost = group.start;
      let imageTop = group.start;
      for (let index = group.start; index < group.start + group.count; index += 1) {
        if (position.getX(index) > position.getX(rightmost)) rightmost = index;
        if (position.getZ(index) < position.getZ(imageTop)) imageTop = index;
        expect(uv.getX(index)).toBeGreaterThanOrEqual(0);
        expect(uv.getX(index)).toBeLessThanOrEqual(1);
        expect(uv.getY(index)).toBeGreaterThanOrEqual(0);
        expect(uv.getY(index)).toBeLessThanOrEqual(1);
      }
      if (group.materialIndex === 1) expect(uv.getX(rightmost)).toBeGreaterThan(0.9);
      else expect(uv.getX(rightmost)).toBeLessThan(0.1);
      expect(uv.getY(imageTop)).toBeGreaterThan(0.9);
      expect(uv.getY(group.start)).toBeCloseTo(0.5, 2);
    }
    geometry.dispose();
  });

  it('uses a reverse silhouette when obverse segmentation is unavailable', () => {
    const profile = extractCoinProfile(image({ inside: ellipse }));
    const geometry = createCoinGeometry({ diameter: 0.08, thickness: 0.006, backProfile: profile });

    expect(geometry.boundingBox.max.x - geometry.boundingBox.min.x).toBeCloseTo(0.08, 7);
    expect(geometry.boundingBox.max.z - geometry.boundingBox.min.z).toBeLessThan(0.065);
    expect(geometry.getAttribute('normal').getY(geometry.groups[1].start)).toBeCloseTo(1);
    geometry.dispose();
  });

  it('falls back to bounded circular geometry for unusable metadata or profiles', () => {
    const geometry = createCoinGeometry({ diameter: NaN, thickness: Infinity, frontProfile: { points: [] } });
    const position = geometry.getAttribute('position');

    expect(Array.from(position.array).every(Number.isFinite)).toBe(true);
    expect(geometry.boundingBox.max.x - geometry.boundingBox.min.x).toBeCloseTo(0.06, 7);
    expect(geometry.boundingBox.max.x - geometry.boundingBox.min.x).toBeCloseTo(geometry.boundingBox.max.z - geometry.boundingBox.min.z, 7);
    geometry.dispose();
  });
});
