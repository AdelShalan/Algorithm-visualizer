import { describe, it, expect } from 'vitest';
import { generateSteps } from './quick-sort.js';

describe('quick-sort', () => {
  it('sorts [3,1,2] correctly', () => {
    const steps = generateSteps([3, 1, 2]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3]);
    expect(lastStep.type).toBe('complete');
  });

  it('produces steps with correct structure', () => {
    const steps = generateSteps([3, 1, 2]);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('array');
    expect(steps[0]).toHaveProperty('log');
  });

  it('handles already sorted array', () => {
    const steps = generateSteps([1, 2, 3, 4]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4]);
  });

  it('handles larger unsorted array', () => {
    const steps = generateSteps([8, 3, 1, 7, 0, 10, 2]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([0, 1, 2, 3, 7, 8, 10]);
  });
});
