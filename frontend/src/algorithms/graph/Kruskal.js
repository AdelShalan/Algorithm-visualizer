const NODE_COUNT = 7;
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
      if (Math.random() < 0.45) edges.push({ from: i, to: j, weight: Math.floor(Math.random() * 20) + 1 });
    }
  }
  for (let i = 0; i < NODE_COUNT - 1; i++) {
    if (!edges.some(e => (e.from === i && e.to === i + 1))) edges.push({ from: i, to: i + 1, weight: Math.floor(Math.random() * 10) + 1 });
  }
  edges.sort((a, b) => a.weight - b.weight);
  return { nodes, edges };
}

export function generateSteps(g) {
  const steps = [];
  const log = [];
  const parent = Array(g.nodes.length).fill(0).map((_, i) => i);
  function find(i) { if (parent[i] !== i) parent[i] = find(parent[i]); return parent[i]; }
  function union(i, j) { parent[find(i)] = find(j); }
  const mst = [];
  const sortedEdges = [...g.edges].sort((a, b) => a.weight - b.weight);
  log.push(`Kruskal's algorithm — ${g.nodes.length} nodes, ${sortedEdges.length} edges`);
  steps.push({ type: 'init', mst: [...mst], parent: [...parent], log: [...log] });
  for (const edge of sortedEdges) {
    const rootU = find(edge.from); const rootV = find(edge.to);
    log.push(`Consider edge ${edge.from} ↔ ${edge.to} (w=${edge.weight}), roots: ${rootU}, ${rootV}`);
    steps.push({ type: 'consider', edge, mst: [...mst], parent: [...parent], log: [...log] });
    if (rootU !== rootV) { union(edge.from, edge.to); mst.push(edge); log.push(`Add edge ${edge.from} ↔ ${edge.to} to MST ✓`); steps.push({ type: 'add', edge, mst: [...mst], parent: [...parent], log: [...log] }); }
    else { log.push(`Skip edge ${edge.from} ↔ ${edge.to} — would create cycle ✗`); steps.push({ type: 'skip', edge, mst: [...mst], parent: [...parent], log: [...log] }); }
    if (mst.length === g.nodes.length - 1) break;
  }
  log.push(`MST complete ✓ — ${mst.length} edges, total weight: ${mst.reduce((sum, e) => sum + e.weight, 0)}`);
  steps.push({ type: 'complete', mst: [...mst], log: [...log] });
  return steps;
}
