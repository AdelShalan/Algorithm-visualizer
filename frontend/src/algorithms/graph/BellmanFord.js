const NODE_COUNT = 6;
const CANVAS_SIZE = 400;

export function generateWeightedGraph() {
  const nodes = []; const edges = []; const positions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (2 * Math.PI * i) / NODE_COUNT;
    positions.push({ x: CANVAS_SIZE / 2 + Math.cos(angle) * 120, y: CANVAS_SIZE / 2 + Math.sin(angle) * 120 });
  }
  for (let i = 0; i < NODE_COUNT; i++) nodes.push({ id: i, x: positions[i].x, y: positions[i].y });
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (Math.random() < 0.5) edges.push({ from: i, to: j, weight: Math.floor(Math.random() * 10) - 3 });
    }
  }
  for (let i = 0; i < NODE_COUNT - 1; i++) {
    if (!edges.some(e => (e.from === i && e.to === i + 1))) edges.push({ from: i, to: i + 1, weight: Math.floor(Math.random() * 8) + 1 });
  }
  return { nodes, edges };
}

export function generateSteps(g, src) {
  const steps = [];
  const dist = Array(g.nodes.length).fill(Infinity);
  dist[src] = 0;
  const log = [];
  log.push(`Initialize: dist[${src}] = 0, all others = ∞`);
  steps.push({ type: 'init', dist: [...dist], log: [...log] });
  for (let i = 0; i < g.nodes.length - 1; i++) {
    log.push(`Iteration ${i + 1} / ${g.nodes.length - 1} — relaxing all edges`);
    steps.push({ type: 'iteration', iteration: i + 1, dist: [...dist], log: [...log] });
    for (const edge of g.edges) {
      const { from, to, weight } = edge;
      if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
        log.push(`Relax edge ${from} → ${to}: ${dist[from]} + (${weight}) = ${dist[from] + weight} < ${dist[to] === Infinity ? '∞' : dist[to]}`);
        steps.push({ type: 'relax', from, to, weight, newDist: dist[from] + weight, dist: [...dist], log: [...log] });
        dist[to] = dist[from] + weight;
        log.push(`Updated dist[${to}] = ${dist[to]}`);
        steps.push({ type: 'update', dist: [...dist], updated: to, log: [...log] });
      }
    }
  }
  for (const edge of g.edges) {
    if (dist[edge.from] !== Infinity && dist[edge.from] + edge.weight < dist[edge.to]) {
      log.push(`Negative cycle detected on edge ${edge.from} → ${edge.to}`);
      steps.push({ type: 'negative-cycle', from: edge.from, to: edge.to, dist: [...dist], log: [...log] });
      return steps;
    }
  }
  log.push(`Bellman-Ford complete ✓`);
  steps.push({ type: 'complete', dist: [...dist], log: [...log] });
  return steps;
}
