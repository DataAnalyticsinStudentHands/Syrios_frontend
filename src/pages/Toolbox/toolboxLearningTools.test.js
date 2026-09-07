import { describe, expect, it } from 'vitest';
import { TOOLBOX_LEARNING_TOOLS } from './toolboxLearningTools';

describe('Toolbox learning tools', () => {
  it('links the three HIST 2303 activities in their intended progression', () => {
    expect(TOOLBOX_LEARNING_TOOLS.map((tool) => tool.path)).toEqual([
      '/Toolbox/CoinDetective',
      '/Toolbox/CoinCurator',
      '/Toolbox/ArchiveLab',
    ]);
    expect(TOOLBOX_LEARNING_TOOLS.map((tool) => tool.step)).toEqual(['01', '02', '03']);
  });

  it('provides complete, unique overview-card content', () => {
    expect(new Set(TOOLBOX_LEARNING_TOOLS.map((tool) => tool.id)).size).toBe(3);
    TOOLBOX_LEARNING_TOOLS.forEach((tool) => {
      expect(tool.title).toBeTruthy();
      expect(tool.phase).toBeTruthy();
      expect(tool.description.length).toBeGreaterThan(40);
      expect(tool.cta).toBeTruthy();
      expect(tool.highlights).toHaveLength(2);
    });
  });
});
