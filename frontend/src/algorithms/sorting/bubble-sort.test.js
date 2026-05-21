import { describe, it, expect } from 'vitest';
import { generateSteps } from './bubble-sort.js';

describe('bubble-sort', () => {
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
    const steps = generateSteps([1, 2, 3]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3]);
  });

  it('handles single element', () => {
    const steps = generateSteps([42]);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('handles duplicate elements', () => {
    const steps = generateSteps([3, 1, 2, 1, 3]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 1, 2, 3, 3]);
  });
});
