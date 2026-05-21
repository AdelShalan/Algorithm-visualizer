import { describe, it, expect } from 'vitest';
import { generateSteps } from '../graph/Dijkstra.js';

describe('dijkstra', () => {
  it('computes shortest paths from source', () => {
    const graph = {
      nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
      edges: [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 2, weight: 1 },
        { from: 1, to: 2, weight: 2 },
      ],
    };
    const steps = generateSteps(graph, 0);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('complete');
    expect(lastStep.dist[0]).toBe(0);
    expect(lastStep.dist[2]).toBe(1);
    expect(lastStep.dist[1]).toBe(3);
  });

  it('produces steps with correct structure', () => {
    const graph = {
      nodes: [{ id: 0 }, { id: 1 }],
      edges: [{ from: 0, to: 1, weight: 5 }],
    };
    const steps = generateSteps(graph, 0);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('type');
    expect(steps[0]).toHaveProperty('dist');
    expect(steps[0]).toHaveProperty('log');
  });

  it('handles disconnected nodes', () => {
    const graph = {
      nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
      edges: [{ from: 0, to: 1, weight: 3 }],
    };
    const steps = generateSteps(graph, 0);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.dist[0]).toBe(0);
    expect(lastStep.dist[1]).toBe(3);
    expect(lastStep.dist[2]).toBe(Infinity);
  });
});
