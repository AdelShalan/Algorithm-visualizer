import { describe, it, expect } from 'vitest';
import { generateSteps } from './n-queens.js';

describe('n-queens', () => {
  it('finds a solution for n=4', () => {
    const steps = [...generateSteps(4)];
    const solutionStep = steps.find(s => s.type === 'solution');
    expect(solutionStep).toBeDefined();
    expect(solutionStep.board.length).toBe(4);
  });

  it('produces steps with correct structure', () => {
    const steps = [...generateSteps(4)];
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('board');
    expect(steps[0]).toHaveProperty('log');
  });

  it('finds a solution for n=8', () => {
    const steps = [...generateSteps(8)];
    const solutionStep = steps.find(s => s.type === 'solution');
    expect(solutionStep).toBeDefined();
    expect(solutionStep.board.length).toBe(8);
  });

  it('completes with done step', () => {
    const steps = [...generateSteps(4)];
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('done');
  });
});
