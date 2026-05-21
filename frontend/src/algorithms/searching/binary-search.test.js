import { describe, it, expect } from 'vitest';
import { generateSteps } from './BinarySearch.js';

describe('binary-search', () => {
  it('finds target in sorted array', () => {
    const steps = generateSteps([1, 3, 5, 7, 9], 5);
    const foundStep = steps.find(s => s.type === 'found');
    expect(foundStep).toBeDefined();
    expect(foundStep.index).toBe(2);
  });

  it('produces steps with correct structure', () => {
    const steps = generateSteps([1, 3, 5, 7, 9], 5);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('array');
    expect(steps[0]).toHaveProperty('log');
  });

  it('returns not-found for missing target', () => {
    const steps = generateSteps([1, 3, 5, 7, 9], 4);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('not-found');
  });

  it('finds first element', () => {
    const steps = generateSteps([2, 4, 6, 8], 2);
    const foundStep = steps.find(s => s.type === 'found');
    expect(foundStep.index).toBe(0);
  });

  it('finds last element', () => {
    const steps = generateSteps([2, 4, 6, 8], 8);
    const foundStep = steps.find(s => s.type === 'found');
    expect(foundStep.index).toBe(3);
  });
});
