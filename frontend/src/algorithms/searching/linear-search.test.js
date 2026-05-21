import { describe, it, expect } from 'vitest';
import { generateSteps } from './LinearSearch.js';

describe('linear-search', () => {
  it('finds target in array', () => {
    const steps = generateSteps([5, 3, 8, 1, 9], 8);
    const foundStep = steps.find(s => s.type === 'found');
    expect(foundStep).toBeDefined();
    expect(foundStep.index).toBe(2);
  });

  it('produces steps with correct structure', () => {
    const steps = generateSteps([5, 3, 8, 1, 9], 8);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('array');
    expect(steps[0]).toHaveProperty('log');
  });

  it('returns not-found for missing target', () => {
    const steps = generateSteps([5, 3, 8, 1, 9], 7);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('not-found');
  });

  it('finds first element immediately', () => {
    const steps = generateSteps([10, 20, 30], 10);
    const foundStep = steps.find(s => s.type === 'found');
    expect(foundStep.index).toBe(0);
    expect(steps.length).toBe(2);
  });
});
