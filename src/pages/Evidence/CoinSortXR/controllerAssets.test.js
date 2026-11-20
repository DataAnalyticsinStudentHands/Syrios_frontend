import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const assets = fileURLToPath(new URL('../../../../public/xr/controllers/', import.meta.url));
const profiles = JSON.parse(readFileSync(`${assets}/profilesList.json`, 'utf8'));

describe('locally bundled Quest controller assets', () => {
  it.each(Object.keys(profiles))('%s has working left/right meshes and the expected face-button indices', (id) => {
    const profile = JSON.parse(readFileSync(`${assets}/${profiles[id].path}`, 'utf8'));
    expect(profile.profileId).toBe(id);
    for (const hand of ['left', 'right']) {
      const layout = profile.layouts[hand];
      expect(layout.assetPath).toBe(`${hand}.glb`);
      const binary = readFileSync(`${assets}/${id}/${layout.assetPath}`);
      expect(binary.toString('ascii', 0, 4)).toBe('glTF');
      expect(binary.readUInt32LE(4)).toBe(2);
      expect(binary.readUInt32LE(8)).toBe(binary.length);
      const json = JSON.parse(binary.toString('utf8', 20, 20 + binary.readUInt32LE(12)));
      expect(json.meshes.length).toBeGreaterThan(0);
      expect(json.buffers.every((buffer) => !buffer.uri)).toBe(true);
    }
    expect(profile.layouts.right.components['a-button'].gamepadIndices.button).toBe(4);
    expect(profile.layouts.right.components['b-button'].gamepadIndices.button).toBe(5);
  });
});
