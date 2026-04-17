import { describe, it, expect } from 'vitest';
import { getHeatColor } from './utils';

describe('utils.js', () => {
  it('should return correct heat colors depending on density', () => {
    expect(getHeatColor(0.2).fill).toBe('var(--heat-low)');
    expect(getHeatColor(0.5).fill).toBe('var(--heat-medium)');
    expect(getHeatColor(0.9).fill).toBe('var(--heat-high)');
  });
});
