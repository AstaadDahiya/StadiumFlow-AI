import { describe, it, expect } from 'vitest';
import { getHeatColor, updateTime } from './utils';

describe('utils.js', () => {
  describe('getHeatColor', () => {
    // Core path tests
    it('should return low heat for density < 0.4', () => {
      const result = getHeatColor(0.2);
      expect(result.fill).toBe('var(--heat-low)');
      expect(result.status).toBe('Low');
    });

    it('should return medium heat for density between 0.4 and 0.7', () => {
      const result = getHeatColor(0.5);
      expect(result.fill).toBe('var(--heat-medium)');
      expect(result.status).toBe('Medium');
    });

    it('should return high heat for density >= 0.7', () => {
      const result = getHeatColor(0.9);
      expect(result.fill).toBe('var(--heat-high)');
      expect(result.status).toBe('High');
    });

    // Edge case: exact boundary values
    it('should return low heat at density 0', () => {
      const result = getHeatColor(0);
      expect(result.fill).toBe('var(--heat-low)');
      expect(result.status).toBe('Low');
    });

    it('should return low heat at density 0.39 (just below medium)', () => {
      expect(getHeatColor(0.39).status).toBe('Low');
    });

    it('should return medium heat at exact boundary 0.4', () => {
      expect(getHeatColor(0.4).status).toBe('Medium');
    });

    it('should return medium heat at density 0.69 (just below high)', () => {
      expect(getHeatColor(0.69).status).toBe('Medium');
    });

    it('should return high heat at exact boundary 0.7', () => {
      expect(getHeatColor(0.7).status).toBe('High');
    });

    it('should return high heat at maximum density 1.0', () => {
      expect(getHeatColor(1.0).status).toBe('High');
    });

    // Edge case: negative and overflow values
    it('should handle negative density gracefully', () => {
      const result = getHeatColor(-0.5);
      expect(result.fill).toBe('var(--heat-low)');
    });

    it('should handle density greater than 1', () => {
      const result = getHeatColor(1.5);
      expect(result.fill).toBe('var(--heat-high)');
    });

    // Return shape validation
    it('should always return an object with fill and status properties', () => {
      const result = getHeatColor(0.5);
      expect(result).toHaveProperty('fill');
      expect(result).toHaveProperty('status');
      expect(typeof result.fill).toBe('string');
      expect(typeof result.status).toBe('string');
    });
  });

  describe('updateTime', () => {
    it('should not throw when status-time element is missing', () => {
      expect(() => updateTime()).not.toThrow();
    });

    it('should update the time element when it exists', () => {
      const el = document.createElement('span');
      el.id = 'status-time';
      document.body.appendChild(el);

      updateTime();

      expect(el.textContent).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
      document.body.removeChild(el);
    });

    it('should display 12-hour format with AM/PM', () => {
      const el = document.createElement('span');
      el.id = 'status-time';
      document.body.appendChild(el);

      updateTime();

      const text = el.textContent;
      const match = text.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);
      expect(match).not.toBeNull();

      const hours = parseInt(match[1]);
      expect(hours).toBeGreaterThanOrEqual(1);
      expect(hours).toBeLessThanOrEqual(12);

      document.body.removeChild(el);
    });
  });
});
