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

function heuristic(nodes, a, b) {
  const na = nodes[a], nb = nodes[b];
  return Math.sqrt((na.x - nb.x) ** 2 + (na.y - nb.y) ** 2);
}

export function generateSteps(g, src, tgt) {
  const steps = [];
  const log = [];
  const openSet = [{ row: src, col: src, g: 0, h: heuristic(g.nodes, src, tgt), f: heuristic(g.nodes, src, tgt) }];
  const cameFrom = {};
  const gScore = {};
  gScore[src] = 0;
  const closedSet = new Set();
  log.push(`A* starting from ${src} → ${tgt}`);
  steps.push({ type: 'init', openSet: [...openSet], closedSet: new Set(closedSet), path: [], log: [...log] });
  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const key = current.row;
    closedSet.add(key);
    log.push(`Visit node ${key} (g=${current.g.toFixed(0)}, h=${current.h.toFixed(0)}, f=${current.f.toFixed(0)})`);
    steps.push({ type: 'visit', current, openSet: [...openSet], closedSet: new Set(closedSet), path: [], log: [...log] });
    if (current.row === tgt) {
      const path = []; let curr = key;
      while (curr !== undefined) { path.unshift(curr); curr = cameFrom[curr]; }
      log.push(`Path found: ${path.join(' → ')} ✓`);
      steps.push({ type: 'found', path, closedSet: new Set(closedSet), log: [...log] });
      return steps;
    }
    const neighbors = g.edges.filter(e => e.from === current.row || e.to === current.row).map(e => e.from === current.row ? e.to : e.from);
    for (const neighbor of neighbors) {
      const nKey = neighbor;
      if (!closedSet.has(nKey)) {
        const tentativeG = gScore[key] + heuristic(g.nodes, current.row, neighbor);
        if (tentativeG < (gScore[nKey] ?? Infinity)) {
          cameFrom[nKey] = key; gScore[nKey] = tentativeG;
          const h = heuristic(g.nodes, neighbor, tgt); const f = tentativeG + h;
          const existing = openSet.find(n => n.row === neighbor);
          if (!existing) openSet.push({ row: neighbor, col: neighbor, g: tentativeG, h, f });
          log.push(`Explore ${key} → ${neighbor} (g=${tentativeG.toFixed(0)})`);
          steps.push({ type: 'explore', from: { row: current.row, col: current.row }, to: { row: neighbor, col: neighbor }, openSet: [...openSet], closedSet: new Set(closedSet), path: [], log: [...log] });
        }
      }
    }
  }
  log.push(`No path found`);
  steps.push({ type: 'not-found', closedSet: new Set(closedSet), log: [...log] });
  return steps;
}
