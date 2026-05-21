const SIZE = 5;

export function generateMatrix() {
  const matrix = [];
  for (let i = 0; i < SIZE; i++) {
    matrix[i] = [];
    for (let j = 0; j < SIZE; j++) {
      if (i === j) matrix[i][j] = 0;
      else if (Math.random() < 0.6) matrix[i][j] = Math.floor(Math.random() * 15) + 1;
      else matrix[i][j] = Infinity;
    }
  }
  return matrix;
}

export function generateSteps(m) {
  const steps = [];
  const log = [];
  const dist = m.map(row => [...row]);
  log.push('Initialize distance matrix');
  steps.push({ type: 'init', dist: dist.map(r => [...r]), log: [...log] });
  for (let k = 0; k < SIZE; k++) {
    log.push(`Intermediate vertex k = ${k}`);
    steps.push({ type: 'k-iteration', k, dist: dist.map(r => [...r]), log: [...log] });
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          const throughK = dist[i][k] + dist[k][j];
          if (throughK < dist[i][j]) {
            log.push(`d[${i}][${j}] = d[${i}][${k}] + d[${k}][${j}] = ${throughK} < ${dist[i][j] === Infinity ? '∞' : dist[i][j]} → update`);
            dist[i][j] = throughK;
            steps.push({ type: 'update', i, j, k, dist: dist.map(r => [...r]), log: [...log] });
          } else {
            log.push(`d[${i}][${j}] via k=${k}: ${throughK} ≥ ${dist[i][j] === Infinity ? '∞' : dist[i][j]} → no change`);
            steps.push({ type: 'check', i, j, k, viaK: throughK, current: dist[i][j], dist: dist.map(r => [...r]), log: [...log] });
          }
        }
      }
    }
  }
  log.push('Floyd-Warshall complete ✓');
  steps.push({ type: 'complete', dist: dist.map(r => [...r]), log: [...log] });
  return steps;
}
