import { BufferGeometry, Float32BufferAttribute } from 'three';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const flood = (width, height, accepts, seeds) => {
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const visit = (index) => {
    if (index >= 0 && index < visited.length && !visited[index] && accepts(index)) {
      visited[index] = 1;
      queue[tail++] = index;
    }
  };
  seeds.forEach(visit);
  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    if (x) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (index >= width) visit(index - width);
    if (index < width * (height - 1)) visit(index + width);
  }
  return { visited, indices: queue.subarray(0, tail) };
};

const edgeIndices = (width, height) => {
  const edges = [];
  for (let x = 0; x < width; x += 1) edges.push(x, (height - 1) * width + x);
  for (let y = 1; y < height - 1; y += 1) edges.push(y * width, y * width + width - 1);
  return edges;
};

const median = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];

/**
 * Recover only the outside silhouette, never invented relief. Bounds are
 * inclusive integer pixel indices. Center and perimeter points use source
 * image pixel-center coordinates: the first pixel center is {x: 0, y: 0}.
 * `mask` has width*height entries and fills interior holes/highlights.
 * A null result means callers should retain the circular cylinder fallback.
 */
export function extractCoinProfile(imageData, segments = 64) {
  const { width, height, data } = imageData || {};
  if (!Number.isInteger(width) || !Number.isInteger(height)
    || width < 8 || height < 8 || width > 512 || height > 512
    || !data || data.length !== width * height * 4) return null;
  const count = width * height;
  const edges = edgeIndices(width, height);
  let transparent = 0;
  for (let index = 0; index < count; index += 1) {
    if (data[index * 4 + 3] < 32) transparent += 1;
  }
  let source;
  let background;
  if (transparent > count * 0.03 && edges.filter((i) => data[i * 4 + 3] < 32).length > edges.length * 0.8) {
    source = 'alpha';
    background = flood(width, height, (index) => data[index * 4 + 3] < 32, edges).visited;
  } else {
    // Only uniform corners justify separating an opaque photographic
    // background. A complex scene remains a circular image-textured coin.
    const patch = Math.max(2, Math.min(8, Math.floor(Math.min(width, height) * 0.06)));
    const samples = [];
    for (let dy = 0; dy < patch; dy += 1) {
      for (let dx = 0; dx < patch; dx += 1) {
        for (const [x, y] of [[dx, dy], [width - 1 - dx, dy], [dx, height - 1 - dy], [width - 1 - dx, height - 1 - dy]]) {
          samples.push((y * width + x) * 4);
        }
      }
    }
    const color = [0, 1, 2].map((channel) => median(samples.map((index) => data[index + channel])));
    const difference = (index) => Math.hypot(...color.map((value, channel) => data[index * 4 + channel] - value));
    const matching = samples.filter((index) => data[index + 3] >= 224 && difference(index / 4) < 28).length;
    if (matching < samples.length * 0.94) return null;
    source = 'background';
    background = flood(width, height, (index) => data[index * 4 + 3] < 32 || difference(index) < 46, edges).visited;
  }

  const candidates = new Uint8Array(count);
  for (let index = 0; index < count; index += 1) candidates[index] = background[index] ? 0 : 1;
  const checked = new Uint8Array(count);
  const queue = new Int32Array(count);
  let largestSeed = -1;
  let largestSize = 0;
  // Reuse fixed-size scratch storage across all components. A noisy scan may
  // contain thousands of isolated specks; each pixel is still visited once.
  for (let index = 0; index < count; index += 1) {
    if (!candidates[index] || checked[index]) continue;
    let head = 0;
    let tail = 1;
    queue[0] = index;
    checked[index] = 1;
    const visit = (next) => {
      if (candidates[next] && !checked[next]) {
        checked[next] = 1;
        queue[tail++] = next;
      }
    };
    while (head < tail) {
      const next = queue[head++];
      const x = next % width;
      if (x) visit(next - 1);
      if (x < width - 1) visit(next + 1);
      if (next >= width) visit(next - width);
      if (next < width * (height - 1)) visit(next + width);
    }
    if (tail > largestSize) { largestSeed = index; largestSize = tail; }
  }
  if (largestSeed < 0 || largestSize < count * 0.08 || largestSize > count * 0.9) return null;
  const componentMask = flood(width, height, (index) => !!candidates[index], [largestSeed]).visited;
  // Enclosed white portraits and alpha holes are part of the solid coin face.
  const outside = flood(width, height, (index) => !componentMask[index], edges).visited;
  const mask = Uint8Array.from(outside, (value) => value ? 0 : 1);
  const bounds = { minX: width, minY: height, maxX: -1, maxY: -1 };
  let area = 0;
  for (let index = 0; index < count; index += 1) {
    if (!mask[index]) continue;
    area += 1;
    const x = index % width;
    const y = Math.floor(index / width);
    bounds.minX = Math.min(bounds.minX, x);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxY = Math.max(bounds.maxY, y);
  }
  const cropWidth = bounds.maxX - bounds.minX + 1;
  const cropHeight = bounds.maxY - bounds.minY + 1;
  const center = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
  if (bounds.minX < 1 || bounds.minY < 1 || bounds.maxX > width - 2 || bounds.maxY > height - 2
    || cropWidth < 8 || cropHeight < 8 || area / (cropWidth * cropHeight) < 0.4
    || Math.abs(center.x - (width - 1) / 2) > width * 0.22
    || Math.abs(center.y - (height - 1) / 2) > height * 0.22
    || !mask[Math.round(center.y) * width + Math.round(center.x)]) return null;

  const segmentCount = Number.isFinite(segments) ? clamp(Math.round(segments), 16, 128) : 64;
  const points = [];
  const maxRadius = Math.hypot(cropWidth, cropHeight);
  for (let i = 0; i < segmentCount; i += 1) {
    const angle = i / segmentCount * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let radius = 0;
    for (let step = 0.5; step <= maxRadius; step += 0.5) {
      const x = Math.round(center.x + dx * step);
      const y = Math.round(center.y + dy * step);
      if (x < 0 || x >= width || y < 0 || y >= height || !mask[y * width + x]) break;
      radius = step;
    }
    if (radius < Math.min(cropWidth, cropHeight) * 0.15) return null;
    points.push({ x: center.x + dx * radius, y: center.y + dy * radius });
  }
  return { width, height, mask, bounds, center, points, source };
}

const validProfile = (profile) => {
  if (!profile?.bounds || !profile.center || !Array.isArray(profile.points)
    || profile.points.length < 16 || profile.points.length > 128) return false;
  const { minX, minY, maxX, maxY } = profile.bounds;
  return [minX, minY, maxX, maxY, profile.center.x, profile.center.y].every(Number.isFinite)
    && maxX > minX && maxY > minY && minX >= 0 && minY >= 0
    && maxX < profile.width && maxY < profile.height
    && profile.center.x >= minX && profile.center.x <= maxX
    && profile.center.y >= minY && profile.center.y <= maxY
    && profile.points.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y)
      && x >= minX - 0.5 && x <= maxX + 0.5 && y >= minY - 0.5 && y <= maxY + 0.5)
    && profileSpan(profile) >= 2;
};

const profileSpan = (profile) => Math.max(
  Math.max(...profile.points.map((point) => point.x)) - Math.min(...profile.points.map((point) => point.x)),
  Math.max(...profile.points.map((point) => point.y)) - Math.min(...profile.points.map((point) => point.y)),
);

/**
 * A solid, flat-faced mesh: side material 0, obverse +Y material 1, reverse
 * -Y material 2. Image y follows world +Z. UVs refer to each profile's cropped
 * image and reverse x is reflected so its image reads correctly from below.
 */
export function createCoinGeometry({ diameter = 0.06, thickness = 0.004, frontProfile = null, backProfile = null } = {}) {
  const size = Number.isFinite(diameter) && diameter > 0 ? clamp(diameter, 0.000001, 1) : 0.06;
  const depth = Number.isFinite(thickness) && thickness > 0 ? clamp(thickness, size * 0.0001, size * 0.5) : size * 0.07;
  const front = validProfile(frontProfile) ? frontProfile : null;
  const back = validProfile(backProfile) ? backProfile : null;
  const frontSpan = front ? profileSpan(front) : size;
  const backSpan = back ? profileSpan(back) : size;
  const outline = front || back;
  const segmentCount = outline?.points.length || 64;
  const scale = outline ? size / profileSpan(outline) : 1;
  let perimeter = outline
    ? outline.points.map((point) => ({ x: (point.x - outline.center.x) * scale, z: (point.y - outline.center.y) * scale }))
    : Array.from({ length: segmentCount }, (_, i) => ({ x: Math.cos(i / segmentCount * Math.PI * 2) * size / 2, z: Math.sin(i / segmentCount * Math.PI * 2) * size / 2 }));
  if (!front && back) perimeter = perimeter.map((point) => ({ x: -point.x, z: point.z })).reverse();
  const positions = [];
  const uvs = [];
  const add = (point, y, uv) => {
    positions.push(point.x, y, point.z);
    uvs.push(...uv);
  };
  const halfDepth = depth / 2;
  for (let i = 0; i < segmentCount; i += 1) {
    const next = (i + 1) % segmentCount;
    const a = perimeter[i];
    const b = perimeter[next];
    const u = i / segmentCount;
    const v = (i + 1) / segmentCount;
    add(a, halfDepth, [u, 1]); add(b, halfDepth, [v, 1]); add(a, -halfDepth, [u, 0]);
    add(b, halfDepth, [v, 1]); add(b, -halfDepth, [v, 0]); add(a, -halfDepth, [u, 0]);
  }
  const uvFor = (point, profile, reverse) => {
    const imageX = reverse ? -point.x : point.x;
    if (!profile) return [clamp(0.5 + imageX / size, 0, 1), clamp(0.5 - point.z / size, 0, 1)];
    const imageScale = (reverse ? backSpan : frontSpan) / size;
    const px = profile.center.x + imageX * imageScale;
    const py = profile.center.y + point.z * imageScale;
    return [
      clamp((px - profile.bounds.minX + 0.5) / (profile.bounds.maxX - profile.bounds.minX + 1), 0, 1),
      clamp(1 - (py - profile.bounds.minY + 0.5) / (profile.bounds.maxY - profile.bounds.minY + 1), 0, 1),
    ];
  };
  const center = { x: 0, z: 0 };
  for (const reverse of [false, true]) {
    const profile = reverse ? back : front;
    const y = reverse ? -halfDepth : halfDepth;
    for (let i = 0; i < segmentCount; i += 1) {
      const a = perimeter[i];
      const b = perimeter[(i + 1) % segmentCount];
      const triangle = reverse ? [center, a, b] : [center, b, a];
      triangle.forEach((point) => add(point, y, uvFor(point, profile, reverse)));
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.addGroup(0, segmentCount * 6, 0);
  geometry.addGroup(segmentCount * 6, segmentCount * 3, 1);
  geometry.addGroup(segmentCount * 9, segmentCount * 3, 2);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
