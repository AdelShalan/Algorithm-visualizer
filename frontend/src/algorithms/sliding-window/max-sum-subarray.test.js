import { describe, it, expect } from 'vitest';
import { generateSteps } from './max-sum-subarray.js';

describe('max-sum-subarray', () => {
  it('finds max sum for mixed array', () => {
    const steps = generateSteps([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('complete');
    expect(lastStep.maxSum).toBe(6);
  });

  it('produces steps with correct structure', () => {
    const steps = generateSteps([1, -2, 3]);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('array');
    expect(steps[0]).toHaveProperty('log');
  });

  it('handles all positive numbers', () => {
    const steps = generateSteps([1, 2, 3, 4]);
    expect(steps[steps.length - 1].maxSum).toBe(10);
  });

  it('handles all negative numbers', () => {
    const steps = generateSteps([-3, -1, -4, -2]);
    expect(steps[steps.length - 1].maxSum).toBe(-1);
  });

  it('handles single element', () => {
    const steps = generateSteps([5]);
    expect(steps[steps.length - 1].maxSum).toBe(5);
  });
});
