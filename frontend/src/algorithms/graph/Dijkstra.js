const NODE_COUNT = 8;
const CANVAS_SIZE = 400;

export function generateWeightedGraph() {
  const nodes = []; const edges = []; const positions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (2 * Math.PI * i) / NODE_COUNT;
    const radius = 120 + Math.random() * 27;
    positions.push({ x: CANVAS_SIZE / 2 + Math.cos(angle) * radius, y: CANVAS_SIZE / 2 + Math.sin(angle) * radius });
  }
  for (let i = 0; i < NODE_COUNT; i++) nodes.push({ id: i, x: positions[i].x, y: positions[i].y });
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (Math.random() < 0.4) edges.push({ from: i, to: j, weight: Math.floor(Math.random() * 15) + 1 });
    }
  }
  if (edges.length < NODE_COUNT - 1) {
    for (let i = 0; i < NODE_COUNT - 1; i++) {
      if (!edges.some(e => (e.from === i && e.to === i + 1) || (e.from === i + 1 && e.to === i))) {
        edges.push({ from: i, to: i + 1, weight: Math.floor(Math.random() * 10) + 1 });
      }
    }
  }
  return { nodes, edges };
}

export function generateSteps(g, src) {
  const steps = [];
  const dist = Array(g.nodes.length).fill(Infinity);
  const prev = Array(g.nodes.length).fill(null);
  const visited = new Set();
  const log = [];
  dist[src] = 0;
  log.push(`Initialize: dist[${src}] = 0, all others = ∞`);
  steps.push({ type: 'init', dist: [...dist], prev: [...prev], visited: new Set(visited), current: src, log: [...log] });
  while (visited.size < g.nodes.length) {
    let u = -1, minDist = Infinity;
    for (let i = 0; i < g.nodes.length; i++) {
      if (!visited.has(i) && dist[i] < minDist) { minDist = dist[i]; u = i; }
    }
    if (u === -1) break;
    visited.add(u);
    log.push(`Select node ${u} (min dist = ${dist[u]})`);
    steps.push({ type: 'visit', dist: [...dist], prev: [...prev], visited: new Set(visited), current: u, log: [...log] });
    const neighbors = g.edges.filter(e => e.from === u || e.to === u);
    for (const edge of neighbors) {
      const v = edge.from === u ? edge.to : edge.from;
      if (!visited.has(v)) {
        const alt = dist[u] + edge.weight;
        log.push(`Relax edge ${u} → ${v}: ${dist[u]} + ${edge.weight} = ${alt} vs ${dist[v] === Infinity ? '∞' : dist[v]}`);
        steps.push({ type: 'relax', from: u, to: v, weight: edge.weight, newDist: alt, oldDist: dist[v], dist: [...dist], prev: [...prev], visited: new Set(visited), current: u, log: [...log] });
        if (alt < dist[v]) { dist[v] = alt; prev[v] = u; log.push(`Updated dist[${v}] = ${alt}`); steps.push({ type: 'update', dist: [...dist], prev: [...prev], visited: new Set(visited), current: u, updated: v, log: [...log] }); }
      }
    }
  }
  log.push(`Dijkstra complete ✓`);
  steps.push({ type: 'complete', dist: [...dist], prev: [...prev], visited: new Set(visited), log: [...log] });
  return steps;
}
