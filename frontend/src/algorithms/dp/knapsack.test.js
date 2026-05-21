import { describe, it, expect } from 'vitest';
import { generateSteps } from './knapsack.js';

describe('knapsack', () => {
  it('computes correct max value for simple case', () => {
    const items = [
      { weight: 1, value: 10 },
      { weight: 3, value: 40 },
      { weight: 4, value: 50 },
      { weight: 5, value: 70 },
    ];
    const steps = generateSteps(items, 7);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('complete');
    expect(lastStep.result).toBe(90);
  });

  it('produces steps with correct structure', () => {
    const items = [{ weight: 2, value: 5 }];
    const steps = generateSteps(items, 3);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('dp');
    expect(steps[0]).toHaveProperty('log');
  });

  it('handles empty capacity', () => {
    const items = [{ weight: 2, value: 10 }];
    const steps = generateSteps(items, 0);
    expect(steps[steps.length - 1].result).toBe(0);
  });

  it('handles single item that fits', () => {
    const items = [{ weight: 3, value: 25 }];
    const steps = generateSteps(items, 5);
    expect(steps[steps.length - 1].result).toBe(25);
  });
});
