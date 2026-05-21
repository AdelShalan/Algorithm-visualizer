import { describe, it, expect } from 'vitest';
import { generateSteps } from './kmp.js';

describe('kmp', () => {
  it('finds pattern in text', () => {
    const steps = generateSteps('ABABDABACDABABCABAB', 'ABABCABAB');
    const matchStep = steps.find(s => s.type === 'match');
    expect(matchStep).toBeDefined();
    expect(matchStep.textIdx).toBe(10);
  });

  it('produces steps with correct structure', () => {
    const steps = generateSteps('ABC', 'AB');
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('log');
  });

  it('returns no match for missing pattern', () => {
    const steps = generateSteps('ABCDE', 'XYZ');
    const matchStep = steps.find(s => s.type === 'match');
    expect(matchStep).toBeUndefined();
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('done');
  });

  it('finds pattern at start of text', () => {
    const steps = generateSteps('ABCDEF', 'ABC');
    const matchStep = steps.find(s => s.type === 'match');
    expect(matchStep.textIdx).toBe(0);
  });
});
