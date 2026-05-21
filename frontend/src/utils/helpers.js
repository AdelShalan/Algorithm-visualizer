import { useCallback } from 'react';
import { useAlgorithm } from '../contexts/AlgorithmContext';

export function useVisualization() {
  const { startAnimation } = useAlgorithm();

  const createSortingSteps = useCallback((array, sortFn) => {
    const steps = [];
    const arr = [...array];
    sortFn(arr, steps);
    return steps;
  }, [startAnimation]);

  return { createSortingSteps, startAnimation };
}

export function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateRandomArray(size = 30, min = 5, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function generateGraph(nodes = 8, edgeProbability = 0.3) {
  const graph = [];
  for (let i = 0; i < nodes; i++) {
    graph[i] = [];
    for (let j = i + 1; j < nodes; j++) {
      if (Math.random() < edgeProbability) {
        const weight = Math.floor(Math.random() * 20) + 1;
        graph[i].push({ to: j, weight });
        graph[j].push({ to: i, weight });
      }
    }
  }
  return graph;
}

export function generateGrid(rows = 8, cols = 8) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = { row: r, col: c, weight: Math.floor(Math.random() * 9) + 1, isWall: false };
    }
  }
  return grid;
}
