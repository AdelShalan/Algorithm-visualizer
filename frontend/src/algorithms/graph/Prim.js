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
  return { nodes, edges };
}

export function generateSteps(g, src) {
  const steps = [];
  const log = [];
  const inMST = new Set();
  const key = Array(g.nodes.length).fill(Infinity);
  const parent = Array(g.nodes.length).fill(null);
  key[src] = 0;
  log.push(`Prim's algorithm — start from node ${src}`);
  steps.push({ type: 'init', inMST: new Set(inMST), key: [...key], parent: [...parent], current: src, log: [...log] });
  while (inMST.size < g.nodes.length) {
    let u = -1, minKey = Infinity;
    for (let i = 0; i < g.nodes.length; i++) { if (!inMST.has(i) && key[i] < minKey) { minKey = key[i]; u = i; } }
    if (u === -1) break;
    inMST.add(u);
    log.push(`Add node ${u} to MST (key=${minKey === Infinity ? '∞' : minKey})`);
    steps.push({ type: 'add', node: u, inMST: new Set(inMST), key: [...key], parent: [...parent], log: [...log] });
    for (const edge of g.edges) {
      if (edge.from === u || edge.to === u) {
        const v = edge.from === u ? edge.to : edge.from;
        if (!inMST.has(v) && edge.weight < key[v]) { key[v] = edge.weight; parent[v] = u; log.push(`Update key[${v}] = ${edge.weight} via ${u}`); steps.push({ type: 'update', node: v, from: u, weight: edge.weight, inMST: new Set(inMST), key: [...key], parent: [...parent], log: [...log] }); }
      }
    }
  }
  const mstEdges = [];
  for (let i = 0; i < g.nodes.length; i++) { if (parent[i] !== null) mstEdges.push(g.edges.find(e => (e.from === parent[i] && e.to === i) || (e.from === i && e.to === parent[i]))); }
  log.push(`MST complete ✓ — ${mstEdges.length} edges, total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`);
  steps.push({ type: 'complete', mstEdges, log: [...log] });
  return steps;
}
