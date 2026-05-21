import { describe, it, expect } from 'vitest';
import { generateSteps } from './fibonacci.js';

describe('fibonacci', () => {
  it('computes fib(5) = 5', () => {
    const steps = generateSteps(5);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('complete');
    expect(lastStep.result).toBe(5);
  });

  it('produces steps with correct structure', () => {
    const steps = generateSteps(5);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('memo');
    expect(steps[0]).toHaveProperty('log');
  });

  it('handles base cases', () => {
    const steps0 = generateSteps(0);
    expect(steps0[steps0.length - 1].result).toBe(0);
    const steps1 = generateSteps(1);
    expect(steps1[steps1.length - 1].result).toBe(1);
  });

  it('computes fib(10) = 55', () => {
    const steps = generateSteps(10);
    expect(steps[steps.length - 1].result).toBe(55);
  });
});
